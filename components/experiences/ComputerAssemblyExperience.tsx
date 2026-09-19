"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Topic } from "@/types/content";
import { ComputerCanvas3D } from "@/components/3d/ComputerCanvas3D";
import { SpatialToolbox } from "@/components/ui/SpatialToolbox";

interface ComputerAssemblyExperienceProps {
  area: string;
  topicData: Topic;
}

type BootState = "assembling" | "booting" | "running" | "error";

export function ComputerAssemblyExperience({
  area,
  topicData,
}: ComputerAssemblyExperienceProps) {
  const [installedComponentIds, setInstalledComponentIds] = useState<Set<string>>(new Set());
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>("cpu");
  const [bootState, setBootState] = useState<BootState>("assembling");
  const [bootErrorMessage, setBootErrorMessage] = useState<string | null>(null);

  const explorableObject = topicData.objects[0];
  const allComponents = explorableObject?.components || [];

  const handleToggleComponentInstall = (id: string) => {
    setInstalledComponentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    // Reset boot state if user modifies hardware configuration
    if (bootState === "running" || bootState === "error") {
      setBootState("assembling");
      setBootErrorMessage(null);
    }
  };

  const handleBootSystem = () => {
    // Validate physical dependencies & relationships
    if (!installedComponentIds.has("psu")) {
      setBootState("error");
      setBootErrorMessage("NO POWER: Main 24-pin ATX power cable is disconnected from the motherboard.");
      return;
    }

    if (!installedComponentIds.has("cpu")) {
      setBootState("error");
      setBootErrorMessage("CPU MISSING: No processor installed in LGA socket. CPU executes binary instructions.");
      return;
    }

    if (!installedComponentIds.has("ram")) {
      setBootState("error");
      setBootErrorMessage("POST MEMORY FAILURE: RAM modules required to hold volatile execution instructions.");
      return;
    }

    if (!installedComponentIds.has("storage")) {
      setBootState("error");
      setBootErrorMessage("NO BOOT DEVICE: M.2 NVMe SSD missing. System cannot locate OS kernel binaries.");
      return;
    }

    if (!installedComponentIds.has("gpu")) {
      setBootState("error");
      setBootErrorMessage("NO DISPLAY: Dedicated GPU required for parallel 3D matrix rasterization.");
      return;
    }

    // All core components connected -> Trigger Boot Sequence
    setBootState("booting");
    setBootErrorMessage(null);

    setTimeout(() => {
      setBootState("running");
    }, 1200);
  };

  const selectedComponent = allComponents.find((c) => c.id === selectedComponentId);
  const isAllInstalled = installedComponentIds.size >= allComponents.length;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#050505] text-slate-100 font-sans select-none">
      {/* Full Viewport 3D Computer Canvas */}
      <div className="absolute inset-0 w-full h-full z-0">
        <ComputerCanvas3D
          installedComponentIds={installedComponentIds}
          selectedComponentId={selectedComponentId}
          isPoweredOn={bootState === "running"}
          onSelectComponent={setSelectedComponentId}
        />
      </div>

      {/* Navigation Chrome */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 sm:px-10 py-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-3 pointer-events-auto">
          <Link href="/" className="text-sm font-semibold tracking-tight text-white hover:opacity-80 transition">
            Expandablism
          </Link>
          <span className="hidden sm:inline-block text-xs font-light text-slate-500 border-l border-slate-800 pl-3">
            Build. Connect. Run.
          </span>
        </div>

        {/* Assembly Status Badge */}
        <div className="pointer-events-auto flex items-center space-x-4">
          <span className="text-xs font-mono text-slate-300 bg-slate-900/90 px-4 py-2 rounded-full border border-slate-800 backdrop-blur-md">
            HARDWARE &middot; <span className="text-white font-bold">{installedComponentIds.size}</span> / {allComponents.length} Connected
          </span>
        </div>
      </header>

      {/* POST Error Alert Banner */}
      {bootState === "error" && bootErrorMessage && (
        <div className="absolute top-20 inset-x-0 z-30 flex justify-center pointer-events-none animate-fadeIn">
          <div className="bg-rose-950/90 border border-rose-800 px-6 py-3 rounded-full text-xs font-mono text-rose-200 shadow-2xl backdrop-blur-md max-w-xl text-center">
            ⚠️ {bootErrorMessage}
          </div>
        </div>
      )}

      {/* BOOT SUCCESS MONITOR OVERLAY */}
      {bootState === "running" && (
        <div className="absolute top-20 left-6 sm:left-10 z-20 max-w-sm w-full pointer-events-auto animate-fadeIn">
          <div className="bg-[#09090b]/95 border border-emerald-500/40 rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-emerald-900/50 pb-2">
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                EXPANDABLISM BIOS v1.0
              </span>
              <span className="text-[10px] text-slate-500">POST PASS</span>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <div>&gt; CPU: 8-Core Processor detected [OK]</div>
              <div>&gt; RAM: 32GB DDR5 @ 6000MHz [OK]</div>
              <div>&gt; NVMe: 1TB PCIe Gen4 SSD [OK]</div>
              <div>&gt; GPU: Parallel Compute Active [OK]</div>
              <div>&gt; ATX Rails: +12V / +5V Stable [OK]</div>
            </div>

            <div className="pt-2 text-center text-xs font-bold text-emerald-400 border-t border-emerald-900/50">
              ✓ SYSTEM BOOT SUCCESSFUL &mdash; SYSTEM READY
            </div>
          </div>
        </div>
      )}

      {/* Selected Component Knowledge Card */}
      {selectedComponent && (
        <div className="absolute top-20 right-6 sm:right-10 z-20 max-w-xs w-full pointer-events-auto">
          <div className="bg-[#09090b]/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                SELECTED COMPONENT
              </span>
              <button
                onClick={() => setSelectedComponentId(null)}
                className="text-slate-500 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                {selectedComponent.name}
              </h3>
              <p className="text-xs text-slate-400 font-light mt-1 leading-relaxed">
                {selectedComponent.description}
              </p>
            </div>

            <button
              onClick={() => handleToggleComponentInstall(selectedComponent.id)}
              className={`w-full py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer font-bold border ${
                installedComponentIds.has(selectedComponent.id)
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/50 hover:bg-rose-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30"
              }`}
            >
              {installedComponentIds.has(selectedComponent.id) ? "Disconnect Component" : "Connect to Socket"}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Component Toolbox & Boot Deck */}
      <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center pointer-events-none px-6">
        <div className="max-w-4xl w-full space-y-3 pointer-events-auto">
          <SpatialToolbox
            title="HARDWARE SOCKET TOOLBOX"
            items={allComponents.map((comp) => ({
              id: comp.id,
              name: comp.name,
              description: comp.description,
              concepts: comp.concepts,
              status: installedComponentIds.has(comp.id) ? "connected" : "in_toolbox",
              iconTag: comp.id.toUpperCase(),
            }))}
            selectedItemId={selectedComponentId}
            onSelectItem={(id) => {
              setSelectedComponentId(id);
              handleToggleComponentInstall(id);
            }}
            onActionItem={(id) => {
              handleToggleComponentInstall(id);
            }}
            actionLabel={
              selectedComponentId && installedComponentIds.has(selectedComponentId)
                ? "Disconnect Component"
                : "Socket Component"
            }
          />

          <div className="flex items-center justify-between bg-[#09090b]/90 border border-slate-800 rounded-xl px-5 py-3 shadow-xl backdrop-blur-xl">
            <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
              <span>System Bus:</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                LGA1700 / DDR5-6000 / PCIe Gen4
              </span>
            </div>

            <button
              onClick={handleBootSystem}
              disabled={bootState === "booting"}
              className={`px-8 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition shadow-lg cursor-pointer active:scale-95 ${
                bootState === "running"
                  ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                  : isAllInstalled
                  ? "bg-white text-slate-950 hover:bg-slate-100"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {bootState === "booting"
                ? "Booting Sequence..."
                : bootState === "running"
                ? "✓ REBOOT SYSTEM"
                : "⚡ BOOT SYSTEM"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
