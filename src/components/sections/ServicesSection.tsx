import SectionTag from '@/framer/section-tag'
import ServiceCards from '@/framer/service-cards'
import ServiceCard from '@/framer/service-card'

export default function ServicesSection() {
  return (
    <section className="contents">
      <SectionTag.Responsive Epkyl0OCB="SERVICE" />
      <ServiceCards.Responsive />
      <ServiceCard.Responsive />
    </section>
  )
}
