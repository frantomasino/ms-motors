"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={logout}
      className="text-xs text-white/45 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
    >
      Salir
    </button>
  );
}
