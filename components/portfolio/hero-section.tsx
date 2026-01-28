"use client"

import { useRef, useMemo } from "react"
import { GSAPText } from "@/components/gsap-text"
import { HeroTechnicalCanvas } from "@/components/hero-technical-canvas"
import { MagneticButton } from "@/components/magnetic-button"
import { useToast } from "@/hooks/use-toast"
import { ArrowDown, ArrowRight, Github, Globe, Linkedin, Mail } from "lucide-react"

// Exact-length lines so the terminal block is always a complete rectangle
const ASCII_W = 65
const ASCII_MOBILE_W = 32

function revLabel() {
  const d = new Date()
  return `${d.toLocaleDateString("en-US", { month: "short" })}. ${d.getFullYear()}`
}

const SITE_URL = "https://ryofujimura.github.io/"

export function HeroSection() {
  const asciiBlockRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const asciiHeaderLines = useMemo(() => {
    const rev = revLabel()
    return [
      "╔" + "═".repeat(ASCII_W) + "╗",
      "║" + "   SYS_ID: RF.001   │   CLASS: ENGINEER   │   LOC: IRVINE_CA".padEnd(ASCII_W) + "║",
      "║" + (`   mode: BUILD      │   status: AVAILABLE │   rev: ${rev}`).padEnd(ASCII_W) + "║",
      "╚" + "═".repeat(ASCII_W) + "╝",
    ]
  }, [])
  const asciiHeaderLinesMobile = useMemo(() => {
    const rev = revLabel()
    return [
      "╔" + "═".repeat(ASCII_MOBILE_W) + "╗",
      "║" + " RF.001 │ ENG │ IRVINE_CA".padEnd(ASCII_MOBILE_W) + "║",
      "║" + (` AVAILABLE │ BUILD │ ${rev}`).padEnd(ASCII_MOBILE_W) + "║",
      "╚" + "═".repeat(ASCII_MOBILE_W) + "╝",
    ]
  }, [])


  return (
    <section
      className="relative min-h-[100dvh] min-h-screen flex items-center justify-center px-3 sm:px-6 pt-[max(4rem,env(safe-area-inset-top))] pb-6 sm:pb-8 overflow-hidden"
      aria-label="Hero"
    >
      <div className="hidden sm:block absolute inset-0">
        <HeroTechnicalCanvas />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-0">
        <div className="flex flex-col items-start gap-4 sm:gap-6 md:gap-8">
          {/* ASCII terminal block — complete rectangle; mobile = short, desktop = full */}
          <div
            ref={asciiBlockRef}
            className="font-mono text-foreground/50 whitespace-pre tabular-nums touch-manipulation w-full min-w-0"
            style={{ fontFamily: "ui-monospace, monospace" }}
          >
            {/* Mobile: 34-char block, complete rectangle; horizontal scroll on narrow viewports */}
            <div className="block sm:hidden text-[9px] leading-tight overflow-x-auto scrollbar-hide" style={{ minWidth: "34ch" }}>
              {asciiHeaderLinesMobile.map((line, i) => (
                <GSAPText
                  key={`m-${i}`}
                  variant="lines"
                  delay={0.15 + i * 0.06}
                  duration={0.35}
                  immediate
                  className="block leading-tight"
                >
                  {line}
                </GSAPText>
              ))}
            </div>
            {/* Desktop: 67-char block, horizontal scroll if ever needed */}
            <div className="hidden sm:block text-[10px] sm:text-[11px] leading-tight overflow-x-auto scrollbar-hide" style={{ minWidth: "min(100%, 67ch)" }}>
              {asciiHeaderLines.map((line, i) => (
                <GSAPText
                  key={`d-${i}`}
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
          </div>

          {/* Role line — scramble then hold */}
          <GSAPText
            variant="scramble"
            delay={0.5}
            immediate
            className="text-[9px] sm:text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground"
          >
            Software Engineer & AI Researcher
          </GSAPText>

          {/* Name — brutalist type, char stagger; mobile-tighter */}
          <div className="space-y-0 leading-[0.88]">
            <GSAPText
              variant="chars"
              stagger={0.03}
              duration={0.45}
              delay={0.7}
              immediate
              className="text-3xl min-[375px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-foreground tracking-tighter font-mono block"
            >
              RYO
            </GSAPText>
            <GSAPText
              variant="chars"
              stagger={0.03}
              duration={0.45}
              delay={0.9}
              immediate
              className="text-3xl min-[375px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-foreground tracking-tighter font-mono block"
            >
              FUJIMURA
            </GSAPText>
          </div>

          {/* Tagline — word reveal */}
          <GSAPText
            variant="words"
            delay={1.25}
            stagger={0.05}
            duration={0.45}
            immediate
            className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground font-mono max-w-xl leading-relaxed"
          >
            Building systems at the intersection of AI research and real-world applications.
          </GSAPText>

          {/* ASCII divider + quote */}
          <div className="pt-2 sm:pt-4 border-t border-foreground/20 w-full max-w-xl">
            <GSAPText
              variant="lines"
              delay={1.6}
              duration={0.4}
              immediate
              className="font-mono text-[9px] sm:text-[10px] md:text-xs text-muted-foreground/70 italic"
            >
              {"// Simplicity is the ultimate sophistication. — Leonardo da Vinci"}
            </GSAPText>
          </div>

          {/* CTAs — blocky brutalist buttons; mobile stacking, 44px+ touch */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 pt-3 sm:pt-6 w-full sm:w-auto">
            <MagneticButton
              as="a"
              href="#projects"
              className="touch-target group relative inline-flex items-center justify-center gap-1.5 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 min-h-[48px] text-xs sm:text-sm font-mono uppercase tracking-wider text-primary-foreground bg-primary border-2 border-primary hover:bg-transparent hover:text-primary transition-all duration-300"
            >
              View Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </MagneticButton>
            <MagneticButton
              as="a"
              href="#contact"
              className="touch-target group inline-flex items-center justify-center gap-1.5 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 min-h-[48px] text-xs sm:text-sm font-mono uppercase tracking-wider text-foreground bg-transparent border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
            >
              Contact
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform shrink-0" />
            </MagneticButton>
          </div>

          {/* Social — monotone Lucide icons; globe copies site URL */}
          <div className="flex flex-wrap items-center gap-0.5 sm:gap-1 pt-2 sm:pt-4">
            {[
              { href: "https://github.com/ryofujimura", Icon: Github, label: "GitHub" },
              { href: "https://linkedin.com/in/ryofujimura", Icon: Linkedin, label: "LinkedIn" },
              { href: "mailto:ryo.fujimura1@gmail.com", Icon: Mail, label: "Email" },
            ].map(({ href, Icon, label }) => (
              <MagneticButton
                key={label}
                as="a"
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="touch-target p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-all [&_svg]:stroke-current"
              >
                <Icon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
                <span className="sr-only">{label}</span>
              </MagneticButton>
            ))}
            <MagneticButton
              as="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(SITE_URL)
                  toast({ title: "Copied!" })
                } catch {
                  toast({ title: "Copy failed", variant: "destructive" })
                }
              }}
              className="touch-target p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-all [&_svg]:stroke-current"
              aria-label="Copy site URL"
            >
              <Globe className="w-5 h-5 shrink-0" strokeWidth={1.5} />
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Scroll cue — ASCII; compact on mobile */}
      <div className="absolute bottom-3 sm:bottom-8 left-1/2 -translate-x-1/2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex flex-col items-center gap-1.5 sm:gap-4">
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] sm:tracking-[0.4em] text-muted-foreground">
            &gt; scroll
          </span>
          <div className="w-px h-8 sm:h-16 bg-foreground/20 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-5 sm:h-8 bg-foreground"
              style={{ animation: "heroScrollLine 2s ease-in-out infinite" }}
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
