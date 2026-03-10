export default function MarqueeSection() {
  return (
    <section className="py-24 border-y border-gray-800 bg-black overflow-hidden font-sans">
      <div
        className="marquee-track whitespace-nowrap"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, black 15%, black 85%, transparent)',
        }}
      >
        {/* Two identical groups for seamless loop */}
        {[0, 1].map((group) =>
          ['GATEFLOW ENGINE', 'UNIFIED AI GATEWAY', '100+ MODELS'].map((text, i) => (
            <span key={`${group}-${i}`} className="text-[6rem] md:text-[8rem] font-black text-white mix-blend-overlay opacity-10 mx-12 uppercase tracking-tighter">
              {text}
            </span>
          ))
        )}
      </div>
    </section>
  );
}
