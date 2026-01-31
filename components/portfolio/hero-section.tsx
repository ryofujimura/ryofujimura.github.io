"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { gsap } from "gsap"
import { GSAPText } from "@/components/gsap-text"
import { HeroTechnicalCanvas } from "@/components/hero-technical-canvas"
import { HeroBrutalistAscii } from "@/components/hero-brutalist-ascii"
import { MagneticButton } from "@/components/magnetic-button"
import { useToast } from "@/hooks/use-toast"
import { ArrowDown, ArrowRight, Check, Github, Globe, Linkedin, Mail, Mouse } from "lucide-react"

const SITE_URL = "https://ryofujimura.github.io/"

// Exact-length lines so the terminal block is always a complete rectangle
const ASCII_W = 70
const ASCII_MOBILE_W = 32

// Verbs under "mode:" — rotate every few seconds with vertical GSAP slide
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
]
const MODE_ROTATE_MS = 2600
const VERB_SLOT_CH_DESKTOP = 11
const VERB_SLOT_CH_MOBILE = 7

function revLabel() {
  const d = new Date()
  return `${d.toLocaleDateString("en-US", { month: "long" })} ${d.getFullYear()}`
}

function padVerb(verb: string, width: number) {
  return verb.padEnd(width).slice(0, width)
}

const LOC_DEFAULT = "IRVINE_CA"
const LOC_HOVER = "OPEN_TO_RELOCATE"
const LOC_SLOT_CH_DESKTOP = 16
const LOC_SLOT_CH_MOBILE = 16

/** Hover: LOC text vertical-slides to "OPEN_TO_RELOCATE". GSAP-driven. */
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

/** Two-slot vertical slide: current verb slides up, next slides up from below. GSAP-driven. */
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

  // Initial positions: slot0 in view (0), slot1 below (100%)
  useEffect(() => {
    const s1 = slot1Ref.current
    if (s1) gsap.set(s1, { yPercent: 100 })
  }, [])

  // Single interval; ref tracks which slot is in view so we don’t reset timer every tick
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

export function HeroSection() {
  const asciiBlockRef = useRef<HTMLDivElement>(null)
  const socialIconsRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const rev = revLabel()
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
  const locLineLeftDesktop = "║   SYS_ID: RF.001   │   CLASS: ENGINEER   │   LOC: "
  const locLineRightDesktop = " ".repeat(3) + "║"
  const locLineLeftMobile = " RF.001 │ ENG │ "
  const locLineRightMobile = "║"
  const modeLineLeftDesktop = "║   mode: "
  const modeLineRightDesktop = ("│   status: AVAILABLE │   rev: " + rev).padEnd(50) + "║"
  const modeLineLeftMobile = " AVAILABLE │ "
  const modeLineRightMobile = ((" │ " + rev).slice(0, 11)).padEnd(11)

  const locLineDesktopRef = useRef<HTMLSpanElement>(null)
  const locLineMobileRef = useRef<HTMLSpanElement>(null)
  const modeLineDesktopRef = useRef<HTMLSpanElement>(null)
  const modeLineMobileRef = useRef<HTMLSpanElement>(null)

  // GSAP: line 1 (LOC) and line 2 (mode) entrance — same stagger as other ASCII lines
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

  // GSAP: stagger-in social icons (GitHub, LinkedIn, Email, Globe)
  useEffect(() => {
    if (!socialIconsRef.current) return
    const icons = socialIconsRef.current.querySelectorAll("[data-social-icon]")
    if (icons.length === 0) return
    gsap.fromTo(
      icons,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.45, delay: 1.55, stagger: 0.07, ease: "power3.out" }
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
    <section
      className="relative min-h-[100dvh] min-h-screen flex items-center justify-center px-3 sm:px-6 pt-[max(4rem,env(safe-area-inset-top))] pb-6 sm:pb-8 overflow-hidden"
      aria-label="Hero"
    >
      <div className="hidden sm:block absolute inset-0">
        <HeroTechnicalCanvas />
      </div>

      {/* Brutalist ASCII animation - laptop/desktop only (lg+) */}
      <div className="hidden lg:block absolute inset-0">
        <HeroBrutalistAscii />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-0">
        <div className="flex flex-col items-start gap-4 sm:gap-6 md:gap-8">
          {/* ASCII terminal block — complete rectangle; mobile = short, desktop = full */}
          <div
            ref={asciiBlockRef}
            className="font-mono text-foreground/50 whitespace-pre tabular-nums touch-manipulation w-full min-w-0"
            style={{ fontFamily: "ui-monospace, monospace" }}
          >
            {/* Mobile: 34-char block; line 1 = LOC hover, line 2 = mode verb rotator */}
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
            {/* Desktop: 67-char block; line 1 = LOC hover, line 2 = mode verb rotator */}
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

          {/* Role line — scramble then hold */}
          <GSAPText
            variant="scramble"
            delay={0.5}
            immediate
            className="text-[9px] sm:text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground"
          >
            Software Engineer & AI Researcher
          </GSAPText>

          {/* Name — brutalist type, char stagger; mobile-tighter */}
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

          {/* Tagline — word reveal */}
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

          {/* ASCII divider + quote */}
          <div className="pt-2 sm:pt-4 border-t border-foreground/20 w-full max-w-xl">
            <GSAPText
              variant="lines"
              delay={1.6}
              duration={0.4}
              immediate
              className="font-mono text-[9px] sm:text-[10px] md:text-xs text-muted-foreground/70 italic"
            >
              {"// Simplicity is the ultimate sophistication. — Leonardo da Vinci"}
            </GSAPText>
          </div>

          {/* CTAs — blocky brutalist buttons; mobile stacking, 44px+ touch */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 pt-3 sm:pt-6 w-full sm:w-auto">
            <MagneticButton
              as="a"
              href="#experience"
              className="touch-target group relative inline-flex items-center justify-center gap-1.5 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 min-h-[48px] text-xs sm:text-sm font-mono uppercase tracking-wider text-primary-foreground bg-primary border-2 border-primary hover:bg-transparent hover:text-primary transition-all duration-300"
            >
              View Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </MagneticButton>
            <MagneticButton
              as="a"
              href="#contact"
              className="touch-target group inline-flex items-center justify-center gap-1.5 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 min-h-[48px] text-xs sm:text-sm font-mono uppercase tracking-wider text-foreground bg-transparent border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
            >
              Contact
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform shrink-0" />
            </MagneticButton>
          </div>

          {/* Social — monotone Lucide icons; GSAP stagger-in; globe copies site URL */}
          <div ref={socialIconsRef} className="flex flex-wrap items-center gap-0.5 sm:gap-1 pt-2 sm:pt-4">
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
        </div>
      </div>

      {/* Scroll cue — ASCII; compact on mobile */}
      <div className="absolute bottom-3 sm:bottom-8 left-1/2 -translate-x-1/2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex flex-col items-center gap-1.5 sm:gap-4">
          <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] sm:tracking-[0.4em] text-muted-foreground">
            <Mouse className="w-3 h-3 shrink-0" strokeWidth={1.5} />
            scroll
          </span>
          <div className="w-px h-8 sm:h-16 bg-foreground/20 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-5 sm:h-8 bg-foreground"
              style={{ animation: "heroScrollLine 2s ease-in-out infinite" }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes heroScrollLine {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(200%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  )
}
