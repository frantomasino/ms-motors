import { fetchAutos } from "@/services/autosService";
import { Auto } from "@/types";

function mapAutosToCarFormat(autos: Auto[]) {
  return autos.map((auto, index) => ({
    id: index + 1,
    model: auto.Modelo,
    brand: auto.Marca,
    price: parseInt(auto.Precio.replace(/\D/g, '')) || 0,
    year: parseInt(auto.Año) || 2000,
    color: auto.Color,
    mileage: parseInt(auto.Kilometraje.replace(/\D/g, '')) || 0,
    transmission: auto.Transmisión,
    fuelType: auto.Combustible,
    description: auto.Descripción || `${auto.Marca} ${auto.Modelo} ${auto.Año}`,
    estado: (auto as any).Estado?.toLowerCase().trim() || "disponible",
    fotos: (auto as any).fotos || "",
    images: auto.imagenes.length > 0
      ? auto.imagenes
      : ["/placeholder.svg?height=600&width=800"],
  }));
}

export async function getCarsData() {
  try {
    const autos = await fetchAutos();
    return mapAutosToCarFormat(autos);
  } catch (error) {
    console.error("Error fetching cars data:", error);
    return [];
  }
}

// Solo los disponibles para el catálogo
export async function getDisponibles() {
  const cars = await getCarsData();
  return cars.filter(c => c.estado !== "vendido");
}

// Solo los vendidos para la sección historial
export async function getVendidos() {
  const cars = await getCarsData();
  return cars.filter(c => c.estado === "vendido");
}