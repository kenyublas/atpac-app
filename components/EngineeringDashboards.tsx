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
  Table2,
  CheckSquare,
  Play,
  RotateCcw,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface DashProps {
  activeTab: "PARETO" | "DAP" | "ISHIKAWA";
  setActiveTab: (t: "PARETO" | "DAP" | "ISHIKAWA") => void;
  mode: "AS-IS" | "TO-BE";
  zone: "COMERCIAL" | "PATIO";
}

type ExtendedTab = "MAPA" | "PEPSC" | "DOP" | "DAP" | "BPMN" | "PARETO" | "ISHIKAWA" | "KPIS";

// TABLA COMPLETA DAP 1: COMERCIAL (17 ACTIVIDADES - 2,000 MIN)
const DAP_COMERCIAL = [
  { id: 1, act: "Recepción de solicitud de cotización (correo/llamada)", time: 15, sym: "O" },
  { id: 2, act: "Espera en bandeja comercial hasta asignación", time: 120, sym: "D" },
  { id: 3, act: "Envío digital de datos del cliente a Créditos (CCM)", time: 5, sym: "T" },
  { id: 4, act: "Cola de espera para evaluación crediticia", time: 180, sym: "D" },
  { id: 5, act: "Consulta y verificación de riesgo en Equifax (CCM)", time: 20, sym: "I" },
  { id: 6, act: "Notificación de aprobación de línea de crédito", time: 5, sym: "T" },
  { id: 7, act: "Derivación del requerimiento técnico a Ingeniería", time: 5, sym: "T" },
  { id: 8, act: "Cola de espera en bandeja de Ingeniería", time: 240, sym: "D" },
  { id: 9, act: "Elaboración de plano CAD/BIM y despiece (900100000)", time: 60, sym: "O" },
  { id: 10, act: "Retorno digital del listado técnico a Comercial", time: 5, sym: "T" },
  { id: 11, act: "Búsqueda y selección manual de códigos en Discos", time: 45, sym: "O" },
  { id: 12, act: "Revisión de precios, márgenes y disponibilidad", time: 15, sym: "I" },
  { id: 13, act: "Generación de propuesta económica (PDF / Excel)", time: 20, sym: "O" },
  { id: 14, act: "Control final de cotización antes de envío", time: 10, sym: "I" },
  { id: 15, act: "Envío de cotización formal por correo al cliente", time: 10, sym: "T" },
  { id: 16, act: "Tiempo de revisión y respuesta del cliente", time: 1440, sym: "D" },
  { id: 17, act: "Archivo y registro de cotización en ERP Discos", time: 5, sym: "A" },
];

// TABLA COMPLETA DAP 2: PATIO LURÍN (18 ACTIVIDADES - 261 MIN - 62M)
const DAP_PATIO = [
  { id: 1, act: "Recepción y descarga de lotes retornados (999300104)", time: 20, sym: "O" },
  { id: 2, act: "Control visual inicial de estado físico y daños", time: 10, sym: "I" },
  { id: 3, act: "Traslado en montacargas a estación hidrolavado (15m)", time: 6, sym: "T" },
  { id: 4, act: "Espera por cola en hidrolavadoras industriales", time: 35, sym: "D" },
  { id: 5, act: "Lavado a alta presión con agua de cisterna", time: 30, sym: "O" },
  { id: 6, act: "Desincrustado neumático con Atlas Copco RVM 08B", time: 40, sym: "O" },
  { id: 7, act: "Inspección de calidad de lavado y limpieza superficial", time: 8, sym: "I" },
  { id: 8, act: "Traslado de piezas pequeñas a Molino Plank (12m)", time: 5, sym: "T" },
  { id: 9, act: "Limpieza por fricción y granallado en Molino Plank", time: 25, sym: "O" },
  { id: 10, act: "Prueba de embonado y acople estructural", time: 7, sym: "I" },
  { id: 11, act: "Traslado de plataformas a taller fenólicos (15m)", time: 6, sym: "T" },
  { id: 12, act: "Desmontaje y recambio panel fenólico (CP7748)", time: 30, sym: "O" },
  { id: 13, act: "Inspección de nivelación y fijación de panel", time: 6, sym: "I" },
  { id: 14, act: "Enzunchado, empaquetado y apilamiento en Racks Doka", time: 15, sym: "O" },
  { id: 15, act: "Inspección final de calidad y liberación (VoBo)", time: 8, sym: "I" },
  { id: 16, act: "Traslado a zona de despacho / almacén Hub 313 (20m)", time: 7, sym: "T" },
  { id: 17, act: "Doble registro manual de stock en HiVis y ERP Discos", time: 20, sym: "D" },
  { id: 18, act: "Almacenamiento de stock certificado disponible", time: 0, sym: "A" },
];

// GRÁFICO 9 EXACTO: PARETO COMERCIAL (58 OCURRENCIAS)
const PARETO_COMERCIAL = [
  { l1: "Espera de", l2: "info. técnica", freq: 14, acc: 24.1, vital: true },
  { l1: "Demora eval.", l2: "crediticia", freq: 12, acc: 44.8, vital: true },
  { l1: "Solicitud", l2: "incompleta", freq: 11, acc: 63.8, vital: true },
  { l1: "Corrección /", l2: "retrabajo", freq: 8, acc: 77.6, vital: true },
  { l1: "Error datos", l2: "cotización", freq: 7, acc: 89.7, vital: false },
  { l1: "Falta disp.", l2: "de equipos", freq: 6, acc: 100.0, vital: false },
];

// PARETO PATIO LURÍN
const PARETO_PATIO = [
  { l1: "Cola", l2: "Hidrolavado", freq: 240, acc: 41.4, vital: true },
  { l1: "Doble reg.", l2: "HiVis/Discos", freq: 160, acc: 69.0, vital: true },
  { l1: "Acarreo", l2: "Layout 62m", freq: 100, acc: 86.2, vital: true },
  { l1: "Dependencia", l2: "Agua Cisterna", freq: 80, acc: 100.0, vital: false },
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
      setSimStep((prev) => (prev + 1) % 24);
    }, speed);
    return () => clearInterval(timer);
  }, [isSimulating, isToBe]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expanded) setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const svgContainerHeight = expanded ? "h-[calc(100vh-150px)]" : "h-[280px]";
  const rowHeight = expanded ? 30 : 22;

  return (
    <div
      className={`${
        expanded
          ? "fixed inset-3 md:inset-5 z-50 shadow-2xl border-emerald-500/60"
          : "w-full h-full relative border-slate-800"
      } flex flex-col bg-[#0f151d] border rounded-2xl p-4 transition-all`}
    >
      {/* BARRA SUPERIOR DE PESTAÑAS */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex flex-wrap gap-1">
          {[
            { id: "MAPA", label: "Mapa", icon: Network },
            { id: "PEPSC", label: "PEPSC", icon: Table2 },
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
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
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

        <div className="flex items-center gap-1.5">
          {["PEPSC", "DOP", "DAP", "BPMN"].includes(tab) && (
            <button
              onClick={() => {
                setSimStep(0);
                setIsSimulating(!isSimulating);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold hover:bg-emerald-500/25 cursor-pointer"
            >
              {isSimulating ? <RotateCcw className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isSimulating ? "LIVE" : "SIMULAR"}
            </button>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-[11px] font-semibold cursor-pointer"
            title={expanded ? "Reducir (ESC)" : "Ampliar centrado"}
          >
            {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            {expanded && <span className="hidden sm:inline">Cerrar (ESC)</span>}
          </button>
        </div>
      </div>

      {/* ÁREA DE DIAGRAMAS */}
      <div className="flex-1 pt-3 overflow-y-auto flex flex-col justify-center">
        {/* 1. MAPA DE PROCESOS UNIFORME */}
        {tab === "MAPA" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full ${expanded ? "max-w-5xl mx-auto space-y-4" : "space-y-2.5"}`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`${expanded ? "text-lg" : "text-sm"} font-bold text-white`}>
                Gráfico 1: Mapa de Procesos — AT-PAC PERÚ S.A.C.
              </h3>
              <span className="text-xs font-mono text-emerald-400">ENFOQUE: SISTEMA ABIERTO</span>
            </div>

            <div className={`grid grid-cols-12 gap-2 bg-slate-950 ${expanded ? "p-5" : "p-3"} rounded-xl border border-slate-800`}>
              <div className="col-span-1 bg-blue-950/90 border border-blue-700/50 rounded-lg flex items-center justify-center p-1">
                <span className={`[writing-mode:vertical-rl] rotate-180 ${expanded ? "text-xs" : "text-[9px]"} font-bold tracking-wider text-blue-200 uppercase text-center`}>
                  Necesidades del Cliente
                </span>
              </div>

              <div className={`col-span-10 ${expanded ? "space-y-4" : "space-y-2.5"}`}>
                <div className={`bg-emerald-950/50 border border-emerald-600/50 rounded-lg ${expanded ? "p-3.5" : "p-2"}`}>
                  <div className={`${expanded ? "text-xs mb-2.5" : "text-[9.5px] mb-1.5"} font-extrabold text-emerald-400 text-center tracking-wider`}>
                    PE. PROCESOS ESTRATÉGICOS
                  </div>
                  <div className={`grid grid-cols-2 gap-2 ${expanded ? "text-xs" : "text-[9.5px]"}`}>
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
                  <div className={`${expanded ? "text-xs mb-2.5" : "text-[9.5px] mb-1.5"} font-extrabold text-rose-400 text-center tracking-wider`}>
                    PM. PROCESOS MISIONALES (CADENA DE VALOR)
                  </div>
                  <div className={`grid grid-cols-2 gap-2 ${expanded ? "text-xs" : "text-[9.5px]"}`}>
                    <div className="bg-slate-900/90 border border-rose-500/30 rounded px-3 py-2 text-slate-200">
                      <strong className="text-rose-400">PM01.</strong> Gestión Comercial y Requerimientos
                    </div>
                    <div className="bg-slate-900/90 border border-rose-500/30 rounded px-3 py-2 text-slate-200">
                      <strong className="text-rose-400">PM02.</strong> Recepción, Clasificación y Lavado
                    </div>
                    <div className="bg-slate-900/90 border border-rose-500/30 rounded px-3 py-2 text-slate-200">
                      <strong className="text-rose-400">PM03.</strong> Mantenimiento y Reparación (Yard)
                    </div>
                    <div className="bg-slate-900/90 border border-rose-500/30 rounded px-3 py-2 text-slate-200">
                      <strong className="text-rose-400">PM04.</strong> Control Calidad, Almacén y Despacho
                    </div>
                  </div>
                </div>

                <div className={`bg-sky-950/40 border border-sky-600/50 rounded-lg ${expanded ? "p-3.5" : "p-2"}`}>
                  <div className={`${expanded ? "text-xs mb-2.5" : "text-[9.5px] mb-1.5"} font-extrabold text-sky-400 text-center tracking-wider`}>
                    PA. PROCESOS DE APOYO
                  </div>
                  <div className={`grid grid-cols-3 gap-1.5 ${expanded ? "text-xs" : "text-[9px]"}`}>
                    <div className="bg-slate-900/90 border border-sky-500/25 rounded p-1.5 text-slate-200">
                      <strong className="text-sky-400">PA01.</strong> Finanzas / CCM
                    </div>
                    <div className="bg-slate-900/90 border border-sky-500/25 rounded p-1.5 text-slate-200">
                      <strong className="text-sky-400">PA02.</strong> Logística Lurín
                    </div>
                    <div className="bg-slate-900/90 border border-sky-500/25 rounded p-1.5 text-slate-200">
                      <strong className="text-sky-400">PA03.</strong> Gestión Humana
                    </div>
                    <div className="bg-slate-900/90 border border-sky-500/25 rounded p-1.5 text-slate-200">
                      <strong className="text-sky-400">PA04.</strong> TI (ERP / HiVis)
                    </div>
                    <div className="bg-slate-900/90 border border-sky-500/25 rounded p-1.5 text-slate-200">
                      <strong className="text-sky-400">PA05.</strong> Mantenimiento
                    </div>
                    <div className="bg-slate-900/90 border border-sky-500/25 rounded p-1.5 text-slate-200">
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
          </motion.div>
        )}

        {/* 2. MATRIZ PEPSC DINÁMICA (CON FLUJO ANIMADO P -> E -> P -> S -> C) */}
        {tab === "PEPSC" && (
          <div className={`w-full ${expanded ? "max-w-5xl mx-auto" : ""} space-y-2.5`}>
            <div className="flex items-center justify-between">
              <h3 className={`${expanded ? "text-lg" : "text-sm"} font-bold text-white`}>
                Tabla 1: Matriz PEPSC de AT-PAC PERÚ S.A.C.
              </h3>
              {/* Indicador de flujo animado P -> E -> P -> S -> C */}
              <div className="flex items-center gap-1 font-mono text-[10px]">
                {["P", "E", "P", "S", "C"].map((ltr, idx) => (
                  <React.Fragment key={idx}>
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                        simStep % 5 === idx
                          ? "bg-emerald-500 text-slate-950 scale-110 shadow"
                          : "bg-slate-900 text-slate-400 border border-slate-800"
                      }`}
                    >
                      {ltr}
                    </span>
                    {idx < 4 && <span className="text-slate-600">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl divide-y divide-slate-800 overflow-hidden">
              {[
                {
                  code: "P",
                  name: "Proveedores",
                  badge: "bg-sky-500/20 text-sky-300 border-sky-500/40",
                  bullets: [
                    "Corporativos: AT-PAC Global / Grupo Umdasch / Doka Perú (componentes Ringlock / DokaScaff).",
                    "Herramientas e Insumos: Imdico SR, Gemka Procurement Solutions, MASA Equipos, Fromm Perú, cisternas Lurín.",
                    "Información Crediticia y Logística: Equifax (CCM); AK Cargo Logistic, Unión Logística, Euroaduanas, JMK Logística.",
                  ],
                },
                {
                  code: "E",
                  name: "Entradas",
                  badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
                  bullets: [
                    "Solicitudes de cotización (recibidas manualmente vía correo, llamadas o formulario web en inglés) y líneas de crédito.",
                    "Material devuelto de obra en estado sucio o con concreto adherido (Código Discos 999300104).",
                    "Planos estructurales CAD/BIM y consumibles (zunchos, pernería M10/M14, tableros fenólicos, agua industrial).",
                  ],
                },
                {
                  code: "P",
                  name: "Proceso",
                  badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
                  bullets: [
                    "1. Subproceso Comercial y Evaluación Crediticia: Recepción manual → Evaluación Equifax (CCM) → Diseño CAD/BIM (900100000) → Búsqueda manual Discos → Emisión PDF/Excel.",
                    "2. Subproceso Operativo de Patio (Yard): Recepción → Hidrolavado → Desincrustado Atlas Copco RVM 08B → Molino Plank → Fenólicos CP7748 → Registro HiVis → Despacho y Cobranza Discos.",
                  ],
                },
                {
                  code: "S",
                  name: "Salidas",
                  badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
                  bullets: [
                    "Cotizaciones técnico-comerciales formales elaboradas en Discos con condiciones crediticias aprobadas.",
                    "Estructuras y módulos de andamios Ringlock / DokaScaff reacondicionados, limpios, operativos y certificados.",
                    "Facturación venta/alquiler, limpieza (920785000), ingeniería (900100000) o scrap (999929000) y trazabilidad HiVis/Discos.",
                  ],
                },
                {
                  code: "C",
                  name: "Clientes (93)",
                  badge: "bg-rose-500/20 text-rose-300 border-rose-500/40",
                  bullets: [
                    "Clientes TOP (31): Constructora Bechtel Perú, Cosapi, Cumbraperú, Ememsa, Minera Kolpa, Cobra Perú, Techint.",
                    "Clientes Ocasionales (30): Refinería La Pampilla, Sociedad Minera Cerro Verde, Southern Perú, Ferreyros, SIMA Sur, JJC.",
                    "Clientes Esporádicos (32): Beijing Shougang, Stork Perú, Terpel Comercial, Amsa Encofrados, Alfran Perú, Edeco.",
                  ],
                },
              ].map((row, idx) => {
                const isActiveRow = simStep % 5 === idx;
                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-12 items-start ${expanded ? "p-3.5 text-xs" : "p-2 text-[10px]"} gap-2 transition-all ${
                      isActiveRow ? "bg-emerald-500/10 border-l-4 border-l-emerald-400" : ""
                    }`}
                  >
                    <div className="col-span-3 sm:col-span-2 flex items-center gap-1.5 font-bold">
                      <span className={`px-2 py-0.5 rounded border font-mono ${row.badge}`}>{row.code}</span>
                      <span className="text-white">{row.name}</span>
                    </div>
                    <ul className="col-span-9 sm:col-span-10 space-y-1 text-slate-300">
                      {row.bullets.map((b, i) => (
                        <li key={i} className="leading-snug">
                          • {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. DOP 1 Y DOP 2 EXACTOS CON CUADRO DE RESUMEN Y FLECHAS */}
        {tab === "DOP" && (
          <div className="w-full h-full flex flex-col justify-center space-y-2">
            <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
              <h3 className={`${expanded ? "text-lg" : "text-sm"} font-bold text-white`}>
                {isComercial
                  ? "2.2.1. DOP 1: Subproceso Comercial y Créditos (AS-IS)"
                  : "2.2.2. DOP 2: Reacondicionamiento en Patio / Yard (AS-IS)"}
              </h3>
              <span className="text-xs font-mono text-emerald-400">NORMA ASME</span>
            </div>

            {isComercial ? (
              <svg
                viewBox="0 0 580 355"
                preserveAspectRatio="xMidYMid meet"
                className={`w-full ${svgContainerHeight} bg-slate-950 border border-slate-800 rounded-xl p-2`}
              >
                <defs>
                  <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
                  </marker>
                </defs>

                {/* Entrada Superior */}
                <text x="195" y="16" textAnchor="middle" fill="#cbd5e1" fontSize="9.5">
                  Solicitud de Cotización del Cliente (Correo / Llamada)
                </text>
                <line x1="215" y1="21" x2="255" y2="38" stroke="#94a3b8" strokeWidth="1.3" markerEnd="url(#arrow)" />

                {/* Cuadro Resumen Lateral */}
                <g transform="translate(22, 185)">
                  <rect x="0" y="0" width="142" height="24" fill="#1e3a8a" stroke="#60a5fa" />
                  <text x="71" y="15" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">RESUMEN DE ACTIVIDADES</text>
                  <rect x="0" y="24" width="142" height="22" fill="#064e3b" stroke="#34d399" />
                  <text x="10" y="38" fill="#ecfdf5" fontSize="9">Operaciones (○): 4</text>
                  <rect x="0" y="46" width="142" height="22" fill="#3b0764" stroke="#c084fc" />
                  <text x="10" y="60" fill="#f3e8ff" fontSize="9">Inspecciones (□): 3</text>
                  <rect x="0" y="68" width="142" height="24" fill="#1e293b" stroke="#94a3b8" />
                  <text x="71" y="83" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">TOTAL ACTIVIDADES: 7</text>
                </g>

                {/* 7 Nodos Exactos */}
                {[
                  { y: 48, type: "O", n: "1", text: "Recepción e ingreso manual de datos del proyecto" },
                  { y: 90, type: "I", n: "1", text: "Consulta y validación de historial en Equifax (CCM)" },
                  { y: 132, type: "O", n: "2", text: "Elaboración de plano CAD/BIM y despiece (Ingeniería)" },
                  { y: 174, type: "O", n: "3", text: "Búsqueda y selección manual de códigos en Discos" },
                  { y: 216, type: "I", n: "2", text: "Revisión de precios, margen comercial y valorización" },
                  { y: 258, type: "O", n: "4", text: "Generación y emisión de cotización en PDF / Excel" },
                  { y: 300, type: "I", n: "3", text: "Control final y envío de propuesta por correo al cliente" },
                ].map((s, i) => {
                  const active = simStep % 7 === i;
                  return (
                    <g key={i}>
                      {i < 6 && (
                        <line x1="270" y1={s.y + 13} x2="270" y2={s.y + 28} stroke="#94a3b8" strokeWidth="1.3" markerEnd="url(#arrow)" />
                      )}
                      {s.type === "O" ? (
                        <circle cx="270" cy={s.y} r="13" fill={active ? "#10b981" : "#065f46"} stroke="#34d399" strokeWidth="1.5" />
                      ) : (
                        <rect x="257" y={s.y - 13} width="26" height="26" fill={active ? "#a855f7" : "#4c1d95"} stroke="#c084fc" strokeWidth="1.5" />
                      )}
                      <text x="270" y={s.y + 3.5} textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="bold">{s.n}</text>
                      <text x="294" y={s.y + 3.5} fill={active ? "#34d399" : "#e2e8f0"} fontSize="9.5" fontWeight={active ? "bold" : "normal"}>
                        {s.text}
                      </text>
                    </g>
                  );
                })}

                {/* Salida Final */}
                <line x1="270" y1="313" x2="270" y2="333" stroke="#94a3b8" strokeWidth="1.3" markerEnd="url(#arrow)" />
                <text x="270" y="347" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                  Cotización Formal Enviada al Cliente
                </text>
              </svg>
            ) : (
              <svg
                viewBox="0 0 620 390"
                preserveAspectRatio="xMidYMid meet"
                className={`w-full ${svgContainerHeight} bg-slate-950 border border-slate-800 rounded-xl p-2`}
              >
                <defs>
                  <marker id="arrow2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
                  </marker>
                </defs>

                {/* Entrada Superior */}
                <text x="155" y="16" textAnchor="middle" fill="#cbd5e1" fontSize="9.5">
                  Retorno de Lotes de Andamios desde Obra
                </text>
                <line x1="210" y1="20" x2="282" y2="32" stroke="#94a3b8" strokeWidth="1.3" markerEnd="url(#arrow2)" />

                {/* Cuadro Resumen Lateral */}
                <g transform="translate(20, 88)">
                  <rect x="0" y="0" width="142" height="24" fill="#1e3a8a" stroke="#60a5fa" />
                  <text x="71" y="15" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">RESUMEN DE ACTIVIDADES</text>
                  <rect x="0" y="24" width="142" height="22" fill="#064e3b" stroke="#34d399" />
                  <text x="10" y="38" fill="#ecfdf5" fontSize="9">Operaciones (○): 6</text>
                  <rect x="0" y="46" width="142" height="22" fill="#3b0764" stroke="#c084fc" />
                  <text x="10" y="60" fill="#f3e8ff" fontSize="9">Inspecciones (□): 5</text>
                  <rect x="0" y="68" width="142" height="24" fill="#1e293b" stroke="#94a3b8" />
                  <text x="71" y="83" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">TOTAL ACTIVIDADES: 11</text>
                </g>

                {/* Tronco Superior (5 Nodos exactos) */}
                {[
                  { y: 36, type: "O", n: "1", t1: "Descarga y recepción inicial de lotes retornados", t2: "" },
                  { y: 74, type: "I", n: "1", t1: "Inspección visual inicial de estado físico y", t2: "clasificación" },
                  { y: 112, type: "O", n: "2", t1: "Lavado industrial de alta presión", t2: "" },
                  { y: 150, type: "O", n: "3", t1: "Desincrustado neumático de concreto adherido", t2: "" },
                  { y: 188, type: "I", n: "2", t1: "Inspección de calidad del lavado y limpieza", t2: "superficial" },
                ].map((s, i) => {
                  const active = simStep % 8 === i;
                  return (
                    <g key={i}>
                      {i < 4 && (
                        <line x1="296" y1={s.y + 12} x2="296" y2={s.y + 25} stroke="#94a3b8" strokeWidth="1.3" markerEnd="url(#arrow2)" />
                      )}
                      {s.type === "O" ? (
                        <circle cx="296" cy={s.y} r="12" fill={active ? "#10b981" : "#065f46"} stroke="#34d399" strokeWidth="1.5" />
                      ) : (
                        <rect x="284" y={s.y - 12} width="24" height="24" fill={active ? "#a855f7" : "#4c1d95"} stroke="#c084fc" strokeWidth="1.5" />
                      )}
                      <text x="296" y={s.y + 3.5} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">{s.n}</text>
                      <text x="318" y={s.t2 ? s.y - 1 : s.y + 3} fill={active ? "#34d399" : "#e2e8f0"} fontSize="9">
                        {s.t1}
                      </text>
                      {s.t2 && (
                        <text x="318" y={s.y + 9} fill={active ? "#34d399" : "#e2e8f0"} fontSize="9">
                          {s.t2}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Bifurcación a Rama A y Rama B */}
                <path d="M 296 200 L 296 212 L 195 212 L 195 223" fill="none" stroke="#94a3b8" strokeWidth="1.3" markerEnd="url(#arrow2)" />
                <path d="M 296 200 L 296 212 L 397 212 L 397 223" fill="none" stroke="#94a3b8" strokeWidth="1.3" markerEnd="url(#arrow2)" />

                {/* Rama A (Izquierda) */}
                <circle cx="195" cy="236" r="12" fill={simStep % 8 === 5 ? "#10b981" : "#065f46"} stroke="#34d399" strokeWidth="1.5" />
                <text x="195" y="239.5" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="bold">4A</text>
                <text x="176" y="234" textAnchor="end" fill="#cbd5e1" fontSize="8.5">[Rama A] Limpieza por fricción y granallado</text>

                <line x1="195" y1="248" x2="195" y2="262" stroke="#94a3b8" strokeWidth="1.3" markerEnd="url(#arrow2)" />
                <rect x="183" y="263" width="24" height="24" fill="#4c1d95" stroke="#c084fc" strokeWidth="1.5" />
                <text x="195" y="278.5" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="bold">3A</text>
                <text x="176" y="278" textAnchor="end" fill="#cbd5e1" fontSize="8.5">[Rama A] Verificación de embonado y acople</text>

                {/* Rama B (Derecha) */}
                <circle cx="397" cy="236" r="12" fill={simStep % 8 === 5 ? "#10b981" : "#065f46"} stroke="#34d399" strokeWidth="1.5" />
                <text x="397" y="239.5" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="bold">4B</text>
                <text x="416" y="233" fill="#cbd5e1" fontSize="8.5">[Rama B] Desmontaje y recambio de panel</text>
                <text x="416" y="243" fill="#cbd5e1" fontSize="8.5">fenólico</text>

                <line x1="397" y1="248" x2="397" y2="262" stroke="#94a3b8" strokeWidth="1.3" markerEnd="url(#arrow2)" />
                <rect x="385" y="263" width="24" height="24" fill="#4c1d95" stroke="#c084fc" strokeWidth="1.5" />
                <text x="397" y="278.5" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="bold">3B</text>
                <text x="416" y="274" fill="#cbd5e1" fontSize="8.5">[Rama B] Inspección de nivelación y fijación de</text>
                <text x="416" y="284" fill="#cbd5e1" fontSize="8.5">panel</text>

                {/* Unión hacia Operación 5 e Inspección 4 */}
                <path d="M 195 287 L 195 297 L 296 297 L 296 304" fill="none" stroke="#94a3b8" strokeWidth="1.3" markerEnd="url(#arrow2)" />
                <path d="M 397 287 L 397 297 L 296 297" fill="none" stroke="#94a3b8" strokeWidth="1.3" />

                <circle cx="296" cy="316" r="12" fill={simStep % 8 === 6 ? "#10b981" : "#065f46"} stroke="#34d399" strokeWidth="1.5" />
                <text x="296" y="319.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">5</text>
                <text x="318" y="319.5" fill="#e2e8f0" fontSize="9">Enzunchado, empaquetado y apilamiento en Racks</text>

                <line x1="296" y1="328" x2="296" y2="338" stroke="#94a3b8" strokeWidth="1.3" markerEnd="url(#arrow2)" />
                <rect x="284" y="339" width="24" height="24" fill={simStep % 8 === 7 ? "#a855f7" : "#4c1d95"} stroke="#c084fc" strokeWidth="1.5" />
                <text x="296" y="354.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">4</text>
                <text x="318" y="354.5" fill="#e2e8f0" fontSize="9">Inspección final de calidad y liberación de stock</text>

                <line x1="296" y1="363" x2="296" y2="373" stroke="#94a3b8" strokeWidth="1.3" markerEnd="url(#arrow2)" />
                <text x="296" y="384" textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="bold">
                  Stock Apto para Despacho (HiVis / Racks Doka)
                </text>
              </svg>
            )}
          </div>
        )}

        {/* 4. DAP ASME COMPLETO (17 ACTIVIDADES COMERCIAL / 18 ACTIVIDADES PATIO) */}
        {tab === "DAP" && (
          <div className={`w-full ${expanded ? "max-w-5xl mx-auto" : ""} space-y-2`}>
            <div className="flex items-center justify-between">
              <h3 className={`${expanded ? "text-lg" : "text-sm"} font-bold text-white`}>
                {isComercial
                  ? "DAP 01: Subproceso Comercial (17 Act. • 2,000 min)"
                  : "DAP 02: Reacondicionamiento Patio Lurín (18 Act. • 261 min • 62 m)"}
              </h3>
              <span className="text-[11px] font-mono text-rose-400">
                {isToBe ? "DEMORAS ELIMINADAS (TO-BE)" : isComercial ? "4 DEMORAS = 1,980 MIN" : "2 DEMORAS = 55 MIN"}
              </span>
            </div>

            <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className={`grid grid-cols-12 bg-slate-900 ${expanded ? "text-xs py-2 px-4" : "text-[10px] py-1.5 px-2"} font-mono text-slate-300 border-b border-slate-800`}>
                <div className="col-span-7">ACTIVIDAD ASME</div>
                <div className="col-span-1 text-center">MIN</div>
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
                    strokeWidth={expanded ? "0.8" : "1.3"}
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
                  const isCurrent = simStep % rows.length === idx;
                  return (
                    <div
                      key={r.id}
                      style={{ height: `${rowHeight}px` }}
                      className={`grid grid-cols-12 items-center ${expanded ? "px-4 text-xs" : "px-2 text-[9.5px]"} border-b border-slate-900 transition-colors ${
                        isCurrent
                          ? "bg-emerald-500/20"
                          : isDelay && !isToBe
                          ? "bg-rose-950/25"
                          : ""
                      }`}
                    >
                      <div className="col-span-7 truncate text-slate-200 pr-2" title={r.act}>
                        <span className="text-slate-500 font-mono mr-1.5">{r.id}.</span>
                        {r.act}
                      </div>
                      <div
                        className={`col-span-1 text-center font-mono font-bold ${
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
                                  ? "w-3 h-3 bg-white ring-4 ring-emerald-400"
                                  : isDelay && !isToBe
                                  ? "w-2.5 h-2.5 bg-rose-500"
                                  : "w-2.5 h-2.5 bg-emerald-400"
                                : "w-1.5 h-1.5 bg-slate-800/50"
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

        {/* 5. FLUJOGRAMAS BPMN 1 Y BPMN 2 IDÉNTICOS AL INFORME WORD */}
        {tab === "BPMN" && (
          <div className="w-full h-full flex flex-col justify-center space-y-2">
            <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
              <h3 className={`${expanded ? "text-lg" : "text-sm"} font-bold text-white`}>
                {isComercial
                  ? "Gráfico 5: Flujograma BPMN 1 — Subproceso Comercial y Créditos"
                  : "Gráfico 6: Flujograma BPMN 2 — Operaciones en Patio / Yard Lurín"}
              </h3>
              <span className="text-xs font-mono text-emerald-400">
                {isToBe ? "FLUJO TO-BE" : "FLUJO AS-IS"}
              </span>
            </div>

            {isComercial ? (
              <svg
                viewBox="0 0 560 410"
                preserveAspectRatio="xMidYMid meet"
                className={`w-full ${svgContainerHeight} bg-slate-950 border border-slate-800 rounded-xl p-2`}
              >
                <defs>
                  <marker id="arrB1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
                  </marker>
                </defs>

                {/* Inicio */}
                <ellipse cx="240" cy="20" rx="78" ry="14" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                <text x="240" y="18" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">INICIO</text>
                <text x="240" y="27" textAnchor="middle" fill="#bfdbfe" fontSize="7">(Solicitud de Cotización)</text>
                <line x1="240" y1="34" x2="240" y2="46" stroke="#94a3b8" markerEnd="url(#arrB1)" />

                {/* Actividad 1 */}
                <rect x="135" y="47" width="210" height="28" rx="4" fill="#064e3b" stroke={simStep % 6 === 0 ? "#fff" : "#34d399"} strokeWidth="1.4" />
                <text x="240" y="59" textAnchor="middle" fill="#ecfdf5" fontSize="8">
                  {isToBe ? "Captura WhatsApp API + Filtro IA" : "Recepción manual de solicitud (Correo / Llamada)"}
                </text>
                <text x="240" y="69" textAnchor="middle" fill="#a7f3d0" fontSize="7.5">
                  y derivación a Créditos (CCM)
                </text>
                <line x1="240" y1="75" x2="240" y2="87" stroke="#94a3b8" markerEnd="url(#arrB1)" />

                {/* Actividad 2 */}
                <rect x="135" y="88" width="210" height="26" rx="4" fill="#064e3b" stroke={simStep % 6 === 1 ? "#fff" : "#34d399"} strokeWidth="1.4" />
                <text x="240" y="104" textAnchor="middle" fill="#ecfdf5" fontSize="8">
                  {isToBe ? "Validación crediticia automática Equifax" : "Evaluación de historial y riesgo en Equifax (CCM)"}
                </text>
                <line x1="240" y1="114" x2="240" y2="126" stroke="#94a3b8" markerEnd="url(#arrB1)" />

                {/* Rombo 1 */}
                <polygon points="240,127 295,152 240,177 185,152" fill="#78350f" stroke={simStep % 6 === 2 ? "#fff" : "#fbbf24"} strokeWidth="1.4" />
                <text x="240" y="150" textAnchor="middle" fill="#fef3c7" fontSize="7.5" fontWeight="bold">¿Línea de Crédito</text>
                <text x="240" y="159" textAnchor="middle" fill="#fef3c7" fontSize="7.5" fontWeight="bold">Aprobada?</text>

                {/* Rama No Rombo 1 */}
                <line x1="295" y1="152" x2="365" y2="152" stroke="#f87171" strokeWidth="1.3" markerEnd="url(#arrB1)" />
                <text x="325" y="147" fill="#f87171" fontSize="8" fontWeight="bold">No</text>
                <rect x="366" y="136" width="165" height="32" rx="4" fill="#7f1d1d" stroke="#f87171" />
                <text x="448" y="150" textAnchor="middle" fill="#fecaca" fontSize="7.5">Notificar condición de pago</text>
                <text x="448" y="160" textAnchor="middle" fill="#fecaca" fontSize="7.5">al contado / adelantado</text>
                <path d="M 448 168 L 448 201 L 346 201" fill="none" stroke="#94a3b8" strokeWidth="1.2" markerEnd="url(#arrB1)" />

                {/* Rama Sí Rombo 1 */}
                <line x1="240" y1="177" x2="240" y2="188" stroke="#34d399" strokeWidth="1.3" markerEnd="url(#arrB1)" />
                <text x="248" y="185" fill="#34d399" fontSize="8" fontWeight="bold">Sí</text>

                {/* Actividad 3 */}
                <rect x="135" y="189" width="210" height="26" rx="4" fill="#1e293b" stroke={simStep % 6 === 3 ? "#fff" : "#38bdf8"} strokeWidth="1.4" />
                <text x="240" y="205" textAnchor="middle" fill="#e0f2fe" fontSize="8">
                  {isToBe ? "Plantilla BIM + Catálogo Discos integrado" : "Elaboración plano CAD/BIM (900100000) y cruce Discos"}
                </text>
                <line x1="240" y1="215" x2="240" y2="227" stroke="#94a3b8" markerEnd="url(#arrB1)" />

                {/* Rombo 2 */}
                <polygon points="240,228 295,252 240,276 185,252" fill="#78350f" stroke={simStep % 6 === 4 ? "#fff" : "#fbbf24"} strokeWidth="1.4" />
                <text x="240" y="250" textAnchor="middle" fill="#fef3c7" fontSize="7.5" fontWeight="bold">¿Stock y Margen</text>
                <text x="240" y="259" textAnchor="middle" fill="#fef3c7" fontSize="7.5" fontWeight="bold">Conformes?</text>

                {/* Rama No Rombo 2 */}
                <path d="M 185 252 L 95 252 L 95 202 L 134 202" fill="none" stroke="#f87171" strokeWidth="1.2" markerEnd="url(#arrB1)" />
                <text x="135" y="247" fill="#f87171" fontSize="7.5">No (Ajustar)</text>

                {/* Rama Sí Rombo 2 */}
                <line x1="240" y1="276" x2="240" y2="288" stroke="#34d399" strokeWidth="1.3" markerEnd="url(#arrB1)" />
                <text x="248" y="285" fill="#34d399" fontSize="8" fontWeight="bold">Sí</text>

                {/* Actividad 4 */}
                <rect x="135" y="289" width="210" height="26" rx="4" fill="#1e293b" stroke={simStep % 6 === 5 ? "#fff" : "#38bdf8"} strokeWidth="1.4" />
                <text x="240" y="305" textAnchor="middle" fill="#e0f2fe" fontSize="8">
                  Emisión de cotización formal en PDF/Excel y envío
                </text>
                <line x1="240" y1="315" x2="240" y2="327" stroke="#94a3b8" markerEnd="url(#arrB1)" />

                {/* Documento Salida */}
                <rect x="145" y="328" width="190" height="28" rx="3" fill="#3b0764" stroke="#c084fc" strokeWidth="1.3" />
                <text x="240" y="340" textAnchor="middle" fill="#f3e8ff" fontSize="7.8">Cotización Aprobada y Archivada</text>
                <text x="240" y="350" textAnchor="middle" fill="#d8b4fe" fontSize="7.5">en ERP Discos</text>
                <line x1="240" y1="356" x2="240" y2="370" stroke="#94a3b8" markerEnd="url(#arrB1)" />

                {/* Fin */}
                <ellipse cx="240" cy="385" rx="46" ry="13" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                <text x="240" y="388" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="bold">FIN</text>
              </svg>
            ) : (
              <svg
                viewBox="0 0 580 435"
                preserveAspectRatio="xMidYMid meet"
                className={`w-full ${svgContainerHeight} bg-slate-950 border border-slate-800 rounded-xl p-2`}
              >
                <defs>
                  <marker id="arrB2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
                  </marker>
                </defs>

                {/* Inicio */}
                <ellipse cx="275" cy="18" rx="82" ry="14" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                <text x="275" y="16" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">INICIO</text>
                <text x="275" y="25" textAnchor="middle" fill="#bfdbfe" fontSize="7">(Retorno de Lotes de Obra)</text>
                <line x1="275" y1="32" x2="275" y2="42" stroke="#94a3b8" markerEnd="url(#arrB2)" />

                {/* Paso 1 */}
                <rect x="170" y="43" width="210" height="24" rx="4" fill="#064e3b" stroke={simStep % 7 === 0 ? "#fff" : "#34d399"} />
                <text x="275" y="58" textAnchor="middle" fill="#ecfdf5" fontSize="7.8">
                  Descarga en zona de arribo y control visual inicial de daños
                </text>
                <line x1="275" y1="67" x2="275" y2="77" stroke="#94a3b8" markerEnd="url(#arrB2)" />

                {/* Paso 2 */}
                <rect x="170" y="78" width="210" height="24" rx="4" fill="#064e3b" stroke={simStep % 7 === 1 ? "#fff" : "#34d399"} />
                <text x="275" y="93" textAnchor="middle" fill="#ecfdf5" fontSize="7.8">
                  {isToBe ? "Ventana Heijunka + Hidrolavado recirculado" : "Traslado a estación hidrolavado y lavado alta presión"}
                </text>
                <line x1="275" y1="102" x2="275" y2="112" stroke="#94a3b8" markerEnd="url(#arrB2)" />

                {/* Paso 3 */}
                <rect x="170" y="113" width="210" height="24" rx="4" fill="#064e3b" stroke={simStep % 7 === 2 ? "#fff" : "#34d399"} />
                <text x="275" y="128" textAnchor="middle" fill="#ecfdf5" fontSize="7.8">
                  Desincrustado neumático de concreto adherido (Atlas Copco)
                </text>
                <line x1="275" y1="137" x2="275" y2="147" stroke="#94a3b8" markerEnd="url(#arrB2)" />

                {/* Rombo 1 */}
                <polygon points="275,148 332,171 275,194 218,171" fill="#78350f" stroke={simStep % 7 === 3 ? "#fff" : "#fbbf24"} strokeWidth="1.4" />
                <text x="275" y="169" textAnchor="middle" fill="#fef3c7" fontSize="7.5" fontWeight="bold">¿Limpieza Superficial</text>
                <text x="275" y="178" textAnchor="middle" fill="#fef3c7" fontSize="7.5" fontWeight="bold">Conforme?</text>

                {/* Bucle No (Relavar) */}
                <path d="M 218 171 L 115 171 L 115 90 L 169 90" fill="none" stroke="#f87171" strokeWidth="1.3" markerEnd="url(#arrB2)" />
                <text x="155" y="166" fill="#f87171" fontSize="7.5" fontWeight="bold">No (Relavar)</text>

                <line x1="275" y1="194" x2="275" y2="204" stroke="#34d399" markerEnd="url(#arrB2)" />
                <text x="283" y="202" fill="#34d399" fontSize="7.5" fontWeight="bold">Sí</text>

                {/* Rombo 2: Tipo Componente */}
                <polygon points="275,205 332,227 275,249 218,227" fill="#78350f" stroke={simStep % 7 === 4 ? "#fff" : "#fbbf24"} strokeWidth="1.4" />
                <text x="275" y="225" textAnchor="middle" fill="#fef3c7" fontSize="7.5" fontWeight="bold">¿Tipo de</text>
                <text x="275" y="234" textAnchor="middle" fill="#fef3c7" fontSize="7.5" fontWeight="bold">Componente?</text>

                {/* Rama Izquierda: Piezas Pequeñas */}
                <path d="M 218 227 L 120 227 L 120 254" fill="none" stroke="#38bdf8" strokeWidth="1.2" markerEnd="url(#arrB2)" />
                <text x="165" y="223" textAnchor="middle" fill="#7dd3fc" fontSize="7">Piezas Pequeñas</text>
                <rect x="25" y="255" width="190" height="28" rx="4" fill="#064e3b" stroke="#34d399" />
                <text x="120" y="267" textAnchor="middle" fill="#ecfdf5" fontSize="7.2">Traslado a Molino Plank, granallado</text>
                <text x="120" y="277" textAnchor="middle" fill="#ecfdf5" fontSize="7.2">y prueba de embonado</text>

                {/* Rama Derecha: Plataformas */}
                <path d="M 332 227 L 430 227 L 430 254" fill="none" stroke="#f59e0b" strokeWidth="1.2" markerEnd="url(#arrB2)" />
                <text x="382" y="223" textAnchor="middle" fill="#fcd34d" fontSize="7">Plataformas</text>
                <rect x="335" y="255" width="190" height="28" rx="4" fill="#064e3b" stroke="#34d399" />
                <text x="430" y="267" textAnchor="middle" fill="#ecfdf5" fontSize="7.2">Traslado a taller fenólicos, recambio</text>
                <text x="430" y="277" textAnchor="middle" fill="#ecfdf5" fontSize="7.2">panel y control dimensional</text>

                {/* Unión en Enzunchado */}
                <path d="M 120 283 L 120 301 L 169 301" fill="none" stroke="#94a3b8" strokeWidth="1.2" markerEnd="url(#arrB2)" />
                <path d="M 430 283 L 430 301 L 381 301" fill="none" stroke="#94a3b8" strokeWidth="1.2" markerEnd="url(#arrB2)" />

                <rect x="170" y="290" width="210" height="22" rx="4" fill="#064e3b" stroke="#34d399" />
                <text x="275" y="304" textAnchor="middle" fill="#ecfdf5" fontSize="7.8">Enzunchado, empaquetado y rotulado en Racks Doka</text>
                <line x1="275" y1="312" x2="275" y2="321" stroke="#94a3b8" markerEnd="url(#arrB2)" />

                {/* Rombo 3: Calidad Final */}
                <polygon points="275,322 332,343 275,364 218,343" fill="#78350f" stroke={simStep % 7 === 5 ? "#fff" : "#fbbf24"} strokeWidth="1.4" />
                <text x="275" y="341" textAnchor="middle" fill="#fef3c7" fontSize="7.3" fontWeight="bold">¿Calidad Final</text>
                <text x="275" y="350" textAnchor="middle" fill="#fef3c7" fontSize="7.3" fontWeight="bold">Aprobada (VoBo)?</text>

                {/* Rama No Rombo 3 */}
                <line x1="332" y1="343" x2="388" y2="343" stroke="#f87171" strokeWidth="1.2" markerEnd="url(#arrB2)" />
                <text x="356" y="339" fill="#f87171" fontSize="7.5" fontWeight="bold">No</text>
                <rect x="389" y="330" width="160" height="26" rx="4" fill="#7f1d1d" stroke="#f87171" />
                <text x="469" y="346" textAnchor="middle" fill="#fecaca" fontSize="7.3">Devolver lote a reproceso / ajuste</text>
                <path d="M 469 330 L 469 301 L 381 301" fill="none" stroke="#94a3b8" strokeWidth="1.1" markerEnd="url(#arrB2)" />

                {/* Rama Sí Rombo 3 */}
                <line x1="275" y1="364" x2="275" y2="373" stroke="#34d399" markerEnd="url(#arrB2)" />
                <text x="283" y="371" fill="#34d399" fontSize="7.5" fontWeight="bold">Sí</text>

                <rect x="165" y="374" width="220" height="22" rx="4" fill="#1e293b" stroke={simStep % 7 === 6 ? "#fff" : "#38bdf8"} />
                <text x="275" y="388" textAnchor="middle" fill="#e0f2fe" fontSize="7.5">
                  {isToBe ? "Despacho y sincronización API HiVis ↔ Discos" : "Traslado a despacho y doble registro HiVis / ERP Discos"}
                </text>
                <line x1="275" y1="396" x2="275" y2="404" stroke="#94a3b8" markerEnd="url(#arrB2)" />

                {/* Documento Final + Fin */}
                <rect x="175" y="405" width="200" height="22" rx="3" fill="#3b0764" stroke="#c084fc" />
                <text x="275" y="419" textAnchor="middle" fill="#f3e8ff" fontSize="7.5" fontWeight="bold">
                  Stock Certificado y Disponible en Almacén (Hub 313)
                </text>
              </svg>
            )}
          </div>
        )}

{/* 6. PARETO 80/20 EXACTO (GRÁFICO 9 DEL INFORME) */}
        {tab === "PARETO" && (() => {
          const pData = isComercial ? PARETO_COMERCIAL : PARETO_PATIO;
          const maxFreq = isComercial ? 60 : 300;
          const yTicksLeft = isComercial ? [0, 10, 20, 30, 40, 50, 60] : [0, 50, 100, 150, 200, 250, 300];
          const chartLeft = 58;
          const chartRight = 560;
          const chartTop = 26;
          const chartBottom = 215;
          const chartW = chartRight - chartLeft;
          const chartH = chartBottom - chartTop;
          const stepX = chartW / pData.length;
          const y80 = chartBottom - 0.8 * chartH;

          return (
            <div className="w-full h-full flex flex-col justify-center space-y-2">
              <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
                <h3 className={`${expanded ? "text-lg" : "text-sm"} font-bold text-white`}>
                  {isComercial
                    ? "Gráfico 9: Diagrama de Pareto — Causas de retraso en la emisión de cotizaciones"
                    : "Diagrama de Pareto — Causas de demora en Patio / Yard Lurín"}
                </h3>
                <span className="text-xs font-mono text-amber-300">
                  {isComercial ? "TOTAL: 58 OCURRENCIAS" : "BASE: 580 H/MES YARD"}
                </span>
              </div>

              <svg
                viewBox="0 0 620 265"
                preserveAspectRatio="xMidYMid meet"
                className={`w-full ${svgContainerHeight} bg-slate-950 border border-slate-800 rounded-xl p-2`}
              >
                {/* Título Eje Y Izquierdo */}
                <text
                  x="16"
                  y={(chartTop + chartBottom) / 2}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8.5"
                  transform={`rotate(-90, 16, ${(chartTop + chartBottom) / 2})`}
                >
                  {isComercial ? "Frecuencia (n.° de ocurrencias)" : "Horas improductivas / mes"}
                </text>

                {/* Título Eje Y Derecho */}
                <text
                  x="604"
                  y={(chartTop + chartBottom) / 2}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8.5"
                  transform={`rotate(90, 604, ${(chartTop + chartBottom) / 2})`}
                >
                  % acumulado
                </text>

                {/* Ejes principales */}
                <line x1={chartLeft} y1={chartTop} x2={chartLeft} y2={chartBottom} stroke="#475569" strokeWidth="1.2" />
                <line x1={chartRight} y1={chartTop} x2={chartRight} y2={chartBottom} stroke="#475569" strokeWidth="1.2" />
                <line x1={chartLeft} y1={chartBottom} x2={chartRight} y2={chartBottom} stroke="#475569" strokeWidth="1.2" />

                {/* Ticks Eje Izquierdo */}
                {yTicksLeft.map((val, idx) => {
                  const y = chartBottom - (val / maxFreq) * chartH;
                  return (
                    <g key={idx}>
                      <line x1={chartLeft - 4} y1={y} x2={chartLeft} y2={y} stroke="#64748b" />
                      <text x={chartLeft - 7} y={y + 3} textAnchor="end" fill="#94a3b8" fontSize="8">
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Ticks Eje Derecho (0% a 100%) */}
                {[0, 20, 40, 60, 80, 100].map((pct, idx) => {
                  const y = chartBottom - (pct / 100) * chartH;
                  return (
                    <g key={idx}>
                      <line x1={chartRight} y1={y} x2={chartRight + 4} y2={y} stroke="#64748b" />
                      <text x={chartRight + 7} y={y + 3} textAnchor="start" fill="#94a3b8" fontSize="8">
                        {pct}
                      </text>
                    </g>
                  );
                })}

                {/* Línea punteada corte 80% */}
                <line
                  x1={chartLeft}
                  y1={y80}
                  x2={chartRight}
                  y2={y80}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text x={chartRight - 6} y={y80 - 4} textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">
                  80 %
                </text>

                {/* Barras */}
                {pData.map((d, i) => {
                  const barW = Math.min(54, stepX * 0.62);
                  const cx = chartLeft + stepX * i + stepX / 2;
                  const x = cx - barW / 2;
                  const barH = (d.freq / maxFreq) * chartH;
                  const y = chartBottom - barH;
                  return (
                    <g key={i}>
                      <motion.rect
                        initial={{ height: 0, y: chartBottom }}
                        animate={{ height: barH, y }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                        x={x}
                        width={barW}
                        rx="2"
                        fill={d.vital ? "#1e4e79" : "#1e293b"}
                        stroke={d.vital ? "#38bdf8" : "#475569"}
                        strokeWidth="1"
                      />
                      {/* Valor dentro de la barra */}
                      <text
                        x={cx}
                        y={y + barH / 2 + 3.5}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {d.freq}
                      </text>
                      {/* Etiquetas X */}
                      <text x={cx} y={chartBottom + 13} textAnchor="middle" fill="#cbd5e1" fontSize="7.5">
                        {d.l1}
                      </text>
                      <text x={cx} y={chartBottom + 23} textAnchor="middle" fill="#cbd5e1" fontSize="7.5">
                        {d.l2}
                      </text>
                    </g>
                  );
                })}

                {/* Curva Naranja Acumulada */}
                <motion.polyline
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9 }}
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2.2"
                  points={pData
                    .map((d, i) => {
                      const cx = chartLeft + stepX * i + stepX / 2;
                      const cy = chartBottom - (d.acc / 100) * chartH;
                      return `${cx},${cy}`;
                    })
                    .join(" ")}
                />

                {/* Puntos y porcentajes sobre la curva */}
                {pData.map((d, i) => {
                  const cx = chartLeft + stepX * i + stepX / 2;
                  const cy = chartBottom - (d.acc / 100) * chartH;
                  return (
                    <g key={i}>
                      <circle cx={cx} cy={cy} r="3.5" fill="#f59e0b" />
                      <text x={cx} y={cy - 7} textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">
                        {d.acc.toFixed(1)}%
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          );
        })()}

        {/* 7. ISHIKAWA 6M IDÉNTICO AL GRÁFICO 8 (CON LÍNEAS HORIZONTALES SECUNDARIAS LIMPIAS) */}
        {tab === "ISHIKAWA" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col justify-center space-y-2"
          >
            <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
              <h3 className={`${expanded ? "text-lg" : "text-sm"} font-bold text-white`}>
                {isComercial
                  ? "Gráfico 8A: Diagrama de Ishikawa — Demora en emisión de cotizaciones (36.5 h)"
                  : "Gráfico 8B: Diagrama de Ishikawa — Demora en el reacondicionamiento de componentes"}
              </h3>
            </div>

            <svg
              viewBox="0 0 640 310"
              preserveAspectRatio="xMidYMid meet"
              className={`w-full ${svgContainerHeight} bg-slate-950 border border-slate-800 rounded-xl p-2`}
            >
              {/* Espina Central */}
              <line x1="75" y1="155" x2="485" y2="155" stroke="#38bdf8" strokeWidth="2.5" />
              <polygon points="485,150 496,155 485,160" fill="#38bdf8" />

              {/* Cabeza del Pez (Problema) */}
              <rect x="498" y="118" width="132" height="74" rx="6" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="564" y="146" textAnchor="middle" fill="#fef3c7" fontSize="9" fontWeight="bold">
                {isComercial ? "Demora en la emisión" : "Demora en el"}
              </text>
              <text x="564" y="158" textAnchor="middle" fill="#fef3c7" fontSize="9" fontWeight="bold">
                {isComercial ? "de cotizaciones" : "reacondicionamiento"}
              </text>
              <text x="564" y="170" textAnchor="middle" fill="#fef3c7" fontSize="9" fontWeight="bold">
                {isComercial ? "comerciales (36.5 h)" : "de componentes"}
              </text>

              {/* 3 ESPINAS SUPERIORES CON RAMAS HORIZONTALES SECUNDARIAS */}
              {(isComercial
                ? [
                    {
                      xTop: 115,
                      xBot: 165,
                      title: "Método",
                      subs: ["Captación manual por correo", "Flujo secuencial sin filtros", "Búsqueda ítem x ítem en ERP"],
                    },
                    {
                      xTop: 255,
                      xBot: 305,
                      title: "Mano de obra",
                      subs: ["Analista CCM saturada", "Carga alta en Ingeniería CAD", "Dependencia de aprobaciones"],
                    },
                    {
                      xTop: 395,
                      xBot: 445,
                      title: "Máquina / TI",
                      subs: ["Portal web global en inglés", "Sin CRM ni prefiltro IA", "Equifax sin integración API"],
                    },
                  ]
                : [
                    {
                      xTop: 115,
                      xBot: 165,
                      title: "Método",
                      subs: ["Sin preinspección en obra", "Secuencia limpieza no estándar", "Componentes sin clasificar"],
                    },
                    {
                      xTop: 255,
                      xBot: 305,
                      title: "Mano de obra",
                      subs: ["Raspado manual con rasquetas", "Desplazamientos entre zonas", "Esfuerzo físico elevado"],
                    },
                    {
                      xTop: 395,
                      xBot: 445,
                      title: "Máquina",
                      subs: ["Hidrolavadoras / Atlas compartidas", "Espera de montacargas", "Capacidad limitada molino Plank"],
                    },
                  ]
              ).map((sp, i) => (
                <g key={i}>
                  <line x1={sp.xTop} y1="34" x2={sp.xBot} y2="155" stroke="#38bdf8" strokeWidth="1.5" />
                  <rect x={sp.xTop - 38} y="12" width="76" height="20" rx="5" fill="#1e3a8a" stroke="#60a5fa" />
                  <text x={sp.xTop} y="25" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="bold">{sp.title}</text>

                  {sp.subs.map((sub, si) => {
                    const y = 55 + si * 33;
                    const xAttach = sp.xTop + ((y - 34) / (155 - 34)) * (sp.xBot - sp.xTop);
                    return (
                      <g key={si}>
                        <line x1={xAttach - 36} y1={y} x2={xAttach} y2={y} stroke="#64748b" strokeWidth="1" />
                        <text x={xAttach - 40} y={y + 3} textAnchor="end" fill="#cbd5e1" fontSize="7.2">
                          {sub}
                        </text>
                      </g>
                    );
                  })}
                </g>
              ))}

              {/* 3 ESPINAS INFERIORES CON RAMAS HORIZONTALES SECUNDARIAS */}
              {(isComercial
                ? [
                    {
                      xBot: 115,
                      xTop: 165,
                      title: "Material",
                      subs: ["Planos CAD incompletos", "Datos de RUC sin validar"],
                    },
                    {
                      xBot: 255,
                      xTop: 305,
                      title: "Medición",
                      subs: ["Sin KPIs de respuesta", "33h muertas no visibles"],
                    },
                    {
                      xBot: 395,
                      xTop: 445,
                      title: "Medio ambiente",
                      subs: ["Alta exigencia minera", "Respuesta cliente (24 h)"],
                    },
                  ]
                : [
                    {
                      xBot: 115,
                      xTop: 165,
                      title: "Material",
                      subs: ["Accesorios faltantes", "Pernería y fenólicos dañados", "Residuos de concreto adheridos"],
                    },
                    {
                      xBot: 255,
                      xTop: 305,
                      title: "Medición",
                      subs: ["Sin control piezas observadas", "Sin registro tiempos en Yard"],
                    },
                    {
                      xBot: 395,
                      xTop: 445,
                      title: "Medio ambiente",
                      subs: ["Dependencia camiones cisterna", "Sede Lurín sin red de agua"],
                    },
                  ]
              ).map((sp, i) => (
                <g key={i}>
                  <line x1={sp.xBot} y1="276" x2={sp.xTop} y2="155" stroke="#38bdf8" strokeWidth="1.5" />
                  <rect x={sp.xBot - 42} y="278" width="84" height="20" rx="5" fill="#1e3a8a" stroke="#60a5fa" />
                  <text x={sp.xBot} y="291" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="bold">{sp.title}</text>

                  {sp.subs.map((sub, si) => {
                    const y = 190 + si * 33;
                    const xAttach = sp.xTop - ((y - 155) / (276 - 155)) * (sp.xTop - sp.xBot);
                    return (
                      <g key={si}>
                        <line x1={xAttach - 36} y1={y} x2={xAttach} y2={y} stroke="#64748b" strokeWidth="1" />
                        <text x={xAttach - 40} y={y + 3} textAnchor="end" fill="#cbd5e1" fontSize="7.2">
                          {sub}
                        </text>
                      </g>
                    );
                  })}
                </g>
              ))}
            </svg>
          </motion.div>
        )}

        {/* 8. TABLA 4: INDICADORES DE GESTIÓN (KPIS) */}
        {tab === "KPIS" && (
          <div className={`w-full ${expanded ? "max-w-5xl mx-auto" : ""} space-y-2.5`}>
            <div className="flex items-center justify-between">
              <h3 className={`${expanded ? "text-lg" : "text-sm"} font-bold text-white`}>
                Tabla 4: Indicadores de Control y Seguimiento (KPIs)
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
      </div>
    </div>
  );
}