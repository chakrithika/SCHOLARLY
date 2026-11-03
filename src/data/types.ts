export interface User {
  name: string;
  email: string;
  exam: string;
  avatarColor: string;
  createdAt: number;
}

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  priority: 'low' | 'med' | 'high';
  createdAt: number;
}

export interface Note {
  id: string;
  folder: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
}

export interface PlannerDay {
  date: string; // ISO yyyy-mm-dd
  entries: { id: string; text: string; done: boolean }[];
}

export interface TimerSession {
  id: string;
  mode: 'stopwatch' | 'countdown' | 'pomodoro';
  seconds: number;
  label: string;
  date: string;
}

export interface StudyStats {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string | null;
  totalFocusSeconds: number;
  todosDone: number;
  rewardsUnlocked: string[];
}

export const REWARDS: { id: string; name: string; cost: number; emoji: string }[] = [
  { id: 'star-pup', name: 'Star Pup sticker', cost: 50, emoji: '★' },
  { id: 'neon-cat', name: 'Neon Cat badge', cost: 120, emoji: '⬢' },
  { id: 'study-aura', name: 'Aurora aura', cost: 250, emoji: '✦' },
  { id: 'pixel-trophy', name: 'Pixel trophy', cost: 500, emoji: '▲' },
  { id: 'galaxy-cape', name: 'Galaxy cape', cost: 900, emoji: '❉' },
  { id: 'final-boss', name: 'Final Boss title', cost: 1500, emoji: '☠' },
];

export function levelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 50)) + 1;
}

export function xpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 50;
}

export function nextLevelXp(xp: number): number {
  return xpForLevel(levelFromXp(xp) + 1);
}

export function xpProgress(xp: number): { current: number; needed: number; pct: number } {
  const level = levelFromXp(xp);
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const needed = next - base;
  const current = xp - base;
  return { current, needed, pct: Math.min(100, Math.round((current / needed) * 100)) };
}
