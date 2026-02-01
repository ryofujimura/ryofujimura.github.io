"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { MagneticButton } from "@/components/magnetic-button"
import { Menu, X, MessageCircle, Mail } from "lucide-react"
import { OPEN_CONTACT_FORM_EVENT, CLOSE_CONTACT_FORM_EVENT } from "@/components/portfolio/contact-section"
import { gsap } from "gsap"

// Gooey slime-split pill button using blur + contrast metaball effect
function SplitContactButton() {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftPillRef = useRef<HTMLDivElement>(null)
  const rightPillRef = useRef<HTMLDivElement>(null)
  const mainTextRef = useRef<HTMLSpanElement>(null)
  const leftContentRef = useRef<HTMLSpanElement>(null)
  const rightContentRef = useRef<HTMLSpanElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Initialize positions
  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Both pills start at center, overlapping to form single pill
      gsap.set(leftPillRef.current, { x: 0, scaleX: 1, scaleY: 1 })
      gsap.set(rightPillRef.current, { x: 0, scaleX: 1, scaleY: 1 })
      gsap.set([leftContentRef.current, rightContentRef.current], { opacity: 0 })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (!containerRef.current) return
    setIsHovered(true)

    timelineRef.current?.kill()
    const tl = gsap.timeline()
    timelineRef.current = tl

    // Phase 1: Fade out main text
    tl.to(mainTextRef.current, {
      opacity: 0,
      duration: 0.15,
      ease: "power2.in",
    })

    // Phase 2: Squash before split (slime tension)
    .to([leftPillRef.current, rightPillRef.current], {
      scaleX: 1.15,
      scaleY: 0.85,
      duration: 0.15,
      ease: "power2.out",
    }, "-=0.05")

    // Phase 3: Split apart with elastic bounce
    .to(leftPillRef.current, {
      x: -52,
      scaleX: 1,
      scaleY: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.6)",
    }, "-=0.05")
    .to(rightPillRef.current, {
      x: 52,
      scaleX: 1,
      scaleY: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.6)",
    }, "<")

    // Phase 4: Content fades in
    .to([leftContentRef.current, rightContentRef.current], {
      opacity: 1,
      duration: 0.2,
      ease: "power2.out",
    }, "-=0.35")
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!containerRef.current) return
    setIsHovered(false)

    timelineRef.current?.kill()
    const tl = gsap.timeline()
    timelineRef.current = tl

    // Phase 1: Fade out content
    tl.to([leftContentRef.current, rightContentRef.current], {
      opacity: 0,
      duration: 0.12,
      ease: "power2.in",
    })

    // Phase 2: Merge back together (slime rejoining)
    .to(leftPillRef.current, {
      x: 0,
      scaleX: 1.1,
      scaleY: 0.9,
      duration: 0.25,
      ease: "power3.inOut",
    }, "-=0.05")
    .to(rightPillRef.current, {
      x: 0,
      scaleX: 1.1,
      scaleY: 0.9,
      duration: 0.25,
      ease: "power3.inOut",
    }, "<")

    // Phase 3: Settle back to normal shape
    .to([leftPillRef.current, rightPillRef.current], {
      scaleX: 1,
      scaleY: 1,
      duration: 0.2,
      ease: "elastic.out(1, 0.8)",
    })

    // Phase 4: Fade in main text
    .to(mainTextRef.current, {
      opacity: 1,
      duration: 0.2,
      ease: "power2.out",
    }, "-=0.15")
  }, [])

  const handleMessageClick = useCallback(() => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      const offset = 80
      const elementPosition = contactSection.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      })
    }
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent(OPEN_CONTACT_FORM_EVENT))
    }, 500)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center h-8"
      style={{ width: 240 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gooey filter container - blur + contrast creates metaball effect */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ 
          background: "transparent",
        }}
      >
        {/* Left pill blob */}
        <div
          ref={leftPillRef}
          className="absolute bg-primary rounded-full"
          style={{ 
            width: 100,
            height: 32,
            willChange: "transform",
          }}
        />
        {/* Right pill blob */}
        <div
          ref={rightPillRef}
          className="absolute bg-primary rounded-full"
          style={{ 
            width: 100,
            height: 32,
            willChange: "transform",
          }}
        />
      </div>

      {/* Sharp overlay pills for crisp edges and interaction */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Left clickable area */}
        <button
          type="button"
          onClick={handleMessageClick}
          className={cn(
            "absolute flex items-center justify-center rounded-full transition-opacity duration-150",
            isHovered ? "pointer-events-auto" : "pointer-events-none"
          )}
          style={{ 
            width: 100,
            height: 32,
            left: "50%",
            transform: isHovered ? "translateX(calc(-50% - 52px))" : "translateX(-50%)",
            transition: isHovered ? "none" : "transform 0.25s ease-out",
          }}
        >
          <span 
            ref={leftContentRef} 
            className="flex items-center gap-2 text-primary-foreground text-sm font-medium"
            style={{ opacity: 0 }}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Message</span>
          </span>
        </button>

        {/* Right clickable area */}
        <a
          href="mailto:ryo.fujimura1@gmail.com"
          className={cn(
            "absolute flex items-center justify-center rounded-full transition-opacity duration-150",
            isHovered ? "pointer-events-auto" : "pointer-events-none"
          )}
          style={{ 
            width: 100,
            height: 32,
            left: "50%",
            transform: isHovered ? "translateX(calc(-50% + 52px))" : "translateX(-50%)",
            transition: isHovered ? "none" : "transform 0.25s ease-out",
          }}
        >
          <span 
            ref={rightContentRef} 
            className="flex items-center gap-2 text-primary-foreground text-sm font-medium"
            style={{ opacity: 0 }}
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </span>
        </a>
      </div>

      {/* Main text overlay - visible when not split */}
      <span
        ref={mainTextRef}
        className="relative z-10 text-sm font-medium text-primary-foreground whitespace-nowrap pointer-events-none"
      >
        Get in Touch
      </span>
    </div>
  )
}

const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Next", href: "#contact" },
]

export function Navigation() {
  const [activeSection, setActiveSection] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number } | null>(
    null
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const sections = navItems.map((item) => item.href.replace("#", ""))
      const scrollPosition = window.scrollY + 100

      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section)
          break
        }
      }

      // Default to first item when near the very top
      if (scrollPosition < 120 && !activeSection) {
        setActiveSection(navItems[0]?.href.replace("#", "") || "")
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [activeSection])

  // Update pill position when active section changes or items mount
  useEffect(() => {
    if (typeof window === "undefined") return
    const index =
      navItems.findIndex((item) => item.href.replace("#", "") === activeSection) ?? -1
    const fallbackIndex = index === -1 ? 0 : index
    const el = itemRefs.current[fallbackIndex]
    if (el) {
      const rect = el.getBoundingClientRect()
      const containerRect = el.offsetParent instanceof HTMLElement ? el.offsetParent.getBoundingClientRect() : null
      const left =
        containerRect && typeof rect.left === "number" && typeof containerRect.left === "number"
          ? rect.left - containerRect.left
          : el.offsetLeft

      setIndicatorStyle({
        left,
        width: rect.width || el.offsetWidth,
      })
    }
  }, [activeSection])

  const scrollToSection = (href: string) => {
    // Close message form if open when navigating
    window.dispatchEvent(new CustomEvent(CLOSE_CONTACT_FORM_EVENT))
    
    const element = document.querySelector(href)
    if (element) {
      // For projects section, scroll to exact top to trigger GSAP pin and show first project
      if (href === "#projects") {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        })
      } else {
        const offset = 80
        const elementPosition = element.getBoundingClientRect().top + window.scrollY
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth",
        })
      }
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="max-w-6xl mx-auto py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <MagneticButton
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="touch-target min-h-[44px] min-w-[88px] flex items-center justify-center gap-1.5 text-lg sm:text-xl font-bold font-mono text-foreground hover:text-accent transition-colors"
              aria-label="Home"
            >
              <img src="/images/branding/ryologo.png" alt="" className="h-6 w-6 sm:h-7 sm:w-7 object-contain" width={28} height={28} />
              {/* <span>&gt; RF</span> */}
            </MagneticButton>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center gap-1 p-1.5 rounded-full bg-secondary/50 backdrop-blur-sm border border-border relative overflow-hidden">
              {/* Animated pill indicator under nav bar */}
              {indicatorStyle && (
                <span
                  className="absolute top-1/2 -translate-y-1/2 h-8 bg-foreground rounded-full -z-10 transition-all duration-300 ease-out"
                  style={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                  }}
                  aria-hidden
                />
              )}
              {navItems.map((item) => (
                <button
                  type="button"
                  key={item.href}
                  ref={(el) => {
                    const index = navItems.findIndex((nav) => nav.href === item.href)
                    if (index !== -1) {
                      itemRefs.current[index] = el
                    }
                  }}
                  onClick={() => scrollToSection(item.href)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 z-10",
                    activeSection === item.href.replace("#", "")
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Desktop "Get in Touch" split button */}
              <div className="hidden lg:block">
                <SplitContactButton />
              </div>

              {/* Mobile menu — 44px touch target */}
              <button
                type="button"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                className="lg:hidden touch-target min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu — safe area + 44px taps */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/95 backdrop-blur-xl lg:hidden transition-all duration-500 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col items-center justify-center h-full gap-4 sm:gap-8 px-4">
          {navItems.map((item, index) => (
            <button
              key={item.href}
              type="button"
              onClick={() => scrollToSection(item.href)}
              className={cn(
                "touch-target min-h-[48px] w-full max-w-[280px] text-xl sm:text-3xl font-medium font-mono transition-all duration-300 text-center py-3",
                isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                activeSection === item.href.replace("#", "")
                  ? "text-accent"
                  : "text-foreground hover:text-accent active:bg-secondary/50"
              )}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              &gt; {item.label}
            </button>
          ))}
          {/* Mobile contact options - both visible */}
          <div
            className={cn(
              "mt-2 sm:mt-4 flex flex-col gap-3 w-full max-w-[280px] transition-all duration-300",
              isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
            style={{ transitionDelay: "250ms" }}
          >
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false)
                // Scroll to contact section
                const contactSection = document.getElementById("contact")
                if (contactSection) {
                  const offset = 80
                  const elementPosition = contactSection.getBoundingClientRect().top + window.scrollY
                  window.scrollTo({
                    top: elementPosition - offset,
                    behavior: "smooth",
                  })
                }
                // Dispatch custom event to open the form
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent(OPEN_CONTACT_FORM_EVENT))
                }, 500)
              }}
              className="touch-target min-h-[48px] flex items-center justify-center gap-3 px-8 py-4 text-base sm:text-lg font-medium font-mono text-primary-foreground bg-primary rounded-full w-full"
            >
              <MessageCircle className="w-5 h-5" />
              Message
            </button>
            <a
              href="mailto:ryo.fujimura1@gmail.com"
              className="touch-target min-h-[48px] flex items-center justify-center gap-3 px-8 py-4 text-base sm:text-lg font-medium font-mono text-foreground bg-secondary/50 border border-border rounded-full w-full hover:bg-secondary transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
