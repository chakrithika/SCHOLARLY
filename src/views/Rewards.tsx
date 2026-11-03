import { Flame, Zap, Trophy, Clock, Lock, Sparkles, RotateCcw } from 'lucide-react';
import { PixelPanel } from '@/components/PixelPanel';
import { ProgressBar } from '@/components/ProgressBar';
import { Mascot } from '@/components/Mascot';
import { useGameData } from '@/lib/game';
import { levelFromXp, xpProgress, xpForLevel, REWARDS } from '@/data/types';
import { fmtDuration } from '@/lib/storage';

export function Rewards() {
  const { data, unlockReward, reset } = useGameData();
  const level = levelFromXp(data.xp);
  const progress = xpProgress(data.xp);

  const recentLevels = Array.from({ length: 6 }, (_, i) => level - 2 + i).filter((l) => l > 0);

  return (
    <div className="space-y-4 animate-rise-in">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-base sm:text-lg text-lavender-100 neon-text mb-1">STREAKS, XP &amp; REWARDS</h1>
          <p className="text-sm text-lavender-300 font-pixel">Grind XP, keep your streak alive, unlock pixel cosmetics.</p>
        </div>
        <button
          onClick={() => { if (window.confirm('Reset all XP, streaks, and rewards? This cannot be undone.')) reset(); }}
          className="btn-ghost !py-1.5 !text-xs !border-neon-pink/40 !text-neon-pink"
        >
          <RotateCcw size={12} /> Reset progress
        </button>
      </header>

      {/* Level banner */}
      <PixelPanel accent="cyan" className="relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Mascot size={80} mood="celebrate" className="animate-float" />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Trophy size={18} className="text-neon-cyan" />
              <h2 className="font-display text-xl text-lavender-100 neon-text">Level {level}</h2>
            </div>
            <p className="font-pixel text-sm text-lavender-300 mb-2">{data.xp} total XP earned</p>
            <div className="max-w-md">
              <ProgressBar value={progress.pct} accent="cyan" label={`Level ${level} → ${level + 1}`} showValue />
              <p className="text-xs text-lavender-300/70 font-pixel mt-1">
                {progress.current} / {progress.needed} XP to next level
              </p>
            </div>
          </div>
        </div>
      </PixelPanel>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<Flame size={18} />} label="Current streak" value={`${data.streak}d`} accent="pink" />
        <StatCard icon={<Zap size={18} />} label="Total XP" value={`${data.xp}`} accent="cyan" />
        <StatCard icon={<Clock size={18} />} label="Focus time" value={fmtDuration(data.totalFocusSeconds)} accent="lavender" />
        <StatCard icon={<Sparkles size={18} />} label="Tasks done" value={`${data.todosDone}`} accent="lime" />
      </div>

      {/* Level path */}
      <PixelPanel title="LEVEL PATH" accent="lavender">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {recentLevels.map((l) => {
            const unlocked = level >= l;
            const isCurrent = level === l;
            return (
              <div key={l} className="flex flex-col items-center gap-1 shrink-0">
                <div
                  className={`w-12 h-12 flex items-center justify-center font-display text-sm border-2 ${
                    isCurrent
                      ? 'border-neon-cyan bg-neon-cyan/20 text-neon-cyan shadow-glow-cyan'
                      : unlocked
                      ? 'border-lavender-400 bg-lavender-600/20 text-lavender-100'
                      : 'border-lavender-700 bg-midnight-950 text-lavender-500'
                  }`}
                >
                  {unlocked ? l : <Lock size={14} />}
                </div>
                <span className="text-[10px] font-pixel text-lavender-400">{xpForLevel(l)} XP</span>
              </div>
            );
          })}
        </div>
      </PixelPanel>

      {/* Rewards shop */}
      <PixelPanel title="REWARDS SHOP" accent="pink">
        <p className="text-xs text-lavender-300 font-pixel mb-3">Spend XP to unlock cosmetic flair. Demo only — no real items.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {REWARDS.map((r) => {
            const owned = data.rewardsUnlocked.includes(r.id);
            const affordable = data.xp >= r.cost;
            return (
              <div
                key={r.id}
                className={`panel !p-3 text-center flex flex-col items-center gap-1 ${
                  owned ? '!border-neon-lime !bg-neon-lime/10' : ''
                }`}
              >
                <div className={`text-3xl ${owned ? 'text-neon-lime' : 'text-lavender-400'}`}>{r.emoji}</div>
                <p className="font-pixel text-xs text-lavender-100">{r.name}</p>
                <p className="text-xs font-pixel text-lavender-300">{r.cost} XP</p>
                {owned ? (
                  <span className="chip !border-neon-lime !text-neon-lime !py-0.5">Owned</span>
                ) : (
                  <button
                    onClick={() => unlockReward(r.id, r.cost)}
                    disabled={!affordable}
                    className={`btn-pixel-pink !py-1 !px-2 !text-xs w-full ${!affordable ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    {affordable ? 'Unlock' : 'Locked'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </PixelPanel>
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: 'pink' | 'cyan' | 'lavender' | 'lime' }) {
  const colors = {
    pink: 'text-neon-pink',
    cyan: 'text-neon-cyan',
    lavender: 'text-lavender-300',
    lime: 'text-neon-lime',
  };
  return (
    <div className="panel flex items-center gap-3">
      <div className={colors[accent]}>{icon}</div>
      <div>
        <p className="font-display text-lg text-lavender-100">{value}</p>
        <p className="text-xs text-lavender-300 font-pixel">{label}</p>
      </div>
    </div>
  );
}
