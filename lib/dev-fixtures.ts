import type { CarType } from "@/types";

/** Solo para previsualizar el sitio en local cuando no hay catálogo. No se usa en producción. */
export const DEV_STOCK: CarType[] = [
  { id: "dev-1", brand: "Peugeot", model: "208 Feline Pack Cuir", year: 2021, price: 16800, mileage: 79000, fuelType: "Nafta", transmission: "Manual", color: "Gris Oscuro", description: "Único dueño. Service al día.", images: ["/banners-3.webp"], estado: "disponible" },
  { id: "dev-2", brand: "Audi", model: "A1 30 TFSI", year: 2020, price: 22500, mileage: 69000, fuelType: "Nafta", transmission: "Automática", color: "Gris Oscuro", description: "", images: ["/banner-2.jpg"], estado: "disponible" },
  { id: "dev-3", brand: "Volkswagen", model: "Amarok 2.0 TDI 4x4", year: 2018, price: 28900, mileage: 165000, fuelType: "Diesel", transmission: "Manual", color: "Blanco", description: "", images: ["/banners-mobile-2.webp"], estado: "disponible" },
  { id: "dev-4", brand: "Fiat", model: "Cronos Precision CVT", year: 2024, price: 19800, mileage: 13000, fuelType: "Nafta", transmission: "Automática", color: "Negro", description: "", images: ["/banner-imagen.jpg"], estado: "disponible" },
];

export const DEV_SOLD: CarType[] = [
  { id: "dev-s1", brand: "Ford", model: "Ka Viral", year: 2013, price: 0, mileage: 68000, fuelType: "Nafta", transmission: "Manual", color: "Rojo", description: "", images: ["/banner-2.jpg"], estado: "vendido" },
  { id: "dev-s2", brand: "Chery", model: "QQ 1.0", year: 2012, price: 0, mileage: 33000, fuelType: "Nafta", transmission: "Manual", color: "Blanco", description: "", images: ["/banner-imagen.jpg"], estado: "vendido" },
];
