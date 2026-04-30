"use client";

import Image from "next/image";
import Link from "next/link";
import type { CarType } from "@/types";
import { Gauge, Fuel, Settings2, MessageCircle, Images, BadgeCheck, Palette, Share2 } from "lucide-react";

interface CarCardProps {
  car: CarType;
  onViewDetails: () => void;
}

function slugify(brand: string, model: string, year: number) {
  return `${brand}-${model}-${year}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CarCard({ car, onViewDetails }: CarCardProps) {
  const validImages = car.images?.filter(img => img && !img.includes(".mp4")) || [];
  const firstValidImage = validImages[0] || "/placeholder.svg";
  const photoCount = validImages.length;

  const formatPrice = (p: number) => `USD ${new Intl.NumberFormat("es-AR").format(p)}`;
  const formatMileage = (m: number) => `${new Intl.NumberFormat("es-AR").format(m)} km`;

  const slug = slugify(car.brand, car.model, car.year);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/autos/${slug}`;
    if (navigator.share) {
      navigator.share({ title: `${car.brand} ${car.model} ${car.year}`, url });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">

      {/* Imagen */}
      <Link href={`/autos/${slug}`} className="relative h-48 sm:h-52 overflow-hidden bg-gray-100 block">
        <Image
          src={firstValidImage}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

        {/* Precio — arriba derecha */}
        <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-xl tracking-tight">
          {formatPrice(car.price)}
        </div>

        {/* Año — arriba izquierda */}
        <div className="absolute top-3 left-3 bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-lg">
          {car.year}
        </div>

        {/* Fotos — abajo izquierda */}
        {photoCount > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
            <Images className="h-3 w-3" />
            {photoCount} fotos
          </div>
        )}
      </Link>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Marca + Modelo + Docs OK + Compartir */}
        <Link href={`/autos/${slug}`} className="block">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{car.brand}</p>
              <h3 className="text-base font-bold text-gray-900 leading-tight mt-0.5 group-hover:text-red-600 transition-colors">{car.model}</h3>
            </div>
            {/* Docs OK + compartir juntos */}
            <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
              <div className="flex items-center gap-1 bg-green-50 border border-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                <BadgeCheck className="h-3 w-3" />
                Docs OK
              </div>
              <button
                onClick={handleShare}
                className="flex items-center justify-center text-gray-300 hover:text-gray-600 transition-colors duration-200"
                title="Compartir"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </Link>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
          {[
            { icon: Gauge,    value: formatMileage(car.mileage) },
            { icon: Fuel,     value: car.fuelType },
            { icon: Settings2, value: car.transmission },
            { icon: Palette,  value: car.color },
          ].map(({ icon: Icon, value }, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 text-gray-300 shrink-0" />
              <span className="text-xs text-gray-500 truncate">{value}</span>
            </div>
          ))}
        </div>

        <div className="h-px bg-gray-100" />

        {/* Botones */}
        <div className="flex gap-2">
          <Link
            href={`/autos/${slug}`}
            className="flex-1 flex items-center justify-center text-sm font-medium text-gray-600 border border-gray-200 hover:border-gray-900 hover:text-gray-900 rounded-xl py-2.5 transition-all duration-200"
          >
            Ver detalles
          </Link>
          <a
            href={`https://wa.me/5491159456142?text=${encodeURIComponent(`Hola! Me interesa el ${car.brand} ${car.model} ${car.year} (${formatPrice(car.price)}). ¿Está disponible?`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#1ebe5d] rounded-xl py-2.5 transition-all duration-200"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}