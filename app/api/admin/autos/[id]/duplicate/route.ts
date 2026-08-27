import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { revalidateCatalog } from "@/lib/revalidate-catalog";
import { nextFrontSortOrder } from "@/lib/autos-order";
import type { AutoRow } from "@/types";
import { isMissingPriceCurrencyColumn } from "@/lib/price";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  try {
    const supabase = createAdminClient();
    const { data: row, error: readError } = await supabase.from("autos").select("*").eq("id", id).single();
    if (readError || !row) {
      return NextResponse.json({ error: "Auto no encontrado" }, { status: 404 });
    }

    const sort_order = await nextFrontSortOrder(supabase);
    const payload = {
      brand: row.brand,
      model: row.model,
      year: row.year,
      price: row.price,
      price_currency: row.price_currency || "USD",
      color: row.color,
      mileage: row.mileage,
      transmission: row.transmission,
      fuel_type: row.fuel_type,
      description: row.description,
      estado: "disponible",
      images: [] as string[],
      sort_order,
    };

    let { data, error } = await supabase.from("autos").insert(payload).select("*").single();
    if (error && isMissingPriceCurrencyColumn(error)) {
      const { price_currency: _ignored, ...rest } = payload;
      const retry = await supabase.from("autos").insert(rest).select("*").single();
      data = retry.data;
      error = retry.error;
    }

    if (error || !data) {
      return NextResponse.json({ error: error?.message || "No se pudo duplicar" }, { status: 500 });
    }
    revalidateCatalog();
    return NextResponse.json({ car: data as AutoRow }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo duplicar" },
      { status: 503 }
    );
  }
}
