import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !anonKey) {
  // eslint-disable-next-line no-console
  console.error('Supabase env vars missing. Check VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(url || '', anonKey || '', {
  auth: { persistSession: true, autoRefreshToken: true },
});

export type Profile = {
  id: string;
  display_name: string;
  target_exam: string;
  avatar_color: string;
  avatar_url: string | null;
  xp: number;
  streak: number;
  last_study_date: string | null;
  created_at: string;
};

export type Folder = { id: string; name: string; created_at: string };
export type Note = {
  id: string;
  user_id: string;
  folder_id: string | null;
  folder_name: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
};
export type Todo = {
  id: string;
  user_id: string;
  text: string;
  priority: 'low' | 'med' | 'high';
  done: boolean;
  created_at: string;
};
export type PlannerEntry = {
  id: string;
  user_id: string;
  study_date: string;
  text: string;
  done: boolean;
  created_at: string;
};
export type FocusSession = {
  id: string;
  user_id: string;
  mode: 'stopwatch' | 'countdown' | 'pomodoro';
  seconds: number;
  label: string;
  started_at: string;
};
export type RewardRow = { id: string; user_id: string; reward_id: string; unlocked_at: string };
export type ChatMessage = {
  id: string;
  user_id: string;
  display_name: string;
  avatar_color: string;
  avatar_url: string | null;
  body: string;
  created_at: string;
};

export type MusicLink = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  created_at: string;
};
