import StarHero from '@/framer/star-hero'
import AvailableStatusAnimated from '@/framer/available-status-animated'
import HeroCardBottom from '@/framer/hero-card-bottom'
import LineAnimation from '@/framer/line-animation'

export default function HeroSection() {
  return (
    <section className="contents">
      <StarHero.Responsive />
      <AvailableStatusAnimated.Responsive />
      <HeroCardBottom.Responsive
        g6sUgTSXf={false}
        oqZxZyQk3={false}
        pKfZ5d16K={true}
        rDvuQE1Cm={false}
      />
      <LineAnimation.Responsive />
    </section>
  )
}
