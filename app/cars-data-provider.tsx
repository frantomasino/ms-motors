import { fetchAutos } from "@/services/autosService";
import { mapCsvToCar, mapRowToCar } from "@/lib/map-car";
import { supabase } from "@/lib/supabase";
import type { AutoRow, CarType } from "@/types";

export async function getCarsData(): Promise<CarType[]> {
  try {
    const { data, error } = await supabase
      .from("autos")
      .select("*")
      .order("created_at", { ascending: false });

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
    return autos.map(mapCsvToCar);
  } catch (error) {
    console.error("Error fetching cars data:", error);
    return [];
  }
}

export async function getDisponibles() {
  const cars = await getCarsData();
  return cars.filter((c) => c.estado !== "vendido");
}

export async function getVendidos() {
  const cars = await getCarsData();
  return cars.filter((c) => c.estado === "vendido");
}
