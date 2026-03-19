import { Fragment, useState } from 'react'
import ServiceCards from '@/framer/service-cards'

type NavLink = {
  label: string
  href: string
  active?: boolean
}

type Stat = {
  value: string
  label: string
  featured?: boolean
}

type BrandLogo = {
  src: string
  width: number
  height: number
  alt: string
}

type Award = {
  year: string
  title: string
  description: string
  logoSrc: string
  logoWidth: number
  logoHeight: number
}

const SMALL_PORTRAIT_SRC =
  'http://localhost:3845/assets/1db11d85ac2cf6509acb34e788a292cabc97fbdb.png'
const ABOUT_PORTRAIT_SRC =
  'http://localhost:3845/assets/ba008154453a0643273158c1b0367224be76b22e.png'
const TESTIMONIAL_PORTRAIT_SRC =
  'http://localhost:3845/assets/3b192e310c039c9be7e47b13384c790ea6438a8b.png'
const CONTACT_PORTRAIT_SRC =
  'http://localhost:3845/assets/efc43bb33a558ca55da70265c8e46d7f91d26f01.png'

const NAV_LINKS: NavLink[] = [
  { label: 'HOME', href: '#home' },
  { label: 'ABOUT', href: '#about', active: true },
  { label: 'CASE STUDY', href: '#case-study' },
  { label: 'BLOG', href: '#blog' },
  { label: 'CONTACT', href: '#contact' },
]

const STATS: Stat[] = [
  { value: '10+', label: 'Years of Experience', featured: true },
  { value: '50+', label: 'Projects Shipped' },
  { value: '30+', label: 'Clients & Brands' },
]

const BRAND_LOGOS: BrandLogo[] = [
  {
    src: 'http://localhost:3845/assets/826dc5c9ada57ce6ddbe84041f461387609e7961.svg',
    width: 151,
    height: 25,
    alt: 'Logoipsum',
  },
  {
    src: 'http://localhost:3845/assets/9321150953ae70cd55d036fdba633be1b17bdb1d.svg',
    width: 140,
    height: 25,
    alt: 'Logoipsum',
  },
  {
    src: 'http://localhost:3845/assets/019f1464999cb67b117b8f01bebacca340ff1f64.svg',
    width: 140,
    height: 26,
    alt: 'Logoipsum',
  },
  {
    src: 'http://localhost:3845/assets/a19935973008a0eb38cf510705051e862478aadb.svg',
    width: 131,
    height: 25,
    alt: 'Logoipsum',
  },
  {
    src: 'http://localhost:3845/assets/a884fa14623ae20323640171e4e15cdfb23aab0c.svg',
    width: 140,
    height: 25,
    alt: 'Logoipsum',
  },
]

const AWARDS: Award[] = [
  {
    year: '2025',
    title: 'Best Branding Identity',
    description:
      'Recognized for crafting a luxury fragrance brand identity that blended storytelling with timeless aesthetics.',
    logoSrc: 'http://localhost:3845/assets/2cacbcee38a3cbe94c478af33e2e27fa695fb5e4.svg',
    logoWidth: 64,
    logoHeight: 15,
  },
  {
    year: '2024',
    title: 'UI/UX Excellence Award',
    description:
      'Honoured for an intuitive and visually striking SaaS platform interface.',
    logoSrc: 'http://localhost:3845/assets/604ccc08caf0116f36323d25d66f19cf598e4436.svg',
    logoWidth: 65,
    logoHeight: 15,
  },
  {
    year: '2023',
    title: 'Featured Project',
    description:
      'Selected for a real estate branding system that combined clarity with elegance.',
    logoSrc: 'http://localhost:3845/assets/219b365db4a155ba68e3bf22ced9e79fff308a14.svg',
    logoWidth: 65,
    logoHeight: 15,
  },
  {
    year: '2022',
    title: 'Visual Storytelling Recognition',
    description:
      'Highlighted for a food delivery app design that balanced usability with engaging visuals.',
    logoSrc: 'http://localhost:3845/assets/400d94af1ad2c604d21479aaf5d053088780ee6d.svg',
    logoWidth: 65,
    logoHeight: 15,
  },
  {
    year: '2021',
    title: 'Best Emerging Designer',
    description:
      'Awarded for consistent innovation in identity and digital design.',
    logoSrc: 'http://localhost:3845/assets/755eecf8508c241cf67961cd16d9852387743ac6.svg',
    logoWidth: 65,
    logoHeight: 15,
  },
]

function SparkIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="spark-icon"
      viewBox="0 0 12 12"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 0.75L7.44 4.56L11.25 6L7.44 7.44L6 11.25L4.56 7.44L0.75 6L4.56 4.56L6 0.75Z"
        fill="currentColor"
      />
    </svg>
  )
}

function QuoteMark({ light = false }: { light?: boolean }) {
  return <span className={`quote-mark${light ? ' quote-mark--light' : ''}`}>99</span>
}

function FramerIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 14 20"
      width="12"
      height="20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0H14L7 7H0V0Z" fill="currentColor" />
      <path d="M0 7H7L14 14H7L0 7Z" fill="currentColor" />
      <path d="M0 14H7V20L0 14Z" fill="currentColor" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2.25"
        y="3"
        width="11.5"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
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

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
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

function ArrowUpRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      width="20"
      height="20"
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

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 28 28"
      width="28"
      height="28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="5" width="22" height="2" rx="1" fill="currentColor" />
      <rect x="3" y="13" width="22" height="2" rx="1" fill="currentColor" />
      <rect x="3" y="21" width="22" height="2" rx="1" fill="currentColor" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5 5.5L7 10L11.5 14.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.5 5.5L13 10L8.5 14.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SectionEyebrow({ label, light = false }: { label: string; light?: boolean }) {
  return (
    <div className={`section-eyebrow${light ? ' section-eyebrow--light' : ''}`}>
      <span className="section-eyebrow__line" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

function NavLinks({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean
  onNavigate?: () => void
}) {
  return (
    <>
      {NAV_LINKS.map((link, index) => (
        <Fragment key={link.label}>
          <a
            className={`nav-link${link.active ? ' is-active' : ''}${mobile ? ' nav-link--mobile' : ''}`}
            href={link.href}
            aria-current={link.active ? 'page' : undefined}
            onClick={() => onNavigate?.()}
          >
            {link.label}
          </a>
          {!mobile && index < NAV_LINKS.length - 1 ? (
            <span className="nav-separator" aria-hidden="true">
              <SparkIcon size={8} />
            </span>
          ) : null}
        </Fragment>
      ))}
    </>
  )
}

function MadeInFramerBadge() {
  return (
    <a
      className="made-in-framer"
      href="https://www.framer.com/"
      target="_blank"
      rel="noreferrer"
    >
      <FramerIcon />
      <span>Made in Framer</span>
    </a>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="about-page">
      <header className="about-header">
        <div className="about-header__inner">
          <a className="brand-wordmark" href="#home">
            Leon
          </a>

          <nav className="desktop-nav" aria-label="Primary">
            <NavLinks />
          </nav>

          <a className="header-email" href="mailto:leondesigner221@gmail.com">
            <MailIcon />
            <span>leondesigner221@gmail.com</span>
          </a>

          <button
            type="button"
            className="mobile-menu-button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MenuIcon />
          </button>
        </div>

        {menuOpen ? (
          <div className="mobile-nav-panel">
            <nav className="mobile-nav" aria-label="Mobile">
              <NavLinks mobile onNavigate={() => setMenuOpen(false)} />
            </nav>
            <a className="mobile-nav-email" href="mailto:leondesigner221@gmail.com">
              <MailIcon />
              <span>leondesigner221@gmail.com</span>
            </a>
          </div>
        ) : null}
      </header>

      <main className="about-main">
        <section className="hero-section" id="home">
          <div className="hero-section__frame">
            <div className="hero-section__title">
              <h1>About Me</h1>
            </div>

            <div className="hero-section__intro">
              <div className="hero-section__intro-head">
                <div className="hero-section__portrait">
                  <img src={SMALL_PORTRAIT_SRC} alt="Small blue portrait of Leon" />
                </div>
                <QuoteMark />
              </div>

              <p>
                Most of my work, you&apos;ll never see. The extra screens I killed.
                The features I talked clients out of. The clever ideas I let go
                because they served me, not the user. What&apos;s left is the product.
                And if I did my job right, it feels like it was always that simple.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="about-section__badge">
            <MadeInFramerBadge />
          </div>

          <div className="about-section__frame">
            <div className="about-section__media">
              <span className="section-kicker">WHO I AM &amp; MY VISION</span>
              <div className="about-section__image">
                <img src={ABOUT_PORTRAIT_SRC} alt="Blue portrait of Leon against a dark background" />
              </div>
            </div>

            <div className="about-section__copy">
              <p>
                I&apos;m a product designer who builds. Not just screens, but the
                systems underneath them. I&apos;ve been shipping products for over a
                decade, building in Web3 since 2017, and somewhere along the way
                my design philosophy became inseparable from how I see the world. I
                believe the best design is an act of removal. Like a sculptor who
                doesn&apos;t add clay but takes away stone, my job is to find
                what&apos;s already essential and let go of everything else. Every
                feature that survives my process has to earn its place. Everything
                that doesn&apos;t serve the person using it gets cut, no matter how
                clever it is.
              </p>

              <div className="about-progress" aria-hidden="true" />

              <p>
                Buddhism taught me that suffering often comes from attachment,
                including attachment to your own ideas. That changed how I design.
                I hold every concept loosely. I test it, stress it, and if it
                doesn&apos;t hold up, I let it go without grief. This is how I build:
                with care, but without clinging. I use AI the same way I adopted
                Web3 years before the hype, not to follow a wave, but because the
                right tools at the right time can reveal possibilities you
                couldn&apos;t see alone. My vision is to build products that feel
                inevitable. Simple enough to trust, clear enough to understand, and
                honest enough that nothing in them is there to impress. Only to
                serve.
              </p>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="stats-section__frame">
            <div className="section-intro">
              <SectionEyebrow label="AT A GLANCE" />
              <p>
                I don&apos;t have all the answers, but after 10 years, I&apos;ve
                learned to ask better questions and ship better products.
              </p>
            </div>

            <div className="stats-grid">
              {STATS.map((stat) => (
                <article
                  className={`stat-card${stat.featured ? ' stat-card--featured' : ''}`}
                  key={stat.label}
                >
                  <h2>{stat.value}</h2>
                  <p>{stat.label}</p>
                  {stat.featured ? (
                    <span className="stat-card__spark" aria-hidden="true">
                      <SparkIcon />
                    </span>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-ticker-section" aria-label="Selected brand marks">
          <div className="brand-ticker">
            <div className="brand-ticker__track">
              {[0, 1].map((groupIndex) => (
                <div className="brand-ticker__group" key={groupIndex}>
                  {BRAND_LOGOS.map((logo, index) => (
                    <img
                      key={`${groupIndex}-${index}-${logo.src}`}
                      className="brand-ticker__logo"
                      src={logo.src}
                      alt={logo.alt}
                      style={{ width: logo.width, height: logo.height }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="awards-section" id="case-study">
          <div className="awards-section__frame">
            <div className="section-intro">
              <SectionEyebrow label="AWARDS" />
              <p>
                Awards mark the recognition of design that blends strategy,
                creativity, and meaning, celebrating work that truly connects.
              </p>
            </div>

            <div className="awards-list">
              {AWARDS.map((award) => (
                <article className="award-item" key={`${award.year}-${award.title}`}>
                  <div className="award-item__year">{award.year}</div>
                  <div className="award-item__content">
                    <img
                      className="award-item__logo"
                      src={award.logoSrc}
                      alt=""
                      aria-hidden="true"
                      style={{ width: award.logoWidth, height: award.logoHeight }}
                    />
                    <div className="award-item__text">
                      <h3>{award.title}</h3>
                      <p>{award.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="testimonial-section" id="blog">
          <div className="testimonial-section__frame">
            <div className="section-intro section-intro--stack section-intro--light">
              <SectionEyebrow label="TESTIMONIAL" light />
              <p>
                I value the experiences shared by those I&apos;ve worked with, each
                story reflecting collaboration and impact.
              </p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-card__top">
                <img
                  className="testimonial-card__avatar"
                  src={TESTIMONIAL_PORTRAIT_SRC}
                  alt="Portrait of the testimonial author"
                />
                <QuoteMark light />
              </div>

              <blockquote>
                Leon turns minimal requirements into fully realized products. His
                AI-enhanced workflow effectively replaced the need for a dedicated
                frontend engineering team.
              </blockquote>

              <p className="testimonial-card__author">
                Sowmya Raghavan, Venture Builder &amp; Product Strategy
              </p>

              <div className="testimonial-card__controls" aria-hidden="true">
                <button type="button" className="control-button">
                  <ChevronLeftIcon />
                </button>
                <button type="button" className="control-button">
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="services-section__intro">
            <SectionEyebrow label="SERVICE" />
            <p>
              I measure each project not just by numbers, but by the impact it
              creates, the brands it strengthens, and the experiences it
              shapes.
            </p>
          </div>

          <ServiceCards.Responsive />
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-section__frame">
            <div className="contact-panel">
              <div className="section-intro section-intro--stack">
                <SectionEyebrow label="CONTACT" />
                <div className="contact-panel__lead">
                  <img
                    className="contact-panel__portrait"
                    src={CONTACT_PORTRAIT_SRC}
                    alt="Blue illustrated portrait of Leon"
                  />
                  <p>
                    Reach out to start a conversation, share a vision, or create
                    something impactful.
                  </p>
                </div>
              </div>

              <div className="contact-panel__links">
                <a href="tel:+84988679765">
                  <PhoneIcon />
                  <span>+849 88 67 97 65</span>
                </a>
                <a href="mailto:hello@james.com">
                  <MailIcon />
                  <span>hello@james.com</span>
                </a>
              </div>
            </div>

            <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
              <label className="contact-field">
                <span>Name</span>
                <input type="text" placeholder="Jane Smith" />
              </label>

              <label className="contact-field">
                <span>Email</span>
                <input type="email" placeholder="jane@framer.com" />
              </label>

              <label className="contact-field">
                <span>Message</span>
                <textarea rows={4} placeholder="Your Message" />
              </label>

              <button className="contact-form__submit" type="submit" disabled>
                Submit
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="about-footer">
        <div className="about-footer__frame">
          <section className="footer-card footer-card--brand">
            <div className="footer-card__name">
              <span>Leon</span>
              <span>Nguyen</span>
            </div>

            <a
              className="footer-card__social"
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
            >
              <span>Linkedin</span>
              <ArrowUpRightIcon />
            </a>

            <p className="footer-card__note">
              Design can be automated, but great design cannot
            </p>
          </section>

          <section className="footer-card footer-card--links">
            <div className="footer-nav">
              <h2>Main Page</h2>
              <div className="footer-nav__list">
                {NAV_LINKS.map((link) => (
                  <a
                    className={`footer-nav__link${link.active ? ' is-active' : ''}`}
                    key={link.label}
                    href={link.href}
                  >
                    {link.label
                      .toLowerCase()
                      .split(' ')
                      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                      .join(' ')}
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </footer>
    </div>
  )
}
