"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Shield, Repeat2, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0c0e12] text-white min-h-[100svh] flex flex-col justify-end">

      {/* Imagen de fondo */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/banner-2.jpg')" }} />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e12] via-[#0c0e12]/60 to-[#0c0e12]/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c0e12]/80 via-[#0c0e12]/30 to-transparent" />
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-red-600 to-transparent opacity-60" />

      {/* Contenido */}
      <div className="relative flex flex-col justify-end flex-1">
        <div className="px-5 sm:px-10 lg:px-16 pb-0 pt-24 max-w-2xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs text-white/50 uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
            MS Motors · Quilmes, Buenos Aires
          </div>

          {/* Título — más pequeño en mobile */}
          <h1 className="font-title mb-4 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight">
            El auto que<br />
            <span className="text-red-500">buscabas</span>,<br />
            está acá.
          </h1>

          <p className="font-body mb-7 max-w-md text-sm sm:text-base text-white/50 leading-relaxed">
            Comprá con confianza. Vehículos verificados, atención personalizada.
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

          {/* Stats — más compactos en mobile */}
          <div className="flex flex-wrap gap-6 pb-8">
            {[
              { value: "100+", label: "Autos vendidos" },
              { value: "5.0 ★", label: "En Google" },
              { value: "5+", label: "Años" },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-xl sm:text-2xl font-bold text-white">{s.value}</p>
                <p className="text-[10px] sm:text-xs text-white/35 uppercase tracking-wider mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strip de features — oculto en mobile, visible en sm+ */}
        <div className="hidden sm:block border-t border-white/5 bg-black/50 backdrop-blur-sm">
          <div className="px-6 sm:px-10 lg:px-16">
            <div className="grid grid-cols-3 divide-x divide-white/5">
              {[
                { icon: Shield, label: "Autos verificados", desc: "Revisados y listos para transferir" },
                { icon: Repeat2, label: "Tomamos tu usado", desc: "Aceptamos permutas como parte de pago" },
                { icon: Star, label: "Atención premium", desc: "Asesoramiento antes y después" },
              ].map(({ icon: Icon, label, desc }, i) => (
                <div key={i} className="flex items-center gap-3 py-4 px-4 sm:px-6">
                  <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-red-500/15 border border-red-500/30">
                    <Icon className="h-4 w-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/90">{label}</p>
                    <p className="text-[10px] text-white/40 mt-0.5 leading-snug hidden lg:block">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}