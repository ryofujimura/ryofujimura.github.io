"use client"

import { useRef, useState, type ReactNode, type MouseEvent } from "react"
import { cn } from "@/lib/utils"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  as?: "button" | "a"
  href?: string
  target?: string
  rel?: string
  onClick?: () => void
  cursorText?: string
  strength?: number
}

export function MagneticButton({
  children,
  className,
  as = "button",
  href,
  target,
  rel,
  onClick,
  cursorText,
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const distanceX = (e.clientX - centerX) * strength
    const distanceY = (e.clientY - centerY) * strength
    
    setPosition({ x: distanceX, y: distanceY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const Component = as

  return (
    <Component
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="pointer"
      data-cursor-text={cursorText}
      className={cn("transition-transform duration-200 ease-out", className)}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      {children}
    </Component>
  )
}
