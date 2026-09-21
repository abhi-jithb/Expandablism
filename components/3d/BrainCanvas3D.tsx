"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { BrainRegionInfo, BrainStateConfig, SynapticPuzzleNode } from "@/data/brainLearningContent";

interface BrainCanvas3DProps {
  brainRegions: BrainRegionInfo[];
  selectedRegionId: string | null;
  hoveredRegionId: string | null;
  activeState: BrainStateConfig;
  isPuzzleMode?: boolean;
  puzzleConnections?: { from: string; to: string }[];
  puzzleNodes?: SynapticPuzzleNode[];
  selectedPuzzleNodeId?: string | null;
  onSelectRegion: (id: string | null) => void;
  onHoverRegion: (id: string | null) => void;
  onSelectPuzzleNode?: (id: string) => void;
}

// 3D Animated Action Potential Signal Pulses
function NeuralPulseParticles({ activeState }: { activeState: BrainStateConfig }) {
  const groupRef = useRef<THREE.Group>(null);

  const pathways = [
    [
      new THREE.Vector3(0, 0.4, 0.9),
      new THREE.Vector3(-0.2, 0.2, 0.5),
      new THREE.Vector3(-0.4, -0.1, 0.2),
    ],
    [
      new THREE.Vector3(0, 0.4, 0.9),
      new THREE.Vector3(0, 0.5, 0.3),
      new THREE.Vector3(0, 0.6, -0.2),
    ],
    [
      new THREE.Vector3(0.4, -0.2, 0.0),
      new THREE.Vector3(0.2, 0.1, 0.4),
      new THREE.Vector3(0, 0.4, 0.9),
    ],
    [
      new THREE.Vector3(0, 0.6, -0.2),
      new THREE.Vector3(0.3, 0.2, -0.1),
      new THREE.Vector3(0.4, -0.2, 0.0),
    ]
  ];

  const particleCount = 32;
  const particleProgress = useRef<number[]>(
    Array.from({ length: particleCount }, (_, i) => i / particleCount)
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    let speed = 0.4;
    if (activeState.id === "cortisol_hijack") speed = 0.8;
    else if (activeState.id === "deep_focus") speed = 0.6;
    else if (activeState.id === "glymphatic_wash") speed = 0.15;

    particleProgress.current = particleProgress.current.map((p) => (p + delta * speed) % 1);

    groupRef.current.children.forEach((mesh, idx) => {
      const pathIdx = idx % pathways.length;
      const pathPoints = pathways[pathIdx];
      const curve = new THREE.CatmullRomCurve3(pathPoints);

      const progress = particleProgress.current[idx];
      const point = curve.getPoint(progress);

      mesh.position.copy(point);
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: particleCount }).map((_, i) => {
        const colors = ["#0284c7", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];
        const particleColor = colors[i % colors.length];
        return (
          <mesh key={i}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color={particleColor} />
          </mesh>
        );
      })}
    </group>
  );
}

// 3D Brain Outer Silhouette Shell
function BrainSilhouette() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Left Hemisphere Outer Shell */}
      <mesh position={[-0.45, 0.2, 0.1]}>
        <sphereGeometry args={[1.05, 24, 24]} />
        <meshStandardMaterial
          color="#6366f1"
          wireframe
          transparent
          opacity={0.18}
          roughness={0.6}
        />
      </mesh>

      {/* Right Hemisphere Outer Shell */}
      <mesh position={[0.45, 0.2, 0.1]}>
        <sphereGeometry args={[1.05, 24, 24]} />
        <meshStandardMaterial
          color="#6366f1"
          wireframe
          transparent
          opacity={0.18}
          roughness={0.6}
        />
      </mesh>

      {/* Cerebellum */}
      <mesh position={[0, -0.4, -0.6]}>
        <sphereGeometry args={[0.55, 18, 18]} />
        <meshStandardMaterial
          color="#8b5cf6"
          wireframe
          transparent
          opacity={0.22}
        />
      </mesh>

      {/* Brainstem */}
      <mesh position={[0, -0.8, -0.3]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.2, 0.8, 16]} />
        <meshStandardMaterial
          color="#a855f7"
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Neural Interconnect Lines */}
      <Line
        points={[
          [0, 0.4, 0.9],
          [-0.4, -0.1, 0.2],
          [0.4, -0.2, 0.0],
          [0, 0.6, -0.2],
          [0, 0.4, 0.9],
        ]}
        color="#818cf8"
        lineWidth={1.5}
        transparent
        opacity={0.5}
      />
    </group>
  );
}

// 3D Brain Region Node Mesh
function RegionNodeMesh({
  region,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: {
  region: BrainRegionInfo;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2.5 + region.position[0]) * 0.06;
      meshRef.current.scale.setScalar(1 + pulse + (isSelected ? 0.25 : isHovered ? 0.12 : 0));
    }
  });

  const baseColor = region.color || "#38bdf8";

  return (
    <group position={region.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
        }}
        onPointerOut={() => onHover(false)}
      >
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={isSelected ? 0.9 : isHovered ? 0.7 : 0.4}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.34, 16, 16]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={isSelected ? 0.45 : isHovered ? 0.3 : 0.12}
          wireframe
        />
      </mesh>

      <Html position={[0, 0.38, 0]} center distanceFactor={7}>
        <button
          onClick={onSelect}
          className={`px-3 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-all border shadow-md cursor-pointer ${
            isSelected
              ? "bg-slate-900 text-white font-bold border-slate-900 scale-110 shadow-lg"
              : isHovered
              ? "bg-white text-slate-900 border-slate-400 scale-105"
              : "bg-white/95 text-slate-700 border-slate-200 hover:border-slate-400"
          }`}
        >
          <span
            className="w-2 h-2 rounded-full inline-block mr-1.5"
            style={{ backgroundColor: baseColor }}
          ></span>
          {region.name}
        </button>
      </Html>
    </group>
  );
}

export function BrainCanvas3D({
  brainRegions,
  selectedRegionId,
  hoveredRegionId,
  activeState,
  isPuzzleMode,
  puzzleConnections = [],
  puzzleNodes = [],
  selectedPuzzleNodeId,
  onSelectRegion,
  onHoverRegion,
  onSelectPuzzleNode,
}: BrainCanvas3DProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 2.5, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "#f8fafc" }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 5]} intensity={1.4} color="#ffffff" />
        <directionalLight position={[-5, -4, -5]} intensity={0.6} color="#93c5fd" />
        <pointLight position={[0, 0, 0]} intensity={1.5} color="#38bdf8" distance={6} />

        {/* Studio Light Grid Floor */}
        <gridHelper args={[20, 20, "#cbd5e1", "#e2e8f0"]} position={[0, -1.2, 0]} />

        {/* 3D Brain Silhouette */}
        <BrainSilhouette />

        {/* Action Potential Signals */}
        <NeuralPulseParticles activeState={activeState} />

        {/* Brain Regions */}
        {!isPuzzleMode &&
          brainRegions.map((region) => (
            <RegionNodeMesh
              key={region.id}
              region={region}
              isSelected={selectedRegionId === region.id}
              isHovered={hoveredRegionId === region.id}
              onSelect={() => onSelectRegion(region.id)}
              onHover={(hovered) => onHoverRegion(hovered ? region.id : null)}
            />
          ))}

        {/* Puzzle Mode Overlay */}
        {isPuzzleMode && (
          <group>
            {puzzleConnections.map((conn, idx) => {
              const fromNode = puzzleNodes.find((n) => n.id === conn.from);
              const toNode = puzzleNodes.find((n) => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              return (
                <Line
                  key={`puzzle-line-${idx}`}
                  points={[fromNode.position, toNode.position]}
                  color="#0284c7"
                  lineWidth={4}
                />
              );
            })}

            {puzzleNodes.map((node) => {
              const isSelected = selectedPuzzleNodeId === node.id;
              const isConnected = puzzleConnections.some(
                (c) => c.from === node.id || c.to === node.id
              );
              const region = brainRegions.find((r) => r.id === node.regionId);
              const nodeColor = region?.color || "#38bdf8";

              return (
                <group key={node.id} position={node.position}>
                  <mesh
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectPuzzleNode) onSelectPuzzleNode(node.id);
                    }}
                  >
                    <sphereGeometry args={[0.24, 24, 24]} />
                    <meshStandardMaterial
                      color={isSelected ? "#ffffff" : nodeColor}
                      emissive={isSelected ? nodeColor : nodeColor}
                      emissiveIntensity={isSelected ? 1.0 : isConnected ? 0.7 : 0.4}
                    />
                  </mesh>

                  <Html position={[0, 0.4, 0]} center distanceFactor={7}>
                    <button
                      onClick={() => onSelectPuzzleNode && onSelectPuzzleNode(node.id)}
                      className={`px-3 py-1 rounded-md text-[11px] font-mono whitespace-nowrap border cursor-pointer shadow-sm ${
                        isSelected
                          ? "bg-slate-900 text-white font-bold border-slate-900 scale-110 shadow-md"
                          : isConnected
                          ? "bg-sky-600 text-white border-sky-500 font-medium"
                          : "bg-white text-slate-700 border-slate-300 hover:border-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {node.label}
                    </button>
                  </Html>
                </group>
              );
            })}
          </group>
        )}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={2.0}
          maxDistance={9.0}
          maxPolarAngle={Math.PI / 2 + 0.1}
        />
      </Canvas>
    </div>
  );
}
