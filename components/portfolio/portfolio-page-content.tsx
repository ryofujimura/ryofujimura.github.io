"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/portfolio/navigation"
import { HeroSection } from "@/components/portfolio/hero-section"
import { ShowcaseSection } from "@/components/portfolio/showcase-section"
import { AboutSection } from "@/components/portfolio/about-section"
import { ExperienceSection } from "@/components/portfolio/experience-section"
import { ProjectsSection } from "@/components/portfolio/projects-section"
import { ContactSection } from "@/components/portfolio/contact-section"
import { Footer } from "@/components/portfolio/footer"
import { CustomCursor } from "@/components/custom-cursor"
import { PORTFOLIO_HERO_INTRO_EVENT } from "@/hooks/use-deferred-showcase-media"

const MOBILE_BREAKPOINT = 768
/** Fallback if hero intro event never fires */
const BELOW_FOLD_FALLBACK_MS = 3600

/**
 * Defers below-fold sections on mobile until the hero intro finishes so GSAP,
 * SVG path work, and ScrollTrigger setup do not compete on the main thread.
 */
export function PortfolioPageContent() {
  const [belowFoldReady, setBelowFoldReady] = useState(false)

  useEffect(() => {
    const isMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches
    if (!isMobile) {
      setBelowFoldReady(true)
      return
    }

    let opened = false
    const open = () => {
      if (opened) return
      opened = true
      const run = () => setBelowFoldReady(true)
      if ("requestIdleCallback" in window) {
        requestIdleCallback(run, { timeout: 600 })
      } else {
        window.setTimeout(run, 120)
      }
    }

    window.addEventListener(PORTFOLIO_HERO_INTRO_EVENT, open, { once: true })
    const fallback = window.setTimeout(open, BELOW_FOLD_FALLBACK_MS)

    return () => {
      window.removeEventListener(PORTFOLIO_HERO_INTRO_EVENT, open)
      window.clearTimeout(fallback)
    }
  }, [])

  return (
    <main className="portfolio-site min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <CustomCursor />
      <Navigation />
      <HeroSection />
      {belowFoldReady ? (
        <>
          <AboutSection />
          <ShowcaseSection />
          <ExperienceSection />
          <ProjectsSection />
          <ContactSection />
          <Footer />
        </>
      ) : (
        <div className="min-h-[40vh]" aria-hidden />
      )}
    </main>
  )
}
