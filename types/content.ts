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
  modelPath: string;
  initialCameraPosition: [number, number, number];
  minDistance: number;
  maxDistance: number;
  components: ObjectComponent[];
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  objects: ExplorableObject[];
}

export interface Area {
  id: string;
  name: string;
  description: string;
  icon?: string;
  topics: Topic[];
}
