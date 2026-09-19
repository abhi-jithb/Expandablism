import React from "react";
import Link from "next/link";
import { getTopic } from "@/data/content";
import { DynamicViewer } from "@/components/3d/DynamicViewer";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ area: string; topic: string }>;
}) {
  const { area, topic } = await params;
  const topicData = getTopic(area, topic);

  if (!topicData || topicData.objects.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-200 px-6 py-12 flex flex-col items-center justify-center">
        <div className="max-w-md text-center">
          <Link
            href={`/areas/${area}`}
            className="text-xs font-mono text-blue-400 hover:text-blue-300 transition tracking-wider uppercase mb-6 inline-block"
          >
            ← Back to {area}
          </Link>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight mb-3">Topic Not Found</h1>
          <p className="text-slate-400 text-sm">
            The requested exploration topic is either under construction or unavailable.
          </p>
        </div>
      </main>
    );
  }

  const explorableObject = topicData.objects[0];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Header Chrome */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href={`/areas/${area}`}
              className="text-slate-400 hover:text-slate-200 text-xs font-mono transition"
            >
              {area.toUpperCase()}
            </Link>
            <span className="text-slate-600 font-mono text-xs">/</span>
            <span className="text-blue-400 font-mono text-xs tracking-wide">
              {topicData.name.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
              3D Interactive Model Ready
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Top Info Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <span className="inline-block text-[10px] font-mono text-blue-400 uppercase tracking-widest px-2.5 py-1 rounded bg-blue-950/60 border border-blue-800/40 mb-3">
                Explorable Object // {explorableObject.id}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
                {explorableObject.name}
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-400">
                {explorableObject.subtitle}
              </p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-slate-800 pl-4 py-1">
              {explorableObject.description}
            </p>

            {/* Sub-component quick index list */}
            <div className="pt-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">
                Key Components ({explorableObject.components.length})
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {explorableObject.components.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between"
                  >
                    <span className="truncate">{comp.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 flex-shrink-0 ml-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Interaction Hint Panel */}
            <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-800/60 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Interaction Controls
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">Drag</span>
                  <span>Rotate camera</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">Scroll</span>
                  <span>Zoom in / out</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">Touch</span>
                  <span>Pinch & Orbit</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">Auto</span>
                  <span>Idle rotation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right / Hero 3D Viewport Canvas */}
          <div className="lg:col-span-8 w-full h-[540px] sm:h-[620px] relative">
            <DynamicViewer
              modelPath={explorableObject.modelPath}
              initialCameraPosition={explorableObject.initialCameraPosition}
              minDistance={explorableObject.minDistance}
              maxDistance={explorableObject.maxDistance}
            />
          </div>

        </div>
      </div>
    </main>
  );
}