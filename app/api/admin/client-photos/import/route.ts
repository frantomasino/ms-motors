import { NextResponse } from "next/server";
import { createAdminClient, getBucket } from "@/lib/supabase-admin";
import { revalidateCatalog } from "@/lib/revalidate-catalog";
import { CLIENT_FOLDER, IMAGE_FILE_RE } from "@/lib/photo-config";

export const runtime = "nodejs";

export async function POST() {
  try {
    const supabase = createAdminClient();
    const bucket = getBucket();
    const listed = await supabase.storage.from(bucket).list(CLIENT_FOLDER, { limit: 200 });
    const urls = (listed.data ?? [])
      .filter((f) => IMAGE_FILE_RE.test(f.name))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((f) => supabase.storage.from(bucket).getPublicUrl(`${CLIENT_FOLDER}/${f.name}`).data.publicUrl);
    if (!urls.length) {
      return NextResponse.json({ imported: 0, skipped: 0 });
    }

    const { data: existing, error: readError } = await supabase.from("client_photos").select("url");
    if (readError) {
      return NextResponse.json({ error: readError.message }, { status: 500 });
    }
    const have = new Set((existing ?? []).map((r) => r.url));
    const fresh = urls.filter((u) => !have.has(u));
    if (!fresh.length) {
      return NextResponse.json({ imported: 0, skipped: urls.length });
    }

    const { data: last } = await supabase
      .from("client_photos")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    let order = last?.sort_order ?? 0;
    const rows = fresh.map((url) => ({ url, sort_order: ++order }));
    const { error } = await supabase.from("client_photos").insert(rows);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    revalidateCatalog();
    return NextResponse.json({ imported: fresh.length, skipped: urls.length - fresh.length });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudieron importar las fotos" },
      { status: 503 }
    );
  }
}
