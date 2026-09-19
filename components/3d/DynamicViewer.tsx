"use client";

import dynamic from "next/dynamic";

const MotorcycleViewerWrapper = dynamic(
  () => import("./MotorcycleViewerWrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] bg-slate-950 border border-slate-800/80 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 select-none">
        <div className="relative w-14 h-14 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
        </div>
        <div className="font-mono text-xs text-blue-400 tracking-widest uppercase mb-1">
          EXPANDABLISM // 3D LAB
        </div>
        <div className="text-xs text-slate-500">Initializing WebGL 3D Renderer...</div>
      </div>
    ),
  }
);

interface DynamicViewerProps {
  modelPath: string;
  minDistance?: number;
  maxDistance?: number;
  initialCameraPosition?: [number, number, number];
}

export function DynamicViewer(props: DynamicViewerProps) {
  return <MotorcycleViewerWrapper {...props} />;
}
