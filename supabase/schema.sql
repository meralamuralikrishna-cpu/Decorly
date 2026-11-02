-- Run this in the Supabase SQL Editor. Each account can read and write only its own app data.
create table if not exists public.user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_data enable row level security;
create policy "Users can read their own data" on public.user_data
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can insert their own data" on public.user_data
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can update their own data" on public.user_data
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
