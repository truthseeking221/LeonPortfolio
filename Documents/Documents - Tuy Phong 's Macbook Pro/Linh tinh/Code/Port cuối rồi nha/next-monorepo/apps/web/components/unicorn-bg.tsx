"use client"

import * as React from "react"

export function UnicornBg() {
  React.useEffect(() => {
    // Skip if already loaded
    if (
      typeof window !== "undefined" &&
      (window as unknown as Record<string, unknown>).UnicornStudio &&
      (window as unknown as Record<string, unknown> & { UnicornStudio: { isInitialized?: boolean; init?: () => void } }).UnicornStudio.isInitialized
    ) {
      return
    }

    const w = window as unknown as Record<string, unknown> & {
      UnicornStudio: { isInitialized?: boolean; init?: () => void }
    }

    if (!w.UnicornStudio) {
      w.UnicornStudio = { isInitialized: false }
    }

    function initUnicorn() {
      if (w.UnicornStudio?.init) {
        if (!w.UnicornStudio.isInitialized) {
          w.UnicornStudio.init()
          w.UnicornStudio.isInitialized = true
        }
      }
    }

    if (w.UnicornStudio?.init) {
      initUnicorn()
      return
    }

    if (!document.querySelector("script[data-unicorn-loader]")) {
      const s = document.createElement("script")
      s.src =
        "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.0-1/dist/unicornStudio.umd.js"
      s.setAttribute("data-unicorn-loader", "true")
      s.onload = () => initUnicorn()
      document.head.appendChild(s)
    }
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden">
      <div className="absolute inset-0 h-full w-full opacity-60 mix-blend-screen">
        <div
          data-us-project="WdVna2EGJHojbGLRHA52"
          data-us-dpi="1.5"
          data-us-fps="60"
          data-us-lazyload="true"
          data-us-production="true"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  )
}
