import type { AutoRow } from "@/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export function bySortOrder(a: AutoRow, b: AutoRow) {
  const ao = a.sort_order ?? 0;
  const bo = b.sort_order ?? 0;
  if (ao !== bo) return ao - bo;
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

export async function nextFrontSortOrder(supabase: SupabaseClient): Promise<number> {
  const { data } = await supabase
    .from("autos")
    .select("sort_order")
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();
  return (data?.sort_order ?? 1) - 1;
}

export async function fetchAutosOrdered(supabase: SupabaseClient) {
  const withOrder = await supabase
    .from("autos")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (!withOrder.error) return withOrder;
  if (/sort_order/i.test(withOrder.error.message)) {
    return supabase.from("autos").select("*").order("created_at", { ascending: false });
  }
  return withOrder;
}

export async function nextEndSortOrder(supabase: SupabaseClient): Promise<number> {
  const { data } = await supabase
    .from("autos")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.sort_order ?? 0) + 1;
}
