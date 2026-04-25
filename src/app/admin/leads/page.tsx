"use client";

import React, { useState } from "react";

import { createClient } from "@/utils/supabase/client";

const initialLeads = [
  { id: 'mock-1', name: "Test Lead", city: "Monterrey", receipt: "$3200", status: "Cotizacion Enviada" },
  { id: 'mock-2', name: "Test User 223959", city: "Monterrey", receipt: "$2500", status: "Nuevo" },
  { id: 'mock-3', name: "Test Quote", city: "CDMX", receipt: "$4500", status: "Nuevo" },
];

const statusOptions = [
  "Nuevo",
  "Contactado",
  "Cotizacion Enviada",
  "Rechazado",
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>(initialLeads);
  const supabase = createClient();

  React.useEffect(() => {
    async function loadLeads() {
      // Mock mode fallback
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (data && !error) {
        setLeads(data);
      }
    }
    loadLeads();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Optimistic UI update
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, status: newStatus } : lead
    ));

    // Supabase update if not in mock mode
    if (true) {
      await supabase.from('leads').update({ status: newStatus }).eq('id', id);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm min-h-[600px]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700">
              <th className="pb-4 font-semibold text-xs tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Nombre
              </th>
              <th className="pb-4 font-semibold text-xs tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Ciudad
              </th>
              <th className="pb-4 font-semibold text-xs tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Recibo
              </th>
              <th className="pb-4 font-semibold text-xs tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {leads.map((lead) => (
              <tr key={lead.id} className="group hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                <td className="py-6 text-slate-800 dark:text-slate-200 font-medium whitespace-nowrap">
                  {lead.name}
                </td>
                <td className="py-6 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  {lead.city}
                </td>
                <td className="py-6 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  {lead.receipt}
                </td>
                <td className="py-6 whitespace-nowrap">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer appearance-none pr-10 relative"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '1em'
                    }}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
