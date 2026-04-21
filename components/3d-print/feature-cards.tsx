"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const features = [
  {
    id: "viewer",
    label: "01",
    title: "Interactive 3D Viewer",
    description: "Full orbital control with real-time material preview. Inspect every vertex, face, and edge at sub-millimeter precision.",
    icon: ViewerIcon,
    tech: "WebGL 2.0 / Three.js",
  },
  {
    id: "ar",
    label: "02",
    title: "AR Preview",
    description: "Project models into physical space via WebXR. Validate scale, proportion, and fit before committing to fabrication.",
    icon: ARIcon,
    tech: "WebXR / ARKit",
  },
  {
    id: "slicer",
    label: "03",
    title: "Slicing Preview",
    description: "Layer-by-layer visualization with customizable slice height. Export G-code compatible toolpaths directly from browser.",
    icon: SlicerIcon,
    tech: "WASM / OpenCL",
  },
]

export function FeatureCards() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        ".feature-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 60%",
            toggleActions: "play none none reverse",
          },
        }
      )

      // Animate the divider line
      gsap.fromTo(
        ".features-divider",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      )

      // Section label
      gsap.fromTo(
        ".features-label",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      )
    },
    { scope: containerRef }
  )

  return (
    <section ref={containerRef} className="relative w-full">
      {/* Section label */}
      <div className="flex items-center gap-4 mb-10">
        <span className="features-label font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
          {"// capabilities"}
        </span>
        <div className="features-divider h-px flex-1 bg-border/30 origin-left" />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/20">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="feature-card group relative bg-background p-6 sm:p-8 flex flex-col gap-5 border border-border/20 hover:bg-card transition-colors duration-500"
          >
            {/* Card number */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/50">
                {feature.label}
              </span>
              <div className="w-6 h-px bg-border/30 group-hover:bg-foreground/30 transition-colors duration-500" />
            </div>

            {/* Icon */}
            <div className="w-10 h-10 flex items-center justify-center border border-border/30 bg-secondary/30 group-hover:border-foreground/20 transition-colors duration-500">
              <feature.icon />
            </div>

            {/* Title */}
            <h3 className="font-sans text-base sm:text-lg font-semibold tracking-tight text-foreground">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
              {feature.description}
            </p>

            {/* Tech label */}
            <div className="mt-auto pt-4 border-t border-border/15">
              <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/40 uppercase">
                {feature.tech}
              </span>
            </div>

            {/* Hover corner accent */}
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-t-transparent border-r-[20px] border-r-transparent group-hover:border-r-foreground/10 transition-colors duration-500" />
          </div>
        ))}
      </div>
    </section>
  )
}

// --- SVG Icons ---

function ViewerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground group-hover:text-foreground transition-colors duration-500">
      <rect x="2" y="2" width="16" height="16" rx="0" />
      <path d="M10 6 L14 10 L10 14 L6 10 Z" />
      <circle cx="10" cy="10" r="1.5" />
    </svg>
  )
}

function ARIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground group-hover:text-foreground transition-colors duration-500">
      <path d="M2 6 L2 2 L6 2" />
      <path d="M14 2 L18 2 L18 6" />
      <path d="M18 14 L18 18 L14 18" />
      <path d="M6 18 L2 18 L2 14" />
      <rect x="6" y="6" width="8" height="8" strokeDasharray="2 2" />
      <circle cx="10" cy="10" r="2" />
    </svg>
  )
}

function SlicerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground group-hover:text-foreground transition-colors duration-500">
      <path d="M4 4 L16 4" />
      <path d="M5 8 L15 8" />
      <path d="M6 12 L14 12" />
      <path d="M7 16 L13 16" />
      <path d="M10 2 L10 18" strokeDasharray="1 2" strokeWidth="0.5" />
    </svg>
  )
}
