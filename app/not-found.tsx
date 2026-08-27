import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0c0e12] flex flex-col items-center justify-center px-6 text-center">
      <div className="relative h-16 w-16 mb-8 opacity-80">
        <Image src="/logo-ms-motors.png" alt="MS Motors" fill className="object-contain" />
      </div>

      <p className="text-brand text-sm font-semibold uppercase tracking-[0.22em] mb-3">Error 404</p>
      <h1 className="font-title text-4xl sm:text-6xl text-white mb-4">Página no encontrada</h1>
      <p className="text-white/40 text-base max-w-sm mb-10 leading-relaxed">
        El auto o la página que buscás no existe o fue removida del catálogo.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/#catalog"
          className="flex items-center justify-center gap-2 bg-brand hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full transition-all hover:scale-[1.02] text-sm">
          Ver catálogo
        </Link>
        <a href="https://wa.me/5491159456142" target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-full transition-all text-sm">
          Contactar por WhatsApp
        </a>
      </div>

      <p className="text-white/20 text-xs mt-12">© {new Date().getFullYear()} MS Motors · Quilmes</p>
    </div>
  );
}