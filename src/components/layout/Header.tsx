import Navigation from '@/framer/navigation'

export default function Header() {
  return (
    <header className="site-header">
      <Navigation.Responsive
        home="/"
        about="/about"
        works="/#case-study"
        blog="/#blog"
        contact="/#contact"
        mailLink="mailto:leondesigner221@gmail.com"
      />
    </header>
  )
}
