"use client"

import { useRef, useState, useEffect } from "react"
import { AnimatedSection } from "@/components/animated-section"
import { MagneticButton } from "@/components/magnetic-button"
import { RevealText } from "@/components/reveal-text"
import { AsciiSectionHeader } from "@/components/ascii-banner"
import { Mail, Github, Linkedin, MapPin, ArrowUpRight } from "lucide-react"
import { LocationHoverText } from "@/components/portfolio/location-hover-text"

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
          <div className="flex justify-center mb-6 sm:mb-8">
            <AsciiSectionHeader number="05" title="What's Next?" />
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
                hoverWords={["Open", " to ", "relocate"]}
              />
            </span>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
