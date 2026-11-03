import { BookOpen, CalendarDays, CheckSquare, Timer, UserRound } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { DashView } from '@/components/DashShell';
import { PixelPanel } from '@/components/PixelPanel';
import { Mascot } from '@/components/Mascot';
import { EXAM_MAP } from '@/data/exams';

export function Overview({ setView }: { setView: (v: DashView) => void }) {
  const { profile } = useAuth();
  const exam = EXAM_MAP[profile?.target_exam as keyof typeof EXAM_MAP] || EXAM_MAP.SAT;
  const actions: { label: string; icon: React.ReactNode; view: DashView }[] = [
    { label: 'Start a study timer', icon: <Timer size={18} />, view: 'timer' },
    { label: 'Review mistakes', icon: <BookOpen size={18} />, view: 'notes' },
    { label: 'Plan your week', icon: <CalendarDays size={18} />, view: 'planner' },
    { label: 'Manage tasks', icon: <CheckSquare size={18} />, view: 'todo' },
  ];

  return (
    <div className="space-y-5 animate-rise-in max-w-5xl">
      <PixelPanel accent="cyan">
        <div className="flex items-center gap-4"><Mascot size={62} mood="happy" /><div><p className="text-xs text-neon-cyan font-body uppercase tracking-wider">Your study space</p><h1 className="font-display text-base sm:text-lg text-lavender-100 neon-text mt-1">Welcome, {profile?.display_name || 'student'}</h1><p className="text-sm text-lavender-300 font-body mt-1">Your {exam.id} resources and study tools are ready.</p></div></div>
      </PixelPanel>
      <div className="grid lg:grid-cols-2 gap-4">
        <PixelPanel title="YOUR EXAM" accent="pink">
          <div className="flex items-start justify-between gap-4"><div><h2 className="font-display text-lg text-neon-pink">{exam.short}</h2><p className="text-sm text-lavender-200 font-body mt-1">{exam.full}</p><p className="text-sm text-lavender-300 font-body mt-2">{exam.tagline}</p></div><button onClick={() => setView('exams')} className="btn-ghost !py-1.5 !text-xs">Open explorer</button></div>
        </PixelPanel>
        <PixelPanel title="STUDY TOOLS" accent="lavender"><div className="grid sm:grid-cols-2 gap-2">{actions.map((action) => <button key={action.view} onClick={() => setView(action.view)} className="flex items-center gap-2 panel !p-3 text-left hover:!border-neon-cyan transition-colors"><span className="text-neon-cyan">{action.icon}</span><span className="font-body text-sm text-lavender-100">{action.label}</span></button>)}</div></PixelPanel>
      </div>
      <PixelPanel accent="lime" className="flex items-center gap-3"><UserRound size={18} className="text-neon-lime" /><p className="text-sm text-lavender-300 font-body">Your personal study data is saved to your account and available whenever you sign in.</p></PixelPanel>
    </div>
  );
}
