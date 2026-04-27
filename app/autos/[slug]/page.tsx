import { getCarsData } from "@/app/cars-data-provider";
import { notFound } from "next/navigation";
import CarDetailClient from "./car-detail-client";
import type { Metadata } from "next";

export function slugify(brand: string, model: string, year: number) {
  return `${brand}-${model}-${year}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cars = await getCarsData();
  const car = cars.find(c => slugify(c.brand, c.model, c.year) === params.slug);
  if (!car) return { title: "Auto no encontrado" };
  return {
    title: `${car.brand} ${car.model} ${car.year} | MS Motors`,
    description: `${car.brand} ${car.model} ${car.year} – USD ${car.price.toLocaleString("es-AR")} · ${car.mileage.toLocaleString("es-AR")} km · ${car.transmission} · ${car.fuelType}. En MS Motors, Quilmes.`,
    openGraph: {
      title: `${car.brand} ${car.model} ${car.year} | MS Motors`,
      description: car.description,
      images: car.images?.[0] ? [{ url: car.images[0] }] : [],
    },
  };
}

export async function generateStaticParams() {
  const cars = await getCarsData();
  return cars.map(c => ({ slug: slugify(c.brand, c.model, c.year) }));
}

export const revalidate = 60;

export default async function CarDetailPage({ params }: { params: { slug: string } }) {
  const cars = await getCarsData();
  const car = cars.find(c => slugify(c.brand, c.model, c.year) === params.slug);
  if (!car) notFound();

  // Usamos las imágenes que ya vienen del CSV/Supabase — sin segundo fetch
  const mediaList = car!.images?.filter(img => img && img !== "/placeholder.svg?height=600&width=800") || [];

  return <CarDetailClient car={car!} mediaList={mediaList} />;
}