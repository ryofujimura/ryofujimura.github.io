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
// STICKER IMAGE GALLERY - AWARD-WINNING UNIQUE DESIGN
// ─────────────────────────────────────────────────────────────

// Sticker positions - scattered like real stickers
const STICKER_POSITIONS = [
  { x: "5%", y: "0%", rotate: -8, scale: 1 },
  { x: "35%", y: "5%", rotate: 4, scale: 0.95 },
  { x: "65%", y: "-2%", rotate: -3, scale: 1.05 },
  { x: "20%", y: "15%", rotate: 6, scale: 0.9 },
  { x: "50%", y: "12%", rotate: -5, scale: 1 },
]

function StickerGallery({ 
  images, 
  isActive, 
  projectId
}: { 
  images: string[]
  isActive: boolean
  projectId: string
}) {
  const galleryRef = useRef<HTMLDivElement>(null)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // GSAP sticker animation - each sticker flies in from different angles
  useEffect(() => {
    if (!isActive || !galleryRef.current) return

    const stickers = galleryRef.current.querySelectorAll(".sticker-item")
    
    // Kill any existing animations
    gsap.killTweensOf(stickers)

    // Animate each sticker with unique entrance
    stickers.forEach((sticker, i) => {
      const angle = (i * 72) * (Math.PI / 180) // Spread around
      const distance = 100 + Math.random() * 50
      const startX = Math.cos(angle) * distance
      const startY = Math.sin(angle) * distance + 50
      const startRotation = (Math.random() - 0.5) * 60

      gsap.fromTo(
        sticker,
        { 
          x: startX, 
          y: startY, 
          rotation: startRotation,
          scale: 0,
          opacity: 0 
        },
        { 
          x: 0, 
          y: 0, 
          rotation: STICKER_POSITIONS[i % STICKER_POSITIONS.length].rotate,
          scale: STICKER_POSITIONS[i % STICKER_POSITIONS.length].scale,
          opacity: 1,
          duration: 0.6,
          delay: 0.15 + i * 0.08,
          ease: "back.out(1.2)"
        }
      )
    })
  }, [isActive])

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index))
  }

  const validImages = images.filter((_, i) => !imageErrors.has(i))

  // No images - show ASCII placeholder stickers
  if (validImages.length === 0) {
    return (
      <div ref={galleryRef} className="relative h-full flex items-center justify-center">
        <div className="sticker-item font-mono text-[8px] sm:text-[10px] text-foreground/20 border-2 border-dashed border-foreground/10 px-3 py-2 bg-background/50">
          <span className="block text-center">┌─────────┐</span>
          <span className="block text-center">│ NO IMG  │</span>
          <span className="block text-center">│ ◇◇◇◇◇ │</span>
          <span className="block text-center">└─────────┘</span>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={galleryRef}
      className="relative h-full w-full"
    >
      {/* Sticker items - positioned absolutely for overlap effect */}
      {validImages.slice(0, 3).map((src, i) => {
        const pos = STICKER_POSITIONS[i % STICKER_POSITIONS.length]
        const isHovered = hoveredIndex === i
        
        return (
          <div
            key={i}
            className={cn(
              "sticker-item absolute cursor-pointer transition-all duration-200",
              "w-[80px] h-[60px] sm:w-[100px] sm:h-[75px] md:w-[120px] md:h-[90px] lg:w-[140px] lg:h-[105px]",
              isHovered ? "z-50" : `z-${10 + i}`
            )}
            style={{
              left: pos.x,
              top: pos.y,
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Sticker shadow/tape effect */}
            <div className="absolute -inset-1 bg-foreground/5 transform rotate-1" />
            
            {/* Main sticker */}
            <div 
              className={cn(
                "relative w-full h-full border-2 border-foreground/30 bg-background overflow-hidden",
                "shadow-[3px_3px_0_0_rgba(0,0,0,0.1)]",
                isHovered && "shadow-[6px_6px_0_0_rgba(0,0,0,0.15)] scale-110 -translate-y-1"
              )}
              style={{
                transform: isHovered ? `rotate(0deg) scale(1.1)` : undefined,
              }}
            >
              <Image
                src={src}
                alt={`Project ${projectId} image ${i + 1}`}
                fill
                className={cn(
                  "object-cover transition-all duration-300",
                  isHovered ? "grayscale-0" : "grayscale"
                )}
                onError={() => handleImageError(i)}
                sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, (max-width: 1024px) 120px, 140px"
              />
              
              {/* Sticker shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
              
              {/* Technical corner marks */}
              <div className="absolute top-0.5 left-0.5 font-mono text-[4px] text-foreground/30">◢</div>
              <div className="absolute top-0.5 right-0.5 font-mono text-[4px] text-foreground/30">◣</div>
            </div>
            
            {/* Sticker label */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-mono text-[5px] sm:text-[6px] text-foreground/40 bg-background px-1 whitespace-nowrap">
              IMG_{String(i + 1).padStart(2, "0")}
            </div>
          </div>
        )
      })}

      {/* Extra images indicator */}
      {validImages.length > 3 && (
        <div 
          className="sticker-item absolute font-mono text-[7px] sm:text-[8px] text-foreground/30 border border-dashed border-foreground/20 px-2 py-1 bg-background/80"
          style={{ right: "5%", top: "20%" }}
        >
          +{validImages.length - 3} MORE
        </div>
      )}
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
// PROJECT SLIDE - STICKER THEME WITH BOTTOM IMAGES
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

  // Main GSAP animations
  useEffect(() => {
    if (!isActive || !slideRef.current) return

    const ctx = gsap.context(() => {
      // Text reveal with scramble effect
      gsap.fromTo(
        ".detail-animate",
        { opacity: 0, x: -12, skewX: 2 },
        { opacity: 1, x: 0, skewX: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" }
      )
      
      // Tech tags with bounce
      gsap.fromTo(
        ".tech-tag",
        { opacity: 0, scale: 0.7, rotation: -5 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.3, stagger: 0.03, delay: 0.2, ease: "back.out(1.7)" }
      )

      // Border flash effect
      gsap.fromTo(
        ".frame-border",
        { opacity: 0.2 },
        { opacity: 0.5, duration: 0.06, yoyo: true, repeat: 3 }
      )

      // Metric highlight pulse
      gsap.fromTo(
        ".metric-highlight",
        { scale: 1.05, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "elastic.out(1, 0.6)", delay: 0.25 }
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
      {/* Subtle background effects */}
      <TechnicalGridSVG isActive={isActive} />

      {/* Main container */}
      <div className="h-full border border-foreground/30 bg-background/98 relative overflow-hidden flex flex-col">
        {/* ASCII frame corners */}
        <span className="frame-border absolute top-0 left-0 font-mono text-[6px] sm:text-[7px] text-foreground/30 p-1">
          {asciiFrame}{"══"}
        </span>
        <span className="frame-border absolute top-0 right-0 font-mono text-[6px] sm:text-[7px] text-foreground/30 p-1">
          {"══"}┐
        </span>
        <span className="frame-border absolute bottom-0 left-0 font-mono text-[6px] sm:text-[7px] text-foreground/30 p-1">
          └{"══"}
        </span>
        <span className="frame-border absolute bottom-0 right-0 font-mono text-[6px] sm:text-[7px] text-foreground/30 p-1">
          {"══"}┘
        </span>

        {/* ═══════════════════════════════════════════════════════════
            TOP SECTION: Compact project info - maximized horizontal space
            ═══════════════════════════════════════════════════════════ */}
        <div className="flex-shrink-0 p-2 sm:p-3 md:p-4 pb-1 sm:pb-2">
          {/* Row 1: Icon + Title + ID + Metrics */}
          <div className="detail-animate flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
            {/* Icon */}
            <ProjectIcon 
              icon={project.icon} 
              category={project.category} 
              isActive={isActive} 
            />
            
            {/* Title and meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
                <h3 className="font-mono text-sm sm:text-base md:text-lg lg:text-xl font-black text-foreground tracking-tight truncate">
                  {project.title.toUpperCase()}
                </h3>
                <span className="font-mono text-lg sm:text-xl md:text-2xl font-black text-foreground/10 flex-shrink-0">
                  {project.id}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="font-mono text-[6px] sm:text-[7px] px-1 py-0.5 border border-foreground/20 text-foreground/50">
                  {project.category}
                </span>
                <span className="font-mono text-[6px] sm:text-[7px] text-foreground/40">
                  {project.year}
                </span>
                <span className="font-mono text-[6px] sm:text-[7px] text-foreground/20 hidden sm:inline">│</span>
                <span className="font-mono text-[7px] sm:text-[8px] text-foreground/60 hidden sm:inline">
                  {project.growth}
                </span>
              </div>
            </div>

            {/* Metrics - right aligned */}
            <div className="metric-highlight flex-shrink-0 border-2 border-foreground/30 px-2 sm:px-3 py-1 text-right">
              <div className="font-mono text-xs sm:text-sm md:text-base font-black text-foreground">
                {project.metric}
              </div>
              <div className="font-mono text-[5px] sm:text-[6px] text-foreground/40">
                {project.achievement}
              </div>
            </div>
          </div>

          {/* Row 2: Description + Growth + Tech (horizontal layout) */}
          <div className="detail-animate grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {/* Description */}
            <div className="sm:col-span-1">
              <div className="font-mono text-[5px] text-foreground/30 mb-0.5">DESCRIPTION</div>
              <p className="font-mono text-[7px] sm:text-[8px] text-foreground/60 leading-relaxed line-clamp-2">
                {project.description}
              </p>
            </div>
            
            {/* Growth vector - compact */}
            <div className="sm:col-span-1">
              <div className="font-mono text-[5px] text-foreground/30 mb-0.5">GROWTH</div>
              <div className="flex items-center gap-1 text-[6px] sm:text-[7px]">
                <span className="text-foreground/40 truncate">{project.before}</span>
                <span className="text-foreground/30 flex-shrink-0">→</span>
                <span className="text-foreground font-medium truncate">{project.after}</span>
              </div>
            </div>

            {/* Tech + Links */}
            <div className="sm:col-span-1">
              <div className="font-mono text-[5px] text-foreground/30 mb-0.5">STACK</div>
              <div className="flex flex-wrap gap-0.5 sm:gap-1 items-center">
                {project.techStack.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="tech-tag font-mono text-[5px] sm:text-[6px] px-1 py-0.5 border border-foreground/15 text-foreground/50 bg-foreground/[0.02]"
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 4 && (
                  <span className="font-mono text-[5px] text-foreground/30">+{project.techStack.length - 4}</span>
                )}
                <span className="font-mono text-[5px] text-foreground/10 mx-1 hidden sm:inline">│</span>
                {hasGithub && (
                  <a 
                    href={project.links.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-mono text-[6px] text-foreground/30 hover:text-foreground transition-colors"
                  >
                    <Github className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </a>
                )}
                {hasDemo && (
                  <a 
                    href={(project.links as { demo?: string }).demo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-mono text-[6px] text-foreground/30 hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </a>
                )}
                {hasAppStore && (
                  <span className="font-mono text-[6px] text-foreground/20">●iOS</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div className="px-2 sm:px-3 md:px-4">
          <div className="border-t border-dashed border-foreground/10" />
        </div>

        {/* ═══════════════════════════════════════════════════════════
            BOTTOM SECTION: Sticker Gallery - takes remaining space
            ═══════════════════════════════════════════════════════════ */}
        <div className="flex-1 relative min-h-[100px] p-2 sm:p-3 md:p-4 pt-2">
          {/* Gallery label */}
          <div className="absolute top-2 left-3 sm:left-4 font-mono text-[5px] sm:text-[6px] text-foreground/20 z-10">
            ┌─ GALLERY [{project.images.length > 0 ? String(project.images.length).padStart(2, "0") : "00"}]
          </div>
          
          {/* Sticker gallery */}
          <StickerGallery 
            images={project.images} 
            isActive={isActive} 
            projectId={project.id}
          />
        </div>

        {/* Footer status bar */}
        <div className="flex-shrink-0 h-3 sm:h-4 border-t border-foreground/10 bg-foreground/[0.02] flex items-center justify-between px-2 sm:px-3 font-mono text-[4px] sm:text-[5px]">
          <span className="text-foreground/25">
            #{String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-foreground/30">
            [{String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}]
          </span>
          <span className="text-foreground/25 hidden sm:inline">
            {project.year}.{project.category}
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
                  height: "clamp(320px, 55vh, 600px)",
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
