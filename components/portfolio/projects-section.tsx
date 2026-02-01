"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Github, X } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// ASCII DECORATIONS
// ─────────────────────────────────────────────────────────────

const ASCII_CORNER_TL = `┌──`
const ASCII_CORNER_TR = `──┐`
const ASCII_CORNER_BL = `└──`
const ASCII_CORNER_BR = `──┘`

const ASCII_DIVIDER = `─────────────────────────────────────────`

const ASCII_ARROW = `>>>`

const ASCII_MATCH = `
╔═══════════════╗
║   MATCH  ♥    ║
╚═══════════════╝
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
// PROJECT DATA - FOCUSED ON GROWTH
// ─────────────────────────────────────────────────────────────

const allProjects = [
  {
    id: "01",
    title: "Saboriendo Bakery",
    type: "Full-Stack Platform",
    year: "2024",
    image: "/images/default_image.png",
    stack: ["React 19", "SwiftUI", "Firebase"],
    learned: "Multi-platform architecture",
    growth: "First production app bridging web + native iOS with shared Firebase backend. Learned real-time sync patterns and cross-platform state management.",
    metric: "50%↑ lookup speed",
    skills: ["React 19", "SwiftUI", "Firebase", "Firestore", "AVFoundation"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "02",
    title: "Zero Inbox",
    type: "AI Email Client",
    year: "2025",
    image: "/images/default_image.png",
    stack: ["Swift", "AI/ML", "Google APIs"],
    learned: "AI reasoning systems",
    growth: "Built multi-stage AI decision engine from scratch. Learned prompt engineering, classification pipelines, and low-latency inference optimization.",
    metric: "95% accuracy",
    skills: ["Swift", "SwiftUI", "Firebase", "AI/ML", "Google APIs"],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
  },
  {
    id: "03",
    title: "Research Lab PM",
    type: "Serverless System",
    year: "2025",
    image: "/images/default_image.png",
    stack: ["Cloud Functions", "Node.js"],
    learned: "Serverless orchestration",
    growth: "Designed event-driven architecture for 30+ researchers. Mastered Cloud Functions patterns, cold start optimization, and metadata-aware AI routing.",
    metric: "<200ms response",
    skills: ["Cloud Functions", "Firebase", "AI routing", "Node.js"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "04",
    title: "HTIC Shuttle",
    type: "Real-Time Tracker",
    year: "2025",
    image: "/images/schedule.jpg",
    stack: ["Swift", "Kotlin", "RTDB"],
    learned: "Real-time sync systems",
    growth: "Implemented conflict-free state sync across iOS, Android, web. Learned RTDB optimization, event serialization, and offline-first patterns.",
    metric: "70%↓ conflicts",
    skills: ["Swift", "Kotlin", "Firebase RTDB", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
  },
  {
    id: "05",
    title: "CyberEdu",
    type: "Cross-Platform App",
    year: "2025",
    image: "/images/CyberEdu.png",
    stack: ["Swift", "Kotlin", "Firebase"],
    learned: "Cross-platform parity",
    growth: "Built identical UX on iOS + Android from single codebase patterns. Mastered platform-specific optimizations while maintaining feature parity.",
    metric: "99%↑ sync",
    skills: ["Swift", "Kotlin", "Firebase", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
  },
  {
    id: "06",
    title: "Whiteboard AI",
    type: "Vision Collaboration",
    year: "2025",
    image: "/images/whiteboardai.png",
    stack: ["PyTorch", "WebSocket", "React"],
    learned: "Real-time ML inference",
    growth: "Integrated transformer vision models with live collaboration. Learned WebSocket pipelines, CRDT patterns, and GPU inference optimization.",
    metric: "150ms latency",
    skills: ["PyTorch", "Vision", "WebSocket", "React"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "07",
    title: "With",
    type: "Local LLM Chat",
    year: "2024–25",
    image: "/images/default_image.png",
    stack: ["Swift", "llama.cpp", "GGUF"],
    learned: "On-device AI",
    growth: "Ran LLMs locally on iOS. Deep dive into quantization, memory management, Metal acceleration, and efficient token streaming.",
    metric: "<50ms/token",
    skills: ["Swift", "llama.cpp", "GGUF", "SwiftUI"],
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "08",
    title: "Portfolio Site",
    type: "Web Performance",
    year: "2024–25",
    image: "/images/homepage.png",
    stack: ["Next.js", "GSAP", "Tailwind"],
    learned: "Animation systems",
    growth: "Built brutalist design system with complex GSAP animations. Learned ScrollTrigger patterns, performance budgets, and mobile optimization.",
    metric: "40-60%↑ speed",
    skills: ["React", "Next.js", "Tailwind", "Vercel"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "09",
    title: "Matcha Time",
    type: "iOS Native",
    year: "2024",
    image: "/images/matchatime_1.jpg",
    stack: ["Swift", "SwiftUI"],
    learned: "Rapid prototyping",
    growth: "4-week idea-to-App-Store. Learned to scope MVP features, iterate quickly, and navigate App Store review process.",
    metric: "50 users",
    skills: ["Swift", "SwiftUI", "App Store"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#" },
  },
  {
    id: "10",
    title: "Schedule Mastermind",
    type: "Backend System",
    year: "2023–24",
    image: "/images/schedule.jpg",
    stack: ["Python", "Flask"],
    learned: "Algorithm design",
    growth: "Built constraint satisfaction scheduler for 500+ courses. Learned optimization algorithms, conflict detection, and efficient data structures.",
    metric: "70%↓ errors",
    skills: ["Python", "Flask", "scheduling"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "11",
    title: "Shohei Home Ground",
    type: "Social Automation",
    year: "2023",
    image: "/images/shoheihomeground_1.jpg",
    stack: ["Python", "Instagram API"],
    learned: "Automation at scale",
    growth: "Automated 685 posts, grew to 11K followers. Learned content scheduling, API rate limits, and sustainable automation patterns.",
    metric: "11K followers",
    skills: ["Python", "automation", "Instagram"],
    links: { instagram: "#", youtube: "#" },
  },
  {
    id: "12",
    title: "Poker Percentage",
    type: "WatchOS App",
    year: "2022–24",
    image: "/images/poker.png",
    stack: ["Swift", "WatchKit"],
    learned: "Constrained platforms",
    growth: "First WatchOS app. Learned to optimize for tiny screens, limited memory, and precomputed lookup tables for instant results.",
    metric: "<10ms lookup",
    skills: ["Swift", "WatchOS", "probability"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
]

type Project = (typeof allProjects)[0]

// ─────────────────────────────────────────────────────────────
// SPEED DATE CARD - MOBILE FIRST
// ─────────────────────────────────────────────────────────────

function SpeedDateCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const learnedRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!cardRef.current) return
    const card = cardRef.current

    const ctx = gsap.context(() => {
      // Card slide in from alternating sides on mobile
      const direction = index % 2 === 0 ? -30 : 30

      gsap.fromTo(
        card,
        { opacity: 0, x: direction, y: 20 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
            end: "top 60%",
            toggleActions: "play none none none",
          },
        }
      )

      // Image reveal
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.2, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: imageRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        )
      }

      // Learned text scramble
      if (learnedRef.current) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_-"
        const originalText = project.learned.toUpperCase()
        let iteration = 0

        ScrollTrigger.create({
          trigger: learnedRef.current,
          start: "top 88%",
          onEnter: () => {
            const interval = setInterval(() => {
              if (!learnedRef.current) return clearInterval(interval)
              learnedRef.current.textContent = originalText
                .split("")
                .map((char, i) => {
                  if (char === " ") return " "
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

      // Content stagger
      if (contentRef.current) {
        const items = contentRef.current.querySelectorAll(".reveal")
        gsap.fromTo(
          items,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        )
      }
    }, card)

    return () => ctx.revert()
  }, [project.learned, index])

  const hasGithub = project.links.github
  const hasDemo = "demo" in project.links && (project.links as { demo?: string }).demo
  const hasAppStore = "appStore" in project.links
  const hasPlayStore = "playStore" in project.links

  return (
    <article
      ref={cardRef}
      className="relative bg-background border-2 border-foreground"
    >
      {/* ASCII corners */}
      <span className="absolute top-1 left-2 font-mono text-[10px] text-foreground/30 select-none">
        {ASCII_CORNER_TL}
      </span>
      <span className="absolute top-1 right-2 font-mono text-[10px] text-foreground/30 select-none">
        {ASCII_CORNER_TR}
      </span>
      <span className="absolute bottom-1 left-2 font-mono text-[10px] text-foreground/30 select-none">
        {ASCII_CORNER_BL}
      </span>
      <span className="absolute bottom-1 right-2 font-mono text-[10px] text-foreground/30 select-none">
        {ASCII_CORNER_BR}
      </span>

      {/* Mobile: Stack layout / Desktop: Side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr]">
        {/* IMAGE SECTION */}
        <div className="relative h-48 sm:h-56 lg:h-auto lg:min-h-[280px] overflow-hidden border-b-2 lg:border-b-0 lg:border-r-2 border-foreground">
          <div
            ref={imageRef}
            className="absolute inset-0 bg-muted"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-background/50" />
          </div>

          {/* Project number badge */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <span className="font-mono text-3xl sm:text-4xl font-black text-background drop-shadow-[2px_2px_0_var(--foreground)]">
              {project.id}
            </span>
          </div>

          {/* Year badge */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <span className="font-mono text-[10px] sm:text-xs text-background bg-foreground px-2 py-1">
              {project.year}
            </span>
          </div>

          {/* Metric badge - mobile bottom */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 lg:hidden">
            <span className="font-mono text-xs sm:text-sm font-bold text-foreground bg-background/90 border border-foreground px-2 py-1">
              {project.metric}
            </span>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div ref={contentRef} className="p-4 sm:p-5 lg:p-6">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <p className="reveal font-mono text-[10px] sm:text-xs text-accent tracking-wider mb-1">
                {project.type}
              </p>
              <h3 className="reveal font-mono text-lg sm:text-xl lg:text-2xl font-black text-foreground leading-tight">
                {project.title}
              </h3>
            </div>
            {/* Metric - desktop only */}
            <div className="hidden lg:block">
              <span className="font-mono text-xs font-bold text-foreground border border-foreground px-2 py-1">
                {project.metric}
              </span>
            </div>
          </div>

          {/* LEARNED - Main focus */}
          <div className="reveal mb-4 p-3 sm:p-4 border-2 border-dashed border-foreground/40 bg-foreground/5">
            <p className="font-mono text-[9px] sm:text-[10px] text-muted-foreground tracking-wider mb-1">
              {ASCII_ARROW} LEARNED
            </p>
            <p className="font-mono text-base sm:text-lg lg:text-xl font-black text-foreground leading-tight">
              <span ref={learnedRef}>{project.learned.toUpperCase()}</span>
            </p>
          </div>

          {/* Growth description */}
          <p className="reveal text-xs sm:text-sm text-foreground/80 leading-relaxed mb-4">
            {project.growth}
          </p>

          {/* Stack pills */}
          <div className="reveal flex flex-wrap gap-1.5 sm:gap-2 mb-4">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[9px] sm:text-[10px] px-2 py-1 border border-foreground/50 text-foreground bg-background"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links row */}
          <div className="reveal flex flex-wrap gap-3 sm:gap-4 pt-3 border-t border-foreground/20">
            {hasGithub && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-foreground hover:text-accent transition-colors"
              >
                <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>CODE</span>
              </a>
            )}
            {hasDemo && (
              <a
                href={(project.links as { demo?: string }).demo}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-foreground hover:text-accent transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>DEMO</span>
              </a>
            )}
            {hasAppStore && (
              <a
                href={(project.links as { appStore?: string }).appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target font-mono text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                iOS
              </a>
            )}
            {hasPlayStore && (
              <a
                href={(project.links as { playStore?: string }).playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target font-mono text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Android
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

// ─────────────────────────────────────────────────────────────
// FILTER - COMPACT MOBILE
// ─────────────────────────────────────────────────────────────

function FilterBar({
  selectedGroups,
  onToggleGroup,
  onClearFilters,
}: {
  selectedGroups: SkillGroup[]
  onToggleGroup: (group: SkillGroup) => void
  onClearFilters: () => void
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
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {groups.map((group) => {
          const isSelected = selectedGroups.includes(group)
          return (
            <button
              key={group}
              onClick={() => onToggleGroup(group)}
              className={cn(
                "touch-target font-mono text-[10px] sm:text-xs px-2.5 sm:px-3 py-1.5 border-2 transition-all",
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/30 text-foreground/60 hover:border-foreground hover:text-foreground"
              )}
            >
              {group}
            </button>
          )
        })}
        {selectedGroups.length > 0 && (
          <button
            onClick={onClearFilters}
            className="touch-target p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION HEADER - MOBILE OPTIMIZED
// ─────────────────────────────────────────────────────────────

function SectionHeader({ count, filteredCount }: { count: number; filteredCount: number }) {
  const headerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!headerRef.current) return

    const ctx = gsap.context(() => {
      // Title scramble
      if (titleRef.current) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ░▒▓█"
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

      // Line animation
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: "left" },
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: lineRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        )
      }
    }, headerRef.current)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={headerRef} className="mb-6 sm:mb-8">
      {/* Title */}
      <div className="flex items-end justify-between gap-4 mb-3">
        <div>
          <p className="font-mono text-[9px] sm:text-[10px] text-muted-foreground tracking-[0.2em] mb-1">
            ─ 04
          </p>
          <h2
            ref={titleRef}
            className="font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-none"
          >
            PROJECTS
          </h2>
        </div>
        <div className="text-right">
          <span className="font-mono text-2xl sm:text-3xl lg:text-4xl font-black text-foreground/15 tabular-nums">
            {String(count).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Animated line */}
      <div ref={lineRef} className="h-0.5 sm:h-1 bg-foreground mb-3" />

      {/* Subtext */}
      <p className="font-mono text-[10px] sm:text-xs text-muted-foreground">
        {filteredCount === count ? (
          <>Showing all {count} projects</>
        ) : (
          <>{filteredCount} of {count} projects</>
        )}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TIMELINE CONNECTOR - MOBILE
// ─────────────────────────────────────────────────────────────

function TimelineConnector() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { scaleY: 0, transformOrigin: "top" },
        {
          scaleY: 1,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      )
    }, ref.current)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="h-8 sm:h-10 flex justify-center">
      <div className="w-0.5 h-full bg-foreground/20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground/40 rotate-45" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground/40 rotate-45" />
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
      className="relative py-10 sm:py-14 md:py-20 px-4 sm:px-6 bg-background"
    >
      {/* Background pattern - subtle */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-foreground"
              style={{
                top: `${i * 5}%`,
                left: 0,
                right: 0,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <SectionHeader count={allProjects.length} filteredCount={filteredProjects.length} />

        <FilterBar
          selectedGroups={selectedGroups}
          onToggleGroup={toggleGroup}
          onClearFilters={clearFilters}
        />

        {/* Projects list */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-foreground/20">
            <pre className="font-mono text-xs text-foreground/30 mb-3 select-none">
              {`┌─────────────┐
│  NO MATCH   │
└─────────────┘`}
            </pre>
            <button
              onClick={clearFilters}
              className="font-mono text-xs border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
            >
              RESET
            </button>
          </div>
        ) : (
          <div className="space-y-0">
            {displayedProjects.map((project, index) => (
              <div key={project.id}>
                <SpeedDateCard project={project} index={index} />
                {index < displayedProjects.length - 1 && <TimelineConnector />}
              </div>
            ))}
          </div>
        )}

        {/* Load more */}
        {!showAll && remaining > 0 && (
          <div className="mt-8 sm:mt-10 flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className={cn(
                "touch-target w-full sm:w-auto",
                "px-6 py-4 sm:py-3",
                "font-mono text-xs tracking-wider",
                "border-2 border-foreground bg-foreground text-background",
                "hover:bg-background hover:text-foreground transition-colors",
                "active:scale-[0.98]"
              )}
            >
              +{remaining} MORE PROJECTS
            </button>
          </div>
        )}

        {/* End */}
        {showAll && (
          <div className="mt-10 text-center">
            <pre className="font-mono text-[9px] sm:text-[10px] text-foreground/20 select-none mb-4">
              {ASCII_DIVIDER}
            </pre>
            <a
              href="#contact"
              className="touch-target inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ↓ CONTACT
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
