"use client";

import React from 'react';
import { motion } from 'framer-motion';

const authorityBrands = [
  "CANADIAN SOLAR",
  "JINKO SOLAR",
  "SUNPOWER",
  "HUAWEI",
  "ENPHASE",
  "GROWATT",
  "CERTIFICACIÓN FIDE",
  "AVALADO POR ANES",
  "TRÁMITES CFE"
];

// Duplicamos el arreglo varias veces para asegurar un loop infinito limpio sin importar el ancho de pantalla
const scrollingBrands = [...authorityBrands, ...authorityBrands, ...authorityBrands, ...authorityBrands];

export default function LogoCarousel() {
  return (
    <section className="py-10 bg-white border-b border-gray-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <p className="text-center text-xs md:text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">
          Tecnología Tier-1 y certificaciones de clase mundial
        </p>
      </div>
      
      <div className="relative w-full flex overflow-hidden group">
        <motion.div 
          className="flex gap-16 md:gap-24 whitespace-nowrap items-center px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 35, repeat: Infinity }}
        >
          {scrollingBrands.map((brand, index) => (
            <div 
              key={index} 
              className="text-2xl md:text-3xl font-black text-gray-300/80 tracking-tighter hover:text-brand-green transition-colors cursor-default"
            >
              {brand}
            </div>
          ))}
        </motion.div>
        
        {/* Degradados a los lados para efecto "fade" en las orillas */}
        <div className="absolute top-0 left-0 w-24 md:w-48 h-full bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-24 md:w-48 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
