"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  GitMerge,
  Layers,
  Workflow,
  CircleDot,
  Network,
  Play,
  RotateCcw,
  Maximize2,
  Minimize2,
  CheckSquare,
} from "lucide-react";

interface DashProps {
  activeTab: "PARETO" | "DAP" | "ISHIKAWA";
  setActiveTab: (t: "PARETO" | "DAP" | "ISHIKAWA") => void;
  mode: "AS-IS" | "TO-BE";
  zone: "COMERCIAL" | "PATIO";
}

type ExtendedTab = "MAPA" | "DOP" | "DAP" | "BPMN" | "PARETO" | "ISHIKAWA" | "KPIS";

const DAP_COMERCIAL = [
  { id: 1, act: "Recepción solicitud (correo/llamada)", time: 15, sym: "O" },
  { id: 2, act: "Espera en bandeja comercial", time: 120, sym: "D" },
  { id: 3, act: "Envío digital a Créditos (CCM)", time: 5, sym: "T" },
  { id: 4, act: "Cola espera evaluación crediticia", time: 180, sym: "D" },
  { id: 5, act: "Consulta riesgo en Equifax (CCM)", time: 20, sym: "I" },
  { id: 8, act: "Cola espera bandeja Ingeniería", time: 240, sym: "D" },
  { id: 9, act: "Elaboración plano CAD/BIM (900100000)", time: 60, sym: "O" },
  { id: 11, act: "Búsqueda manual códigos en ERP Discos", time: 45, sym: "O" },
  { id: 13, act: "Generación propuesta PDF / Excel", time: 20, sym: "O" },
  { id: 16, act: "Tiempo revisión y respuesta cliente", time: 1440, sym: "D" },
  { id: 17, act: "Archivo cotización en ERP Discos", time: 5, sym: "A" },
];

const DAP_PATIO = [
  { id: 1, act: "Recepción y descarga (Cód. 999300104)", time: 20, sym: "O" },
  { id: 2, act: "Control visual inicial de daños", time: 10, sym: "I" },
  { id: 3, act: "Traslado a estación hidrolavado (15m)", time: 6, sym: "T" },
  { id: 4, act: "Espera por cola en hidrolavadoras", time: 35, sym: "D" },
  { id: 5, act: "Lavado alta presión (agua cisterna)", time: 30, sym: "O" },
  { id: 6, act: "Desincrustado neumático Atlas Copco", time: 40, sym: "O" },
  { id: 9, act: "Limpieza en Molino tipo Plank", time: 25, sym: "O" },
  { id: 12, act: "Recambio panel fenólico (CP7748)", time: 30, sym: "O" },
  { id: 14, act: "Enzunchado y empaquetado en Racks", time: 15, sym: "O" },
  { id: 17, act: "Doble registro manual HiVis + Discos", time: 20, sym: "D" },
  { id: 18, act: "Almacenamiento stock certificado", time: 0, sym: "A" },
];

const PARETO_DATA = [
  { label: "Comercial/CCM", hours: 420, pct: 42, acc: 42, zone: "COMERCIAL" },
  { label: "Hidrolavado", hours: 240, pct: 24, acc: 66, zone: "PATIO" },
  { label: "HiVis/Discos", hours: 160, pct: 16, acc: 82, zone: "PATIO" },
  { label: "Layout 62m", hours: 100, pct: 10, acc: 92, zone: "PATIO" },
  { label: "Agua Cisterna", hours: 80, pct: 8, acc: 100, zone: "PATIO" },
];

export default function EngineeringDashboards({ mode, zone }: DashProps) {
  const [tab, setTab] = useState<ExtendedTab>("MAPA");
  const [expanded, setExpanded] = useState(false);
  const [simStep, setSimStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  const isToBe = mode === "TO-BE";
  const isComercial = zone === "COMERCIAL";
  const rows = isComercial ? DAP_COMERCIAL : DAP_PATIO;
  const symIndex: Record<string, number> = { O: 0, T: 1, D: 2, I: 3, A: 4 };

  useEffect(() => {
    setSimStep(0);
    setIsSimulating(true);
  }, [tab, zone, mode]);

  useEffect(() => {
    if (!isSimulating) return;
    const speed = isToBe ? 450 : 750;
    const timer = setInterval(() => {
      setSimStep((prev) => (prev >= rows.length - 1 ? 0 : prev + 1));
    }, speed);
    return () => clearInterval(timer);
  }, [isSimulating, isToBe, rows.length]);

  // Cerrar pantalla completa con ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expanded) setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const svgContainerHeight = expanded ? "h-[calc(100vh-155px)]" : "h-[265px]";
  const rowHeight = expanded ? 40 : 26;

  return (
    <div
      className={`${
        expanded
          ? "fixed inset-3 md:inset-6 z-50 shadow-2xl border-emerald-500/60"
          : "w-full h-full relative border-slate-800"
      } flex flex-col bg-[#0f151d] border rounded-2xl p-4 md:p-5 transition-all`}
    >
      {/* BARRA SUPERIOR DE DIAGRAMAS */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "MAPA", label: "Mapa & PEPSC", icon: Network },
            { id: "DOP", label: "DOP", icon: CircleDot },
            { id: "DAP", label: "DAP", icon: Layers },
            { id: "BPMN", label: "BPMN", icon: Workflow },
            { id: "PARETO", label: "Pareto", icon: BarChart3 },
            { id: "ISHIKAWA", label: "Ishikawa", icon: GitMerge },
            { id: "KPIS", label: "KPIs", icon: CheckSquare },
          ].map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id as ExtendedTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  active
                    ? "bg-emerald-500 text-slate-950 shadow"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded ${
              isComercial
                ? "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
            }`}
          >
            {isComercial ? "FRENTE 01: COMERCIAL" : "FRENTE 02: PATIO LURÍN"}
          </span>

          {(tab === "DOP" || tab === "DAP" || tab === "BPMN") && (
            <button
              onClick={() => {
                setSimStep(0);
                setIsSimulating(!isSimulating);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono font-bold hover:bg-emerald-500/25 cursor-pointer"
            >
              {isSimulating ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isSimulating ? "LIVE" : "SIMULAR"}
            </button>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold cursor-pointer"
            title={expanded ? "Reducir (ESC)" : "Ampliar centrado"}
          >
            {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            {expanded && <span className="hidden sm:inline">Cerrar (ESC)</span>}
          </button>
        </div>
      </div>

      {/* CONTENIDO CENTRADO Y RESPONSIVO */}
      <div className="flex-1 pt-3 overflow-y-auto flex flex-col justify-center">
        {tab === "KPIS" && (
          <div className={`w-full ${expanded ? "max-w-5xl mx-auto" : ""} space-y-2.5`}>
            <div className="flex items-center justify-between">
              <h3 className={`${expanded ? "text-lg" : "text-sm"} font-bold text-white`}>
                Indicadores de Control y Seguimiento (Tabla 4 del Proyecto)
              </h3>
              <span className="text-xs font-mono text-emerald-400">CONTROL LEAN / TPS</span>
            </div>

            <div className="space-y-2">
              {[
                {
                  kpi: "1. Tiempo de respuesta comercial",
                  formula: "Tiempo envío cotización − Tiempo recepción solicitud",
                  asIs: "36.5 horas",
                  toBe: "< 2 horas (-94%)",
                },
                {
                  kpi: "2. % de solicitudes atendidas",
                  formula: "(Solicitudes atendidas / Solicitudes recibidas) × 100",
                  asIs: "68% (Saturación)",
                  toBe: "98% (24/7 con IA)",
                },
                {
                  kpi: "3. Tiempo de reacondicionamiento",
                  formula: "Hora finalización − Hora inicio del proceso en Yard",
                  asIs: "261 min / lote",
                  toBe: "185 min / lote",
                },
                {
                  kpi: "4. % de componentes observados",
                  formula: "(Componentes observados / Total inspeccionados) × 100",
                  asIs: "Sin control en obra",
                  toBe: "Preinspección HiVis",
                },
                {
                  kpi: "5. Tiempo preparación para despacho",
                  formula: "Hora disponibilidad despacho − Hora recepción material",
                  asIs: "Desfase 20m doble reg.",
                  toBe: "Tiempo real (API)",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{item.kpi}</div>
                    <div className="text-[10px] font-mono text-slate-400">{item.formula}</div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                      AS-IS: {item.asIs}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                      TO-BE: {item.toBe}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* 0. MAPA DE PROCESOS + PEPSC */}
        {tab === "MAPA" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full ${expanded ? "max-w-5xl mx-auto space-y-4" : "space-y-2.5"}`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`${expanded ? "text-lg" : "text-sm"} font-bold text-white`}>
                Mapa de Procesos — AT-PAC PERÚ S.A.C.
              </h3>
              <span className="text-xs font-mono text-emerald-400">ENFOQUE: SISTEMA ABIERTO</span>
            </div>

            <div className={`grid grid-cols-12 gap-2 bg-slate-950 ${expanded ? "p-5" : "p-2.5"} rounded-xl border border-slate-800`}>
              <div className="col-span-1 bg-blue-950/90 border border-blue-700/50 rounded-lg flex items-center justify-center p-1">
                <span className={`[writing-mode:vertical-rl] rotate-180 ${expanded ? "text-xs" : "text-[9px]"} font-bold tracking-wider text-blue-200 uppercase text-center`}>
                  Necesidades del Cliente
                </span>
              </div>

              <div className={`col-span-10 ${expanded ? "space-y-4" : "space-y-2"}`}>
                <div className={`bg-emerald-950/50 border border-emerald-600/50 rounded-lg ${expanded ? "p-3.5" : "p-2"}`}>
                  <div className={`${expanded ? "text-xs mb-2.5" : "text-[9px] mb-1.5"} font-extrabold text-emerald-400 text-center tracking-wider`}>
                    PE. PROCESOS ESTRATÉGICOS
                  </div>
                  <div className={`grid grid-cols-2 gap-2 ${expanded ? "text-xs" : "text-[9px]"}`}>
                    <div className="bg-slate-900/90 border border-emerald-500/30 rounded px-3 py-1.5 text-slate-200">
                      <strong className="text-emerald-400">PE01.</strong> Gestión del Planeamiento
                    </div>
                    <div className="bg-slate-900/90 border border-emerald-500/30 rounded px-3 py-1.5 text-slate-200">
                      <strong className="text-emerald-400">PE02.</strong> Calidad y SST (OSHA/ANSI)
                    </div>
                    <div className="bg-slate-900/90 border border-emerald-500/30 rounded px-3 py-1.5 text-slate-200">
                      <strong className="text-emerald-400">PE03.</strong> Gestión Corporativa (Umdasch)
                    </div>
                    <div className="bg-slate-900/90 border border-emerald-500/30 rounded px-3 py-1.5 text-slate-200">
                      <strong className="text-emerald-400">PE04.</strong> Gestión de Mejora Continua
                    </div>
                  </div>
                </div>

                <div className={`bg-rose-950/40 border border-rose-600/50 rounded-lg ${expanded ? "p-3.5" : "p-2"}`}>
                  <div className={`${expanded ? "text-xs mb-2.5" : "text-[9px] mb-1.5"} font-extrabold text-rose-400 text-center tracking-wider`}>
                    PM. PROCESOS MISIONALES (CADENA DE VALOR)
                  </div>
                  <div className={`grid grid-cols-2 gap-2 ${expanded ? "text-xs" : "text-[9px]"}`}>
                    <div
                      className={`rounded px-3 py-2 border transition-all ${
                        isComercial
                          ? "bg-rose-500/25 border-rose-400 text-white shadow-md"
                          : "bg-slate-900/80 border-slate-800 text-slate-400"
                      }`}
                    >
                      <strong className="text-rose-400">PM01.</strong> Gestión Comercial y Requerimientos
                    </div>
                    <div
                      className={`rounded px-3 py-2 border transition-all ${
                        !isComercial
                          ? "bg-rose-500/25 border-rose-400 text-white shadow-md"
                          : "bg-slate-900/80 border-slate-800 text-slate-400"
                      }`}
                    >
                      <strong className="text-rose-400">PM02.</strong> Recepción, Clasificación y Lavado
                    </div>
                    <div
                      className={`rounded px-3 py-2 border transition-all ${
                        !isComercial
                          ? "bg-rose-500/25 border-rose-400 text-white shadow-md"
                          : "bg-slate-900/80 border-slate-800 text-slate-400"
                      }`}
                    >
                      <strong className="text-rose-400">PM03.</strong> Mantenimiento y Reparación (Yard)
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 rounded px-3 py-2 text-slate-300">
                      <strong className="text-rose-400">PM04.</strong> Control Calidad, Almacén y Despacho
                    </div>
                  </div>
                </div>

                <div className={`bg-sky-950/40 border border-sky-600/50 rounded-lg ${expanded ? "p-3.5" : "p-2"}`}>
                  <div className={`${expanded ? "text-xs mb-2.5" : "text-[9px] mb-1.5"} font-extrabold text-sky-400 text-center tracking-wider`}>
                    PA. PROCESOS DE APOYO
                  </div>
                  <div className={`grid grid-cols-3 gap-1.5 ${expanded ? "text-xs" : "text-[8.5px]"}`}>
                    <div className="bg-slate-900/90 border border-sky-500/20 rounded p-1.5 text-slate-300">
                      <strong className="text-sky-400">PA01.</strong> Finanzas / CCM
                    </div>
                    <div className="bg-slate-900/90 border border-sky-500/20 rounded p-1.5 text-slate-300">
                      <strong className="text-sky-400">PA02.</strong> Logística Lurín
                    </div>
                    <div className="bg-slate-900/90 border border-sky-500/20 rounded p-1.5 text-slate-300">
                      <strong className="text-sky-400">PA03.</strong> Gestión Humana
                    </div>
                    <div className="bg-slate-900/90 border border-sky-500/20 rounded p-1.5 text-slate-300">
                      <strong className="text-sky-400">PA04.</strong> TI (ERP / HiVis)
                    </div>
                    <div className="bg-slate-900/90 border border-sky-500/20 rounded p-1.5 text-slate-300">
                      <strong className="text-sky-400">PA05.</strong> Mantenimiento
                    </div>
                    <div className="bg-slate-900/90 border border-sky-500/20 rounded p-1.5 text-slate-300">
                      <strong className="text-sky-400">PA06.</strong> Inventarios
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-1 bg-blue-950/90 border border-blue-700/50 rounded-lg flex items-center justify-center p-1">
                <span className={`[writing-mode:vertical-rl] ${expanded ? "text-xs" : "text-[9px]"} font-bold tracking-wider text-blue-200 uppercase text-center`}>
                  Productos / Servicios
                </span>
              </div>
            </div>

            <div className={`grid grid-cols-5 gap-2 ${expanded ? "text-xs p-3" : "text-[9px] p-2"} bg-slate-900/70 rounded-xl border border-slate-800 text-center`}>
              <div><strong className="text-sky-400">P:</strong> Umdasch, Equifax</div>
              <div><strong className="text-indigo-400">E:</strong> CAD, Lotes 999300104</div>
              <div><strong className="text-emerald-400">P:</strong> Cotizar + Reacondic.</div>
              <div><strong className="text-amber-400">S:</strong> Andamio Certificado</div>
              <div><strong className="text-rose-400">C:</strong> 93 Clientes (TOP/Oc/Es)</div>
            </div>
          </motion.div>
        )}

        {/* 1. DOP ASME CENTRADO Y ESCALABLE */}
        {tab === "DOP" && (
          <div className="w-full h-full flex flex-col justify-center space-y-2">
            <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
              <h3 className={`${expanded ? "text-lg" : "text-sm"} font-bold text-white`}>
                {isComercial
                  ? "DOP 1: Subproceso Comercial (4 ○ • 3 □)"
                  : "DOP 2: Reacondicionamiento Yard (6 ○ • 5 □)"}
              </h3>
              <span className="text-xs font-mono text-emerald-400">SIMULACIÓN ACTIVA</span>
            </div>

            {isComercial ? (
              <svg
                viewBox="0 0 460 280"
                preserveAspectRatio="xMidYMid meet"
                className={`w-full ${svgContainerHeight} bg-slate-950 border border-slate-800 rounded-xl p-3`}
              >
                <line x1="110" y1="22" x2="110" y2="255" stroke="#334155" strokeWidth="2" />
                {[
                  { y: 26, type: "O", n: "1", text: "Recepción e ingreso manual de datos" },
                  { y: 64, type: "I", n: "1", text: "Consulta y validación en Equifax (CCM)" },
                  { y: 102, type: "O", n: "2", text: "Elaboración plano CAD/BIM y despiece" },
                  { y: 140, type: "O", n: "3", text: "Búsqueda manual códigos en Discos" },
                  { y: 178, type: "I", n: "2", text: "Revisión de precios, margen y stock" },
                  { y: 216, type: "O", n: "4", text: "Generación cotización en PDF / Excel" },
                  { y: 252, type: "I", n: "3", text: "Control final y envío al cliente" },
                ].map((step, i) => {
                  const active = simStep % 7 === i;
                  return (
                    <g key={i}>
                      {active && (
                        <circle cx="110" cy={step.y} r="18" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.7" />
                      )}
                      {step.type === "O" ? (
                        <circle cx="110" cy={step.y} r="12" fill={active ? "#10b981" : "#064e3b"} stroke="#34d399" strokeWidth="1.5" />
                      ) : (
                        <rect x="98" y={step.y - 12} width="24" height="24" fill={active ? "#a855f7" : "#4c1d95"} stroke="#c084fc" strokeWidth="1.5" />
                      )}
                      <text x="110" y={step.y + 3} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">
                        {step.n}
                      </text>
                      <text x="138" y={step.y + 3} fill={active ? "#34d399" : "#cbd5e1"} fontSize="9.5" fontWeight={active ? "bold" : "normal"}>
                        {step.text}
                      </text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              <svg
                viewBox="0 0 460 280"
                preserveAspectRatio="xMidYMid meet"
                className={`w-full ${svgContainerHeight} bg-slate-950 border border-slate-800 rounded-xl p-3`}
              >
                <line x1="230" y1="18" x2="230" y2="125" stroke="#475569" strokeWidth="1.5" />
                {[
                  { y: 22, type: "O", n: "1", text: "Descarga lotes retornados (999300104)" },
                  { y: 54, type: "I", n: "1", text: "Inspección visual inicial de daños" },
                  { y: 86, type: "O", n: "2", text: "Lavado industrial alta presión" },
                  { y: 118, type: "O", n: "3", text: "Desincrustado neumático Atlas Copco" },
                ].map((s, i) => {
                  const active = simStep % 6 === i;
                  return (
                    <g key={i}>
                      {s.type === "O" ? (
                        <circle cx="230" cy={s.y} r="11" fill={active ? "#10b981" : "#065f46"} stroke="#34d399" strokeWidth="1.5" />
                      ) : (
                        <rect x="219" y={s.y - 11} width="22" height="22" fill={active ? "#a855f7" : "#4c1d95"} stroke="#c084fc" strokeWidth="1.5" />
                      )}
                      <text x="230" y={s.y + 3} textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="bold">{s.n}</text>
                      <text x="250" y={s.y + 3} fill={active ? "#34d399" : "#e2e8f0"} fontSize="8.5" fontWeight={active ? "bold" : "normal"}>
                        {s.text}
                      </text>
                    </g>
                  );
                })}

                <path d="M 230 130 L 115 145 L 115 215 L 230 230" fill="none" stroke="#38bdf8" strokeWidth="1.5" className="animate-flow-fast" />
                <path d="M 230 130 L 345 145 L 345 215 L 230 230" fill="none" stroke="#f59e0b" strokeWidth="1.5" className="animate-flow-fast" />

                <circle cx="115" cy="160" r="11" fill={simStep % 6 === 4 ? "#10b981" : "#065f46"} stroke="#34d399" strokeWidth="1.5" />
                <text x="115" y="163" textAnchor="middle" fill="#fff" fontSize="8">4A</text>
                <text x="15" y="163" fill="#7dd3fc" fontSize="8">Molino Plank</text>
                <rect x="104" y="185" width="22" height="22" fill="#4c1d95" stroke="#c084fc" strokeWidth="1.5" />
                <text x="115" y="199" textAnchor="middle" fill="#fff" fontSize="8">3A</text>
                <text x="15" y="199" fill="#cbd5e1" fontSize="8">Prueba Acople</text>

                <circle cx="345" cy="160" r="11" fill={simStep % 6 === 4 ? "#10b981" : "#065f46"} stroke="#34d399" strokeWidth="1.5" />
                <text x="345" y="163" textAnchor="middle" fill="#fff" fontSize="8">4B</text>
                <text x="364" y="163" fill="#fcd34d" fontSize="8">Panel Fenólico</text>
                <rect x="334" y="185" width="22" height="22" fill="#4c1d95" stroke="#c084fc" strokeWidth="1.5" />
                <text x="345" y="199" textAnchor="middle" fill="#fff" fontSize="8">3B</text>
                <text x="364" y="199" fill="#cbd5e1" fontSize="8">Nivelación</text>

                <circle cx="230" cy="242" r="11" fill={simStep % 6 === 5 ? "#10b981" : "#065f46"} stroke="#34d399" strokeWidth="1.5" />
                <text x="230" y="245" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="bold">5</text>
                <text x="248" y="245" fill="#e2e8f0" fontSize="8.5">Enzunchado y Racks Doka</text>
              </svg>
            )}
          </div>
        )}

        {/* 2. DAP ASME CENTRADO (PROPORCIONES CORRECTAS EN PANTALLA COMPLETA) */}
        {tab === "DAP" && (
          <div className={`w-full ${expanded ? "max-w-5xl mx-auto" : ""} space-y-2.5`}>
            <div className="flex items-center justify-between">
              <h3 className={`${expanded ? "text-lg" : "text-sm"} font-bold text-white`}>
                {isComercial ? "DAP 01: Comercial (2,000 min)" : "DAP 02: Patio Lurín (261 min)"}
              </h3>
              <span className="text-xs font-mono text-rose-400">
                {isToBe ? "DEMORAS ELIMINADAS (TO-BE)" : isComercial ? "4 DEMORAS = 1,980 MIN" : "2 DEMORAS = 55 MIN"}
              </span>
            </div>

            <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className={`grid grid-cols-12 bg-slate-900 ${expanded ? "text-xs py-2.5 px-4" : "text-[10px] py-1.5 px-2"} font-mono text-slate-300 border-b border-slate-800`}>
                <div className="col-span-6">ACTIVIDAD</div>
                <div className="col-span-2 text-center">MIN</div>
                <div className="col-span-4 grid grid-cols-5 text-center font-bold">
                  <span>○</span>
                  <span>⇒</span>
                  <span className="text-rose-400">D</span>
                  <span>□</span>
                  <span>▽</span>
                </div>
              </div>

              <div className="relative">
                <svg
                  viewBox={`0 0 100 ${rows.length * rowHeight}`}
                  preserveAspectRatio="none"
                  className="absolute right-0 top-0 w-[33.33%] h-full pointer-events-none"
                >
                  <polyline
                    fill="none"
                    stroke={isToBe ? "#10b981" : "#38bdf8"}
                    strokeWidth={expanded ? "0.9" : "1.4"}
                    points={rows
                      .map((r, i) => {
                        const eff = isToBe && r.sym === "D" ? "O" : r.sym;
                        return `${symIndex[eff] * 20 + 10},${i * rowHeight + rowHeight / 2}`;
                      })
                      .join(" ")}
                  />
                </svg>

                {rows.map((r, idx) => {
                  const isDelay = r.sym === "D";
                  const eff = isToBe && isDelay ? "O" : r.sym;
                  const isCurrent = simStep === idx;
                  return (
                    <div
                      key={r.id}
                      style={{ height: `${rowHeight}px` }}
                      className={`grid grid-cols-12 items-center ${expanded ? "px-4 text-xs" : "px-2 text-[10px]"} border-b border-slate-900 transition-colors ${
                        isCurrent
                          ? "bg-emerald-500/20"
                          : isDelay && !isToBe
                          ? "bg-rose-950/25"
                          : ""
                      }`}
                    >
                      <div className="col-span-6 truncate text-slate-200 pr-2">
                        <span className="text-slate-500 font-mono mr-1.5">{r.id}.</span>
                        {r.act}
                      </div>
                      <div
                        className={`col-span-2 text-center font-mono font-bold ${
                          isDelay && !isToBe ? "text-rose-400" : "text-slate-400"
                        }`}
                      >
                        {isToBe && isDelay ? "0" : r.time}
                      </div>
                      <div className="col-span-4 grid grid-cols-5 items-center justify-items-center">
                        {["O", "T", "D", "I", "A"].map((colSym) => (
                          <span
                            key={colSym}
                            className={`rounded-full transition-all ${
                              eff === colSym
                                ? isCurrent
                                  ? "w-3.5 h-3.5 bg-white ring-4 ring-emerald-400"
                                  : isDelay && !isToBe
                                  ? "w-3 h-3 bg-rose-500"
                                  : "w-3 h-3 bg-emerald-400"
                                : "w-2 h-2 bg-slate-800/40"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. BPMN CENTRADO Y ESCALABLE */}
        {tab === "BPMN" && (
          <div className="w-full h-full flex flex-col justify-center space-y-2">
            <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
              <h3 className={`${expanded ? "text-lg" : "text-sm"} font-bold text-white`}>
                {isComercial ? "BPMN 1: Comercial y Créditos" : "BPMN 2: Patio / Yard Lurín"}
              </h3>
              <span className="text-xs font-mono text-emerald-400">
                {isToBe ? "TO-BE AUTOMATIZADO" : "AS-IS ACTUAL"}
              </span>
            </div>

            {isComercial ? (
              <svg
                viewBox="0 0 460 280"
                preserveAspectRatio="xMidYMid meet"
                className={`w-full ${svgContainerHeight} bg-slate-950 border border-slate-800 rounded-xl p-3`}
              >
                <ellipse cx="220" cy="20" rx="68" ry="13" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                <text x="220" y="23" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="bold">INICIO: Solicitud Cotización</text>
                <line x1="220" y1="33" x2="220" y2="48" stroke="#34d399" strokeWidth="2" className="animate-flow-fast" />

                <rect x="105" y="48" width="230" height="26" rx="5" fill="#064e3b" stroke={simStep % 4 === 0 ? "#fff" : "#34d399"} strokeWidth="1.5" />
                <text x="220" y="64" textAnchor="middle" fill="#ecfdf5" fontSize="8.5">
                  {isToBe ? "WhatsApp Cloud API + Agente IA (Ollama)" : "Correo Manual + Consulta Equifax (CCM)"}
                </text>
                <line x1="220" y1="74" x2="220" y2="90" stroke="#34d399" strokeWidth="2" className="animate-flow-fast" />

                <polygon points="220,90 275,116 220,142 165,116" fill="#78350f" stroke={simStep % 4 === 1 ? "#fff" : "#fbbf24"} strokeWidth="1.5" />
                <text x="220" y="119" textAnchor="middle" fill="#fef3c7" fontSize="8" fontWeight="bold">¿Crédito Aprobado?</text>

                <line x1="275" y1="116" x2="330" y2="116" stroke="#f87171" strokeWidth="1.5" className="animate-flow-slow" />
                <text x="296" y="111" fill="#f87171" fontSize="8">No</text>
                <rect x="330" y="100" width="118" height="32" rx="5" fill="#7f1d1d" stroke="#f87171" />
                <text x="389" y="114" textAnchor="middle" fill="#fecaca" fontSize="7.5">Notificar Pago</text>
                <text x="389" y="125" textAnchor="middle" fill="#fecaca" fontSize="7.5">Contado / Adelantado</text>

                <line x1="220" y1="142" x2="220" y2="158" stroke="#34d399" strokeWidth="2" className="animate-flow-fast" />
                <text x="228" y="153" fill="#34d399" fontSize="8">Sí</text>

                <rect x="100" y="158" width="240" height="26" rx="5" fill="#1e293b" stroke={simStep % 4 === 2 ? "#fff" : "#38bdf8"} strokeWidth="1.5" />
                <text x="220" y="174" textAnchor="middle" fill="#e0f2fe" fontSize="8.5">
                  {isToBe ? "Plantilla BIM + Catálogo Discos Vinculado" : "Diseño CAD (900100000) + Cruce Manual Discos"}
                </text>
                <line x1="220" y1="184" x2="220" y2="200" stroke="#34d399" strokeWidth="2" className="animate-flow-fast" />

                <rect x="115" y="200" width="210" height="26" rx="4" fill="#3b0764" stroke={simStep % 4 === 3 ? "#fff" : "#c084fc"} strokeWidth="1.5" />
                <text x="220" y="216" textAnchor="middle" fill="#f3e8ff" fontSize="8.5">Cotización Formal Enviada y Archivada</text>
                <line x1="220" y1="226" x2="220" y2="242" stroke="#34d399" strokeWidth="2" className="animate-flow-fast" />

                <ellipse cx="220" cy="255" rx="40" ry="12" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                <text x="220" y="258" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="bold">FIN</text>
              </svg>
            ) : (
              <svg
                viewBox="0 0 460 280"
                preserveAspectRatio="xMidYMid meet"
                className={`w-full ${svgContainerHeight} bg-slate-950 border border-slate-800 rounded-xl p-3`}
              >
                <ellipse cx="220" cy="20" rx="68" ry="13" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                <text x="220" y="23" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="bold">INICIO: Retorno Obra</text>
                <line x1="220" y1="33" x2="220" y2="48" stroke="#34d399" strokeWidth="2" className="animate-flow-fast" />

                <rect x="105" y="48" width="230" height="26" rx="5" fill="#064e3b" stroke={simStep % 4 === 0 ? "#fff" : "#34d399"} strokeWidth="1.5" />
                <text x="220" y="64" textAnchor="middle" fill="#ecfdf5" fontSize="8.5">
                  {isToBe ? "Ventana Heijunka + Hidrolavado Recirculado" : "Cola Hidrolavado (35m) + Desincrustado Atlas Copco"}
                </text>
                <line x1="220" y1="74" x2="220" y2="90" stroke="#34d399" strokeWidth="2" className="animate-flow-fast" />

                <polygon points="220,90 278,116 220,142 162,116" fill="#78350f" stroke={simStep % 4 === 1 ? "#fff" : "#fbbf24"} strokeWidth="1.5" />
                <text x="220" y="119" textAnchor="middle" fill="#fef3c7" fontSize="8" fontWeight="bold">¿Limpieza Conforme?</text>

                <line x1="278" y1="116" x2="335" y2="116" stroke="#f87171" strokeWidth="1.5" className="animate-flow-slow" />
                <text x="298" y="111" fill="#f87171" fontSize="8">No</text>
                <rect x="335" y="102" width="110" height="28" rx="5" fill="#7f1d1d" stroke="#f87171" />
                <text x="390" y="119" textAnchor="middle" fill="#fecaca" fontSize="8">Relavar Lote</text>

                <line x1="220" y1="142" x2="220" y2="158" stroke="#34d399" strokeWidth="2" className="animate-flow-fast" />
                <text x="228" y="153" fill="#34d399" fontSize="8">Sí</text>

                <rect x="95" y="158" width="250" height="26" rx="5" fill="#1e293b" stroke={simStep % 4 === 2 ? "#fff" : "#38bdf8"} strokeWidth="1.5" />
                <text x="220" y="174" textAnchor="middle" fill="#e0f2fe" fontSize="8.5">
                  {isToBe ? "Celda en U (Plank / Fenólicos) + API HiVis↔Discos" : "Acarreo 62m + Doble Registro HiVis y Discos"}
                </text>
                <line x1="220" y1="184" x2="220" y2="200" stroke="#34d399" strokeWidth="2" className="animate-flow-fast" />

                <rect x="115" y="200" width="210" height="26" rx="4" fill="#3b0764" stroke={simStep % 4 === 3 ? "#fff" : "#c084fc"} strokeWidth="1.5" />
                <text x="220" y="216" textAnchor="middle" fill="#f3e8ff" fontSize="8.5">Stock Certificado Disponible (Hub 313)</text>
                <line x1="220" y1="226" x2="220" y2="242" stroke="#34d399" strokeWidth="2" className="animate-flow-fast" />

                <ellipse cx="220" cy="255" rx="40" ry="12" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                <text x="220" y="258" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="bold">FIN</text>
              </svg>
            )}
          </div>
        )}

        {/* 4. PARETO 80/20 CENTRADO Y ESCALABLE */}
        {tab === "PARETO" && (
          <div className="w-full h-full flex flex-col justify-center space-y-2">
            <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
              <h3 className={`${expanded ? "text-lg" : "text-sm"} font-bold text-white`}>
                Pareto 80/20 — Foco Vital: 82.0% (820 h/mes)
              </h3>
              <span className="text-xs font-mono text-amber-300">
                {isComercial ? "CAUSA #1: 42% COMERCIAL" : "CAUSAS #2 Y #3: 40% PATIO"}
              </span>
            </div>

            <svg
              viewBox="0 0 460 250"
              preserveAspectRatio="xMidYMid meet"
              className={`w-full ${svgContainerHeight} bg-slate-950 border border-slate-800 rounded-xl p-3`}
            >
              <line x1="45" y1="56" x2="420" y2="56" stroke="#f59e0b" strokeDasharray="4 4" strokeWidth="1.2" />
              <text x="422" y="59" fill="#fbbf24" fontSize="8" fontWeight="bold">80%</text>
              <line x1="45" y1="20" x2="45" y2="200" stroke="#475569" strokeWidth="1" />
              <line x1="45" y1="200" x2="420" y2="200" stroke="#475569" strokeWidth="1" />

              {PARETO_DATA.map((d, i) => {
                const barH = (d.hours / 450) * 175;
                const x = 62 + i * 72;
                const y = 200 - barH;
                const highlight = d.zone === zone;
                return (
                  <g key={i}>
                    <motion.rect
                      initial={{ height: 0, y: 200 }}
                      animate={{ height: barH, y }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      x={x}
                      width="44"
                      rx="4"
                      fill={highlight ? "#10b981" : "#1e293b"}
                      stroke={highlight ? "#6ee7b7" : "#334155"}
                    />
                    <text x={x + 22} y={y - 5} textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">
                      {d.hours}h
                    </text>
                    <text x={x + 22} y="214" textAnchor="middle" fill={highlight ? "#34d399" : "#94a3b8"} fontSize="7.5">
                      {d.label}
                    </text>
                    <text x={x + 22} y="224" textAnchor="middle" fill="#64748b" fontSize="7">
                      ({d.pct}%)
                    </text>
                  </g>
                );
              })}

              <motion.polyline
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.2"
                points={PARETO_DATA.map((d, i) => `${84 + i * 72},${200 - (d.acc / 100) * 180}`).join(" ")}
              />
              {PARETO_DATA.map((d, i) => {
                const cx = 84 + i * 72;
                const cy = 200 - (d.acc / 100) * 180;
                return (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="3.5" fill="#fbbf24" />
                    <text x={cx} y={cy - 7} textAnchor="middle" fill="#fde68a" fontSize="8" fontWeight="bold">
                      {d.acc}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* 5. ISHIKAWA 6M CENTRADO Y ESCALABLE */}
        {tab === "ISHIKAWA" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col justify-center space-y-2"
          >
            <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
              <h3 className={`${expanded ? "text-lg" : "text-sm"} font-bold text-white`}>
                {isComercial
                  ? "Ishikawa 6M — Problema 1: Demora Comercial (36.5 h)"
                  : "Ishikawa 6M — Problema 2: Cuellos en Patio Lurín (55 min/lote)"}
              </h3>
            </div>

            <svg
              viewBox="0 0 480 260"
              preserveAspectRatio="xMidYMid meet"
              className={`w-full ${svgContainerHeight} bg-slate-950 border border-slate-800 rounded-xl p-3`}
            >
              <line x1="25" y1="130" x2="355" y2="130" stroke="#34d399" strokeWidth="3" />
              <polygon points="355,124 368,130 355,136" fill="#34d399" />

              <rect x="370" y="92" width="102" height="76" rx="8" fill="#7f1d1d" stroke="#f87171" strokeWidth="1.5" />
              <text x="421" y="116" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="bold">
                {isComercial ? "PROBLEMA 01" : "PROBLEMA 02"}
              </text>
              <text x="421" y="132" textAnchor="middle" fill="#fecaca" fontSize="7.5">
                {isComercial ? "Demora 36.5h en" : "55 min demora +"}
              </text>
              <text x="421" y="144" textAnchor="middle" fill="#fecaca" fontSize="7.5">
                {isComercial ? "cotizaciones" : "62m acarreo Patio"}
              </text>

              {(isComercial
                ? [
                    { x: 95, title: "MÉTODO", c1: "• Captación manual correo", c2: "• Flujo secuencial lento" },
                    { x: 205, title: "TECNOLOGÍA", c1: "• Web global en inglés", c2: "• Sin CRM ni filtro IA" },
                    { x: 315, title: "MANO DE OBRA", c1: "• CCM saturada Equifax", c2: "• Cruce manual Discos" },
                  ]
                : [
                    { x: 95, title: "MÉTODO", c1: "• Retornos sin horarios", c2: "• Sin preinspección obra" },
                    { x: 205, title: "MAQUINARIA", c1: "• Hidrolavadoras al límite", c2: "• HiVis ≠ ERP Discos" },
                    { x: 315, title: "LAYOUT", c1: "• Estaciones dispersas", c2: "• 62m en montacargas" },
                  ]
              ).map((sp, i) => (
                <g key={i}>
                  <line x1={sp.x - 35} y1="35" x2={sp.x} y2="130" stroke="#64748b" strokeWidth="1.5" />
                  <rect x={sp.x - 62} y="14" width="86" height="18" rx="4" fill="#064e3b" stroke="#10b981" />
                  <text x={sp.x - 19} y="26" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontWeight="bold">{sp.title}</text>
                  <text x={sp.x - 58} y="48" fill="#cbd5e1" fontSize="7.2">{sp.c1}</text>
                  <text x={sp.x - 58} y="60" fill="#cbd5e1" fontSize="7.2">{sp.c2}</text>
                </g>
              ))}

              {(isComercial
                ? [
                    { x: 95, title: "MATERIALES", c1: "• Planos CAD incompletos", c2: "• Datos RUC sin validar" },
                    { x: 205, title: "MEDICIÓN", c1: "• Sin KPIs por etapa", c2: "• Tiempos muertos ocultos" },
                    { x: 315, title: "ENTORNO", c1: "• Alta exigencia minera", c2: "• Competencia Layher/Peri" },
                  ]
                : [
                    { x: 95, title: "MATERIALES", c1: "• Concreto en 999300104", c2: "• Daño paneles fenólicos" },
                    { x: 205, title: "MEDICIÓN", c1: "• Doble digitación stock", c2: "• Desfase físico vs ERP" },
                    { x: 315, title: "MEDIO AMBIENTE", c1: "• Sin red de agua Lurín", c2: "• Dependencia cisternas" },
                  ]
              ).map((sp, i) => (
                <g key={i}>
                  <line x1={sp.x - 35} y1="225" x2={sp.x} y2="130" stroke="#64748b" strokeWidth="1.5" />
                  <rect x={sp.x - 62} y="228" width="88" height="18" rx="4" fill="#1e293b" stroke="#38bdf8" />
                  <text x={sp.x - 18} y="240" textAnchor="middle" fill="#7dd3fc" fontSize="8" fontWeight="bold">{sp.title}</text>
                  <text x={sp.x - 58} y="205" fill="#cbd5e1" fontSize="7.2">{sp.c1}</text>
                  <text x={sp.x - 58} y="217" fill="#cbd5e1" fontSize="7.2">{sp.c2}</text>
                </g>
              ))}
            </svg>
          </motion.div>
        )}
      </div>
    </div>
  );
}