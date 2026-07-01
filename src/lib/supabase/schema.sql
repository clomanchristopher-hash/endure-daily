-- Endure Daily — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query) once per project.
-- Safe to re-run: uses "if not exists" / "or replace" throughout.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- One row per user. Mirrors the client's UserProfile (minus plan data, which
-- stays local for now).
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null default 'Friend',
  mode text not null default 'leisure' check (mode in ('leisure', 'athlete')),
  streak int not null default 0,
  longest_streak int not null default 0,
  last_visit_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Saved devotions. One row per (user, devotion).
create table if not exists public.favorites (
  user_id uuid not null references auth.users on delete cascade,
  devotion_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, devotion_id)
);

-- Self-reported daily checklist. One row per (user, day). History is retained
-- so totals (devotion days, workouts) can be computed.
create table if not exists public.daily_progress (
  user_id uuid not null references auth.users on delete cascade,
  date date not null,
  scripture boolean not null default false,
  devotion boolean not null default false,
  prayer boolean not null default false,
  workout boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);

-- Home-screen daily reflection answers. One row per (user, day).
create table if not exists public.reflections (
  user_id uuid not null references auth.users on delete cascade,
  date date not null,
  content text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);

-- ---------------------------------------------------------------------------
-- Row Level Security — every table is private to its owner
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.daily_progress enable row level security;
alter table public.reflections enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own favorites" on public.favorites;
create policy "own favorites" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own daily_progress" on public.daily_progress;
create policy "own daily_progress" on public.daily_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own reflections" on public.reflections;
create policy "own reflections" on public.reflections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Auto-create a profile row when a user signs up. The signup call passes the
-- name as user metadata (display_name), which we copy into the profile.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Friend'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
