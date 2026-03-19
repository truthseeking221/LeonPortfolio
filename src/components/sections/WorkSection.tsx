import SectionTag from '@/framer/section-tag'
import CaseStudyHeroAnimated from '@/framer/case-study-hero-animated'
import CaseStudyCardLarge from '@/framer/case-study-card-large'
import CaseStudyCardHeroSmall from '@/framer/case-study-card-hero-small'
import CaseStudyCardLatestProject from '@/framer/case-study-card-latest-project'
import RevealOverlayCaseStudyImage from '@/framer/reveal-overlay-case-study-image'
import ImageCarousel from '@/framer/image-carousel'
import { CASE_STUDY } from '@/constants'

export default function WorkSection() {
  return (
    <section className="contents">
      <SectionTag.Responsive Epkyl0OCB="CASE STUDIES" />
      <CaseStudyHeroAnimated.Responsive />
      <CaseStudyCardLarge.Responsive
        At4Pr3rJk={CASE_STUDY.year}
        Os6cY3CKf={CASE_STUDY.title}
        XiSILjU_N={CASE_STUDY.accentColor}
        wprkFfBdg={CASE_STUDY.slug}
        xaGbPDv6W={CASE_STUDY.description}
      />
      <CaseStudyCardHeroSmall.Responsive />
      <CaseStudyCardLatestProject.Responsive />
      <RevealOverlayCaseStudyImage.Responsive />
      <ImageCarousel.Responsive />
    </section>
  )
}
