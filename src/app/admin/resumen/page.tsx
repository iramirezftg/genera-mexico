"use client";

import React from "react";
import Link from "next/link";

import { createClient } from "@/utils/supabase/client";

const mockLeads = [
  { id: 'mock-1', name: "Test Lead", status: "Cotizacion Enviada" },
  { id: 'mock-2', name: "Test User 223959", status: "Contactado" },
  { id: 'mock-3', name: "Test Quote", status: "Nuevo" },
  { id: 'mock-4', name: "Test User 223938", status: "Contactado" },
  { id: 'mock-5', name: "Test JSON", status: "Nuevo" },
];

const mockQuotes = [
  { id: 'mock-1', panels: "18", status: "En Proceso" },
  { id: 'mock-2', panels: "12", status: "Aprobado" },
  { id: 'mock-3', panels: "11", status: "Nuevo" },
  { id: 'mock-4', panels: "12", status: "Aprobado" },
  { id: 'mock-5', panels: "6", status: "Nuevo" },
];

export default function AdminResumenPage() {
  const [recentLeads, setRecentLeads] = React.useState<any[]>(mockLeads);
  const [recentQuotes, setRecentQuotes] = React.useState<any[]>(mockQuotes);
  const [counts, setCounts] = React.useState({ leads: 12, quotes: 8, projects: 8 });
  const supabase = createClient();

  React.useEffect(() => {
    async function loadSummary() {
      
      const { data: leads } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5);
      const { data: quotes } = await supabase.from('quotes').select('*').order('created_at', { ascending: false }).limit(5);
      
      const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });
      const { count: quotesCount } = await supabase.from('quotes').select('*', { count: 'exact', head: true });
      // Example of projects if implemented:
      const { count: projectsCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client');

      if (leads) setRecentLeads(leads);
      if (quotes) setRecentQuotes(quotes);
      
      setCounts({
        leads: leadsCount || 0,
        quotes: quotesCount || 0,
        projects: projectsCount || 0
      });
    }
    loadSummary();
  }, []);

  return (
    <div className="space-y-8">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-32">
          <span className="text-slate-400 dark:text-slate-500 font-semibold tracking-widest text-xs uppercase">
            Leads Activos
          </span>
          <span className="text-4xl font-bold text-slate-900 dark:text-white">
            {counts.leads}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-32">
          <span className="text-slate-400 dark:text-slate-500 font-semibold tracking-widest text-xs uppercase">
            Cotizaciones
          </span>
          <span className="text-4xl font-bold text-slate-900 dark:text-white">
            {counts.quotes}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-32">
          <span className="text-slate-400 dark:text-slate-500 font-semibold tracking-widest text-xs uppercase">
            Proyectos
          </span>
          <span className="text-4xl font-bold text-slate-900 dark:text-white">
            {counts.projects}
          </span>
        </div>
      </div>

      {/* Lists Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leads Recientes */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-slate-800 dark:text-slate-100 font-bold text-lg">
              Leads recientes
            </h2>
            <Link href="/admin/leads" className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex justify-between items-center py-2">
                <span className="text-slate-600 dark:text-slate-300 font-medium">{lead.name}</span>
                <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">{lead.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cotizaciones Recientes */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-slate-800 dark:text-slate-100 font-bold text-lg">
              Cotizaciones recientes
            </h2>
            <Link href="/admin/cotizaciones" className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="space-y-4">
            {recentQuotes.map((quote) => (
              <div key={quote.id} className="flex justify-between items-center py-2">
                <span className="text-slate-600 dark:text-slate-300 font-medium">{quote.name}</span>
                <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">{quote.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
