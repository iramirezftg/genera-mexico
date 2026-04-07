"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "¿Cómo se calcula mi ahorro?",
    a: "Analizamos tu historial de consumo directamente en tu recibo de CFE. Con base en eso, diseñamos un sistema de paneles solares que cubra exactamente esa demanda, reduciendo tu pago hasta en un 98%."
  },
  {
    q: "¿Cómo es el proceso?",
    a: "Comenzamos con un diagnóstico y diseño a medida. Luego, nuestro equipo certificado realiza la instalación en pocos días. Finalmente, nosotros nos encargamos de todos los trámites con CFE para tu medidor bidireccional."
  },
  {
    q: "¿Cómo es el financiamiento?",
    a: "Puedes pagar tu sistema hasta en 12 meses con tarjeta de crédito, instalando de inmediato y distribuyendo la inversión en mensualidades. Una opción práctica para comenzar a ahorrar desde el primer mes."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(2); // El 3ro abierto por defecto como en la imagen

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-brand-green font-bold tracking-wider uppercase text-sm mb-2">Preguntas Frecuentes</p>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark">Aclara tus dudas antes de instalar</h2>
          </motion.div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="border-b border-gray-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
                >
                  <span className="text-lg font-bold text-brand-dark group-hover:text-brand-green transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`text-gray-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-brand-green" : ""
                    }`}
                    size={24}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-gray-500 leading-relaxed pr-12">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
