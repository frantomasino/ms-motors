import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { revalidateCatalog } from "@/lib/revalidate-catalog";
import { fetchAutosOrdered, nextFrontSortOrder } from "@/lib/autos-order";
import type { AutoRow, CarFormPayload } from "@/types";

function asInt(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

function sanitizePayload(body: Partial<CarFormPayload>) {
  const brand = String(body.brand || "").trim();
  const model = String(body.model || "").trim();
  const year = asInt(body.year);
  const price = asInt(body.price);
  const mileage = asInt(body.mileage);
  const color = String(body.color || "").trim();
  const transmission = String(body.transmission || "").trim();
  const fuel_type = String(body.fuel_type || "").trim();
  const description = String(body.description || "").trim();
  const estado = body.estado === "vendido" ? "vendido" : "disponible";

  if (!brand || !model) {
    return { error: "Marca y modelo son obligatorios" as const };
  }
  if (year < 1980 || year > new Date().getFullYear() + 1) {
    return { error: "Año inválido" as const };
  }
  if (price < 0 || mileage < 0) {
    return { error: "Precio y kilometraje no pueden ser negativos" as const };
  }

  return {
    data: { brand, model, year, price, color, mileage, transmission, fuel_type, description, estado },
  };
}

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await fetchAutosOrdered(supabase);
    if (error) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
    }
    return NextResponse.json({ cars: (data ?? []) as AutoRow[] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo leer el catálogo" },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  let body: Partial<CarFormPayload> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
  }

  const parsed = sanitizePayload(body);
  if ("error" in parsed && parsed.error) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const sort_order = await nextFrontSortOrder(supabase);
    const { data, error } = await supabase
      .from("autos")
      .insert({ ...parsed.data, sort_order })
      .select("*")
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    revalidateCatalog();
    return NextResponse.json({ car: data as AutoRow }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo crear el auto" },
      { status: 503 }
    );
  }
}
