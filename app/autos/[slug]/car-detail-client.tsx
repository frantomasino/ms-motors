"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, MessageCircle,
  Share2, Check, ArrowLeft,
  Calendar, Gauge, Fuel, Settings2, Palette, BadgeCheck
} from "lucide-react";
import type { CarType } from "@/types";
import { carSlug } from "@/lib/slug";

function isVideo(u?: string) {
  if (!u) return false;
  return /\.(mp4|mov|webm|m4v)$/i.test(u.split("?")[0]);
}

function RelatedCard({ car }: { car: CarType }) {
  const firstImage = car.images?.find(img => img && !img.includes(".mp4")) || "/placeholder.svg";
  const formatPrice = (p: number) => `USD ${new Intl.NumberFormat("es-AR").format(p)}`;
  const slug = carSlug(car);

  return (
    <Link href={`/autos/${slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="relative h-36 overflow-hidden bg-gray-100">
        <Image src={firstImage} alt={`${car.brand} ${car.model}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg">
          {formatPrice(car.price)}
        </div>
      </div>
      <div className="p-3">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{car.brand}</p>
        <p className="font-title text-lg text-ink mt-0.5 group-hover:text-brand transition-colors">{car.model}</p>
        <p className="text-xs text-gray-400 mt-1">{car.year} · {new Intl.NumberFormat("es-AR").format(car.mileage)} km</p>
      </div>
    </Link>
  );
}

export default function CarDetailClient({
  car,
  mediaList,
  relatedCars = [],
}: {
  car: CarType;
  mediaList: string[];
  relatedCars?: CarType[];
}) {
  const [current, setCurrent] = useState(0);
  const [copied, setCopied] = useState(false);

  const prev = () => setCurrent(i => (i === 0 ? mediaList.length - 1 : i - 1));
  const next = () => setCurrent(i => (i === mediaList.length - 1 ? 0 : i + 1));

  const formatPrice = (p: number) => `USD ${new Intl.NumberFormat("es-AR").format(p)}`;
  const formatMileage = (m: number) => `${new Intl.NumberFormat("es-AR").format(m)} km`;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const waText = `Hola! Me interesa el ${car.brand} ${car.model} ${car.year} (${formatPrice(car.price)}). ¿Está disponible? ${shareUrl}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `${car.brand} ${car.model} ${car.year}`, url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

const specs = [
  { icon: Calendar,  label: "Año",        value: String(car.year) },
  { icon: Gauge,     label: "Kilometraje", value: formatMileage(car.mileage) },
  { icon: Fuel,      label: "Combustible", value: car.fuelType },
  { icon: Settings2, label: "Transmisión", value: car.transmission },
];

  const currentMedia = mediaList[current] ?? "";

  return (
    <div className="min-h-screen bg-gray-50 pb-28 lg:pb-0">

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="brand-stripe" />
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/#catalog"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-ink transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Volver al catálogo</span>
            <span className="sm:hidden">Volver</span>
          </Link>
          <Link href="/" className="hidden sm:flex items-center gap-2">
            <span className="font-title text-lg tracking-tight text-ink">MS<span className="text-brand"> Motors</span></span>
          </Link>
          <button onClick={handleShare}
            className="flex items-center gap-2 text-sm font-medium text-white bg-ink hover:bg-black px-3 sm:px-4 py-2 rounded-full transition-all">
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Share2 className="h-4 w-4" />}
            <span className="hidden sm:inline">{copied ? "¡Copiado!" : "Compartir"}</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-5 sm:py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

          {/* Galería */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
              {currentMedia && !isVideo(currentMedia) ? (
                <Image src={currentMedia} alt={`${car.brand} ${car.model}`} fill priority={current === 0} className="object-cover" />
              ) : currentMedia && isVideo(currentMedia) ? (
                <video controls playsInline className="w-full h-full object-contain bg-black">
                  <source src={currentMedia} />
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">Sin imagen</div>
              )}

              {mediaList.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all">
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {current + 1} / {mediaList.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {mediaList.length > 1 && (
              <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1">
                {mediaList.map((m, i) => (
                  <button key={i} onClick={() => setCurrent(i)}
                    className={`relative h-14 w-20 sm:h-16 sm:w-24 shrink-0 rounded-xl overflow-hidden transition-all ${i === current ? "ring-2 ring-gray-900" : "opacity-50 hover:opacity-80"}`}>
                    {isVideo(m) ? (
                      <video src={m} muted preload="metadata" className="w-full h-full object-cover" />
                    ) : (
                      <Image src={m} alt={`foto ${i + 1}`} fill className="object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">{car.brand}</p>
              <h1 className="font-title text-3xl sm:text-4xl text-ink mt-1">{car.model}</h1>
              <p className="font-title text-2xl sm:text-3xl text-brand mt-2 tabular-nums">{formatPrice(car.price)}</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
    <BadgeCheck className="h-4 w-4 text-green-500" />
    <span className="text-xs font-semibold text-green-700">Documentación en orden</span>
  </div>
  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full">
    <Palette className="h-3.5 w-3.5 text-gray-400" />
    <span className="text-xs font-medium text-gray-600">{car.color}</span>
  </div>
</div>

            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-0 sm:bg-white sm:rounded-2xl sm:border sm:border-gray-100 sm:divide-y sm:divide-gray-50">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col gap-0.5 bg-white rounded-xl border border-gray-100 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:rounded-none sm:border-0 sm:px-5 sm:py-3.5">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs sm:text-sm">
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-300 shrink-0" />
                    {label}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>

            {car.description && (
              <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Descripción</p>
                <p className="text-sm text-gray-600 leading-relaxed">{car.description}</p>
              </div>
            )}

            {/* CTA desktop */}
            <div className="hidden lg:flex flex-col gap-2">
              <a href={`https://wa.me/5491159456142?text=${encodeURIComponent(waText)}`}
                target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.01] shadow-lg shadow-green-100 text-sm">
                <MessageCircle className="h-5 w-5" />
                Consultar por WhatsApp
              </a>
              <p className="text-center text-xs text-gray-400">Respuesta inmediata · Atención personalizada</p>
            </div>
          </div>
        </div>

        {/* Autos relacionados */}
        {relatedCars.length > 0 && (
          <div className="mt-10 sm:mt-14">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-title text-xl sm:text-2xl text-ink">También te puede interesar</h2>
              {/* ✅ Link correcto al catálogo */}
              <button
  onClick={() => { window.location.href = "/#catalog"; }}
  className="text-sm text-brand hover:text-red-700 font-medium transition-colors"
>
  Ver todos →
</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {relatedCars.map(related => (
                <RelatedCard key={related.id} car={related} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA sticky mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-4 py-3 shadow-lg">
        <a href={`https://wa.me/5491159456142?text=${encodeURIComponent(waText)}`}
          target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3.5 rounded-2xl transition-all text-sm shadow-md shadow-green-100">
          <MessageCircle className="h-5 w-5" />
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}