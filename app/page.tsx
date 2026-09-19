import Link from "next/link";
import { AREAS_DATA } from "@/data/content";

export default function Home() {
  const areasList = Object.values(AREAS_DATA);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Hero section */}
      <div className="relative overflow-hidden border-b border-slate-800/80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/30 via-slate-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/50 text-[11px] font-mono text-blue-400 uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              EXPANDABLISM // KNOWLEDGE ENGINE
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 leading-none">
              Physical exploration for abstract knowledge.
            </h1>
            
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
              Don't just read about complex systems. Explore, deconstruct, and master 3D mechanisms down to fundamental concepts.
            </p>

            <div className="mt-8 flex items-center space-x-4 font-mono text-xs text-slate-400">
              <span>EXPLORE</span>
              <span className="text-slate-600">→</span>
              <span>UNDERSTAND</span>
              <span className="text-slate-600">→</span>
              <span>DECONSTRUCT</span>
              <span className="text-slate-600">→</span>
              <span className="text-blue-400">MASTER</span>
            </div>
          </div>
        </div>
      </div>

      {/* Areas grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Knowledge Domains
            </h2>
            <p className="text-xl font-bold text-slate-100 mt-1">Select an Area to Explore</p>
          </div>
          <span className="text-xs font-mono text-slate-500">1 DOMAIN ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areasList.map((area) => (
            <Link
              key={area.id}
              href={`/areas/${area.id}`}
              className="group relative rounded-xl border border-slate-800/80 bg-slate-900/40 p-6 transition duration-300 hover:border-blue-500/50 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                    AREA // {area.id.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-slate-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
                  {area.name}
                </h3>
                
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {area.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{area.topics.length} TOPIC AVAILABLE</span>
                <span className="text-slate-400 group-hover:text-slate-200">EXPLORE DOMAIN</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}