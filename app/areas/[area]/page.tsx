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
      <main className="min-h-screen bg-slate-950 text-slate-200 px-6 py-12 flex flex-col items-center justify-center">
        <div className="max-w-md text-center">
          <Link
            href="/"
            className="text-xs font-mono text-blue-400 hover:text-blue-300 transition tracking-wider uppercase mb-6 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight mb-3">Area Not Found</h1>
          <p className="text-slate-400 text-sm">
            The requested knowledge domain is currently unavailable.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Header Chrome */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="text-slate-400 hover:text-slate-200 text-xs font-mono transition uppercase"
            >
              HOME
            </Link>
            <span className="text-slate-600 font-mono text-xs">/</span>
            <span className="text-blue-400 font-mono text-xs tracking-wide uppercase">
              {areaData.name}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-3xl mb-12">
          <span className="inline-block text-[10px] font-mono text-blue-400 uppercase tracking-widest px-2.5 py-1 rounded bg-blue-950/60 border border-blue-800/40 mb-3">
            KNOWLEDGE DOMAIN // {areaData.id.toUpperCase()}
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-100 sm:text-5xl">
            {areaData.name}
          </h1>
          <p className="mt-3 text-slate-400 text-base leading-relaxed">
            {areaData.description}
          </p>
        </div>

        <div>
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-6">
            Select Exploration Topic
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areaData.topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/areas/${areaData.id}/${topic.id}`}
                className="group relative rounded-xl border border-slate-800/80 bg-slate-900/40 p-6 transition duration-300 hover:border-blue-500/50 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">
                      TOPIC // {topic.id.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-slate-400 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
                    {topic.name}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    {topic.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{topic.objects.length} OBJECT EXPLORABLE</span>
                  <span className="text-blue-400 group-hover:underline">OPEN LAB</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}