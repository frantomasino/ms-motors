"use client";

import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  X,
  MessageCircle,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import type { Car } from "@/types";
import { createClient } from "@supabase/supabase-js";

// Supabase inline
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// extensiones válidas (fotos + videos)
const VALID_MEDIA = /\.(jpe?g|png|webp|gif|mp4|mov|webm|m4v)$/i;

function stripParams(u: string) {
  const i = u.indexOf("?");
  const j = u.indexOf("#");
  const cut = (x: number) => (x === -1 ? u.length : x);
  const end = Math.min(cut(i), cut(j));
  return u.slice(0, end);
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
  if (s.endsWith(".mov")) return "video/mp4"; // la mayoría es H.264/AAC
  return undefined;
}

interface CarDetailsModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CarDetailsModal({
  car,
  isOpen,
  onClose,
}: CarDetailsModalProps) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaList, setMediaList] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const swipeRef = useRef<HTMLDivElement>(null);

  // Cargar desde CSV + Supabase y unificar
  useEffect(() => {
    if (!car) {
      setMediaList([]);
      return;
    }

    async function fetchMedios() {
      // 1) del CSV (si vinieron)
      const fromCsv = (car.images ?? []).filter(
        (u): u is string => typeof u === "string" && u.trim().length > 0
      );

      // 2) de Supabase (si hay carpeta)
      let fromSb: string[] = [];
      if (car.fotos) {
        const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET!;
        const folder = String(car.fotos).replace(/^\/+|\/+$/g, "");
        const { data, error } = await supabase.storage
          .from(bucket)
          .list(folder, { limit: 500 });

        if (error) {
          console.error("Error listando medios:", error.message);
        } else {
          const files = (data ?? [])
            .filter((f) => VALID_MEDIA.test(f.name))
            .sort((a, b) => a.name.localeCompare(b.name));

          fromSb = files.map(
            (f) =>
              supabase.storage.from(bucket).getPublicUrl(`${folder}/${f.name}`)
                .data.publicUrl
          );

          console.log("📁 En carpeta", folder, ":", files.map((f) => f.name));
        }
      }

      // 3) Unimos (únicos) — prioridad: CSV primero, luego Supabase
      const merged = Array.from(new Set([...fromCsv, ...fromSb]));
      // Opcional: imágenes antes, videos después
      merged.sort((a, b) => {
        const av = isVideo(a) ? 1 : 0;
        const bv = isVideo(b) ? 1 : 0;
        return av - bv || a.localeCompare(b);
      });

      console.log("🧩 Medios combinados:", merged);
      setMediaList(merged);
    }

    fetchMedios();
  }, [car]);

  // Reset índice al abrir
  useEffect(() => {
    if (isOpen) setCurrentMediaIndex(0);
  }, [isOpen, car]);

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) =>
      mediaList.length ? (prev === 0 ? mediaList.length - 1 : prev - 1) : 0
    );
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) =>
      mediaList.length ? (prev === mediaList.length - 1 ? 0 : prev + 1) : 0
    );
  };

  const formatPrice = (price: number) =>
    `USD ${new Intl.NumberFormat("es-AR").format(price)}`;
  const formatMileage = (mileage: number) =>
    `${new Intl.NumberFormat("es-AR").format(mileage)} km`;

  // Navegación con teclado
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") handlePrevMedia();
      if (e.key === "ArrowRight") handleNextMedia();
      if (e.key === "Escape") {
        if (zoomOpen) setZoomOpen(false);
        else onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, zoomOpen, mediaList.length]);

  // Swipe en mobile
  useEffect(() => {
    const swipeEl = swipeRef.current;
    if (!swipeEl) return;

    let startX = 0;
    let endX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      endX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const diffX = endX - startX;
      if (Math.abs(diffX) > 50) {
        if (diffX < 0) handleNextMedia();
        else handlePrevMedia();
      }
    };

    swipeEl.addEventListener("touchstart", handleTouchStart);
    swipeEl.addEventListener("touchmove", handleTouchMove);
    swipeEl.addEventListener("touchend", handleTouchEnd);

    return () => {
      swipeEl.removeEventListener("touchstart", handleTouchStart);
      swipeEl.removeEventListener("touchmove", handleTouchMove);
      swipeEl.removeEventListener("touchend", handleTouchEnd);
    };
  }, [mediaList, currentMediaIndex]);

  if (!car) return null;

  const currentMedia = mediaList[currentMediaIndex] ?? "";
  const currentIsVideo = isVideo(currentMedia);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between relative">
            <DialogTitle className="text-2xl font-bold">
              {car.model} - {car.year}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-4 top-4 z-50"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Galería */}
            <div className="space-y-4">
              <div className="relative w-full h-[280px] md:h-[320px] overflow-hidden rounded-lg">
                <div
                  ref={swipeRef}
                  className="relative w-full h-full cursor-zoom-in"
                  onClick={() => currentMedia && !currentIsVideo && setZoomOpen(true)}
                >
                  {currentMedia ? (
                    currentIsVideo ? (
                      <video
                        controls
                        preload="metadata"
                        playsInline
                        className="w-full h-full object-contain bg-black"
                        onError={(e) => {
                          console.error("❌ Error reproduciendo video:", currentMedia, e);
                        }}
                      >
                        <source src={currentMedia} type={guessMime(currentMedia)} />
                        Tu navegador no puede reproducir este video.
                      </video>
                    ) : (
                      <>
                        <Image
                          src={currentMedia}
                          alt={`${car.model} - Image ${currentMediaIndex + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                          <ZoomIn className="w-3 h-3" />
                          Zoom
                        </div>
                      </>
                    )
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                      Sin medios
                    </div>
                  )}
                </div>

                {mediaList.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePrevMedia}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                      aria-label="Anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNextMedia}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                      aria-label="Siguiente"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>

              {mediaList.length > 0 && (
                <div ref={scrollRef} className="flex space-x-2 overflow-x-auto pb-2">
                  {mediaList.map((media, idx) => {
                    const thumbIsVideo = isVideo(media);
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentMediaIndex(idx)}
                        className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                          currentMediaIndex === idx
                            ? "border-red-600"
                            : "border-transparent"
                        }`}
                        aria-label={`Ver medio ${idx + 1}`}
                      >
                        {thumbIsVideo ? (
                          <video
                            src={media}
                            muted
                            preload="metadata"
                            playsInline
                            className="object-cover w-full h-full bg-black"
                            onError={(e) =>
                              console.error("❌ Error thumbnail video:", media, e)
                            }
                          />
                        ) : (
                          <Image
                            src={media}
                            alt={`${car.model} thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Info del auto */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {car.price ? formatPrice(car.price) : ""}
                </div>
                <div className="space-y-2 divide-y divide-gray-200">
                  <div className="grid grid-cols-2 py-2">
                    <span className="text-gray-600 font-medium">Color:</span>
                    <span>{car.color}</span>
                  </div>
                  <div className="grid grid-cols-2 py-2">
                    <span className="text-gray-600 font-medium">Combustible:</span>
                    <span>{car.fuelType}</span>
                  </div>
                  <div className="grid grid-cols-2 py-2">
                    <span className="text-gray-600 font-medium">Kilometraje:</span>
                    <span>{car.mileage ? formatMileage(car.mileage) : ""}</span>
                  </div>
                  <div className="grid grid-cols-2 py-2">
                    <span className="text-gray-600 font-medium">Transmisión:</span>
                    <span>{car.transmission}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Descripción:</h3>
                <p className="text-gray-600">{car.description}</p>
              </div>

              <div className="pt-4">
                <Button
                  asChild
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <a
                    href={`https://wa.me/5491159456142?text=${encodeURIComponent(
                      `Hola! Estoy interesado en el ${car.brand} ${car.model}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Contactar por WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal zoom */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-black">
          <DialogTitle className="sr-only">Zoom</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoomOpen(false)}
            className="absolute right-4 top-4 z-50 text-white"
            aria-label="Cerrar zoom"
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="relative w-full h-[80vh] flex items-center justify-center">
            {currentIsVideo ? (
              <video
                controls
                autoPlay
                preload="metadata"
                playsInline
                className="h-full w-full object-contain bg-black"
                onError={(e) => {
                  console.error("❌ Error reproduciendo video (zoom):", currentMedia, e);
                }}
              >
                <source src={currentMedia} type={guessMime(currentMedia)} />
                Tu navegador no puede reproducir este video.
              </video>
            ) : (
              <Image
                src={currentMedia || "/placeholder.svg"}
                alt="Zoom"
                fill
                className="object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
