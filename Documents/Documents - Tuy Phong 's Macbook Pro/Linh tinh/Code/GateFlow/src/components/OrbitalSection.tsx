import { ShieldCheck, Zap, Database, Globe } from 'lucide-react';

const coreComponents = [
  { icon: ShieldCheck, title: 'SECURE CORE', desc: 'BANK-GRADE SECURITY.' },
  { icon: Zap, title: 'AUTO BYPASS', desc: 'SEAMLESS FAILOVERS AUTOMATICALLY.' },
  { icon: Database, title: 'UNIFIED DATA', desc: 'SINGLE SOURCE OF TRUTH.' },
  { icon: Globe, title: 'GLOBAL EDGE', desc: 'RUNNING ON 50+ REGIONS.' },
];

export default function OrbitalSection() {
  return (
    <section className="min-h-[500px] flex flex-col pt-24 pb-24 relative bg-black border-y border-gray-800 font-sans">
      <div className="text-center max-w-3xl mx-auto px-6 mb-16 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 border border-gray-800 text-[11px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-6 rounded-none">
          [ ARCHITECTURE ]
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6 uppercase">
          360° <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">SYSTEM.</span>
        </h2>
        <p className="text-lg text-gray-400 font-mono">
          Designed for maximum fault tolerance. Your applications stay online even when providers face outages.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-800 border border-gray-800">
        {coreComponents.map((card) => (
          <div key={card.title} className="bg-black p-8 group hover:bg-gray-900 transition-colors flex flex-col items-start border border-gray-800 text-left font-mono">
            <div className="w-12 h-12 bg-gray-900 flex items-center justify-center border border-gray-800 group-hover:border-gray-700 mb-6 rounded-none">
              <card.icon className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-[13px] font-bold text-white tracking-widest mb-2 uppercase">{card.title}</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
