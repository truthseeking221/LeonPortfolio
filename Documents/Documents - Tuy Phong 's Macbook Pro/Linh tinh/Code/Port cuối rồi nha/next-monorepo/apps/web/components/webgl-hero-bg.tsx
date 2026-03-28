"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function WebglHeroBg() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Parallax mouse effect for extra depth
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 30; // 30px max movement
      const y = (e.clientY / innerHeight - 0.5) * 30;
      
      gsap.to(containerRef.current, {
        x: -x,
        y: -y,
        rotationX: y * 0.05,
        rotationY: -x * 0.05,
        ease: "power2.out",
        duration: 2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none" style={{ perspective: "1000px" }}>
      
      {/* Dynamic wrapper with 3D parallax and smooth blur/fade-in */}
      <div 
        ref={containerRef}
        className={`absolute inset-[-10%] w-[120%] h-[120%] transition-all duration-[2500ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-3xl scale-110"
        }`}
        style={{
          // Radial mask to smoothly blend the edges into the dark background void
          maskImage: "radial-gradient(circle at center, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 80%)"
        }}
      >
        <div className="absolute inset-0 w-full h-full opacity-90 mix-blend-screen saturate-150 contrast-[1.15]">
          <iframe
            src="https://my.spline.design/twistcopy-CPActtgUfoQoOToZfH4Pt18Q" 
            frameBorder="0" 
            width="100%" 
            height="100%"
            id="aura-spline"
            className="absolute inset-0 w-full h-full"
            onLoad={() => {
              // Give the Spline WebGL canvas time to paint its first frame
              setTimeout(() => {
                setIsLoaded(true);
              }, 800);
            }}
          />
        </div>
      </div>

      {/* Cinematic Grain Overlay overlaying everything */}
      <div 
        className="absolute inset-0 z-10 w-full h-full opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
