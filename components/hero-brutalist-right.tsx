"use client"

import { useEffect, useRef, useMemo } from "react"
import { gsap } from "gsap"

/**
 * Award-winning brutalist technical animation for hero section right side.
 * Features complex geometric patterns, measurement lines, data fragments,
 * and sophisticated GSAP entrance animations.
 */
export function HeroBrutalistRight() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mainSvgRef = useRef<SVGSVGElement>(null)
  const textGroupRef = useRef<SVGGElement>(null)
  const measurementsRef = useRef<SVGGElement>(null)
  const geometryRef = useRef<SVGGElement>(null)
  const dataFragmentsRef = useRef<SVGGElement>(null)
  const glitchRef = useRef<SVGGElement>(null)

  // Generate pseudo-random coordinates for data fragments
  const dataPoints = useMemo(() => {
    const seed = 42
    const random = (i: number) => ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280
    return Array.from({ length: 12 }, (_, i) => ({
      x: 50 + random(i) * 350,
      y: 80 + random(i + 100) * 600,
      label: `0x${Math.floor(random(i + 50) * 65535).toString(16).toUpperCase().padStart(4, "0")}`,
      angle: random(i + 200) > 0.5 ? 0 : -90,
    }))
  }, [])

  // Generate measurement ticks
  const measurementTicks = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      y: 50 + i * 50,
      major: i % 4 === 0,
      value: i * 50,
    }))
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Helper: animate stroke-dashoffset for path drawing
      const drawPaths = (
        group: SVGGElement | null,
        duration: number,
        delay: number,
        stagger = 0.03
      ) => {
        if (!group) return
        const paths = group.querySelectorAll("path, line, polyline, rect, circle")
        paths.forEach((el) => {
          const geom = el as SVGGeometryElement
          if (typeof geom.getTotalLength === "function") {
            try {
              const len = geom.getTotalLength()
              gsap.set(geom, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 })
            } catch {
              gsap.set(geom, { opacity: 0 })
            }
          } else {
            gsap.set(geom, { opacity: 0 })
          }
        })
        gsap.to(paths, {
          strokeDashoffset: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease: "power2.inOut",
        })
      }

      // Animate geometry group - complex patterns
      drawPaths(geometryRef.current, 1.8, 0.3, 0.04)

      // Animate measurement lines
      drawPaths(measurementsRef.current, 1.2, 0.6, 0.02)

      // Animate data fragments with text reveal
      if (dataFragmentsRef.current) {
        const texts = dataFragmentsRef.current.querySelectorAll("text")
        const rects = dataFragmentsRef.current.querySelectorAll("rect")
        
        gsap.set(texts, { opacity: 0 })
        gsap.set(rects, { scaleX: 0, transformOrigin: "left center" })
        
        gsap.to(rects, {
          scaleX: 1,
          duration: 0.4,
          delay: 1.2,
          stagger: 0.08,
          ease: "power2.out",
        })
        
        gsap.to(texts, {
          opacity: 1,
          duration: 0.3,
          delay: 1.4,
          stagger: 0.08,
          ease: "power2.out",
        })
      }

      // Animate text labels
      if (textGroupRef.current) {
        const textEls = textGroupRef.current.querySelectorAll("text")
        gsap.set(textEls, { opacity: 0, y: 10 })
        gsap.to(textEls, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 1.6,
          stagger: 0.05,
          ease: "power3.out",
        })
      }

      // Glitch effect - periodic interference
      if (glitchRef.current) {
        const glitchLines = glitchRef.current.querySelectorAll("rect")
        gsap.set(glitchLines, { scaleX: 0, transformOrigin: "left center" })
        
        // Initial reveal
        gsap.to(glitchLines, {
          scaleX: 1,
          duration: 0.1,
          delay: 2,
          stagger: 0.02,
          ease: "power1.in",
        })
        
        // Continuous glitch animation
        const glitchTl = gsap.timeline({ repeat: -1, repeatDelay: 3, delay: 2.5 })
        glitchTl
          .to(glitchLines, {
            scaleX: 0,
            duration: 0.05,
            stagger: { each: 0.01, from: "random" },
            ease: "power1.in",
          })
          .to(glitchLines, {
            scaleX: 1,
            duration: 0.08,
            stagger: { each: 0.015, from: "random" },
            ease: "power1.out",
          }, "+=0.1")
          .to(glitchLines, {
            x: "random(-3, 3)",
            duration: 0.05,
            stagger: 0.01,
            ease: "none",
          }, "-=0.05")
          .to(glitchLines, {
            x: 0,
            duration: 0.1,
            ease: "power2.out",
          })
      }

      // Continuous subtle animation on geometric elements
      const geometryPaths = geometryRef.current?.querySelectorAll(".animate-pulse-stroke")
      if (geometryPaths && geometryPaths.length > 0) {
        gsap.to(geometryPaths, {
          strokeOpacity: 0.3,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.3,
          delay: 2.5,
        })
      }

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="hidden lg:block absolute right-0 top-0 h-full w-[45%] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <svg
        ref={mainSvgRef}
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 450 800"
        preserveAspectRatio="xMaxYMid slice"
        fill="none"
      >
        {/* Complex geometric patterns */}
        <g ref={geometryRef} stroke="currentColor" className="text-foreground/20">
          {/* Primary architectural frame */}
          <path
            d="M 350 100 L 350 700"
            strokeWidth="0.5"
          />
          <path
            d="M 100 150 L 400 150"
            strokeWidth="0.5"
          />
          <path
            d="M 100 650 L 400 650"
            strokeWidth="0.5"
          />
          
          {/* Isometric cube structure */}
          <path
            d="M 280 250 L 380 200 L 380 350 L 280 400 L 280 250"
            strokeWidth="0.75"
            className="text-foreground/30"
          />
          <path
            d="M 280 250 L 180 200 L 180 350 L 280 400"
            strokeWidth="0.75"
            className="text-foreground/30"
          />
          <path
            d="M 180 200 L 280 150 L 380 200"
            strokeWidth="0.75"
            className="text-foreground/30"
          />
          
          {/* Inner structure lines */}
          <path
            d="M 230 225 L 330 175 M 230 325 L 330 275"
            strokeWidth="0.4"
            className="animate-pulse-stroke"
          />
          <path
            d="M 230 225 L 230 375 M 330 175 L 330 325"
            strokeWidth="0.4"
            className="animate-pulse-stroke"
          />
          
          {/* Technical circle arrays */}
          <circle cx="280" cy="300" r="80" strokeWidth="0.4" strokeDasharray="4 4" />
          <circle cx="280" cy="300" r="60" strokeWidth="0.3" strokeDasharray="2 6" />
          <circle cx="280" cy="300" r="40" strokeWidth="0.5" />
          <circle cx="280" cy="300" r="3" strokeWidth="1" className="text-foreground/50" />
          
          {/* Radial measurement lines */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1={280 + Math.cos((angle * Math.PI) / 180) * 45}
              y1={300 + Math.sin((angle * Math.PI) / 180) * 45}
              x2={280 + Math.cos((angle * Math.PI) / 180) * 75}
              y2={300 + Math.sin((angle * Math.PI) / 180) * 75}
              strokeWidth="0.4"
            />
          ))}
          
          {/* Complex polygon structures - bottom section */}
          <path
            d="M 150 500 L 250 480 L 350 500 L 350 600 L 250 620 L 150 600 Z"
            strokeWidth="0.6"
            className="text-foreground/25"
          />
          <path
            d="M 175 510 L 250 495 L 325 510 L 325 590 L 250 605 L 175 590 Z"
            strokeWidth="0.4"
            strokeDasharray="8 4"
          />
          <path
            d="M 200 520 L 250 510 L 300 520 L 300 580 L 250 590 L 200 580 Z"
            strokeWidth="0.5"
          />
          
          {/* Connecting node lines */}
          <path
            d="M 250 495 L 250 400"
            strokeWidth="0.3"
            strokeDasharray="2 4"
          />
          <path
            d="M 350 500 L 380 450 L 380 350"
            strokeWidth="0.3"
            strokeDasharray="2 4"
          />
          <path
            d="M 150 500 L 120 450 L 120 200"
            strokeWidth="0.3"
            strokeDasharray="2 4"
          />
          
          {/* Grid overlay fragments */}
          {[0, 1, 2, 3].map((i) => (
            <g key={`grid-${i}`}>
              <line
                x1={100 + i * 30}
                y1={700}
                x2={100 + i * 30}
                y2={750}
                strokeWidth="0.3"
              />
              <line
                x1={300 + i * 30}
                y1={700}
                x2={300 + i * 30}
                y2={750}
                strokeWidth="0.3"
              />
            </g>
          ))}
          
          {/* Angular measurement arcs */}
          <path
            d="M 280 300 L 340 280 A 60 60 0 0 0 280 240"
            strokeWidth="0.4"
            fill="none"
          />
          <path
            d="M 280 300 L 220 320 A 60 60 0 0 1 280 360"
            strokeWidth="0.4"
            fill="none"
          />
          
          {/* Crosshair markers */}
          <g className="text-foreground/40">
            <line x1="275" y1="300" x2="285" y2="300" strokeWidth="0.8" />
            <line x1="280" y1="295" x2="280" y2="305" strokeWidth="0.8" />
            <line x1="245" y1="550" x2="255" y2="550" strokeWidth="0.6" />
            <line x1="250" y1="545" x2="250" y2="555" strokeWidth="0.6" />
          </g>
          
          {/* Technical corner brackets */}
          <path d="M 80 120 L 80 100 L 100 100" strokeWidth="0.8" className="text-foreground/30" />
          <path d="M 400 120 L 400 100 L 380 100" strokeWidth="0.8" className="text-foreground/30" />
          <path d="M 80 680 L 80 700 L 100 700" strokeWidth="0.8" className="text-foreground/30" />
          <path d="M 400 680 L 400 700 L 380 700" strokeWidth="0.8" className="text-foreground/30" />
        </g>

        {/* Measurement system - left ruler */}
        <g ref={measurementsRef} stroke="currentColor" className="text-foreground/15">
          {measurementTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={tick.major ? 55 : 65}
                y1={tick.y}
                x2={75}
                y2={tick.y}
                strokeWidth={tick.major ? 0.6 : 0.3}
              />
            </g>
          ))}
          {/* Ruler spine */}
          <line x1="75" y1="50" x2="75" y2="800" strokeWidth="0.4" />
          
          {/* Horizontal measurement at top */}
          <line x1="100" y1="80" x2="400" y2="80" strokeWidth="0.3" />
          {[100, 150, 200, 250, 300, 350, 400].map((x) => (
            <line key={x} x1={x} y1={75} x2={x} y2={85} strokeWidth="0.3" />
          ))}
        </g>

        {/* Data fragment labels */}
        <g ref={dataFragmentsRef} className="text-foreground/60">
          {dataPoints.slice(0, 6).map((point, i) => (
            <g key={i} transform={`translate(${point.x}, ${point.y}) rotate(${point.angle})`}>
              <rect
                x={-2}
                y={-8}
                width={52}
                height={12}
                fill="currentColor"
                className="text-background/80"
                strokeWidth="0"
              />
              <text
                x={0}
                y={0}
                fontSize="8"
                fontFamily="ui-monospace, monospace"
                fill="currentColor"
                className="text-foreground/70"
              >
                {point.label}
              </text>
            </g>
          ))}
        </g>

        {/* Text labels and coordinates */}
        <g ref={textGroupRef} fill="currentColor" className="text-foreground/50">
          <text x="280" y="420" fontSize="7" fontFamily="ui-monospace, monospace" textAnchor="middle">
            NODE_CENTRAL
          </text>
          <text x="250" y="630" fontSize="6" fontFamily="ui-monospace, monospace" textAnchor="middle">
            STRUCT_POLY_01
          </text>
          <text x="60" y="95" fontSize="6" fontFamily="ui-monospace, monospace">
            Y_AXIS
          </text>
          <text x="395" y="95" fontSize="6" fontFamily="ui-monospace, monospace" textAnchor="end">
            X:400
          </text>
          
          {/* Measurement values */}
          {[0, 200, 400, 600].map((val, i) => (
            <text
              key={val}
              x="50"
              y={55 + i * 200}
              fontSize="5"
              fontFamily="ui-monospace, monospace"
              textAnchor="end"
            >
              {val}
            </text>
          ))}
          
          {/* System status text */}
          <text x="350" y="720" fontSize="6" fontFamily="ui-monospace, monospace" textAnchor="end">
            SYS.RENDER.OK
          </text>
          <text x="350" y="732" fontSize="5" fontFamily="ui-monospace, monospace" textAnchor="end" className="text-foreground/30">
            FRAME: 60.0Hz
          </text>
        </g>

        {/* Glitch interference lines */}
        <g ref={glitchRef} fill="currentColor" className="text-foreground/10">
          {[180, 220, 380, 420, 520, 580].map((y, i) => (
            <rect
              key={i}
              x={100 + (i % 3) * 30}
              y={y}
              width={80 + (i % 2) * 40}
              height="1"
            />
          ))}
        </g>

        {/* Animated pulse points */}
        <g className="text-foreground/40">
          <circle cx="280" cy="300" r="2" fill="currentColor">
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="250" cy="550" r="1.5" fill="currentColor">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="380" cy="200" r="1.5" fill="currentColor">
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    </div>
  )
}
