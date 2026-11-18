"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Cpu, Truck, Droplets, Database, MessageSquare, FileSpreadsheet } from "lucide-react";

interface DioramaProps {
  mode: "AS-IS" | "TO-BE";
  zone: "COMERCIAL" | "PATIO";
  setZone: (z: "COMERCIAL" | "PATIO") => void;
}

interface NodeInfo {
  id: string;
  title: string;
  code?: string;
  asIsTime: string;
  toBeTime: string;
  asIsDesc: string;
  toBeDesc: string;
  status: "bottleneck" | "ok";
}

const COMERCIAL_NODES: Record<string, NodeInfo> = {
  entrada: {
    id: "entrada",
    title: "Captación de Solicitudes",
    asIsTime: "120 min espera",
    toBeTime: "< 1 min (24/7)",
    asIsDesc: "Correos manuales, llamadas y portal global en inglés desvinculado de Perú.",
    toBeDesc: "Portal local + WhatsApp Cloud API conectado a n8n con captura instantánea.",
    status: "bottleneck",
  },
  ccm: {
    id: "ccm",
    title: "Evaluación Crediticia (CCM / Equifax)",
    asIsTime: "180 min en cola",
    toBeTime: "Tiempo real (API)",
    asIsDesc: "La encargada CCM evalúa manualmente en Equifax solicitudes sin filtrar.",
    toBeDesc: "Agente IA (Ollama Cloud) precalifica RUC y filtra solvencia antes de pasar a CCM.",
    status: "bottleneck",
  },
  ingenieria: {
    id: "ingenieria",
    title: "Diseño Estructural CAD/BIM",
    code: "Cód. 900100000",
    asIsTime: "240 min espera + 60 min diseño",
    toBeTime: "Plantillas modulares",
    asIsDesc: "Saturación de planos CAD/BIM por requerimientos no precalificados.",
    toBeDesc: "Despiece estandarizado Ringlock/DokaScaff con listas preconfiguradas.",
    status: "bottleneck",
  },
  erp: {
    id: "erp",
    title: "Valorización en ERP Discos",
    asIsTime: "45 min búsqueda manual",
    toBeTime: "Sincronizado",
    asIsDesc: "Cruce manual ítem por ítem en Discos y armado manual en PDF/Excel.",
    toBeDesc: "Vinculación directa de catálogo CAD con códigos ERP Discos sin errores.",
    status: "ok",
  },
};

const PATIO_NODES: Record<string, NodeInfo> = {
  arribo: {
    id: "arribo",
    title: "Recepción y Descarga de Obra",
    code: "Cód. 999300104",
    asIsTime: "20 min + retorno masivo",
    toBeTime: "Ventanas Heijunka",
    asIsDesc: "Retorno simultáneo de grandes lotes sin preinspección en obra.",
    toBeDesc: "Programación nivelada por ventanas horarias + checklist digital en origen.",
    status: "ok",
  },
  lavado: {
    id: "lavado",
    title: "Estación de Hidrolavado Industrial",
    asIsTime: "35 min cola + 30 min lavado",
    toBeTime: "15 min flujo continuo",
    asIsDesc: "Cuello de botella en horas pico y dependencia de agua cisterna en Lurín.",
    toBeDesc: "Nivelación de carga + sistema de sedimentación y recirculación de agua.",
    status: "bottleneck",
  },
  taller: {
    id: "taller",
    title: "Desincrustado Atlas Copco & Molino Plank",
    asIsTime: "62 m recorrido montacargas",
    toBeTime: "-40% distancia (Layout U)",
    asIsDesc: "Estaciones dispersas generan flujos cruzados y acarreos largos.",
    toBeDesc: "Rediseño celular en forma de U + estandarización 5S en herramientas.",
    status: "bottleneck",
  },
  sistema: {
    id: "sistema",
    title: "Control de Stock: HiVis vs. Discos",
    asIsTime: "20 min doble digitación",
    toBeTime: "0 min (Puente API)",
    asIsDesc: "Desconexión total: operarios digitan inventario dos veces (HiVis y Discos).",
    toBeDesc: "Poka-Yoke digital: sincronización automática en tiempo real vía API.",
    status: "bottleneck",
  },
};

export default function IsometricDiorama({ mode, zone, setZone }: DioramaProps) {
  const [selectedId, setSelectedId] = useState<string>(zone === "COMERCIAL" ? "ccm" : "lavado");

  const nodes = zone === "COMERCIAL" ? COMERCIAL_NODES : PATIO_NODES;
  const activeNode = nodes[selectedId] || Object.values(nodes)[0];
  const isToBe = mode === "TO-BE";

  const handleZoneChange = (newZone: "COMERCIAL" | "PATIO") => {
    setZone(newZone);
    setSelectedId(newZone === "COMERCIAL" ? "ccm" : "lavado");
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-[#0f151d] border border-slate-800 rounded-2xl p-5 overflow-hidden tech-grid">
      {/* Esquinas tipo visor técnico (Inspirado en referencia) */}
      <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-emerald-400/70 pointer-events-none" />
      <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-emerald-400/70 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-emerald-400/70 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-emerald-400/70 pointer-events-none" />

      {/* Encabezado del Diorama */}
      <div className="flex flex-wrap items-center justify-between gap-3 z-10">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase">
            // MAQUETA OPERATIVA INTERACTIVA — AT-PAC PERÚ S.A.C.
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {zone === "COMERCIAL"
              ? "Planta 01: Ciclo Comercial y Evaluación Crediticia"
              : "Planta 02: Operaciones de Patio / Yard (Hub 313 Lurín)"}
          </h2>
        </div>

        {/* Selector de Escenario (Estilo botones flotantes) */}
        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 shadow-lg">
          <button
            onClick={() => handleZoneChange("COMERCIAL")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              zone === "COMERCIAL"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Oficina Comercial
          </button>
          <button
            onClick={() => handleZoneChange("PATIO")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              zone === "PATIO"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Patio Lurín (Yard)
          </button>
        </div>
      </div>

      {/* Lienzo Central Isométrico SVG */}
      <div className="relative flex-1 flex items-center justify-center my-2 min-h-[320px]">
        <svg viewBox="0 0 760 360" className="w-full h-full max-h-[370px] drop-shadow-2xl">
          {/* Base Isométrica de la Planta */}
          <polygon
            points="380,35 710,180 380,325 50,180"
            fill={isToBe ? "#0d1f1d" : "#151b24"}
            stroke={isToBe ? "#10b981" : "#334155"}
            strokeWidth="2"
            className="transition-colors duration-500"
          />
          {/* Grilla interna isométrica */}
          <line x1="215" y1="107" x2="545" y2="252" stroke="#1e293b" strokeWidth="1" />
          <line x1="545" y1="107" x2="215" y2="252" stroke="#1e293b" strokeWidth="1" />

          {zone === "COMERCIAL" ? (
            <>
              {/* RUTAS DE CONEXIÓN COMERCIAL */}
              <path
                d="M 190 175 L 330 120 L 470 175 L 360 245"
                fill="none"
                stroke={isToBe ? "#10b981" : "#ef4444"}
                strokeWidth="4"
                strokeLinecap="round"
                className={isToBe ? "animate-flow-fast" : "animate-flow-slow"}
              />

              {/* NODO CENTRAL IA + n8n (Solo visible en TO-BE, estilo Central de Conexiones) */}
              {isToBe && (
                <g transform="translate(335, 165)">
                  <rect
                    x="-42"
                    y="-22"
                    width="84"
                    height="44"
                    rx="10"
                    fill="#064e3b"
                    stroke="#34d399"
                    strokeWidth="2"
                  />
                  <text x="0" y="-3" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontWeight="bold">
                    n8n + IA
                  </text>
                  <text x="0" y="10" textAnchor="middle" fill="#ecfdf5" fontSize="8">
                    Ollama Cloud
                  </text>
                </g>
              )}

              {/* ESTACIÓN 1: ENTRADA / WHATSAPP */}
              <g
                onClick={() => setSelectedId("entrada")}
                className="cursor-pointer transition-transform hover:scale-105"
                transform="translate(185, 175)"
              >
                <polygon points="0,-28 48,-6 0,16 -48,-6" fill={selectedId === "entrada" ? "#10b981" : "#1e293b"} stroke="#94a3b8" strokeWidth="1.5" />
                <polygon points="-48,-6 0,16 0,34 -48,12" fill="#0f172a" />
                <polygon points="48,-6 0,16 0,34 48,12" fill="#1e293b" />
                <text x="0" y="-3" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                  {isToBe ? "WhatsApp API" : "Correos / Web"}
                </text>
                <text x="0" y="48" textAnchor="middle" fill={isToBe ? "#34d399" : "#f87171"} fontSize="10" fontWeight="bold">
                  {isToBe ? "✓ 24/7 Activo" : "⚠ 120m cola"}
                </text>
              </g>

              {/* ESTACIÓN 2: CCM / EQUIFAX */}
              <g
                onClick={() => setSelectedId("ccm")}
                className="cursor-pointer transition-transform hover:scale-105"
                transform="translate(330, 115)"
              >
                <polygon points="0,-28 52,-6 0,16 -52,-6" fill={selectedId === "ccm" ? "#10b981" : "#1e293b"} stroke="#94a3b8" strokeWidth="1.5" />
                <polygon points="-52,-6 0,16 0,34 -52,12" fill="#0f172a" />
                <polygon points="52,-6 0,16 0,34 52,12" fill="#1e293b" />
                <text x="0" y="-3" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                  CCM / Equifax
                </text>
                <text x="0" y="-36" textAnchor="middle" fill={isToBe ? "#34d399" : "#fbbf24"} fontSize="10" fontWeight="bold">
                  {isToBe ? "✓ Pre-filtrado" : "⚠ 180m espera"}
                </text>
              </g>

              {/* ESTACIÓN 3: INGENIERÍA CAD/BIM */}
              <g
                onClick={() => setSelectedId("ingenieria")}
                className="cursor-pointer transition-transform hover:scale-105"
                transform="translate(485, 175)"
              >
                <polygon points="0,-28 54,-6 0,16 -54,-6" fill={selectedId === "ingenieria" ? "#10b981" : "#1e293b"} stroke="#94a3b8" strokeWidth="1.5" />
                <polygon points="-54,-6 0,16 0,34 -54,12" fill="#0f172a" />
                <polygon points="54,-6 0,16 0,34 54,12" fill="#1e293b" />
                <text x="0" y="-3" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                  Ingeniería BIM
                </text>
                <text x="0" y="48" textAnchor="middle" fill={isToBe ? "#34d399" : "#f87171"} fontSize="10" fontWeight="bold">
                  {isToBe ? "✓ Plantillas" : "⚠ 240m cola"}
                </text>
              </g>

              {/* ESTACIÓN 4: ERP DISCOS */}
              <g
                onClick={() => setSelectedId("erp")}
                className="cursor-pointer transition-transform hover:scale-105"
                transform="translate(355, 250)"
              >
                <polygon points="0,-26 50,-6 0,14 -50,-6" fill={selectedId === "erp" ? "#10b981" : "#1e293b"} stroke="#94a3b8" strokeWidth="1.5" />
                <polygon points="-50,-6 0,14 0,32 -50,12" fill="#0f172a" />
                <polygon points="50,-6 0,14 0,32 50,12" fill="#1e293b" />
                <text x="0" y="-3" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                  ERP Discos
                </text>
                <text x="0" y="46" textAnchor="middle" fill="#94a3b8" fontSize="10">
                  {isToBe ? "✓ Auto-Cotización" : "45m búsqueda"}
                </text>
              </g>
            </>
          ) : (
            <>
              {/* RUTAS DE PATIO: Disperso en AS-IS vs Layout en U en TO-BE */}
              <path
                d={
                  isToBe
                    ? "M 210 140 L 210 220 L 380 255 L 530 200 L 530 135"
                    : "M 180 175 L 340 110 L 290 235 L 510 145 L 450 250"
                }
                fill="none"
                stroke={isToBe ? "#10b981" : "#f59e0b"}
                strokeWidth="4"
                strokeLinecap="round"
                className={isToBe ? "animate-flow-fast" : "animate-flow-slow"}
              />

              {/* ESTACIÓN PATIO 1: ARRIBO */}
              <g
                onClick={() => setSelectedId("arribo")}
                className="cursor-pointer"
                transform={isToBe ? "translate(210, 140)" : "translate(180, 175)"}
              >
                <polygon points="0,-24 46,-4 0,16 -46,-4" fill={selectedId === "arribo" ? "#10b981" : "#1e293b"} stroke="#94a3b8" strokeWidth="1.5" />
                <text x="0" y="-1" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                  Arribo Obra
                </text>
                <text x="0" y="30" textAnchor="middle" fill="#94a3b8" fontSize="9">
                  Cód. 999300104
                </text>
              </g>

              {/* ESTACIÓN PATIO 2: HIDROLAVADO */}
              <g
                onClick={() => setSelectedId("lavado")}
                className="cursor-pointer"
                transform={isToBe ? "translate(220, 225)" : "translate(340, 110)"}
              >
                <polygon points="0,-24 52,-4 0,16 -52,-4" fill={selectedId === "lavado" ? "#10b981" : "#1e293b"} stroke="#38bdf8" strokeWidth="1.5" />
                <text x="0" y="-1" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                  Hidrolavado
                </text>
                <text x="0" y="30" textAnchor="middle" fill={isToBe ? "#34d399" : "#f87171"} fontSize="9" fontWeight="bold">
                  {isToBe ? "✓ Agua Recirculada" : "⚠ 35m cola + Cisterna"}
                </text>
              </g>

              {/* ESTACIÓN PATIO 3: ATLAS COPCO / PLANK */}
              <g
                onClick={() => setSelectedId("taller")}
                className="cursor-pointer"
                transform={isToBe ? "translate(385, 250)" : "translate(310, 235)"}
              >
                <polygon points="0,-24 56,-4 0,16 -56,-4" fill={selectedId === "taller" ? "#10b981" : "#1e293b"} stroke="#94a3b8" strokeWidth="1.5" />
                <text x="0" y="-1" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                  Plank & Fenólicos
                </text>
                <text x="0" y="30" textAnchor="middle" fill={isToBe ? "#34d399" : "#fbbf24"} fontSize="9" fontWeight="bold">
                  {isToBe ? "✓ Layout U (-40% m)" : "⚠ 62m montacargas"}
                </text>
              </g>

              {/* ESTACIÓN PATIO 4: HIVIS + DISCOS */}
              <g
                onClick={() => setSelectedId("sistema")}
                className="cursor-pointer"
                transform={isToBe ? "translate(530, 145)" : "translate(495, 165)"}
              >
                <polygon points="0,-24 54,-4 0,16 -54,-4" fill={selectedId === "sistema" ? "#10b981" : "#1e293b"} stroke="#a855f7" strokeWidth="1.5" />
                <text x="0" y="-1" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                  HiVis + Discos
                </text>
                <text x="0" y="30" textAnchor="middle" fill={isToBe ? "#34d399" : "#f87171"} fontSize="9" fontWeight="bold">
                  {isToBe ? "✓ Puente API Sync" : "⚠ 20m doble registro"}
                </text>
              </g>
            </>
          )}
        </svg>

        {/* Tarjeta Flotante de Inspección del Nodo Seleccionado */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeNode.id}-${mode}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-2 right-2 w-80 bg-slate-950/95 backdrop-blur-md border border-slate-700/90 rounded-xl p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono uppercase text-emerald-400">
                {activeNode.code || "ESTACIÓN OPERATIVA"}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isToBe
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                }`}
              >
                {isToBe ? activeNode.toBeTime : activeNode.asIsTime}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">{activeNode.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isToBe ? activeNode.toBeDesc : activeNode.asIsDesc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Barra de Estado Inferior (Estilo referencia "✓ En marcha") */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs z-10">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="font-mono">HAZ CLIC EN CADA ESTACIÓN PARA INSPECCIONAR</span>
        </div>
        <div
          className={`flex items-center gap-1.5 font-mono font-semibold px-3 py-1 rounded-full ${
            isToBe
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
          }`}
        >
          {isToBe ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" /> ✓ Flujo TO-BE Optimizado
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5" /> Cuellos de Botella AS-IS Activos
            </>
          )}
        </div>
      </div>
    </div>
  );
}