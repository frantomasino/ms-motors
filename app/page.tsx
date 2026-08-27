import { getCarsData } from "./cars-data-provider";
import { fetchClientPhotos } from "@/lib/client-photos";
import ClientPage from "./page.client";

export const revalidate = 60;

export default async function Home() {
  const [allCars, clientPhotos] = await Promise.all([getCarsData(), fetchClientPhotos()]);
  const disponibles = allCars.filter(c => c.estado !== "vendido");
  const vendidos = allCars.filter(c => c.estado === "vendido");
  return <ClientPage initialCars={disponibles} soldCars={vendidos} clientPhotos={clientPhotos} />;
}
