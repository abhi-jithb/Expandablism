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
}

interface NodeData {
  object: THREE.Object3D;
  canonicalPos: THREE.Vector3;
  canonicalRot: THREE.Euler;
  canonicalScale: THREE.Vector3;
  component: DeconstructedComponent;
  materials: THREE.MeshStandardMaterial[];
}

export function MotorcycleModel({
  modelPath,
  scaleFactor = 4.2,
  isExploded,
  isRebuildMode = false,
  assembledComponentIds = new Set(),
  selectedComponentId,
  hoveredComponentId,
  activeLearningComponentId,
  currentStroke,
  onSelectComponent,
  onHoverComponent,
  onExploreComponent,
  onSnapSuccess,
  onSnapFail,
}: MotorcycleModelProps) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<THREE.Group>(null);
  const nodesDataRef = useRef<NodeData[]>([]);

  // 1. Deep clone scene graph on load to preserve pristine, unmutated GLTF transforms
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      // Store canonical original transforms directly on userData once
      child.userData.canonicalPosition = child.position.clone();
      child.userData.canonicalRotation = child.rotation.clone();
      child.userData.canonicalScale = child.scale.clone();
    });
    return clone;
  }, [scene]);

  // 3D Dragging state
  const [draggingComponentId, setDraggingComponentId] = useState<string | null>(null);
  const dragCurrentPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const dragPlaneRef = useRef<THREE.Plane>(new THREE.Plane());

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
    if (!clonedScene) return;

    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    clonedScene.position.x = -center.x;
    clonedScene.position.y = -center.y;
    clonedScene.position.z = -center.z;

    const maxDim = Math.max(size.x, size.y, size.z);
    const targetScale = scaleFactor / (maxDim || 1);
    
    if (groupRef.current) {
      groupRef.current.scale.setScalar(targetScale);
      groupRef.current.position.y = (size.y * targetScale) / 2 - 0.45;
    }

    const nodeMap: NodeData[] = [];

    clonedScene.traverse((child) => {
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

          nodeMap.push({
            object: child,
            canonicalPos: (child.userData.canonicalPosition as THREE.Vector3).clone(),
            canonicalRot: (child.userData.canonicalRotation as THREE.Euler).clone(),
            canonicalScale: (child.userData.canonicalScale as THREE.Vector3).clone(),
            component: comp,
            materials,
          });
        }
      }
    });

    nodesDataRef.current = nodeMap;
  }, [clonedScene, scaleFactor]);

  useFrame((state, delta) => {
    const lerpFactor = Math.min(delta * 7.5, 0.25);

    nodesDataRef.current.forEach(({ object, canonicalPos, canonicalRot, canonicalScale, component, materials }) => {
      let targetX = canonicalPos.x;
      let targetY = canonicalPos.y;
      let targetZ = canonicalPos.z;

      if (isRebuildMode) {
        const isAssembled = assembledComponentIds.has(component.id);
        const isBeingDragged = draggingComponentId === component.id;

        if (isAssembled) {
          // Assembled into canonical target origin
          targetX = canonicalPos.x;
          targetY = canonicalPos.y;
          targetZ = canonicalPos.z;
        } else if (isBeingDragged) {
          // Currently being dragged in 3D
          targetX = dragCurrentPosRef.current.x;
          targetY = dragCurrentPosRef.current.y;
          targetZ = dragCurrentPosRef.current.z;
        } else {
          // Scattered position in puzzle workspace
          const [sx, sy, sz] = component.puzzleScatterPosition;
          targetX = canonicalPos.x + sx;
          targetY = canonicalPos.y + sy;
          targetZ = canonicalPos.z + sz;
        }
      } else if (isExploded) {
        // Exploded position offset derived from canonicalPos
        const [ex, ey, ez] = component.explodedPosition;
        targetX = canonicalPos.x + ex;
        targetY = canonicalPos.y + ey;
        targetZ = canonicalPos.z + ez;
      }

      // Smooth position lerp back to canonical assembled or exploded target
      object.position.x = THREE.MathUtils.lerp(object.position.x, targetX, lerpFactor);
      object.position.y = THREE.MathUtils.lerp(object.position.y, targetY, lerpFactor);
      object.position.z = THREE.MathUtils.lerp(object.position.z, targetZ, lerpFactor);

      // Smooth rotation & scale lerp back to canonical assembled state
      object.rotation.x = THREE.MathUtils.lerp(object.rotation.x, canonicalRot.x, lerpFactor);
      object.rotation.y = THREE.MathUtils.lerp(object.rotation.y, canonicalRot.y, lerpFactor);
      object.rotation.z = THREE.MathUtils.lerp(object.rotation.z, canonicalRot.z, lerpFactor);

      object.scale.x = THREE.MathUtils.lerp(object.scale.x, canonicalScale.x, lerpFactor);
      object.scale.y = THREE.MathUtils.lerp(object.scale.y, canonicalScale.y, lerpFactor);
      object.scale.z = THREE.MathUtils.lerp(object.scale.z, canonicalScale.z, lerpFactor);

      // Opacity & Highlight lerp
      const isSelected = selectedComponentId === component.id;
      const isHovered = hoveredComponentId === component.id;
      const isDeepLearning = activeLearningComponentId !== null && activeLearningComponentId !== undefined;
      const isLearningActive = activeLearningComponentId === component.id;

      let targetOpacity = 1.0;
      if (isRebuildMode) {
        const isAssembled = assembledComponentIds.has(component.id);
        targetOpacity = isAssembled ? 1.0 : (isSelected ? 1.0 : 0.85);
      } else if (isDeepLearning) {
        targetOpacity = isLearningActive ? 1.0 : 0.18;
      } else if (selectedComponentId && isExploded) {
        targetOpacity = isSelected ? 1.0 : 0.35;
      }

      materials.forEach((mat) => {
        mat.transparent = targetOpacity < 0.99;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, lerpFactor);

        if (isHovered && !selectedComponentId && !isDeepLearning && (isExploded || isRebuildMode)) {
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

  // Handle Pointer Down for 3D Dragging & Selection
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!isExploded && !isRebuildMode) return;
    e.stopPropagation();
    let curr: THREE.Object3D | null = e.object;
    let foundCompId: string | null = null;

    while (curr) {
      if (curr.userData?.componentId) {
        foundCompId = curr.userData.componentId;
        break;
      }
      curr = curr.parent;
    }

    if (!foundCompId) return;

    onSelectComponent(foundCompId);

    if (isRebuildMode && !assembledComponentIds.has(foundCompId)) {
      setDraggingComponentId(foundCompId);

      const cameraDir = e.camera.getWorldDirection(new THREE.Vector3()).negate();
      const nodeObj = nodesDataRef.current.find((n) => n.component.id === foundCompId);
      if (nodeObj) {
        dragPlaneRef.current.setFromNormalAndCoplanarPoint(cameraDir, nodeObj.object.position);
        dragCurrentPosRef.current.copy(nodeObj.object.position);
      }
    }
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (draggingComponentId && isRebuildMode) {
      e.stopPropagation();
      const intersectionPoint = new THREE.Vector3();
      if (e.ray.intersectPlane(dragPlaneRef.current, intersectionPoint)) {
        dragCurrentPosRef.current.copy(intersectionPoint);
      }
    }
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (draggingComponentId && isRebuildMode) {
      e.stopPropagation();
      const nodeObj = nodesDataRef.current.find((n) => n.component.id === draggingComponentId);

      if (nodeObj) {
        const targetWorldPos = nodeObj.canonicalPos;
        const currentWorldPos = nodeObj.object.position;
        const distance = currentWorldPos.distanceTo(targetWorldPos);

        if (distance < 0.65) {
          if (onSnapSuccess) onSnapSuccess(draggingComponentId);
        } else {
          if (onSnapFail) onSnapFail(draggingComponentId);
        }
      }

      setDraggingComponentId(null);
    }
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (!isExploded && !isRebuildMode) return;
    if (activeLearningComponentId) return;
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
    if (!isExploded && !isRebuildMode) return;
    if (activeLearningComponentId) return;
    onHoverComponent(null);
  };

  const enginePos = engineComponent?.explodedPosition || [0, -0.15, 0.5];

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={clonedScene} />

      {/* 3D Educational Visualization overlay during Engine Learning Mode */}
      {activeLearningComponentId === "engine" && (
        <EngineVisualization3D
          position={[enginePos[0], enginePos[1] + 0.1, enginePos[2] + 0.2]}
          currentStroke={currentStroke}
          autoPlayCycle={!currentStroke}
        />
      )}

      {/* Floating 3D Label next to Selected Component */}
      {selectedComponent && isExploded && !activeLearningComponentId && !isRebuildMode && (
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

      {/* Floating Label in Rebuild Mode for Selected Un-assembled Component */}
      {selectedComponent && isRebuildMode && !assembledComponentIds.has(selectedComponent.id) && (
        <Html
          position={selectedWorldPos}
          center
          distanceFactor={7}
          zIndexRange={[20, 0]}
        >
          <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-left min-w-[200px] max-w-[240px] pointer-events-auto transition-all duration-300">
            <span className="text-[9px] font-mono tracking-[0.2em] text-amber-400 uppercase block mb-1">
              PUZZLE PIECE
            </span>
            <h3 className="text-sm font-bold text-white mb-1">
              {selectedComponent.name}
            </h3>
            <p className="text-[11px] text-slate-300 font-light leading-relaxed mb-3">
              Drag component toward frame to connect, or click snap below.
            </p>

            <button
              onClick={() => onSnapSuccess && onSnapSuccess(selectedComponent.id)}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-[11px] tracking-wider uppercase rounded-full transition shadow-md cursor-pointer active:scale-95"
            >
              Connect Component
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}

useGLTF.preload("/models/motorcycle.glb");
