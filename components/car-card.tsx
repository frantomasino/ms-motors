"use client";

import Image from "next/image";
import type { CarType } from "@/types";
import { Calendar, Gauge, Fuel, Settings2, MessageCircle } from "lucide-react";

interface CarCardProps {
  car: CarType;
  onViewDetails: () => void;
}

export default function CarCard({ car, onViewDetails }: CarCardProps) {
  const firstValidImage = car.images?.find((img) => img && !img.includes(".mp4")) || "/placeholder.svg";
  const formatPrice = (p: number) => `USD ${new Intl.NumberFormat("es-AR").format(p)}`;
  const formatMileage = (m: number) => `${new Intl.NumberFormat("es-AR").format(m)} km`;

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">

      {/* Imagen — clickeable para ver detalles */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100" onClick={onViewDetails}>
        <Image
          src={firstValidImage}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Precio — esquina superior derecha */}
        <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-xl tracking-tight">
          {formatPrice(car.price)}
        </div>

        {/* Año — esquina superior izquierda */}
        <div className="absolute top-3 left-3 bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-lg">
          {car.year}
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Marca + Modelo */}
        <div onClick={onViewDetails}>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{car.brand}</p>
          <h3 className="text-base font-bold text-gray-900 leading-tight mt-0.5">{car.model}</h3>
        </div>

        {/* Specs — 2 columnas */}
        <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
          {[
            { icon: Gauge, value: formatMileage(car.mileage) },
            { icon: Fuel, value: car.fuelType },
            { icon: Settings2, value: car.transmission },
            { icon: Calendar, value: car.color },
          ].map(({ icon: Icon, value }, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 text-gray-300 shrink-0" />
              <span className="text-xs text-gray-500 truncate">{value}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Botones */}
        <div className="flex gap-2">
          <button
            onClick={onViewDetails}
            className="flex-1 text-sm font-medium text-gray-600 border border-gray-200 hover:border-gray-900 hover:text-gray-900 rounded-xl py-2.5 transition-all duration-200"
          >
            Ver detalles
          </button>
          <a
            href={`https://wa.me/5491159456142?text=${encodeURIComponent(`Hola! Me interesa el ${car.brand} ${car.model} ${car.year}`)}`}
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