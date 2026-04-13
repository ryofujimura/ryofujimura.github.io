"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

      // Horizontal rule lines sweep in
      tl.fromTo(
        ".hero-rule",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, stagger: 0.15 },
        0
      )

      // System tag fades in
      tl.fromTo(
        ".hero-tag",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.8 },
        0.3
      )

      // Main headline letter-splits
      tl.fromTo(
        ".hero-letter",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.04 },
        0.5
      )

      // Subtext
      tl.fromTo(
        ".hero-sub",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        1.2
      )

      // Decorative SVG lines
      tl.fromTo(
        ".hero-deco-line",
        { strokeDashoffset: 200 },
        { strokeDashoffset: 0, duration: 1.5, stagger: 0.2 },
        0.8
      )

      // Status indicators blink in
      tl.fromTo(
        ".hero-status",
        { opacity: 0 },
        { opacity: 1, duration: 0.4, stagger: 0.1 },
        1.5
      )
    },
    { scope: containerRef }
  )

  const headline = "STL Portfolio"
  const letters = headline.split("")

  return (
    <div ref={containerRef} className="relative flex flex-col gap-6 max-w-xl">
      {/* Top decorative rule */}
      <div className="hero-rule h-px bg-foreground/20 origin-left" />

      {/* System tag */}
      <div className="hero-tag flex items-center gap-3">
        <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
          {"// 3D_MODEL_SYSTEM v2.4"}
        </span>
        <div className="h-px flex-1 bg-border/30" />
      </div>

      {/* Main headline */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-bold tracking-tight leading-none text-foreground overflow-hidden">
        {letters.map((letter, i) => (
          <span
            key={i}
            className="hero-letter inline-block"
            style={{ display: letter === " " ? "inline" : "inline-block" }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </h1>

      {/* Second decorative rule */}
      <div className="hero-rule h-px bg-foreground/10 origin-left" />

      {/* Subtext */}
      <p className="hero-sub font-mono text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-md">
        Precision-engineered 3D assets ready for fabrication.
        <br />
        Interactive viewer. AR-ready. Slicer-compatible.
      </p>

      {/* Decorative SVG */}
      <svg
        className="absolute -right-8 top-0 hidden lg:block"
        width="60"
        height="200"
        viewBox="0 0 60 200"
        fill="none"
        aria-hidden="true"
      >
        <line
          className="hero-deco-line"
          x1="30" y1="0" x2="30" y2="200"
          stroke="hsl(0 0% 30%)"
          strokeWidth="0.5"
          strokeDasharray="200"
        />
        <line
          className="hero-deco-line"
          x1="10" y1="50" x2="50" y2="50"
          stroke="hsl(0 0% 25%)"
          strokeWidth="0.5"
          strokeDasharray="200"
        />
        <line
          className="hero-deco-line"
          x1="10" y1="150" x2="50" y2="150"
          stroke="hsl(0 0% 25%)"
          strokeWidth="0.5"
          strokeDasharray="200"
        />
        <circle cx="30" cy="50" r="2" fill="hsl(0 0% 40%)" className="hero-status" />
        <circle cx="30" cy="150" r="2" fill="hsl(0 0% 40%)" className="hero-status" />
      </svg>

      {/* Status row */}
      <div className="flex items-center gap-6 mt-2">
        <div className="hero-status flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-foreground/60 animate-pulse" />
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
            system.active
          </span>
        </div>
        <div className="hero-status flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-foreground/30" />
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
            models.loaded
          </span>
        </div>
        <div className="hero-status flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-foreground/30" />
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
            stl.compatible
          </span>
        </div>
      </div>
    </div>
  )
}
