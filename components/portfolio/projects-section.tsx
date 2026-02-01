"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Github } from "lucide-react"
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

    mediaQuery.addEventListener("change", handleChange)

    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    window.addEventListener("resize", handleResize)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return isMobile
}

// Responsive scroll config (height handled via CSS)
const SCROLL_CONFIG = {
  mobile: {
    scrollPerProject: 25,
    scrubSpeed: 0.1,
  },
  desktop: {
    scrollPerProject: 30,
    scrubSpeed: 0.15,
  },
}

// ─────────────────────────────────────────────────────────────
// PROJECT DATA WITH ICONS AND IMAGES
// ─────────────────────────────────────────────────────────────

const allProjects = [
  {
    id: "01",
    year: "2022",
    title: "Poker %",
    growth: "First WatchOS App",
    description: "Real-time poker odds calculator for Apple Watch. Instant probability calculations during live gameplay.",
    before: "No native dev experience",
    after: "Published WatchOS app",
    techStack: ["Swift", "WatchOS"],
    achievement: "Published",
    metric: "<10ms",
    category: "MOBILE",
    icon: "/images/poker.png",
    images: ["/images/poker_1.jpg", "/images/poker_2.jpg", "/images/poker_3.jpg"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
  {
    id: "02",
    year: "2023",
    title: "Shohei HG",
    growth: "Python Automation",
    description: "Automated content pipeline for Instagram and YouTube. ML-powered content scheduling and posting.",
    before: "Manual content posting",
    after: "Automated pipeline",
    techStack: ["Python", "Instagram API"],
    achievement: "11K followers",
    metric: "685 posts",
    category: "AUTOMATION",
    icon: "/images/shohei_icon.svg",
    images: ["/images/shoheihomeground_1.jpg", "/images/shoheihomeground_2.jpg", "/images/shoheihomeground_3.jpg"],
    links: { instagram: "#", youtube: "#" },
  },
  {
    id: "03",
    year: "2023",
    title: "Schedule Master",
    growth: "Backend Architecture",
    description: "Intelligent course scheduling system with conflict resolution algorithms and optimization.",
    before: "Frontend-only apps",
    after: "Flask API + algorithms",
    techStack: ["Python", "Flask"],
    achievement: "500+ courses",
    metric: "70% fewer errors",
    category: "BACKEND",
    icon: "/images/schedule.svg",
    images: ["/images/schedule.jpg"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "04",
    year: "2024",
    title: "Matcha Time",
    growth: "App Store Launch",
    description: "Matcha brewing timer with precise temperature and steeping controls. Beautiful SwiftUI interface.",
    before: "Local dev projects",
    after: "Production iOS app",
    techStack: ["Swift", "SwiftUI"],
    achievement: "50 users",
    metric: "4 weeks",
    category: "IOS",
    icon: "/images/matchatime.svg",
    images: ["/images/matchatime_1.jpg", "/images/matchatime_2.jpg", "/images/matchatime_3.jpg"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
  {
    id: "05",
    year: "2024",
    title: "Portfolio",
    growth: "Modern Web Stack",
    description: "This portfolio site. Brutalist design with GSAP animations, technical patterns, and scroll interactions.",
    before: "Static HTML sites",
    after: "Next.js + GSAP animations",
    techStack: ["React", "Next.js", "GSAP"],
    achievement: "60% faster",
    metric: "LCP<1.5s",
    category: "WEB",
    icon: "/images/rflogoblack.png",
    images: ["/images/homepage.png", "/images/experiencepage.png"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "06",
    year: "2024",
    title: "Saboriendo",
    growth: "Full-Stack + Mobile",
    description: "Cross-platform pantry management with barcode scanning and real-time sync across devices.",
    before: "Single platform apps",
    after: "Cross-platform sync system",
    techStack: ["React 19", "SwiftUI", "Firebase"],
    achievement: "50% faster",
    metric: "barcode<1s",
    category: "FULLSTACK",
    icon: "/images/cusco.svg",
    images: ["/images/cusco_1.jpg", "/images/cusco_2.jpg", "/images/cusco_3.jpg"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "07",
    year: "2024",
    title: "With (Local LLM)",
    growth: "On-Device AI",
    description: "Privacy-first AI companion running entirely on-device using llama.cpp with GGUF models.",
    before: "Cloud-dependent AI",
    after: "Local llama.cpp inference",
    techStack: ["Swift", "llama.cpp", "GGUF"],
    achievement: "2GB saved",
    metric: "<50ms/tok",
    category: "AI/ML",
    icon: "/images/ai_and_algorithms.svg",
    images: [],
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "08",
    year: "2025",
    title: "HTIC Shuttle",
    growth: "Real-Time Systems",
    description: "Campus shuttle tracking with real-time database updates and cross-platform mobile apps.",
    before: "Polling-based updates",
    after: "Event-driven RTDB",
    techStack: ["Swift", "Kotlin", "Firebase"],
    achievement: "70% fewer conflicts",
    metric: "<100ms",
    category: "REALTIME",
    icon: "/images/HTIC-icon.svg",
    images: [],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
  {
    id: "09",
    year: "2025",
    title: "CyberEdu",
    growth: "Network Resilience",
    description: "Offline-first educational platform with seamless sync when connectivity returns.",
    before: "Online-only sync",
    after: "Offline-first architecture",
    techStack: ["Swift", "Kotlin", "Firebase"],
    achievement: "99%+ reliability",
    metric: "0 data loss",
    category: "EDUCATION",
    icon: "/images/CyberEdu.png",
    images: ["/images/CyberEdu-1.PNG", "/images/CyberEdu-2.PNG", "/images/CyberEdu-3.PNG"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
  {
    id: "10",
    year: "2025",
    title: "Research Lab PM",
    growth: "Serverless Architecture",
    description: "AI-powered research project management with dynamic task routing and serverless backend.",
    before: "Monolithic backend",
    after: "Dynamic AI routing system",
    techStack: ["Cloud Functions", "Firebase"],
    achievement: "30+ researchers",
    metric: "<200ms",
    category: "RESEARCH",
    icon: "/images/cs_research.svg",
    images: [],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "11",
    year: "2025",
    title: "Whiteboard AI",
    growth: "Vision ML + Collab",
    description: "Real-time collaborative whiteboard with AI-powered handwriting recognition and CRDT sync.",
    before: "Static image processing",
    after: "Real-time vision + CRDT sync",
    techStack: ["PyTorch", "WebSocket", "React"],
    achievement: "150ms inference",
    metric: "60fps",
    category: "AI/ML",
    icon: "/images/whiteboardai.png",
    images: ["/images/whiteboardai-1.jpg", "/images/whiteboardai-2.jpg"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "12",
    year: "2025",
    title: "Zero Inbox",
    growth: "Production AI Engine",
    description: "Multi-stage email reasoning pipeline achieving 95% accuracy in email classification and response.",
    before: "Basic ML models",
    after: "Multi-stage reasoning pipeline",
    techStack: ["Swift", "AI/ML", "Firebase"],
    achievement: "95% accuracy",
    metric: "200ms",
    category: "AI/ML",
    icon: "/images/ai_and_algorithms.svg",
    images: [],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
  },
]

type Project = (typeof allProjects)[0]
const TOTAL_PROJECTS = allProjects.length

// ASCII characters for scramble animation
const ASCII_CHARS = "░▒▓█▄▀■□●○◆◇╳╱╲─│┌┐└┘├┤┬┴┼"

// ASCII art patterns for visual effects
const ASCII_PATTERNS = {
  circuit: [
    "┌──┬──┬──┐",
    "│  │  │  │",
    "├──┼──┼──┤",
    "│  │  │  │",
    "└──┴──┴──┘",
  ],
  data: [
    "╔═══════╗",
    "║ ▓▓▓▓▓ ║",
    "║ ░░▓░░ ║",
    "║ ▓▓▓▓▓ ║",
    "╚═══════╝",
  ],
  matrix: [
    "01001010",
    "11010110",
    "00101101",
    "10110010",
  ],
}

// ─────────────────────────────────────────────────────────────
// ASCII ANIMATION COMPONENTS
// ─────────────────────────────────────────────────────────────

// Animated ASCII pattern background
function ASCIIPatternBackground({ isActive }: { isActive: boolean }) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [pattern, setPattern] = useState<string[]>([])

  useEffect(() => {
    if (!isActive) return

    // Generate random ASCII pattern
    const generatePattern = () => {
      const chars = "░▒▓│─┼┌┐└┘├┤┬┴"
      const rows: string[] = []
      for (let i = 0; i < 8; i++) {
        let row = ""
        for (let j = 0; j < 24; j++) {
          row += chars[Math.floor(Math.random() * chars.length)]
        }
        rows.push(row)
      }
      return rows
    }

    setPattern(generatePattern())

    const interval = setInterval(() => {
      setPattern(prev => {
        // Slowly mutate pattern
        return prev.map(row => {
          const chars = row.split("")
          const mutateIndex = Math.floor(Math.random() * chars.length)
          const newChars = "░▒▓│─┼┌┐└┘├┤┬┴"
          chars[mutateIndex] = newChars[Math.floor(Math.random() * newChars.length)]
          return chars.join("")
        })
      })
    }, 150)

    return () => clearInterval(interval)
  }, [isActive])

  return (
    <div 
      ref={canvasRef}
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-500",
        isActive ? "opacity-[0.03]" : "opacity-0"
      )}
    >
      <pre className="font-mono text-[6px] leading-[8px] text-foreground whitespace-pre">
        {pattern.join("\n")}
      </pre>
    </div>
  )
}

// Animated data stream effect
function DataStream({ isActive }: { isActive: boolean }) {
  const [streams, setStreams] = useState<string[]>([])

  useEffect(() => {
    if (!isActive) return

    const generateStream = () => {
      const chars = "01"
      let stream = ""
      for (let i = 0; i < 32; i++) {
        stream += chars[Math.floor(Math.random() * chars.length)]
      }
      return stream
    }

    setStreams([generateStream(), generateStream(), generateStream()])

    const interval = setInterval(() => {
      setStreams(prev => prev.map(() => generateStream()))
    }, 100)

    return () => clearInterval(interval)
  }, [isActive])

  if (!isActive) return null

  return (
    <div className="absolute right-0 top-0 bottom-0 w-[80px] overflow-hidden pointer-events-none opacity-[0.06]">
      {streams.map((stream, i) => (
        <div 
          key={i} 
          className="font-mono text-[7px] text-foreground leading-tight animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {stream}
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ANIMATED TITLE WITH ASCII SCRAMBLE
// ─────────────────────────────────────────────────────────────

function AnimatedTitle({ projectName, projectId }: { projectName: string; projectId: string }) {
  const nameRef = useRef<HTMLSpanElement>(null)
  const [displayName, setDisplayName] = useState(projectName.toUpperCase())

  useEffect(() => {
    const targetText = projectName.toUpperCase()
    let iteration = 0
    const maxIterations = targetText.length * 2

    const interval = setInterval(() => {
      setDisplayName(
        targetText
          .split("")
          .map((char, i) => {
            if (char === " ") return char
            if (i < iteration / 2) return char
            return ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]
          })
          .join("")
      )

      iteration++
      if (iteration >= maxIterations) {
        setDisplayName(targetText)
        clearInterval(interval)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [projectName])

  useEffect(() => {
    if (!nameRef.current) return

    gsap.fromTo(
      nameRef.current,
      { opacity: 0, x: -8, skewX: 5 },
      { opacity: 1, x: 0, skewX: 0, duration: 0.35, ease: "power2.out" }
    )
  }, [projectName])

  return (
    <h2 className="font-mono text-base sm:text-lg md:text-xl lg:text-2xl font-black text-foreground tracking-tighter">
      <span className="text-foreground/40 hidden sm:inline">PROJECTS — </span>
      <span ref={nameRef}>{displayName}</span>
    </h2>
  )
}

// ─────────────────────────────────────────────────────────────
// GROWTH ARROW
// ─────────────────────────────────────────────────────────────

function GrowthArrow({ isActive }: { isActive: boolean }) {
  return (
    <span className={cn(
      "font-mono text-[9px] md:text-[10px] transition-all duration-300 flex-shrink-0",
      isActive ? "text-foreground" : "text-foreground/20"
    )}>
      {"──►"}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────
// TIMELINE - REVERSED (2022 → 2025)
// ─────────────────────────────────────────────────────────────

function Timeline({ 
  activeIndex, 
  projects,
  scrollTriggerRef
}: { 
  activeIndex: number
  projects: Project[]
  scrollTriggerRef: React.RefObject<ScrollTrigger | null>
}) {
  const handleClick = useCallback((index: number) => {
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
  }, [projects.length, scrollTriggerRef])

  return (
    <div className="hidden md:flex flex-col w-[120px] lg:w-[140px] flex-shrink-0">
      <div className="font-mono text-[7px] text-foreground/30 mb-2">
        ┌─ GROWTH TIMELINE
      </div>
      
      <div className="relative pl-3 border-l border-foreground/10 flex-1">
        {projects.map((project, index) => {
          const isActive = index === activeIndex
          const isPast = index < activeIndex
          const showYear = index === 0 || projects[index - 1]?.year !== project.year

          return (
            <div key={project.id}>
              {showYear && (
                <div className="font-mono text-[7px] text-foreground/40 mb-0.5 mt-2 first:mt-0 -ml-3 pl-3 border-l-2 border-foreground/20">
                  [{project.year}]
                </div>
              )}

              <button
                onClick={() => handleClick(index)}
                className={cn(
                  "w-full text-left py-0.5 font-mono text-[7px] lg:text-[8px] transition-all relative cursor-pointer",
                  "-ml-3 pl-3 hover:pl-4",
                  isActive ? "text-foreground border-l-2 border-foreground font-bold" : 
                  isPast ? "text-foreground/50 border-l border-foreground/30" : 
                  "text-foreground/20 border-l border-transparent hover:text-foreground/40 hover:border-foreground/20"
                )}
              >
                <span className="truncate block">{project.growth}</span>
              </button>
            </div>
          )
        })}
      </div>
      
      <div className="font-mono text-[7px] text-foreground/30 mt-2">
        └─ NOW
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TECHNICAL GRID SVG PATTERN
// ─────────────────────────────────────────────────────────────

function TechnicalGridSVG({ isActive }: { isActive: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!isActive || !svgRef.current) return

    const lines = svgRef.current.querySelectorAll(".grid-line")
    const circles = svgRef.current.querySelectorAll(".grid-node")

    gsap.fromTo(
      lines,
      { strokeDashoffset: 100, opacity: 0 },
      { strokeDashoffset: 0, opacity: 0.15, duration: 0.8, stagger: 0.02, ease: "power2.out" }
    )

    gsap.fromTo(
      circles,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 0.3, duration: 0.4, stagger: 0.03, delay: 0.3, ease: "back.out(2)" }
    )
  }, [isActive])

  return (
    <svg 
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Horizontal technical lines */}
      {[0, 1, 2, 3, 4].map(i => (
        <line
          key={`h-${i}`}
          className="grid-line"
          x1="0" y1={60 + i * 50} x2="400" y2={60 + i * 50}
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="4 8"
          opacity="0"
        />
      ))}
      {/* Vertical technical lines */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <line
          key={`v-${i}`}
          className="grid-line"
          x1={70 + i * 60} y1="0" x2={70 + i * 60} y2="300"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2 6"
          opacity="0"
        />
      ))}
      {/* Grid intersection nodes */}
      {[0, 1, 2].map(row => 
        [0, 1, 2, 3].map(col => (
          <circle
            key={`node-${row}-${col}`}
            className="grid-node"
            cx={100 + col * 80}
            cy={80 + row * 70}
            r="2"
            fill="currentColor"
            opacity="0"
          />
        ))
      )}
      {/* Corner markers */}
      <path className="grid-line" d="M 10 10 L 10 30 M 10 10 L 30 10" stroke="currentColor" strokeWidth="1" fill="none" opacity="0" />
      <path className="grid-line" d="M 390 10 L 390 30 M 390 10 L 370 10" stroke="currentColor" strokeWidth="1" fill="none" opacity="0" />
      <path className="grid-line" d="M 10 290 L 10 270 M 10 290 L 30 290" stroke="currentColor" strokeWidth="1" fill="none" opacity="0" />
      <path className="grid-line" d="M 390 290 L 390 270 M 390 290 L 370 290" stroke="currentColor" strokeWidth="1" fill="none" opacity="0" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// FILMSTRIP IMAGE GALLERY - BRUTALIST HORIZONTAL SCROLL
// ─────────────────────────────────────────────────────────────

function FilmstripGallery({ 
  images, 
  isActive, 
  projectTitle,
  projectId
}: { 
  images: string[]
  isActive: boolean
  projectTitle: string
  projectId: string
}) {
  const galleryRef = useRef<HTMLDivElement>(null)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())
  const [glitchFrame, setGlitchFrame] = useState(0)

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index))
  }

  const validImages = images.filter((_, i) => !imageErrors.has(i))

  // Glitch effect on frame markers
  useEffect(() => {
    if (!isActive) return

    const glitchChars = ["░", "▒", "▓", "█", "│", "─"]
    const interval = setInterval(() => {
      setGlitchFrame(Math.floor(Math.random() * glitchChars.length))
    }, 200)

    return () => clearInterval(interval)
  }, [isActive])

  // GSAP staggered reveal animation
  useEffect(() => {
    if (!isActive || !galleryRef.current) return

    const ctx = gsap.context(() => {
      // Container slide up
      gsap.fromTo(
        galleryRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", delay: 0.15 }
      )

      // Individual frames staggered reveal with unique animations
      gsap.fromTo(
        ".filmstrip-frame",
        { 
          opacity: 0, 
          scale: 0.8, 
          rotateY: -15,
          x: -30 
        },
        { 
          opacity: 1, 
          scale: 1, 
          rotateY: 0,
          x: 0,
          duration: 0.5, 
          stagger: 0.1, 
          ease: "back.out(1.4)",
          delay: 0.2
        }
      )

      // Sprocket holes animation
      gsap.fromTo(
        ".sprocket-hole",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.2, stagger: 0.02, delay: 0.4 }
      )

      // Frame numbers glitch in
      gsap.fromTo(
        ".frame-number",
        { opacity: 0, x: 10 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, delay: 0.5, ease: "power2.out" }
      )
    }, galleryRef.current)

    return () => ctx.revert()
  }, [isActive])

  // No images - show ASCII filmstrip placeholder
  if (validImages.length === 0) {
    return (
      <div 
        ref={galleryRef}
        className="w-full h-full flex items-center justify-center bg-foreground/[0.01] border-t border-foreground/10"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Filmstrip perforations */}
          <div className="hidden sm:flex flex-col gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1.5 h-2 bg-foreground/10" />
            ))}
          </div>
          
          {/* ASCII placeholder */}
          <pre className="font-mono text-[5px] sm:text-[6px] text-foreground/15 leading-tight">
{`┌───────────────────────────────┐
│  ▓▓▓   ░░░   ▒▒▒   ░░░   ▓▓▓  │
│  ▓▓▓   ░░░   ▒▒▒   ░░░   ▓▓▓  │
│  MEDIA LOADING // ${projectId.padStart(2, '0')}   │
└───────────────────────────────┘`}
          </pre>
          
          {/* Filmstrip perforations */}
          <div className="hidden sm:flex flex-col gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1.5 h-2 bg-foreground/10" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const glitchChars = ["░", "▒", "▓", "█", "│", "─"]

  return (
    <div 
      ref={galleryRef}
      className="w-full h-full relative overflow-hidden"
    >
      {/* Top filmstrip edge with sprocket holes */}
      <div className="absolute top-0 left-0 right-0 h-2 sm:h-3 bg-foreground/[0.03] border-b border-foreground/10 flex items-center justify-between px-1 sm:px-2 overflow-hidden">
        <div className="flex gap-2 sm:gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="sprocket-hole w-1 h-1 sm:w-1.5 sm:h-1.5 bg-foreground/10" />
          ))}
        </div>
        <span className="font-mono text-[4px] sm:text-[5px] text-foreground/20">
          {glitchChars[glitchFrame]} ROLL_{projectId} {glitchChars[(glitchFrame + 1) % 6]}
        </span>
        <div className="flex gap-2 sm:gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="sprocket-hole w-1 h-1 sm:w-1.5 sm:h-1.5 bg-foreground/10" />
          ))}
        </div>
      </div>

      {/* Main filmstrip content */}
      <div className="absolute top-2 sm:top-3 bottom-2 sm:bottom-3 left-0 right-0 flex items-center overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 sm:gap-2 px-2 sm:px-3 py-1">
          {validImages.map((src, i) => (
            <div
              key={i}
              className="filmstrip-frame relative flex-shrink-0 group"
              style={{ perspective: "1000px" }}
            >
              {/* Frame container */}
              <div className="relative w-16 h-12 sm:w-24 sm:h-16 md:w-32 md:h-20 lg:w-40 lg:h-24 border border-foreground/20 bg-foreground/[0.02] overflow-hidden">
                <Image
                  src={src}
                  alt={`${projectTitle} ${i + 1}`}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  onError={() => handleImageError(i)}
                />
                
                {/* Scanline overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-10 transition-opacity" 
                  style={{
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 2px)"
                  }}
                />

                {/* Corner technical marks */}
                <div className="absolute top-0.5 left-0.5 font-mono text-[4px] sm:text-[5px] text-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity">┌</div>
                <div className="absolute top-0.5 right-0.5 font-mono text-[4px] sm:text-[5px] text-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity">┐</div>
                <div className="absolute bottom-0.5 left-0.5 font-mono text-[4px] sm:text-[5px] text-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity">└</div>
                <div className="absolute bottom-0.5 right-0.5 font-mono text-[4px] sm:text-[5px] text-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity">┘</div>
              </div>

              {/* Frame number below */}
              <div className="frame-number absolute -bottom-2.5 sm:-bottom-3 left-0 right-0 flex justify-center">
                <span className="font-mono text-[5px] sm:text-[6px] text-foreground/30 bg-background px-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}

          {/* End frame marker */}
          <div className="filmstrip-frame flex-shrink-0 w-8 sm:w-12 h-12 sm:h-16 md:h-20 lg:h-24 border border-dashed border-foreground/10 flex items-center justify-center">
            <span className="font-mono text-[6px] sm:text-[8px] text-foreground/15 rotate-90 whitespace-nowrap">
              END
            </span>
          </div>
        </div>
      </div>

      {/* Bottom filmstrip edge */}
      <div className="absolute bottom-0 left-0 right-0 h-2 sm:h-3 bg-foreground/[0.03] border-t border-foreground/10 flex items-center justify-between px-1 sm:px-2 overflow-hidden">
        <span className="font-mono text-[4px] sm:text-[5px] text-foreground/20">
          {projectTitle.toUpperCase().slice(0, 12)}
        </span>
        <div className="flex gap-2 sm:gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="sprocket-hole w-1 h-1 sm:w-1.5 sm:h-1.5 bg-foreground/10" />
          ))}
        </div>
        <span className="font-mono text-[4px] sm:text-[5px] text-foreground/20">
          {validImages.length} FRAMES
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT ICON WITH ANIMATION
// ─────────────────────────────────────────────────────────────

function ProjectIcon({ 
  icon, 
  category, 
  isActive 
}: { 
  icon: string
  category: string
  isActive: boolean 
}) {
  const iconRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!isActive || !iconRef.current) return

    gsap.fromTo(
      iconRef.current,
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: "back.out(2)", delay: 0.1 }
    )
  }, [isActive])

  // Generate ASCII art based on category if no icon
  const asciiIcons: Record<string, string> = {
    MOBILE: "📱",
    IOS: "🍎",
    WEB: "🌐",
    AUTOMATION: "⚙️",
    BACKEND: "💾",
    FULLSTACK: "🔗",
    "AI/ML": "🧠",
    REALTIME: "⚡",
    EDUCATION: "📚",
    RESEARCH: "🔬",
  }

  if (hasError || !icon) {
    return (
      <div 
        ref={iconRef}
        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 border border-foreground/20 bg-foreground/5 flex items-center justify-center flex-shrink-0"
      >
        <span className="text-sm sm:text-base md:text-lg">{asciiIcons[category] || "◆"}</span>
      </div>
    )
  }

  return (
    <div 
      ref={iconRef}
      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 border border-foreground/20 bg-foreground/5 p-1 sm:p-1.5 relative overflow-hidden flex-shrink-0"
    >
      <Image
        src={icon}
        alt="Project icon"
        fill
        className="object-contain"
        onError={() => setHasError(true)}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT SLIDE WITH BRUTALIST DESIGN
// ─────────────────────────────────────────────────────────────

function ProjectSlide({ 
  project, 
  index,
  isActive,
  total
}: { 
  project: Project
  index: number
  isActive: boolean
  total: number
}) {
  const slideRef = useRef<HTMLDivElement>(null)
  const [asciiFrame, setAsciiFrame] = useState("┌")
  const [scanlineOffset, setScanlineOffset] = useState(0)

  // ASCII corner animation
  useEffect(() => {
    if (!isActive) return

    const frames = ["┌", "╔", "┏", "╭", "┌"]
    let frameIndex = 0

    const interval = setInterval(() => {
      setAsciiFrame(frames[frameIndex])
      frameIndex++
      if (frameIndex >= frames.length) clearInterval(interval)
    }, 60)

    return () => clearInterval(interval)
  }, [isActive])

  // Scanline animation
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setScanlineOffset(prev => (prev + 1) % 100)
    }, 50)

    return () => clearInterval(interval)
  }, [isActive])

  // Main GSAP animations
  useEffect(() => {
    if (!isActive || !slideRef.current) return

    const ctx = gsap.context(() => {
      // Text reveal with scramble effect
      gsap.fromTo(
        ".detail-animate",
        { opacity: 0, x: -15, skewX: 3 },
        { opacity: 1, x: 0, skewX: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" }
      )
      
      // Tech tags with bounce
      gsap.fromTo(
        ".tech-tag",
        { opacity: 0, scale: 0.7, rotation: -5 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.35, stagger: 0.04, delay: 0.25, ease: "back.out(1.7)" }
      )

      // Border flash effect
      gsap.fromTo(
        ".frame-border",
        { opacity: 0.2 },
        { opacity: 0.5, duration: 0.08, yoyo: true, repeat: 4 }
      )

      // Metric highlight pulse
      gsap.fromTo(
        ".metric-highlight",
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.5)", delay: 0.3 }
      )
    }, slideRef.current)

    return () => ctx.revert()
  }, [isActive])

  const hasGithub = project.links.github
  const hasDemo = "demo" in project.links
  const hasAppStore = "appStore" in project.links

  return (
    <div 
      ref={slideRef}
      className={cn(
        "absolute inset-0 transition-all duration-500",
        isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Background technical grid */}
      <TechnicalGridSVG isActive={isActive} />
      <ASCIIPatternBackground isActive={isActive} />
      <DataStream isActive={isActive} />

      {/* Main container */}
      <div className="h-full border border-foreground/30 bg-background/95 relative overflow-hidden flex flex-col">
        {/* Animated scanline */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(transparent ${scanlineOffset}%, rgba(0,0,0,0.02) ${scanlineOffset + 1}%, transparent ${scanlineOffset + 2}%)`,
          }}
        />

        {/* ASCII frame corners */}
        <span className="frame-border absolute top-0 left-0 font-mono text-[6px] sm:text-[7px] md:text-[8px] text-foreground/40 p-1 sm:p-1.5">
          {asciiFrame}{"═══"}
        </span>
        <span className="frame-border absolute top-0 right-0 font-mono text-[6px] sm:text-[7px] md:text-[8px] text-foreground/40 p-1 sm:p-1.5">
          {"═══"}┐
        </span>
        <span className="frame-border absolute bottom-0 left-0 font-mono text-[6px] sm:text-[7px] md:text-[8px] text-foreground/40 p-1 sm:p-1.5">
          └{"═══"}
        </span>
        <span className="frame-border absolute bottom-0 right-0 font-mono text-[6px] sm:text-[7px] md:text-[8px] text-foreground/40 p-1 sm:p-1.5">
          {"═══"}┘
        </span>

        {/* Content layout - vertical stack with filmstrip at bottom */}
        <div className="flex-1 flex flex-col p-2 sm:p-3 md:p-4 pb-5 sm:pb-6 overflow-hidden">
          
          {/* TOP: Project details - horizontal layout on larger screens */}
          <div className="flex-1 flex flex-col md:flex-row gap-2 sm:gap-3 md:gap-4 min-h-0 overflow-y-auto md:overflow-hidden">
            
            {/* Left column: Title + Growth */}
            <div className="flex-1 flex flex-col gap-1.5 sm:gap-2 min-w-0">
              {/* Header row with icon */}
              <div className="detail-animate flex items-start gap-2 sm:gap-3">
                <ProjectIcon 
                  icon={project.icon} 
                  category={project.category} 
                  isActive={isActive} 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <span className="font-mono text-2xl sm:text-3xl md:text-4xl font-black text-foreground/10">
                      {project.id}
                    </span>
                    <span className="font-mono text-[5px] sm:text-[6px] md:text-[7px] px-1 py-0.5 border border-foreground/20 text-foreground/50">
                      {project.category}
                    </span>
                    <span className="font-mono text-[5px] sm:text-[6px] text-foreground/30">
                      {project.year}
                    </span>
                  </div>
                  <h3 className="font-mono text-sm sm:text-base md:text-lg lg:text-xl font-black text-foreground tracking-tight truncate mt-0.5">
                    {project.title.toUpperCase()}
                  </h3>
                </div>
              </div>

              {/* Growth section - compact */}
              <div className="detail-animate bg-foreground/[0.02] border border-foreground/10 p-1.5 sm:p-2">
                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                  <span className="font-mono text-[5px] sm:text-[6px] text-foreground/30">GROWTH:</span>
                  <h4 className="font-mono text-[9px] sm:text-[10px] md:text-xs font-black text-foreground">
                    {project.growth.toUpperCase()}
                  </h4>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-[5px] sm:text-[6px] md:text-[7px]">
                  <span className="text-foreground/40 truncate flex-1">{project.before}</span>
                  <span className="font-mono text-foreground/30 text-[7px] sm:text-[8px] flex-shrink-0">►</span>
                  <span className="text-foreground font-medium truncate flex-1">{project.after}</span>
                </div>
              </div>

              {/* Description - mobile visible but compact */}
              <p className="detail-animate font-mono text-[6px] sm:text-[7px] md:text-[8px] text-foreground/50 leading-relaxed line-clamp-2">
                {project.description}
              </p>
            </div>

            {/* Right column: Metrics + Tech + Links */}
            <div className="md:w-48 lg:w-56 flex flex-col gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Metrics row */}
              <div className="detail-animate flex items-stretch gap-1.5 sm:gap-2">
                <div className="metric-highlight flex-1 border-2 border-foreground/30 px-2 py-1 sm:py-1.5 text-center">
                  <div className="font-mono text-[4px] sm:text-[5px] text-foreground/40">METRIC</div>
                  <div className="font-mono text-sm sm:text-base md:text-lg font-black text-foreground">
                    {project.metric}
                  </div>
                </div>
                <div className="flex-1 border border-foreground/15 px-2 py-1 sm:py-1.5 text-center">
                  <div className="font-mono text-[4px] sm:text-[5px] text-foreground/30">RESULT</div>
                  <div className="font-mono text-[7px] sm:text-[8px] md:text-[9px] text-foreground/60">
                    {project.achievement}
                  </div>
                </div>
              </div>

              {/* Tech stack */}
              <div className="detail-animate">
                <div className="flex flex-wrap gap-0.5 sm:gap-1">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="tech-tag font-mono text-[5px] sm:text-[6px] md:text-[7px] px-1 py-0.5 border border-foreground/20 text-foreground/50 bg-foreground/[0.02]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="detail-animate flex items-center gap-2 sm:gap-3 pt-1 sm:pt-1.5 border-t border-foreground/10 mt-auto">
                {hasGithub && (
                  <a 
                    href={project.links.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-mono text-[6px] sm:text-[7px] text-foreground/40 hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <Github className="w-2.5 h-2.5" />
                    <span>CODE</span>
                  </a>
                )}
                {hasDemo && (
                  <a 
                    href={(project.links as { demo?: string }).demo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-mono text-[6px] sm:text-[7px] text-foreground/40 hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                    <span>DEMO</span>
                  </a>
                )}
                {hasAppStore && (
                  <span className="font-mono text-[6px] sm:text-[7px] text-foreground/30">● iOS</span>
                )}
              </div>
            </div>
          </div>

          {/* BOTTOM: Filmstrip image gallery - visible on all screens */}
          <div className="h-16 sm:h-20 md:h-24 lg:h-28 flex-shrink-0 mt-2 sm:mt-3">
            <FilmstripGallery 
              images={project.images} 
              isActive={isActive} 
              projectTitle={project.title}
              projectId={project.id}
            />
          </div>
        </div>

        {/* Footer status bar */}
        <div className="absolute bottom-0 left-0 right-0 h-4 sm:h-5 border-t border-foreground/10 bg-foreground/[0.02] flex items-center justify-between px-2 sm:px-3 font-mono text-[5px] sm:text-[6px]">
          <span className="text-foreground/30 hidden sm:inline">
            SLIDE_{String(index + 1).padStart(2, "0")} | STATUS: ACTIVE
          </span>
          <span className="text-foreground/30 sm:hidden">
            #{String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-foreground/40">
            [{String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}]
          </span>
          <span className="text-foreground/30 hidden sm:inline">
            {new Date().toISOString().slice(0, 10).replace(/-/g, ".")}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PROGRESS INDICATOR WITH ASCII ANIMATION
// ─────────────────────────────────────────────────────────────

function ProgressIndicator({ activeIndex, total }: { activeIndex: number; total: number }) {
  const progressRef = useRef<HTMLDivElement>(null)
  const progressChars = 12
  const filled = Math.round((activeIndex / (total - 1)) * progressChars) || 0
  const progressBar = "█".repeat(filled) + "░".repeat(progressChars - filled)
  
  const percentage = Math.round((activeIndex / (total - 1)) * 100) || 0

  useEffect(() => {
    if (!progressRef.current) return

    gsap.fromTo(
      progressRef.current.querySelector(".progress-fill"),
      { scaleX: 0 },
      { scaleX: 1, duration: 0.4, ease: "power2.out" }
    )
  }, [activeIndex])

  return (
    <div ref={progressRef} className="flex items-center justify-between py-2 sm:py-3 font-mono border-t border-foreground/15 bg-foreground/[0.01]">
      <div className="flex items-center gap-1 sm:gap-2">
        <span className="text-[6px] sm:text-[7px] text-foreground/30 border border-foreground/10 px-0.5 sm:px-1">
          2022
        </span>
        <span className="text-[5px] sm:text-[6px] text-foreground/20 hidden lg:inline">START</span>
      </div>
      
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
        {/* ASCII progress bar - hidden on small screens */}
        <span className="text-[6px] sm:text-[7px] md:text-[8px] text-foreground/30 hidden md:inline font-mono tracking-tighter">
          [{progressBar}]
        </span>
        
        {/* Visual progress bar */}
        <div className="w-12 sm:w-16 md:w-24 lg:w-32 h-0.5 sm:h-1 bg-foreground/10 relative overflow-hidden">
          <div 
            className="progress-fill absolute inset-y-0 left-0 bg-foreground/40 origin-left transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-0.5 sm:w-1 h-1.5 sm:h-2 bg-foreground animate-pulse"
            style={{ left: `${percentage}%` }}
          />
        </div>
        
        {/* Counter */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <span className="text-xs sm:text-sm md:text-base text-foreground font-black">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="text-[6px] sm:text-[8px] text-foreground/30">/</span>
          <span className="text-[7px] sm:text-[9px] text-foreground/40">
            {String(total).padStart(2, "0")}
          </span>
        </div>
        
        {/* Percentage - hidden on small screens */}
        <span className="text-[7px] sm:text-[8px] text-foreground/40 hidden lg:inline">
          [{percentage}%]
        </span>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2">
        <span className="text-[5px] sm:text-[6px] text-foreground/20 hidden lg:inline">CURRENT</span>
        <span className="text-[6px] sm:text-[7px] text-foreground font-bold border border-foreground/30 px-0.5 sm:px-1 bg-foreground/5">
          NOW
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MOBILE QUICK NAV
// ─────────────────────────────────────────────────────────────

function MobileQuickNav({ 
  activeIndex, 
  total,
  scrollTriggerRef 
}: { 
  activeIndex: number
  total: number
  scrollTriggerRef: React.RefObject<ScrollTrigger | null>
}) {
  const handleClick = useCallback((index: number) => {
    const trigger = scrollTriggerRef.current
    if (!trigger) return

    const start = trigger.start
    const end = trigger.end
    const totalDistance = end - start
    const projectProgress = index / (total - 1)
    const targetScroll = start + (totalDistance * projectProgress)

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth"
    })
  }, [total, scrollTriggerRef])

  return (
    <div className="md:hidden flex gap-1 overflow-x-auto scrollbar-hide py-1 mb-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => handleClick(i)}
          aria-label={`Go to project ${i + 1}`}
          className={cn(
            // Larger touch target (44px min recommended)
            "flex-shrink-0 w-6 h-6 flex items-center justify-center touch-manipulation",
            "active:scale-90 transition-transform"
          )}
        >
          <span 
            className={cn(
              "w-full h-1.5 rounded-sm transition-all",
              i === activeIndex ? "bg-foreground" : 
              i < activeIndex ? "bg-foreground/40" : "bg-foreground/15"
            )}
          />
        </button>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN SECTION WITH GSAP PIN
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// MAIN SECTION WITH GSAP PIN - BRUTALIST DESIGN
// ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const pinContainerRef = useRef<HTMLDivElement>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const isMobile = useIsMobile()

  const currentProject = allProjects[activeIndex]
  const config = isMobile ? SCROLL_CONFIG.mobile : SCROLL_CONFIG.desktop

  // Generate decorative ASCII for header
  const decorativeASCII = useMemo(() => {
    const chars = "░▒▓"
    return Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  }, [activeIndex])

  // GSAP ScrollTrigger setup
  useEffect(() => {
    if (!sectionRef.current || !pinContainerRef.current) return

    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
      scrollTriggerRef.current = null
    }

    const scrollDistance = TOTAL_PROJECTS * config.scrollPerProject

    const ctx = gsap.context(() => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${scrollDistance}%`,
        pin: pinContainerRef.current,
        pinSpacing: true,
        scrub: config.scrubSpeed,
        onUpdate: (self) => {
          const progress = self.progress
          const newIndex = Math.min(
            Math.floor(progress * TOTAL_PROJECTS),
            TOTAL_PROJECTS - 1
          )
          setActiveIndex(newIndex)
        },
      })
    }, sectionRef.current)

    return () => {
      ctx.revert()
      scrollTriggerRef.current = null
    }
  }, [isMobile, config.scrollPerProject, config.scrubSpeed])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative bg-background"
    >
      <div 
        ref={pinContainerRef}
        className="min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 py-safe"
      >
        {/* Background technical grid pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Primary grid */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 40px, currentColor 40px, currentColor 41px),
              repeating-linear-gradient(90deg, transparent, transparent 40px, currentColor 40px, currentColor 41px)
            `
          }} />
          {/* Secondary finer grid */}
          <div className="absolute inset-0 opacity-[0.008]" style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 10px, currentColor 10px, currentColor 11px),
              repeating-linear-gradient(90deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)
            `
          }} />
          {/* Diagonal accent lines */}
          <div className="absolute inset-0 opacity-[0.01]" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 80px, currentColor 80px, currentColor 81px)`
          }} />
        </div>

        {/* Main content container */}
        <div className="w-full max-w-6xl mx-auto relative">
          {/* ═══════════════════════════════════════════════════════════
              HEADER SECTION - BRUTALIST TYPOGRAPHY
              ═══════════════════════════════════════════════════════════ */}
          <div className="mb-3 md:mb-4">
            {/* Top technical border */}
            <div className="font-mono text-[6px] md:text-[7px] text-foreground/15 mb-2 flex items-center gap-1">
              <span>╔</span>
              <span className="flex-1 overflow-hidden tracking-tighter">{decorativeASCII}</span>
              <span className="text-[5px] text-foreground/10 hidden md:inline">SYS.PROJECTS.v2.0</span>
              <span className="flex-1 overflow-hidden tracking-tighter text-right">{decorativeASCII}</span>
              <span>╗</span>
            </div>
            
            <div className="flex items-end justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Section label */}
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-mono text-[6px] md:text-[8px] text-foreground/30 tracking-[0.15em] md:tracking-[0.25em]">
                    {">>>"} {isMobile ? "PROJECTS" : "PROJECTS / GROWTH_TIMELINE"}
                  </p>
                  <span className="hidden md:inline font-mono text-[6px] text-foreground/20 px-1 border border-foreground/10">
                    {currentProject.category}
                  </span>
                </div>
                
                {/* Animated project title */}
                <AnimatedTitle 
                  projectName={currentProject.title} 
                  projectId={currentProject.id}
                />
              </div>
              
              {/* Large counter display */}
              <div className="text-right font-mono flex-shrink-0">
                <div className="relative">
                  <span className="text-3xl md:text-5xl font-black text-foreground/[0.06] tracking-tighter">
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute bottom-0 right-0 text-[7px] md:text-[8px] text-foreground/40 translate-y-full">
                    /{String(TOTAL_PROJECTS).padStart(2, "0")} PROJECTS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile quick navigation */}
          <MobileQuickNav 
            activeIndex={activeIndex}
            total={TOTAL_PROJECTS}
            scrollTriggerRef={scrollTriggerRef}
          />

          {/* ═══════════════════════════════════════════════════════════
              MAIN LAYOUT - TIMELINE + PROJECT DISPLAY
              ═══════════════════════════════════════════════════════════ */}
          <div className="flex gap-2 sm:gap-3 md:gap-5 lg:gap-6">
            {/* Timeline sidebar (desktop only) */}
            <Timeline 
              activeIndex={activeIndex}
              projects={allProjects}
              scrollTriggerRef={scrollTriggerRef}
            />

            {/* Project display area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Project slide container - responsive height using CSS clamp */}
              <div 
                className="relative"
                style={{ 
                  height: "clamp(340px, 58vh, 560px)",
                }}
              >
                {allProjects.map((project, index) => (
                  <ProjectSlide
                    key={project.id}
                    project={project}
                    index={index}
                    isActive={index === activeIndex}
                    total={TOTAL_PROJECTS}
                  />
                ))}
              </div>

              {/* Progress indicator */}
              <ProgressIndicator activeIndex={activeIndex} total={TOTAL_PROJECTS} />
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              FOOTER SECTION
              ═══════════════════════════════════════════════════════════ */}
          <div className="mt-3 md:mt-4">
            {/* Bottom technical border */}
            <div className="font-mono text-[6px] md:text-[7px] text-foreground/15 flex items-center gap-1">
              <span>╚</span>
              <span className="flex-1 overflow-hidden tracking-tighter">{decorativeASCII}</span>
              <span className="text-[5px] text-foreground/10 hidden md:inline">
                RENDERED: {new Date().toISOString().slice(0, 19).replace("T", " ")}
              </span>
              <span className="flex-1 overflow-hidden tracking-tighter text-right">{decorativeASCII}</span>
              <span>╝</span>
            </div>

            {/* Scroll instruction */}
            <div className="text-center mt-3">
              <div className="inline-flex items-center gap-2 font-mono text-[6px] md:text-[7px] text-foreground/20">
                <span className="animate-bounce">↓</span>
                <span className="tracking-widest">
                  {isMobile ? "SCROLL" : "SCROLL_TO_NAVIGATE"}
                </span>
                <span className="animate-bounce">↓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
