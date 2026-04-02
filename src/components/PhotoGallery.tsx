"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

const photos = Array.from({ length: 17 }, (_, i) => ({
  src: `/gallery-${i + 1}.jpg`,
  alt: `Fotos de instalación fotovoltaica Genera México - Proyecto ${i + 1}`,
}));

export default function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Lógica de navegación y bloqueo de scroll
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      
      const currentIdx = photos.findIndex(p => p.src === selectedPhoto);
      if (e.key === 'ArrowRight') {
        const nextIdx = (currentIdx + 1) % photos.length;
        setSelectedPhoto(photos[nextIdx].src);
      } else if (e.key === 'ArrowLeft') {
        const prevIdx = (currentIdx - 1 + photos.length) % photos.length;
        setSelectedPhoto(photos[prevIdx].src);
      } else if (e.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };

    if (selectedPhoto) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedPhoto]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIdx = photos.findIndex(p => p.src === selectedPhoto);
    const nextIdx = (currentIdx + 1) % photos.length;
    setSelectedPhoto(photos[nextIdx].src);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIdx = photos.findIndex(p => p.src === selectedPhoto);
    const prevIdx = (currentIdx - 1 + photos.length) % photos.length;
    setSelectedPhoto(photos[prevIdx].src);
  };

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h4 className="text-[11px] font-bold tracking-[0.2em] text-brand-green uppercase mb-4">Ingeniería Mexicana</h4>
            <h2 className="text-4xl font-bold text-brand-dark mb-4">Nuestras Instalaciones</h2>
            <p className="text-gray-500 text-[15px] max-w-2xl mx-auto">
              Cada proyecto es ejecutado con estándares de calidad industrial, garantizando la máxima captación solar y estética impecable.
            </p>
          </motion.div>
        </div>

        {/* Horizontal Scroll Gallery (17 items) */}
        <div className="flex overflow-x-auto gap-6 pb-12 pt-4 px-4 -mx-4 snap-x snap-mandatory relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {photos.map((photo, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 100px 0px 0px" }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
              className={`relative flex-none w-[75vw] sm:w-[45vw] md:w-[32vw] lg:w-[24vw] aspect-square rounded-[2rem] overflow-hidden group shadow-xl cursor-pointer snap-center bg-slate-100 hover:shadow-2xl transition-shadow border border-gray-100`}
              onClick={() => setSelectedPhoto(photo.src)}
              onContextMenu={(e) => e.preventDefault()}
            >
              {/* Imagen con zoom al hover */}
              <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-110">
                {/* Fallback component while user uploads images - using div to avoid errors if src is totally broken, but Next/Image handles missing src with standard errors. We will just use standard img tag or next/image */}
                <img 
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover bg-gray-100 select-none"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                  onError={(e) => {
                    // Fallback visual si el usuario aún no renombra las fotos 
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509391366360-1e97f52cefd9?auto=format&fit=crop&q=80&w=1200';
                  }}
                />
              </div>

              {/* Marca de Agua Permanente */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30 mix-blend-overlay z-10 overflow-hidden">
                <span className="text-white font-black text-xl md:text-2xl tracking-[0.2em] uppercase select-none drop-shadow-lg -rotate-[30deg] w-[200%] text-center opacity-80 backdrop-blur-sm">
                  GENERA MÉXICO
                </span>
              </div>

              {/* Overlay decorativo oscuro al hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <div className="w-16 h-16 rounded-full bg-brand-green/90 text-white flex items-center justify-center backdrop-blur-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Maximize2 size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-sm"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              className="absolute top-6 right-6 md:top-10 md:right-10 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2 z-[110]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(null);
              }}
            >
              <X size={28} />
            </button>

            <button
              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-3 z-[110]"
              onClick={handlePrev}
            >
              <ChevronLeft size={32} />
            </button>

            <button
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-3 z-[110]"
              onClick={handleNext}
            >
              <ChevronRight size={32} />
            </button>

            <motion.img
              key={selectedPhoto}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedPhoto}
              alt="Instalación ampliada"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl z-[105] select-none"
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
              onClick={(e) => {
                // Prevenir que se cierre si clickean directamente la foto
                e.stopPropagation();
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509391366360-1e97f52cefd9?auto=format&fit=crop&q=80&w=1200';
              }}
            />

            {/* Marca de Agua Pantalla Completa */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden mix-blend-overlay z-[120]">
              <div className="rotate-[-25deg] opacity-30 flex flex-col items-center justify-center w-full h-full text-center select-none backdrop-blur-sm">
                 <span className="text-white text-[min(12vw,140px)] leading-none font-black tracking-widest uppercase drop-shadow-2xl">GENERA</span>
                 <span className="text-white text-[min(12vw,140px)] leading-none font-black tracking-widest uppercase drop-shadow-2xl text-brand-amber">MÉXICO</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
