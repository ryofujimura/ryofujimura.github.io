"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"

/** ASCII block that reveals line-by-line with GSAP. Brutalist terminal aesthetic. */
export function HeroAsciiBlock({
  lines,
  className,
  delay = 0,
  stagger = 0.06,
  duration = 0.5,
}: {
  lines: string[]
  className?: string
  delay?: number
  stagger?: number
  duration?: number
}) {
  const containerRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const lineEls = el.querySelectorAll("[data-ascii-line]")
    gsap.set(lineEls, { opacity: 0, y: 4 })

    const tl = gsap.timeline({ delay })
    tl.to(lineEls, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: "power2.out",
    })
    return () => tl.kill()
  }, [lines, delay, stagger, duration])

  return (
    <pre
      ref={containerRef}
      className={cn(
        "font-mono text-[8px] xs:text-[9px] sm:text-[10px] text-muted-foreground/70 overflow-x-auto py-0.5 touch-manipulation whitespace-pre leading-relaxed",
        className
      )}
      aria-hidden
    >
      {lines.map((line, i) => (
        <span key={i} data-ascii-line className="block">
          {line}
        </span>
      ))}
    </pre>
  )
}
