"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, LayoutDashboard, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Simular protección de ruta Admin
    const role = localStorage.getItem('genera_role');
    if (role !== 'admin') {
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Validando...</div>;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <span className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center text-white">G</div>
            Admin<span className="text-brand-green">Panel</span>
          </span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-brand-green/10 text-brand-green rounded-xl font-medium">
            <LayoutDashboard size={20} />
            Proyectos Activos
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-brand-dark rounded-xl font-medium transition-colors">
            <Users size={20} />
            Leads / Cotizaciones
          </a>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => {
              localStorage.removeItem('genera_role');
              router.push('/login');
            }}
            className="flex items-center gap-3 px-4 py-2 w-full text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut size={20} />
            Salir
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
