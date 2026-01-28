"use client"

import { GSAPSVG } from "@/components/gsap-text"
import { TechnicalGrid } from "@/components/technical-grid"
import { cn } from "@/lib/utils"
import { SphereCanvas } from "@/components/sphere-canvas"

export type SkillSurfaceGlobeProps = {
  entryIndex: number
  words: string[]
  height?: number
  className?: string
}

export function SkillSurfaceGlobe({ entryIndex, words, height = 220, className }: SkillSurfaceGlobeProps) {
  const globeCx = 200
  const globeCy = Math.round(height / 2)
  const globeR = 92

  return (
    <div
      className={cn(
        "relative border border-foreground bg-secondary/60 p-3 sm:p-4 overflow-hidden",
        "shadow-[4px_4px_0_0_theme(colors.foreground)] sm:shadow-[6px_6px_0_0_theme(colors.foreground)]",
        className
      )}
    >
      {/* Brutalist ASCII overlay label (static so it never disappears between entries) */}
      <div className="pointer-events-none absolute inset-x-2 top-1.5 z-20 flex items-start justify-between gap-2">
        <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.24em] bg-background/80 text-muted-foreground px-1.5 py-[2px] border border-dashed border-foreground/70">
          skills
        </div>
      </div>

      {/* Subtle technical backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <TechnicalGrid className="w-full h-full text-foreground" />
      </div>

      {/* Scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10] bg-[repeating-linear-gradient(180deg,transparent,transparent_6px,theme(colors.foreground/12)_6px,theme(colors.foreground/12)_8px)]"
        aria-hidden
      />

      {/* ASCII frame + ticks (GSAP draw-in) */}
      <GSAPSVG className="pointer-events-none absolute inset-0 text-foreground/60">
        <svg viewBox={`0 0 400 ${height}`} className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="0.8">
          {/* Globe glyph (meridians/parallels) */}
          <g opacity="0.2">
            <circle cx={globeCx} cy={globeCy} r={globeR} />
            {/* Meridians */}
            <ellipse cx={globeCx} cy={globeCy} rx={globeR} ry={Math.round(globeR * 0.28)} />
            <ellipse cx={globeCx} cy={globeCy} rx={Math.round(globeR * 0.38)} ry={globeR} />
            <ellipse
              cx={globeCx}
              cy={globeCy}
              rx={Math.round(globeR * 0.7)}
              ry={globeR}
              transform={`rotate(25 ${globeCx} ${globeCy})`}
              opacity="0.4"
            />
            {/* Parallels */}
            <ellipse cx={globeCx} cy={globeCy} rx={globeR} ry={Math.round(globeR * 0.7)} opacity="0.5" />
            <ellipse cx={globeCx} cy={globeCy} rx={globeR} ry={Math.round(globeR * 0.22)} opacity="0.45" />
          </g>
        </svg>
      </GSAPSVG>

      {/* Canvas window */}
      <div className="relative z-10">
        <SphereCanvas words={words} height={height} className="w-full" />
      </div>
    </div>
  )
}

