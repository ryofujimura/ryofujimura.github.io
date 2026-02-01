"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Github } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// PROJECT DATA - GROWTH FOCUSED
// ─────────────────────────────────────────────────────────────

const allProjects = [
  // 2025 - Most Recent
  {
    id: "01",
    year: "2025",
    title: "Zero Inbox",
    images: ["/images/profile.jpg","/images/profile.jpg", "/images/profile.jpg"],
    growth: "Production AI Engine",
    learned: ["Multi-stage AI", "95% accuracy tuning", "High-throughput systems"],
    techStack: ["Swift", "AI/ML", "Firebase"],
    achievement: "95% accuracy, 200ms",
    description: "Multi-stage reasoning with production-grade performance.",
    skills: ["Swift", "SwiftUI", "Firebase", "AI/ML", "Google APIs"],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
  },
  {
    id: "02",
    year: "2025",
    title: "Whiteboard AI",
    images: ["/images/whiteboardai.png", "/images/whiteboardai-1.jpg", "/images/whiteboardai-2.jpg"],
    growth: "Vision ML + Collab",
    learned: ["PyTorch vision", "CRDT patterns", "WebSocket pipelines"],
    techStack: ["PyTorch", "WebSocket", "React"],
    achievement: "150ms inference",
    description: "Computer vision with real-time collaboration.",
    skills: ["PyTorch", "Vision", "WebSocket", "React"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "03",
    year: "2025",
    title: "Research Lab PM",
    images: ["/images/profile.jpg"],
    growth: "Serverless + AI Routing",
    learned: ["Cloud Functions", "Dynamic AI routing", "Multi-tenant systems"],
    techStack: ["Cloud Functions", "Firebase"],
    achievement: "<200ms response",
    description: "Serverless orchestration for 30+ researchers.",
    skills: ["Cloud Functions", "Firebase", "AI routing", "Node.js"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "04",
    year: "2025",
    title: "CyberEdu",
    images: ["/images/CyberEdu.png", "/images/CyberEdu-1.PNG", "/images/CyberEdu-2.PNG", "/images/CyberEdu-3.PNG", "/images/CyberEdu-4.PNG", "/images/CyberEdu-5.jpg"],
    growth: "Network Resilience",
    learned: ["Offline-first patterns", "Sync strategies", "Error recovery"],
    techStack: ["Swift", "Kotlin", "Firebase"],
    achievement: "99%+ sync reliability",
    description: "Cross-device sync across unstable networks.",
    skills: ["Swift", "Kotlin", "Firebase", "Real-time"],
    links: { github: "https://github.com/ryofujimura", appStore: "#", playStore: "#" },
  },
  {
    id: "05",
    year: "2025",
    title: "HTIC Shuttle",
    images: ["/images/schedule.jpg"],
    growth: "Real-Time Systems",
    learned: ["Firebase RTDB", "Event serialization", "Cross-platform native"],
    techStack: ["Swift", "Kotlin", "Firebase"],
    achievement: "70% fewer conflicts",
    description: "Cross-platform native with real-time sync.",
    skills: ["Swift", "Kotlin", "Firebase RTDB", "Real-time"],
    links: { github: "https://github.com/ryofujimura", appStore: "#", playStore: "#" },
  },
  // 2024
  {
    id: "06",
    year: "2024",
    title: "With (Local LLM)",
    images: ["/images/profile.jpg"],
    growth: "On-Device AI",
    learned: ["llama.cpp integration", "Model quantization", "Memory optimization"],
    techStack: ["Swift", "llama.cpp", "GGUF"],
    achievement: "<50ms/token, 2GB saved",
    description: "Local AI with efficient inference.",
    skills: ["Swift", "llama.cpp", "GGUF", "SwiftUI"],
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "07",
    year: "2024",
    title: "Saboriendo Platform",
    images: ["/images/profile.jpg"],
    growth: "Full-Stack + Mobile",
    learned: ["React 19 features", "Cross-platform sync", "Barcode systems"],
    techStack: ["React 19", "SwiftUI", "Firebase"],
    achievement: "50% faster lookup",
    description: "Full-stack with real-time sync.",
    skills: ["React 19", "SwiftUI", "Firebase", "Firestore", "AVFoundation"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "08",
    year: "2024",
    title: "Portfolio Website",
    images: ["/images/homepage.png", "/images/experiencepage.png"],
    growth: "Modern Web Stack",
    learned: ["Next.js App Router", "GSAP animations", "Performance tuning"],
    techStack: ["React", "Next.js", "GSAP"],
    achievement: "40-60% faster load",
    description: "React with advanced animations.",
    skills: ["React", "Next.js", "Tailwind", "Vercel"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "09",
    year: "2024",
    title: "Matcha Time",
    images: ["/images/matchatime_1.jpg", "/images/matchatime_2.jpg", "/images/matchatime_3.jpg"],
    growth: "App Store Launch",
    learned: ["SwiftUI patterns", "App Store submission", "4-week sprint"],
    techStack: ["Swift", "SwiftUI"],
    achievement: "50 users at launch",
    description: "First iOS app on App Store.",
    skills: ["Swift", "SwiftUI", "App Store"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
  // 2023
  {
    id: "10",
    year: "2023",
    title: "Schedule Mastermind",
    images: ["/images/schedule.jpg"],
    growth: "Backend Architecture",
    learned: ["Flask routing", "Conflict algorithms", "Database design"],
    techStack: ["Python", "Flask"],
    achievement: "500+ courses, 70% fewer errors",
    description: "Backend for university scheduling.",
    skills: ["Python", "Flask", "scheduling"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "11",
    year: "2023",
    title: "Shohei Home Ground",
    images: ["/images/shoheihomeground_1.jpg", "/images/shoheihomeground_2.jpg", "/images/shoheihomeground_3.jpg"],
    growth: "Python Automation",
    learned: ["API automation", "Content scheduling", "Growth hacking"],
    techStack: ["Python", "Instagram API"],
    achievement: "11K followers, 685 posts",
    description: "Automated content pipeline.",
    skills: ["Python", "automation", "Instagram"],
    links: { instagram: "#", youtube: "#" },
  },
  // 2022 - Oldest
  {
    id: "12",
    year: "2022",
    title: "Poker Percentage",
    images: ["/images/poker.png", "/images/poker_1.jpg", "/images/poker_2.jpg", "/images/poker_3.jpg", "/images/poker_4.jpg"],
    growth: "First WatchOS App",
    learned: ["WatchKit basics", "Precomputed tables", "Real-time probability"],
    techStack: ["Swift", "WatchOS"],
    achievement: "<10ms lookup speed",
    description: "WatchOS with precomputed probability tables.",
    skills: ["Swift", "WatchOS", "probability"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
]

type Project = (typeof allProjects)[0]

// Group projects by year for timeline
const projectsByYear = allProjects.reduce((acc, project) => {
  if (!acc[project.year]) acc[project.year] = []
  acc[project.year].push(project)
  return acc
}, {} as Record<string, Project[]>)

const years = Object.keys(projectsByYear).sort((a, b) => Number(b) - Number(a))

// ─────────────────────────────────────────────────────────────
// TECHNICAL PATTERNS - SVG BACKGROUNDS
// ─────────────────────────────────────────────────────────────

function TechnicalPatterns() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Diagonal grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" preserveAspectRatio="none">
        <defs>
          <pattern id="diagonal-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 60" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <path d="M 0 0 L 60 60" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonal-grid)" />
      </svg>

      {/* Technical measurement marks - top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-foreground/10" />
      <div className="absolute top-0 left-0 right-0 flex justify-between px-8">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-px h-2 bg-foreground/20" />
        ))}
      </div>

      {/* Corner technical brackets */}
      <svg className="absolute top-4 left-4 w-8 h-8 text-foreground/20">
        <path d="M 0 8 L 0 0 L 8 0" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
      <svg className="absolute top-4 right-4 w-8 h-8 text-foreground/20">
        <path d="M 24 0 L 32 0 L 32 8" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
      <svg className="absolute bottom-4 left-4 w-8 h-8 text-foreground/20">
        <path d="M 0 24 L 0 32 L 8 32" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
      <svg className="absolute bottom-4 right-4 w-8 h-8 text-foreground/20">
        <path d="M 24 32 L 32 32 L 32 24" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// CORNER BRACKETS - ANIMATED TECHNICAL DETAIL
// ─────────────────────────────────────────────────────────────

function CornerBrackets({ isActive }: { isActive: boolean }) {
  const bracketsRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!bracketsRef.current) return
    const paths = bracketsRef.current.querySelectorAll("path")
    
    gsap.to(paths, {
      strokeDashoffset: isActive ? 0 : 20,
      opacity: isActive ? 1 : 0.3,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.1
    })
  }, [isActive])

  return (
    <svg 
      ref={bracketsRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
    >
      {/* Top-left */}
      <path 
        d="M 0 40 L 0 0 L 40 0" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"
        strokeDasharray="20"
        strokeDashoffset="20"
        className="text-foreground"
      />
      {/* Top-right */}
      <path 
        d="M calc(100% - 40) 0 L 100% 0 L 100% 40" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"
        strokeDasharray="20"
        strokeDashoffset="20"
        className="text-foreground"
        style={{ transform: "translateX(-2px)" }}
      />
      {/* Bottom-left */}
      <path 
        d="M 0 calc(100% - 40) L 0 100% L 40 100%" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"
        strokeDasharray="20"
        strokeDashoffset="20"
        className="text-foreground"
        style={{ transform: "translateY(-2px)" }}
      />
      {/* Bottom-right */}
      <path 
        d="M calc(100% - 40) 100% L 100% 100% L 100% calc(100% - 40)" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"
        strokeDasharray="20"
        strokeDashoffset="20"
        className="text-foreground"
        style={{ transform: "translate(-2px, -2px)" }}
      />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// TIMELINE SIDEBAR - FIXED LEFT NAVIGATION
// ─────────────────────────────────────────────────────────────

function TimelineSidebar({ 
  activeIndex, 
  projects,
  onNodeClick 
}: { 
  activeIndex: number
  projects: Project[]
  onNodeClick: (index: number) => void
}) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const connectorRef = useRef<HTMLDivElement>(null)
  const nodesRef = useRef<(HTMLButtonElement | null)[]>([])

  // Animate connector line progress
  useEffect(() => {
    if (!connectorRef.current) return
    const progress = projects.length > 1 ? (activeIndex / (projects.length - 1)) * 100 : 0
    
    gsap.to(connectorRef.current, {
      height: `${progress}%`,
      duration: 0.6,
      ease: "power2.out"
    })
  }, [activeIndex, projects.length])

  // Animate active node
  useEffect(() => {
    nodesRef.current.forEach((node, i) => {
      if (!node) return
      const isActive = i === activeIndex
      const isPast = i < activeIndex
      
      gsap.to(node, {
        scale: isActive ? 1.2 : 1,
        duration: 0.3,
        ease: "power2.out"
      })

      // Update node styling
      const dot = node.querySelector(".node-dot")
      if (dot) {
        gsap.to(dot, {
          backgroundColor: isActive ? "var(--accent)" : isPast ? "var(--foreground)" : "transparent",
          borderColor: isActive || isPast ? "var(--foreground)" : "var(--foreground)",
          duration: 0.3
        })
      }
    })
  }, [activeIndex])

  return (
    <div 
      ref={timelineRef}
      className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-[280px] bg-background border-r border-foreground/10 z-40"
    >
      {/* Header */}
      <div className="p-6 border-b border-foreground/10">
        <p className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] mb-1">SECTION 04</p>
        <h2 className="font-mono text-xl font-black tracking-tight">PROJECTS</h2>
        <div className="flex items-center gap-2 mt-2 font-mono text-[10px] text-muted-foreground">
          <span className="text-foreground font-bold">{String(activeIndex + 1).padStart(2, "0")}</span>
          <span>/</span>
          <span>{String(projects.length).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-6 relative">
        {/* Vertical line track */}
        <div className="absolute left-10 top-6 bottom-6 w-px bg-foreground/10" />
        
        {/* Animated progress line */}
        <div 
          ref={connectorRef}
          className="absolute left-10 top-6 w-px bg-foreground"
          style={{ height: "0%" }}
        />

        {/* Timeline nodes */}
        <div className="space-y-1 relative">
          {projects.map((project, index) => {
            const isActive = index === activeIndex
            const isPast = index < activeIndex
            const showYear = index === 0 || projects[index - 1]?.year !== project.year

            return (
              <div key={project.id}>
                {/* Year marker */}
                {showYear && (
                  <div className="flex items-center gap-3 mb-3 mt-4 first:mt-0">
                    <div className="w-8 h-px bg-foreground/30" />
                    <span className="font-mono text-xs font-bold text-foreground/60 tracking-wider">
                      {project.year}
                    </span>
                  </div>
                )}

                {/* Project node */}
                <button
                  ref={el => { nodesRef.current[index] = el }}
                  onClick={() => onNodeClick(index)}
                  className={cn(
                    "w-full flex items-start gap-3 py-2 pl-2 text-left transition-all group",
                    isActive && "translate-x-1"
                  )}
                >
                  {/* Node dot */}
                  <div 
                    className={cn(
                      "node-dot w-3 h-3 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all",
                      isActive ? "bg-accent border-foreground" : 
                      isPast ? "bg-foreground border-foreground" : 
                      "bg-transparent border-foreground/40"
                    )}
                  />
                  
                  {/* Node content */}
                  <div className="flex-1 min-w-0">
                    <span 
                      className={cn(
                        "font-mono text-[11px] block truncate transition-colors",
                        isActive ? "text-foreground font-bold" : 
                        isPast ? "text-foreground/70" : 
                        "text-foreground/40"
                      )}
                    >
                      {project.growth}
                    </span>
                    <span 
                      className={cn(
                        "font-mono text-[9px] block truncate transition-colors",
                        isActive ? "text-muted-foreground" : "text-muted-foreground/50"
                      )}
                    >
                      {project.title}
                    </span>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="w-1 h-full bg-accent absolute right-0 top-0" />
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Technical footer */}
      <div className="p-4 border-t border-foreground/10">
        <div className="flex justify-between font-mono text-[8px] text-muted-foreground/50">
          <span>SCROLL TO NAVIGATE</span>
          <span>2022—2025</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MOBILE TIMELINE - HORIZONTAL TOP BAR
// ─────────────────────────────────────────────────────────────

function MobileTimeline({ 
  activeIndex, 
  projects,
  onNodeClick 
}: { 
  activeIndex: number
  projects: Project[]
  onNodeClick: (index: number) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to active node
  useEffect(() => {
    if (!scrollRef.current) return
    const activeNode = scrollRef.current.children[activeIndex] as HTMLElement
    if (activeNode) {
      activeNode.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }
  }, [activeIndex])

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-foreground/10">
      {/* Progress bar */}
      <div className="h-0.5 bg-foreground/10">
        <div 
          className="h-full bg-foreground transition-all duration-300"
          style={{ width: `${((activeIndex + 1) / projects.length) * 100}%` }}
        />
      </div>

      {/* Scrollable nodes */}
      <div 
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto scrollbar-hide px-4 py-3"
      >
        {projects.map((project, index) => {
          const isActive = index === activeIndex
          const isPast = index < activeIndex

          return (
            <button
              key={project.id}
              onClick={() => onNodeClick(index)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 font-mono text-[10px] transition-all border",
                isActive 
                  ? "bg-foreground text-background border-foreground" 
                  : isPast 
                    ? "bg-transparent text-foreground border-foreground/30" 
                    : "bg-transparent text-foreground/40 border-foreground/10"
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          )
        })}
      </div>

      {/* Current project indicator */}
      <div className="px-4 pb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] text-foreground font-bold truncate">
          {projects[activeIndex]?.growth}
        </span>
        <span className="font-mono text-[9px] text-muted-foreground">
          {projects[activeIndex]?.year}
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// IMAGE GALLERY - ENHANCED FOR FULL VIEWPORT
// ─────────────────────────────────────────────────────────────

function ImageGallery({ 
  images, 
  projectTitle,
  isActive 
}: { 
  images: string[]
  projectTitle: string
  isActive: boolean 
}) {
  const [activeImage, setActiveImage] = useState(0)
  const galleryRef = useRef<HTMLDivElement>(null)

  // Auto-cycle images when active
  useEffect(() => {
    if (!isActive || images.length <= 1) return
    
    const interval = setInterval(() => {
      setActiveImage(prev => (prev + 1) % images.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isActive, images.length])

  return (
    <div ref={galleryRef} className="relative w-full h-full group">
      {/* Main image */}
      <div className="relative w-full h-full overflow-hidden">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${projectTitle} - ${idx + 1}`}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-all duration-700",
              idx === activeImage 
                ? "opacity-100 scale-100 grayscale-0" 
                : "opacity-0 scale-105 grayscale"
            )}
            loading={idx === 0 ? "eager" : "lazy"}
          />
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent opacity-40" />
      </div>

      {/* Image indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-4 flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={cn(
                "w-8 h-1 transition-all",
                idx === activeImage ? "bg-foreground" : "bg-foreground/30"
              )}
            />
          ))}
        </div>
      )}

      {/* Technical overlay */}
      <div className="absolute top-4 right-4 font-mono text-[10px] text-foreground/60">
        <span className="bg-background/80 px-2 py-1">
          IMG_{String(activeImage + 1).padStart(2, "0")}/{String(images.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT SNAP SECTION - FULL VIEWPORT DISPLAY
// ─────────────────────────────────────────────────────────────

function ProjectSnapSection({ 
  project, 
  index, 
  isActive,
  totalProjects 
}: { 
  project: Project
  index: number
  isActive: boolean
  totalProjects: number
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  // Text scramble animation for title
  useEffect(() => {
    if (!isActive || hasAnimated || !titleRef.current) return
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ░▒▓█"
    const originalText = project.growth.toUpperCase()
    let iteration = 0

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

      if (iteration >= originalText.length) {
        clearInterval(interval)
        setHasAnimated(true)
      }
      iteration += 0.5
    }, 30)

    return () => clearInterval(interval)
  }, [isActive, hasAnimated, project.growth])

  // Content fade-in animation
  useEffect(() => {
    if (!isActive || !contentRef.current) return

    const elements = contentRef.current.querySelectorAll(".animate-in")
    
    gsap.fromTo(elements, 
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.3
      }
    )
  }, [isActive])

  // Reset animation state when becoming inactive
  useEffect(() => {
    if (!isActive) {
      setHasAnimated(false)
    }
  }, [isActive])

  const hasGithub = project.links.github
  const hasDemo = "demo" in project.links
  const hasAppStore = "appStore" in project.links

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative min-h-screen w-full flex snap-start snap-always",
        "lg:pl-[280px]" // Offset for timeline sidebar on desktop
      )}
    >
      {/* Background technical patterns */}
      <TechnicalPatterns />

      {/* Corner brackets */}
      <div className="absolute inset-8 pointer-events-none hidden lg:block">
        <CornerBrackets isActive={isActive} />
      </div>

      {/* Main content grid */}
      <div className="w-full h-screen flex flex-col lg:flex-row">
        {/* Image section - larger on desktop */}
        <div className="relative h-[40vh] lg:h-full lg:w-1/2 flex-shrink-0">
          <ImageGallery 
            images={project.images} 
            projectTitle={project.title}
            isActive={isActive}
          />
        </div>

        {/* Content section */}
        <div 
          ref={contentRef}
          className="flex-1 flex flex-col justify-center p-6 lg:p-12 xl:p-16 pt-20 lg:pt-12"
        >
          {/* Project number & year */}
          <div className="animate-in flex items-center gap-4 mb-4">
            <span className="font-mono text-6xl lg:text-8xl font-black text-foreground/5">
              {project.id}
            </span>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em]">
                PROJECT
              </span>
              <span className="font-mono text-sm font-bold text-foreground/60">
                {project.year}
              </span>
            </div>
          </div>

          {/* Title - scramble animated */}
          <div className="animate-in mb-2">
            <span className="font-mono text-[10px] text-muted-foreground tracking-[0.15em] block mb-1">
              {project.title}
            </span>
            <h3 
              ref={titleRef}
              className="font-mono text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-foreground tracking-tight leading-none"
            >
              {project.growth.toUpperCase()}
            </h3>
          </div>

          {/* Achievement badge */}
          <div className="animate-in mb-6">
            <span className="inline-block font-mono text-xs font-bold text-accent bg-accent/10 px-3 py-1.5 border border-accent/30">
              {project.achievement}
            </span>
          </div>

          {/* Description */}
          <p className="animate-in font-mono text-sm text-muted-foreground mb-6 max-w-md leading-relaxed">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="animate-in flex flex-wrap gap-2 mb-8">
            {project.techStack.map((tech, i) => (
              <span
                key={tech}
                className="font-mono text-[10px] px-2 py-1 border border-foreground/20 text-foreground/70 hover:border-foreground/50 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* What I learned */}
          <div className="animate-in mb-8">
            <span className="font-mono text-[9px] text-muted-foreground tracking-[0.15em] block mb-2">
              KEY LEARNINGS
            </span>
            <ul className="space-y-1">
              {project.learned.map((item, i) => (
                <li key={i} className="font-mono text-xs text-foreground/70 flex items-start gap-2">
                  <span className="text-accent mt-0.5">▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div className="animate-in flex items-center gap-4">
            {hasGithub && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs text-foreground hover:text-accent transition-colors group"
              >
                <Github className="w-4 h-4" />
                <span className="border-b border-transparent group-hover:border-accent">CODE</span>
              </a>
            )}
            {hasDemo && (
              <a
                href={(project.links as { demo?: string }).demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs text-foreground hover:text-accent transition-colors group"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="border-b border-transparent group-hover:border-accent">DEMO</span>
              </a>
            )}
            {hasAppStore && (
              <span className="font-mono text-xs text-muted-foreground">iOS App</span>
            )}
          </div>

          {/* Progress indicator - bottom */}
          <div className="animate-in mt-auto pt-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-16 h-px bg-foreground/20" />
              <span className="font-mono text-[10px] text-muted-foreground">
                {String(index + 1).padStart(2, "0")} of {String(totalProjects).padStart(2, "0")}
              </span>
            </div>
            <span className="font-mono text-[9px] text-muted-foreground/50 tracking-wider">
              SCROLL TO CONTINUE
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN SECTION - SCROLL SNAP CONTAINER
// ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  // Setup ScrollTrigger for each project section
  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      allProjects.forEach((_, index) => {
        const section = sectionRefs.current[index]
        if (!section) return

        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        })
      })
    }, containerRef.current)

    return () => ctx.revert()
  }, [])

  // Handle timeline node click - scroll to project
  const handleNodeClick = useCallback((index: number) => {
    const section = sectionRefs.current[index]
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  return (
    <div 
      id="projects"
      ref={containerRef} 
      className="relative bg-background"
    >
      {/* Fixed timeline sidebar - desktop */}
      <TimelineSidebar 
        activeIndex={activeIndex}
        projects={allProjects}
        onNodeClick={handleNodeClick}
      />

      {/* Fixed timeline bar - mobile */}
      <MobileTimeline 
        activeIndex={activeIndex}
        projects={allProjects}
        onNodeClick={handleNodeClick}
      />

      {/* Scroll snap container */}
      <div className="snap-y snap-mandatory">
        {allProjects.map((project, index) => (
          <div
            key={project.id}
            ref={el => { 
              sectionRefs.current[index] = el as HTMLElement 
            }}
          >
            <ProjectSnapSection
              project={project}
              index={index}
              isActive={index === activeIndex}
              totalProjects={allProjects.length}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
