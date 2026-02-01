"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { useGazeTracking } from "@/hooks/use-gaze-tracking"

interface HeroPortraitProps {
  className?: string
}

/**
 * ViewfinderOverlay - Complex SVG camera viewfinder frame with animated technical elements
 * Square format (256x256) to match face images - brutalist aesthetic
 */
function ViewfinderOverlay() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!svgRef.current || hasAnimated) return

    const svg = svgRef.current
    const paths = svg.querySelectorAll("[data-draw]")
    const fadeEls = svg.querySelectorAll("[data-fade]")
    const pulseEls = svg.querySelectorAll("[data-pulse]")

    // Set initial states for stroke animation
    paths.forEach((el) => {
      const path = el as SVGGeometryElement
      if (typeof path.getTotalLength === "function") {
        try {
          const len = path.getTotalLength()
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
        } catch {
          // Skip elements that don't support getTotalLength
        }
      }
    })

    // Set initial states for fade elements
    gsap.set(fadeEls, { opacity: 0 })
    gsap.set(pulseEls, { opacity: 0, scale: 0.8, transformOrigin: "center" })

    // Create animation timeline
    const tl = gsap.timeline({
      delay: 0.8,
      onComplete: () => setHasAnimated(true),
    })

    // Draw corner brackets first
    tl.to(svg.querySelectorAll("[data-corner]"), {
      strokeDashoffset: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    })

    // Draw grid lines
    tl.to(
      svg.querySelectorAll("[data-grid]"),
      {
        strokeDashoffset: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: "power1.out",
      },
      "-=0.2"
    )

    // Fade in measurement marks
    tl.to(
      fadeEls,
      {
        opacity: 1,
        duration: 0.4,
        stagger: 0.02,
        ease: "power2.out",
      },
      "-=0.3"
    )

    // Pop in focus indicators
    tl.to(
      pulseEls,
      {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        stagger: 0.05,
        ease: "back.out(2)",
      },
      "-=0.2"
    )

    return () => {
      tl.kill()
    }
  }, [hasAnimated])

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      viewBox="0 0 256 256"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* === LAYER 1: Outer frame brackets === */}
      <g className="text-foreground/40">
        {/* Top-left bracket */}
        <path
          data-draw
          data-corner
          d="M 5 38 L 5 5 L 38 5"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
        />
        {/* Top-right bracket */}
        <path
          data-draw
          data-corner
          d="M 218 5 L 251 5 L 251 38"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
        />
        {/* Bottom-right bracket */}
        <path
          data-draw
          data-corner
          d="M 251 218 L 251 251 L 218 251"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
        />
        {/* Bottom-left bracket */}
        <path
          data-draw
          data-corner
          d="M 38 251 L 5 251 L 5 218"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
        />
      </g>

      {/* === LAYER 2: Inner frame with rounded corners === */}
      <rect
        data-draw
        data-corner
        x="15"
        y="15"
        width="226"
        height="226"
        rx="5"
        stroke="currentColor"
        strokeWidth="1"
        className="text-foreground/20"
      />

      {/* === LAYER 3: Rule of thirds grid === */}
      <g className="text-foreground/10">
        {/* Vertical lines */}
        <line data-draw data-grid x1="85" y1="25" x2="85" y2="231" strokeWidth="0.5" stroke="currentColor" />
        <line data-draw data-grid x1="171" y1="25" x2="171" y2="231" strokeWidth="0.5" stroke="currentColor" />
        {/* Horizontal lines */}
        <line data-draw data-grid x1="25" y1="85" x2="231" y2="85" strokeWidth="0.5" stroke="currentColor" />
        <line data-draw data-grid x1="25" y1="171" x2="231" y2="171" strokeWidth="0.5" stroke="currentColor" />
      </g>

      {/* === LAYER 4: Corner measurement marks === */}
      <g className="text-foreground/50" data-fade>
        {/* Top-left */}
        <line x1="25" y1="25" x2="40" y2="25" strokeWidth="1" stroke="currentColor" />
        <line x1="25" y1="25" x2="25" y2="40" strokeWidth="1" stroke="currentColor" />
        {/* Top-right */}
        <line x1="216" y1="25" x2="231" y2="25" strokeWidth="1" stroke="currentColor" />
        <line x1="231" y1="25" x2="231" y2="40" strokeWidth="1" stroke="currentColor" />
        {/* Bottom-right */}
        <line x1="216" y1="231" x2="231" y2="231" strokeWidth="1" stroke="currentColor" />
        <line x1="231" y1="216" x2="231" y2="231" strokeWidth="1" stroke="currentColor" />
        {/* Bottom-left */}
        <line x1="25" y1="231" x2="40" y2="231" strokeWidth="1" stroke="currentColor" />
        <line x1="25" y1="216" x2="25" y2="231" strokeWidth="1" stroke="currentColor" />
      </g>

      {/* === LAYER 5: Technical tick marks along edges === */}
      <g className="text-foreground/20" data-fade>
        {/* Top edge ticks */}
        {[64, 96, 128, 160, 192].map((x) => (
          <line key={`top-${x}`} x1={x} y1="20" x2={x} y2={x === 128 ? 28 : 24} strokeWidth="0.5" stroke="currentColor" />
        ))}
        {/* Bottom edge ticks */}
        {[64, 96, 128, 160, 192].map((x) => (
          <line key={`bot-${x}`} x1={x} y1="236" x2={x} y2={x === 128 ? 228 : 232} strokeWidth="0.5" stroke="currentColor" />
        ))}
        {/* Left edge ticks */}
        {[64, 96, 128, 160, 192].map((y) => (
          <line key={`left-${y}`} x1="20" y1={y} x2={y === 128 ? 28 : 24} y2={y} strokeWidth="0.5" stroke="currentColor" />
        ))}
        {/* Right edge ticks */}
        {[64, 96, 128, 160, 192].map((y) => (
          <line key={`right-${y}`} x1="236" y1={y} x2={y === 128 ? 228 : 232} y2={y} strokeWidth="0.5" stroke="currentColor" />
        ))}
      </g>

      {/* === LAYER 6: Focus point indicators === */}
      <g className="text-foreground/40">
        {/* Rule-of-thirds intersection points */}
        <circle data-pulse cx="85" cy="85" r="2" fill="currentColor" fillOpacity="0.3" />
        <circle data-pulse cx="171" cy="85" r="2" fill="currentColor" fillOpacity="0.3" />
        <circle data-pulse cx="85" cy="171" r="2" fill="currentColor" fillOpacity="0.3" />
        <circle data-pulse cx="171" cy="171" r="2" fill="currentColor" fillOpacity="0.3" />
      </g>

      {/* === LAYER 7: Technical info overlays === */}
      <g className="text-foreground/60 font-mono" style={{ fontSize: "6px" }} data-fade>
        <text x="28" y="48" fill="currentColor" className="font-mono">
          ISO 400
        </text>
        <text x="228" y="48" fill="currentColor" className="font-mono" textAnchor="end">
          f/2.8
        </text>
        <text x="28" y="220" fill="currentColor" className="font-mono">
          1/125s
        </text>
        <text x="228" y="220" fill="currentColor" className="font-mono" textAnchor="end">
          50mm
        </text>
      </g>

      {/* === LAYER 8: Corner diagonal lines (brutalist accent) === */}
      <g className="text-foreground/15">
        <line data-draw data-grid x1="5" y1="5" x2="25" y2="25" strokeWidth="0.5" stroke="currentColor" />
        <line data-draw data-grid x1="251" y1="5" x2="231" y2="25" strokeWidth="0.5" stroke="currentColor" />
        <line data-draw data-grid x1="251" y1="251" x2="231" y2="231" strokeWidth="0.5" stroke="currentColor" />
        <line data-draw data-grid x1="5" y1="251" x2="25" y2="231" strokeWidth="0.5" stroke="currentColor" />
      </g>

      {/* === LAYER 9: Scan line indicators === */}
      <g className="text-foreground/10" data-fade>
        <rect x="23" y="126" width="3" height="3" fill="currentColor" />
        <rect x="230" y="126" width="3" height="3" fill="currentColor" />
        <rect x="126" y="23" width="3" height="3" fill="currentColor" />
        <rect x="126" y="230" width="3" height="3" fill="currentColor" />
      </g>

      {/* === LAYER 10: Recording indicator === */}
      <g data-pulse>
        <circle cx="36" cy="36" r="3" fill="oklch(0.65 0.25 25)" fillOpacity="0.8" />
        <text x="43" y="38" fill="currentColor" className="font-mono text-foreground/50" style={{ fontSize: "5px" }}>
          REC
        </text>
      </g>
    </svg>
  )
}

/**
 * DiagonalPatternOverlay - Brutalist diagonal line pattern (square format)
 */
function DiagonalPatternOverlay() {
  const patternRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!patternRef.current) return
    const lines = patternRef.current.querySelectorAll("line")
    
    gsap.set(lines, { opacity: 0 })
    gsap.to(lines, {
      opacity: 1,
      duration: 0.8,
      stagger: 0.02,
      delay: 1.5,
      ease: "power2.out",
    })
  }, [])

  return (
    <svg
      ref={patternRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 mix-blend-overlay"
      viewBox="0 0 256 256"
      preserveAspectRatio="xMidYMid meet"
    >
      <g className="text-foreground/5">
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={i}
            x1={-30 + i * 30}
            y1="0"
            x2={90 + i * 30}
            y2="256"
            strokeWidth="1"
            stroke="currentColor"
          />
        ))}
      </g>
    </svg>
  )
}

/**
 * HeroPortrait - Brutalist camera viewfinder portrait component
 * Features gaze-tracking face with layered SVG overlays and GSAP animations
 */
export function HeroPortrait({ className = "" }: HeroPortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Gaze tracking hook - face follows cursor/touch
  const { currentImage, isLoading } = useGazeTracking(containerRef, '/faces/')

  // Container entrance animation
  useEffect(() => {
    if (!containerRef.current) return

    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        scale: 0.95,
        y: 20,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      }
    )
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ aspectRatio: "1/1" }}
    >
      {/* Base container with rounded corners */}
      <div className="absolute inset-0 rounded-xl overflow-hidden bg-muted/20">
        {/* Image wrapper - gaze tracking face */}
        <div className="absolute inset-0 w-full h-full">
          {currentImage && (
            <img
              src={currentImage}
              alt="Portrait following gaze"
              className="w-full h-full object-contain object-center"
              style={{
                transition: 'opacity 0.1s ease-out',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          )}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          )}
        </div>

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent z-[5]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-transparent z-[5]" />

        {/* Diagonal pattern overlay */}
        <DiagonalPatternOverlay />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 z-[15] opacity-[0.03] pointer-events-none noise-texture" />
      </div>

      {/* Viewfinder SVG overlay */}
      <ViewfinderOverlay />

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-4 py-3 bg-gradient-to-t from-background/80 to-transparent">
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-foreground/60">
          <span>SUBJ: RYO_F</span>
          <span className="text-foreground/40">│</span>
          <span>FRAME: 001</span>
        </div>
      </div>
    </div>
  )
}
