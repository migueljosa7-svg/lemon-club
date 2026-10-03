-- ============================================================
-- Lemon Club Zaragoza · Migración: Plazas en tiempo real,
-- lista de espera y escáner QR de puerta (Staff Mode)
-- Fecha: 2026-10-04
-- Uso: supabase db push (o pegar en el SQL Editor de Supabase)
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABLA DE EVENTOS (plazas en vivo)
-- ------------------------------------------------------------
create table if not exists public.lemon_events (
  id           text primary key,                -- p.ej. 'sushimania-sangria'
  title        text not null,
  category     text not null default 'Cocina',
  starts_at    timestamptz,
  ends_at      timestamptz,
  place        text,
  price_eur    numeric(6,2) not null default 0,
  capacity     int not null default 0 check (capacity >= 0),
  spots        int not null default 0 check (spots >= 0),
  waitlist_open boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint spots_within_capacity check (spots <= capacity)
);

-- ------------------------------------------------------------
-- 2. PERFILES DE SOCIO (alineada con src/lib/lemonStore.ts)
-- ------------------------------------------------------------
create table if not exists public.lemon_profiles (
  id          text primary key,                 -- p.ej. 'lc-abcd2345'
  name        text not null default 'Limonero/a anónimo',
  coins       int not null default 0 check (coins >= 0),
  attendance  jsonb not null default '[]'::jsonb,
  member_code text not null unique,             -- QR: LEMON-<member_code>
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3. RESERVAS (confirmadas + lista de espera + escaneos puerta)
-- ------------------------------------------------------------
create table if not exists public.lemon_reservations (
  id            uuid primary key default gen_random_uuid(),
  event_id      text not null references public.lemon_events (id) on delete cascade,

-- ------------------------------------------------------------
-- 4. ÍNDICES (consultas de plazas, lista de espera y escáner)
-- ------------------------------------------------------------
create index if not exists idx_lemon_events_starts_at
  on public.lemon_events (starts_at);

create index if not exists idx_lemon_reservations_event_status
  on public.lemon_reservations (event_id, status);

create index if not exists idx_lemon_reservations_member
  on public.lemon_reservations (member_code);

create index if not exists idx_lemon_reservations_scanned
  on public.lemon_reservations (event_id, scanned_at)
  where scanned_at is not null;

-- Un solo registro activo (confirmado o en espera) por socio y evento
create unique index if not exists uq_lemon_reservations_active
  on public.lemon_reservations (event_id, member_code)
  where status in ('confirmed', 'waitlist');

-- ------------------------------------------------------------
-- 5. ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table public.lemon_events       enable row level security;
alter table public.lemon_profiles     enable row level security;
alter table public.lemon_reservations enable row level security;

-- Eventos: lectura pública. Escritura: solo service_role
-- (sin policy explícita → denegado por defecto).
drop policy if exists "events_public_read" on public.lemon_events;
create policy "events_public_read"
  on public.lemon_events for select
  to anon, authenticated
  using (true);

-- Perfiles: demo anónima. EN PRODUCCIÓN con auth, sustituir por
-- using (auth.uid()::text = id) y restringir UPDATE a name/coins/attendance.
drop policy if exists "profiles_demo_write" on public.lemon_profiles;
create policy "profiles_demo_write"
  on public.lemon_profiles for all
  to anon, authenticated
  using (true)
  with check (true);

-- Reservas: lectura pública (contar plazas y posición en lista),
-- creación de reserva/lista de espera y escaneo de puerta.
drop policy if exists "reservations_public_read" on public.lemon_reservations;
create policy "reservations_public_read"
  on public.lemon_reservations for select
  to anon, authenticated
  using (true);

drop policy if exists "reservations_create" on public.lemon_reservations;
create policy "reservations_create"
  on public.lemon_reservations for insert
  to anon, authenticated
  with check (status in ('confirmed', 'waitlist'));

drop policy if exists "reservations_scan_update" on public.lemon_reservations;
create policy "reservations_scan_update"
  on public.lemon_reservations for update
  to anon, authenticated
  using (true)
  with check (true);

  profile_id    text references public.lemon_profiles (id) on delete set null,
  member_code   text not null,
  status        text not null default 'confirmed'
                check (status in ('confirmed', 'waitlist', 'cancelled')),
  coins_granted int not null default 0,
  scanned_at    timestamptz,                    -- escaneo en puerta (Staff Mode)
  scanned_by    text,                           -- identificador del dispositivo staff
  created_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 6. RESERVA ATÓMICA (RPC): decrementa plaza o apunta a lista
--    Llamar desde la app: select * from lemon_reserve('evento','COD')
--    Devuelve: status ('confirmed' | 'waitlist'), spots restantes
--    y posición en lista (null si se confirmó).
-- ------------------------------------------------------------
create or replace function public.lemon_reserve(
  p_event_id    text,
  p_member_code text
)
returns table (result_status text, spots_left int, wait_position int)
language plpgsql
security definer
as $$
declare
  v_spots int;
  v_open  boolean;
  v_pos   int;
begin
  -- Bloquea la fila del evento para evitar doble descuento (race condition)
  select spots, waitlist_open
    into v_spots, v_open
    from public.lemon_events
    where id = p_event_id
    for update;

  if not found then
    return query select 'unknown_event'::text, null::int, null::int;
    return;
  end if;

  if v_spots > 0 then
    update public.lemon_events
       set spots = spots - 1,
           updated_at = now()
     where id = p_event_id;

    insert into public.lemon_reservations (event_id, member_code, status, coins_granted)
    values (p_event_id, upper(p_member_code), 'confirmed', 10)
    on conflict do nothing;

    return query select 'confirmed'::text, v_spots - 1, null::int;
    return;
  end if;

  if not v_open then
    return query select 'sold_out'::text, 0, null::int;
    return;
  end if;

  -- Lista de espera: posición = activos existentes + 1
  insert into public.lemon_reservations (event_id, member_code, status)
  values (p_event_id, upper(p_member_code), 'waitlist')
  on conflict do nothing;

  select count(*)
    into v_pos
    from public.lemon_reservations
   where event_id = p_event_id
     and status = 'waitlist';

  return query select 'waitlist'::text, 0, greatest(v_pos, 1);
end;
$$;

-- ------------------------------------------------------------
-- 7. DATOS SEMILLA (descomentar y ajustar con la carta real)
-- ------------------------------------------------------------
-- insert into public.lemon_events (id, title, category, starts_at, place, price_eur, capacity, spots)
-- values
--   ('sushimania-sangria',  'Miércoles Lemon: Sushimanía',  'Cocina', '2026-03-11 19:00+01', 'El Gancho, Zaragoza', 24, 12, 3),
--   ('paint-wine-night',    'Miércoles de Pintura & Vino',  'Arte',   '2026-03-18 19:30+01', 'Depósito, Zaragoza',  22, 16, 8),
--   ('ceramica-sin-miedo',  'Miércoles de Cerámica & Vino', 'Arte',   '2026-03-25 19:00+01', 'El Gancho, Zaragoza', 30, 12, 5),
--   ('cata-blind-fold',     'Miércoles de Cata Blind Fold', 'Catas',  '2026-04-01 20:00+01', 'Centro, Zaragoza',    25, 14, 9),
--   ('pasta-fresca',        'Pasta Fresca from Scratch',    'Cocina', '2026-03-26 19:00+01', 'Centro, Zaragoza',    26, 12, 6),
--   ('sunday-lemon-brunch', 'Sunday Lemon Brunch',          'Brunch', '2026-03-22 11:30+01', 'La Paz, Zaragoza',    18, 20, 12)
-- on conflict (id) do nothing;