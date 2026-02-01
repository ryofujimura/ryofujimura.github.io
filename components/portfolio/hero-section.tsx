"use client"

import { useRef, useState, useEffect } from "react"
import { gsap } from "gsap"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { GSAPText } from "@/components/gsap-text"
import { BrutalistBackground } from "@/components/brutalist-background"
import { BrutalistPortrait } from "@/components/brutalist-portrait"
import { MagneticButton } from "@/components/magnetic-button"
import { useToast } from "@/hooks/use-toast"
import { Check, Github, Globe, Linkedin, Mail } from "lucide-react"

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
 * HeroSection - Brutalist hero with name, role, and social links
 */
export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
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

  return (
    <section id="hero" className="relative">
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
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 xl:gap-16 items-start">
            {/* Left column - Text content */}
            <div className="order-2 lg:order-1">
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

            {/* Right column - Portrait */}
            <div 
              data-intro-animate 
              className="order-1 lg:order-2 w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px] xl:max-w-[380px] mx-auto lg:mx-0 lg:mt-8"
            >
              <BrutalistPortrait
                src="/images/profile.jpg"
                alt="Ryo Fujimura - Software Engineer"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
