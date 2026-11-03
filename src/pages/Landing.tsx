import { FormEvent, useState } from 'react';
import { LockKeyhole, Mail, UserRound, LoaderCircle, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Mascot } from '@/components/Mascot';
import { Modal } from '@/components/Modal';
import { useAuth } from '@/lib/auth';
import { pickAvatarColor } from '@/lib/focus';

interface LandingProps {
  onEnterApp: () => void;
}

type AuthMode = 'login' | 'signup';

export function Landing({ onEnterApp }: LandingProps) {
  const { profile, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode | null>(null);

  return (
    <main className="landing-screen relative min-h-screen overflow-hidden flex items-center justify-center px-5 py-10">
      <div className="landing-stars" aria-hidden="true" />
      <div className="landing-orbit landing-orbit-one" aria-hidden="true" />
      <div className="landing-orbit landing-orbit-two" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center">
        <h1 className="landing-logo font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-lavender-100 tracking-[0.12em]">
          SCHOLARLY
        </h1>
        <p className="landing-tagline mt-6 font-body text-base sm:text-lg md:text-xl font-semibold text-lavender-50">
          Make exam prep feel a little less like a boss fight. <span className="text-neon-yellow">✦</span>
        </p>

        <div className="relative mt-8 sm:mt-10">
          <div className="landing-mascot-glow" aria-hidden="true" />
          <Mascot size={190} mood="happy" className="landing-mascot" />
          <span className="landing-spark landing-spark-one" aria-hidden="true">✦</span>
          <span className="landing-spark landing-spark-two" aria-hidden="true">·</span>
        </div>

        <div className="landing-callout mt-7 px-5 py-3 text-sm sm:text-base font-body font-semibold text-lavender-100">
          Ready to lock in? Your next study win starts here. <span className="text-neon-pink">●</span>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button type="button" className="landing-login-button" onClick={() => setMode('login')}>
            LOGIN
          </button>
          <button type="button" className="landing-signup-button" onClick={() => setMode('signup')}>
            SIGN UP
          </button>
        </div>

        {profile && (
          <button type="button" onClick={onEnterApp} className="mt-5 font-body text-sm text-neon-cyan hover:underline">
            Continue as {profile.display_name}
          </button>
        )}
      </div>

      <div className="fixed right-5 bottom-5 hidden sm:block opacity-80" aria-hidden="true">
        <div className="landing-mini-orb"><Mascot size={62} mood="happy" /></div>
      </div>

      {mode && (
        <AuthModal
          mode={mode}
          onClose={() => setMode(null)}
          onSuccess={onEnterApp}
          signIn={signIn}
          signUp={signUp}
        />
      )}
    </main>
  );
}

function AuthModal({
  mode,
  onClose,
  onSuccess,
  signIn,
  signUp,
}: {
  mode: AuthMode;
  onClose: () => void;
  onSuccess: () => void;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string, color: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const result = mode === 'login'
      ? await signIn(email, password)
      : await signUp(name, email, password, pickAvatarColor(email));
    setBusy(false);
    if (!result.ok) {
      setError(result.error || 'Unable to continue.');
      return;
    }
    onClose();
    onSuccess();
  }

  return (
    <Modal open onClose={onClose} title={mode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}>
      <form onSubmit={submit} className="space-y-3">
        {mode === 'signup' && (
          <Field icon={<UserRound size={14} />} label="Your name">
            <input className="input-pixel" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoFocus />
          </Field>
        )}
        <Field icon={<Mail size={14} />} label="Email">
          <input className="input-pixel" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoFocus={mode === 'login'} />
        </Field>
        <Field icon={<LockKeyhole size={14} />} label="Password">
          <div className="relative">
            <input className="input-pixel pr-10" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-2 top-1/2 -translate-y-1/2 text-lavender-300 hover:text-neon-cyan" aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>
        {error && <p className="text-sm text-neon-pink font-body border-l-2 border-neon-pink pl-2">{error}</p>}
        <button type="submit" disabled={busy} className="btn-pixel-pink w-full mt-2 disabled:opacity-60">
          {busy ? <LoaderCircle size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {busy ? 'Connecting...' : mode === 'login' ? 'Login' : 'Create account'}
        </button>
        <p className="text-center text-xs text-lavender-300/70 font-body pt-1">
          Your study data is saved securely to your account.
        </p>
      </form>
    </Modal>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-xs font-body font-semibold text-lavender-200 mb-1">
        <span className="text-neon-cyan">{icon}</span>{label}
      </span>
      {children}
    </label>
  );
}
