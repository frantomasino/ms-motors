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

export function isMissingPriceCurrencyColumn(error: { message?: string; code?: string } | null | undefined): boolean {
  if (!error) return false;
  const msg = `${error.code || ""} ${error.message || ""}`.toLowerCase();
  return msg.includes("price_currency") || error.code === "PGRST204" || error.code === "42703";
}

export const MISSING_CURRENCY_COLUMN_MSG =
  "Para guardar precios en pesos hay que agregar la columna de moneda en Supabase. Corré el archivo supabase/price-currency.sql en el SQL Editor.";
