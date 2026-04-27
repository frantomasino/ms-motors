import { getCarsData } from "./cars-data-provider";
import ClientPage from "./page.client";

export const revalidate = 60; // revalida cada 60 segundos

export default async function Home() {
  const allCars = await getCarsData();
  const disponibles = allCars.filter(c => c.estado !== "vendido");
  const vendidos = allCars.filter(c => c.estado === "vendido");
  return <ClientPage initialCars={disponibles} soldCars={vendidos} />;
}