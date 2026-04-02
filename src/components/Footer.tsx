import React from 'react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
          
          {/* Columna 1: Marca */}
          <div>
            <a href="#top" className="inline-block mb-5">
              <Image
                src="/logo-genera.png"
                alt="Genera México — Energía Consciente"
                width={180}
                height={54}
                className="h-10 w-auto object-contain"
              />
            </a>
            <p className="text-gray-500 pr-4 leading-relaxed">
              Energía consciente para hogares y empresas que buscan ahorro, control y sostenibilidad real.
            </p>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h3 className="text-xl font-bold text-brand-green mb-4">Navegación</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-500 hover:text-brand-green transition-colors">Inicio</a>
              </li>
              <li>
                <a href="#simulador" className="text-gray-500 hover:text-brand-green transition-colors">Simulador</a>
              </li>
              <li>
                <a href="#contacto" className="text-gray-500 hover:text-brand-green transition-colors">Cotizar</a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="text-xl font-bold text-brand-green mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="text-gray-500">+52 81 1206 3766</li>
              <li>
                <a href="mailto:hola@genera.mx" className="text-gray-500 hover:text-brand-green transition-colors">hola@genera.mx</a>
              </li>
              <li className="text-gray-500">Monterrey • CDMX</li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm text-center w-full">
            © {new Date().getFullYear()} Genera Solar. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
