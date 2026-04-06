"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const photos = Array.from({ length: 18 }, (_, i) => ({
  src: `/gallery-${i + 1}.jpg`,
  alt: `Instalación fotovoltaica Genera México — Proyecto ${i + 1}`,
}));

// Duplicamos para cinta infinita sin saltos
const row1 = [...photos.slice(0, 9), ...photos.slice(0, 9)];
const row2 = [...photos.slice(9, 18), ...photos.slice(9, 18)];

/* ─── Fila de ticker ─────────────────────────────── */
function TickerRow({
  items,
  direction = 'left',
  speed = 35,
  onOpen,
}: {
  items: typeof row1;
  direction?: 'left' | 'right';
  speed?: number;
  onOpen: (src: string) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const step = (timestamp: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const dt = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (!paused) {
        const delta = (speed / 1000) * dt;
        posRef.current = direction === 'left'
          ? posRef.current - delta
          : posRef.current + delta;

        // Detectar mitad del track (ancho de 1 copia)
        const halfWidth = track.scrollWidth / 2;
        if (direction === 'left' && posRef.current <= -halfWidth) posRef.current += halfWidth;
        if (direction === 'right' && posRef.current >= 0) posRef.current -= halfWidth;
      }

      track.style.transform = `translateX(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused, direction, speed]);

  return (
    <div
      className="overflow-hidden w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={trackRef} className="flex gap-5 will-change-transform" style={{ width: 'max-content' }}>
        {items.map((photo, idx) => (
          <div
            key={idx}
            className="relative flex-none w-[280px] h-[200px] md:w-[340px] md:h-[240px] rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-shadow border border-gray-100"
            onClick={() => onOpen(photo.src)}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 select-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1509391366360-1e97f52cefd9?auto=format&fit=crop&q=80&w=800';
              }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Watermark */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20 mix-blend-overlay overflow-hidden">
              <span className="text-white font-black text-lg tracking-[0.2em] uppercase select-none -rotate-[30deg]">
                GENERA MÉXICO
              </span>
            </div>
            {/* Expand icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full bg-brand-green/90 text-white flex items-center justify-center backdrop-blur-md translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                <Maximize2 size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Componente principal ───────────────────────── */
export default function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  /* Lightbox: teclado + scroll lock */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      const idx = photos.findIndex(p => p.src === selectedPhoto);
      if (e.key === 'ArrowRight') setSelectedPhoto(photos[(idx + 1) % photos.length].src);
      if (e.key === 'ArrowLeft') setSelectedPhoto(photos[(idx - 1 + photos.length) % photos.length].src);
      if (e.key === 'Escape') setSelectedPhoto(null);
    };
    document.body.style.overflow = selectedPhoto ? 'hidden' : 'unset';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPhoto]);

  const navigate = (dir: 1 | -1, e: React.MouseEvent) => {
    e.stopPropagation();
    const idx = photos.findIndex(p => p.src === selectedPhoto);
    setSelectedPhoto(photos[(idx + dir + photos.length) % photos.length].src);
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-14 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h4 className="text-[11px] font-bold tracking-[0.2em] text-brand-green uppercase mb-4">
            Ingeniería Mexicana
          </h4>
          <h2 className="text-4xl font-bold text-brand-dark mb-4">Nuestras Instalaciones</h2>
          <p className="text-gray-500 text-[15px] max-w-2xl mx-auto">
            Cada proyecto ejecutado con estándares de calidad industrial — máxima captación solar y estética impecable.
          </p>
        </motion.div>
      </div>

      {/* Fila 1: izquierda → */}
      <div className="mb-5">
        <TickerRow items={row1} direction="left" speed={38} onOpen={setSelectedPhoto} />
      </div>

      {/* Fila 2: derecha ← (sentido opuesto) */}
      <TickerRow items={row2} direction="right" speed={30} onOpen={setSelectedPhoto} />

      {/* CTA contador */}
      <div className="max-w-6xl mx-auto px-4 mt-12 flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 bg-brand-green/5 border border-brand-green/20 rounded-full px-6 py-3"
        >
          <span className="text-2xl font-black text-brand-green">18+</span>
          <span className="text-gray-600 text-sm font-medium">proyectos documentados — haz clic para ver en detalle</span>
        </motion.div>
      </div>

      {/* ─── Lightbox ─── */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 md:p-10 backdrop-blur-sm"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Cerrar */}
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 z-[110] transition-colors"
              onClick={(e) => { e.stopPropagation(); setSelectedPhoto(null); }}
            >
              <X size={26} />
            </button>

            {/* Prev */}
            <button
              className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 z-[110] transition-colors"
              onClick={(e) => navigate(-1, e)}
            >
              <ChevronLeft size={30} />
            </button>

            {/* Next */}
            <button
              className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 z-[110] transition-colors"
              onClick={(e) => navigate(1, e)}
            >
              <ChevronRight size={30} />
            </button>

            <motion.img
              key={selectedPhoto}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              src={selectedPhoto}
              alt="Instalación ampliada"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl z-[105] select-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1509391366360-1e97f52cefd9?auto=format&fit=crop&q=80&w=1200';
              }}
            />

            {/* Watermark lightbox */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden mix-blend-overlay z-[120]">
              <div className="rotate-[-25deg] opacity-20 select-none text-center">
                <div className="text-white text-[min(14vw,160px)] font-black tracking-widest uppercase leading-none">GENERA</div>
                <div className="text-brand-amber text-[min(14vw,160px)] font-black tracking-widest uppercase leading-none">MÉXICO</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
