export const CAR_BRANDS = [
  "Volkswagen",
  "Ford",
  "Chevrolet",
  "Fiat",
  "Renault",
  "Peugeot",
  "Toyota",
  "Citroën",
  "Honda",
  "Nissan",
  "Jeep",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Hyundai",
  "Kia",
  "Chery",
  "RAM",
  "Dodge",
  "Mitsubishi",
  "Suzuki",
  "Volvo",
  "Mini",
  "DS",
  "Alfa Romeo",
  "Chrysler",
  "Subaru",
  "Mazda",
  "Iveco",
  "JAC",
  "Land Rover",
  "Porsche",
] as const;

export const FUEL_TYPES = [
  "Nafta",
  "Diesel",
  "GNC",
  "Nafta/GNC",
  "Híbrido",
  "Eléctrico",
] as const;

export const TRANSMISSIONS = [
  "Manual",
  "Automática",
  "CVT",
  "Automatizada",
] as const;

export const OTHER_BRAND = "Otra";

export const CURRENT_YEAR = new Date().getFullYear();
export const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR + 1 - 1985 + 1 },
  (_, i) => CURRENT_YEAR + 1 - i
);

export function normalizeFuel(value: string): string {
  const v = value.trim().toLowerCase();
  if (!v) return "";
  if (v.includes("hibr") || v.includes("híbr")) return "Híbrido";
  if (v.includes("elec")) return "Eléctrico";
  if ((v.includes("nafta") || v.includes("gnc")) && v.includes("/")) return "Nafta/GNC";
  if (v.includes("gnc") || v.includes("gas")) return "GNC";
  if (v.includes("diesel") || v.includes("diésel") || v.includes("gasoil")) return "Diesel";
  if (v.includes("nafta") || v.includes("super") || v.includes("premium")) return "Nafta";
  return value.trim();
}

export function normalizeTransmission(value: string): string {
  const v = value.trim().toLowerCase();
  if (!v) return "";
  if (v.includes("cvt")) return "CVT";
  if (v.includes("secuenc") || v.includes("automatizada") || v.includes("dsg") || v.includes("tiptronic")) {
    return "Automatizada";
  }
  if (v.includes("auto") || v.includes("at ")) return "Automática";
  if (v.includes("manu") || v.includes("mt")) return "Manual";
  return value.trim();
}
