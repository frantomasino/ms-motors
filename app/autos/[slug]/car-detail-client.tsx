"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MessageCircle, Share2, Copy, Check, ArrowLeft, Calendar, Gauge, Fuel, Settings2, Palette, BadgeCheck } from "lucide-react";
import type { CarType } from "@/types";

function isVideo(u?: string) {
  if (!u) return false;
  return /\.(mp4|mov|webm|m4v)$/i.test(u.split("?")[0]);
}

export default function CarDetailClient({ car, mediaList }: { car: CarType; mediaList: string[] }) {
  const [current, setCurrent] = useState(0);
  const [copied, setCopied] = useState(false);

  const prev = () => setCurrent(i => (i === 0 ? mediaList.length - 1 : i - 1));
  const next = () => setCurrent(i => (i === mediaList.length - 1 ? 0 : i + 1));

  const formatPrice = (p: number) => `USD ${new Intl.NumberFormat("es-AR").format(p)}`;
  const formatMileage = (m: number) => `${new Intl.NumberFormat("es-AR").format(m)} km`;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const waText = `Hola! Me interesa el ${car.brand} ${car.model} ${car.year} (${formatPrice(car.price)}). ¿Está disponible? ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `${car.brand} ${car.model} ${car.year}`, url: shareUrl });
    } else {
      handleCopy();
    }
  };

  const specs = [
    { icon: Calendar, label: "Año", value: String(car.year) },
    { icon: Gauge, label: "Kilometraje", value: formatMileage(car.mileage) },
    { icon: Fuel, label: "Combustible", value: car.fuelType },
    { icon: Settings2, label: "Transmisión", value: car.transmission },
    { icon: Palette, label: "Color", value: car.color },
  ];

  const currentMedia = mediaList[current] ?? "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/#catalog" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-full transition-all">
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "¡Copiado!" : "Copiar link"}
            </button>
            <button onClick={handleShare}
              className="flex items-center gap-1.5 text-xs text-white bg-gray-900 hover:bg-gray-800 px-3 py-1.5 rounded-full transition-all">
              <Share2 className="h-3.5 w-3.5" />
              Compartir
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Galería */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
              {currentMedia && !isVideo(currentMedia) ? (
                <Image
                  src={currentMedia}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  priority={current === 0}
                  className="object-cover"
                />
              ) : currentMedia && isVideo(currentMedia) ? (
                <video controls playsInline className="w-full h-full object-contain bg-black">
                  <source src={currentMedia} />
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">Sin imagen</div>
              )}

              {mediaList.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {current + 1} / {mediaList.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {mediaList.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {mediaList.map((m, i) => (
                  <button key={i} onClick={() => setCurrent(i)}
                    className={`relative h-16 w-20 shrink-0 rounded-xl overflow-hidden transition-all ${i === current ? "ring-2 ring-gray-900" : "opacity-60 hover:opacity-100"}`}>
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
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{car.brand}</p>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">{car.model}</h1>
              <p className="text-3xl font-bold text-red-600 mt-2">{formatPrice(car.price)}</p>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full w-fit">
              <BadgeCheck className="h-4 w-4 text-green-500" />
              <span className="text-xs font-semibold text-green-700">Documentación en orden</span>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Icon className="h-4 w-4 text-gray-300" />{label}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>

            {/* Descripción */}
            {car.description && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Descripción</p>
                <p className="text-sm text-gray-600 leading-relaxed">{car.description}</p>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col gap-2">
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
      </div>
    </div>
  );
}