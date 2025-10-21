// src/components/scroll-to-top-button.tsx
"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

type Props = { hidden?: boolean };

export default function ScrollToTopButton({ hidden }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320); // aparece antes
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      aria-label="Volver arriba"
      onClick={scrollTop}
      className={[
        "fixed z-[60] right-4 md:right-6 bottom-20 md:bottom-8",
        "transition-all duration-300",
        visible && !hidden
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none",
      ].join(" ")}
    >
      <span className="sr-only">Subir</span>
      <div
        className={[
          "h-12 w-12 rounded-full",
          "bg-red-600 hover:bg-red-700",      // rojo marca
          "grid place-items-center",
          "shadow-lg shadow-black/25 ring-1 ring-white/30", // relieve sutil
          "hover:scale-105 active:scale-95",
        ].join(" ")}
      >
        <ArrowUp className="h-5 w-5 text-white" />
      </div>
    </button>
  );
}
