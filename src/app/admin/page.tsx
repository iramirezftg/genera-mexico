"use client";

import React, { useState, useEffect } from 'react';
import { Project, ProjectStage } from '@/lib/types';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { Activity, Clock, FileText, CheckCircle, Upload } from 'lucide-react';

const STAGES = [
  { id: 1, name: "Firma" },
  { id: 2, name: "Permisos CFE" },
  { id: 3, name: "Instalación" },
  { id: 4, name: "Inspección" },
  { id: 5, name: "Interconexión" },
  { id: 6, name: "Activo" }
];

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    // Cargar data desde Supabase
    const fetchProjects = async () => {
      const { data, error } = await supabase.from('projects').select('*');
      if (data) {
        setProjects(data as Project[]);
      } else if (error) {
        console.error('Error fetching projects:', error.message || error);
      }
    };
    fetchProjects();
  }, [refresh]);

  const advanceStage = async (id: string, current: ProjectStage) => {
    if (current < 6) {
      const { error } = await supabase.from('projects').update({ stage: current + 1 }).eq('id', id);
      if (!error) {
        setRefresh(v => v + 1);
      } else {
        console.error('Error advancing stage:', error.message || error);
      }
    }
  };

  const regressStage = async (id: string, current: ProjectStage) => {
    if (current > 1) {
      const { error } = await supabase.from('projects').update({ stage: current - 1 }).eq('id', id);
      if (!error) {
        setRefresh(v => v + 1);
      } else {
        console.error('Error regressing stage:', error.message || error);
      }
    }
  };

  return (
    <div className="p-8 pb-32">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Control de Proyectos</h1>
          <p className="text-gray-500 mt-1">Supervisa y actualiza el estado de las instalaciones activas.</p>
        </div>
      </header>

      {/* Stats Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Proyectos Activos</p>
            <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">En Trámite CFE</p>
            <p className="text-2xl font-bold text-gray-900">{projects.filter(p => p.stage === 2 || p.stage === 4).length}</p>
          </div>
        </div>
      </div>

      {/* Tabla de Gestión */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 uppercase text-xs font-semibold text-gray-500 tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-4 text-left">Proyecto / Cliente</th>
              <th scope="col" className="px-6 py-4 text-left">Firma</th>
              <th scope="col" className="px-6 py-4 text-center">Etapa Actual</th>
              <th scope="col" className="px-6 py-4 text-center">Gestión Rápida ("WebSocket")</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {projects.map(proj => (
              <motion.tr key={proj.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{proj.clientName}</span>
                    <span className="text-sm text-gray-400">{proj.id} • {proj.installedPowerKW} kWp</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">{new Date(proj.contractDate).toLocaleDateString()}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                    proj.stage === 6 ? 'bg-green-100 text-green-800' : 'bg-brand-amber/10 text-amber-700'
                  }`}>
                    {proj.stage}. {STAGES.find(s => s.id === proj.stage)?.name}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-center items-center gap-2">
                   <button 
                     onClick={() => regressStage(proj.id, proj.stage)}
                     disabled={proj.stage === 1}
                     className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-30 font-medium text-sm transition-colors"
                   >
                     Retroceder
                   </button>
                   <button 
                     onClick={() => advanceStage(proj.id, proj.stage)}
                     disabled={proj.stage === 6}
                     className="px-3 py-1 bg-brand-green text-white rounded-lg hover:bg-emerald-600 disabled:opacity-30 font-bold text-sm shadow-sm transition-colors"
                   >
                     Avanzar Etapa
                   </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
