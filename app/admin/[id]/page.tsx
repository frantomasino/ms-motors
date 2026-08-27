import { notFound } from "next/navigation";
import CarForm from "@/components/admin/car-form";
import AdminPageHeader from "@/components/admin/page-header";
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
        <AdminPageHeader
          kicker="Catálogo"
          title="Editar auto"
          description="Cambiá precio, kilometraje o fotos. Las nuevas se recortan al mismo tamaño."
        />
        <CarForm mode="edit" initial={data as AutoRow} />
      </div>
    );
  } catch {
    notFound();
  }
}
