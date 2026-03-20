create table vendor_profile(
  id uuid primary key default gen_random_uuid(),

  user_id uuid references "Users"(id) on delete cascade,

  company_name text not null,
  cateory_badge text not null,
  description text,

  service_area text,
  capacity_range text,
  base_price_range text,

  portfolio_urls text[], -- array of image URLs

  rating numeric(2,1) default 0, -- e.g. 4.5
  approved boolean default false,

  created_at timestamp with time zone default now()
)