"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2, Loader2 } from "lucide-react";
import { PHOTO_LABEL } from "@/lib/photo-config";
import { isImageFile, processCarPhoto } from "@/lib/process-image";

export type PhotoItem = {
  key: string;
  url: string;
  file?: File;
  status: "ready" | "processing" | "error";
  error?: string;
};

type Props = {
  photos: PhotoItem[];
  onChange: (photos: PhotoItem[]) => void;
  disabled?: boolean;
};

export default function PhotoUploader({ photos, onChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");

  async function addFiles(list: FileList | File[]) {
    const files = [...list].filter(isImageFile);
    if (!files.length) return;
    setBusy(true);
    const next = [...photos];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress(`Ajustando foto ${i + 1} de ${files.length} a ${PHOTO_LABEL}…`);
      const key = `${Date.now()}-${i}-${file.name}`;
      const placeholder: PhotoItem = { key, url: "", file, status: "processing" };
      next.push(placeholder);
      onChange([...next]);
      try {
        const processed = await processCarPhoto(file);
        const blobFile = new File([processed.blob], `foto-${i + 1}.${processed.extension}`, {
          type: processed.mime,
        });
        const url = URL.createObjectURL(blobFile);
        next[next.length - 1] = { key, url, file: blobFile, status: "ready" };
        onChange([...next]);
      } catch (err) {
        next[next.length - 1] = {
          key,
          url: "",
          status: "error",
          error: err instanceof Error ? err.message : "No se pudo leer esta foto",
        };
        onChange([...next]);
      }
    }

    setBusy(false);
    setProgress("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(index: number) {
    const item = photos[index];
    if (item?.url.startsWith("blob:")) URL.revokeObjectURL(item.url);
    onChange(photos.filter((_, i) => i !== index));
  }

  function makeCover(index: number) {
    if (index === 0) return;
    const copy = [...photos];
    const [item] = copy.splice(index, 1);
    copy.unshift(item);
    onChange(copy);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">Fotos</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Se recortan a {PHOTO_LABEL} (4:3). Tocá una para usarla de portada.
          </p>
        </div>
        <span className="text-xs text-gray-400 tabular-nums">{photos.filter((p) => p.status === "ready").length}</span>
      </div>

      <button
        type="button"
        disabled={disabled || busy}
        onClick={() => inputRef.current?.click()}
        className="w-full min-h-[7.5rem] rounded-2xl border-2 border-dashed border-gray-200 bg-white hover:border-brand/40 hover:bg-red-50/30 transition-colors flex flex-col items-center justify-center gap-2 px-4 py-6 disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-6 w-6 text-red-500 animate-spin" />
        ) : (
          <ImagePlus className="h-7 w-7 text-gray-400" />
        )}
        <span className="text-sm font-medium text-gray-700">
          {busy ? progress : "Tocá para agregar fotos"}
        </span>
        <span className="text-[11px] text-gray-400">Podés elegir varias de una</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && addFiles(e.target.files)}
      />

      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {photos.map((photo, index) => (
            <div key={photo.key} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
              {photo.status === "ready" && photo.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo.url} alt="" className="h-full w-full object-cover" />
              ) : photo.status === "error" ? (
                <div className="h-full w-full flex items-center justify-center p-2 text-[10px] text-red-600 text-center leading-tight">
                  {photo.error || "Error"}
                </div>
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              )}
              {index === 0 && photo.status === "ready" && (
                <span className="absolute top-1 left-1 text-[9px] font-bold uppercase tracking-wide bg-brand text-white px-1.5 py-0.5 rounded-md">
                  Portada
                </span>
              )}
              {photo.status === "ready" && index > 0 && (
                <button
                  type="button"
                  onClick={() => makeCover(index)}
                  className="absolute inset-0 bg-black/0 hover:bg-black/25 transition-colors"
                  title="Ver primero"
                >
                  <span className="absolute bottom-1 left-1 right-8 text-[9px] font-semibold text-white bg-black/60 px-1.5 py-0.5 rounded-md">
                    Usar primero
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute bottom-1 right-1 h-7 w-7 rounded-full bg-black/70 text-white flex items-center justify-center z-10"
                title="Sacar foto"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
