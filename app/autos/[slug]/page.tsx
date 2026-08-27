import { getCarsData } from "@/app/cars-data-provider";
import { notFound } from "next/navigation";
import CarDetailClient from "./car-detail-client";
import { createClient } from "@supabase/supabase-js";
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

async function fetchSupabaseMedia(fotos: string): Promise<string[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;
  if (!url || !key || !bucket || !fotos) return [];
  try {
    const supabase = createClient(url, key);
    const folder = fotos.trim().replace(/^\/+|\/+$/g, "");
    const { data, error } = await supabase.storage.from(bucket).list(folder, { limit: 200 });
    if (error || !data) return [];
    const VALID = /\.(jpe?g|png|webp|gif|mp4|mov|webm|m4v)$/i;
    return data
      .filter(f => VALID.test(f.name))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(f => supabase.storage.from(bucket).getPublicUrl(`${folder}/${f.name}`).data.publicUrl);
  } catch {
    return [];
  }
}

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

  const csvImages = usableCarPhotos(car.images);

  let mediaList = csvImages;
  if (car.source !== "supabase") {
    const fotos = car.fotos;
    const supabaseMedia = fotos ? await fetchSupabaseMedia(fotos) : [];
    const allMedia = Array.from(new Set([
      ...supabaseMedia.filter(u => !/\.(mp4|mov|webm|m4v)$/i.test(u)),
      ...supabaseMedia.filter(u => /\.(mp4|mov|webm|m4v)$/i.test(u)),
      ...csvImages,
    ]));
    mediaList = allMedia.length > 0 ? allMedia : csvImages;
  }

  return <CarDetailClient car={car} mediaList={mediaList} relatedCars={relatedCarsFor(cars, car)} />;
}