"use client"

import * as React from "react"

/* ─────────────────────────────────────────────────────
   RotatingHeadline — Typewriter effect.

   Choreography:
   HOLD 2.8s → DELETE backward (35ms/char) → PAUSE 350ms
   → TYPE forward (55ms/char) → HOLD

   Line 2 staggers 100ms behind line 1 in both directions,
   creating a cascading "live edit" rhythm.

   Cursor: thin bar on line 2. Blinks at rest, solid
   while typing/deleting. The punctuation that breathes.
   ───────────────────────────────────────────────────── */

const PHRASES: [string, string][] = [
  ["complexity", "clarity"],
  ["friction", "flow"],
  ["noise", "signal"],
  ["chaos", "systems"],
]

// Timing (ms)
const HOLD = 2800
const DEL = 35
const TYPE = 55
const PAUSE = 350
const STAGGER = 100

type Phase = "hold" | "del" | "pause" | "type"

export function RotatingHeadline({ className }: { className?: string }) {
  const [idx, setIdx] = React.useState(0)
  const [phase, setPhase] = React.useState<Phase>("hold")
  const [c1, setC1] = React.useState(PHRASES[0]![0].length)
  const [c2, setC2] = React.useState(PHRASES[0]![1].length)
  const nextRef = React.useRef(1)
  const [word1, setWord1] = React.useState(PHRASES[0]![0])
  const [word2, setWord2] = React.useState(PHRASES[0]![1])
  const [reducedMotion, setReducedMotion] = React.useState(false)

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true)
    }
  }, [])

  // HOLD → DEL
  React.useEffect(() => {
    if (reducedMotion || phase !== "hold") return
    const t = setTimeout(() => {
      nextRef.current = (idx + 1) % PHRASES.length
      setPhase("del")
    }, HOLD)
    return () => clearTimeout(t)
  }, [phase, idx, reducedMotion])

  // DEL — erase characters backward
  React.useEffect(() => {
    if (phase !== "del") return
    const w1 = PHRASES[idx]![0]
    const w2 = PHRASES[idx]![1]
    setWord1(w1)
    setWord2(w2)
    setC1(w1.length)
    setC2(w2.length)

    const timers: ReturnType<typeof setTimeout>[] = []

    for (let i = 1; i <= w1.length; i++)
      timers.push(setTimeout(() => setC1(w1.length - i), i * DEL))

    for (let i = 1; i <= w2.length; i++)
      timers.push(setTimeout(() => setC2(w2.length - i), STAGGER + i * DEL))

    const end = Math.max(w1.length * DEL, STAGGER + w2.length * DEL)
    timers.push(setTimeout(() => setPhase("pause"), end + 30))

    return () => timers.forEach(clearTimeout)
  }, [phase, idx])

  // PAUSE → TYPE
  React.useEffect(() => {
    if (phase !== "pause") return
    const t = setTimeout(() => {
      const ni = nextRef.current
      setWord1(PHRASES[ni]![0])
      setWord2(PHRASES[ni]![1])
      setC1(0)
      setC2(0)
      setPhase("type")
    }, PAUSE)
    return () => clearTimeout(t)
  }, [phase])

  // TYPE — reveal characters forward
  React.useEffect(() => {
    if (phase !== "type") return
    const ni = nextRef.current
    const w1 = PHRASES[ni]![0]
    const w2 = PHRASES[ni]![1]

    const timers: ReturnType<typeof setTimeout>[] = []

    for (let i = 1; i <= w1.length; i++)
      timers.push(setTimeout(() => setC1(i), i * TYPE))

    for (let i = 1; i <= w2.length; i++)
      timers.push(setTimeout(() => setC2(i), STAGGER + i * TYPE))

    const end = Math.max(w1.length * TYPE, STAGGER + w2.length * TYPE)
    timers.push(setTimeout(() => {
      setIdx(ni)
      setPhase("hold")
    }, end + 30))

    return () => timers.forEach(clearTimeout)
  }, [phase])

  if (reducedMotion) {
    return (
      <span className={className}>
        <span className="block">Turning {PHRASES[0]![0]}</span>
        <span className="block">into {PHRASES[0]![1]}.</span>
      </span>
    )
  }

  const isMoving = phase === "del" || phase === "type"

  return (
    <span className={className}>
      <span className="block">
        Turning {word1.slice(0, c1)}
      </span>
      <span className="block">
        into {word2.slice(0, c2)}
        {c2 > 0 ? "." : ""}
        <span
          className="animate-cursor inline-block align-middle bg-foreground"
          style={{
            width: "0.06em",
            height: "0.72em",
            marginLeft: "0.04em",
            animationPlayState: isMoving ? "paused" : "running",
            opacity: isMoving ? 1 : undefined,
          }}
          aria-hidden="true"
        />
      </span>
    </span>
  )
}
