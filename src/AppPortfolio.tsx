import ErrorBoundary from '@/components/ErrorBoundary'
import AnimatedHeading from '@/components/AnimatedHeading'
import AnimatedList from '@/components/AnimatedList'
import AnimatedCaseStudyCard from '@/components/AnimatedCaseStudyCard'
import ServiceCards from '@/framer/service-cards'
import StatisticsCard from '@/framer/statistics-card'
import Header from '@/components/layout/Header'
import StickyProjectShowcase from '@/components/StickyProjectShowcase'
import Ticker from '@/components/Ticker'
import ScrollRevealText from '@/components/ScrollRevealText'

type CaseStudy = {
  year: string
  type: string
  title: string
  image: string
  accent: 'blue' | 'orange'
}

type BlogPost = {
  title: string
  image?: string
  art?: 'phone'
}

const caseStudies: CaseStudy[] = [
  {
    year: '2025',
    type: 'Branding',
    title: 'Crafting Orrisé: An Immersive Study in Fragrance Identity',
    image:
      'https://framerusercontent.com/images/BYrxPxIvmunBK4mrRB4kWpT1pUs.png?width=1296&height=1776',
    accent: 'blue',
  },
  {
    year: '2024',
    type: 'Branding',
    title: 'Delivo: Creating a Visual Language for Seamless Dining Experiences',
    image:
      'https://framerusercontent.com/images/QlFtmRtt3vjlizPuAT8xCe1PRM.png?width=1296&height=1776',
    accent: 'orange',
  },
  {
    year: '2025',
    type: 'Branding',
    title: 'Designing Clarity: Branding for a Real Estate Management System',
    image:
      'https://framerusercontent.com/images/Nke4Fd0sHG4cGbR06k76scm2I.png?width=1296&height=1776',
    accent: 'blue',
  },
]

const blogPosts: BlogPost[] = [
  {
    title: 'Design Beyond Aesthetics: How Strategy Shapes Meaningful Brands',
    image:
      'https://framerusercontent.com/images/vA8xat7xbA0O6ZvtSwC8i4l20Cg.png?width=1816&height=1816',
  },
  {
    title: 'From Concept to Connection: Crafting Designs That Endure',
    art: 'phone',
  },
]

const footerLinks = ['Home', 'About', 'Case Study', 'Blog', 'Contact']

const heroProjectSlides = [caseStudies[2], caseStudies[0], caseStudies[1]]
const logoTickerItems = ['Logoipsum', 'Logoipsum', 'Logoipsum', 'Logoipsum', 'Logoipsum', 'Logo']

const aboutCopy =
  "A decade in this industry teaches you which trends matter and which ones are just noise. I've done the full loop more times than I can count, from research and wireframes to production code and post-launch firefighting. These days I work in Figma, Cursor, Claude Code, and Codex. I picked them the same way I pick everything: try it, break it, keep what earns its place. The tools keep changing. The instinct for what makes a product actually work doesn't."

function ArrowUpRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon-arrow"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 14L14 6M8.5 6H14V11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 2.75C4 2.336 4.336 2 4.75 2H6.439C6.797 2 7.105 2.252 7.177 2.602L7.59 4.603C7.649 4.888 7.535 5.181 7.296 5.355L6.182 6.166C6.998 7.862 8.138 9.002 9.834 9.818L10.645 8.704C10.819 8.465 11.112 8.351 11.397 8.41L13.398 8.823C13.748 8.895 14 9.203 14 9.561V11.25C14 11.664 13.664 12 13.25 12H12.5C7.806 12 4 8.194 4 3.5V2.75Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2.25" y="3" width="11.5" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M3 5L8 8.5L13 5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M11.5 5.5L7 10L11.5 14.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M8.5 5.5L13 10L8.5 14.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SectionTag({
  label,
  light = false,
}: {
  label: string
  light?: boolean
}) {
  return (
    <div className={`section-tag ${light ? 'section-tag--light' : ''}`}>
      <span className="section-tag__line" />
      <span className="section-tag__label">{label}</span>
    </div>
  )
}

const footerHrefByLabel: Record<string, string> = {
  Home: '#home',
  About: '/about',
  'Case Study': '#case-study',
  Blog: '#blog',
  Contact: '#contact',
}

export default function AppPortfolio() {
  return (
    <ErrorBoundary>
      <div className="portfolio-page">
        <Header />
        <main className="portfolio-shell">
          <section className="hero-section" id="home">
            <div className="hero-grid hero-grid--top">
              <article className="hero-card hero-card--grain hero-card--intro">
                <div className="hero-card__content">
                  <AnimatedHeading
                    className="display-heading-2"
                    text="I design the space where complexity comes to rest."
                  />
                  <a className="pill-button" href="#contact">
                    CONTACT ME
                  </a>
                </div>
                <span className="hero-card__star hero-card__star--bottom-right">
                  ✦
                </span>
              </article>

              <article className="hero-card hero-card--primary hero-card--portrait">
                <div className="hero-card__portrait-frame">
                  <img
                    src="/hero-portrait.png"
                    alt="Blue portrait of Leon"
                  />
                </div>
                <h2 className="display-heading-2">Hi, I'm Leon</h2>
              </article>

              <StickyProjectShowcase slides={heroProjectSlides} />
            </div>

            <div className="hero-grid hero-grid--bottom">
              <article className="hero-mini-card hero-mini-card--grain">
                <AnimatedList
                  className="hero-feature-list"
                  durationMs={420}
                  staggerMs={100}
                  offsetPx={16}
                >
                  <li>UI/UX Design</li>
                  <li>Graphic Design</li>
                  <li>AI-Powered UI/UX</li>
                  <li>Branding Design</li>
                </AnimatedList>
                <span className="hero-card__star hero-card__star--top-right">
                  ✦
                </span>
              </article>

              <article className="hero-mini-card hero-mini-card--blank" />

              <article className="hero-mini-card hero-mini-card--grain hero-mini-card--location">
                <span>Saigon</span>
              </article>

              <article className="hero-mini-card hero-mini-card--grain hero-mini-card--time">
                <span>12:42 PM</span>
              </article>

              <article className="hero-mini-card hero-mini-card--blank" />

              <article className="hero-mini-card hero-mini-card--availability">
                <span className="availability-dot" />
                <span>AVAILABLE NOW</span>
              </article>
            </div>
          </section>

          <section className="content-panel case-studies-section" id="case-study">
            <div className="panel-intro panel-intro--wide">
              <SectionTag label="CASE STUDIES" />
              <p>
                I start by understanding what needs to be built. Then I shape it
                into clear systems and design products that people actually use
              </p>
            </div>

            <div className="case-study-list">
              {caseStudies.map((study) => (
                <AnimatedCaseStudyCard
                  accent={study.accent}
                  image={study.image}
                  key={study.title}
                  title={study.title}
                  type={study.type}
                  year={study.year}
                />
              ))}
            </div>
          </section>

          <section className="about-section" id="about">
            <div className="about-section__sidebar">
              <SectionTag label="ABOUT" />

              <ul className="about-section__bullets">
                <li>Ethical &amp; integrity-driven</li>
                <li>Strategic problem-solving</li>
                <li>Critical thinking</li>
              </ul>

              <a className="pill-button" href="#contact">
                CONTACT ME
              </a>
            </div>

            <div className="about-section__copy">
              <ScrollRevealText
                text={aboutCopy}
                className="display-heading-2 display-heading-2--about"
              />
            </div>
          </section>

          <section className="logo-band" aria-label="Brand ticker">
            <Ticker items={logoTickerItems} />
          </section>

          <section className="statistics-section">
            <div className="statistics-section__intro">
              <SectionTag label="STATISTICS" />
              <p>
                I measure each project not just by numbers, but by the impact it
                creates, the brands it strengthens, and the experiences it
                shapes.
              </p>
            </div>

            <StatisticsCard.Responsive number="120+" title="Projects Completed" />
          </section>

          <section className="testimonial-section">
            <div className="testimonial-section__sidebar">
              <SectionTag label="TESTIMONIAL" light />
              <p className="body-coconat-regular">
                I value the experiences shared by those I've worked with, each
                story reflecting collaboration and impact.
              </p>
            </div>

            <div className="testimonial-section__content">
              <div className="testimonial-section__header">
                <img
                  className="testimonial-section__avatar"
                  src="https://framerusercontent.com/images/OcbaJPyRVq8hSu3u1ZCWoVaYzKM.png?width=1056&height=1456"
                  alt="Reviewer portrait"
                />
                <img
                  className="testimonial-section__quote"
                  src="https://framerusercontent.com/images/1R3LFRyTCplS2OH8KjBd7kazsI.svg?width=56&height=56"
                  alt=""
                  aria-hidden="true"
                />
              </div>

              <blockquote className="display-medium">
                Leon turns minimal requirements into fully realized products. His
                AI-enhanced workflow effectively replaced the need for a
                dedicated frontend engineering team.
              </blockquote>

              <p className="testimonial-section__author">
                Sowmya Raghavan, Venture Builder &amp; Product Strategy
              </p>

              <div className="testimonial-section__controls" aria-hidden="true">
                <button type="button" className="icon-button">
                  <ChevronLeftIcon />
                </button>
                <button type="button" className="icon-button">
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          </section>

          <section className="content-panel blog-section" id="blog">
            <div className="panel-intro">
              <SectionTag label="BLOG & INSIGHTS" />
              <p>
                Each post is an exploration of ideas, design thinking, and
                strategies that inspire smarter decisions and spark
                creativity-sharing lessons and stories that go beyond the work
                itself.
              </p>
            </div>

            <div className="blog-grid">
              {blogPosts.map((post) => (
                <article className="blog-card" key={post.title}>
                  {post.image ? (
                    <img className="blog-card__image" src={post.image} alt={post.title} />
                  ) : (
                    <div className="blog-card__phone-art" aria-hidden="true">
                      <div className="blog-card__phone-shell">
                        <span className="blog-card__camera blog-card__camera--top" />
                        <span className="blog-card__camera blog-card__camera--bottom" />
                        <span className="blog-card__flash" />
                      </div>
                    </div>
                  )}
                  <h3 className="display-heading-3">{post.title}</h3>
                </article>
              ))}
            </div>
          </section>

          <section className="services-section" id="services">
            <div className="services-section__intro">
              <SectionTag label="SERVICE" />
              <p>
                I measure each project not just by numbers, but by the impact it
                creates, the brands it strengthens, and the experiences it
                shapes.
              </p>
            </div>

            <ServiceCards.Responsive />
          </section>

          <section className="contact-section" id="contact">
            <div className="contact-section__info">
              <div className="contact-section__intro">
                <SectionTag label="CONTACT" />
                <div className="contact-section__lead">
                  <img
                    src="https://framerusercontent.com/images/jHcjBzfQIkxbEFOKSFoaxMP908I.png?width=1024&height=1536"
                    alt="Blue illustrated portrait"
                  />
                  <p>
                    Reach out to start a conversation, share a vision, or create
                    something impactful.
                  </p>
                </div>
              </div>

              <div className="contact-section__links">
                <a href="tel:+0100002345">
                  <PhoneIcon />
                  <span>+01-0000-2345</span>
                </a>
                <a href="mailto:hello@james.com">
                  <MailIcon />
                  <span>hello@james.com</span>
                </a>
              </div>
            </div>

            <form className="contact-form">
              <label>
                <span>Name</span>
                <input type="text" placeholder="Jane Smith" />
              </label>
              <label>
                <span>Email</span>
                <input type="email" placeholder="jane@framer.com" />
              </label>
              <label>
                <span>Message</span>
                <textarea rows={4} placeholder="Your Message" />
              </label>
              <button className="pill-button" type="submit">
                Submit
              </button>
            </form>
          </section>
        </main>

        <footer className="site-footer">
          <div className="site-footer__inner">
            <section className="site-footer__card site-footer__card--brand">
              <h2 className="display-footer">
                <span>Leon</span>
                <span>Nguyen</span>
              </h2>

              <a
                className="site-footer__social"
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
              >
                <span>Linkedin</span>
                <ArrowUpRightIcon />
              </a>

              <p className="site-footer__note">
                Design can be automated, but great design cannot
              </p>
            </section>

            <section className="site-footer__card site-footer__card--links">
              <div className="site-footer__menu">
                <h3>Main Page</h3>
                <ul>
                  {footerLinks.map((link) => (
                    <li key={link}>
                      <a href={footerHrefByLabel[link]}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}
