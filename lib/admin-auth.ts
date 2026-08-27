export const COOKIE_NAME = "ms_admin_session";
export const MAX_AGE_SEC = 60 * 60 * 24 * 30;

function getSecret(): string {
  return (process.env.ADMIN_SECRET || process.env.ADMIN_PIN || "").trim();
}

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ba = enc.encode(a);
  const bb = enc.encode(b);
  const len = Math.max(ba.length, bb.length);
  let diff = ba.length ^ bb.length;
  for (let i = 0; i < len; i++) {
    diff |= (ba[i] ?? 0) ^ (bb[i] ?? 0);
  }
  return diff === 0;
}

async function sign(payload: string): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error("Falta ADMIN_PIN");
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return toHex(sig);
}

export function getAdminPin(): string {
  return (process.env.ADMIN_PIN || "").trim();
}

export function pinMatches(input: unknown): boolean {
  const expected = getAdminPin();
  if (!expected) return false;
  const pin = typeof input === "string" ? input.trim() : "";
  if (!pin) return false;
  return timingSafeEqual(pin, expected);
}

export async function createSessionToken(): Promise<string> {
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const payload = String(exp);
  const sig = await sign(payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token?: string | null): Promise<boolean> {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const exp = Number(payload);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  try {
    const expected = await sign(payload);
    return timingSafeEqual(sig, expected);
  } catch {
    return false;
  }
}
