"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Github } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// PROJECT DATA - REVERSED ORDER (oldest first for growth journey)
// ─────────────────────────────────────────────────────────────

const allProjects = [
  {
    id: "01",
    year: "2022",
    title: "Poker %",
    growth: "First WatchOS App",
    before: "No native dev experience",
    after: "Published WatchOS app",
    techStack: ["Swift", "WatchOS"],
    achievement: "Published",
    metric: "<10ms",
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
  {
    id: "02",
    year: "2023",
    title: "Shohei HG",
    growth: "Python Automation",
    before: "Manual content posting",
    after: "Automated pipeline",
    techStack: ["Python", "Instagram API"],
    achievement: "11K followers",
    metric: "685 posts",
    links: { instagram: "#", youtube: "#" },
  },
  {
    id: "03",
    year: "2023",
    title: "Schedule Master",
    growth: "Backend Architecture",
    before: "Frontend-only apps",
    after: "Flask API + algorithms",
    techStack: ["Python", "Flask"],
    achievement: "500+ courses",
    metric: "70% fewer errors",
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "04",
    year: "2024",
    title: "Matcha Time",
    growth: "App Store Launch",
    before: "Local dev projects",
    after: "Production iOS app",
    techStack: ["Swift", "SwiftUI"],
    achievement: "50 users",
    metric: "4 weeks",
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
  {
    id: "05",
    year: "2024",
    title: "Portfolio",
    growth: "Modern Web Stack",
    before: "Static HTML sites",
    after: "Next.js + GSAP animations",
    techStack: ["React", "Next.js", "GSAP"],
    achievement: "60% faster",
    metric: "LCP<1.5s",
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "06",
    year: "2024",
    title: "Saboriendo",
    growth: "Full-Stack + Mobile",
    before: "Single platform apps",
    after: "Cross-platform sync system",
    techStack: ["React 19", "SwiftUI", "Firebase"],
    achievement: "50% faster",
    metric: "barcode<1s",
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "07",
    year: "2024",
    title: "With (Local LLM)",
    growth: "On-Device AI",
    before: "Cloud-dependent AI",
    after: "Local llama.cpp inference",
    techStack: ["Swift", "llama.cpp", "GGUF"],
    achievement: "2GB saved",
    metric: "<50ms/tok",
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "08",
    year: "2025",
    title: "HTIC Shuttle",
    growth: "Real-Time Systems",
    before: "Polling-based updates",
    after: "Event-driven RTDB",
    techStack: ["Swift", "Kotlin", "Firebase"],
    achievement: "70% fewer conflicts",
    metric: "<100ms",
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
  {
    id: "09",
    year: "2025",
    title: "CyberEdu",
    growth: "Network Resilience",
    before: "Online-only sync",
    after: "Offline-first architecture",
    techStack: ["Swift", "Kotlin", "Firebase"],
    achievement: "99%+ reliability",
    metric: "0 data loss",
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
  {
    id: "10",
    year: "2025",
    title: "Research Lab PM",
    growth: "Serverless Architecture",
    before: "Monolithic backend",
    after: "Dynamic AI routing system",
    techStack: ["Cloud Functions", "Firebase"],
    achievement: "30+ researchers",
    metric: "<200ms",
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "11",
    year: "2025",
    title: "Whiteboard AI",
    growth: "Vision ML + Collab",
    before: "Static image processing",
    after: "Real-time vision + CRDT sync",
    techStack: ["PyTorch", "WebSocket", "React"],
    achievement: "150ms inference",
    metric: "60fps",
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "12",
    year: "2025",
    title: "Zero Inbox",
    growth: "Production AI Engine",
    before: "Basic ML models",
    after: "Multi-stage reasoning pipeline",
    techStack: ["Swift", "AI/ML", "Firebase"],
    achievement: "95% accuracy",
    metric: "200ms",
    links: { github: "https://github.com/ryofujimura", demo: "#" },
  },
]

type Project = (typeof allProjects)[0]
const TOTAL_PROJECTS = allProjects.length

// ASCII characters for scramble animation
const ASCII_CHARS = "░▒▓█▄▀■□●○◆◇╳╱╲─│┌┐└┘├┤┬┴┼"

// ─────────────────────────────────────────────────────────────
// ANIMATED TITLE WITH ASCII SCRAMBLE
// ─────────────────────────────────────────────────────────────

function AnimatedTitle({ projectName, projectId }: { projectName: string; projectId: string }) {
  const nameRef = useRef<HTMLSpanElement>(null)
  const [displayName, setDisplayName] = useState(projectName.toUpperCase())

  // ASCII scramble animation only on project name
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

  // GSAP glitch animation only on project name
  useEffect(() => {
    if (!nameRef.current) return

    gsap.fromTo(
      nameRef.current,
      { 
        opacity: 0,
        x: -8,
        skewX: 5
      },
      { 
        opacity: 1,
        x: 0,
        skewX: 0,
        duration: 0.35,
        ease: "power2.out"
      }
    )
  }, [projectName])

  return (
    <h2 className="font-mono text-lg md:text-xl lg:text-2xl font-black text-foreground tracking-tighter">
      <span className="text-foreground/40">PROJECTS — </span>
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
// PROJECT SLIDE WITH ASCII ANIMATION
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
  const [asciiFrame, setAsciiFrame] = useState("┌──")

  // ASCII corner animation on activation
  useEffect(() => {
    if (!isActive) return

    const frames = ["┌──", "╔══", "┏━━", "╭──", "┌──"]
    let frameIndex = 0

    const interval = setInterval(() => {
      setAsciiFrame(frames[frameIndex])
      frameIndex++
      if (frameIndex >= frames.length) {
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [isActive])

  useEffect(() => {
    if (!isActive || !slideRef.current) return

    const ctx = gsap.context(() => {
      // ASCII glitch effect on elements
      gsap.fromTo(
        ".growth-animate",
        { opacity: 0, x: -10, skewX: 3 },
        { opacity: 1, x: 0, skewX: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" }
      )
      gsap.fromTo(
        ".tech-animate",
        { opacity: 0, scale: 0.8, rotation: -2 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.3, stagger: 0.03, delay: 0.2, ease: "back.out(1.5)" }
      )
      // ASCII border flash
      gsap.fromTo(
        ".ascii-border",
        { opacity: 0.1 },
        { opacity: 0.4, duration: 0.1, yoyo: true, repeat: 3 }
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
      <div className="h-full border border-foreground/30 bg-background relative">
        {/* ASCII corners with animation */}
        <span className="ascii-border absolute top-0 left-0 font-mono text-[7px] text-foreground/40 p-1">{asciiFrame}</span>
        <span className="ascii-border absolute top-0 right-0 font-mono text-[7px] text-foreground/40 p-1">──┐</span>
        <span className="ascii-border absolute bottom-0 left-0 font-mono text-[7px] text-foreground/40 p-1">└──</span>
        <span className="ascii-border absolute bottom-0 right-0 font-mono text-[7px] text-foreground/40 p-1">──┘</span>

        <div className="h-full flex flex-col p-3 md:p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-base md:text-lg font-black text-foreground/10">
                  {project.id}
                </span>
                <span className="font-mono text-[7px] text-foreground/50">
                  {project.year}
                </span>
              </div>
              <h3 className="font-mono text-[9px] md:text-[10px] text-foreground/60 truncate">
                {project.title}
              </h3>
            </div>

            <div className="flex-shrink-0 text-right">
              <div className="font-mono text-sm md:text-base font-black text-foreground">
                {project.metric}
              </div>
              <div className="font-mono text-[6px] md:text-[7px] text-foreground/50">
                {project.achievement}
              </div>
            </div>
          </div>

          {/* Growth Focus */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="growth-animate font-mono text-[7px] text-foreground/30 mb-1">
              ├─ GROWTH_FOCUS
            </div>
            
            <h4 className="growth-animate font-mono text-sm md:text-base lg:text-lg font-black text-foreground tracking-tight mb-2">
              {project.growth.toUpperCase()}
            </h4>

            {/* Before → After */}
            <div className="growth-animate bg-foreground/5 border border-foreground/10 p-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[6px] text-foreground/30 mb-0.5">BEFORE</div>
                  <div className="font-mono text-[8px] md:text-[9px] text-foreground/50 truncate">
                    {project.before}
                  </div>
                </div>
                <GrowthArrow isActive={isActive} />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[6px] text-foreground mb-0.5">AFTER</div>
                  <div className="font-mono text-[8px] md:text-[9px] text-foreground truncate font-medium">
                    {project.after}
                  </div>
                </div>
              </div>
            </div>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-1">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="tech-animate font-mono text-[6px] md:text-[7px] px-1 py-0.5 border border-foreground/15 text-foreground/50 bg-foreground/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-foreground/10 mt-2">
            <div className="flex items-center gap-2">
              {hasGithub && (
                <a href={project.links.github} target="_blank" rel="noopener noreferrer"
                  className="font-mono text-[7px] text-foreground/40 hover:text-foreground transition-colors flex items-center gap-1">
                  <Github className="w-2.5 h-2.5" />
                  <span className="hidden sm:inline">CODE</span>
                </a>
              )}
              {hasDemo && (
                <a href={(project.links as { demo?: string }).demo} target="_blank" rel="noopener noreferrer"
                  className="font-mono text-[7px] text-foreground/40 hover:text-foreground transition-colors flex items-center gap-1">
                  <ExternalLink className="w-2.5 h-2.5" />
                  <span className="hidden sm:inline">DEMO</span>
                </a>
              )}
              {hasAppStore && (
                <span className="font-mono text-[7px] text-foreground/20">iOS</span>
              )}
            </div>
            <div className="font-mono text-[6px] text-foreground/20">
              [{String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}]
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PROGRESS INDICATOR
// ─────────────────────────────────────────────────────────────

function ProgressIndicator({ activeIndex, total }: { activeIndex: number; total: number }) {
  const progressChars = 12
  const filled = Math.round((activeIndex / (total - 1)) * progressChars) || 0
  const progressBar = "█".repeat(filled) + "░".repeat(progressChars - filled)

  return (
    <div className="flex items-center justify-between py-2 font-mono border-t border-foreground/10">
      <div className="text-[7px] text-foreground/30">
        2022
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[7px] md:text-[8px] text-foreground/30 hidden sm:inline">
          [{progressBar}]
        </span>
        <span className="text-[9px] text-foreground/60">
          {String(activeIndex + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
      </div>
      <div className="text-[7px] text-foreground font-bold">
        NOW
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
    <div className="md:hidden flex gap-0.5 overflow-x-auto scrollbar-hide py-2 mb-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => handleClick(i)}
          className={cn(
            "flex-shrink-0 w-5 h-1 transition-all",
            i === activeIndex ? "bg-foreground" : 
            i < activeIndex ? "bg-foreground/30" : "bg-foreground/10"
          )}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN SECTION WITH GSAP PIN
// ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const pinContainerRef = useRef<HTMLDivElement>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)

  const currentProject = allProjects[activeIndex]

  // Detect mobile with matchMedia and resize listener
  useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(max-width: 768px)")
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
    }

    // Set initial value
    handleChange(mediaQuery)

    // Add listener for changes
    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  // GSAP ScrollTrigger pin setup - recreate on mobile/desktop change
  useEffect(() => {
    if (!sectionRef.current || !pinContainerRef.current) return

    // Mobile: pin later, shorter scroll distance per project
    // Desktop: pin at top, longer scroll distance
    const startValue = isMobile ? "top 15%" : "top top"
    const scrollPerProject = isMobile ? 80 : 100
    const scrubValue = isMobile ? 0.3 : 0.5

    const ctx = gsap.context(() => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: startValue,
        end: `+=${TOTAL_PROJECTS * scrollPerProject}%`,
        pin: pinContainerRef.current,
        pinSpacing: true,
        scrub: scrubValue,
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
  }, [isMobile])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative bg-background"
    >
      {/* Pinned container - centered on page */}
      <div 
        ref={pinContainerRef}
        className="min-h-screen flex items-center justify-center px-4 md:px-6"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 24px, currentColor 24px, currentColor 25px),
              repeating-linear-gradient(90deg, transparent, transparent 24px, currentColor 24px, currentColor 25px)`
          }} />
        </div>

        {/* Main centered content */}
        <div className="w-full max-w-4xl mx-auto relative">
          {/* Header */}
          <div className="mb-3 md:mb-4">
            <div className="font-mono text-[7px] md:text-[8px] text-foreground/20 mb-2 flex items-center">
              <span>╔</span>
              <span className="flex-1 overflow-hidden">{"═".repeat(100)}</span>
              <span>╗</span>
            </div>
            
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="font-mono text-[7px] md:text-[8px] text-foreground/40 tracking-[0.2em]">
                  {">>>"} PROJECTS / GROWTH JOURNEY
                </p>
                <AnimatedTitle 
                  projectName={currentProject.title} 
                  projectId={currentProject.id}
                />
              </div>
              
              <div className="text-right font-mono">
                <div className="text-2xl md:text-3xl font-black text-foreground/10">
                  {String(activeIndex + 1).padStart(2, "0")}
                </div>
                <div className="text-[7px] text-foreground/40">
                  /{String(TOTAL_PROJECTS).padStart(2, "0")}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile quick nav */}
          <MobileQuickNav 
            activeIndex={activeIndex}
            total={TOTAL_PROJECTS}
            scrollTriggerRef={scrollTriggerRef}
          />

          {/* Main layout */}
          <div className="flex gap-3 md:gap-4 lg:gap-6">
            {/* Timeline (desktop) */}
            <Timeline 
              activeIndex={activeIndex}
              projects={allProjects}
              scrollTriggerRef={scrollTriggerRef}
            />

            {/* Project display */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Project container - fixed height */}
              <div className="relative h-[200px] md:h-[220px] lg:h-[240px]">
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

          {/* Footer */}
          <div className="font-mono text-[7px] md:text-[8px] text-foreground/20 mt-3 flex items-center">
            <span>╚</span>
            <span className="flex-1 overflow-hidden">{"═".repeat(100)}</span>
            <span>╝</span>
          </div>

          {/* Scroll hint */}
          <div className="text-center mt-3">
            <span className="font-mono text-[7px] text-foreground/20 animate-pulse">
              ↓ SCROLL TO EXPLORE GROWTH ↓
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
