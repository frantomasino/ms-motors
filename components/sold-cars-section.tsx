"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Calendar, Gauge, ChevronLeft, ChevronRight } from "lucide-react";

interface SoldCar {
  id: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  image: string;
}

// Usá imágenes reales de tu Supabase cuando quieras conectarlo
const SOLD_CARS: SoldCar[] = [
  { id: 1, brand: "Chevrolet", model: "Celta", year: 2012, mileage: 87000, image: "/placeholder.svg" },
  { id: 2, brand: "Ford", model: "Ka", year: 2018, mileage: 52000, image: "/208-1.webp" },
  { id: 3, brand: "Peugeot", model: "208", year: 2020, mileage: 38000, image: "/placeholder.svg" },
  { id: 4, brand: "Toyota", model: "Hilux", year: 2019, mileage: 70000, image: "/placeholder.svg" },
  { id: 5, brand: "Volkswagen", model: "Fox", year: 2016, mileage: 110000, image: "/placeholder.svg" },
  { id: 6, brand: "Nissan", model: "Kicks", year: 2021, mileage: 29000, image: "/placeholder.svg" },
];

function SoldCarCard({ car }: { car: SoldCar }) {
  const fmt = (m: number) => new Intl.NumberFormat("es-AR").format(m);
  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <Image
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          <CheckCircle2 className="h-3 w-3" />
          Vendido
        </div>
      </div>
      <div className="p-4">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{car.brand}</p>
        <h3 className="text-base font-bold text-gray-900 mt-0.5">{car.model}</h3>
        <div className="flex items-center gap-4 mt-2">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="h-3.5 w-3.5" />{car.year}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Gauge className="h-3.5 w-3.5" />{fmt(car.mileage)} km
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SoldCarsSection() {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(SOLD_CARS.length / perPage);
  const visible = SOLD_CARS.slice(page * perPage, page * perPage + perPage);

  return (
    <section id="vendidos" className="bg-gray-50 border-t border-gray-100 py-20 scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-2">Historial</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Autos vendidos</h2>
            <p className="text-gray-400 text-sm mt-1">Vehículos que ya encontraron su nuevo dueño</p>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900 disabled:opacity-25 transition-all">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-400 tabular-nums">{page + 1} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900 disabled:opacity-25 transition-all">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((car) => <SoldCarCard key={car.id} car={car} />)}
        </div>

        <p className="text-center mt-10 text-sm text-gray-400">
          +{SOLD_CARS.length} vehículos vendidos con éxito
        </p>
      </div>
    </section>
  );
}