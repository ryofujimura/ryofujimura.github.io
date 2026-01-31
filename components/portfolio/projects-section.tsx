"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Github, X, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// ASCII PATTERNS
// ─────────────────────────────────────────────────────────────

const ASCII_NODE = `[●]`
const ASCII_SYNAPSE = `○──●──○──●──○──●──○`
const ASCII_NETWORK_SMALL = `●─●─●`

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

const GROUP_COLORS: Record<SkillGroup, string> = {
  "Mobile": "var(--accent)",
  "Web": "oklch(0.65 0.15 150)",
  "Cloud": "oklch(0.65 0.15 220)",
  "AI/ML": "oklch(0.7 0.18 320)",
  "Python": "oklch(0.7 0.15 80)",
}

// ─────────────────────────────────────────────────────────────
// PROJECT DATA
// ─────────────────────────────────────────────────────────────

const allProjects = [
  {
    id: "01", code: "RF.2024.01", title: "Saboriendo Bakery", category: "FULL-STACK",
    primarySkill: "React + SwiftUI", year: "2024", image: "/images/saboriendo.jpg",
    description: "Full-stack e-commerce using React 19, SwiftUI, Firebase. Real-time order processing, barcode verification.",
    metrics: ["50%↑", "11+ formats"], skills: ["React 19", "SwiftUI", "Firebase", "Firestore", "AVFoundation"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "02", code: "RF.2025.02", title: "Zero Inbox", category: "AI/ML",
    primarySkill: "Swift + AI", year: "2025", image: "/images/zeroinbox.jpg",
    description: "Swift/SwiftUI email client with AI reasoning engine. 90–95% classification accuracy.",
    metrics: ["95% acc", "200ms"], skills: ["Swift", "SwiftUI", "Firebase", "AI/ML", "Google APIs"],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
  },
  {
    id: "03", code: "RF.2025.03", title: "Research Lab Mgmt", category: "SERVERLESS",
    primarySkill: "Cloud Functions", year: "2025", image: "/images/researchlab.jpg",
    description: "Serverless orchestration for dynamic AI routing across 30+ researchers.",
    metrics: ["<200ms", "30+ users"], skills: ["Cloud Functions", "Firebase", "AI routing", "Node.js"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "04", code: "RF.2025.04", title: "HTIC Shuttle", category: "REAL-TIME",
    primarySkill: "Firebase RTDB", year: "2025", image: "/images/schedule.jpg",
    description: "Live shuttle tracking for 25+ daily users. 70%+ reduction in duplicate pickups.",
    metrics: ["25+ DAU", "70%↓"], skills: ["Swift", "Kotlin", "Firebase RTDB", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
  },
  {
    id: "05", code: "RF.2025.05", title: "CyberEdu", category: "CROSS-PLATFORM",
    primarySkill: "Swift + Kotlin", year: "2025", image: "/images/CyberEdu.png",
    description: "Synchronized iOS+Android apps for live event updates. 99%+ sync reliability.",
    metrics: ["50+ users", "99%↑"], skills: ["Swift", "Kotlin", "Firebase", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
  },
  {
    id: "06", code: "RF.2025.06", title: "Whiteboard AI", category: "VISION",
    primarySkill: "PyTorch + WS", year: "2025", image: "/images/whiteboardai.png",
    description: "Transformer-based vision inference at 150–200ms latency; real-time collaboration.",
    metrics: ["150ms", "5+ users"], skills: ["PyTorch", "Vision", "WebSocket", "React"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "07", code: "RF.2024.07", title: "With", category: "LOCAL AI",
    primarySkill: "llama.cpp", year: "2024–25", image: "/images/with.jpg",
    description: "Offline-capable LLM chat using GGUF + llama.cpp, <50ms/token local inference.",
    metrics: ["<50ms/tok", "offline"], skills: ["Swift", "llama.cpp", "GGUF", "SwiftUI"],
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "08", code: "RF.2024.08", title: "Portfolio", category: "WEB",
    primarySkill: "Next.js + GSAP", year: "2024–25", image: "/images/homepage.png",
    description: "Client-side performance tuning: 40–60% faster load. Brutalist design system.",
    metrics: ["40-60%↑", "modular"], skills: ["React", "Next.js", "Tailwind", "Vercel"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "09", code: "RF.2024.09", title: "Matcha Time", category: "iOS",
    primarySkill: "SwiftUI", year: "2024", image: "/images/matchatime_1.jpg",
    description: "Swift/SwiftUI time zone coordination tool; 50 users at launch.",
    metrics: ["50 users", "4 weeks"], skills: ["Swift", "SwiftUI", "App Store"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
  {
    id: "10", code: "RF.2023.10", title: "Schedule Master", category: "BACKEND",
    primarySkill: "Python Flask", year: "2023–24", image: "/images/schedule.jpg",
    description: "Python Flask scheduler for 500+ courses with real-time conflict detection.",
    metrics: ["500+ courses", "70%↓"], skills: ["Python", "Flask", "scheduling"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "11", code: "RF.2023.11", title: "Shohei HG", category: "AUTOMATION",
    primarySkill: "Python", year: "2023", image: "/images/shoheihomeground_1.jpg",
    description: "Automated daily Instagram posting (685 posts), 11K followers in 8 months.",
    metrics: ["11K followers", "685 posts"], skills: ["Python", "automation", "Instagram"],
    links: { instagram: "#", youtube: "#" },
  },
  {
    id: "12", code: "RF.2022.12", title: "Poker %", category: "WATCHOS",
    primarySkill: "WatchKit", year: "2022–24", image: "/images/poker.png",
    description: "WatchOS poker odds calculator, <10ms probability lookups.",
    metrics: ["<10ms", "WatchOS"], skills: ["Swift", "WatchOS", "probability"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
]

type Project = (typeof allProjects)[0]

// Get primary group for a project
function getProjectGroup(project: Project): SkillGroup {
  for (const [group, skills] of Object.entries(SKILL_GROUPS)) {
    if (project.skills.some(s => skills.includes(s))) {
      return group as SkillGroup
    }
  }
  return "Mobile"
}

// Check if two projects share skills
function projectsConnected(a: Project, b: Project): boolean {
  return a.skills.some(s => b.skills.includes(s))
}

// ─────────────────────────────────────────────────────────────
// FORCE-DIRECTED GRAPH NODE TYPE
// ─────────────────────────────────────────────────────────────

interface GraphNode {
  id: string
  project: Project
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  group: SkillGroup
  visible: boolean
  highlighted: boolean
}

// ─────────────────────────────────────────────────────────────
// FORCE-DIRECTED GRAPH COMPONENT
// ─────────────────────────────────────────────────────────────

function ForceGraph({
  projects,
  selectedGroups,
  onSelectProject,
  selectedProject,
}: {
  projects: Project[]
  selectedGroups: SkillGroup[]
  onSelectProject: (project: Project | null) => void
  selectedProject: Project | null
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const nodesRef = useRef<GraphNode[]>([])
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const animationRef = useRef<number>(0)
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)

  // Initialize nodes
  useEffect(() => {
    const nodes: GraphNode[] = allProjects.map((project, i) => {
      const angle = (i / allProjects.length) * Math.PI * 2
      const radius = Math.min(dimensions.width, dimensions.height) * 0.3
      return {
        id: project.id,
        project,
        x: dimensions.width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 50,
        y: dimensions.height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 50,
        vx: 0,
        vy: 0,
        radius: 24,
        group: getProjectGroup(project),
        visible: true,
        highlighted: false,
      }
    })
    nodesRef.current = nodes
  }, [dimensions])

  // Update visibility based on filters
  useEffect(() => {
    const selectedSkills = selectedGroups.length === 0
      ? []
      : selectedGroups.flatMap(g => SKILL_GROUPS[g])

    nodesRef.current.forEach(node => {
      if (selectedSkills.length === 0) {
        node.visible = true
      } else {
        node.visible = node.project.skills.some(s => selectedSkills.includes(s))
      }
    })
  }, [selectedGroups])

  // Update highlighted state
  useEffect(() => {
    nodesRef.current.forEach(node => {
      if (selectedProject) {
        node.highlighted = node.project.id === selectedProject.id ||
          projectsConnected(node.project, selectedProject)
      } else if (hoveredNode) {
        node.highlighted = node.id === hoveredNode.id ||
          projectsConnected(node.project, hoveredNode.project)
      } else {
        node.highlighted = false
      }
    })
  }, [selectedProject, hoveredNode])

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: Math.min(rect.width * 0.7, 500) })
      }
    }
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Mouse handlers
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const getMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX
      const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      }
    }

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const pos = getMousePos(e)
      mouseRef.current = { ...pos, active: true }

      // Find hovered node
      const hovered = nodesRef.current.find(node => {
        if (!node.visible) return false
        const dx = node.x - pos.x
        const dy = node.y - pos.y
        return Math.sqrt(dx * dx + dy * dy) < node.radius + 10
      })
      setHoveredNode(hovered || null)
    }

    const handleLeave = () => {
      mouseRef.current.active = false
      setHoveredNode(null)
    }

    const handleClick = (e: MouseEvent | TouchEvent) => {
      const pos = getMousePos(e)
      const clicked = nodesRef.current.find(node => {
        if (!node.visible) return false
        const dx = node.x - pos.x
        const dy = node.y - pos.y
        return Math.sqrt(dx * dx + dy * dy) < node.radius + 5
      })
      if (clicked) {
        onSelectProject(clicked.project)
      }
    }

    canvas.addEventListener("mousemove", handleMove)
    canvas.addEventListener("touchmove", handleMove, { passive: true })
    canvas.addEventListener("mouseleave", handleLeave)
    canvas.addEventListener("click", handleClick)
    canvas.addEventListener("touchend", handleClick)

    return () => {
      canvas.removeEventListener("mousemove", handleMove)
      canvas.removeEventListener("touchmove", handleMove)
      canvas.removeEventListener("mouseleave", handleLeave)
      canvas.removeEventListener("click", handleClick)
      canvas.removeEventListener("touchend", handleClick)
    }
  }, [onSelectProject])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const animate = () => {
      const { width, height } = dimensions
      const nodes = nodesRef.current
      const mouse = mouseRef.current

      // Clear
      ctx.clearRect(0, 0, width, height)

      // Physics simulation
      const centerX = width / 2
      const centerY = height / 2
      const visibleNodes = nodes.filter(n => n.visible)

      visibleNodes.forEach(node => {
        // Center gravity
        const dxC = centerX - node.x
        const dyC = centerY - node.y
        const distC = Math.sqrt(dxC * dxC + dyC * dyC)
        if (distC > 1) {
          node.vx += (dxC / distC) * 0.05
          node.vy += (dyC / distC) * 0.05
        }

        // Mouse repulsion/attraction
        if (mouse.active) {
          const dxM = node.x - mouse.x
          const dyM = node.y - mouse.y
          const distM = Math.sqrt(dxM * dxM + dyM * dyM)
          if (distM < 150 && distM > 1) {
            const force = (150 - distM) / 150 * 0.8
            node.vx += (dxM / distM) * force
            node.vy += (dyM / distM) * force
          }
        }

        // Node repulsion
        visibleNodes.forEach(other => {
          if (other.id === node.id) return
          const dx = node.x - other.x
          const dy = node.y - other.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const minDist = node.radius + other.radius + 20
          if (dist < minDist && dist > 1) {
            const force = (minDist - dist) / minDist * 2
            node.vx += (dx / dist) * force
            node.vy += (dy / dist) * force
          }
        })

        // Connected nodes attraction (same group)
        visibleNodes.forEach(other => {
          if (other.id === node.id) return
          if (node.group === other.group || projectsConnected(node.project, other.project)) {
            const dx = other.x - node.x
            const dy = other.y - node.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist > 80 && dist < 300) {
              const force = 0.01
              node.vx += (dx / dist) * force
              node.vy += (dy / dist) * force
            }
          }
        })

        // Apply velocity with damping
        node.vx *= 0.92
        node.vy *= 0.92
        node.x += node.vx
        node.y += node.vy

        // Boundary constraints
        const margin = node.radius + 10
        if (node.x < margin) { node.x = margin; node.vx *= -0.5 }
        if (node.x > width - margin) { node.x = width - margin; node.vx *= -0.5 }
        if (node.y < margin) { node.y = margin; node.vy *= -0.5 }
        if (node.y > height - margin) { node.y = height - margin; node.vy *= -0.5 }
      })

      // Draw connections
      ctx.strokeStyle = "currentColor"
      visibleNodes.forEach((node, i) => {
        visibleNodes.slice(i + 1).forEach(other => {
          if (projectsConnected(node.project, other.project)) {
            const isHighlighted = node.highlighted && other.highlighted
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = isHighlighted
              ? "oklch(0.5 0.15 200 / 0.4)"
              : "oklch(0.5 0 0 / 0.08)"
            ctx.lineWidth = isHighlighted ? 1.5 : 0.5
            if (!isHighlighted) ctx.setLineDash([4, 4])
            else ctx.setLineDash([])
            ctx.stroke()
          }
        })
      })
      ctx.setLineDash([])

      // Draw nodes
      visibleNodes.forEach(node => {
        const isHovered = hoveredNode?.id === node.id
        const isSelected = selectedProject?.id === node.project.id
        const color = GROUP_COLORS[node.group]
        const scale = isHovered || isSelected ? 1.15 : node.highlighted ? 1.05 : 1
        const r = node.radius * scale

        // Outer ring
        ctx.beginPath()
        ctx.arc(node.x, node.y, r + 4, 0, Math.PI * 2)
        ctx.strokeStyle = node.highlighted || isHovered || isSelected
          ? color
          : "oklch(0.3 0 0 / 0.2)"
        ctx.lineWidth = isSelected ? 3 : isHovered ? 2 : 1
        ctx.stroke()

        // Inner fill
        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.fillStyle = isSelected
          ? color
          : isHovered
            ? "oklch(0.95 0 0)"
            : node.highlighted
              ? "oklch(0.92 0 0)"
              : "oklch(0.97 0 0)"
        ctx.fill()
        ctx.strokeStyle = "oklch(0.2 0 0 / 0.8)"
        ctx.lineWidth = 2
        ctx.stroke()

        // Node ID text
        ctx.font = "bold 11px 'JetBrains Mono', monospace"
        ctx.fillStyle = isSelected ? "oklch(0.97 0 0)" : "oklch(0.2 0 0)"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(node.project.id, node.x, node.y)

        // Category label below
        if (isHovered || isSelected) {
          ctx.font = "9px 'JetBrains Mono', monospace"
          ctx.fillStyle = "oklch(0.4 0 0)"
          ctx.fillText(node.project.primarySkill.toUpperCase().slice(0, 12), node.x, node.y + r + 14)
        }
      })

      // Draw technical grid overlay
      ctx.strokeStyle = "oklch(0.3 0 0 / 0.03)"
      ctx.lineWidth = 1
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Corner brackets
      ctx.strokeStyle = "oklch(0.3 0 0 / 0.15)"
      ctx.lineWidth = 2
      const bracketSize = 20
      // Top-left
      ctx.beginPath()
      ctx.moveTo(0, bracketSize)
      ctx.lineTo(0, 0)
      ctx.lineTo(bracketSize, 0)
      ctx.stroke()
      // Top-right
      ctx.beginPath()
      ctx.moveTo(width - bracketSize, 0)
      ctx.lineTo(width, 0)
      ctx.lineTo(width, bracketSize)
      ctx.stroke()
      // Bottom-left
      ctx.beginPath()
      ctx.moveTo(0, height - bracketSize)
      ctx.lineTo(0, height)
      ctx.lineTo(bracketSize, height)
      ctx.stroke()
      // Bottom-right
      ctx.beginPath()
      ctx.moveTo(width - bracketSize, height)
      ctx.lineTo(width, height)
      ctx.lineTo(width, height - bracketSize)
      ctx.stroke()

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationRef.current)
  }, [dimensions, hoveredNode, selectedProject])

  return (
    <div ref={containerRef} className="relative w-full">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full border-2 border-foreground bg-background cursor-crosshair touch-none"
        style={{ height: dimensions.height }}
      />
      {/* Legend */}
      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex flex-wrap gap-1.5 sm:gap-2">
        {(Object.keys(SKILL_GROUPS) as SkillGroup[]).map(group => (
          <div key={group} className="flex items-center gap-1">
            <span
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-foreground/30"
              style={{ backgroundColor: GROUP_COLORS[group] }}
            />
            <span className="font-mono text-[8px] sm:text-[9px] text-muted-foreground">
              {group}
            </span>
          </div>
        ))}
      </div>
      {/* Instructions */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 font-mono text-[8px] sm:text-[9px] text-muted-foreground/60">
        hover to explore • click to select
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PROJECT DETAIL PANEL
// ─────────────────────────────────────────────────────────────

function ProjectDetail({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    if (!panelRef.current) return
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 20, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" }
    )
  }, [project])

  const hasGithub = project.links.github
  const hasDemo = "demo" in project.links && (project.links as { demo?: string }).demo
  const hasAppStore = "appStore" in project.links
  const hasPlayStore = "playStore" in project.links
  const group = getProjectGroup(project)

  return (
    <div
      ref={panelRef}
      className="border-2 border-foreground bg-background shadow-[4px_4px_0_0_var(--foreground)] sm:shadow-[6px_6px_0_0_var(--foreground)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 p-3 sm:p-4 border-b border-foreground/30">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: GROUP_COLORS[group] }}
          />
          <span className="font-mono text-lg sm:text-xl font-black text-foreground truncate">
            {project.primarySkill.toUpperCase()}
          </span>
        </div>
        <button
          onClick={onClose}
          className="touch-target p-1.5 sm:p-2 border border-foreground/30 hover:bg-foreground hover:text-background transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">
        {/* Image */}
        <div className="aspect-video sm:aspect-square border-b sm:border-b-0 sm:border-r border-foreground/30 bg-muted/30 overflow-hidden">
          {!imgError ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-4xl text-foreground/20">{ASCII_NODE}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p className="font-mono text-xs sm:text-sm text-muted-foreground">
                {project.title}
              </p>
              <span className="font-mono text-[10px] sm:text-xs text-foreground/40">
                {project.code} • {project.year}
              </span>
            </div>
            <span className="font-mono text-[9px] sm:text-[10px] px-1.5 py-0.5 border border-foreground/30 text-muted-foreground">
              {project.category}
            </span>
          </div>

          {/* Metrics */}
          <div className="flex flex-wrap gap-1.5 mb-2 sm:mb-3">
            {project.metrics.map((m, i) => (
              <span
                key={i}
                className="font-mono text-[9px] sm:text-[10px] px-1.5 py-0.5 border border-foreground/40 text-foreground bg-foreground/5"
              >
                {m}
              </span>
            ))}
          </div>

          <p className="text-[11px] sm:text-xs text-foreground/75 leading-relaxed mb-3">
            {project.description}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1 mb-3">
            {project.skills.map(skill => (
              <span
                key={skill}
                className="font-mono text-[8px] sm:text-[9px] text-muted-foreground border-b border-dotted border-foreground/20 pb-px"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {hasGithub && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center gap-1 font-mono text-[10px] sm:text-xs text-foreground hover:text-accent transition-colors"
              >
                <Github className="w-3 h-3" />
                <span className="border-b border-foreground/30">SOURCE</span>
              </a>
            )}
            {hasDemo && (
              <a
                href={(project.links as { demo?: string }).demo}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target inline-flex items-center gap-1 font-mono text-[10px] sm:text-xs text-foreground hover:text-accent transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="border-b border-foreground/30">DEMO</span>
              </a>
            )}
            {hasAppStore && (
              <a href={(project.links as { appStore?: string }).appStore} target="_blank" rel="noopener noreferrer"
                className="touch-target font-mono text-[9px] sm:text-[10px] text-muted-foreground hover:text-foreground">
                App Store →
              </a>
            )}
            {hasPlayStore && (
              <a href={(project.links as { playStore?: string }).playStore} target="_blank" rel="noopener noreferrer"
                className="touch-target font-mono text-[9px] sm:text-[10px] text-muted-foreground hover:text-foreground">
                Play Store →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// FILTER BAR
// ─────────────────────────────────────────────────────────────

function FilterBar({
  selectedGroups,
  onToggle,
  onClear,
}: {
  selectedGroups: SkillGroup[]
  onToggle: (g: SkillGroup) => void
  onClear: () => void
}) {
  const groups = Object.keys(SKILL_GROUPS) as SkillGroup[]

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
      {groups.map(group => {
        const isSelected = selectedGroups.includes(group)
        return (
          <button
            key={group}
            onClick={() => onToggle(group)}
            className={cn(
              "touch-target flex-shrink-0 flex items-center gap-1 sm:gap-1.5",
              "font-mono text-[9px] sm:text-[10px]",
              "px-2 sm:px-2.5 py-1.5",
              "border-2 transition-all duration-150",
              isSelected
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/30 text-foreground/60 hover:border-foreground"
            )}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: isSelected ? "currentColor" : GROUP_COLORS[group] }}
            />
            {group}
          </button>
        )
      })}
      {selectedGroups.length > 0 && (
        <button
          onClick={onClear}
          className="touch-target flex-shrink-0 p-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────

function SectionHeader() {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!titleRef.current) return
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ●○◐◑"
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
            .map((char, i) => i < iteration ? char : chars[Math.floor(Math.random() * chars.length)])
            .join("")
          if (iteration >= originalText.length) clearInterval(interval)
          iteration += 0.35
        }, 35)
      },
    })
  }, [])

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground">04</span>
        <span className="font-mono text-[8px] text-foreground/20">{ASCII_SYNAPSE}</span>
      </div>
      <div className="flex items-end justify-between gap-3">
        <h2
          ref={titleRef}
          className="font-mono text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tighter leading-none"
        >
          PROJECTS
        </h2>
        <span className="font-mono text-[8px] sm:text-[9px] text-foreground/30 hidden sm:block">
          {ASCII_NETWORK_SMALL} force-directed graph
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="h-0.5 sm:h-1 w-8 sm:w-10 bg-foreground" />
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const toggleGroup = useCallback((group: SkillGroup) => {
    setSelectedGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    )
  }, [])

  const clearFilters = useCallback(() => {
    setSelectedGroups([])
  }, [])

  const filteredProjects = useMemo(() => {
    if (selectedGroups.length === 0) return allProjects
    const skills = selectedGroups.flatMap(g => SKILL_GROUPS[g])
    return allProjects.filter(p => p.skills.some(s => skills.includes(s)))
  }, [selectedGroups])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-6 sm:py-10 md:py-16 px-3 sm:px-4 md:px-6 bg-background"
    >
      <div className="max-w-5xl mx-auto">
        <SectionHeader />

        {/* Filter */}
        <div className="mb-3 sm:mb-4">
          <FilterBar
            selectedGroups={selectedGroups}
            onToggle={toggleGroup}
            onClear={clearFilters}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground">
              <span className="text-foreground">{filteredProjects.length}</span>
              <span className="text-foreground/30"> / </span>
              <span>{allProjects.length}</span>
              <span className="text-foreground/40 ml-1">nodes</span>
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="touch-target flex items-center gap-1 font-mono text-[9px] sm:text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              <span className="hidden sm:inline">{isExpanded ? "collapse" : "expand"}</span>
            </button>
          </div>
        </div>

        {/* Graph */}
        <div className={cn(
          "transition-all duration-300",
          isExpanded ? "h-[70vh] max-h-[700px]" : "h-[50vh] max-h-[500px] min-h-[300px]"
        )}>
          <ForceGraph
            projects={filteredProjects}
            selectedGroups={selectedGroups}
            onSelectProject={setSelectedProject}
            selectedProject={selectedProject}
          />
        </div>

        {/* Selected project detail */}
        {selectedProject && (
          <div className="mt-4 sm:mt-6">
            <ProjectDetail
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          </div>
        )}

        {/* List view hint */}
        {!selectedProject && (
          <div className="mt-4 sm:mt-6 text-center">
            <p className="font-mono text-[9px] sm:text-[10px] text-muted-foreground/60">
              click a node to view details • connected nodes share skills
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
