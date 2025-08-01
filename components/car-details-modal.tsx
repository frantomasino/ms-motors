"use client";

import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  X,
  MessageCircle,
  ZoomIn,
} from "lucide-react";
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
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [formattedPrice, setFormattedPrice] = useState("");
  const [formattedMileage, setFormattedMileage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const mediaList = car?.images ?? [];

  useEffect(() => {
    if (isOpen) setCurrentMediaIndex(0);
  }, [car, isOpen]);

  // Bloquear scroll al abrir modal
  useEffect(() => {
    if (isOpen || zoomOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, zoomOpen]);

  const isVideo = (url: string) =>
    url.endsWith(".mp4") ||
    url.includes("video") ||
    url.includes(".mov") ||
    url.includes(".webm");

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === 0 ? mediaList.length - 1 : prev - 1
    );
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === mediaList.length - 1 ? 0 : prev + 1
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

  if (!car || mediaList.length === 0) return null;

  const currentMedia = mediaList[currentMediaIndex];
  const currentIsVideo = isVideo(currentMedia);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") handlePrevMedia();
      if (e.key === "ArrowRight") handleNextMedia();
      if (e.key === "Escape") {
        if (zoomOpen) setZoomOpen(false);
        else onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, zoomOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-3xl w-full max-h-[95vh] overflow-y-auto flex flex-col justify-center items-center relative">
          <DialogHeader className="w-full relative">
            <DialogTitle className="text-2xl font-bold">
              {car.model} - {car.year}
            </DialogTitle>
            <DialogDescription>Detalles del vehículo seleccionado.</DialogDescription>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-4 top-4 z-[50] bg-white/80 backdrop-blur text-black"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6 mt-4 w-full">
            {/* Galería */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                <div
                  className="relative w-full h-full cursor-zoom-in"
                  onClick={() => setZoomOpen(true)}
                >
                  {currentIsVideo ? (
                    <video
                      src={currentMedia}
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <>
                      <Image
                        src={currentMedia}
                        alt={`Imagen ${currentMediaIndex}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <ZoomIn className="w-3 h-3" />
                        Zoom
                      </div>
                    </>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevMedia}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextMedia}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div ref={scrollRef} className="flex space-x-2 overflow-x-auto pb-2">
                {mediaList.map((media, idx) => {
                  const thumbIsVideo = isVideo(media);
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentMediaIndex(idx)}
                      className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                        currentMediaIndex === idx
                          ? "border-red-600"
                          : "border-transparent"
                      }`}
                    >
                      {thumbIsVideo ? (
                        <video
                          src={media}
                          muted
                          className="object-cover w-full h-full"
                          preload="metadata"
                        />
                      ) : (
                        <Image
                          src={media}
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

            {/* Info del auto */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-600 mb-2">{formattedPrice}</div>
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
    </>
  );
}
