"use client";

import React, { useEffect, useState } from 'react';
import { Project, EnergyRecord } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import CountUp from 'react-countup';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { FileText, Download, CheckCircle, Zap, DollarSign, Leaf, Activity } from 'lucide-react';

const STAGES = [
  { id: 1, name: "Firma" },
  { id: 2, name: "Permisos CFE" },
  { id: 3, name: "Aprobación" },
  { id: 4, name: "Instalación" },
  { id: 5, name: "Inspección" },
  { id: 6, name: "Sistema Activo" }
];

export default function DashboardPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [energyData, setEnergyData] = useState<EnergyRecord[]>([]);

  useEffect(() => {
    // 1. Cargar el ID del proyecto desde local storage (Simulación Auth)
    const projectId = localStorage.getItem('genera_active_project') || 'PROJ-1002';
    
    // 2. Fetch inicial de Proyecto (Supabase) y Energía (Mock por ahora)
    const fetchData = async () => {
      const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).single();
      if (data) {
        setProject(data as Project);
      } else if (error) {
        console.error('Error fetching project:', error.message || error);
      }
      
      // Fetch de datos de energía
      const { data: energy, error: energyError } = await supabase
        .from('energy_records')
        .select('*')
        .eq('project_id', projectId);
        
      if (energy) {
        setEnergyData(energy as EnergyRecord[]);
      } else if (energyError) {
        console.error('Error fetching energy records:', energyError.message || energyError);
      }
    };

    fetchData();

    // 3. Suscribirse a cambios en tiempo real con Supabase Realtime
    const channel = supabase
      .channel(`public:projects:id=eq.${projectId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'projects', filter: `id=eq.${projectId}` },
        (payload) => {
          setProject(payload.new as Project);
        }
      )
      .subscribe();

    return () => {
       supabase.removeChannel(channel);
    };
  }, []);

  if (!project) return <div className="p-12 text-center text-gray-500">Cargando datos del proyecto...</div>;

  const kpiData = {
    totalSavings: energyData.reduce((acc, curr) => acc + curr.savingsMXN, 0),
    totalGenerated: energyData.reduce((acc, curr) => acc + curr.generatedKWh, 0),
    co2Saved: energyData.reduce((acc, curr) => acc + (curr.generatedKWh * 0.4), 0), // 0.4 kg CO2 per KWh (aprox)
    performance: 98.4
  };

  return (
    <div className="flex-1 w-full bg-gray-50 p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8 pb-32">
        
        {/* Cabecera */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hola, {project.clientName}</h1>
          <p className="text-gray-500 mt-1">Este es el panel de control de tu sistema solar de {project.installedPowerKW} kWp</p>
        </div>

        {/* 1. TIMELINE ANIMADO (ESTADO DEL PROYECTO EN TIEMPO REAL) */}
        <section className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold shadow-sm border border-green-100">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             En Vivo
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-8">Estado de tu Proyecto</h2>
          
          <div className="relative flex justify-between items-center w-full">
            {/* Barra de progreso en el fondo */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 w-full rounded-full z-0" />
            <motion.div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-green rounded-full z-0"
              initial={{ width: 0 }}
              animate={{ width: `${((project.stage - 1) / (STAGES.length - 1)) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />

            {/* Puntos de cada etapa */}
            {STAGES.map((stage, idx) => {
              const isActive = project.stage >= stage.id;
              const isCurrent = project.stage === stage.id;
              
              return (
                <div key={stage.id} className="relative z-10 flex flex-col items-center">
                   <motion.div 
                     initial={{ scale: 0.8 }}
                     animate={{ 
                       scale: isActive ? 1 : 0.8,
                       backgroundColor: isActive ? '#10b981' : '#f3f4f6',
                       borderColor: isActive ? '#10b981' : '#e5e7eb',
                     }}
                     className={`w-8 h-8 md:w-12 md:h-12 rounded-full border-4 flex items-center justify-center transition-colors duration-500 shadow-sm`}
                   >
                     {isActive && <CheckCircle size={18} className="text-white" />}
                   </motion.div>
                   <span className={`absolute top-14 text-xs md:text-sm font-semibold text-center w-24 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                     {stage.name}
                   </span>
                   {isCurrent && (
                     <motion.div 
                       layoutId="indicator" 
                       className="absolute -bottom-8 w-2 h-2 rounded-full bg-brand-green" 
                       initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                     />
                   )}
                </div>
              );
            })}
          </div>
          
          {/* Espaciador para los textos absolutos */}
          <div className="h-12 w-full mt-4" />
        </section>

        {/* 2. KPIs ANIMADOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Ahorro Total" value={kpiData.totalSavings} prefix="$" icon={<DollarSign size={20} />} color="text-brand-green" bg="bg-brand-green/10" />
          <KpiCard title="Energía Generada" value={kpiData.totalGenerated} suffix=" kWh" icon={<Zap size={20} />} color="text-amber-500" bg="bg-amber-100" />
          <KpiCard title="CO₂ Evitado" value={kpiData.co2Saved} suffix=" kg" icon={<Leaf size={20} />} color="text-emerald-500" bg="bg-emerald-100" />
          <KpiCard title="Rendimiento del Sistema" value={kpiData.performance} suffix="%" icon={<Activity size={20} />} color="text-blue-500" bg="bg-blue-100" decimals={1} />
        </div>

        {/* 3. GRÁFICAS INTERACTIVAS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 mb-6">Generación vs Estimación (kWh)</h3>
             {energyData.length > 0 ? (
               <div className="h-72 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={energyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorGenerated" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                         <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorEstimated" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#9ca3af" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                     <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                     <Legend verticalAlign="top" height={36} iconType="circle" />
                     <Area type="monotone" dataKey="estimatedKWh" name="Estimación" stroke="#9ca3af" strokeWidth={2} fillOpacity={1} fill="url(#colorEstimated)" />
                     <Area type="monotone" dataKey="generatedKWh" name="Energía Real" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorGenerated)" />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
             ) : (
               <div className="h-72 w-full flex items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                 <p className="text-gray-400 font-medium">No hay registros suficientes todavía.</p>
               </div>
             )}
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 mb-6">Ahorro Económico CFE</h3>
             {energyData.length > 0 ? (
               <div className="h-72 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={energyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} tickFormatter={(value) => `$${value}`} />
                     <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                     <Bar dataKey="savingsMXN" name="Ahorro Real (MXN)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             ) : (
               <div className="h-72 w-full flex items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                 <p className="text-gray-400 font-medium">Ahorros visibles a partir del primer bimestre conectado.</p>
               </div>
             )}
          </section>
        </div>

        {/* 4. DOCUMENTOS DESCARGABLES */}
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Documentación Oficial</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <DocCard title="Contrato Firmado" status="Disponible" locked={false} />
             <DocCard title="Garantía de Paneles" status="Disponible" locked={false} />
             <DocCard title="Permiso CFE" status={project.stage >= 2 ? "Disponible" : "En Trámite"} locked={project.stage < 2} />
             <DocCard title="Interconexión CFE" status={project.stage >= 5 ? "Disponible" : "Pendiente"} locked={project.stage < 5} />
          </div>
        </section>

      </div>
    </div>
  );
}

// === COMPONENTES AUXILIARES LOCALES ===

function KpiCard({ title, value, prefix = "", suffix = "", icon, color, bg, decimals = 0 }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-sm font-semibold text-gray-500">{title}</h4>
        <div className={`${bg} ${color} p-2 rounded-lg`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold text-gray-900 flex items-baseline">
        {prefix}
        <CountUp end={value} duration={2.5} separator="," decimals={decimals} />
        <span className="text-sm text-gray-500 ml-1 font-medium">{suffix}</span>
      </div>
    </div>
  );
}

function DocCard({ title, status, locked }: { title: string, status: string, locked: boolean }) {
  return (
    <div className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${locked ? 'bg-gray-50 border-gray-200 border-dashed' : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-brand-green/30 cursor-pointer'}`}>
       <div className="flex items-center gap-3">
         <div className={`p-3 rounded-xl ${locked ? 'bg-gray-100 text-gray-400' : 'bg-brand-green/10 text-brand-green'}`}>
           <FileText size={20} />
         </div>
         <div>
           <p className={`font-semibold text-sm ${locked ? 'text-gray-400' : 'text-gray-900'}`}>{title}</p>
           <p className={`text-xs mt-0.5 ${locked ? 'text-amber-500 font-medium' : 'text-emerald-500 font-medium'}`}>{status}</p>
         </div>
       </div>
       {!locked && (
         <button className="text-gray-400 hover:text-brand-green">
           <Download size={18} />
         </button>
       )}
    </div>
  );
}
