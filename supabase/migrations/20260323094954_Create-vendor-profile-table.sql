create table vendor_profiles (
  id uuid primary key references "Users"(id) on delete cascade,
  
  company_name text not null,
  category text not null check (category in (
    'Catering', 'Photography', 'AV', 'Florals', 'Venue', 'Other'
  )),
  service_area text not null,
  capacity_min int not null,
  capacity_max int not null,

  description text,
  founded_year int,
  team_size int,
  certifications text[] default '{}',

  pricing_min numeric(10,2) not null,
  pricing_max numeric(10,2) not null,
  base_pricing_indicator text not null default 'per head' check (base_pricing_indicator in (
    'per head', 'per event', 'per day'
)),

  requires_reapproval boolean not null default false,
  packages JSONB DEFAULT '[]',

  average_rating numeric(3,2) default 0,
  portfolio_urls text[],

  logo_url TEXT,
  cover_image_url TEXT,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
