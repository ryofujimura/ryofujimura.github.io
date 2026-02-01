"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { X, ExternalLink, Github } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const MOBILE_BREAKPOINT = 768
const ASCII_BORDER = "░▒▓█"
const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?░▒▓█▄▀■□●○◆◇"

// ─────────────────────────────────────────────────────────────
// PROJECT DATA
// ─────────────────────────────────────────────────────────────

const projects = [
  {
    id: "01",
    title: "POKER%",
    subtitle: "WATCHOS",
    year: "2022",
    description: "Real-time poker odds calculator for Apple Watch. Monte Carlo simulation with sub-10ms response.",
    techStack: ["Swift", "WatchOS", "SwiftUI"],
    images: ["/images/poker_1.jpg", "/images/poker_2.jpg", "/images/poker_3.jpg"],
    links: { github: "https://github.com/ryofujimura", appStore: "https://apps.apple.com/us/app/poker-pocket-odds/id6499280318" },
    ascii: `♠ ♥ ♦ ♣`,
    metric: "<10ms",
  },
  {
    id: "02",
    title: "SHOHEI_HG",
    subtitle: "AUTOMATION",
    year: "2023",
    description: "Automated content pipeline for Instagram and YouTube with intelligent hashtag optimization.",
    techStack: ["Python", "Instagram API", "YouTube API"],
    images: ["/images/shoheihomeground_1.jpg", "/images/shoheihomeground_2.jpg", "/images/shoheihomeground_3.jpg"],
    links: { instagram: "#", youtube: "#" },
    ascii: `▓▓▓▓▓▓░░`,
    metric: "685 POSTS",
  },
  {
    id: "03",
    title: "SCHEDULE",
    subtitle: "FLASK",
    year: "2023",
    description: "Intelligent course scheduling with conflict detection using graph coloring algorithms.",
    techStack: ["Python", "Flask", "SQLite"],
    images: ["/images/schedule.jpg"],
    links: { github: "https://github.com/ryofujimura" },
    ascii: `│M│T│W│T│F│`,
    metric: "70% FEWER",
  },
  {
    id: "04",
    title: "MATCHA",
    subtitle: "IOS",
    year: "2024",
    description: "Minimalist matcha timer with Japanese aesthetic. Precision brewing and ritual tracking.",
    techStack: ["Swift", "SwiftUI", "CloudKit"],
    images: ["/images/matchatime_1.jpg", "/images/matchatime_2.jpg", "/images/matchatime_3.jpg"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
    ascii: `🍵 ░░░░░`,
    metric: "4 WEEKS",
  },
  {
    id: "05",
    title: "PORTFOLIO",
    subtitle: "NEXT.JS",
    year: "2024",
    description: "This portfolio. Next.js 15 with scroll-driven animations and brutalist design system.",
    techStack: ["React", "Next.js", "GSAP", "Tailwind"],
    images: ["/images/homepage.png", "/images/experiencepage.png"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
    ascii: `████████░░`,
    metric: "<1.5s LCP",
  },
  {
    id: "06",
    title: "SABORIENDO",
    subtitle: "CROSS-PLATFORM",
    year: "2024",
    description: "Food tracking with barcode scanning. Cross-platform sync using Firebase Realtime Database.",
    techStack: ["React 19", "SwiftUI", "Firebase"],
    images: [],
    links: { github: "https://github.com/ryofujimura" },
    ascii: `║│║ │║│║│`,
    metric: "<1s SCAN",
  },
  {
    id: "07",
    title: "WITH_LLM",
    subtitle: "ON-DEVICE AI",
    year: "2024",
    description: "Privacy-focused AI assistant running entirely on-device with llama.cpp and quantized models.",
    techStack: ["Swift", "llama.cpp", "GGUF"],
    images: [],
    links: { github: "https://github.com/ryofujimura" },
    ascii: `◉ ░▒▓█▓▒░`,
    metric: "<50ms/TKN",
  },
  {
    id: "08",
    title: "HTIC_SHUTTLE",
    subtitle: "REAL-TIME",
    year: "2025",
    description: "Campus shuttle tracking with real-time location updates and sub-100ms latency.",
    techStack: ["Swift", "Kotlin", "Firebase"],
    images: [],
    links: { github: "https://github.com/ryofujimura" },
    ascii: `──○────○──`,
    metric: "<100ms",
  },
  {
    id: "09",
    title: "CYBEREDU",
    subtitle: "OFFLINE-FIRST",
    year: "2025",
    description: "Educational platform with offline-first architecture and conflict resolution.",
    techStack: ["Swift", "Kotlin", "Firebase"],
    images: ["/images/CyberEdu-1.PNG", "/images/CyberEdu-2.PNG", "/images/CyberEdu-3.PNG"],
    links: { github: "https://github.com/ryofujimura" },
    ascii: `● OFFLINE`,
    metric: "99%+ UP",
  },
  {
    id: "10",
    title: "LAB_PM",
    subtitle: "SERVERLESS",
    year: "2025",
    description: "Research lab PM tool with AI-powered task routing and dynamic model selection.",
    techStack: ["Cloud Functions", "Firebase", "GPT-4"],
    images: [],
    links: { github: "https://github.com/ryofujimura" },
    ascii: `◇ PAPERS`,
    metric: "<200ms AI",
  },
  {
    id: "11",
    title: "WHITEBOARD",
    subtitle: "VISION ML",
    year: "2025",
    description: "Collaborative whiteboard with real-time AI vision processing and CRDT sync.",
    techStack: ["PyTorch", "WebSocket", "React"],
    images: ["/images/whiteboardai-1.jpg", "/images/whiteboardai-2.jpg"],
    links: { github: "https://github.com/ryofujimura" },
    ascii: `○ ─── □`,
    metric: "60fps",
  },
  {
    id: "12",
    title: "ZERO_INBOX",
    subtitle: "AI ENGINE",
    year: "2025",
    description: "Email management with multi-stage AI reasoning and 95% categorization accuracy.",
    techStack: ["Swift", "AI/ML", "Firebase"],
    images: [],
    links: { github: "https://github.com/ryofujimura" },
    ascii: `INBOX: 0`,
    metric: "95% ACC",
  },
]

type Project = (typeof projects)[0]

// ─────────────────────────────────────────────────────────────
// MOBILE DETECTION HOOK
// ─────────────────────────────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    setIsMobile(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }

    const handleResize = () => {
      setIsMobile(window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    window.addEventListener("resize", handleResize)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return isMobile
}

// ─────────────────────────────────────────────────────────────
// ASCII LOADING ANIMATION
// ─────────────────────────────────────────────────────────────

function LoadingScreen({ isLoading }: { isLoading: boolean }) {
  const [frame, setFrame] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const frames = [
    "█░░░░░░░░░░░░░░░",
    "██░░░░░░░░░░░░░░",
    "███░░░░░░░░░░░░░",
    "████░░░░░░░░░░░░",
    "█████░░░░░░░░░░░",
    "██████░░░░░░░░░░",
    "███████░░░░░░░░░",
    "████████░░░░░░░░",
    "█████████░░░░░░░",
    "██████████░░░░░░",
    "███████████░░░░░",
    "████████████░░░░",
    "█████████████░░░",
    "██████████████░░",
    "███████████████░",
    "████████████████",
  ]

  useEffect(() => {
    if (!isLoading) return
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % frames.length)
    }, 50)
    return () => clearInterval(interval)
  }, [isLoading, frames.length])

  useEffect(() => {
    if (!containerRef.current) return

    if (!isLoading) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      })
    } else {
      gsap.set(containerRef.current, { opacity: 1 })
    }
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
    >
      <div className="font-mono text-center">
        <pre className="text-foreground/20 text-[8px] md:text-[10px] mb-4">
{`
╔════════════════════════════╗
║                            ║
║     LOADING PROJECTS       ║
║                            ║
╚════════════════════════════╝
`}
        </pre>
        <div className="text-foreground/60 text-xs tracking-[0.2em]">
          [{frames[frame]}]
        </div>
        <div className="text-foreground/30 text-[8px] mt-2">
          INITIALIZING...
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ASCII BACKGROUND PATTERN
// ─────────────────────────────────────────────────────────────

function AsciiBackground() {
  const [pattern, setPattern] = useState<string>("")

  useEffect(() => {
    const chars = "░▒▓·:;|+=-_"
    const rows = 40
    const cols = 100
    let grid = ""

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // Create a structured pattern
        if (i % 8 === 0) {
          grid += "─"
        } else if (j % 16 === 0) {
          grid += "│"
        } else if ((i + j) % 20 === 0) {
          grid += "+"
        } else {
          grid += chars[Math.floor(Math.random() * chars.length)]
        }
      }
      grid += "\n"
    }
    setPattern(grid)
  }, [])

  return (
    <pre className="fixed inset-0 pointer-events-none text-foreground/[0.03] text-[6px] leading-tight overflow-hidden font-mono whitespace-pre z-0">
      {pattern}
    </pre>
  )
}

// ─────────────────────────────────────────────────────────────
// TECHNICAL SVG GRID
// ─────────────────────────────────────────────────────────────

function TechnicalGrid({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const lines = svgRef.current.querySelectorAll("line, circle, path")
    gsap.fromTo(
      lines,
      { strokeDashoffset: 500, opacity: 0 },
      {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 2,
        stagger: 0.02,
        ease: "power2.out",
      }
    )
  }, [])

  return (
    <svg
      ref={svgRef}
      className={cn("absolute pointer-events-none", className)}
      viewBox="0 0 400 400"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
    >
      {/* Grid */}
      {Array.from({ length: 20 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 20}
          x2="400"
          y2={i * 20}
          className="text-foreground/5"
          strokeDasharray="400"
        />
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 20}
          y1="0"
          x2={i * 20}
          y2="400"
          className="text-foreground/5"
          strokeDasharray="400"
        />
      ))}
      {/* Corner markers */}
      <path d="M0 30 L0 0 L30 0" className="text-foreground/20" strokeWidth="1" />
      <path d="M370 0 L400 0 L400 30" className="text-foreground/20" strokeWidth="1" />
      <path d="M400 370 L400 400 L370 400" className="text-foreground/20" strokeWidth="1" />
      <path d="M30 400 L0 400 L0 370" className="text-foreground/20" strokeWidth="1" />
      {/* Center crosshair */}
      <circle cx="200" cy="200" r="40" className="text-foreground/10" strokeDasharray="251" />
      <circle cx="200" cy="200" r="80" className="text-foreground/5" strokeDasharray="502" />
      <line x1="200" y1="150" x2="200" y2="170" className="text-foreground/15" />
      <line x1="200" y1="230" x2="200" y2="250" className="text-foreground/15" />
      <line x1="150" y1="200" x2="170" y2="200" className="text-foreground/15" />
      <line x1="230" y1="200" x2="250" y2="200" className="text-foreground/15" />
      {/* Diagonal lines */}
      <line x1="0" y1="0" x2="100" y2="100" className="text-foreground/5" strokeDasharray="141" />
      <line x1="400" y1="0" x2="300" y2="100" className="text-foreground/5" strokeDasharray="141" />
      <line x1="0" y1="400" x2="100" y2="300" className="text-foreground/5" strokeDasharray="141" />
      <line x1="400" y1="400" x2="300" y2="300" className="text-foreground/5" strokeDasharray="141" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// GLITCH TEXT EFFECT
// ─────────────────────────────────────────────────────────────

function GlitchText({
  text,
  className,
  isActive,
}: {
  text: string
  className?: string
  isActive?: boolean
}) {
  const [displayText, setDisplayText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setDisplayText(text)
      return
    }

    setIsGlitching(true)
    let iteration = 0
    const maxIterations = text.length * 2

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, i) => {
            if (char === " " || char === "_") return char
            if (i < iteration / 2) return char
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          })
          .join("")
      )

      iteration++
      if (iteration >= maxIterations) {
        setDisplayText(text)
        setIsGlitching(false)
        clearInterval(interval)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [text, isActive])

  return (
    <span className={cn(className, isGlitching && "opacity-90")}>
      {displayText}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT TITLE COMPONENT
// ─────────────────────────────────────────────────────────────

function ProjectTitle({
  project,
  index,
  isSelected,
  onClick,
  isMobile,
}: {
  project: Project
  index: number
  isSelected: boolean
  onClick: () => void
  isMobile: boolean
}) {
  const titleRef = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!titleRef.current) return

    if (isSelected) {
      gsap.to(titleRef.current, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      })
    } else {
      gsap.to(titleRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }, [isSelected])

  const handleHover = () => {
    if (isMobile) return
    setIsHovered(true)
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        x: 10,
        duration: 0.2,
        ease: "power2.out",
      })
    }
  }

  const handleLeave = () => {
    setIsHovered(false)
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        x: 0,
        duration: 0.2,
        ease: "power2.out",
      })
    }
  }

  return (
    <button
      ref={titleRef}
      onClick={onClick}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      className={cn(
        "project-title w-full text-left transition-all duration-300 relative group",
        "font-mono tracking-tighter leading-none",
        "py-2 md:py-3 px-2 md:px-4",
        "border-l-2 md:border-l-4",
        isSelected
          ? "border-foreground text-foreground bg-foreground/5"
          : isHovered
          ? "border-foreground/50 text-foreground/80"
          : "border-transparent text-foreground/40 hover:text-foreground/60"
      )}
    >
      <div className="flex items-baseline gap-2 md:gap-4">
        {/* Index number */}
        <span
          className={cn(
            "text-[10px] md:text-xs font-mono transition-opacity",
            isSelected ? "text-foreground/60" : "text-foreground/20"
          )}
        >
          {project.id}
        </span>

        {/* Title */}
        <span
          className={cn(
            "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black",
            isSelected && "tracking-tight"
          )}
        >
          <GlitchText text={project.title} isActive={isSelected || isHovered} />
        </span>

        {/* Subtitle */}
        <span
          className={cn(
            "text-[8px] md:text-[10px] transition-opacity hidden sm:inline",
            isSelected ? "text-foreground/50" : "text-foreground/20"
          )}
        >
          [{project.subtitle}]
        </span>

        {/* Year */}
        <span
          className={cn(
            "text-[8px] md:text-[10px] ml-auto transition-opacity",
            isSelected ? "text-foreground/40" : "text-foreground/10"
          )}
        >
          {project.year}
        </span>
      </div>

      {/* ASCII indicator */}
      <div
        className={cn(
          "absolute right-2 md:right-4 top-1/2 -translate-y-1/2 font-mono text-[8px] md:text-[10px]",
          "transition-opacity",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      >
        <span className="text-foreground/30">{project.ascii}</span>
      </div>

      {/* Hover indicator */}
      {(isHovered || isSelected) && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-foreground/20" />
      )}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT DETAIL MODAL
// ─────────────────────────────────────────────────────────────

function ProjectModal({
  project,
  isOpen,
  onClose,
  isMobile,
}: {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}) {
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set())

  // Reset state when project changes
  useEffect(() => {
    setActiveImageIndex(0)
    setImagesLoaded(new Set())
  }, [project?.id])

  // Animate modal
  useEffect(() => {
    if (!modalRef.current || !contentRef.current) return

    if (isOpen) {
      document.body.style.overflow = "hidden"

      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      )

      gsap.fromTo(
        contentRef.current,
        { y: isMobile ? "100%" : 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", delay: 0.1 }
      )

      // Animate content elements
      const elements = contentRef.current.querySelectorAll(".modal-animate")
      gsap.fromTo(
        elements,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, delay: 0.2, ease: "power2.out" }
      )
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen, isMobile])

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  if (!isOpen || !project) return null

  const hasImages = project.images.length > 0

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[90] bg-background/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Technical grid background */}
      <TechnicalGrid className="w-full h-full opacity-30" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-2 font-mono text-foreground/60 hover:text-foreground transition-colors border border-foreground/20 hover:border-foreground/40 bg-background"
      >
        <div className="flex items-center gap-2">
          <X className="w-4 h-4" />
          <span className="text-[8px] md:text-[10px] hidden md:inline">ESC</span>
        </div>
      </button>

      {/* Content */}
      <div
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "absolute bg-background border border-foreground/20 overflow-hidden",
          isMobile
            ? "inset-x-0 bottom-0 top-16 rounded-t-lg"
            : "inset-8 md:inset-12 lg:inset-16"
        )}
      >
        {/* ASCII header */}
        <div className="font-mono text-[7px] md:text-[9px] text-foreground/20 p-3 md:p-4 border-b border-foreground/10">
          <div className="flex items-center justify-between">
            <span>╔═══ PROJECT://{project.id} ═══╗</span>
            <span>{project.year}</span>
          </div>
        </div>

        <div className={cn(
          "h-[calc(100%-40px)] overflow-y-auto",
          isMobile ? "p-4" : "p-6 md:p-8 lg:p-12"
        )}>
          <div className={cn(
            "grid gap-6 md:gap-8",
            isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
          )}>
            {/* Left: Images */}
            <div className="modal-animate">
              {hasImages ? (
                <div className="space-y-3">
                  {/* Main image */}
                  <div className="relative aspect-video bg-foreground/5 border border-foreground/20 overflow-hidden">
                    {!imagesLoaded.has(activeImageIndex) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="font-mono text-[10px] text-foreground/30 animate-pulse">
                          ░▒▓ LOADING ▓▒░
                        </div>
                      </div>
                    )}
                    <Image
                      src={project.images[activeImageIndex]}
                      alt={`${project.title} preview`}
                      fill
                      className={cn(
                        "object-cover transition-opacity duration-300",
                        imagesLoaded.has(activeImageIndex) ? "opacity-100" : "opacity-0"
                      )}
                      onLoad={() => setImagesLoaded(prev => new Set(prev).add(activeImageIndex))}
                    />

                    {/* Corner marks */}
                    <span className="absolute top-2 left-2 font-mono text-[8px] text-white/60 drop-shadow-lg">┌──</span>
                    <span className="absolute top-2 right-2 font-mono text-[8px] text-white/60 drop-shadow-lg">──┐</span>
                    <span className="absolute bottom-2 left-2 font-mono text-[8px] text-white/60 drop-shadow-lg">└──</span>
                    <span className="absolute bottom-2 right-2 font-mono text-[8px] text-white/60 drop-shadow-lg">──┘</span>

                    {/* Image counter */}
                    <div className="absolute bottom-3 right-3 font-mono text-[10px] text-white/80 bg-black/50 px-2 py-1">
                      {String(activeImageIndex + 1).padStart(2, "0")}/{String(project.images.length).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {project.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                      {project.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={cn(
                            "relative w-16 h-12 md:w-20 md:h-14 flex-shrink-0 border transition-all",
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
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-foreground/5 border border-dashed border-foreground/20 flex items-center justify-center">
                  <div className="text-center font-mono">
                    <pre className="text-foreground/20 text-[8px] md:text-[10px] leading-tight">
{`┌─────────────────────────┐
│                         │
│    NO_PREVIEW_IMAGE     │
│    [IN_DEVELOPMENT]     │
│                         │
└─────────────────────────┘`}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="space-y-4 md:space-y-6">
              {/* Title */}
              <div className="modal-animate">
                <h2 className="font-mono text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tighter">
                  {project.title}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[10px] md:text-xs text-foreground/50">
                    {project.subtitle}
                  </span>
                  <span className="font-mono text-[10px] text-foreground/30">•</span>
                  <span className="font-mono text-[10px] md:text-xs text-foreground/40">
                    {project.year}
                  </span>
                </div>
              </div>

              {/* Metric */}
              <div className="modal-animate border border-foreground/20 p-3 md:p-4 bg-foreground/[0.02]">
                <div className="font-mono text-[8px] text-foreground/40 mb-1">KEY_METRIC</div>
                <div className="font-mono text-xl md:text-2xl font-black text-foreground">
                  {project.metric}
                </div>
              </div>

              {/* Description */}
              <div className="modal-animate">
                <div className="font-mono text-[8px] text-foreground/40 mb-2">├── DESCRIPTION</div>
                <p className="font-mono text-[11px] md:text-xs text-foreground/70 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Tech stack */}
              <div className="modal-animate">
                <div className="font-mono text-[8px] text-foreground/40 mb-2">├── TECH_STACK</div>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[9px] md:text-[10px] px-2 py-1 border border-foreground/20 text-foreground/60 bg-foreground/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* ASCII art */}
              <div className="modal-animate border border-foreground/10 p-3 bg-foreground/[0.02]">
                <div className="font-mono text-[8px] text-foreground/40 mb-2">└── ASCII</div>
                <pre className="font-mono text-foreground/30 text-xs md:text-sm">
                  {project.ascii}
                </pre>
              </div>

              {/* Links */}
              <div className="modal-animate flex gap-2 flex-wrap">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 font-mono text-[10px] border border-foreground/30 text-foreground/70 hover:bg-foreground hover:text-background transition-all"
                  >
                    <Github className="w-3 h-3" />
                    <span>CODE</span>
                  </a>
                )}
                {"demo" in project.links && project.links.demo && (
                  <a
                    href={project.links.demo as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 font-mono text-[10px] border border-foreground/30 text-foreground/70 hover:bg-foreground hover:text-background transition-all"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>DEMO</span>
                  </a>
                )}
                {"appStore" in project.links && (
                  <span className="flex items-center gap-2 px-3 py-2 font-mono text-[10px] border border-foreground/10 text-foreground/30">
                    ◉ APP_STORE
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ASCII footer */}
        <div className="absolute bottom-0 left-0 right-0 font-mono text-[7px] md:text-[9px] text-foreground/20 p-3 md:p-4 border-t border-foreground/10 bg-background">
          <span>╚═══ TAP_OUTSIDE_TO_CLOSE ═══╝</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SCROLL INDICATOR
// ─────────────────────────────────────────────────────────────

function ScrollIndicator({ progress }: { progress: number }) {
  const filled = Math.round(progress * 20)
  const bar = "█".repeat(filled) + "░".repeat(20 - filled)

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 font-mono text-[8px] text-foreground/40 z-50">
      <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-2 border border-foreground/10">
        <span>SCROLL</span>
        <span className="tracking-tighter">[{bar}]</span>
        <span>{Math.round(progress * 100)}%</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN PROJECTS SECTION
// ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [scrollProgress, setScrollProgress] = useState(0)

  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const titlesRef = useRef<HTMLDivElement>(null)

  const isMobile = useIsMobile()

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  // GSAP ScrollTrigger setup
  useEffect(() => {
    if (!sectionRef.current || !containerRef.current || !titlesRef.current || isLoading) return

    const ctx = gsap.context(() => {
      // Pin configuration based on device
      const pinDuration = isMobile ? "200%" : "150%"

      // Main pinning ScrollTrigger
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${pinDuration}`,
        pin: containerRef.current,
        pinSpacing: true,
        scrub: isMobile ? 0.5 : 1,
        onUpdate: (self) => {
          setScrollProgress(self.progress)

          // Calculate active project based on scroll
          const projectIndex = Math.floor(self.progress * projects.length)
          const clampedIndex = Math.min(projectIndex, projects.length - 1)
          
          if (clampedIndex !== activeIndex) {
            setActiveIndex(clampedIndex)
          }
        },
      })

      // Animate project titles as they come into view
      const titles = titlesRef.current?.querySelectorAll(".project-title")
      titles?.forEach((title, index) => {
        const startProgress = index / projects.length
        const endProgress = (index + 1) / projects.length

        gsap.fromTo(
          title,
          {
            opacity: 0.2,
            x: isMobile ? -20 : -50,
            scale: 0.95,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: `+=${pinDuration}`,
              scrub: true,
              onUpdate: (self) => {
                const progress = self.progress
                const isActive = progress >= startProgress && progress < endProgress

                if (isActive) {
                  gsap.to(title, {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.3,
                  })
                } else {
                  const distance = Math.min(
                    Math.abs(progress - startProgress),
                    Math.abs(progress - endProgress)
                  )
                  const fadeAmount = Math.min(distance * 5, 0.7)

                  gsap.to(title, {
                    opacity: 1 - fadeAmount,
                    x: progress < startProgress ? (isMobile ? -10 : -30) : 0,
                    scale: 0.98,
                    duration: 0.3,
                  })
                }
              },
            },
          }
        )
      })
    }, sectionRef.current)

    return () => ctx.revert()
  }, [isLoading, isMobile, activeIndex])

  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null)
  }, [])

  return (
    <>
      <LoadingScreen isLoading={isLoading} />

      <section
        id="projects"
        ref={sectionRef}
        className="relative bg-background"
      >
        {/* ASCII background */}
        <AsciiBackground />

        <div
          ref={containerRef}
          className="min-h-screen flex flex-col relative z-10"
        >
          {/* Header */}
          <div className="px-4 md:px-8 lg:px-12 pt-6 md:pt-8 lg:pt-12">
            <div className="font-mono text-foreground/20 text-[7px] md:text-[9px] mb-2 flex items-center">
              <span>╔</span>
              <span className="flex-1 overflow-hidden">{"═".repeat(200)}</span>
              <span>╗</span>
            </div>

            <div className="flex items-end justify-between mb-4 md:mb-6">
              <div>
                <div className="font-mono text-[8px] md:text-[10px] text-foreground/40 mb-1">
                  SECTION://PROJECTS
                </div>
                <h2 className="font-mono text-xl md:text-2xl lg:text-3xl font-black text-foreground tracking-tighter">
                  SELECTED_WORK
                </h2>
              </div>

              <div className="text-right font-mono">
                <div className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground/10 leading-none">
                  {String(projects.length).padStart(2, "0")}
                </div>
                <div className="text-[7px] md:text-[8px] text-foreground/40">
                  PROJECTS
                </div>
              </div>
            </div>

            <div className="font-mono text-[7px] md:text-[8px] text-foreground/30 mb-4">
              [ TAP PROJECT TO VIEW DETAILS ]
            </div>
          </div>

          {/* Project titles list */}
          <div
            ref={titlesRef}
            className={cn(
              "flex-1 overflow-hidden px-2 md:px-6 lg:px-10",
              "flex flex-col justify-center"
            )}
          >
            <div className="space-y-0">
              {projects.map((project, index) => (
                <ProjectTitle
                  key={project.id}
                  project={project}
                  index={index}
                  isSelected={index === activeIndex}
                  onClick={() => handleProjectClick(project)}
                  isMobile={isMobile}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 md:px-8 lg:px-12 pb-6 md:pb-8 lg:pb-12">
            <div className="font-mono text-foreground/20 text-[7px] md:text-[9px] flex items-center">
              <span>╚</span>
              <span className="flex-1 overflow-hidden">{"═".repeat(200)}</span>
              <span>╝</span>
            </div>

            {/* Scroll hint */}
            <div className="text-center mt-4">
              <span className="font-mono text-[8px] text-foreground/30 animate-pulse inline-flex items-center gap-2">
                <span>▼</span>
                <span>SCROLL TO EXPLORE</span>
                <span>▼</span>
              </span>
            </div>
          </div>
        </div>

        {/* Technical grid overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <TechnicalGrid className="w-full h-full" />
        </div>
      </section>

      {/* Scroll indicator */}
      {scrollProgress > 0 && scrollProgress < 1 && (
        <ScrollIndicator progress={scrollProgress} />
      )}

      {/* Project modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={handleCloseModal}
        isMobile={isMobile}
      />
    </>
  )
}
