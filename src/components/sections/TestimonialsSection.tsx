import SectionTag from '@/framer/section-tag'
import TestimonialCard from '@/framer/testimonial-card'
import AwardCard from '@/framer/award-card'
import { TESTIMONIALS } from '@/constants'

export default function TestimonialsSection() {
  return (
    <section className="contents">
      <SectionTag.Responsive Epkyl0OCB="TESTIMONIAL" />
      <TestimonialCard.Responsive
        tpoBU_uzV={TESTIMONIALS.quote}
        uwTNtltLB={TESTIMONIALS.author}
      />
      <AwardCard.Responsive />
    </section>
  )
}
