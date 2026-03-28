import Link from "next/link"
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { Reveal } from "@/components/reveal"
import { ScrollFloat } from "@/components/scroll-effects"
import gullCover from "@/app/images/Gull.png"
import { HorizontalWork, type CompactProject } from "@/components/horizontal-work"
import { GsapTitle } from "@/components/gsap-title"
import { HeroSection } from "@/components/hero-section"
import { GradientButton } from "@/components/gradient-button"
import { MagneticButton } from "@/components/magnetic-button"
import { ClientLogos } from "@/components/client-logos"
import { ClosingCTA } from "@/components/closing-cta"
import { HowIWork } from "@/components/how-i-work"
import gotymeSavingCover from "@/app/images/GoTyme Saving.png"
import lovebirdsCover from "@/app/images/lovebirds.png"
import leonPortrait from "@/app/images/Leon.jpg"

/* ─────────────────────────────────────────────
   Data
   ───────────────────────────────────────────── */

const COMPACT_PROJECTS: CompactProject[] = [
  {
    name: "Gull Network",
    category: "DEX & Launchpad",
    year: "2023",
    href: "/projects/gull-network",
    desc: "Brand and product for the post-hype era.",
    role: "Product Designer",
    outcome: "Full rebrand and DEX interface. Shipped token launchpad to mainnet.",
    coverImage: gullCover,
  },
  {
    name: "Love Birds",
    category: "AI Dating",
    year: "2025",
    href: "/projects/love-birds",
    desc: "AI matchmaker that gets you a date in 48 hours.",
    role: "Product Designer & Builder",
    outcome: "Designed and built 0-to-1 MVP. AI-driven matching flow.",
    coverImage: lovebirdsCover,
  },
  {
    name: "GoTyme GoalSave",
    category: "Fintech",
    year: "2023",
    href: "/projects/gotyme-savings",
    desc: "Saving as a habit. Designed for the Philippines.",
    role: "UX Designer",
    outcome: "Goal-based savings feature shipped to millions of Filipino users.",
    coverImage: gotymeSavingCover,
  },
]

/* ─────────────────────────────────────────────
   Page
   ───────────────────────────────────────────── */

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden">


      {/* ══════════════════════════════════════════════════
          HERO — REIMAGINED
          ══════════════════════════════════════════════════ */}
      <HeroSection />

      {/* ══════════════════════════════════════════════════
          CLIENT LOGOS
          ══════════════════════════════════════════════════ */}
      <ClientLogos />

      {/* ══════════════════════════════════════════════════
          FEATURED WORK (HORIZONTAL SCROLL)
          ══════════════════════════════════════════════════ */}
      <HorizontalWork compactProjects={COMPACT_PROJECTS} />

      {/* ══════════════════════════════════════════════════
          PRINCIPLES - REIMAGINED GSAP "HOW I WORK"
          Linked along the spine line as stages
          ══════════════════════════════════════════════════ */}
      <HowIWork />

      {/* ══════════════════════════════════════════════════
          ABOUT
          ══════════════════════════════════════════════════ */}
      <section id="about" className="relative px-6 py-10 md:px-[200px] md:py-32 max-w-screen-2xl mx-auto">

        {/* Timeline spine — desktop only (mobile has no gutter for it) */}
        <div className="pointer-events-none hidden md:block absolute inset-y-0 md:left-[120px] -translate-x-1/2 w-px bg-foreground/[0.08]" />

        {/* Node indicator — desktop only */}
        <div className="pointer-events-none absolute md:left-[120px] top-16 md:top-32 -translate-x-1/2 hidden md:flex items-center justify-center">
          <div className="h-3 w-3 rounded-full border-2 border-background bg-foreground/60" />
        </div>

        <Reveal variant="fade">
          <div className="mb-8 flex items-center gap-4 md:mb-16">
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/50 dark:text-muted-foreground/70 uppercase">
              About
            </p>
            <span className="h-px flex-1 bg-border/40" />
          </div>
        </Reveal>

        {/* Opening line */}
        <Reveal delay={80}>
          <GsapTitle 
            text="I don't start with screens. I start with what needs to become clear."
            className="mt-6 md:mt-0 max-w-[28ch] text-[clamp(1.5rem,3.5vw,3rem)] leading-[1.1] font-light tracking-tight text-foreground/90"
          />
        </Reveal>

        {/* Portrait + Bio grid */}
        <div className="mt-12 grid gap-10 md:mt-32 md:grid-cols-[1fr_1.4fr] md:gap-32 items-start">

          {/* Minimalist Cinematic Portrait Canvas */}
          <Reveal delay={0} variant="fade">
            <ScrollFloat speed={0.03}>
              <div className="relative rounded-[24px] bg-foreground/[0.03] overflow-hidden">
                <div className="aspect-[4/5] relative w-full h-full">
                  <Image
                    src={leonPortrait}
                    alt="Leon portrait"
                    fill
                    className="object-cover object-center"
                    sizes="(min-width: 768px) 40vw, 100vw"
                    quality={100}
                  />
                </div>
              </div>

              {/* Process — four verbs placed under the image as per reference */}
              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] tracking-widest uppercase md:mt-16 md:gap-x-6">
                <span className="text-foreground/80">Ask</span>
                <span className="text-foreground/20">·</span>
                <span className="text-foreground/80">Reduce</span>
                <span className="text-foreground/20">·</span>
                <span className="text-foreground/80">Shape</span>
                <span className="text-foreground/20">·</span>
                <span className="text-foreground/80">Ship</span>
              </div>
            </ScrollFloat>
          </Reveal>

          {/* Interactive Bio content */}
          <div className="md:pt-4 flex flex-col gap-12 md:gap-20">

            {/* STATUS BOARD: Ultra clean, no borders */}
            <Reveal delay={100} variant="fade">
              <div className="flex flex-col">
                <div className="flex flex-col gap-6">
                {[
                  { label: "Right now", value: "Taking a break — deep-diving into AI and the latest technologies" },
                  { label: "Working on", value: "Building MCP servers to enhance designers' productivity with AI" },
                  { label: "Reading", value: "The Shape of Design, Frank Chimero" },
                  { label: "Using", value: "Figma \u00b7 Framer \u00b7 Spline \u00b7 Photoshop \u00b7 Illustrator \u00b7 After Effects \u00b7 Linear \u00b7 Notion \u00b7 HTML/CSS/JS \u00b7 Cursor \u00b7 Claude Code \u00b7 Codex \u00b7 OpenClaw" },
                ].map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] items-baseline">
                    <span className="font-mono text-[9px] tracking-[0.15em] text-muted-foreground/40 uppercase">
                      {item.label}
                    </span>
                    <span className="text-[13px] md:text-[14.5px] text-muted-foreground/80 font-light">
                      {item.value}
                    </span>
                  </div>
                ))}
                </div>
              </div>
            </Reveal>

            {/* Smooth Bio paragraphs */}
            <div className="space-y-6 text-[14.5px] leading-[1.8] text-muted-foreground/90 md:text-[15px] font-light">
              <Reveal delay={200} variant="fade">
                <p>
                  I specialize in 0-to-1 work. Taking something that doesn't exist yet and giving it structure, logic, and a point of view. I start with what needs to become clear, then I remove everything that doesn't support it.
                </p>
              </Reveal>
              <Reveal delay={300} variant="fade">
                <p>
                  AI is part of how I work — not as a trend, but as a way to think deeper and move faster through ambiguity. The best products don't have the most features. They have the clearest thinking behind them.
                </p>
              </Reveal>
            </div>
            
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TESTIMONIALS
          ══════════════════════════════════════════════════ */}
      <section className="relative px-6 py-10 md:px-[200px] md:py-24 max-w-screen-2xl mx-auto">

        <Reveal variant="fade">
          <div className="mb-8 flex items-center gap-4 md:mb-10">
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/50 dark:text-muted-foreground/70 uppercase">
              What people say
            </p>
            <span className="h-px flex-1 bg-border/40" />
          </div>
        </Reveal>

        <div className="divide-y divide-border/10">
          {[
            {
              quote: "Leon consistently demonstrated a sharp product mindset, user-obsessed design thinking, and strong execution capability. One of his greatest strengths is his ability to turn minimal product requirements into fully realized, high-impact product experiences.",
              name: "Sowmya Raghavan",
              role: "Venture Builder · RWA, DeFi, Payments",
            },
            {
              quote: "I have been always impressed with how high quality An\u2019s mobile designs turned out to be. Not only they accomplish in catching eyes of the users but also very straightforward for our development team to follow through. We experienced a 22% increase in Proposal Win Rate when we switched to rely on his creativity.",
              name: "Huy (Jim)",
              role: "Business & Digital Transformation Expert",
            },
            {
              quote: "An is a person who will never exchange the quality of products for the sake of time. His spirit of responsibility, as well as pixel-perfect consciousness, is the one that makes him really stand out.",
              name: "Nghia Mai",
              role: "Senior Software Engineer",
            },
          ].map((t, i) => (
            <Reveal key={i} delay={i * 100} variant="fade">
              <figure className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 md:gap-10 py-6 md:py-10 items-baseline">
                <figcaption className="flex flex-col gap-1">
                  <span className="text-[15px] font-medium tracking-tight text-foreground/80">{t.name}</span>
                  <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted-foreground/40 dark:text-muted-foreground/60">{t.role}</span>
                </figcaption>
                <blockquote>
                  <p className="text-[clamp(0.9rem,1.4vw,1.1rem)] font-light leading-[1.7] text-foreground/60">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </blockquote>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA — RESOLUTION
          ══════════════════════════════════════════════════ */}
      <div id="contact" className="relative group">

         <ClosingCTA />
      </div>

      {/* ── Footer ── */}
      <Reveal variant="fade" delay={0} threshold={0.5}>
        <footer className="border-t border-border/10 px-6 py-8 md:px-[300px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground/20 dark:text-muted-foreground/40">
              &copy; 2026 Leon
            </span>
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com/in/nguyentuongan/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground/20 dark:text-muted-foreground/40 hover:text-foreground/60 transition-colors">
                LinkedIn
              </a>
              <a href="https://t.me/yangtinakpo" target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground/20 dark:text-muted-foreground/40 hover:text-foreground/60 transition-colors">
                Telegram
              </a>
            </div>
          </div>
        </footer>
      </Reveal>

    </main>
  )
}
