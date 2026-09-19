"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { MotorcycleCanvas } from "./MotorcycleCanvas";

interface ErrorBoundaryProps {
  children: ReactNode;
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
        <div className="absolute inset-0 bg-[#070709] flex flex-col items-center justify-center p-6 text-center text-slate-400">
          <div className="text-sm font-light text-slate-300 mb-2">
            Unable to render 3D deconstruction stage
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-xs font-mono text-slate-500 hover:text-white underline transition"
          >
            Reload stage
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

interface MotorcycleViewerWrapperProps {
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

export default function MotorcycleViewerWrapper(props: MotorcycleViewerWrapperProps) {
  return (
    <ErrorBoundary>
      <MotorcycleCanvas {...props} />
    </ErrorBoundary>
  );
}
