"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MessageCircle,
  Bot,
  Cpu,
  Database,
  CheckCircle2,
  ShieldAlert,
  Play,
  Globe,
  ArrowRight,
} from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

type ScenarioType = "TOP" | "CONTADO";

const SCENARIOS = {
  TOP: {
    clientName: "Constructora Bechtel Perú S.R.L.",
    ruc: "20512345678",
    tier: "Cliente TOP (Homologado Minería)",
    userMsg:
      "Hola AT-PAC Perú, necesitamos alquilar 120 toneladas de andamio Ringlock para parada de planta en Antamina. Adjunto plano estructural.",
    aiReply:
      "¡Hola! Soy el asistente técnico de AT-PAC Perú. Hemos validado el RUC de Bechtel Perú (Línea de crédito activa ✓). Tu solicitud con plano adjunto ya fue derivada a Ingeniería BIM (Cód. 900100000) y pre-valorizada en Discos. En menos de 15 min recibirás la cotización formal.",
    creditStatus: "Aprobada (Equifax OK)",
    routeTarget: "Ingeniería BIM (900100000) + Discos",
    savedTime: "De 36.5 h → 12 min",
  },
  CONTADO: {
    clientName: "Contratistas Generales del Sur E.I.R.L.",
    ruc: "20609876543",
    tier: "Cliente Esporádico / Nuevo",
    userMsg:
      "Buenas, quiero cotizar alquiler de torres móviles DokaScaff de 6m por 15 días en Lurín.",
    aiReply:
      "¡Bienvenido a AT-PAC Perú! Hemos registrado tu requerimiento para torres DokaScaff. Según nuestra evaluación automática, tu RUC aplica bajo modalidad Contado / Adelantado. Ya generamos tu pre-cotización con códigos estándar en Discos.",
    creditStatus: "Filtro Automático → Contado",
    routeTarget: "Plantilla Estándar Discos (Sin saturar CCM)",
    savedTime: "0 min de cola en CCM",
  },
};

export default function CommercialDemoModal({ open, onClose }: ModalProps) {
  const [scenario, setScenario] = useState<ScenarioType>("TOP");
  const [step, setStep] = useState<number>(0);

  const data = SCENARIOS[scenario];

  // Ejecuta la secuencia animada paso a paso al abrir o cambiar de escenario
  useEffect(() => {
    if (!open) return;
    setStep(0);
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1400);
    const t3 = setTimeout(() => setStep(3), 2200);
    const t4 = setTimeout(() => setStep(4), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [open, scenario]);

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
          {/* CABECERA DEL SIMULADOR */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/40">
                PROTOTIPO TO-BE EN VIVO
              </span>
              <h2 className="text-sm md:text-base font-bold text-white">
                Canal Comercial Local + WhatsApp Cloud API + n8n + Agente IA (Ollama)
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* SELECTOR DE CASO DE PRUEBA */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 bg-slate-900/70 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono">SIMULAR CASO:</span>
              <button
                onClick={() => setScenario("TOP")}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  scenario === "TOP"
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                1. Cliente TOP (Bechtel / Minería)
              </button>
              <button
                onClick={() => setScenario("CONTADO")}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  scenario === "CONTADO"
                    ? "bg-amber-400 text-slate-950"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                2. Cliente Nuevo (Filtro Contado)
              </button>
            </div>

            <button
              onClick={() => {
                setStep(0);
                setTimeout(() => setStep(1), 400);
                setTimeout(() => setStep(2), 1100);
                setTimeout(() => setStep(3), 1800);
                setTimeout(() => setStep(4), 2500);
              }}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono font-bold cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" /> Repetir flujo
            </button>
          </div>

          {/* CUERPO DIVIDIDO: PORTAL/WHATSAPP (IZQ) + ORQUESTACIÓN N8N/IA (DER) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-5">
            {/* LADO IZQUIERDO: PORTAL LOCAL + CHAT WHATSAPP */}
            <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Portal AT-PAC Perú (Español)</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">● WhatsApp API Conectado</span>
                </div>

                {/* Tarjeta Cliente */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 mb-3 text-xs">
                  <div className="font-bold text-white">{data.clientName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    RUC: {data.ruc} • {data.tier}
                  </div>
                </div>

                {/* Burbujas de Chat */}
                <div className="space-y-2.5 min-h-[175px]">
                  {step >= 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-slate-800 text-slate-100 text-xs p-3 rounded-xl rounded-tl-none max-w-[90%]"
                    >
                      <div className="text-[10px] font-bold text-sky-400 mb-1 flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" /> Cliente vía WhatsApp:
                      </div>
                      {data.userMsg}
                    </motion.div>
                  )}

                  {step >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-50 text-xs p-3 rounded-xl rounded-tr-none ml-auto max-w-[92%]"
                    >
                      <div className="text-[10px] font-bold text-emerald-400 mb-1 flex items-center gap-1">
                        <Bot className="w-3 h-3" /> Agente IA AT-PAC (Ollama Cloud):
                      </div>
                      {data.aiReply}
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-400">Canal anterior: Correo / Web en inglés</span>
                <span className="text-emerald-400 font-bold">{data.savedTime}</span>
              </div>
            </div>

            {/* LADO DERECHO: CENTRAL DE CONEXIONES (N8N + EQUIFAX + DISCOS) */}
            <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                  // CENTRAL DE CONEXIONES AUTOMATIZADA (BACKEND)
                </span>
                <h3 className="text-sm font-bold text-white mb-4">
                  Orquestación en Tiempo Real (Sin Intervención Manual)
                </h3>

                <div className="space-y-3">
                  {/* Paso 1: Webhook n8n */}
                  <div
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                      step >= 1
                        ? "bg-emerald-500/10 border-emerald-500/50 text-white"
                        : "bg-slate-900/50 border-slate-800 text-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="text-xs font-bold">1. Webhook n8n + Extracción RUC</div>
                        <div className="text-[10px] text-slate-400">Captura estructurada de proyecto y metrado</div>
                      </div>
                    </div>
                    {step >= 1 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>

                  {/* Paso 2: Precalificación Equifax */}
                  <div
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                      step >= 2
                        ? scenario === "TOP"
                          ? "bg-emerald-500/10 border-emerald-500/50 text-white"
                          : "bg-amber-500/10 border-amber-500/50 text-white"
                        : "bg-slate-900/50 border-slate-800 text-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="text-xs font-bold">2. Precalificación Crediticia Automática</div>
                        <div className="text-[10px] text-slate-300">{data.creditStatus}</div>
                      </div>
                    </div>
                    {step >= 2 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>

                  {/* Paso 3: Agente IA Ollama */}
                  <div
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                      step >= 3
                        ? "bg-emerald-500/10 border-emerald-500/50 text-white"
                        : "bg-slate-900/50 border-slate-800 text-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Bot className="w-4 h-4 text-sky-400" />
                      <div>
                        <div className="text-xs font-bold">3. Agente IA (Ollama Cloud) + CRM</div>
                        <div className="text-[10px] text-slate-400">Clasifica Ringlock / DokaScaff y responde 24/7</div>
                      </div>
                    </div>
                    {step >= 3 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>

                  {/* Paso 4: Derivación Discos / BIM */}
                  <div
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                      step >= 4
                        ? "bg-emerald-500/15 border-emerald-400 text-white"
                        : "bg-slate-900/50 border-slate-800 text-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Database className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="text-xs font-bold">4. Derivación y Pre-Cotización ERP Discos</div>
                        <div className="text-[10px] text-emerald-300 font-semibold">{data.routeTarget}</div>
                      </div>
                    </div>
                    {step >= 4 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Elimina las 33h de espera en bandejas y CCM</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  Listo para despacho <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}