"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ═══════════════════════════════════════════════════════════════
// MOBILE DETECTION HOOK - matchMedia + resize listener
// ═══════════════════════════════════════════════════════════════

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

function useDeviceDetection() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [windowHeight, setWindowHeight] = useState(800)

  useEffect(() => {
    if (typeof window === "undefined") return

    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const tabletQuery = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT - 1}px)`)
    
    const updateDevice = () => {
      setIsMobile(mobileQuery.matches)
      setIsTablet(tabletQuery.matches && !mobileQuery.matches)
      setWindowHeight(window.innerHeight)
    }

    updateDevice()

    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      setIsTablet(window.innerWidth < TABLET_BREAKPOINT && window.innerWidth >= MOBILE_BREAKPOINT)
      setWindowHeight(window.innerHeight)
    }

    mobileQuery.addEventListener("change", updateDevice)
    tabletQuery.addEventListener("change", updateDevice)
    window.addEventListener("resize", handleResize)

    return () => {
      mobileQuery.removeEventListener("change", updateDevice)
      tabletQuery.removeEventListener("change", updateDevice)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return { isMobile, isTablet, windowHeight }
}

// ═══════════════════════════════════════════════════════════════
// PROJECT DATA
// ═══════════════════════════════════════════════════════════════

const projects = [
  {
    id: "01",
    title: "POKER %",
    subtitle: "WATCHOS",
    year: "2022",
    tech: ["Swift", "WatchOS", "SwiftUI"],
    images: ["/images/poker_1.jpg", "/images/poker_2.jpg", "/images/poker_3.jpg"],
    description: "Real-time poker odds calculator for Apple Watch using Monte Carlo simulation",
    ascii: `
    ♠ ♥ ♦ ♣
   ┌─────────┐
   │ A   ♠   │
   │    ♠    │
   │   ♠   A │
   └─────────┘`,
  },
  {
    id: "02",
    title: "SHOHEI HG",
    subtitle: "AUTOMATION",
    year: "2023",
    tech: ["Python", "Instagram API", "YouTube API"],
    images: ["/images/shoheihomeground_1.jpg", "/images/shoheihomeground_2.jpg", "/images/shoheihomeground_3.jpg"],
    description: "Automated content pipeline for Instagram and YouTube with 11K+ followers",
    ascii: `
   ╔══════════╗
   ║ ▓▓▓▓▓▓░░ ║
   ║ AUTOMATE ║
   ║ ▓▓▓▓▓▓░░ ║
   ╚══════════╝`,
  },
  {
    id: "03",
    title: "SCHEDULE",
    subtitle: "FLASK API",
    year: "2023",
    tech: ["Python", "Flask", "SQLite"],
    images: ["/images/schedule.jpg"],
    description: "Intelligent course scheduling with conflict detection using graph algorithms",
    ascii: `
   ┌─┬─┬─┬─┬─┐
   │M│T│W│T│F│
   ├─┼─┼─┼─┼─┤
   │█│░│█│░│█│
   └─┴─┴─┴─┴─┘`,
  },
  {
    id: "04",
    title: "MATCHA",
    subtitle: "IOS APP",
    year: "2024",
    tech: ["Swift", "SwiftUI", "CloudKit"],
    images: ["/images/matchatime_1.jpg", "/images/matchatime_2.jpg", "/images/matchatime_3.jpg"],
    description: "Minimalist matcha timer with Japanese aesthetic and ritual tracking",
    ascii: `
      🍵
   ╭───────╮
   │ MATCHA│
   │ ▓▓▓▓▓ │
   ╰───────╯`,
  },
  {
    id: "05",
    title: "PORTFOLIO",
    subtitle: "NEXT.JS",
    year: "2024",
    tech: ["React", "Next.js", "GSAP", "Tailwind"],
    images: ["/images/homepage.png", "/images/experiencepage.png"],
    description: "Brutalist portfolio with scroll-driven animations and performance optimization",
    ascii: `
   ┌──────────────┐
   │ ████████░░░░ │
   │ PORTFOLIO.JS │
   └──────────────┘`,
  },
  {
    id: "06",
    title: "SABORIENDO",
    subtitle: "CROSS-PLAT",
    year: "2024",
    tech: ["React 19", "SwiftUI", "Firebase"],
    images: [],
    description: "Food tracking with barcode scanning and real-time cross-platform sync",
    ascii: `
   ┌───────────┐
   │ ║│║ │║│║│ │
   │ BARCODE   │
   └───────────┘`,
  },
  {
    id: "07",
    title: "WITH LLM",
    subtitle: "ON-DEVICE",
    year: "2024",
    tech: ["Swift", "llama.cpp", "GGUF"],
    images: [],
    description: "Privacy-focused AI assistant running entirely on-device with llama.cpp",
    ascii: `
   ┌─────────────┐
   │ ◉ LOCAL LLM │
   │ ░▒▓█▓▒░▒▓█▓ │
   └─────────────┘`,
  },
  {
    id: "08",
    title: "HTIC BUS",
    subtitle: "REAL-TIME",
    year: "2025",
    tech: ["Swift", "Kotlin", "Firebase"],
    images: [],
    description: "Campus shuttle tracking with real-time updates and sub-100ms latency",
    ascii: `
   ═══════════════
       🚌
   ──○────────○──
   ═══════════════`,
  },
  {
    id: "09",
    title: "CYBEREDU",
    subtitle: "OFFLINE",
    year: "2025",
    tech: ["Swift", "Kotlin", "Firebase"],
    images: ["/images/CyberEdu-1.PNG", "/images/CyberEdu-2.PNG", "/images/CyberEdu-3.PNG"],
    description: "Educational platform with offline-first architecture and conflict resolution",
    ascii: `
   ╔═══════════════╗
   ║ ● OFFLINE OK  ║
   ║ SYNC: READY   ║
   ╚═══════════════╝`,
  },
  {
    id: "10",
    title: "RESEARCH",
    subtitle: "SERVERLESS",
    year: "2025",
    tech: ["Cloud Functions", "Firebase", "GPT-4"],
    images: [],
    description: "Project management for research labs with AI-powered task routing",
    ascii: `
   ┌─── LAB ───┐
   │ ◇ PAPERS  │
   │ ◆ TASKS   │
   └───────────┘`,
  },
  {
    id: "11",
    title: "WHITEBOARD",
    subtitle: "VISION ML",
    year: "2025",
    tech: ["PyTorch", "WebSocket", "React"],
    images: ["/images/whiteboardai-1.jpg", "/images/whiteboardai-2.jpg"],
    description: "Collaborative whiteboard with real-time AI vision and CRDT sync",
    ascii: `
   ┌───────────────┐
   │ ○ ───── □    │
   │  AI VISION   │
   └───────────────┘`,
  },
  {
    id: "12",
    title: "ZERO INBOX",
    subtitle: "AI ENGINE",
    year: "2025",
    tech: ["Swift", "AI/ML", "Firebase"],
    images: [],
    description: "Email management with multi-stage AI reasoning and 95% accuracy",
    ascii: `
   ═══════════════
   │ INBOX: 0    │
   │ AI: ACTIVE  │
   ═══════════════`,
  },
]

type Project = (typeof projects)[0]

// ═══════════════════════════════════════════════════════════════
// ASCII PATTERNS FOR DECORATION
// ═══════════════════════════════════════════════════════════════

const ASCII_GRID = `
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
████████████████████████████████████████████████████
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
`.trim()

const CORNER_MARK = `┌──────┐
│      │
│      │
└──────┘`

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?░▒▓█"

// ═══════════════════════════════════════════════════════════════
// LOADING SCREEN
// ═══════════════════════════════════════════════════════════════

function LoadingScreen({ progress, isComplete }: { progress: number; isComplete: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [glitchText, setGlitchText] = useState("INITIALIZING")
  const [loadingChars, setLoadingChars] = useState("")

  // Glitch text animation
  useEffect(() => {
    const texts = ["INITIALIZING", "LOADING_PROJECTS", "PARSING_DATA", "RENDERING_UI"]
    let textIndex = 0
    let charIndex = 0
    
    const interval = setInterval(() => {
      const currentText = texts[textIndex]
      const scrambled = currentText.split("").map((char, i) => {
        if (i < charIndex) return char
        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
      }).join("")
      
      setGlitchText(scrambled)
      charIndex++
      
      if (charIndex > currentText.length + 5) {
        charIndex = 0
        textIndex = (textIndex + 1) % texts.length
      }
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Loading bar animation
  useEffect(() => {
    const chars = "░▒▓█"
    const width = 30
    const filled = Math.floor((progress / 100) * width)
    const bar = chars[3].repeat(filled) + chars[0].repeat(width - filled)
    setLoadingChars(bar)
  }, [progress])

  // Exit animation
  useEffect(() => {
    if (isComplete && containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.1,
        duration: 0.6,
        ease: "power3.inOut"
      })
    }
  }, [isComplete])

  if (isComplete) return null

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
    >
      <div className="text-center font-mono">
        {/* ASCII header */}
        <pre className="text-[6px] md:text-[8px] text-foreground/10 mb-8 leading-tight">
{`
╔═══════════════════════════════════════════════════════════╗
║  ██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗║
║  ██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝║
║  ██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║   ║
║  ██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║   ║
║  ██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║   ║
║  ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   ║
╚═══════════════════════════════════════════════════════════╝
`}
        </pre>
        
        {/* Loading text */}
        <div className="text-xs md:text-sm text-foreground/60 mb-4 tracking-[0.3em]">
          {glitchText}
        </div>
        
        {/* Progress bar */}
        <div className="text-foreground/40 text-[10px] md:text-xs tracking-widest mb-2">
          [{loadingChars}]
        </div>
        
        {/* Percentage */}
        <div className="text-foreground text-2xl md:text-4xl font-black">
          {progress.toFixed(0)}%
        </div>
        
        {/* Technical footer */}
        <div className="mt-8 text-[8px] text-foreground/20">
          <div>SYS://PORTFOLIO_v3.0</div>
          <div>MEM: {(Math.random() * 100 + 50).toFixed(0)}MB / 512MB</div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// TECHNICAL SVG PATTERNS
// ═══════════════════════════════════════════════════════════════

function TechnicalGrid({ className }: { className?: string }) {
  const gridRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!gridRef.current) return
    
    const lines = gridRef.current.querySelectorAll("line, path")
    gsap.fromTo(lines, 
      { strokeDashoffset: 1000 },
      { strokeDashoffset: 0, duration: 2, stagger: 0.02, ease: "power2.out" }
    )
  }, [])

  return (
    <svg
      ref={gridRef}
      className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
      viewBox="0 0 1000 1000"
      fill="none"
      preserveAspectRatio="none"
    >
      {/* Horizontal scan lines */}
      {Array.from({ length: 50 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 20}
          x2="1000"
          y2={i * 20}
          stroke="currentColor"
          strokeWidth="0.3"
          strokeDasharray="5 15"
          className="text-foreground/[0.03]"
        />
      ))}
      
      {/* Vertical scan lines */}
      {Array.from({ length: 50 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 20}
          y1="0"
          x2={i * 20}
          y2="1000"
          stroke="currentColor"
          strokeWidth="0.3"
          strokeDasharray="5 15"
          className="text-foreground/[0.03]"
        />
      ))}
      
      {/* Corner brackets */}
      <path d="M0 50 L0 0 L50 0" stroke="currentColor" strokeWidth="2" className="text-foreground/10" strokeDasharray="200" />
      <path d="M950 0 L1000 0 L1000 50" stroke="currentColor" strokeWidth="2" className="text-foreground/10" strokeDasharray="200" />
      <path d="M1000 950 L1000 1000 L950 1000" stroke="currentColor" strokeWidth="2" className="text-foreground/10" strokeDasharray="200" />
      <path d="M50 1000 L0 1000 L0 950" stroke="currentColor" strokeWidth="2" className="text-foreground/10" strokeDasharray="200" />
      
      {/* Center crosshair */}
      <circle cx="500" cy="500" r="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10 5" className="text-foreground/5" />
      <line x1="500" y1="350" x2="500" y2="450" stroke="currentColor" strokeWidth="1" className="text-foreground/10" />
      <line x1="500" y1="550" x2="500" y2="650" stroke="currentColor" strokeWidth="1" className="text-foreground/10" />
      <line x1="350" y1="500" x2="450" y2="500" stroke="currentColor" strokeWidth="1" className="text-foreground/10" />
      <line x1="550" y1="500" x2="650" y2="500" stroke="currentColor" strokeWidth="1" className="text-foreground/10" />
      
      {/* Diagonal lines */}
      <line x1="0" y1="0" x2="200" y2="200" stroke="currentColor" strokeWidth="0.5" strokeDasharray="8 8" className="text-foreground/5" />
      <line x1="1000" y1="0" x2="800" y2="200" stroke="currentColor" strokeWidth="0.5" strokeDasharray="8 8" className="text-foreground/5" />
      <line x1="0" y1="1000" x2="200" y2="800" stroke="currentColor" strokeWidth="0.5" strokeDasharray="8 8" className="text-foreground/5" />
      <line x1="1000" y1="1000" x2="800" y2="800" stroke="currentColor" strokeWidth="0.5" strokeDasharray="8 8" className="text-foreground/5" />
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════
// ANIMATED ASCII BACKGROUND
// ═══════════════════════════════════════════════════════════════

function AsciiBackground({ isActive }: { isActive: boolean }) {
  const [chars, setChars] = useState<string[]>([])
  
  useEffect(() => {
    if (!isActive) return
    
    const charSet = "░▒▓█╳╱╲─│┼◆◇○●"
    const newChars = Array.from({ length: 200 }, () => 
      charSet[Math.floor(Math.random() * charSet.length)]
    )
    setChars(newChars)
    
    const interval = setInterval(() => {
      setChars(prev => prev.map((_, i) => 
        Math.random() > 0.95 
          ? charSet[Math.floor(Math.random() * charSet.length)]
          : prev[i]
      ))
    }, 100)
    
    return () => clearInterval(interval)
  }, [isActive])
  
  if (!isActive) return null
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] font-mono text-[8px] md:text-[12px] leading-none">
      <div className="whitespace-pre-wrap break-all">
        {chars.join(" ")}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// PROJECT TITLE COMPONENT - Large text with animations
// ═══════════════════════════════════════════════════════════════

function ProjectTitle({ 
  project, 
  index, 
  isActive, 
  onClick,
  showImage,
  isMobile
}: { 
  project: Project
  index: number
  isActive: boolean
  onClick: () => void
  showImage: boolean
  isMobile: boolean
}) {
  const titleRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrambledTitle, setScrambledTitle] = useState(project.title)
  const [isHovered, setIsHovered] = useState(false)

  // Glitch effect on active/hover
  useEffect(() => {
    if (!isActive && !isHovered) {
      setScrambledTitle(project.title)
      return
    }

    const targetText = project.title
    let iteration = 0
    const maxIterations = targetText.length * 2

    const interval = setInterval(() => {
      setScrambledTitle(
        targetText
          .split("")
          .map((char, i) => {
            if (char === " ") return char
            if (i < iteration / 2) return char
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          })
          .join("")
      )

      iteration++
      if (iteration >= maxIterations) {
        setScrambledTitle(targetText)
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [project.title, isActive, isHovered])

  // GSAP animations on active state
  useEffect(() => {
    if (!containerRef.current) return

    if (isActive) {
      gsap.to(containerRef.current, {
        scale: 1,
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "power3.out"
      })
    } else {
      gsap.to(containerRef.current, {
        scale: 0.95,
        opacity: 0.3,
        x: isMobile ? 0 : -20,
        duration: 0.4,
        ease: "power2.inOut"
      })
    }
  }, [isActive, isMobile])

  const fontSize = isMobile ? "text-[12vw]" : "text-[8vw]"

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative cursor-pointer select-none transition-all duration-300",
        "snap-center snap-always",
        "min-h-[100vh] flex flex-col justify-center items-center",
        "px-4 md:px-8"
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Technical corner marks */}
      <div className="absolute top-4 left-4 font-mono text-[8px] text-foreground/30">
        ┌── {project.id}
      </div>
      <div className="absolute top-4 right-4 font-mono text-[8px] text-foreground/30">
        {project.year} ──┐
      </div>
      <div className="absolute bottom-4 left-4 font-mono text-[8px] text-foreground/30">
        └── {project.subtitle}
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[8px] text-foreground/30">
        TAP ──┘
      </div>

      {/* Main title */}
      <div ref={titleRef} className="relative">
        <h2 
          className={cn(
            "font-mono font-black tracking-tighter leading-[0.85]",
            fontSize,
            "text-foreground transition-all duration-300",
            isActive ? "opacity-100" : "opacity-30",
            showImage ? "blur-[2px]" : ""
          )}
        >
          {scrambledTitle}
        </h2>

        {/* Glitch overlay */}
        {(isActive || isHovered) && (
          <>
            <h2 
              className={cn(
                "absolute inset-0 font-mono font-black tracking-tighter leading-[0.85]",
                fontSize,
                "text-foreground/20 transform translate-x-1 -translate-y-1"
              )}
              aria-hidden
            >
              {scrambledTitle}
            </h2>
            <h2 
              className={cn(
                "absolute inset-0 font-mono font-black tracking-tighter leading-[0.85]",
                fontSize,
                "text-foreground/10 transform -translate-x-1 translate-y-1"
              )}
              aria-hidden
            >
              {scrambledTitle}
            </h2>
          </>
        )}
      </div>

      {/* Subtitle line */}
      <div className={cn(
        "mt-4 md:mt-6 flex items-center gap-4 font-mono text-[10px] md:text-xs",
        "text-foreground/50 transition-opacity duration-300",
        isActive ? "opacity-100" : "opacity-0"
      )}>
        <span className="tracking-[0.3em]">{project.subtitle}</span>
        <span className="text-foreground/20">│</span>
        <span className="tracking-[0.2em]">{project.tech.join(" · ")}</span>
      </div>

      {/* ASCII decoration */}
      {isActive && (
        <pre className={cn(
          "absolute bottom-20 left-1/2 -translate-x-1/2 font-mono text-[6px] md:text-[8px]",
          "text-foreground/20 leading-tight transition-opacity duration-500",
          showImage ? "opacity-0" : "opacity-100"
        )}>
          {project.ascii}
        </pre>
      )}

      {/* Image overlay */}
      {showImage && project.images.length > 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/90 animate-in fade-in duration-300">
          <div className="relative w-[80vw] h-[60vh] md:w-[60vw] md:h-[70vh] border-2 border-foreground/20">
            {/* Technical frame */}
            <div className="absolute -top-6 left-0 font-mono text-[8px] text-foreground/40">
              ┌── IMG_PREVIEW_{project.id}
            </div>
            <div className="absolute -bottom-6 right-0 font-mono text-[8px] text-foreground/40">
              TAP_TO_CLOSE ──┘
            </div>
            
            <Image
              src={project.images[0]}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
            
            {/* Scanlines */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
              }}
            />
            
            {/* Corner brackets */}
            <span className="absolute top-2 left-2 font-mono text-[10px] text-white/80 drop-shadow-lg">┌──</span>
            <span className="absolute top-2 right-2 font-mono text-[10px] text-white/80 drop-shadow-lg">──┐</span>
            <span className="absolute bottom-2 left-2 font-mono text-[10px] text-white/80 drop-shadow-lg">└──</span>
            <span className="absolute bottom-2 right-2 font-mono text-[10px] text-white/80 drop-shadow-lg">──┘</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SCROLL PROGRESS INDICATOR
// ═══════════════════════════════════════════════════════════════

function ScrollIndicator({ 
  activeIndex, 
  total, 
  projects,
  onProjectClick 
}: { 
  activeIndex: number
  total: number
  projects: Project[]
  onProjectClick: (index: number) => void
}) {
  const progressChars = 20
  const filled = Math.round(((activeIndex + 1) / total) * progressChars)
  const progressBar = "█".repeat(filled) + "░".repeat(progressChars - filled)

  return (
    <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 font-mono">
      {/* Vertical project list */}
      <div className="hidden md:flex flex-col items-end gap-1 mb-4">
        {projects.map((project, i) => (
          <button
            key={project.id}
            onClick={() => onProjectClick(i)}
            className={cn(
              "text-[8px] tracking-wider transition-all duration-300",
              "hover:translate-x-[-4px]",
              i === activeIndex 
                ? "text-foreground font-bold" 
                : i < activeIndex 
                  ? "text-foreground/40" 
                  : "text-foreground/20"
            )}
          >
            {i === activeIndex ? "► " : "  "}{project.id}
          </button>
        ))}
      </div>
      
      {/* Progress bar - vertical */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-[8px] text-foreground/40 rotate-90 origin-center translate-y-10 whitespace-nowrap">
          [{progressBar}]
        </div>
        <div className="mt-16 text-foreground font-bold text-sm">
          {String(activeIndex + 1).padStart(2, "0")}
        </div>
        <div className="text-foreground/30 text-[8px]">
          /{String(total).padStart(2, "0")}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SCROLL HINT
// ═══════════════════════════════════════════════════════════════

function ScrollHint({ show }: { show: boolean }) {
  const [frame, setFrame] = useState(0)
  const frames = ["▼", "▽", "▼", "▽"]

  useEffect(() => {
    if (!show) return
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % frames.length)
    }, 300)
    return () => clearInterval(interval)
  }, [show, frames.length])

  if (!show) return null

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 font-mono animate-pulse">
      <div className="flex flex-col items-center gap-2 text-foreground/40">
        <span className="text-[8px] tracking-[0.3em]">SCROLL</span>
        <span className="text-lg">{frames[frame]}</span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// HEADER BAR
// ═══════════════════════════════════════════════════════════════

function HeaderBar({ currentProject }: { currentProject: Project }) {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-US", { hour12: false }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-foreground/10">
      <div className="flex items-center justify-between px-4 md:px-8 py-2 font-mono text-[8px] md:text-[10px]">
        <div className="flex items-center gap-4 text-foreground/50">
          <span className="text-foreground font-bold">PRJ://</span>
          <span className="hidden md:inline">SECTION_03</span>
          <span className="text-foreground/30">│</span>
          <span className="tracking-[0.2em]">{currentProject.title}</span>
        </div>
        <div className="flex items-center gap-4 text-foreground/30">
          <span className="hidden md:inline">{time}</span>
          <span>SYS:OK</span>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN PROJECTS SECTION
// ═══════════════════════════════════════════════════════════════

export function ProjectsSection() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [showImage, setShowImage] = useState<number | null>(null)
  const [showScrollHint, setShowScrollHint] = useState(true)

  const sectionRef = useRef<HTMLElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  
  const { isMobile, isTablet, windowHeight } = useDeviceDetection()

  const currentProject = projects[activeIndex]

  // Loading animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Hide scroll hint after first scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollHint(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Setup ScrollTrigger with mobile-optimized values
  useEffect(() => {
    if (isLoading || !sectionRef.current || !scrollContainerRef.current) return

    // Kill previous ScrollTrigger
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
      scrollTriggerRef.current = null
    }

    // Mobile-optimized scroll values
    const scrollPerProject = isMobile ? 80 : isTablet ? 90 : 100
    const totalScrollDistance = projects.length * scrollPerProject
    const scrubValue = isMobile ? 0.3 : 0.5

    // Pin spacing adjusted for mobile
    const pinStart = isMobile ? "top top" : "top top"
    const pinEnd = isMobile 
      ? `+=${totalScrollDistance}vh` 
      : `+=${totalScrollDistance}vh`

    const ctx = gsap.context(() => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: pinStart,
        end: pinEnd,
        pin: scrollContainerRef.current,
        pinSpacing: true,
        scrub: scrubValue,
        snap: {
          snapTo: 1 / (projects.length - 1),
          duration: { min: 0.2, max: 0.5 },
          delay: 0,
          ease: "power2.inOut"
        },
        onUpdate: (self) => {
          const newIndex = Math.min(
            Math.floor(self.progress * projects.length),
            projects.length - 1
          )
          if (newIndex !== activeIndex) {
            setActiveIndex(newIndex)
            setShowImage(null) // Close image on scroll
          }
        },
      })
    }, sectionRef.current)

    return () => {
      ctx.revert()
      scrollTriggerRef.current = null
    }
  }, [isLoading, isMobile, isTablet, activeIndex])

  // Handle project click to show image
  const handleProjectClick = useCallback((index: number) => {
    if (index === activeIndex) {
      // Toggle image if clicking active project
      setShowImage(prev => prev === index ? null : index)
    } else {
      // Scroll to project
      const trigger = scrollTriggerRef.current
      if (!trigger) return

      const start = trigger.start
      const end = trigger.end
      const totalDistance = end - start
      const projectProgress = index / (projects.length - 1)
      const targetScroll = start + (totalDistance * projectProgress)

      window.scrollTo({
        top: targetScroll,
        behavior: "smooth"
      })
    }
  }, [activeIndex])

  // Navigate to specific project
  const navigateToProject = useCallback((index: number) => {
    const trigger = scrollTriggerRef.current
    if (!trigger) return

    const start = trigger.start
    const end = trigger.end
    const totalDistance = end - start
    const projectProgress = index / (projects.length - 1)
    const targetScroll = start + (totalDistance * projectProgress)

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth"
    })
  }, [])

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen progress={loadProgress} isComplete={!isLoading} />

      <section
        id="projects"
        ref={sectionRef}
        className="relative bg-background"
      >
        {/* Header */}
        <HeaderBar currentProject={currentProject} />

        {/* Scroll Progress */}
        <ScrollIndicator 
          activeIndex={activeIndex}
          total={projects.length}
          projects={projects}
          onProjectClick={navigateToProject}
        />

        {/* Scroll Hint */}
        <ScrollHint show={showScrollHint && !isLoading} />

        {/* Main scroll container */}
        <div
          ref={scrollContainerRef}
          className="relative min-h-screen overflow-hidden"
        >
          {/* Background elements */}
          <TechnicalGrid />
          <AsciiBackground isActive={!isLoading} />

          {/* ASCII header decoration */}
          <div className="absolute top-20 left-4 md:left-8 font-mono text-[6px] md:text-[8px] text-foreground/10 z-10">
            <pre className="leading-tight">
{`╔════════════════════════╗
║  PROJECTS_ARCHIVE      ║
║  ░░░░░░░░░░░░░░░░░░░░  ║
║  TOTAL: ${String(projects.length).padStart(2, "0")} ENTRIES    ║
╚════════════════════════╝`}
            </pre>
          </div>

          {/* Project titles stack */}
          <div className="relative">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={cn(
                  "absolute inset-0 transition-all duration-500",
                  index === activeIndex 
                    ? "opacity-100 pointer-events-auto z-10" 
                    : "opacity-0 pointer-events-none z-0"
                )}
              >
                <ProjectTitle
                  project={project}
                  index={index}
                  isActive={index === activeIndex}
                  onClick={() => handleProjectClick(index)}
                  showImage={showImage === index}
                  isMobile={isMobile}
                />
              </div>
            ))}
          </div>

          {/* Technical lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
            <line 
              x1="0" 
              y1="50%" 
              x2="100%" 
              y2="50%" 
              stroke="currentColor" 
              strokeWidth="0.5" 
              strokeDasharray="10 5"
              className="text-foreground/5"
            />
            <line 
              x1="50%" 
              y1="0" 
              x2="50%" 
              y2="100%" 
              stroke="currentColor" 
              strokeWidth="0.5" 
              strokeDasharray="10 5"
              className="text-foreground/5"
            />
          </svg>

          {/* Bottom tech bar */}
          <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 py-4 font-mono text-[7px] md:text-[8px] text-foreground/30 border-t border-foreground/10 bg-background/50 backdrop-blur-sm z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-foreground/50">YEAR:</span>
                <span className="text-foreground">{currentProject.year}</span>
                <span className="text-foreground/20">│</span>
                <span className="hidden md:inline">{currentProject.tech.join(" · ")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>MEM: 128MB</span>
                <span className="text-foreground/20">│</span>
                <span>FPS: 60</span>
                <span className="text-foreground/20">│</span>
                <span className="text-foreground">READY</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
