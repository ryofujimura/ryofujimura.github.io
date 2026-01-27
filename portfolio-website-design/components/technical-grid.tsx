"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export function TechnicalGrid({ className = "" }: { className?: string }) {
  const gridRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!gridRef.current) return

    const lines = gridRef.current.querySelectorAll("line")
    gsap.fromTo(
      lines,
      { strokeDasharray: "0 1000" },
      {
        strokeDasharray: "1000 0",
        duration: 2,
        stagger: 0.05,
        ease: "power2.out",
      }
    )
  }, [])

  return (
    <svg
      ref={gridRef}
      className={className}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* Vertical lines */}
      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 10}
          y1="0"
          x2={i * 10}
          y2="100"
          stroke="currentColor"
          strokeWidth="0.1"
          opacity="0.3"
        />
      ))}
      {/* Horizontal lines */}
      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 10}
          x2="100"
          y2={i * 10}
          stroke="currentColor"
          strokeWidth="0.1"
          opacity="0.3"
        />
      ))}
      {/* Diagonal accent lines */}
      <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.15" opacity="0.15" />
      <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.15" opacity="0.15" />
    </svg>
  )
}

export function TechnicalPattern({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Corner brackets */}
      <svg className="absolute top-4 left-4 w-12 h-12 text-foreground/20" viewBox="0 0 48 48">
        <path d="M0 16V0h16M0 32v16h16" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute top-4 right-4 w-12 h-12 text-foreground/20" viewBox="0 0 48 48">
        <path d="M48 16V0H32M48 32v16H32" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-4 left-4 w-12 h-12 text-foreground/20" viewBox="0 0 48 48">
        <path d="M0 32v16h16M0 16V0h16" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-4 right-4 w-12 h-12 text-foreground/20" viewBox="0 0 48 48">
        <path d="M48 32v16H32M48 16V0H32" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  )
}

export function BlueprintLines({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const paths = svgRef.current.querySelectorAll("path, line, circle")
    gsap.fromTo(
      paths,
      { strokeDasharray: "0 2000", opacity: 0 },
      {
        strokeDasharray: "2000 0",
        opacity: 1,
        duration: 3,
        stagger: 0.1,
        ease: "power1.out",
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 80%",
        },
      }
    )
  }, [])

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 400 400"
      fill="none"
    >
      {/* Technical circles */}
      <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <circle cx="200" cy="200" r="50" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      
      {/* Cross lines */}
      <line x1="200" y1="0" x2="200" y2="400" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="0" y1="200" x2="400" y2="200" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      
      {/* Diagonal lines */}
      <line x1="50" y1="50" x2="350" y2="350" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <line x1="350" y1="50" x2="50" y2="350" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      
      {/* Measurement marks */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180
        const x1 = 200 + Math.cos(angle) * 140
        const y1 = 200 + Math.sin(angle) * 140
        const x2 = 200 + Math.cos(angle) * 160
        const y2 = 200 + Math.sin(angle) * 160
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.3"
          />
        )
      })}
      
      {/* Golden ratio spiral approximation */}
      <path
        d="M200 200 Q200 150 250 150 Q300 150 300 200 Q300 280 200 280 Q80 280 80 150"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.2"
        fill="none"
      />
    </svg>
  )
}
