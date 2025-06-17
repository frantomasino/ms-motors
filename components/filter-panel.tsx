"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import type { Car, FilterState } from "@/types"

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  cars: Car[]
}

export default function FilterPanel({ isOpen, onClose, filters, onFiltersChange, cars }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)

  // Extract unique values from cars
  const uniqueBrands = Array.from(new Set(cars.map((car) => car.brand))).sort()
  const uniqueTransmissions = Array.from(new Set(cars.map((car) => car.transmission))).sort()
  const uniqueColors = Array.from(new Set(cars.map((car) => car.color))).sort()
  const uniqueFuelTypes = Array.from(new Set(cars.map((car) => car.fuelType))).sort()

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked ? [...localFilters.brands, brand] : localFilters.brands.filter((b) => b !== brand)

    setLocalFilters({ ...localFilters, brands: newBrands })
  }

  const handleTransmissionChange = (transmission: string, checked: boolean) => {
    const newTransmissions = checked
      ? [...localFilters.transmissions, transmission]
      : localFilters.transmissions.filter((t) => t !== transmission)

    setLocalFilters({ ...localFilters, transmissions: newTransmissions })
  }

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked ? [...localFilters.colors, color] : localFilters.colors.filter((c) => c !== color)

    setLocalFilters({ ...localFilters, colors: newColors })
  }

  const handleFuelTypeChange = (fuelType: string, checked: boolean) => {
    const newFuelTypes = checked
      ? [...localFilters.fuelTypes, fuelType]
      : localFilters.fuelTypes.filter((f) => f !== fuelType)

    setLocalFilters({ ...localFilters, fuelTypes: newFuelTypes })
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      brands: [],
      transmissions: [],
      priceRange: [0, 50000],
      yearRange: [2000, 2025],
      mileageRange: [0, 300000],
      colors: [],
      fuelTypes: [],
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros de búsqueda</SheetTitle>
          <SheetDescription>Refina tu búsqueda para encontrar el vehículo perfecto</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Price Range */}
          <div>
            <Label className="text-base font-semibold">Rango de precio</Label>
            <div className="mt-2">
              <Slider
                value={localFilters.priceRange}
                onValueChange={(value) => setLocalFilters({ ...localFilters, priceRange: value as [number, number] })}
                max={50000}
                min={0}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>{formatPrice(localFilters.priceRange[0])}</span>
                <span>{formatPrice(localFilters.priceRange[1])}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Year Range */}
          <div>
            <Label className="text-base font-semibold">Año</Label>
            <div className="mt-2">
              <Slider
                value={localFilters.yearRange}
                onValueChange={(value) => setLocalFilters({ ...localFilters, yearRange: value as [number, number] })}
                max={2025}
                min={2000}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>{localFilters.yearRange[0]}</span>
                <span>{localFilters.yearRange[1]}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Mileage Range */}
          <div>
            <Label className="text-base font-semibold">Kilometraje</Label>
            <div className="mt-2">
              <Slider
                value={localFilters.mileageRange}
                onValueChange={(value) => setLocalFilters({ ...localFilters, mileageRange: value as [number, number] })}
                max={300000}
                min={0}
                step={5000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>{localFilters.mileageRange[0].toLocaleString()} km</span>
                <span>{localFilters.mileageRange[1].toLocaleString()} km</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Brands */}
          <div>
            <Label className="text-base font-semibold">Marca</Label>
            <div className="mt-2 space-y-2">
              {uniqueBrands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={localFilters.brands.includes(brand)}
                    onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                  />
                  <Label htmlFor={`brand-${brand}`} className="text-sm font-normal">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Transmission */}
          <div>
            <Label className="text-base font-semibold">Transmisión</Label>
            <div className="mt-2 space-y-2">
              {uniqueTransmissions.map((transmission) => (
                <div key={transmission} className="flex items-center space-x-2">
                  <Checkbox
                    id={`transmission-${transmission}`}
                    checked={localFilters.transmissions.includes(transmission)}
                    onCheckedChange={(checked) => handleTransmissionChange(transmission, checked as boolean)}
                  />
                  <Label htmlFor={`transmission-${transmission}`} className="text-sm font-normal">
                    {transmission}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Colors */}
          <div>
            <Label className="text-base font-semibold">Color</Label>
            <div className="mt-2 space-y-2">
              {uniqueColors.map((color) => (
                <div key={color} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color}`}
                    checked={localFilters.colors.includes(color)}
                    onCheckedChange={(checked) => handleColorChange(color, checked as boolean)}
                  />
                  <Label htmlFor={`color-${color}`} className="text-sm font-normal">
                    {color}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Fuel Types */}
          <div>
            <Label className="text-base font-semibold">Combustible</Label>
            <div className="mt-2 space-y-2">
              {uniqueFuelTypes.map((fuelType) => (
                <div key={fuelType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`fuel-${fuelType}`}
                    checked={localFilters.fuelTypes.includes(fuelType)}
                    onCheckedChange={(checked) => handleFuelTypeChange(fuelType, checked as boolean)}
                  />
                  <Label htmlFor={`fuel-${fuelType}`} className="text-sm font-normal">
                    {fuelType}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-8 pt-4 border-t">
          <Button variant="outline" onClick={clearFilters} className="flex-1">
            Limpiar
          </Button>
          <Button onClick={applyFilters} className="flex-1 bg-red-600 hover:bg-red-700">
            Aplicar filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
