import { cn } from "@workspace/ui/lib/utils"

interface ImagePlaceholderProps {
  label?: string
  caption?: string
  aspectRatio?: string
  className?: string
  variant?: "default" | "hero" | "screen" | "artifact"
}

export function ImagePlaceholder({
  label = "[Insert image]",
  caption,
  aspectRatio = "aspect-[16/9]",
  className,
  variant = "default",
}: ImagePlaceholderProps) {
  return (
    <figure className={cn("group", className)}>
      <div
        className={cn(
          "relative overflow-hidden border border-border/40 bg-muted/20",
          variant === "hero" && "rounded-2xl",
          variant === "screen" && "rounded-xl",
          variant === "artifact" && "rounded-lg",
          variant === "default" && "rounded-xl",
          aspectRatio
        )}
      >
        <div
          className="absolute inset-0 h-full w-full opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute right-0 bottom-0 flex items-center justify-center px-8">
          <span className="max-w-[36ch] text-center font-mono text-[11px] leading-relaxed text-muted-foreground/25">
            {label}
          </span>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground/35">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
