"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Truck, Sparkles, AlertTriangle, MousePointerClick } from "lucide-react";

interface DioramaProps {
  mode: "AS-IS" | "TO-BE";
  zone: "COMERCIAL" | "PATIO";
  setZone: (z: "COMERCIAL" | "PATIO") => void;
}

interface StationInfo {
  id: string;
  title: string;
  asIsTime: string;
  toBeTime: string;
  asIsDesc: string;
  toBeDesc: string;
}

const STATIONS_COMERCIAL: Record<string, StationInfo> = {
  portal: {
    id: "portal",
    title: "Recepción de Solicitudes (Correo / Web)",
    asIsTime: "120 min en cola",
    toBeTime: "Instantáneo (< 1 min)",
    asIsDesc:
      "Los requerimientos llegan sin filtrar por correo, llamadas o formulario web en inglés, acumulándose en bandeja comercial.",
    toBeDesc:
      "Portal Web Local en español conectado a WhatsApp Cloud API y Agente IA (Ollama Cloud) 24/7 que estructura los datos al instante.",
  },
  ccm: {
    id: "ccm",
    title: "Evaluación Crediticia (CCM / Equifax)",
    asIsTime: "180 min en cola",
    toBeTime: "Automático (API)",
    asIsDesc:
      "La encargada CCM evalúa manualmente en Equifax solicitudes sin filtrar, generando un cuello de botella de 3 horas.",
    toBeDesc:
      "Orquestador n8n consulta el RUC en Equifax automáticamente y deriva a pago al contado si no califica, liberando a CCM.",
  },
  cad: {
    id: "cad",
    title: "Ingeniería Estructural CAD / BIM (Cód. 900100000)",
    asIsTime: "240 min en cola",
    toBeTime: "30 min (Plantillas BIM)",
    asIsDesc:
      "Espera de 4 horas en bandeja de Ingeniería para elaborar el plano de modulación y despiece de andamios Ringlock.",
    toBeDesc:
      "Requerimiento técnico pre-clasificado por IA con plantillas paramétricas CAD/BIM listas para validación.",
  },
  discos: {
    id: "discos",
    title: "Valorización y Cotización en ERP Discos",
    asIsTime: "45 min búsqueda",
    toBeTime: "2 min integrado",
    asIsDesc:
      "Búsqueda manual ítem por ítem en Discos para cruzar códigos de andamios, precios y emitir cotización en PDF/Excel.",
    toBeDesc:
      "Pre-cotización automática vinculada al maestro de artículos de Discos, reduciendo el ciclo de 36.5 h a menos de 2 h.",
  },
};

const STATIONS_PATIO: Record<string, StationInfo> = {
  retorno: {
    id: "retorno",
    title: "Recepción Retornos de Obra (Cód. 999300104)",
    asIsTime: "Sin clasificar",
    toBeTime: "Ventanas Heijunka",
    asIsDesc:
      "Lotes de andamios retornan sin aviso ni preinspección en obra, llegando con concreto adherido y mezclado.",
    toBeDesc:
      "Programación nivelada Heijunka con preinspección móvil HiVis en obra antes del despacho hacia Lurín.",
  },
  hidrolavado: {
    id: "hidrolavado",
    title: "Estación de Hidrolavado Industrial",
    asIsTime: "35 min en cola",
    toBeTime: "0 min (Agua Recirc.)",
    asIsDesc:
      "Sede Lurín sin red pública de agua; dependencia de camiones cisterna y colas de 35 min en hidrolavadoras.",
    toBeDesc:
      "Sistema cerrado de sedimentación y recirculación de agua industrial que garantiza flujo continuo sin paradas.",
  },
  plank: {
    id: "plank",
    title: "Desincrustado Atlas Copco & Molino Plank",
    asIsTime: "65 min proceso",
    toBeTime: "42 min (Celda 5S)",
    asIsDesc:
      "Raspado manual de concreto adherido y limpieza por fricción en estaciones alejadas con acarreos cruzados.",
    toBeDesc:
      "Integrado en secuencia continua dentro del Layout Celular en U con herramientas neumáticas estandarizadas 5S.",
  },
  fenolicos: {
    id: "fenolicos",
    title: "Taller de Tableros Fenólicos (CP7748)",
    asIsTime: "30 min + 62m acarreo",
    toBeTime: "20 min (Ruta U 37m)",
    asIsDesc:
      "Desmontaje y recambio de paneles dañados con recorridos de 62 metros en montacargas por el patio.",
    toBeDesc:
      "Ubicado en el vértice de la celda en U, recortando el desplazamiento de montacargas de 62 m a 37 m (-40%).",
  },
  almacen: {
    id: "almacen",
    title: "Almacén Hub 313 — Sincronización HiVis ↔ Discos",
    asIsTime: "20 min doble reg.",
    toBeTime: "Tiempo Real (API)",
    asIsDesc:
      "Doble digitación manual del stock reacondicionado entre el sistema operativo HiVis y el ERP contable Discos.",
    toBeDesc:
      "Puente API automático (Poka-Yoke digital) que actualiza el inventario certificado en ambos sistemas al instante.",
  },
};

function PokeCharacter({
  x,
  y,
  outfit,
  isWorker = false,
  name,
  bubble,
  alert = false,
  selected = false,
  onClick,
}: {
  x: number;
  y: number;
  outfit: string;
  isWorker?: boolean;
  name: string;
  bubble: string;
  alert?: boolean;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <g transform={`translate(${x}, ${y})`} onClick={onClick} className="cursor-pointer group">
      {/* Aro de selección interactivo */}
      {selected && (
        <ellipse
          cx="0"
          cy="18"
          rx="22"
          ry="10"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeDasharray="4 2"
        />
      )}

      {/* Sombra ovalada estilo GBA */}
      <ellipse cx="0" cy="18" rx="13" ry="5.5" fill="rgba(0,0,0,0.45)" />

      {/* Botas */}
      <rect x="-8" y="12" width="6.5" height="6" rx="2" fill="#1e293b" stroke="#090d16" strokeWidth="1.2" />
      <rect x="1.5" y="12" width="6.5" height="6" rx="2" fill="#1e293b" stroke="#090d16" strokeWidth="1.2" />

      {/* Cuerpo Chibi */}
      <rect x="-10" y="-4" width="20" height="17" rx="5" fill={outfit} stroke={selected ? "#ffffff" : "#090d16"} strokeWidth="1.5" />
      {isWorker && (
        <>
          <line x1="-10" y1="3" x2="10" y2="3" stroke="#fef08a" strokeWidth="2.2" />
          <line x1="-5" y1="-4" x2="-5" y2="13" stroke="#fef08a" strokeWidth="1.8" />
          <line x1="5" y1="-4" x2="5" y2="13" stroke="#fef08a" strokeWidth="1.8" />
        </>
      )}

      {/* Cabeza Chibi Pokémon */}
      <rect x="-12" y="-24" width="24" height="21" rx="8" fill="#fde68a" stroke="#090d16" strokeWidth="1.5" />
      <rect x="-6.5" y="-15" width="3.2" height="5.5" rx="1.5" fill="#090d16" />
      <rect x="3.5" y="-15" width="3.2" height="5.5" rx="1.5" fill="#090d16" />
      <circle cx="-5.5" cy="-13.8" r="1" fill="#ffffff" />
      <circle cx="4.5" cy="-13.8" r="1" fill="#ffffff" />

      {/* Casco / Cabello */}
      {isWorker ? (
        <>
          <path d="M -13 -19 C -13 -29, 13 -29, 13 -19 Z" fill="#facc15" stroke="#090d16" strokeWidth="1.5" />
          <rect x="-15" y="-20" width="30" height="3.5" rx="1.5" fill="#eab308" stroke="#090d16" strokeWidth="1.2" />
        </>
      ) : (
        <path d="M -12 -19 C -12 -28, 12 -28, 12 -19 C 6 -22, -6 -22, -12 -19 Z" fill="#1e293b" stroke="#090d16" strokeWidth="1.3" />
      )}

      {/* Etiqueta Pixel-Box */}
      <rect
        x="-44"
        y="21"
        width="88"
        height="15"
        rx="4"
        fill={selected ? "#38bdf8" : "#f8fafc"}
        stroke="#0f172a"
        strokeWidth="1.5"
      />
      <text x="0" y="31" textAnchor="middle" fill="#0f172a" fontSize="8" fontWeight="900">
        {name}
      </text>

      {/* Globo de diálogo */}
      <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
        <rect
          x="-38"
          y="-48"
          width="76"
          height="17"
          rx="5"
          fill={alert ? "#ef4444" : "#10b981"}
          stroke="#ffffff"
          strokeWidth="1.4"
        />
        <polygon points="-4,-31 4,-31 0,-26" fill={alert ? "#ef4444" : "#10b981"} />
        <text x="0" y="-36.5" textAnchor="middle" fill="#ffffff" fontSize="7.8" fontWeight="bold">
          {alert ? `! ${bubble}` : `★ ${bubble}`}
        </text>
      </motion.g>
    </g>
  );
}

function PokeScaffoldRack({
  x,
  y,
  title,
  sub,
  selected = false,
  onClick,
}: {
  x: number;
  y: number;
  title: string;
  sub: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <g transform={`translate(${x}, ${y})`} onClick={onClick} className="cursor-pointer">
      <polygon
        points="-34,12 0,-4 34,12 0,28"
        fill="#475569"
        stroke={selected ? "#38bdf8" : "#0f172a"}
        strokeWidth={selected ? "2.2" : "1.5"}
      />
      <rect x="-26" y="-8" width="52" height="9" rx="2" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1.3" />
      <rect x="-23" y="-17" width="46" height="8" rx="2" fill="#b45309" stroke="#0f172a" strokeWidth="1.3" />
      <line x1="-28" y1="-21" x2="-28" y2="12" stroke="#f8fafc" strokeWidth="2.2" />
      <line x1="28" y1="-21" x2="28" y2="12" stroke="#f8fafc" strokeWidth="2.2" />
      <rect
        x="-42"
        y="29"
        width="84"
        height="22"
        rx="4"
        fill={selected ? "#0c4a6e" : "#0f172a"}
        stroke={selected ? "#38bdf8" : "#64748b"}
        strokeWidth="1.2"
      />
      <text x="0" y="38.5" textAnchor="middle" fill="#f8fafc" fontSize="7.5" fontWeight="bold">
        {title}
      </text>
      <text x="0" y="47.5" textAnchor="middle" fill="#38bdf8" fontSize="6.8" fontWeight="bold">
        {sub}
      </text>
    </g>
  );
}

export default function IsometricDiorama({ mode, zone, setZone }: DioramaProps) {
  const [selectedComercial, setSelectedComercial] = useState<string>("ccm");
  const [selectedPatio, setSelectedPatio] = useState<string>("hidrolavado");

  const isToBe = mode === "TO-BE";
  const isComercial = zone === "COMERCIAL";
  const activeStation = isComercial
    ? STATIONS_COMERCIAL[selectedComercial]
    : STATIONS_PATIO[selectedPatio];

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#0f151d] border border-slate-800 rounded-2xl p-4 relative overflow-hidden">
      {/* CABECERA */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800 z-10">
        <div>
          <span className="text-[10px] font-mono text-emerald-400 block">
            // MAQUETA OPERATIVA INTERACTIVA — AT-PAC PERÚ S.A.C.
          </span>
          <h2 className="text-sm md:text-base font-bold text-white">
            {isComercial
              ? "Planta 01: Ciclo Comercial y Evaluación Crediticia"
              : "Planta 02: Patio / Yard Lurín (Hub 313)"}
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZone("COMERCIAL")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              isComercial
                ? "bg-emerald-500 text-slate-950 shadow"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Oficina Comercial
          </button>

          <button
            onClick={() => setZone("PATIO")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              !isComercial
                ? "bg-amber-500 text-slate-950 shadow"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            Patio Lurín (Yard)
          </button>
        </div>
      </div>

      {/* ESCENARIO POKÉMON ISOMÉTRICO CLICABLE */}
      <div className="flex-1 flex items-center justify-center relative my-1">
        {isComercial ? (
          <svg viewBox="0 0 600 345" className="w-full h-[290px] select-none">
            <defs>
              <pattern id="pokeTileBlue" width="28" height="28" patternUnits="userSpaceOnUse">
                <rect width="28" height="28" fill="#0f2942" />
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#1d4ed8" strokeWidth="0.9" />
              </pattern>
            </defs>

            <polygon
              points="300,18 585,160 300,305 15,160"
              fill="url(#pokeTileBlue)"
              stroke={isToBe ? "#10b981" : "#38bdf8"}
              strokeWidth="2.2"
            />
            <polygon points="15,160 300,305 300,326 15,181" fill="#081526" stroke="#1e3a8a" strokeWidth="1.4" />
            <polygon points="300,305 585,160 585,181 300,326" fill="#0c213b" stroke="#1e3a8a" strokeWidth="1.4" />

            <path
              d="M 105 162 L 215 102 L 385 102 L 495 162 L 300 245"
              fill="none"
              stroke={isToBe ? "#34d399" : "#f87171"}
              strokeWidth="4.2"
              strokeDasharray="8 5"
            />

            {/* Poké-Paquete viajando */}
            <motion.g
              animate={{
                x: [105, 215, 385, 495, 300],
                y: [162, 102, 102, 162, 245],
              }}
              transition={{ duration: isToBe ? 2.8 : 6.5, repeat: Infinity, ease: "linear" }}
            >
              <circle r="8" fill={isToBe ? "#10b981" : "#ef4444"} stroke="#090d16" strokeWidth="1.8" />
              <path d="M -8 0 L 8 0" stroke="#090d16" strokeWidth="1.8" />
              <circle r="3" fill="#ffffff" stroke="#090d16" strokeWidth="1.2" />
            </motion.g>

            {/* Estación 1: Portal / WhatsApp IA */}
            <g
              transform="translate(105, 162)"
              onClick={() => setSelectedComercial("portal")}
              className="cursor-pointer"
            >
              <rect
                x="-52"
                y="-24"
                width="104"
                height="42"
                rx="8"
                fill={isToBe ? "#065f46" : "#1e293b"}
                stroke={selectedComercial === "portal" ? "#38bdf8" : "#ffffff"}
                strokeWidth={selectedComercial === "portal" ? "2.4" : "1.4"}
              />
              <text x="0" y="-6" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                {isToBe ? "WhatsApp + IA" : "Correos / Web"}
              </text>
              <text x="0" y="8" textAnchor="middle" fill={isToBe ? "#6ee7b7" : "#fca5a5"} fontSize="7.8">
                {isToBe ? "Agente 24/7" : "120m cola"}
              </text>
            </g>

            {/* Chibi 1: Comercial */}
            <PokeCharacter
              x={215}
              y={98}
              outfit="#0284c7"
              name="Comercial"
              bubble={isToBe ? "n8n Auto" : "Cola 2h"}
              alert={!isToBe}
              selected={selectedComercial === "portal"}
              onClick={() => setSelectedComercial("portal")}
            />

            {/* Chibi 2: Créditos CCM */}
            <PokeCharacter
              x={385}
              y={98}
              outfit="#7c3aed"
              name="CCM / Equifax"
              bubble={isToBe ? "Equifax API" : "180m espera"}
              alert={!isToBe}
              selected={selectedComercial === "ccm"}
              onClick={() => setSelectedComercial("ccm")}
            />

            {/* Chibi 3: Ingeniero CAD */}
            <PokeCharacter
              x={495}
              y={160}
              outfit="#059669"
              name="Ing. CAD/BIM"
              bubble={isToBe ? "Cód.900100" : "240m cola"}
              alert={!isToBe}
              selected={selectedComercial === "cad"}
              onClick={() => setSelectedComercial("cad")}
            />

            {/* Servidor ERP Discos */}
            <g
              transform="translate(300, 248)"
              onClick={() => setSelectedComercial("discos")}
              className="cursor-pointer"
            >
              <rect
                x="-58"
                y="-20"
                width="116"
                height="42"
                rx="8"
                fill="#1e1b4b"
                stroke={selectedComercial === "discos" ? "#38bdf8" : "#818cf8"}
                strokeWidth={selectedComercial === "discos" ? "2.4" : "1.6"}
              />
              <text x="0" y="-3" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
                ERP DISCOS
              </text>
              <text x="0" y="10" textAnchor="middle" fill="#a5b4fc" fontSize="8" fontWeight="bold">
                {isToBe ? "Cotización < 2h" : "45m búsqueda"}
              </text>
            </g>
          </svg>
        ) : (
          <svg viewBox="0 0 600 345" className="w-full h-[290px] select-none">
            <defs>
              <pattern id="pokeTileGrass" width="28" height="28" patternUnits="userSpaceOnUse">
                <rect width="28" height="28" fill="#143326" />
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#15803d" strokeWidth="0.9" />
              </pattern>
            </defs>

            <polygon
              points="300,18 585,160 300,305 15,160"
              fill="url(#pokeTileGrass)"
              stroke={isToBe ? "#34d399" : "#f59e0b"}
              strokeWidth="2.2"
            />
            <polygon points="15,160 300,305 300,326 15,181" fill="#0b1f17" stroke="#166534" strokeWidth="1.4" />
            <polygon points="300,305 585,160 585,181 300,326" fill="#102a1f" stroke="#166534" strokeWidth="1.4" />

            <path
              d={
                isToBe
                  ? "M 105 156 L 195 230 L 305 250 L 425 220 L 495 156"
                  : "M 105 156 L 435 208 L 185 225 L 465 140 L 300 248"
              }
              fill="none"
              stroke={isToBe ? "#34d399" : "#ef4444"}
              strokeWidth="4.2"
              strokeDasharray="8 5"
            />

            {/* Montacargas Animado */}
            <motion.g
              animate={
                isToBe
                  ? { x: [105, 195, 305, 425, 495], y: [156, 230, 250, 220, 156] }
                  : { x: [105, 435, 185, 465, 300], y: [156, 208, 225, 140, 248] }
              }
              transition={{ duration: isToBe ? 4 : 7.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <rect x="-18" y="-12" width="30" height="17" rx="4" fill="#facc15" stroke="#090d16" strokeWidth="1.5" />
              <rect x="-10" y="-24" width="15" height="12" fill="none" stroke="#fef08a" strokeWidth="1.5" />
              <circle cx="-2" cy="-19" r="4" fill="#fde047" stroke="#090d16" strokeWidth="1" />
              <line x1="12" y1="3" x2="25" y2="3" stroke="#f8fafc" strokeWidth="2.5" />
              <rect x="13" y="-7" width="12" height="9" fill="#94a3b8" stroke="#090d16" strokeWidth="1" />
              <circle cx="-10" cy="6" r="4.5" fill="#090d16" />
              <circle cx="7" cy="6" r="4.5" fill="#090d16" />
              <rect x="-32" y="-40" width="64" height="14" rx="4" fill={isToBe ? "#065f46" : "#991b1b"} stroke="#ffffff" strokeWidth="1" />
              <text x="0" y="-30" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="bold">
                {isToBe ? "Ruta U: 37m" : "Ruta: 62m"}
              </text>
            </motion.g>

            {/* Rack Izquierdo */}
            <PokeScaffoldRack
              x={100}
              y={146}
              title="Retorno 999300104"
              sub={isToBe ? "Heijunka" : "Sin clasificar"}
              selected={selectedPatio === "retorno"}
              onClick={() => setSelectedPatio("retorno")}
            />

            {/* Operario 1: Hidrolavado */}
            <PokeCharacter
              x={205}
              y={96}
              outfit="#f97316"
              isWorker
              name="Hidrolavado"
              bubble={isToBe ? "Agua Recirc." : "Cola 35m"}
              alert={!isToBe}
              selected={selectedPatio === "hidrolavado"}
              onClick={() => setSelectedPatio("hidrolavado")}
            />

            {/* Operario 2: Atlas Copco & Plank */}
            <PokeCharacter
              x={315}
              y={86}
              outfit="#f97316"
              isWorker
              name="Atlas / Plank"
              bubble="Celda 5S"
              alert={false}
              selected={selectedPatio === "plank"}
              onClick={() => setSelectedPatio("plank")}
            />

            {/* Operario 3: Fenólicos CP7748 */}
            <PokeCharacter
              x={410}
              y={142}
              outfit="#f97316"
              isWorker
              name="Fenólicos"
              bubble="Rama B"
              alert={false}
              selected={selectedPatio === "fenolicos"}
              onClick={() => setSelectedPatio("fenolicos")}
            />

            {/* Rack Derecho */}
            <PokeScaffoldRack
              x={500}
              y={146}
              title="Almacén Hub 313"
              sub={isToBe ? "API HiVis↔Discos" : "Doble reg. 20m"}
              selected={selectedPatio === "almacen"}
              onClick={() => setSelectedPatio("almacen")}
            />
          </svg>
        )}
      </div>

      {/* CUADRO FLOTANTE DE INSPECCIÓN DE ESTACIÓN (COMO EL ANTERIOR) */}
      <div className="bg-[#0b1017] border border-slate-700/90 rounded-xl p-3 shadow-lg z-10">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1">
            <MousePointerClick className="w-3 h-3 text-sky-400" />
            ESTACIÓN OPERATIVA (HAZ CLIC EN CADA PERSONAJE O RACK)
          </span>
          <span
            className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
              isToBe
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                : "bg-rose-500/15 text-rose-300 border-rose-500/40"
            }`}
          >
            {isToBe ? activeStation.toBeTime : activeStation.asIsTime}
          </span>
        </div>
        <div className="text-xs md:text-sm font-bold text-white mb-0.5">{activeStation.title}</div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {isToBe ? activeStation.toBeDesc : activeStation.asIsDesc}
        </p>
      </div>

      {/* PIE DE MAQUETA */}
      <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>
          {isComercial
            ? "Frente 1: Toribio Blas, Kenyu Scott & Cavero Quiñónez, Piero Sneyder"
            : "Frente 2: Rodríguez Sifuentes, Luis Alexander & Yarlaqué Vallejos, Smiler Alexis"}
        </span>
        <span
          className={`flex items-center gap-1 font-bold ${
            isToBe ? "text-emerald-400" : "text-amber-400"
          }`}
        >
          {isToBe ? <Sparkles className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
          {isToBe ? "Mejoras TO-BE Activas" : "Cuellos de Botella AS-IS Activos"}
        </span>
      </div>
    </div>
  );
}