"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Github, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// ASCII PATTERNS
// ─────────────────────────────────────────────────────────────

const ASCII_SYNAPSE = `──●──○──●──`
const ASCII_PULSE = `─╮╭─╮╭─╮╭─╮╭─`
const ASCII_NODE = `◉`

const ASCII_NEURON_SMALL = `
  ╭─╮
 ─●─●─
  ╰─╯
`.trim()

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
// ANIMATED NEURAL BACKGROUND
// ─────────────────────────────────────────────────────────────

function AnimatedNeuralBackground() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const paths = svgRef.current.querySelectorAll(".neural-path")
    const nodes = svgRef.current.querySelectorAll(".neural-node")

    const ctx = gsap.context(() => {
      // Animate paths with flowing effect
      paths.forEach((path, i) => {
        gsap.to(path, {
          strokeDashoffset: -200,
          duration: 8 + i * 2,
          ease: "none",
          repeat: -1,
        })
      })

      // Pulse nodes
      nodes.forEach((node, i) => {
        gsap.to(node, {
          opacity: 0.15,
          scale: 1.5,
          duration: 2 + i * 0.5,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.3,
        })
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
      {/* Neural paths */}
      <path
        className="neural-path"
        d="M-10 20 Q20 10 40 25 T80 20 T120 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.15"
        strokeDasharray="4 8"
        opacity="0.06"
      />
      <path
        className="neural-path"
        d="M-10 50 Q30 35 50 50 T90 45 T120 55"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.2"
        strokeDasharray="6 10"
        opacity="0.05"
      />
      <path
        className="neural-path"
        d="M-10 80 Q25 70 45 80 T85 75 T120 85"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.15"
        strokeDasharray="4 8"
        opacity="0.06"
      />
      <path
        className="neural-path"
        d="M20 -10 Q15 30 25 50 T20 90 T30 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.1"
        strokeDasharray="3 6"
        opacity="0.04"
      />
      <path
        className="neural-path"
        d="M70 -10 Q75 25 65 50 T75 85 T70 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.1"
        strokeDasharray="3 6"
        opacity="0.04"
      />

      {/* Neural nodes */}
      <circle className="neural-node" cx="25" cy="25" r="0.8" fill="currentColor" opacity="0.08" />
      <circle className="neural-node" cx="50" cy="50" r="1" fill="currentColor" opacity="0.1" />
      <circle className="neural-node" cx="75" cy="30" r="0.6" fill="currentColor" opacity="0.06" />
      <circle className="neural-node" cx="40" cy="75" r="0.7" fill="currentColor" opacity="0.07" />
      <circle className="neural-node" cx="80" cy="70" r="0.5" fill="currentColor" opacity="0.05" />
      <circle className="neural-node" cx="15" cy="60" r="0.6" fill="currentColor" opacity="0.06" />
      <circle className="neural-node" cx="60" cy="15" r="0.5" fill="currentColor" opacity="0.05" />
      <circle className="neural-node" cx="85" cy="50" r="0.4" fill="currentColor" opacity="0.04" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// SINGLE PROJECT VIEW - Full Focus
// ─────────────────────────────────────────────────────────────

function ProjectView({ project, isActive }: { project: Project; isActive: boolean }) {
  const viewRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const learnedRef = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!viewRef.current || !isActive || hasAnimated.current) return
    hasAnimated.current = true

    const ctx = gsap.context(() => {
      // Stagger reveal all content
      const items = viewRef.current?.querySelectorAll(".reveal")
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          }
        )
      }

      // Scramble learned text
      if (learnedRef.current) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ░▒▓"
        const originalText = project.growth.learned
        let iteration = 0

        const interval = setInterval(() => {
          if (!learnedRef.current) return clearInterval(interval)
          learnedRef.current.textContent = originalText
            .split("")
            .map((char, i) => {
              if (char === " " || char === "-" || char === "&") return char
              if (i < iteration) return char
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join("")
          if (iteration >= originalText.length) clearInterval(interval)
          iteration += 0.6
        }, 25)
      }
    }, viewRef.current)

    return () => ctx.revert()
  }, [isActive, project.growth.learned])

  // Reset animation flag when becoming inactive
  useEffect(() => {
    if (!isActive) {
      hasAnimated.current = false
    }
  }, [isActive])

  const hasGithub = project.links.github
  const hasDemo = "demo" in project.links && (project.links as { demo?: string }).demo

  return (
    <div
      ref={viewRef}
      className={cn(
        "w-full flex-shrink-0 snap-center",
        "px-3 sm:px-4 md:px-6"
      )}
    >
      <div
        ref={contentRef}
        className={cn(
          "max-w-3xl mx-auto",
          "border border-foreground/60",
          "bg-background/95 backdrop-blur-sm",
          "shadow-[3px_3px_0_0_var(--foreground)]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-foreground/20">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-base sm:text-lg text-accent">{ASCII_NODE}</span>
            <span className="reveal font-mono text-[10px] sm:text-xs text-foreground/60 tracking-wider">
              {project.code}
            </span>
            <span className="reveal font-mono text-[10px] sm:text-xs text-accent tracking-[0.15em] font-medium">
              {project.domain}
            </span>
          </div>
          <span className="reveal font-mono text-[10px] sm:text-xs text-foreground/40">
            {project.year}
          </span>
        </div>

        {/* Main content */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* Title + Image row */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Image */}
            <div className="reveal w-full sm:w-32 md:w-40 h-32 sm:h-32 md:h-40 flex-shrink-0 border border-foreground/30 bg-foreground/5 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Title + Metric */}
            <div className="flex-1">
              <h3 className="reveal font-mono text-xl sm:text-2xl md:text-3xl font-black text-foreground leading-tight mb-3">
                {project.title}
              </h3>
              <div className="reveal flex items-baseline gap-2">
                <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-black text-accent leading-none">
                  {project.metrics.primary}
                </span>
                <span className="font-mono text-sm sm:text-base text-foreground/60">
                  {project.metrics.label}
                </span>
              </div>
              <p className="reveal font-mono text-[10px] sm:text-xs text-foreground/40 mt-2">
                {project.metrics.secondary}
              </p>
            </div>
          </div>

          {/* Growth sections */}
          <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            {/* Learned - Main focus */}
            <div className="reveal">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[9px] sm:text-[10px] text-foreground/50 tracking-[0.2em]">
                  LEARNED
                </span>
                <div className="flex-1 h-px bg-foreground/10" />
              </div>
              <p className="font-mono text-base sm:text-lg md:text-xl text-foreground font-medium leading-relaxed">
                <span ref={learnedRef}>{project.growth.learned}</span>
              </p>
            </div>

            {/* Improved */}
            <div className="reveal">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[9px] sm:text-[10px] text-foreground/50 tracking-[0.2em]">
                  IMPROVED
                </span>
                <div className="flex-1 h-px bg-foreground/10" />
              </div>
              <p className="font-mono text-sm sm:text-base text-foreground/70 leading-relaxed">
                {project.growth.improved}
              </p>
            </div>

            {/* Unlocked */}
            <div className="reveal">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[9px] sm:text-[10px] text-accent/80 tracking-[0.2em]">
                  UNLOCKED
                </span>
                <div className="flex-1 h-px bg-accent/20" />
              </div>
              <p className="font-mono text-sm sm:text-base text-accent leading-relaxed">
                {project.growth.unlocked}
              </p>
            </div>
          </div>

          {/* Skills + Links */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-4 border-t border-foreground/10">
            <div className="reveal flex flex-wrap gap-1.5 sm:gap-2">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className="font-mono text-[9px] sm:text-[10px] text-foreground/60 px-2 py-1 border border-foreground/20"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="reveal flex items-center gap-4">
              {hasGithub && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-foreground/60 hover:text-foreground transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>SOURCE</span>
                </a>
              )}
              {hasDemo && (
                <a
                  href={(project.links as { demo?: string }).demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-foreground/60 hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>DEMO</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// NAVIGATION DOTS
// ─────────────────────────────────────────────────────────────

function NavigationDots({
  total,
  current,
  onSelect,
}: {
  total: number
  current: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={cn(
            "touch-target w-2 h-2 sm:w-2.5 sm:h-2.5 transition-all duration-200",
            i === current
              ? "bg-foreground scale-125"
              : "bg-foreground/20 hover:bg-foreground/40"
          )}
          aria-label={`Go to project ${i + 1}`}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// FILTER COMPONENT
// ─────────────────────────────────────────────────────────────

function FilterPanel({
  selectedGroups,
  onToggleGroup,
  onClearFilters,
}: {
  selectedGroups: SkillGroup[]
  onToggleGroup: (group: SkillGroup) => void
  onClearFilters: () => void
}) {
  const groups = Object.keys(SKILL_GROUPS) as SkillGroup[]

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {groups.map((group) => {
        const isSelected = selectedGroups.includes(group)
        return (
          <button
            key={group}
            onClick={() => onToggleGroup(group)}
            className={cn(
              "touch-target flex-shrink-0 font-mono text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-1 border transition-all duration-150",
              isSelected
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/30 text-foreground/50 active:bg-foreground/10"
            )}
          >
            {group}
          </button>
        )
      })}
      {selectedGroups.length > 0 && (
        <button
          onClick={onClearFilters}
          className="touch-target flex-shrink-0 p-1 text-foreground/40"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────

function SectionHeader({ current, total }: { current: number; total: number }) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!titleRef.current || hasAnimated.current) return
    hasAnimated.current = true

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ░▒▓█"
    const originalText = "NEURAL MAP"
    let iteration = 0

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
      iteration += 0.4
    }, 35)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-end justify-between gap-3 mb-4 sm:mb-6">
      <div>
        <p className="font-mono text-[8px] sm:text-[9px] text-foreground/40 tracking-[0.2em] mb-1">
          — PROJECTS
        </p>
        <h2
          ref={titleRef}
          className="font-mono text-xl sm:text-2xl md:text-3xl font-black text-foreground tracking-tight leading-none"
        >
          NEURAL MAP
        </h2>
      </div>
      <div className="flex items-baseline gap-1 font-mono">
        <span className="text-lg sm:text-xl md:text-2xl font-black text-foreground tabular-nums">
          {String(current + 1).padStart(2, "0")}
        </span>
        <span className="text-xs sm:text-sm text-foreground/30">/</span>
        <span className="text-xs sm:text-sm text-foreground/30 tabular-nums">
          {String(total).padStart(2, "0")}
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const toggleGroup = useCallback((group: SkillGroup) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    )
    setCurrentIndex(0) // Reset to first when filtering
  }, [])

  const clearFilters = useCallback(() => {
    setSelectedGroups([])
    setCurrentIndex(0)
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

  // Navigate to specific project
  const goToProject = useCallback((index: number) => {
    if (index < 0 || index >= filteredProjects.length) return
    setCurrentIndex(index)
    
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current
      const projectWidth = scrollContainer.scrollWidth / filteredProjects.length
      scrollContainer.scrollTo({
        left: projectWidth * index,
        behavior: "smooth",
      })
    }
  }, [filteredProjects.length])

  const goNext = useCallback(() => {
    goToProject(currentIndex + 1)
  }, [currentIndex, goToProject])

  const goPrev = useCallback(() => {
    goToProject(currentIndex - 1)
  }, [currentIndex, goToProject])

  // Handle scroll snap end
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        const projectWidth = scrollContainer.scrollWidth / filteredProjects.length
        const newIndex = Math.round(scrollContainer.scrollLeft / projectWidth)
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < filteredProjects.length) {
          setCurrentIndex(newIndex)
        }
      }, 100)
    }

    scrollContainer.addEventListener("scroll", handleScroll)
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [filteredProjects.length, currentIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goNext, goPrev])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={cn(
        "relative py-8 sm:py-12 md:py-16 lg:py-20",
        "bg-background overflow-hidden"
      )}
    >
      {/* Animated neural background */}
      <AnimatedNeuralBackground />

      {/* Content */}
      <div className="relative">
        {/* Header area with padding */}
        <div className="px-3 sm:px-4 md:px-6 max-w-3xl mx-auto">
          <SectionHeader current={currentIndex} total={filteredProjects.length} />

          {/* Filter */}
          <div className="mb-4 sm:mb-6">
            <FilterPanel
              selectedGroups={selectedGroups}
              onToggleGroup={toggleGroup}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Pulse line */}
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <span className="font-mono text-[8px] sm:text-[10px] text-foreground/15 tracking-widest overflow-hidden">
              {ASCII_PULSE}{ASCII_PULSE}
            </span>
          </div>
        </div>

        {/* Projects carousel */}
        {filteredProjects.length === 0 ? (
          <div className="px-3 sm:px-4 md:px-6 max-w-3xl mx-auto">
            <div className="text-center py-10 sm:py-12 border border-dashed border-foreground/15">
              <pre className="font-mono text-[8px] sm:text-[10px] text-foreground/20 mb-3">
                {ASCII_NEURON_SMALL}
              </pre>
              <p className="font-mono text-[10px] sm:text-xs text-muted-foreground mb-3">
                No matching nodes
              </p>
              <button
                onClick={clearFilters}
                className="font-mono text-[10px] sm:text-xs border border-foreground/40 px-3 py-1.5"
              >
                RESET
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Scroll container */}
            <div
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {filteredProjects.map((project, index) => (
                <ProjectView
                  key={project.id}
                  project={project}
                  isActive={index === currentIndex}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="px-3 sm:px-4 md:px-6 max-w-3xl mx-auto mt-4 sm:mt-6">
              <div className="flex items-center justify-between">
                {/* Prev/Next buttons */}
                <button
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className={cn(
                    "touch-target p-2 border border-foreground/30 transition-all",
                    currentIndex === 0
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-foreground hover:text-background active:bg-foreground active:text-background"
                  )}
                  aria-label="Previous project"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Dots */}
                <NavigationDots
                  total={filteredProjects.length}
                  current={currentIndex}
                  onSelect={goToProject}
                />

                {/* Next button */}
                <button
                  onClick={goNext}
                  disabled={currentIndex === filteredProjects.length - 1}
                  className={cn(
                    "touch-target p-2 border border-foreground/30 transition-all",
                    currentIndex === filteredProjects.length - 1
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-foreground hover:text-background active:bg-foreground active:text-background"
                  )}
                  aria-label="Next project"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Synapse decoration */}
              <div className="mt-4 sm:mt-6 text-center">
                <span className="font-mono text-[8px] sm:text-[10px] text-foreground/15">
                  {ASCII_SYNAPSE}{ASCII_SYNAPSE}{ASCII_SYNAPSE}
                </span>
              </div>
            </div>
          </>
        )}

        {/* Next section link */}
        <div className="mt-8 sm:mt-10 text-center">
          <a
            href="#contact"
            className="touch-target inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-foreground/40 hover:text-foreground transition-colors"
          >
            <span>↓</span>
            <span>NEXT</span>
          </a>
        </div>
      </div>
    </section>
  )
}
