-- ============================================
-- AI Match Analyst — Database Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Teams table
create table public.teams (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  formation text default '4-3-3',
  play_style text,
  created_at timestamptz default now() not null
);

alter table public.teams enable row level security;

create policy "Users can view own teams"
  on public.teams for select
  using (auth.uid() = user_id);

create policy "Users can create teams"
  on public.teams for insert
  with check (auth.uid() = user_id);

create policy "Users can update own teams"
  on public.teams for update
  using (auth.uid() = user_id);

create policy "Users can delete own teams"
  on public.teams for delete
  using (auth.uid() = user_id);

-- 3. Players table
create table public.players (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  name text not null,
  position text not null,
  number int,
  strengths text,
  weaknesses text,
  fitness_status text default 'fit' check (fitness_status in ('fit', 'doubtful', 'injured', 'suspended')),
  preferred_foot text default 'right' check (preferred_foot in ('left', 'right', 'both')),
  age int,
  created_at timestamptz default now() not null
);

alter table public.players enable row level security;

create policy "Users can view own players"
  on public.players for select
  using (
    exists (
      select 1 from public.teams
      where teams.id = players.team_id
      and teams.user_id = auth.uid()
    )
  );

create policy "Users can create players for own teams"
  on public.players for insert
  with check (
    exists (
      select 1 from public.teams
      where teams.id = players.team_id
      and teams.user_id = auth.uid()
    )
  );

create policy "Users can update own players"
  on public.players for update
  using (
    exists (
      select 1 from public.teams
      where teams.id = players.team_id
      and teams.user_id = auth.uid()
    )
  );

create policy "Users can delete own players"
  on public.players for delete
  using (
    exists (
      select 1 from public.teams
      where teams.id = players.team_id
      and teams.user_id = auth.uid()
    )
  );
