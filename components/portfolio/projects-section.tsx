"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Github, ChevronRight, ChevronLeft, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// ASCII GRAPHICS
// ─────────────────────────────────────────────────────────────

const ASCII_ARROW = `──────►`

const ASCII_GROWTH = `
    ▲
   ▲▲
  ▲▲▲
 ▲▲▲▲
`.trim()

// ─────────────────────────────────────────────────────────────
// SKILL FILTER GROUPS
// ─────────────────────────────────────────────────────────────

const SKILL_GROUPS = {
  "Mobile": ["Swift", "SwiftUI", "Kotlin", "WatchOS", "AVFoundation", "App Store"],
  "Web": ["React", "React 19", "Next.js", "Tailwind", "WebSocket", "Vercel"],
  "Cloud": ["Firebase", "Firestore", "Firebase RTDB", "Cloud Functions", "Node.js", "Real-time", "Google APIs"],
  "AI/ML": ["AI/ML", "AI routing", "PyTorch", "Vision", "llama.cpp", "GGUF"],
  "Python": ["Python", "Flask", "scheduling", "automation", "Instagram"],
}

type SkillGroup = keyof typeof SKILL_GROUPS

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

// ─────────────────────────────────────────────────────────────
// IMAGE GALLERY - MOBILE: TAP TO CYCLE, DESKTOP: VERTICAL STRIPES
// ─────────────────────────────────────────────────────────────

function ImageGallery({ images, projectId, projectTitle }: { images: string[]; projectId: string; projectTitle: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  // Handle tap to cycle on mobile
  const handleTap = useCallback(() => {
    if (images.length > 1) {
      setActiveIndex((prev) => (prev + 1) % images.length)
    }
  }, [images.length])

  // If only one image, show it full width
  if (images.length === 1) {
    return (
      <div className="relative w-full h-full group">
        <img
          src={images[0]}
          alt={projectTitle}
          className="w-full h-full object-cover opacity-90 grayscale group-hover:grayscale-0 transition-all duration-500"
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <>
      {/* Mobile: Tap to cycle through images */}
      <div
        className="md:hidden relative w-full h-full cursor-pointer"
        onClick={handleTap}
      >
        <img
          src={images[activeIndex]}
          alt={`${projectTitle} - ${activeIndex + 1}`}
          className="w-full h-full object-cover opacity-90 grayscale active:grayscale-0 transition-all duration-300"
          loading="lazy"
        />
        {/* Dot indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setActiveIndex(idx) }}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                idx === activeIndex ? "bg-accent scale-125" : "bg-foreground/40"
              )}
              aria-label={`View image ${idx + 1}`}
            />
          ))}
        </div>
        {/* Tap hint */}
        <div className="absolute top-2 right-2 font-mono text-[9px] text-background bg-foreground/60 px-1.5 py-0.5 z-10">
          TAP
        </div>
      </div>

      {/* Desktop: Vertical stripe hover */}
      <div
        ref={galleryRef}
        className="hidden md:flex relative w-full h-full"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {images.map((image, index) => {
          const isHovered = hoveredIndex === index
          const hasHover = hoveredIndex !== null
          
          let widthPercent: number
          if (hasHover) {
            widthPercent = isHovered ? 70 : 30 / (images.length - 1)
          } else {
            widthPercent = 100 / images.length
          }

          return (
            <div
              key={`${projectId}-img-${index}`}
              className={cn(
                "relative h-full overflow-hidden transition-all duration-300 ease-out",
                "border-r border-foreground/20 last:border-r-0"
              )}
              style={{ width: `${widthPercent}%` }}
              onMouseEnter={() => setHoveredIndex(index)}
            >
              <img
                src={image}
                alt={`${projectTitle} - ${index + 1}`}
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  isHovered ? "opacity-100 scale-105 grayscale-0" : "opacity-80 grayscale"
                )}
                loading="lazy"
              />
              {!isHovered && hasHover && (
                <div className="absolute inset-0 bg-foreground/10 flex items-center justify-center">
                  <span className="font-mono text-[8px] text-foreground/60" style={{ writingMode: 'vertical-rl' }}>
                    {index + 1}
                  </span>
                </div>
              )}
            </div>
          )
        })}
        <div className="absolute bottom-1 right-1 font-mono text-[8px] text-background bg-foreground/70 px-1 py-0.5 z-10">
          {images.length}
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT CARD - MOBILE FIRST
// ─────────────────────────────────────────────────────────────

function ProjectCard({ project, index, isMobileVertical }: { project: Project; index: number; isMobileVertical?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const growthRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!cardRef.current) return
    const el = cardRef.current

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        }
      )

      if (growthRef.current) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const originalText = project.growth.toUpperCase()
        let iteration = 0

        ScrollTrigger.create({
          trigger: growthRef.current,
          start: "top 92%",
          onEnter: () => {
            const interval = setInterval(() => {
              if (!growthRef.current) return clearInterval(interval)
              growthRef.current.textContent = originalText
                .split("")
                .map((char, i) => {
                  if (char === " ") return " "
                  if (i < iteration) return char
                  return chars[Math.floor(Math.random() * chars.length)]
                })
                .join("")
              if (iteration >= originalText.length) clearInterval(interval)
              iteration += 0.5
            }, 25)
          },
        })
      }
    }, el)

    return () => ctx.revert()
  }, [project.growth])

  const hasGithub = project.links.github
  const hasDemo = "demo" in project.links
  const hasAppStore = "appStore" in project.links
  const hasPlayStore = "playStore" in project.links

  return (
    <article
      ref={cardRef}
      className={cn(
        "relative bg-background border-2 border-foreground",
        // Mobile: full width, Desktop: fixed width for horizontal scroll
        isMobileVertical ? "w-full" : "w-full md:w-[340px] lg:w-[380px] flex-shrink-0"
      )}
    >
      {/* Year badge */}
      <div className="absolute -top-2.5 left-3 bg-foreground text-background px-2 py-0.5 z-10">
        <span className="font-mono text-[10px] font-bold tracking-wider">{project.year}</span>
      </div>

      {/* Image Gallery - Large, prominent */}
      <div className="relative h-44 md:h-52 lg:h-56 border-b-2 border-foreground overflow-hidden bg-muted">
        <ImageGallery 
          images={project.images} 
          projectId={project.id}
          projectTitle={project.title}
        />
        {/* Project number */}
        <div className="absolute top-2 left-2 font-mono text-[10px] text-background bg-foreground/80 px-1.5 py-0.5 z-10">
          {project.id}
        </div>
      </div>

      {/* Content - Compact but readable */}
      <div className="p-3">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <span className="font-mono text-[10px] text-muted-foreground block mb-0.5 truncate">
              {project.title}
            </span>
            <h3>
              <span
                ref={growthRef}
                className="font-mono text-sm md:text-base font-black text-foreground leading-tight block"
              >
                {project.growth.toUpperCase()}
              </span>
            </h3>
          </div>
          {/* Achievement badge */}
          <span className="font-mono text-[9px] font-bold text-accent bg-accent/10 px-1.5 py-1 flex-shrink-0">
            {project.achievement}
          </span>
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1 mb-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-[9px] px-1.5 py-0.5 border border-foreground/30 text-foreground/70"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links - Large touch targets */}
        <div className="flex items-center gap-3 pt-2 border-t border-foreground/15">
          {hasGithub && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-1.5 font-mono text-[10px] text-foreground active:text-accent transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>CODE</span>
            </a>
          )}
          {hasDemo && (
            <a
              href={(project.links as { demo?: string }).demo}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-1.5 font-mono text-[10px] text-foreground active:text-accent transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>DEMO</span>
            </a>
          )}
          {hasAppStore && (
            <span className="min-h-[44px] inline-flex items-center font-mono text-[10px] text-muted-foreground px-2">iOS</span>
          )}
          {hasPlayStore && (
            <span className="min-h-[44px] inline-flex items-center font-mono text-[10px] text-muted-foreground px-2">Android</span>
          )}
        </div>
      </div>
    </article>
  )
}

// ─────────────────────────────────────────────────────────────
// FILTER BAR - MOBILE: HORIZONTAL SCROLL CHIPS
// ─────────────────────────────────────────────────────────────

function FilterBar({
  selectedGroups,
  onToggleGroup,
  onClear,
}: {
  selectedGroups: SkillGroup[]
  onToggleGroup: (g: SkillGroup) => void
  onClear: () => void
}) {
  const groups = Object.keys(SKILL_GROUPS) as SkillGroup[]

  return (
    <div className="mb-4">
      {/* Mobile: Horizontal scroll chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible">
        {/* All button */}
        <button
          onClick={onClear}
          className={cn(
            "min-h-[44px] px-4 font-mono text-xs whitespace-nowrap flex-shrink-0",
            "border-2 transition-all",
            selectedGroups.length === 0
              ? "border-foreground bg-foreground text-background"
              : "border-foreground/30 text-foreground/60 active:bg-foreground/10"
          )}
        >
          ALL
        </button>
        {groups.map((group) => {
          const isSelected = selectedGroups.includes(group)
          return (
            <button
              key={group}
              onClick={() => onToggleGroup(group)}
              className={cn(
                "min-h-[44px] px-4 font-mono text-xs whitespace-nowrap flex-shrink-0",
                "border-2 transition-all",
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/30 text-foreground/60 active:bg-foreground/10"
              )}
            >
              {group}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────

function SectionHeader({ count }: { count: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!ref.current || !titleRef.current) return
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
    }, ref.current)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="mb-4 md:mb-6">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] text-muted-foreground tracking-[0.15em] mb-0.5">— 04</p>
          <h2
            ref={titleRef}
            className="font-mono text-2xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tighter leading-none"
          >
            PROJECTS
          </h2>
        </div>
        <span className="font-mono text-xl md:text-3xl lg:text-4xl font-black text-foreground/10 tabular-nums">
          {String(count).padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MOBILE: VERTICAL LIST
// ─────────────────────────────────────────────────────────────

function MobileProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="space-y-6">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} isMobileVertical />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// DESKTOP: DRAGGABLE HORIZONTAL TIMELINE
// ─────────────────────────────────────────────────────────────

function DesktopTimeline({ projects }: { projects: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    if (!scrollRef.current) return
    const scroll = scrollRef.current

    const handleScroll = () => {
      const maxScroll = scroll.scrollWidth - scroll.clientWidth
      const progress = maxScroll > 0 ? scroll.scrollLeft / maxScroll : 0
      setScrollProgress(progress)
    }

    scroll.addEventListener("scroll", handleScroll)
    return () => scroll.removeEventListener("scroll", handleScroll)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
    scrollRef.current.style.cursor = "grabbing"
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (scrollRef.current) scrollRef.current.style.cursor = "grab"
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    if (scrollRef.current) scrollRef.current.style.cursor = "grab"
  }

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll(".project-card")
      cards?.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: i * 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        )
      })
    }, containerRef.current)
    return () => ctx.revert()
  }, [projects])

  return (
    <div ref={containerRef} className="relative">
      {/* Progress bar */}
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-[10px] text-accent">NOW</span>
        <div className="flex-1 h-1 bg-foreground/10 relative">
          <div
            className="absolute inset-y-0 left-0 bg-accent/60 transition-all duration-150"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <span className="font-mono text-[10px] text-foreground/50">2022</span>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        className={cn(
          "flex gap-6 overflow-x-auto pb-4 scrollbar-hide cursor-grab select-none",
          isDragging && "cursor-grabbing"
        )}
        style={{ scrollSnapType: isDragging ? "none" : "x mandatory" }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Start marker */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center w-12">
          <pre className="font-mono text-[7px] text-foreground/30 select-none whitespace-pre leading-tight">{ASCII_GROWTH}</pre>
          <span className="font-mono text-[9px] text-accent mt-1">▼</span>
        </div>

        {projects.map((project, index) => (
          <div
            key={project.id}
            className="project-card flex-shrink-0"
            style={{ scrollSnapAlign: "start" }}
          >
            <ProjectCard project={project} index={index} />
          </div>
        ))}

        {/* End marker */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center w-16">
          <span className="font-mono text-[9px] text-foreground/40">2022</span>
          <pre className="font-mono text-[8px] text-foreground/30 select-none mt-1">{ASCII_ARROW}</pre>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="mt-2 flex items-center justify-center gap-2 font-mono text-[9px] text-foreground/40">
        <ChevronLeft className="w-3 h-3" />
        <span>DRAG OR SCROLL</span>
        <ChevronRight className="w-3 h-3" />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [selectedGroups, setSelectedGroups] = useState<SkillGroup[]>(["AI/ML"])
  const sectionRef = useRef<HTMLElement>(null)

  const toggleGroup = useCallback((group: SkillGroup) => {
    setSelectedGroups((prev) =>
      // Single selection: toggle off if same, otherwise select only this one
      prev.includes(group) ? [] : [group]
    )
  }, [])

  const clearFilters = useCallback(() => {
    setSelectedGroups([])
  }, [])

  const selectedSkills = useMemo(() => {
    if (selectedGroups.length === 0) return []
    return selectedGroups.flatMap((group) => SKILL_GROUPS[group])
  }, [selectedGroups])

  const filteredProjects = useMemo(() => {
    if (selectedSkills.length === 0) return allProjects
    return allProjects.filter((project) =>
      project.skills.some((skill) => selectedSkills.includes(skill))
    )
  }, [selectedSkills])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-6 md:py-12 lg:py-16 px-4 md:px-6 bg-background overflow-hidden"
    >
      {/* Background pattern - hidden on mobile for performance */}
      <div className="hidden md:block absolute inset-0 pointer-events-none opacity-[0.015]">
        <svg className="w-full h-full" preserveAspectRatio="none">
          {[...Array(30)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={`${(i + 1) * 3.33}%`}
              y1="0"
              x2={`${(i + 1) * 3.33}%`}
              y2="100%"
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <SectionHeader count={allProjects.length} />

        <FilterBar
          selectedGroups={selectedGroups}
          onToggleGroup={toggleGroup}
          onClear={clearFilters}
        />

        {/* Result count */}
        <div className="flex items-center gap-2 mb-4 md:mb-6 font-mono text-[10px] text-muted-foreground">
          <span className="text-foreground font-bold">{filteredProjects.length}</span>
          <span>/</span>
          <span>{allProjects.length}</span>
          <span>projects</span>
          {selectedGroups.length > 0 && <span className="text-accent">• filtered</span>}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-foreground/20">
            <p className="font-mono text-sm text-foreground/50 mb-3">No projects match filter</p>
            <button
              onClick={clearFilters}
              className="min-h-[44px] font-mono text-xs border-2 border-foreground px-4 active:bg-foreground active:text-background transition-colors"
            >
              SHOW ALL
            </button>
          </div>
        ) : (
          <>
            {/* Mobile: Vertical list */}
            <div className="md:hidden">
              <MobileProjectList projects={filteredProjects} />
            </div>
            {/* Desktop: Horizontal timeline */}
            <div className="hidden md:block">
              <DesktopTimeline projects={filteredProjects} />
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-6 md:mt-10 text-center">
          <a
            href="#contact"
            className="min-h-[44px] inline-flex items-center justify-center gap-2 font-mono text-xs text-muted-foreground active:text-foreground transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
            <span>NEXT</span>
          </a>
        </div>
      </div>
    </section>
  )
}
