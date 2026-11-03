import { useCallback } from 'react';
import { useLocalStorage, todayISO } from './storage';
import { levelFromXp } from '@/data/types';

export interface GameData {
  xp: number;
  totalFocusSeconds: number;
  streak: number;
  lastStudyDate: string | null;
  todosDone: number;
  rewardsUnlocked: string[];
}

const DEFAULT: GameData = {
  xp: 0,
  totalFocusSeconds: 0,
  streak: 0,
  lastStudyDate: null,
  todosDone: 0,
  rewardsUnlocked: [],
};

export function useGameData() {
  const [data, setData] = useLocalStorage<GameData>('scholarly.game', DEFAULT);

  const addXp = useCallback(
    (amount: number) => setData((d) => ({ ...d, xp: Math.max(0, d.xp + amount) })),
    [setData],
  );

  const addFocusSeconds = useCallback(
    (seconds: number) =>
      setData((d) => {
        const newTotal = d.totalFocusSeconds + seconds;
        const today = todayISO();
        let streak = d.streak;
        let lastStudyDate = d.lastStudyDate;
        if (d.lastStudyDate !== today) {
          if (d.lastStudyDate === null) {
            streak = 1;
          } else {
            const diff = Math.round((new Date(today).getTime() - new Date(d.lastStudyDate).getTime()) / 86400000);
            if (diff === 1) streak = d.streak + 1;
            else if (diff > 1) streak = 1;
          }
          lastStudyDate = today;
        }
        return { ...d, totalFocusSeconds: newTotal, streak, lastStudyDate };
      }),
    [setData],
  );

  const addTodosDone = useCallback(
    () => setData((d) => ({ ...d, todosDone: d.todosDone + 1 })), [setData]);

  const unlockReward = useCallback(
    (id: string, cost: number) =>
      setData((d) => {
        if (d.rewardsUnlocked.includes(id)) return d;
        if (d.xp < cost) return d;
        return { ...d, xp: d.xp - cost, rewardsUnlocked: [...d.rewardsUnlocked, id] };
      }),
    [setData],
  );

  const reset = useCallback(() => setData(DEFAULT), [setData]);

  return { data, addXp, addFocusSeconds, addTodosDone, unlockReward, reset };
}

export { levelFromXp };
