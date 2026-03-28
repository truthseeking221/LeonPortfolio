"use client"

import { useRef } from "react"
import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import nodoAiCover from "@/app/images/NODO AI.png"
import tymeBankCryptoCover from "@/app/images/TymeBank Crypto.png"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Reveal } from "@/components/reveal"

gsap.registerPlugin(ScrollTrigger)

export interface CompactProject {
  name: string
  href: string
  year: string
  category: string
  desc: string
  role?: string
  outcome?: string
  coverImage?: StaticImageData
}

/* ── Shared card data for hardcoded projects ── */
const NODO = {
  name: "NODO AI",
  label: "NODO",
  href: "/projects/nodo-ai",
  year: "2024",
  desc: "Vault management for non-crypto users. Clarity as the core product decision.",
  role: "Lead Product Designer",
  outcome: "Redesigned autonomous vault UX. Research to shipped MVP on Sui.",
  category: "DeFi Infrastructure",
}

const TYMEBANK = {
  name: "TymeBank Crypto",
  label: "TymeBank",
  href: "/projects/tymebank-crypto",
  year: "2024",
  desc: "Crypto onboarding for a 5-million-customer bank.",
  role: "Senior Product Designer",
  outcome: "Shipped crypto buy/sell flow to 5M+ users. Reduced onboarding drop-off.",
  category: "Fintech · 0 to 1",
}

/* ── Reusable card with cover image ── */
function CoverCard({
  href, name, label, year, desc, role, outcome, category, coverImage, sizes, priority,
}: {
  href: string; name: string; label?: string; year?: string; desc: string
  role: string; outcome: string; category: string
  coverImage: StaticImageData; sizes: string; priority?: boolean
}) {
  return (
    <Link href={href} className="group relative inset-0 block h-full overflow-hidden rounded-[24px] bg-foreground/5">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={coverImage}
          alt={`${name} — ${desc}`}
          fill
          className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.07]"
          sizes={sizes}
          quality={90}
          priority={priority}
        />
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 transition-opacity duration-[1s] group-hover:opacity-95" />
      </div>

      {/* View Project button */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3 overflow-hidden pr-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          View Project
        </span>
        <div className="flex h-8 w-8 -translate-y-[150%] translate-x-[150%] items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-all duration-[1s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-0 group-hover:translate-y-0">
          <ArrowUpRight className="h-3 w-3 text-white" />
        </div>
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 z-10 w-full p-6 md:p-10 transition-transform duration-[1s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div className="border-l-2 border-white/15 pl-5 transition-colors group-hover:border-white/50">
            <span className="font-mono text-[10px] tracking-[0.18em] text-white/50 uppercase mb-3 block">
              {label ?? name}
            </span>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white mb-2">{name}</h3>
            <p className="text-white/70 max-w-sm font-light text-[14px] leading-relaxed">{desc}</p>
          </div>
          <div className="hidden md:flex flex-col items-end text-right shrink-0 max-w-[26ch]">
            <span className="font-mono text-[9px] tracking-[0.15em] text-white/50 uppercase mb-1">Role</span>
            <p className="text-white/70 text-[13px] font-light leading-relaxed mb-3">{role}</p>
            <span className="font-mono text-[9px] tracking-[0.15em] text-white/50 uppercase mb-1">Outcome</span>
            <p className="text-white/70 text-[13px] font-light leading-relaxed">{outcome}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ── Text-only card (no cover image) ── */
function PlaceholderCard({
  href, name, year, desc, role, outcome, category,
}: {
  href: string; name: string; year: string; desc: string
  role: string; outcome: string; category: string
}) {
  return (
    <Link href={href} className="group relative inset-0 block h-full overflow-hidden rounded-[24px] bg-foreground/5 border border-border/10">
      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 transition-all duration-700 group-hover:bg-foreground/[0.03]">
        <div className="flex justify-between items-start z-10">
          <span className="font-mono text-[10px] tracking-[0.18em] text-foreground/[0.4] uppercase">{name}</span>
          <span className="font-mono text-[10px] text-muted-foreground/40">{year}</span>
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-6 w-6 opacity-30 transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[2.5] group-hover:rotate-180 group-hover:opacity-10">
            <div className="absolute top-1/2 left-0 h-px w-full -translate-y-px bg-foreground" />
            <div className="absolute top-0 left-1/2 h-full w-px -translate-x-px bg-foreground" />
          </div>
        </div>

        <div className="relative z-10 mt-auto border-l-2 border-border/40 pl-5 transition-all duration-[1s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:border-foreground/50 group-hover:-translate-y-2">
          <h3 className="mb-3 text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">{name}</h3>
          <p className="mb-4 max-w-sm text-[14px] font-light leading-relaxed text-foreground/60">{desc}</p>
          <div className="mb-3 hidden flex-wrap gap-x-8 gap-y-2 md:flex">
            <div>
              <span className="font-mono text-[8px] tracking-[0.15em] text-muted-foreground/40 uppercase block mb-0.5">Role</span>
              <p className="text-[12px] font-light text-foreground/60">{role}</p>
            </div>
            <div>
              <span className="font-mono text-[8px] tracking-[0.15em] text-muted-foreground/40 uppercase block mb-0.5">Outcome</span>
              <p className="text-[12px] font-light text-foreground/60">{outcome}</p>
            </div>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">{category}</div>
        </div>
      </div>

    </Link>
  )
}

/* ── Render a single project card (cover or placeholder) ── */
function ProjectCard({
  project,
  sizes,
  priority,
}: {
  project: { name: string; label?: string; href: string; year: string; desc: string; role: string; outcome: string; category: string; coverImage?: StaticImageData }
  sizes: string
  priority?: boolean
}) {
  if (project.coverImage) {
    return (
      <CoverCard
        href={project.href}
        name={project.name}
        label={project.label}
        year={project.year}
        desc={project.desc}
        role={project.role}
        outcome={project.outcome}
        category={project.category}
        coverImage={project.coverImage}
        sizes={sizes}
        priority={priority}
      />
    )
  }
  return (
    <PlaceholderCard
      href={project.href}
      name={project.name}
      year={project.year}
      desc={project.desc}
      role={project.role}
      outcome={project.outcome}
      category={project.category}
    />
  )
}

/* ── Main component ── */
export function HorizontalWork({
  compactProjects,
}: {
  compactProjects: readonly CompactProject[]
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // GSAP horizontal scroll — desktop only via matchMedia
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add("(min-width: 768px)", () => {
      if (!sectionRef.current || !wrapperRef.current) return

      const totalScroll = wrapperRef.current.scrollWidth - window.innerWidth

      gsap.to(wrapperRef.current, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          end: () => "+=" + totalScroll,
        },
      })
    })

    // matchMedia.revert() kills all ScrollTriggers created inside
    return () => mm.revert()
  }, { scope: sectionRef })

  // Build unified card list
  const allProjects = [
    { ...NODO, coverImage: nodoAiCover, priority: true },
    { ...TYMEBANK, coverImage: tymeBankCryptoCover, priority: false },
    ...compactProjects.map((p) => ({
      name: p.name,
      href: p.href,
      year: p.year,
      desc: p.desc,
      role: p.role ?? "Product Designer",
      outcome: p.outcome ?? "Shipped end-to-end product experience.",
      category: p.category,
      coverImage: p.coverImage,
      priority: false,
    })),
  ]

  return (
    <>
      {/* ═══════════════════════════════════════
         MOBILE — Vertical stacked, normal scroll
         No pinning, no horizontal overflow, no trapping.
         ═══════════════════════════════════════ */}
      <section id="work" className="block md:hidden px-6 py-12">
        <Reveal variant="fade">
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/50 uppercase mb-4">
            Featured Work
          </p>
          <h2 className="text-3xl font-light tracking-tight mb-6">
            Selected Projects.
          </h2>
          <span className="block h-px w-24 bg-foreground/10 mb-8" />
        </Reveal>

        <div className="flex flex-col gap-6">
          {allProjects.map((project, i) => (
            <Reveal key={project.name} delay={i * 80}>
              <div className="relative aspect-[4/3] w-full">
                <ProjectCard project={project} sizes="100vw" priority={project.priority} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
         DESKTOP — Horizontal scroll (GSAP pinned)
         ═══════════════════════════════════════ */}
      <section
        ref={sectionRef}
        className="relative hidden md:flex h-screen items-center overflow-hidden bg-background pt-20"
      >
        <div
          ref={wrapperRef}
          className="flex h-full items-center pl-[200px]"
        >
          {/* Intro Slide */}
          <div className="flex-shrink-0 w-[40vw] h-full flex flex-col justify-center pr-24">
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/50 uppercase mb-6">
              Featured Work
            </p>
            <h2 className="text-6xl font-light tracking-tight mb-8">
              Selected<br />Projects.
            </h2>
            <span className="h-px w-32 bg-foreground/10 mb-8" />
            <p className="text-muted-foreground/60 max-w-sm mb-12">
              A curated selection of my recent design and engineering endeavors.
            </p>
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-foreground/20" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/40 dark:text-muted-foreground/60">
                Scroll to Explore
              </span>
            </div>
          </div>

          {/* Project cards */}
          {allProjects.map((project) => (
            <div key={project.name} className="relative mr-24 aspect-[4/3] w-[50vw] flex-shrink-0">
              <ProjectCard project={project} sizes="50vw" priority={project.priority} />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
