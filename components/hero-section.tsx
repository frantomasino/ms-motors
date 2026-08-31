"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-[#0c0e12] text-white min-h-[78svh] sm:min-h-[100svh] flex flex-col justify-end overflow-hidden">

      {/* Imagen mobile — se muestra solo en pantallas chicas */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat sm:hidden"
        style={{ backgroundImage: "url('/banners-mobile-2.webp')" }}
      />

      {/* Imagen desktop — se muestra en sm en adelante */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden sm:block"
        style={{ backgroundImage: "url('/banners-3.webp')" }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e12] via-[#0c0e12]/60 to-[#0c0e12]/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c0e12]/80 via-[#0c0e12]/30 to-transparent" />
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-red-600 to-transparent opacity-60" />

      {/* Contenido */}
      <div className="relative px-5 sm:px-10 lg:px-16 pt-[calc(5.5rem+env(safe-area-inset-top))] pb-[max(2.75rem,calc(1.5rem+env(safe-area-inset-bottom)))] sm:pb-20 max-w-2xl">

        {/* Badge */}
        <div className="inline-flex max-w-full items-center gap-2 mb-3 sm:mb-4 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs text-white/50 uppercase tracking-[0.14em] sm:tracking-widest">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="truncate">MS Motors · Quilmes</span>
        </div>

        {/* Título */}
        <h1 className="font-title mb-3 sm:mb-5 text-[2.15rem] sm:text-6xl lg:text-7xl xl:text-[5.25rem] leading-[0.95] tracking-tight">
          El auto que<br />
          <span className="text-brand">buscabas</span>,<br />
          está acá.
        </h1>

        <p className="font-body mb-6 sm:mb-8 max-w-md text-[13px] sm:text-base text-white/55 leading-relaxed">
          Comprá con confianza. Vehículos verificados, atención personalizada y financiación disponible.
        </p>

        {/* CTAs */}
        <div className="flex flex-row gap-2 flex-wrap">
          <a href="#catalog" className="min-w-0 flex-1 sm:flex-none">
            <Button size="default"
              className="font-body w-full gap-2 rounded-full bg-brand hover:bg-red-700 text-white h-11 px-5 shadow-lg shadow-red-900/40 transition-all hover:scale-[1.02] text-sm">
              Ver catálogo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
          <a href="https://wa.me/5491159456142" target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 sm:flex-none">
            <Button size="default" variant="outline"
              className="font-body w-full gap-2 rounded-full border-white/15 bg-white/5 text-white hover:bg-white hover:text-black backdrop-blur-sm h-11 px-5 transition-all hover:scale-[1.02] text-sm">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
