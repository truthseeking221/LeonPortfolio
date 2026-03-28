"use client"

import { useState, useRef, useEffect, useCallback } from "react"

const FEATURES = [
  "AI strategy",
  "NDLP token",
  "Deposit flow",
  "Fee transparency",
  "P&L breakdown",
  "Strategy docs",
  "Audit signals",
] as const

const PERSONAS = [
  { short: "Passive", full: "Passive Yield Seeker" },
  { short: "Beginner", full: "LP-Confused Beginner" },
  { short: "Power", full: "Skeptical Power User" },
  { short: "Stable", full: "Stablecoin Safety Optimizer" },
  { short: "Sui", full: "Sui-Native DeFi User" },
] as const

const MATRIX: number[][] = [
  [2, 1, 1, 1, 2], // AI strategy
  [1, 1, 3, 2, 3], // NDLP token
  [2, 1, 2, 2, 3], // Deposit flow
  [2, 1, 3, 3, 3], // Fee transparency
  [2, 1, 3, 3, 3], // P&L breakdown
  [1, 1, 3, 2, 3], // Strategy docs
  [2, 1, 3, 3, 3], // Audit signals
]

const TRUST_LEVELS = {
  1: { label: "Low trust", color: "oklch(0.62 0.22 20)", opacity: 0.75, bg: "oklch(0.62 0.22 20 / 0.12)" },
  2: { label: "Medium", color: "oklch(0.78 0.18 80)", opacity: 0.8, bg: "oklch(0.78 0.18 80 / 0.12)" },
  3: { label: "High trust", color: "oklch(0.7 0.2 155)", opacity: 0.85, bg: "oklch(0.7 0.2 155 / 0.12)" },
} as const

export function FeatureReactionMatrix() {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null)
  const [activeFilter, setActiveFilter] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  // Intersection observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const handleCellMouseMove = useCallback((e: React.MouseEvent, row: number, col: number) => {
    if (!tableRef.current) return
    const rect = tableRef.current.getBoundingClientRect()
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setHoveredCell({ row, col })
  }, [])

  const handleCellMouseLeave = useCallback(() => {
    setHoveredCell(null)
    setTooltipPos(null)
  }, [])

  const handleFilterClick = useCallback((level: number) => {
    setActiveFilter((prev) => (prev === level ? null : level))
  }, [])

  const getCellState = (row: number, col: number, value: number) => {
    const isHoveredRow = hoveredCell?.row === row
    const isHoveredCol = hoveredCell?.col === col
    const isExactCell = isHoveredRow && isHoveredCol
    const isOnAxis = isHoveredRow || isHoveredCol
    const isFiltered = activeFilter !== null && value !== activeFilter
    const isFilterMatch = activeFilter !== null && value === activeFilter

    if (isExactCell) return { scale: 1.12, opacity: 1, brightness: 1.15 }
    if (isOnAxis) return { scale: 1.02, opacity: 0.9, brightness: 1.05 }
    if (isFilterMatch) return { scale: 1.05, opacity: 1, brightness: 1.1 }
    if (hoveredCell || isFiltered) return { scale: 0.95, opacity: 0.2, brightness: 0.85 }
    return { scale: 1, opacity: 0.9, brightness: 1 }
  }

  const getHeaderState = (type: "row" | "col", index: number) => {
    if (!hoveredCell && activeFilter === null) return { opacity: 0.5, weight: 400 }
    const isActive = type === "row" ? hoveredCell?.row === index : hoveredCell?.col === index
    if (isActive) return { opacity: 0.9, weight: 600 }
    if (hoveredCell) return { opacity: 0.25, weight: 400 }
    return { opacity: 0.5, weight: 400 }
  }

  const tooltipData = hoveredCell
    ? {
        feature: FEATURES[hoveredCell.row]!,
        persona: PERSONAS[hoveredCell.col]!,
        trust: TRUST_LEVELS[MATRIX[hoveredCell.row]![hoveredCell.col]! as 1 | 2 | 3],
      }
    : null

  return (
    <div ref={containerRef} className="mt-20">
      <h3 className="text-sm font-medium text-foreground/80">Feature Reaction Matrix</h3>
      <p className="mt-2 max-w-[55ch] text-xs text-muted-foreground/50">
        Trust levels across persona segments and core product surfaces.
      </p>

      <div ref={tableRef} className="relative mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] text-[11px]" role="grid">
          <thead>
            <tr className="border-b border-border/20">
              <th className="pb-3 pr-4 text-left font-medium text-muted-foreground/50">Feature</th>
              {PERSONAS.map((persona, colIdx) => {
                const state = getHeaderState("col", colIdx)
                return (
                  <th
                    key={persona.short}
                    className="cursor-default px-2 pb-3 text-center font-medium transition-all duration-[180ms] ease-out"
                    style={{ opacity: state.opacity, fontWeight: state.weight }}
                  >
                    <span className="relative">
                      {persona.short}
                      {/* Active column indicator */}
                      <span
                        className="absolute -bottom-3 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full transition-all duration-[180ms] ease-out"
                        style={{
                          backgroundColor: "currentColor",
                          opacity: hoveredCell?.col === colIdx ? 0.5 : 0,
                          transform: `translateX(-50%) scaleX(${hoveredCell?.col === colIdx ? 1 : 0})`,
                        }}
                      />
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((feature, rowIdx) => {
              const rowHeaderState = getHeaderState("row", rowIdx)
              return (
                <tr
                  key={feature}
                  className="group border-b border-border/10 transition-colors duration-[180ms]"
                  style={{
                    backgroundColor:
                      hoveredCell?.row === rowIdx ? "oklch(0.5 0 0 / 0.03)" : "transparent",
                  }}
                >
                  <td
                    className="py-3.5 pr-4 transition-all duration-[180ms] ease-out"
                    style={{ opacity: rowHeaderState.opacity, fontWeight: rowHeaderState.weight }}
                  >
                    <span className="relative">
                      {feature}
                      {/* Active row indicator */}
                      <span
                        className="absolute top-1/2 -left-3 h-3.5 w-[2px] -translate-y-1/2 rounded-full transition-all duration-[180ms] ease-out"
                        style={{
                          backgroundColor: "currentColor",
                          opacity: hoveredCell?.row === rowIdx ? 0.4 : 0,
                          transform: `translateY(-50%) scaleY(${hoveredCell?.row === rowIdx ? 1 : 0})`,
                        }}
                      />
                    </span>
                  </td>
                  {MATRIX[rowIdx]!.map((value, colIdx) => {
                    const trust = TRUST_LEVELS[value as 1 | 2 | 3]
                    const cellState = getCellState(rowIdx, colIdx, value)
                    const entranceDelay = rowIdx * 60 + colIdx * 40

                    return (
                      <td key={colIdx} className="px-2 py-3.5">
                        <div
                          className="relative mx-auto h-[22px] w-full max-w-[56px] cursor-default rounded-[5px] transition-all duration-[180ms] ease-out"
                          style={{
                            backgroundColor: trust.color,
                            opacity: isVisible ? cellState.opacity * trust.opacity : 0,
                            transform: `scale(${isVisible ? cellState.scale : 0.6})`,
                            filter: `brightness(${cellState.brightness})`,
                            transitionDelay: isVisible && !hoveredCell ? `${entranceDelay}ms` : "0ms",
                            boxShadow:
                              hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx
                                ? `0 2px 16px ${trust.color.replace(")", " / 0.45)")}, 0 0 0 1px ${trust.color.replace(")", " / 0.2)")}`
                                : "none",
                          }}
                          onMouseMove={(e) => handleCellMouseMove(e, rowIdx, colIdx)}
                          onMouseLeave={handleCellMouseLeave}
                          role="gridcell"
                          aria-label={`${feature} × ${PERSONAS[colIdx]!.short}: ${trust.label}`}
                        />
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Floating tooltip */}
        {tooltipData && tooltipPos && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-border/20 bg-background/95 px-3 py-2.5 shadow-xl backdrop-blur-sm transition-opacity duration-[120ms] ease-out"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y - 72,
              transform: "translateX(-50%)",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: tooltipData.trust.color, opacity: tooltipData.trust.opacity }}
              />
              <span className="text-[11px] font-medium text-foreground/80">
                {tooltipData.trust.label}
              </span>
            </div>
            <div className="mt-1 text-[10px] text-muted-foreground/50">
              {tooltipData.feature} &times; {tooltipData.persona.full}
            </div>
          </div>
        )}
      </div>

      {/* Interactive legend */}
      <div className="mt-5 flex items-center gap-1">
        {([1, 2, 3] as const).map((level) => {
          const trust = TRUST_LEVELS[level]
          const isActive = activeFilter === level
          return (
            <button
              key={level}
              onClick={() => handleFilterClick(level)}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] transition-all duration-[180ms] ease-out"
              style={{
                backgroundColor: isActive ? trust.bg : "transparent",
                color: isActive ? trust.color : undefined,
                opacity: activeFilter !== null && !isActive ? 0.3 : 0.6,
              }}
            >
              <div
                className="h-2.5 w-5 rounded-[3px] transition-transform duration-[180ms] ease-out"
                style={{
                  backgroundColor: trust.color,
                  opacity: trust.opacity,
                  transform: isActive ? "scale(1.15)" : "scale(1)",
                }}
              />
              <span className="text-muted-foreground/50" style={{ color: isActive ? trust.color : undefined }}>
                {trust.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
