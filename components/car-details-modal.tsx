"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, MessageCircle, ZoomIn } from "lucide-react";
import Image from "next/image";
import type { Car } from "@/types";

interface CarDetailsModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CarDetailsModal({
  car,
  isOpen,
  onClose,
}: CarDetailsModalProps) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formattedPrice, setFormattedPrice] = useState("");
  const [formattedMileage, setFormattedMileage] = useState("");
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const validImages = !!car?.images
    ? car.images.filter(
        (img): img is string =>
          typeof img === "string" &&
          img.length > 0 &&
          !img.includes("video") &&
          !img.includes(".mp4")
      )
    : [];

  useEffect(() => {
    if (isOpen) setCurrentImageIndex(0);
  }, [car, isOpen]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  };

  // Teclado ← →
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || zoomOpen) return;
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, zoomOpen, validImages.length]);

  // Swipe táctil
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEndX(e.changedTouches[0].clientX);
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (deltaX > 50) handlePrevImage();
    if (deltaX < -50) handleNextImage();
  };

  useEffect(() => {
    if (car?.price) {
      setFormattedPrice(
        new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(car.price)
      );
    }
    if (car?.mileage) {
      setFormattedMileage(
        new Intl.NumberFormat("es-AR").format(car.mileage) + " km"
      );
    }
  }, [car]);

  if (!car || validImages.length === 0) return null;

  const currentImage = validImages[currentImageIndex];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {car.model} - {car.year}
            </DialogTitle>
            <DialogDescription>Detalles del vehículo seleccionado.</DialogDescription>
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
              <div
                className="relative aspect-[4/3] w-full overflow-hidden rounded-lg cursor-zoom-in"
                onClick={() => setZoomOpen(true)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  src={currentImage}
                  alt={`Imagen ${currentImageIndex}`}
                  fill
                  className="object-cover"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
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
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <ZoomIn className="w-3 h-3" />
                  Zoom
                </div>
              </div>

              <div className="flex space-x-2 overflow-x-auto pb-2">
                {validImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                      currentImageIndex === idx
                        ? "border-red-600"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumb ${idx}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
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

      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-black">
          <DialogTitle className="sr-only">Zoom de imagen</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoomOpen(false)}
            className="absolute right-4 top-4 z-50 text-white"
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="relative w-full h-[80vh]">
            <Image
              src={currentImage}
              alt="Zoom"
              fill
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
