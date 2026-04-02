"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, Key, Mail, Globe } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('cliente@ejemplo.com');
  const [password, setPassword] = useState('demo1234');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      // Si ocurre un error, pero es el usuario demo, hacemos un login simulado
      if (email === 'cliente@ejemplo.com' && password === 'demo1234') {
        localStorage.setItem('genera_role', 'client');
        localStorage.setItem('genera_active_project', 'PROJ-1002');
        router.push('/dashboard');
        return;
      }
      setErrorMsg(error.message);
      setIsLoading(false);
      return;
    }

    // Mantener la simulación de sesión guardando en local storage para el flujo de la app actual
    localStorage.setItem('genera_role', 'client');
    localStorage.setItem('genera_active_project', 'PROJ-1002');
    router.push('/dashboard');
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  };

  const handleAdminLogin = () => {
    setIsLoading(true);
    // Simula login admin
    setTimeout(() => {
      localStorage.setItem('genera_role', 'admin');
      router.push('/admin');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Esfera decorativa de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-300/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-center space-x-2">
                <div className="bg-brand-green p-2 rounded-xl">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-brand-dark tracking-tight">Portal <span className="text-brand-green">Genera</span></span>
             </div>
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Inicia sesión en tu cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Supervisa tus proyectos o administra leads.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white py-8 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-[2rem] sm:px-10 border border-gray-50">
          
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium border border-red-100">
              {errorMsg}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleClientLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-brand-green focus:border-brand-green block w-full pl-10 sm:text-sm border-gray-300 rounded-xl px-4 py-3 bg-gray-50/50 border outline-none"
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-brand-green focus:border-brand-green block w-full pl-10 sm:text-sm border-gray-300 rounded-xl px-4 py-3 bg-gray-50/50 border outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900"> Recordarme </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-brand-green hover:text-emerald-500"> ¿Olvidaste tu contraseña? </a>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-green hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-all"
              >
                {isLoading ? "Validando..." : "Ingresar como Cliente"}
              </button>
              
              {/* Botón MOCK para Dev/Admin rápido */}
              <button
                type="button"
                onClick={handleAdminLogin}
                className="w-full flex justify-center py-3 px-4 border border-brand-green/20 rounded-xl text-sm font-bold text-brand-green bg-brand-green/5 hover:bg-brand-green/10 focus:outline-none transition-all"
              >
                Ingresar como Admin (DEV)
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O ingresa con</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-all disabled:opacity-50"
              >
                <Globe className="w-5 h-5 text-gray-600 mr-2" />
                Continuar con Google
              </button>
            </div>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
}
