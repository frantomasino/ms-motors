-- Moneda del precio: USD o pesos argentinos.
-- Pegá esto en Supabase → SQL Editor → Run
-- (no pisa datos; los autos actuales quedan en USD)

alter table public.autos
  add column if not exists price_currency text not null default 'USD';

alter table public.autos
  drop constraint if exists autos_price_currency_check;

alter table public.autos
  add constraint autos_price_currency_check
  check (price_currency in ('USD', 'ARS'));

comment on column public.autos.price_currency is 'USD o ARS. El número en price está en esa moneda.';
