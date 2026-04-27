"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Shield, Repeat2, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0c0e12] text-white" style={{ minHeight: "92vh" }}>

      {/* Imagen de fondo */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/banner-2.jpg')" }} />

      {/* Overlays en capas para máximo drama */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e12] via-[#0c0e12]/50 to-[#0c0e12]/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c0e12]/90 via-[#0c0e12]/40 to-transparent" />

      {/* Línea roja izquierda */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-red-600 to-transparent opacity-70" />

      {/* Contenido */}
      <div className="relative flex flex-col justify-end h-full"
        style={{ minHeight: "calc(92vh - 0px)" }}>
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 pb-0 pt-32">
          <div className="max-w-2xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/50 uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              MS Motors · Quilmes, Buenos Aires
            </div>

            {/* Título */}
            <h1 className="font-title mb-5 text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight">
              El auto que<br />
              <span className="text-red-500">buscabas</span>,<br />
              está acá.
            </h1>

            <p className="font-body mb-8 max-w-md text-base text-white/50 leading-relaxed">
              Comprá con confianza. Vehículos verificados, atención personalizada y financiación disponible.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-14">
              <a href="#catalog">
                <Button size="lg"
                  className="font-body gap-2 rounded-full bg-red-600 hover:bg-red-700 text-white px-8 shadow-lg shadow-red-900/40 transition-all hover:scale-[1.02]">
                  Ver catálogo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a href="https://wa.me/5491159456142" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline"
                  className="font-body gap-2 rounded-full border-white/15 bg-white/5 text-white hover:bg-white hover:text-black backdrop-blur-sm transition-all hover:scale-[1.02]">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pb-10">
              {[
                { value: "200+", label: "Autos vendidos" },
                { value: "5.0 ★", label: "En Google" },
                { value: "10+", label: "Años de experiencia" },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-white/50 uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strip de features pegado al fondo del hero */}
        <div className="border-t border-white/5 bg-black/60 backdrop-blur-md">
          <div className="container mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
              {[
                { icon: Shield, label: "Autos verificados", desc: "Revisados y listos para transferir" },
                { icon: Repeat2, label: "Tomamos tu usado", desc: "Aceptamos permutas como parte de pago" },
                { icon: Star, label: "Atención premium", desc: "Asesoramiento antes y después de la compra" },
              ].map(({ icon: Icon, label, desc }, i) => (
                <div key={i} className="flex items-center gap-4 py-5 px-4 sm:px-6">
                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15 border border-red-500/30">
                    <Icon className="h-4 w-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/90">{label}</p>
                    <p className="text-xs text-white/50 mt-0.5 leading-snug">{desc}</p>
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