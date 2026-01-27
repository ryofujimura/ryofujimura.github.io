"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ParallaxTextProps {
  children: ReactNode
  className?: string
  speed?: number
  direction?: "left" | "right"
}

export function ParallaxText({
  children,
  className,
  speed = 0.5,
  direction = "left",
}: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const scrollProgress = 1 - (rect.top / window.innerHeight)
      const newOffset = scrollProgress * 100 * speed * (direction === "left" ? -1 : 1)
      setOffset(newOffset)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed, direction])

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <div
        className="whitespace-nowrap transition-transform duration-100"
        style={{ transform: `translateX(${offset}px)` }}
      >
        {children}
      </div>
    </div>
  )
}
