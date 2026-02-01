"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { MagneticButton } from "@/components/magnetic-button"
import { Menu, X, MessageCircle, Mail } from "lucide-react"
import { OPEN_CONTACT_FORM_EVENT } from "@/components/portfolio/contact-section"

const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
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
              {/* Desktop "Get in Touch" dropdown */}
              <div className="hidden lg:block relative group">
                <MagneticButton
                  className="px-5 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                >
                  Get in Touch
                </MagneticButton>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-background/95 backdrop-blur-xl border border-border rounded-xl shadow-lg overflow-hidden min-w-[160px]">
                    <button
                      type="button"
                      onClick={() => {
                        // Scroll to contact section and open form
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
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>
                    <a
                      href="mailto:ryo.fujimura1@gmail.com"
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors border-t border-border"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </a>
                  </div>
                </div>
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
