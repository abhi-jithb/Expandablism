"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AREAS_DATA } from "@/data/content";

export default function Home() {
  // Flatten all topics across areas for direct 1-click subject access
  const allTopicCards = Object.values(AREAS_DATA).flatMap((area) =>
    area.topics.map((topic) => ({
      areaId: area.id,
      areaName: area.name,
      ...topic,
    }))
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black font-sans">
      {/* Hero section */}
      <div className="relative border-b border-zinc-900 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              EXPANDABLISM // SPATIAL LABORATORY
            </div>
            
            <h1 className="text-4xl sm:text-7xl font-light tracking-tight text-white leading-[1.05]">
              Don&apos;t just read knowledge. <br />
              <span className="text-zinc-400">Physically experience it.</span>
            </h1>
            
            <p className="mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed font-light max-w-2xl">
              Pick real-world hardware parts out of your interactive digital Toolbox. Explore, simulate, and reconstruct complex physical mechanisms down to fundamental concepts.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-xs text-zinc-500">
              <span className="text-zinc-300">EXPLORE</span>
              <span>→</span>
              <span className="text-zinc-300">INTERACT</span>
              <span>→</span>
              <span className="text-zinc-300">EXPERIMENT</span>
              <span>→</span>
              <span className="text-zinc-300">RECONSTRUCT</span>
              <span>→</span>
              <span className="text-white font-bold">MASTER</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Interactive Subject Worlds Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8 border-b border-zinc-900 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              PHYSICAL KNOWLEDGE WORLDS
            </span>
            <h2 className="text-2xl font-light text-white mt-1">Select a Subject Laboratory</h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            <span className="text-white font-bold">{allTopicCards.length}</span> LABS ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allTopicCards.map((topic, idx) => (
            <motion.div
              key={`${topic.areaId}-${topic.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link
                href={`/areas/${topic.areaId}/${topic.id}`}
                className="group relative rounded-2xl border border-zinc-900 bg-[#09090b] p-7 transition-all duration-300 hover:border-zinc-700 hover:bg-[#121215] flex flex-col justify-between block h-full shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">
                      MODEL // {topic.learningModel.toUpperCase().replace("_", " ")}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all">
                      ENTER LAB →
                    </span>
                  </div>

                  <h3 className="text-2xl font-light text-white group-hover:text-white transition-colors">
                    {topic.name}
                  </h3>

                  <p className="mt-[2px] text-xs font-mono text-sky-400">
                    {topic.areaName}
                  </p>
                  
                  <p className="mt-3 text-xs text-zinc-400 leading-relaxed font-light">
                    {topic.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-900 flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-500 gap-2">
                  <span>{topic.objects[0]?.components.length || 5} PARTS IN TOOLBOX</span>
                  <span className="text-zinc-300 group-hover:text-white font-semibold">START EXPERIENCE</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}