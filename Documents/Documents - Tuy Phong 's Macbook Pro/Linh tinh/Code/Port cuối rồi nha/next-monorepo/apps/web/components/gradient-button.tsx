"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

interface GradientButtonProps {
  href: string
  children: React.ReactNode
  className?: string
  download?: boolean
}

export function GradientButton({
  href,
  children,
  className,
  download,
}: GradientButtonProps) {
  const borderRef = React.useRef<HTMLDivElement>(null)
  const intervalRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  function startLoop() {
    const el = borderRef.current
    if (!el) return
    el.style.transition = "transform 0.75s linear"
    let dir = 0

    function tick() {
      if (!borderRef.current) return
      dir = dir === 0 ? -25 : 0
      borderRef.current.style.transform = `translateX(${dir}%)`
      intervalRef.current = setTimeout(tick, 750)
    }
    tick()
  }

  function stopLoop() {
    if (intervalRef.current) clearTimeout(intervalRef.current)
    const el = borderRef.current
    if (!el) return
    el.style.transition = "transform 0.25s ease-out"
    el.style.transform = "translateX(-5%)"
  }

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current)
    }
  }, [])

  return (
    <a
      href={href}
      download={download || undefined}
      className={cn(
        "relative isolate inline-flex items-center overflow-hidden rounded-[10px] bg-transparent p-[3px]",
        className
      )}
      onMouseEnter={startLoop}
      onMouseLeave={stopLoop}
    >
      {/* Animated gradient border */}
      <div
        ref={borderRef}
        aria-hidden="true"
        className="absolute top-0 left-0 z-0 h-full w-[400%]"
        style={{
          background:
            "linear-gradient(115deg, #4fcf70, #fad648, #a767e5, #12bcfe, #44ce7b) 0% 0% / 25% 100%",
          transform: "translateX(-5%)",
          transition: "transform 0.25s ease-out",
        }}
      />
      {/* Inner label */}
      <span className="relative z-10 block rounded-[8px] bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors">
        {children}
      </span>
    </a>
  )
}
