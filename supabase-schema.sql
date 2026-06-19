-- ================================================================
-- AutoDetailing Pro — Schema do Supabase
-- Cole este SQL no SQL Editor do Supabase e clique em Run
-- ================================================================

create table if not exists services (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  price       numeric(10,2) not null default 0,
  duration    integer not null default 60,
  description text,
  created_at  timestamptz default now()
);

create table if not exists employees (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text not null default '',
  color      text not null default '#F97316',
  created_at timestamptz default now()
);

create table if not exists appointments (
  id           uuid primary key default gen_random_uuid(),
  date         date not null,
  time         text not null,
  client_name  text not null,
  car_plate    text not null,
  car_model    text not null,
  service_id   uuid references services(id) on delete set null,
  employee_id  uuid references employees(id) on delete set null,
  status       text not null default 'aguardando'
               check (status in ('aguardando','em_andamento','concluido','cancelado')),
  notes        text,
  completed_at timestamptz,
  created_at   timestamptz default now()
);

-- Permite acesso público (sem autenticação do Supabase)
-- O controle de acesso é feito pelo login do próprio app
alter table services     enable row level security;
alter table employees    enable row level security;
alter table appointments enable row level security;

create policy "public_all_services"     on services     for all using (true) with check (true);
create policy "public_all_employees"    on employees    for all using (true) with check (true);
create policy "public_all_appointments" on appointments for all using (true) with check (true);

-- Dados iniciais de exemplo
insert into services (name, price, duration, description) values
  ('Lavagem Simples',      50,  60,  'Lavagem externa básica'),
  ('Lavagem Completa',     120, 120, 'Lavagem interna e externa'),
  ('Polimento',            350, 240, 'Polimento completo da lataria'),
  ('Vitrificação',         800, 480, 'Proteção cerâmica'),
  ('Higienização Interna', 200, 180, 'Limpeza completa do interior');

insert into employees (name, role, color) values
  ('Carlos',  'Lavador',  '#3B82F6'),
  ('Rafael',  'Polidor',  '#10B981'),
  ('Marcelo', 'Gerente',  '#F97316');
