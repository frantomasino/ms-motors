-- MS Motors — catálogo de autos
-- Pegá este script en: Supabase → SQL Editor → Run
-- Después agregá en el hosting: ADMIN_PIN y SUPABASE_SERVICE_ROLE_KEY

create table if not exists public.autos (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  year int not null,
  price int not null default 0,
  color text not null default '',
  mileage int not null default 0,
  transmission text not null default '',
  fuel_type text not null default '',
  description text not null default '',
  estado text not null default 'disponible' check (estado in ('disponible', 'vendido')),
  images text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists autos_estado_idx on public.autos (estado);
create index if not exists autos_created_at_idx on public.autos (created_at desc);
create index if not exists autos_sort_order_idx on public.autos (sort_order);

create or replace function public.set_autos_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists autos_updated_at on public.autos;
create trigger autos_updated_at
before update on public.autos
for each row execute procedure public.set_autos_updated_at();

alter table public.autos enable row level security;

drop policy if exists "autos_public_read" on public.autos;
create policy "autos_public_read"
  on public.autos
  for select
  to anon, authenticated
  using (true);

-- Escrituras solo con service role (el panel /admin). El anon key no puede insertar/editar.
grant select on public.autos to anon, authenticated;

comment on table public.autos is 'Stock de MS Motors. Las fotos viven en Storage, las URLs en images[].';
