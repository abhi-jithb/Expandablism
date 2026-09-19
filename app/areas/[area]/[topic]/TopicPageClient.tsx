"use client";

import React from "react";
import { Topic } from "@/types/content";
import { DeconstructRebuildExperience } from "@/components/experiences/DeconstructRebuildExperience";
import { CircuitExperimentExperience } from "@/components/experiences/CircuitExperimentExperience";

interface TopicPageClientProps {
  area: string;
  topicData: Topic;
}

export function TopicPageClient({ area, topicData }: TopicPageClientProps) {
  switch (topicData.learningModel) {
    case "experiment":
      return <CircuitExperimentExperience area={area} topicData={topicData} />;
    case "deconstruct_rebuild":
    default:
      return <DeconstructRebuildExperience area={area} topicData={topicData} />;
  }
}
