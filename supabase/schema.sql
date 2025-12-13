-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

-- TRIGGER FOR NEW USERS
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- CALENDAR EVENTS TABLE
create table public.calendar_events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  summary text not null,
  description text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  location text,
  color_id text,
  status text default 'confirmed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.calendar_events enable row level security;

create policy "Users can view their own events" on public.calendar_events
  for select using (auth.uid() = user_id);

create policy "Users can insert their own events" on public.calendar_events
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own events" on public.calendar_events
  for update using (auth.uid() = user_id);

create policy "Users can delete their own events" on public.calendar_events
  for delete using (auth.uid() = user_id);


-- TODOS TABLE
create table public.todos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  category text not null default 'todo', -- 'todo', 'inProgress', 'done'
  priority text default 'medium',
  project text default 'general',
  sub_tasks jsonb default '[]'::jsonb,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

alter table public.todos enable row level security;

create policy "Users can manage their own todos" on public.todos
  for all using (auth.uid() = user_id);


-- NOTES TABLE
create table public.notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text default 'Untitled Note',
  content text, -- JSON string or Markdown
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notes enable row level security;

create policy "Users can manage their own notes" on public.notes
  for all using (auth.uid() = user_id);


-- STICKY NOTES TABLE
create table public.sticky_notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  content text,
  color text default 'yellow',
  x_position integer default 0,
  y_position integer default 0,
  z_index integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.sticky_notes enable row level security;

create policy "Users can manage their own sticky notes" on public.sticky_notes
  for all using (auth.uid() = user_id);


-- FOCUS SESSIONS (SESSION LOG) TABLE
create table public.focus_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  task_id uuid references public.todos(id) on delete set null,
  date date not null,
  duration_minutes integer not null,
  started_at timestamp with time zone,
  ended_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.focus_sessions enable row level security;

create policy "Users can manage their own focus sessions" on public.focus_sessions
  for all using (auth.uid() = user_id);


-- CHAT SESSIONS (AI ASSISTANT)
create table public.chat_sessions (
  id text primary key, -- Use custom session ID if needed, or UUID
  user_id uuid references auth.users(id) on delete cascade not null,
  title text default 'New Chat',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.chat_sessions enable row level security;

create policy "Users can manage their own chat sessions" on public.chat_sessions
  for all using (auth.uid() = user_id);


-- CHAT MESSAGES
create table public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  session_id text references public.chat_sessions(id) on delete cascade not null,
  role text not null, -- 'user' or 'assistant'
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.chat_messages enable row level security;

create policy "Users can manage their own chat messages" on public.chat_messages
  for all using (
    exists (
      select 1 from public.chat_sessions
      where id = chat_messages.session_id
      and user_id = auth.uid()
    )
  );
