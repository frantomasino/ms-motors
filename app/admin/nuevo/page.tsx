import CarForm from "@/components/admin/car-form";
import AdminPageHeader from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default function NuevoAutoPage() {
  return (
    <div>
      <AdminPageHeader
        kicker="Catálogo"
        title="Nuevo auto"
        description="Completá los datos, elegí si el precio va en USD o en pesos, y subí las fotos."
      />
      <CarForm mode="create" />
    </div>
  );
}
