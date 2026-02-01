"use client"

import { useRef, useState, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { GSAPText } from "@/components/gsap-text"
import { BrutalistBackground } from "@/components/brutalist-background"
import { MagneticButton } from "@/components/magnetic-button"
import { useToast } from "@/hooks/use-toast"
import { ArrowDown, ArrowRight, Check, Github, Globe, Linkedin, Mail } from "lucide-react"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const SITE_URL = "https://ryofujimura.github.io/"
const MOBILE_BREAKPOINT = 768

// Mode verb rotator config
const MODE_VERBS = [
  "BUILD",
  "SHIP",
  "DEBUG",
  "DEPLOY",
  "DESIGN",
  "RESEARCH",
  "SCALE",
  "OPTIMIZE",
  "ITERATE",
  "LEARN",
]
const MODE_ROTATE_MS = 2600
const VERB_SLOT_CH_DESKTOP = 11
const VERB_SLOT_CH_MOBILE = 8

// Location config
const LOC_DEFAULT = "IRVINE_CA"
const LOC_HOVER = "OPEN_TO_RELOCATE"
const LOC_SLOT_CH_DESKTOP = 16
const LOC_SLOT_CH_MOBILE = 16

/**
 * Custom hook for responsive mobile detection
 * Uses window.matchMedia with resize event listener for dynamic updates
 */
function useResponsiveMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const updateMobile = () => {
      setIsMobile(mql.matches)
    }
    
    updateMobile()
    mql.addEventListener("change", updateMobile)
    
    const handleResize = () => {
      setIsMobile(mql.matches)
    }
    window.addEventListener("resize", handleResize)
    
    return () => {
      mql.removeEventListener("change", updateMobile)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return isMobile
}

function revLabel() {
  const d = new Date()
  return `${d.toLocaleDateString("en-US", { month: "long" })} ${d.getFullYear()}`
}

function padVerb(verb: string, width: number) {
  return verb.padEnd(width).slice(0, width)
}

/** Hover: LOC text vertical-slides to alternate text. GSAP-driven. */
function LocHoverReveal({
  defaultText,
  hoverText,
  slotWidthCh,
  className = "",
}: {
  defaultText: string
  hoverText: string
  slotWidthCh: number
  className?: string
}) {
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const defaultRef = useRef<HTMLSpanElement>(null)
  const hoverRef = useRef<HTMLSpanElement>(null)
  const isHoveredRef = useRef(false)

  useEffect(() => {
    const hoverEl = hoverRef.current
    if (hoverEl) gsap.set(hoverEl, { yPercent: 100 })
  }, [])

  const handleEnter = () => {
    if (isHoveredRef.current) return
    isHoveredRef.current = true
    const out = defaultRef.current
    const in_ = hoverRef.current
    if (!out || !in_) return
    gsap.to(out, { yPercent: -100, duration: 0.28, ease: "power2.inOut" })
    gsap.to(in_, { yPercent: 0, duration: 0.28, ease: "power2.inOut" })
  }

  const handleLeave = () => {
    if (!isHoveredRef.current) return
    isHoveredRef.current = false
    const out = hoverRef.current
    const in_ = defaultRef.current
    if (!out || !in_) return
    gsap.to(out, { yPercent: -100, duration: 0.28, ease: "power2.inOut" })
    gsap.to(in_, {
      yPercent: 0,
      duration: 0.28,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(out, { yPercent: 100 })
      },
    })
  }

  const def = padVerb(defaultText, slotWidthCh)
  const hov = padVerb(hoverText, slotWidthCh)

  return (
    <span
      ref={wrapperRef}
      className={`inline-block overflow-hidden align-middle cursor-default ${className}`}
      style={{ height: "1.25em", lineHeight: "1.25em", minWidth: `${slotWidthCh}ch` }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      tabIndex={0}
      role="text"
      aria-label={`${defaultText}; hover for ${hoverText.replace(/_/g, " ")}`}
    >
      <span className="block relative w-full" style={{ height: "1.25em" }}>
        <span
          ref={defaultRef}
          className="absolute left-0 top-0 w-full tabular-nums whitespace-pre leading-[1.25em]"
          style={{ minWidth: `${slotWidthCh}ch` }}
        >
          {def}
        </span>
        <span
          ref={hoverRef}
          className="absolute left-0 top-0 w-full tabular-nums whitespace-pre text-green-500 leading-[1.25em]"
          style={{ minWidth: `${slotWidthCh}ch` }}
        >
          {hov}
        </span>
      </span>
    </span>
  )
}

/** Two-slot vertical slide: current verb slides up, next slides up from below. */
function ModeVerbRotator({
  verbs,
  slotWidthCh,
  className = "",
}: {
  verbs: string[]
  slotWidthCh: number
  className?: string
}) {
  const [index, setIndex] = useState(0)
  const [activeSlot, setActiveSlot] = useState(0)
  const activeSlotRef = useRef(0)
  const slot0Ref = useRef<HTMLSpanElement>(null)
  const slot1Ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const s1 = slot1Ref.current
    if (s1) gsap.set(s1, { yPercent: 100 })
  }, [])

  useEffect(() => {
    if (verbs.length <= 1) return
    const tick = () => {
      const outSlot = activeSlotRef.current === 0 ? slot0Ref.current : slot1Ref.current
      const inSlot = activeSlotRef.current === 0 ? slot1Ref.current : slot0Ref.current
      if (!outSlot || !inSlot) return
      const n = verbs.length
      gsap.to(outSlot, {
        yPercent: -100,
        duration: 0.32,
        ease: "power2.inOut",
      })
      gsap.to(inSlot, {
        yPercent: 0,
        duration: 0.32,
        ease: "power2.inOut",
        onComplete: () => {
          activeSlotRef.current = 1 - activeSlotRef.current
          setIndex((i) => (i + 1) % n)
          setActiveSlot(activeSlotRef.current)
          gsap.set(outSlot, { yPercent: 100 })
        },
      })
    }
    const id = setInterval(tick, MODE_ROTATE_MS)
    return () => clearInterval(id)
  }, [verbs.length])

  const n = verbs.length
  const text0 = padVerb(verbs[activeSlot === 0 ? index % n : (index + 1) % n], slotWidthCh)
  const text1 = padVerb(verbs[activeSlot === 0 ? (index + 1) % n : index % n], slotWidthCh)

  return (
    <span
      className={`inline-block overflow-hidden align-middle ${className}`}
      style={{ height: "1.25em", lineHeight: "1.25em", minWidth: `${slotWidthCh}ch` }}
      aria-live="polite"
      aria-atomic
    >
      <span className="block relative w-full" style={{ height: "1.25em" }}>
        <span
          ref={slot0Ref}
          className="absolute left-0 top-0 w-full tabular-nums whitespace-pre leading-[1.25em]"
          style={{ minWidth: `${slotWidthCh}ch` }}
        >
          {text0}
        </span>
        <span
          ref={slot1Ref}
          className="absolute left-0 top-0 w-full tabular-nums whitespace-pre leading-[1.25em]"
          style={{ minWidth: `${slotWidthCh}ch` }}
        >
          {text1}
        </span>
      </span>
    </span>
  )
}

/** Social links with globe copy functionality */
function SocialLinks({ className = "" }: { className?: string }) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const socialIconsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!socialIconsRef.current) return
    const icons = socialIconsRef.current.querySelectorAll("[data-social-icon]")
    if (icons.length === 0) return
    gsap.fromTo(
      icons,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.45, delay: 0.3, stagger: 0.07, ease: "power3.out" }
    )
  }, [])

  const copySiteUrl = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(SITE_URL)
      setCopied(true)
      toast({ title: "Copied!", description: SITE_URL })
      window.setTimeout(() => setCopied(false), 1200)
    }
  }

  return (
    <div ref={socialIconsRef} className={`flex flex-wrap items-center gap-1 ${className}`}>
      {[
        { href: "https://github.com/ryofujimura", Icon: Github, label: "GitHub", external: true },
        { href: "https://linkedin.com/in/ryofujimura", Icon: Linkedin, label: "LinkedIn", external: true },
        { href: "mailto:ryo.fujimura1@gmail.com", Icon: Mail, label: "Email", external: false },
      ].map(({ href, Icon, label, external }) => (
        <span key={label} data-social-icon className="inline-flex">
          <MagneticButton
            as="a"
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="touch-target p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-all [&_svg]:stroke-current"
          >
            <Icon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
            <span className="sr-only">{label}</span>
          </MagneticButton>
        </span>
      ))}
      <span data-social-icon className="inline-flex">
        <MagneticButton
          as="button"
          onClick={copySiteUrl}
          cursorText="COPY"
          className="touch-target p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-all [&_svg]:stroke-current"
          aria-label={copied ? "Site URL copied" : "Copy site URL"}
        >
          <span className="relative w-5 h-5 shrink-0">
            <Globe
              className={`absolute inset-0 w-5 h-5 transition-all duration-200 ${
                copied ? "opacity-0 scale-75" : "opacity-100 scale-100"
              }`}
              strokeWidth={1.5}
            />
            <Check
              className={`absolute inset-0 w-5 h-5 transition-all duration-200 ${
                copied ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
              strokeWidth={1.8}
            />
          </span>
        </MagneticButton>
      </span>
    </div>
  )
}

/** Technical SVG frame element */
function TechnicalFrame({ className = "" }: { className?: string }) {
  const frameRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!frameRef.current) return
    const paths = frameRef.current.querySelectorAll("path, line, rect")
    
    paths.forEach((el) => {
      const geom = el as SVGGeometryElement
      if (typeof geom.getTotalLength === "function") {
        try {
          const len = geom.getTotalLength()
          gsap.set(geom, { strokeDasharray: len, strokeDashoffset: len })
        } catch {
          // Skip
        }
      }
    })

    gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 1.5,
      stagger: 0.1,
      ease: "power2.inOut",
      delay: 0.5,
    })
  }, [])

  return (
    <svg
      ref={frameRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
    >
      {/* Corner brackets */}
      <path d="M 0 15 L 0 0 L 15 0" strokeWidth="0.5" className="text-foreground/20" />
      <path d="M 85 0 L 100 0 L 100 15" strokeWidth="0.5" className="text-foreground/20" />
      <path d="M 100 85 L 100 100 L 85 100" strokeWidth="0.5" className="text-foreground/20" />
      <path d="M 15 100 L 0 100 L 0 85" strokeWidth="0.5" className="text-foreground/20" />
      {/* Center crosshairs */}
      <line x1="48" y1="50" x2="52" y2="50" strokeWidth="0.3" className="text-foreground/10" />
      <line x1="50" y1="48" x2="50" y2="52" strokeWidth="0.3" className="text-foreground/10" />
    </svg>
  )
}

/**
 * IntroSection - Brutalist intro combining hero + about content
 * Smooth single scroll with GSAP scroll-triggered animations
 */
export function IntroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const statsGridRef = useRef<HTMLDivElement>(null)
  const stackTickerRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  
  const isMobile = useResponsiveMobile()
  const prefersReducedMotion = useReducedMotion()

  const rev = revLabel()

  // Hero entrance animations (immediate)
  useEffect(() => {
    if (!heroRef.current || prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-intro-animate]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.2,
        }
      )

    }, heroRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  // Stats section scroll-triggered animations
  useEffect(() => {
    if (!statsRef.current || prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Stats grid stagger
      if (statsGridRef.current) {
        const statItems = statsGridRef.current.querySelectorAll("[data-stat]")
        gsap.fromTo(
          statItems,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statsGridRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        )
      }

      // Stack ticker
      if (stackTickerRef.current) {
        gsap.fromTo(
          stackTickerRef.current,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stackTickerRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        )
      }

      // CTA buttons
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current.querySelectorAll("a"),
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        )
      }
    }, statsRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  return (
    <section id="intro" ref={sectionRef} className="relative">
      {/* ═══════════════════════════════════════════════════════════════════
          HERO: Identity
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        ref={heroRef}
        className="relative w-full pt-40 sm:pt-48 pb-24 sm:pb-32"
      >
        {/* Brutalist background */}
        <div className="absolute inset-0 opacity-60">
          <BrutalistBackground variant="dense" />
        </div>
        
        {/* Technical frame overlay */}
        <TechnicalFrame className="opacity-30" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* System status bar */}
          <div 
            data-intro-animate
            className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
          >
            <span>REV: {rev}</span>
            <span className="text-foreground/20">│</span>
            <span className="hidden sm:inline">SYS: OPERATIONAL</span>
          </div>

          {/* Name - Large brutalist typography */}
          <div data-intro-animate className="mb-4 sm:mb-6">
            <h1 className="font-mono text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9]">
              <GSAPText immediate variant="chars" stagger={0.03} duration={0.6}>
                RYO
              </GSAPText>             
              <span className="text-muted-foreground">
                <GSAPText immediate variant="chars" stagger={0.03} duration={0.6} delay={0.3}>
                  FUJIMURA
                </GSAPText>
              </span>
            </h1>
          </div>

          {/* Role descriptor with rotating verb */}
          <div 
            data-intro-animate
            className="font-mono text-sm sm:text-base md:text-lg uppercase tracking-[0.15em] text-foreground/80 mb-6 sm:mb-8"
          >
            <span className="text-muted-foreground">MODE: </span>
            <ModeVerbRotator
              verbs={MODE_VERBS}
              slotWidthCh={isMobile ? VERB_SLOT_CH_MOBILE : VERB_SLOT_CH_DESKTOP}
              className="text-foreground font-bold"
            />
            <br className="sm:hidden" />
            <span className="hidden sm:inline text-foreground/20"> │ </span>
            <span className="text-muted-foreground">LOC: </span>
            <LocHoverReveal
              defaultText={LOC_DEFAULT}
              hoverText={LOC_HOVER}
              slotWidthCh={isMobile ? LOC_SLOT_CH_MOBILE : LOC_SLOT_CH_DESKTOP}
            />
          </div>

          {/* Tagline */}
          <div data-intro-animate className="max-w-xl mb-8 sm:mb-10">
            <p className="font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Software Engineer crafting intelligent systems at the intersection of{" "}
              <span className="text-foreground font-medium">AI/ML</span>,{" "}
              <span className="text-foreground font-medium">Mobile</span>, and{" "}
              <span className="text-foreground font-medium">Full-Stack</span> development.
            </p>
          </div>

          {/* Social links */}
          <div data-intro-animate>
            <SocialLinks />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          STATS: Skills & Info
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        ref={statsRef}
        className="relative w-full pt-8 sm:pt-12 pb-16 sm:pb-24"
      >
        {/* Subtle background variant */}
        <div className="absolute inset-0 opacity-40">
          <BrutalistBackground variant="circuit" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-8 sm:mb-10">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-75" />
            </div>
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-green-500">
              Available for Opportunities
            </span>
          </div>

          {/* Stats Grid */}
          <div 
            ref={statsGridRef} 
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10"
          >
            {[
              { label: "Years Coding", value: "8+", link: null, hash: null },
              { label: "Internships", value: "2", link: "experience", hash: null },
              { label: "Projects Shipped", value: "10+", link: "projects", hash: null },
              { label: "Publications", value: "2", link: null, hash: "#experience-cpx-lab" },
            ].map((stat) => {
              const isLink = !!stat.link || !!stat.hash
              const handleClick = () => {
                if (stat.hash) {
                  // Use hash navigation for specific experience
                  window.location.hash = stat.hash
                } else if (stat.link) {
                  document.getElementById(stat.link)?.scrollIntoView({ behavior: "smooth" })
                }
              }
              return (
                <button
                  key={stat.label}
                  data-stat
                  type="button"
                  onClick={isLink ? handleClick : undefined}
                  disabled={!isLink}
                  className={`
                    relative border bg-background/80 backdrop-blur-sm px-3 py-4 sm:px-4 sm:py-5 
                    flex flex-col justify-between min-h-[5rem] sm:min-h-[5.5rem] text-left
                    transition-all duration-300 group
                    ${isLink 
                      ? "border-foreground/25 cursor-pointer hover:border-foreground hover:shadow-[4px_4px_0_0_var(--foreground)]" 
                      : "border-foreground/15 cursor-default"
                    }
                  `}
                >
                  {/* Technical pattern overlay on hover */}
                  {isLink && (
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      viewBox="0 0 48 48"
                      fill="none"
                      aria-hidden
                    >
                      <line x1="0" y1="0" x2="48" y2="48" stroke="currentColor" strokeWidth="0.3" className="text-foreground/10" />
                      <line x1="48" y1="0" x2="0" y2="48" stroke="currentColor" strokeWidth="0.3" className="text-foreground/10" />
                    </svg>
                  )}
                  <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    {stat.label}
                  </span>
                  <span className="font-mono text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
                    {stat.value}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Stack Ticker */}
          <div 
            ref={stackTickerRef} 
            className="border border-foreground/20 bg-background/50 backdrop-blur-sm overflow-hidden mb-6 sm:mb-8"
          >
            <div className="px-3 py-2 border-b border-foreground/10">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Tech Stack
              </span>
            </div>
            <div className="relative overflow-hidden py-3">
              <div className={`stack-ticker flex gap-8 whitespace-nowrap ${prefersReducedMotion ? "" : "animate-ticker"}`}>
                {[
                  "Python", "Swift", "Kotlin", "TypeScript", "React", 
                  "Firebase", "PyTorch", "CoreML", "On-device LLMs", 
                  "CUDA", "Docker", "Node.js", "REST APIs"
                ].map((tech, i) => (
                  <span 
                    key={i} 
                    className="font-mono text-sm sm:text-base text-foreground/80"
                  >
                    {tech}
                  </span>
                ))}
                {/* Duplicate for seamless loop */}
                {[
                  "Python", "Swift", "Kotlin", "TypeScript", "React", 
                  "Firebase", "PyTorch", "CoreML", "On-device LLMs", 
                  "CUDA", "Docker", "Node.js", "REST APIs"
                ].map((tech, i) => (
                  <span 
                    key={`dup-${i}`} 
                    className="font-mono text-sm sm:text-base text-foreground/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Focus Areas */}
          <div className="flex flex-wrap gap-2 mb-8 sm:mb-10">
            {["AI / ML", "Mobile", "Backend", "Full-Stack"].map((area) => (
              <span 
                key={area}
                className="font-mono text-[10px] sm:text-xs uppercase tracking-wider px-3 py-1.5 border border-foreground/30 text-foreground/70 bg-background/50"
              >
                {area}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <MagneticButton
              as="a"
              href="#experience"
              className="touch-target group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] text-xs sm:text-sm font-mono uppercase tracking-wider text-primary-foreground bg-primary border-2 border-primary hover:bg-transparent hover:text-primary transition-all duration-300"
            >
              View Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </MagneticButton>
            <MagneticButton
              as="a"
              href="#contact"
              className="touch-target group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] text-xs sm:text-sm font-mono uppercase tracking-wider text-foreground bg-transparent border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
            >
              Contact
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform shrink-0" />
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* CSS for ticker animation */}
      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
