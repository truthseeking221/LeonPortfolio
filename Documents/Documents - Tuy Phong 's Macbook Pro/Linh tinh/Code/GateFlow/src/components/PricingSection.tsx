import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'EXPLORER',
    price: '$0',
    period: '/MONTH',
    desc: 'PERFECT FOR TESTING.',
    features: ['10K REQUESTS/MO', '5 MODELS', 'COMMUNITY SUPPORT', 'BASIC ANALYTICS'],
    cta: 'START FREE',
    popular: false,
  },
  {
    name: 'BUILDER',
    price: '$25',
    period: '/MONTH',
    desc: 'FOR PRODUCTION TEAMS.',
    features: ['500K REQUESTS/MO', '100+ MODELS', 'PRIORITY SUPPORT', 'ADVANCED ANALYTICS', 'TEAM MANAGEMENT', 'CUSTOM RATE LIMITS'],
    cta: 'GET STARTED',
    popular: true,
  },
  {
    name: 'SCALE',
    price: 'CUSTOM',
    period: '',
    desc: 'DEDICATED ENTERPRISE SLA.',
    features: ['UNLIMITED REQUESTS', 'ALL MODELS + FINE-TUNED', 'DEDICATED SUPPORT', 'SSO & RBAC', 'CUSTOM SLA 99.99%', 'ON-PREMISE OPTION'],
    cta: 'CONTACT SALES',
    popular: false,
  },
];

export default function PricingSection() {
  const sectionRef = useRevealOnScroll<HTMLElement>();

  return (
    <section id="pricing" ref={sectionRef} className="max-w-7xl mx-auto pt-24 px-6 pb-24 relative bg-black font-sans border-b border-gray-800">
      <div className="mb-24 flex flex-col items-start border-b border-gray-800 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 border border-gray-800 text-[11px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-6 rounded-none">
          [ BILLING ]
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 uppercase">
          PAY FOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">USAGE.</span>
        </h2>
        <p className="text-lg text-gray-400 font-mono max-w-2xl">
          Zero markup on model costs. Clear, predictable pricing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px relative z-10 bg-gray-800 border border-gray-800 font-mono">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`p-8 flex flex-col group relative ${tier.popular ? 'bg-gray-900 border-x border-t-2 border-cyan-500 z-10' : 'bg-black hover:bg-gray-900 transition-colors'
              }`}
          >
            {tier.popular && (
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-cyan-500 text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest border border-cyan-400">
                [RECOMMENDED]
              </div>
            )}

            <div className="relative z-10 flex flex-col h-full">
              <div className={`text-[12px] font-bold tracking-widest uppercase mb-4 ${tier.popular ? 'text-cyan-500' : 'text-gray-500'}`}>
                &gt; {tier.name}
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black tracking-tighter text-white">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-[12px] font-bold text-gray-500 tracking-widest">
                    {tier.period}
                  </span>
                )}
              </div>

              <p className="mb-10 text-gray-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                {tier.desc}
              </p>

              <ul className="space-y-4 mb-10 flex-1 relative z-10">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check className={`w-4 h-4 flex-shrink-0 ${tier.popular ? 'text-cyan-500' : 'text-gray-500'}`} />
                    <span className="text-[11px] font-bold tracking-widest text-gray-300 uppercase">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-none text-[13px] font-bold tracking-widest uppercase transition-colors border ${tier.popular
                  ? 'bg-cyan-500 border-cyan-500 text-black hover:bg-white hover:border-white'
                  : 'bg-transparent border-gray-700 text-white hover:bg-gray-800'
                  }`}
              >
                {tier.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
