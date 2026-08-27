import { getCarsData } from "@/app/cars-data-provider";
import { notFound } from "next/navigation";
import CarDetailClient from "./car-detail-client";
import type { Metadata } from "next";
import { carSlug } from "@/lib/slug";
import { usableCarPhotos } from "@/lib/photo-config";
import { formatCarPrice } from "@/lib/price";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cars = await getCarsData();
  const car = cars.find(c => carSlug(c) === slug);
  if (!car) return { title: "Auto no encontrado" };
  return {
    title: `${car.brand} ${car.model} ${car.year}`,
    description: `${car.brand} ${car.model} ${car.year} – ${formatCarPrice(car.price, car.currency)} · ${car.mileage.toLocaleString("es-AR")} km · ${car.transmission} · ${car.fuelType}. En MS Motors, Quilmes.`,
    openGraph: {
      title: `${car.brand} ${car.model} ${car.year} | MS Motors`,
      description: car.description,
      images: car.images?.[0] ? [{ url: car.images[0] }] : [],
    },
  };
}

export async function generateStaticParams() {
  const cars = await getCarsData();
  return cars.map(c => ({ slug: carSlug(c) }));
}

export const revalidate = 60;

function relatedCarsFor(cars: Awaited<ReturnType<typeof getCarsData>>, car: NonNullable<Awaited<ReturnType<typeof getCarsData>>[number]>) {
  const available = cars.filter(c => c.estado !== "vendido");
  const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);
  const sameBrand = shuffle(
    available.filter(c => c.id !== car.id && c.brand === car.brand)
  ).slice(0, 3);
  if (sameBrand.length >= 2) return sameBrand;
  return [
    ...sameBrand,
    ...shuffle(available.filter(c => c.id !== car.id && c.brand !== car.brand))
      .sort((a, b) => Math.abs(a.price - car.price) - Math.abs(b.price - car.price))
      .slice(0, 3 - sameBrand.length),
  ].slice(0, 3);
}

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cars = await getCarsData();
  const car = cars.find(c => carSlug(c) === slug);
  if (!car) notFound();

  return (
    <CarDetailClient
      car={car}
      mediaList={usableCarPhotos(car.images)}
      relatedCars={relatedCarsFor(cars, car)}
    />
  );
}
