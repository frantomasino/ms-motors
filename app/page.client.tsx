"use client";

import { Search, Phone } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import CarCard from "@/components/car-card";
import { Button } from "@/components/ui/button";
import { FaTiktok, FaInstagram } from "react-icons/fa";
import Image from "next/image";
import CarDetailsModal from "@/components/car-details-modal";
import HeroSection from "@/components/hero-section";
import { Input } from "@/components/ui/input";
import FilterPanel from "@/components/filter-panel";
import { CarType, FilterState } from "@/types";
import Footer from "@/components/footer";
import SoldCarsSection from "@/components/sold-cars-section";
import AboutSection from "@/components/about-section";
import ReviewsSection from "@/components/reviews-section";
import AnimateOnScroll from "@/components/animate-on-scroll";

interface ClientPageProps {
  initialCars: CarType[];
  soldCars: CarType[];
  clientPhotos?: string[];
}

export default function ClientPage({ initialCars, soldCars, clientPhotos = [] }: ClientPageProps) {
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Inicialización lazy — usa los valores reales del catálogo desde el primer render
  const [filters, setFilters] = useState<FilterState>(() => {
    const maxPrice   = Math.max(...initialCars.map(c => c.price),   0);
    const minYear    = Math.min(...initialCars.map(c => c.year),  1900);
    const maxYear    = Math.max(...initialCars.map(c => c.year),  2025);
    const maxMileage = Math.max(...initialCars.map(c => c.mileage),  0);
    return {
      brands: [], models: [], transmissions: [], colors: [], fuelTypes: [],
      priceRange:   [0, maxPrice]      as [number, number],
      yearRange:    [minYear, maxYear] as [number, number],
      mileageRange: [0, maxMileage]    as [number, number],
    };
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "year-desc" | "mileage-asc">("default");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cars = initialCars;

  const handleOpenModal = (car: CarType) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCar(null), 300);
  };

  // Rangos reales del catálogo
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
      priceRange:   defaultRanges.price,
      yearRange:    defaultRanges.year,
      mileageRange: defaultRanges.mileage,
    });
    setSearchTerm("");
  };

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const searchLower = searchTerm.toLowerCase();
      if (searchTerm && !car.brand.toLowerCase().includes(searchLower) && !car.model.toLowerCase().includes(searchLower)) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(car.brand)) return false;
      if (filters.models.length > 0 && !filters.models.includes(car.model)) return false;
      if (filters.transmissions.length > 0 && !filters.transmissions.includes(car.transmission)) return false;
      if (filters.colors.length > 0 && !filters.colors.includes(car.color)) return false;
      if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(car.fuelType)) return false;
      if (car.price < filters.priceRange[0] || car.price > filters.priceRange[1]) return false;
      if (car.year < filters.yearRange[0] || car.year > filters.yearRange[1]) return false;
      if (car.mileage < filters.mileageRange[0] || car.mileage > filters.mileageRange[1]) return false;
      return true;
    });
  }, [cars, searchTerm, filters]);

  const removeBrand        = (b: string) => setFilters(p => ({ ...p, brands:        p.brands.filter(x => x !== b) }));
  const removeModel        = (m: string) => setFilters(p => ({ ...p, models:        p.models.filter(x => x !== m) }));
  const removeTransmission = (t: string) => setFilters(p => ({ ...p, transmissions: p.transmissions.filter(x => x !== t) }));
  const removeColor        = (c: string) => setFilters(p => ({ ...p, colors:        p.colors.filter(x => x !== c) }));
  const removeFuel         = (f: string) => setFilters(p => ({ ...p, fuelTypes:     p.fuelTypes.filter(x => x !== f) }));
  const resetPrice         = ()          => setFilters(p => ({ ...p, priceRange:   defaultRanges.price }));
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
    if (filters.priceRange[0] !== defaultRanges.price[0] || filters.priceRange[1] !== defaultRanges.price[1])
      chips.push({ key: `price:${filters.priceRange.join("-")}`, label: `Precio: USD ${filters.priceRange[0].toLocaleString("es-AR")} – USD ${filters.priceRange[1].toLocaleString("es-AR")}`, onRemove: resetPrice });
    if (filters.yearRange[0] !== defaultRanges.year[0] || filters.yearRange[1] !== defaultRanges.year[1])
      chips.push({ key: `year:${filters.yearRange.join("-")}`, label: `Año: ${filters.yearRange[0]} – ${filters.yearRange[1]}`, onRemove: resetYear });
    if (filters.mileageRange[0] !== defaultRanges.mileage[0] || filters.mileageRange[1] !== defaultRanges.mileage[1])
      chips.push({ key: `km:${filters.mileageRange.join("-")}`, label: `Km: ${filters.mileageRange[0].toLocaleString("es-AR")} – ${filters.mileageRange[1].toLocaleString("es-AR")}`, onRemove: resetMileage });
    return chips;
  }, [filters, searchTerm, defaultRanges]);

  const activeFiltersCount = activeChips.length;

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "border-b border-gray-100 shadow-[0_8px_24px_rgba(16,24,40,0.06)]" : "border-b border-transparent"
      }`}>
        <div className="brand-stripe" />
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl">
          <div className="flex items-center justify-between h-14 sm:h-[4.25rem]">

            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 shrink-0">
              <div className="relative h-9 w-9 sm:h-10 sm:w-10">
                <Image src="/logo-ms-motors.png" alt="Logo MS Motors" fill className="object-contain" />
              </div>
              <span className="font-title text-xl tracking-tight text-ink">
                MS<span className="text-brand"> Motors</span>
              </span>
            </a>

            {/* Nav desktop */}
            <nav className="hidden md:flex items-center gap-0.5">
              {[
                { href: "#",         label: "Inicio" },
                { href: "#catalog",  label: "Catálogo" },
                { href: "#nosotros", label: "Nosotros" },
                { href: "#vendidos", label: "Vendidos" },
              ].map(({ href, label }) => (
                <a key={label} href={href}
                  className="px-3.5 py-1.5 text-[13px] font-medium rounded-lg text-gray-600 hover:text-brand hover:bg-red-50/80 transition-all">
                  {label}
                </a>
              ))}
            </nav>

            {/* Acciones */}
            <div className="flex items-center gap-1.5">
              <a href="https://www.instagram.com/ms.motorsquilmes/" target="_blank" rel="noreferrer" aria-label="Instagram"
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:text-brand hover:bg-red-50 transition-all">
                <FaInstagram className="h-4 w-4" />
              </a>
              <a href="https://www.tiktok.com/@msmotorsquilmes" target="_blank" rel="noreferrer" aria-label="TikTok"
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:text-brand hover:bg-red-50 transition-all">
                <FaTiktok className="h-4 w-4" />
              </a>
              <a href="https://wa.me/5491159456142" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full bg-ink hover:bg-black text-white transition-all hover:scale-[1.02]">
                <Phone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Contactar</span>
              </a>
              <button onClick={() => setMobileMenuOpen(v => !v)}
                className="flex md:hidden h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-all"
                aria-label="Menú">
                {mobileMenuOpen ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Nav mobile */}
          {mobileMenuOpen && (
            <nav className="md:hidden border-t border-gray-100 py-3 flex flex-col gap-1">
              {[
                { href: "#",         label: "Inicio" },
                { href: "#catalog",  label: "Catálogo" },
                { href: "#nosotros", label: "Nosotros" },
                { href: "#vendidos", label: "Vendidos" },
              ].map(({ href, label }) => (
                <a key={label} href={href} onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-brand hover:bg-red-50 rounded-lg transition-all">
                  {label}
                </a>
              ))}
              <div className="flex gap-3 px-4 pt-2 border-t border-gray-100 mt-1">
                <a href="https://www.instagram.com/ms.motorsquilmes/" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors">
                  <FaInstagram className="h-4 w-4" /> Instagram
                </a>
                <a href="https://www.tiktok.com/@msmotorsquilmes" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors">
                  <FaTiktok className="h-4 w-4" /> TikTok
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

      <HeroSection />
      <AboutSection />

      <main className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl py-10 sm:py-16">
        <section id="catalog" className="scroll-mt-20">

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-2">Stock</p>
                <h2 className="font-title text-3xl sm:text-4xl md:text-5xl text-ink">Autos disponibles</h2>
                <p className="mt-1.5 text-sm">
                  <span className={activeFiltersCount > 0 ? "text-brand font-semibold" : "text-gray-500"}>
                    {filteredCars.length} vehículo{filteredCars.length !== 1 ? "s" : ""}
                    {activeFiltersCount > 0 ? " encontrados" : " en catálogo"}
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                  <Input
                    placeholder="Buscar marca o modelo..."
                    className="pl-9 pr-4 h-10 w-full rounded-xl border-gray-200 focus:border-gray-400 text-sm"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setIsFilterOpen(true)}
                    className="relative flex flex-1 sm:flex-none items-center justify-center gap-2 h-10 px-4 rounded-xl border border-gray-200 hover:border-gray-400 bg-white text-sm font-medium text-gray-700 hover:text-gray-900 transition-all">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 10h10M11 16h2" />
                    </svg>
                    Filtros
                    {activeFiltersCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
                    className="flex-1 sm:flex-none h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 hover:border-gray-400 transition-all cursor-pointer focus:outline-none">
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
              <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                {activeChips.map(chip => (
                  <button key={chip.key} onClick={chip.onRemove}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600 transition-all">
                    {chip.label}
                    <span className="text-gray-400 hover:text-red-500">×</span>
                  </button>
                ))}
                <button onClick={clearAllFilters}
                  className="ml-auto text-xs text-red-500 hover:text-red-700 font-medium transition-colors">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...filteredCars]
                .sort((a, b) => {
                  if (sortBy === "price-asc")   return a.price - b.price;
                  if (sortBy === "price-desc")  return b.price - a.price;
                  if (sortBy === "year-desc")   return b.year - a.year;
                  if (sortBy === "mileage-asc") return a.mileage - b.mileage;
                  return 0;
                })
                .map((car, index) => (
                  <AnimateOnScroll key={car.id} delay={Math.min(index % 4 * 80, 240)}>
                    <CarCard car={car} onViewDetails={() => handleOpenModal(car)} />
                  </AnimateOnScroll>
                ))}
            </div>
          )}
        </section>
      </main>

      <ReviewsSection />
      <SoldCarsSection soldCars={soldCars} clientPhotos={clientPhotos} />
      <Footer />

      {selectedCar && (
        <CarDetailsModal isOpen={isModalOpen} onClose={handleCloseModal} car={selectedCar} />
      )}

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