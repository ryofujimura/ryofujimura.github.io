"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

/** Complex technical SVG overlay — circuit/grid/crosshair, draws on mount via GSAP */
export function HeroBrutalistPattern({
  className = "",
  onDrawComplete,
}: {
  className?: string
  onDrawComplete?: () => void
}) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = svgRef.current
    if (!el) return

    const paths = el.querySelectorAll("path, line, polyline, circle")
    paths.forEach((path) => {
      const p = path as SVGGeometryElement
      if (typeof p.getTotalLength === "function") {
        try {
          const len = p.getTotalLength()
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
        } catch {
          /* skip unsupported */
        }
      }
    })

    const tl = gsap.timeline({ onComplete: onDrawComplete })
    tl.to(paths, {
      strokeDashoffset: 0,
      duration: 1.8,
      stagger: { each: 0.04, from: "start" },
      ease: "power2.inOut",
    })
    return () => tl.kill()
  }, [onDrawComplete])

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 1200 800"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="hero-dense-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" stroke="currentColor" strokeWidth="0.25" fill="none" opacity="0.4" />
        </pattern>
        <pattern id="hero-diag" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="16" stroke="currentColor" strokeWidth="0.2" opacity="0.25" />
        </pattern>
      </defs>
      {/* Dense grid — vertical */}
      {Array.from({ length: 51 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 24}
          y1={0}
          x2={i * 24}
          y2={800}
          stroke="currentColor"
          opacity="0.12"
        />
      ))}
      {/* Dense grid — horizontal */}
      {Array.from({ length: 34 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1={0}
          y1={i * 24}
          x2={1200}
          y2={i * 24}
          stroke="currentColor"
          opacity="0.12"
        />
      ))}
      {/* Diagonal bundles */}
      <polyline
        points="0,0 1200,800 1200,0 0,800 0,0"
        stroke="currentColor"
        opacity="0.06"
      />
      {/* Corner brackets — L shapes */}
      <path d="M 0 80 L 0 0 L 80 0" stroke="currentColor" opacity="0.5" />
      <path d="M 1200 80 L 1200 0 L 1120 0" stroke="currentColor" opacity="0.5" />
      <path d="M 0 720 L 0 800 L 80 800" stroke="currentColor" opacity="0.5" />
      <path d="M 1200 720 L 1200 800 L 1120 800" stroke="currentColor" opacity="0.5" />
      {/* Crosshair at center */}
      <line x1="600" y1="320" x2="600" y2="480" stroke="currentColor" opacity="0.35" />
      <line x1="520" y1="400" x2="680" y2="400" stroke="currentColor" opacity="0.35" />
      <circle cx="600" cy="400" r="40" stroke="currentColor" opacity="0.2" />
      <circle cx="600" cy="400" r="80" stroke="currentColor" opacity="0.12" />
      {/* Technical brackets inner */}
      <path d="M 120 200 L 120 160 L 160 160" stroke="currentColor" opacity="0.35" />
      <path d="M 1080 200 L 1080 160 L 1040 160" stroke="currentColor" opacity="0.35" />
      <path d="M 120 600 L 120 640 L 160 640" stroke="currentColor" opacity="0.35" />
      <path d="M 1080 600 L 1080 640 L 1040 640" stroke="currentColor" opacity="0.35" />
    </svg>
  )
}
