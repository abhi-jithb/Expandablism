"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import * as THREE from "three";

interface CircuitCanvas3DProps {
  voltage: number;
  resistance: number;
  isSwitchClosed: boolean;
  current: number;
  power: number;
  isOverheated: boolean;
  selectedComponent: string | null;
  onSelectComponent: (id: string | null) => void;
}

// 3D Electron Flow Particles along the loop
function ElectronParticles({ current, isClosed }: { current: number; isClosed: boolean }) {
  const particlesRef = useRef<THREE.Group>(null);

  // Closed rectangular loop points
  const points: [number, number, number][] = [
    [-2.2, 0.4, 0],
    [-2.2, 0.4, -1.8],
    [2.2, 0.4, -1.8],
    [2.2, 0.4, 0],
    [2.2, 0.4, 1.8],
    [-2.2, 0.4, 1.8],
    [-2.2, 0.4, 0],
  ];

  const particleCount = 24;
  const positionsRef = useRef<number[]>(
    Array.from({ length: particleCount }, (_, i) => i / particleCount)
  );

  useFrame((_, delta) => {
    if (!isClosed || current <= 0 || !particlesRef.current) return;

    // Movement speed proportional to current
    const speed = Math.min(0.5, current * 0.12);
    positionsRef.current = positionsRef.current.map((p) => (p + delta * speed) % 1);

    particlesRef.current.children.forEach((child, index) => {
      const progress = positionsRef.current[index];
      // Interpolate along rectangular wire path
      const totalSegments = points.length - 1;
      const scaledProgress = progress * totalSegments;
      const segmentIndex = Math.floor(scaledProgress);
      const segmentT = scaledProgress - segmentIndex;

      const p1 = points[segmentIndex];
      const p2 = points[(segmentIndex + 1) % points.length];

      child.position.set(
        p1[0] + (p2[0] - p1[0]) * segmentT,
        p1[1] + (p2[1] - p1[1]) * segmentT,
        p1[2] + (p2[2] - p1[2]) * segmentT
      );
    });
  });

  if (!isClosed) return null;

  return (
    <group ref={particlesRef}>
      {Array.from({ length: particleCount }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

export function CircuitCanvas3D({
  voltage,
  resistance,
  isSwitchClosed,
  current,
  power,
  isOverheated,
  selectedComponent,
  onSelectComponent,
}: CircuitCanvas3DProps) {
  // Bulb filament glow intensity calculated from power dissipation P = I^2 * R
  const normalizedPower = Math.min(1.0, power / 40.0);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 4.5, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "#f8fafc" }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} />
        <pointLight
          position={[2.2, 0.8, 0]}
          intensity={isSwitchClosed ? normalizedPower * 5 : 0}
          color={isOverheated ? "#ff3333" : "#ffcc66"}
          distance={8}
        />

        {/* Studio Floor Grid */}
        <gridHelper args={[20, 20, "#cbd5e1", "#e2e8f0"]} position={[0, -0.01, 0]} />

        {/* 1. BATTERY MODULE (Left) */}
        <group
          position={[-2.2, 0.4, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectComponent("battery");
          }}
        >
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[0.8, 0.8, 1.2]} />
            <meshStandardMaterial
              color={selectedComponent === "battery" ? "#38bdf8" : "#1e293b"}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>

          {/* Terminals */}
          <mesh position={[0, 0.45, -0.3]}>
            <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          <mesh position={[0, 0.45, 0.3]}>
            <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>

          {/* Spatial Anchor Label */}
          <Html position={[0, 0.9, 0]} center distanceFactor={8}>
            <div
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border shadow-md ${
                selectedComponent === "battery"
                  ? "bg-slate-900 text-white font-bold border-slate-900"
                  : "bg-white/95 text-slate-800 border-slate-300"
              }`}
            >
              <span>Battery: </span>
              <span className="font-bold text-sky-600">{voltage}V</span>
            </div>
          </Html>
        </group>

        {/* 2. MECHANICAL SWITCH (Back Wire Path) */}
        <group
          position={[-0.8, 0.4, -1.8]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectComponent("switch");
          }}
        >
          {/* Switch Base */}
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[1.2, 0.15, 0.5]} />
            <meshStandardMaterial color="#334155" />
          </mesh>

          {/* Switch Contacts */}
          <mesh position={[-0.4, 0.1, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} />
          </mesh>
          <mesh position={[0.4, 0.1, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} />
          </mesh>

          {/* Knife Arm (Rotates based on switch state) */}
          <group
            position={[-0.4, 0.15, 0]}
            rotation={[0, 0, isSwitchClosed ? 0 : -Math.PI / 4]}
          >
            <mesh position={[0.4, 0, 0]}>
              <boxGeometry args={[0.8, 0.06, 0.08]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>

          {/* Spatial Anchor Label */}
          <Html position={[0, 0.7, 0]} center distanceFactor={8}>
            <div
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border shadow-md ${
                selectedComponent === "switch"
                  ? "bg-slate-900 text-white font-bold border-slate-900"
                  : "bg-white/95 text-slate-800 border-slate-300"
              }`}
            >
              <span>Switch: </span>
              <span className={isSwitchClosed ? "text-emerald-600 font-bold" : "text-rose-600"}>
                {isSwitchClosed ? "CLOSED (ON)" : "OPEN (OFF)"}
              </span>
            </div>
          </Html>
        </group>

        {/* 3. VARIABLE RESISTOR (Top Right Path) */}
        <group
          position={[0.8, 0.4, -1.8]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectComponent("resistor");
          }}
        >
          {/* Ceramic Body */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 1.0, 16]} />
            <meshStandardMaterial
              color={selectedComponent === "resistor" ? "#bae6fd" : "#475569"}
              roughness={0.4}
            />
          </mesh>

          {/* Heat Fins */}
          {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.27, 0.03, 8, 24]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
          ))}

          {/* Spatial Anchor Label */}
          <Html position={[0, 0.7, 0]} center distanceFactor={8}>
            <div
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border shadow-md ${
                selectedComponent === "resistor"
                  ? "bg-slate-900 text-white font-bold border-slate-900"
                  : "bg-white/95 text-slate-800 border-slate-300"
              }`}
            >
              <span>Resistor: </span>
              <span className="font-bold text-amber-600">{resistance}Ω</span>
            </div>
          </Html>
        </group>

        {/* 4. INCANDESCENT LAMP (Right Side) */}
        <group
          position={[2.2, 0.4, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectComponent("bulb");
          }}
        >
          {/* Socket Base */}
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.35, 0.4, 0.3, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>

          {/* Glass Outer Shell */}
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.4, 24, 24]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={0.9}
              opacity={0.9}
              transparent
              roughness={0.1}
              ior={1.5}
            />
          </mesh>

          {/* Filament Coils (Glowing based on Power) */}
          <mesh position={[0, 0.25, 0]}>
            <torusGeometry args={[0.1, 0.02, 8, 16]} />
            <meshBasicMaterial
              color={
                isSwitchClosed && power > 0
                  ? isOverheated
                    ? "#ff2200"
                    : "#ffaa33"
                  : "#475569"
              }
            />
          </mesh>

          {/* Spatial Anchor Label */}
          <Html position={[0, 1.0, 0]} center distanceFactor={8}>
            <div
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border shadow-md ${
                selectedComponent === "bulb"
                  ? "bg-slate-900 text-white font-bold border-slate-900"
                  : "bg-white/95 text-slate-800 border-slate-300"
              }`}
            >
              <span>Bulb Power: </span>
              <span className="font-bold text-emerald-600">
                {isSwitchClosed ? power.toFixed(1) : "0.0"}W
              </span>
            </div>
          </Html>
        </group>

        {/* 5. CONNECTING COPPER WIRES */}
        <group>
          {/* Wire 1: Battery (+) to Switch */}
          <Line
            points={[
              [-2.2, 0.4, -0.3],
              [-2.2, 0.4, -1.8],
              [-1.4, 0.4, -1.8],
            ]}
            color={isSwitchClosed ? "#38bdf8" : "#475569"}
            lineWidth={3}
          />
          {/* Wire 2: Switch to Resistor */}
          <Line
            points={[
              [-0.2, 0.4, -1.8],
              [0.3, 0.4, -1.8],
            ]}
            color={isSwitchClosed ? "#38bdf8" : "#475569"}
            lineWidth={3}
          />
          {/* Wire 3: Resistor to Bulb */}
          <Line
            points={[
              [1.3, 0.4, -1.8],
              [2.2, 0.4, -1.8],
              [2.2, 0.4, -0.3],
            ]}
            color={isSwitchClosed ? "#38bdf8" : "#475569"}
            lineWidth={3}
          />
          {/* Wire 4: Bulb to Battery (-) Return Path */}
          <Line
            points={[
              [2.2, 0.4, 0.3],
              [2.2, 0.4, 1.8],
              [-2.2, 0.4, 1.8],
              [-2.2, 0.4, 0.3],
            ]}
            color={isSwitchClosed ? "#38bdf8" : "#475569"}
            lineWidth={3}
          />
        </group>

        {/* Animated Electron Particle Flow */}
        <ElectronParticles current={current} isClosed={isSwitchClosed} />

        <OrbitControls
          enablePan={false}
          minDistance={3.0}
          maxDistance={10.0}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />
      </Canvas>
    </div>
  );
}
