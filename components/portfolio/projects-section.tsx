"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Github, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// PROJECT DATA - GROWTH FOCUSED
// ─────────────────────────────────────────────────────────────

const allProjects = [
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

// ─────────────────────────────────────────────────────────────
// TECHNICAL PATTERNS - SVG BACKGROUNDS (CONTAINED)
// ─────────────────────────────────────────────────────────────

function TechnicalPatterns() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Diagonal grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.02]" preserveAspectRatio="none">
        <defs>
          <pattern id="diagonal-grid-projects" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 60" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <path d="M 0 0 L 60 60" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonal-grid-projects)" />
      </svg>

      {/* Vertical technical lines */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-foreground/5 hidden lg:block" />
      <div className="absolute right-8 top-0 bottom-0 w-px bg-foreground/5 hidden lg:block" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────

function SectionHeader({ count, activeIndex }: { count: number; activeIndex: number }) {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!titleRef.current) return
    const ctx = gsap.context(() => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ░▒▓█"
      const originalText = "PROJECTS"
      let iteration = 0

      ScrollTrigger.create({
        trigger: titleRef.current,
        start: "top 95%",
        onEnter: () => {
          const interval = setInterval(() => {
            if (!titleRef.current) return clearInterval(interval)
            titleRef.current.textContent = originalText
              .split("")
              .map((char, i) => (i < iteration ? char : chars[Math.floor(Math.random() * chars.length)]))
              .join("")
            if (iteration >= originalText.length) clearInterval(interval)
            iteration += 0.3
          }, 35)
        },
      })
    }, titleRef.current)
    return () => ctx.revert()
  }, [])

  return (
    <div className="mb-8 lg:mb-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] text-muted-foreground tracking-[0.15em] mb-1">— 04</p>
          <h2
            ref={titleRef}
            className="font-mono text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tighter leading-none"
          >
            PROJECTS
          </h2>
        </div>
        <div className="text-right">
          <span className="font-mono text-4xl md:text-5xl lg:text-6xl font-black text-foreground/5 tabular-nums">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <p className="font-mono text-[9px] text-muted-foreground">
            OF {String(count).padStart(2, "0")}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TIMELINE SIDEBAR - STICKY WITHIN SECTION (DESKTOP)
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
  const connectorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!connectorRef.current) return
    const progress = projects.length > 1 ? (activeIndex / (projects.length - 1)) * 100 : 0
    
    gsap.to(connectorRef.current, {
      height: `${progress}%`,
      duration: 0.5,
      ease: "power2.out"
    })
  }, [activeIndex, projects.length])

  return (
    <div className="hidden lg:block w-[200px] xl:w-[240px] flex-shrink-0">
      <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
        {/* Vertical track */}
        <div className="relative pl-4">
          <div className="absolute left-[7px] top-0 bottom-0 w-px bg-foreground/10" />
          <div 
            ref={connectorRef}
            className="absolute left-[7px] top-0 w-px bg-accent"
            style={{ height: "0%" }}
          />

          {/* Timeline nodes */}
          <div className="space-y-1">
            {projects.map((project, index) => {
              const isActive = index === activeIndex
              const isPast = index < activeIndex
              const showYear = index === 0 || projects[index - 1]?.year !== project.year

              return (
                <div key={project.id}>
                  {showYear && (
                    <div className="flex items-center gap-2 mb-2 mt-4 first:mt-0">
                      <div className="w-4 h-px bg-foreground/20" />
                      <span className="font-mono text-[10px] font-bold text-foreground/50 tracking-wider">
                        {project.year}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => onNodeClick(index)}
                    className={cn(
                      "w-full flex items-start gap-2 py-1.5 text-left transition-all group"
                    )}
                  >
                    <div 
                      className={cn(
                        "w-3 h-3 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all",
                        isActive ? "bg-accent border-accent scale-125" : 
                        isPast ? "bg-foreground/60 border-foreground/60" : 
                        "bg-transparent border-foreground/30"
                      )}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <span 
                        className={cn(
                          "font-mono text-[10px] block truncate transition-colors leading-tight",
                          isActive ? "text-foreground font-bold" : 
                          isPast ? "text-foreground/60" : 
                          "text-foreground/30 group-hover:text-foreground/50"
                        )}
                      >
                        {project.growth}
                      </span>
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-foreground/10">
          <p className="font-mono text-[8px] text-muted-foreground/50">
            SCROLL TO NAVIGATE
          </p>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MOBILE PROGRESS BAR - STICKY WITHIN SECTION
// ─────────────────────────────────────────────────────────────

function MobileProgress({ 
  activeIndex, 
  total,
  currentProject 
}: { 
  activeIndex: number
  total: number
  currentProject: Project
}) {
  return (
    <div className="lg:hidden sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-foreground/10 -mx-4 px-4 py-3 mb-6">
      {/* Progress bar */}
      <div className="h-0.5 bg-foreground/10 mb-2">
        <div 
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${((activeIndex + 1) / total) * 100}%` }}
        />
      </div>
      
      {/* Current info */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-foreground font-bold truncate max-w-[60%]">
          {currentProject.growth}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// IMAGE GALLERY - COMPACT
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

  useEffect(() => {
    if (!isActive || images.length <= 1) return
    const interval = setInterval(() => {
      setActiveImage(prev => (prev + 1) % images.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [isActive, images.length])

  // Reset to first image when not active
  useEffect(() => {
    if (!isActive) setActiveImage(0)
  }, [isActive])

  return (
    <div className="relative w-full h-full bg-muted">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`${projectTitle} - ${idx + 1}`}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-all duration-700",
            idx === activeImage 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-105"
          )}
          style={{ filter: isActive ? "grayscale(0%)" : "grayscale(100%)" }}
          loading={idx === 0 ? "eager" : "lazy"}
        />
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      
      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-3 right-3 flex gap-1">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={cn(
                "w-6 h-0.5 transition-all",
                idx === activeImage ? "bg-foreground" : "bg-foreground/30"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT CARD - FULL WIDTH, ONE AT A TIME
// ─────────────────────────────────────────────────────────────

function ProjectCard({ 
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
  const cardRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  // Text scramble animation
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

  // Fade animation on scroll
  useEffect(() => {
    if (!cardRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      )
    }, cardRef.current)

    return () => ctx.revert()
  }, [])

  const hasGithub = project.links.github
  const hasDemo = "demo" in project.links
  const hasAppStore = "appStore" in project.links

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative border-2 border-foreground bg-background transition-all duration-500",
        isActive ? "opacity-100" : "opacity-60"
      )}
    >
      {/* Corner brackets */}
      <svg className="absolute -top-1 -left-1 w-4 h-4 text-foreground">
        <path d="M 0 16 L 0 0 L 16 0" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
      <svg className="absolute -top-1 -right-1 w-4 h-4 text-foreground">
        <path d="M 0 0 L 16 0 L 16 16" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
      <svg className="absolute -bottom-1 -left-1 w-4 h-4 text-foreground">
        <path d="M 0 0 L 0 16 L 16 16" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
      <svg className="absolute -bottom-1 -right-1 w-4 h-4 text-foreground">
        <path d="M 0 16 L 16 16 L 16 0" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>

      {/* Layout: Image + Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Image */}
        <div className="relative h-48 md:h-64 lg:h-80 lg:w-1/2 border-b lg:border-b-0 lg:border-r border-foreground/20">
          <ImageGallery 
            images={project.images} 
            projectTitle={project.title}
            isActive={isActive}
          />
          
          {/* Project number overlay */}
          <div className="absolute top-3 left-3 font-mono text-6xl lg:text-7xl font-black text-foreground/10">
            {project.id}
          </div>
          
          {/* Year badge */}
          <div className="absolute top-3 right-3 bg-foreground text-background px-2 py-1">
            <span className="font-mono text-[10px] font-bold tracking-wider">{project.year}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 lg:p-8 flex flex-col">
          {/* Title area */}
          <div className="mb-4">
            <span className="font-mono text-[10px] text-muted-foreground tracking-[0.15em] block mb-1">
              {project.title}
            </span>
            <h3 
              ref={titleRef}
              className="font-mono text-xl md:text-2xl lg:text-3xl font-black text-foreground tracking-tight leading-none"
            >
              {project.growth.toUpperCase()}
            </h3>
          </div>

          {/* Achievement */}
          <div className="mb-4">
            <span className="inline-block font-mono text-[10px] font-bold text-accent bg-accent/10 px-2 py-1 border border-accent/30">
              {project.achievement}
            </span>
          </div>

          {/* Description */}
          <p className="font-mono text-xs text-muted-foreground mb-4 leading-relaxed">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[9px] px-2 py-0.5 border border-foreground/20 text-foreground/60"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Learnings */}
          <div className="mb-4">
            <span className="font-mono text-[8px] text-muted-foreground tracking-[0.15em] block mb-1.5">
              KEY LEARNINGS
            </span>
            <ul className="space-y-0.5">
              {project.learned.map((item, i) => (
                <li key={i} className="font-mono text-[10px] text-foreground/60 flex items-start gap-1.5">
                  <span className="text-accent">▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 mt-auto pt-4 border-t border-foreground/10">
            {hasGithub && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[10px] text-foreground hover:text-accent transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>CODE</span>
              </a>
            )}
            {hasDemo && (
              <a
                href={(project.links as { demo?: string }).demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[10px] text-foreground hover:text-accent transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>DEMO</span>
              </a>
            )}
            {hasAppStore && (
              <span className="font-mono text-[10px] text-muted-foreground">iOS App</span>
            )}
          </div>
        </div>
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
  const projectRefs = useRef<(HTMLDivElement | null)[]>([])

  // Setup ScrollTrigger for each project
  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      allProjects.forEach((_, index) => {
        const projectEl = projectRefs.current[index]
        if (!projectEl) return

        ScrollTrigger.create({
          trigger: projectEl,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        })
      })
    }, sectionRef.current)

    return () => ctx.revert()
  }, [])

  const handleNodeClick = useCallback((index: number) => {
    const projectEl = projectRefs.current[index]
    if (projectEl) {
      projectEl.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-background overflow-hidden"
    >
      {/* Background patterns */}
      <TechnicalPatterns />

      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <SectionHeader count={allProjects.length} activeIndex={activeIndex} />

        {/* Mobile progress */}
        <MobileProgress 
          activeIndex={activeIndex}
          total={allProjects.length}
          currentProject={allProjects[activeIndex]}
        />

        {/* Main layout: Timeline + Projects */}
        <div className="flex gap-8 lg:gap-12">
          {/* Timeline sidebar (desktop) */}
          <TimelineSidebar 
            activeIndex={activeIndex}
            projects={allProjects}
            onNodeClick={handleNodeClick}
          />

          {/* Projects list */}
          <div className="flex-1 space-y-8 lg:space-y-12">
            {allProjects.map((project, index) => (
              <div
                key={project.id}
                ref={el => { projectRefs.current[index] = el }}
              >
                <ProjectCard
                  project={project}
                  index={index}
                  isActive={index === activeIndex}
                  totalProjects={allProjects.length}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
            <span>CONTINUE</span>
          </a>
        </div>
      </div>
    </section>
  )
}
