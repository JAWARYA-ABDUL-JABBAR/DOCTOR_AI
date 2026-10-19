create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  password_hash text not null,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  status text not null default 'draft' check (status in ('draft','diagnosed','redesigned','verified')),
  screenshot_key text,
  findings jsonb not null default '[]'::jsonb,
  redesign_spec jsonb,
  verification_report jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.screenshot_objects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  object_key text not null unique,
  content_type text not null check (content_type in ('image/png','image/jpeg')),
  byte_size integer not null check (byte_size > 0 and byte_size <= 10485760),
  image_data bytea not null,
  created_at timestamptz not null default now()
);

create index if not exists projects_user_updated_idx on public.projects(user_id, updated_at desc);
create index if not exists screenshot_objects_owner_idx on public.screenshot_objects(user_id, project_id);

alter table public.projects enable row level security;
alter table public.screenshot_objects enable row level security;

create policy projects_owner_policy on public.projects using (user_id = nullif(current_setting('app.user_id', true), '')::uuid) with check (user_id = nullif(current_setting('app.user_id', true), '')::uuid);
create policy screenshot_owner_policy on public.screenshot_objects using (user_id = nullif(current_setting('app.user_id', true), '')::uuid) with check (user_id = nullif(current_setting('app.user_id', true), '')::uuid);
