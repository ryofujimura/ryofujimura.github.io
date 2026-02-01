"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Github, ChevronRight, ChevronLeft, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// ASCII GRAPHICS
// ─────────────────────────────────────────────────────────────

const ASCII_TIMELINE = `═══════════════════════════════════════════════════════════════════════════════`

const ASCII_NODE = `
┌───┐
│ ● │
└───┘
`.trim()

const ASCII_ARROW = `──────►`

const ASCII_GROWTH = `
    ▲
   ▲▲▲
  ▲▲▲▲▲
 ▲▲▲▲▲▲▲
`.trim()

// ─────────────────────────────────────────────────────────────
// SKILL FILTER GROUPS
// ─────────────────────────────────────────────────────────────

const SKILL_GROUPS = {
  "Mobile": ["Swift", "SwiftUI", "Kotlin", "WatchOS", "AVFoundation", "App Store", "probability"],
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
    image: "/images/default_image.png",
    growth: "Production AI Engine",
    learned: ["Multi-stage AI", "95% accuracy tuning", "High-throughput systems"],
    techStack: ["Swift", "AI/ML", "Firebase"],
    achievement: "95% accuracy, 200ms",
    description: "Most advanced AI project: multi-stage reasoning with production-grade performance.",
    skills: ["Swift", "SwiftUI", "Firebase", "AI/ML", "Google APIs"],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
  },
  {
    id: "02",
    year: "2025",
    title: "Whiteboard AI",
    image: "/images/whiteboardai.png",
    growth: "Vision ML + Collab",
    learned: ["PyTorch vision", "CRDT patterns", "WebSocket pipelines"],
    techStack: ["PyTorch", "WebSocket", "React"],
    achievement: "150ms inference",
    description: "First computer vision project with real-time collaborative features.",
    skills: ["PyTorch", "Vision", "WebSocket", "React"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "03",
    year: "2025",
    title: "Research Lab PM",
    image: "/images/default_image.png",
    growth: "Serverless + AI Routing",
    learned: ["Cloud Functions", "Dynamic AI routing", "Multi-tenant systems"],
    techStack: ["Cloud Functions", "Firebase"],
    achievement: "<200ms response",
    description: "Built serverless orchestration for 30+ researchers with AI-powered workflows.",
    skills: ["Cloud Functions", "Firebase", "AI routing", "Node.js"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "04",
    year: "2025",
    title: "CyberEdu",
    image: "/images/CyberEdu.png",
    growth: "Network Resilience",
    learned: ["Offline-first patterns", "Sync strategies", "Error recovery"],
    techStack: ["Swift", "Kotlin", "Firebase"],
    achievement: "99%+ sync reliability",
    description: "Mastered cross-device sync across unstable networks.",
    skills: ["Swift", "Kotlin", "Firebase", "Real-time"],
    links: { github: "https://github.com/ryofujimura", appStore: "#", playStore: "#" },
  },
  {
    id: "05",
    year: "2025",
    title: "HTIC Shuttle",
    image: "/images/schedule.jpg",
    growth: "Real-Time Systems",
    learned: ["Firebase RTDB", "Event serialization", "Cross-platform native"],
    techStack: ["Swift", "Kotlin", "Firebase"],
    achievement: "70% fewer conflicts",
    description: "First cross-platform native app with real-time synchronization.",
    skills: ["Swift", "Kotlin", "Firebase RTDB", "Real-time"],
    links: { github: "https://github.com/ryofujimura", appStore: "#", playStore: "#" },
  },
  // 2024
  {
    id: "06",
    year: "2024",
    title: "With (Local LLM)",
    image: "/images/default_image.png",
    growth: "On-Device AI",
    learned: ["llama.cpp integration", "Model quantization", "Memory optimization"],
    techStack: ["Swift", "llama.cpp", "GGUF"],
    achievement: "<50ms/token, 2GB saved",
    description: "First local AI project. Learned model optimization and efficient inference.",
    skills: ["Swift", "llama.cpp", "GGUF", "SwiftUI"],
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "07",
    year: "2024",
    title: "Saboriendo Platform",
    image: "/images/default_image.png",
    growth: "Full-Stack + Mobile",
    learned: ["React 19 features", "Cross-platform sync", "Barcode systems"],
    techStack: ["React 19", "SwiftUI", "Firebase"],
    achievement: "50% faster lookup",
    description: "First full-stack project combining web and mobile with real-time sync.",
    skills: ["React 19", "SwiftUI", "Firebase", "Firestore", "AVFoundation"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "08",
    year: "2024",
    title: "Portfolio Website",
    image: "/images/homepage.png",
    growth: "Modern Web Stack",
    learned: ["Next.js App Router", "GSAP animations", "Performance tuning"],
    techStack: ["React", "Next.js", "GSAP"],
    achievement: "40-60% faster load",
    description: "Deep dive into React ecosystem with advanced animations and optimization.",
    skills: ["React", "Next.js", "Tailwind", "Vercel"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "09",
    year: "2024",
    title: "Matcha Time",
    image: "/images/matchatime_1.jpg",
    growth: "App Store Launch",
    learned: ["SwiftUI patterns", "App Store submission", "4-week sprint"],
    techStack: ["Swift", "SwiftUI"],
    achievement: "50 users at launch",
    description: "First iOS app published to App Store. Learned complete app lifecycle.",
    skills: ["Swift", "SwiftUI", "App Store"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
  // 2023
  {
    id: "10",
    year: "2023",
    title: "Schedule Mastermind",
    image: "/images/schedule.jpg",
    growth: "Backend Architecture",
    learned: ["Flask routing", "Conflict algorithms", "Database design"],
    techStack: ["Python", "Flask"],
    achievement: "500+ courses, 70% fewer errors",
    description: "First production backend handling complex scheduling logic for university courses.",
    skills: ["Python", "Flask", "scheduling"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "11",
    year: "2023",
    title: "Shohei Home Ground",
    image: "/images/shoheihomeground_1.jpg",
    growth: "Python Automation",
    learned: ["API automation", "Content scheduling", "Growth hacking"],
    techStack: ["Python", "Instagram API"],
    achievement: "11K followers, 685 posts",
    description: "Automated content pipeline saving 2+ hours daily. First major automation project.",
    skills: ["Python", "automation", "Instagram"],
    links: { instagram: "#", youtube: "#" },
  },
  // 2022 - Oldest
  {
    id: "12",
    year: "2022",
    title: "Poker Percentage",
    image: "/images/poker.png",
    growth: "First WatchOS App",
    learned: ["WatchKit basics", "Precomputed tables", "Real-time probability"],
    techStack: ["Swift", "WatchOS"],
    achievement: "<10ms lookup speed",
    description: "Built first watchOS app with precomputed probability tables for instant equity calculations.",
    skills: ["Swift", "WatchOS", "probability"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
]

type Project = (typeof allProjects)[0]

// ─────────────────────────────────────────────────────────────
// TECHNICAL LINE SVG
// ─────────────────────────────────────────────────────────────

function TechLines({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const lines = ref.current.querySelectorAll("line, path")
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { strokeDasharray: "0 200", opacity: 0 },
        {
          strokeDasharray: "200 0",
          opacity: 1,
          duration: 1,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        }
      )
    }, ref.current)
    return () => ctx.revert()
  }, [])

  return (
    <svg
      ref={ref}
      className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path d="M0 8 L8 0" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path d="M92 0 L100 8" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path d="M0 92 L8 100" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path d="M92 100 L100 92" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="10" y1="0" x2="30" y2="0" stroke="currentColor" strokeWidth="0.3" opacity="0.2" />
      <line x1="70" y1="100" x2="90" y2="100" stroke="currentColor" strokeWidth="0.3" opacity="0.2" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT CARD - MOBILE OPTIMIZED
// ─────────────────────────────────────────────────────────────

function ProjectCard({ project, index, isActive }: { project: Project; index: number; isActive?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const growthRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!cardRef.current) return
    const el = cardRef.current

    const ctx = gsap.context(() => {
      // Card entrance
      gsap.fromTo(
        el,
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }
      )

      // Growth text scramble
      if (growthRef.current) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const originalText = project.growth.toUpperCase()
        let iteration = 0

        ScrollTrigger.create({
          trigger: growthRef.current,
          start: "top 90%",
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

      // Stagger elements
      const items = el.querySelectorAll(".reveal")
      gsap.fromTo(
        items,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      )
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
        "relative",
        "bg-background border-2 border-foreground",
        "w-full",
        // Mobile: full width vertical stack
        // Desktop: fixed width for horizontal scroll
        "lg:w-[380px] lg:flex-shrink-0"
      )}
    >
      <TechLines className="opacity-40" />

      {/* Year marker - mobile top badge */}
      <div className="absolute -top-3 left-4 sm:left-6 bg-foreground text-background px-2 py-0.5 z-10">
        <span className="font-mono text-[10px] sm:text-xs font-bold tracking-wider">{project.year}</span>
      </div>

      {/* Image placeholder */}
      <div className="relative h-32 sm:h-40 lg:h-36 border-b-2 border-foreground overflow-hidden bg-muted">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover opacity-80 grayscale hover:grayscale-0 transition-all duration-500"
          loading="lazy"
        />
        {/* Scan lines overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="h-px bg-foreground/30" style={{ marginTop: `${i * 5}%` }} />
          ))}
        </div>
        {/* Project number */}
        <div className="absolute bottom-2 right-2 font-mono text-[10px] text-background bg-foreground/80 px-1.5 py-0.5">
          {project.id}/12
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Growth headline - MAIN FOCUS */}
        <div className="mb-3">
          <span className="reveal font-mono text-[9px] sm:text-[10px] text-accent tracking-[0.2em] block mb-1">
            GROWTH
          </span>
          <h3>
            <span
              ref={growthRef}
              className="font-mono text-lg sm:text-xl lg:text-2xl font-black text-foreground leading-tight block"
            >
              {project.growth.toUpperCase()}
            </span>
          </h3>
        </div>

        {/* Project title */}
        <p className="reveal font-mono text-xs sm:text-sm text-muted-foreground mb-3">
          {project.title}
        </p>

        {/* What I learned - ASCII bullets */}
        <div className="reveal mb-3">
          <span className="font-mono text-[8px] sm:text-[9px] text-foreground/50 tracking-wider block mb-1.5">
            LEARNED:
          </span>
          <div className="space-y-1">
            {project.learned.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="font-mono text-[10px] text-accent select-none">▸</span>
                <span className="font-mono text-[10px] sm:text-xs text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement highlight */}
        <div className="reveal mb-3 p-2 border border-dashed border-foreground/30 bg-foreground/5">
          <span className="font-mono text-[8px] text-foreground/50 tracking-wider block mb-0.5">RESULT:</span>
          <span className="font-mono text-xs sm:text-sm font-bold text-foreground">{project.achievement}</span>
        </div>

        {/* Tech stack pills */}
        <div className="reveal flex flex-wrap gap-1.5 mb-3">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-[8px] sm:text-[9px] px-1.5 py-0.5 border border-foreground/40 text-foreground/70"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links row */}
        <div className="reveal flex flex-wrap items-center gap-2 pt-2 border-t border-foreground/20">
          {hasGithub && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target inline-flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-foreground hover:text-accent transition-colors"
            >
              <Github className="w-3 h-3" />
              <span>SRC</span>
            </a>
          )}
          {hasDemo && (
            <a
              href={(project.links as { demo?: string }).demo}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target inline-flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-foreground hover:text-accent transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>DEMO</span>
            </a>
          )}
          {hasAppStore && (
            <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground">iOS</span>
          )}
          {hasPlayStore && (
            <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground">Android</span>
          )}
        </div>
      </div>
    </article>
  )
}

// ─────────────────────────────────────────────────────────────
// TIMELINE NODE
// ─────────────────────────────────────────────────────────────

function TimelineNode({ year, isFirst, isLast }: { year: string; isFirst?: boolean; isLast?: boolean }) {
  return (
    <div className="hidden lg:flex flex-col items-center">
      {/* Line before */}
      {!isFirst && <div className="w-px h-4 bg-foreground/30" />}
      
      {/* Node */}
      <div className="w-8 h-8 border-2 border-foreground bg-background flex items-center justify-center">
        <div className="w-2 h-2 bg-accent" />
      </div>
      
      {/* Year label */}
      <span className="font-mono text-[10px] text-foreground/60 mt-1">{year}</span>
      
      {/* Line after */}
      {!isLast && <div className="w-px h-4 bg-foreground/30" />}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// FILTER BAR
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
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {groups.map((group) => {
        const isSelected = selectedGroups.includes(group)
        return (
          <button
            key={group}
            onClick={() => onToggleGroup(group)}
            className={cn(
              "touch-target font-mono text-[9px] sm:text-[10px] px-2 sm:px-3 py-1.5 border transition-all",
              isSelected
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/30 text-foreground/60 hover:border-foreground"
            )}
          >
            {group}
          </button>
        )
      })}
      {selectedGroups.length > 0 && (
        <button
          onClick={onClear}
          className="touch-target font-mono text-[9px] sm:text-[10px] text-muted-foreground hover:text-foreground px-2 py-1"
        >
          <X className="w-3 h-3" />
        </button>
      )}
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
      // Title scramble
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ░▒▓█"
      const originalText = "PROJECTS"
      let iteration = 0

      ScrollTrigger.create({
        trigger: titleRef.current,
        start: "top 92%",
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
    <div ref={ref} className="mb-6 sm:mb-8">
      <div className="flex items-end justify-between gap-4 mb-3">
        <div>
          <p className="font-mono text-[9px] sm:text-[10px] text-muted-foreground tracking-[0.2em] mb-1">— 04</p>
          <h2
            ref={titleRef}
            className="font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tighter leading-none"
          >
            PROJECTS
          </h2>
        </div>
        <span className="font-mono text-2xl sm:text-3xl lg:text-4xl font-black text-foreground/15 tabular-nums">
          {String(count).padStart(2, "0")}
        </span>
      </div>

      {/* Timeline legend - mobile */}
      <div className="flex items-center gap-2 font-mono text-[8px] sm:text-[9px] text-muted-foreground">
        <span>2025</span>
        <span className="flex-1 h-px bg-foreground/20" />
        <span className="text-accent">TIMELINE</span>
        <span className="flex-1 h-px bg-foreground/20" />
        <span>2022</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// HORIZONTAL SCROLL CONTAINER (DESKTOP)
// ─────────────────────────────────────────────────────────────

function HorizontalTimeline({ projects }: { projects: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

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

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      // Animate cards on scroll into view
      const cards = containerRef.current?.querySelectorAll(".project-card")
      cards?.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        )
      })
    }, containerRef.current)
    return () => ctx.revert()
  }, [projects])

  return (
    <div ref={containerRef} className="hidden lg:block relative">
      {/* Timeline progress bar */}
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-[9px] text-accent">NOW</span>
        <div className="flex-1 h-1 bg-foreground/10 relative">
          <div
            className="absolute inset-y-0 left-0 bg-foreground/40 transition-all duration-150"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <span className="font-mono text-[9px] text-foreground/50">2022</span>
      </div>

      {/* Horizontal scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {/* Now marker */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 scroll-snap-align-start">
          <pre className="font-mono text-[7px] text-foreground/30 select-none whitespace-pre leading-tight">{ASCII_GROWTH}</pre>
          <span className="font-mono text-[9px] text-accent mt-1">▼</span>
        </div>

        {projects.map((project, index) => (
          <div
            key={project.id}
            className="project-card flex-shrink-0 scroll-snap-align-start"
            style={{ scrollSnapAlign: "start" }}
          >
            <ProjectCard project={project} index={index} />
          </div>
        ))}

        {/* End marker */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center w-20 scroll-snap-align-start">
          <span className="font-mono text-[9px] text-foreground/40">2022</span>
          <pre className="font-mono text-[8px] text-foreground/30 select-none mt-1">{ASCII_ARROW}</pre>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="mt-2 flex items-center justify-center gap-2 font-mono text-[9px] text-foreground/40">
        <ChevronLeft className="w-3 h-3" />
        <span>SCROLL HORIZONTALLY</span>
        <ChevronRight className="w-3 h-3" />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// VERTICAL TIMELINE (MOBILE)
// ─────────────────────────────────────────────────────────────

function VerticalTimeline({ projects }: { projects: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      // Animate timeline line
      const line = containerRef.current?.querySelector(".v-timeline-line")
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 1,
            },
          }
        )
      }
    }, containerRef.current)
    return () => ctx.revert()
  }, [projects])

  return (
    <div ref={containerRef} className="lg:hidden relative">
      {/* Vertical timeline line */}
      <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-foreground/10">
        <div className="v-timeline-line absolute inset-0 bg-foreground/30 origin-top" />
      </div>

      {/* Projects */}
      <div className="space-y-6 sm:space-y-8 pl-10 sm:pl-14">
        {projects.map((project, index) => (
          <div key={project.id} className="relative">
            {/* Timeline node */}
            <div className="absolute -left-10 sm:-left-14 top-6 w-4 h-4 border-2 border-foreground bg-background rotate-45 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-accent rotate-45" />
            </div>

            <ProjectCard project={project} index={index} />
          </div>
        ))}
      </div>

      {/* Start marker (oldest) */}
      <div className="relative mt-6 pl-10 sm:pl-14">
        <div className="absolute -left-10 sm:-left-14 top-0 w-4 h-4 border-2 border-foreground/40 bg-background rotate-45" />
        <span className="font-mono text-xs text-muted-foreground">← 2022</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [selectedGroups, setSelectedGroups] = useState<SkillGroup[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  const toggleGroup = useCallback((group: SkillGroup) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
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
      className={cn(
        "relative py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6",
        "bg-background overflow-hidden"
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
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
        <div className="flex items-center gap-2 mb-6 font-mono text-[9px] sm:text-[10px] text-muted-foreground">
          <span className="text-foreground">{filteredProjects.length}</span>
          <span>/</span>
          <span>{allProjects.length}</span>
          <span className="ml-2">projects</span>
          {selectedGroups.length > 0 && <span className="text-accent">• filtered</span>}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-foreground/20">
            <pre className="font-mono text-[9px] sm:text-[10px] text-foreground/30 mb-3">
              {`┌─────────────┐\n│  NO MATCH   │\n└─────────────┘`}
            </pre>
            <button
              onClick={clearFilters}
              className="font-mono text-[10px] sm:text-xs border border-foreground/50 px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors"
            >
              RESET
            </button>
          </div>
        ) : (
          <>
            {/* Desktop: Horizontal timeline */}
            <HorizontalTimeline projects={filteredProjects} />

            {/* Mobile: Vertical timeline */}
            <VerticalTimeline projects={filteredProjects} />
          </>
        )}

        {/* Footer */}
        <div className="mt-8 sm:mt-12 text-center">
          <pre className="font-mono text-[7px] sm:text-[8px] text-foreground/15 select-none hidden sm:block">
            {ASCII_TIMELINE}
          </pre>
          <a
            href="#contact"
            className="touch-target inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors mt-3"
          >
            ↓ NEXT
          </a>
        </div>
      </div>
    </section>
  )
}
