"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const path = usePathname();
  const item = (href: string, label: string) => {
    const active = path === href;
    return (
      <Link
        href={href}
        className={`text-sm font-medium px-2.5 py-1 rounded-lg ${
          active ? "text-gray-900 bg-gray-100" : "text-gray-400 hover:text-gray-700"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="flex items-center gap-1">
      {item("/admin", "Stock")}
      {item("/admin/clientes", "Clientes")}
    </nav>
  );
}
