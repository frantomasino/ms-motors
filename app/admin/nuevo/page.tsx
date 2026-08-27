import CarForm from "@/components/admin/car-form";

export const dynamic = "force-dynamic";

export default function NuevoAutoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Nuevo auto</h1>
      <p className="text-sm text-gray-500 mb-6">
        Tirale las fotos de la galería. No hace falta crear carpetas en Supabase.
      </p>
      <CarForm mode="create" />
    </div>
  );
}
