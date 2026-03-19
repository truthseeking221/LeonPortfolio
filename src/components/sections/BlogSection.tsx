import SectionTag from '@/framer/section-tag'
import BlogCard from '@/framer/blog-card'
import BlogHoverButton from '@/framer/blog-hover-button'
import { BLOG } from '@/constants'

export default function BlogSection() {
  return (
    <section className="contents">
      <SectionTag.Responsive Epkyl0OCB="BLOG & INSIGHTS" />
      <BlogCard.Responsive
        HqdKCX32F={BLOG.slug}
        o9Fmxtywe={BLOG.featuredTitle}
      />
      <BlogHoverButton.Responsive />
    </section>
  )
}
