import ClientPhotosPanel from "@/components/admin/client-photos-panel";
import { createAdminClient } from "@/lib/supabase-admin";
import type { ClientPhotoRow } from "@/lib/client-photos";

export const dynamic = "force-dynamic";

export default async function AdminClientesPage() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("client_photos")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      const missing = /does not exist|schema cache|relation/i.test(error.message);
      return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h1 className="text-lg font-bold text-amber-950 mb-2">
            {missing ? "Falta crear la tabla de fotos de clientes" : "No se pudieron leer las fotos"}
          </h1>
          <p className="text-sm text-amber-900 leading-relaxed">
            {missing
              ? "En Supabase → SQL Editor, ejecutá el archivo supabase/client-photos.sql. Después recargá."
              : "Revisá la conexión a Supabase y recargá."}
          </p>
          {error.message && <p className="mt-3 text-xs text-amber-800/80 break-all">{error.message}</p>}
        </div>
      );
    }

    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Clientes felices</h1>
        <p className="text-sm text-gray-500 mb-6">
          Fotos del sitio en “Clientes”. Se recortan cuadradas a 1200×1200. Las flechas cambian el orden.
        </p>
        <ClientPhotosPanel initialPhotos={(data ?? []) as ClientPhotoRow[]} />
      </div>
    );
  } catch (err) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h1 className="text-lg font-bold text-amber-950 mb-2">Falta configurar el servidor</h1>
        <p className="text-sm text-amber-900 leading-relaxed">
          Agregá ADMIN_PIN y SUPABASE_SERVICE_ROLE_KEY en Vercel.
        </p>
        {err instanceof Error && <p className="mt-3 text-xs text-amber-800/80 break-all">{err.message}</p>}
      </div>
    );
  }
}
