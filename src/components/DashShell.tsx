import { ReactNode, useState } from 'react';
import {
  LayoutDashboard, Timer, BookOpen, CheckSquare, CalendarDays,
  Radio, MessageSquare, Compass, LogOut, Menu, X, UserRound,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Mascot } from '@/components/Mascot';
import { AccountPanel } from '@/components/AccountPanel';
import { PikoAssistant } from '@/components/PikoAssistant';
import { EXAMS } from '@/data/exams';

export type DashView =
  | 'overview' | 'timer' | 'notes' | 'todo' | 'planner'
  | 'rewards' | 'vibe' | 'chat' | 'exams';

interface NavItem { id: DashView; label: string; icon: ReactNode; }

const NAV: NavItem[] = [
  { id: 'exams', label: 'Exam Explorer', icon: <Compass size={18} /> },
  { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'timer', label: 'Study Timer', icon: <Timer size={18} /> },
  { id: 'notes', label: 'Mistake Notebook', icon: <BookOpen size={18} /> },
  { id: 'todo', label: 'To-Do List', icon: <CheckSquare size={18} /> },
  { id: 'planner', label: 'Weekly Planner', icon: <CalendarDays size={18} /> },
  { id: 'vibe', label: 'Vibe Station', icon: <Radio size={18} /> },
  { id: 'chat', label: 'Community Chat', icon: <MessageSquare size={18} /> },
];

interface DashShellProps { view: DashView; setView: (v: DashView) => void; children: ReactNode; onExit: () => void; }

export function DashShell({ view, setView, children, onExit }: DashShellProps) {
  const { profile, signOut, updateProfile } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountTab, setAccountTab] = useState<'account' | 'help' | 'report'>('account');
  const [selectedExam, setSelectedExam] = useState(profile?.target_exam || '');

  const navigate = (next: DashView) => { setView(next); setMobileOpen(false); };

  const Sidebar = (
    <aside className="flex flex-col h-full bg-midnight-900/90 backdrop-blur-md border-r-2 border-lavender-500/30 w-64 shrink-0">
      <div className="flex items-center justify-center gap-2 px-4 py-5 border-b-2 border-lavender-500/30">
        <Mascot size={34} mood="happy" />
        <span className="font-display text-xs text-lavender-100 neon-text tracking-widest">SCHOLARLY</span>
      </div>
      <div className="px-4 py-4 border-b-2 border-lavender-500/20">
        <div className="flex items-center gap-2 min-w-0">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-9 h-9 object-cover border-2 border-lavender-400" />
          ) : (
            <div className="w-9 h-9 border-2 border-lavender-400 flex items-center justify-center font-display text-sm" style={{ background: profile?.avatar_color || '#936bff', color: '#05031a' }}>
              {profile?.display_name?.[0]?.toUpperCase() || 'P'}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-body font-semibold text-sm text-lavender-100 truncate">{profile?.display_name || 'Student'}</p>
            <p className="text-xs text-lavender-300 font-body truncate">{profile?.target_exam ? `${profile.target_exam} learner` : 'Study space'}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV.map((item) => {
          const active = view === item.id;
          return (
            <button key={item.id} onClick={() => navigate(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 my-0.5 text-left font-display text-[10px] tracking-wide transition-all ${active ? 'bg-lavender-600/30 text-lavender-100 border-l-2 border-neon-cyan shadow-glow-cyan' : 'text-lavender-300 hover:bg-lavender-600/15 hover:text-lavender-100 border-l-2 border-transparent'}`}>
              <span className={active ? 'text-neon-cyan' : 'text-lavender-400'}>{item.icon}</span>{item.label}
            </button>
          );
        })}
      </nav>
      <div className="px-3 py-3 border-t-2 border-lavender-500/30 space-y-2">
        <button onClick={() => setAccountOpen(true)} className="btn-ghost w-full !py-1.5 !text-sm"><UserRound size={14} /> My account</button>
        <button onClick={() => { void signOut(); onExit(); }} className="btn-ghost w-full !py-1.5 !text-sm"><LogOut size={14} /> Log out</button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block sticky top-0 h-screen">{Sidebar}</div>
      {mobileOpen && <div className="md:hidden fixed inset-0 z-40 flex"><div className="w-64 h-full">{Sidebar}</div><div className="flex-1 bg-midnight-950/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} /></div>}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b-2 border-lavender-500/30 bg-midnight-900/80 backdrop-blur-md">
          <div className="flex items-center gap-2"><Mascot size={28} mood="happy" /><span className="font-display text-xs text-lavender-100">SCHOLARLY</span></div>
          <button onClick={() => setMobileOpen(true)} className="text-lavender-200 p-1" aria-label="Open menu"><Menu size={22} /></button>
        </header>
        {mobileOpen && <button onClick={() => setMobileOpen(false)} className="md:hidden fixed top-3 right-3 z-50 text-lavender-100 p-1 bg-midnight-900 border-2 border-lavender-400 rounded" aria-label="Close menu"><X size={20} /></button>}
        <header className="hidden md:flex items-center justify-end gap-4 px-6 py-3 border-b-2 border-lavender-500/20 bg-midnight-900/50">
          <label className="flex items-center gap-2 text-xs text-lavender-400 font-body"><span>Preparing for</span><select value={selectedExam} onChange={(e) => { const nextExam = e.target.value || profile?.target_exam || 'SAT'; setSelectedExam(nextExam); void updateProfile({ target_exam: nextExam }); }} className="bg-midnight-950 border border-lavender-500/40 rounded px-2 py-1.5 text-lavender-100 font-body focus:outline-none focus:border-neon-cyan"><option value="">Choose an exam</option>{EXAMS.map((exam) => <option key={exam.id} value={exam.id}>{exam.short}</option>)}</select></label>
          <button onClick={() => setAccountOpen(true)} className="flex items-center gap-2 text-sm text-lavender-200 font-body hover:text-white transition-colors"><span className="w-8 h-8 border border-neon-cyan/60 bg-neon-cyan/10 rounded-full flex items-center justify-center font-display text-xs text-neon-cyan">{profile?.display_name?.[0]?.toUpperCase() || 'S'}</span>{profile?.display_name || 'Student'}</button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
      {accountOpen && profile && <AccountPanel profile={profile} initialTab={accountTab} onClose={() => setAccountOpen(false)} onExit={onExit} updateProfile={updateProfile} signOut={signOut} />}
      <PikoAssistant onOpenHelp={() => { setAccountTab('help'); setAccountOpen(true); }} />
    </div>
  );
}
