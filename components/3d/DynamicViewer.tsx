"use client";

import dynamic from "next/dynamic";

const MotorcycleViewerWrapper = dynamic(
  () => import("./MotorcycleViewerWrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[#070709] flex flex-col items-center justify-center text-slate-500 font-mono text-xs tracking-widest uppercase transition-opacity duration-500">
        <div className="w-6 h-6 border border-slate-700 border-t-white rounded-full animate-spin mb-3" />
        <span>Loading Deconstruction Engine</span>
      </div>
    ),
  }
);

interface DynamicViewerProps {
  modelPath: string;
  minDistance?: number;
  maxDistance?: number;
  initialCameraPosition?: [number, number, number];
  isExploded: boolean;
  selectedComponentId: string | null;
  hoveredComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onHoverComponent: (id: string | null) => void;
  onExploreComponent?: (id: string) => void;
  onUserInteraction?: () => void;
}

export function DynamicViewer(props: DynamicViewerProps) {
  return <MotorcycleViewerWrapper {...props} />;
}
