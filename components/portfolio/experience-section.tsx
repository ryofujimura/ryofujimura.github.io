"use client"

import { useState } from "react"
import { GSAPText, GSAPSVG } from "@/components/gsap-text"
import { TechnicalGrid, TechnicalPattern } from "@/components/technical-grid"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

const experiences = [
  {
    title: "Undergraduate Researcher",
    company: "CPX Lab, CSULB",
    companyFull: "California State University, Long Beach",
    companyUrl: "https://csulb.edu",
    icon: "/images/cs_research.svg",
    period: "Aug 2024 – Present",
    description: "Contributing to a 30+ person robotics/AI research group, supporting two peer-reviewed publications (ICCPS 2025, ICRA 2026).",
    highlights: [
      "Developed transformer-based classifiers improving task accuracy by 25% and supporting real-time robotic actuation",
      "Built 3D-printed prototypes (10 iterations) and sensor-integrated hardware systems",
      "Led data collection/annotation pipelines generating 1,000+ labeled samples",
      "Created reproducible ML pipelines adopted by multiple lab members",
    ],
    skills: ["PyTorch", "Transformers", "Python", "3D Printing", "Data Pipelines"],
  },
  {
    title: "Android / iOS Development Intern",
    company: "Bose Corporation",
    companyFull: "Bose Corporation",
    companyUrl: "https://bose.com",
    icon: "/images/bose_1.svg",
    period: "Jun 2025 – Aug 2025",
    description: "Engineered internal Bluetooth debugging tools adopted by 1,000+ engineers, accelerating cross-platform testing.",
    highlights: [
      "Reduced QA mismatch-version detection time by 40–60%, shortening release cycles",
      "Eliminated 10+ hours/week of debugging overhead through automation",
      "Built production-grade features using Swift Concurrency, Kotlin Coroutines, Rx",
      "Collaborated with firmware, cloud, and mobile groups resolving cross-team issues",
    ],
    skills: ["Swift", "Kotlin", "SwiftUI", "Jetpack Compose", "Bluetooth"],
  },
  {
    title: "Software Engineer Intern",
    company: "American Honda",
    companyFull: "American Honda Motor Co., Inc.",
    companyUrl: "https://honda.com",
    icon: "/images/honda.svg",
    period: "Jun 2024 – Aug 2024",
    description: "Prototyped next-generation on-device AI using Jetson Orin Nano, evaluating automotive-grade compute constraints.",
    highlights: [
      "Reduced Llama3 8B inference latency by 20–40% via mixed-precision quantization",
      "Achieved over 3GB RAM savings enabling deployment under OEM safety requirements",
      "Delivered demos to 10+ cross-functional teams including executive leadership",
      "Profiled thermal, latency, and bandwidth tradeoffs for hybrid inference",
    ],
    skills: ["CUDA", "PyTorch", "Llama.cpp", "Jetson", "Edge AI"],
  },
  {
    title: "Data Engineer (Freelance)",
    company: "CUSCO USA",
    companyFull: "CUSCO USA Inc.",
    companyUrl: "#",
    icon: "/images/cusco.svg",
    period: "Oct 2021 – May 2024",
    description: "Built Python-based extraction pipelines processing 11,500+ legacy files spanning PDFs, images, and mixed formats.",
    highlights: [
      "Delivered 5–10× faster processing vs. manual workflows with 1–3% error rate",
      "Designed normalization/indexing layers exposing cleaned data through internal API",
      "Enabled 30% revenue increase by converting archival content into searchable intelligence",
    ],
    skills: ["Python", "Data Pipelines", "OCR", "API Design", "ETL"],
  },
]

export function ExperienceSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section
      id="experience"
      className="relative py-16 sm:py-24 md:py-32 lg:py-40 px-3 sm:px-6 bg-background overflow-hidden border-y border-foreground"
      aria-label="Experience"
    >
      {/* Section: Experience */}
      {/* Subsection: Brutalist technical chrome + grid */}
      <TechnicalPattern />
      <div className="pointer-events-none absolute inset-4 opacity-10 hidden sm:block">
        <TechnicalGrid className="w-full h-full text-foreground" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Subsection: Header — operational log label + title + intro panel */}
        <header className="grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start mb-10 sm:mb-14 md:mb-16">
          <div className="space-y-3 sm:space-y-4">
            <GSAPText
              variant="lines"
              className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.4em] text-muted-foreground"
            >
              Experience // Operational Log
            </GSAPText>
            <GSAPText
              variant="words"
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[0.9]"
            >
              Brutalist deployment history, tuned for real constraints.
            </GSAPText>
            <GSAPText
              variant="scramble"
              className="font-mono text-[11px] sm:text-xs text-muted-foreground/70"
            >
              STATUS: SYSTEMS-LEVEL ENGINEER // AI RESEARCH // EDGE DEPLOYMENTS
            </GSAPText>
          </div>

          <div className="relative">
            <div className="absolute inset-0 border border-dashed border-foreground/30 pointer-events-none" />
            <div className="bg-secondary p-4 sm:p-5 md:p-6 border border-foreground shadow-[4px_4px_0_0_theme(colors.foreground)]">
              <p className="font-mono text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                Each row below is a{" "}
                <span className="text-foreground font-semibold">work-log entry</span> across internships,
                research, and freelance: different environments, same obsession with reliability,
                observability, and measurable impact.
              </p>
              <p className="font-mono text-[11px] sm:text-xs text-muted-foreground mt-3">
                Hover or tap to lock a role. Numbers on the right call out{" "}
                <span className="text-accent font-semibold">throughput, savings, or deltas</span> – not vibes.
              </p>

              <GSAPSVG className="mt-4 hidden w-full h-20 text-foreground/40 sm:block">
                <svg viewBox="0 0 400 80" className="w-full h-full" fill="none" stroke="currentColor">
                  <line x1="10" y1="70" x2="390" y2="70" strokeWidth="0.75" />
                  {experiences.map((_, i) => {
                    const x = 40 + i * 80
                    return (
                      <g key={i}>
                        <circle cx={x} cy="40" r="6" strokeWidth="1" />
                        <line
                          x1={x}
                          y1="40"
                          x2={x}
                          y2="70"
                          strokeWidth="0.75"
                        />
                      </g>
                    )
                  })}
                  <polyline
                    points="40,38 120,30 200,24 280,28 360,20"
                    strokeWidth="0.75"
                    opacity="0.5"
                  />
                </svg>
              </GSAPSVG>
            </div>
          </div>
        </header>

        {/* Subsection: Matrix layout — index rail + detail panel */}
        <div className="grid gap-6 lg:grid-cols-[minmax(220px,260px)_minmax(0,1fr)]">
          {/* Subsection: Index rail — role list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-foreground pb-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]">
                Index
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                0{experiences.length}
              </span>
            </div>

            <div className="border border-foreground divide-y divide-foreground bg-secondary">
              {experiences.map((exp, index) => (
                <button
                  key={exp.company}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "group w-full text-left px-3 sm:px-4 py-3 sm:py-3.5 flex items-center justify-between gap-3 touch-target",
                    "font-mono text-[11px] sm:text-xs uppercase tracking-[0.12em]",
                    activeIndex === index
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary hover:bg-foreground hover:text-background"
                  )}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    {"icon" in exp && exp.icon ? (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-current overflow-hidden bg-background/80">
                        <img src={exp.icon} alt="" className="h-5 w-5 object-contain" width={20} height={20} />
                      </span>
                    ) : (
                      <span className="inline-flex h-5 w-5 items-center justify-center border border-current">
                        {index.toString().padStart(2, "0")}
                      </span>
                    )}
                    <div className="flex flex-col">
                      <span className="font-semibold leading-tight">
                        {exp.company}
                      </span>
                      <span className="text-[10px] sm:text-[11px] opacity-70 leading-tight">
                        {exp.title}
                      </span>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex text-[10px] opacity-80">
                    {exp.period}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Subsection: Detail grid — active role content (highlights, skills, signal summary) */}
          <div className="relative border border-foreground bg-card shadow-none sm:shadow-[6px_6px_0_0_theme(colors.foreground)]">
            <div className="absolute inset-x-0 top-0 h-8 bg-[repeating-linear-gradient(90deg,transparent,transparent_6px,theme(colors.foreground/10)_6px,theme(colors.foreground/10)_8px)] opacity-60 pointer-events-none" />

            <div className="relative p-4 sm:p-6 md:p-7 space-y-5 sm:space-y-6">
              {experiences.map((exp, index) => {
                const isActive = index === activeIndex
                return (
                  <article
                    key={exp.company}
                    className={cn(
                      "transition-all duration-300 border border-dashed border-transparent",
                      isActive
                        ? "opacity-100 translate-y-0 border-foreground"
                        : "opacity-0 pointer-events-none absolute inset-4"
                    )}
                    aria-hidden={!isActive}
                  >
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight uppercase">
                          {exp.title}
                        </h3>
                        <p className="font-mono text-[11px] sm:text-xs text-muted-foreground uppercase tracking-[0.18em]">
                          {exp.period}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <a
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 border border-foreground px-2.5 py-1.5 text-[11px] sm:text-xs font-mono uppercase tracking-[0.16em] hover:bg-foreground hover:text-background transition-colors"
                        >
                          <span>{exp.companyFull}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <span className="h-px flex-1 bg-foreground/30" />
                        <span className="font-mono text-[11px] sm:text-xs text-muted-foreground">
                          Highlights: {exp.highlights.length.toString().padStart(2, "0")} // Skills:{" "}
                          {exp.skills.length.toString().padStart(2, "0")}
                        </span>
                      </div>

                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                        {exp.description}
                      </p>

                      <div className="grid gap-3 sm:gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
                        <ul className="space-y-2.5 sm:space-y-3">
                          {exp.highlights.map((highlight, i) => (
                            <li
                              key={i}
                              className="flex gap-3 text-xs sm:text-sm text-foreground/90"
                            >
                              <span className="mt-1 h-3 w-3 shrink-0 border border-foreground bg-accent/20" />
                              <span className="leading-relaxed">{highlight}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="space-y-3 sm:space-y-4">
                          <div className="border border-foreground bg-secondary/60 p-3 sm:p-4">
                            <p className="font-mono text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-[0.14em] mb-2">
                              Skill surface
                            </p>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {exp.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.16em] bg-background text-foreground border border-foreground"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="border border-dashed border-foreground/60 p-3 sm:p-4">
                            <p className="font-mono text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-[0.16em] mb-1">
                              Signal summary
                            </p>
                            <p className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/80 leading-relaxed">
                              ΔLatency, ΔThroughput, ΔReliability vary per role, but constant is{" "}
                              <span className="text-foreground font-semibold">shipping rigorously
                              measured systems</span>{" "}
                              under bandwidth, hardware, or organizational constraints.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
