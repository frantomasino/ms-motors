"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Calendar, Gauge, Car, Users, ChevronDown } from "lucide-react";
import type { CarType } from "@/types";
import AnimatedCounter from "@/components/animated-counter";

interface SoldCarsSectionProps {
  soldCars: CarType[];
  clientPhotos?: string[];
}

function SoldCarCard({ car }: { car: CarType }) {
  const fmt = (m: number) => new Intl.NumberFormat("es-AR").format(m);
  const firstImage = car.images?.find(img => img && !img.includes(".mp4") && !img.includes("placeholder.svg") && !img.includes("/proximamente/"));
  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative h-44 sm:h-52 overflow-hidden bg-gray-100">
        {firstImage ? (
          <Image src={firstImage} alt={`${car.brand} ${car.model}`} fill
            className="object-cover group-hover:scale-105 transition-all duration-500" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-ink/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          <CheckCircle2 className="h-3 w-3" />
          Vendido
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.18em]">{car.brand}</p>
        <h3 className="font-title text-base sm:text-lg text-ink mt-0.5">{car.model}</h3>
        <div className="flex items-center gap-3 mt-1.5 min-w-0">
          <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
            <Calendar className="h-3.5 w-3.5" />{car.year}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400 min-w-0 truncate">
            <Gauge className="h-3.5 w-3.5 shrink-0" />{fmt(car.mileage)} km
          </span>
        </div>
      </div>
    </div>
  );
}

function ClientPhotos({ photos }: { photos: string[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const INITIAL_COUNT = 6;
  const visible = showAll ? photos : photos.slice(0, INITIAL_COUNT);

  if (photos.length === 0) return (
    <p className="text-center text-sm text-gray-400 py-12">Pronto vamos a mostrar más entregas.</p>
  );

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {visible.map((url, i) => (
          <div key={i} onClick={() => setSelected(url)}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <Image src={url} alt={`Cliente ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {photos.length > INITIAL_COUNT && (
        <div className="text-center mt-6">
          <button onClick={() => setShowAll(v => !v)}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-400 px-5 py-2.5 rounded-full transition-all">
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} />
            {showAll ? "Ver menos" : `Ver todas las fotos (${photos.length})`}
          </button>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]"
          onClick={() => setSelected(null)}>
          <div className="relative max-w-2xl w-full aspect-square rounded-2xl overflow-hidden">
            <Image src={selected} alt="Cliente" fill className="object-cover" />
          </div>
          <button onClick={() => setSelected(null)}
            className="absolute top-[max(1.25rem,env(safe-area-inset-top))] right-4 h-11 w-11 flex items-center justify-center text-white/80 hover:text-white text-3xl leading-none">×</button>
        </div>
      )}
    </>
  );
}

export default function SoldCarsSection({ soldCars = [], clientPhotos = [] }: SoldCarsSectionProps) {
  const [tab, setTab] = useState<"vehiculos" | "clientes">(soldCars.length === 0 ? "clientes" : "vehiculos");
  const [showAll, setShowAll] = useState(false);

  const INITIAL_MOBILE = 2;
  const INITIAL_DESKTOP = 3;

  return (
    <section id="vendidos" className="bg-gray-50 border-t border-gray-100 py-12 sm:py-20 scroll-mt-[calc(5.25rem+env(safe-area-inset-top))]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-2">Historial</p>
            <h2 className="font-title text-[1.75rem] sm:text-4xl lg:text-5xl text-ink">
              {tab === "clientes" ? "Clientes felices" : "Autos vendidos"}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {tab === "clientes" ? "Personas que confiaron en nosotros" : "Vehículos que ya encontraron su nuevo dueño"}
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-white border border-gray-100 rounded-xl shadow-sm w-fit">
            {soldCars.length > 0 && (
              <button onClick={() => { setTab("vehiculos"); setShowAll(false); }}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  tab === "vehiculos" ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}>
                <Car className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Vehículos
              </button>
            )}
            <button onClick={() => { setTab("clientes"); setShowAll(false); }}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                tab === "clientes" ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}>
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Clientes
            </button>
          </div>
        </div>

        {/* Vehículos */}
        {tab === "vehiculos" && (
          <>
            {/* Mobile — 2 iniciales, expandible */}
            <div className="sm:hidden grid grid-cols-2 gap-3">
              {(showAll ? soldCars : soldCars.slice(0, INITIAL_MOBILE)).map(car => (
                <SoldCarCard key={car.id} car={car} />
              ))}
            </div>

            {/* Desktop — 3 iniciales, expandible */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(showAll ? soldCars : soldCars.slice(0, INITIAL_DESKTOP)).map(car => (
                <SoldCarCard key={car.id} car={car} />
              ))}
            </div>

            {/* Ver más / Ver menos */}
            {soldCars.length > INITIAL_MOBILE && (
              <div className="text-center mt-6">
                <button onClick={() => setShowAll(v => !v)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-400 px-5 py-2.5 rounded-full transition-all">
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} />
                  {showAll ? "Ver menos" : `Ver todos (${soldCars.length})`}
                </button>
              </div>
            )}

            <p className="text-center mt-5 text-sm text-gray-400">
              +<AnimatedCounter target={soldCars.length} /> vehículos vendidos con éxito
            </p>
          </>
        )}

        {/* Clientes */}
        {tab === "clientes" && <ClientPhotos photos={clientPhotos} />}
      </div>
    </section>
  );
}