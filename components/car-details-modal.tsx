"use client";

import { useEffect, useState, useCallback } from "react";
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  const getFirstImageIndex = () =>
    car.images.findIndex(
      (img) => img && !img.includes(".mp4") && !img.includes("video")
    ) || 0;

  const [currentImageIndex, setCurrentImageIndex] = useState(getFirstImageIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [formattedPrice, setFormattedPrice] = useState("");
  const [formattedMileage, setFormattedMileage] = useState("");

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? car.images.length - 1 : prev - 1
    );
  }, [car.images]);

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === car.images.length - 1 ? 0 : prev + 1
    );
  }, [car.images]);

  const toggleZoom = () => setIsZoomed((prev) => !prev);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextImage, handlePrevImage, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      setScrollPosition(scrollY);
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollPosition);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollPosition);
    };
  }, [isOpen, scrollPosition]);

  useEffect(() => {
    setFormattedPrice(
      new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(car.price)
    );
    setFormattedMileage(
      new Intl.NumberFormat("es-AR").format(car.mileage) + " km"
    );
  }, [car]);

  const currentImage = car.images[currentImageIndex];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`sm:max-w-3xl w-full ${
          isMobile
            ? "max-h-screen overflow-hidden"
            : "max-h-[90vh] overflow-y-auto"
        }`}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {car.model} - {car.year}
          </DialogTitle>
        </DialogHeader>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 z-50"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              {currentImage?.includes(".mp4") ||
              currentImage?.includes("video") ? (
                <video
                  src={currentImage}
                  controls
                  className="object-cover w-full h-full"
                />
              ) : !isZoomed && !isMobile ? (
                <div
                  onClick={toggleZoom}
                  className="relative w-full h-full cursor-zoom-in"
                >
                  <Image
                    src={currentImage || "/placeholder.svg"}
                    alt={`Image ${currentImageIndex}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : !isZoomed && isMobile ? (
                <Image
                  src={currentImage || "/placeholder.svg"}
                  alt={`Image ${currentImageIndex}`}
                  fill
                  className="object-cover"
                />
              ) : (
                !isMobile && (
                  <div
                    onClick={toggleZoom}
                    className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center cursor-zoom-out overflow-auto"
                  >
                    <Image
                      src={currentImage || "/placeholder.svg"}
                      alt={`Zoom Image ${currentImageIndex}`}
                      width={1000}
                      height={800}
                      className="object-contain max-h-full max-w-full"
                    />
                    <button
                      onClick={toggleZoom}
                      className="absolute top-4 right-4 text-white text-3xl font-bold bg-black bg-opacity-50 rounded-full px-3"
                    >
                      ×
                    </button>
                  </div>
                )
              )}

              {!isZoomed && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2">
              {car.images.map((img, idx) => {
                const isVideo = img.includes(".mp4") || img.includes("video");
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                      currentImageIndex === idx
                        ? "border-red-600"
                        : "border-transparent"
                    }`}
                  >
                    {isVideo ? (
                      <video
                        src={img}
                        muted
                        preload="metadata"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`Thumb ${idx}`}
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
                {formattedPrice}
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
                  <span>{formattedMileage}</span>
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
