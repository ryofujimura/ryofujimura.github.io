"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { MagneticButton } from "@/components/magnetic-button"
import { Menu, X } from "lucide-react"

const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Publications", href: "#publications" },
  { label: "Contact", href: "#contact" },
]

export function Navigation() {
  const [activeSection, setActiveSection] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      })
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
          <div className="flex items-center justify-between">
            <MagneticButton
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="touch-target min-h-[44px] min-w-[44px] flex items-center justify-center text-lg sm:text-xl font-bold font-mono text-foreground hover:text-accent transition-colors"
              aria-label="Home"
            >
              &gt; RF
            </MagneticButton>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-secondary/50 backdrop-blur-sm border border-border">
              {navItems.map((item) => (
                <button
                  type="button"
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                    activeSection === item.href.replace("#", "")
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {activeSection === item.href.replace("#", "") && (
                    <span className="absolute inset-0 bg-primary rounded-full -z-10" />
                  )}
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <MagneticButton
                as="a"
                href="mailto:ryo.fujimura1@gmail.com"
                cursorText="Email"
                className="hidden md:inline-flex px-5 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                Get in Touch
              </MagneticButton>

              {/* Mobile menu — 44px touch target */}
              <button
                type="button"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                className="md:hidden touch-target min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-foreground"
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
          "fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden transition-all duration-500 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
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
          <a
            href="mailto:ryo.fujimura1@gmail.com"
            className={cn(
              "touch-target mt-2 sm:mt-4 min-h-[48px] flex items-center justify-center px-8 py-4 text-base sm:text-lg font-medium font-mono text-primary-foreground bg-primary rounded-full transition-all duration-300 w-full max-w-[280px]",
              isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
            style={{ transitionDelay: "250ms" }}
          >
            Get in Touch
          </a>
        </div>
      </div>
    </>
  )
}
