"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Github } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// PROJECT DATA - CHRONOLOGICAL ORDER (oldest first)
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
    id: "03",
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

// ─────────────────────────────────────────────────────────────
// ASCII ELEMENTS
// ─────────────────────────────────────────────────────────────

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
// SECTION HEADER WITH PROJECT NAME
// ─────────────────────────────────────────────────────────────

function SectionHeader({ 
  count, 
  activeIndex, 
  projectName 
}: { 
  count: number
  activeIndex: number
  projectName: string 
}) {
  const headerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!headerRef.current || hasAnimated) return
    
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: headerRef.current,
        start: "top 90%",
        onEnter: () => {
          if (!titleRef.current) return
          setHasAnimated(true)
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ░▒▓█"
          const originalText = "PROJECT"
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
  }, [hasAnimated])

  return (
    <div ref={headerRef} className="mb-6 md:mb-8">
      {/* ASCII border */}
      <div className="font-mono text-[8px] md:text-[10px] text-foreground/20 mb-3">
        ╔════════════════════════════════════════════════════════════════════════╗
      </div>
      
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[8px] md:text-[10px] text-muted-foreground tracking-[0.2em] mb-1">
            {">>>"} SECTION_04
          </p>
          <h2 className="font-mono text-xl md:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
            <span ref={titleRef}>PROJECT</span>
            <span className="text-foreground/30"> — </span>
            <span className="text-accent truncate">"{projectName}"</span>
          </h2>
        </div>
        
        <div className="text-right font-mono flex-shrink-0">
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
// TIMELINE - REVERSED (2022 → 2025)
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
  const connectorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!connectorRef.current) return
    const progress = projects.length > 1 ? (activeIndex / (projects.length - 1)) * 100 : 0
    
    gsap.to(connectorRef.current, {
      height: `${progress}%`,
      duration: 0.4,
      ease: "power2.out"
    })
  }, [activeIndex, projects.length])

  return (
    <div className="hidden lg:flex flex-col w-[160px] xl:w-[180px] flex-shrink-0">
      <div className="font-mono text-[8px] text-foreground/30 mb-2">
        ┌─ TIMELINE [2022→NOW]
      </div>
      
      <div className="relative pl-3 flex-1">
        {/* Track */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-foreground/10" />
        <div 
          ref={connectorRef}
          className="absolute left-0 top-0 w-px bg-accent"
          style={{ height: "0%" }}
        />

        {/* Nodes */}
        <div className="space-y-0.5">
          {projects.map((project, index) => {
            const isActive = index === activeIndex
            const isPast = index < activeIndex
            const showYear = index === 0 || projects[index - 1]?.year !== project.year

            return (
              <div key={project.id}>
                {showYear && (
                  <div className="font-mono text-[8px] text-foreground/40 mb-1 mt-3 first:mt-0 -ml-1.5 border-l-2 border-foreground/20 pl-2">
                    [{project.year}]
                  </div>
                )}

                <button
                  onClick={() => onNodeClick(index)}
                  className={cn(
                    "w-full text-left py-0.5 font-mono text-[8px] transition-all relative group",
                    "-ml-1.5 pl-2",
                    isActive ? "text-accent border-l-2 border-accent font-bold" : 
                    isPast ? "text-foreground/50 border-l border-foreground/30 hover:text-foreground/70" : 
                    "text-foreground/20 border-l border-transparent hover:text-foreground/40 hover:border-foreground/20"
                  )}
                >
                  <span className="truncate block">{project.title}</span>
                </button>
              </div>
            )
          })}
        </div>
      </div>
      
      <div className="font-mono text-[8px] text-foreground/30 mt-2">
        └─ NOW
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT CARD - CENTERED, COMPACT
// ─────────────────────────────────────────────────────────────

function ProjectCard({ 
  project, 
  index,
  total,
  isActive 
}: { 
  project: Project
  index: number
  total: number
  isActive: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  // Animate content when active
  useEffect(() => {
    if (!isActive || !cardRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".card-animate",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      )
    }, cardRef.current)

    return () => ctx.revert()
  }, [isActive])

  const hasGithub = project.links.github
  const hasDemo = "demo" in project.links
  const hasAppStore = "appStore" in project.links

  return (
    <div 
      ref={cardRef}
      className={cn(
        "absolute inset-0 flex items-center justify-center transition-all duration-500 p-4",
        isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="w-full max-w-2xl border border-foreground/30 bg-background relative">
        {/* ASCII corners */}
        <span className="absolute -top-px -left-px font-mono text-[8px] text-foreground/40">┌──</span>
        <span className="absolute -top-px -right-px font-mono text-[8px] text-foreground/40">──┐</span>
        <span className="absolute -bottom-px -left-px font-mono text-[8px] text-foreground/40">└──</span>
        <span className="absolute -bottom-px -right-px font-mono text-[8px] text-foreground/40">──┘</span>

        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="card-animate flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl md:text-3xl font-black text-foreground/10">
                {project.id}
              </span>
              <div>
                <span className="font-mono text-[8px] text-muted-foreground block">{project.year}</span>
                <span className="font-mono text-xs text-foreground/60">{project.title}</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-mono text-lg md:text-xl font-black text-accent">
                {project.metric}
              </div>
              <div className="font-mono text-[8px] text-muted-foreground">
                {project.achievement}
              </div>
            </div>
          </div>

          {/* Growth Focus */}
          <div className="card-animate mb-4">
            <div className="font-mono text-[8px] text-foreground/40 mb-1">├─ GROWTH_FOCUS</div>
            <h3 className="font-mono text-lg md:text-xl lg:text-2xl font-black text-foreground tracking-tight">
              {project.growth.toUpperCase()}
            </h3>
          </div>

          {/* Before → After */}
          <div className="card-animate bg-foreground/5 border border-foreground/10 p-3 md:p-4 mb-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[7px] text-foreground/40 mb-0.5">BEFORE</div>
                <div className="font-mono text-[10px] md:text-xs text-foreground/60">
                  {project.before}
                </div>
              </div>
              <GrowthArrow isActive={isActive} />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[7px] text-accent mb-0.5">AFTER</div>
                <div className="font-mono text-[10px] md:text-xs text-foreground font-medium">
                  {project.after}
                </div>
              </div>
            </div>
          </div>

          {/* Tech stack */}
          <div className="card-animate flex flex-wrap gap-1.5 mb-4">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[8px] px-2 py-0.5 border border-foreground/20 text-foreground/50 bg-foreground/5"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="card-animate flex items-center justify-between pt-3 border-t border-foreground/10">
            <div className="flex items-center gap-3">
              {hasGithub && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[9px] text-foreground/50 hover:text-accent transition-colors flex items-center gap-1"
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
                  className="font-mono text-[9px] text-foreground/50 hover:text-accent transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>DEMO</span>
                </a>
              )}
              {hasAppStore && (
                <span className="font-mono text-[9px] text-foreground/30">iOS</span>
              )}
            </div>

            <div className="font-mono text-[8px] text-foreground/30">
              [{String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}]
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MOBILE DOTS
// ─────────────────────────────────────────────────────────────

function MobileDots({
  activeIndex,
  total,
  onSelect
}: {
  activeIndex: number
  total: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="lg:hidden flex justify-center gap-1 py-3">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={cn(
            "w-6 h-1 transition-all",
            i === activeIndex ? "bg-accent" : 
            i < activeIndex ? "bg-foreground/30" : "bg-foreground/10"
          )}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// NAVIGATION
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
  const progressChars = 12
  const filled = Math.round((activeIndex / (total - 1)) * progressChars)
  const progressBar = "▓".repeat(filled) + "░".repeat(progressChars - filled)

  return (
    <div className="flex items-center justify-center gap-4 py-4 font-mono">
      <button
        onClick={onPrev}
        disabled={activeIndex === 0}
        className={cn(
          "text-[10px] md:text-xs px-3 py-1.5 border border-foreground/20 transition-all",
          activeIndex === 0 
            ? "opacity-20 cursor-not-allowed" 
            : "hover:bg-foreground hover:text-background active:scale-95"
        )}
      >
        {"<"} PREV
      </button>

      <div className="flex items-center gap-2">
        <span className="text-[8px] text-foreground/30 hidden md:inline">
          [{progressBar}]
        </span>
        <span className="text-[10px] text-foreground/60">
          {String(activeIndex + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
      </div>

      <button
        onClick={onNext}
        disabled={activeIndex === total - 1}
        className={cn(
          "text-[10px] md:text-xs px-3 py-1.5 border border-foreground/20 transition-all",
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
// MAIN SECTION - GSAP PINNED
// ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const pinContainerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  // GSAP ScrollTrigger pin
  useEffect(() => {
    if (!sectionRef.current || !pinContainerRef.current || !triggerRef.current) return

    const ctx = gsap.context(() => {
      const totalProjects = allProjects.length
      
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: "top top",
        end: `+=${totalProjects * 100}%`,
        pin: pinContainerRef.current,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress
          const newIndex = Math.min(
            Math.floor(progress * totalProjects),
            totalProjects - 1
          )
          if (newIndex !== activeIndex) {
            setActiveIndex(newIndex)
          }
        },
      })
    }, sectionRef.current)

    return () => ctx.revert()
  }, [activeIndex])

  // Click to scroll to project
  const scrollToProject = useCallback((index: number) => {
    if (!triggerRef.current) return
    
    const triggerTop = triggerRef.current.getBoundingClientRect().top + window.scrollY
    const scrollDistance = allProjects.length * window.innerHeight
    const targetScroll = triggerTop + (index / allProjects.length) * scrollDistance
    
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth"
    })
  }, [])

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) scrollToProject(activeIndex - 1)
  }, [activeIndex, scrollToProject])

  const handleNext = useCallback(() => {
    if (activeIndex < allProjects.length - 1) scrollToProject(activeIndex + 1)
  }, [activeIndex, scrollToProject])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative bg-background"
    >
      {/* Trigger element for scroll distance */}
      <div ref={triggerRef}>
        {/* Pinned container */}
        <div 
          ref={pinContainerRef}
          className="min-h-screen flex flex-col"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.015]">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 30px,
                currentColor 30px,
                currentColor 31px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 30px,
                currentColor 30px,
                currentColor 31px
              )`
            }} />
          </div>

          <div className="flex-1 flex flex-col px-4 md:px-6 py-8 md:py-12">
            <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
              {/* Header with project name */}
              <SectionHeader 
                count={allProjects.length} 
                activeIndex={activeIndex}
                projectName={allProjects[activeIndex].title}
              />

              {/* Mobile dots */}
              <MobileDots 
                activeIndex={activeIndex}
                total={allProjects.length}
                onSelect={scrollToProject}
              />

              {/* Main content - centered */}
              <div className="flex-1 flex gap-6 lg:gap-8">
                {/* Timeline (desktop) */}
                <Timeline 
                  activeIndex={activeIndex}
                  projects={allProjects}
                  onNodeClick={scrollToProject}
                />

                {/* Project cards container - centered */}
                <div className="flex-1 relative min-h-[280px] md:min-h-[320px]">
                  {allProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                      total={allProjects.length}
                      isActive={index === activeIndex}
                    />
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <Navigation
                activeIndex={activeIndex}
                total={allProjects.length}
                onPrev={handlePrev}
                onNext={handleNext}
              />

              {/* ASCII footer */}
              <div className="font-mono text-[8px] md:text-[10px] text-foreground/20 text-center">
                ╚════════════════════════════════════════════════════════════════════════╝
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
