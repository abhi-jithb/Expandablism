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
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans relative overflow-hidden">
      {/* Background Dot-Grid Accent */}
      <div className="absolute inset-0 bg-dot-grid opacity-35 pointer-events-none z-0"></div>

      {/* Top Header Navigation */}
      <header className="relative z-10 border-b border-zinc-900 bg-black/90 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-white uppercase">
              EXPANDABLISM
            </span>
            <span className="text-[10px] font-mono text-zinc-500 border-l border-zinc-800 pl-3 hidden sm:inline-block">
              SPATIAL KNOWLEDGE LABORATORY v2.0
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
            <span className="hidden md:inline-block text-zinc-500">SYSTEM READY</span>
            <a
              href="#subject-labs"
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-white hover:text-black transition-all border border-zinc-800 text-zinc-200 font-medium"
            >
              ENTER LABS ↓
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-zinc-900">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            INTERACTIVE 3D SPATIAL KNOWLEDGE
          </div>

          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[0.98]">
            Don&apos;t just read theory. <br />
            <span className="font-normal text-zinc-400">Physically experience it.</span>
          </h1>

          <p className="mt-8 text-base sm:text-xl text-zinc-400 font-light leading-relaxed max-w-2xl">
            Extract mechanical parts out of spatial toolboxes, simulate bio-electric brain reactions, tune voltage loops, and solve interactive end-of-topic puzzles.
          </p>

          {/* Workflow Sequence */}
          <div className="mt-10 flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-500">
            <span className="px-2 py-1 bg-zinc-900/80 border border-zinc-800 rounded text-zinc-300">1. DECONSTRUCT</span>
            <span>→</span>
            <span className="px-2 py-1 bg-zinc-900/80 border border-zinc-800 rounded text-zinc-300">2. SIMULATE</span>
            <span>→</span>
            <span className="px-2 py-1 bg-zinc-900/80 border border-zinc-800 rounded text-zinc-300">3. ALIGN PUZZLE</span>
            <span>→</span>
            <span className="px-2 py-1 bg-white text-black font-bold rounded">4. MASTER</span>
          </div>
        </motion.div>

        {/* Crisp Metrics Banner */}
        <div className="mt-16 pt-8 border-t border-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono">
          <div>
            <span className="text-2xl sm:text-4xl font-light text-white">{allTopicCards.length}</span>
            <span className="text-[11px] text-zinc-500 uppercase tracking-widest block mt-1">ACTIVE LABS</span>
          </div>
          <div>
            <span className="text-2xl sm:text-4xl font-light text-white">4</span>
            <span className="text-[11px] text-zinc-500 uppercase tracking-widest block mt-1">KNOWLEDGE DOMAINS</span>
          </div>
          <div>
            <span className="text-2xl sm:text-4xl font-light text-white">100%</span>
            <span className="text-[11px] text-zinc-500 uppercase tracking-widest block mt-1">INTERACTIVE 3D</span>
          </div>
          <div>
            <span className="text-2xl sm:text-4xl font-light text-white">0</span>
            <span className="text-[11px] text-zinc-500 uppercase tracking-widest block mt-1">PASSIVE LECTURES</span>
          </div>
        </div>
      </section>

      {/* Subject World Selection Grid */}
      <section id="subject-labs" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-zinc-900 gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              EXPLORATION CATALOG
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-white mt-1">Select a Knowledge Laboratory</h2>
          </div>

          {/* Area Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setSelectedAreaFilter("all")}
              className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                selectedAreaFilter === "all"
                  ? "bg-white text-black border-white font-bold"
                  : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white"
              }`}
            >
              ALL LABS ({allTopicCards.length})
            </button>
            {areasList.map((area) => (
              <button
                key={area.id}
                onClick={() => setSelectedAreaFilter(area.id)}
                className={`px-3 py-1.5 rounded-lg border transition cursor-pointer uppercase ${
                  selectedAreaFilter === area.id
                    ? "bg-white text-black border-white font-bold"
                    : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white"
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
                className="group relative rounded-2xl border border-zinc-800/80 bg-[#09090b] p-7 transition-all duration-300 hover:border-white hover:bg-[#111114] flex flex-col justify-between block h-full shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-zinc-900/90 px-2.5 py-1 rounded border border-zinc-800">
                      MODEL // {topic.learningModel.toUpperCase().replace("_", " ")}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all">
                      ENTER LAB →
                    </span>
                  </div>

                  <h3 className="text-2xl font-light text-white group-hover:text-white transition-colors">
                    {topic.name}
                  </h3>

                  <p className="mt-1 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    {topic.areaName}
                  </p>

                  <p className="mt-4 text-xs text-zinc-400 leading-relaxed font-light">
                    {topic.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>{topic.objects[0]?.components?.length || 4} EXPLORABLE PARTS</span>
                  <span className="text-zinc-200 group-hover:text-white font-semibold">LAUNCH LAB →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="text-3xl font-light text-white mt-1">Built for Spatial Understanding</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-zinc-900 bg-[#08080a] space-y-3">
            <span className="text-xs font-mono text-zinc-500">[01] MECHANICAL</span>
            <h4 className="text-lg font-light text-white">Spatial Deconstruction</h4>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Explode complex 4-stroke machinery, isolate pistons and intake valves, and reassemble part by part.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-900 bg-[#08080a] space-y-3">
            <span className="text-xs font-mono text-zinc-500">[02] ELECTRICAL</span>
            <h4 className="text-lg font-light text-white">Live Ohm&apos;s Law Lab</h4>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Dynamically manipulate voltage and resistance in 3D to observe electron velocity and thermal radiation.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-900 bg-[#08080a] space-y-3">
            <span className="text-xs font-mono text-zinc-500">[03] COMPUTING</span>
            <h4 className="text-lg font-light text-white">Hardware POST Assembly</h4>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Connect CPUs, DDR5 RAM sticks, and NVMe drives to execute real-time power-on self tests.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-900 bg-[#08080a] space-y-3">
            <span className="text-xs font-mono text-zinc-500">[04] NEUROSCIENCE</span>
            <h4 className="text-lg font-light text-white">Synaptic Puzzle Game</h4>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Simulate Cortisol stress hijacks, Dopamine burnout, and wire signal paths to solve 100% Synaptic Sync.
            </p>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-zinc-900 py-8 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-4">
          <span>EXPANDABLISM // SPATIAL LABORATORY</span>
          <span>BLACK & WHITE ULTRA-CLEAN DESIGN</span>
        </div>
      </footer>
    </main>
  );
}