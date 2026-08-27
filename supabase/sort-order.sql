-- Orden del catálogo. Pegá esto en Supabase → SQL Editor → Run
-- (no pisa tablas; solo agrega una columna a autos)

alter table public.autos
  add column if not exists sort_order int not null default 0;

do $$
begin
  if (select count(*) from public.autos) > 0
     and (select coalesce(max(sort_order), 0) from public.autos) = 0 then
    with numbered as (
      select id, row_number() over (order by created_at desc) as rn
      from public.autos
    )
    update public.autos a
    set sort_order = n.rn
    from numbered n
    where a.id = n.id;
  end if;
end $$;

create index if not exists autos_sort_order_idx on public.autos (sort_order);
