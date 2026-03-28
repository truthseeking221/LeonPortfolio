import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { TableOfContents } from "@/components/case-study/table-of-contents"
import { ImagePlaceholder } from "@/components/case-study/image-placeholder"
import { FeatureReactionMatrix } from "@/components/case-study/feature-reaction-matrix"
import { MobileToC } from "@/components/case-study/mobile-toc"
import { CaseStudyFooter } from "@/components/case-study/case-study-footer"
import nodoAiMainImage from "../../images/Nodo AI main.png"
import problemSpaceMap from "../../images/Problem Space Map.png"
import nodoEcosystemPositioning from "../../images/NODO Ecosystem Positioning.png"
import nodoResearch1 from "../../images/Nodo Research 1.png"
import nodoResearch2 from "../../images/Nodo Research 2.png"
import primaryUserFlow from "../../images/userflow.png"
import informationLayers from "../../images/information layers.png"
import nodoVaultSystemProductIARecolored from "../../images/NODO Vault System Product IA Recolored.png"
import directionADashboardFirst from "../../images/Direction A_ Dashboard-first.png"
import directionBGuidedOnboarding from "../../images/Direction B_ Guided Onboarding.png"
import directionCProgressiveDisclosure from "../../images/Direction C_ Progressive Disclosure.png"
import detailImage from "../../images/Detail.png"
import ndlpEducationImage from "../../images/NDLP education.png"
import manageLiquidityImage from "../../images/Manage Liquidity.png"
import breakdownImage from "../../images/breakdown.png"

export const metadata: Metadata = {
  title: "NODO AI — Case Study — Leon",
  description:
    "Designing an AI-powered DeFi protocol for clarity, trust, and usability. A product design case study by Leon.",
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
  { id: "trust", label: "Trust & Clarity" },
  { id: "outcomes", label: "Outcomes" },
  { id: "reflection", label: "Reflection" },
]

const contentRail = "mx-auto w-full max-w-[1100px] px-6 md:px-10 lg:px-14"
const sectionRail = `${contentRail} py-24 md:py-32`
const wideRail = "mx-auto w-full max-w-[1340px] px-6 md:px-10 lg:px-14"
const dividerRail = "mx-auto h-px w-[calc(100%-3rem)] max-w-[1100px] bg-border/30 md:w-[calc(100%-5rem)] lg:w-[calc(100%-7rem)]"

export default function NodoAICaseStudy() {
  return (
    <main className="min-h-screen overflow-x-hidden">

      {/* Mobile Table of Contents */}
      <MobileToC items={tocItems} />

      <div className="xl:grid xl:grid-cols-[120px_1fr]">
        <aside className="hidden xl:block xl:pl-6">
          <TableOfContents items={tocItems} />
        </aside>
        <div className="min-w-0">

      {/* 1. Hero */}
      <section className={`${contentRail} relative pt-28 pb-16 md:pt-36 md:pb-24`}>
        <div className="flex items-center gap-3">
          <Badge variant="outline">DeFi Infrastructure</Badge>
          <Badge variant="secondary">Shipped</Badge>
        </div>

        <h1 className="mt-6 text-[clamp(3.5rem,12vw,10rem)] leading-[0.88] font-medium tracking-tighter">
          NODO AI
        </h1>

        <p className="mt-6 max-w-[50ch] text-xl leading-relaxed font-light text-muted-foreground md:text-2xl">
          The first AI liquidity engine on Sui needed a product designer.
          Nobody was going to deposit real money into something they
          couldn&apos;t explain.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-border/40 pt-8 md:grid-cols-5 md:gap-x-12">
          {[
            { label: "Role", value: "Lead Product Designer" },
            { label: "Timeline", value: "Q1 to Q2 2025" },
            { label: "Scope", value: "0 to 1 Product" },
            { label: "Platform", value: "Web App (Sui)" },
            { label: "Status", value: "MVP Launched" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-mono text-[10px] tracking-wider text-muted-foreground/40 uppercase">{label}</p>
              <p className="mt-1.5 text-sm text-foreground/80">{value}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-[58ch] text-base leading-relaxed text-muted-foreground md:ml-[15%] md:text-lg">
          NODO is an autonomous yield infrastructure protocol. A modular stack
          of AI agents continuously executes, rebalances, and adapts liquidity
          positions across Cetus, DeepBook, and Momentum on the Sui blockchain.
          The design challenge was to make a technically complex financial
          system feel clear enough that someone holding USDC and 30 seconds of
          attention could understand what they were getting into.
        </p>

        <div className="mt-16">
          <figure className="group">
            <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-muted/20 aspect-[4/3]">
              <Image
                src={nodoAiMainImage}
                alt="NODO AI vault interface overview"
                width={nodoAiMainImage.width}
                height={nodoAiMainImage.height}
                className="object-cover object-center"
                sizes="(min-width: 1024px) 1100px, 100vw"
                priority
              />
            </div>
            <figcaption className="mt-3 mb-3 text-center font-mono text-[11px] text-muted-foreground/35">
              NODO AI vault interface overview
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 2. Snapshot */}
      <section id="snapshot" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">At a glance</p>
        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-2 lg:grid-cols-3 md:gap-12">
          {[
            { title: "Overview", content: "AI agents managing liquidity across decentralized exchanges on Sui. Vaults, receipt tokens, automated rebalancing. My job was to make all of it feel clear to someone who had never heard of liquidity provisioning." },
            { title: "Challenge", content: "Users distrust vague AI claims. They confuse receipt tokens with rewards. The gap between stated APY and actual returns erodes confidence. Dual-asset deposits block beginners entirely. Every decision had to resolve the tension between transparency and simplicity." },
            { title: "Contribution", content: "I owned the full product design: research program with 24 participants, information architecture, design system, deposit flow redesign, trust framework, and progressive disclosure strategy." },
            { title: "Outcome", content: "Research participants described the redesigned product as significantly clearer than existing DeFi vaults. Single-sided deposit became the default. NDLP comprehension was rebuilt from scratch. Trust signals were placed at every decision point." },
            { title: "Tools & Methods", content: "Figma. Moderated 1:1 interviews. Persona development. Affinity mapping. Concept testing. Prototype walkthroughs. Feature reaction matrix. Opportunity scoring." },
            { title: "Key Themes", content: "Trust in autonomous systems. Progressive disclosure. Yield source transparency. Designing for a spectrum from crypto beginners to institutional allocators. Rebuilding confidence after FTX. Abstracting LP complexity without hiding it." },
          ].map(({ title, content }) => (
            <div key={title} className="border-t border-border/30 pt-5">
              <h3 className="text-sm font-medium tracking-tight">{title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground/60">{content}</p>
            </div>
          ))}
        </div>
      </section>

      <div className={dividerRail} />

      {/* 3. Context */}
      <section id="context" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Context</p>
        <h2 className="mt-4 max-w-[20ch] text-3xl font-medium tracking-tight md:text-4xl">Why this project existed</h2>
        <div className="mt-12 space-y-12">
          <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:items-start md:gap-20">
            <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              <p>In DeFi, earning yield on your crypto means providing liquidity to decentralized exchanges. But managing those positions is technically demanding. You have to choose token pairs, set price ranges, monitor markets, and rebalance constantly. Most users either lose money to impermanent loss or never try in the first place.</p>
              <p>NODO set out to automate all of that. AI agents manage liquidity positions across Sui&apos;s top DEXs: Cetus, DeepBook, and Momentum. They optimize capital efficiency, mitigate loss, and capture yield from real trading activity. Over $2M in active LP commitments. Over $336M in addressable DEX liquidity on Sui alone.</p>
              <p>The market is there. But 63% of users say they would let an autonomous agent manage their funds only if they could understand and trust the system. That trust gap was the design problem.</p>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:gap-x-12 md:gap-y-14">
              {[
                { stat: "$536M", label: "DeFAI market cap" },
                { stat: "$336M", label: "Sui DEX TVL (SAM)" },
                { stat: "$2M+", label: "Active LP commitments" },
                { stat: "63%", label: "Users open to AI agents" },
              ].map(({ stat, label }) => (
                <div key={label}>
                  <p className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium tracking-[-0.03em] text-foreground">{stat}</p>
                  <p className="mt-1.5 font-mono text-[10px] tracking-wide text-muted-foreground/45 uppercase">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <figure className="group">
            <div className="overflow-hidden rounded-lg border border-border/40 bg-muted/20">
              <div className="relative aspect-[16/9]">
                <Image
                  src={nodoEcosystemPositioning}
                  alt="NODO positioning and capital flow in the Sui DeFi ecosystem"
                  fill
                  className="object-contain"
                  sizes="(min-width: 768px) 80vw, 100vw"
                  quality={100}
                  priority
                />
              </div>
            </div>
            <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
              NODO&apos;s position in the Sui DeFi ecosystem
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 4. Challenge */}
      <section id="challenge" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">The Challenge</p>
        <h2 className="mt-4 max-w-[24ch] text-3xl font-medium tracking-tight md:text-4xl">Defining the design problem</h2>
        <blockquote className="mt-12 max-w-[32ch] border-l-2 border-foreground/10 pl-6 text-2xl leading-snug font-light tracking-tight text-foreground/80 md:ml-[10%] md:text-3xl">
          &quot;I just want to put my coins somewhere and earn something. I don&apos;t understand why I need to know what liquidity provisioning is.&quot;
          <cite className="mt-3 block font-mono text-[10px] font-normal tracking-wider text-muted-foreground/30 not-italic">P02, Passive Yield Seeker</cite>
        </blockquote>
        <div className="mt-14 grid gap-8 md:mt-16 md:grid-cols-2 md:gap-12">
          {[
            { title: "Product Challenge", content: "NODO needed to validate its AI vault proposition before a marketing push and convert skeptics in a post-FTX market. The phrase 'AI-powered' had become a red flag. We had to make it mean something again." },
            { title: "UX Challenge", content: "The user spectrum ranged from crypto beginners with $5K portfolios to institutional allocators managing $250K and up. Each segment had different trust thresholds, vocabulary, and mental models. One interface. Six very different people." },
            { title: "Technical Constraints", content: "On-chain vault mechanics required receipt tokens (NDLP), dual-asset deposits, and real-time rebalancing data. Smart contract architecture was non-negotiable. Design had to work within protocol constraints, not the other way around." },
            { title: "Why This Was Hard", content: "No established design patterns exist for AI-managed DeFi vaults. Power users demand full transparency. Beginners need radical simplicity. Competitors had already eroded trust through impermanent loss and hidden fees. We were designing in a trust deficit." },
          ].map(({ title, content }) => (
            <div key={title}>
              <h3 className="text-sm font-medium tracking-wider text-muted-foreground/50 uppercase">{title}</h3>
              <p className="mt-3 max-w-[45ch] text-base leading-relaxed text-muted-foreground">{content}</p>
            </div>
          ))}
        </div>
        <div className="mt-16">
          <figure className="group">
            <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-muted/20 aspect-[21/9]">
              <Image
                src={problemSpaceMap}
                alt="Problem space map showing trust barriers and conversion blockers"
                fill
                sizes="(min-width: 768px) 100vw, calc(100vw - 3rem)"
                className="object-contain"
                quality={100}
                priority
              />
            </div>
            <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
              The landscape of trust barriers and conversion blockers
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 5. Role */}
      <section id="role" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Role</p>
        <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">What I owned</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-12">
          <div>
            <h3 className="text-sm font-medium text-foreground/80">Directly Responsible</h3>
            <ul className="mt-4 list-disc space-y-2.5 pl-4 text-sm leading-relaxed text-muted-foreground">
              <li>End-to-end product design from research to shipped UI</li>
              <li>Information architecture for the vault system</li>
              <li>Design system and component library</li>
              <li>Prototyping, usability testing, and validation</li>
              <li>UX writing across all product surfaces</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground/80">Collaborated On</h3>
            <ul className="mt-4 list-disc space-y-2.5 pl-4 text-sm leading-relaxed text-muted-foreground">
              <li>Product strategy and vault roadmap with the founding team</li>
              <li>Technical feasibility scoping with engineering</li>
              <li>Research planning and participant recruitment</li>
              <li>Go-to-market positioning and messaging</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground/80">Influenced</h3>
            <ul className="mt-4 list-disc space-y-2.5 pl-4 text-sm leading-relaxed text-muted-foreground">
              <li>Product scope decisions based on research findings</li>
              <li>NDLP token framing and educational strategy</li>
              <li>Feature prioritization through opportunity scoring</li>
              <li>Launch strategy and phased rollout approach</li>
            </ul>
          </div>
        </div>
      </section>

      <div className={dividerRail} />

      {/* 6. Objectives */}
      <section id="objectives" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Objectives</p>
        <h2 className="mt-4 max-w-[22ch] text-3xl font-medium tracking-tight md:text-4xl">What success looked like</h2>
        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {[
            { category: "User Goals", items: ["Users understand the AI vault value prop within 30 seconds", "First deposit completion exceeds 60% for new users", "Fewer than 20% of users ask what NDLP is after launch"] },
            { category: "Business Goals", items: ["Grow TVL through better onboarding and visible trust signals", "Position NODO as the first AI liquidity engine on Sui", "Sui-native users make up over 40% of early adopters"] },
            { category: "Product Goals", items: ["Ship the vault dashboard with TVL, APR, and NDLP tracking", "Default to single-sided deposit for beginner conversion", "Establish scalable patterns for multi-vault deployment in Q3"] },
            { category: "Trust Goals", items: ["Users understand risk and IL exposure before committing capital", "AI strategy is verifiable through on-chain data, not just words", "Complete fee disclosure including rebalancing costs"] },
            { category: "Usability Goals", items: ["Over 70% of users identify their net return within 5 seconds", "Beginner task completion exceeds 50% without external help", "Progressive disclosure from summary to full LP decomposition"] },
            { category: "System Goals", items: ["Composable vault primitives ready for the strategy marketplace", "Full integration with Cetus, DeepBook, and Momentum", "Design system prepared for EVM chain expansion in 2026"] },
          ].map(({ category, items }) => (
            <div key={category} className="rounded-xl border border-border/30 bg-muted/10 p-5">
              <h3 className="font-mono text-[10px] tracking-wider text-muted-foreground/50 uppercase">{category}</h3>
              <ul className="mt-3.5 list-disc space-y-2.5 pl-4 text-sm leading-relaxed text-muted-foreground">
                {items.map((item, i) => (<li key={i}>{item}</li>))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Process */}
      <section id="process" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Process</p>
        <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">How the work unfolded</h2>
        <div className="mt-14 md:mt-20">
          <div className="relative">
            <div className="absolute top-4 right-0 left-0 hidden h-px bg-border/40 md:block" />
            <div className="grid gap-8 md:grid-cols-6 md:gap-0">
              {[
                { phase: "01", title: "Understanding the system", desc: "Mapped the domain, protocol mechanics, stakeholders, and competitive landscape across Sui and EVM chains." },
                { phase: "02", title: "Identifying friction", desc: "Audited existing DeFi vault products, ran heuristic reviews, catalogued every point where users hesitated or abandoned." },
                { phase: "03", title: "Defining principles", desc: "Distilled research into six design principles. Every subsequent decision traced back to one of them." },
                { phase: "04", title: "Shaping the structure", desc: "Built the information architecture and user flows that organized vault complexity into navigable layers." },
                { phase: "05", title: "Prototyping and iterating", desc: "Explored three directions in Figma, tested with users, refined through three rounds of feedback." },
                { phase: "06", title: "Shipping", desc: "Aligned with engineering on implementation details and shipped the MVP for Sui mainnet." },
              ].map(({ phase, title, desc }) => (
                <div key={phase} className="relative md:pr-6">
                  <div className="mb-4 hidden size-2 rounded-full bg-foreground/20 md:block" />
                  <span className="font-mono text-[10px] text-muted-foreground/30">{phase}</span>
                  <h3 className="mt-1.5 text-sm font-medium tracking-tight">{title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground/50">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Discovery — rhythm: open → proof → dense → expand → interrupt → breathe */}
      <section id="discovery" className="pt-24 md:pt-32">

        {/* Beat 1: Opening — standard column, sets the question */}
        <div className={contentRail}>
          <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Discovery</p>
          <h2 className="mt-4 max-w-[22ch] text-3xl font-medium tracking-tight md:text-4xl">Understanding before designing</h2>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted-foreground/70 md:text-lg">Before touching a screen, I ran a structured research program to understand who we were designing for, what blocked them, and what would make them trust an autonomous system with their capital.</p>
        </div>

        {/* Beat 2: Stats — breaks wider. Numbers land with dramatic scale. */}
        <div className="mt-16 border-y border-border/20 bg-foreground/[0.015] py-14 md:py-20">
          <div className={`${wideRail} grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-8`}>
            {[
              { stat: "24", label: "Participants interviewed", accent: "oklch(0.72 0.19 160)" },
              { stat: "6", label: "Persona segments identified", accent: "oklch(0.62 0.18 260)" },
              { stat: "45", label: "Minutes per session", accent: "oklch(0.75 0.17 85)" },
              { stat: "14", label: "Insights synthesized", accent: "oklch(0.62 0.19 25)" },
            ].map(({ stat, label, accent }) => (
              <div key={label} className="relative">
                <p className="text-5xl font-extralight tracking-tighter md:text-6xl" style={{ color: accent }}>{stat}</p>
                <p className="mt-2 max-w-[14ch] text-[11px] leading-snug text-muted-foreground/45">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Beat 3: Methodology — text stays narrow, images break wider */}
        <div className={`${contentRail} pt-20 md:pt-28`}>
          <div className="grid gap-0 divide-y divide-border/20">
            {[
              { title: "Assumptions We Tested", body: "We went in believing users could articulate the benefit of AI vaults after a 30-second explanation, that most people understood \"automated yield\" even if LP mechanics confused them, that NDLP would be intuitively understood as a vault share token, and that single-sided deposit would dramatically lower the barrier. Some held up. Others shattered immediately." },
              { title: "Research Methods", body: "Moderated 1:1 remote interviews over Zoom. Figma prototype walkthroughs. Feature reaction matrix scoring. Stimulus testing with live product surfaces. Then a weighted scoring model to prioritize what to build first." },
              { title: "How We Synthesized", body: "All 24 interviews transcribed into a quotes library, tagged by theme and persona. From there I built an insight synthesis matrix — scoring each finding by evidence count, confidence level, and impact on trust, conversion, and retention. That surfaced 14 actionable insights ranked into a prioritized opportunity backlog." },
            ].map(({ title, body }) => (
              <div key={title} className="py-7 first:pt-0 last:pb-0">
                <h3 className="text-xs font-medium tracking-wide text-foreground/70 uppercase">{title}</h3>
                <p className="mt-3 text-[13px] leading-[1.7] text-muted-foreground/55">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Research images — break out wider for visual impact */}
        <div className={`${wideRail} mt-14 flex flex-col gap-5`}>
          <figure className="group">
            <div className="overflow-hidden rounded-lg border border-border/40 bg-muted/20">
              <Image
                src={nodoResearch1}
                alt="Research synthesis board and affinity map from NODO user interviews"
                width={nodoResearch1.width}
                height={nodoResearch1.height}
                className="h-auto w-full"
                sizes="(min-width: 1280px) 1340px, (min-width: 768px) 90vw, 100vw"
                quality={100}
              />
            </div>
            <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
              Research synthesis: 24 interviews, 26 quotes, 14 insights
            </figcaption>
          </figure>
          <figure className="group">
            <div className="overflow-hidden rounded-lg border border-border/40 bg-muted/20">
              <Image
                src={nodoResearch2}
                alt="Persona spectrum: six segments by DeFi literacy and risk appetite"
                width={nodoResearch2.width}
                height={nodoResearch2.height}
                className="h-auto w-full"
                sizes="(min-width: 1280px) 1340px, (min-width: 768px) 90vw, 100vw"
                quality={100}
              />
            </div>
            <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
              6 persona segments mapped by DeFi literacy and risk appetite
            </figcaption>
          </figure>
        </div>

        {/* Beat 4: Personas — break wider for card grid */}
        <div className={`${wideRail} pt-24 md:pt-32`}>
          <div>
            <h3 className="text-xs font-medium tracking-wide text-foreground/70 uppercase">Who We Designed For</h3>
            <p className="mt-2 max-w-[52ch] text-[13px] leading-relaxed text-muted-foreground/45">Six segments emerged from the research, each with distinct trust thresholds and conversion blockers.</p>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {[
              { name: "Passive Yield Seeker", oneliner: "Wants yield without managing positions", likelihood: "Medium", color: "#f59e0b", portfolio: "$5K – $25K" },
              { name: "LP-Confused Beginner", oneliner: "Has a wallet but never provided liquidity", likelihood: "Low", color: "#ef4444", portfolio: "Under $5K" },
              { name: "Skeptical Power User", oneliner: "Evaluates products like an analyst", likelihood: "High if proven", color: "#3b82f6", portfolio: "$25K – $250K+" },
              { name: "Stablecoin Safety Optimizer", oneliner: "Preserves capital above all", likelihood: "Medium", color: "#8b5cf6", portfolio: "$10K – $250K+" },
              { name: "Sui-Native DeFi User", oneliner: "Already active on Cetus and DeepBook", likelihood: "Highest", color: "#10b981", portfolio: "$5K – $100K" },
              { name: "Reward-Driven Explorer", oneliner: "Will try anything with a multiplier", likelihood: "High, then churns", color: "#06b6d4", portfolio: "$1K – $10K" },
            ].map(({ name, oneliner, likelihood, color, portfolio }) => (
              <div key={name} className="group relative overflow-hidden rounded-xl border border-border/20 bg-background p-5 transition-colors hover:bg-foreground/[0.02] md:p-6">
                <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.5 }} />
                <div className="flex items-center gap-2.5">
                  <div className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                  <h4 className="text-[13px] font-medium tracking-tight">{name}</h4>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground/45">{oneliner}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border/10 pt-3">
                  <span className="text-[10px] text-muted-foreground/25">{portfolio}</span>
                  <span className="rounded-full px-2 py-0.5 text-[9px] font-medium" style={{ backgroundColor: `${color}12`, color }}>{likelihood}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Beat 5: Pain + Trust — asymmetric weight. Pain dominant (left). Trust supports (right). */}
        <div className={`${contentRail} pt-24 md:pt-32`}>
          <div className="grid gap-20 md:grid-cols-[1.2fr_1fr] md:gap-16">
            <div>
              <h3 className="text-xs font-medium tracking-wide text-foreground/70 uppercase">Top Pain Points</h3>
              <p className="mt-1 text-[11px] text-muted-foreground/35">Mentions across 24 interviews</p>
              <div className="mt-8 space-y-6">
                {[
                  { label: "AI claims without evidence", count: 8, max: 8 },
                  { label: "NDLP comprehension failure", count: 6, max: 8 },
                  { label: "Impermanent loss confusion", count: 6, max: 8 },
                  { label: "APY vs. net P&L gap", count: 5, max: 8 },
                  { label: "Hidden fee disclosure", count: 5, max: 8 },
                  { label: "Dual deposit barrier", count: 4, max: 8 },
                ].map(({ label, count, max }) => (
                  <div key={label} className="group">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-[12px] text-muted-foreground/55 transition-colors group-hover:text-foreground/80">{label}</span>
                      <span className="shrink-0 text-lg font-medium tabular-nums leading-none" style={{ color: `oklch(${0.55 + (1 - count / max) * 0.15} 0.19 25)` }}>{count}</span>
                    </div>
                    <div className="mt-2.5 h-[3px] overflow-hidden rounded-full bg-foreground/[0.04]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(count / max) * 100}%`,
                          background: `linear-gradient(90deg, oklch(0.68 0.19 30), oklch(0.55 0.22 18))`,
                          opacity: 0.4 + (count / max) * 0.6,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:border-l md:border-border/15 md:pl-16">
              <h3 className="text-xs font-medium tracking-wide text-foreground/70 uppercase">Top Trust Barriers</h3>
              <p className="mt-1 text-[11px] text-muted-foreground/35">What blocks first deposits</p>
              <div className="mt-8 space-y-6">
                {[
                  { label: "Vague AI marketing", count: 8, max: 8 },
                  { label: "Unexplained yield source", count: 5, max: 8 },
                  { label: "Incomplete fee transparency", count: 5, max: 8 },
                  { label: "No performance history", count: 4, max: 8 },
                  { label: "Missing ecosystem endorsement", count: 3, max: 8 },
                ].map(({ label, count, max }) => (
                  <div key={label} className="group">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-[12px] text-muted-foreground/55 transition-colors group-hover:text-foreground/80">{label}</span>
                      <span className="shrink-0 text-lg font-medium tabular-nums leading-none" style={{ color: `oklch(${0.48 + (1 - count / max) * 0.15} 0.17 260)` }}>{count}</span>
                    </div>
                    <div className="mt-2.5 h-[3px] overflow-hidden rounded-full bg-foreground/[0.04]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(count / max) * 100}%`,
                          background: `linear-gradient(90deg, oklch(0.58 0.16 260), oklch(0.45 0.18 270))`,
                          opacity: 0.4 + (count / max) * 0.6,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Beat 6: Blockquote — full-width interruption. Stops the scroll. */}
        <div className="mt-24 border-y border-border/15 bg-foreground/[0.012] py-16 md:mt-32 md:py-24">
          <blockquote className="mx-auto max-w-[680px]">
            <p className="text-center text-xl leading-[1.5] font-light tracking-tight text-foreground/65 md:text-2xl">
              &quot;Every DeFi product says &apos;AI-powered&apos; now. I need to see what the model actually does, not a buzzword on a landing page.&quot;
            </p>
            <cite className="mt-6 block text-center font-mono text-[10px] tracking-wider text-muted-foreground/25 not-italic">P03 — Skeptical Power User</cite>
          </blockquote>
        </div>

        <div className="h-24 md:h-32" />
      </section>

      {/* 9. Insights */}
      <section id="insights" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Insights</p>
        <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">What the research revealed</h2>
        <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-muted-foreground md:text-lg">Six findings from 24 interviews that shaped every design decision.</p>

        {/* ── Movement 1: The Trust Deficit (compact 3-up) ── */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border/20 bg-border/20 md:mt-20 md:grid-cols-3">
          {[
            { n: "01", title: "AI is a red flag without proof", quote: "If you can't show me what the model does, 'AI-powered' is just a red flag." },
            { n: "02", title: "NDLP is universally misunderstood", quote: "NDLP isn't a reward? Then why does it need to be a token at all?" },
            { n: "03", title: "Yield opacity triggers Ponzi suspicion", quote: "If you can't tell me where the 8% comes from, I assume it comes from new depositors." },
          ].map(({ n, title, quote }) => (
            <div key={n} className="flex flex-col justify-between bg-background p-6 md:p-8">
              <div>
                <span className="font-mono text-[10px] text-muted-foreground/25">{n}</span>
                <h3 className="mt-3 text-sm font-medium tracking-tight text-foreground/80">{title}</h3>
              </div>
              <p className="mt-6 text-[13px] leading-[1.7] font-light italic text-foreground/40">&ldquo;{quote}&rdquo;</p>
            </div>
          ))}
        </div>

        {/* ── Movement 2: The Devastating Quote (full-width break) ── */}
        <div className="my-20 md:my-28">
          <blockquote className="relative mx-auto max-w-[22ch] md:max-w-none">
            <p className="text-center text-[clamp(1.5rem,3.5vw,2.75rem)] font-light leading-[1.25] tracking-tight text-foreground/70">
              &ldquo;It says 12% APY but I only made 7%.
              <br className="hidden md:block" />
              <span className="text-foreground"> Where did the other 5% go?</span>&rdquo;
            </p>
            <cite className="mt-6 block text-center font-mono text-[10px] tracking-widest text-muted-foreground/30 not-italic uppercase">
              P11, Active DeFi Trader — on APY vs. actual returns
            </cite>
          </blockquote>
        </div>

        {/* ── Movement 3: The Conversion Killer + Resolution (asymmetric 2-up) ── */}
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:gap-8">
          {/* Insight 05 — highest impact, gets visual weight */}
          <div className="relative overflow-hidden rounded-2xl bg-foreground/[0.03] p-8 md:p-10">
            <span className="absolute -right-2 -top-6 select-none font-mono text-[8rem] font-black leading-none text-foreground/[0.03] md:text-[10rem]">05</span>
            <div className="relative">
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground/30 uppercase">Highest impact</span>
              <h3 className="mt-3 text-xl font-medium tracking-tight md:text-2xl">Dual deposit kills beginner conversion</h3>
              <p className="mt-3 max-w-[45ch] text-sm leading-relaxed text-muted-foreground/50">Requiring two tokens to deposit was an immediate abandonment trigger for every user without LP experience. Single-sided deposit became the default — the highest-impact, lowest-effort change in the entire project.</p>
              <p className="mt-6 text-[15px] font-light italic text-foreground/45">&ldquo;I have to pick two coins? I only have USDC. This is already too complicated.&rdquo;</p>
            </div>
          </div>

          {/* Insight 06 — the resolution */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/15 p-8 md:p-10">
            <div>
              <span className="font-mono text-[10px] text-muted-foreground/25">06</span>
              <h3 className="mt-3 text-lg font-medium tracking-tight">Trust blockers are informational, not technical</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground/50">Users can deposit. They just won&apos;t until they feel they understand the risks. The blockers are about information, not capability.</p>
            </div>
            <p className="mt-8 text-[13px] font-light italic text-foreground/40">&ldquo;I&apos;d put in fifty bucks to test. But I&apos;m not putting savings in unless I see it working for a month.&rdquo;</p>
          </div>
        </div>

        {/* Feature reaction heatmap */}
        <FeatureReactionMatrix />
      </section>

      {/* 10. Principles */}
      <section id="principles" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Principles</p>
        <h2 className="mt-4 max-w-[20ch] text-3xl font-medium tracking-tight md:text-4xl">The rules that guided every decision</h2>
        <div className="mt-14 md:mt-20">
          {[
            { number: "01", title: "Simplify the mental model", desc: "Reduce the conceptual overhead. Users should understand the system through familiar patterns, not through technical documentation. If someone needs to read a whitepaper to use the product, the product has failed." },
            { number: "02", title: "Surface trust at key decision points", desc: "Proactively answer the questions users have before they ask. Show what is happening, why, and what could go wrong. Trust is built by anticipating doubt, not by ignoring it." },
            { number: "03", title: "Show complexity only when needed", desc: "Layer information progressively. The default experience should be simple. Depth should be available for those who seek it, but never imposed on those who don't." },
            { number: "04", title: "Prioritize clarity over density", desc: "When in doubt, give things more space. Dense interfaces feel powerful, but they erode confidence in users who are already uncertain. Space communicates calm." },
            { number: "05", title: "Make performance legible", desc: "Abstract raw numbers into meaning. Users don't need a spreadsheet of data. They need to know three things: Is this working? Am I safe? What should I do next?" },
            { number: "06", title: "Reduce friction before asking for commitment", desc: "Let users understand before they invest. Education precedes action. Confidence precedes commitment. Never ask someone to deposit money into something they can't explain back to you." },
          ].map(({ number, title, desc }) => (
            <div key={number} className="grid items-baseline border-t border-border/20 py-8 md:grid-cols-[3rem_1fr_2fr] md:gap-8 md:py-10">
              <span className="font-mono text-xs text-muted-foreground/20">{number}</span>
              <h3 className="mt-2 text-lg font-medium tracking-tight md:mt-0">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground/60 md:mt-0">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className={dividerRail} />

      {/* 11. Architecture */}
      <section id="architecture" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Architecture</p>
        <h2 className="mt-4 max-w-[22ch] text-3xl font-medium tracking-tight md:text-4xl">Structuring the product, not just the screens</h2>
        <p className="mt-8 max-w-[58ch] text-base leading-relaxed text-muted-foreground md:text-lg">The core challenge was taking a system with multiple vault types, receipt tokens, rebalancing logic, fee structures, and risk parameters, and organizing it into something a user could navigate without a tutorial. The architecture had to serve both the beginner who just wants to deposit USDC and the power user who wants to verify every rebalancing decision.</p>
        <div className="mt-14 space-y-8">
          <figure className="group">
            <div className="overflow-hidden rounded-2xl border border-border/40 bg-muted/20">
              <Image
                src={nodoVaultSystemProductIARecolored}
                alt="NODO vault system product information architecture"
                width={nodoVaultSystemProductIARecolored.width}
                height={nodoVaultSystemProductIARecolored.height}
                className="h-auto w-full"
                sizes="(min-width: 1280px) 1100px, (min-width: 768px) 90vw, 100vw"
                quality={100}
                priority
              />
            </div>
            <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
              Product information architecture showing the vault system hierarchy
            </figcaption>
          </figure>
          <div className="flex flex-col gap-8">
            <figure className="group">
              <div className="overflow-hidden rounded-lg border border-border/40 bg-muted/20">
                <Image
                  src={primaryUserFlow}
                  alt="Primary user flow from landing to first deposit"
                  width={primaryUserFlow.width}
                  height={primaryUserFlow.height}
                  className="relative left-[3px] top-[-3px] h-auto w-full"
                  sizes="(min-width: 1280px) 1100px, (min-width: 768px) 90vw, 100vw"
                  quality={100}
                />
              </div>
              <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                Primary user flow from landing to first deposit
              </figcaption>
            </figure>
            <figure className="group">
              <div className="overflow-hidden rounded-lg border border-border/40 bg-muted/20">
                <Image
                  src={informationLayers}
                  alt="Progressive disclosure framework for the NODO product"
                  width={informationLayers.width}
                  height={informationLayers.height}
                  className="relative left-[3px] top-[-3px] h-auto w-full"
                  sizes="(min-width: 1280px) 1100px, (min-width: 768px) 90vw, 100vw"
                  quality={100}
                />
              </div>
              <figcaption className="mt-3 text-center font-mono text-[11px] text-muted-foreground/35">
                How information layers from simple to detailed across the product
              </figcaption>
            </figure>
          </div>
        </div>
        <p className="mt-12 max-w-[58ch] text-base leading-relaxed text-muted-foreground md:ml-[15%]">The key architectural decision was to separate the vault system into three information layers. The overview layer shows what you need to decide. The detail layer shows what you need to trust. The technical layer shows what you need to verify. Most users never reach the third layer, and that is by design.</p>
      </section>

      {/* 12. Exploration */}
      <section id="exploration" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Exploration</p>
        <h2 className="mt-4 max-w-[22ch] text-3xl font-medium tracking-tight md:text-4xl">Thinking through alternatives</h2>
        <p className="mt-8 max-w-[58ch] text-base leading-relaxed text-muted-foreground md:text-lg">I explored three distinct directions before converging on the final approach. Each had strengths, and the final product borrowed elements from all of them. What mattered was understanding why certain directions were rejected, not just which one won.</p>
        <div className="mt-14">
          <h3 className="text-sm font-medium text-foreground/80">Early Concepts</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <figure className="group">
              <div className="overflow-hidden rounded-lg border border-border/40 bg-muted/20">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={directionADashboardFirst}
                    alt="Direction A dashboard-first approach"
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-contain"
                    quality={100}
                  />
                </div>
              </div>
              <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                Direction A emphasized data density for power users
              </figcaption>
            </figure>
            <figure className="group">
              <div className="overflow-hidden rounded-lg border border-border/40 bg-muted/20">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={directionBGuidedOnboarding}
                    alt="Direction B guided onboarding approach"
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-contain"
                    quality={100}
                  />
                </div>
              </div>
              <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                Direction B prioritized step-by-step education
              </figcaption>
            </figure>
            <figure className="group">
              <div className="overflow-hidden rounded-lg border border-border/40 bg-muted/20">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={directionCProgressiveDisclosure}
                    alt="Direction C progressive disclosure approach"
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-contain"
                    quality={100}
                  />
                </div>
              </div>
              <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                Direction C layered information by user confidence
              </figcaption>
            </figure>
          </div>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-foreground/80">What Was Rejected</h3>
            <p className="mt-3 max-w-[45ch] text-sm leading-relaxed text-muted-foreground">Direction A gave power users everything they wanted but overwhelmed beginners on first contact. Direction B held everyone&apos;s hand equally, which frustrated experienced users and slowed down the path to deposit. Neither solved the core tension between the six persona segments we had identified.</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground/80">What Moved Forward</h3>
            <p className="mt-3 max-w-[45ch] text-sm leading-relaxed text-muted-foreground">Direction C became the foundation because it respected user agency. Instead of deciding how much information to show, it let users choose their depth. The vault overview is simple. Expanding any section reveals more. The technical layer is always one click away but never in the way.</p>
          </div>
        </div>
        <div className="mt-12">
          <figure className="group">
            <div className="overflow-hidden rounded-2xl border border-border/40 bg-muted/20">
              <div className="relative aspect-[2.5/1]">
                <Image
                  src={detailImage}
                  alt="Wireframe evolution from rough to refined"
                  width={detailImage.width}
                  height={detailImage.height}
                  sizes="(min-width: 768px) 100vw, calc(100vw - 3rem)"
                  className="h-auto w-full object-contain"
                  quality={100}
                />
              </div>
            </div>
            <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
              Design evolution across three rounds of iteration
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 13. Solution */}
      <section id="solution" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Solution</p>
        <h2 className="mt-4 max-w-[22ch] text-3xl font-medium tracking-tight md:text-4xl">The product, explained</h2>

        <div className="mt-16 grid items-center gap-10 md:mt-24 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <div>
            <span className="font-mono text-[10px] text-muted-foreground/25">01</span>
            <h3 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">Vault Overview</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">The first thing users see is a clean summary of each vault: the token pair, current APR, total value locked, and a one-line description of what the AI strategy does. No jargon. No walls of metrics. Just enough to decide whether to look closer.</p>
            <div className="mt-4 border-l-2 border-foreground/10 pl-4">
              <p className="text-xs leading-relaxed text-muted-foreground/50"><span className="font-medium text-muted-foreground/70">Key decision:</span> We led with net yield after fees, not headline APY. This was a direct response to the research finding that APY creates false expectations.</p>
            </div>
          </div>
          <figure className="group">
            <div className="overflow-hidden rounded-xl border border-border/40 bg-muted/20">
              <div className="relative aspect-[4/3] w-fit">
                <Image
                  src={manageLiquidityImage}
                  alt="Manage Liquidity screen for single-sided deposit"
                  width={manageLiquidityImage.width}
                  height={manageLiquidityImage.height}
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="h-fit w-fit object-contain"
                  quality={100}
                />
              </div>
            </div>
            <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
              Single-sided deposit flow in the manage liquidity screen
            </figcaption>
          </figure>
        </div>

        <div className="mt-20 grid items-center gap-10 md:mt-24 md:grid-cols-[1.5fr_0.8fr] md:gap-16">
          <figure className="group order-2 md:order-1 w-fit">
            <div className="overflow-hidden rounded-xl border border-border/40 bg-muted/20">
              <div className="relative w-fit">
                <Image
                  src={manageLiquidityImage}
                  alt="Manage Liquidity screen for single-sided deposit"
                  width={manageLiquidityImage.width}
                  height={manageLiquidityImage.height}
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="h-fit w-fit object-contain"
                  style={{ width: 'fit-content', height: 'fit-content' }}
                  quality={100}
                />
              </div>
            </div>
            <figcaption className="mt-3 text-center font-mono text-[11px] text-muted-foreground/35">
              Single-sided deposit as the default entry point
            </figcaption>
          </figure>
          <div className="order-1 md:order-2">
            <span className="font-mono text-[10px] text-muted-foreground/25">02</span>
            <h3 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">Single-Sided Deposit</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">The old flow required users to select two tokens and understand LP pairing. The new flow asks one question: how much USDC do you want to deposit? The protocol handles the rest. Dual-asset deposit still exists for advanced users, but it is no longer the default.</p>
            <div className="mt-4 border-l-2 border-foreground/10 pl-4">
              <p className="text-xs leading-relaxed text-muted-foreground/50"><span className="font-medium text-muted-foreground/70">Key decision:</span> This was the highest-impact change in the project. Research showed dual deposit caused immediate abandonment for every beginner segment.</p>
            </div>
          </div>
        </div>

        <div className="mt-20 md:mt-32">
          <figure className="group">
            <div className="overflow-hidden rounded-2xl border border-border/40 bg-muted/20">
              <div className="flex justify-center">
                <Image
                  src={breakdownImage}
                  alt="Holdings dashboard with P&L breakdown and position overview"
                  width={breakdownImage.width}
                  height={breakdownImage.height}
                  className="h-fit w-fit max-w-full object-contain"
                  sizes="(min-width: 1280px) 1100px, (min-width: 768px) 90vw, 100vw"
                  quality={100}
                />
              </div>
            </div>
            <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
              Holdings dashboard with P&L waterfall breakdown
            </figcaption>
          </figure>
          <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-16">
            <div>
              <span className="font-mono text-[10px] text-muted-foreground/25">03</span>
              <h3 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">Holdings and P&L</h3>
            </div>
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground">The holdings view leads with one number: your net return. Is your money up or down? That is all most users need. Below that, the P&L waterfall breaks the number apart: gross yield, minus fees, minus impermanent loss, equals your actual return. Power users can expand further into the full LP decomposition.</p>
              <div className="mt-4 border-l-2 border-foreground/10 pl-4">
                <p className="text-xs leading-relaxed text-muted-foreground/50"><span className="font-medium text-muted-foreground/70">Key decision:</span> Progressive disclosure. The default is a single number. Each layer adds detail for those who want it.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid items-center gap-10 md:mt-32 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <div>
            <span className="font-mono text-[10px] text-muted-foreground/25">04</span>
            <h3 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">Yield Attribution</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Where does the 8% come from? If we can&apos;t answer that clearly, users assume it comes from new depositors. The yield attribution module breaks returns into specific sources: trading fees, LP incentives, and rebalancing gains. Each source links to on-chain data for verification.</p>
            <div className="mt-4 border-l-2 border-foreground/10 pl-4">
              <p className="text-xs leading-relaxed text-muted-foreground/50"><span className="font-medium text-muted-foreground/70">Key decision:</span> This module exists because research showed that vague yield attribution actively triggers Ponzi suspicion.</p>
            </div>
          </div>
          <ImagePlaceholder label="[Insert yield attribution module]" caption="Yield source breakdown showing where returns come from" aspectRatio="aspect-[4/3]" variant="screen" />
        </div>

        <div className="mt-20 grid items-center gap-10 md:mt-32 md:grid-cols-[1.5fr_0.8fr] md:gap-16">
          <figure className="group order-2 md:order-1">
            <div className="overflow-hidden rounded-xl border border-border/40 bg-muted/20">
              <div className="relative aspect-[4/3]">
                <Image
                  src={ndlpEducationImage}
                  alt="NDLP education"
                  width={ndlpEducationImage.width}
                  height={ndlpEducationImage.height}
                  className="h-fit w-fit object-contain"
                  style={{ width: "fit-content", height: "fit-content" }}
                  sizes="(min-width: 768px) 40vw, 100vw"
                  quality={100}
                />
              </div>
            </div>
            <figcaption className="mt-3 text-center font-mono text-[11px] text-muted-foreground/35">
              NDLP explanation at point of receipt
            </figcaption>
          </figure>
          <div className="order-1 md:order-2">
            <span className="font-mono text-[10px] text-muted-foreground/25">05</span>
            <h3 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">NDLP Education and Strategy Transparency</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">When a user deposits, they receive NDLP tokens representing their vault position. Because research showed universal confusion about what NDLP is, we added an inline explainer at the exact moment of receipt. For AI strategy transparency, we published both a plain-English summary and a technical brief that power users can verify against on-chain data.</p>
            <div className="mt-4 border-l-2 border-foreground/10 pl-4">
              <p className="text-xs leading-relaxed text-muted-foreground/50"><span className="font-medium text-muted-foreground/70">Key decision:</span> Education happens in context, at the moment it is needed. Not in a help center. Not in a tooltip graveyard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 14. Trust */}
      <section id="trust" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Trust & Clarity</p>
        <h2 className="mt-4 max-w-[24ch] text-3xl font-medium tracking-tight md:text-4xl">Designing for confidence in uncertain systems</h2>
        <blockquote className="mt-12 max-w-[32ch] border-l-2 border-foreground/10 pl-6 text-xl leading-snug font-light tracking-tight text-foreground/80 md:ml-[10%] md:text-2xl">
          &quot;After FTX, I don&apos;t touch anything that doesn&apos;t have a clear legal entity and jurisdiction. I don&apos;t care how good the yield is.&quot;
          <cite className="mt-3 block font-mono text-[10px] font-normal tracking-wider text-muted-foreground/30 not-italic">P23, Passive Yield Seeker</cite>
        </blockquote>
        <div className="mt-14 grid gap-8 md:mt-16 md:grid-cols-2 lg:grid-cols-3 md:gap-10">
          {[
            { title: "Handling Complexity", content: "LP mechanics, rebalancing algorithms, and token pair ratios were abstracted into plain-English summaries. Power users can expand into full technical detail. Beginners see 'the vault adjusts to earn you more' and nothing more unless they ask." },
            { title: "Building Trust", content: "We published verifiable strategy documentation with on-chain metrics. Ecosystem partner logos for Cetus, DeepBook, and Momentum are displayed prominently. Audit reports, legal entity info, and contract addresses are visible at every decision point." },
            { title: "Communicating Risk", content: "We created a plain-English IL explanation paired with NODO-specific mitigation messaging. Historical max IL per vault is shown before deposit. Worst-case scenarios are surfaced proactively because honesty builds more trust than silence." },
            { title: "Educating Users", content: "We designed a beginner mode with plain-English replacements for all DeFi terminology. Education is progressive and contextual. Tooltips appear when relevant, not front-loaded as a tutorial wall that users close without reading." },
            { title: "Onboarding Confidence", content: "The system supports two-phase deposits. Users can test with a small amount first, see it working, and then commit real capital. Trust is earned incrementally, not demanded upfront through a single high-stakes deposit screen." },
            { title: "Decision Support", content: "We built a yield source attribution module, a P&L waterfall, and a comprehensive fee calculator. Users don't need raw data. They need answers to three questions: Am I up or down? Is this working? What should I do next?" },
          ].map(({ title, content }) => (
            <div key={title}>
              <h3 className="text-sm font-medium text-foreground/80">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground/60">{content}</p>
            </div>
          ))}
        </div>
        <div className="mt-16">
          <ImagePlaceholder label="[Insert trust design details: risk indicators, educational overlays, confidence-building moments]" caption="Trust design: how the interface builds confidence at every decision point" aspectRatio="aspect-[21/9]" variant="hero" />
        </div>
      </section>

      <div className={dividerRail} />

      {/* 15. Outcomes */}
      <section id="outcomes" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Outcomes</p>
        <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">What changed because of this work</h2>
        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
          {[
            { metric: "1", label: "Highest-impact change shipped: single-sided deposit replaced dual-asset as default", type: "Conversion", accent: "oklch(0.72 0.16 160)" },
            { metric: "6", label: "Persona segments served by one progressive disclosure architecture", type: "Coverage", accent: "oklch(0.65 0.15 260)" },
            { metric: "0", label: "Screens that launched without a research-backed rationale behind them", type: "Confidence", accent: "oklch(0.72 0.14 85)" },
            { metric: "Q2", label: "Shipped MVP on Sui mainnet within the planned timeline", type: "Delivery", accent: "oklch(0.65 0.16 25)" },
          ].map(({ metric, label, type, accent }) => (
            <div key={type} className="group relative overflow-hidden rounded-xl border border-border/30 bg-muted/10 p-6 transition-colors hover:bg-muted/20">
              <div className="absolute top-0 left-0 h-[3px] w-full" style={{ backgroundColor: accent, opacity: 0.5 }} />
              <p className="font-mono text-[10px] tracking-wider text-muted-foreground/40 uppercase">{type}</p>
              <p className="mt-3 text-3xl font-medium tracking-tight md:text-4xl" style={{ color: accent }}>{metric}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground/50">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <h3 className="text-sm font-medium text-foreground/80">Qualitative Signals</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Research participants consistently described the redesigned product as &quot;significantly clearer&quot; than existing DeFi vault interfaces. The engineering team reported faster implementation due to well-structured design specs. Stakeholders cited the design and research work as a key differentiator in investor conversations.</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground/80">What Testing Validated</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Single-sided deposit removed the most common abandonment trigger for beginners. The NDLP explainer at point of receipt eliminated most comprehension confusion. The P&L waterfall gave users a mental model they could actually hold onto. And the two-phase deposit approach matched exactly how users described their own trust-building process.</p>
          </div>
        </div>
      </section>

      {/* 16. Reflection */}
      <section id="reflection" className={sectionRail}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">Reflection</p>
        <h2 className="mt-4 max-w-[22ch] text-3xl font-medium tracking-tight md:text-4xl">Looking back, looking forward</h2>
        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-20">
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium text-foreground/80">What Worked</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Leading with research before design saved enormous time. Every major design decision could be traced back to a specific insight with a specific evidence count. The progressive disclosure architecture proved flexible enough to serve all six persona segments without compromising on any of them.</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground/80">What Remained Unresolved</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">The reward-driven explorer segment will likely churn when incentive programs end. We designed an education bridge during the reward period, but whether that is enough to convert temporary users into long-term depositors is still unproven. The stablecoin vault, which was the top request from safety-first users, is planned for Sprint 3 but was not yet launched.</p>
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium text-foreground/80">What I Would Explore Next</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">A rebalancing activity log for power users, so they can see every decision the AI made and why. A proper institutional information package with audit reports, legal entity disclosure, and insurance documentation. And deeper work on the strategy marketplace as NODO expands to support third-party vault creators.</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground/80">What This Changed in My Thinking</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">This project taught me that trust is not a feature you add at the end. It is the architecture itself. Every information hierarchy decision, every default state, every word choice either builds or erodes the confidence that makes someone willing to commit real money. Designing for financial products is designing for the distance between what people understand and what they need to feel certain about.</p>
            </div>
          </div>
        </div>
      </section>

      <div className={dividerRail} />

      {/* 17. Next / CTA */}
      <section className="pb-10 pt-24 md:pb-20 md:pt-40">
        <CaseStudyFooter currentProject="nodo-ai" />
      </section>

      <footer className={`${contentRail} border-t border-border/10 py-8 mt-12`}>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground/30">&copy; 2026 Leon</span>
          <span className="text-xs text-muted-foreground/30">Built with quiet intention</span>
        </div>
      </footer>

        </div>
      </div>
    </main>
  )
}
