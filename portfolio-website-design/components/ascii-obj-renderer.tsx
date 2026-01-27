"use client"

/**
 * ASCII OBJ renderer — per Alex Harri (alexharri.com/blog/ascii-rendering) and OBJ tutorial.
 * 1) Load OBJ  2) Project 3D→2D  3) Map depth/brightness to ASCII  " .:-=+*#%@"
 * 4) Draw into 2D buffer and display in <pre>.
 */

import { useState, useEffect, useCallback, useRef } from "react"
import { parseOBJ, type ParsedOBJ, type Vec3 } from "@/lib/obj-parser"
import { cn } from "@/lib/utils"

const ASCII_CHARS = " .:-=+*#%@" // 10 levels: lighter → denser (tutorial mapping)

interface AsciiObjRendererProps {
  /** URL to .OBJ file (e.g. /models/mouse1.obj) */
  src: string
  /** Grid size: [cols, rows] */
  cols?: number
  rows?: number
  /** Orthographic scale (larger = bigger on screen) */
  scale?: number
  /** Rotation around Y (radians); updated for animation */
  rotateY?: number
  /** Distance for perspective (0 = orthographic) */
  distance?: number
  /** Subsample: use every Nth vertex for performance (1 = all) */
  subsample?: number
  className?: string
}

function project(
  v: Vec3,
  rotateY: number,
  scale: number,
  cols: number,
  rows: number,
  distance: number
): { sx: number; sy: number; depth: number } {
  let [x, y, z] = v
  if (rotateY !== 0) {
    const c = Math.cos(rotateY)
    const s = Math.sin(rotateY)
    const x2 = x * c - z * s
    const z2 = x * s + z * c
    x = x2
    z = z2
  }
  const depth = z
  let sx: number
  let sy: number
  if (distance > 0) {
    const t = 1 / (z + distance)
    sx = x * t * scale + cols / 2
    sy = -y * t * scale + rows / 2
  } else {
    sx = x * scale + cols / 2
    sy = -y * scale + rows / 2
  }
  return { sx: Math.round(sx), sy: Math.round(sy), depth }
}

function renderFrame(
  obj: ParsedOBJ,
  cols: number,
  rows: number,
  scale: number,
  rotateY: number,
  distance: number,
  subsample: number
): string {
  // Per-pixel: keep closest depth (min z) so front faces occlude back
  const buffer: number[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Infinity)
  )

  const verts = obj.vertices
  const step = Math.max(1, subsample)
  for (let i = 0; i < verts.length; i += step) {
    const { sx, sy, depth } = project(verts[i], rotateY, scale, cols, rows, distance)
    if (sx >= 0 && sx < cols && sy >= 0 && sy < rows) {
      if (depth < buffer[sy][sx]) buffer[sy][sx] = depth
    }
  }

  const valid = buffer.flat().filter((d) => d !== Infinity)
  const dMin = valid.length ? Math.min(...valid) : 0
  const dMax = valid.length ? Math.max(...valid) : 1
  const range = dMax - dMin || 1

  const lines: string[] = []
  for (let r = 0; r < rows; r++) {
    let line = ""
    for (let c = 0; c < cols; c++) {
      const d = buffer[r][c]
      if (d === Infinity) {
        line += " "
        continue
      }
      const t = (d - dMin) / range
      const brightness = 1 - t
      const idx = Math.min(
        ASCII_CHARS.length - 1,
        Math.floor(brightness * (ASCII_CHARS.length - 0.01))
      )
      line += ASCII_CHARS[idx]
    }
    lines.push(line)
  }
  return lines.join("\n")
}

export function AsciiObjRenderer({
  src,
  cols = 64,
  rows = 32,
  scale = 12,
  rotateY: initialRotateY = 0,
  distance = 0,
  subsample = 10,
  className,
}: AsciiObjRendererProps) {
  const [obj, setObj] = useState<ParsedOBJ | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rotateY, setRotateY] = useState(initialRotateY)
  const [ascii, setAscii] = useState<string>("")
  const rafRef = useRef<number>(0)
  const angleRef = useRef(initialRotateY)

  useEffect(() => {
    let cancelled = false
    setError(null)
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load ${src}: ${r.status}`)
        return r.text()
      })
      .then((text) => {
        if (cancelled) return
        const parsed = parseOBJ(text, 50000, 50000)
        if (parsed.vertices.length === 0) throw new Error("No vertices in OBJ")
        setObj(parsed)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e))
      })
    return () => {
      cancelled = true
    }
  }, [src])

  const doRender = useCallback(() => {
    if (!obj) return
    const out = renderFrame(obj, cols, rows, scale, angleRef.current, distance, subsample)
    setAscii(out)
  }, [obj, cols, rows, scale, distance, subsample])

  useEffect(() => {
    if (!obj) return
    doRender()
  }, [obj, doRender])

  useEffect(() => {
    if (!obj) return
    let ticking = true
    const loop = () => {
      if (!ticking) return
      angleRef.current += 0.008
      setRotateY(angleRef.current)
      doRender()
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      ticking = false
      cancelAnimationFrame(rafRef.current)
    }
  }, [obj, doRender])

  if (error) {
    return (
      <div className={cn("font-mono text-xs text-muted-foreground p-4 border border-border", className)}>
        <span className="text-destructive">Error:</span> {error}
      </div>
    )
  }

  if (!ascii) {
    return (
      <div className={cn("font-mono text-[10px] text-muted-foreground p-4 border border-border", className)}>
        Loading OBJ…
      </div>
    )
  }

  return (
    <pre
      className={cn(
        "font-mono text-[6px] xs:text-[7px] sm:text-[8px] leading-none text-foreground/80 overflow-auto touch-manipulation",
        "border border-foreground/20 bg-background p-2 sm:p-3",
        className
      )}
      style={{ fontFamily: "ui-monospace, monospace" }}
      aria-label="ASCII 3D model"
    >
      <code>{ascii}</code>
    </pre>
  )
}
