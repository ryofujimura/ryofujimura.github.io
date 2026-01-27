"use client"

import React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  amplitude?: number
  frequency?: number
  rotateX?: number
  rotateY?: number
  delay?: number
}

export function FloatingElement({
  children,
  className,
  amplitude = 10,
  frequency = 3000,
  rotateX = 5,
  rotateY = 5,
  delay = 0,
}: FloatingElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ y: 0, rotX: 0, rotY: 0 })

  useEffect(() => {
    let animationId: number
    const startTime = Date.now() + delay

    const animate = () => {
      const elapsed = Date.now() - startTime
      const y = Math.sin((elapsed / frequency) * Math.PI * 2) * amplitude
      const rotX = Math.sin((elapsed / (frequency * 1.3)) * Math.PI * 2) * rotateX
      const rotY = Math.cos((elapsed / (frequency * 0.9)) * Math.PI * 2) * rotateY

      setOffset({ y, rotX, rotY })
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [amplitude, frequency, rotateX, rotateY, delay])

  return (
    <div
      ref={elementRef}
      className={cn("transition-transform will-change-transform", className)}
      style={{
        transform: `translate3d(0, ${offset.y}px, 0) rotateX(${offset.rotX}deg) rotateY(${offset.rotY}deg)`,
      }}
    >
      {children}
    </div>
  )
}
