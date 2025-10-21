"use client";

import { useState, useMemo } from "react";
import CarCard from "@/components/car-card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { FaWhatsapp, FaTiktok, FaInstagram } from "react-icons/fa";
import Image from "next/image";
import CarDetailsModal from "@/components/car-details-modal";
import HeroSection from "@/components/hero-section";
import { Input } from "@/components/ui/input";
import FilterPanel from "@/components/filter-panel";
import { CarType, FilterState } from "@/types";
import ScrollToTopButton from "@/components/scroll-to-top-button"; // 👈 agregado

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
    transmissions: [],
    priceRange: [0, 50000],
    yearRange: [2000, 2025],
    mileageRange: [0, 300000],
    colors: [],
    fuelTypes: [],
  });

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

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.brands.length > 0) count++;
    if (filters.transmissions.length > 0) count++;
    if (filters.colors.length > 0) count++;
    if (filters.fuelTypes.length > 0) count++;
    if (
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < filterOptions.priceRange[1]
    )
      count++;
    if (
      filters.yearRange[0] > filterOptions.yearRange[0] ||
      filters.yearRange[1] < filterOptions.yearRange[1]
    )
      count++;
    if (
      filters.mileageRange[0] > 0 ||
      filters.mileageRange[1] < filterOptions.mileageRange[1]
    )
      count++;
    return count;
  }, [filters, filterOptions]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-2">
              <div className="relative h-10 w-10">
                <Image
                  src="/logo-ms-motors.png"
                  alt="Logo MS Motors"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-gray-900">
                MS<span className="text-red-600"> Motors</span>
              </span>
            </a>

            <div className="hidden md:flex items-center space-x-6">
              <a
                href="#"
                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                Inicio
              </a>
              <a
                href="#catalog"
                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                Catálogo
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/ms.motorsquilmes/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-700 hover:text-red-600 hover:bg-red-50"
                >
                  <FaInstagram className="h-5 w-5" />
                </Button>
              </a>

              <a
                href="https://www.tiktok.com/@msmotorsquilmes"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-700 hover:text-red-600 hover:bg-red-50"
                >
                  <FaTiktok className="h-5 w-5" />
                </Button>
              </a>

              <a
                href="https://wa.me/5491159456142"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <FaWhatsapp className="h-4 w-4 mr-2" />
                  Contactar
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <section id="catalog" className="scroll-mt-20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Catálogo de Vehículos
              </h2>
              <p className="text-gray-600 mt-2">
                {filteredCars.length} vehículo
                {filteredCars.length !== 1 ? "s" : ""} encontrado
                {filteredCars.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por marca o modelo..."
                  className="pl-10 pr-4 py-2 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="whitespace-nowrap relative"
                onClick={() => setIsFilterOpen(true)}
              >
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(activeFiltersCount > 0 || searchTerm) && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Filtros activos:
                </span>
                {searchTerm && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Búsqueda: "{searchTerm}"
                  </span>
                )}
                {filters.brands.map((brand) => (
                  <span
                    key={brand}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {brand}
                  </span>
                ))}
                {filters.transmissions.map((transmission) => (
                  <span
                    key={transmission}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {transmission}
                  </span>
                ))}
                {filters.colors.map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                  >
                    {color}
                  </span>
                ))}
                {filters.fuelTypes.map((fuel) => (
                  <span
                    key={fuel}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                  >
                    {fuel}
                  </span>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-red-600 hover:text-red-700"
              >
                Limpiar todos los filtros
              </Button>
            </div>
          )}

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
              {filteredCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onViewDetails={() => handleOpenModal(car)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <a href="#">
                  <div className="relative h-10 w-10 bg-white rounded-full p-2 overflow-hidden cursor-pointer">
                    <Image
                      src="/logo-ms-motors.png"
                      alt="MS Motors Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </a>

                <span className="text-xl font-bold">
                  MS<span className="text-red-500"> Motors</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Compra segura, atención personalizada y premium para todos
                nuestros clientes.
              </p>
              <div className="flex space-x-4 mt-4">
                <a
                  href="https://wa.me/5491159456142"
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-red-400 hover:bg-gray-800 rounded-full"
                  >
                    <FaWhatsapp className="h-5 w-5" />
                  </Button>
                </a>

                <a
                  href="https://www.instagram.com/ms.motorsquilmes/"
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-red-400 hover:bg-gray-800 rounded-full"
                  >
                    <FaInstagram className="h-5 w-5" />
                  </Button>
                </a>

                <a
                  href="https://www.tiktok.com/@msmotorsquilmes"
                  target="_blank"
                  rel="noreferrer"
                  title="TikTok"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-red-400 hover:bg-gray-800 rounded-full"
                  >
                    <FaTiktok className="h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Inicio
                  </a>
                </li>
                <li>
                  <a
                    href="#catalog"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Catálogo
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/5491159456142"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Servicios</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Compra de autos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Venta de autos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Seguros
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Consignación
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Contacto</h3>
              <address className="not-italic text-gray-400">
                <p className="mb-2">Quilmes. Buenos Aires</p>
                <p className="mb-2">+54 11 5945-6142</p>
              </address>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>
              &copy; {new Date().getFullYear()} MS Motors. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </footer>

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

      {/* 👇 Botón flotante “Subir” (oculto si el modal está abierto) */}
      <ScrollToTopButton hidden={isModalOpen} />
    </div>
  );
}
