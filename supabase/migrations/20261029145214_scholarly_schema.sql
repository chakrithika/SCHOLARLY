/*
# SCHOLARLY — full app schema

1. Overview
This migration creates the complete database for SCHOLARLY, a study companion app.
Multi-user: every user owns their data. Sign-in required (Supabase email/password).
A profile row is auto-created on signup via a trigger.

2. Tables
- `profiles` — display_name, target_exam, avatar_color, avatar_url, created_at. One row per auth user.
- `folders` — user-owned note folders (name).
- `notes` — mistake notebook entries (folder_id, title, body, created_at, updated_at).
- `todos` — to-do tasks (text, priority, done, created_at).
- `planner_entries` — weekly planner items (date, text, done, created_at).
- `focus_sessions` — completed timer sessions (mode, seconds, label, started_at). Feeds the Progress Tracker.
- `rewards` — unlocked cosmetic rewards (reward_id, unlocked_at). XP spend recorded in profiles.xp.
- `chat_messages` — public community chat (display_name, avatar_color, avatar_url, body, created_at). Real persistent chat, visible to all signed-in users.

3. Security
- RLS enabled on every table.
- profiles/folders/notes/todos/planner_entries/focus_sessions/rewards: owner-scoped to authenticated user via auth.uid() = user_id (DEFAULT auth.uid()).
- chat_messages: any authenticated user can read all messages and insert their own; updates/deletes limited to owner.
- Grants: authenticated gets CRUD on owned tables; chat_messages SELECT to authenticated (all rows), INSERT/WRITE own.
- service_role granted on all tables for edge functions if needed later.

4. Important notes
- `user_id` columns default to auth.uid() so inserts omitting user_id still satisfy WITH CHECK.
- profile auto-creation trigger handles new signups.
- XP and avatar metadata live in profiles so they persist across devices.
- A SECURITY DEFINER function `claim_new_user_profile` is NOT needed; the trigger covers it.
*/

-- =========================
-- profiles
-- =========================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'Player',
  target_exam text NOT NULL DEFAULT 'SAT',
  avatar_color text NOT NULL DEFAULT '#936bff',
  avatar_url text,
  xp integer NOT NULL DEFAULT 0,
  streak integer NOT NULL DEFAULT 0,
  last_study_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, UPDATE ON public.profiles TO service_role;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- =========================
-- folders
-- =========================
CREATE TABLE IF NOT EXISTS public.folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.folders TO authenticated;

DROP POLICY IF EXISTS "folders_select_own" ON public.folders;
CREATE POLICY "folders_select_own" ON public.folders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "folders_insert_own" ON public.folders;
CREATE POLICY "folders_insert_own" ON public.folders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "folders_update_own" ON public.folders;
CREATE POLICY "folders_update_own" ON public.folders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "folders_delete_own" ON public.folders;
CREATE POLICY "folders_delete_own" ON public.folders FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =========================
-- notes
-- =========================
CREATE TABLE IF NOT EXISTS public.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_id uuid REFERENCES public.folders(id) ON DELETE SET NULL,
  folder_name text NOT NULL DEFAULT 'General',
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notes TO authenticated;

DROP POLICY IF EXISTS "notes_select_own" ON public.notes;
CREATE POLICY "notes_select_own" ON public.notes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notes_insert_own" ON public.notes;
CREATE POLICY "notes_insert_own" ON public.notes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notes_update_own" ON public.notes;
CREATE POLICY "notes_update_own" ON public.notes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notes_delete_own" ON public.notes;
CREATE POLICY "notes_delete_own" ON public.notes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =========================
-- todos
-- =========================
CREATE TABLE IF NOT EXISTS public.todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  text text NOT NULL,
  priority text NOT NULL DEFAULT 'med',
  done boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.todos TO authenticated;

DROP POLICY IF EXISTS "todos_select_own" ON public.todos;
CREATE POLICY "todos_select_own" ON public.todos FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "todos_insert_own" ON public.todos;
CREATE POLICY "todos_insert_own" ON public.todos FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "todos_update_own" ON public.todos;
CREATE POLICY "todos_update_own" ON public.todos FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "todos_delete_own" ON public.todos;
CREATE POLICY "todos_delete_own" ON public.todos FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =========================
-- planner_entries
-- =========================
CREATE TABLE IF NOT EXISTS public.planner_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  study_date date NOT NULL,
  text text NOT NULL,
  done boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.planner_entries ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.planner_entries TO authenticated;

DROP POLICY IF EXISTS "planner_select_own" ON public.planner_entries;
CREATE POLICY "planner_select_own" ON public.planner_entries FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "planner_insert_own" ON public.planner_entries;
CREATE POLICY "planner_insert_own" ON public.planner_entries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "planner_update_own" ON public.planner_entries;
CREATE POLICY "planner_update_own" ON public.planner_entries FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "planner_delete_own" ON public.planner_entries;
CREATE POLICY "planner_delete_own" ON public.planner_entries FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =========================
-- focus_sessions  (feeds Progress Tracker)
-- =========================
CREATE TABLE IF NOT EXISTS public.focus_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  mode text NOT NULL,
  seconds integer NOT NULL,
  label text NOT NULL DEFAULT 'Focus session',
  started_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON public.focus_sessions TO authenticated;

DROP POLICY IF EXISTS "focus_select_own" ON public.focus_sessions;
CREATE POLICY "focus_select_own" ON public.focus_sessions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "focus_insert_own" ON public.focus_sessions;
CREATE POLICY "focus_insert_own" ON public.focus_sessions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "focus_delete_own" ON public.focus_sessions;
CREATE POLICY "focus_delete_own" ON public.focus_sessions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS focus_sessions_user_started_idx
  ON public.focus_sessions (user_id, started_at);

-- =========================
-- rewards
-- =========================
CREATE TABLE IF NOT EXISTS public.rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id text NOT NULL,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, reward_id)
);

ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON public.rewards TO authenticated;

DROP POLICY IF EXISTS "rewards_select_own" ON public.rewards;
CREATE POLICY "rewards_select_own" ON public.rewards FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "rewards_insert_own" ON public.rewards;
CREATE POLICY "rewards_insert_own" ON public.rewards FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "rewards_delete_own" ON public.rewards;
CREATE POLICY "rewards_delete_own" ON public.rewards FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =========================
-- chat_messages  (real persistent community chat)
-- =========================
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar_color text NOT NULL DEFAULT '#936bff',
  avatar_url text,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO authenticated;

DROP POLICY IF EXISTS "chat_select_all" ON public.chat_messages;
CREATE POLICY "chat_select_all" ON public.chat_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "chat_insert_own" ON public.chat_messages;
CREATE POLICY "chat_insert_own" ON public.chat_messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "chat_update_own" ON public.chat_messages;
CREATE POLICY "chat_update_own" ON public.chat_messages FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "chat_delete_own" ON public.chat_messages;
CREATE POLICY "chat_delete_own" ON public.chat_messages FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS chat_messages_created_idx
  ON public.chat_messages (created_at);

-- =========================
-- auto-create profile on signup
-- =========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_color)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Player'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_color', '#936bff')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
