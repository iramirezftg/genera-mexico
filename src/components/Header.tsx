"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Inicio", href: "#top" },
    { name: "Beneficios", href: "#beneficios" },
    { name: "Simulador", href: "#calculadora" },
    { name: "Preguntas", href: "#faq" },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3'
          : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo — colores naturales en ambos estados */}
          <a href="#top" className="flex items-center">
            <Image
              src="/logo-genera.png"
              alt="Genera México — Energía Consciente"
              width={180}
              height={54}
              className={`w-auto object-contain transition-all duration-300 ${
                isScrolled ? 'h-9 md:h-11' : 'h-10 md:h-12'
              }`}
              priority
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  isScrolled ? 'text-gray-600 hover:text-brand-green' : 'text-white/90 hover:text-white drop-shadow-sm'
                }`}
              >
                {link.name}
              </a>
            ))}

            <a 
              href="#contacto" 
              className="bg-brand-amber text-brand-dark px-6 py-2.5 rounded-full font-bold text-sm tracking-wide shadow-md hover:scale-105 transition-transform"
            >
              Cotizar Ahora
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
               <X className={isScrolled ? 'text-brand-dark' : 'text-white'} />
            ) : (
               <Menu className={isScrolled ? 'text-brand-dark' : 'text-white'} />
            )}
          </button>

        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 py-4 px-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-600 font-semibold p-2 rounded-lg hover:bg-gray-50"
            >
              {link.name}
            </a>
          ))}

          <a 
            href="#contacto" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-brand-green text-white px-4 py-3 rounded-xl font-bold text-center mt-2 shadow-sm"
          >
            Cotizar Ahora
          </a>
        </div>
      )}
    </header>
  );
}
