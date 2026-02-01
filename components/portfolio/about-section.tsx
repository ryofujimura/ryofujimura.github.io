"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { BrutalistBackground } from "@/components/brutalist-background"
import { MagneticButton } from "@/components/magnetic-button"
import { ArrowDown, ArrowRight } from "lucide-react"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * AboutSection - Stats, tech stack, and CTAs
 * Width matches navbar (max-w-6xl)
 */
export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const statsGridRef = useRef<HTMLDivElement>(null)
  const stackTickerRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  
  const prefersReducedMotion = useReducedMotion()

  // Stats section scroll-triggered animations
  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Stats grid stagger
      if (statsGridRef.current) {
        const statItems = statsGridRef.current.querySelectorAll("[data-stat]")
        gsap.fromTo(
          statItems,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statsGridRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        )
      }

      // Stack ticker
      if (stackTickerRef.current) {
        gsap.fromTo(
          stackTickerRef.current,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stackTickerRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        )
      }

      // CTA buttons
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current.querySelectorAll("a"),
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  const techStack = [
    "Python", "Swift", "Kotlin", "TypeScript", "React", 
    "Firebase", "PyTorch", "CoreML", "On-device LLMs", 
    "CUDA", "Docker", "Node.js", "REST APIs"
  ]

  return (
    <section id="about" ref={sectionRef} className="relative">
      <div className="relative w-full pt-8 sm:pt-12 pb-16 sm:pb-24">
        {/* Subtle background variant */}
        <div className="absolute inset-0 opacity-40">
          <BrutalistBackground variant="circuit" />
        </div>

        {/* Full-width Background Tech Stack Ticker */}
        <div 
          ref={stackTickerRef}
          className="absolute inset-0 overflow-hidden pointer-events-none select-none flex items-center"
        >
          <div className={`stack-ticker flex gap-12 sm:gap-16 md:gap-24 whitespace-nowrap ${prefersReducedMotion ? "" : "animate-ticker"}`}>
            {techStack.map((tech, i) => (
              <span 
                key={i} 
                className="font-mono text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-foreground/[0.04] uppercase tracking-wider"
              >
                {tech}
              </span>
            ))}
            {/* Duplicate for seamless loop */}
            {techStack.map((tech, i) => (
              <span 
                key={`dup-${i}`} 
                className="font-mono text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-foreground/[0.04] uppercase tracking-wider"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Content - max-w-6xl to match navbar */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Grid */}
          <div 
            ref={statsGridRef} 
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10"
          >
            {[
              { label: "Years Coding", value: "8+", link: null, hash: null },
              { label: "Internships", value: "2", link: "experience", hash: "#experience-bose" },
              { label: "Projects Shipped", value: "10+", link: "projects", hash: null },
              { label: "Publications", value: "2", link: null, hash: "#experience-cpx-lab" },
            ].map((stat) => {
              const isLink = !!stat.link || !!stat.hash
              const handleClick = () => {
                if (stat.hash) {
                  // Use hash navigation for specific experience
                  window.location.hash = stat.hash
                } else if (stat.link) {
                  document.getElementById(stat.link)?.scrollIntoView({ behavior: "smooth" })
                }
              }
              return (
                <button
                  key={stat.label}
                  data-stat
                  type="button"
                  onClick={isLink ? handleClick : undefined}
                  disabled={!isLink}
                  className={`
                    relative border bg-background/80 backdrop-blur-sm px-3 py-4 sm:px-4 sm:py-5 
                    flex flex-col justify-between min-h-[5rem] sm:min-h-[5.5rem] text-left
                    transition-all duration-300 group
                    ${isLink 
                      ? "border-foreground/25 cursor-pointer hover:border-foreground hover:shadow-[4px_4px_0_0_var(--foreground)]" 
                      : "border-foreground/15 cursor-default"
                    }
                  `}
                >
                  {/* Technical pattern overlay on hover */}
                  {isLink && (
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      viewBox="0 0 48 48"
                      fill="none"
                      aria-hidden
                    >
                      <line x1="0" y1="0" x2="48" y2="48" stroke="currentColor" strokeWidth="0.3" className="text-foreground/10" />
                      <line x1="48" y1="0" x2="0" y2="48" stroke="currentColor" strokeWidth="0.3" className="text-foreground/10" />
                    </svg>
                  )}
                  <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    {stat.label}
                  </span>
                  <span className="font-mono text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
                    {stat.value}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Focus Areas */}
          <div className="flex flex-wrap gap-2 mb-8 sm:mb-10">
            {["AI / ML", "Mobile", "Backend", "Full-Stack"].map((area) => (
              <span 
                key={area}
                className="font-mono text-[10px] sm:text-xs uppercase tracking-wider px-3 py-1.5 border border-foreground/30 text-foreground/70 bg-background/50"
              >
                {area}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <MagneticButton
              as="a"
              href="#experience"
              className="touch-target group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] text-xs sm:text-sm font-mono uppercase tracking-wider text-primary-foreground bg-primary border-2 border-primary hover:bg-transparent hover:text-primary transition-all duration-300"
            >
              Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </MagneticButton>
            <MagneticButton
              as="a"
              href="#projects"
              className="touch-target group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] text-xs sm:text-sm font-mono uppercase tracking-wider text-primary-foreground bg-primary border-2 border-primary hover:bg-transparent hover:text-primary transition-all duration-300"
            >
              Project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </MagneticButton>
            <MagneticButton
              as="a"
              href="#contact"
              className="touch-target group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] text-xs sm:text-sm font-mono uppercase tracking-wider text-foreground bg-transparent border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
            >
              Contact
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform shrink-0" />
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* CSS for ticker animation */}
      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 60s linear infinite;
        }
      `}</style>
    </section>
  )
}
