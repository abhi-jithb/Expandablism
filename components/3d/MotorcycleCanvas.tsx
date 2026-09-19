"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { MotorcycleModel } from "./MotorcycleModel";
import { MOTORCYCLE_COMPONENTS } from "@/data/deconstructionConfig";
import { FourStrokeStep } from "@/data/learningContent";

interface CameraFocusControllerProps {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  selectedComponentId: string | null;
  activeLearningComponentId?: string | null;
  isExploded: boolean;
  isRebuildMode?: boolean;
}

function CameraFocusController({
  controlsRef,
  selectedComponentId,
  activeLearningComponentId,
  isExploded,
  isRebuildMode,
}: CameraFocusControllerProps) {
  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    const lerpFactor = Math.min(delta * 4.0, 0.15);
    const targetVector = new THREE.Vector3(0, 0, 0);

    const activeId = activeLearningComponentId || selectedComponentId;

    if (isRebuildMode) {
      targetVector.set(0, 0, 0);
    } else if (isExploded && activeId) {
      const comp = MOTORCYCLE_COMPONENTS.find((c) => c.id === activeId);
      if (comp) {
        const [ex, ey, ez] = comp.explodedPosition;
        targetVector.set(ex * 0.45, ey * 0.45, ez * 0.45);
      }
    }

    controlsRef.current.target.lerp(targetVector, lerpFactor);
    controlsRef.current.update();
  });

  return null;
}

interface MotorcycleCanvasProps {
  modelPath: string;
  minDistance?: number;
  maxDistance?: number;
  initialCameraPosition?: [number, number, number];
  isExploded: boolean;
  isRebuildMode?: boolean;
  assembledComponentIds?: Set<string>;
  selectedComponentId: string | null;
  hoveredComponentId: string | null;
  activeLearningComponentId?: string | null;
  currentStroke?: FourStrokeStep;
  onSelectComponent: (id: string | null) => void;
  onHoverComponent: (id: string | null) => void;
  onExploreComponent?: (id: string) => void;
  onSnapSuccess?: (id: string) => void;
  onSnapFail?: (id: string) => void;
  onUserInteraction?: () => void;
}

function LoadingFallback() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 0.5, 1.8]} />
      <meshStandardMaterial color="#1e293b" wireframe />
    </mesh>
  );
}

export function MotorcycleCanvas({
  modelPath,
  minDistance = 1.8,
  maxDistance = 6.5,
  initialCameraPosition = [2.6, 1.2, 2.6],
  isExploded,
  isRebuildMode = false,
  assembledComponentIds,
  selectedComponentId,
  hoveredComponentId,
  activeLearningComponentId,
  currentStroke,
  onSelectComponent,
  onHoverComponent,
  onExploreComponent,
  onSnapSuccess,
  onSnapFail,
  onUserInteraction,
}: MotorcycleCanvasProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartInteraction = () => {
    setIsAutoRotating(false);
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    if (onUserInteraction) {
      onUserInteraction();
    }
  };

  const handleEndInteraction = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      setIsAutoRotating(true);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none touch-none bg-[#070709]">
      {/* Subtle radial studio floor spotlight effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40" 
        style={{
          background: "radial-gradient(circle at 50% 60%, rgba(56, 189, 248, 0.08) 0%, rgba(15, 23, 42, 0) 65%)"
        }} 
      />

      <Canvas
        camera={{ position: initialCameraPosition, fov: 42 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        className="w-full h-full"
      >
        <color attach="background" args={["#070709"]} />

        {/* Studio Lighting Setup for Premium Presentation */}
        <ambientLight intensity={0.7} />
        
        {/* Main Key Light */}
        <directionalLight
          position={[5, 7, 4]}
          intensity={1.6}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Soft Cool Fill Light */}
        <directionalLight position={[-5, 3, -3]} intensity={0.7} color="#94a3b8" />

        {/* Warm Back/Rim Highlight */}
        <pointLight position={[0, 4.5, -4]} intensity={1.2} color="#f8fafc" />

        {/* Realistic Floor Contact Shadow */}
        <ContactShadows
          position={[0, -0.82, 0]}
          opacity={isExploded || isRebuildMode ? 0.45 : 0.65}
          scale={14}
          blur={2.5}
          far={4}
          color="#000000"
        />

        {/* 3D Motorcycle Geometry */}
        <Suspense fallback={<LoadingFallback />}>
          <MotorcycleModel
            modelPath={modelPath}
            scaleFactor={4.2}
            isExploded={isExploded}
            isRebuildMode={isRebuildMode}
            assembledComponentIds={assembledComponentIds}
            selectedComponentId={selectedComponentId}
            hoveredComponentId={hoveredComponentId}
            activeLearningComponentId={activeLearningComponentId}
            currentStroke={currentStroke}
            onSelectComponent={onSelectComponent}
            onHoverComponent={onHoverComponent}
            onExploreComponent={onExploreComponent}
            onSnapSuccess={onSnapSuccess}
            onSnapFail={onSnapFail}
          />
        </Suspense>

        <CameraFocusController
          controlsRef={controlsRef}
          selectedComponentId={selectedComponentId}
          activeLearningComponentId={activeLearningComponentId}
          isExploded={isExploded}
          isRebuildMode={isRebuildMode}
        />

        {/* Orbit Controls with auto-pause and resume */}
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          autoRotate={isAutoRotating && !selectedComponentId && !activeLearningComponentId && !isRebuildMode}
          autoRotateSpeed={0.7}
          rotateSpeed={0.6}
          zoomSpeed={0.75}
          minDistance={activeLearningComponentId ? 1.2 : minDistance}
          maxDistance={maxDistance}
          maxPolarAngle={Math.PI / 2 + 0.02}
          minPolarAngle={Math.PI / 6}
          onStart={handleStartInteraction}
          onEnd={handleEndInteraction}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
