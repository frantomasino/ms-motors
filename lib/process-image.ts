import { PHOTO_MAX_INPUT_BYTES, PHOTO_MIME, PHOTO_QUALITY, PHOTO_WIDTH, PHOTO_HEIGHT } from "@/lib/photo-config";

export type ProcessImageResult = {
  blob: Blob;
  mime: string;
  extension: string;
};

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("No se pudo comprimir la foto"))),
      mime,
      quality
    );
  });
}

async function decodeWithImg(file: File): Promise<ImageBitmap> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("No se pudo leer la foto"));
      el.src = url;
    });
    return await createImageBitmap(img);
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function decodeImage(file: File): Promise<ImageBitmap> {
  try {
        return await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions);
  } catch {
    return decodeWithImg(file);
  }
}

/**
 * Recorta al centro (cover) y deja todas las fotos en 1600×1200 WebP.
 * No importa el tamaño, la orientación ni el recorte original.
 */
export async function processCarPhoto(
  file: File,
  size?: { width?: number; height?: number }
): Promise<ProcessImageResult> {
  if (file.size > PHOTO_MAX_INPUT_BYTES) {
    throw new Error("La foto pesa demasiado (máximo 25 MB)");
  }

  const width = size?.width ?? PHOTO_WIDTH;
  const height = size?.height ?? PHOTO_HEIGHT;

  const bitmap = await decodeImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la foto");

  ctx.fillStyle = "#0c0e12";
  ctx.fillRect(0, 0, width, height);

  const scale = Math.max(width / bitmap.width, height / bitmap.height);
  const dw = bitmap.width * scale;
  const dh = bitmap.height * scale;
  const dx = (width - dw) / 2;
  const dy = (height - dh) / 2;
  ctx.drawImage(bitmap, dx, dy, dw, dh);
  bitmap.close?.();

  try {
    const blob = await canvasToBlob(canvas, PHOTO_MIME, PHOTO_QUALITY);
    return { blob, mime: PHOTO_MIME, extension: "webp" };
  } catch {
    const blob = await canvasToBlob(canvas, "image/jpeg", 0.85);
    return { blob, mime: "image/jpeg", extension: "jpg" };
  }
}

export function isImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|webp|gif|heic|heif|avif|bmp)$/i.test(file.name);
}
