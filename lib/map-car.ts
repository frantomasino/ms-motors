import type { Auto, AutoRow, CarType } from "@/types";
import { normalizeFuel, normalizeTransmission } from "@/lib/catalog-options";
import { usableCarPhotos } from "@/lib/photo-config";
import { parsePriceCurrency } from "@/lib/price";

export function mapRowToCar(row: AutoRow): CarType {
  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    year: Number(row.year) || 2000,
    price: Number(row.price) || 0,
    currency: parsePriceCurrency(row.price_currency),
    color: row.color || "",
    mileage: Number(row.mileage) || 0,
    transmission: row.transmission || "",
    fuelType: row.fuel_type || "",
    description: row.description || `${row.brand} ${row.model} ${row.year}`,
    estado: (row.estado || "disponible").toLowerCase().trim(),
    images: usableCarPhotos(row.images),
    source: "supabase",
  };
}

export function mapCsvToCar(auto: Auto, index: number): CarType {
  return {
    id: `csv-${index + 1}`,
    model: auto.Modelo,
    brand: auto.Marca,
    price: parseInt(String(auto.Precio ?? "").replace(/\D/g, ""), 10) || 0,
    currency: "USD",
    year: parseInt(String(auto.Año ?? ""), 10) || 2000,
    color: auto.Color || "",
    mileage: parseInt(String(auto.Kilometraje ?? "").replace(/\D/g, ""), 10) || 0,
    transmission: auto.Transmisión || "",
    fuelType: auto.Combustible || "",
    description: auto.Descripción || `${auto.Marca} ${auto.Modelo} ${auto.Año}`,
    estado: (auto.Estado || "disponible").toLowerCase().trim(),
    fotos: auto.fotos || "",
    images: usableCarPhotos(auto.imagenes),
    source: "csv",
  };
}

export function csvToInsert(auto: Auto) {
  return {
    brand: (auto.Marca || "").trim(),
    model: (auto.Modelo || "").trim(),
    year: parseInt(String(auto.Año ?? ""), 10) || 2000,
    price: parseInt(String(auto.Precio ?? "").replace(/\D/g, ""), 10) || 0,
    price_currency: "USD" as const,
    color: (auto.Color || "").trim(),
    mileage: parseInt(String(auto.Kilometraje ?? "").replace(/\D/g, ""), 10) || 0,
    transmission: normalizeTransmission(auto.Transmisión || ""),
    fuel_type: normalizeFuel(auto.Combustible || ""),
    description: (auto.Descripción || "").trim(),
    estado: (auto.Estado || "disponible").toLowerCase().trim() === "vendido" ? "vendido" : "disponible",
    images: auto.imagenes || [],
  };
}
