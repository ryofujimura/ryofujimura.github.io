"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useIsMobile } from "@/hooks/use-mobile"
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

// ASCII terminal dimensions
const ASCII_W = 70
const ASCII_MOBILE_W = 32

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
const VERB_SLOT_CH_MOBILE = 7

// Location config
const LOC_DEFAULT = "IRVINE_CA"
const LOC_HOVER = "OPEN_TO_RELOCATE"
const LOC_SLOT_CH_DESKTOP = 16
const LOC_SLOT_CH_MOBILE = 16

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
      className={`inline-block overflow-hidden align-top cursor-default ${className}`}
      style={{ height: "1em", minWidth: `${slotWidthCh}ch` }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      tabIndex={0}
      role="text"
      aria-label={`${defaultText}; hover for ${hoverText.replace(/_/g, " ")}`}
    >
      <span className="block relative w-full" style={{ height: "1em" }}>
        <span
          ref={defaultRef}
          className="absolute left-0 top-0 w-full tabular-nums whitespace-pre"
          style={{ minWidth: `${slotWidthCh}ch` }}
        >
          {def}
        </span>
        <span
          ref={hoverRef}
          className="absolute left-0 top-0 w-full tabular-nums whitespace-pre"
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
      className={`inline-block overflow-hidden align-top ${className}`}
      style={{ height: "1em", minWidth: `${slotWidthCh}ch` }}
      aria-live="polite"
      aria-atomic
    >
      <span className="block relative w-full" style={{ height: "1em" }}>
        <span
          ref={slot0Ref}
          className="absolute left-0 top-0 w-full tabular-nums whitespace-pre"
          style={{ minWidth: `${slotWidthCh}ch` }}
        >
          {text0}
        </span>
        <span
          ref={slot1Ref}
          className="absolute left-0 top-0 w-full tabular-nums whitespace-pre"
          style={{ minWidth: `${slotWidthCh}ch` }}
        >
          {text1}
        </span>
      </span>
    </span>
  )
}

/** Social links with globe copy functionality */
function SocialLinks() {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const socialIconsRef = useRef<HTMLDivElement>(null)

  // GSAP stagger-in animation
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
    <div ref={socialIconsRef} className="flex flex-wrap items-center gap-1 pt-2">
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

/**
 * IntroSection - Brutalist intro combining hero + about content
 * Uses CSS scroll-snap for paginated reveal on scroll
 */
export function IntroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const page2Ref = useRef<HTMLDivElement>(null)
  const statsGridRef = useRef<HTMLDivElement>(null)
  const stackTickerRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const rev = revLabel()

  // Page 2 GSAP entrance animations with ScrollTrigger
  useEffect(() => {
    if (!page2Ref.current) return

    const ctx = gsap.context(() => {
      // Stats cards stagger animation
      if (statsGridRef.current) {
        const cards = statsGridRef.current.querySelectorAll("button")
        gsap.set(cards, { opacity: 0, y: isMobile ? 20 : 30 })
        
        ScrollTrigger.create({
          trigger: statsGridRef.current,
          start: () => isMobile ? "top 90%" : "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(cards, {
              opacity: 1,
              y: 0,
              duration: isMobile ? 0.4 : 0.6,
              stagger: isMobile ? 0.08 : 0.1,
              ease: "power3.out",
            })
          },
        })
      }

      // Stack ticker fade in
      if (stackTickerRef.current) {
        gsap.set(stackTickerRef.current, { opacity: 0, x: isMobile ? -20 : -30 })
        
        ScrollTrigger.create({
          trigger: stackTickerRef.current,
          start: () => isMobile ? "top 95%" : "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(stackTickerRef.current, {
              opacity: 1,
              x: 0,
              duration: isMobile ? 0.5 : 0.7,
              ease: "power2.out",
            })
          },
        })
      }

      // CTA buttons entrance
      if (ctaRef.current) {
        const buttons = ctaRef.current.querySelectorAll("a")
        gsap.set(buttons, { opacity: 0, y: 15 })
        
        ScrollTrigger.create({
          trigger: ctaRef.current,
          start: () => isMobile ? "top 95%" : "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(buttons, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.1,
              ease: "power3.out",
            })
          },
        })
      }
    }, page2Ref)

    return () => ctx.revert()
  }, [isMobile])

  // ASCII terminal lines
  const asciiHeaderLines = useMemo(() => {
    return [
      "╔" + "═".repeat(ASCII_W) + "╗",
      null, // line 1 = custom LOC hover reveal
      null, // line 2 = custom mode + rotator
      "╚" + "═".repeat(ASCII_W) + "╝",
    ]
  }, [])

  const asciiHeaderLinesMobile = useMemo(() => {
    return [
      "╔" + "═".repeat(ASCII_MOBILE_W) + "╗",
      null,
      null,
      "╚" + "═".repeat(ASCII_MOBILE_W) + "╝",
    ]
  }, [])

  // ASCII line content templates
  const locLineLeftDesktop = "║   SYS_ID: RF.001   │   CLASS: ENGINEER   │   LOC: "
  const locLineRightDesktop = " ".repeat(3) + "║"
  const locLineLeftMobile = " RF.001 │ ENG │ "
  const locLineRightMobile = "║"
  const modeLineLeftDesktop = "║   mode: "
  const modeLineRightDesktop = ("│   status: AVAILABLE │   rev: " + rev).padEnd(50) + "║"
  const modeLineLeftMobile = " AVAILABLE │ "
  const modeLineRightMobile = ((" │ " + rev).slice(0, 11)).padEnd(11)

  // Refs for GSAP line animations
  const locLineDesktopRef = useRef<HTMLSpanElement>(null)
  const locLineMobileRef = useRef<HTMLSpanElement>(null)
  const modeLineDesktopRef = useRef<HTMLSpanElement>(null)
  const modeLineMobileRef = useRef<HTMLSpanElement>(null)

  // GSAP: line entrance animations
  useEffect(() => {
    const run = () => {
      const animate = (el: HTMLSpanElement | null, delay: number, duration: number) => {
        if (!el) return
        gsap.fromTo(el, { y: "100%" }, { y: 0, delay, duration, ease: "power4.out" })
      }
      animate(locLineDesktopRef.current, 0.15 + 1 * 0.06, 0.4)
      animate(locLineMobileRef.current, 0.15 + 1 * 0.06, 0.35)
      animate(modeLineDesktopRef.current, 0.15 + 2 * 0.06, 0.4)
      animate(modeLineMobileRef.current, 0.15 + 2 * 0.06, 0.35)
    }
    const t = setTimeout(run, 0)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative"
      aria-label="Introduction"
    >
      {/* Scroll Snap Container */}
      <div 
        className="snap-container"
        style={{
          scrollSnapType: "y mandatory",
          overflowY: "auto",
          height: "100dvh",
          minHeight: "100vh",
        }}
      >
        {/* Page 1: Identity */}
        <div 
          className="snap-page relative flex items-center justify-center px-3 sm:px-6 pt-[max(4rem,env(safe-area-inset-top))] pb-6 sm:pb-8 overflow-hidden"
          style={{
            scrollSnapAlign: "start",
            minHeight: "100dvh",
            height: "100vh",
          }}
        >
          {/* Technical Background - Hidden on mobile for performance */}
          <div className="hidden sm:block">
            <BrutalistBackground variant="full" />
          </div>

          <div className="relative z-10 w-full max-w-5xl mx-auto px-0">
            <div className="flex flex-col items-start gap-4 sm:gap-6 md:gap-8">
              
              {/* ASCII Terminal Block */}
              <div
                className="font-mono text-foreground/50 whitespace-pre tabular-nums touch-manipulation w-full min-w-0"
                style={{ fontFamily: "ui-monospace, monospace" }}
              >
                {/* Mobile ASCII */}
                <div className="block sm:hidden text-[9px] leading-tight overflow-x-auto scrollbar-hide" style={{ minWidth: "34ch" }}>
                  {asciiHeaderLinesMobile.map((line, i) =>
                    line === null && i === 1 ? (
                      <div key="m-1" className="block overflow-hidden leading-tight">
                        <span
                          ref={locLineMobileRef}
                          className="block translate-y-full"
                          style={{ fontFamily: "ui-monospace, monospace" }}
                        >
                          {"║"}
                          {locLineLeftMobile}
                          <LocHoverReveal
                            defaultText={LOC_DEFAULT}
                            hoverText={LOC_HOVER}
                            slotWidthCh={LOC_SLOT_CH_MOBILE}
                            className="text-foreground/50"
                          />
                          {locLineRightMobile}
                        </span>
                      </div>
                    ) : line === null && i === 2 ? (
                      <div key="m-2" className="block overflow-hidden leading-tight">
                        <span
                          ref={modeLineMobileRef}
                          className="block translate-y-full"
                          style={{ fontFamily: "ui-monospace, monospace" }}
                        >
                          {modeLineLeftMobile}
                          <ModeVerbRotator
                            verbs={MODE_VERBS}
                            slotWidthCh={VERB_SLOT_CH_MOBILE}
                            className="text-foreground/50"
                          />
                          {modeLineRightMobile}
                        </span>
                      </div>
                    ) : (
                      <GSAPText
                        key={`m-${i}`}
                        variant="lines"
                        delay={0.15 + i * 0.06}
                        duration={0.35}
                        immediate
                        className="block leading-tight"
                      >
                        {line ?? ""}
                      </GSAPText>
                    )
                  )}
                </div>

                {/* Desktop ASCII */}
                <div className="hidden sm:block text-[10px] sm:text-[11px] leading-tight overflow-x-auto scrollbar-hide" style={{ minWidth: "min(100%, 67ch)" }}>
                  {asciiHeaderLines.map((line, i) =>
                    line === null && i === 1 ? (
                      <div key="d-1" className="block overflow-hidden leading-tight">
                        <span
                          ref={locLineDesktopRef}
                          className="block translate-y-full"
                          style={{ fontFamily: "ui-monospace, monospace" }}
                        >
                          {locLineLeftDesktop}
                          <LocHoverReveal
                            defaultText={LOC_DEFAULT}
                            hoverText={LOC_HOVER}
                            slotWidthCh={LOC_SLOT_CH_DESKTOP}
                            className="text-foreground/50"
                          />
                          {locLineRightDesktop}
                        </span>
                      </div>
                    ) : line === null && i === 2 ? (
                      <div key="d-2" className="block overflow-hidden leading-tight">
                        <span
                          ref={modeLineDesktopRef}
                          className="block translate-y-full"
                          style={{ fontFamily: "ui-monospace, monospace" }}
                        >
                          {modeLineLeftDesktop}
                          <ModeVerbRotator
                            verbs={MODE_VERBS}
                            slotWidthCh={VERB_SLOT_CH_DESKTOP}
                            className="text-foreground/50"
                          />
                          {modeLineRightDesktop}
                        </span>
                      </div>
                    ) : (
                      <GSAPText
                        key={`d-${i}`}
                        variant="lines"
                        delay={0.15 + i * 0.06}
                        duration={0.4}
                        immediate
                        className="block leading-tight"
                      >
                        {line ?? ""}
                      </GSAPText>
                    )
                  )}
                </div>
              </div>

              {/* Role Line */}
              <GSAPText
                variant="scramble"
                delay={0.5}
                immediate
                className="text-[9px] sm:text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground"
              >
                Software Engineer & AI Researcher
              </GSAPText>

              {/* Name - Brutalist Typography */}
              <div className="space-y-0 leading-[0.88]">
                <GSAPText
                  variant="chars"
                  stagger={0.03}
                  duration={0.45}
                  delay={0.7}
                  immediate
                  className="text-3xl min-[375px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-foreground tracking-tighter font-mono block"
                >
                  RYO
                </GSAPText>
                <GSAPText
                  variant="chars"
                  stagger={0.03}
                  duration={0.45}
                  delay={0.9}
                  immediate
                  className="text-3xl min-[375px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-foreground tracking-tighter font-mono block"
                >
                  FUJIMURA
                </GSAPText>
              </div>

              {/* Tagline */}
              <GSAPText
                variant="words"
                delay={1.25}
                stagger={0.05}
                duration={0.45}
                immediate
                className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground font-mono max-w-xl leading-relaxed"
              >
                Building systems at the intersection of AI research and real-world applications.
              </GSAPText>

            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 pb-[env(safe-area-inset-bottom)]">
            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
                scroll
              </span>
              <div className="w-px h-8 sm:h-12 bg-foreground/20 relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 w-full h-4 bg-foreground/60"
                  style={{ animation: "scrollIndicator 2s ease-in-out infinite" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Page 2: Data + Action */}
        <div 
          ref={page2Ref}
          className="snap-page relative flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16"
          style={{
            scrollSnapAlign: "start",
            minHeight: "100dvh",
            height: "100vh",
          }}
        >
          {/* Subtle background for page 2 */}
          <div className="hidden sm:block opacity-50">
            <BrutalistBackground variant="circuit" />
          </div>

          <div className="relative z-10 w-full max-w-5xl mx-auto">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-start">
              
              {/* Left Column: Stats + Stack */}
              <div className="space-y-8 sm:space-y-10">
                
                {/* Available Badge */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-75" />
                  </div>
                  <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-green-500">
                    Available for Opportunities
                  </span>
                </div>

                {/* Stats Grid */}
                <div ref={statsGridRef} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: "Years Coding", value: "8+", link: null },
                    { label: "Internships", value: "2", link: "experience" },
                    { label: "Projects Shipped", value: "10+", link: "projects" },
                    { label: "Publications", value: "2", link: "publications" },
                  ].map((stat) => {
                    const isLink = !!stat.link
                    const handleClick = () => {
                      if (stat.link) {
                        document.getElementById(stat.link)?.scrollIntoView({ behavior: "smooth" })
                      }
                    }
                    return (
                      <button
                        key={stat.label}
                        type="button"
                        onClick={isLink ? handleClick : undefined}
                        disabled={!isLink}
                        className={`
                          relative border bg-background px-3 py-4 sm:px-4 sm:py-5 
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
                <div ref={stackTickerRef} className="border border-foreground/20 bg-background/50 overflow-hidden">
                  <div className="px-3 py-2 border-b border-foreground/10">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                      Tech Stack
                    </span>
                  </div>
                  <div className="relative overflow-hidden py-3">
                    <div className="stack-ticker flex gap-8 animate-ticker whitespace-nowrap">
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
                <div className="flex flex-wrap gap-2">
                  {["AI / ML", "Mobile", "Backend", "Full-Stack"].map((area) => (
                    <span 
                      key={area}
                      className="font-mono text-[10px] sm:text-xs uppercase tracking-wider px-3 py-1.5 border border-foreground/30 text-foreground/70"
                    >
                      {area}
                    </span>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div ref={ctaRef} className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-4">
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

                {/* Social Links */}
                <SocialLinks />
              </div>

              {/* Right Column: Profile Image */}
              <div className="hidden md:block">
                <div className="relative">
                  {/* Brutalist frame */}
                  <div className="absolute -inset-2 border-2 border-foreground/20" />
                  <div className="absolute -inset-4 border border-foreground/10" />
                  
                  {/* Image */}
                  <div className="w-32 h-32 lg:w-40 lg:h-40 border-[3px] border-foreground bg-background overflow-hidden">
                    <img
                      src="/images/profile.jpg"
                      alt="Ryo Fujimura"
                      className="w-full h-full object-cover object-top"
                      width={160}
                      height={160}
                    />
                  </div>
                  
                  {/* Coordinates */}
                  <button
                    type="button"
                    onClick={() => document.getElementById("hobbies")?.scrollIntoView({ behavior: "smooth" })}
                    className="font-mono text-[8px] text-muted-foreground uppercase tracking-widest mt-2 hover:text-foreground hover:underline transition-colors"
                  >
                    33.67°N, 117.85°W
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug: Mobile indicator */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-50 font-mono text-[10px] bg-background/80 border border-foreground/20 px-2 py-1">
          {isMobile ? "MOBILE" : "DESKTOP"}
        </div>
      )}

      <style jsx>{`
        @keyframes scrollIndicator {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(200%); }
          100% { transform: translateY(200%); }
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </section>
  )
}
