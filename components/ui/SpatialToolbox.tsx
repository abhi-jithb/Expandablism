"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ToolboxItem {
  id: string;
  name: string;
  nodeName?: string;
  description: string;
  concepts?: string[];
  status: "in_toolbox" | "connected" | "explored";
  iconTag?: string;
}

interface SpatialToolboxProps {
  title?: string;
  items: ToolboxItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
  onActionItem?: (id: string) => void;
  actionLabel?: string;
  actionVariant?: "connect" | "explore";
}

export function SpatialToolbox({
  title = "LABORATORY TOOLBOX",
  items,
  selectedItemId,
  onSelectItem,
  onActionItem,
  actionLabel = "Connect Part",
}: SpatialToolboxProps) {
  const [isOpen, setIsOpen] = useState(true);

  const selectedItem = items.find((i) => i.id === selectedItemId) || items[0];
  const inToolboxCount = items.filter((i) => i.status === "in_toolbox").length;

  return (
    <div className="w-full pointer-events-auto">
      <div className="bg-[#09090b]/95 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden font-sans">
        {/* Toolbox Header Strip */}
        <div className="px-5 py-3 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-200 font-bold">
              🧰 {title}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 border-l border-zinc-800 pl-3">
              {inToolboxCount} / {items.length} Ready
            </span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-mono text-zinc-400 hover:text-white transition flex items-center space-x-1 cursor-pointer"
          >
            <span>{isOpen ? "Collapse Tray ▲" : "Open Toolbox ▼"}</span>
          </button>
        </div>

        {/* Expandable Drawer */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="p-4 space-y-3"
            >
              {/* Horizontal Parts Inventory Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-36 overflow-y-auto pr-1">
                {items.map((item) => {
                  const isSelected = item.id === selectedItemId;
                  const isConnected = item.status === "connected";

                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectItem(item.id)}
                      className={`p-3 rounded-xl text-left transition cursor-pointer border flex flex-col justify-between space-y-1 relative ${
                        isSelected
                          ? "bg-white text-black border-white shadow-lg font-bold"
                          : isConnected
                          ? "bg-zinc-900 text-zinc-200 border-zinc-700 hover:border-zinc-500"
                          : "bg-zinc-950 text-zinc-400 border-zinc-800/90 hover:border-zinc-700 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[9px] font-mono uppercase tracking-wider opacity-75">
                          {item.iconTag || item.id}
                        </span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isConnected
                              ? "bg-zinc-400"
                              : isSelected
                              ? "bg-black"
                              : "bg-zinc-700"
                          }`}
                        ></span>
                      </div>

                      <span className="text-xs tracking-tight truncate w-full font-medium">
                        {item.name}
                      </span>

                      <span
                        className={`text-[9px] font-mono ${
                          isSelected
                            ? "text-zinc-700"
                            : isConnected
                            ? "text-zinc-300"
                            : "text-zinc-500"
                        }`}
                      >
                        {isConnected ? "CONNECTED" : "IN TOOLBOX"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Part Inspector Bar */}
              {selectedItem && (
                <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-zinc-950/90 p-3 rounded-xl border border-zinc-800/60">
                  <div className="space-y-0.5 max-w-xl">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white tracking-wide">{selectedItem.name}</span>
                      {selectedItem.concepts && (
                        <div className="flex gap-1">
                          {selectedItem.concepts.slice(0, 2).map((c) => (
                            <span
                              key={c}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
                            >
                              #{c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 font-light leading-relaxed line-clamp-1">
                      {selectedItem.description}
                    </p>
                  </div>

                  {onActionItem && (
                    <button
                      onClick={() => onActionItem(selectedItem.id)}
                      className="px-5 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition cursor-pointer whitespace-nowrap self-end sm:self-auto shadow-md"
                    >
                      {actionLabel}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
