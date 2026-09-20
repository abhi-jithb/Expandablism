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
    <main className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans select-none flex flex-col">
      {/* Top Navigation Header */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex items-center justify-between bg-black/90 border-b border-zinc-900 pointer-events-auto">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-mono text-zinc-400 hover:text-white transition tracking-widest uppercase flex items-center gap-1 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800"
          >
            ← Subject Labs
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                BRAIN & NEUROSCIENCE // {topicData.name.toUpperCase()}
              </span>
            </div>
            <h1 className="text-lg font-light text-white">{topicContent.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <button
            onClick={() => {
              setIsPuzzleMode(!isPuzzleMode);
              setShowVictoryModal(false);
              showToast(isPuzzleMode ? "Switched to 3D Brain Exploration" : "Launched Synaptic Puzzle Game!");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all border flex items-center gap-2 cursor-pointer shadow-lg ${
              isPuzzleMode
                ? "bg-white text-black border-white font-bold"
                : "bg-zinc-900 hover:bg-white hover:text-black text-white border-zinc-700 font-bold"
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
            className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-zinc-900 text-white border border-zinc-700 px-5 py-2.5 rounded-full text-xs font-mono shadow-2xl backdrop-blur-md"
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
            <div className="bg-[#09090b]/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 shadow-2xl space-y-3">
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center justify-between border-b border-zinc-800 pb-2">
                <span>SIMULATE BRAIN STATE</span>
                <span className="text-white font-bold">{activeState.dominantWave}</span>
              </div>

              <div className="space-y-1.5">
                {topicContent.availableStates.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setActiveState(st)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all border flex items-center justify-between cursor-pointer ${
                      activeState.id === st.id
                        ? "bg-white text-black font-bold border-white shadow-md"
                        : "bg-zinc-950 text-zinc-400 hover:text-white border-zinc-800 hover:bg-zinc-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activeState.id === st.id ? "bg-black" : "bg-zinc-500"}`}></span>
                      <span>{st.name}</span>
                    </div>
                    {activeState.id === st.id && <span className="text-[10px]">ACTIVE</span>}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 font-light leading-relaxed">
                <span className="text-white font-medium">{activeState.tagline}:</span> {activeState.description}
              </div>
            </div>
          </div>

          {/* Bottom Center: Neurotransmitter Gauge Bar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-xl px-4 pointer-events-auto">
            <div className="bg-[#09090b]/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2">
                <span>NEUROTRANSMITTER READOUT</span>
                <span className="text-white font-semibold">STATE: {activeState.name.toUpperCase()}</span>
              </div>

              <div className="grid grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                    <span>Dopamine</span>
                    <span className="text-white font-bold">{activeState.neurotransmitters.dopamine}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="bg-white h-full transition-all duration-500"
                      style={{ width: `${activeState.neurotransmitters.dopamine}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                    <span>Cortisol</span>
                    <span className="text-zinc-300">{activeState.neurotransmitters.cortisol}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="bg-zinc-400 h-full transition-all duration-500"
                      style={{ width: `${activeState.neurotransmitters.cortisol}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                    <span>Serotonin</span>
                    <span className="text-zinc-300">{activeState.neurotransmitters.serotonin}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="bg-zinc-200 h-full transition-all duration-500"
                      style={{ width: `${activeState.neurotransmitters.serotonin}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                    <span>Acetylcholine</span>
                    <span className="text-white font-bold">{activeState.neurotransmitters.acetylcholine}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="bg-white h-full transition-all duration-500"
                      style={{ width: `${activeState.neurotransmitters.acetylcholine}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Anatomical Region Inspector */}
          <div className="absolute top-20 right-6 z-10 w-96 max-h-[82vh] overflow-y-auto pointer-events-auto pr-1">
            <div className="bg-[#09090b]/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="border-b border-zinc-800 pb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  ANATOMICAL REGION INSPECTION
                </span>
                <h2 className="text-xl font-light text-white flex items-center gap-2 mt-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                  {selectedRegion.name}
                </h2>
              </div>

              <div className="space-y-3 font-light text-xs text-zinc-300">
                <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800 font-mono space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase block">SCIENTIFIC TERM</span>
                  <span className="text-white font-semibold block">{selectedRegion.scientificTerm}</span>
                  <span className="text-[10px] text-zinc-500 uppercase block mt-2">REAL-WORLD ANALOGY</span>
                  <span className="text-zinc-300 font-medium block">"{selectedRegion.analogy}"</span>
                </div>

                <p className="leading-relaxed text-zinc-300">{selectedRegion.description}</p>
              </div>

              {/* Real-World Phenomena & Solutions */}
              <div className="pt-3 border-t border-zinc-800">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-3">
                  REAL-WORLD PHENOMENA & SOLUTIONS
                </span>

                <div className="space-y-3">
                  {selectedRegion.keyPhenomena.map((ph, idx) => (
                    <div key={idx} className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/80 space-y-2">
                      <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <span className="text-zinc-400">⚡</span> {ph.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed font-light">{ph.description}</p>

                      <div className="pt-2 border-t border-zinc-900 text-[11px] space-y-1">
                        <div>
                          <span className="text-zinc-400 font-mono text-[10px] uppercase">Impact: </span>
                          <span className="text-zinc-300 font-light">{ph.impact}</span>
                        </div>
                        <div>
                          <span className="text-white font-mono text-[10px] uppercase font-bold">Solution: </span>
                          <span className="text-zinc-200 font-light">{ph.solution}</span>
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
            <div className="bg-[#09090b]/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                  🧩 SYNAPTIC NEURAL ALIGNMENT PUZZLE
                </span>
                <button
                  onClick={handleResetPuzzle}
                  className="text-[10px] font-mono text-zinc-400 hover:text-white underline cursor-pointer"
                >
                  RESET
                </button>
              </div>

              <h2 className="text-lg font-light text-white">{puzzleLevel.title}</h2>
              <div className="text-xs font-mono text-zinc-300 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
                🚨 SCENARIO: {puzzleLevel.brokenScenario}
              </div>

              <div className="text-xs text-zinc-300 font-light leading-relaxed">
                <span className="font-semibold text-white">OBJECTIVE:</span> {puzzleLevel.objective}
              </div>

              <div className="pt-2 border-t border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-1">
                <div>1. Click 3D neural nodes to connect signal paths.</div>
                <div>2. Tune neurotransmitter sliders to target equilibrium.</div>
              </div>
            </div>
          </div>

          {/* Top Right: Synaptic Sync Meter */}
          <div className="absolute top-20 right-6 z-10 w-80 pointer-events-auto">
            <div className="bg-[#09090b]/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5 shadow-2xl flex flex-col items-center text-center">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">
                NEURAL CIRCUIT SYNC
              </span>

              <div className="relative w-32 h-32 flex items-center justify-center my-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-zinc-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-white"
                    strokeDasharray={`${currentSync}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-light font-mono text-white">
                    {currentSync}%
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">SYNC</span>
                </div>
              </div>

              <div className="text-xs font-mono text-zinc-400">
                {currentSync === 100 ? (
                  <span className="text-white font-bold">✓ 100% PERFECT SYNAPTIC SYNC!</span>
                ) : (
                  <span>Adjust connections & sliders...</span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Center: Neurotransmitter Sliders */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-2xl px-4 pointer-events-auto">
            <div className="bg-[#09090b]/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                  🎛️ NEUROTRANSMITTER SLIDERS
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  Target Dopamine: {puzzleLevel.targetNeurotransmitters.dopamine[0]}-{puzzleLevel.targetNeurotransmitters.dopamine[1]}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-xs">
                {/* Dopamine Slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-white">Dopamine ({userSliders.dopamine}%)</span>
                    <span className="text-[10px] text-zinc-500">Target: {puzzleLevel.targetNeurotransmitters.dopamine[0]}-{puzzleLevel.targetNeurotransmitters.dopamine[1]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={userSliders.dopamine}
                    onChange={(e) => handleSliderChange("dopamine", parseInt(e.target.value))}
                    className="w-full accent-white cursor-pointer"
                  />
                </div>

                {/* Cortisol Slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-300">Cortisol ({userSliders.cortisol}%)</span>
                    <span className="text-[10px] text-zinc-500">Target: {puzzleLevel.targetNeurotransmitters.cortisol[0]}-{puzzleLevel.targetNeurotransmitters.cortisol[1]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={userSliders.cortisol}
                    onChange={(e) => handleSliderChange("cortisol", parseInt(e.target.value))}
                    className="w-full accent-zinc-400 cursor-pointer"
                  />
                </div>

                {/* Serotonin Slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-300">Serotonin ({userSliders.serotonin}%)</span>
                    <span className="text-[10px] text-zinc-500">Target: {puzzleLevel.targetNeurotransmitters.serotonin[0]}-{puzzleLevel.targetNeurotransmitters.serotonin[1]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={userSliders.serotonin}
                    onChange={(e) => handleSliderChange("serotonin", parseInt(e.target.value))}
                    className="w-full accent-zinc-300 cursor-pointer"
                  />
                </div>

                {/* Acetylcholine Slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-white">Acetylcholine ({userSliders.acetylcholine}%)</span>
                    <span className="text-[10px] text-zinc-500">Target: {puzzleLevel.targetNeurotransmitters.acetylcholine[0]}-{puzzleLevel.targetNeurotransmitters.acetylcholine[1]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={userSliders.acetylcholine}
                    onChange={(e) => handleSliderChange("acetylcholine", parseInt(e.target.value))}
                    className="w-full accent-white cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Victory Mastery Modal */}
      <AnimatePresence>
        {showVictoryModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md pointer-events-auto"
          >
            <div className="bg-[#09090b] border border-white rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl relative">
              <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                🧠
              </div>

              <div>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                  TOPIC MASTERY ACHIEVED
                </span>
                <h2 className="text-3xl font-light text-white mt-1">100% Synaptic Sync!</h2>
                <p className="mt-2 text-xs text-zinc-400 font-light leading-relaxed">
                  You have successfully repaired the neural signal path and restored optimal chemical balance!
                </p>
              </div>

              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-left space-y-2 font-mono">
                <span className="text-[10px] text-zinc-500 uppercase block">KEY NEUROSCIENCE TAKEAWAY</span>
                <p className="text-xs text-zinc-200 font-light leading-relaxed">{puzzleLevel.keyTakeaway}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsPuzzleMode(false)}
                  className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-mono border border-zinc-700 transition cursor-pointer"
                >
                  RETURN TO 3D BRAIN
                </button>
                <Link
                  href="/"
                  className="flex-1 py-3 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl text-xs font-mono transition inline-block cursor-pointer"
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
