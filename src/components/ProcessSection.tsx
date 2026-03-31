"use client";

import React from 'react';
import { motion } from 'framer-motion';

const processSteps = [
  {
    num: "01",
    title: "Diagnóstico",
    desc: "Analizamos tu recibo y objetivos para dimensionar la solución."
  },
  {
    num: "02",
    title: "Diseño",
    desc: "Creamos un sistema a medida con simulaciones y retorno estimado."
  },
  {
    num: "03",
    title: "Instalación",
    desc: "Equipo experto instala en tiempo rápido con certificaciones y garantías."
  },
  {
    num: "04",
    title: "Monitoreo",
    desc: "Te damos control total con dashboard y soporte continuo."
  }
];

export default function ProcessSection() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-brand-green font-bold tracking-wider uppercase text-sm mb-2">Proceso Genera</p>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark">De recibo a energía solar en 4 pasos</h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-white border border-gray-100 p-8 rounded-3xl hover:shadow-xl hover:shadow-brand-green/5 transition-all duration-300 relative group"
            >
              <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold text-lg mb-6 group-hover:bg-brand-green group-hover:text-white transition-colors duration-300">
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
