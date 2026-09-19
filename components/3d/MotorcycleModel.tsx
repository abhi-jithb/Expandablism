"use client";

import React, { useLayoutEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface MotorcycleModelProps {
  modelPath: string;
}

export function MotorcycleModel({ modelPath }: MotorcycleModelProps) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    if (!scene) return;

    // Clone scene to avoid mutating cached GLTF instances across re-mounts
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Center geometry around origin (0, 0, 0)
    scene.position.x = -center.x;
    scene.position.y = -center.y;
    scene.position.z = -center.z;

    // Scale model to fit comfortably within a standard bounding sphere radius
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetScale = 3.2 / (maxDim || 1);
    
    if (groupRef.current) {
      groupRef.current.scale.setScalar(targetScale);
      // Lift slightly so bottom rest position aligns above floor
      groupRef.current.position.y = (size.y * targetScale) / 2 - 0.2;
    }

    // Enhance materials for modern lab aesthetic
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.envMapIntensity = 1.2;
          mat.roughness = Math.max(mat.roughness || 0.3, 0.25);
        }
      }
    });
  }, [scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the model asset
useGLTF.preload("/models/motorcycle.glb");
