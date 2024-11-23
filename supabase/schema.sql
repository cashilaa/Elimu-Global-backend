-- Create users table
create table public.users (
  id uuid references auth.users primary key,
  full_name text,
  email text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create courses table
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create enrolled_courses table
create table public.enrolled_courses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  progress integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id)
);

-- Create user_stats table
create table public.user_stats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade unique,
  average_score numeric(5,2) default 0,
  upcoming_tests integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create performance_metrics table
create table public.performance_metrics (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  month date not null,
  score numeric(5,2) default 0,
  attendance numeric(5,2) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, month)
);

-- Create achievements table
create table public.achievements (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  icon text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_achievements table
create table public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  achievement_id uuid references public.achievements(id) on delete cascade,
  progress integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);

-- Create study_streaks table
create table public.study_streaks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade unique,
  current_streak integer default 0,
  last_study_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create chat_history table
create table public.chat_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  message text not null,
  sender text not null check (sender in ('user', 'bot')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table public.users enable row level security;
alter table public.courses enable row level security;
alter table public.enrolled_courses enable row level security;
alter table public.user_stats enable row level security;
alter table public.performance_metrics enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.study_streaks enable row level security;
alter table public.chat_history enable row level security;

-- User policies
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

-- Course policies
create policy "Anyone can view courses"
  on public.courses for select
  using (true);

-- Enrolled courses policies
create policy "Users can view own enrolled courses"
  on public.enrolled_courses for select
  using (auth.uid() = user_id);

-- User stats policies
create policy "Users can view own stats"
  on public.user_stats for select
  using (auth.uid() = user_id);

-- Performance metrics policies
create policy "Users can view own performance"
  on public.performance_metrics for select
  using (auth.uid() = user_id);

-- Achievements policies
create policy "Anyone can view achievements"
  on public.achievements for select
  using (true);

-- User achievements policies
create policy "Users can view own achievements"
  on public.user_achievements for select
  using (auth.uid() = user_id);

-- Study streaks policies
create policy "Users can view and update own streaks"
  on public.study_streaks for all
  using (auth.uid() = user_id);

-- Chat history policies
create policy "Users can view and create own chat messages"
  on public.chat_history for all
  using (auth.uid() = user_id);
