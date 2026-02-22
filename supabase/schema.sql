-- ScreenEasy: Database schema for Supabase (PostgreSQL)
-- Run this in the Supabase SQL Editor to create tables and RLS.

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Interviews: configured by creator
create table if not exists public.interviews (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  settings jsonb not null default '{"questions":[],"allowRetakes":false,"maxAttempts":1}'::jsonb,
  created_at timestamptz not null default now()
);

-- Applications: candidate submissions per interview
create table if not exists public.applications (
  id uuid primary key default uuid_generate_v4(),
  interview_id uuid not null references public.interviews(id) on delete cascade,
  candidate_email text not null,
  video_url text,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  created_at timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_interviews_creator_id on public.interviews(creator_id);
create index if not exists idx_applications_interview_id on public.applications(interview_id);

-- Row Level Security (RLS)
alter table public.interviews enable row level security;
alter table public.applications enable row level security;

-- Interviews: creators can do everything on their own rows
create policy "Users can manage own interviews"
  on public.interviews for all
  using (auth.uid() = creator_id)
  with check (auth.uid() = creator_id);

-- Applications: interview creators can read/insert/update applications for their interviews
create policy "Creators can manage applications for their interviews"
  on public.applications for all
  using (
    exists (
      select 1 from public.interviews
      where interviews.id = applications.interview_id
      and interviews.creator_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.interviews
      where interviews.id = applications.interview_id
      and interviews.creator_id = auth.uid()
    )
  );

-- Optional: Storage bucket for video files (create in Supabase Dashboard or via API)
-- Bucket name suggestion: interview-videos
-- Policy: allow authenticated uploads; allow public read for signed URLs or restrict by RLS
