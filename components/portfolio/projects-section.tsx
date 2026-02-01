"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// MOBILE DETECTION HOOK
// ─────────────────────────────────────────────────────────────

const MOBILE_BREAKPOINT = 768

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
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
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
// PROJECT DATA
// ─────────────────────────────────────────────────────────────

const projectsData = [
  {
    id: "01",
    title: "POKER %",
    subtitle: "WATCHOS",
    year: "2022",
    description: "Real-time poker odds calculator for Apple Watch with Monte Carlo simulation.",
    techStack: ["Swift", "WatchOS", "SwiftUI"],
    images: ["/images/poker_1.jpg", "/images/poker_2.jpg", "/images/poker_3.jpg"],
    ascii: `♠♥♦♣`,
    links: { github: "https://github.com/ryofujimura", appStore: "https://apps.apple.com/us/app/poker-pocket-odds/id6499280318" },
  },
  {
    id: "02",
    title: "SHOHEI HG",
    subtitle: "AUTOMATION",
    year: "2023",
    description: "Automated content pipeline for Instagram and YouTube with Python.",
    techStack: ["Python", "API", "Automation"],
    images: ["/images/shoheihomeground_1.jpg", "/images/shoheihomeground_2.jpg", "/images/shoheihomeground_3.jpg"],
    ascii: `▓░▓░`,
    links: { instagram: "#", youtube: "#" },
  },
  {
    id: "03",
    title: "SCHEDULE",
    subtitle: "FLASK",
    year: "2023",
    description: "Intelligent course scheduling with graph coloring algorithms.",
    techStack: ["Python", "Flask", "SQLite"],
    images: ["/images/schedule.jpg"],
    ascii: `┌┬┐`,
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "04",
    title: "MATCHA",
    subtitle: "IOS APP",
    year: "2024",
    description: "Minimalist matcha timer with Japanese aesthetic and CloudKit sync.",
    techStack: ["Swift", "SwiftUI", "CloudKit"],
    images: ["/images/matchatime_1.jpg", "/images/matchatime_2.jpg", "/images/matchatime_3.jpg"],
    ascii: `🍵`,
    links: { appStore: "#" },
  },
  {
    id: "05",
    title: "PORTFOLIO",
    subtitle: "NEXT.JS",
    year: "2024",
    description: "This website. Brutalist design with GSAP scroll animations.",
    techStack: ["React", "Next.js", "GSAP", "Tailwind"],
    images: ["/images/homepage.png", "/images/experiencepage.png"],
    ascii: `◆◇◆`,
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "06",
    title: "SABORIENDO",
    subtitle: "CROSS-PLAT",
    year: "2024",
    description: "Food tracking with barcode scanning. iOS and web sync via Firebase.",
    techStack: ["React 19", "SwiftUI", "Firebase"],
    images: [],
    ascii: `║│║`,
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "07",
    title: "LOCAL LLM",
    subtitle: "ON-DEVICE AI",
    year: "2024",
    description: "Privacy-first AI assistant running entirely on-device with llama.cpp.",
    techStack: ["Swift", "llama.cpp", "GGUF"],
    images: [],
    ascii: `◉●◉`,
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "08",
    title: "SHUTTLE",
    subtitle: "REAL-TIME",
    year: "2025",
    description: "Campus shuttle tracking with sub-100ms latency using Firebase RTDB.",
    techStack: ["Swift", "Kotlin", "Firebase"],
    images: [],
    ascii: `═○═`,
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "09",
    title: "CYBEREDU",
    subtitle: "OFFLINE-FIRST",
    year: "2025",
    description: "Educational platform with offline-first architecture and conflict resolution.",
    techStack: ["Swift", "Kotlin", "Firebase"],
    images: ["/images/CyberEdu-1.PNG", "/images/CyberEdu-2.PNG", "/images/CyberEdu-3.PNG"],
    ascii: `●○●`,
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "10",
    title: "LAB PM",
    subtitle: "SERVERLESS",
    year: "2025",
    description: "AI-powered project management for research labs with dynamic routing.",
    techStack: ["Cloud Functions", "Firebase", "GPT-4"],
    images: [],
    ascii: `◇◆◇`,
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "11",
    title: "WHITEBOARD",
    subtitle: "VISION ML",
    year: "2025",
    description: "Collaborative whiteboard with real-time AI vision and CRDT sync.",
    techStack: ["PyTorch", "WebSocket", "React"],
    images: ["/images/whiteboardai-1.jpg", "/images/whiteboardai-2.jpg"],
    ascii: `□○□`,
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "12",
    title: "ZERO INBOX",
    subtitle: "AI ENGINE",
    year: "2025",
    description: "Email management with multi-stage AI reasoning and 95% accuracy.",
    techStack: ["Swift", "AI/ML", "Firebase"],
    images: [],
    ascii: `▓█▓`,
    links: { github: "https://github.com/ryofujimura" },
  },
]

type Project = (typeof projectsData)[0]

// ─────────────────────────────────────────────────────────────
// ASCII GLITCH CHARACTERS
// ─────────────────────────────────────────────────────────────

const GLITCH_CHARS = "░▒▓█▄▀■□●○◆◇╳╱╲─│┌┐└┘├┤┬┴┼!@#$%^&*"
const ASCII_BORDER = "═══════════════════════════════════════"

// ─────────────────────────────────────────────────────────────
// LOADING SCREEN
// ─────────────────────────────────────────────────────────────

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  
  const loadingMessages = [
    "INITIALIZING_PROJECTS",
    "LOADING_ASSETS",
    "COMPILING_DATA",
    "RENDERING_UI",
    "SYSTEM_READY"
  ]

  useEffect(() => {
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(interval)
        
        // Animate out
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            opacity: 0,
            y: -50,
            duration: 0.5,
            ease: "power2.in",
            onComplete
          })
        }
      }
      setProgress(Math.min(currentProgress, 100))
    }, 100)

    return () => clearInterval(interval)
  }, [onComplete])

  // Glitch text effect
  useEffect(() => {
    const msgIndex = Math.min(Math.floor(progress / 20), loadingMessages.length - 1)
    const targetText = loadingMessages[msgIndex]
    
    let iteration = 0
    const maxIterations = targetText.length * 2
    
    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split("")
          .map((char, i) => {
            if (char === "_") return "_"
            if (i < iteration / 2) return char
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          })
          .join("")
      )
      
      iteration++
      if (iteration >= maxIterations) {
        setDisplayText(targetText)
        clearInterval(interval)
      }
    }, 20)

    return () => clearInterval(interval)
  }, [progress])

  const barLength = 30
  const filled = Math.floor((progress / 100) * barLength)
  const progressBar = "█".repeat(filled) + "░".repeat(barLength - filled)

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-background flex items-center justify-center"
    >
      <div className="font-mono text-center">
        {/* ASCII art header */}
        <pre className="text-[8px] md:text-[10px] text-foreground/20 mb-6 leading-tight">
{`
    ██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗███████╗
    ██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝██╔════╝
    ██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║   ███████╗
    ██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║   ╚════██║
    ██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║   ███████║
    ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝
`}
        </pre>
        
        <div className="text-xs text-foreground/60 mb-4 tracking-widest">
          {displayText}
        </div>
        
        <div className="text-foreground/40 text-sm mb-2">
          [{progressBar}]
        </div>
        
        <div className="text-foreground/60 text-lg font-bold">
          {Math.floor(progress)}%
        </div>
        
        <div className="text-[8px] text-foreground/20 mt-4 animate-pulse">
          ▼ SCROLL TO EXPLORE ▼
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TECHNICAL SVG PATTERN - ANIMATED LINES
// ─────────────────────────────────────────────────────────────

function TechnicalBackground({ isActive }: { isActive: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !isActive) return

    const lines = svgRef.current.querySelectorAll(".tech-line")
    const circles = svgRef.current.querySelectorAll(".tech-circle")

    gsap.fromTo(
      lines,
      { strokeDashoffset: 1000, opacity: 0 },
      { 
        strokeDashoffset: 0, 
        opacity: 1, 
        duration: 2, 
        stagger: 0.1, 
        ease: "power2.out" 
      }
    )

    gsap.fromTo(
      circles,
      { scale: 0, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 0.5, 
        stagger: 0.05, 
        delay: 0.5,
        ease: "back.out(2)" 
      }
    )
  }, [isActive])

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Grid lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <line
          key={`h-${i}`}
          className="tech-line text-foreground/[0.03]"
          x1="0"
          y1={i * 50}
          x2="1000"
          y2={i * 50}
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="1000"
        />
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <line
          key={`v-${i}`}
          className="tech-line text-foreground/[0.03]"
          x1={i * 50}
          y1="0"
          x2={i * 50}
          y2="1000"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="1000"
        />
      ))}
      
      {/* Corner brackets */}
      <path 
        className="tech-line text-foreground/10" 
        d="M50 100 L50 50 L100 50" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeDasharray="1000"
      />
      <path 
        className="tech-line text-foreground/10" 
        d="M900 50 L950 50 L950 100" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeDasharray="1000"
      />
      <path 
        className="tech-line text-foreground/10" 
        d="M950 900 L950 950 L900 950" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeDasharray="1000"
      />
      <path 
        className="tech-line text-foreground/10" 
        d="M100 950 L50 950 L50 900" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeDasharray="1000"
      />

      {/* Decorative circles */}
      {[
        { cx: 100, cy: 100 },
        { cx: 900, cy: 100 },
        { cx: 500, cy: 500 },
        { cx: 100, cy: 900 },
        { cx: 900, cy: 900 },
      ].map((pos, i) => (
        <circle
          key={i}
          className="tech-circle text-foreground/5"
          cx={pos.cx}
          cy={pos.cy}
          r="30"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      ))}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT TITLE COMPONENT - LARGE TYPOGRAPHY
// ─────────────────────────────────────────────────────────────

function ProjectTitle({ 
  project, 
  isActive, 
  isExpanded,
  onClick,
  index
}: { 
  project: Project
  isActive: boolean
  isExpanded: boolean
  onClick: () => void
  index: number
}) {
  const titleRef = useRef<HTMLDivElement>(null)
  const [glitchText, setGlitchText] = useState(project.title)
  const [isHovered, setIsHovered] = useState(false)

  // Glitch animation on hover/active
  useEffect(() => {
    if (!isActive && !isHovered) {
      setGlitchText(project.title)
      return
    }

    const targetText = project.title
    let iteration = 0
    const maxIterations = targetText.length * 3

    const interval = setInterval(() => {
      setGlitchText(
        targetText
          .split("")
          .map((char, i) => {
            if (char === " ") return " "
            if (i < iteration / 3) return char
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          })
          .join("")
      )

      iteration++
      if (iteration >= maxIterations) {
        setGlitchText(targetText)
        clearInterval(interval)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [project.title, isActive, isHovered])

  // GSAP entrance animation
  useEffect(() => {
    if (!titleRef.current || !isActive) return

    gsap.fromTo(
      titleRef.current,
      { 
        y: 100, 
        opacity: 0, 
        skewY: 5,
        scale: 0.9
      },
      { 
        y: 0, 
        opacity: 1, 
        skewY: 0,
        scale: 1,
        duration: 0.8, 
        ease: "power3.out" 
      }
    )
  }, [isActive])

  return (
    <div
      ref={titleRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "cursor-pointer transition-all duration-500 select-none",
        "group relative",
        isExpanded ? "opacity-30 scale-95" : "opacity-100 scale-100"
      )}
    >
      {/* Index number */}
      <div className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 font-mono text-[10px] md:text-sm text-foreground/20">
        {project.id}
      </div>

      {/* Main title */}
      <h2 className={cn(
        "font-mono font-black tracking-tighter leading-none",
        "text-[15vw] md:text-[12vw] lg:text-[10vw]",
        "text-foreground",
        "transition-all duration-300",
        isHovered && !isExpanded && "text-foreground/80 translate-x-2"
      )}>
        {glitchText}
      </h2>

      {/* Subtitle line */}
      <div className={cn(
        "flex items-center gap-4 mt-2 font-mono text-xs md:text-sm",
        "transition-all duration-300",
        isHovered && !isExpanded ? "opacity-100 translate-x-4" : "opacity-40"
      )}>
        <span className="text-foreground/60">{project.subtitle}</span>
        <span className="text-foreground/20">│</span>
        <span className="text-foreground/40">{project.year}</span>
        <span className="text-foreground/20">│</span>
        <span className="text-foreground/30">{project.ascii}</span>
        <span className="text-foreground/20 ml-auto hidden md:inline">
          [ CLICK TO EXPAND ]
        </span>
      </div>

      {/* Hover indicator line */}
      <div className={cn(
        "absolute -bottom-2 left-0 h-[2px] bg-foreground",
        "transition-all duration-500",
        isHovered && !isExpanded ? "w-full" : "w-0"
      )} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// EXPANDED PROJECT VIEW - IMAGE GALLERY
// ─────────────────────────────────────────────────────────────

function ExpandedProjectView({ 
  project, 
  onClose,
  isMobile
}: { 
  project: Project
  onClose: () => void
  isMobile: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  // Entrance animation
  useEffect(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline()
    
    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
    )

    tl.fromTo(
      ".expand-content",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" },
      "-=0.2"
    )

    return () => {
      tl.kill()
    }
  }, [])

  // Handle close with animation
  const handleClose = useCallback(() => {
    if (!containerRef.current) {
      onClose()
      return
    }

    gsap.to(containerRef.current, {
      opacity: 0,
      y: -30,
      duration: 0.3,
      ease: "power2.in",
      onComplete: onClose
    })
  }, [onClose])

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleClose])

  const hasImages = project.images.length > 0

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-40 bg-background/98 backdrop-blur-sm overflow-y-auto"
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className={cn(
          "fixed z-50 font-mono text-foreground/60 hover:text-foreground",
          "transition-all duration-200 hover:scale-110",
          isMobile ? "top-4 right-4 text-2xl" : "top-8 right-8 text-3xl"
        )}
      >
        ╳
      </button>

      {/* Technical pattern background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <TechnicalBackground isActive={true} />
      </div>

      <div className={cn(
        "relative min-h-screen flex flex-col",
        isMobile ? "p-4 pt-16" : "p-8 pt-20"
      )}>
        {/* Header */}
        <div className="expand-content mb-6">
          <div className="font-mono text-[8px] md:text-[10px] text-foreground/30 mb-2">
            ╔{ASCII_BORDER}╗
          </div>
          
          <div className="flex items-baseline gap-4 flex-wrap">
            <span className="font-mono text-foreground/30 text-sm">{project.id}</span>
            <h2 className={cn(
              "font-mono font-black tracking-tighter",
              isMobile ? "text-4xl" : "text-6xl md:text-8xl"
            )}>
              {project.title}
            </h2>
            <span className="font-mono text-foreground/40 text-sm">{project.subtitle}</span>
          </div>
          
          <div className="font-mono text-[8px] md:text-[10px] text-foreground/30 mt-2">
            ╚{ASCII_BORDER}╝
          </div>
        </div>

        {/* Content grid */}
        <div className={cn(
          "expand-content flex-1 grid gap-6",
          isMobile ? "grid-cols-1" : "grid-cols-2"
        )}>
          {/* Left column - Images */}
          <div className="space-y-4">
            <div className="font-mono text-[8px] text-foreground/30 mb-2">
              ├── PREVIEW_IMAGES
            </div>
            
            {hasImages ? (
              <>
                {/* Main image */}
                <div className={cn(
                  "relative border border-foreground/20 bg-foreground/5 overflow-hidden",
                  isMobile ? "aspect-video" : "aspect-[4/3]"
                )}>
                  {project.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "absolute inset-0 transition-opacity duration-500",
                        idx === activeImageIndex ? "opacity-100" : "opacity-0"
                      )}
                    >
                      {!loadedImages.has(idx) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/5">
                          <div className="font-mono text-[10px] text-foreground/30 animate-pulse">
                            ░▒▓ LOADING ▓▒░
                          </div>
                        </div>
                      )}
                      <Image
                        src={img}
                        alt={`${project.title} preview ${idx + 1}`}
                        fill
                        className="object-cover"
                        onLoad={() => setLoadedImages(prev => new Set(prev).add(idx))}
                      />
                    </div>
                  ))}

                  {/* Corner marks */}
                  <span className="absolute top-2 left-2 font-mono text-[8px] text-white/60 drop-shadow-lg">┌──</span>
                  <span className="absolute top-2 right-2 font-mono text-[8px] text-white/60 drop-shadow-lg">──┐</span>
                  <span className="absolute bottom-2 left-2 font-mono text-[8px] text-white/60 drop-shadow-lg">└──</span>
                  <span className="absolute bottom-2 right-2 font-mono text-[8px] text-white/60 drop-shadow-lg">──┘</span>

                  {/* Scanlines */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-10"
                    style={{
                      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)'
                    }}
                  />
                </div>

                {/* Thumbnail strip */}
                {project.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {project.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={cn(
                          "relative flex-shrink-0 w-16 h-12 md:w-20 md:h-14 border overflow-hidden",
                          "transition-all duration-200",
                          idx === activeImageIndex 
                            ? "border-foreground opacity-100 scale-105" 
                            : "border-foreground/20 opacity-60 hover:opacity-80"
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
              </>
            ) : (
              <div className={cn(
                "flex items-center justify-center border border-dashed border-foreground/10 bg-foreground/[0.02]",
                isMobile ? "aspect-video" : "aspect-[4/3]"
              )}>
                <div className="text-center font-mono">
                  <pre className="text-foreground/20 text-[8px] leading-tight">
{`┌─────────────────────┐
│                     │
│   NO_PREVIEW_DATA   │
│                     │
│   ░░░░░░░░░░░░░░░   │
│                     │
└─────────────────────┘`}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Right column - Info */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <div className="font-mono text-[8px] text-foreground/30 mb-2">
                ├── DESCRIPTION
              </div>
              <p className="font-mono text-sm md:text-base text-foreground/70 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Tech stack */}
            <div>
              <div className="font-mono text-[8px] text-foreground/30 mb-2">
                ├── TECH_STACK
              </div>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, idx) => (
                  <span
                    key={tech}
                    className={cn(
                      "font-mono text-xs px-3 py-1.5",
                      "border border-foreground/20 bg-foreground/5",
                      "hover:bg-foreground/10 transition-colors"
                    )}
                  >
                    <span className="text-foreground/30 mr-2">{String(idx + 1).padStart(2, "0")}</span>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* ASCII decoration */}
            <div className="border border-foreground/10 bg-foreground/[0.02] p-4">
              <div className="font-mono text-[8px] text-foreground/30 mb-2">
                └── PROJECT_SIGNATURE
              </div>
              <pre className="font-mono text-foreground/20 text-sm">
{`
╔══════════════════════════════════════╗
║                                      ║
║   PROJECT: ${project.title.padEnd(25)}║
║   YEAR:    ${project.year}                       ║
║   STATUS:  ACTIVE                    ║
║   ID:      ${project.id}                         ║
║                                      ║
║   ${project.ascii}                              ║
║                                      ║
╚══════════════════════════════════════╝
`}
              </pre>
            </div>

            {/* Links */}
            <div className="flex gap-3">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "font-mono text-xs px-4 py-2 border border-foreground/30",
                    "hover:bg-foreground hover:text-background transition-all",
                    "flex items-center gap-2"
                  )}
                >
                  <span>CODE</span>
                  <span className="text-foreground/30">→</span>
                </a>
              )}
              {"appStore" in project.links && (
                <a
                  href={project.links.appStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "font-mono text-xs px-4 py-2 border border-foreground/30",
                    "hover:bg-foreground hover:text-background transition-all",
                    "flex items-center gap-2"
                  )}
                >
                  <span>APP STORE</span>
                  <span className="text-foreground/30">→</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="expand-content mt-8 pt-4 border-t border-foreground/10">
          <div className="flex items-center justify-between font-mono text-[8px] text-foreground/30">
            <span>ESC or click ╳ to close</span>
            <span>PROJECT_{project.id}_DATA</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT LIST - VERTICAL SCROLL WITH SNAP
// ─────────────────────────────────────────────────────────────

function ProjectList({ 
  isMobile,
  activeIndex,
  setActiveIndex,
  expandedProject,
  setExpandedProject
}: {
  isMobile: boolean
  activeIndex: number
  setActiveIndex: (index: number) => void
  expandedProject: Project | null
  setExpandedProject: (project: Project | null) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const projectRefs = useRef<(HTMLDivElement | null)[]>([])

  // Scroll snap setup with GSAP ScrollTrigger
  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      projectRefs.current.forEach((ref, index) => {
        if (!ref) return

        ScrollTrigger.create({
          trigger: ref,
          start: isMobile ? "top 40%" : "top 50%",
          end: isMobile ? "bottom 60%" : "bottom 50%",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        })
      })
    }, containerRef.current)

    return () => ctx.revert()
  }, [isMobile, setActiveIndex])

  // Scroll to project on click
  const scrollToProject = useCallback((index: number) => {
    const target = projectRefs.current[index]
    if (!target) return

    const offset = isMobile ? window.innerHeight * 0.3 : window.innerHeight * 0.4
    const targetY = target.getBoundingClientRect().top + window.scrollY - offset

    gsap.to(window, {
      scrollTo: { y: targetY, autoKill: false },
      duration: 1,
      ease: "power3.inOut"
    })
  }, [isMobile])

  return (
    <div ref={containerRef} className="relative">
      {/* Progress indicator */}
      <div className={cn(
        "fixed z-30 font-mono",
        isMobile 
          ? "top-4 left-4 text-[10px]" 
          : "top-1/2 -translate-y-1/2 right-8 text-xs"
      )}>
        <div className="flex flex-col gap-1">
          <span className="text-foreground/30 mb-2 hidden md:block">INDEX</span>
          {projectsData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToProject(idx)}
              className={cn(
                "transition-all duration-300 text-left",
                isMobile ? "w-6 h-1" : "w-8 h-1.5",
                idx === activeIndex 
                  ? "bg-foreground" 
                  : idx < activeIndex 
                    ? "bg-foreground/30" 
                    : "bg-foreground/10 hover:bg-foreground/20"
              )}
            />
          ))}
          <span className="text-foreground/50 mt-2 hidden md:block">
            {String(activeIndex + 1).padStart(2, "0")}/{String(projectsData.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Project titles */}
      <div className={cn(
        "space-y-0",
        isMobile ? "py-[50vh]" : "py-[40vh]"
      )}>
        {projectsData.map((project, index) => (
          <div
            key={project.id}
            ref={el => { projectRefs.current[index] = el }}
            className={cn(
              "relative flex items-center",
              isMobile 
                ? "min-h-[30vh] px-4" 
                : "min-h-[40vh] px-8 md:px-16 lg:px-24"
            )}
          >
            <ProjectTitle
              project={project}
              isActive={index === activeIndex}
              isExpanded={expandedProject !== null}
              onClick={() => setExpandedProject(project)}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ASCII DECORATIONS
// ─────────────────────────────────────────────────────────────

function AsciiDecorations({ isMobile }: { isMobile: boolean }) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 4)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const corners = ["┌", "┐", "└", "┘"]
  const rotatedCorner = corners[frame]

  return (
    <>
      {/* Top left decoration */}
      <div className={cn(
        "fixed z-20 font-mono text-foreground/20 pointer-events-none",
        isMobile ? "top-2 left-2 text-[6px]" : "top-4 left-4 text-[8px]"
      )}>
        <pre className="leading-tight">
{`${rotatedCorner}──────────────
│ PROJECTS.TSX
│ v3.0.0
├──────────────`}
        </pre>
      </div>

      {/* Bottom right decoration */}
      <div className={cn(
        "fixed z-20 font-mono text-foreground/20 pointer-events-none text-right",
        isMobile ? "bottom-2 right-2 text-[6px]" : "bottom-4 right-4 text-[8px]"
      )}>
        <pre className="leading-tight">
{`──────────────${rotatedCorner}
    SCROLL ▼ │
  TO EXPLORE │
──────────────┤`}
        </pre>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [expandedProject, setExpandedProject] = useState<Project | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isMobile = useIsMobile()

  // Handle loading complete
  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  // Lock body scroll when expanded
  useEffect(() => {
    if (expandedProject) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [expandedProject])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative bg-background"
    >
      {/* Loading screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Technical background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <TechnicalBackground isActive={!isLoading} />
      </div>

      {/* ASCII decorations */}
      {!isLoading && <AsciiDecorations isMobile={isMobile} />}

      {/* Section header */}
      <div className={cn(
        "sticky top-0 z-10 bg-background/80 backdrop-blur-sm",
        "border-b border-foreground/10",
        isMobile ? "py-2 px-4" : "py-4 px-8"
      )}>
        <div className="flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <span className="text-foreground/30 text-[8px] md:text-[10px]">SECTION://</span>
            <span className="text-foreground font-bold text-xs md:text-sm">PROJECTS</span>
          </div>
          <div className="text-foreground/40 text-[8px] md:text-[10px]">
            {String(projectsData.length).padStart(2, "0")} ENTRIES
          </div>
        </div>
      </div>

      {/* Main project list */}
      {!isLoading && (
        <ProjectList
          isMobile={isMobile}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          expandedProject={expandedProject}
          setExpandedProject={setExpandedProject}
        />
      )}

      {/* Expanded project view */}
      {expandedProject && (
        <ExpandedProjectView
          project={expandedProject}
          onClose={() => setExpandedProject(null)}
          isMobile={isMobile}
        />
      )}

      {/* Section footer */}
      <div className={cn(
        "relative z-10 bg-background border-t border-foreground/10",
        isMobile ? "py-4 px-4" : "py-8 px-8"
      )}>
        <div className="font-mono text-center">
          <div className="text-foreground/20 text-[8px] md:text-[10px] mb-2">
            ═══════════════════════════════════════
          </div>
          <div className="text-foreground/40 text-xs">
            END OF PROJECTS
          </div>
          <div className="text-foreground/20 text-[8px] md:text-[10px] mt-2">
            ═══════════════════════════════════════
          </div>
        </div>
      </div>
    </section>
  )
}
