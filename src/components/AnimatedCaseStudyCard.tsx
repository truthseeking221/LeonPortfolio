import { useEffect, useRef, useState } from 'react'
import { motion } from 'unframer'

type AnimatedCaseStudyCardProps = {
  year: string
  type: string
  title: string
  image: string
  accent: 'blue' | 'orange'
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

export default function AnimatedCaseStudyCard({
  year,
  type,
  title,
  image,
  accent,
}: AnimatedCaseStudyCardProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const node = ref.current

    if (!node) {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (mediaQuery.matches) {
      setPrefersReducedMotion(true)
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (entry?.isIntersecting && entry.intersectionRatio >= 0.5) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: [0.5],
      },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <motion.article
      ref={ref}
      className={`case-study-card case-study-card--${accent} ${isVisible ? 'is-visible' : ''}`.trim()}
      initial={false}
      animate={
        prefersReducedMotion || isVisible
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 40 }
      }
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 34,
        mass: 1.05,
      }}
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="case-study-card__copy">
        <div className="case-study-card__meta">
          <span>{year}</span>
          <span>{type}</span>
        </div>
        <h2 className="display-heading-2 display-heading-2--wide">{title}</h2>
        <a className="inline-link inline-link--light" href="#contact">
          SEE PROJECT
          <ArrowUpRightIcon />
        </a>
      </div>

      <div className="case-study-card__image-wrap">
        <img src={image} alt={title} />
      </div>
    </motion.article>
  )
}
