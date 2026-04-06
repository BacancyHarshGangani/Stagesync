create table public.events (
  id uuid primary key default gen_random_uuid(),

  planner_id uuid not null references "Users"(id) on delete cascade,

  event_name text not null,
  event_type text not null check (
    event_type in ('corporate', 'wedding', 'conference', 'social', 'party', 'other')
  ),

  start_date date not null,
  end_date date not null,

  venue_city text not null,

  headcount integer not null check (headcount > 0),

  budget_ceiling numeric(12,2) not null,

  status event_status not null default 'PLANNING',

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  constraint valid_date_range check (end_date >= start_date)
);