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
      <div className="bg-white/95 border border-slate-200 rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden font-sans">
        {/* Toolbox Header Strip */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-800 font-bold">
              🧰 {title}
            </span>
            <span className="text-[10px] font-mono text-slate-500 border-l border-slate-300 pl-3">
              {inToolboxCount} / {items.length} Ready
            </span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-mono text-slate-600 hover:text-slate-900 transition flex items-center space-x-1 cursor-pointer font-medium"
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
              className="p-4 space-y-3 bg-slate-50/50"
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
                      className={`p-3 rounded-xl text-left transition cursor-pointer border flex flex-col justify-between space-y-1 relative shadow-sm ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-md font-bold"
                          : isConnected
                          ? "bg-emerald-50 text-emerald-900 border-emerald-300 hover:border-emerald-400"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[9px] font-mono uppercase tracking-wider opacity-75">
                          {item.iconTag || item.id}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isConnected
                              ? "bg-emerald-500"
                              : isSelected
                              ? "bg-sky-400"
                              : "bg-slate-400"
                          }`}
                        ></span>
                      </div>

                      <span className="text-xs tracking-tight truncate w-full font-semibold">
                        {item.name}
                      </span>

                      <span
                        className={`text-[9px] font-mono ${
                          isSelected
                            ? "text-slate-300"
                            : isConnected
                            ? "text-emerald-700 font-bold"
                            : "text-slate-500"
                        }`}
                      >
                        {isConnected ? "CONNECTED ✓" : "IN TOOLBOX"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Part Inspector Bar */}
              {selectedItem && (
                <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 tracking-wide text-sm">{selectedItem.name}</span>
                      {selectedItem.concepts && (
                        <div className="flex gap-1">
                          {selectedItem.concepts.slice(0, 2).map((c) => (
                            <span
                              key={c}
                              className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                            >
                              #{c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-[12px] text-slate-600 font-normal leading-relaxed line-clamp-1">
                      {selectedItem.description}
                    </p>
                  </div>

                  {onActionItem && (
                    <button
                      onClick={() => onActionItem(selectedItem.id)}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition cursor-pointer whitespace-nowrap self-end sm:self-auto shadow-md"
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
