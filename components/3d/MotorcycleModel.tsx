"use client";

import React, { useLayoutEffect, useRef, useState, useMemo } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { MOTORCYCLE_COMPONENTS, DeconstructedComponent } from "@/data/deconstructionConfig";
import { EngineVisualization3D } from "./EngineVisualization3D";
import { FourStrokeStep } from "@/data/learningContent";

interface MotorcycleModelProps {
  modelPath: string;
  scaleFactor?: number;
  isExploded: boolean;
  selectedComponentId: string | null;
  hoveredComponentId: string | null;
  activeLearningComponentId?: string | null;
  currentStroke?: FourStrokeStep;
  onSelectComponent: (id: string | null) => void;
  onHoverComponent: (id: string | null) => void;
  onExploreComponent?: (id: string) => void;
}

interface NodeData {
  object: THREE.Object3D;
  initialPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  component: DeconstructedComponent;
  materials: THREE.MeshStandardMaterial[];
}

export function MotorcycleModel({
  modelPath,
  scaleFactor = 4.2,
  isExploded,
  selectedComponentId,
  hoveredComponentId,
  activeLearningComponentId,
  currentStroke,
  onSelectComponent,
  onHoverComponent,
  onExploreComponent,
}: MotorcycleModelProps) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<THREE.Group>(null);
  const nodesDataRef = useRef<NodeData[]>([]);

  const selectedComponent = useMemo(
    () => MOTORCYCLE_COMPONENTS.find((c) => c.id === selectedComponentId),
    [selectedComponentId]
  );

  const engineComponent = useMemo(
    () => MOTORCYCLE_COMPONENTS.find((c) => c.id === "engine"),
    []
  );

  const [selectedWorldPos, setSelectedWorldPos] = useState<[number, number, number]>([0, 0, 0]);

  useLayoutEffect(() => {
    if (!scene) return;

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    scene.position.x = -center.x;
    scene.position.y = -center.y;
    scene.position.z = -center.z;

    const maxDim = Math.max(size.x, size.y, size.z);
    const targetScale = scaleFactor / (maxDim || 1);
    
    if (groupRef.current) {
      groupRef.current.scale.setScalar(targetScale);
      groupRef.current.position.y = (size.y * targetScale) / 2 - 0.45;
    }

    const nodeMap: NodeData[] = [];

    scene.traverse((child) => {
      if (child.name) {
        const comp = MOTORCYCLE_COMPONENTS.find((c) => c.nodeNames.includes(child.name));
        if (comp) {
          const materials: THREE.MeshStandardMaterial[] = [];

          child.traverse((subChild) => {
            if ((subChild as THREE.Mesh).isMesh) {
              const mesh = subChild as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;

              if (mesh.material) {
                const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
                mat.envMapIntensity = 1.0;
                mat.roughness = Math.max(mat.roughness || 0.25, 0.2);
                mat.metalness = Math.min(mat.metalness || 0.5, 0.85);
                mesh.material = mat;
                materials.push(mat);
              }
            }
          });

          child.userData.componentId = comp.id;
          const initialPos = child.position.clone();
          nodeMap.push({
            object: child,
            initialPos,
            targetPos: initialPos.clone(),
            component: comp,
            materials,
          });
        }
      }
    });

    nodesDataRef.current = nodeMap;
  }, [scene, scaleFactor]);

  useFrame((state, delta) => {
    const lerpFactor = Math.min(delta * 6.5, 0.2);

    nodesDataRef.current.forEach(({ object, initialPos, component, materials }) => {
      const [ex, ey, ez] = component.explodedPosition;
      const targetX = isExploded ? initialPos.x + ex : initialPos.x;
      const targetY = isExploded ? initialPos.y + ey : initialPos.y;
      const targetZ = isExploded ? initialPos.z + ez : initialPos.z;

      object.position.x = THREE.MathUtils.lerp(object.position.x, targetX, lerpFactor);
      object.position.y = THREE.MathUtils.lerp(object.position.y, targetY, lerpFactor);
      object.position.z = THREE.MathUtils.lerp(object.position.z, targetZ, lerpFactor);

      const isSelected = selectedComponentId === component.id;
      const isHovered = hoveredComponentId === component.id;
      const isDeepLearning = activeLearningComponentId !== null && activeLearningComponentId !== undefined;
      const isLearningActive = activeLearningComponentId === component.id;

      let targetOpacity = 1.0;
      if (isDeepLearning) {
        targetOpacity = isLearningActive ? 1.0 : 0.18;
      } else if (selectedComponentId) {
        targetOpacity = isSelected ? 1.0 : 0.35;
      }

      materials.forEach((mat) => {
        mat.transparent = targetOpacity < 0.99;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, lerpFactor);

        if (isHovered && !selectedComponentId && !isDeepLearning) {
          mat.emissive.setHex(0x38bdf8);
          mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.25, lerpFactor);
        } else if (isSelected || isLearningActive) {
          mat.emissive.setHex(0x60a5fa);
          mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.35, lerpFactor);
        } else {
          mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0, lerpFactor);
        }
      });
    });

    if (selectedComponentId) {
      const selectedNodes = nodesDataRef.current.filter(
        (n) => n.component.id === selectedComponentId
      );
      if (selectedNodes.length > 0) {
        const centerWorld = new THREE.Vector3();
        selectedNodes[0].object.getWorldPosition(centerWorld);
        setSelectedWorldPos([centerWorld.x, centerWorld.y + 0.3, centerWorld.z]);
      }
    }
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (activeLearningComponentId) return;
    e.stopPropagation();
    let curr: THREE.Object3D | null = e.object;
    while (curr) {
      if (curr.userData?.componentId) {
        onHoverComponent(curr.userData.componentId);
        break;
      }
      curr = curr.parent;
    }
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    if (activeLearningComponentId) return;
    e.stopPropagation();
    onHoverComponent(null);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (activeLearningComponentId) return;
    e.stopPropagation();
    let curr: THREE.Object3D | null = e.object;
    while (curr) {
      if (curr.userData?.componentId) {
        onSelectComponent(curr.userData.componentId);
        break;
      }
      curr = curr.parent;
    }
  };

  const enginePos = engineComponent?.explodedPosition || [0, -0.15, 0.5];

  return (
    <group
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <primitive object={scene} />

      {/* 3D Educational Visualization overlay during Engine Learning Mode */}
      {activeLearningComponentId === "engine" && (
        <EngineVisualization3D
          position={[enginePos[0], enginePos[1] + 0.1, enginePos[2] + 0.2]}
          currentStroke={currentStroke}
          autoPlayCycle={!currentStroke}
        />
      )}

      {/* Floating 3D Label next to Selected Component */}
      {selectedComponent && isExploded && !activeLearningComponentId && (
        <Html
          position={selectedWorldPos}
          center
          distanceFactor={7}
          zIndexRange={[20, 0]}
        >
          <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-left min-w-[220px] max-w-[260px] pointer-events-auto transition-all duration-300">
            <span className="text-[9px] font-mono tracking-[0.2em] text-blue-400 uppercase block mb-1">
              COMPONENT SELECTED
            </span>
            <h3 className="text-sm font-bold text-white mb-1">
              {selectedComponent.name}
            </h3>
            <p className="text-[11px] text-slate-300 font-light leading-relaxed mb-3">
              {selectedComponent.description}
            </p>

            <button
              onClick={() => onExploreComponent && onExploreComponent(selectedComponent.id)}
              className="w-full py-2 bg-white hover:bg-slate-100 text-slate-950 font-semibold text-[11px] tracking-wider uppercase rounded-full transition shadow-md cursor-pointer active:scale-95"
            >
              Explore {selectedComponent.name.split(" ")[0]}
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}

useGLTF.preload("/models/motorcycle.glb");
