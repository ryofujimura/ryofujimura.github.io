"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { GSAPText, GSAPSVG } from "@/components/gsap-text"
import { MagneticButton } from "@/components/magnetic-button"
import { AsciiSectionHeader } from "@/components/ascii-banner"
import { LeonardoNotebook, TechnicalDrawing, SpecAnnotation } from "@/components/leonardo-notebook"
import { ExternalLink, Github, ArrowRight, Eye, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

const allProjects = [
  {
    title: "ZERO INBOX",
    subtitle: "AI-Driven Email Prioritization",
    description:
      "Swift/SwiftUI email client with Google Mail API + Firebase + an AI reasoning engine. 90–95% classification accuracy, 100–300ms end-to-end inference, 50–200 messages/min throughput.",
    stats: { accuracy: "95%", latency: "200ms", throughput: "50–200/min" },
    links: { github: "https://github.com/ryofujimura", demo: "#" },
    skills: ["Swift", "SwiftUI", "Firebase", "AI/ML", "Google APIs"],
    number: "001",
    year: "2025",
  },
  {
    title: "SABORIENDO",
    subtitle: "Full-Stack E-commerce",
    description:
      "Full-stack e-commerce with React 19, SwiftUI, Firebase. Barcode-based order verification (11+ formats), 50%+ faster lookup, multi-language (EN/JP/ES), dynamic menu and drop scheduling.",
    stats: { speedup: "50%", formats: "11+", languages: "3" },
    links: { github: "https://github.com/ryofujimura", demo: "#" },
    skills: ["React 19", "SwiftUI", "Firebase", "Firestore"],
    number: "002",
    year: "2024",
  },
  {
    title: "HTIC SHUTTLE",
    subtitle: "Real-Time Tracking",
    description:
      "Live shuttle tracking used daily by 25+ users on iOS, Android, and web. 70%+ reduction in duplicate/conflicting pickups; real-time sync under 100ms Firebase RTDB latency.",
    stats: { users: "25+", reduction: "70%", sync: "<100ms" },
    links: { github: "https://github.com/ryofujimura", demo: "#" },
    skills: ["Swift", "Kotlin", "Firebase RTDB", "Real-time"],
    number: "003",
    year: "2025",
  },
  {
    title: "PROJECT MGMT FOR LABS",
    subtitle: "Serverless AI Routing",
    description:
      "Serverless orchestration for dynamic AI routing across 30+ researchers and multi-lab workflows. Sub-200ms Cloud Functions; metadata-aware prompting for task summaries and decision support.",
    stats: { researchers: "30+", latency: "<200ms", layer: "Serverless" },
    links: { github: "https://github.com/ryofujimura", demo: "#" },
    skills: ["Cloud Functions", "AI Routing", "Firebase", "Node.js"],
    number: "004",
    year: "2025",
  },
  {
    title: "CYBEREDU",
    subtitle: "Live Event Sync",
    description:
      "Synchronized iOS and Android apps for live event updates. 50+ users; 99%+ cross-device sync reliability across unstable networks.",
    stats: { users: "50+", sync: "99%+", platforms: "iOS/Android" },
    links: { github: "https://github.com/ryofujimura", demo: "#" },
    skills: ["Swift", "Kotlin", "Firebase", "Real-time"],
    number: "005",
    year: "2025",
  },
  {
    title: "WHITEBOARD AI",
    subtitle: "Transformer Vision + CRDT",
    description:
      "Transformer-based vision inference at 150–200ms latency; real-time CRDT-like collaboration. 5+ concurrent users; WebSocket pipeline with queueing and cross-tab sync.",
    stats: { latency: "150–200ms", users: "5+", sync: "CRDT" },
    links: { github: "https://github.com/ryofujimura", demo: "#" },
    skills: ["Transformers", "WebSocket", "Vision", "React"],
    number: "006",
    year: "2025",
  },
  {
    title: "WITH",
    subtitle: "Offline LLM Chat",
    description:
      "Offline-capable LLM chat using GGUF + llama.cpp with &lt;50ms/token local inference. 2GB+ memory savings via quantization and optimized caching/streaming; MVVM SwiftUI.",
    stats: { inference: "<50ms/tok", saved: "2GB+", stack: "llama.cpp" },
    links: { github: "https://github.com/ryofujimura", demo: "#" },
    skills: ["Swift", "SwiftUI", "llama.cpp", "GGUF"],
    number: "007",
    year: "2024",
  },
  {
    title: "RYO FUJIMURA WEBSITE",
    subtitle: "Portfolio & Performance",
    description:
      "Client-side performance work: 40–60% faster page loads. Modular components and clean deployment pipelines (GitHub Pages, Vercel).",
    stats: { speedup: "40–60%", stack: "React", deploy: "Vercel" },
    links: { github: "https://github.com/ryofujimura/ryofujimura.github.io", demo: "https://ryofujimura.github.io" },
    skills: ["React", "TailwindCSS", "Vercel", "GitHub Pages"],
    number: "008",
    year: "2025",
  },
  {
    title: "MATCHA TIME",
    subtitle: "Time Zone Coordination",
    description:
      "Swift/SwiftUI time zone coordination tool; 50 users at launch. Led 4-week idea-to-launch timeline.",
    stats: { users: "50", launch: "4 weeks", platform: "iOS" },
    links: { github: "https://github.com/ryofujimura", demo: "#" },
    skills: ["Swift", "SwiftUI", "iOS"],
    number: "009",
    year: "2024",
  },
  {
    title: "SCHEDULE MASTERMIND",
    subtitle: "Course Scheduler",
    description:
      "Python Flask scheduler for 500+ courses with real-time conflict detection. Improved planning for 100–300+ students; 70%+ reduction in scheduling errors.",
    stats: { courses: "500+", students: "100–300+", reduction: "70%+" },
    links: { github: "https://github.com/ryofujimura", demo: "#" },
    skills: ["Python", "Flask", "Scheduling"],
    number: "010",
    year: "2024",
  },
  {
    title: "SHOHEI HOME GROUND",
    subtitle: "Instagram Automation",
    description:
      "Automated daily Instagram posting (685 posts); grew to 11,000 followers in eight months. 2+ hours/day saved via Python automation.",
    stats: { posts: "685", followers: "11K", saved: "2+ hr/day" },
    links: { github: "#", demo: "#" },
    skills: ["Python", "Automation", "Instagram"],
    number: "011",
    year: "2023",
  },
  {
    title: "POKER PERCENTAGE",
    subtitle: "WatchOS Odds Calculator",
    description:
      "WatchOS poker odds calculator with &lt;10ms probability lookups using precomputed tables. Real-time equity insights for better decisions.",
    stats: { lookup: "<10ms", platform: "WatchOS", stack: "Precomputed" },
    links: { github: "https://github.com/ryofujimura", demo: "#" },
    skills: ["Swift", "WatchOS", "Probability"],
    number: "012",
    year: "2024",
  },
  {
    title: "ICCPS & ICRA RESEARCH",
    subtitle: "3D Mouse, Keyboard Actuation",
    description:
      "ICCPS 2025: 3D-printed mouse, 45% lighter, 15.1g shell. ICRA 2026: robotic keyboard actuation, 102 keystrokes/30s, 21.7ms latency, 95% human vs. robot classification.",
    stats: { papers: "2", conference: "ICRA", accuracy: "95%" },
    links: { github: "https://github.com/ryofujimura", paper: "#" },
    skills: ["Python", "ROS", "C++", "OpenCV"],
    number: "013",
    year: "2025",
  },
]

function getProjectAsciiArt(project: (typeof allProjects)[0]) {
  const n = project.number
  if (n === "001") return `  ╭───────────╮\n ╱  EMAIL     ╲\n│   INPUT      │\n│      │       │\n│      ▼       │\n│   AI ENGINE  │\n│   (95% ACC)  │\n ╲           ╱\n  ╰─────────╯`
  if (n === "002") return `  ╭───────╮\n ╱  USER  ╲\n│   CART   │\n│    ▼     │\n│  FIREBASE│\n│   ORDER   │\n ╲       ╱\n  ╰─────╯`
  if (n === "003") return `  ╭─────────╮\n ╱  DEVICE ╲\n│   LOC     │\n│    ▼      │\n│  RTDB SYNC│\n│  <100ms   │\n ╲        ╱\n  ╰──────╯`
  return `  ╭───────╮\n ╱  PROJ  ╲\n│   ${project.number}   │\n│    │     │\n│    ▼     │\n│  OUTPUT  │\n ╲       ╱\n  ╰─────╯`
}

function ProjectCard({
  project,
  index,
  isVisible,
  compact = false,
}: {
  project: (typeof allProjects)[0]
  index: number
  isVisible: boolean
  compact?: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    setIsTouch(typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0))
  }, [])

  useEffect(() => {
    if (!cardRef.current || !isVisible) return

    gsap.fromTo(
      cardRef.current,
      compact ? { x: 60, opacity: 0 } : { y: 100, opacity: 0, rotateX: 10 },
      compact
        ? { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: index * 0.12 }
        : { y: 0, opacity: 1, rotateX: 0, duration: 1.2, ease: "power4.out", delay: index * 0.2 },
    )
  }, [isVisible, index, compact])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 30,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 30,
    })
  }

  return (
    <div
      ref={cardRef}
      className="opacity-0"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePos({ x: 0, y: 0 })
      }}
      style={{
        perspective: "1000px",
      }}
    >
      <div
        className="relative border-2 border-foreground bg-card overflow-hidden group"
        style={{
          transform: !isTouch && isHovered
            ? `rotateY(${mousePos.x * 0.1}deg) rotateX(${-mousePos.y * 0.1}deg) scale(1.01)`
            : "rotateY(0) rotateX(0) scale(1)",
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Technical corner marks */}
        <div className="absolute top-0 left-0 w-6 h-6 border-b-2 border-r-2 border-foreground/30" />
        <div className="absolute top-0 right-0 w-6 h-6 border-b-2 border-l-2 border-foreground/30" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-t-2 border-r-2 border-foreground/30" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-t-2 border-l-2 border-foreground/30" />

        <div className={cn("grid", compact ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2")}>
          <div className={cn(
            "relative bg-secondary/30 overflow-hidden border-foreground",
            compact ? "aspect-video border-b-2" : "aspect-video lg:aspect-auto lg:h-[450px] border-b-2 lg:border-b-0 lg:border-r-2"
          )}>
            {/* Grid pattern */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />

            {/* Animated technical SVG */}
            <GSAPSVG className="absolute inset-0 text-foreground/20" duration={2}>
              <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" stroke="currentColor">
                <circle cx="200" cy="200" r="120" strokeWidth="1" />
                <circle cx="200" cy="200" r="80" strokeWidth="0.5" />
                <circle cx="200" cy="200" r="40" strokeWidth="0.5" />
                <line x1="200" y1="0" x2="200" y2="400" strokeWidth="0.5" opacity="0.5" />
                <line x1="0" y1="200" x2="400" y2="200" strokeWidth="0.5" opacity="0.5" />
                <path d="M200 80 L200 320" strokeWidth="1" strokeDasharray="5,5" />
                <path d="M80 200 L320 200" strokeWidth="1" strokeDasharray="5,5" />
              </svg>
            </GSAPSVG>

            {/* Project number - large */}
            <div className="absolute bottom-6 left-6">
              <span className="text-[120px] font-black text-foreground/5 leading-none tracking-tighter">
                {project.number}
              </span>
            </div>

            {/* Year badge */}
            <div className="absolute top-6 right-6">
              <span className="text-xs font-mono px-3 py-1 border border-foreground/30 text-foreground/60">
                {project.year}
              </span>
            </div>

            {/* Placeholder icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-2 border-foreground/20 flex items-center justify-center">
                <span className="text-3xl font-mono text-foreground/30">{`<>`}</span>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center">
            <div className="space-y-6">
              {/* Subtitle */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-accent" />
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-accent">
                  {project.subtitle}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-none">
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              {/* Stats - brutalist style */}
              <div className="grid grid-cols-3 gap-0 border-2 border-foreground">
                {Object.entries(project.stats).map(([key, value], i) => (
                  <div
                    key={key}
                    className={cn(
                      "p-3 sm:p-4 text-center",
                      i < 2 && "border-r-2 border-foreground"
                    )}
                  >
                    <div className="text-xl sm:text-2xl font-black text-foreground font-mono">{value}</div>
                    <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-1">
                      {key}
                    </div>
                  </div>
                ))}
              </div>

              {/* Leonardo notebook: Project spec sheet (hidden when compact) */}
              {!compact && (
              <div className="mt-4 sm:mt-6">
                <LeonardoNotebook folioRef={`RF.DV.PROJ.${project.number}`} date={project.year} className="p-3 sm:p-4">
                  <TechnicalDrawing
                    title={`SYSTEM: ${project.title}`}
                    asciiArt={getProjectAsciiArt(project)}
                    measurements={Object.entries(project.stats).map(([key, value]) => ({
                      label: key.charAt(0).toUpperCase() + key.slice(1),
                      value: value.toString(),
                    }))}
                    notes={project.subtitle}
                  />
                </LeonardoNotebook>
              </div>
              )}

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-mono text-foreground border border-foreground/30 hover:bg-foreground hover:text-background transition-colors cursor-default touch-manipulation"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-4">
                <MagneticButton
                  as="a"
                  href={project.links.github}
                  className="touch-target inline-flex items-center justify-center gap-2 min-h-[44px] px-4 sm:px-6 py-2.5 sm:py-3 text-xs font-mono uppercase tracking-wider text-foreground border-2 border-foreground hover:bg-foreground hover:text-background transition-all"
                >
                  <Github className="w-4 h-4 shrink-0" />
                  Source
                </MagneticButton>
                {"demo" in project.links && project.links.demo && (
                  <MagneticButton
                    as="a"
                    href={project.links.demo}
                    className="touch-target inline-flex items-center justify-center gap-2 min-h-[44px] px-4 sm:px-6 py-2.5 sm:py-3 text-xs font-mono uppercase tracking-wider text-background bg-foreground border-2 border-foreground hover:bg-transparent hover:text-foreground transition-all"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    Demo
                  </MagneticButton>
                )}
                {"paper" in project.links && project.links.paper && (
                  <MagneticButton
                    as="a"
                    href={project.links.paper}
                    className="touch-target inline-flex items-center justify-center gap-2 min-h-[44px] px-4 sm:px-6 py-2.5 sm:py-3 text-xs font-mono uppercase tracking-wider text-background bg-foreground border-2 border-foreground hover:bg-transparent hover:text-foreground transition-all"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    Paper
                  </MagneticButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProjectsSection() {
  const [showAll, setShowAll] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  const displayedProjects = showAll ? allProjects : allProjects.slice(0, 3)

  const handleShowMore = () => {
    setShowAll(true)
    setVisibleCount(allProjects.length)
  }

  // Scroll-driven horizontal motion: pin section, scrub translateX by scroll
  useEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    const track = trackRef.current
    if (!section || !pin || !track) return

    const getMaxTravel = () => {
      const viewW = pin.offsetWidth
      const trackW = track.scrollWidth
      return Math.max(0, trackW - viewW)
    }

    const scrollDistance = Math.max(600, displayedProjects.length * 280)

    gsap.set(track, { x: 0 })
    const anim = gsap.fromTo(
      track,
      { x: 0 },
      {
        x: () => -getMaxTravel(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: `+=${scrollDistance}`,
          scrub: 1,
          pin: pin,
          invalidateOnRefresh: true,
          onEnter: () => setVisibleCount(displayedProjects.length),
        },
      }
    )

    return () => {
      anim.scrollTrigger?.kill()
      anim.kill()
    }
  }, [displayedProjects.length, showAll])

  return (
    <section id="projects" ref={sectionRef} className="relative py-20 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "min(80px, 15vw) min(80px, 15vw)",
        }}
      />
      <div className="absolute left-0 top-1/3 w-px h-32 sm:h-64 bg-foreground/10 hidden sm:block" />
      <div className="absolute right-0 top-1/2 w-px h-24 sm:h-48 bg-foreground/10 hidden sm:block" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={titleRef} className="mb-10 sm:mb-14 md:mb-16">
          <AsciiSectionHeader number="03" title="FEATURED WORK" />
          <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col sm:flex-row items-start gap-4 sm:gap-8">
            <div className="w-12 sm:w-16 h-px bg-accent mt-2 sm:mt-3 shrink-0" />
            <GSAPText
              variant="words"
              className="text-base sm:text-lg text-muted-foreground max-w-xl font-mono"
              delay={0.5}
            >
              &gt; Scroll down to move through projects — AI, mobile, full-stack
            </GSAPText>
          </div>
        </div>

        {/* Pinned viewport: vertical scroll drives horizontal movement */}
        <div
          ref={pinRef}
          className="relative w-full overflow-hidden"
          style={{ minHeight: "72vh" }}
        >
          <div className="h-[70vh] min-h-[380px] overflow-hidden">
            <div
              ref={trackRef}
              className="flex gap-6 sm:gap-8 pt-2 pr-4 sm:pr-6"
              style={{ width: "max-content" }}
            >
              {displayedProjects.map((project, index) => (
                <div
                  key={`${project.title}-${project.number}`}
                  className="flex-shrink-0 w-[min(340px,85vw)] sm:w-[380px]"
                >
                  <ProjectCard
                    project={project}
                    index={index}
                    isVisible={visibleCount > index}
                    compact={true}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-4 pt-6 pb-4 sm:pb-8">
            {!showAll && allProjects.length > 3 ? (
              <MagneticButton
                onClick={handleShowMore}
                className="touch-target group relative inline-flex items-center justify-center gap-2 sm:gap-4 px-6 sm:px-12 py-4 sm:py-5 min-h-[48px] text-sm font-mono uppercase tracking-wider text-foreground border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
              >
                <Eye className="w-5 h-5 shrink-0" />
                Show more projects ({allProjects.length - 3} more)
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform shrink-0" />
              </MagneticButton>
            ) : showAll ? (
              <MagneticButton
                as="a"
                href="#contact"
                className="touch-target group inline-flex items-center justify-center gap-3 min-h-[48px] text-base sm:text-lg font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                {"Let's collaborate"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform shrink-0" />
              </MagneticButton>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
