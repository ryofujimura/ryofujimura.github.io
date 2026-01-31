"use client"

import { cn } from "@/lib/utils"

/** Leonardo da Vinci notebook page — aged paper, ASCII diagrams, spec sheet vibe */
export function LeonardoNotebook({
  children,
  className,
  folioRef,
  date,
}: {
  children: React.ReactNode
  className?: string
  folioRef?: string
  date?: string
}) {
  return (
    <div
      className={cn(
        "relative p-4 sm:p-6 md:p-8 bg-[oklch(0.95_0.02_45/0.9)] dark:bg-[oklch(0.15_0.02_45/0.7)]",
        "border border-foreground/20 shadow-lg",
        "before:absolute before:inset-0 before:opacity-30",
        "before:bg-[radial-gradient(circle_at_30%_40%,rgba(139,90,43,0.1)_0%,transparent_50%)]",
        "before:pointer-events-none",
        "overflow-hidden",
        className
      )}
      style={{
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,90,43,0.03) 2px, rgba(139,90,43,0.03) 4px),
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139,90,43,0.02) 2px, rgba(139,90,43,0.02) 4px)
        `,
      }}
    >
      {/* Folio header */}
      {(folioRef || date) && (
        <div className="font-mono text-[8px] xs:text-[10px] sm:text-xs text-muted-foreground/60 mb-3 sm:mb-4 border-b border-foreground/10 pb-2">
          {folioRef && <span className="block">FOLIO: {folioRef}</span>}
          {date && <span className="block">DATE: {date}</span>}
        </div>
      )}
      {children}
    </div>
  )
}

/** ASCII geometric diagram — Leonardo style */
export function AsciiDiagram({
  title,
  spec,
  children,
  className,
}: {
  title?: string
  spec?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("font-mono text-[8px] xs:text-[10px] sm:text-xs leading-tight", className)}>
      {title && (
        <div className="text-foreground/80 mb-2 font-semibold border-b border-foreground/20 pb-1">
          {title}
        </div>
      )}
      <pre className="text-foreground/70 whitespace-pre overflow-x-auto touch-manipulation">
        {children}
      </pre>
      {spec && (
        <div className="mt-2 text-[8px] xs:text-[10px] text-muted-foreground/70 border-t border-foreground/10 pt-1">
          SPEC: {spec}
        </div>
      )}
    </div>
  )
}

/** Spec sheet annotation block */
export function SpecAnnotation({
  label,
  value,
  unit,
  notes,
  className,
}: {
  label: string
  value: string | number
  unit?: string
  notes?: string
  className?: string
}) {
  return (
    <div className={cn("font-mono text-[9px] xs:text-[10px] sm:text-xs border-l-2 border-accent/30 pl-2 sm:pl-3 py-1", className)}>
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <span className="text-foreground/90 font-semibold">{label}:</span>
        <span className="text-accent tabular-nums">
          {value}
          {unit && <span className="text-muted-foreground/70 ml-0.5">{unit}</span>}
        </span>
      </div>
      {notes && (
        <div className="text-[8px] xs:text-[9px] text-muted-foreground/60 mt-0.5 italic">
          // {notes}
        </div>
      )}
    </div>
  )
}

/** Mirror writing text block (Leonardo style) */
export function MirrorText({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "font-mono text-[9px] xs:text-[10px] sm:text-xs leading-relaxed",
        "text-foreground/70 italic",
        "transform scale-x-[-1]",
        className
      )}
      style={{ direction: "rtl", textAlign: "left" }}
    >
      {children}
    </div>
  )
}

/** ASCII geometric shapes library */
export const AsciiShapes = {
  circle: (radius = 5) => {
    const r = Math.max(3, Math.min(radius, 10))
    const lines: string[] = []
    for (let y = -r; y <= r; y++) {
      let line = ""
      for (let x = -r; x <= r; x++) {
        const dist = Math.sqrt(x * x + y * y)
        if (Math.abs(dist - r) < 0.5) line += "·"
        else if (dist < r) line += " "
        else line += " "
      }
      lines.push(line)
    }
    return lines.join("\n")
  },
  spiral: () => `    ╭─╮
   ╱   ╲
  │  ·  │
  │     │
   ╲   ╱
    ╰─╯`,
  polyhedron: () => `     /\\     /\\
    /  \\___/  \\
   /    \\ /    \\
  /______\\______\\
  \\      /      \\
   \\____/        \\`,
  gear: () => `    ╱╲  ╱╲
   ╱  ╲╱  ╲
  │   ╳   │
   ╲  ╱╲  ╱
    ╲╱  ╲╱`,
  vitruvian: () => `    ╭─────╮
   ╱       ╲
  │    ╳    │
  │    │    │
   ╲   │   ╱
    ╰───╯`,
  wave: () => `  ╱╲    ╱╲    ╱╲
 ╱  ╲  ╱  ╲  ╱  ╲
╱    ╲╱    ╲╱    ╲`,
  grid: (w = 5, h = 5) => {
    let grid = ""
    for (let y = 0; y < h; y++) {
      let line = ""
      for (let x = 0; x < w; x++) {
        if (x === 0 || x === w - 1) line += "│"
        else if (y === 0 || y === h - 1) line += "─"
        else line += x % 2 === y % 2 ? "·" : " "
      }
      grid += line + "\n"
    }
    return grid.trim()
  },
}

/** Leonardo-style technical drawing with measurements */
export function TechnicalDrawing({
  title,
  measurements,
  asciiArt,
  notes,
  className,
}: {
  title: string
  measurements?: Array<{ label: string; value: string; unit?: string }>
  asciiArt: string
  notes?: string
  className?: string
}) {
  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      <div className="font-mono text-[10px] xs:text-xs sm:text-sm text-foreground/90 font-semibold border-b border-foreground/20 pb-1">
        {title}
      </div>
      <div className="bg-secondary/20 p-3 sm:p-4 border border-foreground/10">
        <pre className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] text-foreground/80 whitespace-pre overflow-x-auto touch-manipulation">
          {asciiArt}
        </pre>
      </div>
      {measurements && measurements.length > 0 && (
        <div className="space-y-1.5 sm:space-y-2">
          {measurements.map((m, i) => (
            <SpecAnnotation
              key={i}
              label={m.label}
              value={m.value}
              unit={m.unit}
            />
          ))}
        </div>
      )}
      {notes && (
        <div className="font-mono text-[8px] xs:text-[9px] text-muted-foreground/70 italic border-t border-foreground/10 pt-2">
          NOTE: {notes}
        </div>
      )}
    </div>
  )
}
