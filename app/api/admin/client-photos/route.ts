import { NextResponse } from "next/server";
import { createAdminClient, getBucket, pathFromPublicUrl } from "@/lib/supabase-admin";
import { revalidateCatalog } from "@/lib/revalidate-catalog";
import { CLIENT_FOLDER } from "@/lib/photo-config";
import type { ClientPhotoRow } from "@/lib/client-photos";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("client_photos")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
    }
    return NextResponse.json({ photos: (data ?? []) as ClientPhotoRow[] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudieron leer las fotos" },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
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
    const { data: last } = await supabase
      .from("client_photos")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const sort_order = (last?.sort_order ?? 0) + 1;

    const mime = file.type || "image/webp";
    const ext = mime.includes("jpeg") || mime.includes("jpg") ? "jpg" : "webp";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = `${CLIENT_FOLDER}/${filename}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType: mime,
      upsert: false,
    });
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const url = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    const { data, error } = await supabase
      .from("client_photos")
      .insert({ url, sort_order })
      .select("*")
      .single();
    if (error || !data) {
      return NextResponse.json({ error: error?.message || "No se pudo guardar la foto" }, { status: 500 });
    }
    revalidateCatalog();
    return NextResponse.json({ photo: data as ClientPhotoRow }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo subir la foto" },
      { status: 503 }
    );
  }
}

export async function DELETE(request: Request) {
  let id = "";
  try {
    const body = await request.json();
    id = typeof body?.id === "string" ? body.id : "";
  } catch {
    return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
  }
  if (!id) return NextResponse.json({ error: "Falta la foto" }, { status: 400 });

  try {
    const supabase = createAdminClient();
    const bucket = getBucket();
    const { data: row, error: readError } = await supabase
      .from("client_photos")
      .select("*")
      .eq("id", id)
      .single();
    if (readError || !row) {
      return NextResponse.json({ error: "Foto no encontrada" }, { status: 404 });
    }
    const storagePath = pathFromPublicUrl(row.url, bucket);
    if (storagePath) {
      await supabase.storage.from(bucket).remove([storagePath]);
    }
    const { error } = await supabase.from("client_photos").delete().eq("id", id);
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
