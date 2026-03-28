"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="pointer-events-auto ml-3 h-10 w-10 shrink-0" />

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="pointer-events-auto ml-3 group relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/[0.03] backdrop-blur-md transition-all duration-500 hover:border-white/40 hover:bg-white/[0.08] hover:shadow-lg focus:outline-none"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Dynamic Hover Glow */}
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" 
      />
      
      {/* Orb background that scales in dark mode */}
      <div 
        className={`absolute inset-0 z-10 rounded-full transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isDark ? "scale-100 bg-white/10" : "scale-0 bg-transparent"
        }`}
      />
      
      <div className="relative z-20 flex h-full w-full items-center justify-center overflow-hidden">
        {/* Sun Icon */}
        <Sun 
          strokeWidth={1.5}
          className={`absolute h-4 w-4 text-white transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] ${
            isDark 
              ? "-translate-y-8 rotate-90 scale-50 opacity-0" 
              : "translate-y-0 rotate-0 scale-100 opacity-100"
          }`} 
        />
        {/* Moon Icon */}
        <Moon 
          strokeWidth={1.5}
          className={`absolute h-4 w-4 text-white transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] ${
            isDark 
              ? "translate-y-0 rotate-0 scale-100 opacity-100" 
              : "translate-y-8 -rotate-90 scale-50 opacity-0"
          }`} 
        />
      </div>
    </button>
  )
}
