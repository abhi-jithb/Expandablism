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
      <div className="bg-[#09090b]/90 border border-slate-800/90 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden font-sans">
        {/* Toolbox Header Strip */}
        <div className="px-5 py-3 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-300 font-bold">
              🧰 {title}
            </span>
            <span className="text-[10px] font-mono text-slate-500 border-l border-slate-800 pl-3">
              {inToolboxCount} / {items.length} Parts Ready
            </span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-mono text-slate-400 hover:text-white transition flex items-center space-x-1 cursor-pointer"
          >
            <span>{isOpen ? "Collapse Tray ▲" : "Open Toolbox ▼"}</span>
          </button>
        </div>

        {/* Expandable Toolbox Drawer */}
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
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                {items.map((item) => {
                  const isSelected = item.id === selectedItemId;
                  const isConnected = item.status === "connected";

                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectItem(item.id)}
                      className={`p-3 rounded-xl text-left transition cursor-pointer border flex flex-col justify-between space-y-1 relative ${
                        isSelected
                          ? "bg-white text-slate-950 border-white shadow-lg font-bold"
                          : isConnected
                          ? "bg-emerald-950/30 text-emerald-300 border-emerald-900/60 hover:border-emerald-700"
                          : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[9px] font-mono uppercase tracking-wider opacity-75">
                          {item.iconTag || item.id}
                        </span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isConnected
                              ? "bg-emerald-400"
                              : isSelected
                              ? "bg-slate-950"
                              : "bg-slate-600"
                          }`}
                        ></span>
                      </div>

                      <span className="text-xs tracking-tight truncate w-full font-medium">
                        {item.name}
                      </span>

                      <span
                        className={`text-[9px] font-mono ${
                          isSelected
                            ? "text-slate-700"
                            : isConnected
                            ? "text-emerald-400"
                            : "text-slate-500"
                        }`}
                      >
                        {isConnected ? "CONNECTED" : "IN TOOLBOX"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Part Real-World Inspector Bar */}
              {selectedItem && (
                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-slate-900/30 p-3 rounded-xl">
                  <div className="space-y-0.5 max-w-xl">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white tracking-wide">{selectedItem.name}</span>
                      {selectedItem.concepts && (
                        <div className="flex gap-1">
                          {selectedItem.concepts.slice(0, 2).map((c) => (
                            <span
                              key={c}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                            >
                              #{c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-light leading-relaxed line-clamp-1">
                      {selectedItem.description}
                    </p>
                  </div>

                  {onActionItem && (
                    <button
                      onClick={() => onActionItem(selectedItem.id)}
                      className="px-5 py-2 rounded-full bg-white text-slate-950 font-mono text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition active:scale-95 cursor-pointer whitespace-nowrap self-end sm:self-auto"
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
