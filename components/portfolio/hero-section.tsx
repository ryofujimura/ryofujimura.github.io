"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { GSAPText, GSAPSVG } from "@/components/gsap-text"
import { HeroTechnicalPattern } from "@/components/hero-technical-pattern"
import { MagneticButton } from "@/components/magnetic-button"
import { ArrowDown, ArrowRight, Mail } from "lucide-react"
import { LocationHoverText } from "@/components/portfolio/location-hover-text"

gsap.registerPlugin(ScrollTrigger)

const ASCII_HEADER = `╔══════════════════════════════════════════════════════════════╗
║  FOLIO.RF  │  2025  │  STATUS: AVAILABLE_FOR_WORK  │  Irvine, CA  ║
╚══════════════════════════════════════════════════════════════╝`

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const asciiFrameRef = useRef<HTMLPreElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isTouch, setIsTouch] = useState(false)

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

  // ASCII frame lines animate in on load
  useEffect(() => {
    if (!asciiFrameRef.current) return
    const lines = asciiFrameRef.current.querySelectorAll(".ascii-line")
    if (lines.length === 0) return
    gsap.fromTo(
      lines,
      { opacity: 0, x: -12 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.06,
        delay: 0.15,
        ease: "power2.out",
      }
    )
  }, [])

  const schematicTilt = !isTouch
    ? { rotateY: mousePosition.x * 4, rotateX: -mousePosition.y * 4 }
    : { rotateY: 0, rotateX: 0 }

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] min-h-screen flex items-center justify-center px-3 sm:px-6 pt-[max(5rem,env(safe-area-inset-top))] pb-8 overflow-hidden bg-background"
    >
      {/* Layer 1: dense technical grid — brutalist base */}
      <div
        className="absolute inset-0 bg-brutalist-grid opacity-[0.06]"
        style={{ backgroundSize: "20px 20px" }}
        aria-hidden
      />

      {/* Layer 2: complex technical pattern — isometric lines, crosshairs, dimensions */}
      <HeroTechnicalPattern />

      {/* Layer 3: corner brackets — technical frame */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <GSAPSVG
          className="absolute top-6 left-6 w-14 h-14 text-foreground/25"
          duration={1}
          delay={0.4}
          runOnceOnMount
        >
          <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M0 20V0h20M0 36v20h20" />
          </svg>
        </GSAPSVG>
        <GSAPSVG
          className="absolute top-6 right-6 w-14 h-14 text-foreground/25"
          duration={1}
          delay={0.5}
          runOnceOnMount
        >
          <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M56 20V0H36M56 36v20H36" />
          </svg>
        </GSAPSVG>
        <GSAPSVG
          className="absolute bottom-6 left-6 w-14 h-14 text-foreground/25"
          duration={1}
          delay={0.6}
          runOnceOnMount
        >
          <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M0 36v20h20M0 20V0h20" />
          </svg>
        </GSAPSVG>
        <GSAPSVG
          className="absolute bottom-6 right-6 w-14 h-14 text-foreground/25"
          duration={1}
          delay={0.7}
          runOnceOnMount
        >
          <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M56 36v20H36M56 20V0H36" />
          </svg>
        </GSAPSVG>
      </div>

      {/* Main content — ASCII viewport frame + typography */}
      <div className="max-w-5xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-[1fr,minmax(280px,400px)] gap-8 lg:gap-12 items-center">
          <div className="space-y-3 sm:space-y-5">
            {/* ASCII header — line-by-line GSAP */}
            <pre
              ref={asciiFrameRef}
              className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] text-muted-foreground/70 overflow-x-auto py-0 touch-manipulation whitespace-pre border border-foreground/10 bg-background/80 px-2 py-1.5"
              aria-hidden
            >
              {ASCII_HEADER.split("\n").map((line, i) => (
                <span key={i} className="ascii-line block">
                  {line}
                </span>
              ))}
            </pre>

            {/* Role — scramble on load */}
            <GSAPText
              variant="scramble"
              className="text-[10px] xs:text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground block"
              delay={0.5}
              runOnceOnMount
            >
              SOFTWARE ENGINEER & AI RESEARCHER
            </GSAPText>

            {/* Main title — brutalist lockup, char stagger on load */}
            <div className="space-y-0 leading-[0.88]">
              <GSAPText
                variant="chars"
                className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-foreground tracking-[-0.04em] font-mono block"
                stagger={0.028}
                duration={0.5}
                delay={0.35}
                runOnceOnMount
              >
                RYO
              </GSAPText>
              <GSAPText
                variant="chars"
                className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-foreground tracking-[-0.04em] font-mono block"
                stagger={0.028}
                duration={0.5}
                delay={0.55}
                runOnceOnMount
              >
                FUJIMURA
              </GSAPText>
            </div>

            {/* One-line tagline */}
            <GSAPText
              variant="lines"
              className="text-sm sm:text-base text-muted-foreground max-w-md font-mono"
              delay={1}
              runOnceOnMount
            >
              Building intelligent systems at the intersection of AI and applied research.
            </GSAPText>

            {/* CTAs — brutalist buttons */}
            <div className="flex flex-wrap gap-3 pt-2 sm:pt-4">
              <MagneticButton
                as="a"
                href="#projects"
                className="touch-target group inline-flex items-center gap-2 px-5 sm:px-6 py-3 min-h-[48px] text-xs font-mono uppercase tracking-widest text-primary-foreground bg-primary border-2 border-primary hover:bg-transparent hover:text-primary transition-colors"
              >
                &gt; view work
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </MagneticButton>
              <MagneticButton
                as="a"
                href="#contact"
                className="touch-target group inline-flex items-center gap-2 px-5 sm:px-6 py-3 min-h-[48px] text-xs font-mono uppercase tracking-widest text-foreground bg-transparent border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                &gt; contact
                <ArrowDown className="w-3.5 h-3.5 shrink-0" />
              </MagneticButton>
            </div>

            {/* Social + location — compact */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-0.5">
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
                      className="touch-target p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-colors"
                    >
                      {"img" in item ? (
                        <img src={item.img} alt="" className="w-4 h-4 object-contain" width={16} height={16} />
                      ) : (
                        Icon && <Icon className="w-4 h-4" />
                      )}
                      <span className="sr-only">{item.label}</span>
                    </MagneticButton>
                  )
                })}
              </div>
              <span className="text-muted-foreground/60 font-mono text-[10px]">|</span>
              <LocationHoverText
                defaultWords={["Irvine", ", ", "CA"]}
                hoverWords={["Open", " to", "relocate"]}
                className="text-[10px] font-mono text-muted-foreground"
              />
            </div>
          </div>

          {/* Right: technical schematic + profile — desktop */}
          <div className="hidden lg:block relative">
            <div
              className="relative aspect-square max-w-[340px] mx-auto"
              style={{
                transform: `perspective(1000px) rotateY(${schematicTilt.rotateY}deg) rotateX(${schematicTilt.rotateX}deg)`,
                transition: "transform 0.2s ease-out",
              }}
            >
              {/* Schematic SVG — stroke draw on load */}
              <GSAPSVG
                className="absolute inset-0 text-foreground/20"
                duration={2}
                delay={0.6}
                runOnceOnMount
              >
                <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="0.6">
                  <rect x="80" y="80" width="240" height="240" />
                  <rect x="100" y="60" width="240" height="240" opacity="0.6" />
                  <line x1="80" y1="80" x2="100" y2="60" opacity="0.5" />
                  <line x1="320" y1="80" x2="340" y2="60" opacity="0.5" />
                  <line x1="80" y1="320" x2="100" y2="300" opacity="0.5" />
                  <line x1="320" y1="320" x2="340" y2="300" opacity="0.5" />
                  <circle cx="200" cy="200" r="70" opacity="0.4" />
                  <line x1="200" y1="130" x2="200" y2="270" opacity="0.35" />
                  <line x1="130" y1="200" x2="270" y2="200" opacity="0.35" />
                  <line x1="155" y1="175" x2="245" y2="225" opacity="0.3" />
                  <line x1="245" y1="175" x2="155" y2="225" opacity="0.3" />
                </svg>
              </GSAPSVG>

              {/* Profile — brutalist frame */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 border-[3px] border-foreground bg-background shadow-[5px_5px_0_0_var(--foreground)] overflow-hidden">
                  <img
                    src="/images/profile.jpg"
                    alt="Ryo Fujimura"
                    className="w-full h-full object-cover object-top"
                    width={176}
                    height={176}
                  />
                  <span className="absolute bottom-0.5 right-0.5 font-mono text-[7px] text-foreground/50 bg-background px-0.5">RF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue — ASCII */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[9px] font-mono uppercase tracking-[0.35em] text-muted-foreground/80">
            &gt; scroll
          </span>
          <div className="w-px h-8 sm:h-12 bg-foreground/25 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-4 bg-foreground/60"
              style={{ animation: "slideDown 2s ease-in-out infinite" }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(180%); }
          100% { transform: translateY(180%); }
        }
      `}</style>
    </section>
  )
}
