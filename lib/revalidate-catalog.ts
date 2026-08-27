import { revalidatePath } from "next/cache";

export function revalidateCatalog() {
  revalidatePath("/");
  revalidatePath("/autos", "layout");
  revalidatePath("/sitemap.xml");
}
