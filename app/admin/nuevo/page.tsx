import CarForm from "@/components/admin/car-form";
import AdminPageHeader from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default function NuevoAutoPage() {
  return (
    <div>
      <AdminPageHeader
        kicker="Catálogo"
        title="Nuevo auto"
        description="Completá los datos y subí las fotos. No hace falta crear carpetas en Supabase."
      />
      <CarForm mode="create" />
    </div>
  );
}
