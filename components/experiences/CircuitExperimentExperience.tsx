"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Topic } from "@/types/content";
import { CircuitCanvas3D } from "@/components/3d/CircuitCanvas3D";

interface CircuitExperimentExperienceProps {
  area: string;
  topicData: Topic;
}

export function CircuitExperimentExperience({
  area,
  topicData,
}: CircuitExperimentExperienceProps) {
  const config = topicData.circuitConfig || {
    initialVoltage: 12,
    minVoltage: 1,
    maxVoltage: 24,
    initialResistance: 10,
    minResistance: 1,
    maxResistance: 100,
    maxCurrentThreshold: 3.5,
  };

  // State Variables
  const [voltage, setVoltage] = useState<number>(config.initialVoltage);
  const [resistance, setResistance] = useState<number>(config.initialResistance);
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(true);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>("resistor");

  // Physics Calculations
  const current = isSwitchClosed ? voltage / Math.max(0.1, resistance) : 0;
  const power = isSwitchClosed ? current * current * resistance : 0;
  const isOverheated = current > config.maxCurrentThreshold;

  const explorableObject = topicData.objects[0];
  const selectedComponent = explorableObject?.components.find(
    (c) => c.id === selectedComponentId
  );

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#050505] text-slate-100 font-sans select-none">
      {/* Full Viewport 3D Circuit Canvas */}
      <div className="absolute inset-0 w-full h-full z-0">
        <CircuitCanvas3D
          voltage={voltage}
          resistance={resistance}
          isSwitchClosed={isSwitchClosed}
          current={current}
          power={power}
          isOverheated={isOverheated}
          selectedComponent={selectedComponentId}
          onSelectComponent={setSelectedComponentId}
        />
      </div>

      {/* Header Navigation Chrome */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 sm:px-10 py-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-3 pointer-events-auto">
          <Link href="/" className="text-sm font-semibold tracking-tight text-white hover:opacity-80 transition">
            Expandablism
          </Link>
          <span className="hidden sm:inline-block text-xs font-light text-slate-500 border-l border-slate-800 pl-3">
            Experiment. Observe. Understand.
          </span>
        </div>

        {/* Live Formula Badge */}
        <div className="pointer-events-auto flex items-center space-x-4">
          <div className="px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 backdrop-blur-md">
            <span>Ohm&apos;s Law: </span>
            <span className="text-sky-400 font-bold">V</span> = <span className="text-emerald-400 font-bold">I</span> &times; <span className="text-amber-400 font-bold">R</span>
          </div>
        </div>
      </header>

      {/* Overheat Safety Warning Toast */}
      {isOverheated && isSwitchClosed && (
        <div className="absolute top-20 inset-x-0 z-30 flex justify-center pointer-events-none animate-bounce">
          <div className="bg-rose-950/90 border border-rose-800 px-5 py-2.5 rounded-full text-xs font-mono text-rose-200 shadow-xl backdrop-blur-md">
            ⚠️ High Current Alert! Filament temperature exceeding thermal limit ({current.toFixed(2)}A &gt; {config.maxCurrentThreshold}A)
          </div>
        </div>
      )}

      {/* Selected Component Knowledge Card (Object-First Anchor) */}
      {selectedComponent && (
        <div className="absolute top-20 right-6 sm:right-10 z-20 max-w-xs w-full pointer-events-auto">
          <div className="bg-[#09090b]/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                SELECTED COMPONENT
              </span>
              <button
                onClick={() => setSelectedComponentId(null)}
                className="text-slate-500 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                {selectedComponent.name}
              </h3>
              <p className="text-xs text-slate-400 font-light mt-1 leading-relaxed">
                {selectedComponent.description}
              </p>
            </div>

            {selectedComponent.concepts && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedComponent.concepts.map((concept) => (
                  <span
                    key={concept}
                    className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                  >
                    #{concept}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Experiment Control Deck */}
      <div className="absolute bottom-8 inset-x-0 z-20 flex flex-col items-center pointer-events-none px-6">
        <div className="bg-[#09090b]/90 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl pointer-events-auto space-y-6 backdrop-blur-xl">
          {/* Top Measurement Meters */}
          <div className="grid grid-cols-4 gap-3 text-center border-b border-slate-800 pb-4 font-mono">
            <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">VOLTAGE (V)</span>
              <span className="text-lg font-bold text-sky-400">{voltage}V</span>
            </div>

            <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">RESISTANCE (R)</span>
              <span className="text-lg font-bold text-amber-400">{resistance}Ω</span>
            </div>

            <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">CURRENT (I)</span>
              <span className={`text-lg font-bold ${isOverheated ? "text-rose-400" : "text-emerald-400"}`}>
                {current.toFixed(2)}A
              </span>
            </div>

            <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">POWER (P)</span>
              <span className="text-lg font-bold text-purple-400">{power.toFixed(1)}W</span>
            </div>
          </div>

          {/* Sliders & Toggle Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* 1. Voltage Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Potential (V)</span>
                <span className="text-sky-400 font-bold">{voltage} Volts</span>
              </div>
              <input
                type="range"
                min={config.minVoltage}
                max={config.maxVoltage}
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>

            {/* 2. Switch Toggle Button */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Circuit Switch</span>
              <button
                onClick={() => setIsSwitchClosed(!isSwitchClosed)}
                className={`w-full py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer font-bold border ${
                  isSwitchClosed
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30"
                    : "bg-rose-500/20 text-rose-300 border-rose-500/50 hover:bg-rose-500/30"
                }`}
              >
                {isSwitchClosed ? "● Circuit Closed (ON)" : "○ Circuit Open (OFF)"}
              </button>
            </div>

            {/* 3. Resistance Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Restriction (R)</span>
                <span className="text-amber-400 font-bold">{resistance} Ohms</span>
              </div>
              <input
                type="range"
                min={config.minResistance}
                max={config.maxResistance}
                value={resistance}
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>

          {/* Discover Related Knowledge Connections */}
          {topicData.knowledgeConnections && (
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Related Concepts:</span>
              <div className="flex space-x-2">
                {topicData.knowledgeConnections.map((concept) => (
                  <span
                    key={concept}
                    className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 transition"
                  >
                    → {concept}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
