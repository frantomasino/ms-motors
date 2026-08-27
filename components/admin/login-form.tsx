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
    <div className="relative min-h-[100svh] bg-[#0c0e12] flex flex-col items-center justify-center px-5 overflow-hidden">
      <div className="brand-stripe absolute inset-x-0 top-0" />
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-16 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="relative h-16 w-16 mb-5 rounded-2xl bg-white p-2 shadow-lg shadow-black/30">
            <Image src="/logo-ms-motors.png" alt="MS Motors" fill className="object-contain p-1.5" />
          </div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/35 mb-2">MS Motors</p>
          <h1 className="font-title text-4xl text-white">Panel</h1>
          <p className="text-sm text-white/45 mt-2 text-center leading-relaxed">
            Gestioná el stock y las fotos de clientes.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md"
        >
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
              className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-4 text-white text-center tracking-[0.4em] placeholder:tracking-normal placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand/70"
            />
          </label>
          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !pin.trim()}
            className="w-full h-12 rounded-2xl bg-brand hover:bg-red-700 disabled:opacity-50 text-white font-semibold transition-colors"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
