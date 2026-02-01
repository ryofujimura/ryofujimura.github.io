"use client"

import { useState, useRef, useEffect, useCallback } from "react"
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
// SCROLL CONFIG
// ─────────────────────────────────────────────────────────────

const SCROLL_CONFIG = {
  mobile: {
    scrollPerProject: 35,
    scrubSpeed: 0.1,
    slideHeight: 520,
  },
  desktop: {
    scrollPerProject: 40,
    scrubSpeed: 0.15,
    slideHeight: 580,
  },
}

// ─────────────────────────────────────────────────────────────
// PROJECT DATA WITH IMAGES
// ─────────────────────────────────────────────────────────────

const allProjects = [
  {
    id: "01",
    year: "2022",
    title: "Poker %",
    subtitle: "WATCHOS APPLICATION",
    growth: "First WatchOS App",
    description: "Real-time poker odds calculator designed for Apple Watch. Calculates win probabilities using Monte Carlo simulation with sub-10ms response times.",
    features: ["Monte Carlo Simulation", "Real-time Calculations", "Haptic Feedback", "Complication Support"],
    before: "No native dev experience",
    after: "Published WatchOS app",
    techStack: ["Swift", "WatchOS", "SwiftUI"],
    achievement: "Published",
    metric: "<10ms",
    metricLabel: "CALC TIME",
    icon: "/images/poker.png",
    images: ["/images/poker_1.jpg", "/images/poker_2.jpg", "/images/poker_3.jpg"],
    links: { github: "https://github.com/ryofujimura", appStore: "https://apps.apple.com/us/app/poker-pocket-odds/id6499280318" },
    ascii: `
    ♠ ♥ ♦ ♣
   ┌─────────┐
   │ A       │
   │    ♠    │
   │       A │
   └─────────┘`,
    status: "LIVE",
  },
  {
    id: "02",
    year: "2023",
    title: "Shohei HG",
    subtitle: "PYTHON AUTOMATION",
    growth: "Python Automation",
    description: "Automated content pipeline for Instagram and YouTube. Uses Python to scrape, process, and schedule posts with intelligent hashtag optimization.",
    features: ["Auto Scheduling", "Content Curation", "Hashtag Analysis", "Multi-platform Sync"],
    before: "Manual content posting",
    after: "Automated pipeline",
    techStack: ["Python", "Instagram API", "YouTube API"],
    achievement: "11K followers",
    metric: "685",
    metricLabel: "POSTS",
    icon: "/images/shohei_icon.svg",
    images: ["/images/shoheihomeground_1.jpg", "/images/shoheihomeground_2.jpg", "/images/shoheihomeground_3.jpg"],
    links: { instagram: "#", youtube: "#" },
    ascii: `
   ╔══════════╗
   ║ AUTOMATE ║
   ║ ▓▓▓▓▓▓░░ ║
   ║ POSTING  ║
   ╚══════════╝`,
    status: "ACTIVE",
  },
  {
    id: "03",
    year: "2023",
    title: "Schedule Master",
    subtitle: "FLASK BACKEND",
    growth: "Backend Architecture",
    description: "Intelligent course scheduling system with conflict detection. Backend Flask API implements graph coloring algorithms for optimal schedule generation.",
    features: ["Conflict Detection", "Graph Algorithms", "REST API", "Export Options"],
    before: "Frontend-only apps",
    after: "Flask API + algorithms",
    techStack: ["Python", "Flask", "SQLite"],
    achievement: "500+ courses",
    metric: "70%",
    metricLabel: "FEWER ERRORS",
    icon: "/images/schedule.svg",
    images: ["/images/schedule.jpg"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
    ascii: `
   ┌─┬─┬─┬─┬─┐
   │M│T│W│T│F│
   ├─┼─┼─┼─┼─┤
   │█│░│█│░│█│
   │░│█│░│█│░│
   └─┴─┴─┴─┴─┘`,
    status: "DEPLOYED",
  },
  {
    id: "04",
    year: "2024",
    title: "Matcha Time",
    subtitle: "IOS APPLICATION",
    growth: "App Store Launch",
    description: "Minimalist matcha timer app with Japanese aesthetic. Features precise brewing timers, temperature guides, and ritual tracking for matcha enthusiasts.",
    features: ["Precision Timers", "Temperature Guide", "Ritual Tracking", "Zen Mode"],
    before: "Local dev projects",
    after: "Production iOS app",
    techStack: ["Swift", "SwiftUI", "CloudKit"],
    achievement: "50 users",
    metric: "4 wks",
    metricLabel: "TO LAUNCH",
    icon: "/images/matchatime.svg",
    images: ["/images/matchatime_1.jpg", "/images/matchatime_2.jpg", "/images/matchatime_3.jpg"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
    ascii: `
    🍵
   ╭───────╮
   │ ░░░░░ │
   │ MATCHA│
   │ ▓▓▓▓▓ │
   ╰───────╯`,
    status: "LIVE",
  },
  {
    id: "05",
    year: "2024",
    title: "Portfolio",
    subtitle: "NEXT.JS + GSAP",
    growth: "Modern Web Stack",
    description: "This portfolio website. Built with Next.js 15, featuring scroll-driven animations, brutalist design system, and performance-optimized rendering.",
    features: ["Scroll Animations", "Brutalist Design", "Dark/Light Mode", "Performance Opt"],
    before: "Static HTML sites",
    after: "Next.js + GSAP animations",
    techStack: ["React", "Next.js", "GSAP", "Tailwind"],
    achievement: "60% faster",
    metric: "<1.5s",
    metricLabel: "LCP",
    icon: "/images/web_app.svg",
    images: ["/images/homepage.png", "/images/experiencepage.png"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
    ascii: `
   ┌──────────────┐
   │ ████████░░░░ │
   │ ▓▓▓▓▓▓▓▓░░░░ │
   │ ░░░░░░░░████ │
   │ PORTFOLIO.JS │
   └──────────────┘`,
    status: "LIVE",
  },
  {
    id: "06",
    year: "2024",
    title: "Saboriendo",
    subtitle: "CROSS-PLATFORM",
    growth: "Full-Stack + Mobile",
    description: "Food tracking app with barcode scanning. Syncs between iOS app and web dashboard using Firebase Realtime Database for instant updates.",
    features: ["Barcode Scan", "Cross-platform", "Real-time Sync", "Nutrition Data"],
    before: "Single platform apps",
    after: "Cross-platform sync system",
    techStack: ["React 19", "SwiftUI", "Firebase"],
    achievement: "50% faster",
    metric: "<1s",
    metricLabel: "SCAN TIME",
    icon: "/images/api.svg",
    images: [],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
    ascii: `
   ┌───────────┐
   │ ║│║ │║│║│ │
   │ ║│║ │║│║│ │
   │ BARCODE   │
   │ ▓▓▓▓░░░░░ │
   └───────────┘`,
    status: "BETA",
  },
  {
    id: "07",
    year: "2024",
    title: "With (Local LLM)",
    subtitle: "ON-DEVICE AI",
    growth: "On-Device AI",
    description: "Privacy-focused AI assistant running entirely on-device. Uses llama.cpp with quantized GGUF models for fast inference without cloud dependency.",
    features: ["Local Inference", "GGUF Models", "Privacy First", "Offline Mode"],
    before: "Cloud-dependent AI",
    after: "Local llama.cpp inference",
    techStack: ["Swift", "llama.cpp", "GGUF"],
    achievement: "2GB saved",
    metric: "<50ms",
    metricLabel: "PER TOKEN",
    icon: "/images/ai_and_algorithms.svg",
    images: [],
    links: { github: "https://github.com/ryofujimura" },
    ascii: `
   ┌─────────────┐
   │ ◉ LOCAL LLM │
   │ ░▒▓█▓▒░▒▓█▓ │
   │ PROCESSING  │
   │ ▓▓▓▓▓▓▓▓░░░ │
   └─────────────┘`,
    status: "DEV",
  },
  {
    id: "08",
    year: "2025",
    title: "HTIC Shuttle",
    subtitle: "REAL-TIME SYSTEM",
    growth: "Real-Time Systems",
    description: "Campus shuttle tracking system with real-time location updates. Uses Firebase RTDB for event-driven updates with sub-100ms latency.",
    features: ["Live Tracking", "Push Notifications", "Route Planning", "ETA Prediction"],
    before: "Polling-based updates",
    after: "Event-driven RTDB",
    techStack: ["Swift", "Kotlin", "Firebase"],
    achievement: "70% fewer",
    metric: "<100ms",
    metricLabel: "LATENCY",
    icon: "/images/HTIC-icon.svg",
    images: [],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
    ascii: `
   ═══════════════
       🚌
   ──○────────○──
     REAL-TIME
   ═══════════════`,
    status: "DEPLOYED",
  },
  {
    id: "09",
    year: "2025",
    title: "CyberEdu",
    subtitle: "OFFLINE-FIRST",
    growth: "Network Resilience",
    description: "Educational platform with offline-first architecture. Syncs when connected, works fully offline with local SQLite cache and conflict resolution.",
    features: ["Offline Mode", "Sync Engine", "Conflict Resolution", "Progress Track"],
    before: "Online-only sync",
    after: "Offline-first architecture",
    techStack: ["Swift", "Kotlin", "Firebase"],
    achievement: "99%+ uptime",
    metric: "0",
    metricLabel: "DATA LOSS",
    icon: "/images/CyberEdu.png",
    images: ["/images/CyberEdu-1.PNG", "/images/CyberEdu-2.PNG", "/images/CyberEdu-3.PNG"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
    ascii: `
   ╔═══════════════╗
   ║ ● OFFLINE OK  ║
   ║ ░░░▓▓▓▓▓▓░░░░ ║
   ║ SYNC: READY   ║
   ╚═══════════════╝`,
    status: "LIVE",
  },
  {
    id: "10",
    year: "2025",
    title: "Research Lab PM",
    subtitle: "SERVERLESS AI",
    growth: "Serverless Architecture",
    description: "Project management tool for research labs. Features AI-powered task routing using Cloud Functions with dynamic model selection based on complexity.",
    features: ["AI Task Routing", "Dynamic Models", "Team Dashboards", "Paper Tracking"],
    before: "Monolithic backend",
    after: "Dynamic AI routing system",
    techStack: ["Cloud Functions", "Firebase", "GPT-4"],
    achievement: "30+ researchers",
    metric: "<200ms",
    metricLabel: "AI RESPONSE",
    icon: "/images/cs_research.svg",
    images: [],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
    ascii: `
   ┌─── LAB ───┐
   │ ◇ PAPERS  │
   │ ◆ TASKS   │
   │ ◇ GRANTS  │
   │ AI ROUTES │
   └───────────┘`,
    status: "BETA",
  },
  {
    id: "11",
    year: "2025",
    title: "Whiteboard AI",
    subtitle: "VISION ML",
    growth: "Vision ML + Collab",
    description: "Collaborative whiteboard with real-time AI vision processing. Uses PyTorch for object detection and CRDT sync for conflict-free collaboration.",
    features: ["Object Detection", "CRDT Sync", "60fps Render", "Multi-user"],
    before: "Static image processing",
    after: "Real-time vision + CRDT sync",
    techStack: ["PyTorch", "WebSocket", "React"],
    achievement: "150ms inference",
    metric: "60fps",
    metricLabel: "RENDER",
    icon: "/images/whiteboardai.png",
    images: ["/images/whiteboardai-1.jpg", "/images/whiteboardai-2.jpg"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
    ascii: `
   ┌───────────────┐
   │ ○ ───── □    │
   │   ╲     ╱    │
   │    ◆───◇    │
   │  AI VISION   │
   └───────────────┘`,
    status: "DEV",
  },
  {
    id: "12",
    year: "2025",
    title: "Zero Inbox",
    subtitle: "PRODUCTION AI",
    growth: "Production AI Engine",
    description: "Email management with multi-stage AI reasoning. Uses a chain-of-thought pipeline with 95% accuracy for categorization and response drafting.",
    features: ["Multi-stage AI", "Auto Categorize", "Draft Responses", "Priority Scoring"],
    before: "Basic ML models",
    after: "Multi-stage reasoning pipeline",
    techStack: ["Swift", "AI/ML", "Firebase"],
    achievement: "95% accuracy",
    metric: "200ms",
    metricLabel: "INFERENCE",
    icon: "/images/automation.svg",
    images: [],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
    ascii: `
   ═══════════════
   │ INBOX: 0    │
   │ ▓▓▓▓▓▓▓▓▓▓ │
   │ AI: ACTIVE  │
   ═══════════════`,
    status: "ALPHA",
  },
  {
    id: "13",
    year: "2025",
    title: "Zero Inbox",
    subtitle: "PRODUCTION AI",
    growth: "Production AI Engine",
    description: "Email management with multi-stage AI reasoning. Uses a chain-of-thought pipeline with 95% accuracy for categorization and response drafting.",
    features: ["Multi-stage AI", "Auto Categorize", "Draft Responses", "Priority Scoring"],
    before: "Basic ML models",
    after: "Multi-stage reasoning pipeline",
    techStack: ["Swift", "AI/ML", "Firebase"],
    achievement: "95% accuracy",
    metric: "200ms",
    metricLabel: "INFERENCE",
    icon: "/images/automation.svg",
    images: [],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
    ascii: `
   ═══════════════
   │ INBOX: 0    │
   │ ▓▓▓▓▓▓▓▓▓▓ │
   │ AI: ACTIVE  │
   ═══════════════`,
    status: "ALPHA",
  },{
    id: "14",
    year: "2025",
    title: "Zero Inbox",
    subtitle: "PRODUCTION AI",
    growth: "Production AI Engine",
    description: "Email management with multi-stage AI reasoning. Uses a chain-of-thought pipeline with 95% accuracy for categorization and response drafting.",
    features: ["Multi-stage AI", "Auto Categorize", "Draft Responses", "Priority Scoring"],
    before: "Basic ML models",
    after: "Multi-stage reasoning pipeline",
    techStack: ["Swift", "AI/ML", "Firebase"],
    achievement: "95% accuracy",
    metric: "200ms",
    metricLabel: "INFERENCE",
    icon: "/images/automation.svg",
    images: [],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
    ascii: `
   ═══════════════
   │ INBOX: 0    │
   │ ▓▓▓▓▓▓▓▓▓▓ │
   │ AI: ACTIVE  │
   ═══════════════`,
    status: "ALPHA",
  },{
    id: "15",
    year: "2025",
    title: "Zero Inbox",
    subtitle: "PRODUCTION AI",
    growth: "Production AI Engine",
    description: "Email management with multi-stage AI reasoning. Uses a chain-of-thought pipeline with 95% accuracy for categorization and response drafting.",
    features: ["Multi-stage AI", "Auto Categorize", "Draft Responses", "Priority Scoring"],
    before: "Basic ML models",
    after: "Multi-stage reasoning pipeline",
    techStack: ["Swift", "AI/ML", "Firebase"],
    achievement: "95% accuracy",
    metric: "200ms",
    metricLabel: "INFERENCE",
    icon: "/images/automation.svg",
    images: [],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
    ascii: `
   ═══════════════
   │ INBOX: 0    │
   │ ▓▓▓▓▓▓▓▓▓▓ │
   │ AI: ACTIVE  │
   ═══════════════`,
    status: "ALPHA",
  },{
    id: "16",
    year: "2025",
    title: "Zero Inbox",
    subtitle: "PRODUCTION AI",
    growth: "Production AI Engine",
    description: "Email management with multi-stage AI reasoning. Uses a chain-of-thought pipeline with 95% accuracy for categorization and response drafting.",
    features: ["Multi-stage AI", "Auto Categorize", "Draft Responses", "Priority Scoring"],
    before: "Basic ML models",
    after: "Multi-stage reasoning pipeline",
    techStack: ["Swift", "AI/ML", "Firebase"],
    achievement: "95% accuracy",
    metric: "200ms",
    metricLabel: "INFERENCE",
    icon: "/images/automation.svg",
    images: [],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
    ascii: `
   ═══════════════
   │ INBOX: 0    │
   │ ▓▓▓▓▓▓▓▓▓▓ │
   │ AI: ACTIVE  │
   ═══════════════`,
    status: "ALPHA",
  },
]

type Project = (typeof allProjects)[0]
const TOTAL_PROJECTS = allProjects.length

// ASCII characters for animations
const ASCII_CHARS = "░▒▓█▄▀■□●○◆◇╳╱╲─│┌┐└┘├┤┬┴┼"
const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?"

// ─────────────────────────────────────────────────────────────
// ASCII LOADING ANIMATION
// ─────────────────────────────────────────────────────────────

function LoadingOverlay({ isLoading }: { isLoading: boolean }) {
  const [frame, setFrame] = useState(0)
  const loadingFrames = [
    "▓▓▓▓▓▓▓▓░░░░░░░░",
    "░▓▓▓▓▓▓▓▓░░░░░░░",
    "░░▓▓▓▓▓▓▓▓░░░░░░",
    "░░░▓▓▓▓▓▓▓▓░░░░░",
    "░░░░▓▓▓▓▓▓▓▓░░░░",
    "░░░░░▓▓▓▓▓▓▓▓░░░",
    "░░░░░░▓▓▓▓▓▓▓▓░░",
    "░░░░░░░▓▓▓▓▓▓▓▓░",
    "░░░░░░░░▓▓▓▓▓▓▓▓",
    "░░░░░░░░░▓▓▓▓▓▓▓",
  ]

  useEffect(() => {
    if (!isLoading) return
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % loadingFrames.length)
    }, 60)
    return () => clearInterval(interval)
  }, [isLoading, loadingFrames.length])

  if (!isLoading) return null

  return (
    <div className="absolute inset-0 z-50 bg-background/95 flex items-center justify-center">
      <div className="font-mono text-center">
        <div className="text-[10px] text-foreground/60 mb-2">LOADING_PROJECT</div>
        <div className="text-foreground/40 text-xs tracking-widest">
          [{loadingFrames[frame]}]
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ANIMATED SECTION TITLE
// ─────────────────────────────────────────────────────────────

function AnimatedTitle({ projectName, projectId }: { projectName: string; projectId: string }) {
  const nameRef = useRef<HTMLSpanElement>(null)
  const [displayName, setDisplayName] = useState(projectName.toUpperCase())

  useEffect(() => {
    const targetText = projectName.toUpperCase()
    let iteration = 0
    const maxIterations = targetText.length * 3

    const interval = setInterval(() => {
      setDisplayName(
        targetText
          .split("")
          .map((char, i) => {
            if (char === " ") return char
            if (i < iteration / 3) return char
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          })
          .join("")
      )

      iteration++
      if (iteration >= maxIterations) {
        setDisplayName(targetText)
        clearInterval(interval)
      }
    }, 20)

    return () => clearInterval(interval)
  }, [projectName])

  useEffect(() => {
    if (!nameRef.current) return

    gsap.fromTo(
      nameRef.current,
      { opacity: 0, x: -20, skewX: 8 },
      { opacity: 1, x: 0, skewX: 0, duration: 0.4, ease: "power3.out" }
    )
  }, [projectName])

  return (
    <h2 className="font-mono text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-foreground tracking-tighter">
      <span className="text-foreground/30 hidden sm:inline">PRJ://</span>
      <span ref={nameRef} className="relative">
        {displayName}
        <span className="absolute -right-3 top-0 text-foreground/20 animate-pulse">_</span>
      </span>
    </h2>
  )
}

// ─────────────────────────────────────────────────────────────
// TECHNICAL SVG PATTERN
// ─────────────────────────────────────────────────────────────

function TechnicalPattern({ className }: { className?: string }) {
  const patternRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!patternRef.current) return

    gsap.fromTo(
      patternRef.current.querySelectorAll("line"),
      { strokeDashoffset: 100 },
      { strokeDashoffset: 0, duration: 1.5, stagger: 0.1, ease: "power2.out" }
    )
  }, [])

  return (
    <svg
      ref={patternRef}
      className={cn("absolute pointer-events-none", className)}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
    >
      {/* Grid lines */}
      {Array.from({ length: 10 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 20}
          x2="200"
          y2={i * 20}
          className="text-foreground/5"
          strokeDasharray="4 4"
        />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 20}
          y1="0"
          x2={i * 20}
          y2="200"
          className="text-foreground/5"
          strokeDasharray="4 4"
        />
      ))}
      {/* Corner marks */}
      <path d="M0 20 L0 0 L20 0" className="text-foreground/20" strokeWidth="1" />
      <path d="M180 0 L200 0 L200 20" className="text-foreground/20" strokeWidth="1" />
      <path d="M200 180 L200 200 L180 200" className="text-foreground/20" strokeWidth="1" />
      <path d="M20 200 L0 200 L0 180" className="text-foreground/20" strokeWidth="1" />
      {/* Center crosshair */}
      <circle cx="100" cy="100" r="30" className="text-foreground/10" strokeDasharray="8 4" />
      <line x1="100" y1="60" x2="100" y2="80" className="text-foreground/15" />
      <line x1="100" y1="120" x2="100" y2="140" className="text-foreground/15" />
      <line x1="60" y1="100" x2="80" y2="100" className="text-foreground/15" />
      <line x1="120" y1="100" x2="140" y2="100" className="text-foreground/15" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// HORIZONTAL SCROLL IMAGE GALLERY WITH SNAP
// ─────────────────────────────────────────────────────────────

function ImageGallery({ images, title, isActive }: { images: string[]; title: string; isActive?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  // Reset scroll position when project changes
  useEffect(() => {
    setActiveIndex(0)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'instant' })
    }
  }, [title])

  // Entrance animation with water ripple effect
  useEffect(() => {
    if (!isActive || images.length === 0) return

    const items = itemsRef.current.filter(Boolean)
    
    gsap.killTweensOf(items)

    // Water surface entrance - items rise with ripple delay
    items.forEach((item, idx) => {
      if (!item) return
      
      const rippleDelay = 0.1 + idx * 0.08
      
      gsap.fromTo(
        item,
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          delay: rippleDelay, 
          ease: "sine.out" 
        }
      )
    })
  }, [isActive, images.length, title])

  // Handle scroll to detect active image
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return
    
    const container = scrollContainerRef.current
    const scrollLeft = container.scrollLeft
    const containerWidth = container.clientWidth
    const itemWidth = containerWidth * 0.85 + 12 // 85% width + gap
    
    const newIndex = Math.round(scrollLeft / itemWidth)
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < images.length) {
      setActiveIndex(newIndex)
      
      // Trigger ripple animation on visible items
      itemsRef.current.forEach((item, idx) => {
        if (!item) return
        const distance = Math.abs(idx - newIndex)
        const rippleDelay = distance * 0.03
        const waveAmplitude = Math.max(1, 4 - distance * 1.5)
        
        gsap.to(item, {
          keyframes: [
            { y: -waveAmplitude, duration: 0.12, ease: "sine.out" },
            { y: waveAmplitude * 0.3, duration: 0.15, ease: "sine.inOut" },
            { y: 0, duration: 0.2, ease: "sine.out" },
          ],
          delay: rippleDelay,
        })
      })
    }
  }, [activeIndex, images.length])

  // Scroll to specific image
  const scrollToImage = useCallback((idx: number) => {
    if (!scrollContainerRef.current) return
    
    const container = scrollContainerRef.current
    const containerWidth = container.clientWidth
    const itemWidth = containerWidth * 0.85 + 12
    
    container.scrollTo({
      left: idx * itemWidth,
      behavior: 'smooth'
    })
  }, [])

  if (images.length === 0) {
    return (
      <div className="h-full flex items-center justify-center border border-dashed border-foreground/10 bg-foreground/[0.02]">
        <div className="text-center font-mono">
          <div className="text-foreground/20 text-[10px] mb-2">NO_PREVIEW</div>
          <pre className="text-foreground/10 text-[8px] leading-tight">
{`┌─────────────┐
│  ░░░░░░░░░  │
│  ░ IMAGE ░  │
│  ░░░░░░░░░  │
└─────────────┘`}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Horizontal scroll container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={cn(
          "flex-1 flex gap-3 overflow-x-auto scrollbar-hide",
          "snap-x snap-mandatory scroll-smooth",
          "px-[7.5%]" // Center first/last items
        )}
        style={{
          scrollPaddingLeft: '7.5%',
          scrollPaddingRight: '7.5%',
        }}
      >
        {images.map((img, idx) => {
          const isMain = idx === activeIndex
          
          return (
            <div
              key={`${title}-${idx}`}
              ref={el => { itemsRef.current[idx] = el }}
              className={cn(
                "flex-shrink-0 w-[85%] h-full snap-center",
                "relative border bg-background overflow-hidden",
                "transition-all duration-300",
                isMain 
                  ? "border-foreground/30 shadow-[4px_4px_0_0_var(--foreground)]" 
                  : "border-foreground/10 opacity-60"
              )}
            >
              {/* Loading state */}
              {!loadedImages.has(idx) && (
                <div className="absolute inset-0 bg-foreground/5 flex items-center justify-center z-20">
                  <div className="font-mono text-center">
                    <div className="text-[8px] text-foreground/30 animate-pulse mb-1">
                      ░▒▓ LOADING ▓▒░
                    </div>
                    <div className="text-[6px] text-foreground/20">
                      {String(idx + 1).padStart(2, "0")}/{String(images.length).padStart(2, "0")}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Image */}
              <div className="relative w-full h-full">
                <Image
                  src={img}
                  alt={`${title} preview ${idx + 1}`}
                  fill
                  className={cn(
                    "object-cover transition-all duration-500",
                    isMain ? "grayscale-0" : "grayscale-[0.3]",
                    loadedImages.has(idx) ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setLoadedImages(prev => new Set(prev).add(idx))}
                  draggable={false}
                />
              </div>

              {/* Corner ASCII marks */}
              <span className="absolute top-2 left-2 font-mono text-[7px] text-white/60 drop-shadow-lg">┌──</span>
              <span className="absolute top-2 right-2 font-mono text-[7px] text-white/60 drop-shadow-lg">──┐</span>
              <span className="absolute bottom-2 left-2 font-mono text-[7px] text-white/60 drop-shadow-lg">└──</span>
              <span className="absolute bottom-2 right-2 font-mono text-[7px] text-white/60 drop-shadow-lg">──┘</span>

              {/* Overlay info */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3">
                <div className="font-mono text-white/90 text-[9px] md:text-[10px] font-bold">
                  {title}
                </div>
                <div className="font-mono text-white/60 text-[7px] md:text-[8px]">
                  IMG_{String(idx + 1).padStart(2, "0")}.jpg — {images.length} total
                </div>
              </div>

              {/* Scanline effect */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="font-mono text-[7px] text-foreground/30">~</span>
          {images.map((_, idx) => {
            const distance = Math.abs(idx - activeIndex)
            return (
              <button
                key={idx}
                onClick={() => scrollToImage(idx)}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, { 
                    y: -3, 
                    scaleY: 1.5,
                    duration: 0.25, 
                    ease: "sine.out" 
                  })
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { 
                    y: 0, 
                    scaleY: 1,
                    duration: 0.4, 
                    ease: "sine.inOut" 
                  })
                }}
                className={cn(
                  "h-1.5 transition-all duration-500 ease-out origin-bottom",
                  idx === activeIndex 
                    ? "w-8 bg-foreground" 
                    : "w-4 bg-foreground/20 hover:bg-foreground/40"
                )}
                style={{
                  opacity: idx === activeIndex ? 1 : Math.max(0.3, 1 - distance * 0.2),
                }}
                aria-label={`View image ${idx + 1}`}
              />
            )
          })}
          <span className="font-mono text-[7px] text-foreground/30">~</span>
          <span className="font-mono text-[7px] text-foreground/40 ml-2">
            {String(activeIndex + 1).padStart(2, "0")}/{String(images.length).padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT ICON WITH ANIMATION
// ─────────────────────────────────────────────────────────────

function ProjectIcon({ icon, title, isActive }: { icon: string; title: string; isActive: boolean }) {
  const iconRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!iconRef.current || !isActive) return

    gsap.fromTo(
      iconRef.current,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" }
    )
  }, [isActive, title])

  return (
    <div
      ref={iconRef}
      className={cn(
        "relative w-12 h-12 md:w-16 md:h-16 border border-foreground/20",
        "flex items-center justify-center bg-background",
        "transition-all duration-300 cursor-pointer",
        isHovered && "border-foreground/40 shadow-[4px_4px_0_0_var(--foreground)]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={icon}
        alt={title}
        width={40}
        height={40}
        className={cn(
          "object-contain transition-all duration-300",
          isHovered && "scale-110"
        )}
      />
      
      {/* Scanning effect */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-b from-transparent via-foreground/5 to-transparent",
        "transition-transform duration-1000",
        isActive && "animate-pulse"
      )} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, string> = {
    LIVE: "bg-green-500/20 text-green-600 border-green-500/30",
    ACTIVE: "bg-blue-500/20 text-blue-600 border-blue-500/30",
    DEPLOYED: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
    BETA: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
    DEV: "bg-purple-500/20 text-purple-600 border-purple-500/30",
    ALPHA: "bg-orange-500/20 text-orange-600 border-orange-500/30",
  }

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[8px] border",
      statusColors[status] || "bg-foreground/10 text-foreground/60 border-foreground/20"
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {status}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────
// FEATURE TAG WITH HOVER
// ─────────────────────────────────────────────────────────────

function FeatureTag({ feature, index }: { feature: string; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <span
      className={cn(
        "feature-tag inline-flex items-center gap-1 px-2 py-1 font-mono text-[7px] md:text-[8px]",
        "border border-foreground/10 bg-foreground/[0.02]",
        "transition-all duration-200 cursor-default",
        isHovered && "bg-foreground/10 border-foreground/30 -translate-y-0.5"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-foreground/30">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-foreground/70">{feature}</span>
    </span>
  )
}

// ─────────────────────────────────────────────────────────────
// LINK BUTTON WITH ANIMATION
// ─────────────────────────────────────────────────────────────

function LinkButton({ href, icon: Icon, label }: { href: string; icon: typeof Github; label: string }) {
  const [isClicked, setIsClicked] = useState(false)
  const buttonRef = useRef<HTMLAnchorElement>(null)

  const handleClick = () => {
    setIsClicked(true)
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      })
    }
    setTimeout(() => setIsClicked(false), 200)
  }

  return (
    <a
      ref={buttonRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        "group flex items-center gap-2 px-3 py-2 font-mono text-[9px] md:text-[10px]",
        "border border-foreground/20 bg-background",
        "transition-all duration-200",
        "hover:bg-foreground hover:text-background hover:border-foreground",
        "active:scale-95",
        isClicked && "bg-foreground text-background"
      )}
    >
      <Icon className="w-3 h-3 md:w-3.5 md:h-3.5 transition-transform group-hover:scale-110" />
      <span>{label}</span>
      <span className="text-foreground/30 group-hover:text-background/50">→</span>
    </a>
  )
}

// ─────────────────────────────────────────────────────────────
// ASCII ART DISPLAY
// ─────────────────────────────────────────────────────────────

function AsciiArt({ ascii, isActive }: { ascii: string; isActive: boolean }) {
  const artRef = useRef<HTMLPreElement>(null)
  const [displayAscii, setDisplayAscii] = useState("")

  useEffect(() => {
    if (!isActive) {
      setDisplayAscii("")
      return
    }

    const lines = ascii.split("\n")
    let currentLine = 0
    let currentChar = 0

    const interval = setInterval(() => {
      if (currentLine >= lines.length) {
        clearInterval(interval)
        return
      }

      const line = lines[currentLine]
      if (currentChar >= line.length) {
        currentLine++
        currentChar = 0
        setDisplayAscii(prev => prev + "\n")
      } else {
        setDisplayAscii(prev => prev + line[currentChar])
        currentChar++
      }
    }, 8)

    return () => clearInterval(interval)
  }, [ascii, isActive])

  useEffect(() => {
    if (!artRef.current || !isActive) return

    gsap.fromTo(
      artRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    )
  }, [isActive])

  return (
    <pre
      ref={artRef}
      className="font-mono text-[6px] md:text-[7px] text-foreground/30 leading-tight whitespace-pre"
    >
      {displayAscii}
    </pre>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT SLIDE - REDESIGNED
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// MOBILE TOGGLE BUTTON WITH ASCII ANIMATION
// ─────────────────────────────────────────────────────────────

function MobileToggleButton({ 
  showDetails, 
  onToggle 
}: { 
  showDetails: boolean
  onToggle: () => void 
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [displayText, setDisplayText] = useState(showDetails ? "PREVIEW" : "DETAIL")
  const scrambleChars = "░▒▓█╳╱╲─│┼"

  // ASCII scramble animation on toggle
  useEffect(() => {
    const targetText = showDetails ? "PREVIEW" : "DETAIL"
    let iteration = 0
    const maxIterations = targetText.length * 2

    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split("")
          .map((char, i) => {
            if (char === " ") return char
            if (i < iteration / 2) return char
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
          })
          .join("")
      )

      iteration++
      if (iteration >= maxIterations) {
        setDisplayText(targetText)
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [showDetails])

  const handleClick = () => {
    // Ripple animation
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        keyframes: [
          { y: -2, duration: 0.1, ease: "sine.out" },
          { y: 1, duration: 0.15, ease: "sine.inOut" },
          { y: 0, duration: 0.2, ease: "sine.out" },
        ],
      })
    }
    onToggle()
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={cn(
        "md:hidden w-full py-3 mt-3",
        "font-mono text-[10px] text-foreground/70",
        "border border-foreground/30 bg-foreground/[0.03]",
        "transition-all duration-200",
        "hover:bg-foreground/10 hover:text-foreground hover:border-foreground/50",
        "active:bg-foreground/15"
      )}
    >
      <div className="flex items-center justify-center gap-3">
        <span className="text-foreground/40 text-[8px]">{showDetails ? "◄◄" : "►►"}</span>
        <span className="tracking-wider">{displayText}</span>
        <span className="text-foreground/40 text-[8px]">{showDetails ? "◄◄" : "►►"}</span>
      </div>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT SLIDE
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
  const [isLoading, setIsLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const prevActiveRef = useRef(isActive)
  const contentRef = useRef<HTMLDivElement>(null)

  // Reset to default view when project changes
  useEffect(() => {
    if (isActive && !prevActiveRef.current) {
      setShowDetails(false)
      setIsLoading(true)
      const timer = setTimeout(() => setIsLoading(false), 300)
      return () => clearTimeout(timer)
    }
    prevActiveRef.current = isActive
  }, [isActive])

  // Animate content transition
  useEffect(() => {
    if (!contentRef.current) return

    const elements = contentRef.current.querySelectorAll('.mobile-content')
    
    gsap.fromTo(
      elements,
      { opacity: 0, y: 10 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.4, 
        stagger: 0.05, 
        ease: "sine.out" 
      }
    )
  }, [showDetails])

  // GSAP entrance animations
  useEffect(() => {
    if (!isActive || !slideRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".slide-animate",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      )

      gsap.fromTo(
        ".tech-tag",
        { opacity: 0, scale: 0.8, rotation: -5 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.3, stagger: 0.05, delay: 0.3, ease: "back.out(1.5)" }
      )

      gsap.fromTo(
        ".feature-tag",
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.03, delay: 0.4, ease: "power2.out" }
      )

      gsap.fromTo(
        ".border-flash",
        { borderColor: "rgba(var(--foreground), 0.1)" },
        { borderColor: "rgba(var(--foreground), 0.4)", duration: 0.15, yoyo: true, repeat: 2 }
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
      <LoadingOverlay isLoading={isLoading} />
      
      <div className="h-full border border-foreground/20 border-flash bg-background relative overflow-hidden">
        <TechnicalPattern className="w-full h-full opacity-30" />

        <div className="h-full flex flex-col p-4 md:p-6 relative z-10 overflow-y-auto">
          {/* Header Row */}
          <div className="slide-animate flex items-start justify-between gap-4 mb-3 md:mb-4">
            <div className="flex items-center gap-3 md:gap-4">
              <ProjectIcon icon={project.icon} title={project.title} isActive={isActive} />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[8px] text-foreground/40">{project.year}</span>
                  <StatusBadge status={project.status} />
                </div>
                <h3 className="font-mono text-sm md:text-base font-bold text-foreground">
                  {project.title}
                </h3>
                <div className="font-mono text-[8px] md:text-[9px] text-foreground/50">
                  {project.subtitle}
                </div>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="font-mono text-xl md:text-2xl lg:text-3xl font-black text-foreground">
                {project.metric}
              </div>
              <div className="font-mono text-[7px] md:text-[8px] text-foreground/50 tracking-wider">
                {project.metricLabel}
              </div>
            </div>
          </div>

          {/* Mobile Content - Toggle between views */}
          <div ref={contentRef} className="flex-1 min-h-0 md:hidden">
            {!showDetails ? (
              /* Default View (Preview): Image, Tech Stack */
              <div className="flex flex-col gap-3 h-full">
                {/* Image Gallery - Taller on mobile */}
                <div className="mobile-content flex-1 min-h-[200px]">
                  <div className="font-mono text-[7px] text-foreground/30 mb-2">
                    ├── PREVIEW
                  </div>
                  <div className="h-[calc(100%-20px)]">
                    <ImageGallery images={project.images} title={project.title} isActive={isActive} />
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="mobile-content">
                  <div className="font-mono text-[7px] text-foreground/30 mb-2">
                    └── TECH_STACK
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="tech-tag font-mono text-[8px] px-2 py-1 border border-foreground/20 text-foreground/60 bg-foreground/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Detail View: Description, Features, Growth, ASCII */
              <div className="flex flex-col gap-3 h-full">
                {/* Description */}
                <div className="mobile-content">
                  <div className="font-mono text-[7px] text-foreground/30 mb-1">
                    ├── DESCRIPTION
                  </div>
                  <p className="font-mono text-[9px] text-foreground/70 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Features */}
                <div className="mobile-content">
                  <div className="font-mono text-[7px] text-foreground/30 mb-2">
                    ├── FEATURES
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.features.map((feature, idx) => (
                      <FeatureTag key={feature} feature={feature} index={idx} />
                    ))}
                  </div>
                </div>

                {/* Growth Journey */}
                <div className="mobile-content border border-foreground/10 bg-foreground/[0.02] p-3">
                  <div className="font-mono text-[7px] text-foreground/30 mb-2">
                    ├── GROWTH_JOURNEY
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="font-mono text-[6px] text-foreground/30 mb-0.5">BEFORE</div>
                      <div className="font-mono text-[8px] text-foreground/50">
                        {project.before}
                      </div>
                    </div>
                    <div className="font-mono text-foreground/20 text-[10px]">──►</div>
                    <div className="flex-1">
                      <div className="font-mono text-[6px] text-foreground mb-0.5">AFTER</div>
                      <div className="font-mono text-[8px] text-foreground font-medium">
                        {project.after}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ASCII Art - Detail view */}
                <div className="mobile-content border border-foreground/10 bg-foreground/[0.02] p-2">
                  <div className="font-mono text-[7px] text-foreground/30 mb-1">
                    └── ASCII_ART
                  </div>
                  <AsciiArt ascii={project.ascii} isActive={isActive && showDetails} />
                </div>
              </div>
            )}

            {/* Mobile Toggle Button */}
            <MobileToggleButton 
              showDetails={showDetails} 
              onToggle={() => setShowDetails(!showDetails)} 
            />
          </div>

          {/* Desktop Layout - Shows everything */}
          <div className="hidden md:grid flex-1 grid-cols-2 gap-4 min-h-0">
            {/* Left Column - Info */}
            <div className="flex flex-col gap-3 min-h-0">
              <div className="slide-animate">
                <div className="font-mono text-[7px] text-foreground/30 mb-1">
                  ├── DESCRIPTION
                </div>
                <p className="font-mono text-[10px] text-foreground/70 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="slide-animate">
                <div className="font-mono text-[7px] text-foreground/30 mb-2">
                  ├── FEATURES
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.features.map((feature, idx) => (
                    <FeatureTag key={feature} feature={feature} index={idx} />
                  ))}
                </div>
              </div>

              <div className="slide-animate">
                <div className="font-mono text-[7px] text-foreground/30 mb-2">
                  ├── TECH_STACK
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="tech-tag font-mono text-[9px] px-2 py-1 border border-foreground/20 text-foreground/60 bg-foreground/5 hover:bg-foreground/10 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="slide-animate border border-foreground/10 bg-foreground/[0.02] p-3">
                <div className="font-mono text-[7px] text-foreground/30 mb-2">
                  └── GROWTH_JOURNEY
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="font-mono text-[6px] text-foreground/30 mb-0.5">BEFORE</div>
                    <div className="font-mono text-[9px] text-foreground/50">
                      {project.before}
                    </div>
                  </div>
                  <div className="font-mono text-foreground/20 text-[10px]">──►</div>
                  <div className="flex-1">
                    <div className="font-mono text-[6px] text-foreground mb-0.5">AFTER</div>
                    <div className="font-mono text-[9px] text-foreground font-medium">
                      {project.after}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Images & ASCII */}
            <div className="flex flex-col gap-3 min-h-0">
              <div className="slide-animate flex-1 min-h-[160px]">
                <div className="font-mono text-[7px] text-foreground/30 mb-2">
                  ├── PREVIEW
                </div>
                <div className="h-[calc(100%-20px)]">
                  <ImageGallery images={project.images} title={project.title} isActive={isActive} />
                </div>
              </div>

              <div className="slide-animate border border-foreground/10 bg-foreground/[0.02] p-3">
                <div className="font-mono text-[7px] text-foreground/30 mb-2">
                  └── ASCII_ART
                </div>
                <AsciiArt ascii={project.ascii} isActive={isActive} />
              </div>
            </div>
          </div>

          {/* Footer - Links shown in both states */}
          <div className="slide-animate flex items-center justify-between pt-3 mt-3 border-t border-foreground/10">
            <div className="flex items-center gap-2">
              {hasGithub && (
                <LinkButton href={project.links.github} icon={Github} label="CODE" />
              )}
              {hasDemo && (
                <LinkButton href={(project.links as { demo?: string }).demo!} icon={ExternalLink} label="DEMO" />
              )}
              {hasAppStore && (
                <span className="font-mono text-[8px] text-foreground/30 px-2 py-1 border border-foreground/10">
                  ◉ APP_STORE
                </span>
              )}
            </div>
            <div className="font-mono text-[8px] text-foreground/30 hidden sm:block">
              [{String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}] {project.growth}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TIMELINE
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
    <div className="hidden lg:flex flex-col w-[160px] flex-shrink-0">
      <div className="font-mono text-[8px] text-foreground/30 mb-3">
        ┌── PROJECT_INDEX
      </div>
      
      <div className="relative pl-4 border-l border-foreground/10 flex-1 space-y-0.5">
        {projects.map((project, index) => {
          const isActive = index === activeIndex
          const isPast = index < activeIndex
          const showYear = index === 0 || projects[index - 1]?.year !== project.year

          return (
            <div key={project.id}>
              {showYear && (
                <div className="font-mono text-[8px] text-foreground/50 mb-1 mt-3 first:mt-0 -ml-4 pl-4 border-l-2 border-foreground/30">
                  ═══ {project.year} ═══
                </div>
              )}

              <button
                onClick={() => handleClick(index)}
                className={cn(
                  "w-full text-left py-1 font-mono text-[8px] transition-all relative cursor-pointer",
                  "-ml-4 pl-4 hover:pl-5 group",
                  isActive ? "text-foreground border-l-2 border-foreground font-bold bg-foreground/5" : 
                  isPast ? "text-foreground/50 border-l border-foreground/30 hover:bg-foreground/[0.02]" : 
                  "text-foreground/20 border-l border-transparent hover:text-foreground/40 hover:border-foreground/20"
                )}
              >
                <span className="flex items-center gap-2">
                  <span className={cn(
                    "w-1.5 h-1.5 transition-all",
                    isActive ? "bg-foreground" : isPast ? "bg-foreground/30" : "bg-foreground/10"
                  )} />
                  <span className="truncate">{project.title}</span>
                </span>
              </button>
            </div>
          )
        })}
      </div>
      
      <div className="font-mono text-[8px] text-foreground/30 mt-3">
        └── CURRENT
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────────

function ProgressBar({ activeIndex, total }: { activeIndex: number; total: number }) {
  const progressChars = 20
  const filled = Math.round((activeIndex / (total - 1)) * progressChars) || 0
  const progressBar = "▓".repeat(filled) + "░".repeat(progressChars - filled)

  return (
    <div className="flex items-center justify-between py-3 font-mono border-t border-foreground/10">
      <div className="text-[8px] text-foreground/40">
        YEAR: 2022
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[8px] text-foreground/30 hidden sm:inline">
          PROGRESS:
        </span>
        <span className="text-[8px] md:text-[9px] text-foreground/40 tracking-tighter">
          [{progressBar}]
        </span>
        <span className="text-[10px] text-foreground/60 font-bold">
          {String(activeIndex + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
      </div>
      <div className="text-[8px] text-foreground font-bold">
        YEAR: NOW
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MOBILE NAV
// ─────────────────────────────────────────────────────────────

function MobileNav({ 
  activeIndex, 
  total,
  projects,
  scrollTriggerRef 
}: { 
  activeIndex: number
  total: number
  projects: Project[]
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
    <div className="lg:hidden mb-3">
      <div className="flex gap-1 overflow-x-auto scrollbar-hide py-1">
        {projects.map((project, i) => (
          <button
            key={project.id}
            onClick={() => handleClick(i)}
            className={cn(
              "flex-shrink-0 px-2 py-1.5 font-mono text-[7px] border transition-all touch-manipulation",
              i === activeIndex 
                ? "bg-foreground text-background border-foreground" 
                : i < activeIndex 
                  ? "bg-foreground/10 text-foreground/60 border-foreground/20" 
                  : "bg-transparent text-foreground/30 border-foreground/10 hover:border-foreground/20"
            )}
          >
            {project.id}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const pinContainerRef = useRef<HTMLDivElement>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const isMobile = useIsMobile()

  const currentProject = allProjects[activeIndex]
  const config = isMobile ? SCROLL_CONFIG.mobile : SCROLL_CONFIG.desktop

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
        className="min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-safe"
      >
        {/* Grid background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 39px, currentColor 39px, currentColor 40px),
              repeating-linear-gradient(90deg, transparent, transparent 39px, currentColor 39px, currentColor 40px)
            `
          }} />
        </div>

        {/* Main content */}
        <div className="w-full max-w-6xl mx-auto relative">
          {/* Section header */}
          <div className="mb-4">
            <div className="font-mono text-[7px] md:text-[9px] text-foreground/20 mb-2 flex items-center">
              <span>╔</span>
              <span className="flex-1 overflow-hidden">{"═".repeat(150)}</span>
              <span>╗</span>
            </div>
            
            <div className="flex items-end justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[7px] md:text-[9px] text-foreground/40 tracking-[0.15em]">
                    SECTION://PROJECTS
                  </span>
                  <span className="font-mono text-[6px] text-foreground/20">
                    v2.0
                  </span>
                </div>
                <AnimatedTitle 
                  projectName={currentProject.title} 
                  projectId={currentProject.id}
                />
              </div>
              
              <div className="text-right font-mono flex-shrink-0">
                <div className="text-3xl md:text-5xl font-black text-foreground/10 leading-none">
                  {String(activeIndex + 1).padStart(2, "0")}
                </div>
                <div className="text-[7px] md:text-[8px] text-foreground/40">
                  /{String(TOTAL_PROJECTS).padStart(2, "0")} PROJECTS
                </div>
              </div>
            </div>
          </div>

          {/* Mobile nav */}
          <MobileNav 
            activeIndex={activeIndex}
            total={TOTAL_PROJECTS}
            projects={allProjects}
            scrollTriggerRef={scrollTriggerRef}
          />

          {/* Main layout */}
          <div className="flex gap-4 lg:gap-6">
            {/* Timeline */}
            <Timeline 
              activeIndex={activeIndex}
              projects={allProjects}
              scrollTriggerRef={scrollTriggerRef}
            />

            {/* Project slides */}
            <div className="flex-1 flex flex-col min-w-0">
              <div 
                className="relative transition-[height] duration-300"
                style={{ height: `${config.slideHeight}px` }}
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

              <ProgressBar activeIndex={activeIndex} total={TOTAL_PROJECTS} />
            </div>
          </div>

          {/* Footer */}
          <div className="font-mono text-[7px] md:text-[9px] text-foreground/20 mt-3 flex items-center">
            <span>╚</span>
            <span className="flex-1 overflow-hidden">{"═".repeat(150)}</span>
            <span>╝</span>
          </div>

          {/* Scroll hint */}
          <div className="text-center mt-3">
            <span className="font-mono text-[7px] md:text-[8px] text-foreground/20 animate-pulse inline-flex items-center gap-2">
              <span>▼</span>
              <span>{isMobile ? "SCROLL" : "SCROLL TO NAVIGATE PROJECTS"}</span>
              <span>▼</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
