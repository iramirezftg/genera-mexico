/**
 * GeneraLogo — usa el SVG oficial del archivo /public/logo-genera.svg.
 * En fondos oscuros (hero) agrega un drop-shadow blanco para legibilidad.
 */
export default function GeneraLogo({
  dark = false,
  className = '',
}: {
  dark?: boolean;
  className?: string;
}) {
  return (
    <img
      src="/logo-genera.svg"
      alt="Genera — energía consciente"
      className={className}
      style={{
        filter: dark
          ? 'drop-shadow(0 0 6px rgba(255,255,255,0.55)) drop-shadow(0 1px 3px rgba(255,255,255,0.4))'
          : 'none',
        objectFit: 'contain',
        objectPosition: 'left',
        height: '100%',
        width: '100%',
      }}
    />
  );
}
