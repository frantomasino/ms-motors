import { supabase } from "@/lib/supabase";
import { CLIENT_FOLDER, IMAGE_FILE_RE } from "@/lib/photo-config";

export type ClientPhotoRow = {
  id: string;
  url: string;
  sort_order: number;
  created_at: string;
};

export async function fetchClientPhotos(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("client_photos")
      .select("url,sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      return data.map((r) => r.url).filter(Boolean);
    }
  } catch (err) {
    console.warn("client_photos table:", err);
  }
  return fetchClientPhotosFromStorage();
}

export async function fetchClientPhotosFromStorage(): Promise<string[]> {
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "Msmotors";
  try {
    const { data, error } = await supabase.storage.from(bucket).list(CLIENT_FOLDER, { limit: 200 });
    if (error || !data) return [];
    return data
      .filter((f) => IMAGE_FILE_RE.test(f.name))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((f) => supabase.storage.from(bucket).getPublicUrl(`${CLIENT_FOLDER}/${f.name}`).data.publicUrl);
  } catch {
    return [];
  }
}
