import { NextResponse } from "next/server";
import { createAdminClient, getBucket, pathFromPublicUrl } from "@/lib/supabase-admin";
import { revalidateCatalog } from "@/lib/revalidate-catalog";
import type { AutoRow, CarFormPayload } from "@/types";

type Ctx = { params: Promise<{ id: string }> };

function asInt(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = typeof value === "number" ? value : parseInt(String(value), 10);
  return Number.isFinite(n) ? n : undefined;
}

export async function GET(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("autos").select("*").eq("id", id).single();
    if (error || !data) {
      return NextResponse.json({ error: "Auto no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ car: data as AutoRow });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al leer el auto" },
      { status: 503 }
    );
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  let body: Partial<CarFormPayload> & { images?: string[] } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (typeof body.brand === "string") patch.brand = body.brand.trim();
  if (typeof body.model === "string") patch.model = body.model.trim();
  if (typeof body.color === "string") patch.color = body.color.trim();
  if (typeof body.transmission === "string") patch.transmission = body.transmission.trim();
  if (typeof body.fuel_type === "string") patch.fuel_type = body.fuel_type.trim();
  if (typeof body.description === "string") patch.description = body.description.trim();
  if (body.estado === "vendido" || body.estado === "disponible") patch.estado = body.estado;
  const year = asInt(body.year);
  const price = asInt(body.price);
  const mileage = asInt(body.mileage);
  if (year !== undefined) patch.year = year;
  if (price !== undefined) patch.price = price;
  if (mileage !== undefined) patch.mileage = mileage;
  if (Array.isArray(body.images)) {
    patch.images = body.images.filter((u) => typeof u === "string" && u.trim());
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("autos").update(patch).eq("id", id).select("*").single();
    if (error || !data) {
      return NextResponse.json({ error: error?.message || "Auto no encontrado" }, { status: 404 });
    }
    revalidateCatalog();
    return NextResponse.json({ car: data as AutoRow });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo guardar" },
      { status: 503 }
    );
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  try {
    const supabase = createAdminClient();
    const bucket = getBucket();
    const { data: row } = await supabase.from("autos").select("images").eq("id", id).single();
    const urls: string[] = row?.images ?? [];
    const paths = urls
      .map((u) => pathFromPublicUrl(u, bucket))
      .filter((p): p is string => Boolean(p));

    const { data: listed } = await supabase.storage.from(bucket).list(id, { limit: 200 });
    if (listed?.length) {
      paths.push(...listed.map((f) => `${id}/${f.name}`));
    }
    if (paths.length) {
      await supabase.storage.from(bucket).remove([...new Set(paths)]);
    }

    const { error } = await supabase.from("autos").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    revalidateCatalog();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo borrar" },
      { status: 503 }
    );
  }
}
