interface ProgressProps {
  value: number; // 0..100
  height?: number;
  accent?: 'lavender' | 'pink' | 'cyan' | 'lime';
  label?: string;
  showValue?: boolean;
}

const barAccent = {
  lavender: 'bg-lavender-400',
  pink: 'bg-neon-pink',
  cyan: 'bg-neon-cyan',
  lime: 'bg-neon-lime',
};

const barGlow = {
  lavender: 'shadow-glow',
  pink: 'shadow-glow-pink',
  cyan: 'shadow-glow-cyan',
  lime: '',
};

export function ProgressBar({ value, height = 14, accent = 'lavender', label, showValue }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between mb-1 text-xs font-pixel text-lavender-200">
          <span>{label}</span>
          {showValue && <span className="text-lavender-100">{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className="w-full bg-midnight-950 border-2 border-lavender-500/40 overflow-hidden relative"
        style={{ height }}
      >
        <div
          className={`h-full ${barAccent[accent]} ${barGlow[accent]} transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
