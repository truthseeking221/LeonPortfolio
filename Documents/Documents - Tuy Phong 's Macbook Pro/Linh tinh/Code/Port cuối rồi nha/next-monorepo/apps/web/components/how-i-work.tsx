"use client"

import React, { useState } from "react"
import { Reveal } from "@/components/reveal"
import { ScrollFloat } from "@/components/scroll-effects"
import { cn } from "@workspace/ui/lib/utils"

const PRINCIPLES = [
  {
    num: "01",
    statement: "Start with what needs to become clear — not with a screen.",
    detail: "Every project begins with the same question: what is the single most important thing this product needs to communicate? The screen comes after the answer.",
  },
  {
    num: "02",
    statement: "Design the system, not just the surface.",
    detail: "A beautiful screen that doesn't scale is a prototype. The system — tokens, components, patterns, rules — is what lets a team move fast without breaking things.",
  },
  {
    num: "03",
    statement: "If removing it doesn't break anything, it was never needed.",
    detail: "Every element must earn its place. Decoration is debt. Clarity comes from subtraction, not addition.",
  },
  {
    num: "04",
    statement: "Every transition should say something or say nothing at all.",
    detail: "Motion is communication. If an animation doesn't reinforce meaning, hierarchy, or spatial relationships, it's noise.",
  },
  {
    num: "05",
    statement: "Speed is a design input. If the team can't move with it, it's wrong.",
    detail: "A design system that slows down the team is not a design system. It's overhead. Pragmatism over perfection.",
  },
]

export function HowIWork() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="relative px-6 py-10 md:px-[200px] md:py-32 max-w-screen-2xl mx-auto">
      {/* Timeline spine — desktop only (mobile has no gutter for it) */}
      <div className="pointer-events-none hidden md:block absolute inset-y-0 md:left-[120px] -translate-x-1/2 w-px bg-foreground/[0.08]" />

      {/* Node indicator — desktop only */}
      <div className="pointer-events-none absolute md:left-[120px] top-16 md:top-32 -translate-x-1/2 hidden md:flex items-center justify-center">
        <div className="h-3 w-3 rounded-full border-2 border-background bg-foreground/60" />
      </div>

      <Reveal variant="fade">
        <div className="mb-8 flex items-center gap-4 md:mb-16">
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/50 dark:text-muted-foreground/70 uppercase">
            How I work
          </p>
          <span className="h-px flex-1 bg-border/40" />
        </div>
      </Reveal>

      <div 
        className="relative ml-0 md:ml-12 border-l border-border/20 pl-8 md:pl-16 flex flex-col gap-10 md:gap-12"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {PRINCIPLES.map((p, i) => {
          const isHovered = hoveredIndex === i
          const isAnyHovered = hoveredIndex !== null
          const isDimmed = isAnyHovered && !isHovered

          return (
            <Reveal key={p.num} delay={i * 60}>
              <div 
                className={cn(
                  "group relative flex flex-col md:flex-row items-start gap-4 md:gap-8 cursor-default transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isDimmed ? "md:opacity-40 md:blur-[1.5px]" : "opacity-100 blur-0"
                )}
                onMouseEnter={() => setHoveredIndex(i)}
              >
                {/* Branch connection for infographic */}
                <div 
                  className={cn(
                    "absolute -left-8 md:-left-16 top-6 h-px w-8 md:w-12 transition-all duration-500 ease-out origin-left",
                    isHovered ? "bg-foreground scale-x-100" : "bg-border/30 scale-x-75"
                  )} 
                />
                <div 
                  className={cn(
                    "absolute -left-[37px] md:-left-[69px] top-5 h-2 w-2 rounded-full border bg-background transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isHovered ? "border-foreground bg-foreground shadow-[0_0_12px_rgba(255,255,255,0.4)] dark:shadow-[0_0_12px_rgba(255,255,255,0.2)] md:scale-150" : "border-border shadow-none scale-100"
                  )} 
                />

                {/* Number block */}
                <ScrollFloat speed={0.03}>
                  <div className="shrink-0 w-12 md:w-16 pt-3 md:pt-[9px]">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "block leading-none font-bold tracking-tight transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] origin-left",
                        isHovered 
                          ? "text-foreground scale-[2.2]" 
                          : "text-foreground/30 text-2xl md:text-3xl scale-100"
                      )}
                    >
                      {p.num}
                    </span>
                  </div>
                </ScrollFloat>

                <div className="flex-1 pt-2">
                  {/* Statement */}
                  <p 
                    className={cn(
                      "text-[clamp(1.05rem,2vw,1.5rem)] leading-[1.35] tracking-tight transition-all duration-500",
                      isHovered ? "text-foreground" : "text-foreground/85"
                    )}
                  >
                    {p.statement}
                  </p>

                  {/* Detail — Always visible on mobile, expanded on hover for desktop using clean grid interpolation */}
                  <div 
                    className={cn(
                      "grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      // Mobile: always open. Desktop: Grid 0fr or 1fr
                      "grid-rows-[1fr] opacity-100 md:grid-rows-[0fr] md:opacity-0",
                      isHovered && "md:grid-rows-[1fr] md:opacity-100"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="mt-3 border-l border-foreground/20 pl-4 py-1 ml-1">
                        <p 
                          className={cn(
                            "max-w-[52ch] text-[14.5px] leading-relaxed text-muted-foreground/70 dark:text-muted-foreground/80 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            isHovered ? "md:translate-y-0" : "md:-translate-y-2"
                          )}
                        >
                          {p.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
