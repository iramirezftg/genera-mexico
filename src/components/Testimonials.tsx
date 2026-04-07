"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const testimonials = [
  {
    name: "Humberto S.",
    company: "Empresa",
    location: "Gral. Escobedo",
    category: "Industrial",
    categoryColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    avatarGradient: "from-blue-500 to-brand-green",
    text: "Antes de instalar, el gasto eléctrico era una carga fuerte para la operación. Con Genera logramos reducir nuestro recibo de forma significativa desde el primer mes. La instalación fue rápida y sin afectar la operación del negocio. Hoy ese ahorro lo estamos reinvirtiendo en crecimiento.",
    rating: 5,
  },
  {
    name: "Dr. Edgar C.",
    company: "Empresa",
    location: "Monterrey",
    category: "Comercial",
    categoryColor: "bg-brand-amber/20 text-brand-amber border-brand-amber/30",
    avatarGradient: "from-brand-amber to-orange-500",
    text: "Nos preocupaba que los paneles afectaran la estética de la empresa, pero el diseño quedó muy limpio y bien integrado. Genera se encargó de todo el trámite con CFE, lo cual hizo el proceso muy sencillo para nosotros. Desde entonces hemos visto un ahorro constante mes a mes.",
    rating: 5,
  },
  {
    name: "Arturo M.",
    company: "Residencial",
    location: "San Pedro",
    category: "Residencial",
    categoryColor: "bg-brand-green/20 text-green-300 border-brand-green/30",
    avatarGradient: "from-brand-green to-emerald-400",
    text: "Desde el primer contacto hasta la instalación, el servicio fue muy profesional. Lo que más valoro es el monitoreo, porque puedo ver claramente el ahorro que estamos generando todos los días. Sin duda Genera fue una excelente decisión.",
    rating: 5,
  },
  {
    name: "Instituto Epicentro Monterrey A.C.",
    company: "Institucional / Educativo",
    location: "Monterrey",
    category: "Institucional",
    categoryColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    avatarGradient: "from-purple-500 to-brand-amber",
    text: "Lo más sorprendente fue ver resultados desde el primer mes. El ahorro fue evidente desde el primer recibo. Genera nos dio confianza total en cada etapa del proyecto y hoy tenemos un sistema que realmente está optimizando nuestros costos.",
    rating: 5,
  },
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

        <div className="mt-8 relative w-full">
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            loop={true}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: false,
            }}
            pagination={{ clickable: true }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="!pb-16 [&_.swiper-pagination-bullet]:bg-slate-400 [&_.swiper-pagination-bullet]:opacity-50 [&_.swiper-pagination-bullet-active]:bg-brand-green [&_.swiper-pagination-bullet-active]:opacity-100"
          >
            {testimonials.map((t, idx) => (
              <SwiperSlide key={idx} className="!w-[320px] md:!w-[440px] !h-auto">
                <div className="bg-slate-800/80 border border-slate-700 p-8 rounded-3xl backdrop-blur-sm relative h-full flex flex-col justify-between shadow-xl">
                  <Quote size={40} className="absolute top-6 right-6 text-brand-amber/10" />
                  <div>
                    {/* Badge categoría */}
                    <span className={`inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border mb-5 ${t.categoryColor}`}>
                      {t.category}
                    </span>
                    {/* Estrellas */}
                    <div className="flex gap-1 mb-5 text-brand-amber">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-gray-200 leading-relaxed relative z-10 text-[15px]">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </div>
                  {/* Autor */}
                  <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-700 relative z-10">
                    <div className={`w-11 h-11 bg-gradient-to-br ${t.avatarGradient} rounded-full flex items-center justify-center text-white font-bold text-base shrink-0`}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm leading-tight">{t.name}</h4>
                      <p className="text-gray-400 text-xs mt-0.5">{t.company} · {t.location}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
