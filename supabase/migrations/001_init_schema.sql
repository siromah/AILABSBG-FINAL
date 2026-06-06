-- AILABSBG Production Schema + RLS Policies
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. PROFILES (extends auth.users)
-- ============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  plan text not null default 'free' check (plan in ('free', 'pro', 'premium')),
  bio text,
  tools text[] default '{}',
  color text default '#fff3ee',
  tc text default '#b84a15',
  initials text default 'AB',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Admins can read all profiles"
  on public.profiles for select
  to authenticated
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "Admins can update all profiles"
  on public.profiles for update
  to authenticated
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- Service role / trigger can insert
-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, plan, initials)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'user'),
    coalesce(new.raw_user_meta_data->>'plan', 'free'),
    coalesce(upper(left(new.raw_user_meta_data->>'full_name', 1)), upper(left(split_part(new.email, '@', 1), 1)))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: auto-create profile after user signs up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- 2. POSTS (community feed)
-- ============================================
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('win', 'question', 'workflow', 'prompt-share')),
  text text not null,
  tags text[] default '{}',
  pinned boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.posts enable row level security;

create policy "Posts are readable by everyone"
  on public.posts for select
  to authenticated
  using (true);

create policy "Authenticated users can create posts"
  on public.posts for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own posts"
  on public.posts for update
  to authenticated
  using (user_id = auth.uid());

create policy "Users can delete own posts"
  on public.posts for delete
  to authenticated
  using (user_id = auth.uid());

create policy "Admins can update any post"
  on public.posts for update
  to authenticated
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "Admins can delete any post"
  on public.posts for delete
  to authenticated
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- ============================================
-- 3. COMMENTS
-- ============================================
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  text text not null,
  created_at timestamptz default now()
);

alter table public.comments enable row level security;

create policy "Comments are readable by everyone"
  on public.comments for select
  to authenticated
  using (true);

create policy "Authenticated users can create comments"
  on public.comments for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can delete own comments"
  on public.comments for delete
  to authenticated
  using (user_id = auth.uid());

create policy "Admins can delete any comment"
  on public.comments for delete
  to authenticated
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- ============================================
-- 4. POST LIKES
-- ============================================
create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

alter table public.post_likes enable row level security;

create policy "Likes are readable by everyone"
  on public.post_likes for select
  to authenticated
  using (true);

create policy "Users can like/unlike (insert/delete own)"
  on public.post_likes for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================
-- 5. POST SAVES
-- ============================================
create table if not exists public.post_saves (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

alter table public.post_saves enable row level security;

create policy "Saves are readable by everyone"
  on public.post_saves for select
  to authenticated
  using (true);

create policy "Users can save/unsave (insert/delete own)"
  on public.post_saves for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================
-- 6. SAVED PROMPTS
-- ============================================
create table if not exists public.saved_prompts (
  user_id uuid not null references public.profiles(id) on delete cascade,
  prompt_id text not null,
  created_at timestamptz default now(),
  primary key (user_id, prompt_id)
);

alter table public.saved_prompts enable row level security;

create policy "Users can read own saved prompts"
  on public.saved_prompts for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can save/unsave prompts"
  on public.saved_prompts for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================
-- 7. LESSON PROGRESS
-- ============================================
create table if not exists public.lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null,
  completed boolean not null default false,
  notes text default '',
  xp_earned integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

create policy "Users can read own lesson progress"
  on public.lesson_progress for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can upsert own lesson progress"
  on public.lesson_progress for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================
-- 8. USER VIDEOS (attached to lessons)
-- ============================================
create table if not exists public.user_videos (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null,
  video_url text not null,
  created_at timestamptz default now(),
  primary key (user_id, lesson_id)
);

alter table public.user_videos enable row level security;

create policy "Users can read own videos"
  on public.user_videos for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can manage own videos"
  on public.user_videos for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================
-- 9. NOTIFICATIONS
-- ============================================
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  text text not null,
  icon text default 'bell',
  read boolean not null default false,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;

create policy "Users can read own notifications"
  on public.notifications for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can update own notifications (mark read)"
  on public.notifications for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================
-- 10. COACHING REQUESTS
-- ============================================
create table if not exists public.coaching_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  email text not null,
  goal text,
  budget text,
  message text,
  status text not null default 'pending' check (status in ('pending', 'contacted', 'closed')),
  created_at timestamptz default now()
);

alter table public.coaching_requests enable row level security;

create policy "Users can read own coaching requests"
  on public.coaching_requests for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can create own coaching requests"
  on public.coaching_requests for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Admins can read all coaching requests"
  on public.coaching_requests for select
  to authenticated
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "Admins can update coaching requests"
  on public.coaching_requests for update
  to authenticated
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- ============================================
-- 11. AI USAGE (rate limiting / quota tracking)
-- ============================================
create table if not exists public.ai_usage (
  user_id uuid not null references public.profiles(id) on delete cascade,
  date text not null, -- YYYY-MM-DD
  request_count integer not null default 0,
  total_tokens integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (user_id, date)
);

alter table public.ai_usage enable row level security;

create policy "Users can read own AI usage"
  on public.ai_usage for select
  to authenticated
  using (user_id = auth.uid());

-- Only server-side (service role) should insert/update this table
-- Frontend should not write here directly

-- ============================================
-- 12. INDEXES for performance
-- ============================================
create index if not exists idx_posts_user_id on public.posts(user_id);
create index if not exists idx_posts_created_at on public.posts(created_at desc);
create index if not exists idx_comments_post_id on public.comments(post_id);
create index if not exists idx_notifications_user_id on public.notifications(user_id, read);
create index if not exists idx_lesson_progress_user_id on public.lesson_progress(user_id);
