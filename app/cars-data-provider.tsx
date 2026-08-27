import { mapRowToCar } from "@/lib/map-car";
import { fetchAutosOrdered } from "@/lib/autos-order";
import { supabase } from "@/lib/supabase";
import { DEV_SOLD, DEV_STOCK } from "@/lib/dev-fixtures";
import type { AutoRow, CarType } from "@/types";

export async function getCarsData(): Promise<CarType[]> {
  try {
    const { data, error } = await fetchAutosOrdered(supabase);
    if (error) {
      console.warn("No se pudo leer el catálogo:", error.message);
    } else if (data) {
      const cars = (data as AutoRow[]).map(mapRowToCar);
      if (cars.length > 0 || process.env.NODE_ENV === "production") return cars;
    }
  } catch (error) {
    console.error("Error leyendo tabla autos:", error);
  }

  if (process.env.NODE_ENV !== "production") {
    return [...DEV_STOCK, ...DEV_SOLD];
  }

  return [];
}
