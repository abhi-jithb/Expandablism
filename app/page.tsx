"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AREAS_DATA } from "@/data/content";

export default function Home() {
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>("all");

  // Flatten all topics across areas
  const allTopicCards = Object.values(AREAS_DATA).flatMap((area) =>
    area.topics.map((topic) => ({
      areaId: area.id,
      areaName: area.name,
      ...topic,
    }))
  );

  const filteredTopics =
    selectedAreaFilter === "all"
      ? allTopicCards
      : allTopicCards.filter((t) => t.areaId === selectedAreaFilter);

  const areasList = Object.values(AREAS_DATA);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white font-sans relative overflow-hidden">
      {/* Background Dot-Grid Accent */}
      <div className="absolute inset-0 bg-dot-grid opacity-60 pointer-events-none z-0"></div>

      {/* Top Header Navigation */}
      <header className="relative z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-slate-900 uppercase">
              EXPANDABLISM
            </span>
            <span className="text-[10px] font-mono text-slate-500 border-l border-slate-200 pl-3 hidden sm:inline-block font-medium">
              EXPLORABLE SPATIAL LEARNING LABORATORY
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
            <span className="hidden md:inline-block text-slate-500">NCASE.ME INSPIRED</span>
            <a
              href="#subject-labs"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all font-semibold shadow-sm"
            >
              EXPLORE LABS ↓
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-16 lg:pt-24 lg:pb-20 border-b border-slate-200">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-[11px] font-mono text-sky-800 uppercase tracking-wider mb-8 font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-sky-600"></span>
            GAMIFIED EXPLORABLE EXPLANATIONS IN 3D
          </div>

          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-slate-900 leading-[0.98]">
            Don&apos;t just read theory. <br />
            <span className="font-light text-slate-600">Play with the mechanics.</span>
          </h1>

          <p className="mt-8 text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
            Interactive step-by-step 3D layers inspired by explorable explanations. Deconstruct mechanical engines, simulate bio-electric brain reactions, wire voltage loops, and unlock spatial mastery badges.
          </p>

          {/* Workflow Sequence (ncase.me style layer steps) */}
          <div className="mt-10 flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-xs">
            <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-xs font-medium">LAYER 1: DECONSTRUCT</span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-xs font-medium">LAYER 2: SIMULATE</span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-xs font-medium">LAYER 3: PUZZLE</span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg shadow-sm">LAYER 4: MASTER 🏆</span>
          </div>
        </motion.div>

        {/* Crisp Metrics Banner */}
        <div className="mt-16 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-2xl sm:text-4xl font-bold text-slate-900">{allTopicCards.length}</span>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block mt-1 font-semibold">ACTIVE LABS</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-2xl sm:text-4xl font-bold text-slate-900">4</span>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block mt-1 font-semibold">KNOWLEDGE DOMAINS</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-2xl sm:text-4xl font-bold text-sky-600">100%</span>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block mt-1 font-semibold">INTERACTIVE 3D</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-2xl sm:text-4xl font-bold text-emerald-600">🏆</span>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block mt-1 font-semibold">BADGES & REWARDS</span>
          </div>
        </div>
      </section>

      {/* Subject World Selection Grid */}
      <section id="subject-labs" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-200 gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
              EXPLORATION CATALOG
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 mt-1">Select a Knowledge Laboratory</h2>
          </div>

          {/* Area Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setSelectedAreaFilter("all")}
              className={`px-3.5 py-2 rounded-xl border transition cursor-pointer ${
                selectedAreaFilter === "all"
                  ? "bg-slate-900 text-white border-slate-900 font-bold shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:text-slate-900"
              }`}
            >
              ALL LABS ({allTopicCards.length})
            </button>
            {areasList.map((area) => (
              <button
                key={area.id}
                onClick={() => setSelectedAreaFilter(area.id)}
                className={`px-3.5 py-2 rounded-xl border transition cursor-pointer uppercase ${
                  selectedAreaFilter === area.id
                    ? "bg-slate-900 text-white border-slate-900 font-bold shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:text-slate-900"
                }`}
              >
                {area.name}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic, idx) => (
            <motion.div
              key={`${topic.areaId}-${topic.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <Link
                href={`/areas/${topic.areaId}/${topic.id}`}
                className="group relative rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:border-slate-400 hover:shadow-xl flex flex-col justify-between block h-full shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-mono text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200 font-bold uppercase tracking-wider">
                      MODEL // {topic.learningModel.toUpperCase().replace("_", " ")}
                    </span>
                    <span className="text-xs font-mono text-slate-500 group-hover:text-slate-900 group-hover:translate-x-1 transition-all font-semibold">
                      ENTER LAB →
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {topic.name}
                  </h3>

                  <p className="mt-1 text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
                    {topic.areaName}
                  </p>

                  <p className="mt-4 text-xs text-slate-600 leading-relaxed font-normal">
                    {topic.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span className="font-medium">{topic.objects[0]?.components?.length || 4} EXPLORABLE PARTS</span>
                  <span className="text-slate-900 group-hover:text-sky-600 font-bold">LAUNCH LAB →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-slate-200">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="text-3xl font-semibold text-slate-900 mt-1">Built for Gamified Spatial Understanding</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
            <span className="text-xs font-mono text-sky-600 font-bold">[01] MECHANICAL</span>
            <h4 className="text-lg font-bold text-slate-900">Spatial Deconstruction</h4>
            <p className="text-xs text-slate-600 font-normal leading-relaxed">
              Explode complex 4-stroke machinery, isolate pistons and valves, and reassemble part by part with interactive snapping.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
            <span className="text-xs font-mono text-amber-600 font-bold">[02] ELECTRICAL</span>
            <h4 className="text-lg font-bold text-slate-900">Live Ohm&apos;s Law Lab</h4>
            <p className="text-xs text-slate-600 font-normal leading-relaxed">
              Dynamically manipulate voltage and resistance in 3D to observe electron velocity and thermal radiation.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
            <span className="text-xs font-mono text-emerald-600 font-bold">[03] COMPUTING</span>
            <h4 className="text-lg font-bold text-slate-900">Hardware POST Assembly</h4>
            <p className="text-xs text-slate-600 font-normal leading-relaxed">
              Connect CPUs, DDR5 RAM sticks, and NVMe drives to execute real-time power-on self tests.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
            <span className="text-xs font-mono text-purple-600 font-bold">[04] NEUROSCIENCE</span>
            <h4 className="text-lg font-bold text-slate-900">Synaptic Puzzle Game</h4>
            <p className="text-xs text-slate-600 font-normal leading-relaxed">
              Simulate Cortisol stress hijacks, Dopamine burnout, and wire signal paths to achieve 100% Synaptic Sync.
            </p>
          </div>
        </div>
      </section>

      {/* Minimal Light Footer */}
      <footer className="relative z-10 border-t border-slate-200 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-4">
          <span>EXPANDABLISM // EXPLORABLE SPATIAL LABORATORY</span>
          <span>NCASE.ME GAMIFIED LEARNING ARCHITECTURE</span>
        </div>
      </footer>
    </main>
  );
}