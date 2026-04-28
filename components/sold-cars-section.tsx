"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle2, Calendar, Gauge, ChevronLeft, ChevronRight, Car, Users } from "lucide-react";
import type { CarType } from "@/types";
import { supabase } from "@/lib/supabase";

import AnimatedCounter from "@/components/animated-counter";

interface SoldCarsSectionProps {
  soldCars: CarType[];
}

function SoldCarCard({ car }: { car: CarType }) {
  const fmt = (m: number) => new Intl.NumberFormat("es-AR").format(m);
  const firstImage = car.images?.find(img => img && !img.includes(".mp4")) || "/placeholder.svg";
  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <Image src={firstImage} alt={`${car.brand} ${car.model}`} fill
          className="object-contain group-hover:scale-105 transition-all duration-500" />
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

function ClientPhotos() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase.storage.from("Msmotors").list("clientes", { limit: 50 });
        console.log("DATA:", data);
        console.log("ERROR:", error);
        if (data) {
          console.log("Archivos encontrados:", data.map(f => f.name));
          const urls = data
            .filter(f => /\.(jpe?g|png|webp)$/i.test(f.name))
            .map(f => {
              const url = supabase.storage.from("Msmotors").getPublicUrl(`clientes/${f.name}`).data.publicUrl;
              console.log("URL generada:", url);
              return url;
            });
          setPhotos(urls);
        }
      } catch(e) {
        console.error("Exception:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {[0,1,2,3,4].map(i => (
        <div key={i} className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
      ))}
    </div>
  );

  if (photos.length === 0) return (
    <p className="text-center text-gray-400 py-10">No hay fotos disponibles.</p>
  );

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {photos.map((url, i) => (
          <div key={i}
            onClick={() => setSelected(url)}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <Image src={url} alt={`Cliente ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">Ver foto</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}>
          <div className="relative max-w-2xl w-full aspect-square rounded-2xl overflow-hidden">
            <Image src={selected} alt="Cliente" fill className="object-cover" />
          </div>
          <button onClick={() => setSelected(null)}
            className="absolute top-5 right-5 text-white/60 hover:text-white text-3xl leading-none">×</button>
        </div>
      )}
    </>
  );
}

export default function SoldCarsSection({ soldCars = [] }: SoldCarsSectionProps) {
  const [tab, setTab] = useState<"vehiculos" | "clientes">(soldCars.length === 0 ? "clientes" : "vehiculos");
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(soldCars.length / perPage);
  const visible = soldCars.slice(page * perPage, page * perPage + perPage);

  return (
    <section id="vendidos" className="bg-gray-50 border-t border-gray-100 py-20 scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-2">Historial</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {tab === "clientes" ? "Clientes felices" : "Autos vendidos"}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {tab === "clientes" ? "Personas que confiaron en nosotros" : "Vehículos que ya encontraron su nuevo dueño"}
            </p>
          </div>

          {/* Toggle — solo muestra Vehículos si hay autos vendidos */}
          <div className="flex items-center gap-1 p-1 bg-white border border-gray-100 rounded-xl shadow-sm w-fit">
            {soldCars.length > 0 && (
              <button onClick={() => setTab("vehiculos")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === "vehiculos" ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}>
                <Car className="h-4 w-4" />
                Vehículos
              </button>
            )}
            <button onClick={() => setTab("clientes")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === "clientes" ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}>
              <Users className="h-4 w-4" />
              Clientes
            </button>
          </div>
        </div>

        {/* Contenido */}
        {tab === "vehiculos" ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visible.map(car => <SoldCarCard key={car.id} car={car} />)}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900 disabled:opacity-25 transition-all">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-400">{page + 1} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900 disabled:opacity-25 transition-all">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
            <p className="text-center mt-6 text-sm text-gray-400">
          +<AnimatedCounter target={soldCars.length} /> vehículos vendidos con éxito
        </p>
          </>
        ) : (
          <ClientPhotos />
        )}
      </div>
    </section>
  );
}