"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Activity,
  Clock,
  Building2,
  Bot,
  Truck,
} from "lucide-react";
import IsometricDiorama from "@/components/IsometricDioramaVida";
import EngineeringDashboards from "@/components/EngineeringDashboards";
import CommercialDemoModal from "@/components/CommercialDemoModal";
import PatioDemoModal from "@/components/PatioDemoModal";

const INTEGRANTES = [
  { nombre: "Toribio Blas, Kenyu Scott", codigo: "U24231999" },
  { nombre: "Cavero Quiñónez, Piero Sneyder", codigo: "U24237440" },
  { nombre: "Rodríguez Sifuentes, Luis Alexander", codigo: "U24315576" },
  { nombre: "Yarlaqué Vallejos, Smiler Alexis", codigo: "U21300084" },
];

function playSwitchSound(toBe: boolean) {
  try {
    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = toBe ? "triangle" : "sine";
    osc.frequency.setValueAtTime(toBe ? 420 : 280, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(toBe ? 780 : 190, ctx.currentTime + 0.14);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Ignorar si el navegador bloquea audio sin interacción previa
  }
}

export default function AtPacPresentation() {
  const [mode, setMode] = useState<"AS-IS" | "TO-BE">("AS-IS");
  const [zone, setZone] = useState<"COMERCIAL" | "PATIO">("COMERCIAL");
  const [dashTab, setDashTab] = useState<"PARETO" | "DAP" | "ISHIKAWA">("PARETO");
  const [demoOpen, setDemoOpen] = useState(false);
  const [patioDemoOpen, setPatioDemoOpen] = useState(false);

  // Cronómetro de 8 minutos (480 segundos)
  const [secondsLeft, setSecondsLeft] = useState(480);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Atajos de teclado para exponer cómodo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "1") setZone("COMERCIAL");
      if (e.key === "2") setZone("PATIO");
      if (e.key.toLowerCase() === "d") {
        setPatioDemoOpen(false);
        setDemoOpen((prev) => !prev);
      }
      if (e.key.toLowerCase() === "p") {
        setDemoOpen(false);
        setPatioDemoOpen((prev) => !prev);
      }
      if (e.key.toLowerCase() === "m") {
        setMode((prev) => {
          const next = prev === "AS-IS" ? "TO-BE" : "AS-IS";
          playSwitchSound(next === "TO-BE");
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleMode = () => {
    const next = mode === "AS-IS" ? "TO-BE" : "AS-IS";
    playSwitchSound(next === "TO-BE");
    setMode(next);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const isToBe = mode === "TO-BE";

  return (
    <main className="min-h-screen flex flex-col justify-between p-4 md:p-6 max-w-[1440px] mx-auto gap-4">
      {/* BARRA SUPERIOR DE CONTROL */}
      <header className="flex flex-wrap items-center justify-between gap-4 bg-[#0f151d] border border-slate-800 rounded-2xl px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-bold text-white">
                AT-PAC PERÚ S.A.C. — Ingeniería de Procesos
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                UTP • PROCESOS PARA INGENIERÍA • SECC. 19777 • GRUPO 4
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Análisis Operativo AS-IS & Propuesta de Automatización Lean / TPS (TO-BE)
            </p>
          </div>
        </div>

        {/* CONTROLES CENTRALES: DEMOS + INTERRUPTOR AS-IS / TO-BE + CRONÓMETRO */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setDemoOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs bg-sky-500/15 text-sky-300 border border-sky-500/40 hover:bg-sky-500/25 transition cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            Demo Comercial (D)
          </button>

          <button
            onClick={() => setPatioDemoOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25 transition cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            Demo Patio U (P)
          </button>

          <button
            onClick={toggleMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs tracking-wide transition-all shadow-lg cursor-pointer ${
              isToBe
                ? "bg-emerald-500 text-slate-950 shadow-emerald-500/25"
                : "bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {isToBe ? "MODO TO-BE ACTIVO (M)" : "ACTIVAR TO-BE (M)"}
          </button>

          {/* Cronómetro de Exposición (8:00 min) */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
            <Clock
              className={`w-4 h-4 ${
                secondsLeft < 90 ? "text-rose-400 animate-pulse" : "text-slate-400"
              }`}
            />
            <span className="font-mono text-sm font-bold text-white">{formatTime(secondsLeft)}</span>
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
              title="Iniciar / Pausar tiempo"
            >
              {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                setTimerRunning(false);
                setSecondsLeft(480);
              }}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
              title="Reiniciar 8 min"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* TARJETAS KPI SUPERIORES */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#0f151d] border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-mono text-slate-400">TIEMPO MUERTO COMERCIAL</div>
          <div className="flex items-baseline justify-between mt-1">
            <span
              className={`text-2xl font-extrabold ${
                isToBe ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {isToBe ? "0.5 h" : "33.0 h"}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {isToBe ? "-98% espera" : "90.2% del ciclo"}
            </span>
          </div>
        </div>

        <div className="bg-[#0f151d] border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-mono text-slate-400">IMPACTO VITAL PARETO</div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-amber-400">82.0 %</span>
            <span className="text-xs font-mono text-slate-400">3 causas = 820 h/mes</span>
          </div>
        </div>

        <div className="bg-[#0f151d] border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-mono text-slate-400">RECORRIDO PATIO LURÍN</div>
          <div className="flex items-baseline justify-between mt-1">
            <span
              className={`text-2xl font-extrabold ${
                isToBe ? "text-emerald-400" : "text-sky-400"
              }`}
            >
              {isToBe ? "37 m" : "62 m"}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {isToBe ? "Layout Celular U" : "Flujos cruzados"}
            </span>
          </div>
        </div>

        <div className="bg-[#0f151d] border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-mono text-slate-400">SINCRONIZACIÓN TI</div>
          <div className="flex items-baseline justify-between mt-1">
            <span
              className={`text-2xl font-extrabold ${
                isToBe ? "text-emerald-400" : "text-purple-400"
              }`}
            >
              {isToBe ? "API Live" : "Manual"}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {isToBe ? "HiVis ↔ Discos" : "20m doble digitación"}
            </span>
          </div>
        </div>
      </section>

      {/* ÁREA PRINCIPAL DIVIDIDA */}
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <IsometricDiorama mode={mode} zone={zone} setZone={setZone} />
        </div>
        <div className="lg:col-span-5">
          <EngineeringDashboards
            activeTab={dashTab}
            setActiveTab={setDashTab}
            mode={mode}
            zone={zone}
          />
        </div>
      </section>

      {/* GUÍA RÁPIDA DE ATAJOS */}
      <footer className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 px-2">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span>
            Universidad Tecnológica del Perú (UTP) • Grupo 4 • Docente: Ing. Joany Carina Zeballos Riveros • Ciclo 2026
          </span>
        </div>
        <div>
          Atajos: [1] Comercial • [2] Patio • [D] Demo Comercial • [P] Demo Patio U • [M] TO-BE
        </div>
      </footer>

      {/* INTEGRANTES DEL GRUPO */}
      <section className="flex flex-wrap items-center justify-center gap-2 px-2 pb-1 text-[11px] font-mono">
        <span className="text-slate-500">Integrantes:</span>
        {INTEGRANTES.map((p) => (
          <span
            key={p.codigo}
            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
          >
            {p.nombre} <span className="text-emerald-400">{p.codigo}</span>
          </span>
        ))}
      </section>

      {/* MODALES DE SIMULACIÓN EN VIVO */}
      <CommercialDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      <PatioDemoModal open={patioDemoOpen} onClose={() => setPatioDemoOpen(false)} />
    </main>
  );
}