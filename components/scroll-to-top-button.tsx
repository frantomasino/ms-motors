"use client";

import { useCallback } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type ScrollToTopButtonProps = {
  hidden?: boolean;
};

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function ScrollToTopButton({ hidden }: ScrollToTopButtonProps) {
  const scrollToTopSlow = useCallback(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (prefersReducedMotion) {
      window.scrollTo(0, 0);
      return;
    }

    const startY = window.scrollY || window.pageYOffset;
    const duration = 900; // 👈 más lento (ms). Subí a 1200 si lo querés todavía más suave.
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(t);

      window.scrollTo(0, Math.round(startY * (1 - eased)));

      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, []);

  if (hidden) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
  type="button"
  onClick={scrollToTopSlow}
  size="icon"
  className="rounded-full shadow-lg bg-red-600 text-white hover:bg-red-700"
  aria-label="Subir"
>
  <ArrowUp className="h-5 w-5" />
</Button>

    </div>
  );
}
