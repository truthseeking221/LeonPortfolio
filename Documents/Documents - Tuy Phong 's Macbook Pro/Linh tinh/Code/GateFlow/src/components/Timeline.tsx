import { useEffect, useRef } from 'react';

const phases = [
  { num: '01', title: 'CONNECT', desc: 'CHANGE ONE LINE: YOUR BASEURL. ZERO OTHER CODE CHANGES.' },
  { num: '02', title: 'ROUTE', desc: 'WE AUTO-ROUTE TO THE FASTEST, CHEAPEST MODEL INSTANTLY.' },
  { num: '03', title: 'SCALE', desc: 'HANDLE MILLIONS OF REQUESTS. NEVER HIT A RATE LIMIT AGAIN.' },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const steps = Array.from(section.querySelectorAll('.tl-step'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target === section) {
            section.classList.add('is-inview');
            return;
          }
          const el = entry.target as HTMLElement;
          const idx = steps.indexOf(el);
          el.style.transitionDelay = `${Math.min(idx * 100, 300)}ms`;
          el.classList.add('is-inview');
          io.unobserve(el);
        });
      },
      { threshold: 0.1 }
    );

    io.observe(section);
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="liquid-timeline"
      className="overflow-hidden pt-24 pb-24 relative bg-black font-sans border-b border-gray-800"
    >
      <style>{`
        #liquid-timeline .tl-title,
        #liquid-timeline .tl-step {
          opacity: 0; transform: translateY(10px);
          transition: opacity 600ms ease, transform 600ms ease;
          will-change: opacity, transform;
        }
        #liquid-timeline.is-inview .tl-title { opacity: 1; transform: translateY(0); }
        #liquid-timeline .tl-step.is-inview { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* Title */}
      <div className="max-w-7xl mx-auto px-6 relative z-20 text-center mb-16 tl-title flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 border border-gray-800 text-[11px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-6 rounded-none">
          [ DEPLOYMENT ]
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6 uppercase">
          LIVE IN <span className="text-cyan-500">SECONDS.</span>
        </h2>
        <p className="text-lg text-gray-500 font-mono max-w-2xl mx-auto">
          No complicated SDKs. Just swap your endpoint.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-800 border border-gray-800">
        {phases.map((p) => (
          <div key={p.num} className="tl-step group relative w-full h-full">
            <div className="bg-black border border-gray-800 p-8 h-full rounded-none flex flex-col items-start hover:bg-gray-900 transition-colors font-mono">
              <div className="text-[14px] font-bold text-cyan-500 mb-6 border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5">[{p.num}]</div>
              <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-widest">{p.title}</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed uppercase">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
