"use client"

import * as React from "react"

export interface TOCItem {
  id: string
  label: string
}

/* ─────────────────────────────────────────────────────
   Table of Contents — Scroll-linked sidebar nav.

   Behaviors:
   1. Cascading entrance — items slide in from left, staggered.
   2. Continuous tracking — a fractional index (e.g. 5.4)
      interpolates the indicator position between items
      so it moves SMOOTHLY, not jumping between them.
   3. Proximity spotlight — items dim based on distance
      from the current position. A spotlight effect.
   4. Active state — slight right shift + heavier weight.
   5. Track + indicator — thin vertical line with a moving
      segment that follows the continuous scroll position.
   ───────────────────────────────────────────────────── */

export function TableOfContents({ items }: { items: TOCItem[] }) {
  const listRef = React.useRef<HTMLUListElement>(null)
  const itemsRef = React.useRef<(HTMLLIElement | null)[]>([])

  const [continuousIndex, setContinuousIndex] = React.useState(0)
  const [itemCenters, setItemCenters] = React.useState<number[]>([])

  // Two-phase entrance: mount triggers animation, entered clears transitions
  const [phase, setPhase] = React.useState<"hidden" | "entering" | "ready">(
    "hidden"
  )

  React.useEffect(() => {
    const t1 = setTimeout(() => setPhase("entering"), 250)
    const t2 = setTimeout(
      () => setPhase("ready"),
      250 + items.length * 30 + 700
    )
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [items.length])

  // Measure item Y centers relative to the <ul>
  React.useEffect(() => {
    if (phase === "hidden") return

    function measure() {
      setItemCenters(
        itemsRef.current.map((el) =>
          el ? el.offsetTop + el.offsetHeight / 2 : 0
        )
      )
    }

    // Delay first measurement until entrance settles
    const t = setTimeout(measure, 600)
    window.addEventListener("resize", measure, { passive: true })
    return () => {
      clearTimeout(t)
      window.removeEventListener("resize", measure)
    }
  }, [phase, items])

  // Scroll tracking — produces a fractional index (e.g. 7.35)
  React.useEffect(() => {
    const sectionEls = items
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (sectionEls.length === 0) return

    let ticking = false

    function update() {
      const trigger = window.scrollY + window.innerHeight * 0.25

      for (let i = sectionEls.length - 1; i >= 0; i--) {
        const el = sectionEls[i]!
        if (trigger >= el.offsetTop) {
          const frac = Math.max(
            0,
            Math.min(0.999, (trigger - el.offsetTop) / el.offsetHeight)
          )
          setContinuousIndex(i + frac)
          break
        }
      }
      ticking = false
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update)
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [items])

  // Interpolated indicator Y — smoothly between item centers
  const indicatorY = React.useMemo(() => {
    if (itemCenters.length < 2) return 0
    const floor = Math.floor(continuousIndex)
    const ceil = Math.min(floor + 1, itemCenters.length - 1)
    const frac = continuousIndex - floor
    const a = itemCenters[floor] ?? 0
    const b = itemCenters[ceil] ?? 0
    return a + (b - a) * frac
  }, [continuousIndex, itemCenters])

  const trackTop = (itemCenters[0] ?? 0) - 4
  const trackHeight =
    (itemCenters[itemCenters.length - 1] ?? 0) - (itemCenters[0] ?? 0) + 8
  const hasPositions = itemCenters.length > 0
  const show = phase !== "hidden" && hasPositions
  const activeIndex = Math.round(continuousIndex)

  return (
    <nav aria-label="Table of contents" className="fixed top-1/2 -translate-y-1/2">
      <div className="relative">
        {/* Track — vertical reference line */}
        <div
          className="absolute -left-5 w-px"
          style={{
            top: trackTop,
            height: trackHeight,
            backgroundColor: "currentColor",
            opacity: show ? 0.06 : 0,
            transition: "opacity 0.8s",
          }}
        />

        {/* Indicator — continuously interpolates between items.
            No CSS transition on `top` — it's scroll-driven, must be instant. */}
        <div
          className="absolute -left-5 w-px rounded-full"
          style={{
            height: 16,
            top: indicatorY - 8,
            backgroundColor: "currentColor",
            opacity: show ? 0.45 : 0,
            transition: "opacity 0.6s",
          }}
        />

        <ul ref={listRef} className="flex flex-col gap-2.5">
          {items.map(({ id, label }, i) => {
            const distance = Math.abs(i - continuousIndex)
            const isActive = i === activeIndex

            // Spotlight: close items glow, distant items recede
            const textOpacity = Math.max(
              0.1,
              Math.min(0.85, 1.05 - distance * 0.22)
            )

            // Entrance: staggered slide-in from left
            const visible = phase !== "hidden"
            const entranceDelay = `${i * 30}ms`

            return (
              <li
                key={id}
                ref={(el) => {
                  itemsRef.current[i] = el
                }}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-8px)",
                  transition:
                    phase === "ready"
                      ? "none"
                      : `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${entranceDelay}, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${entranceDelay}`,
                }}
              >
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    document
                      .getElementById(id)
                      ?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="block cursor-pointer font-mono text-[10px] tracking-wider text-foreground uppercase"
                  style={{
                    opacity: textOpacity,
                    fontWeight: isActive ? 600 : 400,
                    transform: `translateX(${isActive ? 3 : 0}px)`,
                    transition:
                      "opacity 0.15s, transform 0.4s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
