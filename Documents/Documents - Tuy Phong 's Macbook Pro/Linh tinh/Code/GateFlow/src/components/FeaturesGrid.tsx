import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { Route, Globe, ShieldCheck, CreditCard } from 'lucide-react';

export default function FeaturesGrid() {
  const sectionRef = useRevealOnScroll<HTMLElement>();

  const features = [
    {
      id: 'routing',
      title: 'Smart Routing',
      desc: 'Auto-route to the fastest provider. Bypass rate limits with automatic load balancing.',
      icon: <Route className="w-6 h-6 text-white group-hover:text-cyan-500 transition-colors" />,
      visual: (
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex items-end gap-1 h-12 w-32">
            {[30, 50, 80, 100, 60, 40].map((h, i) => (
              <div key={i} className={`w-full bg-gray-800 group-hover:bg-cyan-500 transition-colors duration-300`} style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-4 group-hover:text-cyan-500 transition-colors">TRAFFIC FLOW</div>
        </div>
      )
    },
    {
      id: 'privacy',
      title: 'Zero Logs',
      desc: 'Your data is yours. End-to-end encryption. No prompt storage. Never touches our disks.',
      icon: <ShieldCheck className="w-6 h-6 text-white group-hover:text-amber-500 transition-colors" />,
      visual: (
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex items-center gap-3 w-48">
            <ShieldCheck className="w-5 h-5 text-gray-700 group-hover:text-amber-500 transition-colors" />
            <div className="h-px flex-1 bg-gray-800 border-t border-dashed border-gray-700">
              <div className="h-full bg-amber-500 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-4 group-hover:text-amber-500 transition-colors">ENCRYPTED TUNNEL</div>
        </div>
      )
    },
    {
      id: 'billing',
      title: 'One Invoice',
      desc: 'Stop juggling credit cards. Get one monthly bill for all 100+ AI providers.',
      icon: <CreditCard className="w-6 h-6 text-white group-hover:text-emerald-500 transition-colors" />,
      visual: (
        <div className="mt-8 pt-6 border-t border-gray-800 space-y-3 font-mono">
          <div className="flex items-center justify-between max-w-[200px]">
            <span className="text-[12px] font-bold text-gray-500">OPENAI</span>
            <span className="text-[12px] font-bold text-gray-300 group-hover:text-emerald-500 transition-colors">$42.00</span>
          </div>
          <div className="flex items-center justify-between max-w-[200px]">
            <span className="text-[12px] font-bold text-gray-500">ANTHROPIC</span>
            <span className="text-[12px] font-bold text-gray-300 group-hover:text-emerald-500 transition-colors">$82.50</span>
          </div>
        </div>
      )
    },
    {
      id: 'network',
      title: 'Global Edge',
      desc: '50+ edge nodes globally. Process requests closest to your users for ultra-fast responses.',
      icon: <Globe className="w-6 h-6 text-white group-hover:text-blue-500 transition-colors" />,
      visual: (
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex items-baseline gap-1 mb-3 font-mono">
            <span className="text-3xl font-bold text-white tracking-tighter group-hover:text-blue-500 transition-colors">12</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">MS DELAY</span>
          </div>
          <div className="h-1 flex-1 bg-gray-800 border-t border-dashed border-gray-700">
            <div className="h-full bg-blue-500 w-[15%] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="features" ref={sectionRef} className="max-w-7xl mx-auto pt-24 px-6 pb-24 relative bg-black font-sans">
      <div className="mb-24 flex flex-col items-start border-b border-gray-800 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 border border-gray-800 text-[11px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-6 rounded-none">
          [ CAPABILITIES ]
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 uppercase">
          SCALE <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">INSTANTLY.</span>
        </h2>
        <p className="text-lg text-gray-400 font-mono max-w-2xl">
          Manage AI traffic in production without limits or downtime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-800 border border-gray-800">
        {features.map((feature) => (
          <div key={feature.id} className="relative w-full group bg-black p-10 hover:bg-gray-900 transition-colors flex flex-col justify-between">
            <div className="h-full">
              <div className="mb-8 w-12 h-12 bg-gray-900 flex items-center justify-center border border-gray-800 group-hover:border-gray-700 transition-colors rounded-none">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">{feature.title}</h3>
              <p className="text-gray-400 font-mono text-[14px] leading-relaxed max-w-sm">{feature.desc}</p>
            </div>
            <div className="mt-auto">
              {feature.visual}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
