import Papa from 'papaparse';
import { storage } from '../firebaseConfig';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { Auto } from '../types';

// Usar variable de entorno para la URL del CSV
const URL_CSV = process.env.NEXT_PUBLIC_CSV_URL || '';

/**
 * Fetches images for a specific car folder from Firebase storage
 * @param carpeta - Firebase storage folder path
 * @returns Promise with array of image URLs
 */
export const fetchImagenesAuto = async (carpeta: string): Promise<string[]> => {
  try {
    const carpetaRef = ref(storage, carpeta);
    const lista = await listAll(carpetaRef);
    const urls = await Promise.all(lista.items.map((item: any) => getDownloadURL(item)));
    return urls;
  } catch (error) {
    console.error(`Error cargando imágenes de ${carpeta}:`, error);
    return [];
  }
};

/**
 * Fetches all cars data from CSV and enhances with images from Firebase
 * @returns Promise with array of Auto objects
 */
export const fetchAutos = async (): Promise<Auto[]> => {
  if (!URL_CSV) {
    throw new Error('URL_CSV no está definida');
  }
  try {
    const response = await fetch(URL_CSV);
    const csvText = await response.text();
    
    return new Promise<Auto[]>((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: async (result: any) => {
          try {
            const autosConImagenes = await Promise.all(
              result.data.map(async (auto: any) => {
                if (!auto.Marca?.trim() || !auto.Modelo?.trim()) return null;

                const carpeta = auto.CarpetaFirebase?.trim();
                const imagenes = carpeta ? await fetchImagenesAuto(carpeta) : [];

                return { ...auto, imagenes } as Auto;
              })
            );

            resolve(autosConImagenes.filter(Boolean) as Auto[]);
          } catch (error) {
            reject(error);
          }
        },
        error: (err: any) => {
          console.error('Error al parsear CSV:', err);
          reject(err);
        },
      });
    });
  } catch (err: any) {
    console.error('Error al cargar autos:', err);
    return [];
  }
};
