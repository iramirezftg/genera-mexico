"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SavingsSimulator() {
  const [recibo, setRecibo] = useState(3200);
  const [metrics, setMetrics] = useState({
    ahorroMensual: 0,
    ahorroAnual: 0,
    paneles: 0,
    costo: 0,
    roi: 0,
    ahorro25: 0
  });

  useEffect(() => {
    // Fórmulas exactas según Excel "Calculadora de Paneles Solares"
    // 1. Convertir pesos a kWh estimado 
    const TARIFA_KWH = 2.5; 
    const kWhBimestral = recibo / TARIFA_KWH;
    const kWhMensual = kWhBimestral / 2;

    // 2. Variables técnicas
    const wPanel = 650;
    const HSP = 5;
    const diasMes = 30;
    const oversizing = 1.3;

    // 3. Cálculos
    const generacionMensualPanel = (wPanel * HSP * diasMes) / 1000;
    const paneles = Math.max(1, Math.ceil((kWhMensual * oversizing) / generacionMensualPanel));
    
    // Costo Premium (basado en $113,500 MXN para 10 paneles)
    const costo = paneles * 11350;
    
    // ROI y métricas de Ahorro
    const ahorroMensual = Math.round(recibo * 0.95);
    const ahorroAnual = ahorroMensual * 12;
    const roi = Math.ceil(costo / (ahorroMensual || 1));
    const ahorro25 = ahorroAnual * 25;

    setMetrics({
      ahorroMensual,
      ahorroAnual,
      paneles,
      costo,
      roi,
      ahorro25
    });
  }, [recibo]);

  return (
    <section id="calculadora" className="py-24 bg-white dark:bg-slate-900 scroll-mt-24 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-slate-800 border-2 border-green-50 dark:border-slate-700 rounded-3xl p-8 md:p-12 shadow-xl shadow-brand-green/5 dark:shadow-none flex flex-col lg:flex-row gap-12 items-center transition-colors duration-500"
        >
          
          {/* Controles del Simulador */}
          <div className="w-full lg:w-5/12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark dark:text-white mb-4">Calcula tu ahorro en segundos</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Ajusta tu recibo mensual y descubre el impacto real en tu economía.</p>
            
            <div className="bg-brand-green/5 dark:bg-brand-green/10 rounded-2xl p-6 border border-brand-green/10 dark:border-brand-green/20">
              <div className="flex justify-between items-center mb-6">
                <label className="text-sm font-bold tracking-widest text-brand-green uppercase">Tu Recibo Mensual</label>
                <div className="bg-white dark:bg-slate-700 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 font-bold text-gray-800 dark:text-white transition-colors">
                  <span className="text-gray-400 dark:text-gray-300 mr-1">$</span>
                  <input 
                    type="number" 
                    value={recibo}
                    onChange={(e) => setRecibo(Number(e.target.value))}
                    className="w-20 outline-none bg-transparent"
                    min="500"
                    step="100"
                  />
                </div>
              </div>
              
              <input 
                type="range" 
                min="500" max="25000" step="100"
                value={recibo}
                onChange={(e) => setRecibo(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-green"
              />
            </div>
          </div>

          {/* Resultados */}
          <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard index={0} title="AHORRO MENSUAL" value={`$${metrics.ahorroMensual.toLocaleString()}`} />
            <ResultCard index={1} title="AHORRO ANUAL" value={`$${metrics.ahorroAnual.toLocaleString()}`} />
            <ResultCard index={2} title="COSTO ESTIMADO" value={`$${metrics.costo.toLocaleString()}`} />
            <ResultCard index={3} title="ROI (MESES)" value={metrics.roi.toString()} />
            <ResultCard index={4} title="PANELES (650W)" value={metrics.paneles.toString()} />
            <ResultCard index={5} title="AHORRO 25 AÑOS" value={`$${metrics.ahorro25.toLocaleString()}`} />
          </div>

        </motion.div>
      </div>
    </section>
  );
}

function ResultCard({ title, value, index }: { title: string, value: string, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.1 }}
      className="border border-green-100 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-slate-700/50 shadow-sm hover:shadow-lg hover:border-brand-green/30 dark:hover:border-brand-green/50 transition-all duration-300"
    >
      <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">{title}</h4>
      <p className="text-2xl font-bold text-brand-green">{value}</p>
    </motion.div>
  );
}
