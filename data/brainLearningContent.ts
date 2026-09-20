export interface BrainRegionInfo {
  id: string;
  name: string;
  scientificTerm: string;
  analogy: string;
  role: string;
  description: string;
  position: [number, number, number];
  color: string;
  keyPhenomena: {
    title: string;
    description: string;
    impact: string;
    solution: string;
  }[];
}

export interface BrainStateConfig {
  id: "baseline" | "cortisol_hijack" | "dopamine_burnout" | "deep_focus" | "glymphatic_wash";
  name: string;
  tagline: string;
  description: string;
  activeColor: string;
  neurotransmitters: {
    dopamine: number; // 0-100
    cortisol: number; // 0-100
    serotonin: number; // 0-100
    acetylcholine: number; // 0-100
  };
  dominantWave: "Alpha (8-12Hz)" | "Beta (13-30Hz)" | "Gamma (30-100Hz)" | "Delta (0.5-4Hz)";
}

export interface SynapticPuzzleNode {
  id: string;
  label: string;
  regionId: string;
  position: [number, number, number];
}

export interface SynapticPuzzleConnection {
  from: string;
  to: string;
  label: string;
}

export interface SynapticPuzzleLevel {
  id: string;
  title: string;
  subtitle: string;
  objective: string;
  brokenScenario: string;
  nodes: SynapticPuzzleNode[];
  requiredConnections: SynapticPuzzleConnection[];
  targetNeurotransmitters: {
    dopamine: [number, number]; // [min, max]
    cortisol: [number, number];
    serotonin: [number, number];
    acetylcholine: [number, number];
  };
  keyTakeaway: string;
}

export interface TopicBrainContent {
  topicId: string;
  title: string;
  subtitle: string;
  overview: string;
  brainRegions: BrainRegionInfo[];
  availableStates: BrainStateConfig[];
  puzzleLevel: SynapticPuzzleLevel;
}

export const BRAIN_REGIONS: BrainRegionInfo[] = [
  {
    id: "prefrontal_cortex",
    name: "Prefrontal Cortex",
    scientificTerm: "Brodmann Area 9/10/11/46",
    analogy: "The Chief Executive Officer (CEO) of the Brain",
    role: "Decision making, emotional regulation, working memory, and impulse control.",
    description: "Responsible for complex cognitive behavior, personality expression, decision making, and moderating social behavior. Easily shut down during extreme acute stress.",
    position: [0, 0.4, 0.9],
    color: "#38bdf8", // Cyan / Sky Blue
    keyPhenomena: [
      {
        title: "Cortisol Hijack (Prefrontal Shutdown)",
        description: "When high stress spikes cortisol levels, the Amygdala overrides the Prefrontal Cortex, causing emotional reactivity and brain fog.",
        impact: "Loss of clear decision making, working memory reduction, and reactive panic.",
        solution: "Diaphragmatic breathing (physiological sigh) triggers the vagus nerve to suppress cortisol and re-engage the prefrontal cortex."
      },
      {
        title: "Executive Reserve & Decision Fatigue",
        description: "Making continuous trivial choices consumes glucose and neurotransmitters in the PFC.",
        impact: "Willpower depletion and impulsive behavior late in the day.",
        solution: "Routine automation, time-blocking, and taking structured non-screen micro-rests."
      }
    ]
  },
  {
    id: "amygdala",
    name: "Amygdala",
    scientificTerm: "Corpus Amygdaloideum",
    analogy: "The 24/7 Threat & Alarm Detector",
    role: "Processes fear, threat signals, survival instincts, and emotional memories.",
    description: "An almond-shaped structure deep in the temporal lobe. Scans incoming sensory data for danger 100 milliseconds faster than conscious awareness.",
    position: [-0.4, -0.1, 0.2],
    color: "#ef4444", // Crimson Red
    keyPhenomena: [
      {
        title: "Digital Threat Illusion & Doomscrolling",
        description: "Constant exposure to negative news or social comparison tricks the Amygdala into perceiving continuous existential threat.",
        impact: "Chronic low-grade anxiety, elevated baseline heart rate, and muscular tension.",
        solution: "Digital boundary setting and grounding physical exercises to signal physical safety."
      }
    ]
  },
  {
    id: "hippocampus",
    name: "Hippocampus",
    scientificTerm: "Cornu Ammonis",
    analogy: "The Master RAM & Memory Indexing Center",
    role: "Converts short-term working memory into long-term stored knowledge.",
    description: "Seahorse-shaped structure critical for spatial navigation and episodic memory consolidation. Highly vulnerable to sleep deprivation.",
    position: [0.4, -0.2, 0.0],
    color: "#10b981", // Emerald Green
    keyPhenomena: [
      {
        title: "Synaptic Plasticity & Long-Term Potentiation (LTP)",
        description: "Repetitive focused learning strengthens chemical connections between hippocampal neurons ('neurons that fire together, wire together').",
        impact: "Rapid acquisition of complex physical and conceptual skills.",
        solution: "Spaced repetition practice and active recall resting intervals."
      },
      {
        title: "Glymphatic Wash & Memory Encoding",
        description: "During NREM slow-wave sleep, hippocampal memories are transferred to the neocortex while toxic metabolic waste is cleared.",
        impact: "Sleep loss prevents memory consolidation, causing rapid forgetting.",
        solution: "Prioritize 7-8 hours of uninterrupted sleep for memory retention."
      }
    ]
  },
  {
    id: "synaptic_network",
    name: "Synaptic Terminals & Neuro-Pathways",
    scientificTerm: "Synaptic Cleft & Axonal Terminals",
    analogy: "High-Speed Fiber-Optic Cables & Chemical Bridges",
    role: "Transmits bio-electric action potentials across microscopic chemical gaps via neurotransmitters.",
    description: "Trillions of microscopic junctions where electrical impulses trigger chemical neurotransmitter release (Dopamine, Serotonin, Acetylcholine).",
    position: [0.0, 0.6, -0.2],
    color: "#a855f7", // Purple / Violet
    keyPhenomena: [
      {
        title: "Dopamine Receptor Downregulation",
        description: "Frequent high-dopamine digital spikes (short-form videos, notifications) cause synapses to remove dopamine D2 receptors.",
        impact: "Normal activities feel boring; inability to sustain deep focus on complex tasks.",
        solution: "Dopamine reset periods (deliberate low-stimulation time) to restore receptor sensitivity."
      },
      {
        title: "Acetylcholine Focus Laser",
        description: "Acetylcholine release marks specific active neural circuits for structural reinforcement during rest.",
        impact: "High mental clarity and rapid signal transmission during visual focus.",
        solution: "Unbroken intense focus bursts (25-45 minutes) targeting a single objective."
      }
    ]
  }
];

export const BRAIN_STATES: BrainStateConfig[] = [
  {
    id: "baseline",
    name: "Calm Equilibrium",
    tagline: "Balanced neural signaling",
    description: "Optimal balance between executive control, relaxation, and alertness.",
    activeColor: "#38bdf8",
    neurotransmitters: { dopamine: 65, cortisol: 20, serotonin: 75, acetylcholine: 60 },
    dominantWave: "Alpha (8-12Hz)"
  },
  {
    id: "cortisol_hijack",
    name: "Cortisol Hijack (High Stress)",
    tagline: "Fight-or-Flight Amygdala Overdrive",
    description: "Stress hormone surge suppresses the Prefrontal Cortex, triggering panic and tunnel vision.",
    activeColor: "#ef4444",
    neurotransmitters: { dopamine: 30, cortisol: 95, serotonin: 25, acetylcholine: 40 },
    dominantWave: "Beta (13-30Hz)"
  },
  {
    id: "dopamine_burnout",
    name: "Dopamine Receptor Burnout",
    tagline: "Overstimulation & Brain Fog",
    description: "Excessive high-frequency reward spikes cause synaptic desensitization and lethargy.",
    activeColor: "#f59e0b",
    neurotransmitters: { dopamine: 15, cortisol: 60, serotonin: 30, acetylcholine: 25 },
    dominantWave: "Beta (13-30Hz)"
  },
  {
    id: "deep_focus",
    name: "Deep Focus (Flow State)",
    tagline: "Acetylcholine & Gamma Synchrony",
    description: "High signal-to-noise ratio in Prefrontal Cortex with suppressed distraction background noise.",
    activeColor: "#10b981",
    neurotransmitters: { dopamine: 80, cortisol: 25, serotonin: 70, acetylcholine: 90 },
    dominantWave: "Gamma (30-100Hz)"
  },
  {
    id: "glymphatic_wash",
    name: "Glymphatic Sleep Wash",
    tagline: "Deep Sleep Neural Restoration",
    description: "Cerebrospinal fluid surges through brain tissue clearing metabolic waste and consolidating memory.",
    activeColor: "#8b5cf6",
    neurotransmitters: { dopamine: 20, cortisol: 10, serotonin: 85, acetylcholine: 30 },
    dominantWave: "Delta (0.5-4Hz)"
  }
];

export const TOPIC_BRAIN_CONTENT_MAP: Record<string, TopicBrainContent> = {
  neuroscience: {
    topicId: "neuroscience",
    title: "Brain Neural Circuits & Reactions",
    subtitle: "Explore Amygdala Stress Hijacks, Dopamine Downregulation & Synaptic Firing",
    overview: "Discover how real-world stressors, digital reward loops, and neural signals physically alter brain chemistry and cognitive clarity.",
    brainRegions: BRAIN_REGIONS,
    availableStates: BRAIN_STATES,
    puzzleLevel: {
      id: "puzzle-neuroscience-1",
      title: "Synaptic Repair: Reset Cortisol Hijack & Restore Focus",
      subtitle: "Re-wire the Prefrontal Circuit & Balance Neurotransmitters",
      objective: "Connect the executive signal path from Amygdala -> Prefrontal Cortex -> Synapse, and balance neurotransmitters to restore high cognitive clarity.",
      brokenScenario: "High stress has severed the Prefrontal Executive link. Cortisol is elevated at 95%, blocking logical decision making.",
      nodes: [
        { id: "node-amygdala", label: "Amygdala Threat Node", regionId: "amygdala", position: [-0.4, -0.1, 0.2] },
        { id: "node-pfc", label: "Prefrontal Control Center", regionId: "prefrontal_cortex", position: [0, 0.4, 0.9] },
        { id: "node-synapse", label: "Synaptic Focus Terminal", regionId: "synaptic_network", position: [0.0, 0.6, -0.2] },
        { id: "node-hippo", label: "Hippocampal Memory Bridge", regionId: "hippocampus", position: [0.4, -0.2, 0.0] }
      ],
      requiredConnections: [
        { from: "node-amygdala", to: "node-pfc", label: "Vagal Dampening Signal" },
        { from: "node-pfc", to: "node-synapse", label: "Acetylcholine Focus Impulse" },
        { from: "node-synapse", to: "node-hippo", label: "LTP Memory Consolidation" }
      ],
      targetNeurotransmitters: {
        dopamine: [60, 85],
        cortisol: [10, 30],
        serotonin: [60, 90],
        acetylcholine: [70, 95]
      },
      keyTakeaway: "By dampening Amygdala panic signals and elevating Acetylcholine while lowering Cortisol, the Prefrontal Cortex regains executive command!"
    }
  },
  "cognitive-states": {
    topicId: "cognitive-states",
    title: "Cognitive Focus & Brain Restoration",
    subtitle: "Default Mode Network, Glymphatic Wash & Synaptic Plasticity",
    overview: "Understand how brain wave synchronization, deep sleep cleansing, and spaced learning physically build long-term intelligence.",
    brainRegions: BRAIN_REGIONS,
    availableStates: BRAIN_STATES,
    puzzleLevel: {
      id: "puzzle-cognitive-1",
      title: "Synaptic Repair: Construct Deep Sleep Memory Consolidation",
      subtitle: "Synchronize Hippocampal Transfer & Activate Glymphatic Wash",
      objective: "Route neural memory signals from Hippocampus -> Synaptic Terminal -> Prefrontal Cortex and achieve Delta Wave sleep equilibrium.",
      brokenScenario: "Sleep deprivation has blocked metabolic waste clearance and disrupted memory transfer between the Hippocampus and Cortical storage.",
      nodes: [
        { id: "node-hippo", label: "Hippocampal Memory Storage", regionId: "hippocampus", position: [0.4, -0.2, 0.0] },
        { id: "node-synapse", label: "Synaptic Wash Gateway", regionId: "synaptic_network", position: [0.0, 0.6, -0.2] },
        { id: "node-pfc", label: "Neocortical Storage Vault", regionId: "prefrontal_cortex", position: [0, 0.4, 0.9] },
        { id: "node-amygdala", label: "Calm Emotion Regulator", regionId: "amygdala", position: [-0.4, -0.1, 0.2] }
      ],
      requiredConnections: [
        { from: "node-hippo", to: "node-synapse", label: "Memory Replay Transfer" },
        { from: "node-synapse", to: "node-pfc", label: "Long-Term Neocortical Encoding" },
        { from: "node-amygdala", to: "node-synapse", label: "Emotional Balance Feedback" }
      ],
      targetNeurotransmitters: {
        dopamine: [30, 60],
        cortisol: [5, 20],
        serotonin: [75, 95],
        acetylcholine: [50, 80]
      },
      keyTakeaway: "Deep slow-wave sleep flushes out neuro-toxic waste while transferring fragile working memories into permanent neocortical storage."
    }
  }
};
