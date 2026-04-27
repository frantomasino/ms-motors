"use client";

import Image from "next/image";
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { MapPin, Phone, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer>
      {/* CTA WhatsApp — transición suave del gris al negro */}
      <div className="bg-gradient-to-b from-gray-50 to-gray-900 py-14">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">¿Tenés alguna consulta?</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">Hablemos por WhatsApp</h3>
          <a href="https://wa.me/5491159456142" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-8 py-3.5 rounded-full transition-all hover:scale-[1.02] shadow-lg shadow-green-900/30 text-sm">
            <FaWhatsapp className="h-5 w-5" />
            Escribinos ahora
          </a>
        </div>
      </div>

      {/* Cuerpo principal del footer */}
      <div className="bg-gray-900">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Info — 2 columnas */}
            <div className="lg:col-span-2 flex flex-col gap-7">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-white p-1 shrink-0">
                  <Image src="/logo-ms-motors.png" alt="MS Motors" fill className="object-contain" />
                </div>
                <span className="text-lg font-bold text-white">MS<span className="text-red-500"> Motors</span></span>
              </div>

              <div className="flex flex-col gap-4">
                <a href="https://maps.google.com/?q=MS+Motors+Quilmes" target="_blank" rel="noreferrer"
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

            {/* Mapa — 3 columnas, altura fija, redondeado */}
            <div className="lg:col-span-3 rounded-2xl overflow-hidden h-64 lg:h-auto min-h-[280px] ring-1 ring-white/5">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.6!2d-58.3444321!3d-34.671077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4dbf64afd9b006b9%3A0x243b134cd4c806f7!2sMS%20Motors!5e0!3m2!1ses!2sar!4v1"
                width="100%" height="100%"
                style={{ border: 0, minHeight: "280px" }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-75 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          {/* Barra inferior */}
          <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/20">© {new Date().getFullYear()} MS Motors. Todos los derechos reservados.</p>
            <nav className="flex flex-wrap justify-center gap-5 text-xs text-white/20">
              {[["#", "Inicio"], ["#catalog", "Catálogo"], ["#vendidos", "Vendidos"], ["https://wa.me/5491159456142", "Contacto"]].map(([href, label]) => (
                <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="hover:text-white/60 transition-colors">{label}</a>
              ))}
              <span className="text-white/10">·</span>
              <span className="text-white/20">Este sitio no recopila datos personales sin consentimiento.</span>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}