"use client"

import { useRef } from "react"
import Image, { StaticImageData } from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowLeft, ArrowUpRight } from "lucide-react"

import { GsapTitle } from "./gsap-title"
import { ClosingCTA } from "./closing-cta"
import { MagneticButton } from "./magnetic-button"

gsap.registerPlugin(ScrollTrigger)

interface AboutClientProps {
  dashboardFirstImage: StaticImageData
  chapters: ReadonlyArray<any>
  tools: ReadonlyArray<any>
  reading: ReadonlyArray<any>
}

export function AboutClient({ dashboardFirstImage, chapters, tools, reading }: AboutClientProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const chaptersRef = useRef<HTMLDivElement>(null)
  const beliefsRef = useRef<HTMLDivElement>(null)
  const studioRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return
    const mm = gsap.matchMedia()

    // 1. Portrait Parallax & Scale
    if (portraitRef.current) {
      gsap.to(portraitRef.current, {
        yPercent: 15,
        scale: 1.05,
        ease: "none",
        scrollTrigger: {
          trigger: portraitRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      })
    }

    // 2. Chapters Pinned Section
    if (chaptersRef.current) {
      const leftCol = chaptersRef.current.querySelector(".chapters-left")
      mm.add("(min-width: 768px)", () => {
        if (!leftCol) return

        ScrollTrigger.create({
          trigger: chaptersRef.current,
          start: "top 20%",
          end: "bottom bottom",
          pin: leftCol,
          pinSpacing: false,
        })
      })
      
      const chapterItems = gsap.utils.toArray(".chapter-item") as HTMLElement[]
      chapterItems.forEach((item) => {
        const yearEl = item.querySelector(".chapter-year") as HTMLElement

        // Fade in the content block
        gsap.fromTo(item,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              end: "top 50%",
              scrub: 1,
            }
          }
        )

        // Highlight the year when in view
        if (yearEl) {
          ScrollTrigger.create({
            trigger: item,
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => yearEl.classList.add("chapter-year-active"),
            onLeave: () => yearEl.classList.remove("chapter-year-active"),
            onEnterBack: () => yearEl.classList.add("chapter-year-active"),
            onLeaveBack: () => yearEl.classList.remove("chapter-year-active"),
          })
        }
      })
    }

    // 3. Pinned Beliefs crossfade
    if (beliefsRef.current) {
      const beliefItems = gsap.utils.toArray(".belief-item") as HTMLElement[]
      
      if (beliefItems.length > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: beliefsRef.current,
            start: "top top",
            end: "+=300%",
            scrub: 1,
            pin: true,
          }
        })

        beliefItems.forEach((item, i) => {
          if (i > 0) {
            tl.to(beliefItems[i - 1]!, { opacity: 0, y: -50, scale: 0.95, duration: 1 })
              .fromTo(item, { opacity: 0, y: 50, scale: 1.05 }, { opacity: 1, y: 0, scale: 1, duration: 1 }, "<")
          } else {
            // Ensure first item is visible
            gsap.set(item, { opacity: 1, y: 0, scale: 1 })
          }
        })
        // fade out last
        tl.to(beliefItems[beliefItems.length - 1]!, { opacity: 0, y: -50, scale: 0.95, duration: 1 })
      }
    }

    // 4. Studio Infographic Spine
    if (studioRef.current) {
      const spineProgress = studioRef.current.querySelector(".studio-spine-progress")
      const studioNodes = gsap.utils.toArray(".studio-node") as HTMLElement[]
      const studioItems = gsap.utils.toArray(".studio-item") as HTMLElement[]

      if (spineProgress) {
        gsap.fromTo(spineProgress, { height: "0%" }, { 
          height: "100%", 
          ease: "none",
          scrollTrigger: {
            trigger: studioRef.current,
            start: "top 70%",
            end: "bottom 70%",
            scrub: 1,
          }
        })
      }

      studioItems.forEach((item, index) => {
        const contentElements = item.querySelectorAll('.studio-content')
        const marker = item.querySelector('.studio-node')
        
        const isEven = index % 2 === 0
        const dirX = isEven ? 30 : -30

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            end: "top 60%",
            scrub: 1,
          }
        })

        if (marker) {
          tl.fromTo(marker, { scale: 0 }, { scale: 1, duration: 0.5 }, 0)
        }
        
        // Ensure fade in happens properly with scrub
        tl.fromTo(contentElements, 
          { opacity: 0, x: dirX }, 
          { opacity: 1, x: 0, duration: 1, ease: "power2.out" }, 
        0)
      })
    }

    return () => mm.revert()
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="w-full relative overflow-x-hidden">
      

      {/* ══════════════════════════════════════════════════
          ACT 1 — THE OPENING
          ══════════════════════════════════════════════════ */}
      <section className="relative z-10 flex min-h-[82svh] w-full flex-col justify-center overflow-hidden px-6 md:min-h-screen md:px-[15%]">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px w-8 bg-foreground/[0.2]" />
          <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase">
            Somewhere between stillness &amp; making
          </span>
        </div>

        <GsapTitle 
          text={"Before there is a screen, there is stillness."}
          className="max-w-[18ch] text-[clamp(2.5rem,6vw,6rem)] leading-[0.92] font-light tracking-tighter"
        />

        <p className="mt-8 max-w-[36ch] text-base leading-relaxed text-muted-foreground/60">
          I design products for a living. But what I&apos;m really
          searching for is what clarity means. Where it comes from.
          And why most things are built without it.
        </p>

        {/* Scroll hint */}
        <div className="absolute bottom-12 left-6 hidden md:block md:left-[15%]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-px origin-top bg-foreground/20 animate-breathe" />
            <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/30 uppercase">
              Scroll
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ACT 2 — THE PERSON
          ══════════════════════════════════════════════════ */}
      <section className="relative z-10 border-t border-border/10 px-6 py-10 md:px-[15%] md:py-40">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16 lg:gap-24">

          {/* Portrait */}
          <div className="relative overflow-hidden rounded-2xl border border-border/15 bg-foreground/[0.03]">
            <div ref={portraitRef} className="aspect-[4/5] relative w-full h-full scale-[1.1]">
              <div className="absolute top-4 left-4 h-5 w-5 border-t border-l border-foreground/[0.3] z-10" />
              <div className="absolute top-4 right-4 h-5 w-5 border-t border-r border-foreground/[0.3] z-10" />
              <div className="absolute bottom-4 left-4 h-5 w-5 border-b border-l border-foreground/[0.3] z-10" />
              <div className="absolute bottom-4 right-4 h-5 w-5 border-b border-r border-foreground/[0.3] z-10" />
              <div className="absolute inset-0 bg-foreground/10 mix-blend-overlay z-10 pointer-events-none" />
              <Image
                src={dashboardFirstImage}
                alt="Dashboard-first direction"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority
              />
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col justify-center">
            <p className="relative mb-6 overflow-hidden font-mono text-[9px] tracking-[0.25em] text-muted-foreground/40 uppercase md:mb-8">
               Beyond the work
               <span className="absolute bottom-0 left-0 w-full h-px bg-foreground/20" />
            </p>

            <div className="space-y-6 text-[15px] leading-[1.8] text-foreground/75 md:text-md font-light">
              <p>
                I&apos;m a product designer based in Vietnam. I think in
                systems. I ship in clarity. My work lives in the 0-to-1 space,
                where nothing exists yet and everything needs a point of view.
              </p>
              <p>
                I study Buddhist philosophy. Not as a retreat from the work,
                but as a way to see it more honestly. Impermanence teaches me
                not to grip solutions too tightly. Emptiness reminds me that
                what I remove matters more than what I add. The middle way
                keeps me from confusing ambition with purpose.
              </p>
              <p>
                When I&apos;m not designing, I&apos;m driving. Long roads,
                open windows, the kind of silence that makes hard problems feel
                smaller and real questions feel closer. Something about
                distance resets how I see.
              </p>
              <p>
                AI is part of how I work now. Not as a shortcut. As a mirror.
                It moves faster than I can think, which forces a better
                question: what is the part of this craft that only a human can
                hold? I&apos;m still looking for the answer. I think
                that&apos;s the point.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3 md:mt-12">
              <div className="h-px flex-1 bg-foreground/[0.1]" />
              <span className="font-mono text-[9px] tracking-[0.15em] text-muted-foreground/40 uppercase">
                Ask &middot; Reduce &middot; Shape &middot; Ship
              </span>
              <div className="h-px flex-1 bg-foreground/[0.1]" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ACT 3 — CHAPTERS (Pinned Left, Scrolled Right)
          ══════════════════════════════════════════════════ */}
      <section ref={chaptersRef} className="relative z-10 border-t border-border/10 px-6 py-10 md:px-[15%] md:py-40">
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.5fr] md:gap-12 lg:gap-24">
          
          <div className="chapters-left h-fit flex flex-col justify-start">
            <p className="mb-6 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/50 uppercase md:mb-12">
              Chapters, not résumé
            </p>
            <h2 className="max-w-[15ch] text-[clamp(2rem,3.5vw,3rem)] leading-[1.15] font-light tracking-tight text-foreground/90">
              Every year teaches one thing clearly.
              <br/>
              <span className="text-muted-foreground/30 italic">The rest is noise.</span>
            </h2>
          </div>

          <div className="chapters-right flex flex-col">
            {chapters.map((ch) => (
              <div key={ch.year} className="chapter-item group relative border-b border-border/10 py-10 md:py-16 last:border-0">
                <div className="flex items-start gap-5 md:gap-10">
                  {/* Year label — left-aligned, highlights on scroll */}
                  <div className="chapter-year shrink-0 w-16 md:w-20 pt-1 font-mono text-sm md:text-base font-semibold tracking-tight text-foreground/10 transition-all duration-500">
                    {ch.year}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-[clamp(1.3rem,2.2vw,1.75rem)] leading-[1.25] tracking-tight text-foreground/90 mb-4">
                      &ldquo;{ch.conviction}&rdquo;
                    </h3>
                    <p className="max-w-[45ch] text-base leading-relaxed text-muted-foreground/60 dark:text-muted-foreground/75">
                      {ch.context}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ACT 4 — THE STUDIO & TOOLS
          ══════════════════════════════════════════════════ */}
      <section ref={studioRef} className="relative z-10 overflow-hidden border-t border-border/10 bg-foreground/[0.02] px-6 py-16 md:px-0 md:py-48">
        <p className="mb-12 block w-full text-center font-mono text-[10px] tracking-[0.3em] text-muted-foreground/50 uppercase md:mb-24">
          The studio, right now
        </p>
        
        <div className="relative mx-auto max-w-5xl overflow-hidden px-4 [--studio-spine-x:39px] md:px-12 md:[--studio-spine-x:50%]">
          {/* Spine Line */}
          <div className="absolute top-0 bottom-0 left-[calc(var(--studio-spine-x)-0.5px)] w-px bg-foreground/10" />
          <div 
            className="studio-spine-progress absolute top-0 left-[calc(var(--studio-spine-x)-0.5px)] w-px bg-foreground"
            style={{ height: '0%' }}
          />

          <div className="space-y-14 md:space-y-32">
            
            {/* Infographic Item 1 */}
            <div className="studio-item flex flex-col md:flex-row items-start md:items-center relative">
               {/* Left Label */}
               <div className="studio-content opacity-0 md:w-1/2 md:pr-16 md:text-right flex-shrink-0 mb-4 md:mb-0 pl-16 md:pl-0 w-full z-10 flex flex-col md:items-end">
                 <p className="font-mono text-[10px] tracking-[0.2em] text-foreground/40 uppercase bg-background px-4 py-2 border border-foreground/10 rounded-full inline-flex md:text-right shadow-sm">
                   Working on
                 </p>
               </div>

               {/* Center Marker */}
               <div className="absolute top-2 left-[var(--studio-spine-x)] z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center pointer-events-none md:top-1/2 md:-translate-y-1/2">
                  <div className="studio-node w-3 h-3 rounded-full border-[2px] border-foreground bg-background scale-0" />
               </div>

               {/* Right Content */}
               <div className="studio-content opacity-0 md:w-1/2 md:pl-16 pl-16 md:pr-0 relative z-10 w-full">
                  <p className="text-[clamp(1rem,1.3vw,1.125rem)] font-light leading-relaxed text-foreground/80 md:max-w-md">
                    Crypto onboarding at TymeBank. Making blockchain invisible to
                    five&nbsp;million people who should never have to think about
                    gas fees.
                  </p>
               </div>
            </div>

            {/* Infographic Item 2 */}
            <div className="studio-item flex flex-col md:flex-row-reverse items-start md:items-center relative">
               {/* Right Label (on desktop) */}
               <div className="studio-content opacity-0 md:w-1/2 md:pl-16 md:text-left flex-shrink-0 mb-4 md:mb-0 pl-16 md:pl-0 w-full z-10 flex flex-col md:items-start">
                 <p className="font-mono text-[10px] tracking-[0.2em] text-foreground/40 uppercase bg-background px-4 py-2 border border-foreground/10 rounded-full inline-flex shadow-sm">
                   Thinking about
                 </p>
               </div>

               {/* Center Marker */}
               <div className="absolute top-2 left-[var(--studio-spine-x)] z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center pointer-events-none md:top-1/2 md:-translate-y-1/2">
                  <div className="studio-node w-3 h-3 rounded-full border-[2px] border-foreground bg-background scale-0" />
               </div>

               {/* Left Content */}
               <div className="studio-content opacity-0 md:w-1/2 md:pr-16 pl-16 md:pl-0 relative z-10 w-full md:text-right">
                  <p className="text-[clamp(1rem,1.3vw,1.125rem)] font-light leading-relaxed text-foreground/80 md:ml-auto md:max-w-md">
                    What Buddhist philosophy and product design share: both are
                    practices of seeing things as they are, not as you wish they
                    were.
                  </p>
               </div>
            </div>

            {/* Infographic Item 3 */}
            <div className="studio-item flex flex-col md:flex-row items-start md:items-center relative">
               <div className="studio-content opacity-0 md:w-1/2 md:pr-16 md:text-right flex-shrink-0 mb-4 md:mb-0 pl-16 md:pl-0 w-full z-10 flex flex-col md:items-end">
                 <p className="font-mono text-[10px] tracking-[0.2em] text-foreground/40 uppercase bg-background px-4 py-2 border border-foreground/10 rounded-full inline-flex shadow-sm">
                   Obsessed with
                 </p>
               </div>

               <div className="absolute top-2 left-[var(--studio-spine-x)] z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center pointer-events-none md:top-1/2 md:-translate-y-1/2">
                  <div className="studio-node w-3 h-3 rounded-full border-[2px] border-foreground bg-background scale-0" />
               </div>

               <div className="studio-content opacity-0 md:w-1/2 md:pl-16 pl-16 md:pr-0 relative z-10 w-full">
                  <p className="text-[clamp(1rem,1.3vw,1.125rem)] font-light leading-relaxed text-foreground/80 md:max-w-md">
                    The moment a complex product suddenly feels inevitable. That
                    breath of recognition. I reverse-engineer it.
                  </p>
               </div>
            </div>

            {/* Infographic Item 4 (Tools) */}
            <div className="studio-item flex flex-col md:flex-row-reverse items-start relative">
               <div className="studio-content opacity-0 md:w-1/2 md:pl-16 md:text-left flex-shrink-0 mb-6 md:mb-0 pl-16 md:pl-0 w-full z-10 flex flex-col md:items-start md:mt-2">
                 <p className="font-mono text-[10px] tracking-[0.2em] text-foreground/40 uppercase bg-background px-4 py-2 border border-foreground/10 rounded-full inline-flex shadow-sm">
                   Tools
                 </p>
               </div>

               <div className="absolute top-2 left-[var(--studio-spine-x)] z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center pointer-events-none md:top-6 md:-translate-y-1/2">
                  <div className="studio-node w-3 h-3 rounded-full border-[2px] border-foreground bg-background scale-0" />
               </div>

               <div className="studio-content opacity-0 md:w-1/2 md:pr-16 pl-16 md:pl-0 relative z-10 w-full">
                  <div className="space-y-4 rounded-2xl border border-foreground/5 bg-background/50 p-5 shadow-sm backdrop-blur-sm transition-colors duration-500 hover:border-foreground/20 md:ml-auto md:max-w-md md:p-6">
                    {tools.map((tool) => (
                      <div key={tool.name} className="group flex items-baseline justify-between border-b border-border/10 pb-3 last:border-0 last:pb-0">
                        <span className="text-[14px] tracking-tight text-foreground/90 transition-colors group-hover:text-foreground">
                          {tool.name}
                        </span>
                        <span className="text-[12px] text-muted-foreground/40 transition-colors group-hover:text-muted-foreground/60 italic font-light">
                          {tool.why}
                        </span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Infographic Item 5 (Reading) */}
            <div className="studio-item relative flex flex-col items-start pb-8 md:flex-row md:pb-12">
               <div className="studio-content opacity-0 md:w-1/2 md:pr-16 md:text-right flex-shrink-0 mb-6 md:mb-0 pl-16 md:pl-0 w-full z-10 flex flex-col md:items-end md:mt-2">
                 <p className="font-mono text-[10px] tracking-[0.2em] text-foreground/40 uppercase bg-background px-4 py-2 border border-foreground/10 rounded-full inline-flex shadow-sm">
                   Reading
                 </p>
               </div>

               <div className="absolute top-2 left-[var(--studio-spine-x)] z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center pointer-events-none md:top-6 md:-translate-y-1/2">
                  <div className="studio-node w-3 h-3 rounded-full border-[2px] border-foreground bg-background scale-0" />
               </div>

               <div className="studio-content opacity-0 md:w-1/2 md:pl-16 pl-16 md:pr-0 relative z-10 w-full">
                  <div className="space-y-4 rounded-2xl border border-foreground/5 bg-background/50 p-5 shadow-sm backdrop-blur-sm transition-colors duration-500 hover:border-foreground/20 md:max-w-md md:p-6">
                    {reading.map((book) => (
                      <div key={book.title} className="flex flex-col border-b border-border/10 pb-4 last:border-0 last:pb-0">
                        <span className="text-[14px] text-foreground/90 leading-tight mb-1">
                          {book.title}
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground/40 uppercase tracking-widest block">
                          {book.author}
                        </span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ACT 5 — BELIEFS (Pinned fullscreen sequence)
          ══════════════════════════════════════════════════ */}
      <section ref={beliefsRef} className="relative z-10 flex h-[82svh] w-full flex-col items-center justify-center overflow-hidden bg-foreground md:h-[100vh]">
        <div className="absolute top-12 left-0 w-full text-center">
            <p className="font-mono text-[10px] tracking-[0.3em] text-background/30 uppercase">
              Truths
            </p>
        </div>

        <div className="relative w-full h-full flex items-center justify-center">
          {/* Belief 1 */}
          <div className="belief-item absolute flex flex-col items-center text-center opacity-0 w-[90%] md:w-[60%]">
            <h3 className="text-[clamp(2.5rem,5vw,5.5rem)] leading-[1.05] font-light tracking-tight text-background">
              Every pixel is a decision.
            </h3>
            <p className="mt-6 text-[clamp(1.5rem,2.5vw,2.5rem)] font-light tracking-tight text-background/40 italic">
              Every decision is a position.
            </p>
          </div>

          {/* Belief 2 */}
          <div className="belief-item absolute flex flex-col items-center text-center opacity-0 w-[90%] md:w-[60%]">
            <h3 className="text-[clamp(2.5rem,5vw,5.5rem)] leading-[1.05] font-light tracking-tight text-background">
              The best interface dissolves.
            </h3>
            <p className="mt-6 text-[clamp(1.5rem,2.5vw,2.5rem)] font-light tracking-tight text-background/40 italic">
              Like everything worth making.
            </p>
          </div>

          {/* Belief 3 */}
          <div className="belief-item absolute flex flex-col items-center text-center opacity-0 w-[90%] md:w-[60%]">
            <h3 className="text-[clamp(2.5rem,5vw,5.5rem)] leading-[1.05] font-light tracking-tight text-background">
              Clarity is not a destination.
            </h3>
            <p className="mt-6 text-[clamp(1.5rem,2.5vw,2.5rem)] font-light tracking-tight text-background/40 italic">
              It is a daily practice.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ACT 6 — THE CLOSING (Grand Finale)
          ══════════════════════════════════════════════════ */}
      <ClosingCTA />

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-border/10 px-6 py-8 md:px-[15%] flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group"
        >
          <ArrowLeft className="size-4 text-muted-foreground/40 group-hover:-translate-x-1 group-hover:text-foreground transition-all" />
          <span className="text-[11px] font-mono tracking-widest text-muted-foreground/40 uppercase group-hover:text-foreground transition-colors">Back to work</span>
        </Link>
        <span className="text-[11px] font-mono tracking-widest text-muted-foreground/30 uppercase">
          &copy; 2026 Leon
        </span>
      </footer>

    </div>
  )
}
