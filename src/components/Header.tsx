"use client";

import React, { useState, useEffect } from 'react';
import GeneraLogo from './GeneraLogo';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

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
        isScrolled ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <a href="#top" className="flex items-center">
            <div className={`transition-all duration-300 ${isScrolled ? 'h-9' : 'h-11'}`}>
              <GeneraLogo dark={!isScrolled} />
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  isScrolled ? 'text-gray-600 dark:text-gray-300 hover:text-brand-green' : 'text-white/90 hover:text-white drop-shadow-sm'
                }`}
              >
                {link.name}
              </a>
            ))}

            <ThemeToggle />
            
            <a
              href="/login"
              className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1 ${
                isScrolled ? 'text-gray-600 dark:text-gray-300 hover:text-brand-green' : 'text-white/90 hover:text-white drop-shadow-sm'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Entrar
            </a>

            <a
              href="#simulador"
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
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 shadow-xl border-t border-gray-100 dark:border-white/10 py-4 px-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-600 dark:text-gray-300 font-semibold p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              {link.name}
            </a>
          ))}

          <div className="flex justify-center mt-2">
            <ThemeToggle />
          </div>

          <a
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-600 dark:text-gray-300 font-bold p-3 rounded-xl border-2 border-gray-100 dark:border-slate-800 text-center mt-2 shadow-sm flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Iniciar Sesión
          </a>

          <a
            href="#simulador"
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-brand-amber text-brand-dark px-4 py-3 rounded-xl font-bold text-center shadow-sm"
          >
            Cotizar Ahora
          </a>
        </div>
      )}
    </header>
  );
}
