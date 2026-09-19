"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { MotorcycleCanvas } from "./MotorcycleCanvas";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("3D Viewer Error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-[450px] bg-slate-950 border border-red-900/40 rounded-xl flex flex-col items-center justify-center p-6 text-center text-slate-300 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center mb-4 text-red-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-100 mb-1">Failed to render 3D Object</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            {this.state.error?.message || "An error occurred while loading the 3D canvas engine."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-blue-400 rounded-md border border-slate-700 transition"
          >
            Retry Renderer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function ViewerLoadingSkeleton() {
  return (
    <div className="w-full h-[450px] bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 select-none">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-cyan-500/10 border-b-cyan-400 animate-spin animate-reverse" />
      </div>
      <div className="font-mono text-xs text-blue-400 tracking-widest uppercase mb-1">
        EXPANDABLISM // 3D LAB
      </div>
      <div className="text-xs text-slate-500">Streaming GLB Mesh Geometry...</div>
    </div>
  );
}

interface MotorcycleViewerWrapperProps {
  modelPath: string;
  minDistance?: number;
  maxDistance?: number;
  initialCameraPosition?: [number, number, number];
}

export default function MotorcycleViewerWrapper(props: MotorcycleViewerWrapperProps) {
  return (
    <ErrorBoundary>
      <React.Suspense fallback={<ViewerLoadingSkeleton />}>
        <MotorcycleCanvas {...props} />
      </React.Suspense>
    </ErrorBoundary>
  );
}
