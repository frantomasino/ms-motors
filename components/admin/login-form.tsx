"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function AdminLoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/admin";
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "No se pudo entrar");
        return;
      }
      router.replace(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Sin conexión. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100svh] bg-[#0c0e12] flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="relative h-14 w-14 mb-4">
            <Image src="/logo-ms-motors.png" alt="MS Motors" fill className="object-contain" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-2">MS Motors</p>
          <h1 className="text-2xl font-bold text-white">Cargar autos</h1>
          <p className="text-sm text-white/45 mt-2 text-center">
            Panel para publicar el stock. Las fotos se ajustan solas.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="sr-only">Clave</span>
            <input
              type="password"
              inputMode="numeric"
              autoComplete="current-password"
              autoFocus
              placeholder="Clave de acceso"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-4 text-white text-center tracking-[0.35em] placeholder:tracking-normal placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/70"
            />
          </label>
          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !pin.trim()}
            className="w-full h-12 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold transition-colors"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
