export type LearningModel = "deconstruct_rebuild" | "experiment" | "build_connect" | "brain_interactive";

export interface ObjectComponent {
  id: string;
  name: string;
  nodeName: string; // GLTF node name in the 3D asset
  description: string;
  concepts?: string[];
}

export interface ExplorableObject {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  modelPath?: string;
  initialCameraPosition: [number, number, number];
  minDistance: number;
  maxDistance: number;
  components: ObjectComponent[];
}

export interface CircuitExperimentConfig {
  initialVoltage: number; // in Volts
  minVoltage: number;
  maxVoltage: number;
  initialResistance: number; // in Ohms
  minResistance: number;
  maxResistance: number;
  maxCurrentThreshold: number; // in Amps before overheating warning
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  learningModel: LearningModel;
  knowledgeConnections?: string[];
  objects: ExplorableObject[];
  circuitConfig?: CircuitExperimentConfig;
}

export interface Area {
  id: string;
  name: string;
  description: string;
  icon?: string;
  topics: Topic[];
}

