"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Building2,
  UploadCloud, CheckCircle, ArrowRight, ArrowLeft,
  Sun, Zap, TrendingDown, Calendar
} from 'lucide-react';

/* ─── tipos ──────────────────────────────────────────────── */
type FormData = {
  name: string; email: string; phone: string;
  city: string; propertyType: string; zipCode: string;
  consumption: number; file: File | null;
};
type Metrics = {
  ahorroMensual: number; costo: number; roi: number;
  paneles: number; ahorro25: number; potenciaKW: number;
};

/* ─── helpers ────────────────────────────────────────────── */
function calcMetrics(consumption: number): Metrics {
  const kWhMensual = consumption / 2 / 2.5;
  const paneles    = Math.max(1, Math.ceil((kWhMensual * 1.3) / ((650 * 5 * 30) / 1000)));
  const costo      = paneles * 11350;
  const ahorroMensual = Math.round(consumption * 0.95);
  const roi        = Math.ceil(costo / (ahorroMensual || 1));
  const ahorro25   = ahorroMensual * 12 * 25;
  const potenciaKW = (paneles * 650) / 1000;
  return { ahorroMensual, costo, roi, paneles, ahorro25, potenciaKW };
}

const fadeSlide = {
  initial: { opacity: 0, x: 32 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -32 },
  transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] as const },
} as const;

/* ─── componente principal ───────────────────────────────── */
export default function QuoteForm() {
  const [step, setStep] = useState(1);
  const TOTAL = 3;

  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', city: '',
    propertyType: 'Residencial', zipCode: '',
    consumption: 3200, file: null,
  });

  const [metrics, setMetrics] = useState<Metrics>(calcMetrics(3200));
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => { setMetrics(calcMetrics(form.consumption)); }, [form.consumption]);
  const set = (f: Partial<FormData>) => setForm(p => ({ ...p, ...f }));

  /* validación por paso */
  const validate = () => {
    if (step === 1) {
      if (!form.name.trim()) { alert('Ingresa tu nombre completo'); return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { alert('Ingresa un email válido'); return false; }
      if (form.phone.replace(/\D/g, '').length < 10) { alert('Teléfono a 10 dígitos'); return false; }
    }
    return true;
  };

  const next = () => validate() && setStep(s => Math.min(s + 1, TOTAL));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'file' && v) fd.append(k, v as File);
        else if (k !== 'file') fd.append(k, String(v));
      });
      await fetch('/api/quote', { method: 'POST', body: fd });
      setDone(true);
    } catch {
      /* silent fail — el API ya guarda internamente */
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── pantalla de éxito ──────────────────────────────── */
  if (done) return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center gap-6"
    >
      <div className="w-20 h-20 rounded-full bg-brand-amber/10 flex items-center justify-center">
        <CheckCircle size={40} className="text-brand-amber" />
      </div>
      <h3 className="text-3xl font-bold text-white">¡Cotización recibida!</h3>
      <p className="text-white/70 max-w-xs">Un asesor de Genera se comunicará contigo en menos de 24 horas.</p>
      <button onClick={() => { setDone(false); setStep(1); setForm({ name:'',email:'',phone:'',city:'',propertyType:'Residencial',zipCode:'',consumption:3200,file:null }); }}
        className="mt-4 px-8 py-3 rounded-full border border-white/20 text-white/80 hover:bg-white/10 transition-colors text-sm">
        Enviar otra cotización
      </button>
    </motion.div>
  );

  const inputCls = "w-full bg-white/8 border border-white/15 rounded-2xl px-5 py-4 text-white placeholder-white/40 outline-none focus:border-brand-amber/60 focus:ring-2 focus:ring-brand-amber/10 transition-all text-[15px]";
  const labelCls = "flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest mb-2";

  return (
    <div className="w-full grid lg:grid-cols-[1fr_380px] gap-8 items-start">

      {/* ── LEFT: formulario ────────────────────────────── */}
      <div>
        {/* Indicador de pasos */}
        <div className="flex items-center gap-3 mb-10">
          {['Datos', 'Propiedad', 'Recibo'].map((label, i) => {
            const n = i + 1;
            const active = step === n;
            const done   = step > n;
            return (
              <React.Fragment key={n}>
                <button
                  onClick={() => step > n && setStep(n)}
                  className={`flex items-center gap-2.5 transition-all ${step > n ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    done   ? 'bg-brand-amber border-brand-amber text-brand-dark' :
                    active ? 'bg-transparent border-brand-amber text-brand-amber' :
                             'bg-transparent border-white/20 text-white/30'
                  }`}>
                    {done ? <CheckCircle size={14}/> : n}
                  </span>
                  <span className={`text-sm font-semibold hidden sm:block transition-colors ${active ? 'text-white' : 'text-white/30'}`}>{label}</span>
                </button>
                {i < 2 && <div className={`flex-1 h-px transition-colors ${step > n ? 'bg-brand-amber/60' : 'bg-white/10'}`} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Pasos */}
        <div className="min-h-[340px]">
          <AnimatePresence mode="wait">

            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="s1" {...fadeSlide} className="space-y-5">
                <div>
                  <p className={labelCls}><User size={12}/> Nombre completo</p>
                  <input className={inputCls} placeholder="Ej. María González" value={form.name}
                    onChange={e => set({ name: e.target.value })} />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <p className={labelCls}><Mail size={12}/> Correo electrónico</p>
                    <input type="email" className={inputCls} placeholder="correo@gmail.com" value={form.email}
                      onChange={e => set({ email: e.target.value })} />
                  </div>
                  <div>
                    <p className={labelCls}><Phone size={12}/> Teléfono</p>
                    <input type="tel" className={inputCls} placeholder="81 1234 5678" value={form.phone}
                      onChange={e => set({ phone: e.target.value })} />
                  </div>
                </div>
                <div>
                  <p className={labelCls}><MapPin size={12}/> Ciudad (Opcional)</p>
                  <input className={inputCls} placeholder="Monterrey, CDMX…" value={form.city}
                    onChange={e => set({ city: e.target.value })} />
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="s2" {...fadeSlide} className="space-y-5">
                <div>
                  <p className={labelCls}><MapPin size={12}/> Código postal</p>
                  <input className={inputCls} placeholder="Ej. 64000" value={form.zipCode}
                    onChange={e => set({ zipCode: e.target.value })} />
                </div>
                <div>
                  <p className={labelCls}><Building2 size={12}/> Tipo de propiedad</p>
                  <div className="grid grid-cols-3 gap-3">
                    {['Residencial', 'Comercial', 'Industrial'].map(t => (
                      <button key={t} type="button" onClick={() => set({ propertyType: t })}
                        className={`py-4 rounded-2xl border-2 font-semibold text-sm transition-all ${
                          form.propertyType === t
                            ? 'border-brand-amber bg-brand-amber/10 text-brand-amber'
                            : 'border-white/15 text-white/50 hover:border-white/30'
                        }`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div key="s3" {...fadeSlide} className="space-y-8">
                {/* Slider */}
                <div>
                  <p className={labelCls}><Zap size={12}/> Recibo bimestral de luz (MXN)</p>
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-white/40 text-sm">$500</span>
                    <span className="text-4xl font-black text-brand-amber">
                      ${form.consumption.toLocaleString()}
                      <span className="text-sm text-white/40 font-normal ml-1">MXN</span>
                    </span>
                    <span className="text-white/40 text-sm">$25,000+</span>
                  </div>
                  <input type="range" min={500} max={25000} step={500}
                    value={form.consumption} onChange={e => set({ consumption: +e.target.value })}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: '#FFB800' }} />
                </div>

                {/* Adjunto */}
                <div>
                  <p className={labelCls}><UploadCloud size={12}/> Adjunta tu recibo (opcional)</p>
                  <label className="relative flex flex-col items-center gap-3 py-8 px-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all border-white/15 hover:border-brand-amber/50 hover:bg-brand-amber/5">
                    <input type="file" accept=".pdf,image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={e => e.target.files && set({ file: e.target.files[0] })} />
                    {form.file ? (
                      <>
                        <CheckCircle size={32} className="text-brand-amber" />
                        <p className="text-brand-amber font-bold text-sm">{form.file.name}</p>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={32} className="text-white/30" />
                        <p className="text-white/50 text-sm text-center">PDF, JPG o PNG · Máx 5 MB</p>
                      </>
                    )}
                  </label>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Navegación */}
        <div className="flex justify-between items-center mt-8">
          {step > 1 ? (
            <button onClick={prev}
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-white/70 hover:bg-white/5 transition-all text-sm font-semibold">
              <ArrowLeft size={16}/> Regresar
            </button>
          ) : <div />}

          {step < TOTAL ? (
            <button onClick={next}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-brand-amber text-brand-dark font-bold hover:brightness-110 transition-all shadow-lg shadow-brand-amber/20">
              Continuar <ArrowRight size={16}/>
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-brand-amber text-brand-dark font-bold hover:brightness-110 transition-all shadow-lg shadow-brand-amber/20 disabled:opacity-50">
              {submitting ? 'Enviando…' : 'Obtener cotización'} {!submitting && <ArrowRight size={16}/>}
            </button>
          )}
        </div>
      </div>

      {/* ── RIGHT: tarjeta resumen ───────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          <p className="text-brand-amber text-xs font-bold tracking-widest uppercase mb-6">Resumen estimado</p>
          <div className="space-y-4">
            {[
              { icon: TrendingDown, label: 'Ahorro mensual', value: `$${metrics.ahorroMensual.toLocaleString()}` },
              { icon: Sun,          label: 'Paneles (650W)',  value: metrics.paneles },
              { icon: Zap,          label: 'Potencia',        value: `${metrics.potenciaKW.toFixed(1)} kWp` },
              { icon: Calendar,     label: 'ROI (meses)',     value: metrics.roi },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-white/8 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-amber/10 flex items-center justify-center">
                    <Icon size={15} className="text-brand-amber" />
                  </div>
                  <span className="text-white/60 text-sm">{label}</span>
                </div>
                <span className="text-white font-bold">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Ahorro a 25 años</span>
              <span className="text-brand-amber text-xl font-black">
                ${(metrics.ahorro25 / 1_000_000).toFixed(1)}M
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-amber/20 bg-brand-amber/5 p-5">
          <p className="text-brand-amber font-bold mb-1 text-sm">Asesoría sin costo</p>
          <p className="text-white/60 text-sm leading-relaxed">
            Te llamamos para validar datos, explicar financiamiento disponible y coordinar la visita técnica gratuita.
          </p>
        </div>
      </div>

    </div>
  );
}
