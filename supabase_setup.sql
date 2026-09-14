-- ══════════════════════════════════════════════
-- Kiwi Script Manager — Supabase SQL Setup
-- Run this in your Supabase SQL Editor
-- ══════════════════════════════════════════════

-- 1. Profiles (stub for future admin roles)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null default 'user',
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 2. Projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid references auth.users not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table projects enable row level security;
create policy "Authenticated users can read projects"  on projects for select using (auth.role() = 'authenticated');
create policy "Authenticated users can create projects" on projects for insert with check (auth.role() = 'authenticated');

-- 3. Scripts
create table if not exists scripts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects on delete cascade not null,
  title text not null,
  short_title text,
  description text,
  raw_content text,
  duration float,
  word_count int,
  color text,
  created_by uuid references auth.users not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table scripts enable row level security;
create policy "Authenticated users can read scripts"   on scripts for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert scripts" on scripts for insert with check (auth.role() = 'authenticated');

-- 4. Script Beats
create table if not exists script_beats (
  id uuid primary key default gen_random_uuid(),
  script_id uuid references scripts on delete cascade not null,
  sequence int not null,
  start_sec float,
  end_sec float,
  title text,
  spoken text,
  on_screen text,
  shot text,
  delivery_note text,
  wpm float
);
alter table script_beats enable row level security;
create policy "Authenticated users can read beats"   on script_beats for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert beats" on script_beats for insert with check (auth.role() = 'authenticated');
