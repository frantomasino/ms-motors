// services/autosService.ts
import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";
import type { Auto } from "../types";

// ====== ENV ======
const URL_CSV = process.env.NEXT_PUBLIC_CSV_URL || "";
const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET!;
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(URL, KEY);

// Lee la carpeta desde distintos headers (incluye tu typo) y limpia prefijos viejos
function getCarpetaDesdeCSV(row: any): string {
  const posible =
    row?.fotos ??
    row?.Fotos ??
    row?.CarpetaFirebase ??
    row?.CarpetaFirebas ?? // typo tolerado
    row?.carpeta ??
    row?.folder ??
    row?.imagesFolder ??
    "";

  return String(posible || "")
    .trim()
    .replace(/^autos\//i, "")
    .replace(/^\/+|\/+$/g, "");
}

// Lista imágenes en Supabase (sin logs)
export const fetchImagenesAuto = async (carpetaIn: string): Promise<string[]> => {
  const c1 = String(carpetaIn || "").trim();
  const c2 = c1.replace(/^autos\//i, "");
  const c3 = c2.replace(/^\/+|\/+$/g, "");
  const candidates = Array.from(new Set([c1, c2, c3]));

  for (const path of candidates) {
    if (!path) continue;

    const { data, error } = await supabase.storage.from(BUCKET).list(path, { limit: 100 });
    if (!error && data && data.length > 0) {
      const urls = data
        .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f.name))
        .map(
          (f) => supabase.storage.from(BUCKET).getPublicUrl(`${path}/${f.name}`).data.publicUrl
        );
      return urls;
    }

    // intento alternativo con trailing slash
    const alt = `${path}/`.replace(/\/+$/, "/");
    if (alt !== path) {
      const res2 = await supabase.storage.from(BUCKET).list(alt, { limit: 100 });
      if (!res2.error && res2.data && res2.data.length > 0) {
        const urls = res2.data
          .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f.name))
          .map(
            (f) => supabase.storage.from(BUCKET).getPublicUrl(`${alt}${f.name}`).data.publicUrl
          );
        return urls;
      }
    }
  }

  return [];
};

// Trae autos del CSV y suma imágenes desde Supabase
export const fetchAutos = async (): Promise<Auto[]> => {
  if (!URL_CSV) throw new Error("URL_CSV no está definida");

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
      error: (err: any) => reject(err),
    });
  });
};
