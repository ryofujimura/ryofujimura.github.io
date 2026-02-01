"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { useGazeTracking } from "@/hooks/use-gaze-tracking"

interface HeroPortraitProps {
  className?: string
}

/**
 * ViewfinderOverlay - Complex SVG camera viewfinder frame with animated technical elements
 * Award-winning brutalist aesthetic with layered technical patterns
 */
function ViewfinderOverlay({ isHovered }: { isHovered: boolean }) {
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

    // Draw crosshairs
    tl.to(
      svg.querySelectorAll("[data-crosshair]"),
      {
        strokeDashoffset: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
      },
      "-=0.3"
    )

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

  // Hover animation for focus ring
  useEffect(() => {
    if (!svgRef.current) return
    const focusRing = svgRef.current.querySelector("[data-focus-ring]")
    if (!focusRing) return

    if (isHovered) {
      gsap.to(focusRing, {
        scale: 1.05,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      })
    } else {
      gsap.to(focusRing, {
        scale: 1,
        opacity: 0.6,
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }, [isHovered])

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      viewBox="0 0 400 500"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Gradient for focus ring */}
        <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.4" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
        </linearGradient>
        {/* Clip path for rounded frame */}
        <clipPath id="frameClip">
          <rect x="20" y="20" width="360" height="460" rx="12" />
        </clipPath>
      </defs>

      {/* === LAYER 1: Outer frame brackets === */}
      <g className="text-foreground/40">
        {/* Top-left bracket */}
        <path
          data-draw
          data-corner
          d="M 8 60 L 8 8 L 60 8"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
        />
        {/* Top-right bracket */}
        <path
          data-draw
          data-corner
          d="M 340 8 L 392 8 L 392 60"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
        />
        {/* Bottom-right bracket */}
        <path
          data-draw
          data-corner
          d="M 392 440 L 392 492 L 340 492"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
        />
        {/* Bottom-left bracket */}
        <path
          data-draw
          data-corner
          d="M 60 492 L 8 492 L 8 440"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
        />
      </g>

      {/* === LAYER 2: Inner frame with rounded corners === */}
      <rect
        data-draw
        data-corner
        x="24"
        y="24"
        width="352"
        height="452"
        rx="8"
        stroke="currentColor"
        strokeWidth="1"
        className="text-foreground/20"
      />

      {/* === LAYER 5: Rule of thirds grid === */}
      <g className="text-foreground/10">
        {/* Vertical lines */}
        <line data-draw data-grid x1="133" y1="40" x2="133" y2="460" strokeWidth="0.5" stroke="currentColor" />
        <line data-draw data-grid x1="267" y1="40" x2="267" y2="460" strokeWidth="0.5" stroke="currentColor" />
        {/* Horizontal lines */}
        <line data-draw data-grid x1="40" y1="167" x2="360" y2="167" strokeWidth="0.5" stroke="currentColor" />
        <line data-draw data-grid x1="40" y1="333" x2="360" y2="333" strokeWidth="0.5" stroke="currentColor" />
      </g>

      {/* === LAYER 6: Corner measurement marks === */}
      <g className="text-foreground/50" data-fade>
        {/* Top-left measurements */}
        <line x1="40" y1="40" x2="60" y2="40" strokeWidth="1" stroke="currentColor" />
        <line x1="40" y1="40" x2="40" y2="60" strokeWidth="1" stroke="currentColor" />
        {/* Top-right measurements */}
        <line x1="340" y1="40" x2="360" y2="40" strokeWidth="1" stroke="currentColor" />
        <line x1="360" y1="40" x2="360" y2="60" strokeWidth="1" stroke="currentColor" />
        {/* Bottom-right measurements */}
        <line x1="340" y1="460" x2="360" y2="460" strokeWidth="1" stroke="currentColor" />
        <line x1="360" y1="440" x2="360" y2="460" strokeWidth="1" stroke="currentColor" />
        {/* Bottom-left measurements */}
        <line x1="40" y1="460" x2="60" y2="460" strokeWidth="1" stroke="currentColor" />
        <line x1="40" y1="440" x2="40" y2="460" strokeWidth="1" stroke="currentColor" />
      </g>

      {/* === LAYER 7: Technical tick marks along edges === */}
      <g className="text-foreground/20" data-fade>
        {/* Top edge ticks */}
        {[80, 120, 160, 200, 240, 280, 320].map((x) => (
          <line key={`top-${x}`} x1={x} y1="32" x2={x} y2={x === 200 ? 44 : 38} strokeWidth="0.5" stroke="currentColor" />
        ))}
        {/* Bottom edge ticks */}
        {[80, 120, 160, 200, 240, 280, 320].map((x) => (
          <line key={`bot-${x}`} x1={x} y1="468" x2={x} y2={x === 200 ? 456 : 462} strokeWidth="0.5" stroke="currentColor" />
        ))}
        {/* Left edge ticks */}
        {[80, 130, 180, 230, 280, 330, 380, 420].map((y) => (
          <line key={`left-${y}`} x1="32" y1={y} x2={y === 250 ? 44 : 38} y2={y} strokeWidth="0.5" stroke="currentColor" />
        ))}
        {/* Right edge ticks */}
        {[80, 130, 180, 230, 280, 330, 380, 420].map((y) => (
          <line key={`right-${y}`} x1="368" y1={y} x2={y === 250 ? 356 : 362} y2={y} strokeWidth="0.5" stroke="currentColor" />
        ))}
      </g>

      {/* === LAYER 8: Focus point indicators === */}
      <g className="text-foreground/40">
        {/* Rule-of-thirds intersection points */}
        <circle data-pulse cx="133" cy="167" r="3" fill="currentColor" fillOpacity="0.3" />
        <circle data-pulse cx="267" cy="167" r="3" fill="currentColor" fillOpacity="0.3" />
        <circle data-pulse cx="133" cy="333" r="3" fill="currentColor" fillOpacity="0.3" />
        <circle data-pulse cx="267" cy="333" r="3" fill="currentColor" fillOpacity="0.3" />
      </g>

      {/* === LAYER 9: Technical info overlays === */}
      <g className="text-foreground/60 font-mono" style={{ fontSize: "8px" }} data-fade>
        {/* Top-left info */}
        <text x="44" y="74" fill="currentColor" className="font-mono text-[8px]">
          ISO 400
        </text>
        {/* Top-right info */}
        <text x="316" y="74" fill="currentColor" className="font-mono text-[8px]" textAnchor="end">
          f/2.8
        </text>
        {/* Bottom-left info */}
        <text x="44" y="444" fill="currentColor" className="font-mono text-[8px]">
          1/125s
        </text>
        {/* Bottom-right info */}
        <text x="356" y="444" fill="currentColor" className="font-mono text-[8px]" textAnchor="end">
          50mm
        </text>
      </g>

      {/* === LAYER 10: Corner diagonal lines (brutalist accent) === */}
      <g className="text-foreground/15">
        <line data-draw data-grid x1="8" y1="8" x2="40" y2="40" strokeWidth="0.5" stroke="currentColor" />
        <line data-draw data-grid x1="392" y1="8" x2="360" y2="40" strokeWidth="0.5" stroke="currentColor" />
        <line data-draw data-grid x1="392" y1="492" x2="360" y2="460" strokeWidth="0.5" stroke="currentColor" />
        <line data-draw data-grid x1="8" y1="492" x2="40" y2="460" strokeWidth="0.5" stroke="currentColor" />
      </g>

      {/* === LAYER 11: Scan line indicators === */}
      <g className="text-foreground/10" data-fade>
        <rect x="36" y="248" width="4" height="4" fill="currentColor" />
        <rect x="360" y="248" width="4" height="4" fill="currentColor" />
        <rect x="198" y="36" width="4" height="4" fill="currentColor" />
        <rect x="198" y="460" width="4" height="4" fill="currentColor" />
      </g>

      {/* === LAYER 12: Recording indicator === */}
      <g data-pulse>
        <circle cx="56" cy="56" r="4" fill="oklch(0.65 0.25 25)" fillOpacity="0.8" />
        <text x="66" y="59" fill="currentColor" className="font-mono text-[7px] text-foreground/50">
          REC
        </text>
      </g>
    </svg>
  )
}

/**
 * DiagonalPatternOverlay - Brutalist diagonal line pattern
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
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
    >
      <g className="text-foreground/5">
        {Array.from({ length: 20 }, (_, i) => (
          <line
            key={i}
            x1={-50 + i * 50}
            y1="0"
            x2={150 + i * 50}
            y2="500"
            strokeWidth="1"
            stroke="currentColor"
          />
        ))}
      </g>
    </svg>
  )
}

/**
 * HeroPortrait - Award-winning brutalist camera viewfinder portrait component
 * Features gaze-tracking face with layered SVG overlays and GSAP animations
 */
export function HeroPortrait({ className = "" }: HeroPortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
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

  // Hover effects for image
  useEffect(() => {
    if (!imageRef.current) return

    if (isHovered) {
      gsap.to(imageRef.current, {
        scale: 1.05,
        duration: 0.5,
        ease: "power2.out",
      })
    } else {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
      })
    }
  }, [isHovered])

  // Mouse move parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imageRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    gsap.to(imageRef.current, {
      x: x * 10,
      y: y * 10,
      duration: 0.3,
      ease: "power2.out",
    })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (!imageRef.current) return
    gsap.to(imageRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    })
  }

  return (
    <div
      ref={containerRef}
      className={`relative group ${className}`}
      style={{ aspectRatio: "4/5" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Base container with rounded corners */}
      <div className="absolute inset-0 rounded-xl overflow-hidden bg-muted/20">
        {/* Image wrapper with parallax - gaze tracking face */}
        <div
          ref={imageRef}
          className="absolute inset-[-10%] w-[120%] h-[120%]"
        >
          {currentImage && (
            <img
              src={currentImage}
              alt="Portrait following gaze"
              className="w-full h-full object-cover object-center"
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
      <ViewfinderOverlay isHovered={isHovered} />

      {/* Hover glow effect */}
      <div
        className={`absolute inset-0 rounded-xl transition-opacity duration-500 pointer-events-none ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          boxShadow: "inset 0 0 60px 10px rgba(255,255,255,0.05)",
        }}
      />

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
