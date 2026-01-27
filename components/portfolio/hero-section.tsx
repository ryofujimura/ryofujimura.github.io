"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { GSAPText, GSAPSVG } from "@/components/gsap-text"
import { BlueprintLines, TechnicalPattern } from "@/components/technical-grid"
import { MagneticButton } from "@/components/magnetic-button"
import { AsciiHeroLine } from "@/components/ascii-banner"
import { ArrowDown, Github, Linkedin, Mail, ArrowRight } from "lucide-react"
import { LocationHoverText } from "@/components/portfolio/location-hover-text"

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isTouch, setIsTouch] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0)
  }, [])

  useEffect(() => {
    if (isTouch) return
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isTouch])

  useEffect(() => {
    if (!containerRef.current) return

    // Animate the technical lines on load
    if (linesRef.current) {
      const paths = linesRef.current.querySelectorAll("path, line, circle")
      gsap.fromTo(
        paths,
        { strokeDasharray: "0 2000", opacity: 0 },
        {
          strokeDasharray: "2000 0",
          opacity: 1,
          duration: 2.5,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.5,
        }
      )
    }

    // Grid fade in — subtle technical lines
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current,
        { opacity: 0 },
        { opacity: 0.07, duration: 2, delay: 0.3 }
      )
    }
  }, [])

  const parallax = !isTouch ? { x: mousePosition.x * 5, y: mousePosition.y * 5 } : { x: 0, y: 0 }
  const blueprintMove = !isTouch ? { x: mousePosition.x * -20, y: -50 + mousePosition.y * -20 } : { x: 0, y: -50 }

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] min-h-screen flex items-center justify-center px-4 sm:px-6 pt-[max(5rem,env(safe-area-inset-top))] pb-8 overflow-hidden"
    >
      {/* Brutalist technical grid — complex line pattern */}
      <div
        ref={gridRef}
        className="absolute inset-0 opacity-0 bg-brutalist-grid"
        style={{
          backgroundSize: "min(48px, 10vw) min(48px, 10vw)",
          transform: `translate(${parallax.x}px, ${parallax.y}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />

      {/* Blueprint — desktop only to save mobile paint */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] text-foreground/10 pointer-events-none hidden md:block"
        style={{
          transform: `translate(${blueprintMove.x}px, ${blueprintMove.y}%)`,
          transition: "transform 0.5s ease-out",
        }}
      >
        <BlueprintLines className="w-full h-full" />
      </div>

      {/* Vitruvian SVG — desktop only */}
      <GSAPSVG
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] text-foreground/10 pointer-events-none hidden lg:block"
        duration={3}
        delay={1}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" stroke="currentColor">
          <circle cx="200" cy="200" r="180" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="120" strokeWidth="0.5" />
          <rect x="60" y="60" width="280" height="280" strokeWidth="0.5" />
          <line x1="200" y1="20" x2="200" y2="380" strokeWidth="0.3" />
          <line x1="20" y1="200" x2="380" y2="200" strokeWidth="0.3" />
          <circle cx="200" cy="200" r="3" fill="currentColor" />
          <circle cx="200" cy="76" r="2" fill="currentColor" />
          <circle cx="200" cy="324" r="2" fill="currentColor" />
          <circle cx="76" cy="200" r="2" fill="currentColor" />
          <circle cx="324" cy="200" r="2" fill="currentColor" />
        </svg>
      </GSAPSVG>

      <TechnicalPattern />

      {/* Main content — mobile-first, Leonardo + ASCII accent */}
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* Brutalist ASCII header */}
            <pre className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] text-muted-foreground/60 overflow-x-auto py-0.5 touch-manipulation whitespace-pre" aria-hidden>
{`  ┌─────────────────────────────────────────────────────────────┐
  │ FOLIO: RF.DV.HERO.001 — OBSERVATION LOG — CIRCA 2025          │
  │ > status: AVAILABLE_FOR_WORK  │  locale: Irvine, CA           │
  └─────────────────────────────────────────────────────────────┘`}
            </pre>
            <AsciiHeroLine> status: AVAILABLE_FOR_WORK</AsciiHeroLine>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-2 h-2 bg-accent animate-pulse shrink-0" />
              <span className="text-[10px] xs:text-xs font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground">
                Available for Work
              </span>
            </div>

            <GSAPText
              variant="scramble"
              className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] sm:tracking-[0.5em] text-muted-foreground"
              delay={0.2}
            >
              Software Engineer & AI Researcher
            </GSAPText>

            {/* Main title — responsive scale */}
            <div className="space-y-0 sm:space-y-2">
              <GSAPText
                variant="chars"
                className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.9] tracking-tighter font-mono"
                stagger={0.03}
                duration={0.6}
              >
                RYO
              </GSAPText>
              <GSAPText
                variant="chars"
                className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.9] tracking-tighter font-mono"
                delay={0.3}
                stagger={0.03}
                duration={0.6}
              >
                FUJIMURA
              </GSAPText>
            </div>

            <GSAPText
              variant="words"
              className="text-base sm:text-xl md:text-2xl text-muted-foreground font-light max-w-md leading-relaxed"
              delay={0.8}
              stagger={0.08}
            >
              Building intelligent systems at the intersection of AI research and real-world applications
            </GSAPText>

            <div className="pt-2 sm:pt-4 border-t border-border">
              <GSAPText
                variant="lines"
                className="text-xs sm:text-sm text-muted-foreground/60 font-mono italic"
                delay={1.2}
              >
                &quot;// Simplicity is the ultimate sophistication.&quot; — Leonardo da Vinci
              </GSAPText>
            </div>

            {/* CTAs — 44px+ touch targets */}
            <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4 pt-4 sm:pt-6">
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

            {/* Social — 44px tap targets, image icons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2 sm:pt-4">
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

          {/* Right column — desktop only, no 3D on touch */}
          <div className="hidden lg:block relative">
            <div
              className="relative aspect-square max-w-lg mx-auto"
              style={{
                transform: isTouch
                  ? "none"
                  : `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`,
                transition: "transform 0.3s ease-out",
              }}
            >
              {/* Wireframe cube - animated */}
              <GSAPSVG className="absolute inset-0 text-foreground" duration={2}>
                <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1">
                  {/* Front face */}
                  <rect x="100" y="100" width="200" height="200" opacity="0.4" />
                  {/* Back face */}
                  <rect x="140" y="60" width="200" height="200" opacity="0.2" />
                  {/* Connecting lines */}
                  <line x1="100" y1="100" x2="140" y2="60" opacity="0.3" />
                  <line x1="300" y1="100" x2="340" y2="60" opacity="0.3" />
                  <line x1="100" y1="300" x2="140" y2="260" opacity="0.3" />
                  <line x1="300" y1="300" x2="340" y2="260" opacity="0.3" />
                </svg>
              </GSAPSVG>

              {/* Inner technical details */}
              <GSAPSVG className="absolute inset-0 text-foreground" duration={3} delay={1}>
                <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="0.5">
                  {/* Diagonal cross */}
                  <line x1="100" y1="100" x2="300" y2="300" opacity="0.2" />
                  <line x1="300" y1="100" x2="100" y2="300" opacity="0.2" />
                  {/* Center circle */}
                  <circle cx="200" cy="200" r="50" opacity="0.3" />
                  <circle cx="200" cy="200" r="80" opacity="0.2" />
                  {/* Technical marks */}
                  <line x1="200" y1="100" x2="200" y2="120" opacity="0.4" />
                  <line x1="200" y1="280" x2="200" y2="300" opacity="0.4" />
                  <line x1="100" y1="200" x2="120" y2="200" opacity="0.4" />
                  <line x1="280" y1="200" x2="300" y2="200" opacity="0.4" />
                </svg>
              </GSAPSVG>

              {/* Floating labels */}
              <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground/50">
                <span>x: 200</span>
              </div>
              <div className="absolute bottom-4 right-4 text-xs font-mono text-muted-foreground/50">
                <span>y: 200</span>
              </div>

              {/* Profile image — brutalist frame */}
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 border-[3px] border-foreground bg-background shadow-[6px_6px_0_0_var(--foreground)] overflow-hidden">
                  <img
                    src="/images/profile.jpg"
                    alt="Ryo Fujimura"
                    className="w-full h-full object-cover object-top"
                    width={192}
                    height={192}
                  />
                  <div className="absolute inset-0 pointer-events-none border border-foreground/20 mix-blend-overlay" />
                  <span className="absolute bottom-1 right-1 font-mono text-[8px] text-foreground/60 bg-background/90 px-1">RF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll — ASCII cue, below fold on small screens */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex flex-col items-center gap-2 sm:gap-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] sm:tracking-[0.4em] text-muted-foreground">
            &gt; scroll
          </span>
          <div className="w-px h-10 sm:h-16 bg-foreground/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-6 sm:h-8 bg-foreground animate-[slideDown_2s_ease-in-out_infinite]" />
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
