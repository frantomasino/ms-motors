export type PriceCurrency = "USD" | "ARS";

export function parsePriceCurrency(value: unknown): PriceCurrency {
  const v = String(value ?? "").trim().toUpperCase();
  if (v === "ARS" || v === "ARG" || v === "PESOS" || v === "$") return "ARS";
  return "USD";
}

export function formatAmount(price: number): string {
  return new Intl.NumberFormat("es-AR").format(price || 0);
}

export function formatCarPrice(price: number, currency: PriceCurrency | string | undefined = "USD"): string {
  const amount = formatAmount(price);
  return parsePriceCurrency(currency) === "ARS" ? `$ ${amount}` : `USD ${amount}`;
}

/** Montos tan altos no son dólares de este catálogo: se filtran como pesos. */
export const ARS_AMOUNT_THRESHOLD = 150_000;

export function priceScale(price: number, currency?: string | null): PriceCurrency {
  if (parsePriceCurrency(currency) === "ARS") return "ARS";
  if ((price || 0) >= ARS_AMOUNT_THRESHOLD) return "ARS";
  return "USD";
}

export function isMissingPriceCurrencyColumn(error: { message?: string; code?: string } | null | undefined): boolean {
  if (!error) return false;
  const msg = `${error.code || ""} ${error.message || ""}`.toLowerCase();
  return msg.includes("price_currency") || error.code === "PGRST204" || error.code === "42703";
}

export const MISSING_CURRENCY_COLUMN_MSG =
  "Para guardar precios en pesos hay que agregar la columna de moneda en Supabase. Corré el archivo supabase/price-currency.sql en el SQL Editor.";
