"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface BrutalistBackgroundProps {
  variant?: "grid" | "circuit" | "full"
  className?: string
}

/**
 * Brutalist technical background with animated SVG patterns.
 * Features isometric grid, circuit traces, measurement lines, and corner marks.
 */
export function BrutalistBackground({ 
  variant = "full", 
  className = "" 
}: BrutalistBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<SVGGElement>(null)
  const circuitRef = useRef<SVGGElement>(null)
  const measureRef = useRef<SVGGElement>(null)
  const cornersRef = useRef<SVGGElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Helper to animate path drawing
      const drawPaths = (
        group: SVGGElement | null,
        duration: number,
        delay: number,
        stagger = 0.02
      ) => {
        if (!group) return
        const paths = group.querySelectorAll("path, line, polyline, circle, rect")
        paths.forEach((el) => {
          const geom = el as SVGGeometryElement
          if (typeof geom.getTotalLength === "function") {
            try {
              const len = geom.getTotalLength()
              gsap.set(geom, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 })
            } catch {
              gsap.set(geom, { opacity: 0 })
            }
          } else {
            gsap.set(geom, { opacity: 0 })
          }
        })
        gsap.to(paths, {
          strokeDashoffset: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease: "power2.inOut",
        })
      }

      // Animate each layer with staggered delays
      if (variant === "full" || variant === "grid") {
        drawPaths(gridRef.current, 2.2, 0.1, 0.015)
      }
      if (variant === "full" || variant === "circuit") {
        drawPaths(circuitRef.current, 1.8, 0.5, 0.04)
      }
      drawPaths(measureRef.current, 1.4, 0.8, 0.03)
      drawPaths(cornersRef.current, 0.8, 0.3, 0.1)
    }, containerRef)

    return () => ctx.revert()
  }, [variant])

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="currentColor"
      >
        {/* Technical Grid - Orthogonal + Diagonal */}
        <g ref={gridRef} className="text-foreground/[0.06]">
          {/* Vertical lines */}
          {Array.from({ length: 25 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 50}
              y1={0}
              x2={i * 50}
              y2={800}
              strokeWidth="0.3"
            />
          ))}
          {/* Horizontal lines */}
          {Array.from({ length: 17 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={i * 50}
              x2={1200}
              y2={i * 50}
              strokeWidth="0.3"
            />
          ))}
          {/* Main diagonals */}
          <line x1="0" y1="0" x2="1200" y2="800" strokeWidth="0.2" />
          <line x1="1200" y1="0" x2="0" y2="800" strokeWidth="0.2" />
          {/* Secondary diagonals */}
          {[200, 400, 600, 800, 1000].map((x, i) => (
            <line
              key={`d1-${i}`}
              x1={x}
              y1={0}
              x2={x + 400}
              y2={800}
              strokeWidth="0.15"
              className="text-foreground/[0.04]"
            />
          ))}
          {[100, 300, 500, 700].map((y, i) => (
            <line
              key={`d2-${i}`}
              x1={0}
              y1={y}
              x2={1200}
              y2={y + 500}
              strokeWidth="0.15"
              className="text-foreground/[0.04]"
            />
          ))}
        </g>

        {/* Circuit Board Traces */}
        <g ref={circuitRef} className="text-foreground/[0.12]" strokeWidth="0.5">
          {/* Main horizontal pathways */}
          <path d="M 80 120 L 220 120 L 220 280 L 380 280 L 380 400" />
          <path d="M 1120 680 L 980 680 L 980 520 L 820 520 L 820 400" />
          <path d="M 600 80 L 600 200 L 480 200 L 480 320" />
          <path d="M 600 720 L 600 600 L 720 600 L 720 480" />
          {/* Cross connections */}
          <path d="M 200 400 L 400 400" />
          <path d="M 800 400 L 1000 400" />
          <path d="M 600 200 L 600 600" />
          {/* Terminal nodes */}
          <circle cx="80" cy="120" r="4" strokeWidth="1" />
          <circle cx="380" cy="400" r="4" strokeWidth="1" />
          <circle cx="820" cy="400" r="4" strokeWidth="1" />
          <circle cx="1120" cy="680" r="4" strokeWidth="1" />
          <circle cx="600" cy="400" r="6" strokeWidth="1.5" />
        </g>

        {/* Measurement / Dimension Lines */}
        <g ref={measureRef} className="text-foreground/[0.08]" strokeWidth="0.4">
          {/* Top measurement */}
          <line x1="100" y1="40" x2="500" y2="40" />
          <line x1="100" y1="35" x2="100" y2="45" />
          <line x1="500" y1="35" x2="500" y2="45" />
          {/* Right measurement */}
          <line x1="1160" y1="200" x2="1160" y2="600" />
          <line x1="1155" y1="200" x2="1165" y2="200" />
          <line x1="1155" y1="600" x2="1165" y2="600" />
          {/* Bottom measurement */}
          <line x1="700" y1="760" x2="1100" y2="760" />
          <line x1="700" y1="755" x2="700" y2="765" />
          <line x1="1100" y1="755" x2="1100" y2="765" />
          {/* Center crosshair */}
          <line x1="600" y1="380" x2="600" y2="420" strokeWidth="0.6" />
          <line x1="580" y1="400" x2="620" y2="400" strokeWidth="0.6" />
          <circle cx="600" cy="400" r="20" strokeWidth="0.3" />
          <circle cx="600" cy="400" r="35" strokeWidth="0.2" />
        </g>

        {/* Corner Registration Marks */}
        <g ref={cornersRef} className="text-foreground/[0.2]" strokeWidth="1.5">
          {/* Top-left */}
          <path d="M 0 60 L 0 0 L 60 0" />
          <line x1="20" y1="20" x2="40" y2="20" strokeWidth="0.5" />
          <line x1="30" y1="10" x2="30" y2="30" strokeWidth="0.5" />
          {/* Top-right */}
          <path d="M 1140 0 L 1200 0 L 1200 60" />
          <line x1="1160" y1="20" x2="1180" y2="20" strokeWidth="0.5" />
          <line x1="1170" y1="10" x2="1170" y2="30" strokeWidth="0.5" />
          {/* Bottom-right */}
          <path d="M 1200 740 L 1200 800 L 1140 800" />
          <line x1="1160" y1="780" x2="1180" y2="780" strokeWidth="0.5" />
          <line x1="1170" y1="770" x2="1170" y2="790" strokeWidth="0.5" />
          {/* Bottom-left */}
          <path d="M 60 800 L 0 800 L 0 740" />
          <line x1="20" y1="780" x2="40" y2="780" strokeWidth="0.5" />
          <line x1="30" y1="770" x2="30" y2="790" strokeWidth="0.5" />
        </g>

        {/* Technical Labels */}
        <g className="text-foreground/[0.15]" strokeWidth="0">
          <text
            x="110"
            y="32"
            fontSize="8"
            fontFamily="ui-monospace, monospace"
            fill="currentColor"
          >
            400 UNITS
          </text>
          <text
            x="1130"
            y="405"
            fontSize="8"
            fontFamily="ui-monospace, monospace"
            fill="currentColor"
            transform="rotate(90, 1130, 405)"
          >
            400 UNITS
          </text>
          <text
            x="50"
            y="70"
            fontSize="6"
            fontFamily="ui-monospace, monospace"
            fill="currentColor"
            className="text-foreground/[0.1]"
          >
            REF: 0,0
          </text>
          <text
            x="1100"
            y="70"
            fontSize="6"
            fontFamily="ui-monospace, monospace"
            fill="currentColor"
            className="text-foreground/[0.1]"
          >
            GRID: 50px
          </text>
        </g>
      </svg>
    </div>
  )
}
