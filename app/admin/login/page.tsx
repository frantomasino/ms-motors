"use client";

import { Suspense } from "react";
import AdminLoginForm from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[100svh] bg-[#0c0e12]" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
