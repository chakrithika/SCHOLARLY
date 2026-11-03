import { ReactNode } from 'react';

interface PixelPanelProps {
  title?: string;
  accent?: 'lavender' | 'pink' | 'cyan' | 'lime';
  children: ReactNode;
  className?: string;
  right?: ReactNode;
}

const accentMap = {
  lavender: 'border-lavender-500/50',
  pink: 'border-neon-pink/60',
  cyan: 'border-neon-cyan/60',
  lime: 'border-neon-lime/60',
};

const titleAccent = {
  lavender: 'text-lavender-200',
  pink: 'text-neon-pink neon-text-pink',
  cyan: 'text-neon-cyan neon-text-cyan',
  lime: 'text-neon-lime',
};

export function PixelPanel({ title, accent = 'lavender', children, className = '', right }: PixelPanelProps) {
  return (
    <section
      className={`bg-midnight-900/70 backdrop-blur-sm border-2 ${accentMap[accent]} rounded-lg p-4 ${className}`}
    >
      {title && (
        <header className="flex items-center justify-between mb-3 pb-2 border-b-2 border-lavender-500/20">
          <h2 className={`font-display text-xs uppercase tracking-wider ${titleAccent[accent]}`}>{title}</h2>
          {right}
        </header>
      )}
      {children}
    </section>
  );
}
