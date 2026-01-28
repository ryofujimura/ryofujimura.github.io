"use client"

import { useRef } from "react"
import { AnimatedSection } from "@/components/animated-section"
import { GSAPText, GSAPSVG } from "@/components/gsap-text"
import { LeonardoNotebook, TechnicalDrawing } from "@/components/leonardo-notebook"
import { AboutTechnicalCanvas } from "@/components/portfolio/about-technical-canvas"

const stats = [
  { label: "YEARS_CODING", value: "8+" },
  { label: "PROJECTS_SHIPPED", value: "10+" },
  { label: "INTERNSHIPS", value: "2" },
  { label: "PUBLICATIONS", value: "2" },
]

/** ASCII stats block — box-drawing, fixed width for alignment */
const ASCII_STATS_W = 42
const asciiStatsLines = [
  "╔" + "═".repeat(ASCII_STATS_W) + "╗",
  "║" + " SPEC_RF.01 │ QUANTIFIED ".padEnd(ASCII_STATS_W) + "║",
  "╠" + "═".repeat(ASCII_STATS_W) + "╣",
  ...stats.map((s) => "║" + ` ${s.label.padEnd(18)} │ ${String(s.value).padStart(6)} `.padEnd(ASCII_STATS_W) + "║"),
  "╚" + "═".repeat(ASCII_STATS_W) + "╝",
]

/** MMM. YYYY for LeonardoNotebook dates */
const currentMonthYear =
  new Date().toLocaleString("en-US", { month: "short" }) + ". " + new Date().getFullYear()

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-20 sm:py-24 md:py-28 lg:py-32 px-4 sm:px-6 overflow-hidden bg-background"
    >
      {/* Layered brutalist background: grid + technical canvas */}
      <div className="pointer-events-none absolute inset-0 bg-brutalist-grid opacity-[0.06]" aria-hidden />
      <AboutTechnicalCanvas sectionRef={sectionRef} />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ASCII section header */}
        <div className="font-mono text-[9px] sm:text-[10px] text-foreground/70 whitespace-pre mb-10 sm:mb-14">
          <GSAPText variant="lines" delay={0} className="block" scrub={false}>
            {"╔══════════════════════════════════════════════════════════╗"}
          </GSAPText>
          <GSAPText variant="lines" delay={0.05} className="block" scrub={false}>
            {"║  SECTOR: ABOUT  │  SPECIMEN: RF.01  │  REV: " +
              currentMonthYear.toUpperCase().padEnd(8) +
              "  ║"}
          </GSAPText>
          <GSAPText variant="lines" delay={0.1} className="block" scrub={false}>
            {"╚══════════════════════════════════════════════════════════╝"}
          </GSAPText>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-start">
          {/* Left column: identity + ASCII stats + narrative */}
          <div className="space-y-8 sm:space-y-10">
            {/* Identity block: photo + name + tagline */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
              <div className="shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 border-[3px] border-foreground bg-background shadow-[6px_6px_0_0_var(--foreground)] overflow-hidden">
                  <img
                    src="/images/profile.jpg"
                    alt="Ryo Fujimura"
                    className="w-full h-full object-cover object-top"
                    width={128}
                    height={128}
                  />
                </div>
                <p className="font-mono text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-[0.2em] mt-2">
                  RF.01
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4 min-w-0">
                <GSAPText
                  variant="chars"
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-black tracking-tight leading-[0.92] font-mono"
                  stagger={0.025}
                  duration={0.7}
                >
                  RYO FUJIMURA
                </GSAPText>
                <GSAPText
                  variant="words"
                  className="text-sm sm:text-base text-muted-foreground max-w-xl font-mono"
                  delay={0.3}
                  stagger={0.04}
                >
                  Software engineer + AI researcher building systems that move smoothly from lab prototype to
                  production reality.
                </GSAPText>
              </div>
            </div>

            {/* ASCII stats block — brutalist frame, line-by-line GSAP */}
            <div className="border-2 border-foreground bg-background p-3 sm:p-4 relative">
              <div className="absolute top-0 right-0 w-8 h-8 border-l-2 border-b-2 border-foreground/40" aria-hidden />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-t-2 border-r-2 border-foreground/40" aria-hidden />
              <div className="font-mono text-[8px] sm:text-[9px] text-foreground/90 whitespace-pre overflow-x-auto touch-manipulation tabular-nums space-y-0 [&>div]:block">
                {asciiStatsLines.map((line, i) => (
                  <GSAPText key={i} variant="lines" delay={0.15 + i * 0.03} className="block leading-tight">
                    {line}
                  </GSAPText>
                ))}
              </div>
            </div>

            {/* Narrative blocks — technical framing */}
            <div className="space-y-6">
              <div className="border-l-2 border-foreground pl-4 sm:pl-5">
                <GSAPText variant="words" delay={0} stagger={0.035} className="text-sm sm:text-base text-foreground/90 leading-relaxed font-mono">
                  I work where AI research, mobile, and backend systems collide. In the CPX Lab at CSULB I contribute to robotics/AI projects that have shipped as peer-reviewed publications, while internships at Bose and American Honda grounded me in large-scale, production constraints.
                </GSAPText>
              </div>
              <div className="border-l-2 border-foreground/50 pl-4 sm:pl-5">
                <GSAPText variant="words" delay={0.1} stagger={0.035} className="text-sm sm:text-base text-muted-foreground leading-relaxed font-mono">
                  The recurring pattern: take a fuzzy problem, prototype quickly, then harden the system until it can be trusted by real users—whether that's a robotics team, internal QA engineers, or everyday commuters checking a shuttle app.
                </GSAPText>
              </div>
              <div className="bg-foreground/5 border border-foreground/20 px-3 py-2 sm:px-4 sm:py-3">
                <GSAPText variant="lines" delay={0.2} className="font-mono text-[10px] sm:text-xs text-muted-foreground/90 italic">
                  {"// \"The noblest pleasure is the joy of understanding.\" — Leonardo da Vinci"}
                </GSAPText>
              </div>
            </div>

            {/* Currently / Looking for — ASCII-style labels */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 border-t-2 border-foreground/30 pt-6 sm:pt-8">
              <AnimatedSection>
                <div className="space-y-2 border-2 border-foreground/20 p-3 sm:p-4 bg-background">
                  <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    [ CURRENTLY ]
                  </p>
                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                    Undergraduate researcher at CPX Lab exploring temporal modeling, robotics, and human–robot interaction.
                  </p>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={80}>
                <div className="space-y-2 border-2 border-foreground/20 p-3 sm:p-4 bg-background">
                  <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    [ LOOKING_FOR ]
                  </p>
                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                    Roles where on-device AI, mobile, or infra meet rigorous product and research requirements.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* Right column: technical diagram SVG + pipeline ASCII notebook + stack */}
          <div className="space-y-8 sm:space-y-10">
            {/* Technical SVG panel — draw-in on scroll */}
            <div className="hidden sm:block">
              <div className="border-2 border-foreground bg-background p-3 sm:p-4 md:p-5 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-[0.12] dark:opacity-[0.18]">
                  <GSAPSVG className="w-full h-full" duration={1.8} delay={0.2}>
                    <svg viewBox="0 0 200 200" className="w-full h-full" stroke="currentColor">
                      <circle cx="100" cy="100" r="80" strokeWidth="0.6" />
                      <circle cx="100" cy="100" r="52" strokeWidth="0.5" />
                      <line x1="100" y1="10" x2="100" y2="190" strokeWidth="0.4" />
                      <line x1="10" y1="100" x2="190" y2="100" strokeWidth="0.4" />
                      {Array.from({ length: 12 }).map((_, i) => {
                        const angle = (i * 30 * Math.PI) / 180
                        const x2 = Number((100 + Math.cos(angle) * 80).toFixed(2))
                        const y2 = Number((100 + Math.sin(angle) * 80).toFixed(2))
                        return <line key={i} x1="100" y1="100" x2={x2} y2={y2} strokeWidth="0.25" />
                      })}
                      {[0, 60, 120].map((start, idx) => (
                        <polygon
                          key={idx}
                          points={Array.from({ length: 6 })
                            .map((_, j) => {
                              const angle = ((start + j * 60) * Math.PI) / 180
                              const r = 35 + idx * 6
                              const x = Number((100 + Math.cos(angle) * r).toFixed(2))
                              const y = Number((100 + Math.sin(angle) * r).toFixed(2))
                              return `${x},${y}`
                            })
                            .join(" ")}
                          fill="none"
                          strokeWidth={idx === 2 ? 0.8 : 0.4}
                        />
                      ))}
                    </svg>
                  </GSAPSVG>
                </div>
                <div className="relative space-y-2">
                  <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    SYSTEM_PROFILE
                  </p>
                  <p className="font-mono text-xs sm:text-sm text-foreground">
                    Edge-friendly AI, mobile-first UX, and research-grade experimentation coexisting in one stack.
                  </p>
                </div>
              </div>
            </div>

            <AnimatedSection>
              <LeonardoNotebook folioRef="RF.DV.ABOUT.001" date={currentMonthYear}>
                <TechnicalDrawing
                  title="PIPELINE: IDEA → PROTOTYPE → PRODUCTION"
                  asciiArt={[
                    "+-----------------+   +-----------------+",
                    "|      IDEA       |   | AI ENHANCEMENT  |",
                    "| (problem, goal) |-->| (spec, expand)  |",
                    "+--------+--------+   +-----------------+",
                    "         |                     |",
                    "         v                     v",
                    "+-----------------+   +-----------------+",
                    "|     CODING      |   |    PROTOTYPE    |",
                    "|   (implement)   |-->|   (MVP, demo)   |",
                    "+--------+--------+   +--------+--------+",
                    "         |                     |",
                    "         v                     v",
                    "+-----------------+   +-----------------+",
                    "|    ITERATE      |   |   PRODUCTION    |",
                    "| (feedback, fix) |-->| (deploy, scale) |",
                    "+--------+--------+   +--------+--------+",
                  ].join("\n")}
                  measurements={[
                    { label: "Latency", value: "−40%", unit: " vs. baseline" },
                    { label: "Memory", value: "−3GB", unit: " footprint" },
                    { label: "Accuracy", value: "95%", unit: " task" },
                  ]}
                  notes="Typical workflow from research model to on-device deployment while preserving behavior."
                />
              </LeonardoNotebook>
            </AnimatedSection>

            <AnimatedSection delay={120}>
              <div className="border-2 border-foreground/50 px-4 py-4 sm:px-5 sm:py-5 bg-background relative">
                <div className="absolute top-1 right-1 w-4 h-4 border-t border-r border-foreground/50" aria-hidden />
                <p className="font-mono text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">
                  STACK_SUMMARY
                </p>
                <p className="font-mono text-[11px] sm:text-sm text-foreground leading-relaxed">
                  Python / Swift / Kotlin · React / Next.js · Firebase / Flask · PyTorch / CoreML · Docker / Linux
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}
