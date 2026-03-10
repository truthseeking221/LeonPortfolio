import { Shield, Zap, Activity, GitCommit, Network } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center px-[5%] pt-32 pb-12 overflow-hidden bg-black text-white">
      {/* Subtle ambient glow in the background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-cyan-500/10 via-transparent to-blue-500/10 rounded-full blur-[100px] pointer-events-none opacity-50" />

      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 max-w-[1300px] w-full z-10 flex-1 relative">

        {/* Text / Lead */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left relative z-20">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-gray-900 border border-cyan-500/30 text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-gray-300 mb-8 rounded-none relative overflow-hidden group">
            <div className="absolute inset-0 bg-cyan-500/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-none animate-pulse" />
            [ GATEWAY ARCHITECTURE _V7.0 ]
          </div>

          <h1 className="text-[clamp(3.5rem,7vw,7rem)] font-sans font-black text-white leading-[0.95] tracking-tighter mb-6 uppercase relative">
            ONE API.
            <br />
            100+ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-400">MODELS.</span>
          </h1>

          <p className="text-[clamp(1.0rem,1.2vw,1.2rem)] text-gray-400 max-w-[520px] leading-relaxed mb-10 font-mono relative">
            <span className="absolute left-[-15px] top-1 bottom-1 w-[2px] bg-gradient-to-b from-cyan-500/50 to-transparent hidden lg:block" />
            Connect to Opus 4.6, ChatGPT 5.4, and Gemini 3.1 through a single gateway. Built for infinite scale, zero downtime, and zero rate limits.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start font-mono text-[13px] font-bold tracking-widest">
            <button className="relative px-8 py-4 bg-white text-black rounded-none group overflow-hidden border-2 border-white">
              <span className="absolute inset-0 w-full h-full bg-cyan-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-2 group-hover:text-black uppercase">
                &gt; START BUILDING
              </span>
            </button>
            <a
              href="#docs"
              className="px-8 py-4 text-gray-300 border-2 border-gray-700 hover:border-gray-400 hover:text-white bg-black/50 backdrop-blur-md rounded-none transition-colors flex items-center uppercase"
            >
              [ READ DOCS ]
            </a>
          </div>
        </div>

        {/* Infographic Visual - The Nexus */}
        <div className="relative flex justify-center items-center h-[550px] w-full max-w-[550px] mx-auto font-mono perspective-1000">

          {/* Complex SVG Background Elements */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 600 600">
            <defs>
              <linearGradient id="fadeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
              </linearGradient>
              <radialGradient id="radar" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Radar scan background */}
            <circle cx="300" cy="300" r="280" fill="url(#radar)" className="animate-[pulse_4s_ease-in-out_infinite] opacity-50" />

            {/* Crosshairs */}
            <g stroke="#333" strokeWidth="1" opacity="0.5">
              <line x1="300" y1="20" x2="300" y2="580" />
              <line x1="20" y1="300" x2="580" y2="300" />
            </g>

            {/* Concentric Rotating Rings */}
            <circle cx="300" cy="300" r="260" fill="none" stroke="#222" strokeWidth="1" strokeDasharray="1 8" className="origin-center animate-[spin_60s_linear_infinite]" />
            <circle cx="300" cy="300" r="200" fill="none" stroke="#06b6d4" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 12" className="origin-center animate-[spin_40s_linear_infinite_reverse]" />
            <circle cx="300" cy="300" r="140" fill="none" stroke="#444" strokeWidth="1" strokeDasharray="2 4" className="origin-center animate-[spin_20s_linear_infinite]" />

            {/* Target acquired brackets around center */}
            <g stroke="#06b6d4" strokeWidth="1.5" fill="none" className="opacity-60">
              <path d="M 270 260 L 260 260 L 260 270" />
              <path d="M 330 260 L 340 260 L 340 270" />
              <path d="M 270 340 L 260 340 L 260 330" />
              <path d="M 330 340 L 340 340 L 340 330" />
            </g>

            {/* Draw precise laser paths between center (300,300) and nodes */}
            {[
              { angle: -90, dist: 220 }, // Top
              { angle: -18, dist: 200 }, // Right-Top
              { angle: 54, dist: 230 },  // Right-Bottom
              { angle: 126, dist: 230 }, // Left-Bottom
              { angle: 198, dist: 200 }, // Left-Top
            ].map((p, i) => {
              const rad = (p.angle * Math.PI) / 180;
              const x = 300 + Math.cos(rad) * p.dist;
              const y = 300 + Math.sin(rad) * p.dist;
              return (
                <g key={i}>
                  {/* Faint solid line */}
                  <path
                    d={`M 300 300 L ${x} ${y}`}
                    stroke="#06b6d4"
                    strokeWidth="1"
                    className="opacity-20"
                  />
                  {/* Dashed animated line overlay */}
                  <path
                    d={`M 300 300 L ${x} ${y}`}
                    stroke="#06b6d4"
                    strokeWidth="1"
                    strokeDasharray="2 6"
                    className="opacity-60"
                  />
                </g>
              );
            })}
          </svg>

          {/* Central Gateflow Router Core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 perspective-1000">
            <div className="relative group cursor-pointer">
              {/* Core glow */}
              <div className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Complex Central Box */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-[#050505] border-[1px] border-gray-700 flex flex-col items-center justify-center gap-2 relative z-10 transition-all duration-300 group-hover:bg-[#0a0a0a] group-hover:border-cyan-500/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden">
                {/* Internal scanning line */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-[200%] -translate-y-[50%] animate-[scan_3s_linear_infinite]" />

                {/* Techy Corner accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white group-hover:border-cyan-500 transition-colors" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white group-hover:border-cyan-500 transition-colors" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white group-hover:border-cyan-500 transition-colors" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white group-hover:border-cyan-500 transition-colors" />

                <Network className="w-10 h-10 sm:w-12 sm:h-12 text-white group-hover:text-cyan-500 transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] relative z-10" />
                <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-black text-white relative z-10 mt-1 pb-1 border-b border-gray-800">
                  SYS.ROUTER
                </div>
              </div>
            </div>
          </div>

          {/* Connected Model Nodes */}
          {[
            { angle: -90, dist: 220, name: 'ChatGPT 5.4 Thinking', provider: 'OpenAI', latency: '22ms', color: 'text-white', bg: 'bg-[#050505]', border: 'border-white', icon: <Zap className="w-4 h-4" /> },
            { angle: -18, dist: 200, name: 'Opus 4.6', provider: 'Anthropic', latency: '35ms', color: 'text-white', bg: 'bg-[#050505]', border: 'border-white', icon: <Activity className="w-4 h-4" /> },
            { angle: 54, dist: 230, name: 'Gemini Pro 3.1', provider: 'Google', latency: '28ms', color: 'text-white', bg: 'bg-[#050505]', border: 'border-white', icon: <GitCommit className="w-4 h-4" /> },
            { angle: 126, dist: 230, name: 'Sonnet 4.6', provider: 'Anthropic', latency: '4ms', color: 'text-white', bg: 'bg-[#050505]', border: 'border-white', icon: <Shield className="w-4 h-4" /> },
            { angle: 198, dist: 200, name: 'Llama 3.1', provider: 'Meta', latency: '12ms', color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500', icon: <Network className="w-4 h-4" /> },
          ].map((node, i) => {
            const rad = (node.angle * Math.PI) / 180;
            // Map 220 to 600 viewBox width ratio
            // Actual div size is 550px mapped to 600 SVG viewBox
            const ratio = 550 / 600;
            const x = Math.cos(rad) * (node.dist * ratio);
            const y = Math.sin(rad) * (node.dist * ratio);

            return (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 z-20 hover:scale-105 transition-all duration-300 cursor-pointer group"
                style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
              >
                {/* Ambient glow behind node */}
                <div className={`absolute -inset-1 blur-md rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10`} />

                <div className={`relative ${node.bg} backdrop-blur-sm p-3 border border-gray-800 flex items-center gap-3 w-56 transition-all group-hover:bg-[#0a0a0a] group-hover:border-gray-500 rounded-none shadow-2xl`}>

                  {/* Status indicator */}
                  <div className="absolute -top-px -right-px px-1.5 py-0.5 bg-gray-900 border-b border-l border-gray-800 text-[7px] text-gray-500 font-bold tracking-widest leading-none group-hover:bg-white group-hover:text-black transition-colors">
                    ACTIVE
                  </div>

                  {/* Icon box */}
                  <div className={`w-9 h-9 bg-black border border-gray-800 flex items-center justify-center flex-shrink-0 group-hover:border-white transition-colors ${node.color}`}>
                    {node.icon}
                  </div>

                  {/* Data */}
                  <div className="flex flex-col text-left justify-center pt-1 overflow-hidden">
                    <span className={`text-[10px] font-bold ${node.color} tracking-widest leading-none mb-1.5 uppercase truncate`}>{node.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none">[{node.provider}]</span>
                      <span className="text-[8px] text-gray-600 tracking-wider">~{node.latency}</span>
                    </div>
                  </div>

                  {/* Decorative line */}
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded CSS for animations */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0%); }
        }
      `}</style>
    </section>
  );
}
