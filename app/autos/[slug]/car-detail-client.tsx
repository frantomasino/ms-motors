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
import SiteHeader from "@/components/site-header";
import { usableCarPhotos } from "@/lib/photo-config";

function isVideo(u?: string) {
  if (!u) return false;
  return /\.(mp4|mov|webm|m4v)$/i.test(u.split("?")[0]);
}

function RelatedCard({ car }: { car: CarType }) {
  const firstImage = usableCarPhotos(car.images)[0];
  const formatPrice = (p: number) => `USD ${new Intl.NumberFormat("es-AR").format(p)}`;
  const slug = carSlug(car);

  return (
    <Link href={`/autos/${slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {firstImage ? (
          <Image src={firstImage} alt={`${car.brand} ${car.model}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">Fotos pronto</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <p className="font-title text-white text-lg tabular-nums">{formatPrice(car.price)}</p>
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
    <div className="min-h-screen bg-surface pb-28 lg:pb-0">
      <SiteHeader />

      <div className="container mx-auto px-4 pt-20 sm:pt-24 pb-8 max-w-6xl">
        <div className="flex items-center justify-between mb-5">
          <Link href="/#catalog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-ink transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>
          <button onClick={handleShare}
            className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-brand transition-colors">
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
            {copied ? "Link copiado" : "Compartir"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3] shadow-[0_12px_40px_rgba(16,24,40,0.12)]">
              {currentMedia && !isVideo(currentMedia) ? (
                <Image src={currentMedia} alt={`${car.brand} ${car.model}`} fill priority={current === 0} className="object-cover" />
              ) : currentMedia && isVideo(currentMedia) ? (
                <video controls playsInline className="w-full h-full object-contain bg-black">
                  <source src={currentMedia} />
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-gray-500 text-sm">Fotos pronto</div>
              )}

              {mediaList.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm tabular-nums">
                    {current + 1} / {mediaList.length}
                  </div>
                </>
              )}
            </div>

            {mediaList.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {mediaList.map((m, i) => (
                  <button key={i} onClick={() => setCurrent(i)}
                    className={`relative h-14 w-20 sm:h-16 sm:w-24 shrink-0 rounded-xl overflow-hidden transition-all ${i === current ? "ring-2 ring-brand ring-offset-2" : "opacity-50 hover:opacity-80"}`}>
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

          <div className="flex flex-col gap-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">{car.brand}</p>
              <h1 className="font-title text-3xl sm:text-5xl text-ink mt-1">{car.model}</h1>
              <p className="text-sm text-gray-500 mt-1.5">{car.year} · {formatMileage(car.mileage)}</p>
              <p className="font-title text-3xl sm:text-4xl text-brand mt-3 tabular-nums">{formatPrice(car.price)}</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
                <BadgeCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-800">Documentación en orden</span>
              </div>
              {car.color && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-full">
                  <Palette className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-600">{car.color}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col gap-0.5 bg-white rounded-2xl border border-gray-100 px-4 py-3">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                    <Icon className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                    {label}
                  </div>
                  <span className="text-sm font-semibold text-ink">{value}</span>
                </div>
              ))}
            </div>

            {car.description && (
              <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
                <p className="text-[11px] text-gray-400 uppercase tracking-[0.18em] mb-2">Descripción</p>
                <p className="text-sm text-gray-600 leading-relaxed">{car.description}</p>
              </div>
            )}

            <div className="hidden lg:flex flex-col gap-2">
              <a href={`https://wa.me/5491159456142?text=${encodeURIComponent(waText)}`}
                target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-4 rounded-2xl transition-all hover:scale-[1.01] shadow-lg shadow-green-100 text-sm">
                <MessageCircle className="h-5 w-5" />
                Consultar por WhatsApp
              </a>
              <p className="text-center text-xs text-gray-400">Respuesta inmediata · Atención personalizada</p>
            </div>
          </div>
        </div>

        {relatedCars.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-title text-2xl sm:text-3xl text-ink">También te puede interesar</h2>
              <Link href="/#catalog" className="text-sm text-brand hover:text-red-700 font-medium transition-colors">
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {relatedCars.map(related => (
                <RelatedCard key={related.id} car={related} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3">
        <a href={`https://wa.me/5491159456142?text=${encodeURIComponent(waText)}`}
          target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-3.5 rounded-2xl transition-all text-sm">
          <MessageCircle className="h-5 w-5" />
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
