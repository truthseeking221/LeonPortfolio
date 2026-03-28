"use client"

import { useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface FigmaEmbedProps {
  src: string
  title?: string
  className?: string
}

export function FigmaEmbed({ src, title = "Figma Prototype", className }: FigmaEmbedProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={cn("mx-auto w-full max-w-[1340px] px-6 md:px-10 lg:px-14", className)}>
      <div className="relative overflow-hidden rounded-2xl border border-border/30 bg-foreground/[0.02]">
        {/* Device chrome header */}
        <div className="flex items-center gap-2 border-b border-border/20 bg-muted/10 px-5 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-foreground/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-foreground/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-foreground/10" />
          </div>
          <div className="ml-4 flex-1">
            <div className="mx-auto max-w-[280px] rounded-md bg-foreground/[0.04] px-3 py-1">
              <p className="truncate text-center font-mono text-[10px] text-muted-foreground/40">
                {title}
              </p>
            </div>
          </div>
          <div className="w-[52px]" />
        </div>

        {/* Embed container */}
        <div className="relative aspect-[9/16] w-full max-h-[85vh] md:aspect-[4/3]">
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/10 border-t-foreground/40" />
              <p className="font-mono text-[11px] text-muted-foreground/30">Loading prototype...</p>
            </div>
          )}
          <iframe
            src={src}
            title={title}
            className={cn(
              "h-full w-full border-0 transition-opacity duration-700",
              loaded ? "opacity-100" : "opacity-0"
            )}
            allowFullScreen
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        </div>
      </div>

      <p className="mt-4 text-center font-mono text-[11px] text-muted-foreground/30">
        Click through the prototype to experience the full matchmaking flow
      </p>
    </div>
  )
}
