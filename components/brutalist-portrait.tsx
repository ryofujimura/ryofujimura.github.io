"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import Image from "next/image"

interface BrutalistPortraitProps {
  src: string
  alt: string
  className?: string
}

/**
 * Brutalist Portrait - Award-winning aesthetic with technical overlays
 * Multi-layered design with GSAP animated SVG patterns
 */
export function BrutalistPortrait({ src, alt, className = "" }: BrutalistPortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const gridSvgRef = useRef<SVGSVGElement>(null)
  const framesSvgRef = useRef<SVGSVGElement>(null)
  const measureSvgRef = useRef<SVGSVGElement>(null)
  const glitchSvgRef = useRef<SVGSVGElement>(null)
  const scanlineRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Main entrance animation
  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Image reveal - clip-path wipe
      gsap.fromTo(
        imageWrapperRef.current,
        { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 1.2,
          ease: "power4.inOut",
          delay: 0.3,
        }
      )

      // Grid lines - staggered draw
      if (gridSvgRef.current) {
        const gridLines = gridSvgRef.current.querySelectorAll("line, path")
        gridLines.forEach((line) => {
          const el = line as SVGGeometryElement
          if (typeof el.getTotalLength === "function") {
            try {
              const length = el.getTotalLength()
              gsap.set(el, { strokeDasharray: length, strokeDashoffset: length })
            } catch { /* skip */ }
          }
        })
        gsap.to(gridLines, {
          strokeDashoffset: 0,
          duration: 0.8,
          stagger: 0.02,
          ease: "power2.out",
          delay: 0.6,
        })
      }

      // Technical frames - draw animation
      if (framesSvgRef.current) {
        const frameElements = framesSvgRef.current.querySelectorAll("path, rect, line")
        frameElements.forEach((el) => {
          const geom = el as SVGGeometryElement
          if (typeof geom.getTotalLength === "function") {
            try {
              const length = geom.getTotalLength()
              gsap.set(geom, { strokeDasharray: length, strokeDashoffset: length })
            } catch { /* skip */ }
          }
        })
        gsap.to(frameElements, {
          strokeDashoffset: 0,
          duration: 1.5,
          stagger: 0.05,
          ease: "power2.inOut",
          delay: 0.8,
        })
      }

      // Measurement annotations
      if (measureSvgRef.current) {
        const measureEls = measureSvgRef.current.querySelectorAll("line, text, path")
        gsap.fromTo(
          measureEls,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, stagger: 0.03, ease: "power2.out", delay: 1.2 }
        )
      }

      // Glitch elements
      if (glitchSvgRef.current) {
        const glitchEls = glitchSvgRef.current.querySelectorAll("rect")
        gsap.fromTo(
          glitchEls,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.15, stagger: { each: 0.02, from: "random" }, ease: "power2.out", delay: 1.0 }
        )
      }

      // Scanline initial position
      if (scanlineRef.current) {
        gsap.set(scanlineRef.current, { yPercent: -100, opacity: 0 })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Hover animations
  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      if (isHovered) {
        // Scale image slightly
        gsap.to(imageWrapperRef.current?.querySelector("img"), {
          scale: 1.05,
          duration: 0.6,
          ease: "power2.out",
        })

        // Animate scanline
        if (scanlineRef.current) {
          gsap.to(scanlineRef.current, { opacity: 0.3, duration: 0.2 })
          gsap.fromTo(
            scanlineRef.current,
            { yPercent: -100 },
            { yPercent: 200, duration: 2, ease: "none", repeat: -1 }
          )
        }

        // Subtle rotation on grid
        gsap.to(gridSvgRef.current, { rotate: 0.5, duration: 0.4, ease: "power2.out" })

        // Glitch pulse
        if (glitchSvgRef.current) {
          const glitchRects = glitchSvgRef.current.querySelectorAll("rect")
          gsap.to(glitchRects, {
            opacity: 0.8,
            duration: 0.1,
            stagger: { each: 0.02, from: "random", repeat: -1, yoyo: true },
          })
        }

        // Frame color shift
        if (framesSvgRef.current) {
          gsap.to(framesSvgRef.current, { filter: "hue-rotate(20deg)", duration: 0.3 })
        }
      } else {
        // Reset all hover states
        gsap.to(imageWrapperRef.current?.querySelector("img"), {
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        })

        if (scanlineRef.current) {
          gsap.killTweensOf(scanlineRef.current)
          gsap.to(scanlineRef.current, { opacity: 0, duration: 0.2, yPercent: -100 })
        }

        gsap.to(gridSvgRef.current, { rotate: 0, duration: 0.4, ease: "power2.out" })

        if (glitchSvgRef.current) {
          const glitchRects = glitchSvgRef.current.querySelectorAll("rect")
          gsap.killTweensOf(glitchRects)
          gsap.to(glitchRects, { opacity: 0.4, duration: 0.2 })
        }

        if (framesSvgRef.current) {
          gsap.to(framesSvgRef.current, { filter: "hue-rotate(0deg)", duration: 0.3 })
        }
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isHovered])

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main container with aspect ratio */}
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        
        {/* Layer 0: Base grid pattern */}
        <svg
          ref={gridSvgRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 300 400"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          {/* Vertical grid lines */}
          {Array.from({ length: 13 }, (_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 25}
              y1="0"
              x2={i * 25}
              y2="400"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-foreground/[0.03]"
            />
          ))}
          {/* Horizontal grid lines */}
          {Array.from({ length: 17 }, (_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 25}
              x2="300"
              y2={i * 25}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-foreground/[0.03]"
            />
          ))}
          {/* Diagonal accent lines */}
          <line x1="0" y1="0" x2="300" y2="400" stroke="currentColor" strokeWidth="0.3" className="text-foreground/[0.05]" />
          <line x1="300" y1="0" x2="0" y2="400" stroke="currentColor" strokeWidth="0.3" className="text-foreground/[0.05]" />
          <line x1="150" y1="0" x2="0" y2="200" stroke="currentColor" strokeWidth="0.3" className="text-foreground/[0.04]" />
          <line x1="150" y1="0" x2="300" y2="200" stroke="currentColor" strokeWidth="0.3" className="text-foreground/[0.04]" />
        </svg>

        {/* Layer 1: Image with clip-path reveal */}
        <div
          ref={imageWrapperRef}
          className="absolute inset-0 z-10"
          style={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-top grayscale-[20%] contrast-[1.05]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/20" />
        </div>

        {/* Layer 2: Technical frame overlays */}
        <svg
          ref={framesSvgRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          viewBox="0 0 300 400"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          {/* Outer frame - offset */}
          <rect
            x="8"
            y="8"
            width="284"
            height="384"
            stroke="currentColor"
            strokeWidth="1"
            className="text-foreground/30"
          />
          
          {/* Inner frame corners - technical brackets */}
          <path d="M 20 40 L 20 20 L 40 20" stroke="currentColor" strokeWidth="1.5" className="text-foreground/60" />
          <path d="M 260 20 L 280 20 L 280 40" stroke="currentColor" strokeWidth="1.5" className="text-foreground/60" />
          <path d="M 280 360 L 280 380 L 260 380" stroke="currentColor" strokeWidth="1.5" className="text-foreground/60" />
          <path d="M 40 380 L 20 380 L 20 360" stroke="currentColor" strokeWidth="1.5" className="text-foreground/60" />

          {/* Center cross */}
          <line x1="140" y1="200" x2="160" y2="200" stroke="currentColor" strokeWidth="0.8" className="text-foreground/20" />
          <line x1="150" y1="190" x2="150" y2="210" stroke="currentColor" strokeWidth="0.8" className="text-foreground/20" />

          {/* Focal point circle */}
          <circle cx="150" cy="120" r="40" stroke="currentColor" strokeWidth="0.5" className="text-foreground/15" strokeDasharray="4 4" />
          <circle cx="150" cy="120" r="60" stroke="currentColor" strokeWidth="0.3" className="text-foreground/10" strokeDasharray="2 6" />

          {/* Technical reference lines */}
          <line x1="0" y1="120" x2="40" y2="120" stroke="currentColor" strokeWidth="0.5" className="text-foreground/30" />
          <line x1="260" y1="120" x2="300" y2="120" stroke="currentColor" strokeWidth="0.5" className="text-foreground/30" />
          <line x1="150" y1="0" x2="150" y2="40" stroke="currentColor" strokeWidth="0.5" className="text-foreground/30" />

          {/* Corner accents - triple lines */}
          <path d="M 4 4 L 4 50" stroke="currentColor" strokeWidth="2" className="text-foreground/40" />
          <path d="M 4 4 L 50 4" stroke="currentColor" strokeWidth="2" className="text-foreground/40" />
          <path d="M 296 4 L 296 50" stroke="currentColor" strokeWidth="2" className="text-foreground/40" />
          <path d="M 296 4 L 250 4" stroke="currentColor" strokeWidth="2" className="text-foreground/40" />
          <path d="M 4 396 L 4 350" stroke="currentColor" strokeWidth="2" className="text-foreground/40" />
          <path d="M 4 396 L 50 396" stroke="currentColor" strokeWidth="2" className="text-foreground/40" />
          <path d="M 296 396 L 296 350" stroke="currentColor" strokeWidth="2" className="text-foreground/40" />
          <path d="M 296 396 L 250 396" stroke="currentColor" strokeWidth="2" className="text-foreground/40" />

          {/* Grid section dividers */}
          <line x1="100" y1="0" x2="100" y2="20" stroke="currentColor" strokeWidth="0.5" className="text-foreground/20" />
          <line x1="200" y1="0" x2="200" y2="20" stroke="currentColor" strokeWidth="0.5" className="text-foreground/20" />
          <line x1="100" y1="380" x2="100" y2="400" stroke="currentColor" strokeWidth="0.5" className="text-foreground/20" />
          <line x1="200" y1="380" x2="200" y2="400" stroke="currentColor" strokeWidth="0.5" className="text-foreground/20" />
        </svg>

        {/* Layer 3: Measurement annotations */}
        <svg
          ref={measureSvgRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-30"
          viewBox="0 0 300 400"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          {/* Top dimension */}
          <line x1="20" y1="12" x2="280" y2="12" stroke="currentColor" strokeWidth="0.5" className="text-foreground/40" />
          <line x1="20" y1="8" x2="20" y2="16" stroke="currentColor" strokeWidth="0.5" className="text-foreground/40" />
          <line x1="280" y1="8" x2="280" y2="16" stroke="currentColor" strokeWidth="0.5" className="text-foreground/40" />
          <text x="150" y="10" textAnchor="middle" className="text-foreground/30 fill-current" style={{ fontSize: "6px", fontFamily: "monospace" }}>300px</text>

          {/* Left dimension */}
          <line x1="4" y1="20" x2="4" y2="380" stroke="currentColor" strokeWidth="0.5" className="text-foreground/40" />
          <line x1="2" y1="20" x2="8" y2="20" stroke="currentColor" strokeWidth="0.5" className="text-foreground/40" />
          <line x1="2" y1="380" x2="8" y2="380" stroke="currentColor" strokeWidth="0.5" className="text-foreground/40" />
          <text x="12" y="200" textAnchor="middle" className="text-foreground/30 fill-current" style={{ fontSize: "6px", fontFamily: "monospace" }} transform="rotate(-90, 12, 200)">400px</text>

          {/* Reference points */}
          <circle cx="150" cy="120" r="2" className="fill-foreground/40" />
          <text x="158" y="118" className="text-foreground/30 fill-current" style={{ fontSize: "5px", fontFamily: "monospace" }}>REF_01</text>

          {/* Coordinate annotations */}
          <text x="24" y="28" className="text-foreground/25 fill-current" style={{ fontSize: "5px", fontFamily: "monospace" }}>0,0</text>
          <text x="260" y="28" className="text-foreground/25 fill-current" style={{ fontSize: "5px", fontFamily: "monospace" }}>W,0</text>
          <text x="260" y="390" className="text-foreground/25 fill-current" style={{ fontSize: "5px", fontFamily: "monospace" }}>W,H</text>
          <text x="24" y="390" className="text-foreground/25 fill-current" style={{ fontSize: "5px", fontFamily: "monospace" }}>0,H</text>

          {/* Golden ratio marks */}
          <line x1="0" y1="152" x2="15" y2="152" stroke="currentColor" strokeWidth="0.3" className="text-foreground/20" />
          <text x="18" y="154" className="text-foreground/20 fill-current" style={{ fontSize: "4px", fontFamily: "monospace" }}>φ</text>
          <line x1="0" y1="248" x2="15" y2="248" stroke="currentColor" strokeWidth="0.3" className="text-foreground/20" />
          <text x="18" y="250" className="text-foreground/20 fill-current" style={{ fontSize: "4px", fontFamily: "monospace" }}>φ²</text>
        </svg>

        {/* Layer 4: Glitch/noise blocks */}
        <svg
          ref={glitchSvgRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-40 mix-blend-overlay"
          viewBox="0 0 300 400"
          preserveAspectRatio="xMidYMid slice"
          fill="currentColor"
        >
          <rect x="0" y="78" width="300" height="2" className="text-foreground/40" />
          <rect x="50" y="156" width="200" height="1" className="text-foreground/30" />
          <rect x="0" y="234" width="150" height="1.5" className="text-foreground/35" />
          <rect x="180" y="267" width="120" height="1" className="text-foreground/25" />
          <rect x="20" y="312" width="80" height="1" className="text-foreground/30" />
          <rect x="0" y="345" width="300" height="2" className="text-foreground/40" />
          {/* Vertical glitch lines */}
          <rect x="45" y="0" width="1" height="400" className="text-foreground/10" />
          <rect x="189" y="0" width="1.5" height="400" className="text-foreground/15" />
          <rect x="267" y="0" width="1" height="400" className="text-foreground/10" />
        </svg>

        {/* Layer 5: Scanline effect (hover activated) */}
        <div
          ref={scanlineRef}
          className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-foreground/5 to-transparent z-50 pointer-events-none"
          style={{ opacity: 0 }}
        />

        {/* Layer 6: Vignette overlay */}
        <div className="absolute inset-0 z-50 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />

        {/* Layer 7: Noise texture overlay */}
        <div 
          className="absolute inset-0 z-50 pointer-events-none opacity-[0.02] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Bottom metadata strip */}
      <div className="mt-2 font-mono text-[8px] sm:text-[9px] tracking-[0.15em] uppercase text-muted-foreground/60 flex items-center justify-between">
        <span>IMG_PROFILE_01</span>
        <span className="text-foreground/20">│</span>
        <span>3:4</span>
        <span className="text-foreground/20">│</span>
        <span>PROC_BRUTALIST</span>
      </div>
    </div>
  )
}
