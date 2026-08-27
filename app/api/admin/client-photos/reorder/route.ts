import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { revalidateCatalog } from "@/lib/revalidate-catalog";

export async function POST(request: Request) {
  let ids: string[] = [];
  try {
    const body = await request.json();
    ids = Array.isArray(body?.ids) ? body.ids.filter((id: unknown) => typeof id === "string" && id) : [];
  } catch {
    return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
  }
  if (!ids.length) {
    return NextResponse.json({ error: "Falta el orden" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const results = await Promise.all(
      ids.map((id, index) => supabase.from("client_photos").update({ sort_order: index + 1 }).eq("id", id))
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) {
      return NextResponse.json({ error: failed.error.message }, { status: 500 });
    }
    revalidateCatalog();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo reordenar" },
      { status: 503 }
    );
  }
}
