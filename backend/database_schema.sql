-- PULSE AI Database Schema for Supabase
-- Paste this into the Supabase SQL Editor and click "Run"

-- 1. Create Patient Profiles Table
create table public.patient_profiles (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text,
  last_name text,
  phone text,
  age integer,
  gender text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS)
alter table public.patient_profiles enable row level security;

-- Create policy so users can only view and update their own profiles
create policy "Users can view own profile" 
on public.patient_profiles for select 
using ( auth.uid() = id );

create policy "Users can insert own profile" 
on public.patient_profiles for insert 
with check ( auth.uid() = id );

create policy "Users can update own profile" 
on public.patient_profiles for update 
using ( auth.uid() = id );

-- 2. Create Appointments Table
create table public.appointments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  patient_name text not null,
  department text not null,
  appointment_date text not null,
  appointment_time text not null,
  urgency integer not null,
  status text not null default 'Confirmed',
  triage_summary text,
  recommendation text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.appointments enable row level security;

create policy "Users can view own appointments" 
on public.appointments for select 
using ( auth.uid() = user_id );

create policy "Users can insert own appointments" 
on public.appointments for insert 
with check ( auth.uid() = user_id );

-- 3. Create Triage History Table
create table public.triage_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  symptoms text not null,
  department text not null,
  urgency integer not null,
  summary text,
  recommendation text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.triage_history enable row level security;

create policy "Users can view own triage history" 
on public.triage_history for select 
using ( auth.uid() = user_id );

create policy "Users can insert own triage history" 
on public.triage_history for insert 
with check ( auth.uid() = user_id );

create policy "Users can delete own triage history" 
on public.triage_history for delete 
using ( auth.uid() = user_id );

-- 4. Automatically create patient_profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.patient_profiles (id, first_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
