// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_SUPABASE_BUCKET: string;

    ADMIN_PIN: string;
    ADMIN_SECRET?: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
  }
}
export {};
