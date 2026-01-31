"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Github, X, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// ASCII NEURAL PATTERNS
// ─────────────────────────────────────────────────────────────

const ASCII_NEURON = `
    ●━━━●
   ╱│╲ ╱│╲
  ● ● ● ● ●
   ╲│╱ ╲│╱
    ●━━━●
`.trim()

const ASCII_SYNAPSE = `○──●──○──●──○──●──○──●──○──●──○──●──○`

const ASCII_NETWORK = `
┌─●─┬─●─┬─●─┐
│ ╲ │ ╱ │ ╲ │
●───●───●───●
│ ╱ │ ╲ │ ╱ │
└─●─┴─●─┴─●─┘
`.trim()

const ASCII_NODE = `[●]`

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
    code: "RF.2024.01",
    title: "Saboriendo Bakery Platform",
    category: "FULL-STACK",
    primarySkill: "React + SwiftUI",
    year: "2024",
    image: "/images/saboriendo.jpg",
    description: "Full-stack e-commerce using React 19, SwiftUI, Firebase. Real-time order processing, barcode verification, 11+ formats.",
    metrics: ["50%↑", "11+ formats", "3 lang"],
    skills: ["React 19", "SwiftUI", "Firebase", "Firestore", "AVFoundation"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "02",
    code: "RF.2025.02",
    title: "Zero Inbox",
    category: "AI/ML",
    primarySkill: "Swift + AI Engine",
    year: "2025",
    image: "/images/zeroinbox.jpg",
    description: "Swift/SwiftUI email client with AI reasoning engine. 90–95% classification accuracy, 100–300ms inference.",
    metrics: ["95% acc", "200ms", "50-200/min"],
    skills: ["Swift", "SwiftUI", "Firebase", "AI/ML", "Google APIs"],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
  },
  {
    id: "03",
    code: "RF.2025.03",
    title: "Research Lab Management",
    category: "SERVERLESS",
    primarySkill: "Cloud Functions",
    year: "2025",
    image: "/images/researchlab.jpg",
    description: "Serverless orchestration for dynamic AI routing across 30+ researchers. Sub-200ms response.",
    metrics: ["<200ms", "30+ users", "multi-lab"],
    skills: ["Cloud Functions", "Firebase", "AI routing", "Node.js"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "04",
    code: "RF.2025.04",
    title: "HTIC Shuttle",
    category: "REAL-TIME",
    primarySkill: "Firebase RTDB",
    year: "2025",
    image: "/images/schedule.jpg",
    description: "Live shuttle tracking for 25+ daily users. 70%+ reduction in duplicate pickups via event serialization.",
    metrics: ["25+ DAU", "70%↓", "<100ms"],
    skills: ["Swift", "Kotlin", "Firebase RTDB", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
  },
  {
    id: "05",
    code: "RF.2025.05",
    title: "CyberEdu",
    category: "CROSS-PLATFORM",
    primarySkill: "Swift + Kotlin",
    year: "2025",
    image: "/images/CyberEdu.png",
    description: "Synchronized iOS+Android apps for live event updates. 99%+ cross-device sync reliability.",
    metrics: ["50+ users", "99%↑", "iOS+Android"],
    skills: ["Swift", "Kotlin", "Firebase", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
  },
  {
    id: "06",
    code: "RF.2025.06",
    title: "Whiteboard AI",
    category: "VISION",
    primarySkill: "PyTorch + WebSocket",
    year: "2025",
    image: "/images/whiteboardai.png",
    description: "Transformer-based vision inference at 150–200ms latency; real-time CRDT-like collaboration.",
    metrics: ["150ms", "5+ users", "CRDT"],
    skills: ["PyTorch", "Vision", "WebSocket", "React"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "07",
    code: "RF.2024.07",
    title: "With",
    category: "LOCAL AI",
    primarySkill: "llama.cpp + Swift",
    year: "2024–25",
    image: "/images/with.jpg",
    description: "Offline-capable LLM chat using GGUF + llama.cpp, <50ms/token local inference. 2GB+ memory savings.",
    metrics: ["<50ms/tok", "2GB↓", "offline"],
    skills: ["Swift", "llama.cpp", "GGUF", "SwiftUI"],
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "08",
    code: "RF.2024.08",
    title: "Portfolio Website",
    category: "WEB",
    primarySkill: "Next.js + GSAP",
    year: "2024–25",
    image: "/images/homepage.png",
    description: "Client-side performance tuning: 40–60% faster load. Brutalist design system with GSAP animations.",
    metrics: ["40-60%↑", "modular", "Vercel"],
    skills: ["React", "Next.js", "Tailwind", "Vercel"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "09",
    code: "RF.2024.09",
    title: "Matcha Time",
    category: "iOS",
    primarySkill: "SwiftUI Native",
    year: "2024",
    image: "/images/matchatime_1.jpg",
    description: "Swift/SwiftUI time zone coordination tool; 50 users at launch. 4-week idea-to-launch cycle.",
    metrics: ["50 users", "4 weeks", "App Store"],
    skills: ["Swift", "SwiftUI", "App Store"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#" },
  },
  {
    id: "10",
    code: "RF.2023.10",
    title: "Schedule Mastermind",
    category: "BACKEND",
    primarySkill: "Python Flask",
    year: "2023–24",
    image: "/images/schedule.jpg",
    description: "Python Flask scheduler for 500+ courses with real-time conflict detection. 70%+ fewer errors.",
    metrics: ["500+ courses", "70%↓", "Flask"],
    skills: ["Python", "Flask", "scheduling"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "11",
    code: "RF.2023.11",
    title: "Shohei Home Ground",
    category: "AUTOMATION",
    primarySkill: "Python Scripts",
    year: "2023",
    image: "/images/shoheihomeground_1.jpg",
    description: "Automated daily Instagram posting (685 posts), 11K followers in 8 months. 2+ hours/day saved.",
    metrics: ["11K followers", "685 posts", "2hr/day↓"],
    skills: ["Python", "automation", "Instagram"],
    links: { instagram: "#", youtube: "#" },
  },
  {
    id: "12",
    code: "RF.2022.12",
    title: "Poker Percentage",
    category: "WATCHOS",
    primarySkill: "WatchKit + Swift",
    year: "2022–24",
    image: "/images/poker.png",
    description: "WatchOS poker odds calculator, <10ms probability lookups via precomputed tables.",
    metrics: ["<10ms", "WatchOS", "precomputed"],
    skills: ["Swift", "WatchOS", "probability"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
]

type Project = (typeof allProjects)[0]

// ─────────────────────────────────────────────────────────────
// NEURAL SVG BACKGROUND
// ─────────────────────────────────────────────────────────────

function NeuralBackground() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const nodes = svgRef.current.querySelectorAll(".neural-node")
    const lines = svgRef.current.querySelectorAll(".neural-line")

    const ctx = gsap.context(() => {
      // Animate lines
      gsap.fromTo(
        lines,
        { strokeDasharray: "0 1000", opacity: 0 },
        {
          strokeDasharray: "1000 0",
          opacity: 0.15,
          duration: 2,
          stagger: 0.1,
          ease: "power1.out",
        }
      )

      // Pulse nodes
      gsap.to(nodes, {
        scale: 1.2,
        opacity: 0.4,
        duration: 1.5,
        stagger: { each: 0.2, repeat: -1, yoyo: true },
        ease: "sine.inOut",
      })
    }, svgRef.current)

    return () => ctx.revert()
  }, [])

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Neural network lines */}
      <line className="neural-line" x1="10" y1="20" x2="30" y2="40" stroke="currentColor" strokeWidth="0.2" />
      <line className="neural-line" x1="30" y1="40" x2="50" y2="30" stroke="currentColor" strokeWidth="0.2" />
      <line className="neural-line" x1="50" y1="30" x2="70" y2="50" stroke="currentColor" strokeWidth="0.2" />
      <line className="neural-line" x1="70" y1="50" x2="90" y2="35" stroke="currentColor" strokeWidth="0.2" />
      <line className="neural-line" x1="20" y1="60" x2="40" y2="70" stroke="currentColor" strokeWidth="0.2" />
      <line className="neural-line" x1="40" y1="70" x2="60" y2="60" stroke="currentColor" strokeWidth="0.2" />
      <line className="neural-line" x1="60" y1="60" x2="80" y2="80" stroke="currentColor" strokeWidth="0.2" />
      <line className="neural-line" x1="30" y1="40" x2="40" y2="70" stroke="currentColor" strokeWidth="0.15" />
      <line className="neural-line" x1="50" y1="30" x2="60" y2="60" stroke="currentColor" strokeWidth="0.15" />
      <line className="neural-line" x1="70" y1="50" x2="80" y2="80" stroke="currentColor" strokeWidth="0.15" />

      {/* Neural nodes */}
      <circle className="neural-node" cx="10" cy="20" r="1" fill="currentColor" opacity="0.2" />
      <circle className="neural-node" cx="30" cy="40" r="1.5" fill="currentColor" opacity="0.3" />
      <circle className="neural-node" cx="50" cy="30" r="1" fill="currentColor" opacity="0.2" />
      <circle className="neural-node" cx="70" cy="50" r="1.5" fill="currentColor" opacity="0.3" />
      <circle className="neural-node" cx="90" cy="35" r="1" fill="currentColor" opacity="0.2" />
      <circle className="neural-node" cx="20" cy="60" r="1" fill="currentColor" opacity="0.2" />
      <circle className="neural-node" cx="40" cy="70" r="1.5" fill="currentColor" opacity="0.3" />
      <circle className="neural-node" cx="60" cy="60" r="1" fill="currentColor" opacity="0.2" />
      <circle className="neural-node" cx="80" cy="80" r="1.5" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// NODE CONNECTOR SVG
// ─────────────────────────────────────────────────────────────

function NodeConnector({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const paths = ref.current.querySelectorAll("path, line, circle")
    const ctx = gsap.context(() => {
      gsap.fromTo(
        paths,
        { strokeDasharray: "0 200", opacity: 0 },
        {
          strokeDasharray: "200 0",
          opacity: 1,
          duration: 0.8,
          stagger: 0.05,
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

  return (
    <svg
      ref={ref}
      className={cn("w-full h-4 sm:h-6", className)}
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
    >
      {/* Connection line with nodes */}
      <line x1="0" y1="12" x2="400" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.15" strokeDasharray="4 4" />
      <circle cx="50" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <circle cx="50" cy="12" r="1" fill="currentColor" opacity="0.4" />
      <circle cx="200" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <circle cx="200" cy="12" r="1.5" fill="currentColor" opacity="0.5" />
      <circle cx="350" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <circle cx="350" cy="12" r="1" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT NODE CARD
// ─────────────────────────────────────────────────────────────

function ProjectNode({ project, index }: { project: Project; index: number }) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    if (!nodeRef.current) return
    const el = nodeRef.current

    const ctx = gsap.context(() => {
      // Node entrance
      gsap.fromTo(
        el,
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
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
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789●○◐◑"
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

      // Stagger reveals
      const items = el.querySelectorAll(".node-reveal")
      gsap.fromTo(
        items,
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
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
      ref={nodeRef}
      className="relative group"
    >
      {/* Mobile: Stacked layout / Desktop: Side-by-side */}
      <div className={cn(
        "border-2 border-foreground bg-background",
        "shadow-[3px_3px_0_0_var(--foreground)]",
        "sm:shadow-[4px_4px_0_0_var(--foreground)]",
        "hover:shadow-[5px_5px_0_0_var(--foreground)]",
        "transition-shadow duration-200"
      )}>
        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
          
          {/* IMAGE SECTION */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full border-b lg:border-b-0 lg:border-r border-foreground/30 overflow-hidden bg-muted/30">
            {/* Node decoration */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
              <span className="font-mono text-[10px] sm:text-xs text-foreground/60 bg-background/90 px-1.5 py-0.5 border border-foreground/30">
                {ASCII_NODE} {project.id}
              </span>
            </div>

            {/* Image or placeholder */}
            {!imgError ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/50">
                <pre className="font-mono text-[8px] sm:text-[10px] text-foreground/30 select-none text-center leading-tight">
                  {ASCII_NEURON}
                </pre>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent lg:bg-gradient-to-r" />

            {/* Category badge - mobile bottom, desktop top-right */}
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 lg:bottom-auto lg:top-3 lg:left-auto lg:right-3">
              <span className="font-mono text-[9px] sm:text-[10px] text-background bg-foreground px-2 py-1">
                {project.category}
              </span>
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div className="p-3 sm:p-4 lg:p-5">
            {/* Header row */}
            <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
              <div className="flex-1 min-w-0">
                {/* Primary skill - MAIN TITLE */}
                <h3
                  ref={titleRef}
                  className="font-mono text-lg sm:text-xl lg:text-2xl font-black text-foreground tracking-tight leading-tight truncate"
                >
                  {project.primarySkill.toUpperCase()}
                </h3>
                {/* Project name */}
                <p className="node-reveal font-mono text-[11px] sm:text-xs text-muted-foreground mt-0.5 truncate">
                  {project.title}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <span className="font-mono text-lg sm:text-xl font-black text-foreground/20 tabular-nums">
                  {project.id}
                </span>
              </div>
            </div>

            {/* Metrics - horizontal scroll on mobile */}
            <div className="node-reveal flex gap-1.5 sm:gap-2 mb-2 sm:mb-3 overflow-x-auto scrollbar-hide pb-1">
              {project.metrics.map((m, i) => (
                <span
                  key={i}
                  className="flex-shrink-0 font-mono text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 border border-foreground/40 text-foreground bg-foreground/5"
                >
                  {m}
                </span>
              ))}
              <span className="flex-shrink-0 font-mono text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 text-muted-foreground">
                {project.year}
              </span>
            </div>

            {/* Description - clamped on mobile */}
            <p className="node-reveal text-[11px] sm:text-xs lg:text-sm text-foreground/75 leading-relaxed mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3 lg:line-clamp-none">
              {project.description}
            </p>

            {/* Skills - wrap */}
            <div className="node-reveal flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className="font-mono text-[8px] sm:text-[9px] text-muted-foreground/80 border-b border-dotted border-foreground/20 pb-px"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Links row */}
            <div className="node-reveal flex flex-wrap items-center gap-2 sm:gap-3">
              {hasGithub && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target inline-flex items-center gap-1 sm:gap-1.5 font-mono text-[10px] sm:text-xs text-foreground hover:text-accent transition-colors"
                >
                  <Github className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="border-b border-foreground/30">SRC</span>
                </a>
              )}
              {hasDemo && (
                <a
                  href={(project.links as { demo?: string }).demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target inline-flex items-center gap-1 sm:gap-1.5 font-mono text-[10px] sm:text-xs text-foreground hover:text-accent transition-colors"
                >
                  <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="border-b border-foreground/30">DEMO</span>
                </a>
              )}
              {hasAppStore && (
                <a
                  href={(project.links as { appStore?: string }).appStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target font-mono text-[9px] sm:text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  App Store →
                </a>
              )}
              {hasPlayStore && (
                <a
                  href={(project.links as { playStore?: string }).playStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target font-mono text-[9px] sm:text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Play Store →
                </a>
              )}

              {/* Code identifier */}
              <span className="ml-auto font-mono text-[8px] sm:text-[9px] text-foreground/30 hidden sm:block">
                {project.code}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

// ─────────────────────────────────────────────────────────────
// FILTER NODES
// ─────────────────────────────────────────────────────────────

function FilterNodes({
  selectedGroups,
  onToggleGroup,
  onClear,
  resultCount,
  totalCount,
}: {
  selectedGroups: SkillGroup[]
  onToggleGroup: (group: SkillGroup) => void
  onClear: () => void
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
          duration: 0.4,
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
    <div ref={ref} className="mb-4 sm:mb-6">
      {/* Filter row - horizontal scroll on mobile */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
        {groups.map((group) => {
          const isSelected = selectedGroups.includes(group)
          return (
            <button
              key={group}
              onClick={() => onToggleGroup(group)}
              className={cn(
                "touch-target flex-shrink-0",
                "font-mono text-[10px] sm:text-xs",
                "px-2.5 sm:px-3 py-1.5 sm:py-2",
                "border-2 transition-all duration-150",
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/30 text-foreground/60 hover:border-foreground hover:text-foreground"
              )}
            >
              <span className="mr-1 opacity-60">●</span>
              {group}
            </button>
          )
        })}

        {selectedGroups.length > 0 && (
          <button
            onClick={onClear}
            className="touch-target flex-shrink-0 flex items-center gap-1 font-mono text-[10px] sm:text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Count */}
      <div className="flex items-center gap-2 mt-2 font-mono text-[9px] sm:text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-accent rounded-full" />
          {resultCount}
        </span>
        <span className="text-foreground/20">/</span>
        <span>{totalCount}</span>
        <span className="text-foreground/30">nodes</span>
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
  const networkRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    if (!headerRef.current) return
    const ctx = gsap.context(() => {
      // Network ASCII animation
      if (networkRef.current) {
        gsap.fromTo(
          networkRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: networkRef.current,
              start: "top 95%",
              toggleActions: "play none none none",
            },
          }
        )
      }

      // Title scramble
      if (titleRef.current) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ●○◐◑"
        const originalText = "PROJECTS"
        let iteration = 0

        ScrollTrigger.create({
          trigger: titleRef.current,
          start: "top 95%",
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
              iteration += 0.35
            }, 35)
          },
        })
      }
    }, headerRef.current)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={headerRef} className="mb-5 sm:mb-8">
      {/* ASCII Network - Desktop only */}
      <pre
        ref={networkRef}
        className="font-mono text-[7px] sm:text-[8px] text-foreground/20 select-none mb-3 hidden sm:block leading-tight"
      >
        {ASCII_NETWORK}
      </pre>

      {/* Title row */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground tracking-wider">
              04
            </span>
            <span className="font-mono text-[8px] sm:text-[9px] text-foreground/30">
              {ASCII_SYNAPSE.slice(0, 15)}
            </span>
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

      {/* Underline */}
      <div className="mt-2 sm:mt-3 flex items-center gap-2">
        <div className="h-0.5 sm:h-1 w-8 sm:w-12 bg-foreground" />
        <div className="h-px flex-1 bg-foreground/15" />
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full" />
          <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full" />
          <span className="w-1.5 h-1.5 bg-foreground/10 rounded-full" />
        </div>
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
      className={cn(
        "relative py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6",
        "bg-background overflow-hidden"
      )}
    >
      {/* Neural background */}
      <NeuralBackground />

      <div className="max-w-5xl mx-auto relative">
        <SectionHeader count={allProjects.length} />

        <FilterNodes
          selectedGroups={selectedGroups}
          onToggleGroup={toggleGroup}
          onClear={clearFilters}
          resultCount={filteredProjects.length}
          totalCount={allProjects.length}
        />

        {/* Projects */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-8 sm:py-12 border border-dashed border-foreground/20">
            <pre className="font-mono text-[9px] sm:text-[10px] text-foreground/30 mb-3 select-none">
              {ASCII_NEURON}
            </pre>
            <p className="font-mono text-[10px] sm:text-xs text-muted-foreground mb-3">
              No matching nodes
            </p>
            <button
              onClick={clearFilters}
              className="font-mono text-[10px] sm:text-xs border border-foreground/50 px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors"
            >
              RESET
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {displayedProjects.map((project, index) => (
              <div key={project.id}>
                <ProjectNode project={project} index={index} />
                {/* Connector between nodes */}
                {index < displayedProjects.length - 1 && (
                  <NodeConnector className="my-2 sm:my-3 opacity-30" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load more */}
        {!showAll && remaining > 0 && (
          <div className="mt-6 sm:mt-8 flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className={cn(
                "touch-target group flex items-center gap-2",
                "px-4 sm:px-6 py-2.5 sm:py-3",
                "font-mono text-[10px] sm:text-xs tracking-wider",
                "border-2 border-foreground bg-foreground text-background",
                "hover:bg-background hover:text-foreground transition-colors",
                "shadow-[2px_2px_0_0_var(--foreground)]",
                "sm:shadow-[3px_3px_0_0_var(--foreground)]"
              )}
            >
              <span className="opacity-60">●</span>
              <span>+{remaining} NODES</span>
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        )}

        {/* End marker */}
        {showAll && (
          <div className="mt-8 sm:mt-10 text-center">
            <pre className="font-mono text-[7px] sm:text-[8px] text-foreground/15 select-none mb-3">
              {`○──●──○──●──○──●──○`}
            </pre>
            <a
              href="#contact"
              className="touch-target inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="w-3 h-3" />
              <span>NEXT</span>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
