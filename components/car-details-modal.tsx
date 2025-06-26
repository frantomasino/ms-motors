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
  const getFirstImageIndex = () => {
    const idx = car.images.findIndex(
      (img) => img && !img.includes(".mp4") && !img.includes("video")
    );
    return idx === -1 ? 0 : idx;
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(getFirstImageIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(getFirstImageIndex());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-2xl font-bold">
            {car.model} - {car.year}
          </DialogTitle>
        </DialogHeader>

        {/* Botón de cerrar personalizado */}
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
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
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
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2">
              {[...car.images]
                .map((image, index) => ({ image, index }))
                .sort((a, b) => {
                  const isVideoA =
                    a.image.includes(".mp4") || a.image.includes("video");
                  const isVideoB =
                    b.image.includes(".mp4") || b.image.includes("video");
                  return isVideoA === isVideoB ? 0 : isVideoA ? 1 : -1;
                })
                .map(({ image, index }) => {
                  const isVideo =
                    image.includes(".mp4") || image.includes("video");
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
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
  );
}