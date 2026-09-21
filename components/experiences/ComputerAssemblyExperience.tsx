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
    <main className="relative w-screen h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans select-none">
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
          <Link href="/" className="text-sm font-bold tracking-tight text-slate-900 hover:text-sky-600 transition">
            Expandablism
          </Link>
          <span className="hidden sm:inline-block text-xs font-mono text-slate-500 border-l border-slate-300 pl-3">
            Build. Connect. Run.
          </span>
        </div>

        {/* Assembly Status Badge */}
        <div className="pointer-events-auto flex items-center space-x-4">
          <span className="text-xs font-mono text-slate-700 bg-white/90 px-4 py-2 rounded-xl border border-slate-200 backdrop-blur-md shadow-sm font-bold">
            HARDWARE &middot; <span className="text-sky-600 font-bold">{installedComponentIds.size}</span> / {allComponents.length} Connected
          </span>
        </div>
      </header>

      {/* POST Error Alert Banner */}
      {bootState === "error" && bootErrorMessage && (
        <div className="absolute top-20 inset-x-0 z-30 flex justify-center pointer-events-none animate-fadeIn">
          <div className="bg-rose-50 border border-rose-300 px-6 py-3 rounded-full text-xs font-mono text-rose-800 shadow-xl backdrop-blur-md max-w-xl text-center font-semibold">
            ⚠️ {bootErrorMessage}
          </div>
        </div>
      )}

      {/* BOOT SUCCESS MONITOR OVERLAY */}
      {bootState === "running" && (
        <div className="absolute top-20 left-6 sm:left-10 z-20 max-w-sm w-full pointer-events-auto animate-fadeIn">
          <div className="bg-white/95 border border-emerald-300 rounded-2xl p-5 shadow-xl backdrop-blur-xl space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <span className="text-[10px] text-emerald-700 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                EXPANDABLISM BIOS v1.0
              </span>
              <span className="text-[10px] text-slate-500 font-bold">POST PASS</span>
            </div>

            <div className="text-xs text-slate-700 space-y-1 font-semibold">
              <div>&gt; CPU: 8-Core Processor detected [OK]</div>
              <div>&gt; RAM: 32GB DDR5 @ 6000MHz [OK]</div>
              <div>&gt; NVMe: 1TB PCIe Gen4 SSD [OK]</div>
              <div>&gt; GPU: Parallel Compute Active [OK]</div>
              <div>&gt; ATX Rails: +12V / +5V Stable [OK]</div>
            </div>

            <div className="pt-2 text-center text-xs font-bold text-emerald-700 border-t border-emerald-100">
              ✓ SYSTEM BOOT SUCCESSFUL &mdash; SYSTEM READY
            </div>
          </div>
        </div>
      )}

      {/* Selected Component Knowledge Card */}
      {selectedComponent && (
        <div className="absolute top-20 right-6 sm:right-10 z-20 max-w-xs w-full pointer-events-auto">
          <div className="bg-white/95 border border-slate-200 rounded-2xl p-5 shadow-xl backdrop-blur-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">
                SELECTED COMPONENT
              </span>
              <button
                onClick={() => setSelectedComponentId(null)}
                className="text-slate-400 hover:text-slate-900 text-xs cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {selectedComponent.name}
              </h3>
              <p className="text-xs text-slate-600 font-normal mt-1 leading-relaxed">
                {selectedComponent.description}
              </p>
            </div>

            <button
              onClick={() => handleToggleComponentInstall(selectedComponent.id)}
              className={`w-full py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer font-bold border ${
                installedComponentIds.has(selectedComponent.id)
                  ? "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200"
                  : "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
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

          <div className="flex items-center justify-between bg-white/95 border border-slate-200 rounded-xl px-5 py-3 shadow-xl backdrop-blur-xl">
            <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-600 font-medium">
              <span>System Bus:</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-semibold">
                LGA1700 / DDR5-6000 / PCIe Gen4
              </span>
            </div>

            <button
              onClick={handleBootSystem}
              disabled={bootState === "booting"}
              className={`px-8 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer active:scale-95 ${
                bootState === "running"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : isAllInstalled
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
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
