/** Fotos de autos del catálogo (4:3). */
export const PHOTO_WIDTH = 1600;
export const PHOTO_HEIGHT = 1200;
export const PHOTO_QUALITY = 0.82;
export const PHOTO_MIME = "image/webp";
export const PHOTO_MAX_INPUT_BYTES = 25 * 1024 * 1024;
export const PHOTO_LABEL = `${PHOTO_WIDTH}×${PHOTO_HEIGHT}`;

/** Fotos de clientes felices (cuadradas, como en el sitio). */
export const CLIENT_PHOTO_SIZE = 1200;
export const CLIENT_PHOTO_LABEL = `${CLIENT_PHOTO_SIZE}×${CLIENT_PHOTO_SIZE}`;
export const CLIENT_FOLDER = "clientes";
export const IMAGE_FILE_RE = /\.(jpe?g|png|webp|gif|heic|heif)$/i;

/** Saca placeholders rotos y el banner de “próximamente” que no existe en Storage. */
export function usableCarPhotos(urls: string[] | null | undefined): string[] {
  return (urls ?? []).filter((url) => {
    if (!url || url.includes(".mp4")) return false;
    if (url.includes("placeholder.svg")) return false;
    if (url.includes("/proximamente/")) return false;
    return true;
  });
}

