import React from "react";
import Link from "next/link";
import { getTopic } from "@/data/content";
import { TopicPageClient } from "./TopicPageClient";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ area: string; topic: string }>;
}) {
  const { area, topic } = await params;
  const topicData = getTopic(area, topic);

  if (!topicData || topicData.objects.length === 0) {
    return (
      <main className="min-h-screen bg-[#070709] text-slate-200 px-6 py-12 flex flex-col items-center justify-center select-none">
        <div className="max-w-md text-center">
          <Link
            href={`/areas/${area}`}
            className="text-xs font-mono text-slate-400 hover:text-white transition tracking-wider uppercase mb-6 inline-block"
          >
            ← Back to {area}
          </Link>
          <h1 className="text-2xl font-light text-slate-100 tracking-tight mb-3">Topic Unavailable</h1>
          <p className="text-slate-400 text-xs leading-relaxed">
            The requested exploration domain is currently under development.
          </p>
        </div>
      </main>
    );
  }

  return <TopicPageClient area={area} topicData={topicData} />;
}