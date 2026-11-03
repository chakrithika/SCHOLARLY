import { useEffect, useState } from 'react';
import { Brain, Coffee, Hourglass, Pause, Play, RotateCcw, Timer as TimerIcon } from 'lucide-react';
import { PixelPanel } from '@/components/PixelPanel';
import { Mascot } from '@/components/Mascot';
import { useFocus, fmtClock } from '@/lib/focus';

type Mode = 'stopwatch' | 'countdown' | 'pomodoro';
const PRESETS = [{ name: 'Classic', focus: 25, break: 5 }, { name: 'Deep Work', focus: 50, break: 10 }, { name: 'Sprint', focus: 15, break: 3 }];

export function StudyTimer() {
  const [mode, setMode] = useState<Mode>('pomodoro');
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [target, setTarget] = useState(25 * 60);
  const [preset, setPreset] = useState(PRESETS[0]);
  const [phase, setPhase] = useState<'focus' | 'break'>('focus');
  const [label, setLabel] = useState('Focus session');
  const { logSession } = useFocus();
  const total = mode === 'stopwatch' ? 0 : mode === 'countdown' ? target : (phase === 'focus' ? preset.focus : preset.break) * 60;
  const display = mode === 'stopwatch' ? elapsed : Math.max(0, total - elapsed);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!running || mode === 'stopwatch' || elapsed < total) return;
    const complete = async () => {
      if (mode === 'countdown' || phase === 'focus') await logSession(mode, total, label);
      if (mode === 'pomodoro' && phase === 'focus') { setPhase('break'); setElapsed(0); return; }
      setRunning(false); setElapsed(0); setPhase('focus');
    };
    void complete();
  }, [elapsed, running, mode, phase, total, label, logSession]);

  function reset() { setRunning(false); setElapsed(0); setPhase('focus'); }
  async function logStopwatch() { if (elapsed >= 60) await logSession('stopwatch', elapsed, label); reset(); }

  return <div className="space-y-5 animate-rise-in max-w-5xl">
    <header><h1 className="font-display text-base sm:text-lg text-lavender-100 neon-text mb-1">STUDY TIMER</h1><p className="text-sm text-lavender-300 font-body">Completed sessions are saved to your personal study history.</p></header>
    <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-4">
      <PixelPanel accent="cyan">
        <div className="flex gap-2 mb-8"><Tab active={mode === 'stopwatch'} onClick={() => { setMode('stopwatch'); reset(); }}><TimerIcon size={14} /> Stopwatch</Tab><Tab active={mode === 'countdown'} onClick={() => { setMode('countdown'); reset(); }}><Hourglass size={14} /> Countdown</Tab><Tab active={mode === 'pomodoro'} onClick={() => { setMode('pomodoro'); reset(); }}><Coffee size={14} /> Pomodoro</Tab></div>
        <div className="flex flex-col items-center gap-5"><Mascot size={72} mood={running ? 'study' : 'happy'} className={running ? 'animate-float' : ''} /><span className="chip !border-neon-cyan !text-neon-cyan">{mode === 'pomodoro' ? phase === 'focus' ? <><Brain size={12} /> Focus</> : <><Coffee size={12} /> Break</> : mode}</span><div className="font-display text-5xl sm:text-7xl text-lavender-50 neon-text-cyan tabular-nums">{fmtClock(display)}</div><div className="flex gap-3">{running ? <button onClick={() => setRunning(false)} className="btn-pixel"><Pause size={16} /> Pause</button> : <button onClick={() => setRunning(true)} className="btn-pixel-pink"><Play size={16} /> Start</button>}<button onClick={reset} className="btn-ghost"><RotateCcw size={16} /> Reset</button>{mode === 'stopwatch' && !running && elapsed >= 60 && <button onClick={() => void logStopwatch()} className="btn-ghost">Save session</button>}</div><label className="w-full max-w-sm"><span className="block text-xs font-body text-lavender-300 mb-1">Session name</span><input className="input-pixel" value={label} onChange={(e) => setLabel(e.target.value)} /></label></div>
      </PixelPanel>
      <PixelPanel title="POMODORO PRESETS" accent="pink"><div className="space-y-2">{PRESETS.map((item) => <button key={item.name} onClick={() => { setPreset(item); setPhase('focus'); setElapsed(0); setRunning(false); }} className={`w-full flex items-center justify-between p-3 border-2 font-body text-sm ${preset.name === item.name ? 'border-neon-pink bg-neon-pink/10 text-lavender-100' : 'border-lavender-500/40 text-lavender-300'}`}><span>{item.name}</span><span>{item.focus} focus / {item.break} break</span></button>)}</div><div className="mt-4 flex gap-2"><button className="btn-ghost !text-xs !py-1.5" onClick={() => { setMode('countdown'); setTarget(Math.max(60, target - 300)); reset(); }}>−5 min</button><span className="font-body text-xs text-lavender-300 self-center">Countdown {Math.round(target / 60)} min</span><button className="btn-ghost !text-xs !py-1.5" onClick={() => { setMode('countdown'); setTarget(Math.min(180 * 60, target + 300)); reset(); }}>+5 min</button></div></PixelPanel>
    </div>
  </div>;
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button onClick={onClick} className={`flex items-center gap-1 px-3 py-1.5 border-2 font-body text-sm ${active ? 'border-neon-cyan bg-midnight-800 text-lavender-100' : 'border-lavender-500/40 text-lavender-300'}`}>{children}</button>; }
