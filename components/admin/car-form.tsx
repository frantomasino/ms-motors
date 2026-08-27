"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PhotoUploader, { type PhotoItem } from "@/components/admin/photo-uploader";
import {
  CAR_BRANDS,
  FUEL_TYPES,
  OTHER_BRAND,
  TRANSMISSIONS,
  YEAR_OPTIONS,
} from "@/lib/catalog-options";
import type { AutoRow, CarFormPayload } from "@/types";

const fieldClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400";

type Props = {
  mode: "create" | "edit";
  initial?: AutoRow | null;
};

function rowToForm(row?: AutoRow | null): CarFormPayload & { brandSelect: string } {
  const brand = row?.brand || "";
  const known = CAR_BRANDS.includes(brand as (typeof CAR_BRANDS)[number]);
  return {
    brand: known ? brand : brand,
    brandSelect: known || !brand ? brand || "" : OTHER_BRAND,
    model: row?.model || "",
    year: row?.year || new Date().getFullYear(),
    price: row?.price || 0,
    color: row?.color || "",
    mileage: row?.mileage || 0,
    transmission: row?.transmission || "Manual",
    fuel_type: row?.fuel_type || "Nafta",
    description: row?.description || "",
    estado: row?.estado === "vendido" ? "vendido" : "disponible",
  };
}

export default function CarForm({ mode, initial }: Props) {
  const router = useRouter();
  const start = useMemo(() => rowToForm(initial), [initial]);
  const [brandSelect, setBrandSelect] = useState(start.brandSelect);
  const [brandOther, setBrandOther] = useState(start.brandSelect === OTHER_BRAND ? start.brand : "");
  const [model, setModel] = useState(start.model);
  const [year, setYear] = useState(start.year);
  const [price, setPrice] = useState(start.price ? String(start.price) : "");
  const [color, setColor] = useState(start.color);
  const [mileage, setMileage] = useState(start.mileage ? String(start.mileage) : "");
  const [transmission, setTransmission] = useState(start.transmission);
  const [fuelType, setFuelType] = useState(start.fuel_type);
  const [description, setDescription] = useState(start.description);
  const [estado, setEstado] = useState<"disponible" | "vendido">(start.estado || "disponible");
  const [photos, setPhotos] = useState<PhotoItem[]>(
    (initial?.images ?? []).map((url, i) => ({
      key: `existing-${i}-${url}`,
      url,
      status: "ready" as const,
    }))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const brand = brandSelect === OTHER_BRAND ? brandOther.trim() : brandSelect;

  async function persistPhotos(carId: string, items: PhotoItem[], previousUrls: string[]) {
    const ready = items.filter((p) => p.status === "ready" && (p.url || p.file));
    const keepExisting = new Set(ready.filter((p) => !p.file).map((p) => p.url));
    for (const url of previousUrls) {
      if (!keepExisting.has(url)) {
        await fetch(`/api/admin/autos/${carId}/photos`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
      }
    }

    const finalUrls: string[] = [];
    const toUpload = ready.filter((p) => p.file);
    let uploaded = 0;
    for (const item of ready) {
      if (item.file) {
        uploaded += 1;
        setStatus(`Subiendo foto ${uploaded} de ${toUpload.length}…`);
        const form = new FormData();
        form.append("file", item.file);
        const res = await fetch(`/api/admin/autos/${carId}/photos`, { method: "POST", body: form });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "No se pudo subir una foto");
        finalUrls.push(data.url as string);
      } else {
        finalUrls.push(item.url);
      }
    }

    const orderRes = await fetch(`/api/admin/autos/${carId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: finalUrls }),
    });
    if (!orderRes.ok) {
      const data = await orderRes.json().catch(() => ({}));
      throw new Error(data.error || "No se pudo ordenar las fotos");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!brand || !model.trim()) {
      setError("Completá marca y modelo.");
      return;
    }
    if (photos.some((p) => p.status === "processing")) {
      setError("Esperá a que terminen de ajustarse las fotos.");
      return;
    }

    setSaving(true);
    let createdId: string | null = mode === "edit" ? initial!.id : null;
    try {
      const payload: CarFormPayload = {
        brand,
        model: model.trim(),
        year: Number(year),
        price: parseInt(price.replace(/\D/g, ""), 10) || 0,
        color: color.trim(),
        mileage: parseInt(mileage.replace(/\D/g, ""), 10) || 0,
        transmission,
        fuel_type: fuelType,
        description: description.trim(),
        estado,
      };

      if (mode === "create") {
        setStatus("Creando auto…");
        const res = await fetch("/api/admin/autos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "No se pudo crear");
        const newId = data.car.id as string;
        createdId = newId;
        await persistPhotos(newId, photos, []);
        router.push("/admin");
        router.refresh();
        return;
      }

      const id = initial!.id;
      setStatus("Guardando datos…");
      const patchRes = await fetch(`/api/admin/autos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const patchData = await patchRes.json().catch(() => ({}));
      if (!patchRes.ok) throw new Error(patchData.error || "No se pudo guardar");
      await persistPhotos(id, photos, initial?.images ?? []);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
      if (mode === "create" && createdId) {
        router.push(`/admin/${createdId}`);
      }
    } finally {
      setSaving(false);
      setStatus("");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 pb-28">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-medium text-gray-500 mb-1.5 block">Marca</span>
          <select
            value={brandSelect}
            onChange={(e) => setBrandSelect(e.target.value)}
            className={fieldClass}
          >
            <option value="">Elegí marca</option>
            {CAR_BRANDS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
            <option value={OTHER_BRAND}>{OTHER_BRAND}</option>
          </select>
        </label>
        {brandSelect === OTHER_BRAND && (
          <label className="block">
            <span className="text-xs font-medium text-gray-500 mb-1.5 block">¿Cuál?</span>
            <input value={brandOther} onChange={(e) => setBrandOther(e.target.value)} className={fieldClass} placeholder="Marca" />
          </label>
        )}
        <label className="block sm:col-span-2">
          <span className="text-xs font-medium text-gray-500 mb-1.5 block">Modelo</span>
          <input value={model} onChange={(e) => setModel(e.target.value)} className={fieldClass} placeholder="Ej: Gol Trend" />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500 mb-1.5 block">Año</span>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={fieldClass}>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500 mb-1.5 block">Precio (USD)</span>
          <input
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={fieldClass}
            placeholder="15000"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500 mb-1.5 block">Kilómetros</span>
          <input
            inputMode="numeric"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            className={fieldClass}
            placeholder="80000"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500 mb-1.5 block">Color</span>
          <input value={color} onChange={(e) => setColor(e.target.value)} className={fieldClass} placeholder="Blanco" />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500 mb-1.5 block">Transmisión</span>
          <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className={fieldClass}>
            {TRANSMISSIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500 mb-1.5 block">Combustible</span>
          <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className={fieldClass}>
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </label>
        {mode === "edit" && (
          <label className="block">
            <span className="text-xs font-medium text-gray-500 mb-1.5 block">Estado</span>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as "disponible" | "vendido")}
              className={fieldClass}
            >
              <option value="disponible">Disponible</option>
              <option value="vendido">Vendido</option>
            </select>
          </label>
        )}
        <label className="block sm:col-span-2">
          <span className="text-xs font-medium text-gray-500 mb-1.5 block">Descripción (opcional)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-400"
            placeholder="Único dueño, service al día…"
          />
        </label>
      </div>

      <PhotoUploader photos={photos} onChange={setPhotos} disabled={saving} />

      {error && <p className="text-sm text-red-600">{error}</p>}
      {status && <p className="text-sm text-gray-500">{status}</p>}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur px-4 py-3">
        <div className="max-w-2xl mx-auto flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="h-12 px-4 rounded-2xl border border-gray-200 text-sm font-medium text-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 h-12 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold"
          >
            {saving ? "Guardando…" : mode === "create" ? "Publicar auto" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </form>
  );
}
