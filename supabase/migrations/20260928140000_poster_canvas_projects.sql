-- Poster Studio cloud projects (codes + small metadata only).
-- Apply on the existing KruMath Supabase project. Never store exports or logo binaries.

create table if not exists public.poster_canvas_projects (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  code text not null,
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  logo_slot jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists poster_canvas_projects_user_updated_idx
  on public.poster_canvas_projects (user_id, updated_at desc);

alter table public.poster_canvas_projects enable row level security;

drop policy if exists "poster_canvas_projects_select_own" on public.poster_canvas_projects;
create policy "poster_canvas_projects_select_own"
  on public.poster_canvas_projects
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "poster_canvas_projects_insert_own" on public.poster_canvas_projects;
create policy "poster_canvas_projects_insert_own"
  on public.poster_canvas_projects
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "poster_canvas_projects_update_own" on public.poster_canvas_projects;
create policy "poster_canvas_projects_update_own"
  on public.poster_canvas_projects
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "poster_canvas_projects_delete_own" on public.poster_canvas_projects;
create policy "poster_canvas_projects_delete_own"
  on public.poster_canvas_projects
  for delete
  to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.poster_canvas_projects to authenticated;
