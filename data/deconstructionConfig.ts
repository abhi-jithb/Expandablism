export interface DeconstructedComponent {
  id: string;
  name: string;
  nodeNames: string[];
  explodedPosition: [number, number, number]; // Offset displacement [x, y, z] in world/local space
  description: string;
}

export const MOTORCYCLE_COMPONENTS: DeconstructedComponent[] = [
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
    description: "Converts chemical energy from fuel combustion into mechanical rotational torque."
  },
  {
    id: "frame",
    name: "Chassis Frame",
    nodeNames: ["Frame", "Frame2", "Pedals", "Nuts", "SideCaps"],
    explodedPosition: [0, 0.05, 0],
    description: "Rigid tubular steel structure linking suspension, powertrain, and rider control points."
  },
  {
    id: "fuel-tank",
    name: "Fuel Tank",
    nodeNames: ["tanksCombined", "tanksCombined-Purple Glossy", "TankTail"],
    explodedPosition: [0, 0.85, 0.1],
    description: "Reservoir storing liquid fuel above engine level for optimal weight distribution."
  },
  {
    id: "seat",
    name: "Seat Assembly",
    nodeNames: ["Seat"],
    explodedPosition: [0, 0.75, -0.55],
    description: "Ergonomic leather saddle dampening high-frequency chassis vibrations."
  },
  {
    id: "front-suspension",
    name: "Front Suspension & Steering",
    nodeNames: ["Forks", "Handles", "Cables"],
    explodedPosition: [0, 0.5, 0.95],
    description: "Hydraulic telescopic fork assembly dampening front wheel road impacts."
  },
  {
    id: "wheels",
    name: "Wheel & Tire Assembly",
    nodeNames: ["Wheels", "Tires", "TireRim", "Spokes"],
    explodedPosition: [0.75, 0, 0],
    description: "High-traction spoked wheels transferring drive torque directly to asphalt."
  },
  {
    id: "exhaust",
    name: "Exhaust System",
    nodeNames: ["Exhaust"],
    explodedPosition: [-0.75, -0.2, -0.25],
    description: "Directs high-temperature combustion gases rearward while tuning acoustic exhaust resonance."
  },
  {
    id: "brakes",
    name: "Brake System",
    nodeNames: ["Brakes", "BrakeDiscs", "BreakCables"],
    explodedPosition: [0.6, 0.15, 0.45],
    description: "Hydraulic calipers clamping steel rotors to convert kinetic energy into thermal friction."
  },
  {
    id: "lights",
    name: "Lighting System",
    nodeNames: ["Lights"],
    explodedPosition: [0, 0.45, 1.25],
    description: "High-intensity headlamp and rear indicator light housing."
  }
];

export function getComponentByNodeName(nodeName: string): DeconstructedComponent | undefined {
  return MOTORCYCLE_COMPONENTS.find((comp) => comp.nodeNames.includes(nodeName));
}
