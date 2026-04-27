"use client";

import { Search, Phone } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import CarCard from "@/components/car-card";
import { Button } from "@/components/ui/button";
import { FaWhatsapp, FaTiktok, FaInstagram } from "react-icons/fa";
import Image from "next/image";
import CarDetailsModal from "@/components/car-details-modal";
import HeroSection from "@/components/hero-section";
import { Input } from "@/components/ui/input";
import FilterPanel from "@/components/filter-panel";
import { CarType, FilterState } from "@/types";
import Footer from "@/components/footer";
import SoldCarsSection from "@/components/sold-cars-section";
import AboutSection from "@/components/about-section";
import WhatsAppButton from "@/components/whatsapp-button";
import ReviewsSection from "@/components/reviews-section";
import AnimateOnScroll from "@/components/animate-on-scroll";

interface ClientPageProps {
  initialCars: CarType[];
}

export default function ClientPage({ initialCars }: ClientPageProps) {
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
 const [filters, setFilters] = useState<FilterState>({
  brands: [],
  models: [],
  transmissions: [],
  priceRange: [0, 50000],
  yearRange: [2000, 2025],
  mileageRange: [0, 300000],
  colors: [],
  fuelTypes: [],
});


  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "year-desc" | "mileage-asc">("default");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Use the server-fetched cars instead of the mocked data
  const cars = initialCars;

  const handleOpenModal = (car: CarType) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCar(null), 300);
  };

  const clearAllFilters = () => {
    setFilters({
  brands: [],
  models: [],
  transmissions: [],
  priceRange: [0, 50000],
  yearRange: [2000, 2025],
  mileageRange: [0, 300000],
  colors: [],
  fuelTypes: [],
});
    setSearchTerm("");
  };

  // Calculate available filter options from the car data
  const filterOptions = useMemo(() => {
    const brands = Array.from(new Set(cars.map((car) => car.brand)));
    const transmissions = Array.from(
      new Set(cars.map((car) => car.transmission))
    );
    const colors = Array.from(new Set(cars.map((car) => car.color)));
    const fuelTypes = Array.from(new Set(cars.map((car) => car.fuelType)));
    const maxPrice = Math.max(...cars.map((car) => car.price), 50000);
    const minYear = Math.min(...cars.map((car) => car.year), 2000);
    const maxYear = Math.max(...cars.map((car) => car.year), 2025);
    const maxMileage = Math.max(...cars.map((car) => car.mileage), 300000);

    return {
      brands,
      transmissions,
      colors,
      fuelTypes,
      priceRange: [0, maxPrice],
      yearRange: [minYear, maxYear],
      mileageRange: [0, maxMileage],
    };
  }, [cars]);

  // Apply filters to the car data
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // Search term filter
      const searchLower = searchTerm.toLowerCase();
      if (
        searchTerm &&
        !car.brand.toLowerCase().includes(searchLower) &&
        !car.model.toLowerCase().includes(searchLower)
      ) {
        return false;
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(car.brand)) {
        return false;
      }

      // Model filter 👇 PEGÁ ESTO
if (filters.models.length > 0 && !filters.models.includes(car.model)) {
  return false;
}


      // Transmission filter
      if (
        filters.transmissions.length > 0 &&
        !filters.transmissions.includes(car.transmission)
      ) {
        return false;
      }

      // Color filter
      if (filters.colors.length > 0 && !filters.colors.includes(car.color)) {
        return false;
      }

      // Fuel type filter
      if (
        filters.fuelTypes.length > 0 &&
        !filters.fuelTypes.includes(car.fuelType)
      ) {
        return false;
      }

      // Price range filter
      if (
        car.price < filters.priceRange[0] ||
        car.price > filters.priceRange[1]
      ) {
        return false;
      }

      // Year range filter
      if (car.year < filters.yearRange[0] || car.year > filters.yearRange[1]) {
        return false;
      }

      // Mileage range filter
      if (
        car.mileage < filters.mileageRange[0] ||
        car.mileage > filters.mileageRange[1]
      ) {
        return false;
      }

      return true;
    });
  }, [cars, searchTerm, filters]);

  // ====== helper ranges + chips removibles ======
  const defaultRanges = useMemo(
    () => ({
      price: [0, filterOptions.priceRange[1]] as [number, number],
      year: [
        filterOptions.yearRange[0],
        filterOptions.yearRange[1],
      ] as [number, number],
      mileage: [0, filterOptions.mileageRange[1]] as [number, number],
    }),
    [filterOptions]
  );

  const removeBrand = (b: string) =>
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.filter((x) => x !== b),
    }));

  const removeTransmission = (t: string) =>
    setFilters((prev) => ({
      ...prev,
      transmissions: prev.transmissions.filter((x) => x !== t),
    }));

  const removeColor = (c: string) =>
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.filter((x) => x !== c),
    }));

  const removeFuel = (f: string) =>
    setFilters((prev) => ({
      ...prev,
      fuelTypes: prev.fuelTypes.filter((x) => x !== f),
    }));

  const resetPrice = () =>
    setFilters((prev) => ({
      ...prev,
      priceRange: [0, 50000] as [number, number], // rango base
    }));

  const resetYear = () =>
    setFilters((prev) => ({ ...prev, yearRange: defaultRanges.year }));

  const resetMileage = () =>
    setFilters((prev) => ({ ...prev, mileageRange: defaultRanges.mileage }));

  const clearSearch = () => setSearchTerm("");

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];

    if (searchTerm.trim()) {
      chips.push({
        key: `q:${searchTerm}`,
        label: `Búsqueda: “${searchTerm}”`,
        onRemove: clearSearch,
      });
    }

    filters.brands.forEach((b) =>
      chips.push({
        key: `brand:${b}`,
        label: `Marca: ${b}`,
        onRemove: () => removeBrand(b),
      })
    );

    filters.transmissions.forEach((t) =>
      chips.push({
        key: `tr:${t}`,
        label: `Transmisión: ${t}`,
        onRemove: () => removeTransmission(t),
      })
    );

    filters.colors.forEach((c) =>
      chips.push({
        key: `color:${c}`,
        label: `Color: ${c}`,
        onRemove: () => removeColor(c),
      })
    );

    filters.fuelTypes.forEach((f) =>
      chips.push({
        key: `fuel:${f}`,
        label: `Combustible: ${f}`,
        onRemove: () => removeFuel(f),
      })
    );

    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 50000) {
      chips.push({
        key: `price:${filters.priceRange.join("-")}`,
        label: `Precio: USD ${filters.priceRange[0].toLocaleString()} – USD ${filters.priceRange[1].toLocaleString()}`,
        onRemove: resetPrice,
      });
    }

    if (
      filters.yearRange[0] !== defaultRanges.year[0] ||
      filters.yearRange[1] !== defaultRanges.year[1]
    ) {
      chips.push({
        key: `year:${filters.yearRange.join("-")}`,
        label: `Año: ${filters.yearRange[0]} – ${filters.yearRange[1]}`,
        onRemove: resetYear,
      });
    }

    if (
      filters.mileageRange[0] !== defaultRanges.mileage[0] ||
      filters.mileageRange[1] !== defaultRanges.mileage[1]
    ) {
      chips.push({
        key: `km:${filters.mileageRange.join("-")}`,
        label: `Km: ${filters.mileageRange[0].toLocaleString()} – ${filters.mileageRange[1].toLocaleString()}`,
        onRemove: resetMileage,
      });
    }

    return chips;
  }, [filters, searchTerm, defaultRanges]);

  // 👈 el número del botón Filtros sale directamente de los chips
  const activeFiltersCount = activeChips.length;
  // =====================================================

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md border-b border-gray-100/80 shadow-sm" : "bg-white/10 backdrop-blur-sm border-b border-transparent"
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 shrink-0">
              <div className="relative h-9 w-9">
                <Image src="/logo-ms-motors.png" alt="Logo MS Motors" fill className="object-contain" />
              </div>
              <span className={`text-lg font-bold tracking-tight transition-colors ${scrolled ? "text-gray-900" : "text-white"}`}>
                MS<span className="text-red-500"> Motors</span>
              </span>
            </a>

            {/* Nav desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { href: "#", label: "Inicio" },
                { href: "#catalog", label: "Catálogo" },
                { href: "#nosotros", label: "Nosotros" },
                { href: "#vendidos", label: "Vendidos" },
              ].map(({ href, label }) => (
                <a key={label} href={href}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                    scrolled ? "text-gray-600 hover:text-red-600 hover:bg-red-50" : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}>
                  {label}
                </a>
              ))}
            </nav>

            {/* Acciones */}
            <div className="flex items-center gap-1.5">
              <a href="https://www.instagram.com/ms.motorsquilmes/" target="_blank" rel="noreferrer" aria-label="Instagram"
                className={`hidden sm:flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                  scrolled ? "text-gray-500 hover:text-red-600 hover:bg-red-50" : "text-white/70 hover:text-white hover:bg-white/10"
                }`}>
                <FaInstagram className="h-4 w-4" />
              </a>
              <a href="https://www.tiktok.com/@msmotorsquilmes" target="_blank" rel="noreferrer" aria-label="TikTok"
                className={`hidden sm:flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                  scrolled ? "text-gray-500 hover:text-red-600 hover:bg-red-50" : "text-white/70 hover:text-white hover:bg-white/10"
                }`}>
                <FaTiktok className="h-4 w-4" />
              </a>

              {/* WhatsApp CTA */}
              <a href="https://wa.me/5491159456142" target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full transition-all hover:scale-[1.02] ${
                  scrolled ? "bg-gray-900 hover:bg-gray-800 text-white" : "bg-white text-gray-900 hover:bg-white/90"
                }`}>
                <Phone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Contactar</span>
              </a>

              {/* Menú hamburguesa mobile */}
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className={`flex md:hidden h-9 w-9 items-center justify-center rounded-full transition-all ${
                  scrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/10"
                }`}
                aria-label="Menú"
              >
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

          {/* Nav mobile desplegable */}
          {mobileMenuOpen && (
            <nav className="md:hidden border-t border-gray-100 py-3 flex flex-col gap-1">
              {[
                { href: "#", label: "Inicio" },
                { href: "#catalog", label: "Catálogo" },
                { href: "#nosotros", label: "Nosotros" },
                { href: "#vendidos", label: "Vendidos" },
              ].map(({ href, label }) => (
                <a key={label} href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  {label}
                </a>
              ))}
              <div className="flex gap-3 px-4 pt-2 border-t border-gray-100 mt-1">
                <a href="https://www.instagram.com/ms.motorsquilmes/" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors">
                  <FaInstagram className="h-4 w-4" /> Instagram
                </a>
                <a href="https://www.tiktok.com/@msmotorsquilmes" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors">
                  <FaTiktok className="h-4 w-4" /> TikTok
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Nosotros */}
      <AboutSection />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <section id="catalog" className="scroll-mt-20">

          {/* Encabezado + buscador */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  Catálogo de Vehículos
                </h2>
                <p className="text-gray-500 mt-1 text-sm">
                  <span className={activeFiltersCount > 0 ? "text-red-600 font-semibold" : "text-gray-500"}>
                    {filteredCars.length} vehículo{filteredCars.length !== 1 ? "s" : ""}{activeFiltersCount > 0 ? " encontrados" : " disponibles"}
                  </span>
                </p>
              </div>

              {/* Búsqueda + Filtros — full width en mobile */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                  <Input
                    placeholder="Buscar marca o modelo..."
                    className="pl-9 pr-4 h-10 w-full rounded-xl border-gray-200 focus:border-gray-400 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="relative flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 hover:border-gray-400 bg-white text-sm font-medium text-gray-700 hover:text-gray-900 transition-all whitespace-nowrap shrink-0"
                >
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

                {/* Ordenar */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 hover:border-gray-400 transition-all shrink-0 cursor-pointer focus:outline-none"
                >
                  <option value="default">Ordenar</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="year-desc">Año: más nuevo</option>
                  <option value="mileage-asc">Kilometraje: menor</option>
                </select>
              </div>
            </div>

            {/* Chips de filtros activos */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                {activeChips.map((chip) => (
                  <button
                    key={chip.key}
                    onClick={chip.onRemove}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600 transition-all"
                  >
                    {chip.label}
                    <span className="text-gray-400 hover:text-red-500">×</span>
                  </button>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="ml-auto text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Limpiar todo
                </button>
              </div>
            )}
          </div>

          {filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron vehículos
              </h3>
              <p className="text-gray-600 mb-4">
                Intenta ajustar tus filtros o términos de búsqueda
              </p>
              <Button variant="outline" onClick={clearAllFilters}>
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...filteredCars]
                .sort((a, b) => {
                  if (sortBy === "price-asc") return a.price - b.price;
                  if (sortBy === "price-desc") return b.price - a.price;
                  if (sortBy === "year-desc") return b.year - a.year;
                  if (sortBy === "mileage-asc") return a.mileage - b.mileage;
                  return 0;
                })
                .map((car, index) => (
                <AnimateOnScroll key={car.id} delay={Math.min(index % 4 * 80, 240)}>
                  <CarCard
                    car={car}
                    onViewDetails={() => handleOpenModal(car)}
                  />
                </AnimateOnScroll>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Reseñas */}
      <ReviewsSection />

      {/* Sección autos vendidos */}
      <SoldCarsSection />

      {/* Footer con Google Maps */}
      <Footer />

      {/* Car Details Modal */}
      {selectedCar && (
        <CarDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          car={selectedCar}
        />
      )}

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        cars={cars}
      />

      {/* Botón flotante “Subir” */}
      <WhatsAppButton />
    </div>
  );
}