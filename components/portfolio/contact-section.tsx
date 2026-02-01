"use client"

import { useRef, useState, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { AnimatedSection } from "@/components/animated-section"
import { MagneticButton } from "@/components/magnetic-button"
import { RevealText } from "@/components/reveal-text"
import { Mail, Github, Linkedin, MapPin, ArrowUpRight } from "lucide-react"
import { LocationHoverText } from "@/components/portfolio/location-hover-text"

gsap.registerPlugin(ScrollTrigger)

// Animated SVG decoration for the header
function AnimatedHeaderSVG({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const paths = svgRef.current.querySelectorAll("path, line, circle")
    
    // Set initial state - hidden with stroke offset
    paths.forEach((el) => {
      const geom = el as SVGGeometryElement
      if (typeof geom.getTotalLength === "function") {
        try {
          const len = geom.getTotalLength()
          gsap.set(geom, { strokeDasharray: len, strokeDashoffset: len })
        } catch {
          // Skip unsupported elements
        }
      }
    })

    // Animate on scroll
    const ctx = gsap.context(() => {
      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      })
    }, svgRef)

    return () => ctx.revert()
  }, [])

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 400 60"
      fill="none"
      stroke="currentColor"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Left decorative bracket */}
      <path
        d="M 20 10 L 5 10 L 5 50 L 20 50"
        strokeWidth="1.5"
        className="text-accent"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left inner line */}
      <line
        x1="30"
        y1="30"
        x2="80"
        y2="30"
        strokeWidth="1"
        className="text-foreground/30"
        strokeLinecap="round"
      />
      {/* Left dot */}
      <circle
        cx="90"
        cy="30"
        r="3"
        strokeWidth="1.5"
        className="text-accent"
      />
      
      {/* Right decorative bracket */}
      <path
        d="M 380 10 L 395 10 L 395 50 L 380 50"
        strokeWidth="1.5"
        className="text-accent"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right inner line */}
      <line
        x1="370"
        y1="30"
        x2="320"
        y2="30"
        strokeWidth="1"
        className="text-foreground/30"
        strokeLinecap="round"
      />
      {/* Right dot */}
      <circle
        cx="310"
        cy="30"
        r="3"
        strokeWidth="1.5"
        className="text-accent"
      />
      
      {/* Center decorative elements */}
      <line
        x1="180"
        y1="8"
        x2="220"
        y2="8"
        strokeWidth="1"
        className="text-foreground/20"
        strokeLinecap="round"
      />
      <line
        x1="180"
        y1="52"
        x2="220"
        y2="52"
        strokeWidth="1"
        className="text-foreground/20"
        strokeLinecap="round"
      />
    </svg>
  )
}

const socialLinks = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/ryofujimura",
    username: "@ryofujimura",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/ryofujimura",
    username: "/in/ryofujimura",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:ryo.fujimura1@gmail.com",
    username: "ryo.fujimura1@gmail.com",
  },
]

export function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }

    const container = containerRef.current
    container?.addEventListener("mousemove", handleMouseMove)
    return () => container?.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section 
      id="contact" 
      ref={containerRef}
      className="relative py-20 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6 overflow-hidden"
    >
      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(var(--accent-rgb, 100, 180, 200), 0.15) 0%, transparent 50%)`,
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <AnimatedSection>
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            {/* Animated SVG decoration */}
            <div className="relative w-full max-w-md">
              <AnimatedHeaderSVG className="w-full h-12 sm:h-16" />
              <h2 className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-mono">
                What's Next?
              </h2>
            </div>
          </div>
        </AnimatedSection>

        <div className="mb-6 sm:mb-8">
          <RevealText
            text="Let's Work Together"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-mono text-foreground"
            delay={100}
          />
        </div>

        <AnimatedSection delay={200}>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-12 px-1">
            I&apos;m currently looking for new opportunities in software engineering and AI research. 
            Whether you have a question, a project idea, or just want to connect — my inbox is always open.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={300}>
          <MagneticButton
            as="a"
            href="mailto:ryo.fujimura1@gmail.com"
            cursorText="Send"
            strength={0.2}
            className="touch-target group inline-flex items-center justify-center gap-2 sm:gap-3 min-h-[48px] px-6 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-medium font-mono text-primary-foreground bg-primary rounded-full hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 w-full max-w-[320px] mx-auto sm:w-auto"
          >
            Say Hello
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform shrink-0" />
          </MagneticButton>
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mt-10 sm:mt-16 max-w-md sm:max-w-none mx-auto">
            {socialLinks.map((link) => (
              <MagneticButton
                key={link.label}
                as="a"
                href={link.href}
                target={link.label !== "Email" ? "_blank" : undefined}
                rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
                className="touch-target group flex items-center justify-center gap-2 sm:gap-3 min-h-[48px] px-4 sm:px-6 py-3.5 sm:py-4 bg-card rounded-xl border border-border hover:border-accent/50 transition-all duration-300 w-full sm:w-auto font-mono text-sm"
              >
                <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {link.username}
                </span>
              </MagneticButton>
            ))}
          </div>
        </AnimatedSection>

        {/* Location */}
        <AnimatedSection delay={500}>
          <div className="flex items-center justify-center gap-2 mt-8 sm:mt-12 text-muted-foreground font-mono text-sm">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>
              &gt;{" "}
              <LocationHoverText
                defaultWords={["Irvine", ", ", "California"]}
                hoverWords={["Open", " to", " relocate"]}
              />
            </span>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
