"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Resumen", href: "/admin/resumen" },
    { name: "Leads", href: "/admin/leads" },
    { name: "Cotizaciones", href: "/admin/cotizaciones" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      {/* Admin Navbar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          {/* Logo & Title */}
          <div>
            <h1 className="text-slate-900 dark:text-white font-bold text-lg">
              Panel Admin Genera
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Control de leads y cotizaciones
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-semibold  transition-colors ${
                    isActive
                      ? "text-emerald-700 dark:text-emerald-500"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">
              Administrador
            </span>
            <button 
              onClick={async () => {
                const { createClient } = await import('@/utils/supabase/client');
                const supabase = createClient();
                await supabase.auth.signOut();
                window.location.href = '/login';
              }}
              className="px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cerrar sesion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-screen-2xl mx-auto p-8">
        {children}
      </main>
    </div>
  );
}
