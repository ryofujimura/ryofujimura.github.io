"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { imageDataToAscii, type AsciiOptions } from "@/lib/ascii-render"
import { cn } from "@/lib/utils"

/**
 * Interactive split view: 3D (OBJ) on one side, ASCII on the other.
 * Mimics https://alexharri.com/blog/ascii-rendering split view.
 * Uses Three.js to render OBJ → canvas, then imageDataToAscii per Alex Harri's lightness mapping.
 */
export function AsciiObjSplitView({
  objUrl,
  className,
  asciiCols = 80,
  asciiRows = 40,
  sampleQuality = 2,
  renderWidth = 320,
  renderHeight = 240,
}: {
  objUrl: string
  className?: string
  asciiCols?: number
  asciiRows?: number
  sampleQuality?: number
  renderWidth?: number
  renderHeight?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [split, setSplit] = useState(0.5)
  const [ascii, setAscii] = useState<string>("")
  const [dragging, setDragging] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const rafRef = useRef<number>(0)
  const threeRef = useRef<{
    scene: unknown
    camera: unknown
    renderer: unknown
    mesh: unknown
  } | null>(null)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    setDragging(true)
  }, [])
  const handlePointerUp = useCallback(() => setDragging(false), [])
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      setSplit(Math.max(0.15, Math.min(0.85, x)))
    },
    [dragging]
  )
  useEffect(() => {
    if (!dragging) return
    const onDocPointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      setSplit(Math.max(0.15, Math.min(0.85, x)))
    }
    const onDocPointerUp = () => setDragging(false)
    document.addEventListener("pointermove", onDocPointerMove)
    document.addEventListener("pointerup", onDocPointerUp)
    document.addEventListener("pointercancel", onDocPointerUp)
    return () => {
      document.removeEventListener("pointermove", onDocPointerMove)
      document.removeEventListener("pointerup", onDocPointerUp)
      document.removeEventListener("pointercancel", onDocPointerUp)
    }
  }, [dragging])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    let cancelled = false
    let rotateY = 0
    let rotateX = 0
    let lastPointer = { x: 0, y: 0 }
    const pointerMove = (e: PointerEvent) => {
      lastPointer = { x: e.clientX, y: e.clientY }
      rotateY += (e.movementX ?? 0) * 0.5
      rotateX += (e.movementY ?? 0) * 0.5
    }

    async function init() {
      const ThreeMod = await import("three")
      const LoaderMod = await import("three/examples/jsm/loaders/OBJLoader.js")
      const THREE = (ThreeMod as { default?: Record<string, unknown> }).default ?? (ThreeMod as Record<string, unknown>)
      const OBJLoaderClass = (LoaderMod as { OBJLoader?: new () => { parse: (s: string) => unknown } }).OBJLoader
      if (cancelled || !OBJLoaderClass) return

      const scene = new (THREE.Scene as new () => { background: unknown; add: (o: unknown) => void })()
      scene.background = new (THREE.Color as new (c: number) => unknown)(0x111111)

      const camera = new (THREE.PerspectiveCamera as new (a: number, b: number, c: number, d: number) => {
        position: { set: (x: number, y: number, z: number) => void }
        lookAt: (x: number, y: number, z: number) => void
      })(50, renderWidth / renderHeight, 0.1, 1000)
      camera.position.set(0, 0, 2.5)
      camera.lookAt(0, 0, 0)

      const renderer = new (THREE.WebGLRenderer as new (o: { canvas: HTMLCanvasElement; alpha: boolean; antialias: boolean }) => {
        setSize: (w: number, h: number) => void
        setPixelRatio: (n: number) => void
        setClearColor: (c: number) => void
        render: (s: unknown, c: unknown) => void
        getContext: () => WebGLRenderingContext
      })({ canvas, alpha: false, antialias: true })
      renderer.setSize(renderWidth, renderHeight)
      renderer.setPixelRatio(Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1))
      renderer.setClearColor(0x111111)

      const light = new (THREE.DirectionalLight as new (c: number, i: number) => { position: { set: (a: number, b: number, c: number) => void } })(0xffffff, 1.2)
      light.position.set(1, 1, 1)
      scene.add(light)
      scene.add(new (THREE.AmbientLight as new (c: number, i: number) => unknown)(0x404040, 0.6))

      const loader = new OBJLoaderClass()
      try {
        const resp = await fetch(objUrl)
        if (!resp.ok) throw new Error(`Failed to load ${objUrl}`)
        const text = await resp.text()
        const obj = loader.parse(text) as { traverse: (fn: (c: unknown) => void) => void; position: { sub: (v: unknown) => void }; scale: { setScalar: (n: number) => void } }
        scene.add(obj)
        obj.traverse((child) => {
          const c = child as { isMesh?: boolean; material?: unknown }
          if (c.isMesh && c.material && !Array.isArray(c.material)) {
            const mat = c.material as { color?: { setHex: (n: number) => void } }
            if (mat.color) mat.color.setHex(0x888888)
          }
        })
        const box = new (THREE.Box3 as new () => { setFromObject: (o: unknown) => void; getCenter: (v: unknown) => { x: number; y: number; z: number }; getSize: (v: unknown) => { x: number; y: number; z: number } })()
        box.setFromObject(obj)
        const center = box.getCenter(new (THREE.Vector3 as new () => unknown)())
        const size = box.getSize(new (THREE.Vector3 as new () => unknown)())
        const maxDim = Math.max((size as { x: number; y: number; z: number }).x, (size as { x: number; y: number; z: number }).y, (size as { x: number; y: number; z: number }).z)
        obj.position.sub(center)
        obj.scale.setScalar(1.2 / (maxDim || 1))
        threeRef.current = { scene, camera, renderer, mesh: obj }
        setLoaded(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load OBJ")
        return
      }

      const opts: AsciiOptions = { cols: asciiCols, rows: asciiRows, sampleQuality, ramp: " .:-=+*#%@" }

      function tick() {
        if (cancelled || !threeRef.current) return
        const ref = threeRef.current
        const mesh = ref.mesh as { rotation: { y: number; x: number } }
        mesh.rotation.y = rotateY * (Math.PI / 180)
        mesh.rotation.x = rotateX * (Math.PI / 180)
        const ren = ref.renderer as { render: (s: unknown, c: unknown) => void; getContext: () => WebGLRenderingContext }
        ren.render(ref.scene, ref.camera)

        const gl = ren.getContext()
        const w = renderWidth
        const h = renderHeight
        const pixels = new Uint8ClampedArray(w * h * 4)
        gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
        const flipped = new Uint8ClampedArray(w * h * 4)
        for (let y = 0; y < h; y++) {
          const srcRow = (h - 1 - y) * w * 4
          const dstRow = y * w * 4
          for (let i = 0; i < w * 4; i++) flipped[dstRow + i] = pixels[srcRow + i]
        }
        const img = new ImageData(flipped, w, h)
        setAscii(imageDataToAscii(img, w, h, opts))
        rafRef.current = requestAnimationFrame(tick)
      }

      tick()
    }

    init()
    container.addEventListener("pointermove", pointerMove as EventListener)
    return () => {
      cancelled = true
      container.removeEventListener("pointermove", pointerMove as EventListener)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      threeRef.current = null
    }
  }, [objUrl, asciiCols, asciiRows, sampleQuality, renderWidth, renderHeight])

  const splitPct = Math.round(split * 100)

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden border-2 border-foreground bg-[#111]", className)}
      onPointerLeave={handlePointerUp}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerMove={handlePointerMove}
      style={{ touchAction: "none" }}
    >
      <div className="flex w-full" style={{ minHeight: "240px" }}>
        {/* Left: 3D canvas */}
        <div
          className="relative shrink-0 overflow-hidden bg-[#111]"
          style={{ width: `${splitPct}%`, minWidth: 0 }}
        >
          <canvas
            ref={canvasRef}
            width={renderWidth}
            height={renderHeight}
            className="h-auto w-full max-h-[50vh] object-contain"
            style={{ display: loaded ? "block" : "none" }}
          />
          {!loaded && !error && (
            <div className="flex h-[200px] sm:h-[240px] items-center justify-center text-muted-foreground font-mono text-xs">
              Loading…
            </div>
          )}
          {error && (
            <div className="flex h-[200px] sm:h-[240px] items-center justify-center text-destructive font-mono text-xs p-4">
              {error}
            </div>
          )}
        </div>

        {/* Draggable divider — like Alex Harri's split */}
        <button
          type="button"
          aria-label="Adjust split"
          className={cn(
            "touch-target absolute top-0 bottom-0 z-10 w-3 sm:w-4 flex-shrink-0 cursor-col-resize",
            "bg-foreground/80 hover:bg-foreground transition-colors",
            "flex items-center justify-center"
          )}
          style={{ left: `calc(${splitPct}% - 6px)`, minWidth: 24, minHeight: 44 }}
          onPointerDown={handlePointerDown}
        >
          <span className="text-background text-[10px] font-mono select-none hidden sm:inline">
            ||
          </span>
        </button>

        {/* Right: ASCII */}
        <div
          className="overflow-auto flex-1 min-w-0 bg-background border-l-2 border-foreground p-2 sm:p-3"
          style={{ width: `${100 - splitPct}%` }}
        >
          <pre
            className="font-mono text-[6px] xs:text-[7px] sm:text-[8px] leading-tight text-foreground whitespace-pre"
            aria-label="ASCII rendering"
          >
            {ascii || " "}
          </pre>
        </div>
      </div>
      <p className="font-mono text-[9px] sm:text-[10px] text-muted-foreground px-2 py-1 border-t border-foreground/30">
        Split view · Drag to compare · <a href="https://alexharri.com/blog/ascii-rendering" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">ASCII rendering</a>
      </p>
    </div>
  )
}
