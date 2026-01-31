"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Github, X } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// ASCII PATTERNS & DECORATIVE ELEMENTS
// ─────────────────────────────────────────────────────────────

const ASCII_BARCODE = `█▌▐█▌▐▌█▐█▌▐▌▐█▌▐█▌█▐▌▐█▌█▐█▌▐▌▐█▌█▐█`

const ASCII_HEADER = `
╔══════════════════════════════════════════════════════════════════════════════════════════════════════╗
║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║  ██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗███████╗                                   ║
║  ██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝██╔════╝                                   ║
║  ██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║   ███████╗                                   ║
║  ██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║   ╚════██║                                   ║
║  ██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║   ███████║                                   ║
║  ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝                                   ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════╝`.trim()

const ASCII_MINI = `
┌──────────────────────────────────────────────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
└──────────────────────────────────────────────────────────────────────────────┘`.trim()

const ASCII_GRID = `
┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼
`.trim()

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
    description:
      "Full-stack e-commerce using React 19, SwiftUI, Firebase. Real-time order processing, FCM/APNs push. Barcode verification (AVFoundation, JsBarcode CODE128), 11+ formats, 50%+ faster in-store lookup.",
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
    description:
      "Swift/SwiftUI email client with Google Mail API, Firebase, AI reasoning engine. 90–95% classification accuracy, 100–300ms inference. Multi-stage decision system: top-3 actions from 20 contextual behaviors.",
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
    description:
      "Serverless orchestration for dynamic AI routing across 30+ researchers and multi-lab workflows. Sub-200ms Cloud Functions response. Metadata-aware prompting for task summaries and automated decision support.",
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
    description:
      "Live shuttle tracking for 25+ daily users on iOS, Android, web. 70%+ reduction in duplicate pickups via event serialization. Real-time sync under 100ms latency.",
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
    description:
      "Synchronized iOS+Android apps for live event updates (50+ users). 99%+ cross-device sync reliability across unstable networks.",
    metrics: ["50+ users", "99%↑ sync", "iOS+Android"],
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
    description:
      "Transformer-based vision inference at 150–200ms latency; real-time CRDT-like collaboration. 5+ concurrent users with multi-user async WebSocket pipeline.",
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
    description:
      "Offline-capable LLM chat using GGUF + llama.cpp, <50ms/token local inference. 2GB+ memory savings via quantization. MVVM SwiftUI architecture.",
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
    description:
      "Client-side performance tuning: 40–60% faster load. Modular components for rapid iteration. Brutalist design system with GSAP animations.",
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
    description:
      "Swift/SwiftUI time zone coordination tool; 50 users at launch. 4-week idea-to-launch cycle with App Store deployment.",
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
    description:
      "Python Flask scheduler for 500+ courses with real-time conflict detection. 70%+ fewer scheduling errors for 100–300+ students.",
    metrics: ["500+ courses", "70%↓ errors", "Flask"],
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
    description:
      "Automated daily Instagram posting (685 posts), 11K followers in 8 months. Python automation saved 2+ hours/day.",
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
    description:
      "WatchOS poker odds calculator, <10ms probability lookups via precomputed tables. Real-time equity insights on wrist.",
    metrics: ["<10ms", "WatchOS", "precomputed"],
    skills: ["Swift", "WatchOS", "probability"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
]

type Project = (typeof allProjects)[0]

const allSkills = [...new Set(allProjects.flatMap((p) => p.skills))].sort()

// ─────────────────────────────────────────────────────────────
// TECHNICAL SVG PATTERNS
// ─────────────────────────────────────────────────────────────

function TechnicalOverlay({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const paths = svgRef.current.querySelectorAll("line, path, circle")
    const ctx = gsap.context(() => {
      gsap.fromTo(
        paths,
        { strokeDasharray: "0 500", opacity: 0 },
        {
          strokeDasharray: "500 0",
          opacity: 1,
          duration: 1.2,
          stagger: 0.03,
          ease: "power2.out",
          scrollTrigger: {
            trigger: svgRef.current,
            start: "top 90%",
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
      viewBox="0 0 400 100"
      preserveAspectRatio="none"
    >
      {/* Corner brackets */}
      <path d="M0 15 L0 0 L15 0" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <path d="M385 0 L400 0 L400 15" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <path d="M0 85 L0 100 L15 100" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <path d="M385 100 L400 100 L400 85" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      
      {/* Horizontal measurement lines */}
      <line x1="20" y1="8" x2="80" y2="8" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <line x1="320" y1="8" x2="380" y2="8" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      
      {/* Vertical tick marks */}
      {[25, 35, 45, 55, 65, 75].map((x) => (
        <line key={x} x1={x} y1="5" x2={x} y2="11" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      ))}
      
      {/* Registration marks */}
      <circle cx="390" cy="50" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="387" y1="50" x2="393" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="390" y1="47" x2="390" y2="53" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// ASCII BARCODE
// ─────────────────────────────────────────────────────────────

function Barcode({ code, className }: { code: string; className?: string }) {
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
          duration: 0.6,
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
    <div ref={ref} className={cn("font-mono origin-left", className)}>
      <div className="text-[5px] sm:text-[6px] tracking-[0.1em] text-foreground/40 select-none leading-none">
        {ASCII_BARCODE}
      </div>
      <div className="text-[7px] sm:text-[8px] tracking-[0.25em] text-foreground/60 mt-0.5">
        {code}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT CARD
// ─────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const skillRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!cardRef.current) return
    const el = cardRef.current

    const ctx = gsap.context(() => {
      // Card entrance
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      )

      // Primary skill scramble
      if (skillRef.current) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+#@"
        const originalText = project.primarySkill.toUpperCase()
        let iteration = 0

        ScrollTrigger.create({
          trigger: skillRef.current,
          start: "top 88%",
          onEnter: () => {
            const interval = setInterval(() => {
              if (!skillRef.current) return clearInterval(interval)
              skillRef.current.textContent = originalText
                .split("")
                .map((char, i) => {
                  if (char === " " || char === "+") return char
                  if (i < iteration) return char
                  return chars[Math.floor(Math.random() * chars.length)]
                })
                .join("")
              if (iteration >= originalText.length) clearInterval(interval)
              iteration += 0.4
            }, 30)
          },
        })
      }

      // Stagger inner elements
      const items = el.querySelectorAll(".reveal-item")
      gsap.fromTo(
        items,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
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
        "relative group",
        "bg-background border-2 border-foreground",
        "shadow-[4px_4px_0_0_var(--foreground)]",
        "hover:shadow-[6px_6px_0_0_var(--foreground)]",
        "transition-shadow duration-200"
      )}
    >
      <TechnicalOverlay className="opacity-60" />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] lg:grid-cols-[1.2fr_1fr_auto]">
        {/* LEFT: Primary info */}
        <div className="p-4 sm:p-5 lg:p-6 border-b md:border-b-0 md:border-r border-dashed border-foreground/30">
          {/* Category + Code */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="font-mono text-[10px] sm:text-xs text-accent tracking-[0.2em] font-medium">
              {project.category}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] text-foreground/40 tracking-wider">
              {project.code}
            </span>
          </div>

          {/* Primary Skill - MAIN TITLE */}
          <h3 className="mb-2">
            <span
              ref={skillRef}
              className="font-mono text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-none block"
            >
              {project.primarySkill.toUpperCase()}
            </span>
          </h3>

          {/* Project name - secondary */}
          <p className="reveal-item font-mono text-xs sm:text-sm text-muted-foreground mb-4">
            {project.title}
          </p>

          {/* Metrics row */}
          <div className="reveal-item flex flex-wrap gap-2">
            {project.metrics.map((m, i) => (
              <span
                key={i}
                className="font-mono text-[10px] sm:text-xs px-2 py-1 border border-foreground/40 text-foreground bg-foreground/5"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* CENTER: Description + Skills */}
        <div className="p-4 sm:p-5 lg:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-dashed border-foreground/30">
          <p className="reveal-item text-xs sm:text-sm text-foreground/80 leading-relaxed mb-4">
            {project.description}
          </p>

          {/* Skills */}
          <div className="reveal-item flex flex-wrap gap-1.5">
            {project.skills.map((skill) => (
              <span
                key={skill}
                className="font-mono text-[8px] sm:text-[10px] text-muted-foreground border-b border-dotted border-foreground/30 pb-0.5"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT: Links + Barcode */}
        <div className="p-4 sm:p-5 lg:p-6 flex flex-col justify-between min-w-[140px] lg:min-w-[160px]">
          {/* Year + ID */}
          <div className="reveal-item flex items-baseline justify-between mb-4">
            <span className="font-mono text-2xl sm:text-3xl font-black text-foreground tabular-nums">
              {project.id}
            </span>
            <span className="font-mono text-[10px] sm:text-xs text-muted-foreground">
              {project.year}
            </span>
          </div>

          {/* Links */}
          <div className="reveal-item flex flex-col gap-2 mb-4">
            {hasGithub && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-foreground hover:text-accent transition-colors"
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
                className="touch-target inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-foreground hover:text-accent transition-colors"
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
                className="touch-target font-mono text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                → App Store
              </a>
            )}
            {hasPlayStore && (
              <a
                href={(project.links as { playStore?: string }).playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target font-mono text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                → Play Store
              </a>
            )}
          </div>

          {/* Barcode */}
          <Barcode code={project.code} className="mt-auto" />
        </div>
      </div>
    </article>
  )
}

// ─────────────────────────────────────────────────────────────
// FILTER COMPONENT
// ─────────────────────────────────────────────────────────────

function FilterPanel({
  skills,
  selectedSkills,
  onToggleSkill,
  onClearFilters,
}: {
  skills: string[]
  selectedSkills: string[]
  onToggleSkill: (skill: string) => void
  onClearFilters: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: -20 },
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

  return (
    <div ref={ref} className="mb-8 sm:mb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-3 pb-2 border-b border-foreground/30">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] sm:text-xs text-muted-foreground tracking-[0.15em]">
            FILTER
          </span>
          {selectedSkills.length > 0 && (
            <span className="font-mono text-[10px] sm:text-xs text-accent">
              [{selectedSkills.length}]
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedSkills.length > 0 && (
            <button
              onClick={onClearFilters}
              className="touch-target flex items-center gap-1 font-mono text-[10px] sm:text-xs text-muted-foreground hover:text-foreground px-2 py-1 transition-colors"
            >
              <X className="w-3 h-3" />
              CLEAR
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="touch-target font-mono text-[10px] sm:text-xs border border-foreground/40 px-2 py-1 hover:bg-foreground hover:text-background transition-colors"
          >
            {expanded ? "−" : "+"}
          </button>
        </div>
      </div>

      {/* Active filters */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {selectedSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => onToggleSkill(skill)}
              className="inline-flex items-center gap-1 font-mono text-[10px] sm:text-xs px-2 py-1 border border-foreground bg-foreground text-background hover:bg-accent transition-colors"
            >
              {skill}
              <X className="w-2.5 h-2.5" />
            </button>
          ))}
        </div>
      )}

      {/* Skills grid */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          expanded ? "max-h-[400px]" : "max-h-[60px] sm:max-h-[70px]"
        )}
      >
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => {
            const isSelected = selectedSkills.includes(skill)
            return (
              <button
                key={skill}
                onClick={() => onToggleSkill(skill)}
                className={cn(
                  "font-mono text-[9px] sm:text-[10px] px-2 py-1 border transition-all",
                  isSelected
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/30 text-foreground/60 hover:border-foreground hover:text-foreground"
                )}
              >
                {skill}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────

function SectionHeader({ count }: { count: number }) {
  const headerRef = useRef<HTMLDivElement>(null)
  const asciiRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    if (!headerRef.current) return
    const ctx = gsap.context(() => {
      // ASCII reveal
      if (asciiRef.current) {
        gsap.fromTo(
          asciiRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: asciiRef.current,
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
    <div ref={headerRef} className="mb-8 sm:mb-12 relative">
      {/* ASCII Header - Desktop */}
      <pre
        ref={asciiRef}
        className="font-mono text-[4px] sm:text-[5px] md:text-[6px] lg:text-[7px] text-foreground/25 overflow-x-auto whitespace-pre select-none mb-4 hidden md:block leading-tight"
      >
        {ASCII_HEADER}
      </pre>

      {/* ASCII Header - Mobile */}
      <pre className="font-mono text-[5px] sm:text-[6px] text-foreground/25 overflow-x-auto whitespace-pre select-none mb-4 md:hidden leading-tight">
        {ASCII_MINI}
      </pre>

      {/* Title row */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] sm:text-[10px] text-muted-foreground tracking-[0.25em] mb-1">
            — 04
          </p>
          <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tighter leading-none">
            WORK
          </h2>
        </div>
        <div className="text-right">
          <span className="font-mono text-3xl sm:text-4xl lg:text-5xl font-black text-foreground/20 tabular-nums">
            {String(count).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Underline */}
      <div className="mt-3 sm:mt-4 flex items-center gap-3">
        <div className="h-1 w-12 sm:w-16 bg-foreground" />
        <div className="h-px flex-1 bg-foreground/20" />
        <div className="flex gap-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-foreground/30" />
          ))}
        </div>
      </div>

      {/* Grid reference */}
      <pre className="font-mono text-[8px] sm:text-[9px] text-foreground/20 mt-2 select-none hidden sm:block">
        {ASCII_GRID}
      </pre>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [showAll, setShowAll] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const toggleSkill = useCallback((skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }, [])

  const clearFilters = useCallback(() => {
    setSelectedSkills([])
  }, [])

  const filteredProjects = useMemo(() => {
    if (selectedSkills.length === 0) return allProjects
    return allProjects.filter((project) =>
      selectedSkills.every((skill) => project.skills.includes(skill))
    )
  }, [selectedSkills])

  const INITIAL_VISIBLE = 4
  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, INITIAL_VISIBLE)
  const remaining = filteredProjects.length - INITIAL_VISIBLE

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={cn(
        "relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6",
        "bg-background"
      )}
    >
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.02]">
        <svg className="w-full h-full" preserveAspectRatio="none">
          {[...Array(25)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={`${i * 4}%`}
              y1="0"
              x2={`${i * 4}%`}
              y2="100%"
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
          {[...Array(100)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={`${i}%`}
              x2="100%"
              y2={`${i}%`}
              stroke="currentColor"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative">
        <SectionHeader count={allProjects.length} />

        <FilterPanel
          skills={allSkills}
          selectedSkills={selectedSkills}
          onToggleSkill={toggleSkill}
          onClearFilters={clearFilters}
        />

        {/* Count display */}
        <div className="flex items-center gap-2 mb-6 font-mono text-[9px] sm:text-[10px] text-muted-foreground">
          <span>{displayedProjects.length}</span>
          <span className="text-foreground/30">/</span>
          <span>{filteredProjects.length}</span>
          {selectedSkills.length > 0 && (
            <span className="text-accent ml-1">•</span>
          )}
        </div>

        {/* Projects */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-foreground/20">
            <pre className="font-mono text-[10px] text-foreground/30 mb-3">
              {`
  ┌─────────────┐
  │  NO MATCH   │
  └─────────────┘
              `}
            </pre>
            <button
              onClick={clearFilters}
              className="font-mono text-[10px] sm:text-xs border border-foreground/50 px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors"
            >
              RESET
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {displayedProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        {/* Load more */}
        {!showAll && remaining > 0 && (
          <div className="mt-8 sm:mt-10 flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className={cn(
                "touch-target group",
                "px-6 sm:px-8 py-3 sm:py-4",
                "font-mono text-[10px] sm:text-xs tracking-[0.15em]",
                "border-2 border-foreground bg-foreground text-background",
                "hover:bg-background hover:text-foreground transition-colors",
                "shadow-[3px_3px_0_0_var(--foreground)]",
                "hover:shadow-[4px_4px_0_0_var(--foreground)]"
              )}
            >
              <span>+{remaining} MORE</span>
            </button>
          </div>
        )}

        {/* End marker */}
        {showAll && (
          <div className="mt-10 sm:mt-12 text-center">
            <pre className="font-mono text-[8px] sm:text-[9px] text-foreground/20 select-none">
              {`
┌────────────────────────────────────────┐
│            END OF MANIFEST             │
└────────────────────────────────────────┘
              `}
            </pre>
            <a
              href="#contact"
              className="touch-target inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors mt-3"
            >
              ↓ NEXT
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
