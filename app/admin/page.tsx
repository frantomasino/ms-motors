import AdminCarsList from "@/components/admin/cars-list";
import AdminPageHeader from "@/components/admin/page-header";
import { createAdminClient } from "@/lib/supabase-admin";
import { fetchAutosOrdered } from "@/lib/autos-order";
import type { AutoRow } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await fetchAutosOrdered(supabase);

    if (error) {
      const missingTable = /does not exist|schema cache|relation/i.test(error.message);
      return (
        <SetupMessage
          title={missingTable ? "Falta crear la tabla de autos" : "No se pudo leer el catálogo"}
          body={
            missingTable
              ? "En Supabase → SQL Editor, ejecutá el archivo supabase/schema.sql de este repo. Después recargá esta página."
              : "Revisá SUPABASE_SERVICE_ROLE_KEY y NEXT_PUBLIC_SUPABASE_URL. Si recién creaste la tabla, recargá."
          }
          detail={error.message}
        />
      );
    }

    return (
      <div>
        <AdminPageHeader
          kicker="Gestión"
          title="Stock"
          description="Publicá, ordená y actualizá el catálogo. Las fotos se recortan solas a 1600×1200."
        />
        <AdminCarsList initialCars={(data ?? []) as AutoRow[]} />
      </div>
    );
  } catch (err) {
    return (
      <SetupMessage
        title="Falta configurar el servidor"
        body="Agregá ADMIN_PIN y SUPABASE_SERVICE_ROLE_KEY en las variables de entorno del hosting y volvé a desplegar. El PIN es la clave para entrar a /admin. La service role key está en Supabase → Settings → API."
        detail={err instanceof Error ? err.message : undefined}
      />
    );
  }
}

function SetupMessage({ title, body, detail }: { title: string; body: string; detail?: string }) {
  return (
    <div className="rounded-2xl border border-amber-200/80 bg-amber-50 p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700 mb-2">Configuración</p>
      <h1 className="font-title text-2xl text-amber-950 mb-2">{title}</h1>
      <p className="text-sm text-amber-900 leading-relaxed">{body}</p>
      {detail && <p className="mt-3 text-xs text-amber-800/80 break-all">{detail}</p>}
    </div>
  );
}
