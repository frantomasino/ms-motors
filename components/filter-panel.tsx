"use client";

import { useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";
import type { CarType, FilterState } from "@/types";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  cars: CarType[];
}

/** Sección colapsable con flecha */
function FilterSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4"
        aria-expanded={open}
      >
        <span className="text-lg font-semibold">{title}</span>
        <ChevronDown
          className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

export default function FilterPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  cars,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  // Derivados (límites + opciones)
  const {
    maxPrice,
    minYear,
    maxYear,
    maxMileage,
    brands,
    transmissions,
    colors,
    fuels,
  } = useMemo(() => {
    const brands = Array.from(new Set(cars.map((c) => c.brand))).sort();
    const transmissions = Array.from(new Set(cars.map((c) => c.transmission))).sort();
    const colors = Array.from(new Set(cars.map((c) => c.color))).sort();
    const fuels = Array.from(new Set(cars.map((c) => c.fuelType))).sort();
    const maxPrice = Math.max(...cars.map((c) => c.price), 50000);
    const minYear = Math.min(...cars.map((c) => c.year), 2000);
    const maxYear = Math.max(...cars.map((c) => c.year), 2025);
    const maxMileage = Math.max(...cars.map((c) => c.mileage), 300000);
    return { maxPrice, minYear, maxYear, maxMileage, brands, transmissions, colors, fuels };
  }, [cars]);

  // Handlers para listas
  const toggleInArray = (arr: string[], value: string, checked: boolean) =>
    checked ? [...arr, value] : arr.filter((v) => v !== value);

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const cleared: FilterState = {
      brands: [],
      transmissions: [],
      priceRange: [0, maxPrice],
      yearRange: [minYear, maxYear],
      mileageRange: [0, maxMileage],
      colors: [],
      fuelTypes: [],
    };
    setLocalFilters(cleared);
    onFiltersChange(cleared);
    onClose(); // 👈 se cierra el panel
  };

  const fmtUSD = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto" side="right">
        <SheetHeader>
          <SheetTitle>Filtros de búsqueda</SheetTitle>
          <SheetDescription>
            Refina tu búsqueda para encontrar el vehículo perfecto
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-2">
          {/* Precio */}
          <FilterSection title="Rango de precio" defaultOpen>
            <Slider
              value={localFilters.priceRange}
              onValueChange={(v) =>
                setLocalFilters((s) => ({ ...s, priceRange: v as [number, number] }))
              }
              min={0}
              max={maxPrice}
              step={500}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{fmtUSD(localFilters.priceRange[0])}</span>
              <span>{fmtUSD(localFilters.priceRange[1])}</span>
            </div>
          </FilterSection>

          {/* Año */}
          <FilterSection title="Año" defaultOpen>
            <Slider
              value={localFilters.yearRange}
              onValueChange={(v) =>
                setLocalFilters((s) => ({ ...s, yearRange: v as [number, number] }))
              }
              min={minYear}
              max={maxYear}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{localFilters.yearRange[0]}</span>
              <span>{localFilters.yearRange[1]}</span>
            </div>
          </FilterSection>

          {/* Kilometraje */}
          <FilterSection title="Kilometraje" defaultOpen>
            <Slider
              value={localFilters.mileageRange}
              onValueChange={(v) =>
                setLocalFilters((s) => ({ ...s, mileageRange: v as [number, number] }))
              }
              min={0}
              max={maxMileage}
              step={5000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{localFilters.mileageRange[0].toLocaleString()} km</span>
              <span>{localFilters.mileageRange[1].toLocaleString()} km</span>
            </div>
          </FilterSection>

          <Separator />

          {/* Marca */}
          <FilterSection title="Marca">
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand} htmlFor={`brand-${brand}`} className="flex items-center gap-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={localFilters.brands.includes(brand)}
                    onCheckedChange={(c) =>
                      setLocalFilters((s) => ({
                        ...s,
                        brands: toggleInArray(s.brands, brand, Boolean(c)),
                      }))
                    }
                  />
                  <span className="text-sm">{brand}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Transmisión */}
          <FilterSection title="Transmisión">
            <div className="space-y-2">
              {transmissions.map((t) => (
                <label key={t} htmlFor={`tr-${t}`} className="flex items-center gap-2">
                  <Checkbox
                    id={`tr-${t}`}
                    checked={localFilters.transmissions.includes(t)}
                    onCheckedChange={(c) =>
                      setLocalFilters((s) => ({
                        ...s,
                        transmissions: toggleInArray(s.transmissions, t, Boolean(c)),
                      }))
                    }
                  />
                  <span className="text-sm">{t}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Color */}
          <FilterSection title="Color">
            <div className="space-y-2">
              {colors.map((c) => (
                <label key={c} htmlFor={`color-${c}`} className="flex items-center gap-2">
                  <Checkbox
                    id={`color-${c}`}
                    checked={localFilters.colors.includes(c)}
                    onCheckedChange={(ch) =>
                      setLocalFilters((s) => ({
                        ...s,
                        colors: toggleInArray(s.colors, c, Boolean(ch)),
                      }))
                    }
                  />
                  <span className="text-sm">{c}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Combustible */}
          <FilterSection title="Tipo de combustible">
            <div className="space-y-2">
              {fuels.map((f) => (
                <label key={f} htmlFor={`fuel-${f}`} className="flex items-center gap-2">
                  <Checkbox
                    id={`fuel-${f}`}
                    checked={localFilters.fuelTypes.includes(f)}
                    onCheckedChange={(ch) =>
                      setLocalFilters((s) => ({
                        ...s,
                        fuelTypes: toggleInArray(s.fuelTypes, f, Boolean(ch)),
                      }))
                    }
                  />
                  <span className="text-sm">{f}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <div className="flex gap-2 mt-6 pt-4">
            <Button variant="outline" onClick={clearFilters} className="flex-1">
              Limpiar
            </Button>
            <Button onClick={applyFilters} className="flex-1 bg-red-600 hover:bg-red-700">
              Aplicar filtros
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
