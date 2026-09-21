"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

interface ComputerCanvas3DProps {
  installedComponentIds: Set<string>;
  selectedComponentId: string | null;
  isPoweredOn: boolean;
  onSelectComponent: (id: string | null) => void;
}

// Animated Spinning Cooling Fan
function SpinningFan({ isPoweredOn, position, scale = 1 }: { isPoweredOn: boolean; position: [number, number, number]; scale?: number }) {
  const fanRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (isPoweredOn && fanRef.current) {
      fanRef.current.rotation.y += delta * 15;
    }
  });

  return (
    <group ref={fanRef} position={position} scale={scale}>
      <mesh>
        <cylinderGeometry args={[0.25, 0.25, 0.05, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} rotation={[0, (i * Math.PI * 2) / 7, 0.2]}>
          <boxGeometry args={[0.22, 0.02, 0.06]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      ))}
    </group>
  );
}

export function ComputerCanvas3D({
  installedComponentIds,
  selectedComponentId,
  isPoweredOn,
  onSelectComponent,
}: ComputerCanvas3DProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 5.5, 6.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "#f8fafc" }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 10, 6]} intensity={1.5} />
        <pointLight
          position={[0, 3, 0]}
          intensity={isPoweredOn ? 4.5 : 0}
          color="#0284c7"
          distance={10}
        />

        {/* Studio Floor Grid */}
        <gridHelper args={[20, 20, "#cbd5e1", "#e2e8f0"]} position={[0, -0.01, 0]} />

        {/* MOTHERBOARD MAIN PCB BASE */}
        <group position={[0, 0.1, 0]}>
          {/* Main PCB Board - Sapphire / Emerald Vibrant PCB */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[3.2, 0.1, 2.8]} />
            <meshStandardMaterial
              color={selectedComponentId === "motherboard" ? "#0284c7" : "#0369a1"}
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>

          {/* Gold Trace Accents */}
          <mesh position={[0, 0.055, 0]}>
            <boxGeometry args={[3.0, 0.001, 2.6]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.6} metalness={0.8} />
          </mesh>

          {/* 1. CPU LGA SOCKET (Top Left) */}
          <group position={[-0.7, 0.1, -0.6]}>
            {/* Socket Bracket */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectComponent("cpu");
              }}
            >
              <boxGeometry args={[0.7, 0.08, 0.7]} />
              <meshStandardMaterial
                color={installedComponentIds.has("cpu") ? "#334155" : "#64748b"}
                metalness={0.8}
              />
            </mesh>

            {/* Installed CPU Heatspreader & Cooler */}
            {installedComponentIds.has("cpu") && (
              <group position={[0, 0.15, 0]}>
                <mesh>
                  <boxGeometry args={[0.65, 0.15, 0.65]} />
                  <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.1} />
                </mesh>
                {/* Cooler Heatsink Fins */}
                <mesh position={[0, 0.2, 0]}>
                  <cylinderGeometry args={[0.38, 0.38, 0.25, 24]} />
                  <meshStandardMaterial color="#94a3b8" metalness={0.8} />
                </mesh>
                <SpinningFan isPoweredOn={isPoweredOn} position={[0, 0.35, 0]} scale={1.1} />
              </group>
            )}

            <Html position={[0, 0.8, 0]} center distanceFactor={8}>
              <div
                className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all border shadow-md ${
                  installedComponentIds.has("cpu")
                    ? "bg-emerald-700 text-white font-bold border-emerald-600"
                    : "bg-white/95 text-slate-800 border-slate-300"
                }`}
              >
                <span>LGA Socket: </span>
                <span className="font-bold">{installedComponentIds.has("cpu") ? "CPU INSTALLED" : "EMPTY"}</span>
              </div>
            </Html>
          </group>

          {/* 2. RAM DIMM SLOTS (Top Right) */}
          <group position={[0.7, 0.1, -0.6]}>
            {/* Slot Slots */}
            {[-0.15, 0.15].map((x, i) => (
              <mesh key={i} position={[x, 0, 0]}>
                <boxGeometry args={[0.08, 0.1, 0.9]} />
                <meshStandardMaterial color="#0284c7" />
              </mesh>
            ))}

            {/* Installed RAM Sticks */}
            {installedComponentIds.has("ram") && (
              <group>
                {[-0.15, 0.15].map((x, i) => (
                  <mesh key={i} position={[x, 0.2, 0]}>
                    <boxGeometry args={[0.06, 0.35, 0.85]} />
                    <meshStandardMaterial color="#38bdf8" metalness={0.6} />
                  </mesh>
                ))}
              </group>
            )}

            <Html position={[0, 0.7, 0]} center distanceFactor={8}>
              <div
                className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                  installedComponentIds.has("ram")
                    ? "bg-emerald-950/90 text-emerald-300 border-emerald-800"
                    : "bg-slate-900/90 text-slate-300 border-slate-800"
                }`}
              >
                <span>DDR5 Slots: </span>
                <span className="font-bold">{installedComponentIds.has("ram") ? "RAM CONNECTED" : "EMPTY"}</span>
              </div>
            </Html>
          </group>

          {/* 3. PCIe x16 GPU EXPANSION SLOT (Center) */}
          <group position={[0, 0.1, 0.2]}>
            <mesh>
              <boxGeometry args={[1.6, 0.1, 0.12]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>

            {/* Installed GPU Card */}
            {installedComponentIds.has("gpu") && (
              <group position={[0, 0.3, 0.2]}>
                <mesh>
                  <boxGeometry args={[1.7, 0.45, 0.35]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.8} />
                </mesh>
                <SpinningFan isPoweredOn={isPoweredOn} position={[-0.4, 0, 0.18]} scale={0.7} />
                <SpinningFan isPoweredOn={isPoweredOn} position={[0.4, 0, 0.18]} scale={0.7} />
              </group>
            )}

            <Html position={[0, 0.6, 0]} center distanceFactor={8}>
              <div
                className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                  installedComponentIds.has("gpu")
                    ? "bg-emerald-950/90 text-emerald-300 border-emerald-800"
                    : "bg-slate-900/90 text-slate-300 border-slate-800"
                }`}
              >
                <span>PCIe Slot: </span>
                <span className="font-bold">{installedComponentIds.has("gpu") ? "GPU DOCKED" : "EMPTY"}</span>
              </div>
            </Html>
          </group>

          {/* 4. M.2 NVMe SSD SLOT (Bottom Left) */}
          <group position={[-0.7, 0.1, 0.8]}>
            <mesh>
              <boxGeometry args={[0.6, 0.05, 0.25]} />
              <meshStandardMaterial color="#334155" />
            </mesh>

            {/* Installed M.2 SSD */}
            {installedComponentIds.has("storage") && (
              <mesh position={[0, 0.06, 0]}>
                <boxGeometry args={[0.55, 0.04, 0.22]} />
                <meshStandardMaterial color="#10b981" />
              </mesh>
            )}

            <Html position={[0, 0.5, 0]} center distanceFactor={8}>
              <div
                className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                  installedComponentIds.has("storage")
                    ? "bg-emerald-950/90 text-emerald-300 border-emerald-800"
                    : "bg-slate-900/90 text-slate-300 border-slate-800"
                }`}
              >
                <span>M.2 NVMe: </span>
                <span className="font-bold">{installedComponentIds.has("storage") ? "NVMe SSD MOUNTED" : "EMPTY"}</span>
              </div>
            </Html>
          </group>

          {/* 5. 24-PIN ATX MAIN POWER CONNECTOR (Right Edge) */}
          <group position={[1.3, 0.1, 0]}>
            <mesh>
              <boxGeometry args={[0.2, 0.15, 0.8]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Installed ATX Power Plug */}
            {installedComponentIds.has("psu") && (
              <mesh position={[0, 0.15, 0]}>
                <boxGeometry args={[0.22, 0.18, 0.82]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
            )}

            <Html position={[0, 0.5, 0]} center distanceFactor={8}>
              <div
                className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                  installedComponentIds.has("psu")
                    ? "bg-emerald-950/90 text-emerald-300 border-emerald-800"
                    : "bg-slate-900/90 text-slate-300 border-slate-800"
                }`}
              >
                <span>ATX Power: </span>
                <span className="font-bold">{installedComponentIds.has("psu") ? "24-PIN PLUGGED" : "DISCONNECTED"}</span>
              </div>
            </Html>
          </group>
        </group>

        <OrbitControls
          enablePan={false}
          minDistance={3.5}
          maxDistance={10.0}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />
      </Canvas>
    </div>
  );
}
