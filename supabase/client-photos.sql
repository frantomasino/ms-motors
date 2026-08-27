-- Fotos de clientes felices. Pegá en Supabase → SQL Editor → Run
-- No toca otras tablas. Las fotos actuales en Storage/clientes se pueden importar desde el panel.

create table if not exists public.client_photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists client_photos_sort_order_idx on public.client_photos (sort_order);

alter table public.client_photos enable row level security;

drop policy if exists "client_photos_public_read" on public.client_photos;
create policy "client_photos_public_read"
  on public.client_photos
  for select
  to anon, authenticated
  using (true);

grant select on public.client_photos to anon, authenticated;

comment on table public.client_photos is 'Fotos de clientes en MS Motors. Archivos en Storage/clientes.';
