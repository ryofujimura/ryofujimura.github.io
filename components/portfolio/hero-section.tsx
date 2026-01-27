"use client"

import { useRef, useState, useEffect } from "react"
import { gsap } from "gsap"
import { GSAPText } from "@/components/gsap-text"
import { HeroTechnicalCanvas } from "@/components/hero-technical-canvas"
import { MagneticButton } from "@/components/magnetic-button"
import { LocationHoverText } from "@/components/portfolio/location-hover-text"
import { ArrowDown, ArrowRight, Mail } from "lucide-react"

const ASCII_HEADER_LINES = [
  "╔═══════════════════════════════════════════════════════════════════╗",
  "║  SYS_ID: RF.001  │  CLASS: ENGINEER  │  LOC: IRVINE_CA           ║",
  "║  > status: AVAILABLE_FOR_WORK  │  mode: BUILD  │  rev: 2025       ║",
  "╚═══════════════════════════════════════════════════════════════════╝",
]

export function HeroSection() {
  const [, setMousePosition] = useState({ x: 0, y: 0 })
  const [isTouch, setIsTouch] = useState(false)
  const asciiBlockRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0)
  }, [])

  useEffect(() => {
    if (isTouch) return
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isTouch])

  return (
    <section
      className="relative min-h-[100dvh] min-h-screen flex items-center justify-center px-4 sm:px-6 pt-[max(5rem,env(safe-area-inset-top))] pb-8 overflow-hidden"
      aria-label="Hero"
    >
      <HeroTechnicalCanvas />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="flex flex-col items-start gap-6 sm:gap-8 md:gap-10">
          {/* ASCII terminal block — line-by-line reveal */}
          <div
            ref={asciiBlockRef}
            className="font-mono text-[9px] xs:text-[10px] sm:text-[11px] text-foreground/50 whitespace-pre overflow-x-auto"
          >
            {ASCII_HEADER_LINES.map((line, i) => (
              <GSAPText
                key={i}
                variant="lines"
                delay={0.15 + i * 0.06}
                duration={0.4}
                immediate
                className="block leading-tight"
              >
                {line}
              </GSAPText>
            ))}
          </div>

          {/* Role line — scramble then hold */}
          <GSAPText
            variant="scramble"
            delay={0.5}
            immediate
            className="text-[10px] xs:text-xs font-mono uppercase tracking-[0.25em] sm:tracking-[0.35em] text-muted-foreground"
          >
            Software Engineer & AI Researcher
          </GSAPText>

          {/* Name — brutalist type, char stagger */}
          <div className="space-y-0 leading-[0.88]">
            <GSAPText
              variant="chars"
              stagger={0.035}
              duration={0.5}
              delay={0.7}
              immediate
              className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-foreground tracking-tighter font-mono block"
            >
              RYO
            </GSAPText>
            <GSAPText
              variant="chars"
              stagger={0.035}
              duration={0.5}
              delay={0.95}
              immediate
              className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-foreground tracking-tighter font-mono block"
            >
              FUJIMURA
            </GSAPText>
          </div>

          {/* Tagline — word reveal */}
          <GSAPText
            variant="words"
            delay={1.35}
            stagger={0.055}
            duration={0.5}
            immediate
            className="text-sm sm:text-base md:text-lg text-muted-foreground font-mono max-w-xl leading-relaxed"
          >
            Building systems at the intersection of AI research and real-world applications.
          </GSAPText>

          {/* ASCII divider + quote */}
          <div className="pt-2 sm:pt-4 border-t border-foreground/20 w-full max-w-xl">
            <GSAPText
              variant="lines"
              delay={1.75}
              duration={0.45}
              immediate
              className="font-mono text-[10px] sm:text-xs text-muted-foreground/70 italic"
            >
              {"// Simplicity is the ultimate sophistication. — Leonardo da Vinci"}
            </GSAPText>
          </div>

          {/* CTAs — blocky brutalist buttons */}
          <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4 pt-4 sm:pt-6">
            <MagneticButton
              as="a"
              href="#projects"
              className="touch-target group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] text-sm font-mono uppercase tracking-wider text-primary-foreground bg-primary border-2 border-primary hover:bg-transparent hover:text-primary transition-all duration-300"
            >
              View Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </MagneticButton>
            <MagneticButton
              as="a"
              href="#contact"
              className="touch-target group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] text-sm font-mono uppercase tracking-wider text-foreground bg-transparent border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
            >
              Contact
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform shrink-0" />
            </MagneticButton>
          </div>

          {/* Social + location — minimal line */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2 sm:pt-4">
            <div className="flex items-center gap-0.5 sm:gap-1">
              {[
                { href: "https://github.com/ryofujimura", img: "/images/github.png", label: "GitHub" },
                { href: "https://linkedin.com/in/ryofujimura", img: "/images/linkedin.png", label: "LinkedIn" },
                { href: "mailto:ryo.fujimura1@gmail.com", icon: Mail, label: "Email" },
              ].map((item) => {
                const Icon = "icon" in item ? item.icon : null
                const href = item.href
                return (
                  <MagneticButton
                    key={item.label}
                    as="a"
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="touch-target p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-all"
                  >
                    {"img" in item ? (
                      <img src={item.img} alt="" className="w-5 h-5 object-contain" width={20} height={20} />
                    ) : (
                      Icon && <Icon className="w-5 h-5" />
                    )}
                    <span className="sr-only">{item.label}</span>
                  </MagneticButton>
                )
              })}
            </div>
            <div className="w-px h-5 sm:h-6 bg-border shrink-0" />
            <LocationHoverText
              defaultWords={["Irvine", ", ", "CA"]}
              hoverWords={["Open", " to", " relocate"]}
              className="text-[10px] xs:text-xs font-mono text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Scroll cue — ASCII */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex flex-col items-center gap-2 sm:gap-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] sm:tracking-[0.4em] text-muted-foreground">
            &gt; scroll
          </span>
          <div className="w-px h-10 sm:h-16 bg-foreground/20 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-6 sm:h-8 bg-foreground"
              style={{
                animation: "heroScrollLine 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes heroScrollLine {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(200%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  )
}
