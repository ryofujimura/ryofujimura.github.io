"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// PROJECT DATA
// ─────────────────────────────────────────────────────────────

const projects = [
  {
    id: "01",
    title: "SIMULATE",
    subtitle: "WATCHOS",
    year: "2022",
    description: "Real-time poker odds calculator for Apple Watch using Monte Carlo simulation",
    techStack: ["Swift", "WatchOS", "SwiftUI"],
    images: ["/images/poker_1.jpg", "/images/poker_2.jpg", "/images/poker_3.jpg"],
    links: { github: "https://github.com/ryofujimura", appStore: "https://apps.apple.com/us/app/poker-pocket-odds/id6499280318" },
    ascii: `♠♥♦♣`,
  },
  {
    id: "02",
    title: "AUTOMATE",
    subtitle: "PYTHON",
    year: "2023",
    description: "Automated content pipeline for social platforms with intelligent scheduling",
    techStack: ["Python", "Instagram API", "YouTube API"],
    images: ["/images/shoheihomeground_1.jpg", "/images/shoheihomeground_2.jpg", "/images/shoheihomeground_3.jpg"],
    links: { instagram: "#", youtube: "#" },
    ascii: `▓▓▓░░`,
  },
  {
    id: "03",
    title: "OPTIMIZE",
    subtitle: "FLASK",
    year: "2023",
    description: "Course scheduling using graph coloring algorithms for conflict resolution",
    techStack: ["Python", "Flask", "SQLite"],
    images: ["/images/schedule.jpg"],
    links: { github: "https://github.com/ryofujimura" },
    ascii: `┌┬┬┬┐`,
  },
  {
    id: "04",
    title: "MINIMAL",
    subtitle: "IOS",
    year: "2024",
    description: "Zen matcha timer with Japanese aesthetic and ritual tracking",
    techStack: ["Swift", "SwiftUI", "CloudKit"],
    images: ["/images/matchatime_1.jpg", "/images/matchatime_2.jpg", "/images/matchatime_3.jpg"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
    ascii: `░▒▓█▓`,
  },
  {
    id: "05",
    title: "ANIMATE",
    subtitle: "NEXT.JS",
    year: "2024",
    description: "Brutalist portfolio with GSAP scroll-driven animations",
    techStack: ["React", "Next.js", "GSAP", "Tailwind"],
    images: ["/images/homepage.png", "/images/experiencepage.png"],
    links: { github: "https://github.com/ryofujimura" },
    ascii: `◆◇◆◇◆`,
  },
  {
    id: "06",
    title: "SYNC",
    subtitle: "CROSS_PLAT",
    year: "2024",
    description: "Food tracking with barcode scanning and real-time cross-platform sync",
    techStack: ["React 19", "SwiftUI", "Firebase"],
    images: [],
    links: { github: "https://github.com/ryofujimura" },
    ascii: `║│║│║`,
  },
  {
    id: "07",
    title: "INFERENCE",
    subtitle: "ON_DEVICE",
    year: "2024",
    description: "Privacy-focused AI with local llama.cpp inference, zero cloud dependency",
    techStack: ["Swift", "llama.cpp", "GGUF"],
    images: [],
    links: { github: "https://github.com/ryofujimura" },
    ascii: `●○●○●`,
  },
  {
    id: "08",
    title: "REALTIME",
    subtitle: "RTDB",
    year: "2025",
    description: "Campus shuttle tracking with sub-100ms event-driven updates",
    techStack: ["Swift", "Kotlin", "Firebase"],
    images: [],
    links: { github: "https://github.com/ryofujimura" },
    ascii: `═○═○═`,
  },
  {
    id: "09",
    title: "RESILIENT",
    subtitle: "OFFLINE",
    year: "2025",
    description: "Educational platform with offline-first architecture and conflict resolution",
    techStack: ["Swift", "Kotlin", "Firebase"],
    images: ["/images/CyberEdu-1.PNG", "/images/CyberEdu-2.PNG", "/images/CyberEdu-3.PNG"],
    links: { github: "https://github.com/ryofujimura" },
    ascii: `▀▄▀▄▀`,
  },
  {
    id: "10",
    title: "ROUTING",
    subtitle: "SERVERLESS",
    year: "2025",
    description: "Research lab PM with AI-powered dynamic task routing",
    techStack: ["Cloud Functions", "Firebase", "GPT-4"],
    images: [],
    links: { github: "https://github.com/ryofujimura" },
    ascii: `◇◆◇◆◇`,
  },
  {
    id: "11",
    title: "COLLAB",
    subtitle: "VISION_ML",
    year: "2025",
    description: "Whiteboard with CRDT sync and real-time AI vision processing",
    techStack: ["PyTorch", "WebSocket", "React"],
    images: ["/images/whiteboardai-1.jpg", "/images/whiteboardai-2.jpg"],
    links: { github: "https://github.com/ryofujimura" },
    ascii: `┼─┼─┼`,
  },
  {
    id: "12",
    title: "REASONING",
    subtitle: "PROD_AI",
    year: "2025",
    description: "Email management with multi-stage chain-of-thought AI pipeline",
    techStack: ["Swift", "AI/ML", "Firebase"],
    images: [],
    links: { github: "https://github.com/ryofujimura" },
    ascii: `█░█░█`,
  },
]

type Project = (typeof projects)[0]

// ─────────────────────────────────────────────────────────────
// MOBILE DETECTION
// ─────────────────────────────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return isMobile
}

// ─────────────────────────────────────────────────────────────
// ASCII LOADING SCREEN
// ─────────────────────────────────────────────────────────────

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [frame, setFrame] = useState(0)
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const frames = [
    `
    ╔════════════════════════════════╗
    ║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
    ║  ░ LOADING PROJECTS...     ░  ║
    ║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
    ╚════════════════════════════════╝
    `,
    `
    ╔════════════════════════════════╗
    ║  ▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░  ║
    ║  ▒ LOADING PROJECTS...     ▒  ║
    ║  ▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░  ║
    ╚════════════════════════════════╝
    `,
    `
    ╔════════════════════════════════╗
    ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░  ║
    ║  ▓ LOADING PROJECTS...     ▓  ║
    ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░  ║
    ╚════════════════════════════════╝
    `,
    `
    ╔════════════════════════════════╗
    ║  ████████████████████████░░░░  ║
    ║  █ LOADING PROJECTS...     █  ║
    ║  ████████████████████████░░░░  ║
    ╚════════════════════════════════╝
    `,
    `
    ╔════════════════════════════════╗
    ║  ████████████████████████████  ║
    ║  █ PROJECTS LOADED ✓       █  ║
    ║  ████████████████████████████  ║
    ╚════════════════════════════════╝
    `,
  ]

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return p + 4
      })
    }, 30)

    const frameInterval = setInterval(() => {
      setFrame(f => (f + 1) % (frames.length - 1))
    }, 150)

    const completeTimer = setTimeout(() => {
      clearInterval(frameInterval)
      setFrame(frames.length - 1)
      
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.5,
          delay: 0.3,
          ease: "power2.inOut",
          onComplete,
        })
      }
    }, 800)

    return () => {
      clearInterval(progressInterval)
      clearInterval(frameInterval)
      clearTimeout(completeTimer)
    }
  }, [onComplete, frames.length])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-background flex items-center justify-center"
    >
      <div className="text-center">
        <pre className="font-mono text-[8px] sm:text-[10px] md:text-xs text-foreground/60 leading-tight whitespace-pre">
          {frames[frame]}
        </pre>
        <div className="mt-4 font-mono text-[10px] text-foreground/40">
          [{String(progress).padStart(3, "0")}%] INITIALIZING_PROJECT_DATA
        </div>
        <div className="mt-2 flex justify-center gap-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-1 transition-all duration-100",
                i < progress / 5 ? "bg-foreground" : "bg-foreground/10"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT MODAL
// ─────────────────────────────────────────────────────────────

function ProjectModal({
  project,
  isOpen,
  onClose,
}: {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}) {
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Reset state when project changes
  useEffect(() => {
    setCurrentImageIndex(0)
    setImageLoaded(false)
  }, [project])

  // Animation on open/close
  useEffect(() => {
    if (!modalRef.current || !contentRef.current) return

    if (isOpen) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      )
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, delay: 0.1, ease: "power3.out" }
      )
    }
  }, [isOpen])

  // Keyboard close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft" && project?.images.length) {
        setCurrentImageIndex(i => (i > 0 ? i - 1 : project.images.length - 1))
        setImageLoaded(false)
      }
      if (e.key === "ArrowRight" && project?.images.length) {
        setCurrentImageIndex(i => (i < project.images.length - 1 ? i + 1 : 0))
        setImageLoaded(false)
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose, project])

  if (!isOpen || !project) return null

  const hasImages = project.images.length > 0

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Technical grid background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="modal-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#modal-grid)" />
        </svg>
      </div>

      <div
        ref={contentRef}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background border border-foreground/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner marks */}
        <span className="absolute top-0 left-0 font-mono text-[10px] text-foreground/30 p-2">┌──</span>
        <span className="absolute top-0 right-0 font-mono text-[10px] text-foreground/30 p-2">──┐</span>
        <span className="absolute bottom-0 left-0 font-mono text-[10px] text-foreground/30 p-2">└──</span>
        <span className="absolute bottom-0 right-0 font-mono text-[10px] text-foreground/30 p-2">──┘</span>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 font-mono text-xs px-3 py-2 border border-foreground/30 bg-background hover:bg-foreground hover:text-background transition-colors"
        >
          [ESC] CLOSE
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6 border-b border-foreground/10 pb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[10px] text-foreground/40">{project.id}</span>
              <span className="font-mono text-[10px] text-foreground/40">{project.year}</span>
              <span className="font-mono text-[10px] text-foreground/30">{project.ascii}</span>
            </div>
            <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tighter">
              {project.title}
            </h2>
            <div className="font-mono text-xs text-foreground/50 mt-2">{project.subtitle}</div>
          </div>

          {/* Image gallery */}
          {hasImages ? (
            <div className="mb-6">
              <div className="font-mono text-[10px] text-foreground/30 mb-3">
                ├── PREVIEW [{String(currentImageIndex + 1).padStart(2, "0")}/{String(project.images.length).padStart(2, "0")}]
              </div>
              <div className="relative aspect-video bg-foreground/5 border border-foreground/10 overflow-hidden">
                {/* Loading state */}
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/5 z-10">
                    <div className="font-mono text-[10px] text-foreground/30 animate-pulse">
                      ░▒▓ LOADING IMAGE ▓▒░
                    </div>
                  </div>
                )}
                <Image
                  src={project.images[currentImageIndex]}
                  alt={`${project.title} preview`}
                  fill
                  className={cn(
                    "object-cover transition-opacity duration-300",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setImageLoaded(true)}
                />
                
                {/* Nav arrows */}
                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={() => {
                        setCurrentImageIndex(i => (i > 0 ? i - 1 : project.images.length - 1))
                        setImageLoaded(false)
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 font-mono text-2xl text-white/60 hover:text-white bg-black/50 px-3 py-2 transition-colors"
                    >
                      ◄
                    </button>
                    <button
                      onClick={() => {
                        setCurrentImageIndex(i => (i < project.images.length - 1 ? i + 1 : 0))
                        setImageLoaded(false)
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-2xl text-white/60 hover:text-white bg-black/50 px-3 py-2 transition-colors"
                    >
                      ►
                    </button>
                  </>
                )}

                {/* Scanlines */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-10"
                  style={{
                    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
                  }}
                />
              </div>

              {/* Image dots */}
              {project.images.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                  {project.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentImageIndex(i)
                        setImageLoaded(false)
                      }}
                      className={cn(
                        "w-8 h-1 transition-all",
                        i === currentImageIndex ? "bg-foreground" : "bg-foreground/20 hover:bg-foreground/40"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6 aspect-video bg-foreground/[0.02] border border-dashed border-foreground/10 flex items-center justify-center">
              <pre className="font-mono text-[8px] text-foreground/20 text-center">
{`┌─────────────────────────┐
│                         │
│    NO PREVIEW IMAGE     │
│    AVAILABLE YET        │
│                         │
│    ░░░░░░░░░░░░░░░░░   │
│                         │
└─────────────────────────┘`}
              </pre>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <div className="font-mono text-[10px] text-foreground/30 mb-2">├── DESCRIPTION</div>
            <p className="font-mono text-sm text-foreground/70 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tech stack */}
          <div className="mb-6">
            <div className="font-mono text-[10px] text-foreground/30 mb-3">└── TECH_STACK</div>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[10px] px-3 py-1.5 border border-foreground/20 text-foreground/60 bg-foreground/[0.02] hover:bg-foreground/10 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3 pt-6 border-t border-foreground/10">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] px-4 py-2 border border-foreground/30 hover:bg-foreground hover:text-background transition-colors"
              >
                [→] VIEW_CODE
              </a>
            )}
            {"appStore" in project.links && project.links.appStore && (
              <a
                href={project.links.appStore as string}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] px-4 py-2 border border-foreground/30 hover:bg-foreground hover:text-background transition-colors"
              >
                [◉] APP_STORE
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// INTERACTIVE PROJECT TITLE
// ─────────────────────────────────────────────────────────────

function ProjectTitle({
  project,
  index,
  onClick,
  isHovered,
  onHover,
  onLeave,
}: {
  project: Project
  index: number
  onClick: () => void
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}) {
  const titleRef = useRef<HTMLButtonElement>(null)
  const [displayText, setDisplayText] = useState(project.title)
  // Use only standard ASCII characters with consistent monospace width
  const glitchChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*!?+-=<>"

  // Glitch effect on hover - maintains exact character count
  useEffect(() => {
    if (!isHovered) {
      setDisplayText(project.title)
      return
    }

    let iteration = 0
    const maxIterations = project.title.length * 2
    
    const interval = setInterval(() => {
      const newText = project.title
        .split("")
        .map((char, i) => {
          // Preserve underscores and spaces exactly
          if (char === "_" || char === " ") return char
          // Progressively reveal original characters
          if (i < iteration / 2) return project.title[i]
          // Replace with random glitch char of same type (letter stays letter)
          return glitchChars[Math.floor(Math.random() * glitchChars.length)]
        })
        .join("")
      
      setDisplayText(newText)
      iteration++
      
      if (iteration > maxIterations) {
        setDisplayText(project.title)
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [isHovered, project.title])

  return (
    <button
      ref={titleRef}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onTouchStart={onHover}
      onTouchEnd={onLeave}
      className={cn(
        "project-title inline-block whitespace-nowrap transition-all duration-300 cursor-pointer touch-manipulation",
        "font-mono font-black tracking-tighter",
        "text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[7vw]",
        "leading-[0.85]",
        isHovered
          ? "text-foreground scale-[1.02] -skew-x-2"
          : "text-foreground/15 hover:text-foreground/40"
      )}
      style={{
        textShadow: isHovered ? "0 0 60px rgba(var(--foreground), 0.3)" : "none",
      }}
    >
      <span className="relative">
        {/* Index number */}
        <span
          className={cn(
            "absolute -left-[1em] top-0 text-[0.15em] font-normal transition-opacity duration-300",
            isHovered ? "opacity-60" : "opacity-0"
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        
        {displayText}
        
        {/* ASCII decoration */}
        <span
          className={cn(
            "absolute -right-[0.5em] top-1/2 -translate-y-1/2 text-[0.12em] font-normal transition-opacity duration-300",
            isHovered ? "opacity-40" : "opacity-0"
          )}
        >
          {project.ascii}
        </span>

        {/* Underline */}
        <span
          className={cn(
            "absolute bottom-0 left-0 h-[0.03em] bg-foreground transition-all duration-500 ease-out",
            isHovered ? "w-full" : "w-0"
          )}
        />
      </span>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// ASCII DECORATIVE LINE
// ─────────────────────────────────────────────────────────────

function AsciiLine({ char = "─", className }: { char?: string; className?: string }) {
  const lineRef = useRef<HTMLDivElement>(null)
  const [chars, setChars] = useState("")

  useEffect(() => {
    const updateWidth = () => {
      if (!lineRef.current) return
      const width = lineRef.current.offsetWidth
      const charCount = Math.floor(width / 8)
      setChars(char.repeat(charCount))
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [char])

  return (
    <div ref={lineRef} className={cn("font-mono text-[10px] text-foreground/10 overflow-hidden", className)}>
      {chars}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const titleContainerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  // Scroll animation
  useEffect(() => {
    if (!isLoaded || !sectionRef.current || !titleContainerRef.current) return

    const ctx = gsap.context(() => {
      // Animate titles on scroll
      gsap.fromTo(
        ".project-title",
        { opacity: 0, y: 100, rotateX: -30 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse",
          },
        }
      )

      // Parallax effect on scroll
      gsap.to(titleContainerRef.current, {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })

      // Animate decorative elements
      gsap.fromTo(
        ".ascii-decoration",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      )

    }, sectionRef.current)

    return () => ctx.revert()
  }, [isLoaded])

  // Grid pattern SVG
  const GridPattern = () => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]">
      <defs>
        <pattern id="projects-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <pattern id="projects-dots" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#projects-grid)" />
      <rect width="100%" height="100%" fill="url(#projects-dots)" opacity="0.5" />
    </svg>
  )

  return (
    <>
      {/* Loading screen */}
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}

      <section
        id="projects"
        ref={sectionRef}
        className="relative min-h-screen bg-background overflow-hidden py-16 sm:py-20 md:py-24"
      >
        {/* Background grid */}
        <GridPattern />

        <div ref={containerRef} className="relative z-10 px-4 sm:px-6 md:px-8">
          {/* Section header */}
          <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
            <div className="ascii-decoration font-mono text-[8px] sm:text-[10px] text-foreground/30 mb-4">
              ╔══════════════════════════════════════════════════════════╗
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="ascii-decoration font-mono text-[9px] sm:text-[11px] text-foreground/40 tracking-[0.2em] mb-2">
                  PROJECTS // SELECTED_WORK
                </div>
                <h2 className="ascii-decoration font-mono text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tighter">
                  STILL_LEARNING
                </h2>
              </div>
              <div className="ascii-decoration font-mono text-[10px] text-foreground/30 text-right">
                <div>TOTAL: {projects.length} PROJECTS</div>
                <div>YEARS: 2022—2025</div>
                <div>[TAP TO VIEW]</div>
              </div>
            </div>

            <div className="ascii-decoration font-mono text-[8px] sm:text-[10px] text-foreground/30 mt-4">
              ╚══════════════════════════════════════════════════════════╝
            </div>
          </div>

          {/* Project titles */}
          <div
            ref={titleContainerRef}
            className="relative text-center py-8 sm:py-12"
          >
            {/* Decorative lines */}
            <AsciiLine char="═" className="absolute top-0 left-0 right-0" />
            
            {/* Main title flow */}
            <div className="flex flex-wrap justify-center items-baseline gap-x-[0.15em] gap-y-2 px-2">
              {projects.map((project, index) => (
                <span key={project.id} className="inline-flex items-baseline">
                  <ProjectTitle
                    project={project}
                    index={index}
                    onClick={() => setSelectedProject(project)}
                    isHovered={hoveredIndex === index}
                    onHover={() => setHoveredIndex(index)}
                    onLeave={() => setHoveredIndex(null)}
                  />
                  {index < projects.length - 1 && (
                    <span className="font-mono text-[3vw] sm:text-[2vw] text-foreground/10 mx-[0.1em] select-none">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>

            <AsciiLine char="═" className="absolute bottom-0 left-0 right-0" />
          </div>

          {/* Instruction hint */}
          <div className="text-center mt-8 sm:mt-12">
            <div className="inline-block border border-foreground/10 px-4 py-3 bg-foreground/[0.02]">
              <div className="font-mono text-[9px] sm:text-[10px] text-foreground/40 animate-pulse">
                {isMobile ? (
                  <>
                    <span className="text-foreground/60">◉</span> TAP ANY PROJECT TO VIEW DETAILS
                  </>
                ) : (
                  <>
                    <span className="text-foreground/60">◉</span> HOVER TO HIGHLIGHT · CLICK TO VIEW DETAILS
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ASCII footer art */}
          <div className="mt-12 sm:mt-16 text-center">
            <pre className="ascii-decoration inline-block font-mono text-[6px] sm:text-[8px] text-foreground/15 leading-tight">
{`
        ╔═══════════════════════════════════════════╗
        ║                                           ║
        ║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
        ║  ░ PROJECTS.DATA.LOADED                ░  ║
        ║  ░ STATUS: READY                       ░  ║
        ║  ░ INPUT: AWAITING_SELECTION           ░  ║
        ║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
        ║                                           ║
        ╚═══════════════════════════════════════════╝
`}
            </pre>
          </div>

          {/* Year markers */}
          <div className="max-w-6xl mx-auto mt-12 sm:mt-16">
            <div className="ascii-decoration font-mono text-[8px] sm:text-[10px] text-foreground/30 mb-3">
              ├── TIMELINE
            </div>
            <div className="flex justify-between items-center border-t border-foreground/10 pt-3">
              {["2022", "2023", "2024", "2025"].map((year, i) => (
                <div key={year} className="text-center">
                  <div className="font-mono text-[10px] sm:text-xs text-foreground/40 mb-1">{year}</div>
                  <div className="font-mono text-[8px] text-foreground/20">
                    {projects.filter((p) => p.year === year).length} projects
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </>
  )
}
