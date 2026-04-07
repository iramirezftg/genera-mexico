"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Leaf } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevents hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-[160px] h-10" />; // skeleton placeholder

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative flex items-center h-10 w-[170px] rounded-full px-1 shadow-inner transition-colors duration-500 overflow-hidden ${
        isDark ? "bg-slate-800 border border-brand-green/30" : "bg-gray-100 border border-gray-200"
      }`}
      aria-label="Ahorro Energético"
    >
      <motion.div
        className={`absolute w-[18px] h-full top-0 left-0 bg-brand-green/10 ${isDark ? 'opacity-100' : 'opacity-0'}`}
        initial={false}
        animate={{ width: isDark ? "100%" : "0%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <div className="flex w-full items-center justify-between z-10 px-1 relative">
        <span className={`text-[11px] font-bold tracking-widest uppercase transition-colors duration-500 ${isDark ? "text-brand-green" : "text-gray-500"}`}>
          {isDark ? "Ahorrando" : "Sin Ahorro"}
        </span>
      </div>

      <motion.div
        className={`absolute flex items-center justify-center w-8 h-8 rounded-full shadow-md z-20 ${
          isDark ? "bg-brand-green text-white" : "bg-white text-brand-amber"
        }`}
        initial={false}
        animate={{ x: isDark ? 124 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {isDark ? <Leaf size={14} /> : <Sun size={14} />}
      </motion.div>
    </button>
  );
}
