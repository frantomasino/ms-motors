import type { AutoRow, CarType } from "@/types";
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
  };
}
