"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

// ═══════════════════════════════════════════════════════════════════
// PROJECT DATA
// ═══════════════════════════════════════════════════════════════════

const projects = [
  {
    id: "01",
    title: "POKER%",
    subtitle: "WATCHOS",
    year: "2022",
    description: "Real-time poker odds calculator for Apple Watch. Monte Carlo simulation with sub-10ms response.",
    techStack: ["Swift", "WatchOS", "SwiftUI"],
    images: ["/images/poker_1.jpg", "/images/poker_2.jpg", "/images/poker_3.jpg", "/images/poker_4.jpg"],
    metric: "<10ms",
    ascii: "♠♥♦♣",
  },
  {
    id: "02",
    title: "SHOHEI_HG",
    subtitle: "AUTOMATION",
    year: "2023",
    description: "Automated content pipeline for Instagram/YouTube. 11K followers through intelligent posting.",
    techStack: ["Python", "Instagram API", "YouTube API"],
    images: ["/images/shoheihomeground_1.jpg", "/images/shoheihomeground_2.jpg", "/images/shoheihomeground_3.jpg"],
    metric: "11K",
    ascii: "▓▓▓░░",
  },
  {
    id: "03",
    title: "SCHEDULE",
    subtitle: "FLASK",
    year: "2023",
    description: "Course scheduling system with conflict detection using graph coloring algorithms.",
    techStack: ["Python", "Flask", "SQLite"],
    images: ["/images/schedule.jpg"],
    metric: "70%",
    ascii: "█░█░█",
  },
  {
    id: "04",
    title: "MATCHA",
    subtitle: "IOS",
    year: "2024",
    description: "Minimalist matcha timer app with Japanese aesthetic. Precision timers and ritual tracking.",
    techStack: ["Swift", "SwiftUI", "CloudKit"],
    images: ["/images/matchatime_1.jpg", "/images/matchatime_2.jpg", "/images/matchatime_3.jpg"],
    metric: "4wks",
    ascii: "░▒▓█▓",
  },
  {
    id: "05",
    title: "PORTFOLIO",
    subtitle: "NEXT.JS",
    year: "2024",
    description: "This portfolio. Next.js 15 with scroll-driven animations and brutalist design system.",
    techStack: ["React", "Next.js", "GSAP", "Tailwind"],
    images: ["/images/homepage.png", "/images/experiencepage.png"],
    metric: "<1.5s",
    ascii: "┌──┐",
  },
  {
    id: "06",
    title: "SABORIENDO",
    subtitle: "CROSS-PLAT",
    year: "2024",
    description: "Food tracking with barcode scanning. Cross-platform sync between iOS and web.",
    techStack: ["React 19", "SwiftUI", "Firebase"],
    images: [],
    metric: "<1s",
    ascii: "║│║│║",
  },
  {
    id: "07",
    title: "WITH_LLM",
    subtitle: "ON-DEVICE",
    year: "2024",
    description: "Privacy-focused AI assistant. Local llama.cpp with quantized GGUF models.",
    techStack: ["Swift", "llama.cpp", "GGUF"],
    images: [],
    metric: "<50ms",
    ascii: "◉░▒▓█",
  },
  {
    id: "08",
    title: "HTIC_SHUTTLE",
    subtitle: "REALTIME",
    year: "2025",
    description: "Campus shuttle tracking with real-time location. Firebase RTDB for sub-100ms latency.",
    techStack: ["Swift", "Kotlin", "Firebase"],
    images: [],
    metric: "<100ms",
    ascii: "○──○",
  },
  {
    id: "09",
    title: "CYBEREDU",
    subtitle: "OFFLINE",
    year: "2025",
    description: "Educational platform with offline-first architecture. SQLite cache with conflict resolution.",
    techStack: ["Swift", "Kotlin", "Firebase"],
    images: ["/images/CyberEdu-1.PNG", "/images/CyberEdu-2.PNG", "/images/CyberEdu-3.PNG"],
    metric: "99%",
    ascii: "●SYNC",
  },
  {
    id: "10",
    title: "LAB_PM",
    subtitle: "SERVERLESS",
    year: "2025",
    description: "Research lab PM with AI-powered task routing. Dynamic model selection based on complexity.",
    techStack: ["Cloud Functions", "Firebase", "GPT-4"],
    images: [],
    metric: "<200ms",
    ascii: "◇◆◇",
  },
  {
    id: "11",
    title: "WHITEBOARD",
    subtitle: "VISION_ML",
    year: "2025",
    description: "Collaborative whiteboard with real-time AI vision. PyTorch detection with CRDT sync.",
    techStack: ["PyTorch", "WebSocket", "React"],
    images: ["/images/whiteboardai-1.jpg", "/images/whiteboardai-2.jpg"],
    metric: "60fps",
    ascii: "○─□",
  },
  {
    id: "12",
    title: "ZERO_INBOX",
    subtitle: "PROD_AI",
    year: "2025",
    description: "Email management with multi-stage AI reasoning. 95% accuracy categorization.",
    techStack: ["Swift", "AI/ML", "Firebase"],
    images: [],
    metric: "95%",
    ascii: "█▓▒░",
  },
]

type Project = (typeof projects)[0]

// ═══════════════════════════════════════════════════════════════════
// ASCII PATTERNS
// ═══════════════════════════════════════════════════════════════════

const ASCII_LINES = {
  horizontal: "═══════════════════════════════════════════════════════════════",
  double: "────────────────────────────────────────────────────────────────",
  dots: "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
  blocks: "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓",
  mixed: "░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░",
}

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?░▒▓█▄▀■□●○◆◇"

// ═══════════════════════════════════════════════════════════════════
// LOADING ANIMATION - ASCII BOOT SEQUENCE
// ═══════════════════════════════════════════════════════════════════

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const bootSequence = [
    "INITIALIZING PROJECTS MODULE...",
    "LOADING TYPOGRAPHY ENGINE ████████░░ 80%",
    "PARSING PROJECT DATA ██████████ 100%",
    "MOUNTING SCROLL TRIGGERS...",
    "COMPILING ASCII PATTERNS...",
    "CALIBRATING GSAP TIMELINES...",
    "READY.",
  ]

  useEffect(() => {
    let lineIndex = 0
    const interval = setInterval(() => {
      if (lineIndex < bootSequence.length) {
        setLines(prev => [...prev, bootSequence[lineIndex]])
        setProgress((lineIndex + 1) / bootSequence.length * 100)
        lineIndex++
      } else {
        clearInterval(interval)
        setTimeout(onComplete, 300)
      }
    }, 150)

    return () => clearInterval(interval)
  }, [onComplete])

  useEffect(() => {
    if (!containerRef.current) return
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    )
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
    >
      <div className="w-full max-w-lg px-6 font-mono">
        <div className="text-[8px] sm:text-[10px] text-foreground/40 mb-4">
          ╔══════════════════════════════════════╗
        </div>
        
        <pre className="text-[8px] sm:text-[10px] text-foreground/60 leading-relaxed mb-4">
          {lines.map((line, i) => (
            <div key={i} className="animate-in fade-in slide-in-from-left-2">
              {">"} {line}
            </div>
          ))}
          <span className="animate-pulse">█</span>
        </pre>

        <div className="h-1 bg-foreground/10 overflow-hidden">
          <div
            className="h-full bg-foreground transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-[8px] sm:text-[10px] text-foreground/40 mt-4">
          ╚══════════════════════════════════════╝
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TECHNICAL SVG GRID
// ═══════════════════════════════════════════════════════════════════

function TechnicalGrid() {
  const gridRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!gridRef.current) return

    const lines = gridRef.current.querySelectorAll("line")
    gsap.fromTo(
      lines,
      { strokeDashoffset: 1000 },
      {
        strokeDashoffset: 0,
        duration: 2,
        stagger: 0.02,
        ease: "power2.out",
      }
    )
  }, [])

  return (
    <svg
      ref={gridRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="gridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="60" y2="0" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="text-foreground/5" />
          <line x1="0" y1="0" x2="0" y2="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="text-foreground/5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#gridPattern)" />
      
      {/* Corner marks */}
      <line x1="0" y1="40" x2="0" y2="0" stroke="currentColor" strokeWidth="2" className="text-foreground/20" />
      <line x1="0" y1="0" x2="40" y2="0" stroke="currentColor" strokeWidth="2" className="text-foreground/20" />
      <line x1="100%" y1="0" x2="calc(100% - 40px)" y2="0" stroke="currentColor" strokeWidth="2" className="text-foreground/20" />
      <line x1="100%" y1="0" x2="100%" y2="40" stroke="currentColor" strokeWidth="2" className="text-foreground/20" />
      <line x1="100%" y1="100%" x2="100%" y2="calc(100% - 40px)" stroke="currentColor" strokeWidth="2" className="text-foreground/20" />
      <line x1="100%" y1="100%" x2="calc(100% - 40px)" y2="100%" stroke="currentColor" strokeWidth="2" className="text-foreground/20" />
      <line x1="0" y1="100%" x2="40" y2="100%" stroke="currentColor" strokeWidth="2" className="text-foreground/20" />
      <line x1="0" y1="100%" x2="0" y2="calc(100% - 40px)" stroke="currentColor" strokeWidth="2" className="text-foreground/20" />
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════
// PROJECT TITLE - MASSIVE TYPOGRAPHY
// ═══════════════════════════════════════════════════════════════════

function ProjectTitle({
  project,
  index,
  isActive,
  onClick,
  progress,
}: {
  project: Project
  index: number
  isActive: boolean
  onClick: () => void
  progress: number
}) {
  const titleRef = useRef<HTMLButtonElement>(null)
  const [displayText, setDisplayText] = useState(project.title)
  const [isHovered, setIsHovered] = useState(false)

  // Glitch effect on mount
  useEffect(() => {
    if (!isActive) return

    const targetText = project.title
    let iteration = 0
    const maxIterations = targetText.length * 3

    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split("")
          .map((char, i) => {
            if (char === "_" || char === " ") return char
            if (i < iteration / 3) return char
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          })
          .join("")
      )

      iteration++
      if (iteration >= maxIterations) {
        setDisplayText(targetText)
        clearInterval(interval)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [project.title, isActive])

  // GSAP animation
  useEffect(() => {
    if (!titleRef.current || !isActive) return

    gsap.fromTo(
      titleRef.current,
      { 
        y: 100, 
        opacity: 0, 
        skewY: 5,
        scale: 0.9,
      },
      { 
        y: 0, 
        opacity: 1, 
        skewY: 0,
        scale: 1,
        duration: 0.8, 
        ease: "power4.out" 
      }
    )
  }, [isActive])

  // Calculate visual intensity based on scroll progress
  const intensity = isActive ? 1 : Math.max(0, 1 - Math.abs(progress - index / projects.length) * 5)

  return (
    <button
      ref={titleRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "w-full text-left transition-all duration-500 group relative",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
        isActive ? "opacity-100" : "opacity-20 hover:opacity-40"
      )}
      style={{
        transform: isActive ? "none" : `translateY(${(1 - intensity) * 20}px)`,
      }}
    >
      {/* Main title */}
      <div className="relative overflow-hidden">
        <h2
          className={cn(
            "font-mono font-black tracking-tighter leading-[0.85] transition-all duration-300",
            "text-[15vw] sm:text-[12vw] md:text-[10vw] lg:text-[8vw]",
            isActive ? "text-foreground" : "text-foreground/30",
            isHovered && !isActive && "text-foreground/50"
          )}
        >
          {displayText}
        </h2>

        {/* Underline effect */}
        <div
          className={cn(
            "absolute bottom-0 left-0 h-1 sm:h-2 bg-foreground transition-all duration-500",
            isActive ? "w-full" : "w-0 group-hover:w-1/4"
          )}
        />

        {/* ASCII decoration */}
        <div
          className={cn(
            "absolute -right-2 top-0 font-mono text-[8px] sm:text-[10px] transition-opacity duration-300",
            isActive ? "opacity-60" : "opacity-0"
          )}
        >
          <div className="text-foreground/40">{project.ascii}</div>
          <div className="text-foreground/20">{project.metric}</div>
        </div>
      </div>

      {/* Subtitle line */}
      <div
        className={cn(
          "flex items-center gap-2 sm:gap-4 mt-1 sm:mt-2 font-mono text-[8px] sm:text-[10px] md:text-xs transition-all duration-300",
          isActive ? "opacity-100" : "opacity-0"
        )}
      >
        <span className="text-foreground/40">[{project.id}]</span>
        <span className="text-foreground/60">{project.subtitle}</span>
        <span className="text-foreground/20">─────</span>
        <span className="text-foreground/40">{project.year}</span>
        <span className="text-foreground/20 hidden sm:inline">
          {ASCII_LINES.mixed.slice(0, 20)}
        </span>
      </div>

      {/* Hover indicator */}
      {isActive && (
        <div className="absolute -left-4 sm:-left-8 top-1/2 -translate-y-1/2 font-mono text-[10px] sm:text-xs text-foreground/40 animate-pulse">
          {">>>"}
        </div>
      )}
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════
// IMAGE OVERLAY
// ═══════════════════════════════════════════════════════════════════

function ImageOverlay({
  project,
  isOpen,
  onClose,
}: {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  // Reset state when project changes
  useEffect(() => {
    setActiveImageIndex(0)
    setLoadedImages(new Set())
  }, [project])

  // GSAP animations
  useEffect(() => {
    if (!overlayRef.current || !contentRef.current) return

    if (isOpen) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      )
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, delay: 0.1, ease: "power3.out" }
      )
    }
  }, [isOpen])

  // Handle close with animation
  const handleClose = useCallback(() => {
    if (!overlayRef.current || !contentRef.current) {
      onClose()
      return
    }

    gsap.to(contentRef.current, {
      y: -30,
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.in",
    })
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      delay: 0.1,
      onComplete: onClose,
    })
  }, [onClose])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
      if (e.key === "ArrowLeft" && project?.images.length) {
        setActiveImageIndex(i => (i - 1 + project.images.length) % project.images.length)
      }
      if (e.key === "ArrowRight" && project?.images.length) {
        setActiveImageIndex(i => (i + 1) % project.images.length)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, project, handleClose])

  if (!isOpen || !project) return null

  const hasImages = project.images.length > 0

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90] bg-background/95 backdrop-blur-sm overflow-auto"
      onClick={handleClose}
    >
      {/* Technical grid background */}
      <TechnicalGrid />

      {/* ASCII border decoration */}
      <div className="fixed top-0 left-0 right-0 h-8 flex items-center justify-center font-mono text-[8px] sm:text-[10px] text-foreground/20 overflow-hidden">
        {ASCII_LINES.mixed}
      </div>
      <div className="fixed bottom-0 left-0 right-0 h-8 flex items-center justify-center font-mono text-[8px] sm:text-[10px] text-foreground/20 overflow-hidden">
        {ASCII_LINES.mixed}
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="min-h-screen flex items-center justify-center p-4 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-5xl">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-[8px] sm:text-[10px] text-foreground/40 mb-2">
                  ┌── PROJECT_{project.id} ──────────────────────────
                </div>
                <h3 className="font-mono text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground">
                  {project.title}
                </h3>
                <div className="flex items-center gap-3 mt-2 font-mono text-[10px] sm:text-xs text-foreground/60">
                  <span>{project.subtitle}</span>
                  <span className="text-foreground/20">│</span>
                  <span>{project.year}</span>
                  <span className="text-foreground/20">│</span>
                  <span className="text-foreground">{project.metric}</span>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="font-mono text-foreground/40 hover:text-foreground transition-colors p-2 border border-foreground/20 hover:border-foreground/40 hover:bg-foreground/5"
              >
                <span className="text-xs sm:text-sm">[ESC]</span>
              </button>
            </div>
          </div>

          {/* Image gallery or no preview */}
          {hasImages ? (
            <div className="mb-6 sm:mb-8">
              {/* Main image */}
              <div className="relative aspect-video bg-foreground/5 border border-foreground/20 overflow-hidden mb-4">
                {/* Loading state */}
                {!loadedImages.has(activeImageIndex) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="font-mono text-[10px] sm:text-xs text-foreground/40 animate-pulse">
                      ░▒▓ LOADING_IMAGE ▓▒░
                    </div>
                  </div>
                )}

                <Image
                  src={project.images[activeImageIndex]}
                  alt={`${project.title} preview`}
                  fill
                  className={cn(
                    "object-contain transition-opacity duration-500",
                    loadedImages.has(activeImageIndex) ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setLoadedImages(prev => new Set(prev).add(activeImageIndex))}
                />

                {/* Image counter */}
                <div className="absolute bottom-3 right-3 font-mono text-[10px] sm:text-xs text-white/80 bg-black/60 px-2 py-1">
                  [{String(activeImageIndex + 1).padStart(2, "0")}/{String(project.images.length).padStart(2, "0")}]
                </div>

                {/* Corner marks */}
                <span className="absolute top-2 left-2 font-mono text-[8px] text-white/40">┌──</span>
                <span className="absolute top-2 right-2 font-mono text-[8px] text-white/40">──┐</span>
                <span className="absolute bottom-2 left-2 font-mono text-[8px] text-white/40">└──</span>
                <span className="absolute bottom-10 right-2 font-mono text-[8px] text-white/40">──┘</span>
              </div>

              {/* Thumbnail navigation */}
              {project.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                  {project.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={cn(
                        "flex-shrink-0 w-20 h-14 sm:w-24 sm:h-16 relative border transition-all snap-start",
                        idx === activeImageIndex
                          ? "border-foreground opacity-100"
                          : "border-foreground/20 opacity-50 hover:opacity-80"
                      )}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-foreground/10" />
                      <span className="absolute bottom-1 right-1 font-mono text-[6px] text-white/60">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6 sm:mb-8 aspect-video border border-dashed border-foreground/20 flex items-center justify-center">
              <div className="text-center font-mono">
                <pre className="text-foreground/20 text-[8px] sm:text-[10px] leading-tight mb-2">
{`┌─────────────────────┐
│                     │
│    NO_PREVIEW       │
│    AVAILABLE        │
│                     │
└─────────────────────┘`}
                </pre>
                <div className="text-foreground/40 text-[10px] sm:text-xs">
                  {project.ascii}
                </div>
              </div>
            </div>
          )}

          {/* Project info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description */}
            <div>
              <div className="font-mono text-[8px] sm:text-[10px] text-foreground/30 mb-2">
                ├── DESCRIPTION
              </div>
              <p className="font-mono text-xs sm:text-sm text-foreground/70 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Tech stack */}
            <div>
              <div className="font-mono text-[8px] sm:text-[10px] text-foreground/30 mb-2">
                └── TECH_STACK
              </div>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[10px] sm:text-xs px-2 py-1 border border-foreground/20 text-foreground/60 bg-foreground/5"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation hint */}
          {hasImages && project.images.length > 1 && (
            <div className="mt-8 text-center font-mono text-[8px] sm:text-[10px] text-foreground/30">
              ← → ARROW_KEYS TO NAVIGATE │ ESC TO CLOSE
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SCROLL PROGRESS INDICATOR
// ═══════════════════════════════════════════════════════════════════

function ScrollProgress({ progress, activeIndex }: { progress: number; activeIndex: number }) {
  const chars = 30
  const filled = Math.round(progress * chars)
  const bar = "█".repeat(filled) + "░".repeat(chars - filled)

  return (
    <div className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="font-mono text-[8px] text-foreground/30 writing-mode-vertical transform rotate-180" style={{ writingMode: "vertical-rl" }}>
        <div className="flex items-center gap-2">
          <span>[{bar}]</span>
          <span className="text-foreground/60">
            {String(activeIndex + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MOBILE PROGRESS BAR
// ═══════════════════════════════════════════════════════════════════

function MobileProgress({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 lg:hidden">
      <div className="flex items-center gap-1 justify-center">
        {projects.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "h-1 transition-all duration-300",
              idx === activeIndex ? "w-6 bg-foreground" : "w-2 bg-foreground/20"
            )}
          />
        ))}
      </div>
      <div className="text-center font-mono text-[8px] text-foreground/40 mt-2">
        [{String(activeIndex + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")}] TAP TO VIEW
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MAIN SECTION
// ═══════════════════════════════════════════════════════════════════

export function ProjectsSection() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const titlesRef = useRef<HTMLDivElement>(null)

  // Handle project click
  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project)
    setIsOverlayOpen(true)
  }, [])

  // Close overlay
  const handleCloseOverlay = useCallback(() => {
    setIsOverlayOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }, [])

  // Setup scroll-driven animations
  useEffect(() => {
    if (isLoading || !sectionRef.current || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Main scroll trigger for the entire section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${projects.length * 100}%`,
        pin: containerRef.current,
        pinSpacing: true,
        scrub: 0.5,
        snap: {
          snapTo: 1 / (projects.length - 1),
          duration: { min: 0.2, max: 0.5 },
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const progress = self.progress
          setScrollProgress(progress)
          
          const newIndex = Math.min(
            Math.round(progress * (projects.length - 1)),
            projects.length - 1
          )
          setActiveIndex(newIndex)
        },
      })
    }, sectionRef.current)

    return () => ctx.revert()
  }, [isLoading])

  // Handle loading complete
  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <section
        id="projects"
        ref={sectionRef}
        className="relative bg-background"
      >
        <div
          ref={containerRef}
          className="min-h-screen flex flex-col justify-center relative overflow-hidden"
        >
          {/* Technical grid background */}
          <TechnicalGrid />

          {/* ASCII header decoration */}
          <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 font-mono text-[7px] sm:text-[9px] text-foreground/20">
            <div className="flex items-center gap-2">
              <span>╔══</span>
              <span className="text-foreground/40">PROJECTS.MODULE</span>
              <span className="flex-1 overflow-hidden whitespace-nowrap">{ASCII_LINES.horizontal}</span>
              <span>══╗</span>
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 px-4 sm:px-8 md:px-12 lg:px-16 py-20">
            {/* Section label */}
            <div className="mb-8 sm:mb-12">
              <div className="font-mono text-[8px] sm:text-[10px] text-foreground/30 mb-2">
                ┌── INDEX ──────────────────────────────
              </div>
              <div className="font-mono text-[10px] sm:text-xs text-foreground/50">
                SCROLL TO NAVIGATE │ CLICK TO EXPLORE
              </div>
            </div>

            {/* Project titles */}
            <div
              ref={titlesRef}
              className="space-y-4 sm:space-y-6 md:space-y-8"
            >
              {projects.map((project, index) => (
                <ProjectTitle
                  key={project.id}
                  project={project}
                  index={index}
                  isActive={index === activeIndex}
                  onClick={() => handleProjectClick(project)}
                  progress={scrollProgress}
                />
              ))}
            </div>

            {/* Active project indicator */}
            <div className="mt-8 sm:mt-12 font-mono text-[8px] sm:text-[10px] text-foreground/20">
              └── ACTIVE: [{projects[activeIndex].title}] ──────────
            </div>
          </div>

          {/* ASCII footer decoration */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 font-mono text-[7px] sm:text-[9px] text-foreground/20">
            <div className="flex items-center gap-2">
              <span>╚══</span>
              <span className="flex-1 overflow-hidden whitespace-nowrap">{ASCII_LINES.horizontal}</span>
              <span className="text-foreground/40">EOF</span>
              <span>══╝</span>
            </div>
          </div>

          {/* Side decorations - desktop */}
          <div className="hidden lg:block absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[8px] text-foreground/10 writing-mode-vertical" style={{ writingMode: "vertical-rl" }}>
            {ASCII_LINES.dots}
          </div>
          <div className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[8px] text-foreground/10 writing-mode-vertical transform rotate-180" style={{ writingMode: "vertical-rl" }}>
            {ASCII_LINES.dots}
          </div>
        </div>

        {/* Scroll progress indicator - desktop */}
        <ScrollProgress progress={scrollProgress} activeIndex={activeIndex} />
      </section>

      {/* Mobile progress */}
      {!isOverlayOpen && <MobileProgress activeIndex={activeIndex} />}

      {/* Image overlay */}
      <ImageOverlay
        project={selectedProject}
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
      />
    </>
  )
}
