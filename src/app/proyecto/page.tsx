"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";

export default function ProyectoSearchPage() {
  const [projectId, setProjectId] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectId.trim()) {
      router.push(`/proyecto/${projectId.trim()}`);
    }
  };

  React.useEffect(() => {
    async function checkUserProject() {
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: latestLead } = await supabase
          .from('leads')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (latestLead) {
          router.push(`/proyecto/${latestLead.id}`);
        }
      }
    }
    checkUserProject();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Tu proyecto solar
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Consulta el avance de tu instalacion, documentos y ahorro estimado.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ingresa tu ID de cotizacion"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full h-14 pl-5 pr-12 rounded-2xl border-2 border-emerald-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all text-lg shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-8 h-14 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-2xl transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
             Buscar
          </button>
        </form>

        {/* Empty State Card */}
        <div className="mt-12 p-12 rounded-3xl border-2 border-emerald-50 dark:border-slate-800 bg-emerald-50/30 dark:bg-slate-800/30 flex flex-col items-center justify-center space-y-6 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Aun no tenemos datos cargados. Completa tu cotizacion para ver el avance.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-2xl transition-all shadow-md"
          >
            Ir a cotizar
          </button>
        </div>
      </div>
    </div>
  );
}
