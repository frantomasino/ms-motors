export interface CarType {
  id: string
  model: string
  brand: string
  price: number
  year: number
  color: string
  mileage: number
  transmission: string
  fuelType: string
  description: string
  images: string[]
  estado?: string
  fotos?: string
  source?: "supabase" | "csv"
  score?: number
  reasons?: string[]
}

export interface FilterState {
  brands: string[]
  models: string[]
  transmissions: string[]
  priceRange: [number, number]
  yearRange: [number, number]
  mileageRange: [number, number]
  colors: string[]
  fuelTypes: string[]
}

export interface Auto {
  Marca: string;
  Modelo: string;
  Año: string;
  Precio: string;
  Color: string;
  Kilometraje: string;
  Transmisión: string;
  Combustible: string;
  Descripción?: string;
  Estado?: string;
  CarpetaFirebase?: string;
  imagenes: string[];
  fotos?: string;
}

export interface AutoRow {
  id: string
  brand: string
  model: string
  year: number
  price: number
  color: string
  mileage: number
  transmission: string
  fuel_type: string
  description: string
  estado: string
  images: string[] | null
  sort_order?: number
  created_at: string
  updated_at: string
}

export type CarFormPayload = {
  brand: string
  model: string
  year: number
  price: number
  color: string
  mileage: number
  transmission: string
  fuel_type: string
  description: string
  estado?: "disponible" | "vendido"
}
