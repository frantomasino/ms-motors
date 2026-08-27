import { NextResponse } from "next/server";
import { fetchAutos } from "@/services/autosService";
import { csvToInsert } from "@/lib/map-car";
import { createAdminClient } from "@/lib/supabase-admin";
import { revalidateCatalog } from "@/lib/revalidate-catalog";
import type { AutoRow } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

function keyOf(brand: string, model: string, year: number, mileage: number) {
  return `${brand}|${model}|${year}|${mileage}`.toLowerCase();
}

export async function POST() {
  try {
    const supabase = createAdminClient();
    const [csvAutos, existingRes] = await Promise.all([
      fetchAutos(),
      supabase.from("autos").select("brand,model,year,mileage"),
    ]);

    if (existingRes.error) {
      return NextResponse.json({ error: existingRes.error.message }, { status: 500 });
    }

    const existing = new Set(
      (existingRes.data ?? []).map((r) => keyOf(r.brand, r.model, r.year, r.mileage))
    );

    const toInsert = csvAutos
      .filter((a) => a.Marca?.trim() && a.Modelo?.trim())
      .map(csvToInsert)
      .filter((row) => !existing.has(keyOf(row.brand, row.model, row.year, row.mileage)));

    if (!toInsert.length) {
      const { count } = await supabase.from("autos").select("*", { count: "exact", head: true });
      return NextResponse.json({ imported: 0, skipped: csvAutos.length, total: count ?? 0 });
    }

    const { data, error } = await supabase.from("autos").insert(toInsert).select("id");
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateCatalog();
    return NextResponse.json({
      imported: data?.length ?? toInsert.length,
      skipped: csvAutos.length - toInsert.length,
      cars: (data ?? []) as Pick<AutoRow, "id">[],
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo importar el catálogo" },
      { status: 503 }
    );
  }
}
