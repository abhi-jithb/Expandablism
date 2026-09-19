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
  }
};

export function getArea(areaId: string): Area | undefined {
  return AREAS_DATA[areaId];
}

export function getTopic(areaId: string, topicId: string) {
  const area = getArea(areaId);
  return area?.topics.find((t) => t.id === topicId);
}
