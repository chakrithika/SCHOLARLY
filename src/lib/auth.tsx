import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { supabase, Profile } from './supabase';
import { User } from '@/data/types';

interface AuthCtx {
  profile: Profile | null;
  user: User | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string, color: string) => Promise<{ ok: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (uid: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle();
    if (error) { /* eslint-disable-next-line no-console */ console.error('profile load', error.message); return; }
    if (data) setProfile(data as Profile);
  }, []);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) loadProfile(data.session.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadProfile(session.user.id);
      else setProfile(null);
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [loadProfile]);

  const signUp = useCallback(async (name: string, email: string, password: string, color: string) => {
    const clean = email.trim().toLowerCase();
    if (!name.trim() || !clean || !password) return { ok: false, error: 'Fill in all fields.' };
    if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' };
    const { data, error } = await supabase.auth.signUp({
      email: clean,
      password,
      options: { data: { display_name: name.trim(), avatar_color: color } },
    });
    if (error) return { ok: false, error: error.message };
    if (data.user) await loadProfile(data.user.id);
    return { ok: true };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const clean = email.trim().toLowerCase();
    if (!clean || !password) return { ok: false, error: 'Enter your email and password.' };
    const { data, error } = await supabase.auth.signInWithPassword({ email: clean, password });
    if (error) return { ok: false, error: error.message };
    if (data.user) await loadProfile(data.user.id);
    return { ok: true };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await loadProfile(user.id);
  }, [loadProfile]);

  const updateProfile = useCallback(async (patch: Partial<Profile>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase.from('profiles').update(patch).eq('id', user.id).select().maybeSingle();
    if (error) { console.error('update profile', error.message); return; }
    if (data) setProfile(data as Profile);
  }, []);

  const user: User | null = profile
    ? {
        name: profile.display_name,
        email: '',
        exam: profile.target_exam,
        avatarColor: profile.avatar_color,
        createdAt: new Date(profile.created_at).getTime(),
      }
    : null;

  return (
    <Ctx.Provider value={{ profile, user, loading, signUp, signIn, signOut, logout: signOut, refreshProfile, updateProfile }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
