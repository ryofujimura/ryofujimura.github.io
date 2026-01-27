"use client"

import type { ReactNode } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "fade"
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>()

  const getTransform = () => {
    switch (direction) {
      case "up":
        return "translate3d(0, 40px, 0)"
      case "down":
        return "translate3d(0, -40px, 0)"
      case "left":
        return "translate3d(40px, 0, 0)"
      case "right":
        return "translate3d(-40px, 0, 0)"
      case "fade":
        return "translate3d(0, 0, 0)"
      default:
        return "translate3d(0, 40px, 0)"
    }
  }

  return (
    <div
      ref={ref}
      className={cn("transition-all duration-700 ease-out", className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate3d(0, 0, 0)" : getTransform(),
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
