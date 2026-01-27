"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

// Da Vinci-inspired golden ratio and geometric elements
const PHI = 1.618033988749

interface Shape3DProps {
  className?: string
  variant?: "cube" | "pyramid" | "sphere" | "vitruvian" | "spiral"
  size?: number
  color?: string
}

export function Shape3D({ className, variant = "cube", size = 100, color = "currentColor" }: Shape3DProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let animationId: number
    const startTime = Date.now()

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      setRotation({
        x: elapsed * 15,
        y: elapsed * 20,
      })
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])

  if (variant === "vitruvian") {
    return (
      <div className={cn("relative", className)} style={{ width: size, height: size }}>
        {/* Vitruvian circle */}
        <div
          className="absolute inset-0 rounded-full border border-foreground/10"
          style={{
            transform: `rotateX(${rotation.x * 0.1}deg) rotateY(${rotation.y * 0.1}deg)`,
          }}
        />
        {/* Inner square based on golden ratio */}
        <div
          className="absolute border border-foreground/10"
          style={{
            width: size / PHI,
            height: size / PHI,
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) rotateX(${rotation.x * 0.15}deg) rotateY(${rotation.y * 0.15}deg) rotate(45deg)`,
          }}
        />
        {/* Cross lines */}
        <div className="absolute w-px h-full bg-foreground/5 left-1/2 top-0" />
        <div className="absolute w-full h-px bg-foreground/5 top-1/2 left-0" />
      </div>
    )
  }

  if (variant === "spiral") {
    return (
      <svg
        className={cn("", className)}
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{
          transform: `rotateX(${rotation.x * 0.05}deg) rotateY(${rotation.y * 0.05}deg)`,
        }}
      >
        {/* Golden spiral approximation */}
        <path
          d="M50 50 Q50 20 80 20 Q80 50 80 80 Q50 80 20 80 Q20 50 20 20 Q35 20 50 35 Q50 50 50 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-foreground/10"
        />
        <circle cx="50" cy="50" r="2" className="fill-foreground/20" />
      </svg>
    )
  }

  if (variant === "pyramid") {
    return (
      <div
        className={cn("relative preserve-3d", className)}
        style={{
          width: size,
          height: size,
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Pyramid faces */}
        {[0, 90, 180, 270].map((angle) => (
          <div
            key={angle}
            className="absolute border border-foreground/10"
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size / 2}px solid transparent`,
              borderRight: `${size / 2}px solid transparent`,
              borderBottom: `${size * 0.866}px solid rgba(0,0,0,0.02)`,
              left: "50%",
              bottom: "50%",
              transformOrigin: "bottom center",
              transform: `translateX(-50%) rotateY(${angle}deg) rotateX(60deg)`,
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === "sphere") {
    return (
      <div
        className={cn("relative", className)}
        style={{
          width: size,
          height: size,
          transform: `rotateX(${rotation.x * 0.3}deg) rotateY(${rotation.y * 0.3}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Latitude lines */}
        {[0, 30, 60, 90, 120, 150].map((angle) => (
          <div
            key={`lat-${angle}`}
            className="absolute rounded-full border border-foreground/5"
            style={{
              width: size * Math.sin((angle * Math.PI) / 180),
              height: size * 0.3,
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotateX(${angle}deg)`,
            }}
          />
        ))}
        {/* Longitude lines */}
        {[0, 45, 90, 135].map((angle) => (
          <div
            key={`lon-${angle}`}
            className="absolute rounded-full border border-foreground/5"
            style={{
              width: size,
              height: size,
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotateY(${angle}deg)`,
            }}
          />
        ))}
      </div>
    )
  }

  // Default cube
  return (
    <div
      ref={containerRef}
      className={cn("relative preserve-3d", className)}
      style={{
        width: size,
        height: size,
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Cube faces */}
      {["front", "back", "left", "right", "top", "bottom"].map((face, i) => {
        const transforms: Record<string, string> = {
          front: `translateZ(${size / 2}px)`,
          back: `rotateY(180deg) translateZ(${size / 2}px)`,
          left: `rotateY(-90deg) translateZ(${size / 2}px)`,
          right: `rotateY(90deg) translateZ(${size / 2}px)`,
          top: `rotateX(90deg) translateZ(${size / 2}px)`,
          bottom: `rotateX(-90deg) translateZ(${size / 2}px)`,
        }
        return (
          <div
            key={face}
            className="absolute border border-foreground/10 bg-foreground/[0.01]"
            style={{
              width: size,
              height: size,
              transform: transforms[face],
              backfaceVisibility: "visible",
            }}
          />
        )
      })}
    </div>
  )
}

export function DaVinciGrid({ className }: { className?: string }) {
  return (
    <svg className={cn("w-full h-full", className)} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-foreground/5" />
        </pattern>
        <pattern id="diagonalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 0 0 L 40 40 M 40 0 L 0 40" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-foreground/3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <rect width="100%" height="100%" fill="url(#diagonalGrid)" />
      {/* Golden ratio rectangles */}
      <rect x="50" y="50" width={186} height={115} fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground/5" />
      <rect x="50" y="50" width={115} height={115} fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground/5" />
    </svg>
  )
}
