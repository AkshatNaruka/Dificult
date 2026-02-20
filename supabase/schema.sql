-- Run this script in your Supabase SQL Editor

-- 1. Create Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  xp integer default 0,
  level integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Optional: Automatically create a profile when a new user signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Create Stats Table (for tracking typing tests)
create table public.stats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  wpm integer not null,
  accuracy numeric(5,2) not null,
  mode text not null, -- e.g. "time", "words"
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for stats
alter table public.stats enable row level security;

create policy "Stats are viewable by everyone."
  on stats for select
  using ( true );

create policy "Users can insert their own stats."
  on stats for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own stats."
  on stats for update
  using ( auth.uid() = user_id );

-- 3. Create Matches Table (for multiplayer tracking later)
create table public.matches (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  winner_id uuid references public.profiles(id),
  difficulty text default 'Medium'
);

create table public.match_participants (
  match_id uuid references public.matches(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  wpm integer not null,
  position integer not null,
  primary key (match_id, user_id)
);

-- Note: RLS for matches can be configured later depending on server vs client inserts.
