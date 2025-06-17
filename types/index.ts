export interface CarType {
  id: number
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
  score?: number
  reasons?: string[]
}

export interface FilterState {
  brands: string[]
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
  CarpetaFirebase?: string;
  imagenes: string[];
}
