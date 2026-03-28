"use client"

import React, { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { MagneticButton } from "./magnetic-button"
import { cn } from "@workspace/ui/lib/utils"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function ClosingCTA({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%", // Starts a bit later
        end: "bottom bottom", // Ends perfectly when the bottom reaches the bottom
        scrub: 1.5,
      }
    })
    
    const glow = containerRef.current.querySelector('.closing-glow')
    const words = containerRef.current.querySelectorAll('.closing-word')
    const desc = containerRef.current.querySelector('.closing-desc')
    const cta = containerRef.current.querySelector('.closing-cta')
    const label = containerRef.current.querySelector('.closing-label')

    gsap.set(words, { opacity: 0, yPercent: 120, rotationX: -15 })
    gsap.set([desc, cta, label], { opacity: 0, y: 40 })
    gsap.set(glow, { scale: 0.2, opacity: 0 })

    tl.to(glow, { scale: 1, opacity: 1, duration: 4, ease: "power2.out" })
      .to(label, { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, "<0.5")
      .to(words, { 
         opacity: 1, 
         yPercent: 0, 
         rotationX: 0, 
         stagger: 0.15, 
         duration: 3, 
         ease: "expo.out" 
      }, "<0.2")
      .to(desc, { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, "-=1.5")
      .to(cta, { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, "-=1.5")

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className={cn("relative z-10 w-full bg-background flex flex-col items-center justify-center text-center px-6 md:px-[15%] py-20 md:min-h-screen md:py-48 overflow-hidden", className)}>
      
      {/* Immersive glow expanding on scrub */}
      <div className="closing-glow absolute inset-0 flex items-center justify-center pointer-events-none -z-10 mt-[-10vh]">
           <div className="w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-foreground/[0.03] blur-[100px] rounded-full" />
      </div>

      <div className="closing-label mb-6 md:mb-16 flex items-center justify-center gap-4">
        <div className="h-1.5 w-1.5 rounded-full bg-foreground/30 animate-pulse" />
        <span className="font-mono text-[10px] md:text-[12px] tracking-[0.3em] text-muted-foreground/40 uppercase">
          You&apos;ve read this far
        </span>
        <div className="h-1.5 w-1.5 rounded-full bg-foreground/30 animate-pulse" />
      </div>

      {/* Massive Horizontal/Vertical Typographic Sequence */}
      <div className="flex flex-col items-center justify-center w-full my-4 md:my-16 perspective-1000">
        {["The work speaks.", "Let's talk."].map((line, i) => (
           <div key={i} className="overflow-hidden">
             <span className="closing-word block font-light text-[clamp(3rem,9vw,10.5rem)] leading-[0.9] tracking-tighter text-foreground will-change-transform pb-2 md:pb-4">
               {line}
             </span>
           </div>
        ))}
      </div>

      <p className="closing-desc mt-6 md:mt-16 max-w-[45ch] text-[16px] md:text-[18px] leading-relaxed text-muted-foreground/60 mx-auto font-light">
        I work best with people who see making as a practice, not a
        transaction. If that resonates, let&apos;s talk.
      </p>

      <div className="closing-cta mt-8 md:mt-20 flex flex-col items-center gap-5">
        <MagneticButton>
          <a
            href="mailto:leondesigner221@gmail.com"
            className="group flex flex-col items-center relative py-6"
          >
            <span className="text-[clamp(1.2rem,3vw,2rem)] tracking-tight text-foreground font-medium relative z-10 transition-colors pb-1">
              leondesigner221@gmail.com
            </span>
            <div className="absolute bottom-4 h-[2px] w-full bg-foreground/15 transition-all duration-500 group-hover:bg-foreground group-hover:scale-x-110" />
          </a>
        </MagneticButton>
        <div className="flex items-center gap-6">
          <a
            href="https://t.me/yangtinakpo"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] tracking-widest text-muted-foreground/40 uppercase transition-colors hover:text-foreground/70"
          >
            Telegram &rarr;
          </a>
          <a
            href="https://www.linkedin.com/in/nguyentuongan/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] tracking-widest text-muted-foreground/40 uppercase transition-colors hover:text-foreground/70"
          >
            LinkedIn &rarr;
          </a>
        </div>
      </div>
    </section>
  )
}
