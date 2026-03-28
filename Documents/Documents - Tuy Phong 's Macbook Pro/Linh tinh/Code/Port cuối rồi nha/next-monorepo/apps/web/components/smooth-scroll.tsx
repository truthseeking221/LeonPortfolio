"use client"

import { useEffect, useRef } from "react"
import { ReactLenis, useLenis } from "lenis/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

function LenisGsapBridge() {
  const lenisRef = useRef<ReturnType<typeof useLenis> | null>(null)

  // Get the lenis instance
  const lenis = useLenis()
  lenisRef.current = lenis

  useEffect(() => {
    if (!lenis) return

    // 1. Feed Lenis scroll events into ScrollTrigger
    const onScroll = () => {
      ScrollTrigger.update()
    }
    lenis.on("scroll", onScroll)

    // 2. Drive Lenis from GSAP's ticker so they share the same frame loop
    const tickHandler = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickHandler)

    // 3. Prevent GSAP ticker lag-smoothing from conflicting
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off("scroll", onScroll)
      gsap.ticker.remove(tickHandler)
    }
  }, [lenis])

  return null
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        autoRaf: false,  // We drive Lenis from GSAP's ticker instead
        anchors: true,
      }}
    >
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  )
}
