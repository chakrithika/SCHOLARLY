import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { Landing } from '@/pages/Landing';
import { DashShell, DashView } from '@/components/DashShell';
import { Overview } from '@/views/Overview';
import { StudyTimer } from '@/views/StudyTimer';
import { MistakeNotebook } from '@/views/MistakeNotebook';
import { TodoList } from '@/views/TodoList';
import { WeeklyPlanner } from '@/views/WeeklyPlanner';
import { VibeStation } from '@/views/VibeStation';
import { CommunityChat } from '@/views/CommunityChat';
import { ExamExplorer } from '@/views/ExamExplorer';

function AppInner() {
  const { profile, loading } = useAuth();
  const [view, setView] = useState<DashView>('exams');
  const [inApp, setInApp] = useState(false);

  useEffect(() => {
    if (profile) setInApp(true);
  }, [profile]);

  function enterApp() {
    setInApp(true);
    setView('exams');
  }

  function exitToLanding() {
    setInApp(false);
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-midnight-950 text-lavender-200 font-body">Loading SCHOLARLY...</div>;
  }

  if (!profile || !inApp) {
    return <Landing onEnterApp={enterApp} />;
  }

  return (
    <DashShell view={view} setView={setView} onExit={exitToLanding}>
      {view === 'overview' && <Overview setView={setView} />}
      {view === 'timer' && <StudyTimer />}
      {view === 'notes' && <MistakeNotebook />}
      {view === 'todo' && <TodoList />}
      {view === 'planner' && <WeeklyPlanner />}
      {view === 'vibe' && <VibeStation />}
      {view === 'chat' && <CommunityChat />}
      {view === 'exams' && <ExamExplorer />}
    </DashShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
