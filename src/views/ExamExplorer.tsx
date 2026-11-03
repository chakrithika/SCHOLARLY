import { useState } from 'react';
import { ArrowLeft, ExternalLink, CheckCircle2, FileText, Video, GraduationCap, Calendar, Globe, BookOpen } from 'lucide-react';
import { PixelPanel } from '@/components/PixelPanel';
import { EXAMS, ExamInfo, ExamId } from '@/data/exams';
import { useAuth } from '@/lib/auth';

const accentBorder: Record<string, string> = {
  pink: '!border-neon-pink hover:!shadow-glow-pink',
  cyan: '!border-neon-cyan hover:!shadow-glow-cyan',
  lime: '!border-neon-lime',
  purple: '!border-lavender-400 hover:!shadow-glow',
};
const accentText: Record<string, string> = {
  pink: 'text-neon-pink',
  cyan: 'text-neon-cyan',
  lime: 'text-neon-lime',
  purple: 'text-lavender-200',
};
const accentChip: Record<string, string> = {
  pink: '!border-neon-pink/60 !text-neon-pink',
  cyan: '!border-neon-cyan/60 !text-neon-cyan',
  lime: '!border-neon-lime/60 !text-neon-lime',
  purple: '!border-lavender-400/60 !text-lavender-200',
};

export function ExamExplorer() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<ExamInfo | null>(null);

  if (selected) {
    return <ExamDetail exam={selected} onBack={() => setSelected(null)} />;
  }

  const userExam = user?.exam;

  return (
    <div className="space-y-4 animate-rise-in">
      <header>
        <h1 className="font-display text-base sm:text-lg text-lavender-100 neon-text mb-1">EXAM EXPLORER</h1>
        <p className="text-sm text-lavender-300 font-pixel">Pick your boss. Eligibility, pattern, official links & resources for 8 exams.</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {EXAMS.map((e) => {
          const isUserExam = userExam === e.id;
          return (
            <button
              key={e.id}
              onClick={() => setSelected(e)}
              className={`panel !p-4 text-left transition-all duration-150 hover:-translate-y-1 group ${accentBorder[e.accent]}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className={`font-display text-sm ${accentText[e.accent]} group-hover:neon-text-cyan transition-all`}>
                    {e.short}
                  </h3>
                  <p className="text-[10px] text-lavender-300 font-pixel mt-0.5">{e.region}</p>
                </div>
                {isUserExam && <span className="chip !border-neon-cyan !text-neon-cyan !py-0.5">Yours</span>}
              </div>
              <p className="text-xs text-lavender-200 font-pixel line-clamp-2 mb-2">{e.full}</p>
              <p className="text-[11px] text-lavender-300/70 font-pixel line-clamp-2">{e.tagline}</p>
              <div className="flex items-center gap-1 mt-3 text-xs font-pixel text-lavender-300 group-hover:text-neon-cyan">
                <BookOpen size={12} /> Open page →
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ExamDetail({ exam, onBack }: { exam: ExamInfo; onBack: () => void }) {
  return (
    <div className="space-y-4 animate-rise-in">
      <button onClick={onBack} className="btn-ghost !py-1.5 !text-sm">
        <ArrowLeft size={14} /> Back to all exams
      </button>

      <PixelPanel accent={exam.accent === 'purple' ? 'lavender' : exam.accent}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`font-display text-xl ${accentText[exam.accent]} neon-text`}>{exam.short}</h1>
              <span className={`chip ${accentChip[exam.accent]}`}>{exam.region}</span>
            </div>
            <p className="text-sm text-lavender-200 font-pixel mt-1">{exam.full}</p>
            <p className="text-sm text-lavender-300 font-pixel mt-1 italic">{exam.tagline}</p>
          </div>
        </div>
      </PixelPanel>

      <div className="grid lg:grid-cols-2 gap-4">
        <PixelPanel title="ELIGIBILITY" accent="cyan">
          <ul className="space-y-2">
            {exam.eligibility.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm font-pixel text-lavender-200">
                <CheckCircle2 size={14} className="text-neon-cyan shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </PixelPanel>

        <PixelPanel title="EXAM PATTERN" accent="pink">
          <ul className="space-y-2">
            {exam.pattern.map((s, i) => (
              <li key={i} className="border-l-2 border-neon-pink/50 pl-3">
                <p className="font-pixel text-sm text-lavender-100">{s.section}</p>
                <p className="text-xs text-lavender-300 font-pixel">{s.details}</p>
              </li>
            ))}
          </ul>
        </PixelPanel>
      </div>

      <PixelPanel title="OFFICIAL LINKS" accent="lavender">
        <div className="grid sm:grid-cols-2 gap-2">
          {exam.official.map((o) => (
            <a
              key={o.url}
              href={o.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 panel !p-2 hover:!border-neon-cyan hover:-translate-y-0.5 transition-all"
            >
              <Globe size={14} className="text-neon-cyan shrink-0" />
              <span className="text-sm font-pixel text-lavender-100 flex-1 truncate">{o.label}</span>
              <ExternalLink size={12} className="text-lavender-400" />
            </a>
          ))}
        </div>
      </PixelPanel>

      <PixelPanel title="USEFUL RESOURCES" accent="lime">
        <div className="grid sm:grid-cols-3 gap-2">
          {exam.resources.map((r) => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="panel !p-3 hover:!border-neon-lime hover:-translate-y-0.5 transition-all flex flex-col gap-1"
            >
              <div className="flex items-center gap-1.5 text-neon-lime">
                {r.kind === 'video' ? <Video size={14} /> : r.kind === 'official' ? <GraduationCap size={14} /> : <FileText size={14} />}
                <span className="text-[10px] uppercase font-pixel">{r.kind}</span>
              </div>
              <p className="text-sm font-pixel text-lavender-100">{r.label}</p>
              <span className="text-[10px] text-lavender-400 font-pixel flex items-center gap-1">Open <ExternalLink size={9} /></span>
            </a>
          ))}
        </div>
      </PixelPanel>

      <PixelPanel accent="lavender" className="flex items-start gap-3">
        <Calendar size={16} className="text-neon-cyan shrink-0 mt-0.5" />
        <p className="text-sm text-lavender-300 font-pixel">
          Always verify current dates, fees and syllabus on the official site — exam patterns
          change year to year. This page is a starting point, not the source of truth.
        </p>
      </PixelPanel>
    </div>
  );
}
