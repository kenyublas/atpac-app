"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCw, Droplets, Truck, CheckCircle2, ArrowRight } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PatioDemoModal({ open, onClose }: ModalProps) {
  const [optimized, setOptimized] = useState(true);

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-5xl bg-[#0f151d] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* CABECERA */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold border border-amber-500/40">
                SOLUCIÓN PATIO LURÍN (HUB 313)
              </span>
              <h2 className="text-sm md:text-base font-bold text-white">
                Layout Celular en U (5S) + Recirculación Agua + API HiVis ↔ Discos
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* INTERRUPTOR COMPARATIVO */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-slate-900/70 border-b border-slate-800 text-xs">
            <div className="flex gap-2">
              <button
                onClick={() => setOptimized(false)}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  !optimized ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                Distribución Actual (Dispersa: 62 m)
              </button>
              <button
                onClick={() => setOptimized(true)}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  optimized ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
                }`}
              >
                Propuesta Layout en U (-40% recorrido: 37 m)
              </button>
            </div>
            <span className="font-mono text-emerald-400 hidden sm:inline">
              CÓD. RETORNO: 999300104 • LIMPIEZA: 920785000
            </span>
          </div>

          {/* CONTENIDO */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-5">
            {/* PLANO CENITAL DEL PATIO */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-mono text-slate-400">
                  VISTA CENITAL DE FLUJO DE MONTACARGAS Y MATERIALES
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    optimized ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                  }`}
                >
                  {optimized ? "37 m lineales (Sin cruces)" : "62 m con flujos cruzados"}
                </span>
              </div>

              <svg viewBox="0 0 460 250" className="w-full h-[230px] bg-[#0a0e14] rounded-lg border border-slate-800/80">
                {/* Ruta de flujo */}
                <path
                  d={
                    optimized
                      ? "M 75 55 L 75 185 L 230 205 L 385 185 L 385 55"
                      : "M 70 50 L 370 190 L 110 195 L 380 55 L 230 125"
                  }
                  fill="none"
                  stroke={optimized ? "#10b981" : "#ef4444"}
                  strokeWidth="4"
                  strokeLinecap="round"
                  className={optimized ? "animate-flow-fast" : "animate-flow-slow"}
                />

                {/* Estación 1: Arribo / Preinspección */}
                <g transform="translate(75, 55)">
                  <rect x="-52" y="-20" width="104" height="40" rx="6" fill="#1e293b" stroke="#64748b" />
                  <text x="0" y="-2" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">1. Arribo / Heijunka</text>
                  <text x="0" y="11" textAnchor="middle" fill="#94a3b8" fontSize="7.5">
                    {optimized ? "Ventanas horarias" : "Lotes simultáneos"}
                  </text>
                </g>

                {/* Estación 2: Hidrolavado + Cisterna */}
                <g transform={optimized ? "translate(75, 185)" : "translate(370, 190)"}>
                  <rect x="-56" y="-20" width="112" height="40" rx="6" fill="#0c4a6e" stroke="#38bdf8" />
                  <text x="0" y="-2" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">2. Hidrolavado</text>
                  <text x="0" y="11" textAnchor="middle" fill="#7dd3fc" fontSize="7.5">
                    {optimized ? "Agua recirculada" : "Cola 35m + Cisterna"}
                  </text>
                </g>

                {/* Estación 3: Atlas Copco + Rama A/B */}
                <g transform={optimized ? "translate(230, 205)" : "translate(110, 195)"}>
                  <rect x="-62" y="-20" width="124" height="40" rx="6" fill="#064e3b" stroke="#34d399" />
                  <text x="0" y="-2" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">3. Plank & Fenólicos</text>
                  <text x="0" y="11" textAnchor="middle" fill="#6ee7b7" fontSize="7.5">
                    {optimized ? "Celda 5S integrada" : "Atlas Copco / CP7748"}
                  </text>
                </g>

                {/* Estación 4: Racks y Despacho */}
                <g transform="translate(385, 55)">
                  <rect x="-54" y="-20" width="108" height="40" rx="6" fill="#3b0764" stroke="#c084fc" />
                  <text x="0" y="-2" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">4. Racks & Despacho</text>
                  <text x="0" y="11" textAnchor="middle" fill="#e9d5ff" fontSize="7.5">
                    {optimized ? "API HiVis ↔ Discos" : "Doble digitación 20m"}
                  </text>
                </g>
              </svg>
            </div>

            {/* 4 PILARES DE MEJORA EN PATIO */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                  <Truck className="w-4 h-4" /> 1. Layout Celular en U + 5S
                </div>
                <p className="text-[11px] text-slate-300">
                  Agrupa recepción, lavado, desincrustado Atlas Copco y taller de fenólicos en secuencia continua, recortando el acarreo de <strong>62 m a 37 m (-40%)</strong>.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-400 mb-1">
                  <RefreshCw className="w-4 h-4" /> 2. Puente API HiVis ↔ ERP Discos (Poka-Yoke)
                </div>
                <p className="text-[11px] text-slate-300">
                  Sincroniza automáticamente el escaneo en patio con el inventario contable, eliminando los <strong>20 min de doble registro</strong> por lote.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400 mb-1">
                  <Droplets className="w-4 h-4" /> 3. Recirculación de Agua + Nivelación Heijunka
                </div>
                <p className="text-[11px] text-slate-300">
                  Sedimentación y filtrado para reutilizar agua de hidrolavado en Lurín, más ventanas horarias de retorno desde obra para evitar colas de <strong>35 min</strong>.
                </p>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Impacto directo en Pareto
                </span>
                <span className="font-mono font-bold text-white flex items-center gap-1">
                  -400 h/mes improductivas <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}