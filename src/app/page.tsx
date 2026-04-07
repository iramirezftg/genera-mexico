"use client";

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import Tilt from 'react-parallax-tilt';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { Battery, ShieldCheck, Zap, MessageCircle } from 'lucide-react';

import Image from 'next/image';
import QuoteForm from '../components/QuoteForm';
import Testimonials from '../components/Testimonials';
import PhotoGallery from '../components/PhotoGallery';
import ProcessSection from '../components/ProcessSection';
import FAQSection from '../components/FAQSection';
import SimpleContactForm from '../components/SimpleContactForm';
import Footer from '../components/Footer';
import SavingsSimulator from '../components/SavingsSimulator';
import Header from '../components/Header';
import LogoCarousel from '../components/LogoCarousel';
import BeforeAfterReceipt from '../components/BeforeAfterReceipt';
// --- COMPONENTES UI REUTILIZABLES ---

const ShimmerButton = ({ text, onClick, className = "" }: { text: string; onClick?: () => void; className?: string }) => (
  <button
    onClick={onClick}
    className={`relative inline-flex items-center justify-center px-8 py-4 font-bold text-brand-green bg-brand-amber rounded-full overflow-hidden transition-transform hover:scale-105 shadow-lg shadow-brand-amber/30 ${className}`}
  >
    <span className="relative z-10">{text}</span>
    <div className="absolute inset-0 w-1/2 h-full -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent z-0" />
  </button>
);

const BenefitCard = ({ icon, title, desc, index = 0 }: { icon: React.ReactNode; title: string; desc: string; index?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
    className="h-full"
  >
    <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.02} className="w-full h-full">
      <div className="p-8 bg-white border border-gray-100 shadow-xl rounded-2xl h-full transition-shadow hover:shadow-2xl">
        <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-full bg-brand-green/10 text-brand-green">
          {icon}
        </div>
        <h3 className="mb-3 text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{desc}</p>
      </div>
    </Tilt>
  </motion.div>
);

// --- SECCIONES PRINCIPALES ---

export default function LandingPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  const [refStats, inViewStats] = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <div className="min-h-screen font-sans bg-slate-50 overflow-hidden" id="top">
      <Header />
      
      {/* 1. HERO SECTION (Parallax + Partículas + Typewriter) */}
      <section className="relative flex items-center justify-center h-screen bg-brand-dark overflow-hidden">
        
        {/* Imagen de Fondo del Hero */}
        <Image
          src="/new-hero-bg.jpg"
          alt="Instalación de paneles solares Genera México con vista a las montañas"
          fill
          className="object-cover opacity-50 mix-blend-luminosity"
          priority
        />
        
        {/* Overlay oscuro para mejorar contraste de las partículas y el texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/80 via-brand-dark/50 to-brand-dark z-0" />

        {/* Partículas de energía */}
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            particles: {
              color: { value: "#FFB800" },
              links: { enable: true, color: "#1E4620", opacity: 0.3 },
              move: { enable: true, speed: 1 },
              opacity: { value: 0.5 },
              size: { value: { min: 1, max: 3 } },
            },
          }}
          className="absolute inset-0 z-0"
        />
        
        {/* Contenido del Hero */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Congela tu recibo de luz hoy. <br />
            <span className="text-brand-amber inline-block">
              <Typewriter
                options={{
                  strings: ['Empieza a ahorrar.', 'Pásate a lo solar.', 'Energía 100% limpia.'],
                  autoStart: true,
                  loop: true,
                  delay: 50,
                }}
              />
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-xl text-gray-300 mb-10"
          >
            Instalación experta, beneficios fiscales y retorno de inversión garantizado.
          </motion.p>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }}>
            <ShimmerButton text="Calcula tu ahorro gratis" onClick={() => document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth' })} />
          </motion.div>
        </div>
      </section>

      {/* 2. STATS ANIMADOS */}
      <section ref={refStats} className="py-16 bg-brand-green text-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={inViewStats ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5 }}>
            <h2 className="text-5xl font-bold text-brand-amber">
              +{inViewStats && <CountUp end={500} duration={3} />}
            </h2>
            <p className="mt-2 text-lg">Clientes Atendidos</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={inViewStats ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.2 }}>
            <h2 className="text-5xl font-bold text-brand-amber leading-tight">
              +${inViewStats && <CountUp end={100} duration={3} />}M
            </h2>
            <p className="text-sm font-semibold text-brand-amber/70 mt-1">millones MXN</p>
            <p className="mt-1 text-lg">Ahorro Generado</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={inViewStats ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.4 }}>
            <h2 className="text-5xl font-bold text-brand-amber">
              +{inViewStats && <CountUp end={10000} duration={3} separator="," />}
            </h2>
            <p className="mt-2 text-lg">Paneles Instalados</p>
          </motion.div>
        </div>
      </section>

      {/* 2.2 LOGOS AUTORIDAD (Trust Badges) */}
      <LogoCarousel />

      {/* 2.5 SIMULADOR DE AHORRO RÁPIDO */}
      <SavingsSimulator />

      {/* 2.8 EL ANTES Y DESPUÉS (Contraste) */}
      <BeforeAfterReceipt />

      {/* 3. BENEFICIOS (3D Tilt) */}
      <section id="beneficios" className="py-24 max-w-6xl mx-auto px-4 scroll-mt-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-brand-dark mb-4">¿Por qué elegir Genera México?</h2>
          <p className="text-gray-600 text-lg">La transición a energía solar más segura y rentable.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BenefitCard index={0} icon={<Zap size={28} />} title="Ahorro Inmediato" desc="Reduce hasta un 98% tu pago a CFE desde el primer bimestre de instalación." />
          <BenefitCard index={1} icon={<ShieldCheck size={28} />} title="Garantía Extendida" desc="Paneles de nivel Tier 1 con hasta 25 años de garantía en generación." />
          <BenefitCard index={2} icon={<Battery size={28} />} title="Cero Apagones" desc="Sistemas híbridos disponibles para mantener tu energía funcionando siempre." />
        </div>
      </section>

      {/* 4. PROCESO / CÓMO FUNCIONA */}
      <ProcessSection />

      {/* 5. TESTIMONIOS */}
      <Testimonials />

      {/* 5.5. GALERÍA DE FOTOS INSTALACIONES */}
      <PhotoGallery />

      {/* 6. PREGUNTAS FRECUENTES (FAQ) */}
      <FAQSection />

      {/* 7. FORMULARIO DE CONTACTO DIRECTO */}
      <SimpleContactForm />

      {/* 8. COTIZADOR INTERACTIVO (WIZARD) */}
      <section id="simulador" className="py-24 bg-slate-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center mb-12">
          <h2 className="text-4xl font-bold text-brand-dark mb-4">Descubre tu ahorro exacto</h2>
          <p className="text-lg text-gray-600">Completa estos 4 sencillos pasos para recibir tu propuesta personalizada sin compromiso.</p>
        </div>
        <div className="px-4">
          <QuoteForm />
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      {/* BOTÓN FLOTANTE WHATSAPP */}
      <a 
        href="https://wa.me/528112063766?text=Hola,%20me%20interesa%20reducir%20o%20congelar%20mi%20recibo%20de%20luz.%20%C2%BFPodr%C3%ADan%20apoyarme%20con%20una%20cotizaci%C3%B3n%3F" 
        target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 px-5 py-4 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center justify-center gap-2 animate-bounce hover:animate-none"
      >
        <MessageCircle size={28} />
        <span className="font-bold hidden sm:inline">Cotiza por WhatsApp</span>
      </a>

    </div>
  );
}
