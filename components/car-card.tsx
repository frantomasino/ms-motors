"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CarType } from "@/types";
import { ChevronLeft, ChevronRight, Fuel, Settings2, MessageCircle } from "lucide-react";
import { carSlug } from "@/lib/slug";
import { usableCarPhotos } from "@/lib/photo-config";

function gallery(car: CarType) {
  return usableCarPhotos(car.images);
}

export default function CarCard({ car }: { car: CarType }) {
  const photos = gallery(car);
  const [index, setIndex] = useState(0);
  const current = photos[index] ?? photos[0];
  const count = photos.length;
  const slug = carSlug(car);
  const touchX = useRef<number | null>(null);
  const swiped = useRef(false);

  const formatPrice = (p: number) => `USD ${new Intl.NumberFormat("es-AR").format(p)}`;
  const formatMileage = (m: number) => `${new Intl.NumberFormat("es-AR").format(m)} km`;

  const waHref = `https://wa.me/5491159456142?text=${encodeURIComponent(
    `Hola! Me interesa el ${car.brand} ${car.model} ${car.year} (${formatPrice(car.price)}). ¿Está disponible?`
  )}`;

  function go(dir: -1 | 1) {
    if (count < 2) return;
    setIndex((i) => (i + dir + count) % count);
  }

  function onArrow(e: React.MouseEvent, dir: -1 | 1) {
    e.preventDefault();
    e.stopPropagation();
    go(dir);
  }

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100/90 shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:shadow-[0_18px_44px_rgba(16,24,40,0.12)] hover:-translate-y-1 transition-all duration-300">
      <div
        className="relative aspect-[4/3] overflow-hidden bg-neutral-100"
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
          swiped.current = false;
        }}
        onTouchEnd={(e) => {
          if (touchX.current == null || count < 2) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) {
            swiped.current = true;
            go(dx < 0 ? 1 : -1);
          }
          touchX.current = null;
        }}
      >
        <Link
          href={`/autos/${slug}`}
          className="absolute inset-0"
          onClick={(e) => {
            if (swiped.current) {
              e.preventDefault();
              swiped.current = false;
            }
          }}
        >
          {current ? (
            <Image
              src={current}
              alt={`${car.brand} ${car.model} ${car.year}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
              <span className="text-xs font-medium text-gray-400">Fotos pronto</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />
        </Link>

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={(e) => onArrow(e, -1)}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 h-8 w-8 rounded-full bg-black/55 hover:bg-black/75 text-white flex items-center justify-center"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Foto siguiente"
              onClick={(e) => onArrow(e, 1)}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 h-8 w-8 rounded-full bg-black/55 hover:bg-black/75 text-white flex items-center justify-center"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute top-3 right-3 z-10 bg-black/50 backdrop-blur-sm text-white text-[11px] tabular-nums px-2 py-1 rounded-lg pointer-events-none">
              {index + 1}/{count}
            </div>
          </>
        )}

        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between gap-3 pointer-events-none">
          <p className="font-title text-2xl text-white tabular-nums tracking-tight drop-shadow-sm">
            {formatPrice(car.price)}
          </p>
          {count > 1 && count <= 10 && (
            <div className="flex justify-end gap-1 pb-1.5">
              {photos.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i === index ? "w-4 bg-white" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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
