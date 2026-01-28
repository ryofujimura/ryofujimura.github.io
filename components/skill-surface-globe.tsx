"use client"

import { GSAPSVG, GSAPText } from "@/components/gsap-text"
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
      {/* Brutalist ASCII overlay label */}
      <div className="pointer-events-none absolute inset-x-2 top-2 z-20 flex items-start justify-between gap-2">
        <GSAPText
          variant="lines"
          className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] bg-background/85 text-foreground px-2 py-1 border border-dashed border-foreground/80 shadow-[3px_3px_0_0_theme(colors.foreground)]"
        >
          {`skill-orbit surface // entry ${String(entryIndex + 1).padStart(2, "0")}`}
        </GSAPText>

        {/* ASCII schematic block – reads as a systems diagram, not a badge */}
        <pre className="hidden sm:block font-mono text-[8px] leading-[1.15] text-muted-foreground/90 bg-background/90 px-2 py-1 border border-foreground/80 shadow-[2px_2px_0_0_theme(colors.foreground)]">
{`┌─ skill-vectors ─────┐
│ • globe:  orbit-map │
│ • mode:   live-scan │
│ • type:   hard-skill│
└──────────────────────┘`}
        </pre>
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
          {/* Outer brutalist frame */}
          <rect x="5" y="5" width="390" height={height - 10} opacity="0.45" />
          <rect x="11" y="11" width="378" height={height - 22} opacity="0.3" />
          {/* Horizontal scan rails */}
          <g opacity="0.18">
            {Array.from({ length: 6 }).map((_, i) => {
              const y = 18 + i * ((height - 40) / 5)
              return <line key={`h-${i}`} x1={14} y1={y} x2={386} y2={y} strokeWidth="0.6" />
            })}
          </g>
          {/* Vertical ticks */}
          <g opacity="0.18">
            {Array.from({ length: 10 }).map((_, i) => {
              const x = 18 + i * ((380 - 36) / 9)
              return <line key={`v-${i}`} x1={x} y1={14} x2={x} y2={height - 14} strokeWidth="0.5" />
            })}
          </g>

          {/* Globe glyph (meridians/parallels) */}
          <g opacity="0.2">
            <circle cx={globeCx} cy={globeCy} r={globeR} />
            {/* Meridians */}
            <ellipse cx={globeCx} cy={globeCy} rx={globeR} ry={Math.round(globeR * 0.38)} />
            <ellipse cx={globeCx} cy={globeCy} rx={Math.round(globeR * 0.38)} ry={globeR} />
            <ellipse
              cx={globeCx}
              cy={globeCy}
              rx={Math.round(globeR * 0.7)}
              ry={globeR}
              transform={`rotate(25 ${globeCx} ${globeCy})`}
              opacity="0.6"
            />
            {/* Parallels */}
            <ellipse cx={globeCx} cy={globeCy} rx={globeR} ry={Math.round(globeR * 0.7)} opacity="0.5" />
            <ellipse cx={globeCx} cy={globeCy} rx={globeR} ry={Math.round(globeR * 0.22)} opacity="0.45" />
          </g>

          {/* Right rail: tiny telemetry plot – reads as instrumentation */}
          <g opacity="0.75">
            <polyline
              points={`312,${height - 32} 320,${height - 40} 332,${height - 28} 344,${height - 36} 356,${height - 30} 368,${height - 34}`}
              strokeWidth="0.9"
            />
            {Array.from({ length: 4 }).map((_, i) => {
              const x = 318 + i * 14
              const y = height - 30 - (i % 2 === 0 ? 3 : 7)
              return <circle key={`pt-${i}`} cx={x} cy={y} r="1.4" />
            })}
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

