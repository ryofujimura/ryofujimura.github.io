"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { GSAPText, GSAPSVG } from "@/components/gsap-text"
import { BlueprintLines, TechnicalPattern } from "@/components/technical-grid"
import { MagneticButton } from "@/components/magnetic-button"
import { ArrowDown, Github, Linkedin, Mail, ArrowRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const gridRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    // Animate the technical lines on load
    if (linesRef.current) {
      const paths = linesRef.current.querySelectorAll("path, line, circle")
      gsap.fromTo(
        paths,
        { strokeDasharray: "0 2000", opacity: 0 },
        {
          strokeDasharray: "2000 0",
          opacity: 1,
          duration: 2.5,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.5,
        }
      )
    }

    // Grid fade in
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 2, delay: 0.3 }
      )
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden"
    >
      {/* Technical grid background */}
      <div
        ref={gridRef}
        className="absolute inset-0 opacity-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />

      {/* Blueprint technical drawing - left side */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] text-foreground/10 pointer-events-none"
        style={{
          transform: `translate(${mousePosition.x * -20}px, ${-50 + mousePosition.y * -20}%)`,
          transition: "transform 0.5s ease-out",
        }}
      >
        <BlueprintLines className="w-full h-full" />
      </div>

      {/* Da Vinci Vitruvian inspired SVG - right side */}
      <GSAPSVG
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] text-foreground/10 pointer-events-none"
        duration={3}
        delay={1}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" stroke="currentColor">
          <circle cx="200" cy="200" r="180" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="120" strokeWidth="0.5" />
          <rect x="60" y="60" width="280" height="280" strokeWidth="0.5" />
          <line x1="200" y1="20" x2="200" y2="380" strokeWidth="0.3" />
          <line x1="20" y1="200" x2="380" y2="200" strokeWidth="0.3" />
          {/* Golden ratio points */}
          <circle cx="200" cy="200" r="3" fill="currentColor" />
          <circle cx="200" cy="76" r="2" fill="currentColor" />
          <circle cx="200" cy="324" r="2" fill="currentColor" />
          <circle cx="76" cy="200" r="2" fill="currentColor" />
          <circle cx="324" cy="200" r="2" fill="currentColor" />
        </svg>
      </GSAPSVG>

      <TechnicalPattern />

      {/* Main content */}
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left column - Typography */}
          <div className="space-y-8">
            {/* Status indicator */}
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">
                Available for Work
              </span>
            </div>

            {/* Role - scramble effect */}
            <GSAPText
              variant="scramble"
              className="text-sm font-mono uppercase tracking-[0.5em] text-muted-foreground"
              delay={0.2}
            >
              Software Engineer & AI Researcher
            </GSAPText>

            {/* Main title - character reveal */}
            <div className="space-y-2">
              <GSAPText
                variant="chars"
                className="text-6xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.9] tracking-tighter"
                stagger={0.03}
                duration={0.6}
              >
                RYO
              </GSAPText>
              <GSAPText
                variant="chars"
                className="text-6xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.9] tracking-tighter"
                delay={0.3}
                stagger={0.03}
                duration={0.6}
              >
                FUJIMURA
              </GSAPText>
            </div>

            {/* Tagline - word reveal */}
            <GSAPText
              variant="words"
              className="text-xl md:text-2xl text-muted-foreground font-light max-w-md leading-relaxed"
              delay={0.8}
              stagger={0.08}
            >
              Building intelligent systems at the intersection of AI research and real-world applications
            </GSAPText>

            {/* Da Vinci quote */}
            <div className="pt-4 border-t border-border">
              <GSAPText
                variant="lines"
                className="text-sm text-muted-foreground/60 font-mono italic"
                delay={1.2}
              >
                "Simplicity is the ultimate sophistication." - Leonardo da Vinci
              </GSAPText>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-6">
              <MagneticButton
                as="a"
                href="#projects"
                className="group relative inline-flex items-center gap-3 px-8 py-4 text-sm font-mono uppercase tracking-wider text-primary-foreground bg-primary border-2 border-primary hover:bg-transparent hover:text-primary transition-all duration-300"
              >
                View Work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
              <MagneticButton
                as="a"
                href="#contact"
                className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-mono uppercase tracking-wider text-foreground bg-transparent border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
              >
                Contact
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </MagneticButton>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-1">
                {[
                  { href: "https://github.com/ryofujimura", icon: Github, label: "GitHub" },
                  { href: "https://linkedin.com/in/ryofujimura", icon: Linkedin, label: "LinkedIn" },
                  { href: "mailto:ryo.fujimura1@gmail.com", icon: Mail, label: "Email" },
                ].map(({ href, icon: Icon, label }) => (
                  <MagneticButton
                    key={label}
                    as="a"
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="p-3 text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-all"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="sr-only">{label}</span>
                  </MagneticButton>
                ))}
              </div>
              <div className="w-px h-6 bg-border" />
              <span className="text-xs font-mono text-muted-foreground">Irvine, CA</span>
            </div>
          </div>

          {/* Right column - 3D Technical Element */}
          <div className="hidden lg:block relative">
            <div
              className="relative aspect-square max-w-lg mx-auto"
              style={{
                transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`,
                transition: "transform 0.3s ease-out",
              }}
            >
              {/* Wireframe cube - animated */}
              <GSAPSVG className="absolute inset-0 text-foreground" duration={2}>
                <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1">
                  {/* Front face */}
                  <rect x="100" y="100" width="200" height="200" opacity="0.4" />
                  {/* Back face */}
                  <rect x="140" y="60" width="200" height="200" opacity="0.2" />
                  {/* Connecting lines */}
                  <line x1="100" y1="100" x2="140" y2="60" opacity="0.3" />
                  <line x1="300" y1="100" x2="340" y2="60" opacity="0.3" />
                  <line x1="100" y1="300" x2="140" y2="260" opacity="0.3" />
                  <line x1="300" y1="300" x2="340" y2="260" opacity="0.3" />
                </svg>
              </GSAPSVG>

              {/* Inner technical details */}
              <GSAPSVG className="absolute inset-0 text-foreground" duration={3} delay={1}>
                <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="0.5">
                  {/* Diagonal cross */}
                  <line x1="100" y1="100" x2="300" y2="300" opacity="0.2" />
                  <line x1="300" y1="100" x2="100" y2="300" opacity="0.2" />
                  {/* Center circle */}
                  <circle cx="200" cy="200" r="50" opacity="0.3" />
                  <circle cx="200" cy="200" r="80" opacity="0.2" />
                  {/* Technical marks */}
                  <line x1="200" y1="100" x2="200" y2="120" opacity="0.4" />
                  <line x1="200" y1="280" x2="200" y2="300" opacity="0.4" />
                  <line x1="100" y1="200" x2="120" y2="200" opacity="0.4" />
                  <line x1="280" y1="200" x2="300" y2="200" opacity="0.4" />
                </svg>
              </GSAPSVG>

              {/* Floating labels */}
              <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground/50">
                <span>x: 200</span>
              </div>
              <div className="absolute bottom-4 right-4 text-xs font-mono text-muted-foreground/50">
                <span>y: 200</span>
              </div>

              {/* Profile placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-foreground/20 flex items-center justify-center bg-background/80">
                  <span className="text-4xl font-black text-foreground/30">RF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground">Scroll</span>
          <div className="w-px h-16 bg-foreground/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-8 bg-foreground animate-[slideDown_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(200%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  )
}
