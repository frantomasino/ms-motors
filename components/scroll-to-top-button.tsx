"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

type Props = { hidden?: boolean };

export default function ScrollToTopButton({ hidden = false }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // 👇 si está oculto (panel o modal abierto) o no hay scroll, no se muestra nada
  if (hidden || !visible) return null;

  return (
    <button
      aria-label="Volver arriba"
      onClick={scrollTop}
      className="fixed z-[60] right-4 md:right-6 bottom-20 md:bottom-8 transition-all duration-300"
    >
      <div
        className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 grid place-items-center 
        shadow-lg shadow-black/25 ring-1 ring-white/30 hover:scale-105 active:scale-95"
      >
        <ArrowUp className="h-5 w-5 text-white" />
      </div>
    </button>
  );
}
