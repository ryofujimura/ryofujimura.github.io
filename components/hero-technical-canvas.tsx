"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

/**
 * Full-viewport brutalist technical canvas: isometric grid, circuit traces,
 * crosshairs, corner brackets. All paths draw in with GSAP on mount.
 */
export function HeroTechnicalCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<SVGSVGElement>(null)
  const circuitRef = useRef<SVGSVGElement>(null)
  const crosshairRef = useRef<SVGSVGElement>(null)
  const cornersRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const drawIn = (
        el: SVGElement | null,
        duration: number,
        delay: number,
        stagger = 0.02
      ) => {
        if (!el) return
        const els = el.querySelectorAll("path, line, polyline")
        els.forEach((e) => {
          const geom = e as SVGGeometryElement
          if (typeof geom.getTotalLength === "function") {
            try {
              const len = geom.getTotalLength()
              gsap.set(geom, { strokeDasharray: len, strokeDashoffset: len })
            } catch {
              /* skip */
            }
          }
        })
        gsap.to(els, {
          strokeDashoffset: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease: "power2.inOut",
        })
      }

      if (gridRef.current) {
        gsap.set(gridRef.current.querySelectorAll("line"), { opacity: 0 })
        drawIn(gridRef.current, 2.2, 0.2, 0.03)
      }
      if (circuitRef.current) {
        gsap.set(circuitRef.current.querySelectorAll("path"), { opacity: 0 })
        drawIn(circuitRef.current, 1.8, 0.6, 0.06)
      }
      if (crosshairRef.current) {
        gsap.set(crosshairRef.current.querySelectorAll("line, circle"), {
          opacity: 0,
        })
        drawIn(crosshairRef.current, 1.2, 1, 0.04)
      }
      if (cornersRef.current) {
        gsap.set(cornersRef.current.querySelectorAll("path"), { opacity: 0 })
        drawIn(cornersRef.current, 0.9, 0.4, 0.08)
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden text-foreground/15"
      aria-hidden
    >
      {/* Ortho + diagonal technical grid — all lines animate */}
      <svg
        ref={gridRef}
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="currentColor"
      >
        {Array.from({ length: 25 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 50}
            y1={0}
            x2={i * 50}
            y2={800}
            strokeWidth="0.25"
            opacity="0.7"
          />
        ))}
        {Array.from({ length: 17 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={i * 50}
            x2={1200}
            y2={i * 50}
            strokeWidth="0.25"
            opacity="0.7"
          />
        ))}
        {/* Diagonal cross-hatch */}
        <line x1="0" y1="0" x2="1200" y2="800" strokeWidth="0.2" opacity="0.4" />
        <line x1="1200" y1="0" x2="0" y2="800" strokeWidth="0.2" opacity="0.4" />
        {[200, 400, 600, 800, 1000].map((x, i) => (
          <line
            key={`d1-${i}`}
            x1={x}
            y1={0}
            x2={x + 400}
            y2={800}
            strokeWidth="0.15"
            opacity="0.3"
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
            opacity="0.3"
          />
        ))}
      </svg>

      {/* Circuit / trace paths — right-angle technical lines */}
      <svg
        ref={circuitRef}
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <path d="M 80 120 L 220 120 L 220 280 L 380 280 L 380 400" />
        <path d="M 1120 680 L 980 680 L 980 520 L 820 520 L 820 400" />
        <path d="M 600 80 L 600 200 L 480 200 L 480 320" />
        <path d="M 600 720 L 600 600 L 720 600 L 720 480" />
        <path d="M 200 400 L 400 400 M 800 400 L 1000 400" />
        <path d="M 600 200 L 600 600" />
      </svg>

      {/* Center and corner crosshairs */}
      <svg
        ref={crosshairRef}
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.4"
      >
        <line x1="600" y1="360" x2="600" y2="440" />
        <line x1="560" y1="400" x2="640" y2="400" />
        <circle cx="600" cy="400" r="24" strokeWidth="0.5" />
        <circle cx="600" cy="400" r="8" strokeWidth="0.6" />
        {/* Corner crosshairs */}
        <line x1="60" y1="40" x2="60" y2="80" />
        <line x1="40" y1="60" x2="80" y2="60" />
        <line x1="1140" y1="40" x2="1140" y2="80" />
        <line x1="1120" y1="60" x2="1160" y2="60" />
        <line x1="60" y1="760" x2="60" y2="720" />
        <line x1="40" y1="740" x2="80" y2="740" />
        <line x1="1140" y1="760" x2="1140" y2="720" />
        <line x1="1120" y1="740" x2="1160" y2="740" />
      </svg>

      {/* Corner brackets — brutalist frame */}
      <svg
        ref={cornersRef}
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M 0 80 L 0 0 L 80 0" />
        <path d="M 1120 0 L 1200 0 L 1200 80" />
        <path d="M 1200 720 L 1200 800 L 1120 800" />
        <path d="M 80 800 L 0 800 L 0 720" />
      </svg>
    </div>
  )
}
