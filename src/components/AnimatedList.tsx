import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'

type AnimatedListProps = {
  className?: string
  children: ReactNode
  delayMs?: number
  durationMs?: number
  staggerMs?: number
  offsetPx?: number
}

export default function AnimatedList({
  className,
  children,
  delayMs = 0,
  durationMs = 420,
  staggerMs = 100,
  offsetPx = 16,
}: AnimatedListProps) {
  const ref = useRef<HTMLUListElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

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
      },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  const animatedChildren = Children.map(children, (child, index) => {
    if (!isValidElement(child)) {
      return child
    }

    const existingStyle = (child.props as { style?: CSSProperties }).style

    return cloneElement(child as ReactElement<{ style?: CSSProperties }>, {
      style: {
        ...existingStyle,
        '--animated-list-item-index': index,
      } as CSSProperties,
    })
  })

  return (
    <ul
      ref={ref}
      className={`animated-list ${isVisible ? 'is-visible' : ''} ${className ?? ''}`.trim()}
      style={
        {
          '--animated-list-delay': `${delayMs}ms`,
          '--animated-list-duration': `${durationMs}ms`,
          '--animated-list-stagger': `${staggerMs}ms`,
          '--animated-list-offset': `${offsetPx}px`,
        } as CSSProperties
      }
    >
      {animatedChildren}
    </ul>
  )
}
