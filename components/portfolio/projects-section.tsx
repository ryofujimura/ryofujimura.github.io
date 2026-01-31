"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Github, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// NEURAL ASCII PATTERNS
// ─────────────────────────────────────────────────────────────

const ASCII_NEURON = `
    ○
   /|\\
  / | \\
 ●──●──●
  \\ | /
   \\|/
    ○
`.trim()

const ASCII_SYNAPSE = `◐━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◑`

const ASCII_WAVE = `∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿`

const ASCII_DENDRITE = `──●──●──●──●──●──●──●──●──●──●──●──●──`

const ASCII_SCAN = `
┌─────────────────────────────────────┐
│ ▓▓▓▓░░▓▓░░░▓▓▓░░▓░░▓▓▓▓░░▓▓░░░▓▓▓░ │
│ ░▓▓░░▓▓▓░▓▓░░▓▓░▓▓░░▓░░▓▓▓░▓▓░░▓▓░ │
│ ▓░░▓▓░░▓▓▓░▓░░▓▓░░▓▓▓░░▓▓▓░▓░░▓▓░░ │
└─────────────────────────────────────┘
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
    code: "NRN.2024.01",
    title: "Saboriendo Bakery Platform",
    region: "CORTEX-A",
    primarySkill: "React + SwiftUI",
    year: "2024",
    image: "/images/default_image.png",
    description:
      "Full-stack e-commerce using React 19, SwiftUI, Firebase. Real-time order processing, FCM/APNs push. Barcode verification, 11+ formats.",
    metrics: ["50%↑", "11+ formats", "3 lang"],
    skills: ["React 19", "SwiftUI", "Firebase", "Firestore", "AVFoundation"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "02",
    code: "NRN.2025.02",
    title: "Zero Inbox",
    region: "CORTEX-B",
    primarySkill: "Swift + AI Engine",
    year: "2025",
    image: "/images/default_image.png",
    description:
      "Swift/SwiftUI email client with Google Mail API, Firebase, AI reasoning engine. 90–95% classification accuracy, 100–300ms inference.",
    metrics: ["95% acc", "200ms", "50-200/min"],
    skills: ["Swift", "SwiftUI", "Firebase", "AI/ML", "Google APIs"],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
  },
  {
    id: "03",
    code: "NRN.2025.03",
    title: "Research Lab Management",
    region: "CORTEX-C",
    primarySkill: "Cloud Functions",
    year: "2025",
    image: "/images/default_image.png",
    description:
      "Serverless orchestration for dynamic AI routing across 30+ researchers. Sub-200ms Cloud Functions response.",
    metrics: ["<200ms", "30+ users", "multi-lab"],
    skills: ["Cloud Functions", "Firebase", "AI routing", "Node.js"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "04",
    code: "NRN.2025.04",
    title: "HTIC Shuttle",
    region: "CORTEX-D",
    primarySkill: "Firebase RTDB",
    year: "2025",
    image: "/images/schedule.jpg",
    description:
      "Live shuttle tracking for 25+ daily users on iOS, Android, web. 70%+ reduction in duplicate pickups.",
    metrics: ["25+ DAU", "70%↓", "<100ms"],
    skills: ["Swift", "Kotlin", "Firebase RTDB", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
  },
  {
    id: "05",
    code: "NRN.2025.05",
    title: "CyberEdu",
    region: "CORTEX-E",
    primarySkill: "Swift + Kotlin",
    year: "2025",
    image: "/images/CyberEdu.png",
    description:
      "Synchronized iOS+Android apps for live event updates. 99%+ cross-device sync reliability.",
    metrics: ["50+ users", "99%↑", "iOS+Android"],
    skills: ["Swift", "Kotlin", "Firebase", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
  },
  {
    id: "06",
    code: "NRN.2025.06",
    title: "Whiteboard AI",
    region: "CORTEX-F",
    primarySkill: "PyTorch + WebSocket",
    year: "2025",
    image: "/images/whiteboardai.png",
    description:
      "Transformer-based vision inference at 150–200ms latency; real-time CRDT-like collaboration.",
    metrics: ["150ms", "5+ users", "CRDT"],
    skills: ["PyTorch", "Vision", "WebSocket", "React"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "07",
    code: "NRN.2024.07",
    title: "With",
    region: "CORTEX-G",
    primarySkill: "llama.cpp + Swift",
    year: "2024–25",
    image: "/images/default_image.png",
    description:
      "Offline-capable LLM chat using GGUF + llama.cpp, <50ms/token local inference. 2GB+ memory savings.",
    metrics: ["<50ms/tok", "2GB↓", "offline"],
    skills: ["Swift", "llama.cpp", "GGUF", "SwiftUI"],
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "08",
    code: "NRN.2024.08",
    title: "Portfolio Website",
    region: "CORTEX-H",
    primarySkill: "Next.js + GSAP",
    year: "2024–25",
    image: "/images/homepage.png",
    description:
      "Client-side performance tuning: 40–60% faster load. Brutalist design with GSAP animations.",
    metrics: ["40-60%↑", "modular", "Vercel"],
    skills: ["React", "Next.js", "Tailwind", "Vercel"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "09",
    code: "NRN.2024.09",
    title: "Matcha Time",
    region: "CORTEX-I",
    primarySkill: "SwiftUI Native",
    year: "2024",
    image: "/images/matchatime_1.jpg",
    description:
      "Swift/SwiftUI time zone coordination tool; 50 users at launch. 4-week idea-to-launch cycle.",
    metrics: ["50 users", "4 weeks", "App Store"],
    skills: ["Swift", "SwiftUI", "App Store"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#" },
  },
  {
    id: "10",
    code: "NRN.2023.10",
    title: "Schedule Mastermind",
    region: "CORTEX-J",
    primarySkill: "Python Flask",
    year: "2023–24",
    image: "/images/schedule.jpg",
    description:
      "Python Flask scheduler for 500+ courses with real-time conflict detection.",
    metrics: ["500+ courses", "70%↓ errors", "Flask"],
    skills: ["Python", "Flask", "scheduling"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "11",
    code: "NRN.2023.11",
    title: "Shohei Home Ground",
    region: "CORTEX-K",
    primarySkill: "Python Scripts",
    year: "2023",
    image: "/images/shoheihomeground_1.jpg",
    description:
      "Automated daily Instagram posting (685 posts), 11K followers in 8 months.",
    metrics: ["11K followers", "685 posts", "2hr/day↓"],
    skills: ["Python", "automation", "Instagram"],
    links: { instagram: "#", youtube: "#" },
  },
  {
    id: "12",
    code: "NRN.2022.12",
    title: "Poker Percentage",
    region: "CORTEX-L",
    primarySkill: "WatchKit + Swift",
    year: "2022–24",
    image: "/images/poker.png",
    description:
      "WatchOS poker odds calculator, <10ms probability lookups via precomputed tables.",
    metrics: ["<10ms", "WatchOS", "precomputed"],
    skills: ["Swift", "WatchOS", "probability"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
]

type Project = (typeof allProjects)[0]

// ─────────────────────────────────────────────────────────────
// NEURAL NETWORK SVG BACKGROUND
// ─────────────────────────────────────────────────────────────

function NeuralBackground() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const nodes = svgRef.current.querySelectorAll(".neural-node")
    const paths = svgRef.current.querySelectorAll(".neural-path")

    const ctx = gsap.context(() => {
      // Animate paths
      gsap.fromTo(
        paths,
        { strokeDasharray: "0 1000", opacity: 0 },
        {
          strokeDasharray: "1000 0",
          opacity: 0.15,
          duration: 3,
          stagger: 0.1,
          ease: "power1.out",
        }
      )

      // Pulse nodes
      gsap.to(nodes, {
        scale: 1.2,
        opacity: 0.4,
        duration: 2,
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
      {/* Neural connection paths */}
      <path className="neural-path" d="M10,20 Q30,10 50,25 T90,20" fill="none" stroke="currentColor" strokeWidth="0.2" />
      <path className="neural-path" d="M5,50 Q25,40 45,55 T95,45" fill="none" stroke="currentColor" strokeWidth="0.2" />
      <path className="neural-path" d="M15,80 Q35,70 55,85 T85,75" fill="none" stroke="currentColor" strokeWidth="0.2" />
      <path className="neural-path" d="M20,10 L40,30 L60,15 L80,35" fill="none" stroke="currentColor" strokeWidth="0.15" />
      <path className="neural-path" d="M10,60 L30,40 L50,65 L70,45 L90,70" fill="none" stroke="currentColor" strokeWidth="0.15" />
      
      {/* Neural nodes */}
      <circle className="neural-node" cx="10" cy="20" r="1" fill="currentColor" opacity="0.2" />
      <circle className="neural-node" cx="50" cy="25" r="1.5" fill="currentColor" opacity="0.2" />
      <circle className="neural-node" cx="90" cy="20" r="1" fill="currentColor" opacity="0.2" />
      <circle className="neural-node" cx="30" cy="50" r="1" fill="currentColor" opacity="0.2" />
      <circle className="neural-node" cx="70" cy="55" r="1.2" fill="currentColor" opacity="0.2" />
      <circle className="neural-node" cx="45" cy="80" r="1" fill="currentColor" opacity="0.2" />
      <circle className="neural-node" cx="85" cy="75" r="1.5" fill="currentColor" opacity="0.2" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// NEURAL SCAN OVERLAY FOR CARDS
// ─────────────────────────────────────────────────────────────

function NeuralScanOverlay({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const elements = svgRef.current.querySelectorAll("line, path, circle")

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elements,
        { strokeDasharray: "0 200", opacity: 0 },
        {
          strokeDasharray: "200 0",
          opacity: 1,
          duration: 1,
          stagger: 0.02,
          ease: "power2.out",
          scrollTrigger: {
            trigger: svgRef.current,
            start: "top 92%",
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
      {/* Corner markers - surgical precision */}
      <path d="M0 8 L0 0 L8 0" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <path d="M92 0 L100 0 L100 8" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <path d="M0 92 L0 100 L8 100" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <path d="M92 100 L100 100 L100 92" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      
      {/* Measurement ticks */}
      {[20, 40, 60, 80].map((x) => (
        <line key={`t-${x}`} x1={x} y1="0" x2={x} y2="2" stroke="currentColor" strokeWidth="0.3" opacity="0.3" />
      ))}
      {[20, 40, 60, 80].map((y) => (
        <line key={`l-${y}`} x1="0" y1={y} x2="2" y2={y} stroke="currentColor" strokeWidth="0.3" opacity="0.3" />
      ))}
      
      {/* Crosshair reference */}
      <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.1" strokeDasharray="2 2" />
      <line x1="35" y1="50" x2="45" y2="50" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
      <line x1="55" y1="50" x2="65" y2="50" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
      <line x1="50" y1="35" x2="50" y2="45" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
      <line x1="50" y1="55" x2="50" y2="65" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT CARD - NEURAL SCAN STYLE
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
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+.#"
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

      // Image scan effect
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: imageRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        )
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
        "bg-background",
        "border border-foreground/30",
        "hover:border-foreground/60",
        "transition-colors duration-300"
      )}
    >
      <NeuralScanOverlay className="opacity-40 group-hover:opacity-60 transition-opacity" />

      {/* Mobile-first: Stack layout */}
      <div className="flex flex-col">
        {/* TOP: Image + Region tag */}
        <div className="relative">
          {/* Region tag - positioned absolute */}
          <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
            <span className="font-mono text-[8px] sm:text-[9px] px-1.5 py-0.5 bg-background/90 border border-foreground/40 text-foreground/70 tracking-wider">
              {project.region}
            </span>
            <span className="font-mono text-[8px] sm:text-[9px] text-foreground/50">
              {project.code}
            </span>
          </div>

          {/* ID badge - top right */}
          <div className="absolute top-2 right-2 z-10">
            <span className="font-mono text-lg sm:text-xl font-black text-foreground/20">
              {project.id}
            </span>
          </div>

          {/* Image container */}
          <div
            ref={imageRef}
            className="relative w-full aspect-[16/9] sm:aspect-[2/1] overflow-hidden bg-foreground/5"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              loading="lazy"
            />
            {/* Scan line overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/5 to-transparent pointer-events-none" />
          </div>

          {/* Neural wave decoration under image */}
          <div className="font-mono text-[6px] sm:text-[7px] text-foreground/20 overflow-hidden leading-none select-none px-3 py-1 bg-foreground/[0.02]">
            {ASCII_WAVE}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-3 sm:p-4">
          {/* Primary Skill - Main Title */}
          <h3 className="mb-1">
            <span
              ref={titleRef}
              className="font-mono text-lg sm:text-xl md:text-2xl font-black text-foreground tracking-tight leading-tight block"
            >
              {project.primarySkill.toUpperCase()}
            </span>
          </h3>

          {/* Project name + Year */}
          <div className="reveal flex items-baseline justify-between gap-2 mb-2">
            <p className="font-mono text-[11px] sm:text-xs text-muted-foreground truncate">
              {project.title}
            </p>
            <span className="font-mono text-[10px] sm:text-[11px] text-foreground/40 shrink-0">
              {project.year}
            </span>
          </div>

          {/* Description */}
          <p className="reveal text-[11px] sm:text-xs text-foreground/70 leading-relaxed mb-3 line-clamp-2 sm:line-clamp-none">
            {project.description}
          </p>

          {/* Metrics row */}
          <div className="reveal flex flex-wrap gap-1.5 mb-3">
            {project.metrics.map((m, i) => (
              <span
                key={i}
                className="font-mono text-[9px] sm:text-[10px] px-1.5 py-0.5 border border-foreground/30 text-foreground/80 bg-foreground/[0.02]"
              >
                {m}
              </span>
            ))}
          </div>

          {/* Skills */}
          <div className="reveal flex flex-wrap gap-1 mb-3">
            {project.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="font-mono text-[8px] sm:text-[9px] text-muted-foreground"
              >
                {skill}
                <span className="text-foreground/20 ml-1">·</span>
              </span>
            ))}
            {project.skills.length > 4 && (
              <span className="font-mono text-[8px] sm:text-[9px] text-foreground/40">
                +{project.skills.length - 4}
              </span>
            )}
          </div>

          {/* Links row */}
          <div className="reveal flex flex-wrap items-center gap-2 pt-2 border-t border-dashed border-foreground/20">
            {hasGithub && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-foreground/70 hover:text-foreground transition-colors"
              >
                <Github className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>SRC</span>
              </a>
            )}
            {hasDemo && (
              <a
                href={(project.links as { demo?: string }).demo}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-foreground/70 hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>DEMO</span>
              </a>
            )}
            {hasAppStore && (
              <a
                href={(project.links as { appStore?: string }).appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target font-mono text-[9px] sm:text-[10px] text-foreground/50 hover:text-foreground transition-colors"
              >
                iOS
              </a>
            )}
            {hasPlayStore && (
              <a
                href={(project.links as { playStore?: string }).playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target font-mono text-[9px] sm:text-[10px] text-foreground/50 hover:text-foreground transition-colors"
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
// FILTER COMPONENT
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
  const groups = Object.keys(SKILL_GROUPS) as SkillGroup[]

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

  return (
    <div ref={ref} className="mb-4 sm:mb-6">
      {/* Filter pills - horizontal scroll on mobile */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap">
        {groups.map((group) => {
          const isSelected = selectedGroups.includes(group)
          return (
            <button
              key={group}
              onClick={() => onToggleGroup(group)}
              className={cn(
                "touch-target shrink-0 font-mono text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-1.5 border transition-all duration-200",
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/30 text-foreground/60 hover:border-foreground/60 hover:text-foreground"
              )}
            >
              {group}
            </button>
          )
        })}

        {selectedGroups.length > 0 && (
          <button
            onClick={onClearFilters}
            className="touch-target shrink-0 flex items-center gap-1 font-mono text-[10px] sm:text-[11px] text-foreground/50 hover:text-foreground px-2 py-1 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────

function SectionHeader({ count, filteredCount }: { count: number; filteredCount: number }) {
  const headerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!headerRef.current) return
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ░▒▓█○●◐◑"
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
    }, headerRef.current)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={headerRef} className="mb-4 sm:mb-6">
      {/* ASCII neuron decoration */}
      <pre className="font-mono text-[6px] sm:text-[7px] text-foreground/15 select-none mb-2 leading-tight hidden sm:block">
        {ASCII_NEURON}
      </pre>

      {/* Title row */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[8px] sm:text-[9px] text-foreground/40 tracking-[0.2em] mb-0.5">
            NEURAL.MAP.04
          </p>
          <h2
            ref={titleRef}
            className="font-mono text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tighter leading-none"
          >
            PROJECTS
          </h2>
        </div>
        <div className="text-right">
          <span className="font-mono text-xs sm:text-sm text-foreground/30">
            {filteredCount}/{count}
          </span>
        </div>
      </div>

      {/* Synapse line */}
      <div className="mt-2 sm:mt-3 font-mono text-[6px] sm:text-[7px] text-foreground/20 overflow-hidden select-none">
        {ASCII_SYNAPSE}
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
      className="relative py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 bg-background overflow-hidden"
    >
      {/* Neural background */}
      <NeuralBackground />

      <div className="max-w-5xl mx-auto relative">
        <SectionHeader count={allProjects.length} filteredCount={filteredProjects.length} />

        <FilterBar
          selectedGroups={selectedGroups}
          onToggleGroup={toggleGroup}
          onClearFilters={clearFilters}
        />

        {/* Projects grid - 1 col mobile, 2 col tablet+ */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-8 sm:py-12 border border-dashed border-foreground/20">
            <pre className="font-mono text-[8px] sm:text-[9px] text-foreground/25 mb-2">
              {ASCII_SCAN}
            </pre>
            <p className="font-mono text-[10px] sm:text-xs text-foreground/40 mb-3">
              NO SIGNAL DETECTED
            </p>
            <button
              onClick={clearFilters}
              className="font-mono text-[10px] sm:text-xs border border-foreground/40 px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors"
            >
              RESET SCAN
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {displayedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
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
                "border border-foreground/40 text-foreground/70",
                "hover:border-foreground hover:text-foreground hover:bg-foreground/5",
                "transition-all duration-200"
              )}
            >
              <span>+{remaining} NODES</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* End marker */}
        {showAll && (
          <div className="mt-8 sm:mt-10 text-center">
            <div className="font-mono text-[6px] sm:text-[7px] text-foreground/15 overflow-hidden select-none mb-2">
              {ASCII_DENDRITE}
            </div>
            <a
              href="#contact"
              className="touch-target inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-foreground/40 hover:text-foreground transition-colors"
            >
              <span>↓</span>
              <span>CONTINUE</span>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
