import { useEffect, useRef, useState } from 'react';
import { Send, X } from 'lucide-react';

interface PikoMessage {
  id: number;
  from: 'piko' | 'user';
  text: string;
}

interface PikoAssistantProps {
  /** Called when the user reports a problem and PIKO should redirect them. */
  onOpenHelp?: () => void;
}

const HELP_TRIGGERS = [
  'problem', 'issue', 'bug', 'error', 'broken', 'not working', 'crash',
  'help', 'report', 'stuck', 'wrong', 'glitch', 'fail', "can't", 'cannot',
  'unable', 'trouble', 'complain', 'feedback',
];

const PIKO_GREETINGS = [
  "Hey there! I'm PIKO, your study buddy. Ask me anything about SCHOLARLY!",
  "Welcome back! PIKO at your service. What would you like to explore?",
  "Hi friend! Need a hand with the site? I gotchu!",
];

const PIKO_JOKES = [
  "Why did the student eat their homework? Because the teacher said it was a piece of cake! Ha!",
  "I'd tell you a chemistry joke, but I know I wouldn't get a reaction. Zzzt!",
  "Why don't robots ever panic before exams? Because we always have our bytes in order!",
  "What's a pirate's favorite section of the GRE? Arrr-verbal Reasoning!",
  "I tried to catch fog yesterday. Mist.",
  "Why was the math book sad? It had too many problems. Classic!",
  "My memory's like a sieve. But hey, at least I'm a cute sieve!",
];

interface KnowledgeEntry {
  patterns: string[];
  answer: string;
}

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    patterns: ['community chat', 'community', 'chat for', 'what is community', 'chat about', 'who are the other students'],
    answer: "Community Chat is a community for students who are prepping for the same exam as you. Everyone can share exam tips, important notes, chat about exam patterns, and support each other while studying together — right here in SCHOLARLY. Jump in and say hi!",
  },
  {
    patterns: ['exam explorer', 'exam info', 'about gre', 'about sat', 'gre exam', 'sat exam', 'test info', 'exam format', 'exam pattern', 'exam section', 'exam timing', 'exam scoring', 'exam fee', 'test dates'],
    answer: "Exam Explorer is your hub for standardized test info. Right now it covers the GRE and the SAT — format, timing, sections, scoring, fees, retake policies, and test dates. Pick an exam from the sidebar to dive in!",
  },
  {
    patterns: ['gre'],
    answer: "The GRE (Graduate Record Examination) is a standardized test for grad school admissions. In SCHOLARLY's Exam Explorer you'll find its format (about 1h 58m), five sections, section-level adaptivity, scoring, fees, retake policy, ScoreSelect, five-year score validity, and the 2023 Analytical Writing change. Open Exam Explorer and pick GRE for the full breakdown!",
  },
  {
    patterns: ['sat'],
    answer: "The SAT is a fully digital, multi-stage adaptive test taken through the Bluebook app. It runs about 2h 14m plus a 10-minute break, scores 400–1600, and covers Reading & Writing and Math (calculator allowed throughout, including built-in Desmos). SCHOLARLY's Exam Explorer has the full section timing, fees, and 2026 test dates — open it and pick SAT!",
  },
  {
    patterns: ['study timer', 'timer', 'pomodoro', 'focus session', 'study session'],
    answer: "The Study Timer helps you focus with timed study sessions. Start a session, pick a duration, and track how long you stay in the zone. Great for building a study streak!",
  },
  {
    patterns: ['mistake notebook', 'notebook', 'mistake', 'wrong answer', 'review mistake'],
    answer: "The Mistake Notebook is where you log questions you got wrong so you can review them later and avoid repeating the same slip-ups. It's saved to your account, so it's there every time you log in.",
  },
  {
    patterns: ['to-do', 'todo', 'task list', 'tasks', 'study task', 'assignment'],
    answer: "The To-Do List keeps your study tasks in one place. Add tasks, check them off, and stay on top of your prep. Your tasks are saved to your account.",
  },
  {
    patterns: ['weekly planner', 'planner', 'plan my week', 'study plan', 'schedule', 'week plan'],
    answer: "The Weekly Planner lets you map out your study plan across the week so you always know what to focus on each day. Try asking 'How do I plan my week?' and I'll walk you through it!",
  },
  {
    patterns: ['vibe station', 'vibe', 'music', 'station', 'playlist', 'song', 'audio', 'youtube', 'spotify'],
    answer: "Vibe Station is your in-app music room. Add YouTube, Spotify, or direct audio links and play your study playlist without ever leaving SCHOLARLY. It has play, pause, loop, and volume controls for audio files. YouTube and Spotify use their built-in player controls.",
  },
  {
    patterns: ['overview', 'dashboard', 'home base', 'home page'],
    answer: "The Dashboard (Overview) is your home base. It summarizes your progress, streaks, and quick links to every feature.",
  },
  {
    patterns: ['reward', 'xp', 'streak', 'achievement', 'milestone', 'badge', 'level'],
    answer: "Rewards tracks your study achievements — streaks, XP, and milestones to keep you motivated as you prep. The more you study, the more you earn!",
  },
  {
    patterns: ['account', 'profile', 'avatar', 'display name', 'my account', 'change name', 'change avatar'],
    answer: "Your Account panel lets you update your display name, avatar, and target exam. Click 'My account' at the bottom of the sidebar to open it.",
  },
  {
    patterns: ['login', 'log in', 'sign up', 'sign in', 'register', 'create account', 'sign in', 'how do i join', 'how do i start'],
    answer: "You can log in or sign up right from the landing page. Just hit the LOGIN or SIGN UP button and follow the prompts. Your data is saved to your account, so it's all there when you come back.",
  },
  {
    patterns: ['piko', 'who are you', 'mascot', 'robot', 'what are you', 'your name'],
    answer: "That's me! I'm PIKO, the little pixel robot who lives in SCHOLARLY. I answer questions about the site and crack the occasional joke. Zzzt!",
  },
  {
    patterns: ['scholarly', 'what is this', 'what is scholarly', 'what can i do', 'what does this do', 'features', 'what features'],
    answer: "SCHOLARLY is a student-focused study app. It has Exam Explorer (GRE & SAT info), a Study Timer, Mistake Notebook, To-Do List, Weekly Planner, Vibe Station (music), Community Chat, and Rewards. Ask me about any of them!",
  },
];

function isHelpRequest(text: string): boolean {
  const lower = text.toLowerCase();
  return HELP_TRIGGERS.some((trigger) => lower.includes(trigger));
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function tokenize(text: string): string[] {
  return normalize(text).split(' ').filter(Boolean);
}

function scoreEntry(question: string, entry: KnowledgeEntry): number {
  const normalizedQuestion = normalize(question);
  let score = 0;
  for (const pattern of entry.patterns) {
    const normalizedPattern = normalize(pattern);
    if (normalizedQuestion.includes(normalizedPattern)) {
      score += normalizedPattern.split(' ').length * 2;
    }
  }
  // token overlap bonus
  const questionTokens = new Set(tokenize(question));
  for (const pattern of entry.patterns) {
    for (const token of tokenize(pattern)) {
      if (questionTokens.has(token)) score += 1;
    }
  }
  return score;
}

function getBestAnswer(question: string): string | null {
  let best: KnowledgeEntry | null = null;
  let bestScore = 0;
  for (const entry of KNOWLEDGE_BASE) {
    const score = scoreEntry(question, entry);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  return best && bestScore > 0 ? best.answer : null;
}

function getJoke(): string {
  return PIKO_JOKES[Math.floor(Math.random() * PIKO_JOKES.length)];
}

function getReply(userText: string, onOpenHelp?: () => void): string {
  const lower = userText.toLowerCase();

  if (isHelpRequest(lower)) {
    if (onOpenHelp) {
      window.setTimeout(() => onOpenHelp(), 600);
    }
    return "Oh no, sounds frustrating! I'd suggest heading over to the Help and Report section so the team can look into it. I'm opening that for you now.";
  }

  if (lower.includes('joke') || lower.includes('funny') || lower.includes('make me laugh')) {
    return getJoke();
  }

  const answer = getBestAnswer(userText);
  if (answer) return answer;

  // Greeting fallback
  if (/\b(hi|hello|hey|yo|sup|howdy)\b/.test(lower)) {
    return "Hey! I'm PIKO. I can tell you about SCHOLARLY's features — Exam Explorer, Study Timer, Mistake Notebook, To-Do List, Weekly Planner, Vibe Station, Community Chat, or Rewards. What would you like to know?";
  }

  return "Hmm, I'm not sure I caught that. I can help with SCHOLARLY's features — Exam Explorer (GRE & SAT), Study Timer, Mistake Notebook, To-Do List, Weekly Planner, Vibe Station, Community Chat, or Rewards. Try asking about one of those!";
}

export function PikoAssistant({ onOpenHelp }: PikoAssistantProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<PikoMessage[]>([
    { id: 0, from: 'piko', text: PIKO_GREETINGS[Math.floor(Math.random() * PIKO_GREETINGS.length)] },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageId = useRef(1);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  function send(): void {
    const text = input.trim();
    if (!text) return;
    const userMessage: PikoMessage = { id: messageId.current++, from: 'user', text };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setTyping(true);
    window.setTimeout(() => {
      const reply = getReply(text, onOpenHelp);
      setMessages((current) => [...current, { id: messageId.current++, from: 'piko', text: reply }]);
      setTyping(false);
    }, 700 + Math.random() * 500);
  }

  return (
    <>
      {/* Floating PIKO button */}
      <button
        onClick={() => setOpen((current) => !current)}
        className="fixed bottom-5 right-5 z-40 group"
        aria-label={open ? 'Close PIKO chat' : 'Open PIKO chat'}
      >
        {/* PIKO letters flying above */}
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 flex gap-0.5 font-display text-[10px] text-neon-cyan neon-text-cyan animate-piko-letters pointer-events-none">
          <span className="animate-piko-letter-1">P</span>
          <span className="animate-piko-letter-2">I</span>
          <span className="animate-piko-letter-3">K</span>
          <span className="animate-piko-letter-4">O</span>
        </span>
        {/* Circular container with mascot */}
        <span className="block w-16 h-16 rounded-full border-2 border-neon-cyan/60 bg-midnight-900/80 shadow-glow-cyan flex items-center justify-center animate-piko-float group-hover:scale-110 group-hover:border-neon-cyan transition-all duration-200">
          <PikoPixel />
        </span>
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neon-pink border-2 border-midnight-950 animate-pulse" />
        )}
      </button>

      {/* Chatbox */}
      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[min(92vw,360px)] animate-rise-in">
          <div className="panel-glow pixel-border rounded-lg flex flex-col max-h-[60vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b-2 border-lavender-500/40 bg-midnight-900/90">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full border border-neon-cyan/50 bg-midnight-950 flex items-center justify-center">
                  <PikoPixel size={18} />
                </span>
                <div>
                  <p className="font-display text-[10px] text-lavender-100 tracking-wider">PIKO</p>
                  <p className="text-[10px] text-neon-cyan font-body flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan inline-block" /> Online
                  </p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-lavender-300 hover:text-neon-pink transition-colors p-1" aria-label="Close chat">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="piko-scroll flex-1 overflow-y-scroll px-3 py-3 space-y-2.5 bg-midnight-950/60 h-72">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 text-sm font-body rounded-lg ${
                      msg.from === 'user'
                        ? 'bg-lavender-600/40 text-lavender-100 border border-lavender-500/40'
                        : 'bg-midnight-900/90 text-lavender-100 border border-neon-cyan/30'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="px-3 py-2.5 text-sm font-body rounded-lg bg-midnight-900/90 border border-neon-cyan/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '120ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '240ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick suggestions */}
            {messages.length <= 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {['What is Vibe Station?', 'Tell me a joke', 'How do I plan my week?'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => { setInput(suggestion); }}
                    className="text-[11px] font-body px-2 py-1 rounded-full border border-lavender-500/40 text-lavender-300 hover:border-neon-cyan hover:text-neon-cyan transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-t-2 border-lavender-500/40 bg-midnight-900/90">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && send()}
                placeholder="Ask PIKO anything..."
                className="flex-1 bg-midnight-950 border border-lavender-500/50 px-3 py-2 text-sm text-lavender-100 placeholder:text-lavender-300/40 focus:outline-none focus:border-neon-cyan font-body"
                aria-label="Message PIKO"
              />
              <button
                onClick={send}
                className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/40 transition-colors"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Compact PIKO pixel robot variant for the circular container. */
function PikoPixel({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" className="pixelated" aria-label="PIKO the study robot">
      <rect x="3" y="3" width="10" height="9" fill="#5cf2ff" />
      <rect x="2" y="4" width="1" height="7" fill="#3dd6e8" />
      <rect x="13" y="4" width="1" height="7" fill="#3dd6e8" />
      <rect x="3" y="12" width="10" height="1" fill="#1aa8bd" />
      <rect x="4" y="5" width="8" height="5" fill="#e8fbff" />
      <rect x="3" y="2" width="2" height="1" fill="#2bc4d8" />
      <rect x="11" y="2" width="2" height="1" fill="#2bc4d8" />
      <rect x="7" y="1" width="2" height="2" fill="#ffe45c" />
      <rect x="5" y="6" width="2" height="2" fill="#05031a" />
      <rect x="9" y="6" width="2" height="2" fill="#05031a" />
      <rect x="6" y="7" width="1" height="1" fill="#ffe45c" />
      <rect x="10" y="7" width="1" height="1" fill="#ffe45c" />
      <rect x="4" y="8" width="1" height="1" fill="#ff6ad5" opacity="0.7" />
      <rect x="11" y="8" width="1" height="1" fill="#ff6ad5" opacity="0.7" />
      <rect x="7" y="8" width="2" height="1" fill="#05031a" />
      <rect x="4" y="13" width="2" height="1" fill="#1aa8bd" />
      <rect x="10" y="13" width="2" height="1" fill="#1aa8bd" />
    </svg>
  );
}
