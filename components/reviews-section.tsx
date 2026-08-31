"use client";

import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { useState, useRef } from "react";

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

function ReviewCard({ review }: { review: typeof reviews[0] }) {
  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl border border-gray-100 hover:border-red-100 hover:shadow-[0_10px_30px_rgba(16,24,40,0.06)] transition-all duration-300 bg-white h-full">
      <div className="flex items-start justify-between">
        <Quote className="h-6 w-6 text-gray-100 fill-gray-100" />
        <StarRating rating={review.rating} />
      </div>
      <p className="text-sm text-gray-600 leading-relaxed flex-1">"{review.text}"</p>
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
  );
}

const GOOGLE_URL = "https://www.google.com/maps/place/MS+Motors/@-34.671077,-58.3444321,15z/data=!4m6!3m5!1s0x4dbf64afd9b006b9:0x243b134cd4c806f7!8m2!3d-34.671077!4d-58.3444321!16s%2Fg%2F11z50t5l2y";

export default function ReviewsSection() {
  // Mobile: de a 1 — Desktop: de a 3 (2 páginas con 6 reseñas)
  const [mobilePage, setMobilePage] = useState(0);
  const [desktopPage, setDesktopPage] = useState(0);
  const touchX = useRef<number | null>(null);

  const totalMobilePages = reviews.length;                        // 6 páginas de 1
  const totalDesktopPages = Math.ceil(reviews.length / 3);       // 2 páginas de 3

  const desktopReviews = reviews.slice(desktopPage * 3, desktopPage * 3 + 3);

  return (
    <section className="bg-white border-t border-gray-100 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-2">Reseñas</p>
            <h2 className="font-title text-[1.6rem] sm:text-4xl lg:text-5xl text-ink leading-tight">Lo que dicen nuestros clientes</h2>
          </div>
          <a href={GOOGLE_URL} target="_blank" rel="noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all bg-white shrink-0">
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
              <p className="text-xs text-gray-400">17 reseñas en Google</p>
            </div>
          </a>
        </div>

        {/* ── Mobile: carrusel de a 1 ── */}
        <div
          className="sm:hidden"
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) {
              setMobilePage(i => dx < 0
                ? (i === totalMobilePages - 1 ? 0 : i + 1)
                : (i === 0 ? totalMobilePages - 1 : i - 1));
            }
            touchX.current = null;
          }}
        >
          <ReviewCard review={reviews[mobilePage]} />
          <div className="flex items-center justify-between mt-5">
            <button onClick={() => setMobilePage(i => (i === 0 ? totalMobilePages - 1 : i - 1))}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 text-gray-400 hover:text-gray-900 transition-all">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1.5">
              {reviews.map((_, i) => (
                <button key={i} onClick={() => setMobilePage(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === mobilePage ? "w-5 bg-gray-900" : "w-2 bg-gray-200"
                  }`} />
              ))}
            </div>
            <button onClick={() => setMobilePage(i => (i === totalMobilePages - 1 ? 0 : i + 1))}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 text-gray-400 hover:text-gray-900 transition-all">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Desktop: carrusel de a 3 ── */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-3 gap-5">
            {desktopReviews.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </div>
          <div className="flex items-center justify-between mt-8">
            <button onClick={() => setDesktopPage(i => (i === 0 ? totalDesktopPages - 1 : i - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 text-gray-400 hover:text-gray-900 transition-all">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: totalDesktopPages }).map((_, i) => (
                <button key={i} onClick={() => setDesktopPage(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === desktopPage ? "w-5 bg-gray-900" : "w-1.5 bg-gray-200"
                  }`} />
              ))}
            </div>
            <button onClick={() => setDesktopPage(i => (i === totalDesktopPages - 1 ? 0 : i + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 text-gray-400 hover:text-gray-900 transition-all">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        
      </div>
    </section>
  );
}