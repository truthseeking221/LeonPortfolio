import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

type AnimatedHeadingProps = {
  text: string
  className?: string
  delayMs?: number
  staggerMs?: number
  durationMs?: number
}

export default function AnimatedHeading({
  text,
  className,
  delayMs = 0,
  staggerMs = 28,
  durationMs = 720,
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const words = useMemo(() => text.trim().split(/\s+/), [text])

  useEffect(() => {
    const node = ref.current

    if (!node) {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px',
      },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  let charIndex = 0

  return (
    <h2
      ref={ref}
      className={`animated-heading ${isVisible ? 'is-visible' : ''} ${className ?? ''}`.trim()}
      aria-label={text}
      style={
        {
          '--animated-heading-delay': `${delayMs}ms`,
          '--animated-heading-stagger': `${staggerMs}ms`,
          '--animated-heading-duration': `${durationMs}ms`,
        } as CSSProperties
      }
    >
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <span className="animated-heading__word" key={`${word}-${wordIndex}`}>
            {[...word].map((char) => {
              const currentIndex = charIndex
              charIndex += 1

              return (
                <span
                  className="animated-heading__char"
                  key={`${char}-${currentIndex}`}
                  style={{ '--char-index': currentIndex } as CSSProperties}
                >
                  {char}
                </span>
              )
            })}
            {wordIndex < words.length - 1 ? (
              <span className="animated-heading__space">{' '}</span>
            ) : null}
          </span>
        ))}
      </span>
    </h2>
  )
}
