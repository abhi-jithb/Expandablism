"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Topic } from "@/types/content";
import { DynamicViewer } from "@/components/3d/DynamicViewer";
import { MOTORCYCLE_COMPONENTS, DeconstructedComponent } from "@/data/deconstructionConfig";

interface TopicPageClientProps {
  area: string;
  topicData: Topic;
}

export function TopicPageClient({ area, topicData }: TopicPageClientProps) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);
  const [activeLearningComponent, setActiveLearningComponent] = useState<DeconstructedComponent | null>(null);

  const explorableObject = topicData.objects[0];

  const handleUserInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const handleStartExploring = () => {
    setIsExploded(true);
    setSelectedComponentId(null);
  };

  const handleReassemble = () => {
    setIsExploded(false);
    setSelectedComponentId(null);
    setActiveLearningComponent(null);
  };

  const handleExploreComponent = (componentId: string) => {
    const comp = MOTORCYCLE_COMPONENTS.find((c) => c.id === componentId);
    if (comp) {
      setActiveLearningComponent(comp);
    }
  };

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
          selectedComponentId={selectedComponentId}
          hoveredComponentId={hoveredComponentId}
          onSelectComponent={setSelectedComponentId}
          onHoverComponent={setHoveredComponentId}
          onExploreComponent={handleExploreComponent}
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

        {/* Minimal Header Action or Controls */}
        <div className="flex items-center space-x-4 pointer-events-auto">
          {isExploded ? (
            <button
              onClick={handleReassemble}
              className="px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-500 transition flex items-center space-x-2 cursor-pointer shadow-lg active:scale-95"
            >
              <span>↺</span>
              <span>Reassemble</span>
            </button>
          ) : (
            <nav className="flex items-center space-x-6 text-xs font-medium text-slate-400">
              <span className="hover:text-slate-200 cursor-pointer transition">Explore</span>
              <span className="hover:text-slate-200 cursor-pointer transition opacity-50">Learn</span>
              <span className="hover:text-slate-200 cursor-pointer transition opacity-50">Rebuild</span>
            </nav>
          )}
        </div>
      </header>

      {/* Initial View Presentation Overlay (Bottom-Center) */}
      {!isExploded && (
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

            {/* Sleek Pill CTA Button */}
            <button
              onClick={handleStartExploring}
              className="mt-3 px-8 py-3 rounded-full bg-white text-slate-950 font-medium text-xs tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:bg-slate-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] active:scale-95 cursor-pointer"
            >
              Start Exploring
            </button>
          </div>
        </div>
      )}

      {/* Progressive Learning Intro Modal (Minimal Museum Card) */}
      {activeLearningComponent && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-left space-y-4 relative">
            <button
              onClick={() => setActiveLearningComponent(null)}
              className="absolute top-6 right-6 text-slate-500 hover:text-white text-sm font-mono"
            >
              ✕
            </button>

            <span className="text-[10px] font-mono tracking-[0.25em] text-blue-400 uppercase block">
              COMPONENT EXPLORATION // 01
            </span>

            <h2 className="text-2xl font-bold text-white tracking-tight">
              {activeLearningComponent.name}
            </h2>

            <p className="text-sm text-slate-300 font-light leading-relaxed">
              {activeLearningComponent.description}
            </p>

            <div className="pt-4 flex items-center justify-between border-t border-slate-800/80">
              <span className="text-xs font-mono text-slate-500">CONCEPT LAYER READY</span>
              <button
                onClick={() => setActiveLearningComponent(null)}
                className="px-6 py-2.5 bg-white text-slate-950 rounded-full font-medium text-xs tracking-wide uppercase hover:bg-slate-200 transition"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Interaction Hint (Bottom Viewport) */}
      <div
        className={`absolute bottom-4 inset-x-0 z-10 flex justify-center pointer-events-none transition-opacity duration-700 ${
          hasInteracted ? "opacity-0" : "opacity-60"
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
