import type { CarType } from "@/types";

export function slugifyName(brand: string, model: string, year: number): string {
  return `${brand}-${model}-${year}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function carSlug(car: Pick<CarType, "id" | "brand" | "model" | "year">): string {
  const base = slugifyName(car.brand, car.model, car.year);
  const short = String(car.id).replace(/-/g, "").slice(0, 8);
  return `${base}-${short}`;
}
