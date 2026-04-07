/**
 * GeneraLogo — usa el SVG oficial del archivo /public/logo-genera.svg.
 * En fondos oscuros (hero) agrega un drop-shadow blanco para legibilidad.
 */
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function GeneraLogo({
  dark,
  className = '',
}: {
  dark?: boolean;
  className?: string;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use explicit prop if provided, otherwise resolve from next-themes
  const isDark = mounted ? (dark !== undefined ? dark : resolvedTheme === 'dark') : (dark || false);

  return (
    <img
      src="/logo-genera.svg"
      alt="Genera — energía consciente"
      style={{
        filter: isDark
          ? 'drop-shadow(0 0 6px rgba(255,255,255,0.55)) drop-shadow(0 1px 3px rgba(255,255,255,0.4))'
          : 'none',
        height: '100%',
        width: 'auto',
        display: 'block',
      }}
    />
  );
}
