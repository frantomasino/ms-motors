export interface CarType {
  id: string
  model: string
  brand: string
  price: number
  currency?: "USD" | "ARS"
  year: number
  color: string
  mileage: number
  transmission: string
  fuelType: string
  description: string
  images: string[]
  estado?: string
  score?: number
  reasons?: string[]
}

export interface FilterState {
  brands: string[]
  models: string[]
  transmissions: string[]
  currency: "USD" | "ARS" | null
  priceRange: [number, number]
  yearRange: [number, number]
  mileageRange: [number, number]
  colors: string[]
  fuelTypes: string[]
}

export interface AutoRow {
  id: string
  brand: string
  model: string
  year: number
  price: number
  price_currency?: "USD" | "ARS"
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
  price_currency?: "USD" | "ARS"
  color: string
  mileage: number
  transmission: string
  fuel_type: string
  description: string
  estado?: "disponible" | "vendido"
}
