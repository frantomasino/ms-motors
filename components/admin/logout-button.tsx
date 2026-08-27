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
    <button type="button" onClick={logout} className="text-xs text-gray-400 hover:text-gray-700">
      Salir
    </button>
  );
}
