import React from 'react';
import GeneraLogo from './GeneraLogo';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 pt-16 pb-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">

          {/* Columna 1: Marca */}
          <div>
            <div className="h-9 mb-4"><GeneraLogo /></div>
            <p className="text-gray-500 pr-4 leading-relaxed text-sm">
              Energía consciente para hogares y empresas que buscan ahorro, control y sostenibilidad real.
            </p>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h3 className="text-sm font-bold text-brand-dark dark:text-gray-100 uppercase tracking-widest mb-4">Navegación</h3>
            <ul className="space-y-3">
              <li>
                <a href="#top" className="text-gray-500 hover:text-brand-green transition-colors text-sm">Inicio</a>
              </li>
              <li>
                <a href="#simulador" className="text-gray-500 hover:text-brand-green transition-colors text-sm">Simulador</a>
              </li>
              <li>
                <a href="#contacto" className="text-gray-500 hover:text-brand-green transition-colors text-sm">Cotizar</a>
              </li>
              <li>
                <a href="#faq" className="text-gray-500 hover:text-brand-green transition-colors text-sm">Preguntas frecuentes</a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="text-sm font-bold text-brand-dark dark:text-gray-100 uppercase tracking-widest mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-500">+52 81 1206 3766</li>
              <li>
                <a href="mailto:ventas@generamexico.com" className="text-gray-500 hover:text-brand-green transition-colors">ventas@generamexico.com</a>
              </li>
              <li className="text-gray-500">Monterrey • CDMX</li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="h-6 opacity-40"><GeneraLogo /></div>
          <p className="text-gray-400 text-xs text-center">
            © {new Date().getFullYear()} Genera. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
