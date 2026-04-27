"use client";

import { Star, Quote } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

const reviews = [
  {
    name: "Andrea Santoni",
    date: "Hace 2 semanas",
    rating: 5,
    text: "Súper recomendable, me vendió la camioneta en tres semanas y en el precio que yo quería. No me tuve que ocupar de nada, recomiendo. Muy serio.",
    initials: "AS",
    color: "bg-blue-500",
  },
  {
    name: "Francisco Jose Garibaldi",
    date: "Hace 1 mes",
    rating: 5,
    text: "Mateo fue muy honesto y predispuesto a colaborar.",
    initials: "FG",
    color: "bg-red-500",
  },
  {
    name: "Elio Gamboa",
    date: "Hace 1 mes",
    rating: 5,
    text: "Un genio la verdad. Le compre un Fox, fue y es mi primer auto, tenía muchas dudas y él como todo un profesional me las quito todas. Super recomendable",
    initials: "EG",
    color: "bg-green-500",
  },
  {
    name: "Giuliana Agostina Mugrabi",
    date: "Hace 2 meses",
    rating: 5,
    text: "Un genio!!! Me vendió al toque un Ónix LT, súper profesional y responsable",
    initials: "GA",
    color: "bg-purple-500",
  },
  {
    name: "Thomas Masseo",
    date: "Hace 2 meses",
    rating: 5,
    text: "Impecable atencion desde el principio hasta el final. 100% recomendable 👏🏼",
    initials: "TM",
    color: "bg-orange-500",
  },
  {
    name: "Julian Sivori",
    date: "Hace 3 meses",
    rating: 5,
    text: "Super recomendado! Me vendió el sandero stepway en 3 días y me ayudó a revisar más de 10 vehículos antes de comprar el indicado.",
    initials: "JS",
    color: "bg-teal-500",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section className="bg-white border-t border-gray-100 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-2">Reseñas</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Lo que dicen nuestros clientes</h2>
          </div>

          {/* Badge Google */}
          <a
            href="https://www.google.com/maps/place/MS+Motors/@-34.671077,-58.3444321,15z/data=!4m6!3m5!1s0x4dbf64afd9b006b9:0x243b134cd4c806f7!8m2!3d-34.671077!4d-58.3444321!16s%2Fg%2F11z50t5l2y"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all bg-white shrink-0"
          >
            <FaGoogle className="h-5 w-5 text-[#4285F4]" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-gray-900">5.0</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400">13 reseñas en Google</p>
            </div>
          </a>
        </div>

        {/* Grid de reseñas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <div key={i}
              className="flex flex-col gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 bg-white">

              {/* Quote + Stars */}
              <div className="flex items-start justify-between">
                <Quote className="h-6 w-6 text-gray-100 fill-gray-100" />
                <StarRating rating={review.rating} />
              </div>

              {/* Texto */}
              <p className="text-sm text-gray-600 leading-relaxed flex-1">"{review.text}"</p>

              {/* Autor */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${review.color} text-white text-xs font-bold`}>
                  {review.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                  <p className="text-xs text-gray-400">{review.date}</p>
                </div>
                <FaGoogle className="h-3.5 w-3.5 text-gray-300 ml-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA ver más */}
        <div className="text-center mt-10">
          <a
            href="https://www.google.com/maps/place/MS+Motors/@-34.671077,-58.3444321,15z/data=!4m6!3m5!1s0x4dbf64afd9b006b9:0x243b134cd4c806f7!8m2!3d-34.671077!4d-58.3444321!16s%2Fg%2F11z50t5l2y"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors border border-gray-200 hover:border-gray-400 px-5 py-2.5 rounded-full"
          >
            <FaGoogle className="h-4 w-4 text-[#4285F4]" />
            Ver todas las reseñas en Google
          </a>
        </div>
      </div>
    </section>
  );
}