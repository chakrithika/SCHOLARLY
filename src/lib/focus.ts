import { useCallback, useEffect, useState } from 'react';
import { supabase, FocusSession } from './supabase';
import { useAuth } from './auth';

const AVATAR_COLORS = ['#936bff', '#5cf2ff', '#ff6ad5', '#b9ff5c', '#ffe45c', '#b07cff'];

export function pickAvatarColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export function useFocus() {
  const { profile, refreshProfile } = useAuth();
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSessions([]); setLoading(false); return; }
    const { data, error } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .limit(500);
    if (error) { console.error('focus load', error.message); }
    setSessions((data as FocusSession[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { if (profile) load(); }, [profile, load]);

  const logSession = useCallback(async (mode: FocusSession['mode'], seconds: number, label: string) => {
    if (seconds < 60) return { ok: false as const, error: 'Session too short to log.' };
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false as const, error: 'Not signed in.' };
    const { data, error } = await supabase
      .from('focus_sessions')
      .insert({ user_id: user.id, mode, seconds, label })
      .select()
      .single();
    if (error) return { ok: false as const, error: error.message };
    setSessions((prev) => [data as FocusSession, ...prev]);
    // update streak on profile
    const today = new Date().toISOString().slice(0, 10);
    const last = profile?.last_study_date ? String(profile.last_study_date) : null;
    let streak = profile?.streak || 0;
    if (last !== today) {
      if (!last) streak = 1;
      else {
        const diff = Math.round((new Date(today).getTime() - new Date(last).getTime()) / 86400000);
        if (diff === 1) streak = (profile?.streak || 0) + 1;
        else if (diff > 1) streak = 1;
      }
      await supabase.from('profiles').update({ streak, last_study_date: today, xp: (profile?.xp || 0) + Math.round(seconds / 60) * 5 }).eq('id', user.id);
      refreshProfile();
    } else {
      await supabase.from('profiles').update({ xp: (profile?.xp || 0) + Math.round(seconds / 60) * 5 }).eq('id', user.id);
      refreshProfile();
    }
    return { ok: true as const };
  }, [profile, refreshProfile]);

  const deleteSession = useCallback(async (id: string) => {
    const { error } = await supabase.from('focus_sessions').delete().eq('id', id);
    if (!error) setSessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return { sessions, loading, logSession, deleteSession, reload: load };
}

export function fmtDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export function fmtHours(seconds: number): string {
  const h = seconds / 3600;
  if (h >= 100) return `${Math.round(h)}h`;
  if (h >= 10) return `${h.toFixed(1)}h`;
  return `${h.toFixed(2)}h`;
}

export function fmtClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function todayKey(): string {
  return dateKey(new Date());
}
