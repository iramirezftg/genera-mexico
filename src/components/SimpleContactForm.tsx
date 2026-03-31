"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SimpleContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    consumption: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('phone', formData.phone);
      formPayload.append('email', formData.email);
      formPayload.append('zipCode', formData.city); // Usamos el campo zipCode temporalmente para guardar la ciudad
      formPayload.append('propertyType', 'Residencial');
      formPayload.append('consumption', formData.consumption.replace(/[^0-9]/g, '') || '0');
      
      const res = await fetch('/api/quote', {
        method: 'POST',
        body: formPayload
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ocurrió un error');

      alert("¡Gracias! Hemos recibido tus datos y un asesor se comunicará pronto.");
      setFormData({ name: '', email: '', phone: '', city: '', consumption: '' });
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full p-4 bg-white/95 rounded-xl border-none focus:ring-2 focus:ring-brand-amber outline-none text-gray-800 placeholder-gray-400";

  return (
    <section id="contacto" className="py-24 bg-white scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-brand-green rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center shadow-2xl"
        >
          
          {/* Lado Izquierdo: Textos */}
          <div className="md:w-1/2 text-white">
            <p className="text-brand-amber text-sm font-bold tracking-[0.2em] uppercase mb-4">Empieza Hoy</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Conecta con un asesor solar en minutos</h2>
            <p className="text-brand-green-100/80 text-lg">
              Comparte tus datos y recibe una propuesta personalizada con ahorro estimado y opciones de financiamiento.
            </p>
          </div>

          {/* Lado Derecho: Formulario */}
          <div className="md:w-1/2 w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" required placeholder="Nombre completo" 
                className={inputClasses}
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="email" required placeholder="Correo" 
                className={inputClasses}
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <input 
                type="tel" required placeholder="Teléfono" 
                className={inputClasses}
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
              />
              <div className="flex gap-4">
                <input 
                  type="text" required placeholder="Ciudad" 
                  className={inputClasses}
                  value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}
                />
                <input 
                  type="text" required placeholder="Recibo mensual" 
                  className={inputClasses}
                  value={formData.consumption} onChange={e => setFormData({...formData, consumption: e.target.value})}
                />
              </div>
              <button 
                type="submit" disabled={isSubmitting}
                className="w-full mt-4 py-4 px-8 rounded-xl bg-gradient-to-r from-brand-green to-[#A3D977] font-bold text-white shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Quiero mi propuesta'}
              </button>
            </form>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
