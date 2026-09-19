"use client";

import React, { useLayoutEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface MotorcycleModelProps {
  modelPath: string;
  scaleFactor?: number;
}

export function MotorcycleModel({ modelPath, scaleFactor = 4.2 }: MotorcycleModelProps) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    if (!scene) return;

    // Clone scene bounds calculation to center geometry
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Center geometry around origin (0, 0, 0)
    scene.position.x = -center.x;
    scene.position.y = -center.y;
    scene.position.z = -center.z;

    // Scale model so it is visually HEROIC in the viewport
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetScale = scaleFactor / (maxDim || 1);
    
    if (groupRef.current) {
      groupRef.current.scale.setScalar(targetScale);
      // Lift slightly so contact shadow aligns underneath wheels
      groupRef.current.position.y = (size.y * targetScale) / 2 - 0.45;
    }

    // Studio material enhancement: realistic metallic surfaces and clean dark lab reflections
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.envMapIntensity = 1.0;
          mat.roughness = Math.max(mat.roughness || 0.25, 0.2);
          mat.metalness = Math.min(mat.metalness || 0.5, 0.85);
        }
      }
    });
  }, [scene, scaleFactor]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// Preload GLTF asset
useGLTF.preload("/models/motorcycle.glb");
