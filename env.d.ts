// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase (requeridas)
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_SUPABASE_BUCKET: string;

    // CSV (requerida)
    NEXT_PUBLIC_CSV_URL: string;

    // Firebase (opcionales, solo si todavía tenés algo usando Firebase)
    NEXT_PUBLIC_FIREBASE_API_KEY?: string;
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?: string;
    NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string;
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?: string;
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;
    NEXT_PUBLIC_FIREBASE_APP_ID?: string;
  }
}
export {};
