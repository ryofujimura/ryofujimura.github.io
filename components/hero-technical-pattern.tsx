"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { GSAPSVG } from "@/components/gsap-text"

/** Brutalist technical pattern: isometric grid, dimension lines, crosshairs. GSAP stroke-draw on mount. */
export function HeroTechnicalPattern({ className = "" }: { className?: string }) {
  return (
    <GSAPSVG
      className={`absolute inset-0 w-full h-full pointer-events-none text-foreground/15 ${className}`}
      duration={2.2}
      delay={0.2}
      runOnceOnMount
    >
      <svg viewBox="0 0 1200 800" className="w-full h-full" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid slice">
        {/* Isometric-style grid — vertical */}
        {Array.from({ length: 25 }).map((_, i) => (
          <line key={`v-${i}`} x1={i * 50} y1={0} x2={i * 50} y2={800} strokeWidth="0.3" />
        ))}
        {/* Horizontal */}
        {Array.from({ length: 17 }).map((_, i) => (
          <line key={`h-${i}`} x1={0} y1={i * 50} x2={1200} y2={i * 50} strokeWidth="0.3" />
        ))}
        {/* Diagonal families — technical blueprint feel */}
        {Array.from({ length: 15 }).map((_, i) => (
          <line key={`d1-${i}`} x1={i * 80} y1={0} x2={i * 80 + 400} y2={800} strokeWidth="0.2" opacity="0.7" />
        ))}
        {Array.from({ length: 15 }).map((_, i) => (
          <line key={`d2-${i}`} x1={1200 - i * 80} y1={0} x2={800 - i * 80} y2={800} strokeWidth="0.2" opacity="0.7" />
        ))}
        {/* Crosshairs / origin marks */}
        <circle cx="600" cy="400" r="120" strokeWidth="0.5" opacity="0.4" />
        <circle cx="600" cy="400" r="80" strokeWidth="0.4" opacity="0.5" />
        <line x1="600" y1={260} x2="600" y2={540} strokeWidth="0.5" opacity="0.5" />
        <line x1={480} y1={400} x2={720} y2={400} strokeWidth="0.5" opacity="0.5" />
        <line x1={530} y1={350} x2={670} y2={450} strokeWidth="0.35" opacity="0.4" />
        <line x1={670} y1={350} x2={530} y2={450} strokeWidth="0.35" opacity="0.4" />
        {/* Dimension-style ticks */}
        {[200, 400, 600, 800, 1000].map((x) => (
          <g key={`dim-${x}`}>
            <line x1={x} y1={395} x2={x} y2={405} strokeWidth="0.6" opacity="0.6" />
          </g>
        ))}
        {[200, 400, 600].map((y) => (
          <g key={`dimy-${y}`}>
            <line x1={595} y1={y} x2={605} y2={y} strokeWidth="0.6" opacity="0.6" />
          </g>
        ))}
      </svg>
    </GSAPSVG>
  )
}
