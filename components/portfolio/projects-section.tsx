"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Github, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// ASCII PATTERNS
// ─────────────────────────────────────────────────────────────

const ASCII_BARCODE = `█▌▐█▌▐▌█▐█▌▐▌▐█▌▐█▌█▐▌▐█▌█▐█▌▐▌▐█▌█▐█`
const ASCII_BARCODE_SHORT = `█▌▐█▌▐▌█▐█▌▐▌▐█`
const ASCII_DOTS = `· · · · · · · · · · · · · · · · · · · ·`
const ASCII_LINE = `────────────────────────────────────────`
const ASCII_ARROW = `>>>`

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
    title: "Saboriendo Bakery",
    category: "FULL-STACK",
    primarySkill: "React + SwiftUI",
    year: "2024",
    image: "/images/default_image.png",
    description: "Full-stack e-commerce with React 19, SwiftUI, Firebase. Real-time orders, barcode verification, 11+ formats.",
    metrics: ["50%↑", "11+ formats", "3 lang"],
    skills: ["React 19", "SwiftUI", "Firebase", "Firestore", "AVFoundation"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "02",
    code: "RF.2025.02",
    title: "Zero Inbox",
    category: "AI/ML",
    primarySkill: "Swift + AI",
    year: "2025",
    image: "/images/default_image.png",
    description: "AI email client with 95% classification accuracy, 200ms inference. Multi-stage decision system.",
    metrics: ["95% acc", "200ms", "50-200/min"],
    skills: ["Swift", "SwiftUI", "Firebase", "AI/ML", "Google APIs"],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
  },
  {
    id: "03",
    code: "RF.2025.03",
    title: "Research Lab Mgmt",
    category: "SERVERLESS",
    primarySkill: "Cloud Functions",
    year: "2025",
    image: "/images/default_image.png",
    description: "Serverless AI routing for 30+ researchers. Sub-200ms response, metadata-aware prompting.",
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
    description: "Live shuttle tracking for 25+ daily users. 70% reduction in conflicts, <100ms sync.",
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
    description: "Synchronized iOS+Android apps for 50+ users. 99%+ cross-device sync reliability.",
    metrics: ["50+ users", "99%↑ sync", "iOS+Android"],
    skills: ["Swift", "Kotlin", "Firebase", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
  },
  {
    id: "06",
    code: "RF.2025.06",
    title: "Whiteboard AI",
    category: "VISION",
    primarySkill: "PyTorch",
    year: "2025",
    image: "/images/whiteboardai.png",
    description: "Vision inference at 150ms latency with real-time CRDT collaboration. WebSocket pipeline.",
    metrics: ["150ms", "5+ users", "CRDT"],
    skills: ["PyTorch", "Vision", "WebSocket", "React"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "07",
    code: "RF.2024.07",
    title: "With",
    category: "LOCAL AI",
    primarySkill: "llama.cpp",
    year: "2024–25",
    image: "/images/default_image.png",
    description: "Offline LLM chat using GGUF + llama.cpp. <50ms/token, 2GB+ memory savings.",
    metrics: ["<50ms/tok", "2GB↓", "offline"],
    skills: ["Swift", "llama.cpp", "GGUF", "SwiftUI"],
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "08",
    code: "RF.2024.08",
    title: "Portfolio",
    category: "WEB",
    primarySkill: "Next.js + GSAP",
    year: "2024–25",
    image: "/images/homepage.png",
    description: "40–60% faster load times. Brutalist design system with GSAP animations.",
    metrics: ["40-60%↑", "modular", "Vercel"],
    skills: ["React", "Next.js", "Tailwind", "Vercel"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "09",
    code: "RF.2024.09",
    title: "Matcha Time",
    category: "iOS",
    primarySkill: "SwiftUI",
    year: "2024",
    image: "/images/matchatime_1.jpg",
    description: "Time zone coordination tool. 50 users at launch, 4-week idea-to-App Store.",
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
    description: "Flask scheduler for 500+ courses. 70% fewer scheduling errors.",
    metrics: ["500+ courses", "70%↓ errors", "Flask"],
    skills: ["Python", "Flask", "scheduling"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "11",
    code: "RF.2023.11",
    title: "Shohei Home Ground",
    category: "AUTOMATION",
    primarySkill: "Python",
    year: "2023",
    image: "/images/shoheihomeground_1.jpg",
    description: "Automated Instagram posting (685 posts). 11K followers in 8 months.",
    metrics: ["11K followers", "685 posts", "2hr/day↓"],
    skills: ["Python", "automation", "Instagram"],
    links: { instagram: "#", youtube: "#" },
  },
  {
    id: "12",
    code: "RF.2022.12",
    title: "Poker Percentage",
    category: "WATCHOS",
    primarySkill: "WatchKit",
    year: "2022–24",
    image: "/images/poker.png",
    description: "WatchOS poker odds calculator. <10ms lookups via precomputed tables.",
    metrics: ["<10ms", "WatchOS", "precomputed"],
    skills: ["Swift", "WatchOS", "probability"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
]

type Project = (typeof allProjects)[0]

// ─────────────────────────────────────────────────────────────
// TECHNICAL SVG OVERLAY
// ─────────────────────────────────────────────────────────────

function TechOverlay({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const els = ref.current.querySelectorAll("line, path, circle, rect")
    const ctx = gsap.context(() => {
      gsap.fromTo(
        els,
        { strokeDasharray: "0 300", opacity: 0 },
        {
          strokeDasharray: "300 0",
          opacity: 1,
          duration: 1,
          stagger: 0.02,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 92%",
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
      {/* Corner brackets */}
      <path d="M0 8 L0 0 L8 0" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <path d="M92 0 L100 0 L100 8" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <path d="M0 92 L0 100 L8 100" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <path d="M92 100 L100 100 L100 92" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      {/* Top measurement */}
      <line x1="12" y1="3" x2="35" y2="3" stroke="currentColor" strokeWidth="0.3" opacity="0.2" />
      {[15, 20, 25, 30].map((x) => (
        <line key={x} x1={x} y1="1" x2={x} y2="5" stroke="currentColor" strokeWidth="0.3" opacity="0.25" />
      ))}
      {/* Registration mark */}
      <circle cx="95" cy="50" r="2" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.2" />
      <line x1="93" y1="50" x2="97" y2="50" stroke="currentColor" strokeWidth="0.3" opacity="0.2" />
      <line x1="95" y1="48" x2="95" y2="52" stroke="currentColor" strokeWidth="0.3" opacity="0.2" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// BARCODE COMPONENT
// ─────────────────────────────────────────────────────────────

function Barcode({ code, short = false }: { code: string; short?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, scaleX: 0 },
        {
          opacity: 1,
          scaleX: 1,
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

  return (
    <div ref={ref} className="font-mono origin-left">
      <div className="text-[4px] sm:text-[5px] tracking-[0.08em] text-foreground/30 select-none leading-none">
        {short ? ASCII_BARCODE_SHORT : ASCII_BARCODE}
      </div>
      <div className="text-[6px] sm:text-[7px] tracking-[0.2em] text-foreground/50 mt-0.5">
        {code}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT TICKET CARD (Mobile-First)
// ─────────────────────────────────────────────────────────────

function ProjectTicket({ project, index }: { project: Project; index: number }) {
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
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒"
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
                  if (char === " " || char === "+" || char === ".") return char
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
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: imageRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        )
      }

      // Stagger items
      const items = el.querySelectorAll(".reveal")
      gsap.fromTo(
        items,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.04,
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
      className={cn(
        "relative bg-background",
        "border-2 border-foreground",
        "shadow-[3px_3px_0_0_var(--foreground)]",
        "sm:shadow-[4px_4px_0_0_var(--foreground)]",
        "hover:shadow-[5px_5px_0_0_var(--foreground)]",
        "transition-shadow duration-200"
      )}
    >
      <TechOverlay className="opacity-50" />

      {/* MOBILE LAYOUT (default) */}
      <div className="block lg:hidden">
        {/* Header strip */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-dashed border-foreground/30 bg-foreground/[0.02]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg sm:text-xl font-black text-foreground">{project.id}</span>
            <span className="font-mono text-[8px] sm:text-[9px] text-accent tracking-[0.15em]">{project.category}</span>
          </div>
          <span className="font-mono text-[8px] sm:text-[9px] text-foreground/40">{project.year}</span>
        </div>

        {/* Image + Title section */}
        <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-0">
          {/* Image */}
          <div
            ref={imageRef}
            className="relative aspect-square border-r border-dashed border-foreground/30 overflow-hidden bg-foreground/5"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
            {/* Overlay pattern */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-1 left-1 right-1">
              <Barcode code={project.code} short />
            </div>
          </div>

          {/* Main content */}
          <div className="p-3 sm:p-4 flex flex-col justify-between min-h-[100px] sm:min-h-[120px]">
            {/* Primary Skill Title */}
            <div>
              <h3 className="mb-1">
                <span
                  ref={titleRef}
                  className="font-mono text-lg sm:text-xl md:text-2xl font-black text-foreground tracking-tight leading-none block"
                >
                  {project.primarySkill.toUpperCase()}
                </span>
              </h3>
              <p className="reveal font-mono text-[10px] sm:text-xs text-muted-foreground">{project.title}</p>
            </div>

            {/* Metrics */}
            <div className="reveal flex flex-wrap gap-1.5 mt-2">
              {project.metrics.slice(0, 3).map((m, i) => (
                <span
                  key={i}
                  className="font-mono text-[8px] sm:text-[9px] px-1.5 py-0.5 border border-foreground/30 text-foreground/80 bg-foreground/[0.02]"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Description + Skills */}
        <div className="px-3 py-3 sm:px-4 sm:py-4 border-t border-dashed border-foreground/30">
          <p className="reveal text-[11px] sm:text-xs text-foreground/70 leading-relaxed mb-3">
            {project.description}
          </p>
          
          {/* Skills row */}
          <div className="reveal flex flex-wrap gap-1 mb-3">
            {project.skills.map((skill) => (
              <span
                key={skill}
                className="font-mono text-[7px] sm:text-[8px] text-foreground/50 border-b border-dotted border-foreground/20 pb-0.5"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="reveal flex flex-wrap gap-2">
            {hasGithub && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-foreground hover:text-accent transition-colors"
              >
                <Github className="w-3 h-3" />
                <span>SRC</span>
              </a>
            )}
            {hasDemo && (
              <a
                href={(project.links as { demo?: string }).demo}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-foreground hover:text-accent transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>DEMO</span>
              </a>
            )}
            {hasAppStore && (
              <a
                href={(project.links as { appStore?: string }).appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target font-mono text-[9px] sm:text-[10px] text-foreground/60 hover:text-foreground"
              >
                {ASCII_ARROW} iOS
              </a>
            )}
            {hasPlayStore && (
              <a
                href={(project.links as { playStore?: string }).playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target font-mono text-[9px] sm:text-[10px] text-foreground/60 hover:text-foreground"
              >
                {ASCII_ARROW} Android
              </a>
            )}
          </div>
        </div>

        {/* Bottom barcode strip */}
        <div className="px-3 py-1.5 border-t border-foreground/20 bg-foreground/[0.02] flex items-center justify-between">
          <span className="font-mono text-[6px] sm:text-[7px] text-foreground/30 tracking-[0.15em]">{ASCII_DOTS.slice(0, 30)}</span>
          <span className="font-mono text-[7px] sm:text-[8px] text-foreground/40">{project.code}</span>
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden lg:grid lg:grid-cols-[140px_1fr_1fr_160px]">
        {/* Image column */}
        <div className="relative border-r border-dashed border-foreground/30 overflow-hidden bg-foreground/5">
          <div ref={imageRef} className="absolute inset-0">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/30" />
          {/* ID overlay */}
          <div className="absolute top-3 left-3">
            <span className="font-mono text-3xl font-black text-white/90 drop-shadow-lg">{project.id}</span>
          </div>
          {/* Category bottom */}
          <div className="absolute bottom-2 left-2 right-2">
            <span className="font-mono text-[8px] text-white/70 tracking-[0.2em] bg-foreground/60 px-1.5 py-0.5">
              {project.category}
            </span>
          </div>
        </div>

        {/* Primary info */}
        <div className="p-5 border-r border-dashed border-foreground/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[9px] text-foreground/40 tracking-wider">{project.code}</span>
              <span className="font-mono text-[9px] text-foreground/30">·</span>
              <span className="font-mono text-[9px] text-foreground/40">{project.year}</span>
            </div>
            <h3 className="mb-2">
              <span className="font-mono text-2xl xl:text-3xl font-black text-foreground tracking-tight leading-none block">
                {project.primarySkill.toUpperCase()}
              </span>
            </h3>
            <p className="reveal font-mono text-xs text-muted-foreground">{project.title}</p>
          </div>

          {/* Metrics */}
          <div className="reveal flex flex-wrap gap-2 mt-4">
            {project.metrics.map((m, i) => (
              <span
                key={i}
                className="font-mono text-[10px] px-2 py-1 border border-foreground/40 text-foreground bg-foreground/[0.03]"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Description + Skills */}
        <div className="p-5 border-r border-dashed border-foreground/30 flex flex-col justify-between">
          <p className="reveal text-sm text-foreground/75 leading-relaxed">{project.description}</p>
          <div className="reveal flex flex-wrap gap-1.5 mt-4">
            {project.skills.map((skill) => (
              <span
                key={skill}
                className="font-mono text-[9px] text-muted-foreground border-b border-dotted border-foreground/25 pb-0.5"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Links + Barcode */}
        <div className="p-5 flex flex-col justify-between bg-foreground/[0.02]">
          <div className="reveal flex flex-col gap-2">
            {hasGithub && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center gap-2 font-mono text-[10px] text-foreground hover:text-accent transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span className="border-b border-foreground/30">SOURCE</span>
              </a>
            )}
            {hasDemo && (
              <a
                href={(project.links as { demo?: string }).demo}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center gap-2 font-mono text-[10px] text-foreground hover:text-accent transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="border-b border-foreground/30">DEMO</span>
              </a>
            )}
            {hasAppStore && (
              <a
                href={(project.links as { appStore?: string }).appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target font-mono text-[10px] text-foreground/60 hover:text-foreground transition-colors"
              >
                → App Store
              </a>
            )}
            {hasPlayStore && (
              <a
                href={(project.links as { playStore?: string }).playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target font-mono text-[10px] text-foreground/60 hover:text-foreground transition-colors"
              >
                → Play Store
              </a>
            )}
          </div>

          {/* Barcode */}
          <Barcode code={project.code} />
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
    <div ref={ref} className="mb-6">
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {groups.map((group) => {
          const isSelected = selectedGroups.includes(group)
          return (
            <button
              key={group}
              onClick={() => onToggleGroup(group)}
              className={cn(
                "touch-target font-mono text-[9px] sm:text-[10px] px-2 sm:px-3 py-1.5 border-2 transition-all duration-150",
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/30 text-foreground/60 hover:border-foreground hover:text-foreground active:bg-foreground active:text-background"
              )}
            >
              {group}
            </button>
          )
        })}

        {selectedGroups.length > 0 && (
          <button
            onClick={onClearFilters}
            className="touch-target flex items-center gap-1 font-mono text-[9px] sm:text-[10px] text-muted-foreground hover:text-foreground px-2 py-1 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Count */}
      <div className="flex items-center gap-2 mt-3 font-mono text-[8px] sm:text-[9px] text-foreground/40">
        <span className="text-foreground/60">{resultCount}</span>
        <span>/</span>
        <span>{totalCount}</span>
        {selectedGroups.length > 0 && <span className="text-accent">•</span>}
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
  const lineRef = useRef<HTMLDivElement>(null)

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
              iteration += 0.35
            }, 35)
          },
        })
      }

      // Line draw
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: lineRef.current,
              start: "top 92%",
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
      {/* Section number + Title */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[8px] sm:text-[9px] text-foreground/40 tracking-[0.2em] mb-1">
            — 04
          </p>
          <h2
            ref={titleRef}
            className="font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tighter leading-none"
          >
            PROJECTS
          </h2>
        </div>
        <span className="font-mono text-xl sm:text-2xl md:text-3xl font-black text-foreground/15 tabular-nums pb-0.5">
          {String(count).padStart(2, "0")}
        </span>
      </div>

      {/* Animated line */}
      <div className="mt-3 flex items-center gap-2">
        <div ref={lineRef} className="h-0.5 sm:h-1 w-10 sm:w-14 bg-foreground origin-left" />
        <div className="h-px flex-1 bg-foreground/15" />
        <div className="flex gap-0.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-foreground/20" />
          ))}
        </div>
      </div>

      {/* ASCII decoration */}
      <div className="font-mono text-[6px] sm:text-[7px] text-foreground/15 mt-2 overflow-hidden select-none">
        {ASCII_LINE}
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
      className="relative py-10 sm:py-14 md:py-18 lg:py-24 px-3 sm:px-5 md:px-6 bg-background"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="w-full h-full opacity-[0.015]" preserveAspectRatio="none">
          {[...Array(20)].map((_, i) => (
            <line key={`v-${i}`} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke="currentColor" strokeWidth="1" />
          ))}
          {[...Array(80)].map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={`${i * 1.25}%`} x2="100%" y2={`${i * 1.25}%`} stroke="currentColor" strokeWidth="0.5" />
          ))}
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative">
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
          <div className="text-center py-10 border border-dashed border-foreground/20">
            <pre className="font-mono text-[9px] text-foreground/30 mb-3">
              {`┌─────────────┐
│  NO MATCH   │
└─────────────┘`}
            </pre>
            <button
              onClick={clearFilters}
              className="font-mono text-[9px] sm:text-[10px] border border-foreground/40 px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors"
            >
              RESET
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 lg:space-y-5">
            {displayedProjects.map((project, index) => (
              <ProjectTicket key={project.id} project={project} index={index} />
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
                "px-5 sm:px-6 py-2.5 sm:py-3",
                "font-mono text-[9px] sm:text-[10px] tracking-[0.12em]",
                "border-2 border-foreground bg-foreground text-background",
                "hover:bg-background hover:text-foreground active:scale-[0.98] transition-all",
                "shadow-[2px_2px_0_0_var(--foreground)]",
                "sm:shadow-[3px_3px_0_0_var(--foreground)]"
              )}
            >
              <span>+{remaining}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* End */}
        {showAll && (
          <div className="mt-8 sm:mt-10 text-center">
            <div className="font-mono text-[6px] sm:text-[7px] text-foreground/15 select-none mb-3">
              {ASCII_DOTS}
            </div>
            <a
              href="#contact"
              className="touch-target inline-flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-foreground/40 hover:text-foreground transition-colors"
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
