"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Car } from "@/types"
import Image from "next/image"
import { Calendar, Circle, Gauge, MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface CarCardProps {
  car: Car
  onViewDetails: () => void
}

export default function CarCard({ car, onViewDetails }: CarCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-lg group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={car.images[0] || "/placeholder.svg"}
          alt={car.model}
          fill
          className={`object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge className="absolute top-2 right-2 bg-red-600 hover:bg-red-700">{formatPrice(car.price)}</Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-800">{car.model}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center">
            <Circle className="h-4 w-4 mr-1 text-gray-500" />
            <span>{car.color}</span>
          </div>
          <div className="flex items-center">
            <Gauge className="h-4 w-4 mr-1 text-gray-500" />
            <span>{car.mileage.toLocaleString()} km</span>
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
              <line x1="12" y1="18" x2="12" y2="18"></line>
            </svg>
            <span>{car.transmission}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" className="flex-1 text-sm" onClick={onViewDetails}>
          Ver Detalles
        </Button>
        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-sm">
          <MessageCircle className="h-4 w-4 mr-1" />
          WhatsApp
        </Button>
      </CardFooter>
    </Card>
  )
}
