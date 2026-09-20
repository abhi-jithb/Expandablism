import Link from "next/link";
import { getArea } from "@/data/content";

export default async function AreaPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area } = await params;
  const areaData = getArea(area);

  if (!areaData) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center justify-center font-sans select-none">
        <div className="max-w-md text-center">
          <Link
            href="/"
            className="text-xs font-mono text-zinc-400 hover:text-white transition tracking-wider uppercase mb-6 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-light text-white tracking-tight mb-3">Area Not Found</h1>
          <p className="text-zinc-400 text-sm font-light">
            The requested knowledge domain is currently unavailable.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-35 pointer-events-none z-0"></div>

      {/* Header Chrome */}
      <header className="border-b border-zinc-900 bg-black/90 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="text-zinc-400 hover:text-white text-xs font-mono transition uppercase"
            >
              HOME
            </Link>
            <span className="text-zinc-700 font-mono text-xs">/</span>
            <span className="text-white font-mono text-xs tracking-wide uppercase">
              {areaData.name}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-3xl mb-16">
          <span className="inline-block text-[10px] font-mono text-zinc-400 uppercase tracking-widest px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 mb-4">
            KNOWLEDGE DOMAIN // {areaData.id.toUpperCase()}
          </span>
          <h1 className="text-4xl font-light tracking-tight text-white sm:text-6xl">
            {areaData.name}
          </h1>
          <p className="mt-4 text-zinc-400 text-base font-light leading-relaxed">
            {areaData.description}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-8 border-b border-zinc-900 pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              Select Exploration Topic
            </span>
            <span className="text-xs font-mono text-zinc-500">{areaData.topics.length} TOPICS ACTIVE</span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areaData.topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/areas/${areaData.id}/${topic.id}`}
                className="group relative rounded-2xl border border-zinc-800/80 bg-[#09090b] p-8 transition-all duration-300 hover:border-white hover:bg-[#111114] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                      TOPIC // {topic.id.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>

                  <h3 className="text-2xl font-light text-white group-hover:text-white transition-colors">
                    {topic.name}
                  </h3>

                  <p className="mt-3 text-sm text-zinc-400 leading-relaxed font-light">
                    {topic.description}
                  </p>
                </div>

                <div className="mt-10 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span>{topic.objects.length} OBJECT EXPLORABLE</span>
                  <span className="text-zinc-200 group-hover:text-white font-semibold">OPEN LAB →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}