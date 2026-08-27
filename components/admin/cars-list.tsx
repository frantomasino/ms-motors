"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Pencil, Trash2, ChevronUp, ChevronDown, ChevronsUp } from "lucide-react";
import type { AutoRow } from "@/types";
import { bySortOrder } from "@/lib/autos-order";

function formatPrice(n: number) {
  return `USD ${new Intl.NumberFormat("es-AR").format(n)}`;
}

export default function AdminCarsList({ initialCars }: { initialCars: AutoRow[] }) {
  const router = useRouter();
  const [cars, setCars] = useState(initialCars);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState("");
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [coverCar, setCoverCar] = useState<AutoRow | null>(null);
  const [tab, setTab] = useState<"activos" | "vendidos">("activos");

  async function importCsv() {
    if (!confirm("Esto copia el catálogo actual del Sheet a este panel. Los que ya estén no se duplican.")) return;
    setImporting(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/import-csv", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No se pudo importar");
      setMessage(`Listo: ${data.imported} nuevos, ${data.skipped} ya estaban.`);
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error al importar");
    } finally {
      setImporting(false);
    }
  }

  async function toggleSold(car: AutoRow) {
    const next = car.estado === "vendido" ? "disponible" : "vendido";
    setBusyId(car.id);
    const res = await fetch(`/api/admin/autos/${car.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: next }),
    });
    const data = await res.json().catch(() => ({}));
    setBusyId(null);
    if (!res.ok) {
      setMessage(data.error || "No se pudo cambiar el estado");
      return;
    }
    setCars((prev) => prev.map((c) => (c.id === car.id ? data.car : c)));
  }

  async function savePrice(car: AutoRow) {
    const price = parseInt(priceDraft.replace(/\D/g, ""), 10) || 0;
    setBusyId(car.id);
    const res = await fetch(`/api/admin/autos/${car.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price }),
    });
    const data = await res.json().catch(() => ({}));
    setBusyId(null);
    setEditingPrice(null);
    if (!res.ok) {
      setMessage(data.error || "No se pudo guardar el precio");
      return;
    }
    setCars((prev) => prev.map((c) => (c.id === car.id ? data.car : c)));
  }

  async function setCoverPhoto(car: AutoRow, url: string) {
    const rest = (car.images ?? []).filter((u) => u !== url);
    const images = [url, ...rest];
    setBusyId(car.id);
    const res = await fetch(`/api/admin/autos/${car.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images }),
    });
    const data = await res.json().catch(() => ({}));
    setBusyId(null);
    if (!res.ok) {
      setMessage(data.error || "No se pudo cambiar la foto");
      return;
    }
    setCars((prev) => prev.map((c) => (c.id === car.id ? data.car : c)));
    setCoverCar(null);
  }

  async function duplicate(car: AutoRow) {
    setBusyId(car.id);
    const res = await fetch(`/api/admin/autos/${car.id}/duplicate`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setBusyId(null);
    if (!res.ok) {
      setMessage(data.error || "No se pudo duplicar");
      return;
    }
    router.push(`/admin/${data.car.id}`);
  }

  async function remove(car: AutoRow) {
    if (!confirm(`¿Borrar ${car.brand} ${car.model}? Se sacan también las fotos.`)) return;
    setBusyId(car.id);
    const res = await fetch(`/api/admin/autos/${car.id}`, { method: "DELETE" });
    setBusyId(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || "No se pudo borrar");
      return;
    }
    setCars((prev) => prev.filter((c) => c.id !== car.id));
  }

  const activos = cars.filter((c) => c.estado !== "vendido").sort(bySortOrder);
  const vendidos = cars.filter((c) => c.estado === "vendido").sort(bySortOrder);
  const visible = tab === "activos" ? activos : vendidos;

  async function persistOrder(nextVisible: AutoRow[]) {
    const ids = nextVisible.map((c) => c.id);
    const orderById = new Map(ids.map((id, i) => [id, i + 1]));
    setCars((prev) => prev.map((c) => (orderById.has(c.id) ? { ...c, sort_order: orderById.get(c.id) } : c)));
    setBusyId("order");
    try {
      const res = await fetch("/api/admin/autos/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setMessage(data.error || "No se pudo guardar el orden");
    } catch {
      setMessage("No se pudo guardar el orden");
    } finally {
      setBusyId(null);
    }
  }

  function moveCar(index: number, dir: "up" | "down" | "first") {
    const list = [...visible];
    if (dir === "first") {
      if (index === 0) return;
      const [item] = list.splice(index, 1);
      list.unshift(item);
    } else {
      const j = dir === "up" ? index - 1 : index + 1;
      if (j < 0 || j >= list.length) return;
      [list[index], list[j]] = [list[j], list[index]];
    }
    persistOrder(list);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Link
          href="/admin/nuevo"
          className="flex-1 sm:flex-none inline-flex items-center justify-center h-12 px-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm"
        >
          Nuevo auto
        </Link>
        <button
          type="button"
          onClick={importCsv}
          disabled={importing}
          className="h-12 px-4 rounded-2xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-400 disabled:opacity-50"
        >
          {importing ? "Importando…" : "Traer catálogo del Sheet"}
        </button>
      </div>

      {cars.length === 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900 leading-relaxed">
          Todavía no hay autos en este panel. El sitio público sigue mostrando el Sheet.
          Traé el catálogo actual o cargá el primero. Cuando haya al menos uno acá, el sitio usa solo este panel.
        </div>
      )}

      {message && <p className="text-sm text-gray-600">{message}</p>}

      {cars.length > 0 && (
        <div className="flex items-center gap-1 p-1 bg-white border border-gray-100 rounded-xl shadow-sm w-fit">
          <button
            type="button"
            onClick={() => setTab("activos")}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "activos" ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Activos
            <span className={`ml-1.5 text-xs ${tab === "activos" ? "text-white/60" : "text-gray-300"}`}>
              {activos.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTab("vendidos")}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "vendidos" ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Vendidos
            <span className={`ml-1.5 text-xs ${tab === "vendidos" ? "text-white/60" : "text-gray-300"}`}>
              {vendidos.length}
            </span>
          </button>
        </div>
      )}

      {cars.length > 0 && (
        <p className="text-xs text-gray-400">
          Las flechas mueven el auto. Tocá la miniatura para elegir qué foto se ve primero.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {cars.length > 0 && visible.length === 0 && (
          <p className="text-sm text-gray-400 py-8 text-center">
            {tab === "activos" ? "No hay autos activos." : "No hay autos vendidos."}
          </p>
        )}
        {visible.map((car, index) => {
          const cover = car.images?.[0];
          const sold = car.estado === "vendido";
          const isFirst = index === 0;
          const isLast = index === visible.length - 1;
          return (
            <article key={car.id} className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
              <div className="flex gap-2 p-3">
                <div className="flex flex-col justify-center gap-0.5 shrink-0">
                  <button
                    type="button"
                    disabled={isFirst || busyId === "order"}
                    onClick={() => moveCar(index, "first")}
                    className="h-7 w-7 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-20"
                    title="Poner primero"
                  >
                    <ChevronsUp className="h-4 w-4 mx-auto" />
                  </button>
                  <button
                    type="button"
                    disabled={isFirst || busyId === "order"}
                    onClick={() => moveCar(index, "up")}
                    className="h-7 w-7 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-20"
                    title="Subir"
                  >
                    <ChevronUp className="h-4 w-4 mx-auto" />
                  </button>
                  <button
                    type="button"
                    disabled={isLast || busyId === "order"}
                    onClick={() => moveCar(index, "down")}
                    className="h-7 w-7 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-20"
                    title="Bajar"
                  >
                    <ChevronDown className="h-4 w-4 mx-auto" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => (car.images?.length ?? 0) > 1 ? setCoverCar(car) : undefined}
                  className="relative h-20 w-[6.5rem] shrink-0 rounded-xl overflow-hidden bg-gray-100"
                  title={(car.images?.length ?? 0) > 1 ? "Elegir foto de portada" : undefined}
                >
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400">Sin foto</div>
                  )}
                  {(car.images?.length ?? 0) > 1 && (
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-semibold py-0.5">
                      Elegir foto
                    </span>
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400">{car.brand}</p>
                      <h2 className="text-sm font-bold text-gray-900 truncate">{car.model} · {car.year}</h2>
                    </div>
                    <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      sold ? "bg-gray-100 text-gray-500" : "bg-green-50 text-green-700"
                    }`}>
                      {sold ? "Vendido" : "Disponible"}
                    </span>
                  </div>

                  {editingPrice === car.id ? (
                    <form
                      className="mt-1 flex items-center gap-2"
                      onSubmit={(e) => { e.preventDefault(); savePrice(car); }}
                    >
                      <input
                        autoFocus
                        inputMode="numeric"
                        value={priceDraft}
                        onChange={(e) => setPriceDraft(e.target.value)}
                        className="h-8 w-28 rounded-lg border border-gray-200 px-2 text-sm"
                      />
                      <button type="submit" className="text-xs font-semibold text-red-600">OK</button>
                      <button type="button" onClick={() => setEditingPrice(null)} className="text-xs text-gray-400">x</button>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setEditingPrice(car.id); setPriceDraft(String(car.price)); }}
                      className="mt-1 text-sm font-bold text-gray-900"
                    >
                      {formatPrice(car.price)}
                      <span className="ml-1 text-[10px] font-medium text-gray-400">editar</span>
                    </button>
                  )}
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {new Intl.NumberFormat("es-AR").format(car.mileage)} km · {car.images?.length ?? 0} fotos
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 border-t border-gray-50 text-xs">
                <Link href={`/admin/${car.id}`} className="flex items-center justify-center gap-1 py-2.5 text-gray-600 hover:bg-gray-50">
                  <Pencil className="h-3.5 w-3.5" /> Editar
                </Link>
                <button
                  type="button"
                  disabled={busyId === car.id}
                  onClick={() => toggleSold(car)}
                  className="py-2.5 text-gray-600 hover:bg-gray-50 border-l border-gray-50"
                >
                  {sold ? "Publicar" : "Vendido"}
                </button>
                <button
                  type="button"
                  disabled={busyId === car.id}
                  onClick={() => duplicate(car)}
                  className="flex items-center justify-center gap-1 py-2.5 text-gray-600 hover:bg-gray-50 border-l border-gray-50"
                >
                  <Copy className="h-3.5 w-3.5" /> Copiar
                </button>
                <button
                  type="button"
                  disabled={busyId === car.id}
                  onClick={() => remove(car)}
                  className="flex items-center justify-center gap-1 py-2.5 text-red-600 hover:bg-red-50 border-l border-gray-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Borrar
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {coverCar && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4"
          onClick={() => setCoverCar(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md p-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-bold text-gray-900 mb-1">¿Cuál se ve primero?</p>
            <p className="text-xs text-gray-400 mb-3">
              {coverCar.brand} {coverCar.model} · tocá la foto de portada
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(coverCar.images ?? []).map((url, i) => (
                <button
                  key={url + i}
                  type="button"
                  onClick={() => setCoverPhoto(coverCar, url)}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden ${
                    i === 0 ? "ring-2 ring-red-600" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-red-600 text-white text-[9px] font-bold py-0.5">
                      Actual
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCoverCar(null)}
              className="mt-4 w-full h-11 rounded-xl border border-gray-200 text-sm font-medium text-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
