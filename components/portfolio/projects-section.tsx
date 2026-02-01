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
    ╭───╮
   ╱     ╲
──●       ●──
   ╲     ╱
    ╰───╯
`.trim()

const ASCII_SYNAPSE = `──●──○──●──`

const ASCII_BRAIN_SCAN = `
┌─────────────────────────────────────┐
│  ▓▓░░▓▓░░▓▓░░▓▓░░▓▓░░▓▓░░▓▓░░▓▓░░  │
│  ░░▓▓░░▓▓░░▓▓░░▓▓░░▓▓░░▓▓░░▓▓░░▓▓  │
│  ▓▓░░▓▓░░▓▓░░▓▓░░▓▓░░▓▓░░▓▓░░▓▓░░  │
└─────────────────────────────────────┘
`.trim()

const ASCII_PULSE = `─╮╭─╮╭─╮╭─╮╭─╮╭─`

const ASCII_NODE = `◉`

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
// PROJECT DATA - Focus on Growth & Learning
// ─────────────────────────────────────────────────────────────

const allProjects = [
  {
    id: "01",
    code: "NODE.01",
    title: "Saboriendo Bakery",
    domain: "FULL-STACK",
    year: "2024",
    image: "/images/default_image.png",
    growth: {
      learned: "Real-time sync architecture",
      improved: "Barcode systems, multi-language support",
      unlocked: "E-commerce at scale",
    },
    metrics: { primary: "50%", label: "faster lookup", secondary: "11+ barcode formats" },
    skills: ["React 19", "SwiftUI", "Firebase", "Firestore", "AVFoundation"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "02",
    code: "NODE.02",
    title: "Zero Inbox",
    domain: "AI/ML",
    year: "2025",
    image: "/images/default_image.png",
    growth: {
      learned: "AI reasoning engine design",
      improved: "Classification pipelines, inference optimization",
      unlocked: "Multi-stage decision systems",
    },
    metrics: { primary: "95%", label: "accuracy", secondary: "200ms latency" },
    skills: ["Swift", "SwiftUI", "Firebase", "AI/ML", "Google APIs"],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
  },
  {
    id: "03",
    code: "NODE.03",
    title: "Research Lab Platform",
    domain: "SERVERLESS",
    year: "2025",
    image: "/images/default_image.png",
    growth: {
      learned: "Serverless orchestration patterns",
      improved: "Dynamic AI routing, metadata prompting",
      unlocked: "Multi-lab workflow automation",
    },
    metrics: { primary: "<200ms", label: "response", secondary: "30+ researchers" },
    skills: ["Cloud Functions", "Firebase", "AI routing", "Node.js"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "04",
    code: "NODE.04",
    title: "HTIC Shuttle",
    domain: "REAL-TIME",
    year: "2025",
    image: "/images/schedule.jpg",
    growth: {
      learned: "Event serialization & state validation",
      improved: "Cross-platform real-time sync",
      unlocked: "Conflict-free distributed systems",
    },
    metrics: { primary: "70%", label: "fewer conflicts", secondary: "<100ms sync" },
    skills: ["Swift", "Kotlin", "Firebase RTDB", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
  },
  {
    id: "05",
    code: "NODE.05",
    title: "CyberEdu",
    domain: "CROSS-PLATFORM",
    year: "2025",
    image: "/images/CyberEdu.png",
    growth: {
      learned: "Cross-device sync reliability",
      improved: "Network resilience patterns",
      unlocked: "99%+ sync across unstable networks",
    },
    metrics: { primary: "99%", label: "sync rate", secondary: "50+ users" },
    skills: ["Swift", "Kotlin", "Firebase", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
  },
  {
    id: "06",
    code: "NODE.06",
    title: "Whiteboard AI",
    domain: "VISION",
    year: "2025",
    image: "/images/whiteboardai.png",
    growth: {
      learned: "Transformer-based vision inference",
      improved: "CRDT collaboration, WebSocket pipelines",
      unlocked: "Real-time multi-user AI canvas",
    },
    metrics: { primary: "150ms", label: "inference", secondary: "5+ concurrent" },
    skills: ["PyTorch", "Vision", "WebSocket", "React"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "07",
    code: "NODE.07",
    title: "With",
    domain: "LOCAL AI",
    year: "2024–25",
    image: "/images/default_image.png",
    growth: {
      learned: "Local LLM deployment with llama.cpp",
      improved: "Memory optimization, quantization",
      unlocked: "Offline AI capabilities",
    },
    metrics: { primary: "<50ms", label: "per token", secondary: "2GB+ saved" },
    skills: ["Swift", "llama.cpp", "GGUF", "SwiftUI"],
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "08",
    code: "NODE.08",
    title: "Portfolio",
    domain: "WEB",
    year: "2024–25",
    image: "/images/homepage.png",
    growth: {
      learned: "Advanced GSAP animation systems",
      improved: "Performance optimization, modular architecture",
      unlocked: "Brutalist design systems",
    },
    metrics: { primary: "60%", label: "faster load", secondary: "modular" },
    skills: ["React", "Next.js", "Tailwind", "Vercel"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "09",
    code: "NODE.09",
    title: "Matcha Time",
    domain: "iOS",
    year: "2024",
    image: "/images/matchatime_1.jpg",
    growth: {
      learned: "Rapid prototyping to App Store",
      improved: "SwiftUI patterns, time zone logic",
      unlocked: "4-week launch cycle",
    },
    metrics: { primary: "50", label: "users", secondary: "App Store" },
    skills: ["Swift", "SwiftUI", "App Store"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#" },
  },
  {
    id: "10",
    code: "NODE.10",
    title: "Schedule Mastermind",
    domain: "BACKEND",
    year: "2023–24",
    image: "/images/schedule.jpg",
    growth: {
      learned: "Conflict detection algorithms",
      improved: "Flask API design, scheduling logic",
      unlocked: "500+ course management",
    },
    metrics: { primary: "70%", label: "fewer errors", secondary: "500+ courses" },
    skills: ["Python", "Flask", "scheduling"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "11",
    code: "NODE.11",
    title: "Shohei Home Ground",
    domain: "AUTOMATION",
    year: "2023",
    image: "/images/shoheihomeground_1.jpg",
    growth: {
      learned: "Content automation at scale",
      improved: "Python scripting, API integration",
      unlocked: "11K organic growth",
    },
    metrics: { primary: "11K", label: "followers", secondary: "685 posts" },
    skills: ["Python", "automation", "Instagram"],
    links: { instagram: "#", youtube: "#" },
  },
  {
    id: "12",
    code: "NODE.12",
    title: "Poker Percentage",
    domain: "WATCHOS",
    year: "2022–24",
    image: "/images/poker.png",
    growth: {
      learned: "WatchOS development",
      improved: "Precomputed tables, probability math",
      unlocked: "Sub-10ms calculations",
    },
    metrics: { primary: "<10ms", label: "lookup", secondary: "WatchOS" },
    skills: ["Swift", "WatchOS", "probability"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
]

type Project = (typeof allProjects)[0]

// ─────────────────────────────────────────────────────────────
// NEURAL CONNECTION SVG
// ─────────────────────────────────────────────────────────────

function NeuralConnections({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const paths = svgRef.current.querySelectorAll("path, circle, line")
    const ctx = gsap.context(() => {
      gsap.fromTo(
        paths,
        { strokeDasharray: "0 1000", opacity: 0 },
        {
          strokeDasharray: "1000 0",
          opacity: 1,
          duration: 2,
          stagger: 0.05,
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
      preserveAspectRatio="none"
    >
      {/* Neural dendrites */}
      <path d="M0 50 Q25 30 50 50 T100 50" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
      <path d="M0 30 Q30 50 60 30 T100 40" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.1" />
      <path d="M0 70 Q40 50 70 70 T100 60" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.1" />
      
      {/* Synaptic nodes */}
      <circle cx="25" cy="40" r="1" fill="currentColor" opacity="0.2" />
      <circle cx="50" cy="50" r="1.5" fill="currentColor" opacity="0.25" />
      <circle cx="75" cy="45" r="1" fill="currentColor" opacity="0.2" />
      <circle cx="15" cy="60" r="0.8" fill="currentColor" opacity="0.15" />
      <circle cx="85" cy="55" r="0.8" fill="currentColor" opacity="0.15" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// NODE MARKER COMPONENT
// ─────────────────────────────────────────────────────────────

function NodeMarker({ id, active = false }: { id: string; active?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-1.5 sm:gap-2",
      active ? "text-accent" : "text-foreground/40"
    )}>
      <span className="text-lg sm:text-xl">{ASCII_NODE}</span>
      <span className="font-mono text-[10px] sm:text-xs tracking-wider">{id}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT NODE CARD - Mobile First
// ─────────────────────────────────────────────────────────────

function ProjectNode({ project, index }: { project: Project; index: number }) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const learnedRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!nodeRef.current) return
    const el = nodeRef.current

    const ctx = gsap.context(() => {
      // Card entrance
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

      // Learned text scramble
      if (learnedRef.current) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ░▒▓"
        const originalText = project.growth.learned
        let iteration = 0

        ScrollTrigger.create({
          trigger: learnedRef.current,
          start: "top 90%",
          onEnter: () => {
            const interval = setInterval(() => {
              if (!learnedRef.current) return clearInterval(interval)
              learnedRef.current.textContent = originalText
                .split("")
                .map((char, i) => {
                  if (char === " " || char === "-") return char
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
  }, [project.growth.learned])

  const hasGithub = project.links.github
  const hasDemo = "demo" in project.links && (project.links as { demo?: string }).demo

  return (
    <article
      ref={nodeRef}
      className={cn(
        "relative",
        "bg-background border border-foreground",
        "shadow-[2px_2px_0_0_var(--foreground)] sm:shadow-[3px_3px_0_0_var(--foreground)]",
        "active:shadow-[1px_1px_0_0_var(--foreground)]",
        "transition-shadow duration-150"
      )}
    >
      <NeuralConnections className="opacity-40" />

      {/* Mobile-first stacked layout */}
      <div className="flex flex-col">
        
        {/* Header: Node ID + Domain + Year */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-dashed border-foreground/20">
          <div className="flex items-center gap-2 sm:gap-3">
            <NodeMarker id={project.code} active />
            <span className="font-mono text-[9px] sm:text-[10px] text-accent tracking-[0.15em] font-medium">
              {project.domain}
            </span>
          </div>
          <span className="font-mono text-[10px] sm:text-xs text-muted-foreground">
            {project.year}
          </span>
        </div>

        {/* Image + Title block */}
        <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 border-b border-dashed border-foreground/20">
          {/* Image placeholder */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 border border-foreground/30 bg-foreground/5 overflow-hidden">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          {/* Title + Primary metric */}
          <div className="flex-1 min-w-0">
            <h3 className="reveal font-mono text-base sm:text-lg md:text-xl font-black text-foreground leading-tight mb-1 truncate">
              {project.title}
            </h3>
            <div className="reveal flex items-baseline gap-1.5">
              <span className="font-mono text-2xl sm:text-3xl font-black text-accent leading-none">
                {project.metrics.primary}
              </span>
              <span className="font-mono text-[10px] sm:text-xs text-muted-foreground">
                {project.metrics.label}
              </span>
            </div>
            <p className="reveal font-mono text-[9px] sm:text-[10px] text-foreground/50 mt-1">
              {project.metrics.secondary}
            </p>
          </div>
        </div>

        {/* Growth section - THE CORE FOCUS */}
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 border-b border-dashed border-foreground/20">
          {/* Learned */}
          <div className="reveal">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[8px] sm:text-[9px] text-foreground/40 tracking-[0.2em]">
                LEARNED
              </span>
              <div className="flex-1 h-px bg-foreground/10" />
            </div>
            <p className="font-mono text-xs sm:text-sm text-foreground font-medium leading-relaxed">
              <span ref={learnedRef}>{project.growth.learned}</span>
            </p>
          </div>

          {/* Improved */}
          <div className="reveal">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[8px] sm:text-[9px] text-foreground/40 tracking-[0.2em]">
                IMPROVED
              </span>
              <div className="flex-1 h-px bg-foreground/10" />
            </div>
            <p className="font-mono text-[11px] sm:text-xs text-foreground/70 leading-relaxed">
              {project.growth.improved}
            </p>
          </div>

          {/* Unlocked */}
          <div className="reveal">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[8px] sm:text-[9px] text-accent/70 tracking-[0.2em]">
                UNLOCKED
              </span>
              <div className="flex-1 h-px bg-accent/20" />
            </div>
            <p className="font-mono text-[11px] sm:text-xs text-accent/90 leading-relaxed">
              {project.growth.unlocked}
            </p>
          </div>
        </div>

        {/* Skills + Links */}
        <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          {/* Skills */}
          <div className="reveal flex flex-wrap gap-1.5">
            {project.skills.map((skill) => (
              <span
                key={skill}
                className="font-mono text-[8px] sm:text-[9px] text-muted-foreground px-1.5 py-0.5 border border-foreground/20"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="reveal flex items-center gap-3 sm:gap-4">
            {hasGithub && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-foreground/70 hover:text-foreground transition-colors"
              >
                <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">SOURCE</span>
              </a>
            )}
            {hasDemo && (
              <a
                href={(project.links as { demo?: string }).demo}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-foreground/70 hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">DEMO</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

// ─────────────────────────────────────────────────────────────
// FILTER COMPONENT - Mobile Optimized
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
        { opacity: 0, y: -15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 98%",
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
      {/* Scrollable filter row on mobile */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {groups.map((group) => {
          const isSelected = selectedGroups.includes(group)
          return (
            <button
              key={group}
              onClick={() => onToggleGroup(group)}
              className={cn(
                "touch-target flex-shrink-0 font-mono text-[10px] sm:text-xs px-2.5 sm:px-3 py-1.5 border transition-all duration-150",
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/30 text-foreground/60 active:bg-foreground/10"
              )}
            >
              {group}
            </button>
          )
        })}

        {selectedGroups.length > 0 && (
          <button
            onClick={onClearFilters}
            className="touch-target flex-shrink-0 flex items-center gap-1 font-mono text-[10px] sm:text-xs text-muted-foreground px-2 py-1"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Result count */}
      <div className="flex items-center gap-1.5 mt-2 font-mono text-[9px] sm:text-[10px] text-foreground/40">
        <span className="font-medium text-foreground/60">{resultCount}</span>
        <span>/</span>
        <span>{totalCount}</span>
        <span className="ml-1">nodes</span>
        {selectedGroups.length > 0 && <span className="text-accent ml-1">●</span>}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION HEADER - Mobile Optimized
// ─────────────────────────────────────────────────────────────

function SectionHeader({ count }: { count: number }) {
  const headerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const asciiRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    if (!headerRef.current) return
    const ctx = gsap.context(() => {
      // ASCII scan animation
      if (asciiRef.current) {
        gsap.fromTo(
          asciiRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: asciiRef.current,
              start: "top 95%",
              toggleActions: "play none none none",
            },
          }
        )
      }

      // Title scramble
      if (titleRef.current) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ░▒▓█"
        const originalText = "NEURAL MAP"
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
                  if (char === " ") return " "
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
      {/* ASCII brain scan */}
      <pre
        ref={asciiRef}
        className="font-mono text-[6px] sm:text-[8px] text-foreground/15 overflow-hidden whitespace-pre select-none mb-3 sm:mb-4 leading-tight"
      >
        {ASCII_BRAIN_SCAN}
      </pre>

      {/* Header row */}
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[8px] sm:text-[9px] text-muted-foreground tracking-[0.2em]">
              — PROJECTS
            </span>
            <span className="font-mono text-[10px] sm:text-xs text-foreground/20">
              {ASCII_SYNAPSE}
            </span>
          </div>
          <h2
            ref={titleRef}
            className="font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-none"
          >
            NEURAL MAP
          </h2>
        </div>
        
        {/* Node count */}
        <div className="flex flex-col items-end flex-shrink-0">
          <span className="font-mono text-2xl sm:text-3xl md:text-4xl font-black text-foreground/15 tabular-nums leading-none">
            {String(count).padStart(2, "0")}
          </span>
          <span className="font-mono text-[8px] sm:text-[9px] text-foreground/30 tracking-wider mt-0.5">
            NODES
          </span>
        </div>
      </div>

      {/* Pulse line */}
      <div className="mt-3 sm:mt-4 flex items-center gap-2">
        <div className="h-0.5 sm:h-1 w-8 sm:w-12 bg-foreground" />
        <span className="font-mono text-[8px] sm:text-[10px] text-foreground/20 tracking-widest overflow-hidden">
          {ASCII_PULSE}
        </span>
        <div className="h-px flex-1 bg-foreground/15" />
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
        "bg-background"
      )}
    >
      {/* Subtle neural background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="w-full h-full opacity-[0.015]" preserveAspectRatio="none">
          {/* Neural web pattern */}
          {[...Array(8)].map((_, i) => (
            <path
              key={i}
              d={`M0 ${12 + i * 12} Q${25 + i * 5} ${8 + i * 8} 50 ${12 + i * 12} T100 ${10 + i * 10}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <SectionHeader count={allProjects.length} />

        <FilterPanel
          selectedGroups={selectedGroups}
          onToggleGroup={toggleGroup}
          onClearFilters={clearFilters}
          resultCount={filteredProjects.length}
          totalCount={allProjects.length}
        />

        {/* ASCII connection indicator */}
        <div className="font-mono text-[8px] sm:text-[10px] text-foreground/15 mb-4 sm:mb-6 overflow-hidden select-none">
          {ASCII_SYNAPSE}{ASCII_SYNAPSE}{ASCII_SYNAPSE}
        </div>

        {/* Projects grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-10 sm:py-12 border border-dashed border-foreground/15">
            <pre className="font-mono text-[9px] sm:text-[10px] text-foreground/25 mb-3">
              {ASCII_NEURON}
            </pre>
            <p className="font-mono text-[10px] sm:text-xs text-muted-foreground mb-3">
              No matching nodes
            </p>
            <button
              onClick={clearFilters}
              className="font-mono text-[10px] sm:text-xs border border-foreground/40 px-3 py-1.5 active:bg-foreground active:text-background transition-colors"
            >
              RESET
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {displayedProjects.map((project, index) => (
              <ProjectNode key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        {/* Load more */}
        {!showAll && remaining > 0 && (
          <div className="mt-6 sm:mt-8 flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className={cn(
                "touch-target flex items-center gap-2",
                "px-4 sm:px-6 py-2.5 sm:py-3",
                "font-mono text-[10px] sm:text-xs tracking-wider",
                "border border-foreground bg-foreground text-background",
                "active:bg-background active:text-foreground transition-colors",
                "shadow-[2px_2px_0_0_var(--foreground)]"
              )}
            >
              <span>+{remaining} NODES</span>
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        )}

        {/* End marker */}
        {showAll && (
          <div className="mt-8 sm:mt-10 text-center">
            <pre className="font-mono text-[7px] sm:text-[8px] text-foreground/15 select-none mb-3">
              {ASCII_NEURON}
            </pre>
            <a
              href="#contact"
              className="touch-target inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-muted-foreground"
            >
              <span>↓</span>
              <span>NEXT</span>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
