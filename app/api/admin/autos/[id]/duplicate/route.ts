import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { revalidateCatalog } from "@/lib/revalidate-catalog";
import { nextFrontSortOrder } from "@/lib/autos-order";
import type { AutoRow } from "@/types";

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

    const { data, error } = await supabase
      .from("autos")
      .insert({
        brand: row.brand,
        model: row.model,
        year: row.year,
        price: row.price,
        color: row.color,
        mileage: row.mileage,
        transmission: row.transmission,
        fuel_type: row.fuel_type,
        description: row.description,
        estado: "disponible",
        images: [],
        sort_order,
      })
      .select("*")
      .single();

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
