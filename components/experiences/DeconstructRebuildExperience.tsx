"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Topic } from "@/types/content";
import { DynamicViewer } from "@/components/3d/DynamicViewer";
import {
  MOTORCYCLE_COMPONENTS,
  REBUILD_REQUIRED_COMPONENTS,
} from "@/data/deconstructionConfig";
import { SpatialToolbox } from "@/components/ui/SpatialToolbox";

type ExperienceMode = "intro" | "explore" | "learn" | "rebuild" | "complete";

interface DeconstructRebuildExperienceProps {
  area: string;
  topicData: Topic;
}

export function DeconstructRebuildExperience({
  area,
  topicData,
}: DeconstructRebuildExperienceProps) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [mode, setMode] = useState<ExperienceMode>("intro");

  // Selection & Hover States
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);

  // Progressive Engine Learning State
  const [learningStep, setLearningStep] = useState<number | null>(null);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState<number>(0);

  // Progress Tracking & Rebuild State
  const [exploredComponentIds, setExploredComponentIds] = useState<Set<string>>(new Set());
  const [assembledComponentIds, setAssembledComponentIds] = useState<Set<string>>(new Set());
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  const explorableObject = topicData.objects[0];

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
    showNotification("Rebuild mode active");
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

  const handleNextLearningStep = () => {
    if (learningStep === 1) setLearningStep(2);
    else if (learningStep === 2) setLearningStep(3);
    else if (learningStep === 3) {
      setLearningStep(4);
      setCurrentStrokeIndex(0);
    }
  };

  const handleCompleteLearningStep5 = () => {
    setExploredComponentIds((prev) => new Set(prev).add("engine"));
    setMode("explore");
    setLearningStep(null);
    setSelectedComponentId(null);
    showNotification("Engine explored");
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

    showNotification(`${name} connected`);
    setSelectedComponentId(null);
  };

  const handleSnapFail = (comp: string) => {
    const componentObj = MOTORCYCLE_COMPONENTS.find((c) => c.id === comp);
    const name = componentObj ? componentObj.name : comp;
    showNotification(`Move ${name} closer to connected position`);
  };

  const isExploded = mode === "explore" || mode === "learn";
  const isRebuild = mode === "rebuild";
  const activeLearningComponentId = mode === "learn" ? "engine" : null;

  const unAssembledComponents = REBUILD_REQUIRED_COMPONENTS.filter(
    (c) => !assembledComponentIds.has(c.id)
  );

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#070709] text-slate-100 font-sans select-none">
      {/* 3D Viewport Hero Stage (Full Screen Background) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <DynamicViewer
          modelPath={explorableObject?.modelPath || "/models/motorcycle.glb"}
          initialCameraPosition={explorableObject?.initialCameraPosition || [3.5, 1.8, 3.5]}
          minDistance={explorableObject?.minDistance || 2.0}
          maxDistance={explorableObject?.maxDistance || 8.0}
          isExploded={isExploded}
          isRebuildMode={isRebuild}
          assembledComponentIds={assembledComponentIds}
          selectedComponentId={selectedComponentId}
          hoveredComponentId={hoveredComponentId}
          activeLearningComponentId={activeLearningComponentId}
          learningStep={learningStep}
          currentStrokeIndex={currentStrokeIndex}
          onSelectComponent={setSelectedComponentId}
          onHoverComponent={setHoveredComponentId}
          onExploreComponent={handleExploreComponent}
          onNextLearningStep={handleNextLearningStep}
          onSelectStrokeIndex={setCurrentStrokeIndex}
          onCompleteLearning={handleCompleteLearningStep5}
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
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800">
                Explored &middot; <span className="text-white font-bold">{exploredComponentIds.size}</span> / 9
              </span>

              {exploredComponentIds.has("engine") ? (
                <button
                  onClick={handleEnterRebuild}
                  className="px-4 py-1.5 rounded-full bg-white text-slate-950 text-xs font-medium uppercase tracking-wider hover:bg-slate-100 transition cursor-pointer active:scale-95"
                >
                  Start Rebuild
                </button>
              ) : (
                <button
                  onClick={handleReassembleOverview}
                  className="px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition flex items-center space-x-2 cursor-pointer"
                >
                  <span>↺</span>
                  <span>Reassemble</span>
                </button>
              )}
            </>
          )}

          {mode === "rebuild" && (
            <span className="text-[11px] font-mono text-slate-300 bg-slate-900 px-4 py-1.5 rounded-full border border-slate-800">
              REBUILD &middot; <span className="text-white font-bold">{assembledComponentIds.size}</span> / {REBUILD_REQUIRED_COMPONENTS.length} assembled
            </span>
          )}
        </div>
      </header>

      {/* Toast Feedback Banner */}
      {lastNotification && (
        <div className="absolute top-20 inset-x-0 z-30 flex justify-center pointer-events-none animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 px-5 py-2.5 rounded-full text-xs font-mono text-white">
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
              {explorableObject?.name || topicData.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 font-light max-w-xs leading-relaxed">
              Understand the machine, one component at a time.
            </p>

            <button
              onClick={handleStartExploring}
              className="mt-3 px-8 py-3 rounded-full bg-white text-slate-950 font-medium text-xs tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:bg-slate-100 active:scale-95 cursor-pointer"
            >
              Start Exploring
            </button>
          </div>
        </div>
      )}

      {/* MODE: REBUILD — Spatial Laboratory Toolbox Drawer */}
      {mode === "rebuild" && (
        <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center pointer-events-none px-6">
          <div className="max-w-4xl w-full">
            <SpatialToolbox
              title="MOTORCYCLE REBUILD TOOLBOX"
              items={REBUILD_REQUIRED_COMPONENTS.map((comp) => ({
                id: comp.id,
                name: comp.name,
                description: comp.description,
                status: assembledComponentIds.has(comp.id) ? "connected" : "in_toolbox",
                iconTag: comp.id.substring(0, 4).toUpperCase(),
              }))}
              selectedItemId={selectedComponentId}
              onSelectItem={setSelectedComponentId}
              onActionItem={(id) => {
                handleSnapSuccess(id);
              }}
              actionLabel="Assemble onto Chassis"
            />
          </div>
        </div>
      )}

      {/* MODE: COMPLETE — Mastery Result Modal */}
      {mode === "complete" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-slate-950/80 animate-fadeIn">
          <div className="bg-[#09090b] border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-slate-400 uppercase block mb-1">
                MASTERY COMPLETE
              </span>
              <h2 className="text-3xl font-light text-white tracking-tight">
                MOTORCYCLE REBUILT
              </h2>
              <p className="text-xs text-slate-400 font-light mt-2">
                You explored it. You understood it. You rebuilt it.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-left space-y-2 text-xs font-mono text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Components Understood</span>
                <span className="text-white font-bold">8 / 8</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">3D Reconstruction</span>
                <span className="text-white font-bold">Complete</span>
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
                href="/"
                className="block w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-xs tracking-wider uppercase rounded-full transition border border-slate-800 text-center"
              >
                Discover Something Else
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Interaction Hint */}
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
