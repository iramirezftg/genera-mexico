"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Zap, UploadCloud, User, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

export default function QuoteForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    zipCode: '',
    propertyType: 'Residencial',
    consumption: 2500,
    file: null as File | null,
    name: '',
    phone: '',
    email: ''
  });

  const updateData = (fields: Partial<typeof formData>) => setFormData(prev => ({ ...prev, ...fields }));

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('phone', formData.phone);
      formPayload.append('email', formData.email);
      formPayload.append('zipCode', formData.zipCode);
      formPayload.append('propertyType', formData.propertyType);
      formPayload.append('consumption', formData.consumption.toString());
      if (formData.file) {
        formPayload.append('file', formData.file);
      }

      const res = await fetch('/api/quote', {
        method: 'POST',
        body: formPayload
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Ocurrió un error al enviar el formulario');
      }

      alert("¡Cotización solicitada con éxito! Pronto te contactaremos.");
      
      // Reiniciar
      setStep(1);
      setFormData({
        zipCode: '',
        propertyType: 'Residencial',
        consumption: 2500,
        file: null,
        name: '',
        phone: '',
        email: ''
      });
    } catch (error: any) {
      console.error('Submit error:', error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      
      {/* Barra de Progreso */}
      <div className="bg-slate-50 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-colors duration-300 ${step >= i ? 'bg-brand-green text-white' : 'bg-gray-200 text-gray-400'}`}>
              {i}
            </div>
            {i < 4 && (
              <div className={`h-1 w-12 sm:w-24 mx-2 rounded transition-colors duration-300 ${step > i ? 'bg-brand-green' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="p-8 md:p-12">
        <AnimatePresence mode="wait">
          
          {/* PASO 1: UBICACIÓN */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex items-center gap-3 mb-6 text-brand-green">
                <MapPin size={28} />
                <h3 className="text-2xl font-bold text-gray-900">¿Dónde instalaremos?</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                  <input type="text" placeholder="Ej. 11000" className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none" value={formData.zipCode} onChange={e => updateData({ zipCode: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Propiedad</label>
                  <select className="w-full p-4 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-brand-green" value={formData.propertyType} onChange={e => updateData({ propertyType: e.target.value })}>
                    <option>Residencial</option>
                    <option>Comercial</option>
                    <option>Industrial</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* PASO 2: CONSUMO */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex items-center gap-3 mb-6 text-brand-green">
                <Zap size={28} />
                <h3 className="text-2xl font-bold text-gray-900">¿Cuánto pagas a CFE?</h3>
              </div>
              <div className="text-center py-8">
                <h4 className="text-4xl font-bold text-brand-green mb-6">${formData.consumption.toLocaleString()} MXN</h4>
                <input type="range" min="500" max="50000" step="500" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-amber text-brand-amber" style={{ accentColor: '#FFB800' }} value={formData.consumption} onChange={e => updateData({ consumption: Number(e.target.value) })} />
                <p className="text-sm text-gray-500 mt-4">Desliza para ajustar tu pago bimestral aproximado</p>
              </div>
            </motion.div>
          )}

          {/* PASO 3: SUBIR RECIBO (Drag & Drop) */}
          {step === 3 && (
             <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
               <div className="flex items-center gap-3 mb-6 text-brand-green">
                 <UploadCloud size={28} />
                 <h3 className="text-2xl font-bold text-gray-900">Sube tu recibo de luz</h3>
               </div>
               <p className="text-gray-600 mb-6">Esto nos permite calcular exactamente cuántos paneles necesitas según tu historial real.</p>
               
               <div className="border-2 border-dashed border-brand-green/30 bg-brand-green/5 rounded-2xl p-10 text-center hover:bg-brand-green/10 transition-colors cursor-pointer relative">
                 <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => e.target.files && updateData({ file: e.target.files[0] })} accept=".pdf,image/*" />
                 <UploadCloud size={48} className="mx-auto text-brand-green mb-4" />
                 {formData.file ? (
                   <p className="font-bold text-brand-green flex items-center justify-center gap-2"><CheckCircle size={20} /> {formData.file.name}</p>
                 ) : (
                   <>
                     <p className="font-bold text-gray-800">Haz clic o arrastra tu archivo aquí</p>
                     <p className="text-sm text-gray-500 mt-2">Formatos aceptados: PDF, JPG, PNG (Max 5MB)</p>
                   </>
                 )}
               </div>
             </motion.div>
           )}

          {/* PASO 4: CONTACTO */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex items-center gap-3 mb-6 text-brand-green">
                <User size={28} />
                <h3 className="text-2xl font-bold text-gray-900">Tus datos de contacto</h3>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder="Nombre completo" className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green outline-none" value={formData.name} onChange={e => updateData({ name: e.target.value })} />
                <input type="tel" placeholder="WhatsApp / Teléfono" className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green outline-none" value={formData.phone} onChange={e => updateData({ phone: e.target.value })} />
                <input type="email" placeholder="Correo electrónico" className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green outline-none" value={formData.email} onChange={e => updateData({ email: e.target.value })} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTONES DE NAVEGACIÓN */}
        <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-100">
          {step > 1 ? (
            <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 text-gray-600 font-bold hover:text-brand-green transition-colors">
              <ArrowLeft size={20} /> Atrás
            </button>
          ) : <div />} {/* Espaciador */}

          {step < 4 ? (
            <button onClick={nextStep} className="flex items-center gap-2 px-8 py-3 bg-brand-green text-white font-bold rounded-full hover:bg-brand-dark transition-colors shadow-lg">
              Siguiente <ArrowRight size={20} />
            </button>
          ) : (
             <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 bg-brand-amber text-brand-green font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-brand-amber/30 disabled:opacity-50 disabled:scale-100">
               {isSubmitting ? 'Enviando...' : 'Obtener Cotización'}
             </button>
           )}
        </div>
      </div>
    </div>
  );
}
