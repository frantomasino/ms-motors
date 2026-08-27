import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/config";
import { getCarsData } from "@/app/cars-data-provider";
import { carSlug } from "@/lib/slug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/#catalog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/#nosotros`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/#contacto`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];

  // Fichas de cada auto — las más importantes para SEO
  try {
    const cars = await getCarsData();
    const carPages: MetadataRoute.Sitemap = cars.map((car) => ({
      url: `${BASE_URL}/autos/${carSlug(car)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticPages, ...carPages];
  } catch {
    return staticPages;
  }
}