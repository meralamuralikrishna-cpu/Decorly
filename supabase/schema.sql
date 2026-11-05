-- Run this in the Supabase SQL Editor.
-- Decorly saves one private JSON workspace per account. Booking requests use
-- the shared booking_requests table below so admins can review them across users.
create table if not exists public.user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint user_data_payload_is_object check (jsonb_typeof(payload) = 'object')
);

-- Keep the schema safe to re-run when updating an existing project.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'user_data_payload_is_object'
      and conrelid = 'public.user_data'::regclass
  ) then
    alter table public.user_data
      add constraint user_data_payload_is_object
      check (jsonb_typeof(payload) = 'object');
  end if;
end
$$;

alter table public.user_data enable row level security;

-- No public/anonymous access. Signed-in users can only access their own row.
revoke all on table public.user_data from anon, authenticated;
grant select, insert, update on table public.user_data to authenticated;

drop policy if exists "Users can read their own data" on public.user_data;
drop policy if exists "Users can insert their own data" on public.user_data;
drop policy if exists "Users can update their own data" on public.user_data;

create policy "Users can read their own data" on public.user_data
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Users can insert their own data" on public.user_data
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "Users can update their own data" on public.user_data
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

comment on table public.user_data is
  'Private Decorly workspace data, stored as one JSON document per authenticated user.';
comment on column public.user_data.payload is
  'JSON object containing designs, moodboards, profile, favorites, locale, notifications, and active design.';

-- Booking requests are separate so authorized admins can review requests across accounts.
create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  requester_name text,
  requester_email text,
  vendor_name text,
  event_date date not null,
  event_type text not null,
  venue text,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.booking_requests add column if not exists requester_name text;
alter table public.booking_requests add column if not exists requester_email text;
alter table public.booking_requests alter column vendor_name drop not null;

alter table public.booking_requests enable row level security;
revoke all on table public.booking_requests from anon, authenticated;
grant select, insert, delete on table public.booking_requests to authenticated;
grant update (status, updated_at) on table public.booking_requests to authenticated;

drop policy if exists "Owners and admins can read booking requests" on public.booking_requests;
drop policy if exists "Users can submit their own booking requests" on public.booking_requests;
drop policy if exists "Admins can decide booking requests" on public.booking_requests;
drop policy if exists "Owners can delete their booking requests" on public.booking_requests;

create policy "Owners and admins can read booking requests" on public.booking_requests
  for select to authenticated
  using (
    owner_id = (select auth.uid())
    or (select auth.jwt()->'app_metadata'->>'role') = 'admin'
  );

create policy "Users can submit their own booking requests" on public.booking_requests
  for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and status = 'pending'
  );

create policy "Admins can decide booking requests" on public.booking_requests
  for update to authenticated
  using ((select auth.jwt()->'app_metadata'->>'role') = 'admin')
  with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

create policy "Owners can delete their booking requests" on public.booking_requests
  for delete to authenticated
  using (
    owner_id = (select auth.uid())
    or (select auth.jwt()->'app_metadata'->>'role') = 'admin'
  );

comment on table public.booking_requests is
  'User booking requests. Admin access is granted only by the trusted app_metadata role claim.';

-- Share links are stored separately because guests can read and comment without
-- an account. The unguessable UUID share id is the public link credential.
create table if not exists public.shared_designs (
  id uuid primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  design_id text not null,
  name text not null,
  elements jsonb not null default '[]'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  venue_plan jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'approved', 'changes')),
  comments jsonb not null default '[]'::jsonb check (jsonb_typeof(comments) = 'array'),
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by text
);

alter table public.shared_designs enable row level security;

revoke all on table public.shared_designs from anon, authenticated;
grant select (id, design_id, name, elements, settings, venue_plan, status, comments, created_at, approved_at, approved_by)
  on table public.shared_designs to anon, authenticated;
grant insert (id, owner_id, design_id, name, elements, settings, venue_plan, status, comments)
  on table public.shared_designs to authenticated;
grant update (status, comments, approved_at, approved_by)
  on table public.shared_designs to anon, authenticated;

drop policy if exists "Anyone can read a share link" on public.shared_designs;
drop policy if exists "Users can create their own share links" on public.shared_designs;
drop policy if exists "Guests can leave share feedback" on public.shared_designs;

create policy "Anyone can read a share link" on public.shared_designs
  for select to anon, authenticated using (true);

create policy "Users can create their own share links" on public.shared_designs
  for insert to authenticated with check ((select auth.uid()) = owner_id);

create policy "Guests can leave share feedback" on public.shared_designs
  for update to anon, authenticated using (true)
  with check (status in ('pending', 'approved', 'changes') and jsonb_typeof(comments) = 'array');

comment on table public.shared_designs is
  'Design snapshots shared by UUID link; guests can view and update feedback fields only.';
