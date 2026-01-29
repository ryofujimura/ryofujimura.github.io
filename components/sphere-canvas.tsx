"use client"

import { useEffect, useMemo, useRef } from "react"

type Vector2 = { x: number; y: number }
type Point3 = { x: number; y: number; z: number; word: string }
type ProjectedPoint = Point3 & { scale: number; screenX: number; screenY: number; alpha: number }

export type SphereCanvasProps = {
  words: string[]
  height?: number
  className?: string
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function readPrefersReducedMotion() {
  if (typeof window === "undefined") return false
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
}

export function SphereCanvas({ words, height = 220, className = "" }: SphereCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const colorProbeRef = useRef<HTMLSpanElement | null>(null)

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const pointsRef = useRef<Point3[]>([])
  const widthRef = useRef(0)

  const rotationRef = useRef<Vector2>({
    x: Math.random() * Math.PI * 2,
    y: Math.random() * Math.PI * 2,
  })
  const velocityRef = useRef<Vector2>({ x: 0, y: 0 })
  const dragRef = useRef({
    isDragging: false,
    last: { x: 0, y: 0 } satisfies Vector2,
    lastMoveTime: 0,
  })

  const rafRef = useRef<number | null>(null)
  const reducedMotionRef = useRef(false)
  const inkRef = useRef<{ r: number; g: number; b: number }>({ r: 0, g: 0, b: 0 })

  const constants = useMemo(
    () => ({
      radius: 80,
      perspective: 600,
      rotationSensitivity: 0.005,
      friction: 0.94,
      minVelocity: 0.0009,
      frameTime: 1000 / 60,
      minFontSize: 10,
      baseFontSize: 15,
      autoRotate: { x: 0.0016, y: 0.0022 } satisfies Vector2,
      fontFamily:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    }),
    []
  )

  useEffect(() => {
    reducedMotionRef.current = readPrefersReducedMotion()
  }, [])

  useEffect(() => {
    const probe = colorProbeRef.current
    if (!probe || typeof window === "undefined") return
    const color = window.getComputedStyle(probe).color
    const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
    if (!m) return
    inkRef.current = { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctxRef.current = ctx

    const createSpherePoint = (word: string, index: number, total: number): Point3 => {
      // Golden spiral distribution for even coverage (deterministic per index)
      const goldenRatio = (1 + Math.sqrt(5)) / 2
      const t = total <= 1 ? 0.5 : index / total
      const inclination = Math.acos(1 - 2 * t)
      const azimuth = Math.PI * 2 * goldenRatio * index
      return {
        x: constants.radius * Math.sin(inclination) * Math.cos(azimuth),
        y: constants.radius * Math.sin(inclination) * Math.sin(azimuth),
        z: constants.radius * Math.cos(inclination),
        word,
      }
    }

    const createSpherePoints = () => {
      const unique = Array.from(new Set(words.map((w) => w.trim()).filter(Boolean)))
      pointsRef.current = unique.map((w, i) => createSpherePoint(w, i, unique.length))
    }

    const rotatePoint = (p: Point3, r: Vector2): Point3 => {
      // Rotate around X then Y (simple orbital feel)
      let y = p.y * Math.cos(r.x) - p.z * Math.sin(r.x)
      let z = p.y * Math.sin(r.x) + p.z * Math.cos(r.x)
      const x = p.x * Math.cos(r.y) - z * Math.sin(r.y)
      z = p.x * Math.sin(r.y) + z * Math.cos(r.y)
      return { x, y, z, word: p.word }
    }

    const project = (p: Point3): ProjectedPoint => {
      const w = widthRef.current
      const scale = constants.perspective / (constants.perspective + p.z)
      const depth = (p.z + constants.radius) / (constants.radius * 2) // 0..1
      // Invert: bigger (closer) = blacker (opaque), smaller (farther) = grayer (transparent)
      const alpha = clamp(0.18 + (1 - depth) * 0.82, 0, 1)
      return {
        ...p,
        scale,
        screenX: p.x * scale + w / 2,
        screenY: p.y * scale + height / 2,
        alpha,
      }
    }

    const hasMomentum = (v: Vector2) =>
      Math.abs(v.x) > constants.minVelocity || Math.abs(v.y) > constants.minVelocity

    const applyFriction = (v: Vector2): Vector2 => ({
      x: Math.abs(v.x) < constants.minVelocity ? 0 : v.x * constants.friction,
      y: Math.abs(v.y) < constants.minVelocity ? 0 : v.y * constants.friction,
    })

    const updateRotation = () => {
      const r = rotationRef.current
      const v = velocityRef.current
      if (hasMomentum(v)) {
        r.y += v.x
        r.x += v.y
        velocityRef.current = applyFriction(v)
      } else {
        r.x += constants.autoRotate.x
        r.y += constants.autoRotate.y
      }
    }

    const resizeCanvas = () => {
      const c = canvasRef.current
      const ctx2d = ctxRef.current
      if (!c || !ctx2d) return

      const dpr = window.devicePixelRatio || 1
      const width = c.clientWidth
      widthRef.current = width

      c.width = Math.max(1, Math.floor(width * dpr))
      c.height = Math.max(1, Math.floor(height * dpr))

      ctx2d.setTransform(1, 0, 0, 1, 0, 0)
      ctx2d.scale(dpr, dpr)
    }

    const draw = () => {
      const ctx2d = ctxRef.current
      const c = canvasRef.current
      if (!ctx2d || !c) return

      const w = widthRef.current
      ctx2d.clearRect(0, 0, w, height)

      // Subtle technical “noise” dither (very light, keeps it from feeling flat)
      ctx2d.save()
      ctx2d.globalAlpha = 0.04
      ctx2d.fillStyle = "currentColor"
      for (let i = 0; i < 18; i += 1) {
        const x = ((i * 97) % 211) % Math.max(1, w)
        const y = ((i * 53) % 173) % Math.max(1, height)
        ctx2d.fillRect(x, y, 1, 1)
      }
      ctx2d.restore()

      const r = rotationRef.current
      const rotated = pointsRef.current.map((p) => project(rotatePoint(p, r)))
      rotated.sort((a, b) => a.z - b.z)

      const ink = inkRef.current
      for (const p of rotated) {
        const fontSize = Math.max(constants.minFontSize, constants.baseFontSize * p.scale)
        ctx2d.font = `600 ${fontSize}px ${constants.fontFamily}`
        ctx2d.textAlign = "center"
        ctx2d.textBaseline = "middle"
        ctx2d.fillStyle = `rgba(${ink.r}, ${ink.g}, ${ink.b}, ${p.alpha})`
        ctx2d.fillText(p.word, p.screenX, p.screenY)
      }
    }

    const loop = () => {
      if (!dragRef.current.isDragging) updateRotation()
      draw()
      rafRef.current = window.requestAnimationFrame(loop)
    }

    // Init
    resizeCanvas()
    createSpherePoints()

    // Prefer ResizeObserver to track container changes; throttle to one update per frame
    let ro: ResizeObserver | null = null
    let resizeRafId: number | null = null
    const wrapper = wrapperRef.current
    if (wrapper && "ResizeObserver" in window) {
      ro = new ResizeObserver(() => {
        if (resizeRafId != null) return
        resizeRafId = requestAnimationFrame(() => {
          resizeCanvas()
          draw()
          resizeRafId = null
        })
      })
      ro.observe(wrapper)
    } else {
      window.addEventListener("resize", resizeCanvas)
    }

    if (reducedMotionRef.current) {
      // Render once; no continuous RAF
      draw()
    } else {
      loop()
    }

    return () => {
      if (resizeRafId != null) cancelAnimationFrame(resizeRafId)
      if (ro) ro.disconnect()
      else window.removeEventListener("resize", resizeCanvas)
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [words, height, constants])

  return (
    <div ref={wrapperRef} className={className}>
      {/* Probe element for theme-aware ink color */}
      <span ref={colorProbeRef} className="sr-only text-foreground">
        ink
      </span>

      <canvas
        ref={canvasRef}
        style={{ height }}
        className="w-full cursor-crosshair touch-none select-none"
        aria-label="Rotating skill sphere"
        onPointerDown={(e) => {
          e.preventDefault()
          const canvas = canvasRef.current
          if (!canvas) return

          dragRef.current.isDragging = true
          dragRef.current.last = { x: e.clientX, y: e.clientY }
          velocityRef.current = { x: 0, y: 0 }
          dragRef.current.lastMoveTime = performance.now()
          canvas.setPointerCapture(e.pointerId)
        }}
        onPointerMove={(e) => {
          if (!dragRef.current.isDragging) return
          const now = performance.now()
          const dt = now - dragRef.current.lastMoveTime || constants.frameTime

          const last = dragRef.current.last
          const dx = e.clientX - last.x
          const dy = e.clientY - last.y

          const rotationDelta = {
            x: dy * constants.rotationSensitivity,
            y: dx * constants.rotationSensitivity,
          }

          rotationRef.current.x += rotationDelta.x
          rotationRef.current.y += rotationDelta.y

          const timeScale = dt / constants.frameTime
          velocityRef.current = {
            x: rotationDelta.y / timeScale,
            y: rotationDelta.x / timeScale,
          }

          dragRef.current.last = { x: e.clientX, y: e.clientY }
          dragRef.current.lastMoveTime = now
        }}
        onPointerUp={(e) => {
          dragRef.current.isDragging = false
          canvasRef.current?.releasePointerCapture(e.pointerId)
        }}
        onPointerCancel={(e) => {
          dragRef.current.isDragging = false
          canvasRef.current?.releasePointerCapture(e.pointerId)
        }}
      />
    </div>
  )
}

