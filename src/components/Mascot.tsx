interface MascotProps {
  size?: number;
  mood?: 'happy' | 'study' | 'sleep' | 'celebrate' | 'wave';
  className?: string;
}

export function Mascot({ size = 96, mood = 'happy', className = '' }: MascotProps) {
  const eye = mood === 'sleep' ? 'closed' : mood === 'celebrate' ? 'happy' : 'normal';
  const mouth =
    mood === 'happy' || mood === 'wave' ? 'smile' : mood === 'sleep' ? 'zzz' : mood === 'celebrate' ? 'open' : 'focus';
  const accent = mood === 'celebrate' ? '#ffe45c' : '#5cf2ff';
  const blink = mood === 'study';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={`pixelated ${className}`}
      aria-label="Pixel the study robot mascot"
    >
      <rect x="3" y="3" width="10" height="9" fill="#c2a3ff" />
      <rect x="2" y="4" width="1" height="7" fill="#ad88ff" />
      <rect x="13" y="4" width="1" height="7" fill="#ad88ff" />
      <rect x="3" y="12" width="10" height="1" fill="#7852f5" />
      <rect x="4" y="5" width="8" height="5" fill="#f5f0ff" />
      <rect x="3" y="2" width="2" height="1" fill="#936bff" />
      <rect x="11" y="2" width="2" height="1" fill="#936bff" />
      <rect x="7" y="1" width="2" height="2" fill={accent} />
      {eye === 'closed' ? (
        <>
          <rect x="5" y="7" width="2" height="1" fill="#05031a" />
          <rect x="9" y="7" width="2" height="1" fill="#05031a" />
        </>
      ) : eye === 'happy' ? (
        <>
          <rect x="5" y="6" width="2" height="1" fill="#05031a" />
          <rect x="9" y="6" width="2" height="1" fill="#05031a" />
        </>
      ) : (
        <>
          <rect x="5" y="6" width="2" height="2" fill="#05031a" />
          <rect x="9" y="6" width="2" height="2" fill="#05031a" />
          <rect x="6" y="7" width="1" height="1" fill={accent} />
          <rect x="10" y="7" width="1" height="1" fill={accent} />
        </>
      )}
      <rect x="4" y="8" width="1" height="1" fill="#ff6ad5" opacity="0.7" />
      <rect x="11" y="8" width="1" height="1" fill="#ff6ad5" opacity="0.7" />
      {mouth === 'smile' && <rect x="7" y="8" width="2" height="1" fill="#05031a" />}
      {mouth === 'open' && <rect x="7" y="8" width="2" height="2" fill="#05031a" />}
      {mouth === 'focus' && <rect x="6" y="9" width="4" height="1" fill="#05031a" />}
      {mouth === 'zzz' && <rect x="7" y="9" width="2" height="1" fill="#5cf2ff" />}
      <rect x="4" y="13" width="2" height="1" fill="#7852f5" />
      <rect x="10" y="13" width="2" height="1" fill="#7852f5" />
      {blink && <rect x="7" y="0" width="2" height="1" fill="#ffe45c" className="animate-blink" />}
    </svg>
  );
}
