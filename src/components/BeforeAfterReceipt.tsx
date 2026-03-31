"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle } from 'lucide-react';

export default function BeforeAfterReceipt() {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-amber font-bold tracking-widest uppercase mb-4"
          >
            La prueba definitiva
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-brand-dark mb-6"
          >
            Del estrés a la tranquilidad total
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Nuestros sistemas de alto rendimiento están diseñados para eliminar la tarifa DAC y reducir tu pago a CFE hasta en un 99%. <br className="hidden md:block"/> <strong className="text-brand-green">Ideal para consumos mayores a $2,500 MXN bimestrales.</strong>
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 relative max-w-4xl mx-auto">
          {/* Símbolo "VS" (Center badge) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 bg-white rounded-full shadow-2xl border-4 border-slate-50 items-center justify-center">
            <span className="text-xl font-black text-gray-300">VS</span>
          </div>

          {/* Tarjeta 1: Recibo de Dolor (Antes) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 bg-white rounded-[32px] p-8 md:p-12 shadow-xl border-t-8 border-red-500 relative"
          >
            <div className="absolute top-6 right-6 bg-red-100 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
              <XCircle size={14} /> ANTES
            </div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2 mt-4">Recibo Actual CFE</p>
            <h3 className="text-5xl font-black text-brand-dark mb-8 tracking-tight">$7,500 <span className="text-2xl text-gray-300 font-normal">MXN</span></h3>
            
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start gap-3 border-b border-gray-100 pb-4">
                <span className="w-2 h-2 rounded-full bg-red-400 mt-2 block shrink-0" />
                <p>Tarifa DAC (Alto Consumo) incontrolable.</p>
              </li>
              <li className="flex items-start gap-3 border-b border-gray-100 pb-4">
                <span className="w-2 h-2 rounded-full bg-red-400 mt-2 block shrink-0" />
                <p>Aumentos anuales a merced de la inflación.</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-400 mt-2 block shrink-0" />
                <p>Estrés y frustración bimestral.</p>
              </li>
            </ul>
          </motion.div>

          {/* Tarjeta 2: Recibo de Alivio (Después con Genera) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-full md:w-1/2 bg-gradient-to-br from-brand-green to-[#133115] rounded-[32px] p-8 md:p-12 shadow-2xl shadow-brand-green/20 relative transform md:scale-105 z-10 border border-brand-green/50"
          >
            <div className="absolute top-6 right-6 bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md">
              <CheckCircle size={14} /> CON GENERA
            </div>
            <p className="text-brand-amber/90 text-sm font-bold uppercase tracking-widest mb-2 mt-4">Nuevo Recibo Solar</p>
            <h3 className="text-5xl font-black text-white mb-8 tracking-tight">$52 <span className="text-2xl text-white/50 font-normal">MXN</span></h3>
            
            <ul className="space-y-4 text-white/90">
              <li className="flex items-start gap-3 border-b border-white/10 pb-4">
                <span className="w-2 h-2 rounded-full bg-brand-amber mt-2 block shrink-0" />
                <p>Solo pagas el cargo base mínimo de CFE.</p>
              </li>
              <li className="flex items-start gap-3 border-b border-white/10 pb-4">
                <span className="w-2 h-2 rounded-full bg-brand-amber mt-2 block shrink-0" />
                <p>Retorno de inversión promedio de 3 años.</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-amber mt-2 block shrink-0" />
                <p>Independencia energética por +25 años.</p>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
