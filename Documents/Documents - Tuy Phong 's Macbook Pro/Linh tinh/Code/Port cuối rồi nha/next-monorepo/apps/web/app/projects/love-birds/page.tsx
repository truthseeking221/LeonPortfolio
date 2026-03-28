import type { Metadata } from "next"
import { Badge } from "@workspace/ui/components/badge"
import { TableOfContents } from "@/components/case-study/table-of-contents"
import { ImagePlaceholder } from "@/components/case-study/image-placeholder"
import { FigmaEmbed } from "@/components/case-study/figma-embed"
import { CaseStudyFooter } from "@/components/case-study/case-study-footer"
import { MobileToC } from "@/components/case-study/mobile-toc"
import aiMatchReasoningImage from "../../images/The AI surfaces matches with reasoning, not just photos.png"
import chapterProfilesImage from "../../images/Chapter profiles go deeper than any swipe card.png"
import conversationalMatchmakingImage from "../../images/The conversational matchmaking experience.png"
import competitiveLandscapeImage from "../../images/Competitive landscape analysis — dating app market positioning 2 (1).png"
import act1Image from "../../images/Act 1_ The AI concierge welcomes and initiates.png"
import act2Image from "../../images/Act 2_ Bridging the gap from match to conversation.png"
import act3Image from "../../images/Act 3_ From conversation to confirmed date.png"
import aiMediatedChatImage from "../../images/AI-mediated chat with contextual tooltips and date planning.png"
import humanToHumanMessagingImage from "../../images/Human-to-human messaging with a deliberately warmer visual tone.png"

export const metadata: Metadata = {
  title: "Love Birds — Case Study — Leon",
  description:
    "Designing an AI-powered dating experience that gets you a date in 48 hours. A product design case study by Leon.",
}

const tocItems = [
  { id: "snapshot", label: "Overview" },
  { id: "context", label: "Context" },
  { id: "challenge", label: "Challenge" },
  { id: "approach", label: "Approach" },
  { id: "ai-matchmaker", label: "AI Matchmaker" },
  { id: "flow", label: "Core Flow" },
  { id: "conversation", label: "Conversation" },
  { id: "prototype", label: "Prototype" },
  { id: "outcomes", label: "Outcomes" },
  { id: "reflection", label: "Reflection" },
]

const contentRail = "mx-auto w-full max-w-[1100px] px-6 md:px-10 lg:px-14"
const sectionRail = `${contentRail} py-24 md:py-32`
const wideRail = "mx-auto w-full max-w-[1340px] px-6 md:px-10 lg:px-14"
const dividerRail =
  "mx-auto h-px w-[calc(100%-3rem)] max-w-[1100px] bg-border/30 md:w-[calc(100%-5rem)] lg:w-[calc(100%-7rem)]"

export default function LoveBirdsCaseStudy() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <div className="xl:grid xl:grid-cols-[120px_1fr]">
        <aside className="hidden xl:block xl:pl-6">
          <TableOfContents items={tocItems} />
          <MobileToC items={tocItems} />
        </aside>
        <div className="min-w-0">

          {/* ── 1. Hero ── */}
          <section className={`${contentRail} relative pt-28 pb-16 md:pt-36 md:pb-24`}>
            <div className="flex items-center gap-3">
              <Badge variant="outline">AI Dating</Badge>
              <Badge variant="outline">Mobile App</Badge>
              <Badge variant="secondary">Concept</Badge>
            </div>

            <h1 className="mt-6 text-[clamp(3.5rem,12vw,10rem)] leading-[0.88] font-medium tracking-tighter">
              Love Birds
            </h1>

            <p className="mt-6 max-w-[50ch] text-xl leading-relaxed font-light text-muted-foreground md:text-2xl">
              Dating apps are broken. People swipe for months and never meet.
              What if an AI agent could get you a real date in 48 hours?
            </p>

            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-border/40 pt-8 md:grid-cols-5 md:gap-x-12">
              {[
                { label: "Role", value: "Product Designer" },
                { label: "Timeline", value: "Q1 2025" },
                { label: "Scope", value: "Concept to Prototype" },
                { label: "Platform", value: "iOS (Mobile)" },
                { label: "Status", value: "Concept" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-mono text-[10px] tracking-wider text-muted-foreground/40 uppercase">
                    {label}
                  </p>
                  <p className="mt-1.5 text-sm text-foreground/80">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-16">
              <figure className="group">
                <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-muted/20 aspect-[16/9]">
                  <img
                    src={conversationalMatchmakingImage.src}
                    alt="The conversational matchmaking experience"
                    className="h-fit w-fit object-cover"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                  The conversational matchmaking experience
                </figcaption>
              </figure>
            </div>
          </section>

          {/* ── 2. Snapshot ── */}
          <section id="snapshot" className={sectionRail}>
            <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">
              At a glance
            </p>
            <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-2 lg:grid-cols-3 md:gap-12">
              {[
                {
                  title: "Overview",
                  content:
                    "Love Birds reimagines online dating through an AI concierge. Instead of endless swiping, users talk to an intelligent agent that understands their preferences, finds compatible matches, and orchestrates the entire journey from discovery to a confirmed date.",
                },
                {
                  title: "Problem",
                  content:
                    "Modern dating apps optimize for engagement, not outcomes. Users spend hours swiping, messaging goes cold, and dates rarely happen. The average user takes 2-3 weeks to meet someone. For young urban professionals, that's too slow.",
                },
                {
                  title: "Contribution",
                  content:
                    "End-to-end product design: user research, interaction model, visual design system, conversational UX, matchmaking flow, date planning interface, and high-fidelity prototype with 40+ screens.",
                },
                {
                  title: "Outcome",
                  content:
                    "A fully realized concept that collapses the dating funnel from weeks to 48 hours. The AI handles discovery, compatibility scoring, ice-breaking, and venue planning. Users just show up.",
                },
                {
                  title: "Key Innovation",
                  content:
                    "A chat-first interface where the AI is a proactive matchmaker, not a passive filter. It surfaces insights about potential matches, suggests conversation starters, and books the date once both parties agree.",
                },
                {
                  title: "Target Audience",
                  content:
                    "22-30 year olds, urban, living in fast-paced cities. People who value their time, are comfortable with AI, and want real connections without the friction of traditional dating apps.",
                },
              ].map(({ title, content }) => (
                <div key={title} className="border-t border-border/30 pt-5">
                  <h3 className="text-sm font-medium tracking-tight">{title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground/60">
                    {content}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className={dividerRail} />

          {/* ── 3. Context ── */}
          <section id="context" className={sectionRail}>
            <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">
              Context
            </p>
            <h2 className="mt-4 max-w-[22ch] text-3xl font-medium tracking-tight md:text-4xl">
              Why dating apps fail
            </h2>

            <div className="mt-12 space-y-16">
              {/* Narrative + Stats side by side */}
              <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-start md:gap-20">
                <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                  <p>
                    The dating app industry generates $5.6B in annual revenue. But user
                    satisfaction is at an all-time low. Tinder&apos;s paying subscriber count
                    has declined every quarter since 2023. Bumble laid off 30% of its
                    workforce. The model is breaking.
                  </p>
                  <p>
                    The core issue is misaligned incentives. Apps profit from time spent
                    swiping, not from dates that actually happen. The result: a dopamine
                    loop disguised as matchmaking. Users accumulate matches they never
                    message, conversations that die after three exchanges, and a growing
                    cynicism that makes the next interaction even harder.
                  </p>
                  <p>
                    Love Birds asks a different question: What if the product&apos;s job was
                    to get you on a date as fast as possible?
                  </p>
                </div>

                {/* Key stats */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { stat: "48h", label: "Target time to first date", accent: "oklch(0.72 0.16 340)" },
                    { stat: "83%", label: "AI compatibility match rate", accent: "oklch(0.65 0.15 260)" },
                    { stat: "40+", label: "Screens designed", accent: "oklch(0.72 0.14 85)" },
                    { stat: "3", label: "Core user flows", accent: "oklch(0.65 0.16 160)" },
                  ].map(({ stat, label, accent }) => (
                    <div
                      key={label}
                      className="group relative overflow-hidden rounded-lg border border-border/20 bg-muted/10 p-3 transition-colors hover:bg-muted/20"
                    >
                      <div
                        className="absolute bottom-0 left-0 h-[2px] w-full"
                        style={{ backgroundColor: accent, opacity: 0.3 }}
                      />
                      <p className="text-lg font-medium tracking-tight" style={{ color: accent }}>
                        {stat}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground/40">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <figure className="group">
                <div className="relative overflow-hidden rounded-lg border border-border/40 bg-muted/20">
                  <img
                    src={competitiveLandscapeImage.src}
                    alt="Competitive landscape analysis — dating app market positioning"
                    className="w-full h-auto block"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                  Mapping the gap between engagement-optimized and outcome-optimized dating products
                </figcaption>
              </figure>
            </div>
          </section>

          {/* ── 4. Challenge ── */}
          <section id="challenge" className={sectionRail}>
            <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">
              The Challenge
            </p>
            <h2 className="mt-4 max-w-[24ch] text-3xl font-medium tracking-tight md:text-4xl">
              Designing trust in an AI matchmaker
            </h2>

            <blockquote className="mt-12 max-w-[32ch] border-l-2 border-foreground/10 pl-6 text-2xl leading-snug font-light tracking-tight text-foreground/80 md:ml-[10%] md:text-3xl">
              &quot;I&apos;d let AI pick my playlist. But pick my date? That&apos;s a different kind of trust.&quot;
              <cite className="mt-3 block font-mono text-[10px] font-normal tracking-wider text-muted-foreground/30 not-italic">
                Research participant, 26, Dubai
              </cite>
            </blockquote>

            <div className="mt-14 grid gap-8 md:mt-16 md:grid-cols-2 md:gap-12">
              {[
                {
                  title: "Trust Challenge",
                  content:
                    "People trust AI for music recommendations. They trust AI for navigation. But romance is deeply personal. We needed to earn trust progressively. Show the reasoning. Let users steer. Never feel like the machine decided for you.",
                },
                {
                  title: "UX Challenge",
                  content:
                    "Chat-based interfaces are inherently linear. But dating involves parallel evaluation, contextual judgment, and emotional nuance. The interface needed to feel conversational without being limiting.",
                },
                {
                  title: "Speed vs. Safety",
                  content:
                    "48 hours is aggressive. Rushing people into dates can feel unsafe. Every acceleration in the flow needed a corresponding safety valve. Opt-out at every step. Context before commitment.",
                },
                {
                  title: "Why This Was Hard",
                  content:
                    "No existing patterns for AI-mediated dating. The closest analogues are matchmaking services ($5K+) or friend setups (unreliable). We were designing a new category with the intimacy expectations of a personal concierge.",
                },
              ].map(({ title, content }) => (
                <div key={title}>
                  <h3 className="text-sm font-medium tracking-wider text-muted-foreground/50 uppercase">
                    {title}
                  </h3>
                  <p className="mt-3 max-w-[45ch] text-base leading-relaxed text-muted-foreground">
                    {content}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className={dividerRail} />

          {/* ── 5. Approach ── */}
          <section id="approach" className={sectionRail}>
            <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">
              Approach
            </p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
              How the design took shape
            </h2>
            <div className="mt-14 md:mt-20">
              <div className="relative">
                <div className="absolute top-4 right-0 left-0 hidden h-px bg-border/40 md:block" />
                <div className="grid gap-8 md:grid-cols-5 md:gap-0">
                  {[
                    {
                      phase: "01",
                      title: "Understanding the space",
                      desc: "Audited 12 dating apps. Interviewed 15 users aged 22-30. Mapped the emotional journey from download to first date.",
                    },
                    {
                      phase: "02",
                      title: "Defining the AI role",
                      desc: "Established the agent's personality, boundaries, and trust-building protocol. Not a bot. A concierge.",
                    },
                    {
                      phase: "03",
                      title: "Shaping the flow",
                      desc: "Designed three core flows: Discovery, Engagement, and Date Planning. Each optimized for speed and safety.",
                    },
                    {
                      phase: "04",
                      title: "Visual system",
                      desc: "Dark-mode-first UI. Warm accents for human moments. Cool tones for AI actions. Typography that feels personal, not clinical.",
                    },
                    {
                      phase: "05",
                      title: "Prototyping",
                      desc: "Built a 40+ screen interactive prototype covering the full journey from onboarding to date confirmation.",
                    },
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

          {/* ── 6. AI Matchmaker — The Key Innovation ── */}
          <section id="ai-matchmaker" className="pt-24 md:pt-32">
            <div className={contentRail}>
              <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">
                The AI Matchmaker
              </p>
              <h2 className="mt-4 max-w-[22ch] text-3xl font-medium tracking-tight md:text-4xl">
                Meet your wingman
              </h2>
              <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted-foreground/70 md:text-lg">
                The AI agent — a bird character with personality and warmth — acts as
                a personal matchmaker. It greets users with &quot;GM Lovefish!&quot;, scans
                the network for compatible matches, and presents each one with context
                and reasoning, not just photos.
              </p>
            </div>

            {/* Feature breakdown — wider band */}
            <div className="mt-16 border-y border-border/20 bg-foreground/[0.015] py-14 md:py-20">
              <div className={`${wideRail} grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-12`}>
                {[
                  {
                    title: "Proactive Discovery",
                    desc: "The AI doesn't wait for swipes. It scans the network, evaluates compatibility across multiple dimensions, and brings matches to you with clear reasoning. \"Hey Lovefish, have you met Andreea? You both frequent Palm Jumeirah.\"",
                    detail: "Compatibility scoring, location awareness, shared interest detection",
                  },
                  {
                    title: "Soulmate Index",
                    desc: "Every match comes with a transparent compatibility score. Not a black box. Users see why they scored 83% — shared values, lifestyle alignment, personality compatibility. The AI shows its work.",
                    detail: "Transparent scoring, personality insights, trust through explainability",
                  },
                  {
                    title: "Chapter Profiles",
                    desc: "Richer than any dating profile. The AI generates a \"Chapter\" for each person — their ideal partner, obsessions, attachment style, personality type, and top values. Real depth, not just curated photos.",
                    detail: "AI-generated personality profiles, opening line suggestions, top 3 values",
                  },
                ].map(({ title, desc, detail }) => (
                  <div key={title} className="relative">
                    <h3 className="text-base font-medium tracking-tight">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground/60">{desc}</p>
                    <p className="mt-4 font-mono text-[10px] tracking-wide text-muted-foreground/30 uppercase">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile card + soulmate index screenshots */}
            <div className={`${wideRail} mt-14 grid gap-5 md:grid-cols-2`}>
              <figure className="group">
                <div className="relative overflow-hidden rounded-xl border border-border/40 bg-muted/20 aspect-[3/4]">
                  <img
                    src={aiMatchReasoningImage.src}
                    alt="The AI surfaces matches with reasoning, not just photos"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                  The AI surfaces matches with reasoning, not just photos
                </figcaption>
              </figure>
              <figure className="group">
                <div className="relative overflow-hidden rounded-xl border border-border/40 bg-muted/20 aspect-[3/4]">
                  <img
                    src={chapterProfilesImage.src}
                    alt="Chapter profiles go deeper than any swipe card"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                  Chapter profiles go deeper than any swipe card
                </figcaption>
              </figure>
            </div>
          </section>

          <div className={`${dividerRail} mt-24 md:mt-32`} />

          {/* ── 7. Core Flow ── */}
          <section id="flow" className={sectionRail}>
            <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">
              Core Flow
            </p>
            <h2 className="mt-4 max-w-[20ch] text-3xl font-medium tracking-tight md:text-4xl">
              From &quot;Find a date&quot; to &quot;See you tonight&quot;
            </h2>
            <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted-foreground/70 md:text-lg">
              The entire experience collapses the dating funnel into three acts.
              Each step is designed to build momentum and reduce the friction
              that kills most matches before they become real.
            </p>

            {/* Three-act flow */}
            <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border/20 md:grid-cols-3">
              {[
                {
                  act: "Act 1",
                  title: "Discovery",
                  steps: [
                    "User opens the app, greeted by AI concierge",
                    "Taps \"Find A Date\" to initiate search",
                    "AI scans network and presents matches with context",
                    "User reviews match card: photo, compatibility %, location, intent",
                    "Three actions: Interested, Insights, or Pass",
                  ],
                  accent: "oklch(0.72 0.16 340)",
                },
                {
                  act: "Act 2",
                  title: "Engagement",
                  steps: [
                    "AI sends interest signal to the match",
                    "If reciprocated, AI bridges the conversation",
                    "Suggests personalized opening lines",
                    "Contextual AI tooltips explain messages in real-time",
                    "Users transition to direct messaging",
                  ],
                  accent: "oklch(0.65 0.15 260)",
                },
                {
                  act: "Act 3",
                  title: "Date Planning",
                  steps: [
                    "AI suggests venues based on shared interests and location",
                    "Proposes time slots from both users' availability",
                    "Confirms reservation and sends details to both parties",
                    "Date verified on-chain, payment processed",
                    "Post-date: AI checks in and learns from feedback",
                  ],
                  accent: "oklch(0.72 0.14 85)",
                },
              ].map(({ act, title, steps, accent }) => (
                <div key={act} className="bg-muted/5 p-8 md:p-10">
                  <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: accent }}>
                    {act}
                  </span>
                  <h3 className="mt-2 text-xl font-medium tracking-tight">{title}</h3>
                  <ol className="mt-6 space-y-3">
                    {steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground/60">
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-medium"
                          style={{ backgroundColor: `color-mix(in oklch, ${accent}, transparent 85%)`, color: accent }}
                        >
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>

            {/* Flow screens */}
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              <figure className="group">
                <div className="relative overflow-hidden rounded-xl border border-border/40 bg-muted/20 aspect-[9/16]">
                  <img
                    src={act1Image.src}
                    alt="Onboarding — GM Lovefish! The AI greets and offers to find a date"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                  Act 1: The AI concierge welcomes and initiates
                </figcaption>
              </figure>
              <figure className="group">
                <div className="relative overflow-hidden rounded-xl border border-border/40 bg-muted/20 aspect-[9/16]">
                  <img
                    src={act2Image.src}
                    alt="Interest signal — AI bridges the connection between matched users"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                  Act 2: Bridging the gap from match to conversation
                </figcaption>
              </figure>
              <figure className="group">
                <div className="relative overflow-hidden rounded-xl border border-border/40 bg-muted/20 aspect-[9/16]">
                  <img
                    src={act3Image.src}
                    alt="Date confirmed — venue booked, time set, both parties notified"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                  Act 3: From conversation to confirmed date
                </figcaption>
              </figure>
            </div>
          </section>

          <div className={dividerRail} />

          {/* ── 8. Conversation Design ── */}
          <section id="conversation" className={sectionRail}>
            <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">
              Conversation Design
            </p>
            <h2 className="mt-4 max-w-[24ch] text-3xl font-medium tracking-tight md:text-4xl">
              The AI that knows when to step back
            </h2>

            <div className="mt-12 grid gap-16 md:grid-cols-[1fr_1fr] md:gap-20">
              <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                <p>
                  The hardest part of designing Love Birds wasn&apos;t the matchmaking
                  algorithm. It was the conversational handoff. The AI needs to be
                  present enough to be helpful, but invisible enough to not feel like
                  a third wheel.
                </p>
                <p>
                  When two users start chatting, the AI shifts from matchmaker to
                  context provider. It surfaces relevant insights as subtle tooltips.
                  &quot;She doesn&apos;t mind you&apos;re down bad from trading memes. Just don&apos;t
                  hurt her feelings and you&apos;re good.&quot; Playful. Honest. Then it
                  gets out of the way.
                </p>
                <p>
                  The messaging interface transitions from the dark, AI-centric
                  theme to a lighter, warmer palette. A deliberate visual signal:
                  this is your conversation now. The AI is still there if you
                  need it, but the stage belongs to you.
                </p>
              </div>

              <div className="space-y-8">
                <div className="rounded-xl border border-border/30 bg-muted/10 p-6">
                  <h3 className="font-mono text-[10px] tracking-wider text-muted-foreground/50 uppercase">
                    AI Behavior Modes
                  </h3>
                  <div className="mt-5 space-y-4">
                    {[
                      { mode: "Matchmaker", behavior: "Proactively finds and presents matches with reasoning" },
                      { mode: "Concierge", behavior: "Suggests venues, times, and conversation topics" },
                      { mode: "Translator", behavior: "Provides contextual tooltips during chat" },
                      { mode: "Ghost", behavior: "Steps back completely during natural conversation flow" },
                    ].map(({ mode, behavior }) => (
                      <div key={mode} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 items-center rounded-full bg-foreground/5 px-2.5 font-mono text-[10px] tracking-wider text-foreground/60">
                          {mode}
                        </span>
                        <p className="text-sm leading-relaxed text-muted-foreground/60">{behavior}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border/30 bg-muted/10 p-6">
                  <h3 className="font-mono text-[10px] tracking-wider text-muted-foreground/50 uppercase">
                    Design Decisions
                  </h3>
                  <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground/60">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/20" />
                      Dark theme for AI interactions, light theme for human-to-human chat
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/20" />
                      AI tooltips on ambiguous messages — tap the &quot;?&quot; to see context
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/20" />
                      Suggested opening lines generated from match&apos;s personality profile
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/20" />
                      Date confirmation banner with venue, time, and cost transparency
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2">
              <figure className="group">
                <div className="relative overflow-hidden rounded-xl border border-border/40 bg-muted/20 aspect-[9/16]">
                  <img
                    src={aiMediatedChatImage.src}
                    alt="Dark mode AI chat — matchmaker orchestrating the connection"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                  AI-mediated chat with contextual tooltips and date planning
                </figcaption>
              </figure>
              <figure className="group">
                <div className="relative overflow-hidden rounded-xl border border-border/40 bg-muted/20 aspect-[9/16]">
                  <img
                    src={humanToHumanMessagingImage.src}
                    alt="Light mode direct messaging — the conversation belongs to the users"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                  Human-to-human messaging with a deliberately warmer visual tone
                </figcaption>
              </figure>
            </div>
          </section>

          <div className={dividerRail} />

          {/* ── 9. Interactive Prototype ── */}
          <section id="prototype" className="py-24 md:py-32">
            <div className={contentRail}>
              <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">
                Prototype
              </p>
              <h2 className="mt-4 max-w-[22ch] text-3xl font-medium tracking-tight md:text-4xl">
                Experience it yourself
              </h2>
              <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted-foreground/70 md:text-lg">
                The full interactive prototype covers the journey from first
                open to confirmed date. Click through to experience the AI
                matchmaking flow, personality profiles, and conversation design
                firsthand.
              </p>
            </div>

            <div className="mt-14">
              <FigmaEmbed
                src="https://embed.figma.com/proto/0i7A3lm3pMtDO6hNsi6hte/LOVEBIRDS?page-id=0%3A1&node-id=19-6096&p=f&viewport=561%2C-71%2C0.33&scaling=scale-down&content-scaling=fixed&starting-point-node-id=19%3A6096&embed-host=share"
                title="Love Birds — Interactive Prototype"
              />
            </div>
          </section>

          <div className={dividerRail} />

          {/* ── 10. Outcomes ── */}
          <section id="outcomes" className={sectionRail}>
            <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">
              Outcomes
            </p>
            <h2 className="mt-4 max-w-[20ch] text-3xl font-medium tracking-tight md:text-4xl">
              What this concept proves
            </h2>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 md:gap-10">
              {[
                {
                  title: "Speed Without Pressure",
                  content:
                    "The 48-hour timeline works because the AI removes friction, not because it rushes users. Every step includes explicit opt-out. Speed comes from removing dead time, not compressing decision-making.",
                },
                {
                  title: "AI as Mediator",
                  content:
                    "The concierge model solves the cold-start problem. Instead of two strangers trying to spark chemistry through text, the AI bridges the gap with context, shared interests, and suggested topics.",
                },
                {
                  title: "Trust Through Transparency",
                  content:
                    "The Soulmate Index and Chapter profiles show why a match was made. Users trust the system because they can see the reasoning. No black boxes.",
                },
                {
                  title: "Dual-Tone Interface",
                  content:
                    "The dark/light mode transition between AI and human chat is a simple but powerful signal. It tells users when the AI is driving and when they are.",
                },
                {
                  title: "End-to-End Journey",
                  content:
                    "Unlike traditional dating apps that stop at the match, Love Birds designs the full path to a real-world meeting. Venue, time, confirmation. The product's job isn't done until two people sit across from each other.",
                },
                {
                  title: "Scalable Patterns",
                  content:
                    "The conversational matchmaking model can extend beyond dating: professional networking, event matching, mentorship pairing. The interaction pattern is the innovation.",
                },
              ].map(({ title, content }) => (
                <div key={title} className="rounded-xl border border-border/30 bg-muted/10 p-5">
                  <h3 className="text-sm font-medium tracking-tight">{title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground/60">{content}</p>
                </div>
              ))}
            </div>
          </section>

          <div className={dividerRail} />

          {/* ── 11. Reflection ── */}
          <section id="reflection" className={sectionRail}>
            <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">
              Reflection
            </p>
            <h2 className="mt-4 max-w-[20ch] text-3xl font-medium tracking-tight md:text-4xl">
              What I learned
            </h2>

            <div className="mt-12 max-w-[52ch] space-y-6 text-base leading-relaxed text-muted-foreground md:ml-[10%] md:text-lg">
              <p>
                Love Birds started as an exploration of how AI could reshape a
                category everyone knows is broken. What surprised me most was
                how much the design problem was about emotional pacing, not
                technology.
              </p>
              <p>
                The AI&apos;s personality mattered more than its accuracy. Users
                forgave imperfect matches if the presentation felt thoughtful
                and the tone felt human. The bird mascot, the playful language,
                the &quot;GM Lovefish!&quot; greeting — these weren&apos;t decorations. They
                were trust signals.
              </p>
              <p>
                The biggest design challenge was the handoff moment. When does
                the AI stop being helpful and start being intrusive? That
                boundary isn&apos;t fixed. It shifts with every user, every match,
                every conversation. Designing for that ambiguity taught me
                more about AI product design than any technical constraint.
              </p>
              <p>
                If I were to take this further, I&apos;d invest in the post-date
                feedback loop. The AI gets smarter with every interaction.
                But only if users trust it enough to be honest about what
                worked and what didn&apos;t. That trust is earned, not assumed.
              </p>
            </div>
          </section>

        </div>
      </div>
      <CaseStudyFooter currentProject="love-birds" />
    </main>
  )
}
