import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { Activity, Code } from 'lucide-react';

export default function GallerySection() {
  const sectionRef = useRevealOnScroll<HTMLElement>();

  return (
    <section ref={sectionRef} className="bg-black border-b border-gray-800 font-sans">
      <div className="max-w-7xl mx-auto pt-24 px-6 pb-24 relative">
        {/* Header */}
        <div className="mb-24 flex flex-col items-center border-b border-gray-800 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 border border-gray-800 text-[11px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-6 rounded-none">
            [ DASHBOARD ]
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 uppercase">
            TOTAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">VISIBILITY.</span>
          </h2>
          <p className="text-lg text-gray-400 font-mono max-w-2xl">
            Monitor traffic, latency, and costs in real-time.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-gray-800 border border-gray-800 font-mono">

          <div className="bg-black p-8 flex flex-col group hover:bg-gray-900 transition-colors">
            <div className="flex items-center gap-3 mb-8">
              <Activity className="w-5 h-5 text-gray-500 group-hover:text-emerald-500 transition-colors" />
              <span className="font-bold text-white text-[14px]">TRAFFIC ANALYTICS</span>
            </div>
            <div className="flex-1 bg-black rounded-none border border-gray-800 p-6 flex flex-col justify-end min-h-[200px] relative overflow-hidden group-hover:border-gray-700 transition-colors">
              <div className="flex items-end gap-1 w-full h-32 relative z-10">
                {[40, 60, 45, 80, 50, 90, 65, 100, 70, 85].map((h, i) => (
                  <div key={i} className={`flex-1 ${h > 75 ? 'bg-emerald-500' : 'bg-gray-800 group-hover:bg-gray-700'} transition-colors duration-300`} style={{ height: `${parseInt(h as any)}%` }} />
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20 pointer-events-none" />
            </div>
          </div>

          <div className="bg-black p-8 flex flex-col group hover:bg-gray-900 transition-colors">
            <div className="flex items-center gap-3 mb-8">
              <Code className="w-5 h-5 text-gray-500 group-hover:text-cyan-500 transition-colors" />
              <span className="font-bold text-white text-[14px]">DEVELOPER CONSOLE</span>
            </div>
            <div className="flex-1 bg-black rounded-none border border-gray-800 p-6 text-gray-300 font-mono text-[11px] min-h-[200px] group-hover:border-gray-700 transition-colors shadow-[i_px_20px_rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <p className="text-cyan-500">SYS.<span className="text-white">INIT_WORKSPACE --KEYS=SK-PROD</span></p>
              <p className="mt-2 text-gray-600">[INFO] INITIALIZING ENVIRONMENT...</p>
              <p className="mt-1 text-gray-600">[INFO] LINKING 142 ACTIVE PROVIDERS...</p>
              <p className="mt-1 text-emerald-500">[SUCCESS] ENVIRONMENT READY.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
