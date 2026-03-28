"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowDown } from "lucide-react";

import { WebglHeroBg } from "./webgl-hero-bg";
import { RotatingHeadline } from "./rotating-headline";
import { MagneticButton } from "./magnetic-button";
import { GradientButton } from "./gradient-button";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Fade in text elegantly
    tl.from(".gk-element", {
      y: 30,
      opacity: 0,
      duration: 1.5,
      stagger: 0.15,
      delay: 0.1,
    });
    
    tl.fromTo(
      ".gk-line",
      { scaleX: 0, transformOrigin: "left" },
      { scaleX: 1, duration: 2, ease: "expo.inOut" },
      0.5
    );

    // subtle floating effect on the whole container
    gsap.to(".gk-floating", {
      y: 10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative flex min-h-0 w-full items-start px-6 pt-24 pb-8 md:min-h-[100vh] md:items-center md:px-[200px] md:pt-0 md:pb-0 max-w-[2500px] mx-auto overflow-hidden">
      {/* 1. Underlying WebGL Liquid/Abstract Geometry */}
      <div className="absolute inset-0 z-0 opacity-80 md:opacity-100">
        <WebglHeroBg />
      </div>

      {/* 2. Sleek, minimal background grid fade (Gleb style uses enormous empty space) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-background to-transparent" />
        <div className="absolute top-0 left-0 w-full h-[15vh] bg-gradient-to-b from-background to-transparent" />
      </div>

      {/* 3. Ultra-Minimal, Abstract UI Overlay */}
      <div className="relative z-10 w-full flex flex-col items-start text-left pt-0 pb-0 mt-0 md:pt-32 md:pb-16 md:mt-24">
        
        {/* Premium Glassmorphic Badge Caption */}
        <div className="gk-element mb-8 inline-flex items-center gap-3 rounded-full border border-foreground/10 bg-background/20 py-1.5 pl-2 pr-5 backdrop-blur-lg">
          <div className="flex items-center justify-center rounded-full bg-foreground/10 p-1">
            <div className="h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" />
          </div>
          <p className="font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/80 pt-px">
            <span className="text-foreground font-bold">Leon</span> &mdash; Product Design &amp; Direction
          </p>
        </div>

        {/* Huge, crisp typography */}
        <div className="gk-element w-full max-w-[90vw] md:max-w-none">
          <h1
            className="font-light tracking-tighter text-foreground"
            style={{ fontSize: "clamp(3.5rem, 10vw, 9.5rem)", lineHeight: 0.95 }}
          >
            <div className="overflow-hidden inline-block pb-[0.15em]"><RotatingHeadline /></div>
          </h1>
        </div>

        {/* Sophisticated Description */}
        <p className="gk-element mt-6 md:mt-10 max-w-[42ch] text-[1.1rem] leading-[1.65] text-foreground/50 md:text-[1.35rem] font-light">
          Sculpting clarity from complexity. <br className="hidden md:block"/>
          I design premium systems, ethereal interfaces, and interactions that feel inevitable.
        </p>

        {/* Premium CTA / Coordinates */}
        <div className="gk-element mt-10 md:mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-12">
          <MagneticButton>
            <GradientButton href="#work">
              <span className="inline-flex items-center gap-2">
                Explore The Work
                <ArrowDown className="size-3" />
              </span>
            </GradientButton>
          </MagneticButton>
          
          <div className="flex items-center gap-4">
            <span className="h-[2px] w-2 bg-foreground/20 rounded-full hidden sm:block" />
            <div className="flex flex-col">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-foreground/30">HO CHI MINH CITY</span>
              <span className="font-mono text-[10px] tracking-widest text-foreground/70">
                10.7626° N, 106.6601° E
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Super minimal scroll indicator at bottom */}
      <div className="absolute bottom-12 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-4 opacity-50 md:flex gk-floating">
        <div className="h-12 w-px bg-gradient-to-b from-foreground/5 to-foreground/40 origin-top animate-breathe" />
        <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-foreground/40">Scroll</span>
      </div>
    </section>
  );
}
