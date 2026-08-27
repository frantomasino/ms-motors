import { NextResponse } from "next/server";
import { createAdminClient, getBucket, pathFromPublicUrl } from "@/lib/supabase-admin";
import { revalidateCatalog } from "@/lib/revalidate-catalog";
import type { AutoRow } from "@/types";

type Ctx = { params: Promise<{ id: string }> };

export const runtime = "nodejs";

export async function POST(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "No se recibieron fotos" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "La foto procesada es demasiado grande" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const bucket = getBucket();
    const { data: row, error: readError } = await supabase.from("autos").select("*").eq("id", id).single();
    if (readError || !row) {
      return NextResponse.json({ error: "Auto no encontrado" }, { status: 404 });
    }

    const mime = file.type || "image/webp";
    const ext = mime.includes("jpeg") || mime.includes("jpg") ? "jpg" : "webp";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = `${id}/${filename}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType: mime,
      upsert: false,
    });
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const publicUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    const images = [...(row.images ?? []), publicUrl];
    const { data, error } = await supabase
      .from("autos")
      .update({ images })
      .eq("id", id)
      .select("*")
      .single();
    if (error || !data) {
      return NextResponse.json({ error: error?.message || "No se pudo guardar la foto" }, { status: 500 });
    }

    revalidateCatalog();
    return NextResponse.json({ car: data as AutoRow, url: publicUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo subir la foto" },
      { status: 503 }
    );
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  let url = "";
  try {
    const body = await request.json();
    url = typeof body?.url === "string" ? body.url : "";
  } catch {
    return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
  }
  if (!url) return NextResponse.json({ error: "Falta la foto" }, { status: 400 });

  try {
    const supabase = createAdminClient();
    const bucket = getBucket();
    const { data: row, error: readError } = await supabase.from("autos").select("*").eq("id", id).single();
    if (readError || !row) {
      return NextResponse.json({ error: "Auto no encontrado" }, { status: 404 });
    }

    const storagePath = pathFromPublicUrl(url, bucket);
    if (storagePath) {
      await supabase.storage.from(bucket).remove([storagePath]);
    }

    const images = (row.images ?? []).filter((u: string) => u !== url);
    const { data, error } = await supabase
      .from("autos")
      .update({ images })
      .eq("id", id)
      .select("*")
      .single();
    if (error || !data) {
      return NextResponse.json({ error: error?.message || "No se pudo borrar la foto" }, { status: 500 });
    }
    revalidateCatalog();
    return NextResponse.json({ car: data as AutoRow });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo borrar la foto" },
      { status: 503 }
    );
  }
}
