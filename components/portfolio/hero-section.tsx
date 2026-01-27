"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { GSAPText } from "@/components/gsap-text"
import { HeroBrutalistPattern } from "@/components/hero-brutalist-pattern"
import { HeroAsciiBlock } from "@/components/hero-ascii-block"
import { MagneticButton } from "@/components/magnetic-button"
import { ArrowDown, Github, Linkedin, Mail, ArrowRight } from "lucide-react"
import { LocationHoverText } from "@/components/portfolio/location-hover-text"

const HERO_ASCII_LINES = [
  "  ┌─────────────────────────────────────────────────────────────────────────────┐",
  "  │  RF.DV.HERO.001  │  OBSERVATION_LOG  │  CIRCA_2025                            │",
  "  │  > status: AVAILABLE_FOR_WORK  │  locale: Irvine, CA                          │",
  "  └─────────────────────────────────────────────────────────────────────────────┘",
]

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollCueRef = useRef<HTMLDivElement>(null)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0))
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.fromTo(gridRef.current, { opacity: 0 }, { opacity: 0.14, duration: 1.4, ease: "power2.out" })
      }
      if (contentRef.current) {
        gsap.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.4 })
      }
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current.children,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, delay: 2.2, ease: "power2.out" }
        )
      }
      if (scrollCueRef.current) {
        gsap.fromTo(scrollCueRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, delay: 2.8 })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] min-h-screen flex items-center justify-center px-4 sm:px-6 pt-[max(5rem,env(safe-area-inset-top))] pb-8 overflow-hidden"
    >
      {/* Dense brutalist grid — technical lines */}
      <div
        ref={gridRef}
        className="absolute inset-0 opacity-0 text-foreground"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "min(32px, 8vw) min(32px, 8vw)",
        }}
        aria-hidden
      />

      {/* Complex technical pattern — draws on via GSAP inside HeroBrutalistPattern */}
      <div className="absolute inset-0 pointer-events-none text-foreground/[0.07] dark:text-foreground/[0.12]">
        <HeroBrutalistPattern className="w-full h-full" />
      </div>

      {/* Main content — ASCII-first brutalist layout */}
      <div ref={contentRef} className="max-w-4xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-[1fr,auto] gap-12 lg:gap-16 items-start">
          <div className="space-y-6 sm:space-y-8">
            {/* ASCII header block — line-by-line GSAP reveal */}
            <HeroAsciiBlock
              lines={HERO_ASCII_LINES}
              delay={0.6}
              stagger={0.08}
              duration={0.4}
            />

            {/* Status scramble — terminal flicker */}
            <GSAPText
              variant="scramble"
              className="text-[10px] xs:text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground/80"
              delay={1.0}
              playOnLoad
            >
              status: AVAILABLE_FOR_WORK
            </GSAPText>

            {/* Name — brutalist typography, char stagger */}
            <div className="space-y-0 leading-[0.88] tracking-[-0.04em]">
              <GSAPText
                variant="chars"
                className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-foreground font-mono"
                stagger={0.025}
                duration={0.5}
                delay={1.1}
                playOnLoad
              >
                RYO
              </GSAPText>
              <GSAPText
                variant="chars"
                className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-foreground font-mono"
                stagger={0.025}
                duration={0.5}
                delay={1.35}
                playOnLoad
              >
                FUJIMURA
              </GSAPText>
            </div>

            {/* Role — words reveal */}
            <GSAPText
              variant="words"
              className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] sm:tracking-[0.35em] text-muted-foreground"
              delay={1.7}
              stagger={0.05}
              duration={0.4}
              playOnLoad
            >
              Software Engineer & AI Researcher
            </GSAPText>

            {/* Tagline — single line */}
            <GSAPText
              variant="lines"
              className="text-sm sm:text-base text-muted-foreground/80 max-w-lg font-mono"
              delay={1.95}
              duration={0.5}
              playOnLoad
            >
              Building intelligent systems at the intersection of AI research and real-world applications.
            </GSAPText>

            {/* CTAs — stagger in */}
            <div ref={ctaRef} className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
              <MagneticButton
                as="a"
                href="#projects"
                className="touch-target group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] text-sm font-mono uppercase tracking-wider text-primary-foreground bg-primary border-2 border-primary hover:bg-transparent hover:text-primary transition-all duration-300"
              >
                View Work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </MagneticButton>
              <MagneticButton
                as="a"
                href="#contact"
                className="touch-target group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] text-sm font-mono uppercase tracking-wider text-foreground bg-transparent border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
              >
                Contact
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform shrink-0" />
              </MagneticButton>
            </div>

            {/* Social + location */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2">
              <div className="flex items-center gap-0.5 sm:gap-1">
                {[
                  { href: "https://github.com/ryofujimura", img: "/images/github.png", label: "GitHub" },
                  { href: "https://linkedin.com/in/ryofujimura", img: "/images/linkedin.png", label: "LinkedIn" },
                  { href: "mailto:ryo.fujimura1@gmail.com", icon: Mail, label: "Email" },
                ].map((item) => {
                  const Icon = "icon" in item ? item.icon : null
                  return (
                    <MagneticButton
                      key={item.label}
                      as="a"
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="touch-target p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-all"
                    >
                      {"img" in item ? (
                        <img src={item.img} alt="" className="w-5 h-5 object-contain" width={20} height={20} />
                      ) : (
                        Icon && <Icon className="w-5 h-5" />
                      )}
                      <span className="sr-only">{item.label}</span>
                    </MagneticButton>
                  )
                })}
              </div>
              <div className="w-px h-5 sm:h-6 bg-border shrink-0" />
              <LocationHoverText
                defaultWords={["Irvine", ", ", "CA"]}
                hoverWords={["Open", " to", "relocate"]}
                className="text-[10px] xs:text-xs font-mono text-muted-foreground"
              />
            </div>
          </div>

          {/* Right: technical SVG + profile — desktop */}
          <div className="hidden lg:block relative w-full max-w-[340px]">
            <HeroTechnicalFigure />
          </div>
        </div>
      </div>

      {/* Scroll cue — ASCII */}
      <div
        ref={scrollCueRef}
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 pb-[env(safe-area-inset-bottom)] opacity-0"
      >
        <div className="flex flex-col items-center gap-2 sm:gap-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] sm:tracking-[0.4em] text-muted-foreground">
            &gt; scroll
          </span>
          <div className="w-px h-10 sm:h-16 bg-foreground/20 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-6 sm:h-8 bg-foreground"
              style={{ animation: "slideDown 2s ease-in-out infinite" }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(200%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  )
}

/** Desktop-only technical figure: draw-on SVG + brutalist profile frame */
function HeroTechnicalFigure() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = svgRef.current
    if (!el) return

    const paths = el.querySelectorAll("path, line, circle, polyline")
    paths.forEach((p) => {
      const el = p as SVGGeometryElement
      if (typeof el.getTotalLength === "function") {
        try {
          const len = el.getTotalLength()
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
        } catch {
          /* skip */
        }
      }
    })

    gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 2.2,
      stagger: 0.05,
      delay: 0.8,
      ease: "power2.inOut",
    })
  }, [])

  return (
    <div className="relative aspect-square">
      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full text-foreground/[0.08] dark:text-foreground/[0.12]"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <circle cx="200" cy="200" r="180" />
        <circle cx="200" cy="200" r="120" />
        <circle cx="200" cy="200" r="60" />
        <line x1="200" y1="20" x2="200" y2="380" />
        <line x1="20" y1="200" x2="380" y2="200" />
        <line x1="50" y1="50" x2="350" y2="350" />
        <line x1="350" y1="50" x2="50" y2="350" />
        <path d="M 80 80 L 80 40 L 120 40" />
        <path d="M 320 80 L 320 40 L 280 40" />
        <path d="M 80 320 L 80 360 L 120 360" />
        <path d="M 320 320 L 320 360 L 280 360" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 border-[3px] border-foreground bg-background shadow-[6px_6px_0_0_var(--foreground)] overflow-hidden">
          <img
            src="/images/profile.jpg"
            alt="Ryo Fujimura"
            className="w-full h-full object-cover object-top"
            width={176}
            height={176}
          />
          <span className="absolute bottom-1 right-1 font-mono text-[8px] text-foreground/60 bg-background/90 px-1">
            RF
          </span>
        </div>
      </div>
    </div>
  )
}
