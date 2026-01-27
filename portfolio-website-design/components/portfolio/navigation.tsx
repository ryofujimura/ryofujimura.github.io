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
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <MagneticButton
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-xl font-bold text-foreground hover:text-accent transition-colors"
            >
              RF
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

              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden p-2 text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden transition-all duration-500",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item, index) => (
            <button
              key={item.href}
              type="button"
              onClick={() => scrollToSection(item.href)}
              className={cn(
                "text-3xl font-medium transition-all duration-300",
                isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                activeSection === item.href.replace("#", "")
                  ? "text-accent"
                  : "text-foreground hover:text-accent"
              )}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {item.label}
            </button>
          ))}
          <a
            href="mailto:ryo.fujimura1@gmail.com"
            className={cn(
              "mt-4 px-8 py-4 text-lg font-medium text-primary-foreground bg-primary rounded-full transition-all duration-300",
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
