"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Topic } from "@/types/content";
import { DynamicViewer } from "@/components/3d/DynamicViewer";

interface TopicPageClientProps {
  area: string;
  topicData: Topic;
}

export function TopicPageClient({ area, topicData }: TopicPageClientProps) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isExploring, setIsExploring] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  const explorableObject = topicData.objects[0];
  const selectedComponent = explorableObject?.components.find(
    (c) => c.id === selectedComponentId
  );

  const handleUserInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#070709] text-slate-100 font-sans select-none">
      {/* 3D Viewport Hero Stage (Full Screen Background) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <DynamicViewer
          modelPath={explorableObject.modelPath}
          initialCameraPosition={isExploring ? [2.2, 1.0, 2.2] : explorableObject.initialCameraPosition}
          minDistance={explorableObject.minDistance}
          maxDistance={explorableObject.maxDistance}
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

        <nav className="flex items-center space-x-6 text-xs font-medium text-slate-400 pointer-events-auto">
          <span className={isExploring ? "text-white font-semibold" : "hover:text-slate-200 cursor-pointer transition"}>
            Explore
          </span>
          <span className="hover:text-slate-200 cursor-pointer transition opacity-50">
            Learn
          </span>
          <span className="hover:text-slate-200 cursor-pointer transition opacity-50">
            Rebuild
          </span>
        </nav>
      </header>

      {/* Initial View Overlay (Bottom-Center Presentation) */}
      {!isExploring && (
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
              onClick={() => setIsExploring(true)}
              className="mt-3 px-8 py-3 rounded-full bg-white text-slate-950 font-medium text-xs tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:bg-slate-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] active:scale-95 cursor-pointer"
            >
              Start Exploring
            </button>
          </div>
        </div>
      )}

      {/* Exploration Mode Overlay */}
      {isExploring && (
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 sm:p-10">
          {/* Top Bar Navigation Controls */}
          <div className="mt-14 flex items-center justify-between pointer-events-auto">
            <button
              onClick={() => {
                setIsExploring(false);
                setSelectedComponentId(null);
              }}
              className="flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-white transition bg-slate-900/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-800/60"
            >
              <span>←</span>
              <span>Overview Mode</span>
            </button>

            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800/60">
              Component Selection Mode
            </span>
          </div>

          {/* Component Selection Cards Bar (Floating Bottom Overlay) */}
          <div className="pointer-events-auto w-full max-w-4xl mx-auto mb-6">
            <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center justify-between mb-3 px-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Select Component to Deconstruct ({explorableObject.components.length})
                </span>
                {selectedComponentId && (
                  <button
                    onClick={() => setSelectedComponentId(null)}
                    className="text-[11px] font-mono text-slate-500 hover:text-slate-300"
                  >
                    Clear Selection
                  </button>
                )}
              </div>

              {/* Horizontal Scroll Component Pills */}
              <div className="flex items-center space-x-2.5 overflow-x-auto pb-1 scrollbar-none">
                {explorableObject.components.map((comp) => {
                  const isSelected = comp.id === selectedComponentId;
                  return (
                    <button
                      key={comp.id}
                      onClick={() => setSelectedComponentId(comp.id)}
                      className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer text-left ${
                        isSelected
                          ? "bg-white text-slate-950 font-semibold shadow-lg scale-[1.02]"
                          : "bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800"
                      }`}
                    >
                      <div className="font-medium truncate">{comp.name}</div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Component Information Panel */}
              {selectedComponent && (
                <div className="mt-4 pt-4 border-t border-slate-800/80 text-left animate-fadeIn">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                        {selectedComponent.nodeName} Mesh Node
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        {selectedComponent.name}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-xl">
                        {selectedComponent.description}
                      </p>
                    </div>

                    {selectedComponent.concepts && selectedComponent.concepts.length > 0 && (
                      <div className="hidden sm:block text-right">
                        <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block mb-1.5">
                          Linked Concepts
                        </span>
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {selectedComponent.concepts.map((concept) => (
                            <span
                              key={concept}
                              className="text-[10px] font-mono text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
