import SectionTag from '@/framer/section-tag'
import AboutImageReveal from '@/framer/about-image-reveal'
import TextReveal from '@/framer/text-reveal'
import TextReveal1 from '@/framer/text-reveal-1'
import AchievementCardsAnimated from '@/framer/achievement-cards-animated'
import AchievementCard from '@/framer/achievement-card'
import StatisticsCard from '@/framer/statistics-card'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ABOUT_TEXT } from '@/constants'

export default function AboutSection() {
  return (
    <section className="contents">
      <SectionTag.Responsive Epkyl0OCB="ABOUT" />
      <AboutImageReveal.Responsive />
      <ErrorBoundary>
        <TextReveal.Responsive text={ABOUT_TEXT.reveal1} />
      </ErrorBoundary>
      <ErrorBoundary>
        <TextReveal1.Responsive text={ABOUT_TEXT.reveal2} />
      </ErrorBoundary>
      <AchievementCardsAnimated.Responsive />
      <AchievementCard.Responsive />
      <StatisticsCard.Responsive />
    </section>
  )
}
