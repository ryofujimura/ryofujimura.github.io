"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { GSAPText, GSAPSVG } from "@/components/gsap-text"
import { TechnicalGrid, TechnicalPattern } from "@/components/technical-grid"
import { SkillSurfaceGlobe } from "@/components/skill-surface-globe"
import { cn } from "@/lib/utils"

// icon = index list (left rail); panelImage = ENTRY header background (optional, falls back to icon)
const experiences = [
  {
    title: "Android / iOS Development Intern",
    company: "Bose Corporation",
    companyFull: "Bose Corporation",
    icon: "/images/bose_logo.svg",
    panelImage: "/images/bose_1.svg",
    mediaImages: ["/images/bose_2.JPG", "/images/bose_3.JPG"],
    period: "Jun 2025 – Aug 2025",
    description: "Engineered internal Bluetooth debugging tools adopted by 1,000+ engineers, accelerating cross-platform testing.",
    highlights: [
      "Reduced QA mismatch-version detection time by 40–60%, shortening release cycles",
      "Eliminated 10+ hours/week of debugging overhead through automation",
      "Built production-grade features using Swift Concurrency, Kotlin Coroutines, Rx",
      "Collaborated with firmware, cloud, and mobile groups resolving cross-team issues",
    ],
    skills: ["Swift", "Kotlin", "Rx", "BLE", "WebSockets", "Debugging", "Automation"],
  },
  {
    title: "Software Engineer Intern",
    company: "Honda Motor Co.",
    companyFull: "American Honda Motor Co., Inc.",
    icon: "/images/honda.svg",
    panelImage: "/images/hondalogo.svg",
    mediaImages: ["/images/honda.svg", "/images/hondalogo.svg"],
    period: "Jun 2024 – Aug 2024",
    description: "Prototyped next-generation on-device AI using Jetson Orin Nano, evaluating automotive-grade compute constraints.",
    highlights: [
      "Reduced Llama3 8B inference latency by 20–40% via mixed-precision quantization",
      "Achieved over 3GB RAM savings enabling deployment under OEM safety requirements",
      "Delivered demos to 10+ cross-functional teams including executive leadership",
      "Profiled thermal, latency, and bandwidth tradeoffs for hybrid inference",
    ],
    skills: ["AI", "Jetson", "Quantization", "Optimization", "Latency", "Memory", "Benchmarking"],
  },
  {
    title: "Undergraduate Researcher",
    company: "CPX Lab",
    companyFull: "CPX at California State University, Long Beach",
    icon: "/images/CSU-Longbeach.svg",
    panelImage: "/images/lb.csulb.png",
    mediaImages: ["/images/CSU-Longbeach.svg", "/images/lb.csulb.png"],
    period: "Aug 2024 – Present",
    description: "Contributing to a 30+ person robotics/AI research group, supporting two peer-reviewed publications (ICCPS 2025, ICRA 2026).",
    highlights: [
      "Developed transformer-based classifiers improving task accuracy by 25% and supporting real-time robotic actuation",
      "Built 3D-printed prototypes (10 iterations) and sensor-integrated hardware systems",
      "Led data collection/annotation pipelines generating 1,000+ labeled samples",
      "Created reproducible ML pipelines adopted by multiple lab members",
    ],
    skills: ["Research", "Robotics", "ML", "Transformers", "Prototyping", "Pipelines"],
  },
  {
    title: "Data Engineer (Freelance)",
    company: "CUSCO USA",
    companyFull: "CUSCO USA Inc.",
    icon: "/images/cusco.svg",
    panelImage: "/images/cusco.svg",
    mediaImages: ["/images/cusco.svg"],
    period: "Oct 2021 – May 2024",
    description: "Built Python-based extraction pipelines processing 11,500+ legacy files spanning PDFs, images, and mixed formats.",
    highlights: [
      "Delivered 5–10× faster processing vs. manual workflows with 1–3% error rate",
      "Designed normalization/indexing layers exposing cleaned data through internal API",
      "Enabled 30% revenue increase by converting archival content into searchable intelligence",
    ],
    skills: ["Automation", "Data Engineering", "Normalization", "Indexing"],
  },
]

export function ExperienceSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])
  const entryBgRef = useRef<HTMLDivElement | null>(null)
  const entryScanRef = useRef<HTMLDivElement | null>(null)
  const entrySvgRef = useRef<SVGSVGElement | null>(null)
  const entryLabelRef = useRef<HTMLDivElement | null>(null)

  // GSAP: ENTRY bg + ASCII frame draw → content blocks stagger
  useEffect(() => {
    const content = contentRefs.current[activeIndex]
    const entryBg = entryBgRef.current
    const scan = entryScanRef.current
    const svg = entrySvgRef.current
    const label = entryLabelRef.current
    if (!content) return

    // Reset entry SVG geometry for draw-in
    if (svg) {
      const els = svg.querySelectorAll<SVGGeometryElement>("line, path")
      els.forEach((el) => {
        if (typeof el.getTotalLength === "function") {
          const len = el.getTotalLength()
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
        }
      })
    }
    if (label) gsap.set(label, { opacity: 0 })
    if (entryBg) gsap.set(entryBg, { opacity: 0, scale: 1.06, backgroundPosition: "120% 50%" })
    if (scan) gsap.set(scan, { opacity: 0, y: -6 })
    gsap.set(content, { opacity: 1, y: 0 })
    const blocks = content.querySelectorAll<HTMLElement>("[data-detail-block]")
    gsap.set(blocks, { opacity: 0, y: 10 })

    const tl = gsap.timeline({ overwrite: true })
    // ENTRY background image: position + opacity/scale + scanline sweep (loading feel)
    if (entryBg) {
      tl.to(entryBg, {
        opacity: 0.12,
        scale: 1,
        backgroundPosition: "100% 50%",
        duration: 0.55,
        ease: "power3.out",
      })
      if (scan) {
        tl.to(scan, { opacity: 0.18, y: 0, duration: 0.18, ease: "power2.out" }, 0.06)
        tl.to(scan, { opacity: 0, y: 8, duration: 0.22, ease: "power2.in" }, 0.22)
      }
    }
    // ASCII entry frame (lines + corners) draw in
    if (svg) {
      const els = svg.querySelectorAll<SVGGeometryElement>("line, path")
      tl.to(els, { strokeDashoffset: 0, duration: 0.4, stagger: 0.04, ease: "power2.inOut" }, entryBg ? "-=0.25" : undefined)
    }
    if (label) {
      tl.to(label, { opacity: 1, duration: 0.2 }, "-=0.2")
    }
    // Content blocks stagger
    tl.to(blocks, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power3.out" }, "-=0.2")
  }, [activeIndex])

  const roleCount = experiences.length
  const chartLeft = 34
  const chartRight = 366
  const chartTop = 14
  const chartBottom = 66
  const chartWidth = chartRight - chartLeft
  const step = chartWidth / Math.max(1, roleCount - 1)

  const barLevels = experiences.map((_, i) => {
    const t = roleCount <= 1 ? 1 : i / (roleCount - 1)
    return Math.round(2 + t * 4) // 2..6 blocks (simple growth signal)
  })

  const xCenters = experiences.map((_, i) => chartLeft + i * step)
  const barTops = barLevels.map((lvl) => chartBottom - lvl * 6 + 2)
  const trendPoints = xCenters.map((x, i) => `${x},${barTops[i]}`).join(" ")

  return (
    <section
      id="experience"
      className="relative py-16 sm:py-24 md:py-32 lg:py-40 px-3 sm:px-6 bg-background overflow-hidden border-y border-foreground"
    >
      {/* Brutalist technical chrome */}
      <TechnicalPattern />
      <div className="pointer-events-none absolute inset-4 opacity-10 hidden sm:block">
        <TechnicalGrid className="w-full h-full text-foreground" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
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
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[0.94]"
            >
              from Research to Production. systems built to Ship, not demo.
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
              <p className="hidden sm:block font-mono text-[11px] sm:text-xs text-muted-foreground mt-3">
                Hover or tap to lock a role. In the detail panel, the metrics call out{" "}
                <span className="text-accent font-semibold">throughput, savings, or deltas</span> – not vibes.
              </p>

              <GSAPSVG className="mt-4 w-full h-20 text-foreground/40">
                <svg viewBox="0 0 400 80" className="w-full h-full" fill="none" stroke="currentColor">
                  {/* ASCII-terminal frame */}
                  <rect x="10" y="10" width="380" height="60" strokeWidth="0.9" />
                  <rect x="16" y="16" width="368" height="48" strokeWidth="0.6" opacity="0.55" />

                  {/* Scanlines + tick marks */}
                  {Array.from({ length: 11 }).map((_, i) => {
                    const x = 20 + i * 34
                    return (
                      <line
                        key={`scan-${i}`}
                        x1={x}
                        y1={16}
                        x2={x}
                        y2={64}
                        strokeWidth="0.5"
                        opacity="0.25"
                      />
                    )
                  })}
                  {Array.from({ length: 6 }).map((_, i) => {
                    const y = 20 + i * 8
                    return (
                     <line
                        key={`row-${i}`}
                        x1={16}
                        y1={y}
                        x2={384}
                        y2={y}
                        strokeWidth="0.5"
                        opacity="0.15"
                      /> 
                    )
                  })}

                  {/* Axes */}
                  <line x1={chartLeft} y1={chartTop} x2={chartLeft} y2={chartBottom} strokeWidth="0.0" />
                  <line x1={chartLeft} y1={chartBottom} x2={chartRight} y2={chartBottom} strokeWidth="0.75" />

                  {/* Bars built from blocks (ASCII looks) */}
                  {barLevels.map((lvl, i) => {
                    const x = xCenters[i] - 10
                    return (
                      <g key={`bar-${i}`}>
                        <line
                          x1={xCenters[i]}
                          y1={chartBottom}
                          x2={xCenters[i]}
                          y2={chartBottom + 3}
                          strokeWidth="0.75"
                          opacity="0.8"
                        />
                        {Array.from({ length: lvl }).map((_, j) => {
                          const y = chartBottom - (j + 1) * 6
                          return (
                            <rect
                              key={`blk-${i}-${j}`}
                              x={x}
                              y={y}
                              width="20"
                              height="5"
                              strokeWidth="0.75"
                              fill="currentColor"
                              opacity={0.08 + j * 0.02}
                            />
                          )
                        })}
                        <circle cx={xCenters[i]} cy={barTops[i]} r="2.5" strokeWidth="0.9" opacity="0.7" />
                      </g>
                    )
                  })}

                  {/* Growth trend (simple, upward) */}
                  <polyline points={trendPoints} strokeWidth="1.1" opacity="0.6" />
                   </svg>
              </GSAPSVG>
            </div>
          </div>
        </header>

        {/* Matrix layout */}
        <div className="grid gap-6 lg:grid-cols-[minmax(220px,260px)_minmax(0,1fr)]">
          {/* Index rail */}
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

          {/* Detail grid */}
          <div className="relative border border-foreground bg-card shadow-none sm:shadow-[6px_6px_0_0_theme(colors.foreground)]">
            {/* ASCII entry header: frame + line draw in with GSAP on index change */}
            <div className="relative min-h-[3rem] border-b border-foreground/20 bg-secondary/50 px-3 py-2 sm:px-4 sm:py-2.5">
              {/* ENTRY background image: starts at 0, GSAP fades in on load / index change */}
              <div
                ref={entryBgRef}
                className="pointer-events-none absolute inset-0 origin-center will-change-transform opacity-0"
                style={
                  (experiences[activeIndex]?.panelImage ?? experiences[activeIndex]?.icon)
                    ? {
                        backgroundImage: `url(${experiences[activeIndex]?.panelImage ?? experiences[activeIndex]?.icon})`,
                        backgroundSize: "contain",
                        backgroundPosition: "right center",
                        backgroundRepeat: "no-repeat",
                        filter: "contrast(1.05)",
                        maskImage: "linear-gradient(90deg, transparent 0%, black 35%, black 100%)",
                        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 35%, black 100%)",
                      }
                    : undefined
                }
                aria-hidden
              >
                {/* Scanline sweep (GSAP) */}
                <div
                  ref={entryScanRef}
                  className="absolute inset-0 opacity-0 bg-[repeating-linear-gradient(180deg,transparent,transparent_6px,theme(colors.foreground/12)_6px,theme(colors.foreground/12)_8px)]"
                  aria-hidden
                />
              </div>
              <svg
                ref={entrySvgRef}
                className="absolute left-0 right-0 top-0 h-full w-full min-h-[3rem]"
                viewBox="0 0 320 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
                aria-hidden
              >
                {/* <path d="M 0 48 L 0 0 L 320 0" className="text-foreground/50" />
                <path d="M 320 0 L 320 48 L 0 48" className="text-foreground/50" />
                <line x1="0" y1="24" x2="320" y2="24" className="text-foreground/40" /> */}
              </svg>
              <div
                ref={entryLabelRef}
                className="relative z-10 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-muted-foreground opacity-0"
                aria-hidden
              >
                &gt; ENTRY {(activeIndex + 1).toString().padStart(2, "0")} // {experiences[activeIndex]?.company ?? "—"}
              </div>
            </div>

            <div className="relative p-3 sm:p-4 md:p-5 space-y-5 sm:space-y-6">
              {experiences.map((exp, index) => {
                const isActive = index === activeIndex
                return (
                  <article
                    key={exp.company}
                    className={cn(
                      "relative transition-[opacity,transform] duration-200 border border-dashed p-1 sm:p-1.5 md:p-2",
                      isActive
                        ? "opacity-100 translate-y-0 border-foreground"
                        : "opacity-0 pointer-events-none absolute inset-2 sm:inset-3 md:inset-3.5 border-transparent"
                    )}
                    aria-hidden={!isActive}
                  >
                    <div
                      ref={(el) => {
                        contentRefs.current[index] = el
                      }}
                      className={cn(
                        "relative z-10 flex flex-col gap-3 sm:gap-4",
                        isActive && "opacity-0"
                      )}
                    >
                      <div data-detail-block className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight uppercase">
                          {exp.title}
                        </h3>
                        <p className="font-mono text-[11px] sm:text-xs text-muted-foreground uppercase tracking-[0.18em]">
                          {exp.period}
                        </p>
                      </div>

                      <div data-detail-block className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {Array.isArray((exp as any).mediaImages) && (exp as any).mediaImages.length > 0 ? (
                          <div className="inline-flex items-center gap-1.5">
                            {(exp as any).mediaImages.slice(0, 3).map((src: string, i: number) => (
                              <a
                                key={`${exp.company}-media-${i}`}
                                href={src}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-10 w-10 items-center justify-center border border-foreground bg-background hover:bg-foreground/90 transition-colors overflow-hidden"
                              >
                                <div className="relative h-8 w-8">
                                  <Image
                                    src={src}
                                    alt=""
                                    fill
                                    className="object-contain"
                                    sizes="32px"
                                    loading="lazy"
                                  />
                                </div>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.16em]">
                            {exp.companyFull}
                          </span>
                        )}
                        <span className="h-px flex-1 bg-foreground/30" />
                        <span className="font-mono text-[11px] sm:text-xs text-muted-foreground">
                          Highlights: {exp.highlights.length.toString().padStart(2, "0")} // Skills:{" "}
                          {exp.skills.length.toString().padStart(2, "0")}
                        </span>
                      </div>

                      <p data-detail-block className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                        {exp.description}
                      </p>

                      <div data-detail-block className="grid gap-3 sm:gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
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
                          {isActive ? (
                            <SkillSurfaceGlobe entryIndex={index} words={exp.skills} height={100} />
                          ) : null}

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
