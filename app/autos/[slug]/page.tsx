import { getCarsData } from "@/app/cars-data-provider";
import { notFound } from "next/navigation";
import CarDetailClient from "./car-detail-client";
import { createClient } from "@supabase/supabase-js";
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

// Fetch de fotos extra desde Supabase — en servidor, no en cliente
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

export default async function CarDetailPage({ params }: { params: { slug: string } }) {
  const cars = await getCarsData();
  const car = cars.find(c => slugify(c.brand, c.model, c.year) === params.slug);
  if (!car) notFound();

  // Fotos del CSV
  const csvImages = car!.images?.filter(
    img => img && img !== "/placeholder.svg?height=600&width=800"
  ) || [];

  // Fotos extra de Supabase — en servidor, sin demora en cliente
  const fotos = (car as any).fotos as string | undefined;
  const supabaseMedia = fotos ? await fetchSupabaseMedia(fotos) : [];

  // Merge sin duplicados — Supabase gana (más fotos, mejor calidad)
  const allMedia = Array.from(new Set([
    ...supabaseMedia.filter(u => !/\.(mp4|mov|webm|m4v)$/i.test(u)), // fotos primero
    ...supabaseMedia.filter(u => /\.(mp4|mov|webm|m4v)$/i.test(u)),  // videos al final
    ...csvImages,
  ]));

  const mediaList = allMedia.length > 0 ? allMedia : csvImages;

  return <CarDetailClient car={car!} mediaList={mediaList} />;
}