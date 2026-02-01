"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Github, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// ASCII NEURAL PATTERNS
// ─────────────────────────────────────────────────────────────

const ASCII_NEURON = `
     ●
    /|\\
   / | \\
  ●──●──●
   \\ | /
    \\|/
     ●
`.trim()

const ASCII_SYNAPSE = `○──────●──────○`

const ASCII_DENDRITE = `
  ╭─╮   ╭─╮
 ╭╯ ╰─●─╯ ╰╮
 │    │    │
`.trim()

const ASCII_BRAIN_WAVE = `∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿`

const ASCII_PULSE = `─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─`

const ASCII_NODES = `◉───◎───◉───◎───◉───◎───◉───◎───◉───◎───◉`

// ─────────────────────────────────────────────────────────────
// SKILL GROUPS
// ─────────────────────────────────────────────────────────────

const SKILL_GROUPS = {
  "Mobile": ["Swift", "SwiftUI", "Kotlin", "WatchOS", "AVFoundation", "App Store", "probability"],
  "Web": ["React", "React 19", "Next.js", "Tailwind", "WebSocket", "Vercel"],
  "Cloud": ["Firebase", "Firestore", "Firebase RTDB", "Cloud Functions", "Node.js", "Real-time", "Google APIs"],
  "AI/ML": ["AI/ML", "AI routing", "PyTorch", "Vision", "llama.cpp", "GGUF"],
  "Python": ["Python", "Flask", "scheduling", "automation", "Instagram"],
}

type SkillGroup = keyof typeof SKILL_GROUPS

// ─────────────────────────────────────────────────────────────
// PROJECT DATA
// ─────────────────────────────────────────────────────────────

const allProjects = [
  {
    id: "01",
    code: "NRN.01",
    title: "Saboriendo Bakery Platform",
    sector: "SYNAPTIC",
    primarySkill: "React + SwiftUI",
    year: "2024",
    image: "/images/default_image.png",
    description: "Full-stack e-commerce with real-time order processing. Barcode verification across 11+ formats, 50%+ faster lookup.",
    metrics: ["50%↑", "11+", "3L"],
    skills: ["React 19", "SwiftUI", "Firebase", "Firestore", "AVFoundation"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "02",
    code: "NRN.02",
    title: "Zero Inbox",
    sector: "CORTEX",
    primarySkill: "Swift + AI",
    year: "2025",
    image: "/images/default_image.png",
    description: "AI email client with 95% classification accuracy. Multi-stage decision system with 100-300ms inference.",
    metrics: ["95%", "200ms", "200/m"],
    skills: ["Swift", "SwiftUI", "Firebase", "AI/ML", "Google APIs"],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
  },
  {
    id: "03",
    code: "NRN.03",
    title: "Research Lab Management",
    sector: "AXON",
    primarySkill: "Cloud Functions",
    year: "2025",
    image: "/images/default_image.png",
    description: "Serverless AI routing for 30+ researchers. Sub-200ms response with metadata-aware prompting.",
    metrics: ["<200ms", "30+", "ML"],
    skills: ["Cloud Functions", "Firebase", "AI routing", "Node.js"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "04",
    code: "NRN.04",
    title: "HTIC Shuttle",
    sector: "DENDRITE",
    primarySkill: "Firebase RTDB",
    year: "2025",
    image: "/images/schedule.jpg",
    description: "Live shuttle tracking for 25+ daily users. 70%+ reduction in duplicate pickups via event serialization.",
    metrics: ["25+", "70%↓", "<100ms"],
    skills: ["Swift", "Kotlin", "Firebase RTDB", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
  },
  {
    id: "05",
    code: "NRN.05",
    title: "CyberEdu",
    sector: "SYNAPSE",
    primarySkill: "Swift + Kotlin",
    year: "2025",
    image: "/images/CyberEdu.png",
    description: "Synchronized iOS+Android apps with 99%+ cross-device sync reliability across unstable networks.",
    metrics: ["50+", "99%↑", "X-plat"],
    skills: ["Swift", "Kotlin", "Firebase", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
  },
  {
    id: "06",
    code: "NRN.06",
    title: "Whiteboard AI",
    sector: "NEURAL",
    primarySkill: "PyTorch",
    year: "2025",
    image: "/images/whiteboardai.png",
    description: "Vision inference at 150-200ms latency with real-time CRDT collaboration for 5+ concurrent users.",
    metrics: ["150ms", "5+", "CRDT"],
    skills: ["PyTorch", "Vision", "WebSocket", "React"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "07",
    code: "NRN.07",
    title: "With",
    sector: "CORTEX",
    primarySkill: "llama.cpp",
    year: "2024–25",
    image: "/images/default_image.png",
    description: "Offline LLM chat with <50ms/token local inference. 2GB+ memory savings via quantization.",
    metrics: ["<50ms", "2GB↓", "Local"],
    skills: ["Swift", "llama.cpp", "GGUF", "SwiftUI"],
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "08",
    code: "NRN.08",
    title: "Portfolio Website",
    sector: "AXON",
    primarySkill: "Next.js",
    year: "2024–25",
    image: "/images/homepage.png",
    description: "40-60% faster load with brutalist design system and GSAP animations.",
    metrics: ["60%↑", "GSAP", "SSG"],
    skills: ["React", "Next.js", "Tailwind", "Vercel"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "09",
    code: "NRN.09",
    title: "Matcha Time",
    sector: "DENDRITE",
    primarySkill: "SwiftUI",
    year: "2024",
    image: "/images/matchatime_1.jpg",
    description: "Time zone coordination tool with 50 users at launch. 4-week idea-to-App Store cycle.",
    metrics: ["50", "4wk", "iOS"],
    skills: ["Swift", "SwiftUI", "App Store"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#" },
  },
  {
    id: "10",
    code: "NRN.10",
    title: "Schedule Mastermind",
    sector: "SYNAPSE",
    primarySkill: "Python Flask",
    year: "2023–24",
    image: "/images/schedule.jpg",
    description: "Scheduler for 500+ courses with real-time conflict detection. 70%+ fewer scheduling errors.",
    metrics: ["500+", "70%↓", "Flask"],
    skills: ["Python", "Flask", "scheduling"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "11",
    code: "NRN.11",
    title: "Shohei Home Ground",
    sector: "NEURAL",
    primarySkill: "Python",
    year: "2023",
    image: "/images/shoheihomeground_1.jpg",
    description: "Automated daily Instagram posting. 11K followers in 8 months, saving 2+ hours/day.",
    metrics: ["11K", "685", "2hr↓"],
    skills: ["Python", "automation", "Instagram"],
    links: { instagram: "#", youtube: "#" },
  },
  {
    id: "12",
    code: "NRN.12",
    title: "Poker Percentage",
    sector: "CORTEX",
    primarySkill: "WatchKit",
    year: "2022–24",
    image: "/images/poker.png",
    description: "WatchOS poker odds calculator with <10ms probability lookups via precomputed tables.",
    metrics: ["<10ms", "Watch", "Odds"],
    skills: ["Swift", "WatchOS", "probability"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
]

type Project = (typeof allProjects)[0]

// ─────────────────────────────────────────────────────────────
// NEURAL SVG PATTERN
// ─────────────────────────────────────────────────────────────

function NeuralPattern({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const elements = svgRef.current.querySelectorAll("circle, line, path")
    const ctx = gsap.context(() => {
      gsap.fromTo(
        elements,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.02,
          ease: "power2.out",
          scrollTrigger: {
            trigger: svgRef.current,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        }
      )
    }, svgRef.current)
    return () => ctx.revert()
  }, [])

  return (
    <svg
      ref={svgRef}
      className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Neural nodes */}
      <circle cx="10" cy="20" r="2" fill="currentColor" opacity="0.15" />
      <circle cx="90" cy="15" r="1.5" fill="currentColor" opacity="0.1" />
      <circle cx="85" cy="85" r="2" fill="currentColor" opacity="0.15" />
      <circle cx="15" cy="80" r="1.5" fill="currentColor" opacity="0.1" />
      <circle cx="50" cy="50" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      
      {/* Dendrite connections */}
      <line x1="10" y1="20" x2="50" y2="50" stroke="currentColor" strokeWidth="0.3" opacity="0.1" />
      <line x1="90" y1="15" x2="50" y2="50" stroke="currentColor" strokeWidth="0.3" opacity="0.1" />
      <line x1="85" y1="85" x2="50" y2="50" stroke="currentColor" strokeWidth="0.3" opacity="0.1" />
      <line x1="15" y1="80" x2="50" y2="50" stroke="currentColor" strokeWidth="0.3" opacity="0.1" />
      
      {/* Corner brackets - surgical precision */}
      <path d="M2 8 L2 2 L8 2" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
      <path d="M92 2 L98 2 L98 8" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
      <path d="M2 92 L2 98 L8 98" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
      <path d="M92 98 L98 98 L98 92" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT CARD - NEURAL DESIGN
// ─────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return
    const el = cardRef.current

    const ctx = gsap.context(() => {
      // Card entrance
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }
      )

      // Title scramble
      if (titleRef.current) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ∿●◎◉"
        const originalText = project.primarySkill.toUpperCase()
        let iteration = 0

        ScrollTrigger.create({
          trigger: titleRef.current,
          start: "top 90%",
          onEnter: () => {
            const interval = setInterval(() => {
              if (!titleRef.current) return clearInterval(interval)
              titleRef.current.textContent = originalText
                .split("")
                .map((char, i) => {
                  if (char === " " || char === "+") return char
                  if (i < iteration) return char
                  return chars[Math.floor(Math.random() * chars.length)]
                })
                .join("")
              if (iteration >= originalText.length) clearInterval(interval)
              iteration += 0.5
            }, 25)
          },
        })
      }

      // Image reveal
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.8,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: imageRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        )
      }

      // Stagger elements
      const items = el.querySelectorAll(".reveal")
      gsap.fromTo(
        items,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [project.primarySkill])

  const hasGithub = project.links.github
  const hasDemo = "demo" in project.links && (project.links as { demo?: string }).demo
  const hasAppStore = "appStore" in project.links
  const hasPlayStore = "playStore" in project.links

  return (
    <article
      ref={cardRef}
      className="relative group bg-background border border-foreground/80 overflow-hidden"
    >
      <NeuralPattern className="opacity-40" />

      {/* Mobile: Stack layout / Desktop: Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_140px]">
        
        {/* IMAGE SECTION */}
        <div className="relative h-48 sm:h-56 lg:h-auto lg:min-h-[200px] border-b lg:border-b-0 lg:border-r border-foreground/30 overflow-hidden">
          <div
            ref={imageRef}
            className="absolute inset-0 bg-muted"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover opacity-90 grayscale hover:grayscale-0 transition-all duration-500"
              loading="lazy"
            />
            {/* Scan line overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/5 to-transparent pointer-events-none" />
          </div>
          
          {/* Project ID overlay */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <span className="font-mono text-xl sm:text-2xl font-black text-background bg-foreground px-2 py-0.5">
              {project.id}
            </span>
          </div>
          
          {/* Sector badge */}
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
            <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.2em] text-foreground/80 bg-background/90 px-2 py-1 border border-foreground/30">
              {project.sector}
            </span>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="p-4 sm:p-5 flex flex-col justify-between">
          {/* Header */}
          <div>
            {/* Code + Year row */}
            <div className="reveal flex items-center justify-between gap-2 mb-2">
              <span className="font-mono text-[9px] sm:text-[10px] text-accent tracking-[0.15em]">
                {project.code}
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] text-foreground/50">
                {project.year}
              </span>
            </div>

            {/* Primary Skill - Main title */}
            <h3 className="mb-1">
              <span
                ref={titleRef}
                className="font-mono text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight leading-none block"
              >
                {project.primarySkill.toUpperCase()}
              </span>
            </h3>

            {/* Project name */}
            <p className="reveal font-mono text-xs sm:text-sm text-muted-foreground mb-3">
              {project.title}
            </p>

            {/* Description */}
            <p className="reveal text-xs sm:text-sm text-foreground/75 leading-relaxed mb-3 line-clamp-3 lg:line-clamp-none">
              {project.description}
            </p>
          </div>

          {/* Footer */}
          <div>
            {/* Skills */}
            <div className="reveal flex flex-wrap gap-1 sm:gap-1.5 mb-3">
              {project.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="font-mono text-[8px] sm:text-[9px] text-muted-foreground/80 border-b border-dotted border-foreground/20 pb-0.5"
                >
                  {skill}
                </span>
              ))}
              {project.skills.length > 4 && (
                <span className="font-mono text-[8px] sm:text-[9px] text-foreground/40">
                  +{project.skills.length - 4}
                </span>
              )}
            </div>

            {/* Links row - Mobile optimized */}
            <div className="reveal flex flex-wrap gap-2">
              {hasGithub && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target inline-flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-foreground hover:text-accent transition-colors min-h-[44px] px-2"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span className="underline underline-offset-2">SRC</span>
                </a>
              )}
              {hasDemo && (
                <a
                  href={(project.links as { demo?: string }).demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target inline-flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-foreground hover:text-accent transition-colors min-h-[44px] px-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="underline underline-offset-2">DEMO</span>
                </a>
              )}
              {hasAppStore && (
                <a
                  href={(project.links as { appStore?: string }).appStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target font-mono text-[9px] sm:text-[10px] text-foreground/60 hover:text-foreground transition-colors min-h-[44px] flex items-center px-2"
                >
                  iOS
                </a>
              )}
              {hasPlayStore && (
                <a
                  href={(project.links as { playStore?: string }).playStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target font-mono text-[9px] sm:text-[10px] text-foreground/60 hover:text-foreground transition-colors min-h-[44px] flex items-center px-2"
                >
                  Android
                </a>
              )}
            </div>
          </div>
        </div>

        {/* METRICS SIDEBAR - Desktop only */}
        <div className="hidden lg:flex flex-col justify-between p-4 border-l border-foreground/30 bg-foreground/[0.02]">
          {/* ASCII Neuron */}
          <pre className="font-mono text-[6px] text-foreground/20 leading-tight select-none">
            {ASCII_NEURON}
          </pre>

          {/* Metrics */}
          <div className="space-y-2">
            {project.metrics.map((m, i) => (
              <div key={i} className="text-right">
                <span className="font-mono text-lg font-black text-foreground block leading-none">
                  {m}
                </span>
                <span className="font-mono text-[7px] text-foreground/40 tracking-wider">
                  {["PERF", "SCALE", "TYPE"][i] || "STAT"}
                </span>
              </div>
            ))}
          </div>

          {/* Neural connection line */}
          <div className="font-mono text-[6px] text-foreground/20 text-center select-none">
            │<br/>●<br/>│
          </div>
        </div>

        {/* METRICS ROW - Mobile only */}
        <div className="lg:hidden border-t border-foreground/30 p-3 flex items-center justify-between bg-foreground/[0.02]">
          <div className="flex gap-3 sm:gap-4">
            {project.metrics.map((m, i) => (
              <div key={i} className="text-center">
                <span className="font-mono text-sm sm:text-base font-black text-foreground block leading-none">
                  {m}
                </span>
                <span className="font-mono text-[6px] sm:text-[7px] text-foreground/40 tracking-wider">
                  {["PERF", "SCALE", "TYPE"][i] || "STAT"}
                </span>
              </div>
            ))}
          </div>
          {/* Mini neural ASCII */}
          <span className="font-mono text-[8px] text-foreground/20 select-none">
            ◉─●─◉
          </span>
        </div>
      </div>
    </article>
  )
}

// ─────────────────────────────────────────────────────────────
// FILTER PANEL
// ─────────────────────────────────────────────────────────────

function FilterPanel({
  selectedGroups,
  onToggleGroup,
  onClearFilters,
  resultCount,
  totalCount,
}: {
  selectedGroups: SkillGroup[]
  onToggleGroup: (group: SkillGroup) => void
  onClearFilters: () => void
  resultCount: number
  totalCount: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        }
      )
    }, ref.current)
    return () => ctx.revert()
  }, [])

  const groups = Object.keys(SKILL_GROUPS) as SkillGroup[]

  return (
    <div ref={ref} className="mb-6 sm:mb-8">
      {/* Synapse line */}
      <div className="font-mono text-[8px] text-foreground/15 mb-3 overflow-hidden select-none hidden sm:block">
        {ASCII_SYNAPSE}
      </div>

      {/* Filter row - Scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        {groups.map((group) => {
          const isSelected = selectedGroups.includes(group)
          return (
            <button
              key={group}
              onClick={() => onToggleGroup(group)}
              className={cn(
                "touch-target flex-shrink-0 font-mono text-[10px] sm:text-xs px-3 sm:px-4 py-2 border transition-all duration-200 min-h-[44px]",
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/30 text-foreground/60 hover:border-foreground hover:text-foreground active:bg-foreground/10"
              )}
            >
              {group}
            </button>
          )
        })}

        {selectedGroups.length > 0 && (
          <button
            onClick={onClearFilters}
            className="touch-target flex-shrink-0 flex items-center gap-1 font-mono text-[10px] sm:text-xs text-foreground/50 hover:text-foreground px-2 transition-colors min-h-[44px]"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Result count */}
      <div className="flex items-center gap-2 mt-3 font-mono text-[9px] sm:text-[10px] text-foreground/40">
        <span className="text-foreground">{resultCount}</span>
        <span>/</span>
        <span>{totalCount}</span>
        <span className="hidden sm:inline ml-2">nodes active</span>
        {selectedGroups.length > 0 && (
          <span className="text-accent">●</span>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────

function SectionHeader({ count }: { count: number }) {
  const headerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const waveRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!headerRef.current) return
    const ctx = gsap.context(() => {
      // Title scramble
      if (titleRef.current) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ∿●◎"
        const originalText = "PROJECTS"
        let iteration = 0

        ScrollTrigger.create({
          trigger: titleRef.current,
          start: "top 92%",
          onEnter: () => {
            const interval = setInterval(() => {
              if (!titleRef.current) return clearInterval(interval)
              titleRef.current.textContent = originalText
                .split("")
                .map((char, i) => {
                  if (i < iteration) return char
                  return chars[Math.floor(Math.random() * chars.length)]
                })
                .join("")
              if (iteration >= originalText.length) clearInterval(interval)
              iteration += 0.4
            }, 35)
          },
        })
      }

      // Brain wave animation
      if (waveRef.current) {
        gsap.fromTo(
          waveRef.current,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: waveRef.current,
              start: "top 95%",
              toggleActions: "play none none none",
            },
          }
        )
      }
    }, headerRef.current)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={headerRef} className="mb-6 sm:mb-8 relative">
      {/* Brain wave pattern */}
      <div
        ref={waveRef}
        className="font-mono text-[8px] sm:text-[10px] text-foreground/15 mb-3 overflow-hidden select-none"
      >
        {ASCII_BRAIN_WAVE}
      </div>

      {/* Title row */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[8px] sm:text-[9px] text-foreground/40 tracking-[0.2em]">
              NEURAL.04
            </span>
            <span className="font-mono text-[10px] text-foreground/20">◉</span>
          </div>
          <h2
            ref={titleRef}
            className="font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tighter leading-none"
          >
            PROJECTS
          </h2>
        </div>
        <div className="text-right hidden sm:block">
          <span className="font-mono text-2xl sm:text-3xl lg:text-4xl font-black text-foreground/15 tabular-nums">
            {String(count).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Underline with neural nodes */}
      <div className="mt-3 flex items-center gap-2">
        <div className="h-0.5 sm:h-1 w-8 sm:w-12 bg-foreground" />
        <div className="h-px flex-1 bg-foreground/15" />
        <span className="font-mono text-[8px] text-foreground/20 select-none hidden sm:inline">
          ◉─◎─◉
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [selectedGroups, setSelectedGroups] = useState<SkillGroup[]>([])
  const [showAll, setShowAll] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const toggleGroup = useCallback((group: SkillGroup) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    )
  }, [])

  const clearFilters = useCallback(() => {
    setSelectedGroups([])
  }, [])

  const selectedSkills = useMemo(() => {
    if (selectedGroups.length === 0) return []
    return selectedGroups.flatMap((group) => SKILL_GROUPS[group])
  }, [selectedGroups])

  const filteredProjects = useMemo(() => {
    if (selectedSkills.length === 0) return allProjects
    return allProjects.filter((project) =>
      project.skills.some((skill) => selectedSkills.includes(skill))
    )
  }, [selectedSkills])

  const INITIAL_VISIBLE = 3
  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, INITIAL_VISIBLE)
  const remaining = filteredProjects.length - INITIAL_VISIBLE

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-10 sm:py-14 md:py-20 lg:py-24 px-4 sm:px-6 bg-background"
    >
      {/* Neural background grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="w-full h-full opacity-[0.015]" preserveAspectRatio="none">
          {/* Radial pattern like brain scan */}
          <defs>
            <pattern id="neural-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" />
              <line x1="0" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="0.5" />
              <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto relative">
        <SectionHeader count={allProjects.length} />

        <FilterPanel
          selectedGroups={selectedGroups}
          onToggleGroup={toggleGroup}
          onClearFilters={clearFilters}
          resultCount={filteredProjects.length}
          totalCount={allProjects.length}
        />

        {/* Projects */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 sm:py-16 border border-dashed border-foreground/20">
            <pre className="font-mono text-[8px] sm:text-[10px] text-foreground/30 mb-3 select-none">
              {ASCII_NEURON}
            </pre>
            <p className="font-mono text-xs text-foreground/40 mb-4">No neural pathways found</p>
            <button
              onClick={clearFilters}
              className="touch-target font-mono text-[10px] sm:text-xs border border-foreground/40 px-4 py-2 hover:bg-foreground hover:text-background transition-colors min-h-[44px]"
            >
              RESET
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {displayedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Load more */}
        {!showAll && remaining > 0 && (
          <div className="mt-6 sm:mt-8 flex flex-col items-center">
            {/* Neural pulse line */}
            <div className="font-mono text-[8px] text-foreground/15 mb-4 select-none hidden sm:block">
              {ASCII_NODES}
            </div>
            <button
              onClick={() => setShowAll(true)}
              className={cn(
                "touch-target w-full sm:w-auto group flex items-center justify-center gap-2",
                "px-6 sm:px-8 py-3 sm:py-4 min-h-[52px]",
                "font-mono text-xs sm:text-sm tracking-[0.1em]",
                "border border-foreground bg-foreground text-background",
                "hover:bg-background hover:text-foreground transition-colors",
                "active:scale-[0.98]"
              )}
            >
              <span>+{remaining} MORE</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* End marker */}
        {showAll && (
          <div className="mt-8 sm:mt-10 text-center">
            <div className="font-mono text-[8px] sm:text-[9px] text-foreground/15 mb-3 select-none">
              {ASCII_PULSE}
            </div>
            <a
              href="#contact"
              className="touch-target inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-foreground/40 hover:text-foreground transition-colors min-h-[44px]"
            >
              <span>↓</span>
              <span>NEXT SYNAPSE</span>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
