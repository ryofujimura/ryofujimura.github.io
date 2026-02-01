"use client"

import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// SKILL & PROJECT DATA
// ─────────────────────────────────────────────────────────────

const projects = [
  { id: "01", title: "SIMULATE", year: "2022", description: "Monte Carlo poker odds calculator", skills: ["Swift", "SwiftUI", "WatchOS"] },
  { id: "02", title: "AUTOMATE", year: "2023", description: "Social media content pipeline", skills: ["Python", "API", "Automation"] },
  { id: "03", title: "OPTIMIZE", year: "2023", description: "Graph coloring course scheduler", skills: ["Python", "Flask", "Algorithms"] },
  { id: "04", title: "MINIMAL", year: "2024", description: "Zen matcha timer app", skills: ["Swift", "SwiftUI", "CloudKit"] },
  { id: "05", title: "ANIMATE", year: "2024", description: "Brutalist portfolio with GSAP", skills: ["React", "Next.js", "GSAP", "Tailwind"] },
  { id: "06", title: "SYNC", year: "2024", description: "Cross-platform food tracker", skills: ["React", "SwiftUI", "Firebase", "Realtime"] },
  { id: "07", title: "INFERENCE", year: "2024", description: "On-device LLM assistant", skills: ["Swift", "llama.cpp", "ML", "Privacy"] },
  { id: "08", title: "REALTIME", year: "2025", description: "Sub-100ms shuttle tracking", skills: ["Swift", "Kotlin", "Firebase", "Realtime"] },
  { id: "09", title: "RESILIENT", year: "2025", description: "Offline-first education platform", skills: ["Swift", "Kotlin", "Firebase", "Offline"] },
  { id: "10", title: "ROUTING", year: "2025", description: "AI-powered task routing", skills: ["Serverless", "Firebase", "GPT-4", "ML"] },
  { id: "11", title: "COLLAB", year: "2025", description: "CRDT whiteboard with vision ML", skills: ["PyTorch", "WebSocket", "React", "ML"] },
  { id: "12", title: "REASONING", year: "2025", description: "Multi-stage AI email manager", skills: ["Swift", "ML", "Firebase", "AI"] },
]

// Extract unique skills and map to projects
const skillsMap = new Map<string, typeof projects>()
projects.forEach(project => {
  project.skills.forEach(skill => {
    const existing = skillsMap.get(skill) || []
    skillsMap.set(skill, [...existing, project])
  })
})

// Categorized skills with syntax highlighting colors
const skillCategories = {
  language: { skills: ["Swift", "Python", "Kotlin"], color: "text-orange-400" },
  framework: { skills: ["SwiftUI", "React", "Next.js", "Flask", "PyTorch"], color: "text-cyan-400" },
  platform: { skills: ["WatchOS", "Firebase", "CloudKit", "Serverless"], color: "text-green-400" },
  concept: { skills: ["GSAP", "Tailwind", "WebSocket", "API", "llama.cpp"], color: "text-yellow-400" },
  paradigm: { skills: ["Realtime", "Offline", "ML", "AI", "Automation", "Algorithms", "Privacy", "GPT-4"], color: "text-purple-400" },
}

// Get color for a skill
function getSkillColor(skill: string): string {
  for (const category of Object.values(skillCategories)) {
    if (category.skills.includes(skill)) return category.color
  }
  return "text-foreground/60"
}

// All unique skills sorted by project count
const allSkills = Array.from(skillsMap.entries())
  .sort((a, b) => b[1].length - a[1].length)
  .map(([skill]) => skill)

// ─────────────────────────────────────────────────────────────
// MOBILE DETECTION
// ─────────────────────────────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    if (typeof window === "undefined") return
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isMobile
}

// ─────────────────────────────────────────────────────────────
// EXPANDABLE PROJECT ROW
// ─────────────────────────────────────────────────────────────

function ProjectRow({ 
  project, 
  index,
  isExpanded,
  onToggle 
}: { 
  project: typeof projects[0]
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const detailsRef = useRef<HTMLDivElement>(null)

  // Animate expansion
  useEffect(() => {
    if (!detailsRef.current) return

    if (isExpanded) {
      gsap.fromTo(
        detailsRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" }
      )
    } else {
      gsap.to(detailsRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in"
      })
    }
  }, [isExpanded])

  return (
    <div className="mb-1">
      {/* Project name - clickable */}
      <button
        onClick={onToggle}
        className="w-full text-left group flex items-center gap-2 hover:bg-foreground/5 -mx-2 px-2 py-0.5 transition-colors"
      >
        <span className="text-foreground/30">{String(index + 1).padStart(2, "0")}.</span>
        <span className={cn(
          "font-medium transition-colors",
          isExpanded ? "text-sky-300" : "text-sky-300/80 group-hover:text-sky-300"
        )}>
          {project.title}
        </span>
        <span className={cn(
          "text-[0.8em] transition-transform duration-200",
          isExpanded ? "text-emerald-300/60 rotate-90" : "text-foreground/20"
        )}>
          ▶
        </span>
        {!isExpanded && (
          <span className="text-foreground/20 text-[0.85em]">
            // {project.year}
          </span>
        )}
      </button>

      {/* Tech stack */}
      <div className="text-foreground/30 ml-6">
        {"["}
        {project.skills.map((tech, i) => (
          <span key={tech}>
            <span className="text-amber-200/60">{tech}</span>
            {i < project.skills.length - 1 && <span className="text-foreground/20">, </span>}
          </span>
        ))}
        {"]"}
      </div>

      {/* Expanded details */}
      <div 
        ref={detailsRef} 
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="ml-6 mt-2 mb-3 pl-3 border-l border-foreground/10">
          {/* Description */}
          <div className="mb-2">
            <span className="text-foreground/30">desc: </span>
            <span className="text-foreground/50">{project.description}</span>
          </div>
          {/* Year */}
          <div className="mb-2">
            <span className="text-foreground/30">year: </span>
            <span className="text-lime-300/70">{project.year}</span>
          </div>
          {/* ID */}
          <div>
            <span className="text-foreground/30">id: </span>
            <span className="text-violet-300/60">PRJ-{project.id}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TERMINAL OUTPUT - Typewriter effect with syntax highlighting
// ─────────────────────────────────────────────────────────────

function TerminalOutput({ 
  skill, 
  isActive,
  onClose 
}: { 
  skill: string | null
  isActive: boolean
  onClose: () => void
}) {
  const outputRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingFrame, setLoadingFrame] = useState(0)
  const [headerLines, setHeaderLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [isHeaderComplete, setIsHeaderComplete] = useState(false)
  const [expandedProject, setExpandedProject] = useState<string | null>(null)

  const relatedProjects = skill ? skillsMap.get(skill) || [] : []

  const loadingFrames = [
    "⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"
  ]

  // Generate header lines (before projects)
  const generateHeaderLines = useCallback(() => {
    if (!skill) return []
    
    const projectCount = relatedProjects.length
    const years = [...new Set(relatedProjects.map(p => p.year))].sort()
    
    return [
      `$ skill --query "${skill}"`,
      ``,
      `[EXEC] Searching project database...`,
      `[████████████████████████] 100%`,
      ``,
      `SKILL: ${skill}`,
      `PROJECTS: ${projectCount}`,
      `YEARS: ${years.join(", ")}`,
      ``,
      `// RELATED PROJECTS: (click to expand)`,
      ``
    ]
  }, [skill, relatedProjects])

  // Loading animation
  useEffect(() => {
    if (!isActive || !skill) {
      setIsLoading(true)
      setLoadingFrame(0)
      return
    }

    setIsLoading(true)
    setLoadingFrame(0)

    // Spinner animation
    const spinnerInterval = setInterval(() => {
      setLoadingFrame(prev => (prev + 1) % loadingFrames.length)
    }, 80)

    // End loading after delay
    const loadingTimer = setTimeout(() => {
      clearInterval(spinnerInterval)
      setIsLoading(false)
    }, 600)

    return () => {
      clearInterval(spinnerInterval)
      clearTimeout(loadingTimer)
    }
  }, [isActive, skill, loadingFrames.length])

  // Reset and start typewriter effect after loading
  useEffect(() => {
    if (!isActive || !skill || isLoading) {
      setHeaderLines([])
      setCurrentLine(0)
      setCurrentChar(0)
      setIsHeaderComplete(false)
      setExpandedProject(null)
      return
    }

    const lines = generateHeaderLines()
    setHeaderLines(lines)
    setCurrentLine(0)
    setCurrentChar(0)
    setIsHeaderComplete(false)
    setExpandedProject(null)

    // Cursor blink
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)

    return () => clearInterval(cursorInterval)
  }, [isActive, skill, isLoading, generateHeaderLines])

  // Typewriter animation for header
  useEffect(() => {
    if (!isActive || headerLines.length === 0 || isHeaderComplete) return

    const line = headerLines[currentLine]
    if (!line && currentLine < headerLines.length) {
      setTimeout(() => {
        setCurrentLine(prev => prev + 1)
        setCurrentChar(0)
      }, 50)
      return
    }

    if (currentChar < (line?.length || 0)) {
      const timeout = setTimeout(() => {
        setCurrentChar(prev => prev + 1)
      }, line?.startsWith("$") ? 40 : line?.startsWith("[") ? 15 : 8)
      return () => clearTimeout(timeout)
    } else if (currentLine < headerLines.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentLine(prev => prev + 1)
        setCurrentChar(0)
      }, 30)
      return () => clearTimeout(timeout)
    } else {
      setIsHeaderComplete(true)
    }
  }, [isActive, headerLines, currentLine, currentChar, isHeaderComplete])

  // GSAP entrance animation
  useEffect(() => {
    if (!outputRef.current || !isActive) return

    gsap.fromTo(
      outputRef.current,
      { opacity: 0, y: 20, scaleY: 0.95 },
      { opacity: 1, y: 0, scaleY: 1, duration: 0.4, ease: "power2.out" }
    )
  }, [isActive, skill])

  if (!isActive || !skill) return null

  // Pastel syntax highlighting for header lines
  const highlightLine = (line: string) => {
    if (line.startsWith("$")) {
      const parts = line.split(" ")
      return (
        <>
          <span className="text-emerald-300/80">$</span>
          <span className="text-sky-300/80"> {parts[1]}</span>
          <span className="text-amber-200/70"> {parts.slice(2).join(" ")}</span>
        </>
      )
    }
    if (line.includes("████")) {
      return <span className="text-emerald-300/60">{line}</span>
    }
    if (line.startsWith("[EXEC]") || line.startsWith("[OK]")) {
      const bracket = line.match(/^\[([^\]]+)\]/)
      const rest = line.replace(/^\[[^\]]+\]\s*/, "")
      return (
        <>
          <span className="text-violet-300/70">[{bracket?.[1]}]</span>
          <span className="text-foreground/50"> {rest}</span>
        </>
      )
    }
    if (line.startsWith("SKILL:")) {
      return (
        <>
          <span className="text-foreground/40">SKILL: </span>
          <span className="text-rose-300/80 font-medium">{skill}</span>
        </>
      )
    }
    if (line.startsWith("PROJECTS:")) {
      return (
        <>
          <span className="text-foreground/40">PROJECTS: </span>
          <span className="text-amber-200/80 font-medium">{relatedProjects.length}</span>
        </>
      )
    }
    if (line.startsWith("YEARS:")) {
      const years = [...new Set(relatedProjects.map(p => p.year))].sort()
      return (
        <>
          <span className="text-foreground/40">YEARS: </span>
          <span className="text-lime-300/70">{years.join(", ")}</span>
        </>
      )
    }
    if (line.startsWith("//")) {
      return <span className="text-foreground/25 italic">{line}</span>
    }
    return <span className="text-foreground/35">{line}</span>
  }

  return (
    <div 
      ref={outputRef}
      className="mt-6 sm:mt-8 max-w-3xl mx-auto"
    >
      {/* Terminal window */}
      <div className="border border-foreground/20 bg-black/40 backdrop-blur-sm">
        {/* Terminal header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-foreground/10 bg-foreground/5">
          <div className="flex items-center gap-2 group/buttons">
            <button 
              onClick={onClose}
              className="w-2.5 h-2.5 rounded-full bg-red-500/60 hover:bg-red-500 transition-colors relative"
              title="Close"
            >
              <span className="absolute inset-0 flex items-center justify-center text-[6px] text-red-900 opacity-0 group-hover/buttons:opacity-100 transition-opacity">×</span>
            </button>
            <button 
              className="w-2.5 h-2.5 rounded-full bg-yellow-500/60 hover:bg-yellow-500 transition-colors relative cursor-default"
              title="Minimize"
            >
              <span className="absolute inset-0 flex items-center justify-center text-[6px] text-yellow-900 opacity-0 group-hover/buttons:opacity-100 transition-opacity">−</span>
            </button>
            <button 
              className="w-2.5 h-2.5 rounded-full bg-green-500/60 hover:bg-green-500 transition-colors relative cursor-default"
              title="Maximize"
            >
              <span className="absolute inset-0 flex items-center justify-center text-[6px] text-green-900 opacity-0 group-hover/buttons:opacity-100 transition-opacity">+</span>
            </button>
            <span className="hidden md:inline font-mono text-[9px] text-foreground/40 ml-2">
              ryofujimura@MacBookPro
            </span>
          </div>
          <div className="font-mono text-[9px] text-foreground/30">
            <span className="hidden sm:inline">skill_query.sh — </span>{skill}
          </div>
          <button 
            onClick={onClose}
            className="font-mono text-[9px] text-foreground/40 hover:text-foreground transition-colors"
          >
            [×]
          </button>
        </div>

        {/* Terminal body */}
        <div className="p-4 sm:p-6 font-mono text-[10px] sm:text-xs leading-relaxed min-h-[120px] relative text-left">
          {/* Scanline effect */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)",
            }}
          />

          {/* Loading state */}
          {isLoading ? (
            <div className="py-4">
              <div className="flex items-center gap-2 text-foreground/40">
                <span className="text-emerald-300/80">{loadingFrames[loadingFrame]}</span>
                <span><span className="text-emerald-300/60">$</span> Initializing query...</span>
              </div>
              <div className="mt-2 flex gap-0.5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-1 h-1 transition-all duration-100",
                      i <= loadingFrame ? "bg-emerald-400/60" : "bg-foreground/10"
                    )}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Header lines with typewriter */}
              {headerLines.slice(0, currentLine + 1).map((line, i) => (
                <div key={i} className="min-h-[1.4em]">
                  {i < currentLine ? (
                    highlightLine(line)
                  ) : i === currentLine ? (
                    <>
                      {highlightLine(line.slice(0, currentChar))}
                      {showCursor && !isHeaderComplete && (
                        <span className="inline-block w-2 h-4 bg-emerald-400 ml-0.5 animate-pulse" />
                      )}
                    </>
                  ) : null}
                </div>
              ))}

              {/* Project rows - shown after header complete */}
              {isHeaderComplete && (
                <div className="project-rows">
                  {relatedProjects.map((project, index) => (
                    <ProjectRow
                      key={project.id}
                      project={project}
                      index={index}
                      isExpanded={expandedProject === project.id}
                      onToggle={() => setExpandedProject(
                        expandedProject === project.id ? null : project.id
                      )}
                    />
                  ))}
                  
                  {/* Footer line */}
                  <div className="mt-3 min-h-[1.4em]">
                    <span className="text-violet-300/70">[OK]</span>
                    <span className="text-foreground/50"> Query complete. {relatedProjects.length} result(s) found.</span>
                  </div>
                  <div className="min-h-[1.4em]">
                    <span className="text-emerald-300/80">$</span>
                    <span className="text-foreground/30"> _</span>
                    {showCursor && (
                      <span className="inline-block w-2 h-4 bg-emerald-400 ml-0.5 animate-pulse" />
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Terminal footer */}
        <div className="px-4 py-2 border-t border-foreground/10 flex items-center justify-between">
          <div className="font-mono text-[8px] text-foreground/20">
            {isLoading ? "LOADING..." : isHeaderComplete ? "READY" : "RUNNING..."}
          </div>
          <div className="font-mono text-[8px] text-foreground/20">
            {relatedProjects.length} project(s)
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SKILL BUTTON - Terminal command style
// ─────────────────────────────────────────────────────────────

function SkillButton({
  skill,
  projectCount,
  isActive,
  isAnyActive,
  onClick,
  onRefChange,
}: {
  skill: string
  projectCount: number
  isActive: boolean
  isAnyActive: boolean
  onClick: () => void
  onRefChange?: (el: HTMLButtonElement | null) => void
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  // Report ref to parent
  useEffect(() => {
    onRefChange?.(buttonRef.current)
    return () => onRefChange?.(null)
  }, [onRefChange])
  const [displayText, setDisplayText] = useState(skill)
  const glitchChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

  // Glitch effect on hover/active
  useEffect(() => {
    if (!isActive) {
      setDisplayText(skill)
      return
    }

    let iteration = 0
    const maxIterations = skill.length * 2

    const interval = setInterval(() => {
      setDisplayText(
        skill
          .split("")
          .map((char, i) => {
            if (char === " " || char === "_" || char === ".") return char
            if (i < iteration / 2) return skill[i]
            return glitchChars[Math.floor(Math.random() * glitchChars.length)]
          })
          .join("")
      )
      iteration++
      if (iteration > maxIterations) {
        setDisplayText(skill)
        clearInterval(interval)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [isActive, skill])

  const colorClass = getSkillColor(skill)

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={cn(
        "skill-btn group relative inline-flex items-baseline gap-1 transition-all duration-300",
        "font-mono font-bold tracking-tight cursor-pointer touch-manipulation",
        "text-[11vw] sm:text-[8vw] md:text-[6vw] lg:text-[5vw]",
        "leading-[0.9]",
        isActive
          ? cn(colorClass, "scale-[1.02]")
          : isAnyActive
            ? "text-foreground/10 hover:text-foreground/20"
            : cn("text-foreground/20 hover:text-foreground/40", `hover:${colorClass}`)
      )}
    >
      {/* Command prefix */}
      <span 
        className={cn(
          "text-[0.25em] font-normal transition-opacity duration-300",
          isActive ? "opacity-80 text-green-400" : "opacity-0 group-hover:opacity-40"
        )}
      >
        $
      </span>

      {/* Skill name */}
      <span className="relative">
        {displayText}
        
        {/* Project count badge */}
        <span
          className={cn(
            "absolute -top-[0.3em] -right-[0.6em] text-[0.15em] font-normal px-1 py-0.5",
            "border transition-all duration-300",
            isActive
              ? "opacity-100 border-current bg-current/10"
              : "opacity-0 group-hover:opacity-60 border-foreground/30"
          )}
        >
          {projectCount}
        </span>

        {/* Underline */}
        <span
          className={cn(
            "absolute bottom-0 left-0 h-[0.04em] transition-all duration-500 ease-out",
            isActive ? cn("w-full", colorClass.replace("text-", "bg-")) : "w-0 bg-foreground"
          )}
        />
      </span>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// ADAPTIVE ASCII BORDER
// ─────────────────────────────────────────────────────────────

function AsciiBorderLine({ position, className }: { position: "top" | "bottom"; className?: string }) {
  const lineRef = useRef<HTMLDivElement>(null)
  const [line, setLine] = useState("")

  useEffect(() => {
    const updateWidth = () => {
      if (!lineRef.current) return
      const width = lineRef.current.offsetWidth
      const charWidth = 6
      const charCount = Math.max(4, Math.floor(width / charWidth) - 2)
      const middle = "═".repeat(charCount)
      setLine(position === "top" ? `╔${middle}╗` : `╚${middle}╝`)
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [position])

  return (
    <div ref={lineRef} className={cn("font-mono text-[8px] sm:text-[10px] text-foreground/30 overflow-hidden", className)}>
      {line}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const skillsContainerRef = useRef<HTMLDivElement>(null)
  const skillRefsMap = useRef<Map<string, HTMLButtonElement>>(new Map())
  const terminalRef = useRef<HTMLDivElement>(null)
  const [terminalRowBottom, setTerminalRowBottom] = useState<number | null>(null)
  const [terminalHeight, setTerminalHeight] = useState(0)
  const isMobile = useIsMobile()

  // Track skill button ref
  const setSkillRef = useCallback((skill: string, el: HTMLButtonElement | null) => {
    if (el) {
      skillRefsMap.current.set(skill, el)
    } else {
      skillRefsMap.current.delete(skill)
    }
  }, [])

  // Toggle skill
  const handleSkillClick = useCallback((skill: string) => {
    setActiveSkill(prev => prev === skill ? null : skill)
  }, [])

  // Calculate terminal position based on active skill's row
  useLayoutEffect(() => {
    if (!activeSkill || !skillsContainerRef.current) {
      setTerminalRowBottom(null)
      return
    }

    const activeEl = skillRefsMap.current.get(activeSkill)
    if (!activeEl) return

    const containerRect = skillsContainerRef.current.getBoundingClientRect()
    const activeRect = activeEl.getBoundingClientRect()
    const activeTop = activeRect.top - containerRect.top

    // Find all skills on the same row (same offsetTop within tolerance)
    let maxBottom = activeRect.bottom - containerRect.top
    skillRefsMap.current.forEach((el) => {
      const rect = el.getBoundingClientRect()
      const elTop = rect.top - containerRect.top
      // Check if on same row (within 5px tolerance for alignment variations)
      if (Math.abs(elTop - activeTop) < 5) {
        const elBottom = rect.bottom - containerRect.top
        if (elBottom > maxBottom) {
          maxBottom = elBottom
        }
      }
    })

    setTerminalRowBottom(maxBottom)
  }, [activeSkill])

  // Measure terminal height for container padding
  useEffect(() => {
    if (!activeSkill || !terminalRef.current) {
      setTerminalHeight(0)
      return
    }

    const measureHeight = () => {
      if (terminalRef.current) {
        setTerminalHeight(terminalRef.current.offsetHeight)
      }
    }

    // Measure after render and after potential animations
    measureHeight()
    const timeout = setTimeout(measureHeight, 500)

    return () => clearTimeout(timeout)
  }, [activeSkill])

  // Scroll animation
  useEffect(() => {
    if (!sectionRef.current || !skillsContainerRef.current) return

    const ctx = gsap.context(() => {
      // Animate skills on scroll
      gsap.fromTo(
        ".skill-btn",
        { opacity: 0, y: 80, rotateX: -20 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      )

      // Animate decorative elements
      gsap.fromTo(
        ".ascii-decoration",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      )
    }, sectionRef.current)

    return () => ctx.revert()
  }, [])

  // Grid pattern
  const GridPattern = () => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.02]">
      <defs>
        <pattern id="skills-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#skills-grid)" />
    </svg>
  )

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen bg-background overflow-hidden py-16 sm:py-20 md:py-24"
    >
      <GridPattern />

      <div className="relative z-10 px-4 sm:px-6 md:px-8">
        {/* Section header */}
        <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
          <AsciiBorderLine position="top" className="ascii-decoration mb-4" />

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="ascii-decoration font-mono text-[9px] sm:text-[11px] text-foreground/40 tracking-[0.2em] mb-2">
                <span className="text-green-400">$</span> skills <span className="text-yellow-400">--list</span>
              </div>
              <h2 className="ascii-decoration font-mono text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tighter">
                STILL_LEARNING
              </h2>
            </div>
            <div className="ascii-decoration font-mono text-[10px] text-foreground/30 text-right">
              <div><span className="text-purple-400">const</span> skills = <span className="text-orange-400">{allSkills.length}</span>;</div>
              <div><span className="text-purple-400">const</span> projects = <span className="text-orange-400">{projects.length}</span>;</div>
              <div className="text-foreground/20">// tap to query</div>
            </div>
          </div>

          <AsciiBorderLine position="bottom" className="ascii-decoration mt-4" />
        </div>

        {/* Skills display with inline terminal */}
        <div
          ref={skillsContainerRef}
          className="relative text-center py-6 sm:py-10"
          style={{ paddingBottom: activeSkill ? `${terminalHeight + 40}px` : undefined }}
        >
          {/* Skills flow - wrapped on all screen sizes */}
          <div className="flex flex-row flex-wrap justify-center items-baseline gap-x-[0.15em] gap-y-1 sm:gap-x-[0.2em] sm:gap-y-3 px-2">
            {allSkills.map((skill, index) => (
              <span key={skill} className="inline-flex items-baseline">
                <SkillButton
                  skill={skill}
                  projectCount={skillsMap.get(skill)?.length || 0}
                  isActive={activeSkill === skill}
                  isAnyActive={activeSkill !== null}
                  onClick={() => handleSkillClick(skill)}
                  onRefChange={(el) => setSkillRef(skill, el)}
                />
                {index < allSkills.length - 1 && (
                  <span className="font-mono text-[3vw] sm:text-[2vw] text-foreground/10 mx-[0.1em] select-none">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Terminal positioned below the active skill's row */}
          {activeSkill && terminalRowBottom !== null && (
            <div 
              ref={terminalRef}
              className="absolute left-0 right-0 px-4 sm:px-6 md:px-8 z-10"
              style={{ top: `${terminalRowBottom + 8}px` }}
            >
              <TerminalOutput
                skill={activeSkill}
                isActive={true}
                onClose={() => setActiveSkill(null)}
              />
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="max-w-6xl mx-auto mt-10 sm:mt-14">
          <div className="ascii-decoration font-mono text-[8px] sm:text-[10px] text-foreground/30 mb-3">
            // SYNTAX_LEGEND
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[9px] sm:text-[10px]">
            <span><span className="text-orange-400">■</span> language</span>
            <span><span className="text-cyan-400">■</span> framework</span>
            <span><span className="text-green-400">■</span> platform</span>
            <span><span className="text-yellow-400">■</span> tooling</span>
            <span><span className="text-purple-400">■</span> paradigm</span>
          </div>
        </div>
      </div>
    </section>
  )
}
