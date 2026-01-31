"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Github, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// ASCII PATTERNS
// ─────────────────────────────────────────────────────────────

const ASCII_NODE = `[●]`
const ASCII_SYNAPSE = `○──●──○──●──○──●──○`
const ASCII_TERMINAL = `
┌──────────────────────────────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└──────────────────────────────────────────────────────────────┘`.trim()

// ─────────────────────────────────────────────────────────────
// SKILL GROUPS
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
// PROJECT DATA
// ─────────────────────────────────────────────────────────────

const allProjects = [
  {
    id: "01", code: "RF.2024.01", title: "Saboriendo Bakery Platform", category: "FULL-STACK",
    primarySkill: "React + SwiftUI", year: "2024", image: "/images/saboriendo.jpg",
    description: "Full-stack e-commerce using React 19, SwiftUI, Firebase. Real-time order processing, barcode verification.",
    metrics: ["50%↑", "11+ formats", "3 lang"],
    skills: ["React 19", "SwiftUI", "Firebase", "Firestore", "AVFoundation"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "02", code: "RF.2025.02", title: "Zero Inbox", category: "AI/ML",
    primarySkill: "Swift + AI Engine", year: "2025", image: "/images/zeroinbox.jpg",
    description: "Swift/SwiftUI email client with AI reasoning engine. 90–95% classification accuracy.",
    metrics: ["95% acc", "200ms", "50-200/min"],
    skills: ["Swift", "SwiftUI", "Firebase", "AI/ML", "Google APIs"],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
  },
  {
    id: "03", code: "RF.2025.03", title: "Research Lab Management", category: "SERVERLESS",
    primarySkill: "Cloud Functions", year: "2025", image: "/images/researchlab.jpg",
    description: "Serverless orchestration for dynamic AI routing across 30+ researchers.",
    metrics: ["<200ms", "30+ users", "multi-lab"],
    skills: ["Cloud Functions", "Firebase", "AI routing", "Node.js"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "04", code: "RF.2025.04", title: "HTIC Shuttle", category: "REAL-TIME",
    primarySkill: "Firebase RTDB", year: "2025", image: "/images/schedule.jpg",
    description: "Live shuttle tracking for 25+ daily users. 70%+ reduction in duplicate pickups.",
    metrics: ["25+ DAU", "70%↓", "<100ms"],
    skills: ["Swift", "Kotlin", "Firebase RTDB", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
  },
  {
    id: "05", code: "RF.2025.05", title: "CyberEdu", category: "CROSS-PLATFORM",
    primarySkill: "Swift + Kotlin", year: "2025", image: "/images/CyberEdu.png",
    description: "Synchronized iOS+Android apps for live event updates. 99%+ sync reliability.",
    metrics: ["50+ users", "99%↑", "iOS+Android"],
    skills: ["Swift", "Kotlin", "Firebase", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
  },
  {
    id: "06", code: "RF.2025.06", title: "Whiteboard AI", category: "VISION",
    primarySkill: "PyTorch + WebSocket", year: "2025", image: "/images/whiteboardai.png",
    description: "Transformer-based vision inference at 150–200ms latency; real-time collaboration.",
    metrics: ["150ms", "5+ users", "CRDT"],
    skills: ["PyTorch", "Vision", "WebSocket", "React"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "07", code: "RF.2024.07", title: "With", category: "LOCAL AI",
    primarySkill: "llama.cpp + Swift", year: "2024–25", image: "/images/with.jpg",
    description: "Offline-capable LLM chat using GGUF + llama.cpp, <50ms/token local inference.",
    metrics: ["<50ms/tok", "2GB↓", "offline"],
    skills: ["Swift", "llama.cpp", "GGUF", "SwiftUI"],
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "08", code: "RF.2024.08", title: "Portfolio Website", category: "WEB",
    primarySkill: "Next.js + GSAP", year: "2024–25", image: "/images/homepage.png",
    description: "Client-side performance tuning: 40–60% faster load. Brutalist design system.",
    metrics: ["40-60%↑", "modular", "Vercel"],
    skills: ["React", "Next.js", "Tailwind", "Vercel"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "09", code: "RF.2024.09", title: "Matcha Time", category: "iOS",
    primarySkill: "SwiftUI Native", year: "2024", image: "/images/matchatime_1.jpg",
    description: "Swift/SwiftUI time zone coordination tool; 50 users at launch.",
    metrics: ["50 users", "4 weeks", "App Store"],
    skills: ["Swift", "SwiftUI", "App Store"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#" },
  },
  {
    id: "10", code: "RF.2023.10", title: "Schedule Mastermind", category: "BACKEND",
    primarySkill: "Python Flask", year: "2023–24", image: "/images/schedule.jpg",
    description: "Python Flask scheduler for 500+ courses with real-time conflict detection.",
    metrics: ["500+ courses", "70%↓", "Flask"],
    skills: ["Python", "Flask", "scheduling"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "11", code: "RF.2023.11", title: "Shohei Home Ground", category: "AUTOMATION",
    primarySkill: "Python Scripts", year: "2023", image: "/images/shoheihomeground_1.jpg",
    description: "Automated daily Instagram posting (685 posts), 11K followers in 8 months.",
    metrics: ["11K followers", "685 posts", "2hr/day↓"],
    skills: ["Python", "automation", "Instagram"],
    links: { instagram: "#", youtube: "#" },
  },
  {
    id: "12", code: "RF.2022.12", title: "Poker Percentage", category: "WATCHOS",
    primarySkill: "WatchKit + Swift", year: "2022–24", image: "/images/poker.png",
    description: "WatchOS poker odds calculator, <10ms probability lookups.",
    metrics: ["<10ms", "WatchOS", "precomputed"],
    skills: ["Swift", "WatchOS", "probability"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
]

type Project = (typeof allProjects)[0]

// ─────────────────────────────────────────────────────────────
// FORCE SIMULATION TYPES
// ─────────────────────────────────────────────────────────────

interface GraphNode {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  project: Project
  radius: number
}

interface GraphEdge {
  source: string
  target: string
  strength: number
}

// ─────────────────────────────────────────────────────────────
// FORCE-DIRECTED GRAPH COMPONENT
// ─────────────────────────────────────────────────────────────

function ForceGraph({
  projects,
  activeFilters,
  hoveredId,
  onHover,
  width,
  height,
}: {
  projects: Project[]
  activeFilters: string[]
  hoveredId: string | null
  onHover: (id: string | null) => void
  width: number
  height: number
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const nodesRef = useRef<GraphNode[]>([])
  const edgesRef = useRef<GraphEdge[]>([])
  const animationRef = useRef<number | null>(null)
  const [, forceUpdate] = useState(0)

  // Initialize nodes and edges
  useEffect(() => {
    const centerX = width / 2
    const centerY = height / 2

    // Create nodes with initial positions in a circle
    nodesRef.current = projects.map((project, i) => {
      const angle = (i / projects.length) * Math.PI * 2
      const radius = Math.min(width, height) * 0.35
      return {
        id: project.id,
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 50,
        y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 50,
        vx: 0,
        vy: 0,
        project,
        radius: 24,
      }
    })

    // Create edges based on shared skills
    const edges: GraphEdge[] = []
    for (let i = 0; i < projects.length; i++) {
      for (let j = i + 1; j < projects.length; j++) {
        const sharedSkills = projects[i].skills.filter((s) =>
          projects[j].skills.includes(s)
        )
        if (sharedSkills.length > 0) {
          edges.push({
            source: projects[i].id,
            target: projects[j].id,
            strength: sharedSkills.length * 0.3,
          })
        }
      }
    }
    edgesRef.current = edges

    // Force simulation
    const simulate = () => {
      const nodes = nodesRef.current
      const edges = edgesRef.current
      const damping = 0.85
      const repulsion = 2500
      const attraction = 0.008
      const centerForce = 0.01

      // Apply forces
      for (const node of nodes) {
        // Center gravity
        node.vx += (centerX - node.x) * centerForce
        node.vy += (centerY - node.y) * centerForce

        // Node repulsion
        for (const other of nodes) {
          if (node.id === other.id) continue
          const dx = node.x - other.x
          const dy = node.y - other.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const force = repulsion / (dist * dist)
          node.vx += (dx / dist) * force
          node.vy += (dy / dist) * force
        }
      }

      // Edge attraction
      for (const edge of edges) {
        const source = nodes.find((n) => n.id === edge.source)
        const target = nodes.find((n) => n.id === edge.target)
        if (!source || !target) continue

        const dx = target.x - source.x
        const dy = target.y - source.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = dist * attraction * edge.strength

        source.vx += (dx / dist) * force
        target.vx -= (dx / dist) * force
        source.vy += (dy / dist) * force
        target.vy -= (dy / dist) * force
      }

      // Update positions
      for (const node of nodes) {
        node.vx *= damping
        node.vy *= damping
        node.x += node.vx
        node.y += node.vy

        // Boundary constraints
        const padding = 40
        node.x = Math.max(padding, Math.min(width - padding, node.x))
        node.y = Math.max(padding, Math.min(height - padding, node.y))
      }

      forceUpdate((n) => n + 1)
      animationRef.current = requestAnimationFrame(simulate)
    }

    simulate()

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [projects, width, height])

  // Check if node is active based on filters
  const isNodeActive = useCallback(
    (project: Project) => {
      if (activeFilters.length === 0) return true
      return project.skills.some((skill) => activeFilters.includes(skill))
    },
    [activeFilters]
  )

  const nodes = nodesRef.current
  const edges = edgesRef.current

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="w-full h-full"
      style={{ touchAction: "none" }}
    >
      {/* Technical grid background */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.05"
          />
        </pattern>
        <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="0.5" fill="currentColor" opacity="0.1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <rect width="100%" height="100%" fill="url(#dots)" />

      {/* Edges */}
      <g className="edges">
        {edges.map((edge, i) => {
          const source = nodes.find((n) => n.id === edge.source)
          const target = nodes.find((n) => n.id === edge.target)
          if (!source || !target) return null

          const sourceActive = isNodeActive(source.project)
          const targetActive = isNodeActive(target.project)
          const isActive = sourceActive && targetActive
          const isHovered = hoveredId === source.id || hoveredId === target.id

          return (
            <line
              key={`${edge.source}-${edge.target}`}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="currentColor"
              strokeWidth={isHovered ? 2 : 1}
              opacity={isHovered ? 0.4 : isActive ? 0.15 : 0.05}
              strokeDasharray={isActive ? "none" : "4 4"}
              className="transition-all duration-300"
            />
          )
        })}
      </g>

      {/* Nodes */}
      <g className="nodes">
        {nodes.map((node) => {
          const isActive = isNodeActive(node.project)
          const isHovered = hoveredId === node.id
          const radius = isHovered ? 32 : isActive ? 26 : 20

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onMouseEnter={() => onHover(node.id)}
              onMouseLeave={() => onHover(null)}
              className="cursor-pointer"
              style={{ transition: "transform 0.1s ease-out" }}
            >
              {/* Outer ring - technical */}
              <circle
                r={radius + 8}
                fill="none"
                stroke="currentColor"
                strokeWidth={isHovered ? 1.5 : 0.5}
                opacity={isHovered ? 0.4 : isActive ? 0.15 : 0.05}
                strokeDasharray={isHovered ? "none" : "2 2"}
                className="transition-all duration-300"
              />

              {/* Main node */}
              <circle
                r={radius}
                fill="var(--background)"
                stroke="currentColor"
                strokeWidth={isHovered ? 3 : isActive ? 2 : 1}
                opacity={isActive ? 1 : 0.4}
                className="transition-all duration-300"
              />

              {/* Inner dot */}
              <circle
                r={isHovered ? 6 : isActive ? 4 : 2}
                fill="currentColor"
                opacity={isHovered ? 0.8 : isActive ? 0.5 : 0.2}
                className="transition-all duration-300"
              />

              {/* Node ID */}
              <text
                y={radius + 16}
                textAnchor="middle"
                className="font-mono text-[9px] sm:text-[10px] fill-current"
                opacity={isHovered ? 0.9 : isActive ? 0.5 : 0.2}
              >
                {node.project.id}
              </text>

              {/* Category label - shown on hover */}
              {isHovered && (
                <text
                  y={-radius - 8}
                  textAnchor="middle"
                  className="font-mono text-[8px] fill-current"
                  opacity={0.6}
                >
                  {node.project.category}
                </text>
              )}
            </g>
          )
        })}
      </g>

      {/* Corner brackets */}
      <g opacity="0.2">
        <path d="M 10 30 L 10 10 L 30 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d={`M ${width - 10} 30 L ${width - 10} 10 L ${width - 30} 10`} fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d={`M 10 ${height - 30} L 10 ${height - 10} L 30 ${height - 10}`} fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d={`M ${width - 10} ${height - 30} L ${width - 10} ${height - 10} L ${width - 30} ${height - 10}`} fill="none" stroke="currentColor" strokeWidth="1.5" />
      </g>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT DETAIL PANEL
// ─────────────────────────────────────────────────────────────

function ProjectDetail({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    if (!panelRef.current || !project) return
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
    )
  }, [project])

  if (!project) return null

  const hasGithub = project.links.github
  const hasDemo = "demo" in project.links && (project.links as { demo?: string }).demo

  return (
    <div
      ref={panelRef}
      className="border-2 border-foreground bg-background shadow-[4px_4px_0_0_var(--foreground)] overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-video border-b border-foreground/30 bg-muted/30">
        {!imgError ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-[10px] text-foreground/30">{ASCII_NODE}</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="font-mono text-[9px] text-background bg-foreground px-1.5 py-0.5">
            {project.category}
          </span>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-background/80 border border-foreground/50 hover:bg-foreground hover:text-background transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-mono text-sm sm:text-base font-black text-foreground leading-tight">
              {project.primarySkill.toUpperCase()}
            </h3>
            <p className="font-mono text-[10px] sm:text-xs text-muted-foreground">
              {project.title}
            </p>
          </div>
          <span className="font-mono text-lg font-black text-foreground/20">
            {project.id}
          </span>
        </div>

        {/* Metrics */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {project.metrics.map((m, i) => (
            <span
              key={i}
              className="font-mono text-[9px] px-1.5 py-0.5 border border-foreground/30 text-foreground"
            >
              {m}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-[11px] sm:text-xs text-foreground/70 leading-relaxed mb-3">
          {project.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-3">
          {project.skills.map((skill) => (
            <span
              key={skill}
              className="font-mono text-[8px] text-muted-foreground border-b border-dotted border-foreground/20"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-2">
          {hasGithub && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-[10px] text-foreground hover:text-accent transition-colors"
            >
              <Github className="w-3 h-3" />
              <span className="border-b border-foreground/30">SRC</span>
            </a>
          )}
          {hasDemo && (
            <a
              href={(project.links as { demo?: string }).demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-[10px] text-foreground hover:text-accent transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="border-b border-foreground/30">DEMO</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MOBILE PROJECT LIST
// ─────────────────────────────────────────────────────────────

function MobileProjectCard({ project, isActive }: { project: Project; isActive: boolean }) {
  const [imgError, setImgError] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        }
      )
    }, cardRef.current)
    return () => ctx.revert()
  }, [])

  const hasGithub = project.links.github
  const hasDemo = "demo" in project.links && (project.links as { demo?: string }).demo

  return (
    <div
      ref={cardRef}
      className={cn(
        "border-2 border-foreground bg-background",
        "shadow-[3px_3px_0_0_var(--foreground)]",
        "transition-all duration-200",
        !isActive && "opacity-40"
      )}
    >
      <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr]">
        {/* Image */}
        <div className="relative aspect-square border-r border-foreground/30 bg-muted/30 overflow-hidden">
          {!imgError ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-[8px] text-foreground/30">{ASCII_NODE}</span>
            </div>
          )}
          <div className="absolute bottom-1 left-1">
            <span className="font-mono text-[7px] text-foreground/60 bg-background/80 px-1">
              {project.id}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-1">
              <h3 className="font-mono text-[11px] sm:text-xs font-black text-foreground leading-tight">
                {project.primarySkill.toUpperCase()}
              </h3>
              <span className="font-mono text-[8px] text-accent">{project.category}</span>
            </div>
            <p className="font-mono text-[9px] text-muted-foreground mt-0.5 line-clamp-1">
              {project.title}
            </p>
          </div>

          {/* Metrics */}
          <div className="flex gap-1 mt-1.5 overflow-x-auto scrollbar-hide">
            {project.metrics.slice(0, 2).map((m, i) => (
              <span
                key={i}
                className="flex-shrink-0 font-mono text-[8px] px-1 py-0.5 border border-foreground/30"
              >
                {m}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-2 mt-1.5">
            {hasGithub && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target font-mono text-[9px] text-foreground hover:text-accent"
              >
                <Github className="w-3 h-3" />
              </a>
            )}
            {hasDemo && (
              <a
                href={(project.links as { demo?: string }).demo}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target font-mono text-[9px] text-foreground hover:text-accent"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// FILTER BUTTONS
// ─────────────────────────────────────────────────────────────

function FilterButtons({
  selectedGroups,
  onToggle,
  onClear,
}: {
  selectedGroups: SkillGroup[]
  onToggle: (group: SkillGroup) => void
  onClear: () => void
}) {
  const groups = Object.keys(SKILL_GROUPS) as SkillGroup[]

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
      {groups.map((group) => {
        const isSelected = selectedGroups.includes(group)
        return (
          <button
            key={group}
            onClick={() => onToggle(group)}
            className={cn(
              "touch-target flex-shrink-0",
              "font-mono text-[9px] sm:text-[10px]",
              "px-2 sm:px-2.5 py-1 sm:py-1.5",
              "border-2 transition-all duration-150",
              isSelected
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/30 text-foreground/50 hover:border-foreground hover:text-foreground"
            )}
          >
            ● {group}
          </button>
        )
      })}
      {selectedGroups.length > 0 && (
        <button
          onClick={onClear}
          className="touch-target flex-shrink-0 p-1.5 text-muted-foreground hover:text-foreground"
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
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!titleRef.current) return
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ●○◐◑"
    const originalText = "PROJECTS"
    let iteration = 0

    const ctx = gsap.context(() => {
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
            iteration += 0.4
          }, 30)
        },
      })
    }, titleRef.current)

    return () => ctx.revert()
  }, [])

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground">04</span>
        <span className="font-mono text-[8px] text-foreground/20">{ASCII_SYNAPSE.slice(0, 12)}</span>
      </div>
      <div className="flex items-end justify-between gap-3">
        <h2
          ref={titleRef}
          className="font-mono text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tighter"
        >
          PROJECTS
        </h2>
        <span className="font-mono text-xl sm:text-2xl font-black text-foreground/15 tabular-nums">
          {String(count).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="h-0.5 w-8 sm:w-10 bg-foreground" />
        <div className="h-px flex-1 bg-foreground/15" />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [selectedGroups, setSelectedGroups] = useState<SkillGroup[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [showAllMobile, setShowAllMobile] = useState(false)
  const [graphSize, setGraphSize] = useState({ width: 800, height: 500 })
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // Responsive graph size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setGraphSize({
          width: rect.width,
          height: Math.min(500, Math.max(350, rect.width * 0.6)),
        })
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

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

  const hoveredProject = useMemo(() => {
    if (!hoveredId) return null
    return allProjects.find((p) => p.id === hoveredId) || null
  }, [hoveredId])

  const INITIAL_MOBILE = 4
  const displayedMobile = showAllMobile ? filteredProjects : filteredProjects.slice(0, INITIAL_MOBILE)
  const remainingMobile = filteredProjects.length - INITIAL_MOBILE

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-6 sm:py-10 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 bg-background"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader count={allProjects.length} />

        {/* Filters */}
        <div className="mb-4 sm:mb-6">
          <FilterButtons
            selectedGroups={selectedGroups}
            onToggle={toggleGroup}
            onClear={clearFilters}
          />
          <div className="flex items-center gap-2 mt-2 font-mono text-[8px] sm:text-[9px] text-muted-foreground">
            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
            <span>{filteredProjects.length}/{allProjects.length} nodes</span>
          </div>
        </div>

        {/* Desktop: Graph + Detail Panel */}
        <div className="hidden md:grid md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_380px] gap-4 lg:gap-6">
          {/* Graph */}
          <div
            ref={containerRef}
            className="relative border-2 border-foreground bg-background overflow-hidden"
          >
            <ForceGraph
              projects={allProjects}
              activeFilters={selectedSkills}
              hoveredId={hoveredId}
              onHover={setHoveredId}
              width={graphSize.width}
              height={graphSize.height}
            />

            {/* ASCII decoration */}
            <div className="absolute bottom-2 left-2 font-mono text-[7px] text-foreground/20 select-none">
              FORCE-DIRECTED GRAPH v1.0
            </div>
          </div>

          {/* Detail Panel */}
          <div className="self-start sticky top-24">
            {hoveredProject ? (
              <ProjectDetail project={hoveredProject} onClose={() => setHoveredId(null)} />
            ) : (
              <div className="border-2 border-dashed border-foreground/20 p-6 text-center">
                <pre className="font-mono text-[8px] text-foreground/20 mb-2 select-none">
                  {ASCII_TERMINAL}
                </pre>
                <p className="font-mono text-[10px] text-muted-foreground">
                  Hover a node to view details
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: Card List */}
        <div className="md:hidden space-y-3">
          {displayedMobile.map((project) => (
            <MobileProjectCard
              key={project.id}
              project={project}
              isActive={selectedSkills.length === 0 || project.skills.some((s) => selectedSkills.includes(s))}
            />
          ))}

          {!showAllMobile && remainingMobile > 0 && (
            <button
              onClick={() => setShowAllMobile(true)}
              className={cn(
                "w-full py-3",
                "font-mono text-[10px] tracking-wider",
                "border-2 border-foreground bg-foreground text-background",
                "shadow-[2px_2px_0_0_var(--foreground)]"
              )}
            >
              +{remainingMobile} MORE
              <ChevronDown className="w-3 h-3 inline ml-1" />
            </button>
          )}
        </div>

        {/* End marker */}
        <div className="mt-6 sm:mt-8 text-center">
          <span className="font-mono text-[8px] text-foreground/15">{ASCII_SYNAPSE}</span>
        </div>
      </div>
    </section>
  )
}
