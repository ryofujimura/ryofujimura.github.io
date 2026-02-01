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
  {
    id: "01",
    year: "2025",
    title: "Zero Inbox",
    images: ["/images/profile.jpg"],
    growth: "Production AI Engine",
    before: "Basic ML models",
    after: "Multi-stage reasoning pipeline",
    techStack: ["Swift", "AI/ML", "Firebase"],
    achievement: "95% accuracy",
    metric: "200ms",
    description: "High-throughput AI with production-grade performance.",
    links: { github: "https://github.com/ryofujimura", demo: "#" },
  },
  {
    id: "02",
    year: "2025",
    title: "Whiteboard AI",
    images: ["/images/whiteboardai.png"],
    growth: "Vision ML + Collab",
    before: "Static image processing",
    after: "Real-time vision + CRDT sync",
    techStack: ["PyTorch", "WebSocket", "React"],
    achievement: "150ms inference",
    metric: "60fps",
    description: "Computer vision with real-time collaboration.",
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "03",
    year: "2025",
    title: "Research Lab PM",
    images: ["/images/profile.jpg"],
    growth: "Serverless Architecture",
    before: "Monolithic backend",
    after: "Dynamic AI routing system",
    techStack: ["Cloud Functions", "Firebase"],
    achievement: "30+ researchers",
    metric: "<200ms",
    description: "Serverless orchestration at scale.",
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "04",
    year: "2025",
    title: "CyberEdu",
    images: ["/images/CyberEdu.png"],
    growth: "Network Resilience",
    before: "Online-only sync",
    after: "Offline-first architecture",
    techStack: ["Swift", "Kotlin", "Firebase"],
    achievement: "99%+ reliability",
    metric: "0 data loss",
    description: "Cross-device sync across unstable networks.",
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
  {
    id: "05",
    year: "2025",
    title: "HTIC Shuttle",
    images: ["/images/schedule.jpg"],
    growth: "Real-Time Systems",
    before: "Polling-based updates",
    after: "Event-driven RTDB",
    techStack: ["Swift", "Kotlin", "Firebase"],
    achievement: "70% fewer conflicts",
    metric: "<100ms",
    description: "Cross-platform native with real-time sync.",
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
  {
    id: "06",
    year: "2024",
    title: "With (Local LLM)",
    images: ["/images/profile.jpg"],
    growth: "On-Device AI",
    before: "Cloud-dependent AI",
    after: "Local llama.cpp inference",
    techStack: ["Swift", "llama.cpp", "GGUF"],
    achievement: "2GB saved",
    metric: "<50ms/tok",
    description: "Privacy-first local AI.",
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "07",
    year: "2024",
    title: "Saboriendo",
    images: ["/images/profile.jpg"],
    growth: "Full-Stack + Mobile",
    before: "Single platform apps",
    after: "Cross-platform sync system",
    techStack: ["React 19", "SwiftUI", "Firebase"],
    achievement: "50% faster",
    metric: "barcode<1s",
    description: "Full-stack with real-time sync.",
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "08",
    year: "2024",
    title: "Portfolio",
    images: ["/images/homepage.png"],
    growth: "Modern Web Stack",
    before: "Static HTML sites",
    after: "Next.js + GSAP animations",
    techStack: ["React", "Next.js", "GSAP"],
    achievement: "60% faster",
    metric: "LCP<1.5s",
    description: "Performance-optimized React.",
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "09",
    year: "2024",
    title: "Matcha Time",
    images: ["/images/matchatime_1.jpg"],
    growth: "App Store Launch",
    before: "Local dev projects",
    after: "Production iOS app",
    techStack: ["Swift", "SwiftUI"],
    achievement: "50 users",
    metric: "4 weeks",
    description: "First App Store launch.",
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
  {
    id: "10",
    year: "2023",
    title: "Schedule Master",
    images: ["/images/schedule.jpg"],
    growth: "Backend Architecture",
    before: "Frontend-only apps",
    after: "Flask API + algorithms",
    techStack: ["Python", "Flask"],
    achievement: "500+ courses",
    metric: "70% fewer errors",
    description: "University scheduling system.",
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "11",
    year: "2023",
    title: "Shohei HG",
    images: ["/images/shoheihomeground_1.jpg"],
    growth: "Python Automation",
    before: "Manual content posting",
    after: "Automated pipeline",
    techStack: ["Python", "Instagram API"],
    achievement: "11K followers",
    metric: "685 posts",
    description: "Automated content at scale.",
    links: { instagram: "#", youtube: "#" },
  },
  {
    id: "12",
    year: "2022",
    title: "Poker %",
    images: ["/images/poker.png"],
    growth: "First WatchOS App",
    before: "No native dev experience",
    after: "Published WatchOS app",
    techStack: ["Swift", "WatchOS"],
    achievement: "Published",
    metric: "<10ms",
    description: "Real-time probability engine.",
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
]

type Project = (typeof allProjects)[0]

// ─────────────────────────────────────────────────────────────
// ASCII PATTERNS
// ─────────────────────────────────────────────────────────────

const ASCII_CORNER_TL = `┌──`
const ASCII_CORNER_TR = `──┐`
const ASCII_CORNER_BL = `└──`
const ASCII_CORNER_BR = `──┘`
const ASCII_DIVIDER = `├──────────────────────┤`
const ASCII_ARROW = `>>>`
const ASCII_PROGRESS = `▓▓▓░░░░░░░`

// Growth indicator ASCII
function GrowthArrow({ isActive }: { isActive: boolean }) {
  return (
    <span className={cn(
      "font-mono text-[10px] transition-all duration-300",
      isActive ? "text-accent" : "text-foreground/30"
    )}>
      {"─────►"}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────

function SectionHeader({ count, activeIndex }: { count: number; activeIndex: number }) {
  const headerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!headerRef.current) return
    
    const ctx = gsap.context(() => {
      // Animate title on scroll
      ScrollTrigger.create({
        trigger: headerRef.current,
        start: "top 90%",
        onEnter: () => {
          if (!titleRef.current) return
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ░▒▓█"
          const originalText = "PROJECTS"
          let iteration = 0

          const interval = setInterval(() => {
            if (!titleRef.current) return clearInterval(interval)
            titleRef.current.textContent = originalText
              .split("")
              .map((char, i) => (i < iteration ? char : chars[Math.floor(Math.random() * chars.length)]))
              .join("")
            if (iteration >= originalText.length) clearInterval(interval)
            iteration += 0.4
          }, 30)
        },
      })
    }, headerRef.current)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={headerRef} className="mb-4 md:mb-6">
      {/* ASCII top border */}
      <div className="font-mono text-[8px] md:text-[10px] text-foreground/20 mb-2 overflow-hidden">
        ╔══════════════════════════════════════════════════════════════╗
      </div>
      
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[8px] md:text-[10px] text-muted-foreground tracking-[0.2em]">
            {ASCII_ARROW} SECTION_04
          </p>
          <h2
            ref={titleRef}
            className="font-mono text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tighter"
          >
            PROJECTS
          </h2>
        </div>
        
        <div className="text-right font-mono">
          <div className="text-3xl md:text-4xl font-black text-foreground/5">
            {String(activeIndex + 1).padStart(2, "0")}
          </div>
          <div className="text-[8px] text-muted-foreground">
            /{String(count).padStart(2, "0")}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TIMELINE - COMPACT VERTICAL
// ─────────────────────────────────────────────────────────────

function Timeline({ 
  activeIndex, 
  projects,
  onNodeClick 
}: { 
  activeIndex: number
  projects: Project[]
  onNodeClick: (index: number) => void
}) {
  return (
    <div className="hidden md:flex flex-col w-[140px] lg:w-[160px] flex-shrink-0">
      <div className="font-mono text-[8px] text-foreground/30 mb-2">
        ┌─ TIMELINE
      </div>
      
      <div className="relative pl-3 border-l border-foreground/10">
        {projects.map((project, index) => {
          const isActive = index === activeIndex
          const isPast = index < activeIndex
          const showYear = index === 0 || projects[index - 1]?.year !== project.year

          return (
            <div key={project.id}>
              {showYear && (
                <div className="font-mono text-[8px] text-foreground/40 mb-1 mt-2 first:mt-0 -ml-3 pl-3 border-l-2 border-foreground/20">
                  [{project.year}]
                </div>
              )}

              <button
                onClick={() => onNodeClick(index)}
                className={cn(
                  "w-full text-left py-0.5 font-mono text-[8px] transition-all relative",
                  "-ml-3 pl-3",
                  isActive ? "text-accent border-l-2 border-accent" : 
                  isPast ? "text-foreground/40 border-l border-foreground/20" : 
                  "text-foreground/20 border-l border-transparent hover:text-foreground/40"
                )}
              >
                <span className="truncate block">{project.growth}</span>
              </button>
            </div>
          )
        })}
      </div>
      
      <div className="font-mono text-[8px] text-foreground/30 mt-2">
        └─ END
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT SLIDE - COMPACT, GROWTH-FOCUSED
// ─────────────────────────────────────────────────────────────

function ProjectSlide({ 
  project, 
  index,
  isActive 
}: { 
  project: Project
  index: number
  isActive: boolean
}) {
  const slideRef = useRef<HTMLDivElement>(null)
  const growthRef = useRef<HTMLDivElement>(null)

  // GSAP animations when active
  useEffect(() => {
    if (!isActive || !slideRef.current) return

    const ctx = gsap.context(() => {
      // Animate growth section
      gsap.fromTo(
        ".growth-animate",
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      )

      // Animate tech tags
      gsap.fromTo(
        ".tech-animate",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.3, stagger: 0.03, delay: 0.2, ease: "back.out(1.7)" }
      )

      // Animate metric numbers
      gsap.fromTo(
        ".metric-animate",
        { opacity: 0, y: 5 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.3 }
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
        "h-full w-full snap-start snap-always transition-opacity duration-300",
        isActive ? "opacity-100" : "opacity-30"
      )}
    >
      {/* Main container with ASCII frame */}
      <div className="h-full border border-foreground/30 bg-background relative overflow-hidden">
        
        {/* ASCII corners */}
        <span className="absolute top-0 left-0 font-mono text-[8px] text-foreground/40 p-1">{ASCII_CORNER_TL}</span>
        <span className="absolute top-0 right-0 font-mono text-[8px] text-foreground/40 p-1">{ASCII_CORNER_TR}</span>
        <span className="absolute bottom-0 left-0 font-mono text-[8px] text-foreground/40 p-1">{ASCII_CORNER_BL}</span>
        <span className="absolute bottom-0 right-0 font-mono text-[8px] text-foreground/40 p-1">{ASCII_CORNER_BR}</span>

        {/* Content grid - Mobile optimized */}
        <div className="h-full flex flex-col p-3 md:p-4">
          
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-2 md:mb-3">
            {/* Project ID & Title */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-lg md:text-xl font-black text-foreground/10">
                  {project.id}
                </span>
                <span className="font-mono text-[8px] text-muted-foreground">
                  {project.year}
                </span>
              </div>
              <h3 className="font-mono text-[10px] md:text-xs text-foreground/60 truncate">
                {project.title}
              </h3>
            </div>

            {/* Metric badge */}
            <div className="metric-animate flex-shrink-0 text-right">
              <div className="font-mono text-sm md:text-base font-black text-accent">
                {project.metric}
              </div>
              <div className="font-mono text-[7px] text-muted-foreground">
                {project.achievement}
              </div>
            </div>
          </div>

          {/* ═══ GROWTH SECTION - THE MAIN FOCUS ═══ */}
          <div ref={growthRef} className="flex-1 flex flex-col justify-center">
            
            {/* Growth title */}
            <div className="growth-animate font-mono text-[8px] text-foreground/40 mb-1">
              ├─ GROWTH_FOCUS
            </div>
            
            <h4 className="growth-animate font-mono text-base md:text-lg lg:text-xl font-black text-foreground tracking-tight mb-2 md:mb-3">
              {project.growth.toUpperCase()}
            </h4>

            {/* Before → After visualization */}
            <div className="growth-animate bg-foreground/5 border border-foreground/10 p-2 md:p-3 mb-2 md:mb-3">
              <div className="flex items-center gap-2 md:gap-3">
                {/* Before */}
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[7px] text-foreground/40 mb-0.5">BEFORE</div>
                  <div className="font-mono text-[9px] md:text-[10px] text-foreground/60 truncate">
                    {project.before}
                  </div>
                </div>

                {/* Arrow */}
                <GrowthArrow isActive={isActive} />

                {/* After */}
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[7px] text-accent mb-0.5">AFTER</div>
                  <div className="font-mono text-[9px] md:text-[10px] text-foreground truncate font-medium">
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
                  className="tech-animate font-mono text-[7px] md:text-[8px] px-1.5 py-0.5 border border-foreground/20 text-foreground/50 bg-foreground/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Footer - Links */}
          <div className="flex items-center justify-between pt-2 border-t border-foreground/10 mt-2">
            <div className="flex items-center gap-2">
              {hasGithub && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[8px] text-foreground/50 hover:text-accent transition-colors flex items-center gap-1"
                >
                  <Github className="w-3 h-3" />
                  <span className="hidden md:inline">CODE</span>
                </a>
              )}
              {hasDemo && (
                <a
                  href={(project.links as { demo?: string }).demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[8px] text-foreground/50 hover:text-accent transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="hidden md:inline">DEMO</span>
                </a>
              )}
              {hasAppStore && (
                <span className="font-mono text-[8px] text-foreground/30">iOS</span>
              )}
            </div>

            {/* Project index indicator */}
            <div className="font-mono text-[7px] text-foreground/30">
              [{String(index + 1).padStart(2, "0")}/12]
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// NAVIGATION - MOBILE OPTIMIZED
// ─────────────────────────────────────────────────────────────

function Navigation({
  activeIndex,
  total,
  onPrev,
  onNext,
}: {
  activeIndex: number
  total: number
  onPrev: () => void
  onNext: () => void
}) {
  // Generate ASCII progress bar
  const progressChars = 12
  const filled = Math.round((activeIndex / (total - 1)) * progressChars)
  const progressBar = "▓".repeat(filled) + "░".repeat(progressChars - filled)

  return (
    <div className="flex items-center justify-between py-2 md:py-3 font-mono">
      {/* Prev button */}
      <button
        onClick={onPrev}
        disabled={activeIndex === 0}
        className={cn(
          "text-[10px] md:text-xs px-2 md:px-3 py-1 border border-foreground/20 transition-all",
          activeIndex === 0 
            ? "opacity-20 cursor-not-allowed" 
            : "hover:bg-foreground hover:text-background active:scale-95"
        )}
      >
        {"<"} PREV
      </button>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <span className="text-[8px] md:text-[10px] text-foreground/30 hidden sm:inline">
          [{progressBar}]
        </span>
        <span className="text-[10px] text-foreground/60">
          {String(activeIndex + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={activeIndex === total - 1}
        className={cn(
          "text-[10px] md:text-xs px-2 md:px-3 py-1 border border-foreground/20 transition-all",
          activeIndex === total - 1 
            ? "opacity-20 cursor-not-allowed" 
            : "hover:bg-foreground hover:text-background active:scale-95"
        )}
      >
        NEXT {">"}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MOBILE QUICK NAV
// ─────────────────────────────────────────────────────────────

function MobileQuickNav({
  activeIndex,
  total,
  onSelect
}: {
  activeIndex: number
  total: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="md:hidden flex gap-0.5 overflow-x-auto scrollbar-hide py-2 -mx-4 px-4">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={cn(
            "flex-shrink-0 w-6 h-1 transition-all",
            i === activeIndex ? "bg-accent" : 
            i < activeIndex ? "bg-foreground/30" : "bg-foreground/10"
          )}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Handle scroll snap detection
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const containerHeight = container.clientHeight
      const scrollTop = container.scrollTop
      const newIndex = Math.round(scrollTop / containerHeight)
      
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < allProjects.length) {
        setActiveIndex(newIndex)
      }
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [activeIndex])

  // Scroll to project
  const scrollToProject = useCallback((index: number) => {
    const container = scrollContainerRef.current
    if (!container) return
    
    container.scrollTo({
      top: index * container.clientHeight,
      behavior: "smooth"
    })
  }, [])

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) scrollToProject(activeIndex - 1)
  }, [activeIndex, scrollToProject])

  const handleNext = useCallback(() => {
    if (activeIndex < allProjects.length - 1) scrollToProject(activeIndex + 1)
  }, [activeIndex, scrollToProject])

  // Animate section on scroll into view
  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      )
    }, sectionRef.current)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-8 md:py-12 lg:py-16 px-4 md:px-6 bg-background"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 20px,
            currentColor 20px,
            currentColor 21px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 20px,
            currentColor 20px,
            currentColor 21px
          )`
        }} />
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <SectionHeader count={allProjects.length} activeIndex={activeIndex} />

        {/* Mobile quick nav */}
        <MobileQuickNav 
          activeIndex={activeIndex}
          total={allProjects.length}
          onSelect={scrollToProject}
        />

        {/* Main content */}
        <div className="flex gap-4 md:gap-6">
          {/* Timeline (desktop) */}
          <Timeline 
            activeIndex={activeIndex}
            projects={allProjects}
            onNodeClick={scrollToProject}
          />

          {/* Projects container */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Scroll container - HALF HEIGHT */}
            <div 
              ref={scrollContainerRef}
              className="h-[260px] md:h-[280px] lg:h-[300px] overflow-y-auto snap-y snap-mandatory scrollbar-hide"
              style={{ scrollSnapType: "y mandatory" }}
            >
              {allProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="h-full w-full"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <ProjectSlide
                    project={project}
                    index={index}
                    isActive={index === activeIndex}
                  />
                </div>
              ))}
            </div>

            {/* Navigation */}
            <Navigation
              activeIndex={activeIndex}
              total={allProjects.length}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </div>
        </div>

        {/* ASCII footer */}
        <div className="font-mono text-[8px] md:text-[10px] text-foreground/20 mt-4 overflow-hidden">
          ╚══════════════════════════════════════════════════════════════╝
        </div>
      </div>
    </section>
  )
}
