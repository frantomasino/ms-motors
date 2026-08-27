"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Stock" },
  { href: "/admin/clientes", label: "Clientes" },
];

export default function AdminNav() {
  const path = usePathname();

  return (
    <nav className="flex items-center gap-0.5">
      {items.map(({ href, label }) => {
        const onStock =
          href === "/admin" &&
          (path === "/admin" ||
            (path.startsWith("/admin/") &&
              !path.startsWith("/admin/clientes") &&
              !path.startsWith("/admin/login")));
        const active = href === "/admin" ? onStock : path === href || path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors ${
              active ? "text-white bg-white/10" : "text-white/45 hover:text-white hover:bg-white/5"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
