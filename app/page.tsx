import { getCarsData } from "./cars-data-provider";
import ClientPage from "./page.client";

export default async function Home() {
  // Fetch cars data on the server
  const cars = await getCarsData();
  
  // Pass the data to the client component
  return <ClientPage initialCars={cars} />;
}
