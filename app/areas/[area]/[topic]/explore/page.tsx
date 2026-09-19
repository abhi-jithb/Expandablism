"use client";

import { useState } from "react";
import Link from "next/link";
import MotorcycleSVG from "@/components/MotorcycleSVG";

const knowledge = {
  rearWheel: {
    name: "Rear Wheel",
    description: "Transfers the motorcycle's motion to the road.",
  },
  frontWheel: {
    name: "Front Wheel",
    description: "Guides the motorcycle and supports the front of the vehicle.",
  },
  frame: {
    name: "Frame",
    description: "The structural backbone that connects major components.",
  },
  engine: {
    name: "Engine",
    description: "Converts chemical energy from fuel into mechanical motion.",
  },
  fuelTank: {
    name: "Fuel Tank",
    description: "Stores the fuel used by the engine.",
  },
  seat: {
    name: "Seat",
    description: "Supports the rider during operation.",
  },
  handlebar: {
    name: "Handlebar",
    description: "Allows the rider to steer the motorcycle.",
  },
  frontSuspension: {
    name: "Front Suspension",
    description: "Absorbs impacts and helps keep the front wheel controlled.",
  },
  rearSuspension: {
    name: "Rear Suspension",
    description: "Absorbs road impacts at the rear of the motorcycle.",
  },
  exhaust: {
    name: "Exhaust",
    description: "Carries combustion gases away from the engine.",
  },
  brake: {
    name: "Brake System",
    description: "Slows and stops the motorcycle.",
  },
} as const;

type Part = keyof typeof knowledge;

export default function ExplorePage() {
  const [exploded, setExploded] = useState(false);
  const [selected, setSelected] = useState<Part | null>(null);

  return (
    <main className="min-h-screen bg-[#090909] px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <Link
            href="/areas/vehicles/motorcycles"
            className="text-sm text-zinc-500 transition hover:text-white"
          >
            ← Back to Motorcycles
          </Link>

          <button
            onClick={() => {
              setExploded(!exploded);
              setSelected(null);
            }}
            className="rounded-xl border border-zinc-700 px-5 py-3 text-sm transition hover:border-white"
          >
            {exploded ? "Reassemble" : "Deconstruct"}
          </button>
        </div>

        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Explore
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Motorcycle
          </h1>
        </div>

        <div className="relative mt-8 min-h-[650px] overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black">
          <div className="absolute inset-4">
            <MotorcycleSVG
              exploded={exploded}
              selected={selected}
              onPartClick={(part) => {
                if (!exploded) return;
                setSelected(part as Part);
              }}
            />
          </div>

          {!exploded && (
            <button
              onClick={() => setExploded(true)}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition hover:scale-105"
            >
              Click to deconstruct
            </button>
          )}
        </div>

        {selected && (
          <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Component
            </p>

            <h2 className="mt-3 text-3xl font-semibold">
              {knowledge[selected].name}
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
              {knowledge[selected].description}
            </p>

            <button className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black">
              Learn more →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}