"use client";

import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  X,
  MessageCircle,
  ZoomIn,
  Calendar,
  Gauge,
  Fuel,
  Settings2,
  Palette,
} from "lucide-react";
import Image from "next/image";
import type { CarType } from "@/types";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const VALID_MEDIA = /\.(jpe?g|png|webp|gif|mp4|mov|webm|m4v)$/i;

function stripParams(u: string) {
  const i = u.indexOf("?");
  const j = u.indexOf("#");
  const cut = (x: number) => (x === -1 ? u.length : x);
  return u.slice(0, Math.min(cut(i), cut(j)));
}

function isVideo(u?: string) {
  if (typeof u !== "string") return false;
  const s = stripParams(u).toLowerCase();
  return /\.(mp4|mov|webm|m4v)$/.test(s) || s.includes("/video/");
}

function guessMime(u: string): string | undefined {
  const s = stripParams(u).toLowerCase();
  if (s.endsWith(".mp4") || s.endsWith(".m4v")) return "video/mp4";
  if (s.endsWith(".webm")) return "video/webm";
  if (s.endsWith(".mov")) return "video/mp4";
  return undefined;
}

interface CarDetailsModalProps {
  car: CarType | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CarDetailsModal({ car, isOpen, onClose }: CarDetailsModalProps) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaList, setMediaList] = useState<string[]>([]);
  const swipeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!car) { setMediaList([]); return; }
    async function fetchMedios() {
      const fromCsv = (car.images ?? []).filter(
        (u): u is string => typeof u === "string" && u.trim().length > 0
      );
      let fromSb: string[] = [];
      if ((car as any).fotos) {
        const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET!;
        const folder = String((car as any).fotos).replace(/^\/+|\/+$/g, "");
        const { data } = await supabase.storage.from(bucket).list(folder, { limit: 500 });
        if (data) {
          fromSb = data
            .filter((f) => VALID_MEDIA.test(f.name))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((f) => supabase.storage.from(bucket).getPublicUrl(`${folder}/${f.name}`).data.publicUrl);
        }
      }
      const merged = Array.from(new Set([...fromCsv, ...fromSb]));
      merged.sort((a, b) => (isVideo(a) ? 1 : 0) - (isVideo(b) ? 1 : 0) || a.localeCompare(b));
      setMediaList(merged);
    }
    fetchMedios();
  }, [car]);

  useEffect(() => { if (isOpen) setCurrentMediaIndex(0); }, [isOpen, car]);

  const prev = () => setCurrentMediaIndex((i) => (i === 0 ? mediaList.length - 1 : i - 1));
  const next = () => setCurrentMediaIndex((i) => (i === mediaList.length - 1 ? 0 : i + 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") { if (zoomOpen) setZoomOpen(false); else onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, zoomOpen, mediaList.length]);

  useEffect(() => {
    const el = swipeRef.current;
    if (!el) return;
    let startX = 0;
    const ts = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const te = (e: TouchEvent) => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 50) diff < 0 ? next() : prev();
    };
    el.addEventListener("touchstart", ts);
    el.addEventListener("touchend", te);
    return () => { el.removeEventListener("touchstart", ts); el.removeEventListener("touchend", te); };
  }, [mediaList, currentMediaIndex]);

  if (!car) return null;

  const currentMedia = mediaList[currentMediaIndex] ?? "";
  const currentIsVideo = isVideo(currentMedia);
  const formatPrice = (p: number) => `USD ${new Intl.NumberFormat("es-AR").format(p)}`;
  const formatMileage = (m: number) => `${new Intl.NumberFormat("es-AR").format(m)} km`;

  const specs = [
    { icon: Calendar, label: "Año", value: String(car.year) },
    { icon: Gauge, label: "Kilometraje", value: formatMileage(car.mileage) },
    { icon: Fuel, label: "Combustible", value: car.fuelType },
    { icon: Settings2, label: "Transmisión", value: car.transmission },
    { icon: Palette, label: "Color", value: car.color },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="w-full max-w-4xl max-h-[95vh] overflow-y-auto p-0 rounded-2xl border-0 shadow-2xl">
          <DialogTitle className="sr-only">{car.brand} {car.model}</DialogTitle>

          {/* Header oscuro */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#0f1117] rounded-t-2xl">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest">{car.brand}</p>
              <h2 className="text-xl font-bold text-white">{car.model} <span className="text-white/40 font-normal">{car.year}</span></h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-red-400">{formatPrice(car.price)}</span>
              <button onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

            {/* Galería */}
            <div className="bg-black">
              {/* Imagen principal */}
              <div ref={swipeRef} className="relative h-72 md:h-96 overflow-hidden cursor-zoom-in"
                onClick={() => currentMedia && !currentIsVideo && setZoomOpen(true)}>
                {currentMedia ? (
                  currentIsVideo ? (
                    <video controls preload="metadata" playsInline className="w-full h-full object-contain bg-black">
                      <source src={currentMedia} type={guessMime(currentMedia)} />
                    </video>
                  ) : (
                    <>
                      <Image src={currentMedia} alt={`${car.model} ${currentMediaIndex + 1}`} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                        <ZoomIn className="h-3 w-3" /> Zoom
                      </div>
                    </>
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">Sin imágenes</div>
                )}

                {mediaList.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); prev(); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); next(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/60 text-xs bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {currentMediaIndex + 1} / {mediaList.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {mediaList.length > 1 && (
                <div className="flex gap-1.5 p-3 overflow-x-auto bg-black/80">
                  {mediaList.map((media, idx) => (
                    <button key={idx} onClick={() => setCurrentMediaIndex(idx)}
                      className={`relative h-14 w-14 shrink-0 rounded-lg overflow-hidden transition-all ${
                        idx === currentMediaIndex ? "ring-2 ring-red-500 opacity-100" : "opacity-50 hover:opacity-80"
                      }`}>
                      {isVideo(media) ? (
                        <video src={media} muted preload="metadata" playsInline className="w-full h-full object-cover bg-gray-900" />
                      ) : (
                        <Image src={media} alt={`thumb ${idx + 1}`} fill className="object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col p-6 gap-5 bg-white">

              {/* Specs */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Especificaciones</p>
                <div className="flex flex-col divide-y divide-gray-50">
                  {specs.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Icon className="h-4 w-4 text-gray-300" />
                        {label}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Descripción */}
              {car.description && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Descripción</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{car.description}</p>
                </div>
              )}

              {/* CTA WhatsApp */}
              <div className="mt-auto pt-2">
                <a
                  href={`https://wa.me/5491159456142?text=${encodeURIComponent(`Hola! Me interesa el ${car.brand} ${car.model} ${car.year} (${formatPrice(car.price)}). ¿Está disponible?`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.01] shadow-lg shadow-green-100"
                >
                  <MessageCircle className="h-5 w-5" />
                  Consultar por WhatsApp
                </a>
                <p className="text-center text-xs text-gray-400 mt-2">Respuesta inmediata · Atención personalizada</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Zoom */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] p-0 bg-black border-0 rounded-2xl overflow-hidden">
          <DialogTitle className="sr-only">Zoom imagen</DialogTitle>
          <button onClick={() => setZoomOpen(false)}
            className="absolute right-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
          <div className="relative w-full h-[90vh]">
            <Image src={currentMedia || "/placeholder.svg"} alt="Zoom" fill className="object-contain" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}