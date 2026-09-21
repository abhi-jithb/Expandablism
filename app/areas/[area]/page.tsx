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
      <main className="min-h-screen bg-slate-50 text-slate-900 px-6 py-12 flex flex-col items-center justify-center font-sans select-none">
        <div className="max-w-md text-center">
          <Link
            href="/"
            className="text-xs font-mono text-slate-500 hover:text-slate-900 transition tracking-wider uppercase mb-6 inline-block font-semibold"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Area Not Found</h1>
          <p className="text-slate-600 text-sm font-normal">
            The requested knowledge domain is currently unavailable.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white font-sans relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-60 pointer-events-none z-0"></div>

      {/* Header Chrome */}
      <header className="border-b border-slate-200 bg-white/80 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="text-slate-500 hover:text-slate-900 text-xs font-mono transition uppercase font-semibold"
            >
              HOME
            </Link>
            <span className="text-slate-300 font-mono text-xs">/</span>
            <span className="text-slate-900 font-mono text-xs tracking-wide uppercase font-bold">
              {areaData.name}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-3xl mb-16">
          <span className="inline-block text-[10px] font-mono text-sky-800 uppercase tracking-widest px-3 py-1 rounded-full bg-sky-50 border border-sky-200 mb-4 font-bold">
            KNOWLEDGE DOMAIN // {areaData.id.toUpperCase()}
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            {areaData.name}
          </h1>
          <p className="mt-4 text-slate-600 text-base font-normal leading-relaxed">
            {areaData.description}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
              Select Exploration Topic
            </span>
            <span className="text-xs font-mono text-slate-500 font-semibold">{areaData.topics.length} TOPICS ACTIVE</span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areaData.topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/areas/${areaData.id}/${topic.id}`}
                className="group relative rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-slate-400 hover:shadow-xl flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded border border-slate-200 font-semibold">
                      TOPIC // {topic.id.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-transform font-bold">
                      →
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {topic.name}
                  </h3>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed font-normal">
                    {topic.description}
                  </p>
                </div>

                <div className="mt-10 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>{topic.objects.length} OBJECT EXPLORABLE</span>
                  <span className="text-slate-900 group-hover:text-sky-600 font-bold">OPEN LAB →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}