export interface FourStrokeStep {
  id: "intake" | "compression" | "power" | "exhaust";
  name: string;
  action: string;
  description: string;
  pistonPosition: number; // 0 = TDC (top), 1 = BDC (bottom)
  intakeValveOpen: boolean;
  exhaustValveOpen: boolean;
  sparkIgnited: boolean;
}

export interface EngineConceptHotspot {
  id: string;
  name: string;
  description: string;
  position: [number, number, number]; // relative position vector
}

export interface ComponentLearningData {
  componentId: string;
  name: string;
  tagline: string;
  overview: string;
  energyFlow: { step: string; label: string }[];
  fourStrokes: FourStrokeStep[];
  hotspots: EngineConceptHotspot[];
}

export const ENGINE_LEARNING_DATA: ComponentLearningData = {
  componentId: "engine",
  name: "Internal Combustion Engine",
  tagline: "The heart of the motorcycle",
  overview: "Converts chemical energy stored in fuel into mechanical rotational motion to drive the rear wheel.",
  energyFlow: [
    { step: "1", label: "Fuel" },
    { step: "2", label: "Combustion" },
    { step: "3", label: "Pressure" },
    { step: "4", label: "Piston movement" },
    { step: "5", label: "Crankshaft rotation" },
    { step: "6", label: "Mechanical power" }
  ],
  fourStrokes: [
    {
      id: "intake",
      name: "1. Intake Stroke",
      action: "Fuel + Air Mixture Drawn In",
      description: "Intake valve opens. Piston moves downward, drawing atomized fuel and air into the cylinder bore.",
      pistonPosition: 1.0, // Moves down to bottom
      intakeValveOpen: true,
      exhaustValveOpen: false,
      sparkIgnited: false
    },
    {
      id: "compression",
      name: "2. Compression Stroke",
      action: "Mixture Compressed Under High Pressure",
      description: "Both valves close. Piston moves upward, tightly compressing the fuel-air mixture to maximize combustion energy.",
      pistonPosition: 0.0, // Moves up to top
      intakeValveOpen: false,
      exhaustValveOpen: false,
      sparkIgnited: false
    },
    {
      id: "power",
      name: "3. Power Stroke",
      action: "Spark Ignites Fuel -> Rapid Explosion Drives Piston Down",
      description: "Spark plug fires an electric arc. The fuel detonates, creating high-pressure gas expansion that violently drives the piston downward.",
      pistonPosition: 1.0, // Forced down to bottom
      intakeValveOpen: false,
      exhaustValveOpen: false,
      sparkIgnited: true
    },
    {
      id: "exhaust",
      name: "4. Exhaust Stroke",
      action: "Burnt Waste Gases Evacuated",
      description: "Exhaust valve opens. Piston moves upward, sweeping spent combustion gases out through the exhaust manifold.",
      pistonPosition: 0.0, // Sweeps up to top
      intakeValveOpen: false,
      exhaustValveOpen: true,
      sparkIgnited: false
    }
  ],
  hotspots: [
    {
      id: "cylinder",
      name: "Cylinder Bore",
      description: "Sealed chamber where fuel combustion and piston displacement take place.",
      position: [0, 0.2, 0]
    },
    {
      id: "piston",
      name: "Piston & Connecting Rod",
      description: "Reciprocating plug that converts gas pressure into linear push/pull force.",
      position: [0, 0.0, 0]
    },
    {
      id: "spark-plug",
      name: "Spark Plug",
      description: "High-voltage electrode firing electric sparks to ignite compressed fuel.",
      position: [0, 0.45, 0]
    },
    {
      id: "crankshaft",
      name: "Crankshaft",
      description: "Rotational shaft converting up-and-down piston thrust into continuous rotary power.",
      position: [0, -0.3, 0]
    },
    {
      id: "valves",
      name: "Intake & Exhaust Valves",
      description: "Precision poppet valves regulating fuel entry and exhaust gas evacuation.",
      position: [0, 0.38, 0.15]
    }
  ]
};

export const LEARNING_CONTENT_MAP: Record<string, ComponentLearningData> = {
  engine: ENGINE_LEARNING_DATA
};
