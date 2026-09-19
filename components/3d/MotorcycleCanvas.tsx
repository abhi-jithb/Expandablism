"use client";

import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Float } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { MotorcycleModel } from "./MotorcycleModel";

interface MotorcycleCanvasProps {
  modelPath: string;
  minDistance?: number;
  maxDistance?: number;
  initialCameraPosition?: [number, number, number];
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshBasicMaterial color="#3b82f6" wireframe />
    </mesh>
  );
}

export function MotorcycleCanvas({
  modelPath,
  minDistance = 2.0,
  maxDistance = 8.0,
  initialCameraPosition = [3.5, 1.8, 3.5],
}: MotorcycleCanvasProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <div className="relative w-full h-full min-h-[450px] bg-slate-950 overflow-hidden select-none touch-none rounded-xl border border-slate-800/80 shadow-2xl">
      {/* Background ambient gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Grid line overlay texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} 
      />

      <Canvas
        camera={{ position: initialCameraPosition, fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        className="w-full h-full"
      >
        <color attach="background" args={["#030712"]} />

        {/* Studio Lighting Setup */}
        <ambientLight intensity={0.6} />
        
        {/* Key Light */}
        <directionalLight
          position={[6, 8, 5]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={15}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
        />

        {/* Fill Light (Cool cyan accent) */}
        <directionalLight position={[-6, 4, -4]} intensity={0.9} color="#60a5fa" />

        {/* Rim Light (High-tech highlight) */}
        <pointLight position={[0, 6, -6]} intensity={1.4} color="#38bdf8" />

        {/* Ground Soft Contact Shadow */}
        <ContactShadows
          position={[0, -0.6, 0]}
          opacity={0.7}
          scale={10}
          blur={1.8}
          far={4}
          color="#000000"
        />

        {/* Floating subtle animation frame */}
        <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.1}>
          <Suspense fallback={<Loader />}>
            <MotorcycleModel modelPath={modelPath} />
          </Suspense>
        </Float>

        {/* Interactive Camera & Auto Rotation Controls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.8}
          rotateSpeed={0.6}
          zoomSpeed={0.8}
          minDistance={minDistance}
          maxDistance={maxDistance}
          maxPolarAngle={Math.PI / 2 + 0.05}
          minPolarAngle={Math.PI / 6}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
