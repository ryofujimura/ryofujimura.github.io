"use client"

import { AnimatedSection } from "@/components/animated-section"
import { GSAPText, GSAPSVG } from "@/components/gsap-text"
import { LeonardoNotebook, TechnicalDrawing, SpecAnnotation } from "@/components/leonardo-notebook"
import { FileText, Award, ArrowUpRight } from "lucide-react"

const publications = [
  {
    id: "RP-01",
    title:
      "Demo Abstract: Custom 3D-Printed Mouse: A Proof of Concept for Personalized Input Devices",
    conference: "ACM/IEEE International Conference on Cyber-Physical Systems (ICCPS)",
    year: "2025",
    type: "Demo Abstract",
    role: "Lead Designer / Implementer",
    description:
      "Custom shell and internal geometry tuned for low mass and structural integrity; validated through stress testing and empirical performance measurements.",
    impact: "−45% total weight, 15.1 g shell, 15% infill stress-tested structure.",
    link: "#",
  },
  {
    id: "RP-02",
    title: "STL-Guided Human vs. Robot Classification for Robotic Keyboard Actuation",
    conference: "IEEE International Conference on Robotics and Automation (ICRA)",
    year: "2026",
    type: "Full Paper",
    role: "Co‑Author / Systems Engineer",
    description:
      "Temporal feature pipeline for discriminating robotic vs. human keystrokes while driving a high-speed actuation rig.",
    impact:
      "102 keystrokes / 30 s at 100% success, 21.7 ms latency, 95% human–robot classification accuracy over 40 trajectories.",
    link: "#",
  },
]

export function PublicationsSection() {
  return (
    <section
      id="publications"
      className="relative py-16 sm:py-20 md:py-28 lg:py-36 px-4 sm:px-5 overflow-hidden bg-background border-t border-b border-foreground/10"
    >
      {/* Brutalist background grid + registration marks */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, currentColor, currentColor 1px, transparent 1px, transparent 18px)," +
            "repeating-linear-gradient(90deg, currentColor, currentColor 1px, transparent 1px, transparent 24px)",
        }}
      />
      <div className="pointer-events-none absolute -top-6 left-4 sm:left-6 h-12 w-12 sm:h-16 sm:w-16 border border-foreground/40" aria-hidden />
      <div className="pointer-events-none absolute bottom-8 right-4 sm:right-6 h-8 w-8 sm:h-10 sm:w-10 border border-dashed border-foreground/30" aria-hidden />

      {/* Technical SVG field – draws in with GSAPSVG */}
      <GSAPSVG className="pointer-events-none absolute inset-y-24 right-[-18%] hidden lg:block w-[260px] lg:w-[320px] xl:w-[360px] text-foreground/40">
        <svg viewBox="0 0 220 260" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="0.5">
          {/* swirling flow inspired by hair / water studies */}
          <path d="M10 210 Q 60 190 110 210 T 210 210" />
          <path d="M20 190 Q 70 170 120 190 T 220 190" />
          <path d="M30 170 Q 80 150 130 170 T 230 170" />
          {Array.from({ length: 18 }).map((_, i) => {
            const y = 40 + i * 6
            return <path key={y} d={`M5 ${y} C 40 ${y - 8}, 80 ${y + 8}, 140 ${y} S 220 ${y - 6}, 250 ${y}`} />
          })}
          {/* polyhedral stack */}
          <polygon points="70,40 110,20 150,40 150,80 110,100 70,80" />
          <polygon points="90,60 110,50 130,60 130,80 110,90 90,80" />
          <line x1="110" y1="100" x2="110" y2="150" />
          <polygon points="80,150 140,150 160,190 60,190" />
          {/* construction lines */}
          <line x1="20" y1="20" x2="200" y2="20" strokeDasharray="4 4" />
          <line x1="20" y1="20" x2="20" y2="220" strokeDasharray="4 4" />
          <circle cx="180" cy="60" r="14" />
          <circle cx="180" cy="60" r="6" />
        </svg>
      </GSAPSVG>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 sm:mb-14 md:mb-18 flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
          <div className="space-y-3 sm:space-y-4 max-w-xl">
            <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.28em] text-muted-foreground">
              RESEARCH LOG / SERIES 04
            </p>
            <GSAPText
              variant="words"
              stagger={0.025}
              className="text-[1.9rem] sm:text-4xl md:text-5xl lg:text-[3.1rem] font-black leading-[0.9] tracking-tight font-mono"
            >
              RESEARCH &amp; PUBLICATIONS
            </GSAPText>
            <GSAPText
              variant="words"
              delay={0.4}
              className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg"
            >
              Peer‑reviewed work at the intersection of robotics, human input devices, and temporal modeling —
              presented as a lab notebook rather than a marketing page.
            </GSAPText>
          </div>

          <div className="w-full md:w-auto max-w-sm md:ml-auto">
            <LeonardoNotebook folioRef="RF.RP.002" date="Aug. 2024 to present">
              <TechnicalDrawing
                title="EXPERIMENT INDEX"
                asciiArt={`    [RP-01]  INPUT DEVICE
       └─ custom 3D shell
    [RP-02]  ROBOTICS / HRI
       └─ temporal classifiers`}
                measurements={[
                  { label: "Papers", value: "2" },
                  { label: "Domains", value: "CPS + AI / ML" },
                  { label: "Status", value: "Exploring" },
                ]}
                notes="Snapshot of current research surface area — not a final state."
              />
            </LeonardoNotebook>
          </div>
        </div>

        {/* Main grid: brutalist timeline + spec sheet */}
        <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8 sm:gap-10 lg:gap-14">
          {/* Left: timeline-style list */}
          <div className="space-y-6 sm:space-y-7">
            {publications.map((pub, index) => (
              <AnimatedSection key={pub.id} delay={index * 120}>
                <article className="group relative border-l-2 border-foreground/50 pl-4 sm:pl-6 py-5 sm:py-6">
                  <div className="absolute -left-[7px] top-6 h-3 w-3 bg-background border border-foreground" />
                  <div className="flex items-baseline justify-between gap-4 mb-3">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {pub.type}
                      </span>
                      <span className="font-mono text-xs sm:text-sm text-muted-foreground/80">
                        {pub.conference}
                      </span>
                    </div>
                    <span className="font-mono text-xs sm:text-sm text-foreground/80 tabular-nums">
                      {pub.year}
                    </span>
                  </div>

                  <div className="flex gap-3 sm:gap-4">
                    <div className="mt-1 hidden sm:block text-[11px] font-mono text-muted-foreground/80">
                      {pub.id}
                    </div>
                    <div className="flex-1 space-y-2.5 sm:space-y-3">
                      <div className="flex items-start gap-2">
                        <FileText className="mt-0.5 h-4 w-4 text-accent shrink-0" />
                        <GSAPText
                          variant="lines"
                          className="text-base sm:text-lg md:text-xl font-semibold text-foreground leading-snug"
                        >
                          {pub.title}
                        </GSAPText>
                      </div>
                      <p className="text-xs sm:text-sm font-mono text-muted-foreground/90">
                        ROLE: <span className="text-foreground/90">{pub.role}</span>
                      </p>
                      <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                        {pub.description}
                      </p>
                      <p className="text-xs sm:text-sm text-accent font-mono leading-relaxed">
                        {pub.impact}
                      </p>

                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="pointer"
                        data-cursor-text="OPEN"
                        className="inline-flex items-center gap-1.5 mt-1 text-[11px] sm:text-xs font-mono uppercase tracking-[0.22em] text-muted-foreground group-hover:text-accent transition-colors"
                      >
                        VIEW PAPER
                        <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>

          {/* Right: research service + meta spec */}
          <div className="space-y-6 sm:space-y-7">
            <AnimatedSection>
              <LeonardoNotebook folioRef="RF.RP.SERVICE.001" date="2026">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="mt-0.5 h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center border border-foreground/60 bg-background">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      ACADEMIC SERVICE
                    </p>
                    <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                      Reviewer for{" "}
                      <span className="font-semibold">
                        IEEE International Conference on Robotics and Automation (ICRA) 2026
                      </span>
                      , focusing on submissions at the interface of perception, control, and human–robot interaction.
                    </p>
                    <div className="space-y-1.5 sm:space-y-2 mt-1">
                      <SpecAnnotation label="Tracks" value="Robotics / HRI" notes="Mixed empirical + systems work" />
                      <SpecAnnotation
                        label="Criteria"
                        value="Rigor + Utility"
                        notes="Reproducible methods and clear deployment story"
                      />
                    </div>
                  </div>
                </div>
              </LeonardoNotebook>
            </AnimatedSection>

            <AnimatedSection delay={160}>
              <LeonardoNotebook folioRef="RF.RP.METRICS.002" date="Live">
                <div className="space-y-3 sm:space-y-4">
                  <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    METRIC SNAPSHOT
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <SpecAnnotation label="Peer‑reviewed" value="2" notes="ICCPS, ICRA" />
                    <SpecAnnotation label="Latency" value="21.7" unit="ms" notes="Robotic actuation loop" />
                    <SpecAnnotation label="Accuracy" value="95%" notes="Human vs. robot classifier" />
                    <SpecAnnotation label="Weight" value="−45%" unit="shell" notes="Custom mouse prototype" />
                  </div>
                </div>
              </LeonardoNotebook>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}
