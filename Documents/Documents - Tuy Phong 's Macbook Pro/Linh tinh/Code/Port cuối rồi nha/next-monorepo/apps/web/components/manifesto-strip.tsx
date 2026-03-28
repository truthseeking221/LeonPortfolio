"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@workspace/ui/lib/utils"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function ManifestoStrip({ className }: { className?: string }) {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%", // Significantly reduced scroll length! Snappier and less space used.
        scrub: 1,
        pin: true,
      }
    })

    // Initialization to avoid FOUC
    gsap.set('.s1-el', { opacity: 0, y: 30 })
    gsap.set('.comp-letter', { opacity: 0, y: 50, rotationZ: 10 })
    gsap.set('.red-slash', { scaleX: 0 })
    gsap.set('.wipe-1', { scale: 0 })
    gsap.set('.wipe-2', { scale: 0 })
    
    gsap.set('.s2-el', { opacity: 0, y: 30 })
    gsap.set('.clear-letter', { opacity: 0, y: 100, rotationX: -90 })

    // PHASE 1: Status Quo enters gracefully
    tl.to('.s1-el', { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" })
      .to('.comp-letter', { opacity: 1, y: 0, rotationZ: 0, duration: 1, stagger: 0.05, ease: "back.out(2)" }, "<0.2")

    // Micro-pause for reading
    tl.to({}, { duration: 0.4 })

    // PHASE 2: The Strike
    tl.to('.red-slash', { scaleX: 1, duration: 0.5, ease: "power4.inOut" })
      // Screen shake micro-interaction on impact
      .to('.comp-letter', { 
         y: -5, 
         rotationZ: "random(-5, 5)", 
         duration: 0.1, 
         yoyo: true, 
         repeat: 3,
         ease: "none"
      }, "<0.3")

    // PHASE 3: Destruction & The Shockwave Wipes
    // Letters fall physically off screen
    tl.to('.comp-letter', { 
        y: "100vh", 
        rotationZ: "random(-45, 45)", 
        duration: 1.5, 
        stagger: 0.03, 
        ease: "power4.in" 
      })
      .to('.s1-el', { opacity: 0, y: -50, duration: 1, ease: "power3.in" }, "<0.2")
      
      // Wave 1 (Red) explodes starting from the horizontal strike center
      .to('.wipe-1', { scale: 1, duration: 1.5, ease: "power4.inOut" }, "<0.1")
      // Wave 2 (Dark/Background) swallows the Red quickly creating a scanline effect
      .to('.wipe-2', { scale: 1, duration: 1.5, ease: "power4.inOut" }, "<0.15")

    // PHASE 4: The Resolution
    // Emerging flawlessly from the second wipe
    tl.to('.s2-el', { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }, "-=0.8")
      .to('.clear-letter', { 
         opacity: 1, 
         y: 0, 
         rotationX: 0, 
         duration: 1.5, 
         stagger: 0.05, 
         ease: "elastic.out(1, 0.4)" 
      }, "-=0.6")

    // Final soak-in time before unpinning
    tl.to({}, { duration: 1.2 })

  }, { scope: containerRef, dependencies: [] })

  return (
    <section 
      ref={containerRef} 
      className={cn("relative z-20 w-full h-[70vh] md:h-screen bg-background overflow-hidden", className)}
    >
      {/* Screen 1: The Status Quo */}
      <div className="s1-container absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          <p className="s1-el font-mono text-[10px] md:text-xs tracking-[0.3em] text-muted-foreground/60 mb-6 uppercase will-change-transform">
            The Status Quo
          </p>
          <h2 className="s1-el text-[5vw] md:text-[3vw] font-light text-foreground/80 will-change-transform">
            Design shouldn't be
          </h2>
          <div className="relative mt-2 md:mt-4">
              <h2 className="text-[14vw] md:text-[11vw] font-bold tracking-[-0.04em] italic text-foreground flex">
                  {"COMPLICATED.".split("").map((c, i) => (
                      <span key={i} className="comp-letter inline-block will-change-transform">
                          {c === " " ? "\u00A0" : c}
                      </span>
                  ))}
              </h2>
              {/* The slashing line */}
              <div className="red-slash absolute top-[60%] left-[-5%] w-[110%] h-[1.5vw] md:h-[0.8vw] bg-[#E54D2E] origin-left scale-x-0 rotate-[-2deg]" />
          </div>
      </div>

      {/* The Expanding Shockwave Wipes */}
      {/* We use 200vmax to ensure the circle safely covers all corners of any typical viewport diagonal from the center */}
      <div className="wipe-1 absolute z-20 top-1/2 left-1/2 w-[200vmax] h-[200vmax] bg-[#E54D2E] rounded-full origin-center -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="wipe-2 absolute z-20 top-1/2 left-1/2 w-[200vmax] h-[200vmax] bg-background rounded-full origin-center -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Screen 2: The Resolution */}
      <div className="s2-container absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none" style={{ perspective: "1000px" }}>
          <p className="s2-el font-mono text-[10px] md:text-xs tracking-[0.3em] text-muted-foreground/60 mb-6 uppercase will-change-transform">
            The Resolution
          </p>
          <h2 className="s2-el text-[4vw] md:text-[2.5vw] font-medium text-foreground/80 will-change-transform">
            Instead, it must be absolutely
          </h2>
          <div className="relative mt-4 md:mt-6 overflow-hidden pb-4 md:pb-8">
              <h2 className="text-[20vw] md:text-[18vw] font-black tracking-[-0.06em] leading-[0.85] text-foreground flex">
                   {"CLEAR.".split("").map((c, i) => (
                      <span key={i} className="clear-letter inline-block will-change-transform">
                          {c === " " ? "\u00A0" : c}
                      </span>
                  ))}
              </h2>
          </div>
      </div>
    </section>
  )
}
