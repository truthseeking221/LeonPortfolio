import { Fragment, useMemo, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'unframer'

type ScrollRevealTextProps = {
  text: string
  className?: string
  startOffset?: number
  endOffset?: number
  stiffness?: number
  damping?: number
  startOpacity?: number
  endOpacity?: number
}

type RevealWordProps = {
  word: string
  index: number
  totalWords: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  stiffness: number
  damping: number
  startOpacity: number
  endOpacity: number
}

function RevealWord({
  word,
  index,
  totalWords,
  progress,
  stiffness,
  damping,
  startOpacity,
  endOpacity,
}: RevealWordProps) {
  const starting = index / totalWords
  const ending = (index + 1) / totalWords
  const opacityTarget = useTransform(
    progress,
    [starting, ending],
    [startOpacity, endOpacity],
  )
  const opacity = useSpring(opacityTarget, {
    stiffness,
    damping,
  })

  return (
    <>
      <motion.span style={{ opacity, willChange: 'opacity' }}>{word}</motion.span>
      {index < totalWords - 1 ? ' ' : null}
    </>
  )
}

export default function ScrollRevealText({
  text,
  className,
  startOffset = 0.8,
  endOffset = 0.5,
  stiffness = 400,
  damping = 60,
  startOpacity = 0.05,
  endOpacity = 1,
}: ScrollRevealTextProps) {
  const ref = useRef<HTMLHeadingElement | null>(null)
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text])
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`start ${startOffset}`, `end ${endOffset}`],
  })

  return (
    <h2 ref={ref} className={className}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <RevealWord
            word={word}
            index={index}
            totalWords={words.length}
            progress={scrollYProgress}
            stiffness={stiffness}
            damping={damping}
            startOpacity={startOpacity}
            endOpacity={endOpacity}
          />
        </Fragment>
      ))}
    </h2>
  )
}
