import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";
import type { Auto } from "../types";

// 👇 SOLO PARA VER QUÉ ARCHIVO ESTÁS USANDO (borrálo después)
// @ts-ignore
console.log("USING autosService:", __filename);

// ====== ENV ======
const URL_CSV = process.env.NEXT_PUBLIC_CSV_URL || "";
const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET!;
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Debug de entorno (temporal; podés borrarlo luego)
console.log("ENV CHECK:", {
  url: URL,
  anonLen: KEY?.length,
  anonLooksJWT: typeof KEY === "string" && KEY.split(".").length === 3,
  bucket: BUCKET,
});

// Cliente Supabase
const supabase = createClient(URL, KEY);

// Lee la carpeta desde distintos headers (incluye tu typo) y limpia prefijos viejos
function getCarpetaDesdeCSV(row: any): string {
  const posible =
    row?.fotos ??
    row?.Fotos ??
    row?.CarpetaFirebase ??
    row?.CarpetaFirebas ?? // 👈 tu header actual con typo
    row?.carpeta ??
    row?.folder ??
    row?.imagesFolder ??
    "";

  // limpia "autos/" si vino del esquema anterior y barras al inicio/fin
  return String(posible || "")
    .trim()
    .replace(/^autos\//i, "")
    .replace(/^\/+|\/+$/g, "");
}

// Lista imágenes en Supabase (con debug y tolerancia a variantes de path)
export const fetchImagenesAuto = async (carpetaIn: string): Promise<string[]> => {
  const c1 = String(carpetaIn || "").trim();
  const c2 = c1.replace(/^autos\//i, "");
  const c3 = c2.replace(/^\/+|\/+$/g, "");
  const candidates = Array.from(new Set([c1, c2, c3]));

  console.log("🔎 STORAGE DEBUG candidates:", candidates);

  for (const path of candidates) {
    if (!path) continue;

    // intento 1: tal cual
    let { data, error } = await supabase.storage.from(BUCKET).list(path, { limit: 100 });
    console.log("🗂️ LIST TRY:", {
      bucket: BUCKET,
      path,
      count: data?.length ?? 0,
      error: error?.message,
    });

    if (!error && data && data.length > 0) {
      const urls = data
        .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f.name))
        .map(
          (f) =>
            supabase.storage.from(BUCKET).getPublicUrl(`${path}/${f.name}`).data.publicUrl
        );

      console.log("✅ LIST OK:", { path, files: data.map((d) => d.name) });
      console.log("📸 URLS:", urls);
      return urls;
    }

    // intento 2: con trailing slash
    const alt = `${path}/`.replace(/\/+$/, "/");
    if (alt !== path) {
      const res2 = await supabase.storage.from(BUCKET).list(alt, { limit: 100 });
      console.log("🗂️ LIST TRY (alt):", {
        bucket: BUCKET,
        path: alt,
        count: res2.data?.length ?? 0,
        error: res2.error?.message,
      });

      if (!res2.error && res2.data && res2.data.length > 0) {
        const urls = res2.data
          .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f.name))
          .map(
            (f) =>
              supabase.storage.from(BUCKET).getPublicUrl(`${alt}${f.name}`).data.publicUrl
          );

        console.log("✅ LIST OK (alt):", { path: alt, files: res2.data.map((d) => d.name) });
        console.log("📸 URLS:", urls);
        return urls;
      }
    }
  }

  console.warn("⚠️ No se encontraron imágenes en ningún candidato para:", carpetaIn);
  return [];
};

// Trae autos del CSV y suma imágenes desde Supabase
export const fetchAutos = async (): Promise<Auto[]> => {
  if (!URL_CSV) {
    throw new Error("URL_CSV no está definida");
  }

  const res = await fetch(URL_CSV);
  const csvText = await res.text();

  return new Promise<Auto[]>((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: async (result: any) => {
        try {
          const autosConImagenes = await Promise.all(
            result.data.map(async (row: any) => {
              if (!row?.Marca?.trim() || !row?.Modelo?.trim()) return null;

              const carpeta = getCarpetaDesdeCSV(row);
              const imagenes = carpeta ? await fetchImagenesAuto(carpeta) : [];

              const auto: Auto = { ...row, imagenes, fotos: carpeta };
              return auto;
            })
          );

          resolve(autosConImagenes.filter(Boolean) as Auto[]);
        } catch (error) {
          reject(error);
        }
      },
      error: (err: any) => {
        console.error("Error al parsear CSV:", err);
        reject(err);
      },
    });
  });
};
