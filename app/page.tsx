"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AREAS_DATA } from "@/data/content";

export default function Home() {
  const areasList = Object.values(AREAS_DATA);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
      {/* Hero section */}
      <div className="relative border-b border-zinc-900 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-8">
              EXPANDABLISM // KNOWLEDGE ENGINE
            </div>
            
            <h1 className="text-4xl sm:text-7xl font-light tracking-tight text-white leading-[1.05]">
              Physical exploration for abstract knowledge.
            </h1>
            
            <p className="mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed font-light max-w-2xl">
              Don't just read about complex systems. Explore, deconstruct, and master 3D mechanisms down to fundamental concepts.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-500">
              <span className="text-zinc-300">EXPLORE</span>
              <span>→</span>
              <span className="text-zinc-300">UNDERSTAND</span>
              <span>→</span>
              <span className="text-zinc-300">DECONSTRUCT</span>
              <span>→</span>
              <span className="text-white font-bold">MASTER</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Areas grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-10 border-b border-zinc-900 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              KNOWLEDGE DOMAINS
            </span>
            <h2 className="text-2xl font-light text-white mt-1">Select an Area</h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">1 DOMAIN ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areasList.map((area, idx) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link
                href={`/areas/${area.id}`}
                className="group relative rounded-2xl border border-zinc-900 bg-[#09090b] p-8 transition-all duration-300 hover:border-zinc-700 hover:bg-[#121215] flex flex-col justify-between block h-full shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                      AREA // {area.id.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all">
                      →
                    </span>
                  </div>

                  <h3 className="text-3xl font-light text-white group-hover:text-white transition-colors">
                    {area.name}
                  </h3>
                  
                  <p className="mt-3 text-sm text-zinc-400 leading-relaxed font-light">
                    {area.description}
                  </p>
                </div>

                <div className="mt-10 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span>{area.topics.length} TOPIC AVAILABLE</span>
                  <span className="text-zinc-300 group-hover:text-white">OPEN DOMAIN</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}