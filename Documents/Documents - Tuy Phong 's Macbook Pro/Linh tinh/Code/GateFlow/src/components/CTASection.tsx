export default function CTASection() {
  return (
    <section className="flex flex-col text-center min-h-[50vh] px-6 relative items-center justify-center pt-32 pb-32 bg-black font-sans border-b border-gray-800">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 border border-gray-800 text-[11px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-8 rounded-none">
        [ FINAL STEP ]
      </div>
      <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 relative z-10 uppercase">
        SHIP <span className="text-cyan-500">FASTER.</span>
      </h2>
      <p className="text-xl text-gray-400 mb-12 max-w-lg mx-auto relative z-10 font-mono">
        Join 10,000+ developers shipping AI apps with GateFlow. Free forever for individuals.
      </p>
      <div className="flex flex-wrap justify-center gap-4 relative z-10 font-mono">
        <button className="px-8 py-4 bg-white hover:bg-cyan-500 text-black hover:text-black font-bold uppercase tracking-widest text-[13px] rounded-none transition-colors border-2 border-white hover:border-cyan-500">
          &gt; GET STARTED FREE
        </button>
        <a
          href="#docs"
          className="px-8 py-4 font-bold text-[13px] uppercase tracking-widest text-white border-2 border-gray-600 hover:border-white hover:text-white bg-black/50 backdrop-blur-sm rounded-none transition-colors flex items-center"
        >
          [ READ DOCS ]
        </a>
      </div>
    </section>
  );
}
