"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Carlos Mendoza",
    type: "Residencial (Monterrey)",
    text: "Mi recibo de CFE pasaba de los $8,000 pesos en verano por los minisplits. Después de instalar con Genera México, este último bimestre pagué solo $120 pesos. Fue la mejor decisión financiera para mi familia.",
    rating: 5,
    delay: 0.1
  },
  {
    name: "Ana Sofía Herrera",
    type: "Comercial (Guadalajara)",
    text: "Como dueña de un restaurante, los refrigeradores nos consumían toda la utilidad. El equipo de Genera instaló todo en 2 días sin afectar la operación. Ahora ese ahorro lo estoy invirtiendo en marketing.",
    rating: 5,
    delay: 0.2
  },
  {
    name: "Eduardo Garza",
    type: "Residencial (Saltillo)",
    text: "Teníamos miedo de que los paneles afearan la fachada, pero el diseño fue súper limpio y estético. Además el trámite con CFE lo hicieron ellos al 100%. Recomiendo ampliamente su servicio premium.",
    rating: 5,
    delay: 0.3
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-brand-dark text-white relative overflow-hidden">
      {/* Elemento decorativo de fondo */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-brand-green rounded-full blur-[120px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-brand-amber rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Casos reales de ahorro sustentable. Únete a los cientos de mexicanos que ya congelaron su tarifa.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: t.delay }}
              className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl backdrop-blur-sm relative"
            >
              <Quote size={40} className="absolute top-6 right-6 text-brand-amber/20" />
              <div className="flex gap-1 mb-6 text-brand-amber">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-200 mb-8 leading-relaxed">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-amber to-brand-green rounded-full flex items-center justify-center text-brand-dark font-bold text-lg">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold">{t.name}</h4>
                  <p className="text-gray-400 text-sm">{t.type}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
