import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { TableOfContents } from "@/components/case-study/table-of-contents"
import { ImagePlaceholder } from "@/components/case-study/image-placeholder"
import { CaseStudyFooter } from "@/components/case-study/case-study-footer"
import { MobileToC } from "@/components/case-study/mobile-toc"
import Image from "next/image"
import airdropPageImage from "../../images/Airdrop Page.png"
import gullSwapNativeDex from "../../images/GullSwap as the native DEX in the Manta ecosystem.png"
import tensionImage from "../../images/The tension between infrastructure utility and meme culture appeal.png"
import memeTradersBehavior from "../../images/How meme traders move across 3 chains.png"
import utilityVsPersonality from "../../images/Utility vs. personality across the DEX landscape.png"
import typeInvitationCodeImage from "../../images/Type invitation code.png"
import gullGameImage from "../../images/GullGame_ wallet verification, points, and invite system.png"
import tokenLaunchImage from "../../images/Token launch_ configuration to live trading.png"
import seagullEvolutionImage from "../../images/The seagull_ from first sketch to final character system.png"

export const metadata: Metadata = {
  title: "Gull Network — Case Study — Leon",
  description:
    "Brand, product, and character design for a meme-first DEX on Manta Network. A case study by Leon.",
}

const tocItems = [
  { id: "snapshot", label: "Overview" },
  { id: "context", label: "Context" },
  { id: "challenge", label: "Challenge" },
  { id: "role", label: "Role" },
  { id: "objectives", label: "Objectives" },
  { id: "process", label: "Process" },
  { id: "discovery", label: "Discovery" },
  { id: "insights", label: "Insights" },
  { id: "principles", label: "Principles" },
  { id: "architecture", label: "Architecture" },
  { id: "exploration", label: "Exploration" },
  { id: "solution", label: "Solution" },
  { id: "brand", label: "Brand & Character" },
  { id: "outcomes", label: "Outcomes" },
  { id: "reflection", label: "Reflection" },
]

const contentRail = "mx-auto w-full max-w-[1100px] px-6 md:px-10 lg:px-14"
const sectionRail = `${contentRail} py-24 md:py-32`
const dividerRail = "mx-auto h-px w-[calc(100%-3rem)] max-w-[1100px] bg-border/30 md:w-[calc(100%-5rem)] lg:w-[calc(100%-7rem)]"

export default function GullNetworkCaseStudy() {
  return (
    <main className="min-h-screen overflow-x-hidden">

      <div className="xl:grid xl:grid-cols-[120px_1fr]">
        <aside className="hidden xl:block xl:pl-6">
          <TableOfContents items={tocItems} />
        </aside>
        <MobileToC items={tocItems} />
        <div className="min-w-0">

      {/* ═══ HERO ═══ */}
      <section className={`${contentRail} relative pt-28 pb-16 md:pt-36 md:pb-24`}>
        <div className="flex items-center gap-3">
          <Badge variant="outline">DEX & Launchpad</Badge>
          <Badge variant="secondary">Shipped</Badge>
        </div>

        <h1 className="mt-6 text-[clamp(3.5rem,12vw,10rem)] leading-[0.88] font-medium tracking-tighter">
          Gull Network
        </h1>

        <p className="mt-6 max-w-[38ch] text-xl leading-relaxed font-light text-muted-foreground md:text-2xl">
          Manta had a chain. Nobody was on it.<br />
          We built the DEX, the mascot, and the
          reason 109K people showed up.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-border/40 pt-8 md:grid-cols-5 md:gap-x-12">
          {[
            { label: "Role", value: "Product Designer & Brand Lead" },
            { label: "Timeline", value: "Q1 — Q4 2024" },
            { label: "Scope", value: "0 → 1 Product + Brand" },
            { label: "Platform", value: "Web (Manta Network)" },
            { label: "Status", value: "Launched & Rebranded" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-mono text-[10px] tracking-wider text-muted-foreground/40 uppercase">{label}</p>
              <p className="mt-1.5 text-sm text-foreground/80">{value}</p>
            </div>
          ))}
        </div>

        {/* Interrupt block — the tension stated upfront */}
        <div className="mt-16 grid gap-6 md:grid-cols-[1fr_1px_1fr] md:gap-10">
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            DeFi infrastructure is serious. Meme culture is not. This product needed both — codeless token launches for project teams who don&apos;t write Solidity, and a community experience memorable enough that degens screenshot it and post it.
          </p>
          <div className="hidden bg-border/30 md:block" />
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            The seagull mascot has 60+ expressions. The DEX handles token launch, liquidity, farms, and staking. The airdrop verifies real trading history across three chains. The landing page scrolls from sky to seafloor. Every surface balances chaos with clarity.
          </p>
        </div>

        <div className="mt-16">
          <figure className="group">
            <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-muted/20">
              <Image
                src={airdropPageImage}
                alt="GullGame Airdrop Page — the entry point for most users"
                className="h-auto w-full"
                sizes="(max-width: 768px) 100vw, 1100px"
                priority
                placeholder="blur"
              />
            </div>
            <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
              GullGame — where 109K wallets entered the ecosystem
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ═══ SNAPSHOT ═══ */}
      <section id="snapshot" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">At a glance</p>

        {/* Big statement + context — asymmetric */}
        <div className="mt-10 grid gap-12 md:mt-14 md:grid-cols-[1.4fr_1fr] md:gap-20">
          <div className="space-y-8">
            <h2 className="max-w-[20ch] text-2xl font-medium leading-tight tracking-tight md:text-3xl">
              A DEX that is also a meme brand. A mascot that works on sticker packs and on farm dashboards. A gamified airdrop that checks your real trading history across three chains.
            </h2>
            <p className="max-w-[45ch] text-sm leading-relaxed text-muted-foreground/60">
              Every design decision was a first. No reference existed for what we were building.
            </p>
          </div>
          <div className="space-y-6">
            {[
              { title: "The bet", content: "Can infrastructure have personality without sacrificing credibility? Can a brand built for degens survive a pivot to enterprise AI?" },
              { title: "What shipped", content: "Character system (60+ variations). DEX with codeless everything. Gamified airdrop. Environmental landing page. Social templates, sticker pack, the full visual language." },
              { title: "What happened", content: "$3.7M raised. 109K followers. 900 VIP NFTs sold in 12 hours. Token on Gate.io and Finceptor. Manta endorsed it as their native DEX." },
            ].map(({ title, content }) => (
              <div key={title} className="border-l-2 border-border/20 pl-5">
                <h3 className="text-xs font-medium tracking-tight text-foreground/70">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground/50">{content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={dividerRail} />

      {/* ═══ CONTEXT ═══ */}
      <section id="context" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Context</p>
        <h2 className="mt-4 max-w-[20ch] text-3xl font-medium tracking-tight md:text-4xl">State of play</h2>

        {/* Staccato observations — not paragraphs */}
        <div className="mt-12 space-y-4 md:mt-16">
          {[
            "Manta Network had the infrastructure. It did not have a single native DEX.",
            "Projects that wanted to launch on Manta had to deploy their own contracts. Non-technical teams couldn't participate.",
            "Meanwhile, the top 100 memecoins were powering some of the most active trading in crypto — on other chains.",
            "The platforms serving them were either dense terminal UIs or empty hype pages. Nobody combined real DeFi utility with the energy that makes a community form.",
          ].map((line, i) => (
            <p key={i} className={`max-w-[60ch] text-base leading-relaxed md:text-lg ${i === 0 ? "text-foreground/80 font-medium" : "text-muted-foreground"}`}>
              {line}
            </p>
          ))}
        </div>

        {/* Stats — tight, horizontal */}
        <div className="mt-14 flex flex-wrap gap-8 border-t border-border/20 pt-8 md:gap-16">
          {[
            { stat: "$3.7M", label: "Raised" },
            { stat: "109K", label: "Followers" },
            { stat: "500M", label: "Token supply" },
            { stat: "9", label: "Chains" },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p className="text-2xl font-medium tracking-tight text-foreground/70 md:text-3xl">{stat}</p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground/35">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <figure className="group">
            <div className="overflow-hidden rounded-2xl border border-border/40 bg-muted/20">
              <Image
                src={gullSwapNativeDex}
                alt="GullSwap as the native DEX in the Manta ecosystem"
                width={gullSwapNativeDex.width}
                height={gullSwapNativeDex.height}
                sizes="(min-width: 768px) 100vw, calc(100vw - 3rem)"
                className="h-auto w-full"
                quality={100}
              />
            </div>
            <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
              GullSwap as the native DEX in the Manta ecosystem
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ═══ CHALLENGE ═══ */}
      <section id="challenge" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">The Challenge</p>
        <h2 className="mt-4 max-w-[24ch] text-3xl font-medium tracking-tight md:text-4xl">Two audiences. One product. Zero precedent.</h2>

        {/* The core tension — stated as a contrast block */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border/20 bg-border/20 md:grid-cols-2">
          <div className="space-y-4 bg-background p-6 md:p-8">
            <p className="font-mono text-[10px] tracking-wider text-muted-foreground/30 uppercase">Audience A</p>
            <p className="text-lg font-medium tracking-tight">Project teams</p>
            <p className="text-sm leading-relaxed text-muted-foreground/60">Need: token configuration, tokenomics, reward schedules. Judge by: time-to-launch. Will leave if: it requires an engineer.</p>
          </div>
          <div className="space-y-4 bg-background p-6 md:p-8">
            <p className="font-mono text-[10px] tracking-wider text-muted-foreground/30 uppercase">Audience B</p>
            <p className="text-lg font-medium tracking-tight">Memecoin traders</p>
            <p className="text-sm leading-relaxed text-muted-foreground/60">Need: invitations, points, leaderboards, a mascot worth posting. Judge by: vibes. Will leave if: it looks like every other DEX.</p>
          </div>
        </div>

        <blockquote className="mt-14 max-w-[32ch] border-l-2 border-foreground/10 pl-6 text-2xl leading-snug font-light tracking-tight text-foreground/80 md:ml-[10%] md:text-3xl">
          &quot;We need a button, not a GitHub repo.&quot;
          <cite className="mt-3 block font-mono text-[10px] font-normal tracking-wider text-muted-foreground/30 not-italic">Early project team</cite>
        </blockquote>

        {/* Tensions — not "problems" */}
        <div className="mt-16 space-y-6">
          {[
            { tension: "Infrastructure vs. Personality", detail: "Manta needed a serious DEX. The community needed a meme brand. Too playful → Manta walks. Too corporate → traders never show up." },
            { tension: "Trust vs. Speed", detail: "Codeless launch means abstracting smart contracts into forms. Every simplification is a trust decision. Get it wrong and real money disappears." },
            { tension: "Filtering vs. Gatekeeping", detail: "The airdrop had to verify real traders and block bots — without feeling like surveillance. On-chain proof, not KYC." },
          ].map(({ tension, detail }) => (
            <div key={tension} className="grid items-baseline gap-4 border-t border-border/15 pt-5 md:grid-cols-[200px_1fr] md:gap-8">
              <p className="text-sm font-medium tracking-tight">{tension}</p>
              <p className="text-sm leading-relaxed text-muted-foreground/60">{detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <figure className="group">
            <div className="overflow-hidden rounded-2xl border border-border/40 bg-muted/20">
              <Image
                src={tensionImage}
                alt="The tension between infrastructure utility and meme culture appeal"
                width={tensionImage.width}
                height={tensionImage.height}
                sizes="(min-width: 768px) 100vw, calc(100vw - 3rem)"
                className="h-auto w-full"
                quality={100}
              />
            </div>
            <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
              The tension between infrastructure utility and meme culture appeal
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ═══ ROLE ═══ */}
      <section id="role" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Role</p>
        <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">Surface area</h2>

        {/* Tighter format — inline tags, not bullet lists */}
        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
          <div>
            <h3 className="text-sm font-medium text-foreground/80">Built</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Brand identity", "Seagull mascot (60+ variants)", "GullGame airdrop", "DEX interface", "Token launch flow", "Landing page", "Social templates", "Sticker pack"].map((item) => (
                <span key={item} className="rounded-full border border-border/30 bg-muted/10 px-3 py-1 text-[11px] text-muted-foreground/60">{item}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground/80">Shaped</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Product strategy", "Airdrop mechanics", "Points math", "Token launch constraints", "Campaign direction", "Referral structure"].map((item) => (
                <span key={item} className="rounded-full border border-border/30 bg-muted/10 px-3 py-1 text-[11px] text-muted-foreground/60">{item}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground/80">Pushed</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Meme-first branding as strategy", "Invite-only as growth mechanic", "Character evolution = engagement", "Environmental storytelling"].map((item) => (
                <span key={item} className="rounded-full border border-border/30 bg-muted/10 px-3 py-1 text-[11px] text-muted-foreground/60">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className={dividerRail} />

      {/* ═══ OBJECTIVES ═══ */}
      <section id="objectives" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Objectives</p>
        <h2 className="mt-4 max-w-[22ch] text-3xl font-medium tracking-tight md:text-4xl">What success looks like</h2>

        {/* Two-column: signal on left, measure on right */}
        <div className="mt-14 space-y-0">
          {[
            { domain: "Community", signal: "A brand identity meme communities share without being asked", measure: "Organic meme creation from the mascot" },
            { domain: "Community", signal: "GullGame filters real traders and creates invite-driven growth", measure: "Bot rate below 5% on verified wallets" },
            { domain: "Business", signal: "Projects choose Manta because GullSwap makes launching easy", measure: "Only native DEX, endorsed by the chain" },
            { domain: "Product", signal: "Non-technical team launches a token in under 10 minutes", measure: "Zero code required, zero developer needed" },
            { domain: "Product", signal: "Sniper-proof LP listing on every token, no exceptions", measure: "Protection is architecture, not a toggle" },
            { domain: "Brand", signal: "One mascot that works in stickers, UI, social, and merch", measure: "60+ variations from a single character system" },
            { domain: "Growth", signal: "Invite system as a viral loop, not a marketing add-on", measure: "Referral bonuses reward depth, not volume" },
          ].map(({ domain, signal, measure }, i) => (
            <div key={i} className="grid items-baseline gap-4 border-t border-border/15 py-4 md:grid-cols-[80px_1fr_1fr] md:gap-8">
              <span className="font-mono text-[9px] tracking-wider text-muted-foreground/25 uppercase">{domain}</span>
              <p className="text-sm text-foreground/70">{signal}</p>
              <p className="text-xs text-muted-foreground/40">{measure}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PROCESS ═══ */}
      <section id="process" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Process</p>
        <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">The sequence</h2>

        {/* Compressed timeline — less ceremony */}
        <div className="mt-14 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-6">
          {[
            { phase: "01 — 02", title: "Map + Character", desc: "Audited competing DEXs across 3 chains. Studied how meme communities actually behave. Built the seagull from rough sketches to a modular system: expressions, items, poses, evolution stages. Locked the visual language." },
            { phase: "03 — 04", title: "Game + Exchange", desc: "Designed GullGame: multi-wallet verification, points engine, invite mechanics, leaderboard. Then the core DEX: swap, pools, farms, staking, codeless token launch. Every DeFi config is a visual form, not a code editor." },
            { phase: "05 — 06", title: "World + Ship", desc: "Layered landing page, social template system, sticker pack, marketing assets. Launched GullGame, iterated on feedback, supported Gate.io and Finceptor token launches, adapted for the Gull AI rebrand." },
          ].map(({ phase, title, desc }) => (
            <div key={phase} className="rounded-lg border border-border/20 bg-muted/5 p-5">
              <span className="font-mono text-[10px] text-muted-foreground/25">{phase}</span>
              <h3 className="mt-2 text-sm font-medium tracking-tight">{title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground/45">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className={dividerRail} />

      {/* ═══ DISCOVERY ═══ */}
      <section id="discovery" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Discovery</p>
        <h2 className="mt-4 max-w-[22ch] text-3xl font-medium tracking-tight md:text-4xl">Field notes</h2>

        <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {[
            { stat: "12+", label: "DEXs audited", accent: "oklch(0.72 0.16 160)" },
            { stat: "3", label: "Chains mapped", accent: "oklch(0.65 0.15 260)" },
            { stat: "100", label: "Memecoins reviewed", accent: "oklch(0.72 0.14 85)" },
            { stat: "4", label: "Audience segments", accent: "oklch(0.65 0.16 25)" },
          ].map(({ stat, label, accent }) => (
            <div key={label}>
              <p className="text-3xl font-medium tracking-tight md:text-4xl" style={{ color: accent }}>{stat}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground/50">{label}</p>
            </div>
          ))}
        </div>

        {/* Field notes — observation → so what */}
        <div className="mt-16 space-y-0">
          {[
            { observation: "Every DEX falls into one of two categories", detail: "Dense dashboards for power users. Or hype pages with nothing underneath. The pattern held across Manta, Solana, and BSC. Nobody combined utility with personality." },
            { observation: "Meme communities travel in packs", detail: "They follow invite codes. They screenshot wins. They rally around mascots, not features. Deeply skeptical of new platforms — but commit fast once social proof crosses a threshold." },
            { observation: "KYC kills adoption in this audience", detail: "But on-chain trading history is something traders show off. Wallet verification is proof of participation without surveillance." },
            { observation: "Multi-chain verification is the real gate", detail: "Checking trades across ETH, BSC, and Solana meant multi-wallet connection. The constraint shaped every interface decision before a single screen was designed." },
            { observation: "Token launch requires a developer on every other platform", detail: "Non-technical teams — a community manager and a marketer — are the actual customer for infrastructure tooling. If launching needs Solidity, they stay on chains where they already have engineers." },
            { observation: "Snipers drain value on every new listing", detail: "Bots watch the mempool and buy tokens in the first block. On some launches, they grabbed 40% of supply before the community could react. Protection can't be optional." },
          ].map(({ observation, detail }, i) => (
            <div key={i} className="grid gap-2 border-t border-border/15 py-5 md:grid-cols-[1fr_1.5fr] md:gap-10">
              <p className="text-sm font-medium text-foreground/70">{observation}</p>
              <p className="text-sm leading-relaxed text-muted-foreground/50">{detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <figure className="group">
            <div className="overflow-hidden rounded-lg border border-border/40 bg-muted/20">
              <Image
                src={utilityVsPersonality}
                alt="Utility vs. personality across the DEX landscape"
                width={utilityVsPersonality.width}
                height={utilityVsPersonality.height}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="h-auto w-full"
                quality={100}
              />
            </div>
            <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
              Utility vs. personality across the DEX landscape
            </figcaption>
          </figure>
          <figure className="group">
            <div className="overflow-hidden rounded-lg border border-border/40 bg-muted/20">
              <Image
                src={memeTradersBehavior}
                alt="How meme traders move across 3 chains"
                width={memeTradersBehavior.width}
                height={memeTradersBehavior.height}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="h-auto w-full"
                quality={100}
              />
            </div>
            <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
              How meme traders move across 3 chains
            </figcaption>
          </figure>
        </div>

        {/* User segments — kept but tighter */}
        <div className="mt-16">
          <h3 className="text-sm font-medium text-foreground/80">Four audiences. Same product.</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Memecoin Degen", desc: "Trades daily. Chases alpha. Posts wins. Motivated by exclusivity and status.", color: "#f59e0b" },
              { name: "Non-Tech Team", desc: "Has a community manager, not a developer. Judges everything by time-to-launch.", color: "#3b82f6" },
              { name: "Yield Farmer", desc: "Follows APR across chains. Will bridge to Manta if the numbers are right.", color: "#10b981" },
              { name: "Community Builder", desc: "Runs a Telegram or Discord. Wants referral tools and shareable assets.", color: "#8b5cf6" },
            ].map(({ name, desc, color }) => (
              <div key={name} className="relative overflow-hidden rounded-lg border border-border/30 bg-muted/10 p-4">
                <div className="absolute top-0 left-0 h-full w-[3px]" style={{ backgroundColor: color }} />
                <h4 className="text-xs font-medium">{name}</h4>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground/50">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What kept breaking — horizontal bars */}
        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-foreground/80">What kept breaking</h3>
            <p className="mt-2 text-xs text-muted-foreground/40">From the competitive audit</p>
            <div className="mt-6 space-y-4">
              {[
                { label: "Farm listing requires custom smart contracts", count: 9, max: 9 },
                { label: "No codeless path from idea to live token", count: 7, max: 9 },
                { label: "Snipers drain value on every new listing", count: 7, max: 9 },
                { label: "APRs locked at launch with no adjustment", count: 6, max: 9 },
                { label: "Every DEX looks and feels identical", count: 5, max: 9 },
                { label: "Airdrops overrun by bots, no verification", count: 5, max: 9 },
              ].map(({ label, count, max }) => (
                <div key={label} className="group">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground/60 transition-colors group-hover:text-foreground/70">{label}</span>
                    <span className="font-mono text-[11px] font-medium" style={{ color: `oklch(0.65 0.18 ${30 + (1 - count / max) * 20})` }}>{count}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted/20">
                    <div
                      className="h-full rounded-full transition-all duration-500 group-hover:opacity-100"
                      style={{
                        width: `${(count / max) * 100}%`,
                        background: `linear-gradient(90deg, oklch(0.72 0.17 30), oklch(0.62 0.2 20))`,
                        opacity: 0.7 + (count / max) * 0.3,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-foreground/80">What kept people away</h3>
            <p className="mt-2 text-xs text-muted-foreground/40">Barriers for both audiences</p>
            <div className="mt-6 space-y-4">
              {[
                { label: "Token launch requires a developer", count: 8, max: 8 },
                { label: "No personality in existing DEXs", count: 6, max: 8 },
                { label: "Airdrop fatigue from bot-infested drops", count: 6, max: 8 },
                { label: "Opaque reward timelines and mechanics", count: 5, max: 8 },
                { label: "Manta is young, perceived chain risk", count: 4, max: 8 },
              ].map(({ label, count, max }) => (
                <div key={label} className="group">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground/60 transition-colors group-hover:text-foreground/70">{label}</span>
                    <span className="font-mono text-[11px] font-medium" style={{ color: `oklch(0.60 0.14 260)` }}>{count}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted/20">
                    <div
                      className="h-full rounded-full transition-all duration-500 group-hover:opacity-100"
                      style={{
                        width: `${(count / max) * 100}%`,
                        background: `linear-gradient(90deg, oklch(0.65 0.14 260), oklch(0.50 0.16 270))`,
                        opacity: 0.6 + (count / max) * 0.4,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <blockquote className="mt-16 max-w-[34ch] border-l-2 border-foreground/10 pl-6 text-lg leading-snug font-light tracking-tight text-foreground/70 md:ml-[10%] md:text-xl">
          &quot;Dark mode. Line charts. Token pairs. Every DEX is the same DEX with a different logo.&quot;
          <cite className="mt-3 block font-mono text-[10px] font-normal tracking-wider text-muted-foreground/30 not-italic">Memecoin trader, community research</cite>
        </blockquote>
      </section>

      {/* ═══ INSIGHTS ═══ */}
      <section id="insights" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Insights</p>
        <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">Six signals from the market</h2>

        <div className="mt-14 space-y-0 md:mt-20">
          {[
            {
              number: "01",
              title: "Communities form around characters, not charts",
              observation: "Dogecoin. Pepe. Shiba. The strongest crypto communities rally around mascots. A character gives people something to create with, share, and identify through.",
              response: "The seagull became the foundation. 60+ expressions, stickers, templates, in-product illustrations. A visual language the community could adopt and remix.",
              quote: "\"I don't care about your AMM. If the mascot's fire, I'm in.\"",
              color: "oklch(0.72 0.16 160)",
            },
            {
              number: "02",
              title: "Exclusivity drives adoption faster than openness",
              observation: "Memecoin traders are motivated by access. Being invited makes them feel chosen. The invite system doubled as a quality filter: only verified traders could generate codes.",
              response: "Ten invite codes per verified user. Each used code grants bonus points. A percentage of invitees' points flows back. The viral loop is structural, not decorative.",
              quote: "\"If I can't get in, I want in more.\"",
              color: "oklch(0.65 0.15 260)",
            },
            {
              number: "03",
              title: "Wallets are better proof than passports",
              observation: "KYC kills meme community adoption. But on-chain trading history is something traders show off. Verification as status, not surveillance.",
              response: "GullGame checks wallets across chains and scores trading history against the top 100 memecoins. Five points per qualifying transaction. Multipliers for diversity.",
              quote: "\"You're checking my actual trades? That's based.\"",
              color: "oklch(0.72 0.14 85)",
            },
            {
              number: "04",
              title: "No developer = no product (unless you fix that)",
              observation: "The token launch tools are the product, not a feature. Non-technical teams are the primary customer. If launching requires Solidity, those teams stay on chains where they already have engineers.",
              response: "Every DeFi configuration became a visual form with sensible defaults. The interface generates the smart contract. The team never sees code.",
              quote: "\"We have a marketer and a community manager. That's the team.\"",
              color: "oklch(0.65 0.16 25)",
            },
            {
              number: "05",
              title: "Fair launch is a mechanism, not a tagline",
              observation: "Every project team in the research had been front-run. Snipers watch the mempool and buy tokens in the first block. On some launches, bots grabbed 40% of supply before the community could react.",
              response: "Sniper-proof listing is on by default. You cannot disable it. A protection window prevents front-running on every new token. This is architecture, not a setting.",
              quote: "\"Snipers grabbed 40% of our supply in the first block.\"",
              color: "oklch(0.70 0.15 350)",
            },
            {
              number: "06",
              title: "Progress people can see is progress people share",
              observation: "A number going up is forgettable. A seagull growing accessories is a story. Character evolution turns engagement metrics into social content.",
              response: "Four stages: Infant, Teen, Adult, Old. Each adds accessories. Shades → hat → fishing rod → cane. The most shared feature in the entire product.",
              quote: "\"My seagull has a fishing rod. This is unironically the best airdrop I've done.\"",
              color: "oklch(0.68 0.14 200)",
            },
          ].map(({ number, title, observation, response, quote, color }) => (
            <div key={number} className="group border-t border-border/20 py-10 md:py-14">
              <div className="grid gap-6 md:grid-cols-[4.5rem_1fr] md:gap-10">
                <span className="text-[3.5rem] leading-none font-medium tracking-tighter md:text-[4.5rem]" style={{ color, opacity: 0.18 }}>{number}</span>
                <div className="space-y-6">
                  <h3 className="max-w-[30ch] text-lg font-medium tracking-tight md:text-xl">{title}</h3>
                  <div className="relative pl-5">
                    <div className="absolute top-0 left-0 h-full w-[3px] rounded-full" style={{ backgroundColor: color, opacity: 0.4 }} />
                    <p className="text-base leading-relaxed font-light tracking-tight text-foreground/60 italic md:text-lg">{quote}</p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 md:gap-10">
                    <div>
                      <p className="font-mono text-[9px] tracking-wider text-muted-foreground/30 uppercase">Signal</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground/60">{observation}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] tracking-wider text-muted-foreground/30 uppercase">Response</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground/50">{response}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature mapping */}
        <div className="mt-16 border-t border-border/20 pt-14">
          <h3 className="text-sm font-medium text-foreground/80">Where each feature lands</h3>
          <p className="mt-2 max-w-[55ch] text-xs text-muted-foreground/50">Priority by audience. Not everything matters equally to everyone.</p>
          <div className="mt-8 space-y-6">
            {[
              { feature: "Invite system", segments: [{ label: "Degen", value: 90 }, { label: "Builder", value: 85 }, { label: "Farmer", value: 40 }, { label: "Project", value: 20 }] },
              { feature: "Codeless launch", segments: [{ label: "Project", value: 95 }, { label: "Farmer", value: 50 }, { label: "Builder", value: 45 }, { label: "Degen", value: 15 }] },
              { feature: "Sniper protection", segments: [{ label: "Project", value: 95 }, { label: "Farmer", value: 85 }, { label: "Degen", value: 50 }, { label: "Builder", value: 40 }] },
              { feature: "Seagull evolution", segments: [{ label: "Degen", value: 95 }, { label: "Builder", value: 90 }, { label: "Farmer", value: 15 }, { label: "Project", value: 10 }] },
              { feature: "Social templates", segments: [{ label: "Builder", value: 95 }, { label: "Degen", value: 80 }, { label: "Project", value: 45 }, { label: "Farmer", value: 10 }] },
            ].map(({ feature, segments }) => (
              <div key={feature}>
                <p className="text-xs font-medium text-foreground/70">{feature}</p>
                <div className="mt-2.5 flex items-center gap-1.5">
                  {segments.map(({ label, value }) => (
                    <div key={label} className="group/bar relative">
                      <div
                        className="h-6 rounded-[4px] transition-opacity duration-200 hover:opacity-100"
                        style={{
                          width: `${Math.max(value * 1.8, 24)}px`,
                          backgroundColor: label === "Degen" ? "oklch(0.72 0.16 85)" : label === "Project" ? "oklch(0.60 0.14 260)" : label === "Farmer" ? "oklch(0.68 0.16 160)" : "oklch(0.65 0.14 300)",
                          opacity: value > 60 ? 0.5 : 0.2,
                        }}
                      />
                      <span className="absolute -bottom-4 left-0 text-[8px] text-muted-foreground/30 opacity-0 transition-opacity group-hover/bar:opacity-100">{label} {value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4 text-[9px] text-muted-foreground/35">
            {[
              { label: "Degen", color: "oklch(0.72 0.16 85)" },
              { label: "Project Team", color: "oklch(0.60 0.14 260)" },
              { label: "Yield Farmer", color: "oklch(0.68 0.16 160)" },
              { label: "Community Builder", color: "oklch(0.65 0.14 300)" },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="h-2.5 w-5 rounded-[2px]" style={{ backgroundColor: color, opacity: 0.5 }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRINCIPLES ═══ */}
      <section id="principles" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Principles</p>
        <h2 className="mt-4 max-w-[20ch] text-3xl font-medium tracking-tight md:text-4xl">The rules</h2>
        <p className="mt-4 max-w-[50ch] text-sm text-muted-foreground/50">Non-negotiable. Every decision filtered through these.</p>

        <div className="mt-14 md:mt-20">
          {[
            { number: "01", rule: "Personality is load-bearing", expansion: "The seagull is the reason people come, the thing they share, and the identity they adopt. Remove it and the community collapses — regardless of what the smart contracts can do." },
            { number: "02", rule: "Prove it with wallets, not paperwork", expansion: "On-chain history is the only credential this audience respects. If the gate feels like surveillance, nobody passes through it." },
            { number: "03", rule: "Every feature ships without code", expansion: "If a project team needs an engineer, the product has failed. Token launch, pool creation, farm setup — all through visual interfaces." },
            { number: "04", rule: "Protection before profit", expansion: "Sniper-proof listings are the architecture, not a feature. A DEX that allows front-running on launch day never recovers the trust." },
            { number: "05", rule: "If it's not shareable, it's not designed", expansion: "Evolving seagulls. Milestone badges. Leaderboard positions. Points are numbers. Characters are stories." },
            { number: "06", rule: "Build a world, not a page", expansion: "The landing page scrolls from sky to seafloor. That's not decoration — it's a narrative device. People remember environments. They forget section layouts." },
          ].map(({ number, rule, expansion }) => (
            <div key={number} className="grid items-baseline border-t border-border/20 py-8 md:grid-cols-[3rem_1fr_2fr] md:gap-8 md:py-10">
              <span className="font-mono text-xs text-muted-foreground/20">{number}</span>
              <h3 className="mt-2 text-lg font-medium tracking-tight md:mt-0">{rule}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground/60 md:mt-0">{expansion}</p>
            </div>
          ))}
        </div>
      </section>

      <div className={dividerRail} />

      {/* ═══ ARCHITECTURE ═══ */}
      <section id="architecture" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Architecture</p>
        <h2 className="mt-4 max-w-[22ch] text-3xl font-medium tracking-tight md:text-4xl">Three layers, one world</h2>

        {/* System diagram mindset — layer cards */}
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            { layer: "Brand Layer", name: "Landing Page", desc: "The ocean world. Sky → beach → shore → underwater. Entry point for discovery. Converts attention into understanding.", accent: "oklch(0.72 0.16 160)" },
            { layer: "Community Layer", name: "GullGame", desc: "Wallet verification, points engine, invite mechanics, leaderboard, seagull evolution. Entry point for traders.", accent: "oklch(0.65 0.15 260)" },
            { layer: "Utility Layer", name: "DEX", desc: "Swap, pools, farms, staking, codeless token launch, sniper protection. Entry point for project teams.", accent: "oklch(0.72 0.14 85)" },
          ].map(({ layer, name, desc, accent }) => (
            <div key={layer} className="relative overflow-hidden rounded-xl border border-border/20 bg-muted/5 p-6">
              <div className="absolute top-0 left-0 h-[3px] w-full" style={{ backgroundColor: accent, opacity: 0.4 }} />
              <p className="font-mono text-[9px] tracking-wider uppercase" style={{ color: accent, opacity: 0.7 }}>{layer}</p>
              <h3 className="mt-3 text-lg font-medium tracking-tight">{name}</h3>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground/50">{desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-[58ch] text-sm leading-relaxed text-muted-foreground/60">
          Each layer exists independently. A trader can use GullGame without touching the DEX. A project team can launch a token without knowing the mascot exists. But the moment you see the seagull anywhere, you know where you are.
        </p>

        <div className="mt-14 space-y-8">
          <div className="flex flex-col gap-8">
            <figure className="group">
              <div className="relative overflow-hidden rounded-lg border border-border/40 bg-muted/20 aspect-[4/3]">
                <Image
                  src={typeInvitationCodeImage}
                  alt="Type invitation code"
                  width={typeInvitationCodeImage.width}
                  height={typeInvitationCodeImage.height}
                  sizes="(min-width: 768px) 50vw, calc(100vw - 3rem)"
                  className="h-full w-full object-cover"
                  quality={90}
                />
              </div>
              <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                GullGame: wallet connection to seagull evolution
              </figcaption>
            </figure>
            <figure className="group">
              <div className="relative overflow-hidden rounded-lg border border-border/40 bg-muted/20 aspect-[4/3]">
                <Image
                  src={tokenLaunchImage}
                  alt="Token launch: configuration to live trading"
                  width={tokenLaunchImage.width}
                  height={tokenLaunchImage.height}
                  sizes="(min-width: 768px) 50vw, calc(100vw - 3rem)"
                  className="h-full w-full object-cover"
                  quality={90}
                />
              </div>
              <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                Token launch: configuration to live trading
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ═══ EXPLORATION ═══ */}
      <section id="exploration" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Exploration</p>
        <h2 className="mt-4 max-w-[22ch] text-3xl font-medium tracking-tight md:text-4xl">Three bets</h2>
        <p className="mt-6 max-w-[50ch] text-base leading-relaxed text-muted-foreground md:text-lg">
          How much personality can infrastructure carry before it stops being taken seriously?
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <ImagePlaceholder label="[Direction A: clean utility]" caption="A: Minimal. Professional. Forgettable." aspectRatio="aspect-[3/4]" variant="screen" />
          <ImagePlaceholder label="[Direction B: maximum meme]" caption="B: Loud. Memorable. Nobody trusts it." aspectRatio="aspect-[3/4]" variant="screen" />
          <ImagePlaceholder label="[Direction C: layered world]" caption="C: A world with tools inside it." aspectRatio="aspect-[3/4]" variant="screen" />
        </div>

        {/* Verdict — asymmetric */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-border/20 bg-border/20 md:grid-cols-[1fr_1.5fr]">
          <div className="bg-background p-6 md:p-8">
            <p className="font-mono text-[9px] tracking-wider text-muted-foreground/30 uppercase">Killed</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground/60">
              <strong className="text-foreground/70">A</strong> looked like the DEXs we audited. No community would form.{" "}
              <strong className="text-foreground/70">B</strong> was unforgettable and unserious. Project teams would never trust it with real money.
            </p>
          </div>
          <div className="bg-background p-6 md:p-8">
            <p className="font-mono text-[9px] tracking-wider text-muted-foreground/30 uppercase">Shipped</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground/60">
              <strong className="text-foreground/70">C</strong> found the balance. The ocean world creates identity. The mascot anchors the brand. But the tools stay clean. Personality lives in the environment and the character system — not in the interface chrome. The DEX dashboard is professional. The world around it is not.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <figure className="group">
            <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-muted/20 aspect-[2.5/1]">
              <Image
                src={seagullEvolutionImage}
                alt="The seagull: from first sketch to final character system"
                width={seagullEvolutionImage.width}
                height={seagullEvolutionImage.height}
                sizes="(min-width: 768px) 100vw, calc(100vw - 3rem)"
                className="h-full w-full object-cover"
                quality={90}
              />
            </div>
            <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
              The seagull: from first sketch to final character system
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ═══ SOLUTION ═══ */}
      <section id="solution" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Solution</p>
        <h2 className="mt-4 max-w-[22ch] text-3xl font-medium tracking-tight md:text-4xl">What shipped</h2>

        {/* 01: GullGame */}
        <div className="mt-16 grid items-center gap-10 md:mt-24 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <div>
            <span className="font-mono text-[10px] text-muted-foreground/25">01</span>
            <h3 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">GullGame</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Connect wallets on ETH, BSC, and Solana. The system checks your memecoin trading history against the top 100 tokens. Qualify → 10 invite codes, a points score, and a seagull that evolves as you engage.</p>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground/40">
              Codes are exclusive to verified traders. The invite itself carries status. Not spam. Currency.
            </p>
          </div>
          <figure className="group">
            <div className="overflow-hidden rounded-xl border border-border/40 bg-muted/20">
              <Image
                src={gullGameImage}
                alt="GullGame: wallet verification, points, and invite system"
                width={gullGameImage.width}
                height={gullGameImage.height}
                className="h-auto w-full object-contain"
                sizes="(min-width: 768px) 40vw, 100vw"
                quality={100}
              />
            </div>
            <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
              GullGame: wallet verification, points, and invite system
            </figcaption>
          </figure>
        </div>

        {/* 02: Token Launch */}
        <div className="mt-20 grid items-center gap-10 md:mt-32 md:grid-cols-[1.5fr_0.8fr] md:gap-16">
          <ImagePlaceholder label="[Insert codeless token launch flow]" caption="Codeless token launch with tokenomics configuration" aspectRatio="aspect-[4/3]" variant="screen" className="order-2 md:order-1" />
          <div className="order-1 md:order-2">
            <span className="font-mono text-[10px] text-muted-foreground/25">02</span>
            <h3 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">Codeless Token Launch</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Name, supply, tax structure, airdrop allocation, burn mechanics. Visual forms. The platform generates the smart contract. A live token with configurable tokenomics in minutes.</p>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground/40">
              Every field has a sensible default. Launch with just a name and supply. Complexity only when you need it.
            </p>
          </div>
        </div>

        {/* 03: Farms */}
        <div className="mt-20 md:mt-32">
          <ImagePlaceholder label="[Insert farms and pools interface]" caption="Farm management with flexible reward controls" aspectRatio="aspect-[2.2/1]" variant="hero" />
          <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-16">
            <div>
              <span className="font-mono text-[10px] text-muted-foreground/25">03</span>
              <h3 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">Automated Farms</h3>
            </div>
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground">Incentives through a visual interface. Farms auto-list. Rewards can be boosted anytime by depositing more tokens. The differentiator: post-launch reward adjustment. APR as a dial, not a one-time setting.</p>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground/40">
                No manual review. No waiting period. Incentive deposited → farm listed. Meme tokens move fast. Infrastructure has to keep up.
              </p>
            </div>
          </div>
        </div>

        {/* 04: Sniper Protection */}
        <div className="mt-20 grid items-center gap-10 md:mt-32 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <div>
            <span className="font-mono text-[10px] text-muted-foreground/25">04</span>
            <h3 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">Sniper-Proof Listing</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">When liquidity goes live, a protection window blocks front-running bots. On GullSwap, fair launch is an on-chain mechanism that cannot be disabled. Every new token gets it.</p>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground/40">
              Protection is default, not optional. A trust decision baked into the architecture.
            </p>
          </div>
          <ImagePlaceholder label="[Insert sniper protection flow]" caption="Sniper-proof listing protecting new token launches" aspectRatio="aspect-[4/3]" variant="screen" />
        </div>

        {/* 05: Landing Page */}
        <div className="mt-20 grid items-center gap-10 md:mt-32 md:grid-cols-[1.5fr_0.8fr] md:gap-16">
          <ImagePlaceholder label="[Insert landing page with ocean layers]" caption="Landing page: descending from sky to seafloor" aspectRatio="aspect-[4/3]" variant="screen" className="order-2 md:order-1" />
          <div className="order-1 md:order-2">
            <span className="font-mono text-[10px] text-muted-foreground/25">05</span>
            <h3 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">The Ocean</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Not sections on a page. A descent. Sky → beach → shore → underwater. Each content section lives in its own environmental layer. Vision, USP, Roadmap, Tokenomics, Team, Ecosystem — scrolling is the narrative.</p>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground/40">
              People remember environments. They forget section layouts. The ocean is the brand.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ BRAND & CHARACTER ═══ */}
      <section id="brand" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Brand & Character</p>
        <h2 className="mt-4 max-w-[24ch] text-3xl font-medium tracking-tight md:text-4xl">The seagull is the product</h2>

        <blockquote className="mt-12 max-w-[28ch] text-2xl leading-snug font-light tracking-tight text-foreground/80 md:ml-[10%] md:text-3xl">
          &quot;The seagull stopped my scroll. The invite code kept me. The points brought me back.&quot;
        </blockquote>

        {/* Brand components — asymmetric grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-[1.5fr_1fr] md:gap-10">
          <div className="space-y-6">
            {[
              { title: "Modular Mascot", content: "One base body. 50+ swappable expressions. Swappable items: shades, hat, cane, fishing rod. Infinite content from a single character framework." },
              { title: "Evolution System", content: "Four stages: Infant → Teen → Adult → Old. Each adds accessories. Each is a milestone people photograph and post. The most organically shared feature in the product." },
              { title: "The Ocean World", content: "Sky, clouds, beach, lighthouse, shoreline, waves, coral, submarines, fish. Each element is a standalone asset, combinable for any surface. The world is the design system." },
            ].map(({ title, content }) => (
              <div key={title} className="border-t border-border/15 pt-5">
                <h3 className="text-sm font-medium text-foreground/80">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground/55">{content}</p>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            {[
              { title: "Template Engine", content: "Five categories: Promotional, Educational, Announcement, Celebration, Meme. Every template uses the mascot, ocean backgrounds, and consistent type treatment." },
              { title: "60+ Stickers", content: "Stonks. Fire. Barf. Drama. Oof. Each became part of the community's daily vocabulary on Telegram and Discord. Brand reinforced in every conversation." },
              { title: "Color & Type", content: "Ocean blues and sky tones for the foundation. Warm beach accents for actions. Bold condensed headlines. Energetic without chaos. Playful without being childish." },
            ].map(({ title, content }) => (
              <div key={title} className="border-t border-border/15 pt-5">
                <h3 className="text-sm font-medium text-foreground/80">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground/55">{content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 space-y-8">
          <ImagePlaceholder label="[Insert mascot expression sheet: 60+ variations]" caption="The seagull system: expressions, items, poses, evolution stages" aspectRatio="aspect-[21/9]" variant="hero" />
          <div className="grid gap-8 md:grid-cols-3">
            <ImagePlaceholder label="[Insert social template examples]" caption="Template system across five content categories" aspectRatio="aspect-square" variant="artifact" />
            <ImagePlaceholder label="[Insert sticker pack selection]" caption="60+ reactions for community use" aspectRatio="aspect-square" variant="artifact" />
            <ImagePlaceholder label="[Insert ocean environment layers]" caption="The layered ocean: sky to seafloor" aspectRatio="aspect-square" variant="artifact" />
          </div>
        </div>
      </section>

      <div className={dividerRail} />

      {/* ═══ OUTCOMES ═══ */}
      <section id="outcomes" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Outcomes</p>
        <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">The numbers</h2>

        {/* Big metrics — cleaner, less decoration */}
        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
          {[
            { metric: "$3.7M", label: "Raised across private, KOL, and public rounds", type: "Fundraising", accent: "oklch(0.72 0.16 160)" },
            { metric: "109K", label: "Twitter followers through meme-first brand", type: "Audience", accent: "oklch(0.65 0.15 260)" },
            { metric: "900", label: "VIP NFTs sold out in 12 hours", type: "Signal", accent: "oklch(0.72 0.14 85)" },
            { metric: "60+", label: "Mascot variations across product, social, stickers", type: "Depth", accent: "oklch(0.65 0.16 25)" },
          ].map(({ metric, label, type, accent }) => (
            <div key={type} className="group relative overflow-hidden rounded-xl border border-border/30 bg-muted/10 p-6 transition-colors hover:bg-muted/20">
              <div className="absolute top-0 left-0 h-[3px] w-full" style={{ backgroundColor: accent, opacity: 0.5 }} />
              <p className="font-mono text-[10px] tracking-wider text-muted-foreground/40 uppercase">{type}</p>
              <p className="mt-3 text-3xl font-medium tracking-tight md:text-4xl" style={{ color: accent }}>{metric}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground/50">{label}</p>
            </div>
          ))}
        </div>

        {/* What the community proved — stacked, not gridded */}
        <div className="mt-16 space-y-4">
          {[
            "The seagull was adopted without instruction. Community members made their own memes from the character.",
            "The evolution system drove organic sharing. Users screenshot their seagull status and post it.",
            "The invite mechanic generated real word-of-mouth, not bot accounts.",
            "Project teams named the codeless launch as the reason they chose GullSwap.",
            "Manta Network endorsed it as their native DEX.",
            "Token launched on Gate.io and Finceptor. VIP NFTs sold in 12 hours.",
          ].map((line, i) => (
            <p key={i} className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground/60">
              <span className="mr-2 inline-block font-mono text-[10px] text-muted-foreground/25">{String(i + 1).padStart(2, "0")}</span>
              {line}
            </p>
          ))}
        </div>
      </section>

      {/* ═══ REFLECTION ═══ */}
      <section id="reflection" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Reflection</p>
        <h2 className="mt-4 max-w-[22ch] text-3xl font-medium tracking-tight md:text-4xl">What carries forward</h2>

        <div className="mt-12 space-y-0">
          {[
            {
              label: "What landed",
              content: "Building the character before the interface felt backwards for a DeFi product. It was the best decision. The seagull gave the community something to rally around before the product existed. Codeless tooling removed the biggest objection from project teams. The environmental landing page made the brand stick where everything else looks the same.",
            },
            {
              label: "What stayed open",
              content: "The rebrand to Gull AI tested whether a meme-born brand can pivot to enterprise infrastructure. The original community did not necessarily follow. Whether personality built for degens translates to credibility for institutions is still unresolved.",
            },
            {
              label: "What I'd try next",
              content: "Gamification of the DEX itself — not just the airdrop. Trading streaks. Community challenges. And a character builder: let the community create their own seagull variations. Turn the mascot from a brand asset into a platform.",
            },
            {
              label: "The lesson",
              content: "Brand and product are the same thing in crypto. When every product offers similar yields and features, the brand is the moat. Building a brand means building a world people choose to inhabit — not just a tool they have to use.",
            },
          ].map(({ label, content }) => (
            <div key={label} className="border-t border-border/15 py-8">
              <h3 className="text-sm font-medium text-foreground/80">{label}</h3>
              <p className="mt-3 max-w-[55ch] text-sm leading-relaxed text-muted-foreground/60">{content}</p>
            </div>
          ))}
        </div>
      </section>

      <div className={dividerRail} />

      <CaseStudyFooter currentProject="gull-network" />

        </div>
      </div>
    </main>
  )
}
