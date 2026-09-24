create table if not exists public.preview_drafts (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  partner_name text,
  locale text not null default 'en',
  selected_theme text,
  selected_envelope text,
  selected_hero text,
  wedding_date text,
  resume_token text,
  draft jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.preview_drafts enable row level security;
create index if not exists preview_drafts_updated_at_idx on public.preview_drafts(updated_at desc);
