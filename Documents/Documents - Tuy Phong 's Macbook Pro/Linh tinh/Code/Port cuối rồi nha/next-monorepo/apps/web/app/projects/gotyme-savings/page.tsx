import type { Metadata } from "next"

import { Badge } from "@workspace/ui/components/badge"
import { TableOfContents } from "@/components/case-study/table-of-contents"
import { ImagePlaceholder } from "@/components/case-study/image-placeholder"
import { CaseStudyFooter } from "@/components/case-study/case-study-footer"
import { MobileToC } from "@/components/case-study/mobile-toc"
import goalSaveDashboardImage from "../../images/GoalSave dashboard. Multiple goals, each with its own progress and identity..png"
import threeGoalsImage from "../../images/Three goals. Three names. Three reasons to not touch the money..png"
import goalNamingImage from "../../images/The first step is giving it a name, not a number..png"
import paluwaganImage from "../../images/The paluwagan works not because it is convenient, but because you decided once..png"
import autoSaveImage from "../../images/Set it once. The money moves on its own..png"
import onTrackImage from "../../images/On track. Affirms without over-celebrating..png"
import nearlyThereImage from "../../images/Nearly there. A specific action, not generic encouragement..png"
import missedDateImage from "../../images/Missed the date. Honest without shame..png"

export const metadata: Metadata = {
  title: "GoTyme GoalSave \u00b7 Case Study \u00b7 Leon",
  description:
    "A savings product shaped around behavior, not features. Built for the Philippines, where people already knew how to save \u2014 they just needed a system that kept going without them. A product design case study by Leon.",
}

const tocItems = [
  { id: "premise", label: "The Premise" },
  { id: "gap", label: "The Gap" },
  { id: "truths", label: "Three Quiet Truths" },
  { id: "how", label: "How It Works" },
  { id: "changed", label: "What Changed" },
  { id: "carried", label: "What I Carried Forward" },
]

const contentRail = "mx-auto w-full max-w-[1100px] px-6 md:px-10 lg:px-14"
const sectionRail = `${contentRail} py-24 md:py-32`
const dividerRail =
  "mx-auto h-px w-[calc(100%-3rem)] max-w-[1100px] bg-border/30 md:w-[calc(100%-5rem)] lg:w-[calc(100%-7rem)]"

export default function GoTymeSavingsCaseStudy() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <div className="xl:grid xl:grid-cols-[120px_1fr]">
        <aside className="hidden xl:block xl:pl-6">
          <TableOfContents items={tocItems} />
          <MobileToC items={tocItems} />
        </aside>
        <div className="min-w-0">
          {/* ──── Hero ──── */}
          <section
            className={`${contentRail} relative pt-28 pb-16 md:pt-36 md:pb-24`}
          >
            <div className="flex items-center gap-3">
              <Badge variant="outline">Fintech &middot; Savings</Badge>
              <Badge variant="secondary">Shipped</Badge>
            </div>

            <h1 className="mt-6 text-[clamp(3rem,10vw,8.5rem)] leading-[0.88] font-medium tracking-tighter">
              GoTyme
              <br />
              GoalSave
            </h1>

            <p className="mt-8 max-w-[36ch] text-xl leading-relaxed font-light text-muted-foreground md:text-2xl">
              Saving is not a feature.
              <br />
              It is a habit that needs a place to live.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-border/40 pt-8 md:grid-cols-5 md:gap-x-12">
              {[
                { label: "Role", value: "Product Designer" },
                { label: "Platform", value: "iOS & Android" },
                { label: "Market", value: "Philippines" },
                { label: "Initiative", value: "TymeX" },
                { label: "Status", value: "Shipped" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-mono text-[10px] tracking-wider text-muted-foreground/40 uppercase">
                    {label}
                  </p>
                  <p className="mt-1.5 text-sm text-foreground/80">{value}</p>
                </div>
              ))}
            </div>

            <p className="mt-14 max-w-[48ch] text-base leading-relaxed text-muted-foreground md:text-lg">
              Most savings products are built for people who have already decided
              to save. GoalSave was built for the moment before that&nbsp;&mdash;
              the gap between wanting to and actually doing it.
            </p>

            <div className="mt-16">
              <figure className="group">
                <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-muted/20 aspect-[4/3]">
                  <img
                    src={threeGoalsImage.src}
                    alt="Three goals. Three names. Three reasons to not touch the money."
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                  Three goals. Three names. Three reasons to not touch the money.
                </figcaption>
              </figure>
            </div>
          </section>

          {/* ──── The Premise ──── */}
          <section id="premise" className={`${contentRail} py-32 md:py-48`}>
            <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">
              The premise
            </p>

            {/* Beat 1 — Context. Small. A stage direction before the line. */}
            <p className="mt-10 max-w-[34ch] text-sm leading-relaxed text-muted-foreground/60 md:mt-14">
              The Philippines has 70 million active mobile users
              and a deep, informal culture of saving.
            </p>

            {/* Beat 2 — The insight. Offset right. Steps forward. */}
            <p className="mt-16 text-[clamp(2rem,5vw,3.5rem)] leading-[1.08] font-medium tracking-tight text-foreground md:mt-24 md:ml-[18%] md:max-w-[16ch]">
              People save.
              <br />
              <span className="text-muted-foreground/50">
                They just don&apos;t save&nbsp;in&nbsp;banks.
              </span>
            </p>

            {/* Beat 3 — Product + stats. Quiet landing. */}
            <div className="mt-16 grid gap-6 border-t border-border/15 pt-8 md:mt-28 md:grid-cols-[1.2fr_1fr] md:gap-20">
              <p className="max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
                GoalSave is a goal-based savings account inside the GoTyme Bank
                app. Name a goal. Set a target if you want. Let the system
                handle the rest.
              </p>
              <p className="max-w-[34ch] text-xs leading-relaxed text-muted-foreground/35">
                Up to 9% annual interest. &#8369;0 to open. Three ways to
                save&nbsp;&mdash; Auto-Save, Save the Change, or just deposit
                when it feels right.
              </p>
            </div>
          </section>

          <div className={dividerRail} />

          {/* ──── The Gap ──── */}
          <section id="gap" className={`${contentRail} py-28 md:py-40`}>
            <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">
              The gap
            </p>
            <h2 className="mt-4 max-w-[28ch] text-3xl font-medium tracking-tight md:text-4xl">
              People don&apos;t fail to save because they lack tools. They fail
              because saving requires a decision every single time.
            </h2>

            <div className="mx-auto mt-16 max-w-[48ch] space-y-10 md:mt-20 md:space-y-14">
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                Opening a savings account is easy.
                <br />
                Remembering to put money in it is hard.
              </p>

              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                Saving competes with everything else money is doing. Rent.
                Groceries. The unexpected expense. The thing that feels more
                urgent right now.
              </p>

              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                Every time someone opens a savings app intending to transfer
                something, life has usually already spent it.
              </p>

              <div className="space-y-4">
                <p className="text-base leading-relaxed text-foreground/70 md:text-lg">
                  This is not a literacy problem.
                  <br />
                  It is not a design problem.
                  <br />
                  It is a timing problem.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground/50">
                  And timing problems don&apos;t get solved with better
                  interfaces. They get solved by removing the need for timing
                  altogether.
                </p>
              </div>
            </div>

            <div className="mt-16 md:mt-20">
              <figure className="group">
                <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-muted/20 aspect-[4/3]">
                  <img
                    src={paluwaganImage.src}
                    alt="The paluwagan works not because it is convenient, but because you decided once."
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                  The paluwagan works not because it is convenient, but because you decided once.
                </figcaption>
              </figure>
            </div>
          </section>

          {/* ──── Interstitial ──── */}
          <section className={`${contentRail} py-32 md:py-48`}>
            <p className="mx-auto max-w-[30ch] text-center text-2xl leading-snug font-medium tracking-tight text-foreground/70 md:text-3xl">
              Every extra step is a reason to not save.
              <br />
              <span className="text-muted-foreground/40">
                So we removed the steps.
              </span>
            </p>
          </section>

          <div className={dividerRail} />

          {/* ──── Three Quiet Truths ──── */}
          <section id="truths" className={`${contentRail} py-28 md:py-40`}>
            <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">
              Three quiet truths
            </p>

            <div className="mx-auto mt-16 max-w-[50ch] md:mt-20">
              {/* Truth 1 */}
              <div>
                <h3 className="text-lg font-medium tracking-tight md:text-xl">
                  A goal without a name is easy to abandon.
                </h3>
                <div className="mt-5 space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    When savings live in a generic account, withdrawing feels
                    neutral. When the account is named &ldquo;School fees for
                    Mia,&rdquo; the same withdrawal feels like a small betrayal.
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground/60">
                    That is not a design trick. That is just how people work.
                  </p>
                </div>
              </div>

              {/* Truth 2 */}
              <div className="mt-20 md:mt-28">
                <h3 className="text-lg font-medium tracking-tight md:text-xl">
                  One decision is easier than fifty-two.
                </h3>
                <div className="mt-5 space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    The users most likely to reach their goals are not the most
                    disciplined. They are the ones who automated early and never
                    had to decide again.
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground/60">
                    Willpower is a terrible savings strategy. Systems are better.
                  </p>
                </div>
              </div>

              {/* Truth 3 */}
              <div className="mt-20 md:mt-28">
                <h3 className="text-lg font-medium tracking-tight md:text-xl">
                  Progress that says nothing fails silently.
                </h3>
                <div className="mt-5 space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    A progress bar at 60% tells you where you are. It does not
                    tell you if that is enough.
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground/60">
                    Users who fall behind don&apos;t always give up. They just
                    stop opening the app, because opening it started to feel
                    bad.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className={dividerRail} />

          {/* ──── How It Works ──── */}
          <section id="how" className={`${contentRail} py-28 md:py-40`}>
            <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">
              How it works
            </p>
            <h2 className="mt-4 max-w-[26ch] text-3xl font-medium tracking-tight md:text-4xl">
              The system has three layers. Each one saves differently. Together,
              they keep going even when you forget.
            </h2>

            {/* Feature 1 — Creating a Goal */}
            <div className="mt-20 grid items-start gap-10 md:mt-32 md:grid-cols-[1.2fr_1fr] md:gap-16">
              <div>
                <p className="font-mono text-[10px] text-muted-foreground/25">
                  01
                </p>
                <h3 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">
                  Creating a goal
                </h3>
                <div className="mt-6 space-y-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    The first screen doesn&apos;t ask how much. It asks what
                    for.
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Name it. Choose a photo. By the time you reach the numbers,
                    the goal already feels like yours.
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Target and deadline are optional. A goal can start as
                    nothing but a name. Structure comes later, once the idea is
                    real enough to commit to.
                  </p>
                </div>
                <div className="mt-5 border-l-2 border-foreground/10 pl-4">
                  <p className="text-xs leading-relaxed text-muted-foreground/45">
                    Asking for a number before someone has decided what they
                    want is asking the wrong question first.
                  </p>
                </div>
              </div>
              <figure className="group">
                <div className="relative overflow-hidden rounded-xl border border-border/40 bg-muted/20 aspect-[3/4]">
                  <img
                    src={goalNamingImage.src}
                    alt="The first step is giving it a name, not a number."
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                  The first step is giving it a name, not a number.
                </figcaption>
              </figure>
            </div>

            {/* Feature 2 — Auto-Save */}
            <div className="mt-24 md:mt-36">
              <figure className="group">
                <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-muted/20 aspect-[2.5/1]">
                  <img
                    src={autoSaveImage.src}
                    alt="Set it once. The money moves on its own."
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                  Set it once. The money moves on its own.
                </figcaption>
              </figure>
              <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-16">
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground/25">
                    02
                  </p>
                  <h3 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">
                    Auto-Save
                  </h3>
                </div>
                <div className="space-y-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Set it once. Daily, weekly, or monthly. The money moves on
                    its own.
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    If a target and deadline exist, Smart Save calculates the
                    exact amount needed and suggests it. You confirm or adjust.
                  </p>
                  <div className="border-l-2 border-foreground/10 pl-4">
                    <p className="text-xs leading-relaxed text-muted-foreground/45">
                      If the transfer fails&nbsp;&mdash; insufficient balance,
                      bad timing&nbsp;&mdash; the app doesn&apos;t ignore it.
                      It asks: &ldquo;Want to try again?&rdquo; That&apos;s the
                      entire response.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 — Save the Change */}
            <div className="mt-24 grid items-start gap-10 md:mt-36 md:grid-cols-[1fr_1.3fr] md:gap-16">
              <ImagePlaceholder
                label="[Insert: Save the Change explainer — ₱47 purchase rounds up to ₱50, ₱3 goes to GoalSave]"
                caption="Saving as a side effect of spending."
                aspectRatio="aspect-[3/4]"
                variant="screen"
              />
              <div>
                <p className="font-mono text-[10px] text-muted-foreground/25">
                  03
                </p>
                <h3 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">
                  Save the Change
                </h3>
                <div className="mt-6 space-y-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    A &#8369;47 coffee becomes &#8369;50. &#8369;3 goes to
                    savings. No action required after setup.
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Saving becomes a side effect of spending rather than a
                    separate act. Round-up amounts can be set to the nearest
                    &#8369;1, &#8369;5, &#8369;10, &#8369;25, or &#8369;50.
                    Smaller amounts feel effortless. Larger ones start to feel
                    like real progress.
                  </p>
                </div>
                <div className="mt-5 border-l-2 border-foreground/10 pl-4">
                  <p className="text-xs leading-relaxed text-muted-foreground/45">
                    Save the Change connects to one goal at a time. Redirecting
                    it requires a conscious choice. That one extra step keeps
                    awareness alive.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 — Progress States */}
            <div className="mt-24 md:mt-36">
              <div className="mx-auto max-w-[50ch]">
                <p className="font-mono text-[10px] text-muted-foreground/25">
                  04
                </p>
                <h3 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">
                  Twelve states of progress
                </h3>
                <div className="mt-6 space-y-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    GoalSave does not show a number and leave you to interpret
                    it. It tells you where you stand&nbsp;&mdash; and what to
                    do next.
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    On track? It affirms without over-celebrating. Close to
                    the finish line? It suggests a specific action to cross it.
                    Missed the deadline? It acknowledges what happened and
                    offers a way forward.
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground/60">
                    The tone mattered more than the UI. &ldquo;You&apos;re
                    behind&rdquo; feels accusatory. &ldquo;That&apos;s
                    OK&rdquo; feels hollow. Finding the line between honest and
                    encouraging took more iteration than anything visual.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-3">
                <figure className="group">
                  <div className="relative h-fit overflow-hidden rounded-xl border border-border/40 bg-muted/20">
                    <img
                      src={onTrackImage.src}
                      alt="On track. Affirms without over-celebrating."
                      className="h-auto w-full"
                    />
                  </div>
                  <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                    On track. Affirms without over-celebrating.
                  </figcaption>
                </figure>
                <figure className="group">
                  <div className="relative h-fit overflow-hidden rounded-xl border border-border/40 bg-muted/20">
                    <img
                      src={nearlyThereImage.src}
                      alt="Nearly there. A specific action, not generic encouragement."
                      className="h-auto w-full"
                    />
                  </div>
                  <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                    Nearly there. A specific action, not generic encouragement.
                  </figcaption>
                </figure>
                <figure className="group">
                  <div className="relative h-fit overflow-hidden rounded-xl border border-border/40 bg-muted/20">
                    <img
                      src={missedDateImage.src}
                      alt="Missed the date. Honest without shame."
                      className="h-auto w-full"
                    />
                  </div>
                  <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
                    Missed the date. Honest without shame.
                  </figcaption>
                </figure>
              </div>
            </div>
          </section>

          <div className={dividerRail} />

          {/* ──── What Changed ──── */}
          <section id="changed" className={`${contentRail} py-28 md:py-40`}>
            <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">
              What changed
            </p>

            <div className="mx-auto mt-12 max-w-[48ch] space-y-8 md:mt-16">
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                The most significant shift was not in the feature set. It was in
                the mental model.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                Previous savings products asked people to manage money. GoalSave
                asked them to name something they wanted and then stepped out of
                the way.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground/60">
                There is a real difference between those two things.
              </p>
            </div>

            <div className="mx-auto mt-14 max-w-[48ch] border-t border-border/20 pt-8">
              <p className="text-sm leading-relaxed text-muted-foreground/60">
                In a market where distrust of formal banking runs alongside a
                genuine desire to save, GoalSave was not asking users to trust a
                bank. It was giving them a tool to exercise the discipline they
                already had.
              </p>
            </div>
          </section>

          <div className={dividerRail} />

          {/* ──── What I Carried Forward ──── */}
          <section id="carried" className={`${contentRail} py-28 md:py-40`}>
            <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">
              What I carried forward
            </p>
            <h2 className="mt-4 max-w-[26ch] text-3xl font-medium tracking-tight md:text-4xl">
              Designing for behavior is different from designing for function.
            </h2>

            <div className="mx-auto mt-16 max-w-[50ch] md:mt-20">
              <div>
                <h3 className="text-sm font-medium text-foreground/80">
                  On progress states
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  The most time-consuming part of the design, and the most
                  underestimated by everyone outside the team. A progress bar at
                  42% means nothing without context. Is 42% good? Bad? Normal
                  for this point in time? Investing in those twelve states meant
                  the dashboard always had something useful to tell the user,
                  not just something to display.
                </p>
              </div>

              <div className="mt-14">
                <h3 className="text-sm font-medium text-foreground/80">
                  On the paluwagan
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  The deeper I looked at why informal savings groups work in the
                  Philippines, the more it changed how I thought about product
                  defaults. The paluwagan works because the commitment is
                  structural, not motivational. You don&apos;t rely on feeling
                  like saving. The system relies on you.
                </p>
              </div>

              <div className="mt-14">
                <h3 className="text-sm font-medium text-foreground/80">
                  On tone
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Writing the off-track states was harder than designing them.
                  The language had to acknowledge reality without shame. Finding
                  that line took more iteration than anything visual. That
                  surprised me.
                </p>
              </div>

              <div className="mt-14">
                <h3 className="text-sm font-medium text-foreground/80">
                  On what&apos;s next
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Social savings was not something we built. But shared
                  goals&nbsp;&mdash; two people saving toward the same target,
                  with visibility into each other&apos;s
                  progress&nbsp;&mdash; that&apos;s the paluwagan&apos;s most
                  powerful mechanic. I haven&apos;t seen it done well in any
                  digital savings product.
                </p>
              </div>
            </div>
          </section>

          <div className={dividerRail} />

          {/* ──── Closing ──── */}
          <section className={`${contentRail} py-24 md:py-40`}>
            <p className="max-w-[48ch] text-base leading-relaxed text-muted-foreground md:text-lg">
              Most people who wanted to save already knew how. GoalSave just
              made it harder to stop.
            </p>
          </section>

      <CaseStudyFooter currentProject="gotyme-savings" />
        </div>
      </div>
    </main>
  )
}
