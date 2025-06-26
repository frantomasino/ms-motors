"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, MessageCircle } from "lucide-react";
import Image from "next/image";
import type { Car } from "@/types";

interface CarDetailsModalProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
}

export default function CarDetailsModal({
  car,
  isOpen,
  onClose,
}: CarDetailsModalProps) {
  // Índice de la imagen actual del modal principal
  const getFirstImageIndex = () => {
    const idx = car.images.findIndex(
      (img) => img && !img.includes(".mp4") && !img.includes("video")
    );
    return idx === -1 ? 0 : idx;
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(getFirstImageIndex);
  // Estado del Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  // Índice que se muestra en el Lightbox (solo imágenes sin videos)
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Filtrar solo imágenes para Lightbox (sin videos)
  const imagesOnly = car.images.filter(
    (img) => img && !img.includes(".mp4") && !img.includes("video")
  );

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(getFirstImageIndex());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setLightboxOpen(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, car.images]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? car.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === car.images.length - 1 ? 0 : prev + 1
    );
  };

  // Abrir Lightbox en la imagen clickeada (solo imágenes, sin videos)
  const openLightboxAt = (indexInAllImages: number) => {
    // Encontrar índice correspondiente en imagesOnly
    const url = car.images[indexInAllImages];
    const indexInFiltered = imagesOnly.findIndex((img) => img === url);
    if (indexInFiltered !== -1) {
      setLightboxIndex(indexInFiltered);
      setLightboxOpen(true);
    }
  };

  // Navegación Lightbox
  const lightboxPrev = () => {
    setLightboxIndex((i) => (i === 0 ? imagesOnly.length - 1 : i - 1));
  };
  const lightboxNext = () => {
    setLightboxIndex((i) => (i === imagesOnly.length - 1 ? 0 : i + 1));
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <>
      {/* Modal principal */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto relative">
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">
              {car.model} - {car.year}
            </DialogTitle>
          </DialogHeader>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4"
            aria-label="Cerrar modal"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-4">
              {/* Imagen principal clickeable para abrir Lightbox */}
              <div
                onClick={() => openLightboxAt(currentImageIndex)}
                className="cursor-pointer relative aspect-[4/3] w-full overflow-hidden rounded-lg"
              >
                {car.images[currentImageIndex]?.includes(".mp4") ||
                car.images[currentImageIndex]?.includes("video") ? (
                  <video
                    src={car.images[currentImageIndex]}
                    controls
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Image
                    src={car.images[currentImageIndex] || "/placeholder.svg"}
                    alt={`${car.model} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                  />
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Miniaturas clickeables para abrir Lightbox */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {car.images.map((image, index) => {
                  const isVideo =
                    image.includes(".mp4") || image.includes("video");
                  return (
                    <button
                      key={index}
                      onClick={() => openLightboxAt(index)}
                      className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                        currentImageIndex === index
                          ? "border-red-600"
                          : "border-transparent"
                      }`}
                      aria-label={`Ver imagen ${index + 1}`}
                    >
                      {isVideo ? (
                        <>
                          <video
                            src={image}
                            muted
                            preload="metadata"
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-4.586-2.623A1 1 0 009 9.382v5.236a1 1 0 001.166.987l4.586-2.623a1 1 0 000-1.732z"
                              />
                            </svg>
                          </div>
                        </>
                      ) : (
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${car.model} thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Datos del auto */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {formatPrice(car.price)}
                </div>

                <div className="space-y-2 divide-y divide-gray-200">
                  <div className="grid grid-cols-2 py-2">
                    <span className="text-gray-600 font-medium">Color:</span>
                    <span>{car.color}</span>
                  </div>

                  <div className="grid grid-cols-2 py-2">
                    <span className="text-gray-600 font-medium">Combustible:</span>
                    <span>{car.fuelType}</span>
                  </div>

                  <div className="grid grid-cols-2 py-2">
                    <span className="text-gray-600 font-medium">Kilometraje:</span>
                    <span>{car.mileage.toLocaleString()} km</span>
                  </div>

                  <div className="grid grid-cols-2 py-2">
                    <span className="text-gray-600 font-medium">Transmisión:</span>
                    <span>{car.transmission}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Descripción:</h3>
                <p className="text-gray-600">{car.description}</p>
              </div>

              <div className="pt-4">
                <Button
                  asChild
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <a
                    href={`https://wa.me/5491159456142?text=${encodeURIComponent(
                      `Hola! Estoy interesado en el ${car.brand} ${car.model}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Contactar por WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox para ampliar imágenes */}
      <Dialog open={lightboxOpen} onOpenChange={(open) => !open && setLightboxOpen(false)}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden bg-black/90 flex flex-col items-center justify-center relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 text-white"
            aria-label="Cerrar lightbox"
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="relative w-full max-w-5xl aspect-[4/3] select-none">
            <Image
              src={imagesOnly[lightboxIndex]}
              alt={`Imagen ampliada ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLightboxIndex(lightboxIndex === 0 ? imagesOnly.length - 1 : lightboxIndex - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/70 rounded-full"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLightboxIndex(lightboxIndex === imagesOnly.length - 1 ? 0 : lightboxIndex + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/70 rounded-full"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
