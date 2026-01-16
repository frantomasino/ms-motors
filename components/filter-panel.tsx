"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  resetSignal = 0,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  resetSignal?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);

  // ✅ cada vez que abrís el panel, se cierran todas las secciones
  useEffect(() => {
    setOpen(false);
  }, [resetSignal]);

  return (
    <div className="border-b">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4"
        aria-expanded={open}
      >
        {/* ✅ tipografía/tamaño como VehicleFilters */}
        <span className="font-title text-sm">{title}</span>

        <ChevronDown
          className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

function FilterOption({
  label,
  count,
  isSelected,
  onClick,
}: {
  label: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        // ✅ tipografía/tamaño/espaciado como VehicleFilters (más compacto)
        "font-body flex w-full items-center justify-between py-1 text-left text-xs transition-colors",
        isSelected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      <span>{label}</span>
      <span className="text-xs text-muted-foreground">({count})</span>
    </button>
  );
}

// ✅ Funciones de formato unificadas
const fmtUSD = (n: number) => {
  const formatted = n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted} USD`;
};

const fmtKM = (n: number) => {
  const formatted = n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted} KM`;
};

export default function FilterPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  cars,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  // ✅ señal para resetear (cerrar) secciones al abrir
  const [resetSignal, setResetSignal] = useState(0);

  // Mantener sync cuando se abre/cierra o cambian filtros externos
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  // ✅ cada vez que se abre el panel, incrementa señal (cierra todo)
  useEffect(() => {
    if (isOpen) setResetSignal((s) => s + 1);
  }, [isOpen]);

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
    years,
    allModels,
  } = useMemo(() => {
    const brands = Array.from(new Set(cars.map((c) => c.brand))).sort();
    const transmissions = Array.from(
      new Set(cars.map((c) => c.transmission))
    ).sort();
    const colors = Array.from(new Set(cars.map((c) => c.color))).sort();
    const fuels = Array.from(new Set(cars.map((c) => c.fuelType))).sort();
    const years = Array.from(new Set(cars.map((c) => c.year))).sort(
      (a, b) => b - a
    );
    const allModels = Array.from(new Set(cars.map((c) => c.model))).sort();

    const maxPrice = Math.max(...cars.map((c) => c.price), 50000);
    const minYear = Math.min(...cars.map((c) => c.year), 2000);
    const maxYear = Math.max(...cars.map((c) => c.year), 2025);
    const maxMileage = Math.max(...cars.map((c) => c.mileage), 300000);

    return {
      maxPrice,
      minYear,
      maxYear,
      maxMileage,
      brands,
      transmissions,
      colors,
      fuels,
      years,
      allModels,
    };
  }, [cars]);

  // ====== Estado estilo "lista con conteo" (single select) ======
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedFuelType, setSelectedFuelType] = useState<string | null>(null);
  const [selectedTransmission, setSelectedTransmission] = useState<string | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");

  const priceRanges = useMemo(
    () => [
      { label: "Hasta USD 10.000", min: 0, max: 10000 },
      { label: "USD 10.000 – 20.000", min: 10000, max: 20000 },
      { label: "USD 20.000 – 30.000", min: 20000, max: 30000 },
      { label: "USD 30.000 – 40.000", min: 30000, max: 40000 },
      { label: "Más de USD 40.000", min: 40000, max: maxPrice },
    ],
    [maxPrice]
  );

  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  // ✅ Kilometraje igual que Precio (rangos + inputs)
  const mileageRanges = useMemo(
    () => [
      { label: "Hasta 50.000 km", min: 0, max: 50000 },
      { label: "50.000 – 100.000 km", min: 50000, max: 100000 },
      { label: "100.000 – 150.000 km", min: 100000, max: 150000 },
      { label: "150.000 – 200.000 km", min: 150000, max: 200000 },
      { label: "Más de 200.000 km", min: 200000, max: maxMileage },
    ],
    [maxMileage]
  );

  const [mileageRange, setMileageRange] = useState<[number, number]>([
    0,
    maxMileage,
  ]);
  const [minMileageInput, setMinMileageInput] = useState("");
  const [maxMileageInput, setMaxMileageInput] = useState("");

  // modelos dependen de la marca seleccionada (para parecerse a tu ejemplo)
  const models = useMemo(() => {
    if (!selectedBrand) return allModels;
    return Array.from(
      new Set(cars.filter((c) => c.brand === selectedBrand).map((c) => c.model))
    ).sort();
  }, [cars, allModels, selectedBrand]);

  // Conteos (globales)
  const vehicleCounts = useMemo(() => {
    const counts = {
      brands: {} as Record<string, number>,
      models: {} as Record<string, number>,
      fuelTypes: {} as Record<string, number>,
      transmissions: {} as Record<string, number>,
      years: {} as Record<number, number>,
      colors: {} as Record<string, number>,
      priceRanges: {} as Record<string, number>,
      mileageRanges: {} as Record<string, number>,
    };

    for (const car of cars) {
      counts.brands[car.brand] = (counts.brands[car.brand] || 0) + 1;
      counts.models[car.model] = (counts.models[car.model] || 0) + 1;
      counts.fuelTypes[car.fuelType] =
        (counts.fuelTypes[car.fuelType] || 0) + 1;
      counts.transmissions[car.transmission] =
        (counts.transmissions[car.transmission] || 0) + 1;
      counts.years[car.year] = (counts.years[car.year] || 0) + 1;
      counts.colors[car.color] = (counts.colors[car.color] || 0) + 1;
    }

    for (const r of priceRanges) {
      counts.priceRanges[r.label] = cars.filter(
        (c) => c.price >= r.min && c.price <= r.max
      ).length;
    }

    for (const r of mileageRanges) {
      counts.mileageRanges[r.label] = cars.filter(
        (c) => c.mileage >= r.min && c.mileage <= r.max
      ).length;
    }

    return counts;
  }, [cars, priceRanges, mileageRanges]);

  // ====== Sincronizar selections -> localFilters ======
  useEffect(() => {
    setLocalFilters((prev) => ({
      ...prev,
      brands: selectedBrand ? [selectedBrand] : [],
      models: selectedModel ? [selectedModel] : [],
      fuelTypes: selectedFuelType ? [selectedFuelType] : [],
      transmissions: selectedTransmission ? [selectedTransmission] : [],
      colors: selectedColor ? [selectedColor] : [],
      yearRange: selectedYear ? [selectedYear, selectedYear] : [minYear, maxYear],
      priceRange: priceRange,
      mileageRange: mileageRange,
    }));
  }, [
    selectedBrand,
    selectedModel,
    selectedFuelType,
    selectedTransmission,
    selectedYear,
    selectedColor,
    priceRange,
    mileageRange,
    minYear,
    maxYear,
  ]);

  // ====== helpers para evitar loop infinito (React error #185) ======
  const sameArr = (a: string[], b: string[]) => {
    if (a === b) return true;
    if (a.length !== b.length) return false;
    const aa = [...a].sort();
    const bb = [...b].sort();
    return aa.every((v, i) => v === bb[i]);
  };

  const sameRange = (a: [number, number], b: [number, number]) =>
    a[0] === b[0] && a[1] === b[1];

  const sameFilters = (a: FilterState, b: FilterState) => {
    return (
      sameArr(a.brands, b.brands) &&
      sameArr(a.models, b.models) &&
      sameArr(a.transmissions, b.transmissions) &&
      sameArr(a.colors, b.colors) &&
      sameArr(a.fuelTypes, b.fuelTypes) &&
      sameRange(a.priceRange, b.priceRange) &&
      sameRange(a.yearRange, b.yearRange) &&
      sameRange(a.mileageRange, b.mileageRange)
    );
  };

  // ✅ LIVE: mientras filtrás, se actualiza el catálogo sin esperar "Aplicar"
  useEffect(() => {
    if (!isOpen) return;

    // ✅ evita loop infinito
    if (sameFilters(localFilters, filters)) return;

    onFiltersChange(localFilters);
  }, [localFilters, isOpen, onFiltersChange, filters]);

  // Precio custom
  const handlePriceRangeClick = (min: number, max: number) => {
    setPriceRange([min, max]);
    setMinPriceInput(String(min));
    setMaxPriceInput(String(max));
  };

  const handleCustomPriceRange = () => {
    const min = Number(minPriceInput || 0);
    const max = Number(maxPriceInput || maxPrice);
    const clampedMin = Math.max(0, min);
    const clampedMax = Math.min(maxPrice, max);
    setPriceRange([clampedMin, clampedMax]);
  };

  // ✅ Km custom
  const handleMileageRangeClick = (min: number, max: number) => {
    setMileageRange([min, max]);
    setMinMileageInput(String(min));
    setMaxMileageInput(String(max));
  };

  const handleCustomMileageRange = () => {
    const min = Number(minMileageInput || 0);
    const max = Number(maxMileageInput || maxMileage);
    const clampedMin = Math.max(0, min);
    const clampedMax = Math.min(maxMileage, max);
    setMileageRange([clampedMin, clampedMax]);
  };

  // ✅ "Aplicar" se mantiene: ya aplicó en vivo, esto solo cierra
  const applyFilters = () => {
    onClose();
  };

  const clearFilters = () => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedFuelType(null);
    setSelectedTransmission(null);
    setSelectedYear(null);
    setSelectedColor(null);
    setMinPriceInput("");
    setMaxPriceInput("");
    setPriceRange([0, maxPrice]);

    // ✅ reset km
    setMinMileageInput("");
    setMaxMileageInput("");
    setMileageRange([0, maxMileage]);

    const cleared: FilterState = {
      brands: [],
      models: [],
      transmissions: [],
      priceRange: [0, maxPrice],
      yearRange: [minYear, maxYear],
      mileageRange: [0, maxMileage],
      colors: [],
      fuelTypes: [],
    };

    setLocalFilters(cleared);
    onFiltersChange(cleared);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto" side="right">
        {/* <SheetHeader>
  <SheetTitle>Filtros</SheetTitle>
  <SheetDescription>
    Refina tu búsqueda para encontrar el vehículo perfecto
  </SheetDescription>
</SheetHeader> */}

        <div className="mt-6 space-y-2">
          {/* Marca */}
          <FilterSection title="Marca" defaultOpen={false} resetSignal={resetSignal}>
            <div className="space-y-1">
              <FilterOption
                label="Todas las marcas"
                count={Object.values(vehicleCounts.brands).reduce((a, b) => a + b, 0)}
                isSelected={!selectedBrand}
                onClick={() => {
                  setSelectedBrand(null);
                  setSelectedModel(null);
                }}
              />
              {brands.map((brand) => (
                <FilterOption
                  key={brand}
                  label={brand}
                  count={vehicleCounts.brands[brand] || 0}
                  isSelected={selectedBrand === brand}
                  onClick={() => {
                    setSelectedBrand(selectedBrand === brand ? null : brand);
                    setSelectedModel(null);
                  }}
                />
              ))}
            </div>
          </FilterSection>

          {/* Modelo */}
          <FilterSection title="Modelo" defaultOpen={false} resetSignal={resetSignal}>
            <div className="space-y-1">
              <FilterOption
                label="Todos los modelos"
                count={Object.values(vehicleCounts.models).reduce((a, b) => a + b, 0)}
                isSelected={!selectedModel}
                onClick={() => setSelectedModel(null)}
              />
              {models.map((model) => (
                <FilterOption
                  key={model}
                  label={model}
                  count={vehicleCounts.models[model] || 0}
                  isSelected={selectedModel === model}
                  onClick={() => setSelectedModel(selectedModel === model ? null : model)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Combustible */}
          <FilterSection title="Combustible" defaultOpen={false} resetSignal={resetSignal}>
            <div className="space-y-1">
              <FilterOption
                label="Todos"
                count={Object.values(vehicleCounts.fuelTypes).reduce((a, b) => a + b, 0)}
                isSelected={!selectedFuelType}
                onClick={() => setSelectedFuelType(null)}
              />
              {fuels.map((fuel) => (
                <FilterOption
                  key={fuel}
                  label={fuel}
                  count={vehicleCounts.fuelTypes[fuel] || 0}
                  isSelected={selectedFuelType === fuel}
                  onClick={() => setSelectedFuelType(selectedFuelType === fuel ? null : fuel)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Transmisión */}
          <FilterSection title="Transmisión" defaultOpen={false} resetSignal={resetSignal}>
            <div className="space-y-1">
              <FilterOption
                label="Todas"
                count={Object.values(vehicleCounts.transmissions).reduce((a, b) => a + b, 0)}
                isSelected={!selectedTransmission}
                onClick={() => setSelectedTransmission(null)}
              />
              {transmissions.map((trans) => (
                <FilterOption
                  key={trans}
                  label={trans}
                  count={vehicleCounts.transmissions[trans] || 0}
                  isSelected={selectedTransmission === trans}
                  onClick={() =>
                    setSelectedTransmission(selectedTransmission === trans ? null : trans)
                  }
                />
              ))}
            </div>
          </FilterSection>

          {/* Año */}
          <FilterSection title="Año" defaultOpen={false} resetSignal={resetSignal}>
            <div className="space-y-1">
              <FilterOption
                label="Todos los años"
                count={Object.values(vehicleCounts.years).reduce((a, b) => a + b, 0)}
                isSelected={!selectedYear}
                onClick={() => setSelectedYear(null)}
              />
              {years.map((year) => (
                <FilterOption
                  key={year}
                  label={String(year)}
                  count={vehicleCounts.years[year] || 0}
                  isSelected={selectedYear === year}
                  onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Precio */}
          <FilterSection title="Precio" defaultOpen={false} resetSignal={resetSignal}>
            <div className="space-y-1">
              {priceRanges.map((range) => (
                <FilterOption
                  key={range.label}
                  label={range.label}
                  count={vehicleCounts.priceRanges[range.label] || 0}
                  isSelected={priceRange[0] === range.min && priceRange[1] === range.max}
                  onClick={() => handlePriceRangeClick(range.min, range.max)}
                />
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Input
                type="number"
                placeholder="Mínimo"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="h-9 text-sm"
              />
              <span className="text-gray-500">—</span>
              <Input
                type="number"
                placeholder="Máximo"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="h-9 text-sm"
              />
              <button
                type="button"
                onClick={handleCustomPriceRange}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-600 transition-colors hover:bg-gray-900 hover:text-white"
                aria-label="Aplicar rango personalizado"
              >
                <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
              </button>
            </div>

            <div className="mt-3 flex justify-between text-sm text-gray-600">
              <span>{fmtUSD(priceRange[0])}</span>
              <span>{fmtUSD(priceRange[1])}</span>
            </div>
          </FilterSection>

          {/* Color */}
          <FilterSection title="Color" defaultOpen={false} resetSignal={resetSignal}>
            <div className="space-y-1">
              <FilterOption
                label="Todos los colores"
                count={Object.values(vehicleCounts.colors).reduce((a, b) => a + b, 0)}
                isSelected={!selectedColor}
                onClick={() => setSelectedColor(null)}
              />
              {colors.map((color) => (
                <FilterOption
                  key={color}
                  label={color}
                  count={vehicleCounts.colors[color] || 0}
                  isSelected={selectedColor === color}
                  onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Kilometraje */}
          <FilterSection title="Kilometraje" defaultOpen={false} resetSignal={resetSignal}>
            <div className="space-y-1">
              {mileageRanges.map((range) => (
                <FilterOption
                  key={range.label}
                  label={range.label}
                  count={vehicleCounts.mileageRanges[range.label] || 0}
                  isSelected={
                    mileageRange[0] === range.min && mileageRange[1] === range.max
                  }
                  onClick={() => handleMileageRangeClick(range.min, range.max)}
                />
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Input
                type="number"
                placeholder="Mínimo"
                value={minMileageInput}
                onChange={(e) => setMinMileageInput(e.target.value)}
                className="h-9 text-sm"
              />
              <span className="text-gray-500">—</span>
              <Input
                type="number"
                placeholder="Máximo"
                value={maxMileageInput}
                onChange={(e) => setMaxMileageInput(e.target.value)}
                className="h-9 text-sm"
              />
              <button
                type="button"
                onClick={handleCustomMileageRange}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-600 transition-colors hover:bg-gray-900 hover:text-white"
                aria-label="Aplicar rango de km personalizado"
              >
                <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
              </button>
            </div>

            <div className="mt-3 flex justify-between text-sm text-gray-600">
              <span>{fmtKM(mileageRange[0])}</span>
              <span>{fmtKM(mileageRange[1])}</span>
            </div>
          </FilterSection>

          <div className="flex gap-2 mt-6 pt-4">
            <Button variant="outline" onClick={clearFilters} className="flex-1">
              Limpiar
            </Button>
            <Button
              onClick={applyFilters}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Aplicar filtros
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
