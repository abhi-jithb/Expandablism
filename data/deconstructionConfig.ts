export interface DeconstructedComponent {
  id: string;
  name: string;
  nodeNames: string[];
  explodedPosition: [number, number, number]; // Offset in exploded view mode
  puzzleScatterPosition: [number, number, number]; // Scattered offset in rebuild puzzle mode
  targetPosition: [number, number, number]; // Target offset in assembled state ([0,0,0])
  description: string;
  requiredForRebuild: boolean;
}

export const MOTORCYCLE_COMPONENTS: DeconstructedComponent[] = [
  {
    id: "frame",
    name: "Chassis Frame",
    nodeNames: ["Frame", "Frame2", "Pedals", "Nuts", "SideCaps"],
    explodedPosition: [0, 0.05, 0],
    puzzleScatterPosition: [0, -0.4, -0.2], // Center foundation piece
    targetPosition: [0, 0, 0],
    description: "Rigid tubular steel structure linking suspension, powertrain, and rider control points.",
    requiredForRebuild: true
  },
  {
    id: "engine",
    name: "Internal Combustion Engine",
    nodeNames: [
      "Engine",
      "Carburator",
      "CarburatorSeal",
      "AirBox?",
      "RadiatorTube",
      "Radiator",
      "GasLine"
    ],
    explodedPosition: [0, -0.15, 0.5],
    puzzleScatterPosition: [0, 0.65, 0.9], // Upper front right
    targetPosition: [0, 0, 0],
    description: "Converts chemical energy from fuel combustion into mechanical rotational torque.",
    requiredForRebuild: true
  },
  {
    id: "fuel-tank",
    name: "Fuel Tank",
    nodeNames: ["tanksCombined", "tanksCombined-Purple Glossy", "TankTail"],
    explodedPosition: [0, 0.85, 0.1],
    puzzleScatterPosition: [0, 1.1, -0.4], // High top left
    targetPosition: [0, 0, 0],
    description: "Reservoir storing liquid fuel above engine level for optimal weight distribution.",
    requiredForRebuild: true
  },
  {
    id: "seat",
    name: "Seat Assembly",
    nodeNames: ["Seat"],
    explodedPosition: [0, 0.75, -0.55],
    puzzleScatterPosition: [0, 0.9, -1.1], // High rear left
    targetPosition: [0, 0, 0],
    description: "Ergonomic leather saddle dampening high-frequency chassis vibrations.",
    requiredForRebuild: true
  },
  {
    id: "front-suspension",
    name: "Front Suspension & Steering",
    nodeNames: ["Forks", "Handles", "Cables"],
    explodedPosition: [0, 0.5, 0.95],
    puzzleScatterPosition: [0.8, 0.7, 1.0], // Front right upper
    targetPosition: [0, 0, 0],
    description: "Hydraulic telescopic fork assembly dampening front wheel road impacts.",
    requiredForRebuild: true
  },
  {
    id: "wheels",
    name: "Wheel & Tire Assembly",
    nodeNames: ["Wheels", "Tires", "TireRim", "Spokes"],
    explodedPosition: [0.75, 0, 0],
    puzzleScatterPosition: [1.2, -0.3, 0.4], // Far right lower
    targetPosition: [0, 0, 0],
    description: "High-traction spoked wheels transferring drive torque directly to asphalt.",
    requiredForRebuild: true
  },
  {
    id: "exhaust",
    name: "Exhaust System",
    nodeNames: ["Exhaust"],
    explodedPosition: [-0.75, -0.2, -0.25],
    puzzleScatterPosition: [-1.1, -0.4, -0.6], // Lower rear left
    targetPosition: [0, 0, 0],
    description: "Directs high-temperature combustion gases rearward while tuning acoustic exhaust resonance.",
    requiredForRebuild: true
  },
  {
    id: "brakes",
    name: "Brake System",
    nodeNames: ["Brakes", "BrakeDiscs", "BreakCables"],
    explodedPosition: [0.6, 0.15, 0.45],
    puzzleScatterPosition: [-0.9, 0.3, 0.7], // Mid front left
    targetPosition: [0, 0, 0],
    description: "Hydraulic calipers clamping steel rotors to convert kinetic energy into thermal friction.",
    requiredForRebuild: true
  },
  {
    id: "lights",
    name: "Lighting System",
    nodeNames: ["Lights"],
    explodedPosition: [0, 0.45, 1.25],
    puzzleScatterPosition: [0, 0.5, 1.4],
    targetPosition: [0, 0, 0],
    description: "High-intensity headlamp and rear indicator light housing.",
    requiredForRebuild: false
  }
];

export function getComponentByNodeName(nodeName: string): DeconstructedComponent | undefined {
  return MOTORCYCLE_COMPONENTS.find((comp) => comp.nodeNames.includes(nodeName));
}

export const REBUILD_REQUIRED_COMPONENTS = MOTORCYCLE_COMPONENTS.filter(
  (c) => c.requiredForRebuild
);
