"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Topic } from "@/types/content";
import {
  TOPIC_BRAIN_CONTENT_MAP,
  BRAIN_REGIONS,
  BRAIN_STATES,
  BrainStateConfig,
} from "@/data/brainLearningContent";
import { BrainCanvas3D } from "@/components/3d/BrainCanvas3D";

interface BrainExperienceProps {
  area: string;
  topicData: Topic;
}

export function BrainExperience({ area, topicData }: BrainExperienceProps) {
  const topicContent = TOPIC_BRAIN_CONTENT_MAP[topicData.id] || TOPIC_BRAIN_CONTENT_MAP["neuroscience"];

  // State Management
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>("prefrontal_cortex");
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [activeState, setActiveState] = useState<BrainStateConfig>(BRAIN_STATES[0]);
  const [isPuzzleMode, setIsPuzzleMode] = useState<boolean>(false);

  // Puzzle Mode State
  const puzzleLevel = topicContent.puzzleLevel;
  const [selectedPuzzleNodeId, setSelectedPuzzleNodeId] = useState<string | null>(null);
  const [userConnections, setUserConnections] = useState<{ from: string; to: string }[]>([]);
  const [userSliders, setUserSliders] = useState({
    dopamine: 30,
    cortisol: 95,
    serotonin: 25,
    acetylcholine: 40,
  });
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedRegion = BRAIN_REGIONS.find((r) => r.id === selectedRegionId) || BRAIN_REGIONS[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2600);
  };

  // Calculate Puzzle Completion Sync Percentage
  const calculateSyncPercentage = () => {
    let connectionScore = 0;
    const requiredConns = puzzleLevel.requiredConnections;

    requiredConns.forEach((req) => {
      const match = userConnections.some(
        (c) =>
          (c.from === req.from && c.to === req.to) ||
          (c.from === req.to && c.to === req.from)
      );
      if (match) connectionScore += 1;
    });

    const maxConns = requiredConns.length || 1;
    const connectionRatio = connectionScore / maxConns;

    const targets = puzzleLevel.targetNeurotransmitters;
    let ntScore = 0;

    if (userSliders.dopamine >= targets.dopamine[0] && userSliders.dopamine <= targets.dopamine[1]) ntScore += 1;
    if (userSliders.cortisol >= targets.cortisol[0] && userSliders.cortisol <= targets.cortisol[1]) ntScore += 1;
    if (userSliders.serotonin >= targets.serotonin[0] && userSliders.serotonin <= targets.serotonin[1]) ntScore += 1;
    if (userSliders.acetylcholine >= targets.acetylcholine[0] && userSliders.acetylcholine <= targets.acetylcholine[1]) ntScore += 1;

    const ntRatio = ntScore / 4;
    return Math.round((connectionRatio * 0.5 + ntRatio * 0.5) * 100);
  };

  const currentSync = calculateSyncPercentage();

  const handleCheckPuzzleCompletion = (sync: number) => {
    if (sync === 100 && !showVictoryModal) {
      setShowVictoryModal(true);
      showToast("🎉 100% Synaptic Sync Achieved! Neural Circuit Repaired!");
    }
  };

  const handleSelectPuzzleNode = (nodeId: string) => {
    if (!selectedPuzzleNodeId) {
      setSelectedPuzzleNodeId(nodeId);
      showToast("Select target node to establish connection");
    } else if (selectedPuzzleNodeId === nodeId) {
      setSelectedPuzzleNodeId(null);
    } else {
      const from = selectedPuzzleNodeId;
      const to = nodeId;

      const alreadyExists = userConnections.some(
        (c) => (c.from === from && c.to === to) || (c.from === to && c.to === from)
      );

      if (alreadyExists) {
        const updated = userConnections.filter(
          (c) => !(c.from === from && c.to === to) && !(c.from === to && c.to === from)
        );
        setUserConnections(updated);
        showToast("Disconnected signal path");
      } else {
        const updated = [...userConnections, { from, to }];
        setUserConnections(updated);
        showToast("Signal path established!");
      }
      setSelectedPuzzleNodeId(null);

      setTimeout(() => {
        const newSync = calculateSyncPercentage();
        handleCheckPuzzleCompletion(newSync);
      }, 100);
    }
  };

  const handleSliderChange = (key: keyof typeof userSliders, val: number) => {
    const updated = { ...userSliders, [key]: val };
    setUserSliders(updated);

    const newSync = calculateSyncPercentage();
    handleCheckPuzzleCompletion(newSync);
  };

  const handleResetPuzzle = () => {
    setUserConnections([]);
    setUserSliders({
      dopamine: 30,
      cortisol: 95,
      serotonin: 25,
      acetylcholine: 40,
    });
    setSelectedPuzzleNodeId(null);
    setShowVictoryModal(false);
    showToast("Puzzle reset");
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans select-none flex flex-col">
      {/* Top Navigation Header */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-slate-200 pointer-events-auto shadow-xs">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-mono text-slate-600 hover:text-slate-900 transition tracking-widest uppercase flex items-center gap-1 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 font-bold"
          >
            ← Subject Labs
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-pulse"></span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                BRAIN & NEUROSCIENCE // {topicData.name.toUpperCase()}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900">{topicContent.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Layer Progress Indicator */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <span className={`px-2.5 py-1 rounded-lg ${!isPuzzleMode ? "bg-slate-900 text-white font-bold" : "text-slate-600"}`}>
              LAYER 1: EXPLORE
            </span>
            <span className="text-slate-400">→</span>
            <span className={`px-2.5 py-1 rounded-lg ${isPuzzleMode ? "bg-sky-600 text-white font-bold" : "text-slate-600"}`}>
              LAYER 2: SYNAPTIC PUZZLE
            </span>
          </div>

          {/* Mode Switcher */}
          <button
            onClick={() => {
              setIsPuzzleMode(!isPuzzleMode);
              setShowVictoryModal(false);
              showToast(isPuzzleMode ? "Switched to 3D Brain Exploration" : "Launched Synaptic Puzzle Game!");
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all border flex items-center gap-2 cursor-pointer shadow-sm ${
              isPuzzleMode
                ? "bg-slate-900 text-white border-slate-900 font-bold"
                : "bg-sky-600 hover:bg-sky-700 text-white border-sky-600 font-bold"
            }`}
          >
            <span>{isPuzzleMode ? "👁️ EXPLORE BRAIN 3D" : "🧩 LAUNCH SYNAPTIC PUZZLE"}</span>
          </button>
        </div>
      </header>

      {/* 3D Viewport Stage */}
      <div className="absolute inset-0 w-full h-full z-0">
        <BrainCanvas3D
          brainRegions={topicContent.brainRegions}
          selectedRegionId={selectedRegionId}
          hoveredRegionId={hoveredRegionId}
          activeState={activeState}
          isPuzzleMode={isPuzzleMode}
          puzzleConnections={userConnections}
          puzzleNodes={puzzleLevel.nodes}
          selectedPuzzleNodeId={selectedPuzzleNodeId}
          onSelectRegion={setSelectedRegionId}
          onHoverRegion={setHoveredRegionId}
          onSelectPuzzleNode={handleSelectPuzzleNode}
        />
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white border border-slate-800 px-5 py-2.5 rounded-full text-xs font-mono shadow-xl backdrop-blur-md font-medium"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODE 1: EXPLORATION MODE */}
      {!isPuzzleMode && (
        <>
          {/* Top Left: Brain State Simulation */}
          <div className="absolute top-20 left-6 z-10 w-80 pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center justify-between border-b border-slate-200 pb-2 font-bold">
                <span>SIMULATE BRAIN STATE</span>
                <span className="text-slate-900 font-bold">{activeState.dominantWave}</span>
              </div>

              <div className="space-y-1.5">
                {topicContent.availableStates.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setActiveState(st)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all border flex items-center justify-between cursor-pointer ${
                      activeState.id === st.id
                        ? "bg-slate-900 text-white font-bold border-slate-900 shadow-md"
                        : "bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activeState.id === st.id ? "bg-sky-400" : "bg-slate-400"}`}></span>
                      <span>{st.name}</span>
                    </div>
                    {activeState.id === st.id && <span className="text-[10px]">ACTIVE</span>}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 font-normal leading-relaxed">
                <span className="text-slate-900 font-bold">{activeState.tagline}:</span> {activeState.description}
              </div>
            </div>
          </div>

          {/* Bottom Center: Neurotransmitter Gauge Bar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-xl px-4 pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2 font-bold">
                <span>NEUROTRANSMITTER READOUT</span>
                <span className="text-slate-900 font-bold">STATE: {activeState.name.toUpperCase()}</span>
              </div>

              <div className="grid grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-600 mb-1 font-semibold">
                    <span>Dopamine</span>
                    <span className="text-sky-600 font-bold">{activeState.neurotransmitters.dopamine}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="bg-sky-500 h-full transition-all duration-500"
                      style={{ width: `${activeState.neurotransmitters.dopamine}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-600 mb-1 font-semibold">
                    <span>Cortisol</span>
                    <span className="text-rose-600 font-bold">{activeState.neurotransmitters.cortisol}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="bg-rose-500 h-full transition-all duration-500"
                      style={{ width: `${activeState.neurotransmitters.cortisol}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-600 mb-1 font-semibold">
                    <span>Serotonin</span>
                    <span className="text-emerald-600 font-bold">{activeState.neurotransmitters.serotonin}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${activeState.neurotransmitters.serotonin}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-600 mb-1 font-semibold">
                    <span>Acetylcholine</span>
                    <span className="text-purple-600 font-bold">{activeState.neurotransmitters.acetylcholine}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="bg-purple-500 h-full transition-all duration-500"
                      style={{ width: `${activeState.neurotransmitters.acetylcholine}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Anatomical Region Inspector */}
          <div className="absolute top-20 right-6 z-10 w-96 max-h-[82vh] overflow-y-auto pointer-events-auto pr-1">
            <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                  ANATOMICAL REGION INSPECTION
                </span>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedRegion.color || "#0284c7" }}
                  ></span>
                  {selectedRegion.name}
                </h2>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-mono space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">SCIENTIFIC TERM</span>
                  <span className="text-slate-900 font-bold block">{selectedRegion.scientificTerm}</span>
                  <span className="text-[10px] text-slate-500 uppercase block mt-2 font-bold">REAL-WORLD ANALOGY</span>
                  <span className="text-slate-800 font-semibold block">"{selectedRegion.analogy}"</span>
                </div>

                <p className="leading-relaxed text-slate-600 font-normal">{selectedRegion.description}</p>
              </div>

              {/* Real-World Phenomena & Solutions */}
              <div className="pt-3 border-t border-slate-200">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block mb-3">
                  REAL-WORLD PHENOMENA & SOLUTIONS
                </span>

                <div className="space-y-3">
                  {selectedRegion.keyPhenomena.map((ph, idx) => (
                    <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="text-amber-500">⚡</span> {ph.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-normal">{ph.description}</p>

                      <div className="pt-2 border-t border-slate-200 text-[11px] space-y-1">
                        <div>
                          <span className="text-slate-500 font-mono text-[10px] uppercase font-bold">Impact: </span>
                          <span className="text-slate-700 font-normal">{ph.impact}</span>
                        </div>
                        <div>
                          <span className="text-emerald-700 font-mono text-[10px] uppercase font-bold">Solution: </span>
                          <span className="text-slate-800 font-medium">{ph.solution}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODE 2: SYNAPTIC PUZZLE GAME */}
      {isPuzzleMode && (
        <>
          {/* Top Left: Puzzle Scenario */}
          <div className="absolute top-20 left-6 z-10 w-96 pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                  🧩 SYNAPTIC NEURAL ALIGNMENT PUZZLE
                </span>
                <button
                  onClick={handleResetPuzzle}
                  className="text-[10px] font-mono text-slate-600 hover:text-slate-900 underline cursor-pointer font-bold"
                >
                  RESET
                </button>
              </div>

              <h2 className="text-lg font-bold text-slate-900">{puzzleLevel.title}</h2>
              <div className="text-xs font-mono text-rose-800 bg-rose-50 p-2.5 rounded-lg border border-rose-200 font-semibold">
                🚨 SCENARIO: {puzzleLevel.brokenScenario}
              </div>

              <div className="text-xs text-slate-700 font-normal leading-relaxed">
                <span className="font-bold text-slate-900">OBJECTIVE:</span> {puzzleLevel.objective}
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-500 space-y-1">
                <div>1. Click 3D neural nodes to connect signal paths.</div>
                <div>2. Tune neurotransmitter sliders to target equilibrium.</div>
              </div>
            </div>
          </div>

          {/* Top Right: Synaptic Sync Meter */}
          <div className="absolute top-20 right-6 z-10 w-80 pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-5 shadow-xl flex flex-col items-center text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 font-bold">
                NEURAL CIRCUIT SYNC
              </span>

              <div className="relative w-32 h-32 flex items-center justify-center my-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-sky-600"
                    strokeDasharray={`${currentSync}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold font-mono text-slate-900">
                    {currentSync}%
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">SYNC</span>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-600 font-semibold">
                {currentSync === 100 ? (
                  <span className="text-emerald-600 font-bold">✓ 100% PERFECT SYNAPTIC SYNC!</span>
                ) : (
                  <span>Adjust connections & sliders...</span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Center: Neurotransmitter Sliders */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-2xl px-4 pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                  🎛️ NEUROTRANSMITTER SLIDERS
                </span>
                <span className="text-xs font-mono text-slate-600 font-medium">
                  Target Dopamine: {puzzleLevel.targetNeurotransmitters.dopamine[0]}-{puzzleLevel.targetNeurotransmitters.dopamine[1]}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-xs">
                {/* Dopamine Slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-900 font-bold">Dopamine ({userSliders.dopamine}%)</span>
                    <span className="text-[10px] text-slate-500">Target: {puzzleLevel.targetNeurotransmitters.dopamine[0]}-{puzzleLevel.targetNeurotransmitters.dopamine[1]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={userSliders.dopamine}
                    onChange={(e) => handleSliderChange("dopamine", parseInt(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>

                {/* Cortisol Slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-900 font-bold">Cortisol ({userSliders.cortisol}%)</span>
                    <span className="text-[10px] text-slate-500">Target: {puzzleLevel.targetNeurotransmitters.cortisol[0]}-{puzzleLevel.targetNeurotransmitters.cortisol[1]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={userSliders.cortisol}
                    onChange={(e) => handleSliderChange("cortisol", parseInt(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>

                {/* Serotonin Slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-900 font-bold">Serotonin ({userSliders.serotonin}%)</span>
                    <span className="text-[10px] text-slate-500">Target: {puzzleLevel.targetNeurotransmitters.serotonin[0]}-{puzzleLevel.targetNeurotransmitters.serotonin[1]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={userSliders.serotonin}
                    onChange={(e) => handleSliderChange("serotonin", parseInt(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* Acetylcholine Slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-900 font-bold">Acetylcholine ({userSliders.acetylcholine}%)</span>
                    <span className="text-[10px] text-slate-500">Target: {puzzleLevel.targetNeurotransmitters.acetylcholine[0]}-{puzzleLevel.targetNeurotransmitters.acetylcholine[1]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={userSliders.acetylcholine}
                    onChange={(e) => handleSliderChange("acetylcholine", parseInt(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Victory Mastery Modal (NCASE.ME Style Gamified Reward) */}
      <AnimatePresence>
        {showVictoryModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md pointer-events-auto"
          >
            <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl relative">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner border border-emerald-300">
                🏆
              </div>

              <div>
                <span className="text-xs font-mono text-emerald-700 uppercase tracking-widest font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  TOPIC MASTERY BADGE UNLOCKED
                </span>
                <h2 className="text-3xl font-bold text-slate-900 mt-3">100% Synaptic Sync!</h2>
                <p className="mt-2 text-xs text-slate-600 font-normal leading-relaxed">
                  You have successfully repaired the neural signal path and restored optimal chemical balance!
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 font-mono">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">KEY NEUROSCIENCE TAKEAWAY</span>
                <p className="text-xs text-slate-800 font-normal leading-relaxed">{puzzleLevel.keyTakeaway}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsPuzzleMode(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-mono border border-slate-300 transition cursor-pointer font-bold"
                >
                  RETURN TO 3D BRAIN
                </button>
                <Link
                  href="/"
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs font-mono transition inline-block cursor-pointer shadow-md"
                >
                  NEXT LAB →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
