import { NextResponse } from "next/server";
import { COOKIE_NAME, MAX_AGE_SEC, createSessionToken, getAdminPin, pinMatches } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!getAdminPin()) {
    return NextResponse.json(
      { error: "Falta configurar ADMIN_PIN en el servidor." },
      { status: 503 }
    );
  }

  let pin = "";
  try {
    const body = await request.json();
    pin = typeof body?.pin === "string" ? body.pin : "";
  } catch {
    return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
  }

  if (!pinMatches(pin)) {
    return NextResponse.json({ error: "Clave incorrecta" }, { status: 401 });
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
  return res;
}
