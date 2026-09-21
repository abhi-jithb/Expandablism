"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Topic } from "@/types/content";
import { CircuitCanvas3D } from "@/components/3d/CircuitCanvas3D";
import { SpatialToolbox } from "@/components/ui/SpatialToolbox";

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
    <main className="relative w-screen h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans select-none">
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
          <Link href="/" className="text-sm font-bold tracking-tight text-slate-900 hover:text-sky-600 transition">
            Expandablism
          </Link>
          <span className="hidden sm:inline-block text-xs font-mono text-slate-500 border-l border-slate-300 pl-3">
            Experiment. Observe. Understand.
          </span>
        </div>

        {/* Live Formula Badge */}
        <div className="pointer-events-auto flex items-center space-x-4">
          <div className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-700 shadow-sm backdrop-blur-md">
            <span>Ohm&apos;s Law: </span>
            <span className="text-sky-600 font-bold">V</span> = <span className="text-emerald-600 font-bold">I</span> &times; <span className="text-amber-600 font-bold">R</span>
          </div>
        </div>
      </header>

      {/* Overheat Safety Warning Toast */}
      {isOverheated && isSwitchClosed && (
        <div className="absolute top-20 inset-x-0 z-30 flex justify-center pointer-events-none animate-bounce">
          <div className="bg-rose-50 border border-rose-300 px-5 py-2.5 rounded-full text-xs font-mono text-rose-800 shadow-lg backdrop-blur-md font-semibold">
            ⚠️ High Current Alert! Filament temperature exceeding thermal limit ({current.toFixed(2)}A &gt; {config.maxCurrentThreshold}A)
          </div>
        </div>
      )}

      {/* Selected Component Knowledge Card (Object-First Anchor) */}
      {selectedComponent && (
        <div className="absolute top-20 right-6 sm:right-10 z-20 max-w-xs w-full pointer-events-auto">
          <div className="bg-white/95 border border-slate-200 rounded-2xl p-5 shadow-xl backdrop-blur-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">
                SELECTED COMPONENT
              </span>
              <button
                onClick={() => setSelectedComponentId(null)}
                className="text-slate-400 hover:text-slate-900 text-xs cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {selectedComponent.name}
              </h3>
              <p className="text-xs text-slate-600 font-normal mt-1 leading-relaxed">
                {selectedComponent.description}
              </p>
            </div>

            {selectedComponent.concepts && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedComponent.concepts.map((concept) => (
                  <span
                    key={concept}
                    className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700 font-medium"
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
        <div className="bg-white/95 border border-slate-200 rounded-2xl p-6 max-w-2xl w-full shadow-2xl pointer-events-auto space-y-6 backdrop-blur-xl">
          {/* Top Measurement Meters */}
          <div className="grid grid-cols-4 gap-3 text-center border-b border-slate-200 pb-4 font-mono">
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">VOLTAGE (V)</span>
              <span className="text-lg font-bold text-sky-600">{voltage}V</span>
            </div>

            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">RESISTANCE (R)</span>
              <span className="text-lg font-bold text-amber-600">{resistance}Ω</span>
            </div>

            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">CURRENT (I)</span>
              <span className={`text-lg font-bold ${isOverheated ? "text-rose-600" : "text-emerald-600"}`}>
                {current.toFixed(2)}A
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">POWER (P)</span>
              <span className="text-lg font-bold text-purple-600">{power.toFixed(1)}W</span>
            </div>
          </div>

          {/* Sliders & Toggle Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* 1. Voltage Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 font-semibold">Potential (V)</span>
                <span className="text-sky-600 font-bold">{voltage} Volts</span>
              </div>
              <input
                type="range"
                min={config.minVoltage}
                max={config.maxVoltage}
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
            </div>

            {/* 2. Switch Toggle Button */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Circuit Switch</span>
              <button
                onClick={() => setIsSwitchClosed(!isSwitchClosed)}
                className={`w-full py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer font-bold border ${
                  isSwitchClosed
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                    : "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200"
                }`}
              >
                {isSwitchClosed ? "● Circuit Closed (ON)" : "○ Circuit Open (OFF)"}
              </button>
            </div>

            {/* 3. Resistance Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 font-semibold">Restriction (R)</span>
                <span className="text-amber-600 font-bold">{resistance} Ohms</span>
              </div>
              <input
                type="range"
                min={config.minResistance}
                max={config.maxResistance}
                value={resistance}
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>
          </div>

          {/* Electrical Parts Toolbox */}
          <SpatialToolbox
            title="ELECTRICAL PARTS TOOLBOX"
            items={explorableObject.components.map((comp) => ({
              id: comp.id,
              name: comp.name,
              description: comp.description,
              concepts: comp.concepts,
              status: isSwitchClosed ? "connected" : "in_toolbox",
              iconTag: comp.id.toUpperCase(),
            }))}
            selectedItemId={selectedComponentId}
            onSelectItem={setSelectedComponentId}
            onActionItem={(id) => setSelectedComponentId(id)}
            actionLabel="Inspect Component"
          />

          {/* Discover Related Knowledge Connections */}
          {topicData.knowledgeConnections && (
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Related Concepts:</span>
              <div className="flex space-x-2">
                {topicData.knowledgeConnections.map((concept) => (
                  <span
                    key={concept}
                    className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-400 transition"
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
