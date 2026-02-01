"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { gsap } from "gsap"
import { useIsMobile } from "@/hooks/use-mobile"
import { GSAPText } from "@/components/gsap-text"

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

/**
 * IntroSection - Brutalist intro combining hero + about content
 * Uses CSS scroll-snap for paginated reveal on scroll
 */
export function IntroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const rev = revLabel()

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
          className="snap-page relative flex items-center justify-center px-4 sm:px-6"
          style={{
            scrollSnapAlign: "start",
            minHeight: "100dvh",
            height: "100vh",
          }}
        >
          <div className="w-full max-w-5xl mx-auto">
            {/* Placeholder for data content */}
            <div className="font-mono text-foreground/30 text-xs uppercase tracking-widest">
              [PAGE 2: DATA + ACTION]
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
      `}</style>
    </section>
  )
}
