"use client"

import * as React from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { CustomEase } from "gsap/all"

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase)
  // A sleek organic easing
  CustomEase.create("sleek", "M0,0 C0.16,1 0.3,1 1,1")
}

export interface TOCItem {
  id: string
  label: string
}

export function MobileToC({ items }: { items: TOCItem[] }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(0)
  
  const containerRef = React.useRef<HTMLDivElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const itemsRef = React.useRef<(HTMLLIElement | null)[]>([])
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  // Track active index based on scroll
  React.useEffect(() => {
    const sectionEls = items
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (sectionEls.length === 0) return

    let ticking = false

    function update() {
      const trigger = window.scrollY + window.innerHeight * 0.35 // higher trigger for mobile

      let foundIndex = 0
      for (let i = sectionEls.length - 1; i >= 0; i--) {
        const el = sectionEls[i]!
        if (trigger >= el.offsetTop) {
          foundIndex = i
          break
        }
      }
      setActiveIndex(foundIndex)
      ticking = false
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update)
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [items])

  const { contextSafe } = useGSAP({ scope: containerRef })

  const toggleMenu = contextSafe(() => {
    if (!isOpen) {
      setIsOpen(true)
      
      // Prevent body scroll
      document.body.style.overflow = "hidden"
      
      const tl = gsap.timeline()
      
      // Show menu container
      gsap.set(menuRef.current, { visibility: "visible" })
      
      // Animate background overlay in
      tl.to(menuRef.current, {
        opacity: 1,
        backdropFilter: "blur(20px)",
        duration: 0.6,
        ease: "sleek"
      }, 0)

      // Button transforms into a close button (handled by CSS, but we can animate scale)
      tl.to(buttonRef.current, {
        scale: 0.9,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      }, 0)

      // Stagger in links
      tl.fromTo(
        ".toc-mobile-item", 
        { y: 30, opacity: 0, rotateX: -20 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.7, stagger: 0.04, ease: "sleek", transformOrigin: "bottom center" },
        0.1
      )

    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsOpen(false)
          gsap.set(menuRef.current, { visibility: "hidden" })
          document.body.style.overflow = ""
        }
      })
      
      // Button squash
      tl.to(buttonRef.current, {
        scale: 0.9,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      }, 0)

      // Stagger out links
      tl.to(".toc-mobile-item", {
        y: -15,
        opacity: 0,
        duration: 0.4,
        stagger: 0.02,
        ease: "power2.inOut"
      }, 0)
      
      // Hide background
      tl.to(menuRef.current, {
        opacity: 0,
        backdropFilter: "blur(0px)",
        duration: 0.5,
        ease: "power2.inOut"
      }, 0.2)
    }
  })

  // Format index (e.g., 01, 02)
  const formatIndex = (idx: number) => (idx + 1).toString().padStart(2, "0")
  
  // Current active label
  const activeLabel = items[activeIndex]?.label || "Index"

  return (
    <div ref={containerRef} className="xl:hidden">
      {/* Overlay Menu */}
      <div 
        ref={menuRef}
        className="fixed inset-0 z-40 flex flex-col justify-end bg-background/80 invisible opacity-0 px-6 pb-32 pt-20"
        style={{ perspective: "1000px" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/95 pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-sm mx-auto h-[60vh] overflow-y-auto no-scrollbar mask-image-fade-vertical">
          <ul className="flex flex-col gap-5 py-10">
            {items.map((item, i) => {
              const isActive = i === activeIndex
              return (
                <li key={item.id} className="toc-mobile-item">
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })
                      toggleMenu()
                    }}
                    className={`group flex items-baseline gap-4 text-2xl md:text-3xl tracking-tight transition-colors duration-300 ${isActive ? "text-foreground font-medium" : "text-muted-foreground/60 hover:text-foreground/80"}`}
                  >
                    <span className={`font-mono text-xs ${isActive ? "text-foreground/50" : "text-muted-foreground/30"}`}>
                      {formatIndex(i)}
                    </span>
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Floating Pill Button */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className={`flex items-center gap-3 rounded-full border border-border/20 shadow-2xl backdrop-blur-md transition-all duration-500 hover:border-border/40 hover:bg-foreground/[0.04] active:scale-95 px-5 py-3 ${
            isOpen ? "bg-foreground text-background" : "bg-background/80 text-foreground"
          }`}
        >
          {isOpen ? (
            <div className="font-medium text-xs tracking-widest uppercase">Close</div>
          ) : (
            <>
              <div className="flex items-center justify-center shrink-0 w-2 h-2 rounded-full bg-foreground/20 relative">
                <div className="absolute inset-0 rounded-full bg-foreground animate-ping opacity-50 block"></div>
              </div>
              <div className="flex flex-col items-start translate-y-px">
                <span className="font-mono text-[9px] leading-none text-muted-foreground/60 uppercase tracking-widest mb-[2px]">
                  Index / {formatIndex(activeIndex)}
                </span>
                <span className="text-xs font-medium leading-none tracking-tight">
                  {activeLabel}
                </span>
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
