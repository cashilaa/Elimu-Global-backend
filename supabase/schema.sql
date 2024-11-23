-- Create users table
create table if not exists public.users (
  id uuid references auth.users primary key,
  full_name text,
  email text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create courses table
create table if not exists public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create enrolled_courses table
create table if not exists public.enrolled_courses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  progress integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id)
);

-- Create user_stats table
create table if not exists public.user_stats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade unique,
  average_score numeric(5,2) default 0,
  upcoming_tests integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create performance_metrics table
create table if not exists public.performance_metrics (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  month date not null,
  score numeric(5,2) default 0,
  attendance numeric(5,2) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, month)
);

-- Create achievements table
create table if not exists public.achievements (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  icon text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_achievements table
create table if not exists public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  achievement_id uuid references public.achievements(id) on delete cascade,
  progress integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);

-- Create study_streaks table
create table if not exists public.study_streaks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade unique,
  current_streak integer default 0,
  last_study_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create chat_history table
create table if not exists public.chat_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  message text not null,
  sender text not null check (sender in ('user', 'bot')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'en',
    notifications JSONB DEFAULT '{
        "email": true,
        "push": true,
        "sound": true,
        "assignments": true,
        "grades": true,
        "announcements": true,
        "reminders": true
    }'::jsonb,
    privacy JSONB DEFAULT '{
        "profileVisibility": "public",
        "showEmail": true,
        "showProgress": true,
        "showAchievements": true
    }'::jsonb,
    academic JSONB DEFAULT '{
        "timeZone": "UTC",
        "dateFormat": "MM/DD/YYYY",
        "timeFormat": "12h",
        "defaultView": "week"
    }'::jsonb,
    accessibility JSONB DEFAULT '{
        "fontSize": "medium",
        "contrast": "normal",
        "animations": true
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create unique index on user_id
CREATE UNIQUE INDEX IF NOT EXISTS user_settings_user_id_idx ON public.user_settings(user_id);

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
alter table public.user_settings enable row level security;

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

-- User settings policies
create policy "Users can view and update own settings"
  on public.user_settings for all
  using (auth.uid() = user_id);
