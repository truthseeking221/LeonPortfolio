import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { Layout, GitPullRequest, Eye } from 'lucide-react';

const columns = [
  {
    title: 'RELIABILITY',
    desc: 'MULTI-REGION REDUNDANCY. AUTOMATIC RETRIES ON FAILURE. WE ABSORB DOWNTIME SO YOUR USERS NEVER NOTICE.',
    icon: <Layout className="w-5 h-5 text-gray-500 group-hover:text-amber-500 transition-colors" />,
  },
  {
    title: 'PERFORMANCE',
    desc: 'BUILT ON RUST AND DISTRIBUTED GLOBALLY. SUB-MILLISECOND ROUTING OVERHEAD GUARANTEED.',
    icon: <GitPullRequest className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />,
  },
  {
    title: 'SIMPLICITY',
    desc: 'ONE API KEY. ONE ENDPOINT. WE ABSTRACT AWAY THE COMPLEXITY OF MANAGING MULTIPLE LLM PROVIDERS.',
    icon: <Eye className="w-5 h-5 text-gray-500 group-hover:text-emerald-500 transition-colors" />,
  },
];

export default function DimensionsSection() {
  const sectionRef = useRevealOnScroll<HTMLElement>();

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto pt-24 px-6 pb-24 relative bg-black font-sans border-b border-gray-800">
      <div className="mb-16 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 border border-gray-800 text-[11px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-6 rounded-none">
          [ CORE PRINCIPLES ]
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6 uppercase">
          BUILT FOR <span className="text-white bg-white/10 px-2 py-1">DEVELOPERS.</span>
        </h2>
        <p className="text-lg text-gray-400 font-mono max-w-2xl">
          We designed our infrastructure around reliability, performance, and simplicity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-800 border border-gray-800 font-mono">
        {columns.map((col) => (
          <div
            key={col.title}
            className="bg-black p-8 flex flex-col items-start group hover:bg-gray-900 transition-colors"
          >
            <div className="mb-6 rounded-none bg-gray-900 border border-gray-800 w-12 h-12 flex items-center justify-center group-hover:border-white transition-colors">
              {col.icon}
            </div>
            <h3 className="text-[14px] font-bold text-white mb-4 tracking-widest">{col.title}</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed font-bold tracking-widest">{col.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
