"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * Brutalist technical canvas for About: ortho grid, diagonals, circuit traces,
 * corner brackets. All paths draw in with GSAP on scroll into view.
 */
export function AboutTechnicalCanvas({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<SVGSVGElement>(null)
  const circuitRef = useRef<SVGSVGElement>(null)
  const cornersRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const trigger = sectionRef?.current ?? containerRef.current
    if (!trigger) return

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
        scrollTrigger: {
          trigger,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      })
    }

    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.set(gridRef.current.querySelectorAll("line"), { opacity: 0 })
        drawIn(gridRef.current, 2, 0, 0.025)
      }
      if (circuitRef.current) {
        gsap.set(circuitRef.current.querySelectorAll("path"), { opacity: 0 })
        drawIn(circuitRef.current, 1.6, 0.25, 0.05)
      }
      if (cornersRef.current) {
        gsap.set(cornersRef.current.querySelectorAll("path"), { opacity: 0 })
        drawIn(cornersRef.current, 0.8, 0.1, 0.06)
      }
    }, containerRef)

    return () => ctx.revert()
  }, [sectionRef])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden text-foreground/[0.06] dark:text-foreground/[0.08]"
      aria-hidden
    >
      <svg
        ref={gridRef}
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="currentColor"
      >
        {Array.from({ length: 21 }).map((_, i) => (
          <line key={`v-${i}`} x1={i * 40} y1={0} x2={i * 40} y2={600} strokeWidth="0.3" />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`h-${i}`} x1={0} y1={i * 40} x2={800} y2={i * 40} strokeWidth="0.3" />
        ))}
        <line x1={0} y1={0} x2={800} y2={600} strokeWidth="0.2" opacity="0.6" />
        <line x1={800} y1={0} x2={0} y2={600} strokeWidth="0.2" opacity="0.6" />
        {[160, 400, 640].map((x, i) => (
          <line key={`d1-${i}`} x1={x} y1={0} x2={x + 300} y2={600} strokeWidth="0.15" opacity="0.5" />
        ))}
        {[120, 300, 480].map((y, i) => (
          <line key={`d2-${i}`} x1={0} y1={y} x2={800} y2={y + 400} strokeWidth="0.15" opacity="0.5" />
        ))}
      </svg>

      <svg
        ref={circuitRef}
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.4"
      >
        <path d="M 40 80 L 160 80 L 160 200 L 280 200 L 280 320" />
        <path d="M 760 520 L 640 520 L 640 400 L 520 400 L 520 280" />
        <path d="M 400 40 L 400 120 L 320 120 L 320 200" />
        <path d="M 400 560 L 400 480 L 480 480 L 480 400" />
        <path d="M 200 300 L 360 300 M 440 300 L 600 300" />
        <path d="M 400 140 L 400 460" />
      </svg>

      <svg
        ref={cornersRef}
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M 0 48 L 0 0 L 48 0" />
        <path d="M 752 0 L 800 0 L 800 48" />
        <path d="M 800 552 L 800 600 L 752 600" />
        <path d="M 48 600 L 0 600 L 0 552" />
      </svg>
    </div>
  )
}
