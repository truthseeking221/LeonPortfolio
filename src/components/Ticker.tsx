import { useEffect, useRef, useState } from 'react'

type TickerProps = {
  items: string[]
  speedPxPerSecond?: number
  hoverSpeedMultiplier?: number
}

function wrapOffset(offset: number, width: number) {
  if (width <= 0) {
    return 0
  }

  return ((offset % width) + width) % width
}

export default function Ticker({
  items,
  speedPxPerSecond = 84,
  hoverSpeedMultiplier = 0.25,
}: TickerProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const groupRef = useRef<HTMLDivElement | null>(null)
  const cloneGroupRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const offsetRef = useRef(0)
  const hoverRef = useRef(false)
  const loopDistanceRef = useRef(0)
  const frameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const [repeatCount, setRepeatCount] = useState(3)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateReducedMotion = () => setIsReducedMotion(mediaQuery.matches)

    updateReducedMotion()
    mediaQuery.addEventListener('change', updateReducedMotion)

    return () => mediaQuery.removeEventListener('change', updateReducedMotion)
  }, [])

  useEffect(() => {
    const viewportNode = viewportRef.current
    const groupNode = groupRef.current

    if (!viewportNode || !groupNode) {
      return
    }

    const measureRepeatCount = () => {
      const groupWidth = groupNode.offsetWidth
      const viewportWidth = viewportNode.offsetWidth

      if (groupWidth <= 0 || viewportWidth <= 0) {
        return
      }

      const nextRepeatCount = Math.max(3, Math.ceil(viewportWidth / groupWidth) + 2)

      setRepeatCount((current) => (current === nextRepeatCount ? current : nextRepeatCount))
    }

    measureRepeatCount()

    const resizeObserver = new ResizeObserver(measureRepeatCount)

    resizeObserver.observe(viewportNode)
    resizeObserver.observe(groupNode)

    return () => resizeObserver.disconnect()
  }, [items.length])

  useEffect(() => {
    if (isReducedMotion) {
      const trackNode = trackRef.current

      offsetRef.current = 0
      lastTimeRef.current = null

      if (trackNode) {
        trackNode.style.transform = 'translate3d(0, 0, 0)'
      }

      return
    }

    const groupNode = groupRef.current
    const cloneGroupNode = cloneGroupRef.current
    const trackNode = trackRef.current

    if (!groupNode || !cloneGroupNode || !trackNode) {
      return
    }

    const measureLoopDistance = () => {
      const nextDistance = cloneGroupNode.offsetLeft - groupNode.offsetLeft
      loopDistanceRef.current = nextDistance > 0 ? nextDistance : groupNode.scrollWidth
    }

    const tick = (time: number) => {
      if (lastTimeRef.current == null) {
        lastTimeRef.current = time
      }

      const elapsed = (time - lastTimeRef.current) / 1000
      lastTimeRef.current = time

      const targetSpeed = speedPxPerSecond * (hoverRef.current ? hoverSpeedMultiplier : 1)
      const nextOffset = wrapOffset(
        offsetRef.current + targetSpeed * elapsed,
        loopDistanceRef.current,
      )

      offsetRef.current = nextOffset
      trackNode.style.transform = `translate3d(${-nextOffset}px, 0, 0)`
      frameRef.current = window.requestAnimationFrame(tick)
    }

    measureLoopDistance()

    const resizeObserver = new ResizeObserver(() => {
      measureLoopDistance()
      offsetRef.current = wrapOffset(offsetRef.current, loopDistanceRef.current)
    })

    resizeObserver.observe(groupNode)
    resizeObserver.observe(cloneGroupNode)

    frameRef.current = window.requestAnimationFrame(tick)

    return () => {
      if (frameRef.current != null) {
        window.cancelAnimationFrame(frameRef.current)
      }

      resizeObserver.disconnect()
      frameRef.current = null
      lastTimeRef.current = null
    }
  }, [hoverSpeedMultiplier, isReducedMotion, speedPxPerSecond, items.length, repeatCount])

  const groups = Array.from({ length: repeatCount }, (_, index) => index)

  return (
    <div
      className={`ticker ${isReducedMotion ? 'is-reduced-motion' : ''}`.trim()}
      onMouseEnter={() => {
        hoverRef.current = true
      }}
      onMouseLeave={() => {
        hoverRef.current = false
      }}
    >
      <div className="ticker__viewport" ref={viewportRef}>
        <div className="ticker__track" ref={trackRef}>
          {groups.map((groupIndex) => (
            <div
              aria-hidden={groupIndex > 0}
              className="ticker__group"
              key={`ticker-group-${groupIndex}`}
              ref={
                groupIndex === 0
                  ? groupRef
                  : groupIndex === 1
                    ? cloneGroupRef
                    : undefined
              }
            >
              {items.map((item, index) => (
                <div className="logo-band__item" key={`${item}-${groupIndex}-${index}`}>
                  <span className="logo-band__mark" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
