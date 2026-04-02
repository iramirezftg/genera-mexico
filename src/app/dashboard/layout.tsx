"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Home, User, Sun } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Simular protección de ruta Cliente
    const role = localStorage.getItem('genera_role');
    if (role !== 'client') {
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Cargando tu energía...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center text-white">
                 <Sun size={20} />
               </div>
               <span className="text-xl font-bold text-brand-dark tracking-tight">Portal <span className="text-brand-green">Cliente</span></span>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
                  <User size={16} />
                  <span>Familia Garza (PROJ-1002)</span>
               </div>
               <button 
                  onClick={() => {
                    localStorage.removeItem('genera_role');
                    localStorage.removeItem('genera_active_project');
                    router.push('/login');
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Cerrar sesión"
               >
                 <LogOut size={20} />
               </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full flex">
        {children}
      </main>
    </div>
  );
}
