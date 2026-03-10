import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { Sparkles, Zap } from 'lucide-react';

const frontierModels = [
  { name: 'GPT-4o', provider: 'OpenAI', badge: '128K CTX' },
  { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', badge: '200K CTX' },
  { name: 'Gemini 1.5 Pro', provider: 'Google', badge: '1M CTX' },
  { name: 'Llama 3.1 405B', provider: 'Meta', badge: 'OPEN WEIGHT' },
];

const speedModels = [
  { name: 'GPT-4o Mini', provider: 'OpenAI', latency: '~200MS' },
  { name: 'Claude 3.5 Haiku', provider: 'Anthropic', latency: '~150MS' },
  { name: 'Gemini 1.5 Flash', provider: 'Google', latency: '~120MS' },
  { name: 'Llama 3.1 8B', provider: 'Meta', latency: '~80MS' },
];

export default function ModelsCatalog() {
  const sectionRef = useRevealOnScroll<HTMLElement>();

  return (
    <section id="models" ref={sectionRef} className="max-w-7xl mx-auto pt-24 px-6 pb-24 relative bg-black font-sans">
      <div className="mb-24 flex flex-col items-start border-b border-gray-800 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 border border-gray-800 text-[11px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-6 rounded-none">
          [ ECOSYSTEM ]
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 uppercase">
          ALL LLMS. <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">ONE API.</span>
        </h2>
        <p className="text-lg text-gray-400 font-mono max-w-2xl">
          Stop manually integrating new models. We do it for you, instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-mono uppercase tracking-widest">

        {/* Frontier Models - Left Side */}
        <div className="w-full">
          <div className="p-8 border border-gray-800 h-full bg-black group hover:border-gray-700 transition-colors rounded-none">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
              <h3 className="text-[14px] font-bold text-white">FLAGSHIP MODELS</h3>
            </div>
            <p className="text-gray-500 text-[11px] mb-8 leading-relaxed">
              Unmatched reasoning, coding, and context size. Maximize output quality.
            </p>

            <div className="grid grid-cols-1 gap-0 border border-gray-800 bg-gray-900">
              {frontierModels.map((m, i) => (
                <div
                  key={m.name}
                  className={`bg-black p-4 flex items-center justify-between cursor-pointer hover:bg-gray-900 transition-colors ${i !== frontierModels.length - 1 ? 'border-b border-gray-800' : ''}`}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-[12px] font-bold text-white leading-none">{m.name}</p>
                    <p className="text-[10px] text-gray-500">&gt;{m.provider}</p>
                  </div>
                  <span className="text-[10px] font-bold text-cyan-500 bg-cyan-500/10 px-2 py-1 whitespace-nowrap border border-cyan-500/20">
                    {m.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Speed Models - Right Side */}
        <div className="w-full">
          <div className="p-8 border border-gray-800 h-full bg-black group hover:border-gray-700 transition-colors rounded-none">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
              <h3 className="text-[14px] font-bold text-white">SPEED MODELS</h3>
            </div>
            <p className="text-gray-500 text-[11px] mb-8 leading-relaxed">
              Low-latency and cost-efficient for consumer-facing features.
            </p>

            <div className="grid grid-cols-1 gap-0 border border-gray-800 bg-gray-900">
              {speedModels.map((m, i) => (
                <div
                  key={m.name}
                  className={`bg-black p-4 flex items-center justify-between cursor-pointer hover:bg-gray-900 transition-colors ${i !== speedModels.length - 1 ? 'border-b border-gray-800' : ''}`}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-[12px] font-bold text-white leading-none">{m.name}</p>
                    <p className="text-[10px] text-gray-500">&gt;{m.provider}</p>
                  </div>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-1 whitespace-nowrap border border-blue-500/20">
                    {m.latency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
