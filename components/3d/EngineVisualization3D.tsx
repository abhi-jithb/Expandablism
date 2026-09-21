"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FourStrokeStep } from "@/data/learningContent";

interface EngineVisualization3DProps {
  position: [number, number, number];
  currentStroke?: FourStrokeStep;
  autoPlayCycle?: boolean;
}

export function EngineVisualization3D({
  position,
  currentStroke,
  autoPlayCycle = false,
}: EngineVisualization3DProps) {
  const pistonGroupRef = useRef<THREE.Group>(null);
  const crankshaftRef = useRef<THREE.Mesh>(null);
  const intakeValveRef = useRef<THREE.Mesh>(null);
  const exhaustValveRef = useRef<THREE.Mesh>(null);
  const sparkFlashRef = useRef<THREE.Mesh>(null);

  const angleRef = useRef(0);

  useFrame((state, delta) => {
    let targetPistonY = 0;
    let intakeOpen = false;
    let exhaustOpen = false;
    let sparkActive = false;

    if (autoPlayCycle) {
      angleRef.current += delta * 4.0;
      const rad = angleRef.current;
      targetPistonY = Math.sin(rad) * 0.25;
      if (crankshaftRef.current) {
        crankshaftRef.current.rotation.z = rad;
      }
      
      const modRad = rad % (Math.PI * 4);
      intakeOpen = modRad < Math.PI;
      sparkActive = modRad >= Math.PI * 2 && modRad < Math.PI * 2.2;
      exhaustOpen = modRad >= Math.PI * 3;
    } else if (currentStroke) {
      targetPistonY = currentStroke.pistonPosition === 1.0 ? -0.22 : 0.22;
      intakeOpen = currentStroke.intakeValveOpen;
      exhaustOpen = currentStroke.exhaustValveOpen;
      sparkActive = currentStroke.sparkIgnited;

      if (crankshaftRef.current) {
        const targetRot = currentStroke.pistonPosition === 1.0 ? Math.PI : 0;
        crankshaftRef.current.rotation.z = THREE.MathUtils.lerp(
          crankshaftRef.current.rotation.z,
          targetRot,
          delta * 8.0
        );
      }
    }

    if (pistonGroupRef.current) {
      pistonGroupRef.current.position.y = THREE.MathUtils.lerp(
        pistonGroupRef.current.position.y,
        targetPistonY,
        delta * 8.0
      );
    }

    if (intakeValveRef.current) {
      const targetValY = intakeOpen ? 0.32 : 0.42;
      intakeValveRef.current.position.y = THREE.MathUtils.lerp(
        intakeValveRef.current.position.y,
        targetValY,
        delta * 10.0
      );
    }

    if (exhaustValveRef.current) {
      const targetValY = exhaustOpen ? 0.32 : 0.42;
      exhaustValveRef.current.position.y = THREE.MathUtils.lerp(
        exhaustValveRef.current.position.y,
        targetValY,
        delta * 10.0
      );
    }

    if (sparkFlashRef.current) {
      const mat = sparkFlashRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = sparkActive ? 0.95 : 0.0;
    }
  });

  return (
    <group position={position} scale={[0.85, 0.85, 0.85]}>
      {/* Educational Visualization Indicator */}
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#0284c7" />
      </mesh>

      {/* Glass Cylinder Outer Shell */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.65, 32, 1, true]} />
        <meshStandardMaterial
          color="#e2e8f0"
          transparent
          opacity={0.25}
          roughness={0.1}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Top Cylinder Head Plate */}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.05, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Spark Plug Electrode Assembly at Top Center */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.18, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Vivid Fire / Spark Ignition Flash */}
      <mesh ref={sparkFlashRef} position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color="#ff4500" transparent opacity={0} />
      </mesh>

      {/* Intake Valve (Left Top - Cyan when open) */}
      <mesh ref={intakeValveRef} position={[-0.1, 0.42, 0]}>
        <cylinderGeometry args={[0.04, 0.01, 0.2, 16]} />
        <meshStandardMaterial color={currentStroke?.intakeValveOpen ? "#0284c7" : "#64748b"} />
      </mesh>

      {/* Exhaust Valve (Right Top - Crimson Red when open) */}
      <mesh ref={exhaustValveRef} position={[0.1, 0.42, 0]}>
        <cylinderGeometry args={[0.04, 0.01, 0.2, 16]} />
        <meshStandardMaterial color={currentStroke?.exhaustValveOpen ? "#ef4444" : "#64748b"} />
      </mesh>

      {/* Piston Head & Connecting Rod Group */}
      <group ref={pistonGroupRef} position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.16, 32]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.22, 0]}>
          <boxGeometry args={[0.05, 0.32, 0.05]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.7} />
        </mesh>
      </group>

      {/* Crankshaft Shaft & Counterweight at Bottom */}
      <mesh ref={crankshaftRef} position={[0, -0.38, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.1, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.9} />
      </mesh>
    </group>
  );
}
