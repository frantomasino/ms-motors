import { notFound } from "next/navigation";
import CarForm from "@/components/admin/car-form";
import { createAdminClient } from "@/lib/supabase-admin";
import type { AutoRow } from "@/types";

export const dynamic = "force-dynamic";

export default async function EditAutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("autos").select("*").eq("id", id).single();
    if (error || !data) notFound();
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Editar auto</h1>
        <p className="text-sm text-gray-500 mb-6">Cambiá precio, km o fotos. Las nuevas se recortan al mismo tamaño.</p>
        <CarForm mode="edit" initial={data as AutoRow} />
      </div>
    );
  } catch {
    notFound();
  }
}
