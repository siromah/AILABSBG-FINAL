-- AILABSBG Missions Module Schema
-- Extends profiles and adds mission_progress for gamified learning

-- ============================================
-- EXTEND PROFILES WITH MISSION STATS
-- ============================================
alter table if exists public.profiles
  add column if not exists mission_xp integer not null default 0,
  add column if not exists mission_level integer not null default 1,
  add column if not exists mission_streak integer not null default 0,
  add column if not exists mission_last_active timestamptz default null,
  add column if not exists mission_badges text[] not null default '{}';

-- ============================================
-- MISSION PROGRESS
-- ============================================
create table if not exists public.mission_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null,
  completed boolean not null default false,
  xp_earned integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (user_id, lesson_id)
);

alter table public.mission_progress enable row level security;

create policy "Users can read own mission progress"
  on public.mission_progress for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can upsert own mission progress"
  on public.mission_progress for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_mission_progress_user_id on public.mission_progress(user_id);
