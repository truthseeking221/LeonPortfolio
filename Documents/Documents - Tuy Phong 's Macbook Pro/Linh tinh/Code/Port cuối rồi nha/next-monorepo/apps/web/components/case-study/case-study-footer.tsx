"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"

export const PROJECTS = [
  {
    id: "nodo-ai",
    title: "NODO AI",
    subtitle: "Designing an AI-powered DeFi protocol",
    category: "DeFi Infrastructure",
    href: "/projects/nodo-ai"
  },
  {
    id: "tymebank-crypto",
    title: "TymeBank Crypto",
    subtitle: "Bringing crypto to a mass-market banking app in an emerging market",
    category: "Fintech / Retail",
    href: "/projects/tymebank-crypto"
  },
  {
    id: "gotyme-savings",
    title: "GoTyme Savings",
    subtitle: "Gamifying financial habits for Southeast Asia",
    category: "Fintech / Neobank",
    href: "/projects/gotyme-savings"
  },
  {
    id: "gull-network",
    title: "GullNetwork",
    subtitle: "DeFi ecosystem for L3 blockchain",
    category: "Web3 / DeFi",
    href: "/projects/gull-network"
  },
  {
    id: "love-birds",
    title: "Love & Birds",
    subtitle: "Modernizing the dating app experience",
    category: "Consumer / Mobile",
    href: "/projects/love-birds"
  }
]

export function CaseStudyFooter({ currentProject }: { currentProject: string }) {
  const currentIndex = PROJECTS.findIndex((p) => p.id === currentProject)
  
  // If not found, fallback to 0
  const safeIndex = currentIndex === -1 ? 0 : currentIndex
  
  // Next project wraps around
  const nextProject = PROJECTS[(safeIndex + 1) % PROJECTS.length]!
  const prevProject = PROJECTS[(safeIndex - 1 + PROJECTS.length) % PROJECTS.length]!

  // Remaining projects
  const remainingProjects = PROJECTS.filter((p) => p.id !== currentProject && p.id !== nextProject.id)

  return (
    <div className="mx-auto w-full max-w-[1340px] px-6 md:px-10 lg:px-14">
      {/* 1. Next Project Hero Banner */}
      <div className="border-t border-border/30 pt-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <p className="font-mono text-[10px] tracking-wider text-muted-foreground/30 uppercase">Up Next</p>
          <Link href={nextProject.href} className="group mt-4 block">
            <h3 className="text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.9] font-medium tracking-tighter text-foreground/40 transition-colors duration-500 group-hover:text-foreground">
              {nextProject.title}
              <ArrowRight className="mb-2 ml-4 hidden md:inline-block size-[0.6em] transition-transform duration-500 group-hover:translate-x-4 opacity-0 -translate-x-8 group-hover:opacity-100" />
            </h3>
          </Link>
          <p className="mt-4 max-w-[40ch] text-sm text-muted-foreground/40 transition-colors duration-300 md:group-hover:text-muted-foreground mx-auto md:mx-0">
            {nextProject.subtitle}
          </p>
        </div>
        
        {/* Next/Prev Navigation Buttons */}
        <div className="flex items-center justify-center md:justify-end gap-3 pb-2 shrink-0">
          <Link 
            href={prevProject.href}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border/20 bg-muted/5 transition-all hover:bg-foreground/5 active:scale-95"
            aria-label="Previous Project"
          >
            <ArrowLeft className="size-4 opacity-50" />
          </Link>
          <Link 
            href={nextProject.href}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border/20 bg-muted/5 transition-all hover:bg-foreground/5 hover:border-foreground/20 active:scale-95 group"
            aria-label="Next Project"
          >
            <ArrowRight className="size-4 opacity-50 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* 2. All other projects list (Elegant horizontal/vertical accordion-like list) */}
      <div className="mt-20 md:mt-32 pt-16 border-t border-border/10">
        <p className="font-mono text-[10px] tracking-widest text-muted-foreground/30 uppercase mb-8 text-center md:text-left">
          Index of Case Studies
        </p>
        
        <div className="flex flex-col">
          {PROJECTS.map((project, i) => {
            const isActive = project.id === currentProject
            return (
              <Link
                key={project.id}
                href={isActive ? "#" : project.href}
                className={`group flex flex-col md:flex-row md:items-center justify-between gap-4 py-8 border-b border-border/10 transition-all duration-300 ${
                  isActive ? "opacity-30 cursor-default pointer-events-none" : "hover:px-4 hover:bg-foreground/[0.02]"
                }`}
              >
                <div className="flex items-baseline gap-6 md:gap-10">
                  <span className="font-mono text-xs text-muted-foreground/20">{(i + 1).toString().padStart(2, "0")}</span>
                  <h4 className="text-xl md:text-3xl font-medium tracking-tight transition-colors group-hover:text-foreground">
                    {project.title}
                  </h4>
                </div>
                
                <div className="flex items-center justify-between w-full md:w-auto md:gap-20">
                  <span className="font-mono text-[10px] md:text-xs text-muted-foreground/40 md:w-40 md:text-right uppercase tracking-wider">
                    {project.category}
                  </span>
                  {!isActive && (
                    <ArrowUpRight className="size-4 opacity-0 transition-all duration-300 md:-translate-x-4 md:translate-y-4 group-hover:opacity-50 group-hover:translate-x-0 group-hover:translate-y-0 text-muted-foreground hidden md:block" />
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* 3. Get in touch */}
      <div className="mt-32 border-t border-border/20 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-xl font-medium tracking-tight md:text-2xl text-foreground/80">
            Let's build something remarkable.
          </p>
        </div>
        <a 
          href="mailto:leondesigner221@gmail.com" 
          className="group flex flex-col items-center md:items-start"
        >
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground/40 uppercase mb-2">Get in touch</span>
          <span className="inline-block text-sm sm:text-base border-b border-foreground/20 pb-1 transition-colors group-hover:border-foreground/80 group-hover:text-foreground/80">
            leondesigner221@gmail.com
          </span>
        </a>
      </div>
    </div>
  )
}
