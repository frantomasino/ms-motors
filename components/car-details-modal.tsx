"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, MessageCircle } from "lucide-react"
import Image from "next/image"
import type { Car } from "@/types"

interface CarDetailsModalProps {
  car: Car
  isOpen: boolean
  onClose: () => void
}

export default function CarDetailsModal({ car, isOpen, onClose }: CarDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? car.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === car.images.length - 1 ? 0 : prev + 1))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">
            {car.model} - {car.year}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image
                src={car.images[currentImageIndex] || "/placeholder.svg"}
                alt={`${car.model} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
              />

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
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2">
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                    currentImageIndex === index ? "border-red-600" : "border-transparent"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${car.model} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-red-600 mb-2">{formatPrice(car.price)}</div>

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
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <MessageCircle className="h-5 w-5 mr-2" />
                Contactar por WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
