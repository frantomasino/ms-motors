"use client";

import { FaWhatsapp } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="https://wa.me/5491159456142?text=Hola! Estoy viendo su catálogo de autos y me gustaría obtener más información."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold shadow-lg shadow-green-900/25 transition-all duration-300 hover:scale-105 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }
      /* Mobile: solo ícono circular */
      h-14 w-14 rounded-full justify-center
      /* Desktop: pill con texto */
      sm:w-auto sm:rounded-full sm:px-5 sm:py-3 sm:h-auto
      `}
    >
      <FaWhatsapp className="h-6 w-6 shrink-0 sm:h-5 sm:w-5" />
      <span className="text-sm hidden sm:inline">¿Hablamos?</span>
    </a>
  );
}