"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle } from 'lucide-react';

export default function QuoteForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    propertyType: 'Residencial',
    zipCode: '',
    consumption: 3200,
    file: null as File | null,
  });

  const [metrics, setMetrics] = useState({
    ahorroMensual: 0,
    costo: 0,
    roi: 0,
    paneles: 0,
    ahorro25: 0,
    potenciaKW: 0
  });

  const updateData = (fields: Partial<typeof formData>) => setFormData(prev => ({ ...prev, ...fields }));

  useEffect(() => {
    const recibo = formData.consumption;
    
    // 1. Convertir pesos a kWh estimado (Asumiendo tarifa promedio de ~$2.5 MXN/kWh)
    const TARIFA_KWH = 2.5;
    const kWhBimestral = recibo / TARIFA_KWH;
    const kWhMensual = kWhBimestral / 2;

    // 2. Variables del Excel
    const wPanel = 650;
    const HSP = 5;
    const diasMes = 30;
    const oversizing = 1.3;

    // 3. Cálculos
    const generacionMensualPanel = (wPanel * HSP * diasMes) / 1000; // 97.5 kWh
    const paneles = Math.max(1, Math.ceil((kWhMensual * oversizing) / generacionMensualPanel));
    
    // Costo Premium según Excel: $11,350 por panel 
    const costo = paneles * 11350; 
    
    // Ahorro y ROI
    const ahorroMensual = Math.round(recibo * 0.95); // 95% de ahorro a CFE asumiendo cobro mínimo
    const ahorroAnual = ahorroMensual * 12;
    const roi = Math.ceil(costo / (ahorroMensual || 1));
    const ahorro25 = ahorroAnual * 25;
    const potenciaKW = (paneles * wPanel) / 1000;

    setMetrics({
      ahorroMensual,
      costo,
      roi,
      paneles,
      ahorro25,
      potenciaKW
    });
  }, [formData.consumption]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key === 'file' && val) formPayload.append(key, val as File);
        else if (key !== 'file' && val !== null) formPayload.append(key, val.toString());
      });

      const res = await fetch('/api/quote', {
        method: 'POST',
        body: formPayload
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ocurrió un error');
      alert("¡Cotización solicitada con éxito! Pronto te contactaremos.");
      
      setStep(1);
      setFormData({
        name: '', email: '', phone: '', city: '',
        propertyType: 'Residencial', zipCode: '', consumption: 3200, file: null
      });
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, label: "Contacto" },
    { id: 2, label: "Propiedad" },
    { id: 3, label: "Recibo" }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 mt-4 text-left">
      
      {/* LEFT COLUMN: Form flow */}
      <div className="flex-1 w-full flex flex-col">
        {/* Encabezado Izquierdo */}
        <div className="mb-6">
          <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#10b981] uppercase mb-4">COTIZACIÓN INTELIGENTE</h4>
          <h2 className="text-4xl form-title font-bold text-slate-800 mb-3">Cotiza tu sistema solar</h2>
          <p className="text-gray-500 text-[15px]">Completa los pasos y adjunta tu recibo para generar una propuesta personalizada.</p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {steps.map((s) => {
            const isActive = step === s.id;
            return (
              <div key={s.id} className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => step > s.id && setStep(s.id)}>
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    isActive ? "bg-[#2d6a4f] text-white" : "bg-[#d8f3dc] text-[#2d6a4f]"
                  }`}
                >
                  0{s.id}
                </div>
                <span className={`text-[15px] font-semibold transition-colors ${isActive ? "text-slate-700" : "text-slate-500"}`}>{s.label}</span>
              </div>
            )
          })}
        </div>

        {/* Formularios */}
        <div className="flex-1 min-h-[300px]">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: CONTACTO */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <input 
                  type="text" placeholder="Nombre completo" 
                  className="w-full p-[18px] border border-[#e2e8f0] rounded-2xl outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] transition-all text-gray-800 placeholder:text-gray-400"
                  value={formData.name} onChange={e => updateData({ name: e.target.value })} 
                />
                <input 
                  type="email" placeholder="Correo electrónico" 
                  className="w-full p-[18px] border border-[#e2e8f0] rounded-2xl outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] transition-all text-gray-800 placeholder:text-gray-400"
                  value={formData.email} onChange={e => updateData({ email: e.target.value })} 
                />
                <input 
                  type="tel" placeholder="Télefono" 
                  className="w-full p-[18px] border border-[#e2e8f0] rounded-2xl outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] transition-all text-gray-800 placeholder:text-gray-400"
                  value={formData.phone} onChange={e => updateData({ phone: e.target.value })} 
                />
                <input 
                  type="text" placeholder="Ciudad" 
                  className="w-full p-[18px] border border-[#e2e8f0] rounded-2xl outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] transition-all text-gray-800 placeholder:text-gray-400"
                  value={formData.city} onChange={e => updateData({ city: e.target.value })} 
                />
              </motion.div>
            )}

            {/* STEP 2: PROPIEDAD */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                 <input 
                  type="text" placeholder="Código Postal (Ej. 11000)" 
                  className="w-full p-[18px] border border-[#e2e8f0] rounded-2xl outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] transition-all text-gray-800 placeholder:text-gray-400"
                  value={formData.zipCode} onChange={e => updateData({ zipCode: e.target.value })} 
                />
                <select 
                  className="w-full p-[18px] border border-[#e2e8f0] rounded-2xl bg-white outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] transition-all text-gray-800"
                  value={formData.propertyType} onChange={e => updateData({ propertyType: e.target.value })}
                >
                  <option>Residencial</option>
                  <option>Comercial</option>
                  <option>Industrial</option>
                </select>
              </motion.div>
            )}

            {/* STEP 3: RECIBO */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div>
                  <label className="block text-slate-700 font-bold mb-6">¿Cuánto pagas de luz bimestralmente?</label>
                  <div className="flex justify-between items-center mb-6">
                     <span className="text-gray-400 font-medium">$500</span>
                     <span className="text-4xl font-bold text-[#10b981]">${formData.consumption.toLocaleString()} <span className="text-sm text-gray-400 font-normal">MXN</span></span>
                     <span className="text-gray-400 font-medium">$25,000+</span>
                  </div>
                  <input type="range" min="500" max="25000" step="500" 
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2d6a4f]" 
                    style={{ accentColor: '#2d6a4f' }} value={formData.consumption} onChange={e => updateData({ consumption: Number(e.target.value) })} 
                  />
                </div>

                <div className="border-2 border-dashed border-[#10b981]/30 bg-[#10b981]/5 rounded-2xl p-10 text-center hover:bg-[#10b981]/10 transition-colors cursor-pointer relative">
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => e.target.files && updateData({ file: e.target.files[0] })} accept=".pdf,image/*" />
                  <UploadCloud size={40} className="mx-auto text-[#10b981] mb-4" />
                  {formData.file ? (
                    <p className="font-bold text-[#10b981] flex items-center justify-center gap-2"><CheckCircle size={20} /> {formData.file.name}</p>
                  ) : (
                    <>
                      <p className="font-bold text-gray-800 text-[15px]">Sube tu recibo actualizado (Opcional)</p>
                      <p className="text-sm text-gray-500 mt-2">Formatos aceptados: PDF, JPG, PNG (Max 5MB)</p>
                    </>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Botones */}
        <div className="mt-8 flex items-center justify-between pb-4">
           {step > 1 ? (
             <button onClick={() => setStep(step - 1)} className="px-8 py-3 border border-[#bbf7d0] text-[#2d6a4f] bg-white rounded-full font-bold hover:bg-[#f0fdf4] transition-colors">
               Regresar
             </button>
           ) : <div />}

           {step < 3 ? (
             <button onClick={() => setStep(step + 1)} className="px-10 py-3 bg-[#2d6a4f] text-white rounded-full font-bold hover:bg-[#1b4332] transition-colors shadow-md">
               Continuar
             </button>
           ) : (
             <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center justify-center gap-2 px-10 py-3 bg-[#2d6a4f] text-white font-bold rounded-full hover:bg-[#1b4332] transition-colors shadow-xl disabled:opacity-50">
               {isSubmitting ? 'Enviando...' : 'Obtener Cotización'}
             </button>
           )}
        </div>
      </div>

      {/* RIGHT COLUMN: Resumen */}
      <div className="w-full lg:w-[420px] flex flex-col gap-6">
        <div className="bg-white border-[1.5px] border-[#dcfce7] rounded-3xl p-8 shadow-2xl shadow-green-900/5">
           <h3 className="text-[#10b981] text-[13px] font-bold tracking-[0.2em] uppercase mb-8">RESUMEN ESTIMADO</h3>
           
           <div className="space-y-6">
             <div className="flex justify-between items-center border-b border-gray-100 pb-4">
               <span className="text-[#475569] font-medium text-[15px]">Ahorro mensual</span>
               <span className="text-[#10b981] font-bold text-xl">${metrics.ahorroMensual.toLocaleString()}</span>
             </div>
             <div className="flex justify-between items-center border-b border-gray-100 pb-4">
               <span className="text-[#475569] font-medium text-[15px]">Costo del sistema</span>
               <span className="text-[#10b981] font-bold text-xl">${metrics.costo.toLocaleString()}</span>
             </div>
             <div className="flex justify-between items-center border-b border-gray-100 pb-4">
               <span className="text-[#475569] font-medium text-[15px]">ROI en meses</span>
               <span className="text-[#10b981] font-bold text-xl">{metrics.roi}</span>
             </div>
             <div className="flex justify-between items-center border-b border-gray-100 pb-4">
               <span className="text-[#475569] font-medium text-[15px]">Paneles sugeridos (650W)</span>
               <span className="text-[#10b981] font-bold text-xl">{metrics.paneles}</span>
             </div>
             <div className="flex justify-between items-center border-b border-gray-100 pb-4">
               <span className="text-[#475569] font-medium text-[15px]">Potencia instalada</span>
               <span className="text-[#10b981] font-bold text-xl">{metrics.potenciaKW.toFixed(1)} kWp</span>
             </div>
             <div className="flex justify-between items-center pb-2">
               <span className="text-[#475569] font-medium text-[15px]">Ahorro a 25 años</span>
               <span className="text-[#10b981] font-bold text-xl">${metrics.ahorro25.toLocaleString()}</span>
             </div>
           </div>
        </div>

        <div className="bg-[#f0fdf4] border-[1.5px] border-[#dcfce7] rounded-2xl p-6 text-left relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-[#2d6a4f] font-bold mb-2 text-lg">Asesoría incluida</h4>
            <p className="text-[#2d6a4f] opacity-80 text-[15px] leading-relaxed">
              Te llamamos para validar datos, explicar financiamiento y coordinar visita técnica.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
