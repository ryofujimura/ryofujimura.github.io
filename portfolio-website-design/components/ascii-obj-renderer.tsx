"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
  parseObj,
  renderMeshToAscii,
  bufferToText,
  CUBE_OBJ,
  type Mesh,
} from "@/lib/ascii-obj"

export interface AsciiObjRendererProps {
  /** Character width of the output. */
  width?: number
  /** Character height (rows). */
  height?: number
  /** OBJ URL to load, or undefined to use built-in cube. */
  objUrl?: string | null
  /** Whether to animate rotation. */
  animate?: boolean
  /** Rotation speed (rad per second). */
  speed?: number
  /** Class for the container. */
  className?: string
  /** Label / aria. */
  "aria-label"?: string
}

/** Renders a 3D OBJ mesh as ASCII in a monospace pre, with optional rotation and lighting. */
export function AsciiObjRenderer({
  width = 64,
  height = 32,
  objUrl = null,
  animate = true,
  speed = 0.5,
  className,
  "aria-label": ariaLabel = "ASCII 3D render",
}: AsciiObjRendererProps) {
  const [mesh, setMesh] = useState<Mesh | null>(() => parseObj(CUBE_OBJ))
  const [text, setText] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const rotationRef = useRef({ y: 0, x: 0.2 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!objUrl) {
      setMesh(parseObj(CUBE_OBJ))
      setError(null)
      return
    }
    let cancelled = false
    setError(null)
    fetch(objUrl)
      .then((r) => r.text())
      .then((src) => {
        if (cancelled) return
        setMesh(parseObj(src))
      })
      .catch((e) => {
        if (!cancelled) setError(String(e?.message || e))
      })
    return () => {
      cancelled = true
    }
  }, [objUrl])

  useEffect(() => {
    if (!mesh) return

    const tick = (t: number) => {
      const r = rotationRef.current
      if (animate) {
        r.y = (t / 1000) * speed
      }
      const buf = renderMeshToAscii(mesh, {
        width,
        height,
        rotationY: r.y,
        rotationX: r.x,
        distance: 3,
        scale: Math.min(width, height) * 0.35,
        light: [0.5, 0.7, 0.5],
      })
      setText(bufferToText(buf))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [mesh, width, height, animate, speed])

  if (error) {
    return (
      <pre
        className={cn("font-mono text-[8px] xs:text-[9px] sm:text-[10px] text-muted-foreground p-4 bg-secondary/30 border border-foreground/20 overflow-auto", className)}
        aria-live="polite"
      >
        {`> load failed: ${error}\n> using built-in cube`}
      </pre>
    )
  }

  return (
    <pre
      className={cn(
        "font-mono text-[6px] xs:text-[7px] sm:text-[8px] leading-tight text-foreground/90 overflow-auto tabular-nums",
        "bg-background/80 border border-foreground/20 p-2 sm:p-3",
        "touch-manipulation select-none",
        className
      )}
      aria-label={ariaLabel}
      aria-live="polite"
      style={{ lineHeight: 1.1 }}
    >
      {text || " … "}
    </pre>
  )
}
