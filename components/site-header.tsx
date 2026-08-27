"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/#catalog", label: "Catálogo" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#vendidos", label: "Vendidos" },
];

export default function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const solid = !overlay || scrolled || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 56);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 pt-[env(safe-area-inset-top)] ${
        solid
          ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_8px_24px_rgba(16,24,40,0.06)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {solid && <div className="brand-stripe" />}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl">
        <div className="flex items-center justify-between h-14 sm:h-[4.25rem]">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className={`relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl overflow-hidden ${solid ? "" : "bg-white p-0.5"}`}>
              <Image src="/logo-ms-motors.png" alt="MS Motors" fill className="object-contain" />
            </div>
            <span className={`font-title text-xl tracking-tight ${solid ? "text-ink" : "text-white"}`}>
              MS<span className="text-brand"> Motors</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {NAV.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className={`px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition-all ${
                  solid
                    ? "text-gray-600 hover:text-brand hover:bg-red-50/80"
                    : "text-white/75 hover:text-white hover:bg-white/10"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <a
              href="https://www.instagram.com/ms.motorsquilmes/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className={`hidden sm:flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                solid ? "text-gray-500 hover:text-brand hover:bg-red-50" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <FaInstagram className="h-4 w-4" />
            </a>
            <a
              href="https://www.tiktok.com/@msmotorsquilmes"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className={`hidden sm:flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                solid ? "text-gray-500 hover:text-brand hover:bg-red-50" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <FaTiktok className="h-4 w-4" />
            </a>
            <a
              href="https://wa.me/5491159456142"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp"
              className={`flex items-center justify-center gap-1.5 text-sm font-medium rounded-full transition-all hover:scale-[1.02] h-9 w-9 sm:h-auto sm:w-auto sm:px-4 sm:py-2 ${
                solid
                  ? "bg-ink hover:bg-black text-white"
                  : "bg-white text-ink hover:bg-white/90"
              }`}
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Contactar</span>
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className={`flex md:hidden h-9 w-9 items-center justify-center rounded-full transition-all ${
                solid ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/10"
              }`}
              aria-label="Menú"
            >
              {open ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {open && (
          <nav className="md:hidden border-t border-gray-100 py-3 flex flex-col gap-1">
            {NAV.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-brand hover:bg-red-50 rounded-lg transition-all"
              >
                {label}
              </Link>
            ))}
            <div className="flex gap-3 px-4 pt-2 border-t border-gray-100 mt-1">
              <a
                href="https://www.instagram.com/ms.motorsquilmes/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors"
              >
                <FaInstagram className="h-4 w-4" /> Instagram
              </a>
              <a
                href="https://www.tiktok.com/@msmotorsquilmes"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors"
              >
                <FaTiktok className="h-4 w-4" /> TikTok
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
