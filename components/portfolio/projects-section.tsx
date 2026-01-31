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

const ASCII_BARCODE = `
||||| || ||| || ||||| ||| || |||| || ||| ||||| || ||| ||
`.trim()

const ASCII_BARCODE_FULL = `
█▌▐█▌▐▌█▐█▌▐▌▐█▌▐█▌█▐▌▐█▌█▐█▌▐▌▐█▌█▐█
`.trim()

const ASCII_TICKET_BORDER_TOP = `
┌─────────────────────────────────────────────────────────────────────────────────────────┐
`.trim()

const ASCII_TICKET_BORDER_BOTTOM = `
└─────────────────────────────────────────────────────────────────────────────────────────┘
`.trim()

const ASCII_PERFORATION = `• • • • • • • • • • • • • • • • • • • • • • • • • • • •`

const ASCII_AIRPLANE = `
    __|__
---o--(_)--o---
`.trim()

const ASCII_HEADER = `
╔═══════════════════════════════════════════════════════════════════════════╗
║  ▓▓▓   ▓▓▓▓   ▓▓▓▓▓   ▓▓  ▓▓▓▓   ▓▓▓▓   ▓▓▓▓▓   ▓▓▓▓                      ║
║  ▓▓▓   ▓▓▓    ▓▓▓▓▓▓  ▓▓▓  ▓▓▓▓   ▓▓▓▓   ▓▓▓▓▓▓▓▓▓   PROJECTS             ║
╚═══════════════════════════════════════════════════════════════════════════╝
`.trim()

const ASCII_DEPARTURE_BOARD = `
╔════════════════════════════════════════════════════════════════════╗
║  DEPARTURES          ✈  TERMINAL: PORTFOLIO                        ║
╠════════════════════════════════════════════════════════════════════╣
`.trim()

// ─────────────────────────────────────────────────────────────
// PROJECT DATA
// ─────────────────────────────────────────────────────────────

const allProjects = [
  {
    id: "01",
    flightCode: "RF-2024-SB",
    title: "Saboriendo Bakery Platform",
    subtitle: "Website, iOS App",
    destination: "FULL-STACK E-COMMERCE",
    gate: "A1",
    year: "2024",
    image: "/images/default_image.png",
    description:
      "Full-stack e-commerce using React 19, SwiftUI, Firebase. Real-time order processing, FCM/APNs push. Barcode verification (AVFoundation, JsBarcode CODE128), 11+ formats, 50%+ faster in-store lookup. Firestore collectionGroup analytics and payment dashboards. Dynamic menu, 30-min drop scheduling, bulk discounts, EN/JP/ES.",
    stats: ["50%+ lookup speedup", "11+ barcode formats", "3 languages"],
    skills: ["React 19", "SwiftUI", "Firebase", "Firestore", "AVFoundation"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", web: "https://ryofujimura.github.io" },
    status: "BOARDING",
  },
  {
    id: "02",
    flightCode: "RF-2025-ZI",
    title: "Zero Inbox",
    subtitle: "AI-Driven Email Prioritization App",
    destination: "AI/ML ENGINEERING",
    gate: "B3",
    year: "2025",
    image: "/images/default_image.png",
    description:
      "Swift/SwiftUI email client with Google Mail API, Firebase, AI reasoning engine. 90–95% classification accuracy, 100–300ms end-to-end inference. Multi-stage decision system: top-3 actions from 20 contextual behaviors. 50–200 messages/min throughput, secure token handling, low-latency sync.",
    stats: ["95% accuracy", "200ms latency", "50–200/min"],
    skills: ["Swift", "SwiftUI", "Firebase", "AI/ML", "Google APIs"],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
    status: "ON TIME",
  },
  {
    id: "03",
    flightCode: "RF-2025-PM",
    title: "Project Management for Research Labs",
    subtitle: "GitHub, Website",
    destination: "SERVERLESS SYSTEMS",
    gate: "C7",
    year: "2025",
    image: "/images/default_image.png",
    description:
      "Serverless orchestration for dynamic AI routing across 30+ researchers and multi-lab workflows. Sub-200ms average Cloud Functions response under concurrent load. Metadata-aware prompting for task summaries, project updates, automated decision support.",
    stats: ["<200ms response", "30+ researchers", "multi-lab"],
    skills: ["Cloud Functions", "Firebase", "AI routing", "Node.js"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
    status: "DEPARTED",
  },
  {
    id: "04",
    flightCode: "RF-2025-HS",
    title: "HTIC Shuttle",
    subtitle: "App Store, Play Store, GitHub, Website",
    destination: "REAL-TIME TRACKING",
    gate: "D2",
    year: "2025",
    image: "/images/schedule.jpg",
    description:
      "Live shuttle tracking for 25+ daily users on iOS, Android, web. 70%+ reduction in duplicate/conflicting pickups via event serialization and state validation. Real-time sync under 100ms Firebase RTDB latency.",
    stats: ["25+ users", "70%+ reduction", "<100ms sync"],
    skills: ["Swift", "Kotlin", "Firebase RTDB", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
    status: "ON TIME",
  },
  {
    id: "05",
    flightCode: "RF-2025-CE",
    title: "CyberEdu",
    subtitle: "App Store, Play Store, GitHub, Website",
    destination: "CROSS-PLATFORM",
    gate: "E4",
    year: "2025",
    image: "/images/CyberEdu.png",
    description:
      "Synchronized iOS+Android apps for live event updates (50+ users). 99%+ cross-device sync reliability across unstable networks.",
    stats: ["50+ users", "99%+ sync", "iOS + Android"],
    skills: ["Swift", "Kotlin", "Firebase", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
    status: "BOARDING",
  },
  {
    id: "06",
    flightCode: "RF-2025-WA",
    title: "Whiteboard AI",
    subtitle: "GitHub, Website",
    destination: "VISION AI",
    gate: "F1",
    year: "2025",
    image: "/images/whiteboardai.png",
    description:
      "Transformer-based vision inference at 150–200ms latency; real-time CRDT-like collaboration. 5+ concurrent users (scalable to 25). Multi-user async WebSocket pipeline with queueing and cross-tab sync.",
    stats: ["150–200ms", "5+ users", "CRDT-like"],
    skills: ["PyTorch", "Vision", "WebSocket", "React"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
    status: "ON TIME",
  },
  {
    id: "07",
    flightCode: "RF-2024-WI",
    title: "With",
    subtitle: "GitHub",
    destination: "LOCAL AI",
    gate: "G5",
    year: "2024–2025",
    image: "/images/default_image.png",
    description:
      "Offline-capable LLM chat using GGUF + llama.cpp, <50ms/token local inference. 2GB+ memory savings via quantization and optimized caching/streaming. MVVM SwiftUI, advanced system prompt management.",
    stats: ["<50ms/token", "2GB+ saved", "offline"],
    skills: ["Swift", "llama.cpp", "GGUF", "SwiftUI"],
    links: { github: "https://github.com/ryofujimura" },
    status: "DEPARTED",
  },
  {
    id: "08",
    flightCode: "RF-2024-RW",
    title: "Ryo Fujimura Website",
    subtitle: "GitHub, Website",
    destination: "WEB PERFORMANCE",
    gate: "H2",
    year: "2024–2025",
    image: "/images/homepage.png",
    description:
      "Client-side performance tuning: 40–60% faster load. Modular components for rapid content iteration and clean deployment (Vercel/GitHub Pages).",
    stats: ["40–60% faster", "modular", "Vercel"],
    skills: ["React", "Next.js", "Tailwind", "Vercel"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
    status: "ON TIME",
  },
  {
    id: "09",
    flightCode: "RF-2024-MT",
    title: "Matcha Time",
    subtitle: "App Store, GitHub, Website",
    destination: "iOS NATIVE",
    gate: "J3",
    year: "2024",
    image: "/images/matchatime_1.jpg",
    description:
      "Swift/SwiftUI time zone coordination tool; 50 users at launch. 4-week idea-to-launch: project planning and execution.",
    stats: ["50 users", "4-week launch", "SwiftUI"],
    skills: ["Swift", "SwiftUI", "App Store"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#" },
    status: "DEPARTED",
  },
  {
    id: "10",
    flightCode: "RF-2023-SM",
    title: "Schedule Mastermind",
    subtitle: "GitHub, Website",
    destination: "BACKEND SYSTEMS",
    gate: "K1",
    year: "2023–2024",
    image: "/images/schedule.jpg",
    description:
      "Python Flask scheduler for 500+ courses with real-time conflict detection. Improved planning for 100–300+ students, 70%+ fewer scheduling errors.",
    stats: ["500+ courses", "70%+ fewer errors", "Flask"],
    skills: ["Python", "Flask", "scheduling"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
    status: "DEPARTED",
  },
  {
    id: "11",
    flightCode: "RF-2023-SH",
    title: "Shohei Home Ground",
    subtitle: "Instagram, YouTube",
    destination: "AUTOMATION",
    gate: "L8",
    year: "2023",
    image: "/images/shoheihomeground_1.jpg",
    description:
      "Automated daily Instagram posting (685 posts), 11K followers in 8 months. Python automation saved 2+ hours/day; consistent content and monetization.",
    stats: ["11K followers", "685 posts", "2+ hr/day saved"],
    skills: ["Python", "automation", "Instagram"],
    links: { instagram: "#", youtube: "#" },
    status: "DEPARTED",
  },
  {
    id: "12",
    flightCode: "RF-2022-PP",
    title: "Poker Percentage",
    subtitle: "App Store, GitHub",
    destination: "WATCHOS",
    gate: "M4",
    year: "2022–2024",
    image: "/images/poker.png",
    description:
      "WatchOS poker odds calculator, <10ms probability lookups via precomputed tables. Fast, reliable real-time equity insights.",
    stats: ["<10ms lookup", "WatchOS", "precomputed"],
    skills: ["Swift", "WatchOS", "probability"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
    status: "DEPARTED",
  },
]

type Project = (typeof allProjects)[0]

// Extract all unique skills for filtering
const allSkills = [...new Set(allProjects.flatMap((p) => p.skills))].sort()

// ─────────────────────────────────────────────────────────────
// ASCII BARCODE COMPONENT
// ─────────────────────────────────────────────────────────────

function AsciiBarcode({ code, className }: { code: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, scaleX: 0 },
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className={cn("font-mono origin-left", className)}>
      <div className="text-[6px] sm:text-[8px] tracking-[0.15em] text-foreground/60 select-none">
        {ASCII_BARCODE_FULL}
      </div>
      <div className="text-[8px] sm:text-[10px] tracking-[0.3em] mt-0.5 text-foreground/80">
        {code}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TECHNICAL LINES SVG COMPONENT
// ─────────────────────────────────────────────────────────────

function TechnicalLinesSVG({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const lines = svgRef.current.querySelectorAll("line, path")
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { strokeDasharray: "0 1000", opacity: 0 },
        {
          strokeDasharray: "1000 0",
          opacity: 1,
          duration: 1.5,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: svgRef.current,
            start: "top 85%",
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
      viewBox="0 0 400 200"
      preserveAspectRatio="none"
    >
      {/* Corner brackets */}
      <path d="M0 20 L0 0 L20 0" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <path d="M380 0 L400 0 L400 20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <path d="M0 180 L0 200 L20 200" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <path d="M380 200 L400 200 L400 180" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      
      {/* Horizontal tech lines */}
      <line x1="30" y1="30" x2="120" y2="30" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="280" y1="30" x2="370" y2="30" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="30" y1="170" x2="80" y2="170" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      
      {/* Diagonal accent */}
      <line x1="350" y1="160" x2="390" y2="190" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      
      {/* Grid dots */}
      {Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} cx={60 + i * 30} cy="170" r="1.5" fill="currentColor" opacity="0.2" />
      ))}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// PERFORATED EDGE COMPONENT
// ─────────────────────────────────────────────────────────────

function PerforatedEdge({ vertical = false, className }: { vertical?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center text-foreground/30",
        vertical ? "flex-col gap-1.5" : "gap-1.5",
        className
      )}
      aria-hidden
    >
      {Array.from({ length: vertical ? 20 : 30 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "bg-foreground/20 rounded-full",
            vertical ? "w-1.5 h-1.5" : "w-1 h-1 sm:w-1.5 sm:h-1.5"
          )}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// FLIGHT TICKET PROJECT CARD
// ─────────────────────────────────────────────────────────────

function FlightTicketCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return
    const el = cardRef.current

    const ctx = gsap.context(() => {
      // Card entrance
      gsap.fromTo(
        el,
        { opacity: 0, y: 60, rotateX: -5 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      )

      // Title scramble effect
      if (titleRef.current) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"
        const originalText = project.title.toUpperCase()
        let iteration = 0

        ScrollTrigger.create({
          trigger: titleRef.current,
          start: "top 85%",
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
              iteration += 0.5
            }, 25)
          },
        })
      }

      // Content stagger
      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll(".animate-item")
        gsap.fromTo(
          elements,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        )
      }
    }, el)

    return () => ctx.revert()
  }, [project.title])

  const hasGithub = project.links.github
  const hasDemo = "demo" in project.links && (project.links as { demo?: string }).demo
  const hasAppStore = "appStore" in project.links && (project.links as { appStore?: string }).appStore
  const hasPlayStore = "playStore" in project.links && (project.links as { playStore?: string }).playStore

  return (
    <article
      ref={cardRef}
      className={cn(
        "relative group",
        "bg-background border-2 border-foreground",
        "shadow-[6px_6px_0_0_var(--foreground)]",
        "hover:shadow-[8px_8px_0_0_var(--foreground)]",
        "transition-shadow duration-300",
        "overflow-hidden"
      )}
    >
      {/* Technical lines overlay */}
      <TechnicalLinesSVG className="opacity-50" />

      {/* Main ticket layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] relative">
        {/* Left section - Main content */}
        <div className="p-4 sm:p-6 lg:p-8 relative">
          {/* Header row */}
          <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground tracking-[0.3em]">
                  FLIGHT NO.
                </span>
                <span className="font-mono text-lg sm:text-xl lg:text-2xl font-black text-foreground">
                  {project.flightCode}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground tracking-[0.2em]">
                STATUS
              </span>
              <span
                className={cn(
                  "font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 border",
                  project.status === "BOARDING"
                    ? "text-accent border-accent bg-accent/10"
                    : project.status === "ON TIME"
                      ? "text-foreground border-foreground"
                      : "text-muted-foreground border-muted-foreground/50"
                )}
              >
                {project.status}
              </span>
            </div>
          </div>

          {/* Destination / Title */}
          <div className="mb-4" ref={contentRef}>
            <div className="animate-item flex items-center gap-2 mb-1">
              <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground tracking-[0.2em]">
                DESTINATION
              </span>
              <div className="flex-1 h-px bg-foreground/20" />
            </div>
            <h3
              ref={titleRef}
              className="animate-item font-mono text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight leading-tight"
            >
              {project.title.toUpperCase()}
            </h3>
            <p className="animate-item font-mono text-[10px] sm:text-xs text-accent tracking-[0.15em] mt-1">
              → {project.destination}
            </p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 py-3 border-y border-dashed border-foreground/30">
            <div className="animate-item">
              <span className="font-mono text-[8px] sm:text-[9px] text-muted-foreground block tracking-[0.2em]">
                GATE
              </span>
              <span className="font-mono text-base sm:text-lg lg:text-xl font-black text-foreground">
                {project.gate}
              </span>
            </div>
            <div className="animate-item">
              <span className="font-mono text-[8px] sm:text-[9px] text-muted-foreground block tracking-[0.2em]">
                DATE
              </span>
              <span className="font-mono text-base sm:text-lg lg:text-xl font-black text-foreground">
                {project.year}
              </span>
            </div>
            <div className="animate-item">
              <span className="font-mono text-[8px] sm:text-[9px] text-muted-foreground block tracking-[0.2em]">
                CLASS
              </span>
              <span className="font-mono text-base sm:text-lg lg:text-xl font-black text-foreground">
                {project.id}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mb-4 max-w-2xl">
            {project.description}
          </p>

          {/* Stats */}
          {project.stats && project.stats.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.stats.map((s) => (
                <span
                  key={s}
                  className="animate-item font-mono text-[9px] sm:text-[10px] px-2 py-1 border border-foreground/50 text-foreground bg-foreground/5"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Skills / Technologies */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
            {project.skills.map((skill) => (
              <span
                key={skill}
                className="animate-item font-mono text-[8px] sm:text-[10px] text-muted-foreground border-b border-dotted border-muted-foreground/50 pb-0.5"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {hasGithub && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 sm:px-4 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-wider border-2 border-foreground text-foreground bg-background hover:bg-foreground hover:text-background transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                SOURCE
              </a>
            )}
            {hasDemo && (
              <a
                href={(project.links as { demo?: string }).demo}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 sm:px-4 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-wider border-2 border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                DEMO
              </a>
            )}
            {hasAppStore && (
              <a
                href={(project.links as { appStore?: string }).appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center justify-center min-h-[44px] px-3 sm:px-4 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-wider border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                APP STORE
              </a>
            )}
            {hasPlayStore && (
              <a
                href={(project.links as { playStore?: string }).playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center justify-center min-h-[44px] px-3 sm:px-4 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-wider border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                PLAY STORE
              </a>
            )}
          </div>
        </div>

        {/* Right section - Stub */}
        <div className="hidden lg:flex flex-col border-l-2 border-dashed border-foreground/40 relative min-w-[180px]">
          {/* Perforated edge indicator */}
          <PerforatedEdge vertical className="absolute left-0 top-4 bottom-4 -translate-x-1/2" />

          <div className="p-4 flex flex-col h-full justify-between">
            {/* Stub header */}
            <div>
              <div className="font-mono text-[8px] text-muted-foreground tracking-[0.3em] mb-1">
                BOARDING PASS
              </div>
              <div className="font-mono text-2xl font-black text-foreground">
                {project.id}
              </div>
              <div className="font-mono text-[10px] text-muted-foreground mt-1">
                {project.subtitle}
              </div>
            </div>

            {/* ASCII art section */}
            <div className="my-4">
              <pre className="font-mono text-[10px] text-foreground/40 leading-tight select-none">
                {ASCII_AIRPLANE}
              </pre>
            </div>

            {/* Barcode */}
            <div className="mt-auto">
              <AsciiBarcode code={project.flightCode} className="mt-2" />
            </div>
          </div>
        </div>

        {/* Mobile barcode - shown at bottom on small screens */}
        <div className="lg:hidden border-t-2 border-dashed border-foreground/40 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <pre className="font-mono text-[8px] text-foreground/40 leading-none select-none whitespace-pre">
              {"__|__\n-o-(_)-o-"}
            </pre>
          </div>
          <AsciiBarcode code={project.flightCode} />
        </div>
      </div>
    </article>
  )
}

// ─────────────────────────────────────────────────────────────
// FILTER BAR COMPONENT (Departure Board Style)
// ─────────────────────────────────────────────────────────────

function FilterBar({
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
  const filterRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (!filterRef.current) return
    const el = filterRef.current
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: -30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [])

  // Group skills by first letter for visual organization
  const skillGroups = useMemo(() => {
    const groups: Record<string, string[]> = {}
    skills.forEach((skill) => {
      const letter = skill[0].toUpperCase()
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(skill)
    })
    return groups
  }, [skills])

  return (
    <div ref={filterRef} className="mb-8 sm:mb-12">
      {/* ASCII Header */}
      <pre className="font-mono text-[8px] sm:text-[10px] text-foreground/40 mb-4 overflow-x-auto whitespace-pre select-none hidden sm:block">
        {ASCII_DEPARTURE_BOARD}
      </pre>

      {/* Filter header row */}
      <div className="flex items-center justify-between gap-4 mb-3 border-b-2 border-foreground pb-2">
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="font-mono text-[10px] sm:text-xs text-muted-foreground tracking-[0.2em]">
            FILTER BY SKILL
          </span>
          <span className="font-mono text-[10px] sm:text-xs text-accent">
            [{selectedSkills.length} SELECTED]
          </span>
        </div>
        <div className="flex items-center gap-2">
          {selectedSkills.length > 0 && (
            <button
              onClick={onClearFilters}
              className="touch-target flex items-center gap-1 font-mono text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
            >
              <X className="w-3 h-3" />
              CLEAR
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="touch-target font-mono text-[10px] sm:text-xs border border-foreground/50 px-2 sm:px-3 py-1 hover:bg-foreground hover:text-background transition-colors"
          >
            {isExpanded ? "COLLAPSE" : "EXPAND"}
          </button>
        </div>
      </div>

      {/* Selected skills display */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 p-2 border border-dashed border-foreground/30 bg-foreground/5">
          <span className="font-mono text-[9px] text-muted-foreground self-center mr-2">
            ACTIVE:
          </span>
          {selectedSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => onToggleSkill(skill)}
              className="inline-flex items-center gap-1 font-mono text-[10px] sm:text-xs px-2 py-1 border-2 border-foreground bg-foreground text-background hover:bg-accent transition-colors"
            >
              {skill}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}

      {/* Skills grid */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-500",
          isExpanded ? "max-h-[600px] opacity-100" : "max-h-[120px] sm:max-h-[80px] opacity-100"
        )}
      >
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {skills.map((skill) => {
            const isSelected = selectedSkills.includes(skill)
            return (
              <button
                key={skill}
                onClick={() => onToggleSkill(skill)}
                className={cn(
                  "touch-target font-mono text-[9px] sm:text-[11px] px-2 sm:px-3 py-1.5 border transition-all duration-200",
                  isSelected
                    ? "border-2 border-foreground bg-foreground text-background"
                    : "border border-foreground/40 text-foreground/70 hover:border-foreground hover:text-foreground hover:bg-foreground/5"
                )}
              >
                {skill}
              </button>
            )
          })}
        </div>
      </div>

      {/* Expand indicator */}
      {!isExpanded && skills.length > 12 && (
        <div className="text-center mt-2">
          <span className="font-mono text-[10px] text-muted-foreground">
            ··· {skills.length - 12} more skills ···
          </span>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION HEADER WITH BRUTALIST PATTERNS
// ─────────────────────────────────────────────────────────────

function SectionHeader() {
  const headerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!headerRef.current) return
    const el = headerRef.current

    const ctx = gsap.context(() => {
      // Main container fade
      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      )

      // Title scramble effect
      if (titleRef.current) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░"
        const originalText = "PROJECTS"
        let iteration = 0

        ScrollTrigger.create({
          trigger: titleRef.current,
          start: "top 85%",
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
              iteration += 0.3
            }, 40)
          },
        })
      }
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={headerRef} className="mb-10 sm:mb-14 lg:mb-16 relative">
      {/* ASCII decorative header */}
      <pre className="font-mono text-[6px] sm:text-[8px] lg:text-[10px] text-foreground/30 overflow-x-auto whitespace-pre select-none mb-4 hidden sm:block">
        {ASCII_HEADER}
      </pre>

      {/* Technical lines */}
      <div className="absolute top-0 right-0 w-32 sm:w-48 h-full pointer-events-none hidden md:block">
        <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
          <line x1="200" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
          <line x1="200" y1="20" x2="150" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
          <line x1="200" y1="50" x2="180" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
          <circle cx="180" cy="20" r="2" fill="currentColor" opacity="0.2" />
          <circle cx="160" cy="40" r="1.5" fill="currentColor" opacity="0.15" />
        </svg>
      </div>

      <div className="flex items-end gap-4 sm:gap-6 lg:gap-8">
        <div>
          <p className="font-mono text-[10px] sm:text-xs text-muted-foreground tracking-[0.3em] mb-2">
            — TERMINAL 04 / WORK
          </p>
          <h2
            ref={titleRef}
            className="font-mono text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-foreground tracking-tighter leading-none"
          >
            PROJECTS
          </h2>
        </div>
        <div className="hidden sm:flex flex-col gap-1 pb-2">
          <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em]">
            TOTAL FLIGHTS
          </span>
          <span className="font-mono text-3xl lg:text-4xl font-black text-foreground tabular-nums">
            {String(allProjects.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Underline with technical marks */}
      <div className="mt-4 sm:mt-6 flex items-center gap-2 sm:gap-4">
        <div className="h-1 sm:h-1.5 w-16 sm:w-24 lg:w-32 bg-foreground" />
        <div className="h-0.5 flex-1 max-w-xs bg-foreground/20" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-foreground/30" />
          ))}
        </div>
      </div>

      {/* Coordinate markers */}
      <div className="mt-3 flex items-center gap-4 font-mono text-[9px] sm:text-[10px] text-muted-foreground/60">
        <span>LAT: 35.6762°N</span>
        <span>LON: 139.6503°E</span>
        <span className="hidden sm:inline">ALT: 40M</span>
        <span className="hidden sm:inline">GRID: 04-A1</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN PROJECTS SECTION
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

  // Filter projects based on selected skills
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
        "pb-[max(3rem,env(safe-area-inset-bottom))]",
        "bg-background"
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-brutalist-diagonal opacity-50" />
        
        {/* Technical grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" preserveAspectRatio="none">
          {Array.from({ length: 20 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={`${i * 5}%`}
              y1="0"
              x2={`${i * 5}%`}
              y2="100%"
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 50 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={`${i * 2}%`}
              x2="100%"
              y2={`${i * 2}%`}
              stroke="currentColor"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>

      <div className="max-w-5xl lg:max-w-6xl mx-auto relative">
        <SectionHeader />

        <FilterBar
          skills={allSkills}
          selectedSkills={selectedSkills}
          onToggleSkill={toggleSkill}
          onClearFilters={clearFilters}
        />

        {/* Results count */}
        <div className="flex items-center gap-2 mb-6 font-mono text-[10px] sm:text-xs text-muted-foreground">
          <span className="tracking-[0.2em]">DISPLAYING</span>
          <span className="text-foreground font-bold">{displayedProjects.length}</span>
          <span>OF</span>
          <span className="text-foreground font-bold">{filteredProjects.length}</span>
          <span className="tracking-[0.2em]">FLIGHTS</span>
          {selectedSkills.length > 0 && (
            <span className="text-accent ml-2">(FILTERED)</span>
          )}
        </div>

        {/* ASCII perforation line */}
        <div className="font-mono text-[10px] text-foreground/20 overflow-hidden mb-6 select-none">
          {ASCII_PERFORATION}
        </div>

        {/* Projects grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-foreground/30">
            <pre className="font-mono text-foreground/40 mb-4">
              {`
   ___________
  |  NO DATA  |
  |___________|
              `}
            </pre>
            <p className="font-mono text-sm text-muted-foreground">
              No flights match the selected filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 font-mono text-xs border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
            >
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {displayedProjects.map((project, index) => (
              <FlightTicketCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        {/* Show more button */}
        {!showAll && remaining > 0 && (
          <div className="mt-10 sm:mt-12 flex flex-col items-center">
            <div className="font-mono text-[10px] text-foreground/20 overflow-hidden mb-4 select-none">
              {ASCII_PERFORATION}
            </div>
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className={cn(
                "touch-target w-full sm:w-auto min-h-[52px] flex items-center justify-center gap-3",
                "px-6 sm:px-10 py-4",
                "font-mono text-xs sm:text-sm uppercase tracking-[0.2em]",
                "border-2 border-foreground bg-foreground text-background",
                "hover:bg-background hover:text-foreground transition-colors",
                "shadow-[4px_4px_0_0_var(--foreground)]",
                "hover:shadow-[6px_6px_0_0_var(--foreground)]"
              )}
            >
              <span>LOAD {remaining} MORE FLIGHTS</span>
              <span className="font-mono text-lg">↓</span>
            </button>
          </div>
        )}

        {/* Bottom decoration */}
        {showAll && (
          <div className="mt-12 sm:mt-16 text-center">
            <div className="font-mono text-[10px] text-foreground/20 overflow-hidden mb-4 select-none">
              {ASCII_PERFORATION}
            </div>
            <pre className="font-mono text-[10px] sm:text-xs text-foreground/30 select-none mb-4">
              {`
╔══════════════════════════════════════════════════╗
║  END OF FLIGHT MANIFEST  ·  ALL SYSTEMS NOMINAL  ║
╚══════════════════════════════════════════════════╝
              `}
            </pre>
            <a
              href="#contact"
              className="touch-target inline-flex items-center justify-center min-h-[44px] font-mono text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors gap-2"
            >
              <span>↓</span>
              <span className="tracking-[0.2em]">PROCEED TO CONTACT</span>
              <span>↓</span>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
