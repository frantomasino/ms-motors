"use client";

import Image from "next/image";
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { MapPin, Phone, Clock } from "lucide-react";

const MAPS_URL = "https://maps.app.goo.gl/RbiEm6n9iJ1oWwYWA";

export default function Footer() {
  return (
    <footer>
      {/* CTA WhatsApp */}
      <div className="relative bg-[#0c0e12] py-12 sm:py-16 overflow-hidden">
        <div className="brand-stripe absolute inset-x-0 top-0" />
        <div className="pointer-events-none absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="container relative mx-auto px-4 sm:px-10 lg:px-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/40 mb-3">¿Tenés alguna consulta?</p>
          <h3 className="font-title text-[1.75rem] sm:text-4xl lg:text-5xl text-white mb-6">Hablemos por WhatsApp</h3>
          <a href="https://wa.me/5491159456142" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold px-7 py-3.5 sm:px-8 rounded-full transition-all hover:scale-[1.02] shadow-lg shadow-green-900/40 text-sm">
            <FaWhatsapp className="h-5 w-5" />
            Escribinos ahora
          </a>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="bg-[#0c0e12]">
        <div className="container mx-auto px-4 sm:px-10 lg:px-16 py-10 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">

            {/* Info */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-white p-1 shrink-0">
                  <Image src="/logo-ms-motors.png" alt="MS Motors" fill className="object-contain" />
                </div>
                <span className="font-title text-xl tracking-tight text-white">MS<span className="text-brand"> Motors</span></span>
              </div>

              <div className="flex flex-col gap-3">
                <a href={MAPS_URL} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 group">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 group-hover:bg-red-500/20 transition-colors">
                    <MapPin className="h-3.5 w-3.5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">Ubicación</p>
                    <p className="text-sm text-white/60 group-hover:text-white transition-colors">Quilmes</p>
                  </div>
                </a>
                <a href="https://wa.me/5491159456142" target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 group">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 group-hover:bg-green-500/20 transition-colors">
                    <Phone className="h-3.5 w-3.5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">WhatsApp</p>
                    <p className="text-sm text-white/60 group-hover:text-white transition-colors">+54 11 5945-6142</p>
                  </div>
                </a>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5">
                    <Clock className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">Horario</p>
                    <p className="text-sm text-white/60">Lun – Sáb: 9:00 a 18:00</p>
                  </div>
                </div>
              </div>

              {/* Redes */}
              <div>
                <p className="text-[10px] text-white/25 uppercase tracking-widest mb-3">Seguinos</p>
                <div className="flex gap-2">
                  <a href="https://www.instagram.com/ms.motorsquilmes/" target="_blank" rel="noreferrer" aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-pink-500/20 text-white/40 hover:text-pink-400 transition-all">
                    <FaInstagram className="h-4 w-4" />
                  </a>
                  <a href="https://wa.me/5491159456142" target="_blank" rel="noreferrer" aria-label="WhatsApp"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-green-500/20 text-white/40 hover:text-green-400 transition-all">
                    <FaWhatsapp className="h-4 w-4" />
                  </a>
                  <a href="https://www.tiktok.com/@msmotorsquilmes" target="_blank" rel="noreferrer" aria-label="TikTok"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-white/40 hover:text-white transition-all">
                    <FaTiktok className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Mapa */}
            <div className="lg:col-span-3">
              {/* Contenedor con overlay — cualquier toque abre Maps */}
              <div className="relative rounded-2xl overflow-hidden h-56 sm:h-64 lg:h-full lg:min-h-[300px] ring-1 ring-white/5">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d99750.75063932675!2d-58.40973427543029!3d-34.718375813557145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4dbf64afd9b006b9%3A0x243b134cd4c806f7!2sMS%20Motors!5e1!3m2!1ses-419!2sar!4v1777560749654!5m2!1ses-419!2sar"
                  width="100%" height="100%"
                  style={{ border: 0, minHeight: "220px" }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="opacity-90 hover:opacity-100 transition-all duration-300"

                />

                {/* Overlay transparente encima del iframe — captura el toque en mobile */}
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 z-10 flex items-end justify-center pb-4"
                  aria-label="Abrir en Google Maps"
                >
                  <span className="flex items-center gap-1.5 text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <MapPin className="h-3 w-3" />
                    Abrir en Google Maps
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Barra inferior */}
          <div className="border-t border-white/5 mt-8 sm:mt-10 pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/20 text-center sm:text-left">
              © {new Date().getFullYear()} MS Motors. Todos los derechos reservados.
            </p>
            <nav className="flex flex-wrap justify-center sm:justify-end gap-4 text-xs text-white/20">
              {[["#", "Inicio"], ["#catalog", "Catálogo"], ["#vendidos", "Vendidos"], ["https://wa.me/5491159456142", "Contacto"]].map(([href, label]) => (
                <a key={label} href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="hover:text-white/60 transition-colors">
                  {label}
                </a>
              ))}
            </nav>
            <p className="text-[10px] text-white/15 text-center sm:hidden">
              Este sitio no recopila datos personales sin consentimiento.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}