"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { GradientButton } from "@/components/gradient-button"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

export function Header() {
  const pathname = usePathname()
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // GSAP Timeline Registration for the mobile menu reveal
  useGSAP(() => {
    // Initial states for staggered elements
    gsap.set(".mobile-link-inner", { y: "120%", rotate: 4 });
    gsap.set(".mobile-menu-overlay", { clipPath: "circle(0% at 100% 0%)" });

    tl.current = gsap.timeline({ paused: true })
      .to(".mobile-menu-overlay", {
        clipPath: "circle(150% at 100% 0%)",
        duration: 2.2,
        ease: "power2.inOut"
      })
      .to(".mobile-link-inner", {
        y: "0%",
        rotate: 0,
        duration: 1.4,
        stagger: 0.15,
        ease: "power3.out"
      }, "-=1.4")
      .to(".mobile-social", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=1.3");
  }, { scope: menuRef });

  // Play/Reverse logic mapped to React state
  useEffect(() => {
    if (isMobileMenuOpen) {
      tl.current?.timeScale(1).play();
      document.body.style.overflow = "hidden";
    } else {
      tl.current?.timeScale(1).reverse(); // 1.0 reverse speed - identical to the opening pace
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  // Close menu on route transition
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Work", href: "/#work" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <header className={cn(
        "pointer-events-none animate-hero-header fixed inset-x-0 top-0 z-[60] transition-all duration-500",
        scrolled
          ? "bg-background/70 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
          : "mix-blend-difference"
      )}>
        <div className="flex h-16 items-center justify-between px-6 md:px-12 lg:px-24 2xl:px-[300px]">
          {/* Logo */}
          <Link 
            href="/" 
            className={cn(
              "pointer-events-auto group flex items-center text-xl font-semibold transition-colors duration-500",
              scrolled ? "text-foreground" : "text-white"
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="tracking-[-0.04em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:tracking-[0.02em]">
              Leon
            </span>
            <span className={cn(
              "ml-1 h-[4px] w-[4px] -translate-x-2 rounded-full opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100",
              scrolled ? "bg-foreground" : "bg-white"
            )} />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="pointer-events-auto hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "group relative px-4 py-2 font-mono text-xs font-medium tracking-[0.15em] uppercase transition-colors duration-300",
                  scrolled
                    ? cn("hover:text-foreground", pathname === link.href ? "text-foreground" : "text-foreground/60")
                    : cn("hover:text-white", pathname === link.href ? "text-white" : "text-white/70")
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100",
                  scrolled ? "bg-foreground/50" : "bg-white/70"
                )} />
              </Link>
            ))}
            <a
              href="/cv-an-nguyen-leon-2026.pdf"
              download
              className={cn(
                "group/cv relative ml-3 inline-flex items-center gap-2.5 overflow-hidden rounded-full border px-5 py-2 font-mono text-xs font-medium tracking-[0.15em] uppercase transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-black hover:text-white",
                scrolled
                  ? "border-foreground/15 text-foreground/50"
                  : "border-white/20 text-white/60"
              )}
            >
              {/* Sweep fill — black */}
              <span className="absolute inset-0 origin-left scale-x-0 rounded-full bg-black transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cv:scale-x-100" />
              {/* Text roll */}
              <span className="relative block overflow-hidden">
                <span className="block transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cv:-translate-y-full">
                  The Story So Far
                </span>
                <span className="absolute inset-0 translate-y-full transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cv:translate-y-0" aria-hidden="true">
                  The Story So Far
                </span>
              </span>
              {/* Arrow — delayed second beat */}
              <span className="relative z-10 inline-block transition-all duration-700 delay-75 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cv:translate-y-1">
                ↓
              </span>
            </a>
            {/* <ThemeToggle /> */}
          </nav>

          {/* Mobile Hamburguer Toggle */}
          <button
            className={cn(
              "pointer-events-auto md:hidden relative z-[70] flex h-10 w-10 flex-col items-center justify-center transition-colors duration-500",
              scrolled && !isMobileMenuOpen ? "text-foreground" : "text-white"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {/* Top Line */}
            <div className={cn("absolute transition-all duration-300", isMobileMenuOpen ? "translate-y-0 delay-0" : "-translate-y-2 delay-300")}>
              <span className={cn("block h-[1.5px] w-6 bg-current transition-transform duration-300 origin-center", isMobileMenuOpen ? "rotate-45 delay-300" : "rotate-0 delay-0")} />
            </div>
            {/* Middle Line */}
            <div className={cn("absolute transition-all duration-300", isMobileMenuOpen ? "opacity-0 scale-x-0 delay-0" : "opacity-100 scale-x-100 delay-300")}>
              <span className="block h-[1.5px] w-6 bg-current" />
            </div>
            {/* Bottom Line */}
            <div className={cn("absolute transition-all duration-300", isMobileMenuOpen ? "translate-y-0 delay-0" : "translate-y-2 delay-300")}>
              <span className={cn("block h-[1.5px] w-6 bg-current transition-transform duration-300 origin-center", isMobileMenuOpen ? "-rotate-45 delay-300" : "rotate-0 delay-0")} />
            </div>
          </button>
        </div>
      </header>

      {/* Cinematic Mobile Menu Overlay */}
      <div 
        ref={menuRef} 
        className="fixed inset-0 z-[55] md:hidden pointer-events-none"
      >
        <div className="mobile-menu-overlay absolute inset-0 bg-background pointer-events-auto flex flex-col justify-center px-6 pb-20 pt-32">
          
          {/* Gigantic Nav Typographies */}
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <div key={link.name} className="overflow-hidden py-2 cursor-pointer">
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mobile-link-inner block text-6xl font-light tracking-tighter text-foreground hover:text-foreground/70 transition-colors"
                >
                  {link.name}
                </Link>
              </div>
            ))}
            
            <div className="overflow-hidden mt-8">
              <a
                href="/cv-an-nguyen-leon-2026.pdf"
                download
                className="group/cv mobile-link-inner relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-foreground/20 px-6 py-4 font-mono text-sm uppercase tracking-[0.2em] text-foreground/70 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.97]"
              >
                <span className="relative block overflow-hidden">
                  <span className="block transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cv:-translate-y-full">
                    The Story So Far
                  </span>
                  <span className="absolute inset-0 translate-y-full transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cv:translate-y-0" aria-hidden="true">
                    The Story So Far
                  </span>
                </span>
                <span className="relative inline-block text-foreground/40 transition-all duration-700 delay-75 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cv:translate-y-1 group-hover/cv:text-foreground">
                  ↓
                </span>
              </a>
            </div>
          </nav>

          {/* Social Links & Utilities */}
          <div className="absolute bottom-12 left-6 right-6 flex items-end justify-between border-t border-foreground/10 pt-6">
            <div className="flex flex-col gap-3">
              {[
                { label: 'LinkedIn', url: 'https://www.linkedin.com/in/nguyentuongan/' },
                { label: 'Telegram', url: 'https://t.me/yangtinakpo' }
              ].map((social) => (
                <a 
                  key={social.label} 
                  href={social.url} 
                  className="mobile-social opacity-0 translate-y-4 font-mono text-xs uppercase tracking-widest text-foreground/50 hover:text-foreground transition-colors"
                >
                  {social.label}
                </a>
              ))}
            </div>
            {/* <div className="mobile-social opacity-0 translate-y-4 pointer-events-auto">
              <ThemeToggle />
            </div> */}
          </div>
          
        </div>
      </div>
    </>
  )
}
