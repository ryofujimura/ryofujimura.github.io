"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Github, X, ChevronDown, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// ASCII GRAPHICS
// ─────────────────────────────────────────────────────────────

const ASCII_CORNER_TL = `┌──`
const ASCII_CORNER_TR = `──┐`
const ASCII_CORNER_BL = `└──`
const ASCII_CORNER_BR = `──┘`

const ASCII_ARROW = `>>>`

const ASCII_PROGRESS = `
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
`.trim()

const ASCII_CIRCUIT = `
┌─┬─┬─┬─┐
├─┼─┼─┼─┤
└─┴─┴─┴─┘
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
// PROJECT DATA - Focus on Technical Growth
// ─────────────────────────────────────────────────────────────

const allProjects = [
  {
    id: "01",
    title: "Saboriendo Bakery",
    category: "FULL-STACK",
    year: "2024",
    image: "/images/default_image.png",
    learned: "First production React 19 + SwiftUI integration",
    growth: [
      "Mastered real-time Firestore sync patterns",
      "Built barcode scanning with AVFoundation",
      "Implemented FCM/APNs push architecture",
    ],
    metrics: { speed: "50%↑", formats: "11+", languages: "3" },
    skills: ["React 19", "SwiftUI", "Firebase", "Firestore", "AVFoundation"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "02",
    title: "Zero Inbox",
    category: "AI/ML",
    year: "2025",
    image: "/images/default_image.png",
    learned: "Built custom AI reasoning engine from scratch",
    growth: [
      "Designed multi-stage decision system",
      "Achieved 95% classification accuracy",
      "Optimized inference to <300ms",
    ],
    metrics: { accuracy: "95%", latency: "200ms", throughput: "200/min" },
    skills: ["Swift", "SwiftUI", "Firebase", "AI/ML", "Google APIs"],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
  },
  {
    id: "03",
    title: "Research Lab Platform",
    category: "SERVERLESS",
    year: "2025",
    image: "/images/default_image.png",
    learned: "Scaled serverless to 30+ concurrent researchers",
    growth: [
      "Architected dynamic AI routing system",
      "Sub-200ms Cloud Functions response",
      "Built metadata-aware prompting",
    ],
    metrics: { response: "<200ms", users: "30+", labs: "multi" },
    skills: ["Cloud Functions", "Firebase", "AI routing", "Node.js"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "04",
    title: "HTIC Shuttle",
    category: "REAL-TIME",
    year: "2025",
    image: "/images/schedule.jpg",
    learned: "Solved race conditions in real-time systems",
    growth: [
      "Implemented event serialization",
      "70% reduction in state conflicts",
      "Cross-platform Swift + Kotlin",
    ],
    metrics: { users: "25+", reduction: "70%↓", sync: "<100ms" },
    skills: ["Swift", "Kotlin", "Firebase RTDB", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
  },
  {
    id: "05",
    title: "CyberEdu",
    category: "CROSS-PLATFORM",
    year: "2025",
    image: "/images/CyberEdu.png",
    learned: "Achieved 99% sync across unstable networks",
    growth: [
      "Built resilient offline-first architecture",
      "Unified iOS + Android codebase patterns",
      "Handled network edge cases",
    ],
    metrics: { users: "50+", sync: "99%↑", platforms: "2" },
    skills: ["Swift", "Kotlin", "Firebase", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
  },
  {
    id: "06",
    title: "Whiteboard AI",
    category: "VISION",
    year: "2025",
    image: "/images/whiteboardai.png",
    learned: "Real-time vision inference + collaboration",
    growth: [
      "Transformer inference at 150ms",
      "CRDT-like conflict resolution",
      "Multi-user WebSocket pipeline",
    ],
    metrics: { inference: "150ms", users: "5+", sync: "CRDT" },
    skills: ["PyTorch", "Vision", "WebSocket", "React"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "07",
    title: "With",
    category: "LOCAL AI",
    year: "2024–25",
    image: "/images/default_image.png",
    learned: "On-device LLM with 2GB memory savings",
    growth: [
      "Integrated llama.cpp in Swift",
      "Optimized quantization pipeline",
      "<50ms/token local inference",
    ],
    metrics: { speed: "<50ms/tok", savings: "2GB↓", mode: "offline" },
    skills: ["Swift", "llama.cpp", "GGUF", "SwiftUI"],
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "08",
    title: "Portfolio",
    category: "WEB",
    year: "2024–25",
    image: "/images/homepage.png",
    learned: "Brutalist design system + GSAP mastery",
    growth: [
      "40-60% load time improvement",
      "Complex scroll-triggered animations",
      "Modular component architecture",
    ],
    metrics: { speed: "60%↑", design: "brutalist", deploy: "Vercel" },
    skills: ["React", "Next.js", "Tailwind", "Vercel"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "09",
    title: "Matcha Time",
    category: "iOS",
    year: "2024",
    image: "/images/matchatime_1.jpg",
    learned: "4-week idea-to-App-Store pipeline",
    growth: [
      "Rapid SwiftUI prototyping",
      "App Store submission process",
      "User feedback integration",
    ],
    metrics: { users: "50", timeline: "4 weeks", store: "App Store" },
    skills: ["Swift", "SwiftUI", "App Store"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#" },
  },
  {
    id: "10",
    title: "Schedule Mastermind",
    category: "BACKEND",
    year: "2023–24",
    image: "/images/schedule.jpg",
    learned: "Constraint satisfaction at scale",
    growth: [
      "500+ course scheduling algorithm",
      "Real-time conflict detection",
      "70% fewer scheduling errors",
    ],
    metrics: { courses: "500+", errors: "70%↓", stack: "Flask" },
    skills: ["Python", "Flask", "scheduling"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "11",
    title: "Shohei Home Ground",
    category: "AUTOMATION",
    year: "2023",
    image: "/images/shoheihomeground_1.jpg",
    learned: "Scaled content automation to 11K followers",
    growth: [
      "685 automated posts",
      "2+ hours/day time savings",
      "Consistent monetization",
    ],
    metrics: { followers: "11K", posts: "685", saved: "2hr/day" },
    skills: ["Python", "automation", "Instagram"],
    links: { instagram: "#", youtube: "#" },
  },
  {
    id: "12",
    title: "Poker Percentage",
    category: "WATCHOS",
    year: "2022–24",
    image: "/images/poker.png",
    learned: "Sub-10ms lookups via precomputation",
    growth: [
      "Probability table optimization",
      "WatchOS UI constraints",
      "Real-time equity calculation",
    ],
    metrics: { lookup: "<10ms", platform: "WatchOS", method: "precomputed" },
    skills: ["Swift", "WatchOS", "probability"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
]

type Project = (typeof allProjects)[0]

// ─────────────────────────────────────────────────────────────
// ANIMATED TECHNICAL LINES
// ─────────────────────────────────────────────────────────────

function TechLines({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const paths = ref.current.querySelectorAll("path, line")
    const ctx = gsap.context(() => {
      gsap.fromTo(
        paths,
        { strokeDasharray: "0 200", opacity: 0 },
        {
          strokeDasharray: "200 0",
          opacity: 1,
          duration: 1,
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
      className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* Corner marks */}
      <path d="M0 8 L0 0 L8 0" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <path d="M92 0 L100 0 L100 8" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <path d="M0 92 L0 100 L8 100" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <path d="M92 100 L100 100 L100 92" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      {/* Registration cross */}
      <line x1="95" y1="48" x2="95" y2="52" stroke="currentColor" strokeWidth="0.3" opacity="0.2" />
      <line x1="93" y1="50" x2="97" y2="50" stroke="currentColor" strokeWidth="0.3" opacity="0.2" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// IMAGE PLACEHOLDER WITH ASCII OVERLAY
// ─────────────────────────────────────────────────────────────

function ProjectImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, scale: 1.05 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
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
    <div ref={ref} className={cn("relative overflow-hidden bg-muted", className)}>
      {/* Image */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="h-[2px] bg-foreground" style={{ marginTop: '2px' }} />
        ))}
      </div>
      {/* Corner ASCII */}
      <span className="absolute top-2 left-2 font-mono text-[8px] text-foreground/40 select-none">
        {ASCII_CORNER_TL}
      </span>
      <span className="absolute top-2 right-2 font-mono text-[8px] text-foreground/40 select-none">
        {ASCII_CORNER_TR}
      </span>
      <span className="absolute bottom-2 left-2 font-mono text-[8px] text-foreground/40 select-none">
        {ASCII_CORNER_BL}
      </span>
      <span className="absolute bottom-2 right-2 font-mono text-[8px] text-foreground/40 select-none">
        {ASCII_CORNER_BR}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT CARD - MOBILE OPTIMIZED
// ─────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const learnedRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!cardRef.current) return
    const el = cardRef.current

    const ctx = gsap.context(() => {
      // Card entrance
      gsap.fromTo(
        el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }
      )

      // "What I learned" scramble effect
      if (learnedRef.current) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        const originalText = project.learned
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
                  if (char === " " || char === "+" || char === "-" || char === "<" || char === ">") return char
                  if (i < iteration) return char
                  return chars[Math.floor(Math.random() * chars.length)]
                })
                .join("")
              if (iteration >= originalText.length) clearInterval(interval)
              iteration += 0.6
            }, 25)
          },
        })
      }

      // Growth items stagger
      const growthItems = el.querySelectorAll(".growth-item")
      gsap.fromTo(
        growthItems,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      )

      // Metrics counter animation
      const metrics = el.querySelectorAll(".metric-value")
      gsap.fromTo(
        metrics,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [project.learned])

  const hasGithub = project.links.github
  const hasDemo = "demo" in project.links && (project.links as { demo?: string }).demo
  const hasAppStore = "appStore" in project.links
  const hasPlayStore = "playStore" in project.links

  return (
    <article
      ref={cardRef}
      className={cn(
        "relative group",
        "bg-background border-2 border-foreground",
        "shadow-[4px_4px_0_0_var(--foreground)]",
        "sm:shadow-[6px_6px_0_0_var(--foreground)]",
        "active:shadow-[2px_2px_0_0_var(--foreground)]",
        "active:translate-x-[2px] active:translate-y-[2px]",
        "transition-all duration-150"
      )}
    >
      <TechLines className="opacity-40" />

      {/* MOBILE-FIRST LAYOUT */}
      <div className="flex flex-col">
        {/* Image Section - Full width on mobile */}
        <div className="relative">
          <ProjectImage
            src={project.image}
            alt={project.title}
            className="w-full aspect-[16/9] sm:aspect-[2/1]"
          />
          {/* Floating badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="font-mono text-[10px] sm:text-xs px-2 py-1 bg-background border border-foreground text-foreground">
              {project.category}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="font-mono text-2xl sm:text-3xl font-black text-background drop-shadow-[2px_2px_0_var(--foreground)]">
              {project.id}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 md:p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-mono text-lg sm:text-xl md:text-2xl font-black text-foreground leading-tight truncate">
                {project.title}
              </h3>
              <span className="font-mono text-[10px] sm:text-xs text-muted-foreground">
                {project.year}
              </span>
            </div>
          </div>

          {/* What I Learned - Key Focus */}
          <div className="mb-4 p-3 sm:p-4 bg-foreground/5 border-l-4 border-accent">
            <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground tracking-[0.2em] block mb-1">
              {ASCII_ARROW} LEARNED
            </span>
            <p
              ref={learnedRef}
              className="font-mono text-sm sm:text-base font-bold text-foreground leading-snug"
            >
              {project.learned}
            </p>
          </div>

          {/* Technical Growth List */}
          <div className="mb-4">
            <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground tracking-[0.2em] block mb-2">
              GROWTH
            </span>
            <ul className="space-y-1.5">
              {project.growth.map((item, i) => (
                <li
                  key={i}
                  className="growth-item flex items-start gap-2 font-mono text-xs sm:text-sm text-foreground/80"
                >
                  <span className="text-accent mt-0.5 flex-shrink-0">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Metrics Grid - Responsive */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 p-2 sm:p-3 border border-dashed border-foreground/30">
            {Object.entries(project.metrics).map(([key, value]) => (
              <div key={key} className="text-center">
                <span className="metric-value font-mono text-base sm:text-lg md:text-xl font-black text-foreground block">
                  {value}
                </span>
                <span className="font-mono text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-wider">
                  {key}
                </span>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.skills.map((skill) => (
              <span
                key={skill}
                className="font-mono text-[9px] sm:text-[10px] px-2 py-0.5 border border-foreground/30 text-foreground/70"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Links - Touch optimized */}
          <div className="flex flex-wrap gap-2">
            {hasGithub && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center gap-1.5 min-h-[44px] px-3 sm:px-4 font-mono text-[10px] sm:text-xs border-2 border-foreground text-foreground bg-background hover:bg-foreground hover:text-background active:bg-foreground active:text-background transition-colors"
              >
                <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                CODE
              </a>
            )}
            {hasDemo && (
              <a
                href={(project.links as { demo?: string }).demo}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center gap-1.5 min-h-[44px] px-3 sm:px-4 font-mono text-[10px] sm:text-xs border-2 border-foreground bg-foreground text-background hover:bg-background hover:text-foreground active:bg-background active:text-foreground transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                DEMO
              </a>
            )}
            {hasAppStore && (
              <a
                href={(project.links as { appStore?: string }).appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center min-h-[44px] px-3 font-mono text-[10px] sm:text-xs border border-foreground/50 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                iOS
              </a>
            )}
            {hasPlayStore && (
              <a
                href={(project.links as { playStore?: string }).playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center min-h-[44px] px-3 font-mono text-[10px] sm:text-xs border border-foreground/50 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
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
// FILTER - MOBILE OPTIMIZED
// ─────────────────────────────────────────────────────────────

function FilterBar({
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
      {/* Horizontally scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
        {groups.map((group) => {
          const isSelected = selectedGroups.includes(group)
          return (
            <button
              key={group}
              onClick={() => onToggleGroup(group)}
              className={cn(
                "touch-target flex-shrink-0 font-mono text-[10px] sm:text-xs px-3 sm:px-4 py-2 border-2 transition-all whitespace-nowrap",
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/40 text-foreground/70 hover:border-foreground active:bg-foreground active:text-background"
              )}
            >
              {group}
            </button>
          )
        })}
        {selectedGroups.length > 0 && (
          <button
            onClick={onClearFilters}
            className="touch-target flex-shrink-0 flex items-center gap-1 font-mono text-[10px] sm:text-xs text-muted-foreground px-2"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Count */}
      <div className="flex items-center gap-2 mt-3 font-mono text-[10px] sm:text-xs text-muted-foreground">
        <span className="text-foreground font-bold">{resultCount}</span>
        <span>/</span>
        <span>{totalCount}</span>
        <span className="text-foreground/30">projects</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────

function SectionHeader({ count }: { count: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      // Title scramble
      if (titleRef.current) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ█▓▒░"
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

      // Header elements
      const elements = ref.current?.querySelectorAll(".header-reveal")
      if (elements) {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        )
      }
    }, ref.current)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="mb-6 sm:mb-8">
      {/* Section number */}
      <p className="header-reveal font-mono text-[9px] sm:text-[10px] text-muted-foreground tracking-[0.3em] mb-1">
        04
      </p>

      {/* Title */}
      <div className="flex items-end justify-between gap-4">
        <h2
          ref={titleRef}
          className="header-reveal font-mono text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tighter leading-none"
        >
          PROJECTS
        </h2>
        <span className="header-reveal font-mono text-3xl sm:text-4xl font-black text-foreground/15 tabular-nums">
          {String(count).padStart(2, "0")}
        </span>
      </div>

      {/* Underline */}
      <div className="header-reveal mt-3 flex items-center gap-2">
        <div className="h-1 w-8 sm:w-12 bg-foreground" />
        <div className="h-px flex-1 bg-foreground/20" />
        <pre className="font-mono text-[7px] sm:text-[8px] text-foreground/20 select-none hidden sm:block">
          {ASCII_CIRCUIT}
        </pre>
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
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-background"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.015]">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_50px,currentColor_50px,currentColor_51px)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_50px,currentColor_50px,currentColor_51px)]" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        <SectionHeader count={allProjects.length} />

        <FilterBar
          selectedGroups={selectedGroups}
          onToggleGroup={toggleGroup}
          onClearFilters={clearFilters}
          resultCount={filteredProjects.length}
          totalCount={allProjects.length}
        />

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-foreground/20">
            <pre className="font-mono text-xs text-foreground/30 mb-4">
              {`
┌─────────────┐
│  NO MATCH   │
└─────────────┘
              `}
            </pre>
            <button
              onClick={clearFilters}
              className="touch-target font-mono text-xs border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
            >
              RESET
            </button>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {displayedProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        {/* Load More */}
        {!showAll && remaining > 0 && (
          <div className="mt-8 sm:mt-10 flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className={cn(
                "touch-target group flex items-center gap-2",
                "w-full sm:w-auto justify-center",
                "px-6 py-4 sm:py-3",
                "font-mono text-xs tracking-[0.1em]",
                "border-2 border-foreground bg-foreground text-background",
                "hover:bg-background hover:text-foreground",
                "active:translate-y-[2px] active:shadow-none",
                "shadow-[4px_4px_0_0_var(--foreground)]",
                "transition-all duration-150"
              )}
            >
              <span>+{remaining} MORE</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* End */}
        {showAll && (
          <div className="mt-12 text-center">
            <pre className="font-mono text-[8px] sm:text-[9px] text-foreground/20 select-none mb-4">
              {`
┌──────────────────────────────────┐
│              · · ·               │
└──────────────────────────────────┘
              `}
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
