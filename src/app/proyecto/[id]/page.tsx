"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";
import { LogOut } from "lucide-react";

// Mock data based on the design
const mockProjectData = {
  id: "3c515579-5d59-4458-9379-380acf1f5a75",
  account: "neckogames0@gmail.com",
  client: "Omar Valencia",
  city: "Cerro Azul",
  monthlySavings: "$8265",
  roi: "37 meses",
  panels: 35,
  process: [
    { name: "Solicitud Recibida", status: "En curso", active: true },
    { name: "Visita Técnica", status: "Pendiente", active: false },
    { name: "Diseño del Sistema", status: "Pendiente", active: false },
    { name: "Instalación", status: "Pendiente", active: false },
  ],
};

export default function ProyectoDashboard() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [searchInput, setSearchInput] = useState(projectId || "");
  const [project, setProject] = useState<any>(mockProjectData);
  const supabase = createClient();

  React.useEffect(() => {
    async function fetchProject() {
      if (!projectId) {
        return;
      }
      
      const { data: lead } = await supabase.from('leads').select('*').eq('id', projectId).single();
      const { data: quote } = await supabase.from('quotes').select('*').eq('id', projectId).single();
      
      if (lead) {
        setProject({
          id: lead.id,
          account: "Cliente Genera",
          client: lead.name,
          city: lead.city || "N/A",
          monthlySavings: lead.receipt || "N/A",
          roi: quote?.roi || "Por definir",
          panels: quote?.panels || 0,
          receiptUrl: quote?.receipt_url || null,
          process: [
            { name: "Solicitud Recibida", status: lead.status === 'Nuevo' ? "En curso" : "Completado", active: lead.status === 'Nuevo' },
            { name: "Contactado", status: lead.status === 'Contactado' ? "En curso" : "Pendiente", active: lead.status === 'Contactado' },
            { name: "Cotización Enviada", status: lead.status === 'Cotizacion Enviada' ? "En curso" : "Pendiente", active: lead.status === 'Cotizacion Enviada' },
            { name: "Proyecto Aprobado", status: quote?.status === 'Aprobado' ? "En curso" : "Pendiente", active: quote?.status === 'Aprobado' },
          ],
        });
      }
    }
    fetchProject();
  }, [projectId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && searchInput.trim() !== projectId) {
      router.push(`/proyecto/${searchInput.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      {/* Top Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Plataforma solar | dashboard</span>
          
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-12 pl-4 pr-12 rounded-xl border-2 border-emerald-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-all font-mono text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-8 h-12 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl transition-all"
          >
            Buscar
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="md:col-span-7 space-y-6">
            {/* Resumen Widget */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-emerald-50 dark:border-slate-700 shadow-sm">
              <h2 className="text-emerald-500 font-semibold tracking-widest text-sm mb-6 uppercase">
                Resumen
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                  <span className="text-slate-500 dark:text-slate-400">Cuenta</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">{project.account}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                  <span className="text-slate-500 dark:text-slate-400">Cliente</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">{project.client}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                  <span className="text-slate-500 dark:text-slate-400">Ciudad</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">{project.city}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                  <span className="text-slate-500 dark:text-slate-400">Ahorro mensual</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">{project.monthlySavings}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                  <span className="text-slate-500 dark:text-slate-400">ROI</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">{project.roi}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Paneles</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">{project.panels}</span>
                </div>
              </div>
            </div>

            {/* Documentos Widget */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-emerald-50 dark:border-slate-700 shadow-sm">
              <h2 className="text-emerald-500 font-semibold tracking-widest text-sm mb-4 uppercase">
                Documentos
              </h2>
              {project.receiptUrl ? (
                <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-100 dark:border-slate-700 bg-emerald-50/50 dark:bg-slate-800/50">
                  <span className="text-emerald-900 dark:text-emerald-100 font-medium">Recibo_CFE.pdf</span>
                  <a 
                    href={project.receiptUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-semibold text-sm hover:underline"
                  >
                    Ver archivo
                  </a>
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">
                  Aun no hay recibo cargado.
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-5 space-y-6">
            {/* Proceso Widget */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-emerald-50 dark:border-slate-700 shadow-sm">
              <h2 className="text-emerald-500 font-semibold tracking-widest text-sm mb-6 uppercase">
                Proceso
              </h2>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                {project.process.map((step: any, index: number) => (
                  <div key={index} className="relative flex items-start gap-4">
                    <div className="absolute left-0 mt-1 flex h-6 w-6 items-center justify-center">
                      <div className={`h-3 w-3 rounded-full z-10 ${step.active ? 'bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]' : 'bg-slate-200 dark:bg-slate-600'}`}></div>
                    </div>
                    <div className="ml-8">
                       <h3 className="text-slate-900 dark:text-slate-100 font-semibold">{step.name}</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400">{step.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Widget */}
            <div className="bg-emerald-50/50 dark:bg-slate-800/50 rounded-3xl p-8 border border-emerald-100 dark:border-slate-700">
              <h3 className="text-emerald-900 dark:text-emerald-100 font-semibold mb-2">
                Tienes dudas? Habla con nuestro equipo
              </h3>
              <p className="text-emerald-700/80 dark:text-emerald-200/80 text-sm mb-6">
                Te ayudamos a acelerar tu instalacion y resolver preguntas.
              </p>
              <a 
                href="https://wa.me/528112063766?text=Hola,%20tengo%20una%20duda%20sobre%20mi%20proyecto%20solar."
                target="_blank"
                rel="noreferrer"
                className="inline-block px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition-all font-medium text-sm text-center"
              >
                Solicitar ayuda
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
