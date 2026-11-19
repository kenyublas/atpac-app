"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Building2, Truck, Sparkles, AlertTriangle, MousePointerClick } from "lucide-react";

interface DioramaProps {
  mode: "AS-IS" | "TO-BE";
  zone: "COMERCIAL" | "PATIO";
  setZone: (z: "COMERCIAL" | "PATIO") => void;
}

interface StationInfo {
  id: string;
  speaker: string;
  title: string;
  asIsTime: string;
  toBeTime: string;
  asIsDesc: string;
  toBeDesc: string;
}

// Datos alineados al informe (DAP 01 = 2 195 min, DAP 02 = 280 min / 62 m)
const STATIONS_COMERCIAL: Record<string, StationInfo> = {
  portal: {
    id: "portal",
    speaker: "ASESOR COMERCIAL",
    title: "Recepción de Solicitudes (Correo / Web)",
    asIsTime: "120 min en cola",
    toBeTime: "< 1 min (24/7)",
    asIsDesc:
      "¡Uf! Los pedidos llegan por correo, llamada y una web en inglés. Se apilan en mi bandeja 2 horas antes de que alguien los vea.",
    toBeDesc:
      "¡Ahora el cliente escribe por WhatsApp desde un portal en español! n8n captura el RUC y el Agente IA ordena el pedido al instante.",
  },
  ccm: {
    id: "ccm",
    speaker: "CRÉDITOS (CCM)",
    title: "Evaluación Crediticia (CCM / Equifax)",
    asIsTime: "180 min espera",
    toBeTime: "Precalificado",
    asIsDesc:
      "Evalúo en Equifax cada solicitud, aunque no esté filtrada. La cola llega a 3 horas y todo el ciclo comercial se frena aquí.",
    toBeDesc:
      "La IA precalifica el RUC: clientes TOP pasan directo y los nuevos van a contado. Yo solo reviso y apruebo lo que de verdad lo necesita.",
  },
  cad: {
    id: "cad",
    speaker: "INGENIERÍA CAD/BIM",
    title: "Diseño Estructural CAD / BIM (Cód. 900100000)",
    asIsTime: "240 min en cola",
    toBeTime: "Plantillas BIM",
    asIsDesc:
      "Me llegan pedidos sin precalificar y espero 4 horas en bandeja para hacer el plano y el despiece Ringlock.",
    toBeDesc:
      "Recibo el requerimiento ya clasificado (Ringlock / DokaScaff) y uso listas de piezas preconfiguradas.",
  },
  discos: {
    id: "discos",
    speaker: "ERP DISCOS",
    title: "Valorización y Cotización en ERP Discos",
    asIsTime: "45 min búsqueda",
    toBeTime: "Ciclo < 2 h",
    asIsDesc:
      "Buscan cada código a mano, ítem por ítem, y arman la cotización en PDF/Excel. De 36,5 h de ciclo, 33 h son pura espera.",
    toBeDesc:
      "El despiece se cruza con el catálogo de Discos y sale la pre-cotización. El ciclo comercial baja de 36,5 h a menos de 2 h.",
  },
};

const STATIONS_PATIO: Record<string, StationInfo> = {
  retorno: {
    id: "retorno",
    speaker: "RECEPCIÓN YARD",
    title: "Recepción de Retornos de Obra (Cód. 999300104)",
    asIsTime: "Retorno masivo",
    toBeTime: "Heijunka",
    asIsDesc:
      "¡Llegaron todos los lotes juntos! Vienen con concreto pegado y sin preinspección en obra.",
    toBeDesc:
      "Los retornos llegan por ventanas horarias (Heijunka) y con checklist digital de HiVis hecho en obra.",
  },
  hidrolavado: {
    id: "hidrolavado",
    speaker: "OPERARIO HIDROLAVADO",
    title: "Estación de Hidrolavado Industrial",
    asIsTime: "35 min en cola",
    toBeTime: "Sin cola pico",
    asIsDesc:
      "Hay 35 min de cola en horas pico. Y Lurín no tiene red de agua: dependemos de camiones cisterna.",
    toBeDesc:
      "Con carga nivelada ya no se forma cola. Además evaluamos sedimentar y recircular el agua para depender menos de cisternas.",
  },
  plank: {
    id: "plank",
    speaker: "OPERARIO ATLAS / PLANK",
    title: "Desincrustado Atlas Copco RVM 08B y Molino Plank",
    asIsTime: "40 + 25 min",
    toBeTime: "Celda 5S",
    asIsDesc:
      "Desincrusto concreto 40 min y paso piezas al molino Plank 25 min, en estaciones alejadas y con herramientas dispersas.",
    toBeDesc:
      "Con 5S cada herramienta tiene su lugar y la estación queda en secuencia dentro de la celda en U.",
  },
  fenolicos: {
    id: "fenolicos",
    speaker: "OPERARIO FENÓLICOS",
    title: "Taller de Tableros Fenólicos (CP7748)",
    asIsTime: "62 m acarreo",
    toBeTime: "37 m (-40%)",
    asIsDesc:
      "Cambio paneles con el CP7748, pero el montacargas da vueltas por el patio: 62 m por lote con flujos cruzados.",
    toBeDesc:
      "En el layout celular en U, el taller queda en línea y el recorrido baja de 62 m a 37 m (-40 %).",
  },
  almacen: {
    id: "almacen",
    speaker: "ALMACÉN HUB 313",
    title: "Almacén Hub 313 — HiVis ↔ Discos",
    asIsTime: "20 min doble reg.",
    toBeTime: "API tiempo real",
    asIsDesc:
      "Registro el mismo stock dos veces: en HiVis y otra vez en Discos. 20 minutos perdidos por lote.",
    toBeDesc:
      "Un puente API (Poka-Yoke digital) sincroniza HiVis y Discos solo. Cero doble digitación.",
  },
};

type Mood = "stress" | "happy" | "calm";

// Pequeño "blip" estilo Game Boy al seleccionar
function playBlip() {
  try {
    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch {
    // sin audio
  }
}

function PokeCharacter({
  x,
  y,
  outfit,
  isWorker = false,
  name,
  bubble,
  mood,
  seed,
  selected = false,
  still,
  onClick,
}: {
  x: number;
  y: number;
  outfit: string;
  isWorker?: boolean;
  name: string;
  bubble: string;
  mood: Mood;
  seed: number;
  selected?: boolean;
  still: boolean;
  onClick: () => void;
}) {
  const alert = mood === "stress";
  const bodyAnim = still
    ? {}
    : mood === "happy"
    ? { y: [0, -5, 0, 0] }
    : mood === "stress"
    ? { x: [0, -0.8, 0.8, 0], y: [0, 0.6, 0] }
    : { y: [0, -1.5, 0] };
  const bodyTrans =
    mood === "happy"
      ? { duration: 1.1, repeat: Infinity, delay: seed * 0.2, times: [0, 0.3, 0.6, 1] }
      : mood === "stress"
      ? { duration: 0.5, repeat: Infinity, repeatDelay: 1.6 + seed * 0.3 }
      : { duration: 2.4, repeat: Infinity, delay: seed * 0.3, ease: "easeInOut" as const };

  return (
    <g transform={`translate(${x}, ${y})`} onClick={onClick} className="cursor-pointer">
      {/* Aro de selección giratorio */}
      {selected && (
        <motion.ellipse
          cx="0"
          cy="18"
          rx="22"
          ry="10"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeDasharray="4 3"
          animate={still ? {} : { strokeDashoffset: [0, -14] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Sombra que respira con el salto */}
      <motion.ellipse
        cx="0"
        cy="18"
        rx="13"
        ry="5.5"
        fill="rgba(0,0,0,0.45)"
        animate={!still && mood === "happy" ? { rx: [13, 10, 13, 13] } : {}}
        transition={{ duration: 1.1, repeat: Infinity, delay: seed * 0.2, times: [0, 0.3, 0.6, 1] }}
      />

      <motion.g animate={bodyAnim} transition={bodyTrans}>
        {/* Botas */}
        <rect x="-8" y="12" width="6.5" height="6" rx="2" fill="#1e293b" stroke="#090d16" strokeWidth="1.2" />
        <rect x="1.5" y="12" width="6.5" height="6" rx="2" fill="#1e293b" stroke="#090d16" strokeWidth="1.2" />

        {/* Cuerpo */}
        <rect
          x="-10"
          y="-4"
          width="20"
          height="17"
          rx="5"
          fill={outfit}
          stroke={selected ? "#ffffff" : "#090d16"}
          strokeWidth="1.5"
        />
        {isWorker && (
          <>
            <line x1="-10" y1="3" x2="10" y2="3" stroke="#fef08a" strokeWidth="2.2" />
            <line x1="-5" y1="-4" x2="-5" y2="13" stroke="#fef08a" strokeWidth="1.8" />
            <line x1="5" y1="-4" x2="5" y2="13" stroke="#fef08a" strokeWidth="1.8" />
          </>
        )}

        {/* Cabeza */}
        <rect x="-12" y="-24" width="24" height="21" rx="8" fill="#fde68a" stroke="#090d16" strokeWidth="1.5" />

        {/* Ojos con parpadeo */}
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={still ? {} : { scaleY: [1, 1, 0.1, 1] }}
          transition={{ duration: 3.2 + seed * 0.7, repeat: Infinity, times: [0, 0.9, 0.95, 1] }}
        >
          {mood === "happy" ? (
            <>
              <path d="M -7 -11 Q -5 -15 -3 -11" fill="none" stroke="#090d16" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M 3 -11 Q 5 -15 7 -11" fill="none" stroke="#090d16" strokeWidth="1.8" strokeLinecap="round" />
            </>
          ) : (
            <>
              <rect x="-6.5" y="-15" width="3.2" height="5.5" rx="1.5" fill="#090d16" />
              <rect x="3.5" y="-15" width="3.2" height="5.5" rx="1.5" fill="#090d16" />
              <circle cx="-5.5" cy="-13.8" r="1" fill="#ffffff" />
              <circle cx="4.5" cy="-13.8" r="1" fill="#ffffff" />
            </>
          )}
        </motion.g>

        {/* Boca según ánimo */}
        {mood === "happy" ? (
          <path d="M -3 -7 Q 0 -4 3 -7" fill="#f87171" stroke="#090d16" strokeWidth="1" />
        ) : mood === "stress" ? (
          <path d="M -3 -5.5 Q 0 -7.5 3 -5.5" fill="none" stroke="#090d16" strokeWidth="1.2" />
        ) : (
          <line x1="-2" y1="-6" x2="2" y2="-6" stroke="#090d16" strokeWidth="1.2" />
        )}

        {/* Mejillas rosadas en modo feliz */}
        {mood === "happy" && (
          <>
            <ellipse cx="-8" cy="-8" rx="2.2" ry="1.3" fill="#fb7185" opacity="0.7" />
            <ellipse cx="8" cy="-8" rx="2.2" ry="1.3" fill="#fb7185" opacity="0.7" />
          </>
        )}

        {/* Casco / Cabello */}
        {isWorker ? (
          <>
            <path d="M -13 -19 C -13 -29, 13 -29, 13 -19 Z" fill="#facc15" stroke="#090d16" strokeWidth="1.5" />
            <rect x="-15" y="-20" width="30" height="3.5" rx="1.5" fill="#eab308" stroke="#090d16" strokeWidth="1.2" />
          </>
        ) : (
          <path
            d="M -12 -19 C -12 -28, 12 -28, 12 -19 C 6 -22, -6 -22, -12 -19 Z"
            fill="#1e293b"
            stroke="#090d16"
            strokeWidth="1.3"
          />
        )}

        {/* Gota de sudor (AS-IS) */}
        {mood === "stress" && !still && (
          <motion.path
            d="M 14 -20 Q 17 -15 14 -13 Q 11 -15 14 -20 Z"
            fill="#7dd3fc"
            stroke="#0c4a6e"
            strokeWidth="0.8"
            animate={{ y: [0, 6], opacity: [0, 1, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: seed * 0.4 }}
          />
        )}

        {/* Destellos (TO-BE) */}
        {mood === "happy" && !still && (
          <>
            <motion.text
              x="-18"
              y="-24"
              fontSize="8"
              fill="#fde047"
              animate={{ opacity: [0, 1, 0], scale: [0.6, 1.1, 0.6] }}
              transition={{ duration: 1.3, repeat: Infinity, delay: seed * 0.25 }}
            >
              ✦
            </motion.text>
            <motion.text
              x="13"
              y="-20"
              fontSize="6"
              fill="#a7f3d0"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.3, repeat: Infinity, delay: 0.6 + seed * 0.25 }}
            >
              ✦
            </motion.text>
          </>
        )}
      </motion.g>

      {/* Placa de nombre */}
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

      {/* Globo de estado */}
      <motion.g
        animate={still ? {} : { y: [0, -3, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: seed * 0.2 }}
      >
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

      {/* "!" de entrenador al seleccionar */}
      <AnimatePresence>
        {selected && (
          <motion.g
            key="bang"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <rect x="24" y="-44" width="12" height="15" rx="3" fill="#ffffff" stroke="#0f172a" strokeWidth="1.3" />
            <text x="30" y="-32.5" textAnchor="middle" fontSize="11" fontWeight="900" fill="#dc2626">
              !
            </text>
          </motion.g>
        )}
      </AnimatePresence>
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

// Nubes cuya sombra cruza el mapa
function CloudShadows({ still, clipId }: { still: boolean; clipId: string }) {
  if (still) return null;
  return (
    <g clipPath={`url(#${clipId})`}>
      {[
        { y: 90, d: 26, delay: 0, rx: 60 },
        { y: 210, d: 34, delay: 9, rx: 48 },
      ].map((c, i) => (
        <motion.ellipse
          key={i}
          cy={c.y}
          rx={c.rx}
          ry={c.rx * 0.32}
          fill="#000000"
          opacity={0.13}
          initial={{ cx: -80 }}
          animate={{ cx: [-80, 680] }}
          transition={{ duration: c.d, repeat: Infinity, delay: c.delay, ease: "linear" }}
          style={{ pointerEvents: "none" }}
        />
      ))}
    </g>
  );
}

// Matas de pasto que se mecen
function GrassTuft({ x, y, still, seed }: { x: number; y: number; still: boolean; seed: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
        animate={still ? {} : { rotate: [-6, 6, -6] }}
        transition={{ duration: 2.6 + seed * 0.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M -6 0 L -4 -8 L -2 0 L 0 -11 L 2 0 L 4 -7 L 6 0 Z" fill="#22c55e" stroke="#14532d" strokeWidth="0.9" />
      </motion.g>
    </g>
  );
}

// Planta de oficina
function OfficePlant({ x, y, still, seed }: { x: number; y: number; still: boolean; seed: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="8" rx="8" ry="3" fill="rgba(0,0,0,0.4)" />
      <rect x="-6" y="-2" width="12" height="10" rx="2" fill="#b45309" stroke="#090d16" strokeWidth="1.2" />
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
        animate={still ? {} : { rotate: [-4, 4, -4] }}
        transition={{ duration: 3 + seed * 0.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="-4" cy="-8" rx="4" ry="7" fill="#16a34a" stroke="#14532d" strokeWidth="1" />
        <ellipse cx="4" cy="-9" rx="4" ry="8" fill="#22c55e" stroke="#14532d" strokeWidth="1" />
        <ellipse cx="0" cy="-12" rx="3.5" ry="7" fill="#4ade80" stroke="#14532d" strokeWidth="1" />
      </motion.g>
    </g>
  );
}

// Cuadro de diálogo estilo Pokémon con efecto máquina de escribir
function PokeDialog({
  speaker,
  title,
  text,
  badge,
  isToBe,
}: {
  speaker: string;
  title: string;
  text: string;
  badge: string;
  isToBe: boolean;
}) {
  const [count, setCount] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          clearInterval(id);
          return c;
        }
        return c + 2;
      });
    }, 22);
    return () => clearInterval(id);
  }, [text, reduce]);

  const shown = reduce ? text : text.slice(0, count);
  const done = shown.length >= text.length;

  return (
    <div className="relative mt-3 z-10">
      {/* Etiqueta del hablante */}
      <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-md bg-sky-500 border-2 border-slate-900 text-[10px] font-black text-slate-950 tracking-wide">
        {speaker}
      </div>
      <div className="rounded-xl bg-slate-50 border-4 border-slate-800 p-1 shadow-lg">
        <div className="rounded-lg border-2 border-slate-400 px-3 pt-3 pb-2 min-h-[78px]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <span className="text-xs font-black text-slate-900">{title}</span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                isToBe
                  ? "bg-emerald-100 text-emerald-800 border-emerald-500"
                  : "bg-rose-100 text-rose-800 border-rose-500"
              }`}
            >
              {badge}
            </span>
          </div>
          <p className="text-[12.5px] leading-snug text-slate-800 font-medium">
            {shown}
            {done && (
              <motion.span
                className="inline-block ml-1 text-rose-600"
                animate={{ y: [0, 2, 0] }}
                transition={{ duration: 0.7, repeat: Infinity }}
              >
                ▼
              </motion.span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function IsometricDiorama({ mode, zone, setZone }: DioramaProps) {
  const [selectedComercial, setSelectedComercial] = useState<string>("ccm");
  const [selectedPatio, setSelectedPatio] = useState<string>("hidrolavado");
  const [evolving, setEvolving] = useState(false);
  const reduce = useReducedMotion();
  const still = !!reduce;
  const firstRender = useRef(true);

  const isToBe = mode === "TO-BE";
  const isComercial = zone === "COMERCIAL";
  const activeStation = isComercial ? STATIONS_COMERCIAL[selectedComercial] : STATIONS_PATIO[selectedPatio];
  const mood: Mood = isToBe ? "happy" : "stress";

  // Destello de "evolución" al cambiar AS-IS ↔ TO-BE
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setEvolving(true);
    const t = setTimeout(() => setEvolving(false), 1300);
    return () => clearTimeout(t);
  }, [mode]);

  const pickComercial = (id: string) => {
    playBlip();
    setSelectedComercial(id);
  };
  const pickPatio = (id: string) => {
    playBlip();
    setSelectedPatio(id);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#0f151d] border border-slate-800 rounded-2xl p-4 relative overflow-hidden">
      {/* CABECERA */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800 z-10">
        <div>
          <span className="text-[10px] font-mono text-emerald-400 block">
            {"// MAQUETA OPERATIVA INTERACTIVA — AT-PAC PERÚ S.A.C."}
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

      {/* ESCENARIO */}
      <div className="flex-1 flex items-center justify-center relative my-1">
        <AnimatePresence mode="wait">
          {isComercial ? (
            <motion.svg
              key="comercial"
              viewBox="0 0 600 345"
              className="w-full h-[290px] select-none"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.35 }}
            >
              <defs>
                <pattern id="pokeTileBlue" width="28" height="28" patternUnits="userSpaceOnUse">
                  <rect width="28" height="28" fill={isToBe ? "#0f3a3a" : "#0f2942"} />
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke={isToBe ? "#0d9488" : "#1d4ed8"} strokeWidth="0.9" />
                </pattern>
                <clipPath id="floorClipC">
                  <polygon points="300,18 585,160 300,305 15,160" />
                </clipPath>
              </defs>

              {/* Piso */}
              <polygon
                points="300,18 585,160 300,305 15,160"
                fill="url(#pokeTileBlue)"
                stroke={isToBe ? "#10b981" : "#38bdf8"}
                strokeWidth="2.2"
              />
              <polygon points="15,160 300,305 300,326 15,181" fill="#081526" stroke="#1e3a8a" strokeWidth="1.4" />
              <polygon points="300,305 585,160 585,181 300,326" fill="#0c213b" stroke="#1e3a8a" strokeWidth="1.4" />

              <CloudShadows still={still} clipId="floorClipC" />

              {/* Decoración oficina */}
              <OfficePlant x={300} y={50} still={still} seed={0} />
              <OfficePlant x={548} y={168} still={still} seed={1} />
              <OfficePlant x={300} y={290} still={still} seed={2} />

              {/* Ruta del pedido */}
              <motion.path
                d="M 105 162 L 215 102 L 385 102 L 495 162 L 300 245"
                fill="none"
                stroke={isToBe ? "#34d399" : "#f87171"}
                strokeWidth="4.2"
                strokeDasharray="8 5"
                animate={still ? {} : { strokeDashoffset: [0, -26] }}
                transition={{ duration: isToBe ? 0.5 : 1.8, repeat: Infinity, ease: "linear" }}
              />

              {/* Correos apilándose (AS-IS) / mensajes WhatsApp volando (TO-BE) */}
              {!isToBe ? (
                <g transform="translate(150, 118)">
                  {[0, 1, 2, 3].map((i) => (
                    <rect
                      key={i}
                      x={-11 + (i % 2) * 2}
                      y={-i * 5}
                      width="22"
                      height="13"
                      rx="1.5"
                      fill="#f8fafc"
                      stroke="#475569"
                      strokeWidth="1"
                    />
                  ))}
                  <path d="M -9 -15 L 0 -9 L 11 -15" fill="none" stroke="#475569" strokeWidth="1" />
                  {!still && (
                    <motion.g
                      animate={{ y: [-40, -15], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeIn" }}
                    >
                      <rect x="-9" y="-6" width="18" height="11" rx="1.5" fill="#ffffff" stroke="#475569" />
                      <path d="M -9 -6 L 0 0 L 9 -6" fill="none" stroke="#475569" />
                    </motion.g>
                  )}
                  <circle cx="13" cy="-20" r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="1.2" />
                  <text x="13" y="-17.5" textAnchor="middle" fontSize="7" fontWeight="900" fill="#ffffff">
                    37
                  </text>
                </g>
              ) : (
                !still &&
                [0, 1, 2].map((i) => (
                  <motion.g
                    key={i}
                    animate={{ x: [105, 215], y: [140, 80], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.55, ease: "easeOut" }}
                  >
                    <rect x="-9" y="-6" width="18" height="12" rx="5" fill="#22c55e" stroke="#ffffff" strokeWidth="1" />
                    <text x="0" y="3" textAnchor="middle" fontSize="7" fill="#ffffff" fontWeight="900">
                      ✓✓
                    </text>
                  </motion.g>
                ))
              )}

              {/* Pedido viajando (Poké-Ball) */}
              {!still && (
                <motion.g
                  animate={{
                    x: [105, 215, 385, 495, 300],
                    y: [162, 102, 102, 162, 245],
                    rotate: [0, 360, 720, 1080, 1440],
                  }}
                  transition={{ duration: isToBe ? 2.8 : 6.5, repeat: Infinity, ease: "linear" }}
                >
                  <circle r="8" fill={isToBe ? "#10b981" : "#ef4444"} stroke="#090d16" strokeWidth="1.8" />
                  <path d="M -8 0 L 8 0" stroke="#090d16" strokeWidth="1.8" />
                  <circle r="3" fill="#ffffff" stroke="#090d16" strokeWidth="1.2" />
                </motion.g>
              )}

              {/* Estación 1: Portal */}
              <g transform="translate(105, 162)" onClick={() => pickComercial("portal")} className="cursor-pointer">
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
                  {isToBe ? "Agente 24/7" : "120 min cola"}
                </text>
                {/* Luz de pantalla parpadeante */}
                <motion.circle
                  cx="44"
                  cy="-16"
                  r="3"
                  fill={isToBe ? "#34d399" : "#f87171"}
                  animate={still ? {} : { opacity: [1, 0.2, 1] }}
                  transition={{ duration: isToBe ? 0.6 : 1.4, repeat: Infinity }}
                />
              </g>

              <PokeCharacter
                x={215}
                y={98}
                outfit="#0284c7"
                name="Comercial"
                bubble={isToBe ? "n8n auto" : "Cola 2 h"}
                mood={mood}
                seed={0}
                still={still}
                selected={selectedComercial === "portal"}
                onClick={() => pickComercial("portal")}
              />
              <PokeCharacter
                x={385}
                y={98}
                outfit="#7c3aed"
                name="CCM / Equifax"
                bubble={isToBe ? "Precalificado" : "180 min"}
                mood={mood}
                seed={1}
                still={still}
                selected={selectedComercial === "ccm"}
                onClick={() => pickComercial("ccm")}
              />
              <PokeCharacter
                x={495}
                y={160}
                outfit="#059669"
                name="Ing. CAD/BIM"
                bubble={isToBe ? "Plantillas" : "240 min"}
                mood={mood}
                seed={2}
                still={still}
                selected={selectedComercial === "cad"}
                onClick={() => pickComercial("cad")}
              />

              {/* Servidor ERP Discos */}
              <g transform="translate(300, 248)" onClick={() => pickComercial("discos")} className="cursor-pointer">
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
                {[0, 1, 2].map((i) => (
                  <motion.rect
                    key={i}
                    x={-50 + i * 6}
                    y="-14"
                    width="3.5"
                    height="3.5"
                    rx="1"
                    fill={i === 2 && !isToBe ? "#f87171" : "#34d399"}
                    animate={still ? {} : { opacity: [1, 0.15, 1] }}
                    transition={{ duration: 0.5 + i * 0.35, repeat: Infinity }}
                  />
                ))}
                <text x="0" y="-3" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
                  ERP DISCOS
                </text>
                <text x="0" y="10" textAnchor="middle" fill="#a5b4fc" fontSize="8" fontWeight="bold">
                  {isToBe ? "Cotización < 2 h" : "45 min búsqueda"}
                </text>
              </g>
            </motion.svg>
          ) : (
            <motion.svg
              key="patio"
              viewBox="0 0 600 345"
              className="w-full h-[290px] select-none"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              <defs>
                <pattern id="pokeTileGrass" width="28" height="28" patternUnits="userSpaceOnUse">
                  <rect width="28" height="28" fill="#143326" />
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#15803d" strokeWidth="0.9" />
                </pattern>
                <clipPath id="floorClipP">
                  <polygon points="300,18 585,160 300,305 15,160" />
                </clipPath>
              </defs>

              {/* Piso */}
              <polygon
                points="300,18 585,160 300,305 15,160"
                fill="url(#pokeTileGrass)"
                stroke={isToBe ? "#34d399" : "#f59e0b"}
                strokeWidth="2.2"
              />
              <polygon points="15,160 300,305 300,326 15,181" fill="#0b1f17" stroke="#166534" strokeWidth="1.4" />
              <polygon points="300,305 585,160 585,181 300,326" fill="#102a1f" stroke="#166534" strokeWidth="1.4" />

              <CloudShadows still={still} clipId="floorClipP" />

              {/* Pasto */}
              {[
                [160, 192],
                [262, 262],
                [330, 60],
                [440, 222],
                [540, 165],
                [70, 168],
              ].map(([gx, gy], i) => (
                <GrassTuft key={i} x={gx} y={gy} still={still} seed={i} />
              ))}

              {/* Agua: cisterna (AS-IS) o tanque de recirculación (TO-BE) */}
              <g transform="translate(205, 222)">
                <ellipse cx="0" cy="12" rx="30" ry="6" fill="rgba(0,0,0,0.35)" />
                {isToBe ? (
                  <>
                    <rect x="-16" y="-14" width="32" height="24" rx="5" fill="#0e7490" stroke="#090d16" strokeWidth="1.4" />
                    <motion.text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      fontSize="13"
                      fill="#a5f3fc"
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      animate={still ? {} : { rotate: 360 }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    >
                      ↻
                    </motion.text>
                    <text x="0" y="22" textAnchor="middle" fontSize="6.5" fill="#a5f3fc" fontWeight="bold">
                      Recirculación
                    </text>
                  </>
                ) : (
                  <>
                    <rect x="-26" y="-12" width="34" height="18" rx="8" fill="#94a3b8" stroke="#090d16" strokeWidth="1.4" />
                    <rect x="8" y="-8" width="14" height="14" rx="2" fill="#dc2626" stroke="#090d16" strokeWidth="1.4" />
                    <circle cx="-16" cy="8" r="3.5" fill="#090d16" />
                    <circle cx="14" cy="8" r="3.5" fill="#090d16" />
                    <text x="-9" y="0" textAnchor="middle" fontSize="7" fill="#0f172a" fontWeight="900">
                      H₂O
                    </text>
                    <text x="0" y="22" textAnchor="middle" fontSize="6.5" fill="#fca5a5" fontWeight="bold">
                      Cisterna
                    </text>
                  </>
                )}
              </g>

              {/* Charco con ondas */}
              {!still && (
                <g transform="translate(250, 140)">
                  {[0, 1].map((i) => (
                    <motion.ellipse
                      key={i}
                      cx="0"
                      cy="0"
                      fill="none"
                      stroke="#7dd3fc"
                      strokeWidth="1"
                      animate={{ rx: [2, 16], ry: [1, 6], opacity: [0.8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i }}
                    />
                  ))}
                </g>
              )}

              {/* Ruta montacargas */}
              <motion.path
                d={
                  isToBe
                    ? "M 105 156 L 195 230 L 305 250 L 425 220 L 495 156"
                    : "M 105 156 L 435 208 L 185 225 L 465 140 L 300 248"
                }
                fill="none"
                stroke={isToBe ? "#34d399" : "#ef4444"}
                strokeWidth="4.2"
                strokeDasharray="8 5"
                animate={still ? {} : { strokeDashoffset: [0, -26] }}
                transition={{ duration: isToBe ? 0.6 : 1.4, repeat: Infinity, ease: "linear" }}
              />

              <PokeScaffoldRack
                x={100}
                y={146}
                title="Retorno 999300104"
                sub={isToBe ? "Heijunka" : "Sin clasificar"}
                selected={selectedPatio === "retorno"}
                onClick={() => pickPatio("retorno")}
              />

              <PokeCharacter
                x={205}
                y={96}
                outfit="#f97316"
                isWorker
                name="Hidrolavado"
                bubble={isToBe ? "Sin cola" : "Cola 35 min"}
                mood={mood}
                seed={0}
                still={still}
                selected={selectedPatio === "hidrolavado"}
                onClick={() => pickPatio("hidrolavado")}
              />

              {/* Chorro de agua de la hidrolavadora */}
              {!still &&
                [0, 1, 2, 3].map((i) => (
                  <motion.circle
                    key={i}
                    r="1.8"
                    fill="#7dd3fc"
                    animate={{ cx: [218, 240 + i * 3], cy: [98, 108 + i * 4], opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}

              <PokeCharacter
                x={315}
                y={86}
                outfit="#f97316"
                isWorker
                name="Atlas / Plank"
                bubble={isToBe ? "Celda 5S" : "Op. 65 min"}
                mood={isToBe ? "happy" : "calm"}
                seed={1}
                still={still}
                selected={selectedPatio === "plank"}
                onClick={() => pickPatio("plank")}
              />
              <PokeCharacter
                x={410}
                y={142}
                outfit="#f97316"
                isWorker
                name="Fenólicos"
                bubble={isToBe ? "Ruta 37 m" : "Acarreo 62 m"}
                mood={mood}
                seed={2}
                still={still}
                selected={selectedPatio === "fenolicos"}
                onClick={() => pickPatio("fenolicos")}
              />

              <PokeScaffoldRack
                x={500}
                y={146}
                title="Almacén Hub 313"
                sub={isToBe ? "API HiVis↔Discos" : "Doble reg. 20 min"}
                selected={selectedPatio === "almacen"}
                onClick={() => pickPatio("almacen")}
              />

              {/* Montacargas */}
              {!still && (
                <motion.g
                  animate={
                    isToBe
                      ? { x: [105, 195, 305, 425, 495], y: [156, 230, 250, 220, 156] }
                      : { x: [105, 435, 185, 465, 300], y: [156, 208, 225, 140, 248] }
                  }
                  transition={{ duration: isToBe ? 4 : 7.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Humo del escape */}
                  <motion.circle
                    cx="-22"
                    cy="-6"
                    r="3"
                    fill="#94a3b8"
                    animate={{ cx: [-22, -32], cy: [-6, -16], r: [2, 5], opacity: [0.7, 0] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                  />
                  <motion.g animate={{ y: [0, -1, 0] }} transition={{ duration: 0.25, repeat: Infinity }}>
                    <rect x="-18" y="-12" width="30" height="17" rx="4" fill="#facc15" stroke="#090d16" strokeWidth="1.5" />
                    <rect x="-10" y="-24" width="15" height="12" fill="none" stroke="#fef08a" strokeWidth="1.5" />
                    <circle cx="-2" cy="-19" r="4" fill="#fde047" stroke="#090d16" strokeWidth="1" />
                    <line x1="12" y1="3" x2="25" y2="3" stroke="#f8fafc" strokeWidth="2.5" />
                    <rect x="13" y="-7" width="12" height="9" fill="#94a3b8" stroke="#090d16" strokeWidth="1" />
                  </motion.g>
                  <circle cx="-10" cy="6" r="4.5" fill="#090d16" />
                  <circle cx="7" cy="6" r="4.5" fill="#090d16" />
                  <rect
                    x="-32"
                    y="-40"
                    width="64"
                    height="14"
                    rx="4"
                    fill={isToBe ? "#065f46" : "#991b1b"}
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                  <text x="0" y="-30" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="bold">
                    {isToBe ? "Ruta U: 37 m" : "Ruta: 62 m"}
                  </text>
                </motion.g>
              )}
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Destello de "evolución" AS-IS → TO-BE */}
        <AnimatePresence>
          {evolving && (
            <motion.div
              key="evo"
              className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.3, times: [0, 0.15, 0.6, 1] }}
              style={{
                background: isToBe
                  ? "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(16,185,129,0.55) 45%, transparent 75%)"
                  : "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(244,63,94,0.5) 45%, transparent 75%)",
              }}
            >
              <motion.div
                initial={{ scale: 0.6 }}
                animate={{ scale: [0.6, 1.1, 1] }}
                transition={{ duration: 0.5 }}
                className="px-4 py-2 rounded-xl bg-slate-50 border-4 border-slate-800 text-slate-900 font-black text-sm md:text-base shadow-2xl"
              >
                {isToBe ? "¡El proceso evolucionó a TO-BE!" : "Volviendo al proceso AS-IS…"}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CUADRO DE DIÁLOGO POKÉMON */}
      <PokeDialog
        key={`${activeStation.id}-${mode}`}
        speaker={activeStation.speaker}
        title={activeStation.title}
        text={isToBe ? activeStation.toBeDesc : activeStation.asIsDesc}
        badge={isToBe ? activeStation.toBeTime : activeStation.asIsTime}
        isToBe={isToBe}
      />

      {/* PIE */}
      <div className="pt-2 mt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <MousePointerClick className="w-3 h-3 text-sky-400" />
          {isComercial
            ? "Frente 1: Toribio Blas, Kenyu Scott & Cavero Quiñónez, Piero Sneyder"
            : "Frente 2: Rodríguez Sifuentes, Luis Alexander & Yarlaqué Vallejos, Smiler Alexis"}
        </span>
        <span className={`flex items-center gap-1 font-bold ${isToBe ? "text-emerald-400" : "text-amber-400"}`}>
          {isToBe ? <Sparkles className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
          {isToBe ? "Mejoras TO-BE activas" : "Cuellos de botella AS-IS activos"}
        </span>
      </div>
    </div>
  );
}
