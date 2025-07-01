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

  // Validar imágenes y videos: strings no vacíos
  const validMedia = !!car?.images
    ? car.images.filter(
        (media): media is string =>
          typeof media === "string" &&
          media.length > 0
      )
    : [];

  useEffect(() => {
    if (isOpen) setCurrentImageIndex(0);
  }, [car, isOpen]);

  const handlePrevMedia = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? validMedia.length - 1 : prev - 1
    );
  };

  const handleNextMedia = () => {
    setCurrentImageIndex((prev) =>
      prev === validMedia.length - 1 ? 0 : prev + 1
    );
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

  if (!car || validMedia.length === 0) return null;

  const currentMedia = validMedia[currentImageIndex];
  const isVideo = /\.(mp4|webm|ogg)$/i.test(currentMedia);

  return (
    <>
      {/* Modal principal */}
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
            {/* Galería */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg cursor-pointer">
                {isVideo ? (
                  <video
                    src={currentMedia}
                    controls
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div onClick={() => setZoomOpen(true)} className="cursor-zoom-in h-full relative">
                    <Image
                      src={currentMedia}
                      alt={`Imagen ${currentImageIndex}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <ZoomIn className="w-3 h-3" />
                      Zoom
                    </div>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevMedia();
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
                    handleNextMedia();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex space-x-2 overflow-x-auto pb-2">
                {validMedia.map((media, idx) => {
                  const thumbIsVideo = /\.(mp4|webm|ogg)$/i.test(media);
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
                      {thumbIsVideo ? (
                        // Para video thumbnail podés usar el primer frame o ícono
                        <video
                          src={media}
                          muted
                          className="object-cover w-full h-full rounded-md"
                          playsInline
                        />
                      ) : (
                        <Image
                          src={media}
                          alt={`Thumb ${idx}`}
                          fill
                          className="object-cover rounded-md"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Info del auto */}
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

      {/* Modal de zoom SOLO para imágenes */}
      <Dialog open={zoomOpen && !isVideo} onOpenChange={setZoomOpen}>
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
              src={currentMedia}
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
