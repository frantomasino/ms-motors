"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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

  // Formateo de precio simple
  const formattedPrice = car?.price
    ? new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(car.price)
    : "";

  if (!car) return null;

  const firstImage = Array.isArray(car.images) && car.images.length > 0 ? car.images[0] : "/placeholder.svg";

  return (
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
          aria-label="Cerrar modal"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="mt-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg mb-4">
            <Image
              src={firstImage}
              alt={`${car.model} image`}
              fill
              className="object-cover"
            />
          </div>

          <div className="text-3xl font-bold text-red-600 mb-2">
            {formattedPrice}
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-2">Descripción:</h3>
            <p className="text-gray-600">{car.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
