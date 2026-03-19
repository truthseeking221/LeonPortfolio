import { useEffect, useRef, useState } from 'react'

type ProjectSlide = {
  title: string
  image: string
}

type StickyProjectShowcaseProps = {
  slides: ProjectSlide[]
}

function ArrowUpRightIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.25 12.75 12.75 5.25M7.5 5.25h5.25V10.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export default function StickyProjectShowcase({ slides }: StickyProjectShowcaseProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [position, setPosition] = useState(0)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateReducedMotion = () => setIsReducedMotion(mediaQuery.matches)

    updateReducedMotion()
    mediaQuery.addEventListener('change', updateReducedMotion)

    return () => mediaQuery.removeEventListener('change', updateReducedMotion)
  }, [])

  useEffect(() => {
    const node = ref.current
    const section = node?.closest('.hero-section')

    if (!node || !section || isReducedMotion) {
      return
    }

    let frameId = 0

    const update = () => {
      frameId = 0

      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const travel = Math.max(rect.height - viewportHeight * 0.45, 1)
      const rawProgress = clamp((viewportHeight * 0.12 - rect.top) / travel, 0, 1)
      const nextPosition = rawProgress * Math.max(slides.length - 1, 0)

      setPosition((current) =>
        Math.abs(current - nextPosition) < 0.001 ? current : nextPosition,
      )
    }

    const requestUpdate = () => {
      if (frameId) {
        return
      }

      frameId = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }

      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [isReducedMotion, slides.length])

  const activeIndex = isReducedMotion ? 0 : Math.round(position)

  return (
    <article ref={ref} className="hero-card hero-card--grain hero-card--project hero-card--sticky-showcase">
      <div className="hero-card__project-copy hero-card__project-copy--stack">
        {slides.map((slide, index) => {
          const offset = isReducedMotion ? index : index - position
          const distance = Math.abs(offset)
          const opacity = isReducedMotion ? (index === 0 ? 1 : 0) : clamp(1 - distance * 1.15, 0, 1)
          const translateY = isReducedMotion ? 0 : clamp(offset * 56, -56, 56)

          return (
            <div
              aria-hidden={index !== activeIndex}
              className={`hero-project-slide ${index === activeIndex ? 'is-active' : ''}`.trim()}
              key={`${slide.title}-${index}`}
              style={{
                opacity,
                transform: `translate3d(0, ${translateY}px, 0)`,
              }}
            >
              <h3 className="display-medium">{slide.title}</h3>
              <a className="inline-link" href="#case-study" tabIndex={index === activeIndex ? 0 : -1}>
                SEE PROJECT
                <ArrowUpRightIcon />
              </a>
            </div>
          )
        })}
      </div>

      <div className="hero-card__project-thumb hero-card__project-thumb--stack">
        {slides.map((slide, index) => {
          const offset = isReducedMotion ? index : index - position
          const distance = Math.abs(offset)
          const opacity = isReducedMotion ? (index === 0 ? 1 : 0) : clamp(1 - distance * 1.05, 0, 1)
          const translateY = isReducedMotion ? 0 : clamp(offset * 72, -72, 72)

          return (
            <img
              alt={slide.title}
              aria-hidden={index !== activeIndex}
              className={`hero-project-image ${index === activeIndex ? 'is-active' : ''}`.trim()}
              key={`${slide.image}-${index}`}
              src={slide.image}
              style={{
                opacity,
                transform: `translate3d(0, ${translateY}px, 0)`,
              }}
            />
          )
        })}
      </div>

      <span className="hero-card__star hero-card__star--bottom-left">✦</span>
    </article>
  )
}
