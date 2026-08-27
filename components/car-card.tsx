"use client";

import Image from "next/image";
import Link from "next/link";
import type { CarType } from "@/types";
import { Fuel, Settings2, MessageCircle, Images } from "lucide-react";
import { carSlug } from "@/lib/slug";

export default function CarCard({ car }: { car: CarType }) {
  const validImages = car.images?.filter((img) => img && !img.includes(".mp4")) || [];
  const firstValidImage = validImages[0];
  const photoCount = validImages.length;
  const slug = carSlug(car);

  const formatPrice = (p: number) => `USD ${new Intl.NumberFormat("es-AR").format(p)}`;
  const formatMileage = (m: number) => `${new Intl.NumberFormat("es-AR").format(m)} km`;

  const waHref = `https://wa.me/5491159456142?text=${encodeURIComponent(
    `Hola! Me interesa el ${car.brand} ${car.model} ${car.year} (${formatPrice(car.price)}). ¿Está disponible?`
  )}`;

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100/90 shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:shadow-[0_18px_44px_rgba(16,24,40,0.12)] hover:-translate-y-1 transition-all duration-300">
      <Link href={`/autos/${slug}`} className="relative aspect-[4/3] overflow-hidden bg-neutral-100 block">
        {firstValidImage ? (
          <Image
            src={firstValidImage}
            alt={`${car.brand} ${car.model} ${car.year}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {photoCount > 1 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/45 backdrop-blur-sm text-white text-[11px] px-2 py-1 rounded-lg">
            <Images className="h-3 w-3" />
            {photoCount}
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <p className="font-title text-2xl text-white tabular-nums tracking-tight drop-shadow-sm">
            {formatPrice(car.price)}
          </p>
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-4 gap-3">
        <Link href={`/autos/${slug}`} className="block">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.18em]">{car.brand}</p>
          <h3 className="font-title text-[1.35rem] text-ink leading-tight mt-0.5 group-hover:text-brand transition-colors">
            {car.model}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {car.year}
            <span className="mx-1.5 text-gray-300">·</span>
            {formatMileage(car.mileage)}
          </p>
        </Link>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5 text-gray-300 shrink-0" />
            {car.fuelType}
          </span>
          <span className="inline-flex items-center gap-1">
            <Settings2 className="h-3.5 w-3.5 text-gray-300 shrink-0" />
            {car.transmission}
          </span>
          {car.color ? <span className="truncate">{car.color}</span> : null}
        </div>

        <div className="mt-auto pt-1 flex gap-2">
          <Link
            href={`/autos/${slug}`}
            className="flex-1 flex items-center justify-center text-sm font-medium text-ink border border-gray-200 hover:border-ink rounded-xl py-2.5 transition-all"
          >
            Ver auto
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#1ebe5d] rounded-xl py-2.5 transition-all"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
