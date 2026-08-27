import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";
import LogoutButton from "@/components/admin/logout-button";

export const metadata: Metadata = {
  title: "Panel | MS Motors",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const loggedIn = await verifySessionToken(token);

  if (!loggedIn) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[100svh] bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/admin" className="text-sm font-bold text-gray-900">
            MS<span className="text-red-500"> Motors</span>
            <span className="ml-2 text-xs font-medium text-gray-400">Panel</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-700">Ver sitio</Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <div className="max-w-2xl mx-auto px-4 py-6">{children}</div>
    </div>
  );
}
