"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Zap, Cpu, Battery } from 'lucide-react';

/* ─── Datos por categoría ──────────────────────────────── */
const categories = [
  {
    icon: Sun,
    label: 'Paneles Solares',
    color: '#FFB800',
    brands: ['Jinko Solar', 'LONGi', 'Canadian Solar', 'JA Solar'],
  },
  {
    icon: Zap,
    label: 'Inversores',
    color: '#1E4620',
    brands: ['Fronius', 'Solis', 'Growatt'],
  },
  {
    icon: Cpu,
    label: 'Microinversores',
    color: '#3B82F6',
    brands: ['Enphase', 'Hoymiles'],
  },
  {
    icon: Battery,
    label: 'Sistemas Híbridos & BESS',
    color: '#8B5CF6',
    brands: ['Sistema Híbrido', 'Sistema BESS'],
  },
];

/* Aplanamos todas las marcas en un único ticker con su categoría */
const allItems = categories.flatMap((cat) =>
  cat.brands.map((brand) => ({ brand, label: cat.label, color: cat.color, Icon: cat.icon }))
);

/* Duplicamos para loop infinito */
const ticker = [...allItems, ...allItems, ...allItems];

/* ─── Componente ────────────────────────────────────────── */
export default function LogoCarousel() {
  return (
    <section className="py-12 bg-white border-b border-gray-100 overflow-hidden">

      {/* Encabezado */}
      <div className="max-w-5xl mx-auto px-4 mb-10 text-center">
        <p className="text-[11px] font-bold tracking-[0.25em] text-gray-400 uppercase mb-3">
          Tecnología Tier‑1 de Clase Mundial
        </p>
        <h3 className="text-xl md:text-2xl font-bold text-brand-dark">
          Solo trabajamos con las mejores marcas del mercado solar
        </h3>
      </div>

      {/* Categorías en tarjetas — visibles en desktop */}
      <div className="hidden md:grid grid-cols-4 gap-4 max-w-5xl mx-auto px-4 mb-10">
        {categories.map(({ icon: Icon, label, color, brands }) => (
          <div
            key={label}
            className="rounded-2xl border border-gray-100 bg-gray-50 p-5 hover:shadow-md transition-shadow"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center mb-3"
              style={{ background: `${color}18` }}
            >
              <Icon size={18} style={{ color }} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color }}>
              {label}
            </p>
            <ul className="space-y-1">
              {brands.map((b) => (
                <li key={b} className="text-sm font-semibold text-gray-700">{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Ticker infinito */}
      <div className="relative w-full flex overflow-hidden">
        <motion.div
          className="flex gap-10 md:gap-16 whitespace-nowrap items-center px-6"
          animate={{ x: ['0%', '-33.33%'] }}
          transition={{ ease: 'linear', duration: 40, repeat: Infinity }}
        >
          {ticker.map(({ brand, label, color, Icon }, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 flex-none group cursor-default"
            >
              {/* Ícono de categoría */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-none"
                style={{ background: `${color}18` }}
              >
                <Icon size={14} style={{ color }} />
              </div>

              {/* Texto */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest leading-none mb-0.5 opacity-50" style={{ color }}>
                  {label}
                </p>
                <p className="text-base md:text-lg font-black text-gray-700 tracking-tight group-hover:text-brand-green transition-colors">
                  {brand}
                </p>
              </div>

              {/* Separador */}
              <span className="ml-6 h-5 w-px bg-gray-200 flex-none" />
            </div>
          ))}
        </motion.div>

        {/* Fade laterales */}
        <div className="absolute top-0 left-0 w-24 md:w-40 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-24 md:w-40 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      </div>

    </section>
  );
}
