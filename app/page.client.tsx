"use client";

import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import CarCard from "@/components/car-card";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";
import HeroSection from "@/components/hero-section";
import SiteHeader from "@/components/site-header";
import { Input } from "@/components/ui/input";
import FilterPanel from "@/components/filter-panel";
import { CarType, FilterState } from "@/types";
import Footer from "@/components/footer";
import SoldCarsSection from "@/components/sold-cars-section";
import AboutSection from "@/components/about-section";
import ReviewsSection from "@/components/reviews-section";
import AnimateOnScroll from "@/components/animate-on-scroll";
import { formatAmount, priceScale } from "@/lib/price";

interface ClientPageProps {
  initialCars: CarType[];
  soldCars: CarType[];
  clientPhotos?: string[];
}

export default function ClientPage({ initialCars, soldCars, clientPhotos = [] }: ClientPageProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState<FilterState>(() => {
    const maxPrice   = Math.max(...initialCars.map(c => c.price),   0);
    const minYear    = Math.min(...initialCars.map(c => c.year),  1900);
    const maxYear    = Math.max(...initialCars.map(c => c.year),  2025);
    const maxMileage = Math.max(...initialCars.map(c => c.mileage),  0);
    return {
      brands: [], models: [], transmissions: [], colors: [], fuelTypes: [],
      currency: null,
      priceRange:   [0, maxPrice]      as [number, number],
      yearRange:    [minYear, maxYear] as [number, number],
      mileageRange: [0, maxMileage]    as [number, number],
    };
  });

  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "year-desc" | "mileage-asc">("default");

  const cars = initialCars;

  const defaultRanges = useMemo(() => {
    const maxPrice   = Math.max(...cars.map(c => c.price),   0);
    const minYear    = Math.min(...cars.map(c => c.year),  1900);
    const maxYear    = Math.max(...cars.map(c => c.year),  2025);
    const maxMileage = Math.max(...cars.map(c => c.mileage),  0);
    return {
      price:   [0, maxPrice]      as [number, number],
      year:    [minYear, maxYear] as [number, number],
      mileage: [0, maxMileage]    as [number, number],
    };
  }, [cars]);

  const clearAllFilters = () => {
    setFilters({
      brands: [], models: [], transmissions: [], colors: [], fuelTypes: [],
      currency: null,
      priceRange:   defaultRanges.price,
      yearRange:    defaultRanges.year,
      mileageRange: defaultRanges.mileage,
    });
    setSearchTerm("");
  };

  const filteredCars = useMemo(() => {
    const maxUsd = Math.max(...cars.filter((c) => priceScale(c.price, c.currency) === "USD").map((c) => c.price), 0);
    const maxArs = Math.max(...cars.filter((c) => priceScale(c.price, c.currency) === "ARS").map((c) => c.price), 0);
    const priceCap = filters.currency === "USD" ? maxUsd : filters.currency === "ARS" ? maxArs : defaultRanges.price[1];
    const priceNarrowed = filters.priceRange[0] > 0 || filters.priceRange[1] < priceCap;

    return cars.filter((car) => {
      const searchLower = searchTerm.toLowerCase();
      if (searchTerm) {
        const hay = `${car.brand} ${car.model} ${car.year} ${car.color} ${car.fuelType}`.toLowerCase();
        if (!hay.includes(searchLower)) return false;
      }
      if (filters.brands.length > 0 && !filters.brands.includes(car.brand)) return false;
      if (filters.models.length > 0 && !filters.models.includes(car.model)) return false;
      if (filters.transmissions.length > 0 && !filters.transmissions.includes(car.transmission)) return false;
      if (filters.colors.length > 0 && !filters.colors.includes(car.color)) return false;
      if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(car.fuelType)) return false;
      const scale = priceScale(car.price, car.currency);
      if (filters.currency && scale !== filters.currency) return false;
      if (priceNarrowed && (car.price < filters.priceRange[0] || car.price > filters.priceRange[1])) return false;
      if (car.year < filters.yearRange[0] || car.year > filters.yearRange[1]) return false;
      if (car.mileage < filters.mileageRange[0] || car.mileage > filters.mileageRange[1]) return false;
      return true;
    });
  }, [cars, searchTerm, filters, defaultRanges]);

  const removeBrand        = (b: string) => setFilters(p => ({ ...p, brands:        p.brands.filter(x => x !== b) }));
  const removeModel        = (m: string) => setFilters(p => ({ ...p, models:        p.models.filter(x => x !== m) }));
  const removeTransmission = (t: string) => setFilters(p => ({ ...p, transmissions: p.transmissions.filter(x => x !== t) }));
  const removeColor        = (c: string) => setFilters(p => ({ ...p, colors:        p.colors.filter(x => x !== c) }));
  const removeFuel         = (f: string) => setFilters(p => ({ ...p, fuelTypes:     p.fuelTypes.filter(x => x !== f) }));
  const resetPrice         = ()          => setFilters(p => ({ ...p, currency: null, priceRange: defaultRanges.price }));
  const resetCurrency      = ()          => setFilters(p => ({ ...p, currency: null, priceRange: defaultRanges.price }));
  const resetYear          = ()          => setFilters(p => ({ ...p, yearRange:    defaultRanges.year }));
  const resetMileage       = ()          => setFilters(p => ({ ...p, mileageRange: defaultRanges.mileage }));
  const clearSearch        = ()          => setSearchTerm("");

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    if (searchTerm.trim()) chips.push({ key: `q:${searchTerm}`, label: `Búsqueda: "${searchTerm}"`, onRemove: clearSearch });
    filters.brands.forEach(b => chips.push({ key: `brand:${b}`, label: `Marca: ${b}`, onRemove: () => removeBrand(b) }));
    filters.models.forEach(m => chips.push({ key: `model:${m}`, label: `Modelo: ${m}`, onRemove: () => removeModel(m) }));
    filters.transmissions.forEach(t => chips.push({ key: `tr:${t}`, label: `Transmisión: ${t}`, onRemove: () => removeTransmission(t) }));
    filters.colors.forEach(c => chips.push({ key: `color:${c}`, label: `Color: ${c}`, onRemove: () => removeColor(c) }));
    filters.fuelTypes.forEach(f => chips.push({ key: `fuel:${f}`, label: `Combustible: ${f}`, onRemove: () => removeFuel(f) }));
    if (filters.currency)
      chips.push({ key: "currency", label: filters.currency === "ARS" ? "Moneda: $ ARS" : "Moneda: USD", onRemove: resetCurrency });
    const maxUsd = Math.max(...cars.filter((c) => priceScale(c.price, c.currency) === "USD").map((c) => c.price), 0);
    const maxArs = Math.max(...cars.filter((c) => priceScale(c.price, c.currency) === "ARS").map((c) => c.price), 0);
    const priceCap = filters.currency === "USD" ? maxUsd : filters.currency === "ARS" ? maxArs : defaultRanges.price[1];
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < priceCap)
      chips.push({
        key: `price:${filters.priceRange.join("-")}`,
        label: `Precio: ${formatAmount(filters.priceRange[0])} – ${formatAmount(filters.priceRange[1])}`,
        onRemove: resetPrice,
      });
    if (filters.yearRange[0] !== defaultRanges.year[0] || filters.yearRange[1] !== defaultRanges.year[1])
      chips.push({ key: `year:${filters.yearRange.join("-")}`, label: `Año: ${filters.yearRange[0]} – ${filters.yearRange[1]}`, onRemove: resetYear });
    if (filters.mileageRange[0] !== defaultRanges.mileage[0] || filters.mileageRange[1] !== defaultRanges.mileage[1])
      chips.push({ key: `km:${filters.mileageRange.join("-")}`, label: `Km: ${filters.mileageRange[0].toLocaleString("es-AR")} – ${filters.mileageRange[1].toLocaleString("es-AR")}`, onRemove: resetMileage });
    return chips;
  }, [filters, searchTerm, defaultRanges, cars]);

  const activeFiltersCount = activeChips.length;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader overlay />
      <HeroSection />

      <main id="catalog" className="scroll-mt-20 bg-surface border-y border-gray-100/80">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl pt-12 pb-20 sm:py-20">
          <div className="flex flex-col gap-5 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-2">Stock</p>
                <h2 className="font-title text-[1.75rem] sm:text-4xl md:text-5xl text-ink">Autos disponibles</h2>
                <p className="mt-1.5 text-sm text-gray-500">
                  <span className={activeFiltersCount > 0 ? "text-brand font-semibold" : ""}>
                    {filteredCars.length} vehículo{filteredCars.length !== 1 ? "s" : ""}
                    {activeFiltersCount > 0 ? " encontrados" : " en catálogo"}
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                  <Input
                    placeholder="Buscar marca o modelo..."
                    className="pl-9 pr-4 h-11 w-full rounded-xl border-gray-200 bg-white focus:border-gray-400 text-sm"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setIsFilterOpen(true)}
                    className="relative flex flex-1 sm:flex-none items-center justify-center gap-2 h-11 px-4 rounded-xl border border-gray-200 hover:border-gray-400 bg-white text-sm font-medium text-gray-700 hover:text-gray-900 transition-all">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 10h10M11 16h2" />
                    </svg>
                    Filtros
                    {activeFiltersCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white text-[10px] font-bold">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
                    className="flex-1 sm:flex-none h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 hover:border-gray-400 transition-all cursor-pointer focus:outline-none">
                    <option value="default">Ordenar</option>
                    <option value="price-asc">Precio ↑</option>
                    <option value="price-desc">Precio ↓</option>
                    <option value="year-desc">Más nuevo</option>
                    <option value="mileage-asc">Menos km</option>
                  </select>
                </div>
              </div>
            </div>

            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-xl border border-gray-100">
                {activeChips.map(chip => (
                  <button key={chip.key} onClick={chip.onRemove}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surface border border-gray-200 text-gray-700 hover:border-red-300 hover:text-brand transition-all">
                    {chip.label}
                    <span className="text-gray-400">×</span>
                  </button>
                ))}
                <button onClick={clearAllFilters}
                  className="ml-auto text-xs text-brand hover:text-red-700 font-medium transition-colors">
                  Limpiar todo
                </button>
              </div>
            )}
          </div>

          {filteredCars.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-gray-200 bg-white">
              <div className="text-gray-300 mb-4"><Search className="h-10 w-10 mx-auto" /></div>
              <h3 className="font-title text-2xl text-ink mb-2">No se encontraron vehículos</h3>
              <p className="text-gray-500 mb-5 text-sm">Probá ajustar los filtros o el término de búsqueda.</p>
              <Button variant="outline" onClick={clearAllFilters} className="rounded-full">Limpiar filtros</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {[...filteredCars]
                .sort((a, b) => {
                  const scaleA = priceScale(a.price, a.currency) === "ARS" ? 1 : 0;
                  const scaleB = priceScale(b.price, b.currency) === "ARS" ? 1 : 0;
                  if (sortBy === "price-asc")   return scaleA - scaleB || a.price - b.price;
                  if (sortBy === "price-desc")  return scaleA - scaleB || b.price - a.price;
                  if (sortBy === "year-desc")   return b.year - a.year;
                  if (sortBy === "mileage-asc") return a.mileage - b.mileage;
                  return 0;
                })
                .map((car, index) => (
                  <AnimateOnScroll key={car.id} delay={Math.min(index % 4 * 80, 240)}>
                    <CarCard car={car} />
                  </AnimateOnScroll>
                ))}
            </div>
          )}
        </div>
      </main>

      <AboutSection />
      <ReviewsSection />
      <SoldCarsSection soldCars={soldCars} clientPhotos={clientPhotos} />
      <Footer />

      <a
        href="https://wa.me/5491159456142"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 sm:right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white pl-3.5 pr-3.5 sm:pr-4 h-12 shadow-lg shadow-green-900/30 transition-transform hover:scale-[1.03]"
      >
        <FaWhatsapp className="h-5 w-5" />
        <span className="text-sm font-semibold hidden sm:inline">WhatsApp</span>
      </a>

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        cars={cars}
      />
    </div>
  );
}
