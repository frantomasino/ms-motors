import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";
import LogoutButton from "@/components/admin/logout-button";
import AdminNav from "@/components/admin/admin-nav";

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
    <div className="min-h-[100svh] bg-surface">
      <header className="sticky top-0 z-50 bg-[#0c0e12] text-white pt-[env(safe-area-inset-top)]">
        <div className="brand-stripe" />
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/admin" className="font-title text-lg tracking-tight shrink-0">
            MS<span className="text-brand"> Motors</span>
          </Link>
          <AdminNav />
          <div className="ml-auto flex items-center gap-1">
            <Link
              href="/"
              className="text-xs text-white/45 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              Ver sitio
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-4 py-7">{children}</div>
    </div>
  );
}
