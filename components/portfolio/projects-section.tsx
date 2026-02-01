"use client"

import { useState, useRef, useEffect } from "react"
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
    growth: "Production AI Engine",
    before: "Basic ML models",
    after: "Multi-stage reasoning pipeline",
    techStack: ["Swift", "AI/ML", "Firebase"],
    achievement: "95% accuracy",
    metric: "200ms",
    links: { github: "https://github.com/ryofujimura", demo: "#" },
  },
  {
    id: "02",
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
    id: "03",
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
    id: "04",
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
    id: "05",
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
    id: "06",
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
    id: "07",
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
    id: "08",
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
    id: "09",
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
    id: "10",
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
    id: "11",
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
    id: "12",
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
]

type Project = (typeof allProjects)[0]

// ─────────────────────────────────────────────────────────────
// ASCII ELEMENTS
// ─────────────────────────────────────────────────────────────

const ASCII_CORNER_TL = `┌──`
const ASCII_CORNER_TR = `──┐`
const ASCII_CORNER_BL = `└──`
const ASCII_CORNER_BR = `──┘`

function GrowthArrow({ isActive }: { isActive: boolean }) {
  return (
    <span className={cn(
      "font-mono text-[9px] md:text-[10px] transition-all duration-300 flex-shrink-0",
      isActive ? "text-accent" : "text-foreground/20"
    )}>
      {"──►"}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────
// TIMELINE SIDEBAR
// ─────────────────────────────────────────────────────────────

function Timeline({ 
  activeIndex, 
  projects,
  progress
}: { 
  activeIndex: number
  projects: Project[]
  progress: number
}) {
  const progressHeight = `${progress * 100}%`

  return (
    <div className="hidden md:flex flex-col w-[120px] lg:w-[140px] flex-shrink-0">
      <div className="font-mono text-[7px] text-foreground/30 mb-2">
        ┌─ TIMELINE
      </div>
      
      <div className="relative pl-3 flex-1">
        {/* Track */}
        <div className="absolute left-[5px] top-0 bottom-0 w-px bg-foreground/10" />
        {/* Progress */}
        <div 
          className="absolute left-[5px] top-0 w-px bg-accent transition-all duration-100"
          style={{ height: progressHeight }}
        />

        <div className="space-y-0">
          {projects.map((project, index) => {
            const isActive = index === activeIndex
            const isPast = index < activeIndex
            const showYear = index === 0 || projects[index - 1]?.year !== project.year

            return (
              <div key={project.id}>
                {showYear && (
                  <div className="font-mono text-[7px] text-foreground/30 mb-0.5 mt-1.5 first:mt-0 -ml-3 pl-3 border-l border-foreground/20">
                    {project.year}
                  </div>
                )}

                <div
                  className={cn(
                    "py-0.5 font-mono text-[7px] transition-all -ml-3 pl-3",
                    isActive ? "text-accent border-l-2 border-accent" : 
                    isPast ? "text-foreground/30 border-l border-foreground/10" : 
                    "text-foreground/15 border-l border-transparent"
                  )}
                >
                  <span className="truncate block">{project.growth}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      <div className="font-mono text-[7px] text-foreground/30 mt-2">
        └─ END
      </div>
    </div>
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

  // Animate on active
  useEffect(() => {
    if (!isActive || !slideRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".slide-animate",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: "power2.out" }
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
        "absolute inset-0 transition-all duration-300",
        isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
      )}
    >
      <div className="h-full border border-foreground/20 bg-background relative">
        {/* ASCII corners */}
        <span className="absolute top-0 left-0 font-mono text-[7px] text-foreground/30 p-0.5">{ASCII_CORNER_TL}</span>
        <span className="absolute top-0 right-0 font-mono text-[7px] text-foreground/30 p-0.5">{ASCII_CORNER_TR}</span>
        <span className="absolute bottom-0 left-0 font-mono text-[7px] text-foreground/30 p-0.5">{ASCII_CORNER_BL}</span>
        <span className="absolute bottom-0 right-0 font-mono text-[7px] text-foreground/30 p-0.5">{ASCII_CORNER_BR}</span>

        <div className="h-full flex flex-col p-3 md:p-4">
          {/* Header */}
          <div className="slide-animate flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl md:text-2xl font-black text-foreground/10">
                {project.id}
              </span>
              <div>
                <span className="font-mono text-[7px] text-muted-foreground block">{project.year}</span>
                <span className="font-mono text-[9px] md:text-[10px] text-foreground/50">{project.title}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono text-base md:text-lg font-black text-accent">
                {project.metric}
              </div>
              <div className="font-mono text-[6px] md:text-[7px] text-muted-foreground">
                {project.achievement}
              </div>
            </div>
          </div>

          {/* Growth Focus */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="slide-animate font-mono text-[7px] text-foreground/30 mb-1">
              ├─ GROWTH
            </div>
            
            <h4 className="slide-animate font-mono text-sm md:text-base lg:text-lg font-black text-foreground tracking-tight mb-2">
              {project.growth.toUpperCase()}
            </h4>

            {/* Before → After */}
            <div className="slide-animate bg-foreground/5 border border-foreground/10 p-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[6px] text-foreground/30 mb-0.5">BEFORE</div>
                  <div className="font-mono text-[8px] md:text-[9px] text-foreground/50 truncate">
                    {project.before}
                  </div>
                </div>
                <GrowthArrow isActive={isActive} />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[6px] text-accent mb-0.5">AFTER</div>
                  <div className="font-mono text-[8px] md:text-[9px] text-foreground truncate font-medium">
                    {project.after}
                  </div>
                </div>
              </div>
            </div>

            {/* Tech */}
            <div className="slide-animate flex flex-wrap gap-1">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[6px] md:text-[7px] px-1 py-0.5 border border-foreground/15 text-foreground/40"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="slide-animate flex items-center justify-between pt-2 border-t border-foreground/10">
            <div className="flex items-center gap-2">
              {hasGithub && (
                <a href={project.links.github} target="_blank" rel="noopener noreferrer"
                  className="font-mono text-[7px] text-foreground/40 hover:text-accent transition-colors flex items-center gap-0.5">
                  <Github className="w-2.5 h-2.5" />
                  <span className="hidden sm:inline">CODE</span>
                </a>
              )}
              {hasDemo && (
                <a href={(project.links as { demo?: string }).demo} target="_blank" rel="noopener noreferrer"
                  className="font-mono text-[7px] text-foreground/40 hover:text-accent transition-colors flex items-center gap-0.5">
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
// SCROLL INDICATOR
// ─────────────────────────────────────────────────────────────

function ScrollIndicator({ progress, activeIndex, total }: { progress: number; activeIndex: number; total: number }) {
  const filled = Math.round(progress * 20)
  const bar = "█".repeat(filled) + "░".repeat(20 - filled)

  return (
    <div className="flex items-center justify-between font-mono text-[8px] md:text-[9px] py-2">
      <span className="text-foreground/30">[{bar}]</span>
      <span className="text-foreground/50">
        {String(activeIndex + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
      </span>
      <span className="text-foreground/30 text-[7px]">SCROLL ↓</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN SECTION - PINNED SCROLL
// ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const pinContainerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  // GSAP ScrollTrigger pin
  useEffect(() => {
    if (!sectionRef.current || !pinContainerRef.current) return

    const totalProjects = allProjects.length
    const ctx = gsap.context(() => {
      // Pin the section and scrub through projects
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${totalProjects * 100}%`,
        pin: pinContainerRef.current,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const prog = self.progress
          setProgress(prog)
          
          // Calculate active index based on progress
          const newIndex = Math.min(
            Math.floor(prog * totalProjects),
            totalProjects - 1
          )
          if (newIndex !== activeIndex) {
            setActiveIndex(newIndex)
          }
        },
      })

      // Title scramble animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
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
            iteration += 0.5
          }, 25)
        },
      })
    }, sectionRef.current)

    return () => ctx.revert()
  }, [activeIndex])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative bg-background mt-16 md:mt-24 lg:mt-32 mb-16 md:mb-24 lg:mb-32"
    >
      {/* Pinned container */}
      <div 
        ref={pinContainerRef}
        className="min-h-screen flex flex-col py-16 md:py-24 lg:py-32 px-4 md:px-6"
      >
        {/* Background grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 30px,currentColor 30px,currentColor 31px),
              repeating-linear-gradient(90deg,transparent,transparent 30px,currentColor 30px,currentColor 31px)`
          }} />
        </div>

        <div className="max-w-5xl mx-auto w-full relative flex flex-col flex-1">
          {/* Header */}
          <div className="mb-4 md:mb-6">
            <div className="font-mono text-[7px] md:text-[8px] text-foreground/20 mb-1 overflow-hidden">
              ╔════════════════════════════════════════════════════════════╗
            </div>
            
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="font-mono text-[7px] md:text-[8px] text-muted-foreground tracking-[0.2em]">
                  {">>>"} SECTION_04
                </p>
                <h2
                  ref={titleRef}
                  className="font-mono text-xl md:text-2xl lg:text-3xl font-black text-foreground tracking-tighter"
                >
                  PROJECTS
                </h2>
              </div>
              
              <div className="text-right font-mono">
                <div className="text-2xl md:text-3xl font-black text-foreground/5">
                  {String(activeIndex + 1).padStart(2, "0")}
                </div>
                <div className="text-[7px] text-muted-foreground">
                  /{String(allProjects.length).padStart(2, "0")}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile progress dots */}
          <div className="md:hidden flex gap-0.5 mb-3 overflow-x-auto scrollbar-hide">
            {allProjects.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex-shrink-0 w-5 h-0.5 transition-all",
                  i === activeIndex ? "bg-accent" : 
                  i < activeIndex ? "bg-foreground/30" : "bg-foreground/10"
                )}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="flex gap-4 md:gap-6 flex-1 min-h-0">
            {/* Timeline (desktop) */}
            <Timeline 
              activeIndex={activeIndex}
              projects={allProjects}
              progress={progress}
            />

            {/* Project display */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Projects container */}
              <div className="relative flex-1 h-[200px] md:h-[220px] lg:h-[240px]">
                {allProjects.map((project, index) => (
                  <ProjectSlide
                    key={project.id}
                    project={project}
                    index={index}
                    isActive={index === activeIndex}
                    total={allProjects.length}
                  />
                ))}
              </div>

              {/* Scroll indicator */}
              <ScrollIndicator 
                progress={progress}
                activeIndex={activeIndex}
                total={allProjects.length}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="font-mono text-[7px] md:text-[8px] text-foreground/20 mt-4 overflow-hidden">
            ╚════════════════════════════════════════════════════════════╝
          </div>
        </div>
      </div>
    </section>
  )
}
