"use client"

import * as React from "react"
import { useLenis } from "lenis/react"
import { cn } from "@workspace/ui/lib/utils"

/* ─────────────────────────────────────────────────────
   ScrollFloat — Parallax speed differential.

   Driven by Lenis's lerped scroll position instead of
   raw browser scroll events. No CSS transition hack
   needed — Lenis already provides smooth interpolation.
   ───────────────────────────────────────────────────── */

interface ScrollFloatProps {
  children: React.ReactNode
  className?: string
  speed?: number
  fade?: number
}

export function ScrollFloat({
  children,
  className,
  speed = 0.1,
  fade = 0,
}: ScrollFloatProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = React.useState(false)

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true)
    }
  }, [])

  useLenis(() => {
    if (reducedMotion) return
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight

    // Skip work when element is off-screen
    if (rect.bottom < -100 || rect.top > vh + 100) return

    const centered = (rect.top + rect.height / 2) / vh - 0.5
    const y = -centered * speed * vh

    if (fade > 0) {
      const opacity = Math.max(0, 1 - Math.abs(centered) * fade * 2.5)
      el.style.transform = `translate3d(0,${y}px,0)`
      el.style.opacity = String(opacity)
    } else {
      el.style.transform = `translate3d(0,${y}px,0)`
    }
  }, [speed, fade, reducedMotion])

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
    >
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────
   SplitReveal — Word-by-word staggered entrance.
   ───────────────────────────────────────────────────── */

interface SplitRevealProps {
  text: string
  className?: string
  stagger?: number
  delay?: number
  threshold?: number
}

export function SplitReveal({
  text,
  className,
  stagger = 70,
  delay = 0,
  threshold = 0.15,
}: SplitRevealProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = React.useState(false)
  const [reducedMotion, setReducedMotion] = React.useState(false)

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true)
      setIsVisible(true)
    }
  }, [])

  React.useEffect(() => {
    if (reducedMotion) return

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, reducedMotion])

  const lines = text.split("\n")
  let wordIndex = 0

  return (
    <span ref={ref} className={cn("inline", className)}>
      {lines.map((line, lineIdx) => (
        <React.Fragment key={lineIdx}>
          {lineIdx > 0 && <br />}
          {line
            .split(/\s+/)
            .filter(Boolean)
            .map((word) => {
              const i = wordIndex++
              return (
                <span
                  key={`${lineIdx}-${i}`}
                  className="inline-block"
                  style={
                    reducedMotion
                      ? undefined
                      : {
                          transition: `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
                          transitionDelay: `${delay + i * stagger}ms`,
                          opacity: isVisible ? 1 : 0,
                          transform: isVisible
                            ? "translateY(0)"
                            : "translateY(16px)",
                        }
                  }
                >
                  {word}
                  {"\u00A0"}
                </span>
              )
            })}
        </React.Fragment>
      ))}
    </span>
  )
}
