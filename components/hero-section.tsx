"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import AnimatedCounter from "@/components/animated-counter";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0c0e12] text-white min-h-[100svh] flex flex-col justify-end">

      {/* Imagen de fondo */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/banner-2.jpg')" }} />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e12] via-[#0c0e12]/70 to-[#0c0e12]/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c0e12]/80 via-[#0c0e12]/30 to-transparent" />
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-red-600 to-transparent opacity-60" />

      {/* Contenido — pegado al fondo con padding generoso */}
      <div className="relative px-5 sm:px-10 lg:px-16 pt-20 pb-10 sm:pb-14 max-w-2xl">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs text-white/50 uppercase tracking-widest">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
          MS Motors · Quilmes, Buenos Aires
        </div>

        {/* Título */}
        <h1 className="font-title mb-4 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight">
          El auto que<br />
          <span className="text-red-500">buscabas</span>,<br />
          está acá.
        </h1>

        <p className="font-body mb-7 max-w-md text-sm sm:text-base text-white/50 leading-relaxed">
          Comprá con confianza. Vehículos verificados, atención personalizada y financiación disponible.
        </p>

        {/* CTAs */}
        <div className="flex flex-row gap-2 mb-10 flex-wrap">
          <a href="#catalog">
            <Button size="default"
              className="font-body gap-2 rounded-full bg-red-600 hover:bg-red-700 text-white px-6 shadow-lg shadow-red-900/40 transition-all hover:scale-[1.02] text-sm">
              Ver catálogo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
          <a href="https://wa.me/5491159456142" target="_blank" rel="noopener noreferrer">
            <Button size="default" variant="outline"
              className="font-body gap-2 rounded-full border-white/15 bg-white/5 text-white hover:bg-white hover:text-black backdrop-blur-sm transition-all hover:scale-[1.02] text-sm">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </a>
        </div>

        {/* Stats */}
       

      </div>
    </section>
  );
}