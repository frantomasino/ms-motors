import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { revalidateCatalog } from "@/lib/revalidate-catalog";
import { fetchAutosOrdered, nextFrontSortOrder } from "@/lib/autos-order";
import type { AutoRow, CarFormPayload } from "@/types";
import {
  isMissingPriceCurrencyColumn,
  MISSING_CURRENCY_COLUMN_MSG,
  parsePriceCurrency,
} from "@/lib/price";

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
  const price_currency = parsePriceCurrency(body.price_currency);

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
    data: { brand, model, year, price, price_currency, color, mileage, transmission, fuel_type, description, estado },
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
  if (!("data" in parsed) || !parsed.data) {
    return NextResponse.json({ error: "error" in parsed ? parsed.error : "Pedido inválido" }, { status: 400 });
  }
  const payload = parsed.data;

  try {
    const supabase = createAdminClient();
    const sort_order = await nextFrontSortOrder(supabase);
    let { data, error } = await supabase
      .from("autos")
      .insert({ ...payload, sort_order })
      .select("*")
      .single();
    if (error && isMissingPriceCurrencyColumn(error)) {
      if (payload.price_currency === "ARS") {
        return NextResponse.json({ error: MISSING_CURRENCY_COLUMN_MSG }, { status: 500 });
      }
      const { price_currency: _ignored, ...withoutCurrency } = payload;
      const retry = await supabase
        .from("autos")
        .insert({ ...withoutCurrency, sort_order })
        .select("*")
        .single();
      data = retry.data;
      error = retry.error;
    }
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
