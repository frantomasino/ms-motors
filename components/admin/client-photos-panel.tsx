"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, ChevronsUp, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { CLIENT_PHOTO_LABEL, CLIENT_PHOTO_SIZE } from "@/lib/photo-config";
import { isImageFile, processCarPhoto } from "@/lib/process-image";
import type { ClientPhotoRow } from "@/lib/client-photos";

export default function ClientPhotosPanel({ initialPhotos }: { initialPhotos: ClientPhotoRow[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState(initialPhotos);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    setPhotos(initialPhotos);
  }, [initialPhotos]);

  async function addFiles(list: FileList | File[]) {
    const files = [...list].filter(isImageFile);
    if (!files.length) return;
    for (let i = 0; i < files.length; i++) {
      setBusy(`Ajustando foto ${i + 1} de ${files.length} a ${CLIENT_PHOTO_LABEL}…`);
      try {
        const processed = await processCarPhoto(files[i], {
          width: CLIENT_PHOTO_SIZE,
          height: CLIENT_PHOTO_SIZE,
        });
        setBusy(`Subiendo foto ${i + 1} de ${files.length}…`);
        const file = new File([processed.blob], `cliente-${i + 1}.${processed.extension}`, {
          type: processed.mime,
        });
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/admin/client-photos", { method: "POST", body: form });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "No se pudo subir");
        setPhotos((prev) => [...prev, data.photo as ClientPhotoRow]);
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "No se pudo leer una foto (si es HEIC, en iPhone: Cámara → Formatos → Más compatible)");
      }
    }
    setBusy("");
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  async function persistOrder(next: ClientPhotoRow[]) {
    setPhotos(next);
    setBusy("order");
    try {
      const res = await fetch("/api/admin/client-photos/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: next.map((p) => p.id) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setMessage(data.error || "No se pudo guardar el orden");
    } catch {
      setMessage("No se pudo guardar el orden");
    } finally {
      setBusy("");
    }
  }

  function move(index: number, dir: "up" | "down" | "first") {
    const list = [...photos];
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

  async function remove(photo: ClientPhotoRow) {
    if (!confirm("¿Sacar esta foto de clientes?")) return;
    setBusy(photo.id);
    const res = await fetch("/api/admin/client-photos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: photo.id }),
    });
    setBusy("");
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || "No se pudo borrar");
      return;
    }
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
  }

  async function importExisting() {
    if (!confirm("Esto trae las fotos que ya están en la carpeta clientes de Supabase. Las que ya estén no se duplican.")) return;
    setImporting(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/client-photos/import", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No se pudo importar");
      setMessage(`Listo: ${data.imported} nuevas, ${data.skipped} ya estaban.`);
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error al importar");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          type="button"
          disabled={Boolean(busy)}
          onClick={() => inputRef.current?.click()}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 h-12 px-5 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold text-sm"
        >
          {busy && busy !== "order" && !photos.some((p) => p.id === busy) ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          {busy.startsWith("Ajust") || busy.startsWith("Subiendo") ? busy : "Agregar fotos"}
        </button>
        <button
          type="button"
          onClick={importExisting}
          disabled={importing}
          className="h-12 px-4 rounded-2xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-400 disabled:opacity-50"
        >
          {importing ? "Importando…" : "Traer fotos de Supabase"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && addFiles(e.target.files)}
      />

      {photos.length === 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900 leading-relaxed">
          Todavía no hay fotos en este panel. El sitio sigue mostrando la carpeta <span className="font-medium">clientes</span> de Supabase.
          Traé las actuales o subí nuevas. Cuando haya al menos una acá, el sitio usa solo este panel.
        </div>
      )}

      {message && <p className="text-sm text-gray-600">{message}</p>}

      {photos.length > 0 && (
        <p className="text-xs text-gray-400">
          {photos.length} fotos · las flechas ordenan · se recortan a {CLIENT_PHOTO_LABEL} (cuadradas)
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((photo, index) => (
          <article key={photo.id} className="relative rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
            <div className="relative aspect-square bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt="" className="h-full w-full object-cover" />
              <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5">
                <button
                  type="button"
                  disabled={index === 0 || Boolean(busy)}
                  onClick={() => move(index, "first")}
                  className="h-7 w-7 rounded-lg bg-black/60 text-white disabled:opacity-20"
                  title="Primero"
                >
                  <ChevronsUp className="h-4 w-4 mx-auto" />
                </button>
                <button
                  type="button"
                  disabled={index === 0 || Boolean(busy)}
                  onClick={() => move(index, "up")}
                  className="h-7 w-7 rounded-lg bg-black/60 text-white disabled:opacity-20"
                  title="Subir"
                >
                  <ChevronUp className="h-4 w-4 mx-auto" />
                </button>
                <button
                  type="button"
                  disabled={index === photos.length - 1 || Boolean(busy)}
                  onClick={() => move(index, "down")}
                  className="h-7 w-7 rounded-lg bg-black/60 text-white disabled:opacity-20"
                  title="Bajar"
                >
                  <ChevronDown className="h-4 w-4 mx-auto" />
                </button>
              </div>
              <button
                type="button"
                disabled={Boolean(busy)}
                onClick={() => remove(photo)}
                className="absolute top-1.5 right-1.5 h-7 w-7 rounded-lg bg-black/60 text-white flex items-center justify-center"
                title="Borrar"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
