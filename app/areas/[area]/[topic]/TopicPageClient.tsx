"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Topic } from "@/types/content";
import { DynamicViewer } from "@/components/3d/DynamicViewer";
import {
  MOTORCYCLE_COMPONENTS,
  REBUILD_REQUIRED_COMPONENTS,
  DeconstructedComponent,
} from "@/data/deconstructionConfig";
import { LEARNING_CONTENT_MAP } from "@/data/learningContent";

type ExperienceMode = "intro" | "explore" | "learn" | "rebuild" | "complete";

interface TopicPageClientProps {
  area: string;
  topicData: Topic;
}

export function TopicPageClient({ area, topicData }: TopicPageClientProps) {
  const [hasInteracted, setHasInteracted] = useState(false);

  // Explicit Experience Mode State Machine
  const [mode, setMode] = useState<ExperienceMode>("intro");

  // Selection & Hover States
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);

  // Progressive Engine Learning State
  const [learningStep, setLearningStep] = useState<number | null>(null);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState<number>(0);

  // Progress Tracking & Rebuild State
  const [exploredComponentIds, setExploredComponentIds] = useState<Set<string>>(new Set());
  const [assembledComponentIds, setAssembledComponentIds] = useState<Set<string>>(new Set());
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  const explorableObject = topicData.objects[0];
  const engineData = LEARNING_CONTENT_MAP["engine"];

  const handleUserInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const handleStartExploring = () => {
    setMode("explore");
    setSelectedComponentId(null);
  };

  const handleEnterRebuild = () => {
    setMode("rebuild");
    setSelectedComponentId(null);
    setAssembledComponentIds(new Set());
    showNotification("3D Reconstruction Workspace Initialized");
  };

  const handleReassembleOverview = () => {
    setMode("intro");
    setSelectedComponentId(null);
  };

  const handleExploreComponent = (componentId: string) => {
    if (componentId === "engine") {
      setMode("learn");
      setLearningStep(1);
      setSelectedComponentId("engine");
    }
  };

  const handleCompleteLearningStep5 = () => {
    setExploredComponentIds((prev) => new Set(prev).add("engine"));
    setMode("explore");
    setLearningStep(null);
    setSelectedComponentId(null);
    showNotification("✓ Engine Exploration Completed");
  };

  const showNotification = (msg: string) => {
    setLastNotification(msg);
    setTimeout(() => {
      setLastNotification(null);
    }, 2800);
  };

  // Puzzle Snapping Handlers
  const handleSnapSuccess = (comp: string) => {
    const componentObj = MOTORCYCLE_COMPONENTS.find((c) => c.id === comp);
    const name = componentObj ? componentObj.name : comp;

    setAssembledComponentIds((prev) => {
      const next = new Set(prev).add(comp);
      if (next.size >= REBUILD_REQUIRED_COMPONENTS.length) {
        setTimeout(() => {
          setMode("complete");
        }, 1000);
      }
      return next;
    });

    showNotification(`✓ ${name} connected`);
    setSelectedComponentId(null);
  };

  const handleSnapFail = (comp: string) => {
    const componentObj = MOTORCYCLE_COMPONENTS.find((c) => c.id === comp);
    const name = componentObj ? componentObj.name : comp;
    showNotification(`Move ${name} closer to chassis frame center to connect`);
  };

  const isExploded = mode === "explore" || mode === "learn";
  const isRebuild = mode === "rebuild";
  const activeLearningComponentId = mode === "learn" ? "engine" : null;
  const currentStroke = engineData.fourStrokes[currentStrokeIndex];
  const selectedHotspot = engineData.hotspots.find((h) => h.id === selectedHotspotId);

  const unAssembledComponents = REBUILD_REQUIRED_COMPONENTS.filter(
    (c) => !assembledComponentIds.has(c.id)
  );

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#070709] text-slate-100 font-sans select-none">
      {/* 3D Viewport Hero Stage (Full Screen Background) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <DynamicViewer
          modelPath={explorableObject.modelPath}
          initialCameraPosition={explorableObject.initialCameraPosition}
          minDistance={explorableObject.minDistance}
          maxDistance={explorableObject.maxDistance}
          isExploded={isExploded}
          isRebuildMode={isRebuild}
          assembledComponentIds={assembledComponentIds}
          selectedComponentId={selectedComponentId}
          hoveredComponentId={hoveredComponentId}
          activeLearningComponentId={activeLearningComponentId}
          currentStroke={mode === "learn" && learningStep === 4 ? currentStroke : undefined}
          onSelectComponent={setSelectedComponentId}
          onHoverComponent={setHoveredComponentId}
          onExploreComponent={handleExploreComponent}
          onSnapSuccess={handleSnapSuccess}
          onSnapFail={handleSnapFail}
          onUserInteraction={handleUserInteraction}
        />
      </div>

      {/* Minimal Header Chrome */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 sm:px-10 py-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-3 pointer-events-auto">
          <Link href="/" className="text-sm font-semibold tracking-tight text-white hover:opacity-80 transition">
            Expandablism
          </Link>
          <span className="hidden sm:inline-block text-xs font-light text-slate-500 border-l border-slate-800 pl-3">
            Explore. Understand. Rebuild.
          </span>
        </div>

        {/* Dynamic Mode Controls */}
        <div className="flex items-center space-x-4 pointer-events-auto">
          {mode === "explore" && (
            <>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800">
                Explored &middot; <span className="text-blue-400 font-bold">{exploredComponentIds.size}</span> / 9
              </span>

              {exploredComponentIds.has("engine") ? (
                <button
                  onClick={handleEnterRebuild}
                  className="px-4 py-1.5 rounded-full bg-white text-slate-950 text-xs font-semibold uppercase tracking-wider hover:bg-slate-100 transition cursor-pointer shadow-lg active:scale-95"
                >
                  Start Rebuild
                </button>
              ) : (
                <button
                  onClick={handleReassembleOverview}
                  className="px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-xs font-mono text-slate-300 hover:text-white transition flex items-center space-x-2 cursor-pointer shadow-lg"
                >
                  <span>↺</span>
                  <span>Reassemble</span>
                </button>
              )}
            </>
          )}

          {mode === "rebuild" && (
            <span className="text-[11px] font-mono text-slate-300 bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700">
              REBUILD &middot; <span className="text-emerald-400 font-bold">{assembledComponentIds.size}</span> / {REBUILD_REQUIRED_COMPONENTS.length} assembled
            </span>
          )}
        </div>
      </header>

      {/* Snap / Toast Feedback Banner */}
      {lastNotification && (
        <div className="absolute top-20 inset-x-0 z-30 flex justify-center pointer-events-none animate-fadeIn">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 px-5 py-2.5 rounded-full text-xs font-mono text-white shadow-2xl">
            {lastNotification}
          </div>
        </div>
      )}

      {/* MODE: INTRO — Initial Presentation Overlay */}
      {mode === "intro" && (
        <div className="absolute inset-x-0 bottom-14 z-10 flex flex-col items-center text-center px-6 pointer-events-none transition-all duration-500">
          <div className="pointer-events-auto flex flex-col items-center max-w-md space-y-3">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-slate-500">
              {area.toUpperCase()} / {topicData.name.toUpperCase()}
            </span>

            <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-white">
              {explorableObject.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 font-light max-w-xs leading-relaxed">
              Understand the machine, one component at a time.
            </p>

            <button
              onClick={handleStartExploring}
              className="mt-3 px-8 py-3 rounded-full bg-white text-slate-950 font-medium text-xs tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:bg-slate-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] active:scale-95 cursor-pointer"
            >
              Start Exploring
            </button>
          </div>
        </div>
      )}

      {/* MODE: LEARN — STEP 1 */}
      {mode === "learn" && learningStep === 1 && (
        <div className="absolute inset-x-0 bottom-12 z-20 flex flex-col items-center text-center px-6 pointer-events-none animate-fadeIn">
          <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 max-w-md w-full shadow-2xl pointer-events-auto space-y-3">
            <span className="text-[10px] font-mono tracking-[0.25em] text-blue-400 uppercase">
              STEP 1 // ENGINE FOCUS
            </span>
            <h2 className="text-2xl font-bold text-white">{engineData.name}</h2>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              {engineData.overview}
            </p>
            <button
              onClick={() => setLearningStep(2)}
              className="w-full py-3 bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs tracking-wider uppercase rounded-full transition shadow-md cursor-pointer active:scale-95 mt-2"
            >
              Understand Engine
            </button>
          </div>
        </div>
      )}

      {/* MODE: LEARN — STEP 2 */}
      {mode === "learn" && learningStep === 2 && (
        <div className="absolute inset-x-0 bottom-12 z-20 flex flex-col items-center text-center px-6 pointer-events-none animate-fadeIn">
          <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 max-w-lg w-full shadow-2xl pointer-events-auto space-y-4">
            <span className="text-[10px] font-mono tracking-[0.25em] text-blue-400 uppercase">
              STEP 2 // BASIC UNDERSTANDING
            </span>
            <h2 className="text-xl font-bold text-white">How Fuel Becomes Motion</h2>

            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Fuel is ignited inside sealed cylinders, creating gas pressure that drives pistons to turn the crankshaft.
            </p>

            <div className="py-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">
                Energy Conversion Sequence
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-mono">
                {engineData.energyFlow.map((item, idx) => (
                  <React.Fragment key={item.step}>
                    <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-blue-300 rounded-md">
                      {item.label}
                    </span>
                    {idx < engineData.energyFlow.length - 1 && (
                      <span className="text-slate-600">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <button
              onClick={() => setLearningStep(3)}
              className="w-full py-3 bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs tracking-wider uppercase rounded-full transition shadow-md cursor-pointer active:scale-95"
            >
              Explore 3D Mechanics
            </button>
          </div>
        </div>
      )}

      {/* MODE: LEARN — STEP 3 */}
      {mode === "learn" && learningStep === 3 && (
        <div className="absolute inset-x-0 bottom-12 z-20 flex flex-col items-center text-center px-6 pointer-events-none animate-fadeIn">
          <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 max-w-xl w-full shadow-2xl pointer-events-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-[0.25em] text-blue-400 uppercase">
                STEP 3 // 3D CONCEPT HOTSPOTS
              </span>
              <span className="text-[10px] font-mono text-slate-400">EDUCATIONAL SCHEMATIC</span>
            </div>

            <h2 className="text-xl font-bold text-white">Internal Engine Components</h2>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {engineData.hotspots.map((hotspot) => (
                <button
                  key={hotspot.id}
                  onClick={() => setSelectedHotspotId(hotspot.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
                    selectedHotspotId === hotspot.id
                      ? "bg-white text-slate-950 font-bold"
                      : "bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {hotspot.name}
                </button>
              ))}
            </div>

            {selectedHotspot && (
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-left text-xs text-slate-300">
                <span className="font-bold text-white block mb-0.5">{selectedHotspot.name}</span>
                <span>{selectedHotspot.description}</span>
              </div>
            )}

            <button
              onClick={() => {
                setLearningStep(4);
                setCurrentStrokeIndex(0);
              }}
              className="w-full py-3 bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs tracking-wider uppercase rounded-full transition shadow-md cursor-pointer active:scale-95 mt-2"
            >
              Master 4-Stroke Cycle
            </button>
          </div>
        </div>
      )}

      {/* MODE: LEARN — STEP 4 */}
      {mode === "learn" && learningStep === 4 && (
        <div className="absolute inset-x-0 bottom-10 z-20 flex flex-col items-center text-center px-6 pointer-events-none animate-fadeIn">
          <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 max-w-xl w-full shadow-2xl pointer-events-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-[0.25em] text-blue-400 uppercase">
                STEP 4 // FOUR-STROKE CYCLE
              </span>
              <span className="text-[10px] font-mono text-slate-400">3D ANIMATED SIMULATION</span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">{currentStroke.name}</h2>
              <p className="text-xs text-blue-400 font-mono mt-0.5">{currentStroke.action}</p>
            </div>

            <p className="text-xs text-slate-300 font-light leading-relaxed min-h-[40px]">
              {currentStroke.description}
            </p>

            <div className="grid grid-cols-4 gap-2 pt-1">
              {engineData.fourStrokes.map((stroke, idx) => (
                <button
                  key={stroke.id}
                  onClick={() => setCurrentStrokeIndex(idx)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-mono transition cursor-pointer ${
                    currentStrokeIndex === idx
                      ? "bg-white text-slate-950 font-bold shadow-md"
                      : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
                  }`}
                >
                  Stroke {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setLearningStep(5)}
              className="w-full py-3 bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs tracking-wider uppercase rounded-full transition shadow-md cursor-pointer active:scale-95 mt-2"
            >
              Complete Engine Exploration
            </button>
          </div>
        </div>
      )}

      {/* MODE: LEARN — STEP 5 Mastery Modal */}
      {mode === "learn" && learningStep === 5 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-left space-y-5">
            <span className="text-[10px] font-mono tracking-[0.25em] text-emerald-400 uppercase block">
              MASTERY UNLOCKED // STEP 5
            </span>

            <div>
              <h2 className="text-2xl font-bold text-white">ENGINE EXPLORED</h2>
              <p className="text-xs text-slate-400 mt-1 font-light">
                You have mastered the foundational mechanics of the internal combustion engine.
              </p>
            </div>

            <div className="space-y-2 py-2 border-y border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                Discovered Concepts:
              </span>
              <div className="space-y-1.5 text-xs text-slate-200 font-mono">
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Engine purpose & energy conversion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Cylinder bore, Piston & Crankshaft</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Spark ignition & valve timing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Four-stroke cycle mechanics</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCompleteLearningStep5}
              className="w-full py-3 bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs tracking-wider uppercase rounded-full transition shadow-md cursor-pointer active:scale-95"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}

      {/* MODE: REBUILD — Bottom Un-assembled Component Tray */}
      {mode === "rebuild" && (
        <div className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center pointer-events-none px-6">
          <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-4 max-w-2xl w-full shadow-2xl pointer-events-auto space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                3D Puzzle Pieces to Connect ({unAssembledComponents.length} remaining)
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Drag piece in 3D or click Connect below
              </span>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {unAssembledComponents.map((comp) => {
                const isSelected = comp.id === selectedComponentId;
                return (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedComponentId(comp.id)}
                    className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-mono transition cursor-pointer text-left ${
                      isSelected
                        ? "bg-amber-400 text-slate-950 font-bold shadow-md scale-105"
                        : "bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <span>{comp.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODE: COMPLETE — Mastery Result Modal */}
      {mode === "complete" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-2xl mb-1">
              ✓
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-emerald-400 uppercase block mb-1">
                MASTERY COMPLETE
              </span>
              <h2 className="text-3xl font-light text-white tracking-tight">
                MOTORCYCLE REBUILT
              </h2>
              <p className="text-xs text-slate-400 font-light mt-2">
                You explored it. You understood it. You rebuilt it.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-left space-y-2 text-xs font-mono text-slate-300">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-500">Components Understood</span>
                <span className="text-white font-bold">8 / 8</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">3D Reconstruction</span>
                <span className="text-emerald-400 font-bold">Complete</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setMode("intro");
                  setSelectedComponentId(null);
                  setAssembledComponentIds(new Set());
                }}
                className="w-full py-3 bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs tracking-wider uppercase rounded-full transition shadow-md cursor-pointer active:scale-95"
              >
                Explore Again
              </button>

              <Link
                href="/areas/vehicles"
                className="block w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-xs tracking-wider uppercase rounded-full transition border border-slate-800 text-center"
              >
                Discover Something Else
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Interaction Hint (Bottom Viewport) */}
      <div
        className={`absolute bottom-4 inset-x-0 z-10 flex justify-center pointer-events-none transition-opacity duration-700 ${
          hasInteracted || mode !== "intro" ? "opacity-0" : "opacity-60"
        }`}
      >
        <span className="text-[11px] font-mono text-slate-400 tracking-widest uppercase">
          <span className="hidden sm:inline">Drag to rotate &middot; Scroll to zoom</span>
          <span className="sm:hidden">Swipe to rotate &middot; Pinch to zoom</span>
        </span>
      </div>
    </main>
  );
}
