import { fetchAutos } from "@/services/autosService";
import { mapCsvToCar, mapRowToCar } from "@/lib/map-car";
import { fetchAutosOrdered } from "@/lib/autos-order";
import { supabase } from "@/lib/supabase";
import { DEV_SOLD, DEV_STOCK } from "@/lib/dev-fixtures";
import type { AutoRow, CarType } from "@/types";

export async function getCarsData(): Promise<CarType[]> {
  try {
    const { data, error } = await fetchAutosOrdered(supabase);

    if (!error && data && data.length > 0) {
      return (data as AutoRow[]).map(mapRowToCar);
    }

    if (error) {
      console.warn("Tabla autos no disponible, usando CSV:", error.message);
    }
  } catch (error) {
    console.error("Error leyendo tabla autos:", error);
  }

  try {
    const autos = await fetchAutos();
    const cars = autos.map(mapCsvToCar);
    if (cars.length > 0) return cars;
  } catch (error) {
    console.error("Error fetching cars data:", error);
  }

  if (process.env.NODE_ENV !== "production") {
    return [...DEV_STOCK, ...DEV_SOLD];
  }

  return [];
}
