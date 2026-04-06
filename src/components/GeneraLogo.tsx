/**
 * GeneraLogo — SVG inline del logo oficial.
 * Soporta modo "dark" (sobre fondos oscuros) y "light" (sobre fondos blancos).
 */
export default function GeneraLogo({
  dark = false,
  className = '',
}: {
  dark?: boolean;
  className?: string;
}) {
  const textColor  = dark ? '#FFFFFF' : '#082336';
  const subColor   = dark ? 'rgba(255,255,255,0.7)' : '#4A5568';
  const accentColor = dark ? '#FFB800' : '#1E4620';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 260 80"
      className={className}
      aria-label="Genera — energía consciente"
      role="img"
    >
      <title>Genera — energía consciente</title>

      {/* ── Ícono G + enchufe ─────────────────────────── */}
      <g transform="translate(40,40)">
        {/* Anillo G (outer r=34, inner r=21, gap ±30° derecha) */}
        <path
          d="M 29.4,17 A 34,34 0 1,0 29.4,-17 L 18.2,-10.5 A 21,21 0 1,1 18.2,10.5 Z"
          fill="#FFB800"
        />
        {/* Crossbar del G */}
        <rect x="18" y="-5.5" width="17" height="11" fill="#FFB800" rx="1" />

        {/* Enchufe blanco */}
        <rect x="-8"   y="-20" width="5"  height="12" fill="white" rx="2.5" />
        <rect x="3"    y="-20" width="5"  height="12" fill="white" rx="2.5" />
        <rect x="-12"  y="-8"  width="24" height="16" fill="white" rx="5"   />
        <rect x="-3"   y="8"   width="6"  height="9"  fill="white" rx="3"   />
      </g>

      {/* ── "genera" ───────────────────────────────────── */}
      <text
        x="90" y="48"
        fontFamily="'Plus Jakarta Sans', Inter, -apple-system, sans-serif"
        fontSize="34"
        fontWeight="800"
        fill={textColor}
        letterSpacing="-0.8"
      >
        genera
      </text>

      {/* ── "energía consciente" ───────────────────────── */}
      <text
        x="91" y="64"
        fontFamily="'Plus Jakarta Sans', Inter, -apple-system, sans-serif"
        fontSize="11.5"
        fontWeight="400"
        fill={subColor}
        letterSpacing="0.15"
      >
        energía{' '}
        <tspan fontWeight="700" fill={accentColor}>consciente</tspan>
      </text>
    </svg>
  );
}
