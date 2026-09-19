import { Area } from "@/types/content";

export const AREAS_DATA: Record<string, Area> = {
  vehicles: {
    id: "vehicles",
    name: "Vehicles",
    description: "Mechanical transportation systems and internal combustion machinery.",
    topics: [
      {
        id: "motorcycles",
        name: "Motorcycles",
        description: "Two-wheeled motor vehicles powered by internal combustion or electric motors.",
        learningModel: "deconstruct_rebuild",
        knowledgeConnections: ["Combustion Engine", "Thermodynamics", "Mechanical Power"],
        objects: [
          {
            id: "cafe-racer-motorcycle",
            name: "Cafe Racer Motorcycle",
            subtitle: "4-Stroke Internal Combustion Engineering",
            description: "A classic lightweight motor vehicle optimized for speed and handling. Features an exposed air-cooled engine, steel tubular frame, telescopic fork suspension, and chain drive system.",
            modelPath: "/models/motorcycle.glb",
            initialCameraPosition: [3.5, 1.8, 3.5],
            minDistance: 2.0,
            maxDistance: 8.0,
            components: [
              {
                id: "engine",
                name: "Internal Combustion Engine",
                nodeName: "Engine",
                description: "Generates mechanical power via controlled fuel combustion within cylinders.",
                concepts: ["Combustion", "Thermodynamics", "Stroke Cycle"]
              },
              {
                id: "frame",
                name: "Tubular Chassis Frame",
                nodeName: "Frame",
                description: "Structural backbone linking suspension, engine mount, and body work.",
                concepts: ["Structural Rigidity", "Torsion", "Stress Distribution"]
              },
              {
                id: "exhaust",
                name: "Exhaust Manifold & Pipe",
                nodeName: "Exhaust",
                description: "Routes combustion exhaust gases away from the engine while dampening acoustic noise.",
                concepts: ["Fluid Dynamics", "Backpressure", "Acoustics"]
              },
              {
                id: "wheels",
                name: "Wheel & Tire Assembly",
                nodeName: "Wheels",
                description: "Transfers rotational torque to the road surface, providing grip and directional force.",
                concepts: ["Friction", "Rotational Dynamics", "Tire Traction"]
              },
              {
                id: "suspension",
                name: "Telescopic Fork Suspension",
                nodeName: "Forks",
                description: "Absorbs road impacts and maintains tire contact using hydraulic dampeners and spring coil tension.",
                concepts: ["Damping", "Spring Kinetics", "Hydraulics"]
              },
              {
                id: "fuel-tank",
                name: "Fuel Tank",
                nodeName: "tanksCombined",
                description: "Reservoir storing fuel, positioned over the engine for optimal center-of-mass balance.",
                concepts: ["Fluid Dynamics", "Gravity Feed", "Weight Distribution"]
              }
            ]
          }
        ]
      }
    ]
  },
  physics: {
    id: "physics",
    name: "Physics & Electronics",
    description: "Fundamental laws of electrical circuits, power dissipation, and electromagnetism.",
    topics: [
      {
        id: "circuits",
        name: "Electric Circuit",
        description: "Interactive laboratory exploring potential difference (Voltage), flow rate (Current), and flow restriction (Resistance).",
        learningModel: "experiment",
        knowledgeConnections: ["Ohm's Law", "Electrical Power", "Resistive Heating", "Electromagnetism"],
        circuitConfig: {
          initialVoltage: 12,
          minVoltage: 1,
          maxVoltage: 24,
          initialResistance: 10,
          minResistance: 1,
          maxResistance: 100,
          maxCurrentThreshold: 3.5
        },
        objects: [
          {
            id: "dc-circuit",
            name: "Direct Current Circuit",
            subtitle: "Ohm's Law Interactive Lab (V = I × R)",
            description: "A closed electrical loop transferring chemical potential energy from a battery to light and heat energy in a lamp filament.",
            initialCameraPosition: [0, 4, 6],
            minDistance: 3.0,
            maxDistance: 12.0,
            components: [
              {
                id: "battery",
                name: "DC Power Source (Battery)",
                nodeName: "Battery",
                description: "Maintains potential difference (Voltage) across the circuit terminals.",
                concepts: ["Voltage", "Potential Difference", "Electromotive Force"]
              },
              {
                id: "switch",
                name: "Mechanical Switch",
                nodeName: "Switch",
                description: "Controls circuit continuity by physically opening or closing the conductive path.",
                concepts: ["Circuit Continuity", "Open Circuit", "Closed Circuit"]
              },
              {
                id: "resistor",
                name: "Variable Ceramic Resistor",
                nodeName: "Resistor",
                description: "Restricts charge flow rate (Current) and dissipates excess electrical energy as heat.",
                concepts: ["Resistance", "Ohm's Law", "Joule Heating"]
              },
              {
                id: "bulb",
                name: "Tungsten Filament Lamp",
                nodeName: "Bulb",
                description: "Converts electrical power into incandescent thermal light through filament resistance.",
                concepts: ["Power Dissipation", "Incandescence", "Thermal Radiation"]
              }
            ]
          }
        ]
      }
    ]
  },
  computing: {
    id: "computing",
    name: "Computer Architecture",
    description: "Modular hardware assembly, bus interconnects, and digital system boot sequences.",
    topics: [
      {
        id: "computers",
        name: "Personal Computer Assembly",
        description: "Interactive hardware lab exploring component relationships, socket interconnects, and POST boot sequences.",
        learningModel: "build_connect",
        knowledgeConnections: ["Transistors", "Logic Gates", "Boolean Logic", "System Bus Architecture"],
        objects: [
          {
            id: "workstation-pc",
            name: "Personal Computer System",
            subtitle: "Modular Socket Interconnects & System Boot",
            description: "A high-performance computing system constructed from interconnected semiconductor integrated circuits.",
            initialCameraPosition: [0, 5, 6],
            minDistance: 3.0,
            maxDistance: 12.0,
            components: [
              {
                id: "cpu",
                name: "Central Processing Unit (CPU)",
                nodeName: "CPU",
                description: "Executes machine code instructions and performs arithmetic/logic calculations.",
                concepts: ["Fetch-Decode-Execute", "ALU", "Semiconductor Logic"]
              },
              {
                id: "ram",
                name: "DDR5 High-Speed Memory (RAM)",
                nodeName: "RAM",
                description: "Provides ultra-fast volatile random-access storage for running software instructions.",
                concepts: ["Volatile Memory", "Memory Bus", "Bandwidth"]
              },
              {
                id: "gpu",
                name: "Graphics Processing Unit (GPU)",
                nodeName: "GPU",
                description: "Accelerates parallel matrix transformations for real-time 3D graphics rendering.",
                concepts: ["Parallel Processing", "Shader Core", "PCIe Bus"]
              },
              {
                id: "storage",
                name: "M.2 NVMe Solid State Drive (Storage)",
                nodeName: "Storage",
                description: "Persists operating system binaries and user data using non-volatile NAND flash memory.",
                concepts: ["Non-Volatile Storage", "NAND Flash", "PCIe NVMe Protocol"]
              },
              {
                id: "psu",
                name: "24-Pin Main ATX Power Supply (PSU)",
                nodeName: "PSU",
                description: "Converts AC wall outlet electricity into regulated DC voltage rails (+12V, +5V, +3.3V).",
                concepts: ["Voltage Regulation", "DC Power Rail", "Efficiency Rating"]
              }
            ]
          }
        ]
      }
    ]
  }
};

export function getArea(areaId: string): Area | undefined {
  return AREAS_DATA[areaId];
}

export function getTopic(areaId: string, topicId: string) {
  const area = getArea(areaId);
  return area?.topics.find((t) => t.id === topicId);
}
