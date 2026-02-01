"use client"

import { useState, useRef, useEffect, useCallback } from "react"
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
  const [lines, setLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  const relatedProjects = skill ? skillsMap.get(skill) || [] : []

  // Generate terminal output lines - simplified without ASCII box
  const generateLines = useCallback(() => {
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
      `// RELATED PROJECTS:`,
      ``,
      ...relatedProjects.map((p, i) => 
        `${String(i + 1).padStart(2, "0")}. ${p.title} // ${p.description}`
      ),
      ``,
      `[OK] Query complete. ${projectCount} result(s) found.`,
      `$ _`
    ]
  }, [skill, relatedProjects])

  // Reset and start typewriter effect
  useEffect(() => {
    if (!isActive || !skill) {
      setLines([])
      setCurrentLine(0)
      setCurrentChar(0)
      setIsComplete(false)
      return
    }

    const outputLines = generateLines()
    setLines(outputLines)
    setCurrentLine(0)
    setCurrentChar(0)
    setIsComplete(false)

    // Cursor blink
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)

    return () => clearInterval(cursorInterval)
  }, [isActive, skill, generateLines])

  // Typewriter animation
  useEffect(() => {
    if (!isActive || lines.length === 0 || isComplete) return

    const line = lines[currentLine]
    if (!line && currentLine < lines.length) {
      // Empty line, move to next
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
    } else if (currentLine < lines.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentLine(prev => prev + 1)
        setCurrentChar(0)
      }, line?.startsWith("┌") || line?.startsWith("└") ? 100 : 30)
      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [isActive, lines, currentLine, currentChar, isComplete])

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

  // Pastel syntax highlighting for terminal output
  const highlightLine = (line: string, lineIndex: number) => {
    // Command line
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
    // Progress bar
    if (line.includes("████")) {
      return <span className="text-emerald-300/60">{line}</span>
    }
    // Status messages
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
    // Key-value lines (SKILL:, PROJECTS:, YEARS:)
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
    // Comments
    if (line.startsWith("//")) {
      return <span className="text-foreground/25 italic">{line}</span>
    }
    // Project lines
    if (line.match(/^\d+\./)) {
      const match = line.match(/^(\d+)\.\s+(\w+)\s+\/\/\s+(.+)$/)
      if (match) {
        return (
          <>
            <span className="text-foreground/30">{match[1]}. </span>
            <span className="text-sky-300/80 font-medium">{match[2]}</span>
            <span className="text-foreground/25"> // </span>
            <span className="text-foreground/40">{match[3]}</span>
          </>
        )
      }
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
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
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
        <div className="p-4 sm:p-6 font-mono text-[10px] sm:text-xs leading-relaxed min-h-[200px]">
          {/* Scanline effect */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)",
            }}
          />

          {/* Output lines */}
          {lines.slice(0, currentLine + 1).map((line, i) => (
            <div key={i} className="min-h-[1.4em]">
              {i < currentLine ? (
                highlightLine(line, i)
              ) : i === currentLine ? (
                <>
                  {highlightLine(line.slice(0, currentChar), i)}
                  {showCursor && !isComplete && (
                    <span className="inline-block w-2 h-4 bg-green-400 ml-0.5 animate-pulse" />
                  )}
                </>
              ) : null}
            </div>
          ))}
        </div>

        {/* Terminal footer */}
        <div className="px-4 py-2 border-t border-foreground/10 flex items-center justify-between">
          <div className="font-mono text-[8px] text-foreground/20">
            {isComplete ? "READY" : "RUNNING..."}
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
}: {
  skill: string
  projectCount: number
  isActive: boolean
  isAnyActive: boolean
  onClick: () => void
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)
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
  const isMobile = useIsMobile()

  // Toggle skill
  const handleSkillClick = useCallback((skill: string) => {
    setActiveSkill(prev => prev === skill ? null : skill)
  }, [])

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

        {/* Skills display */}
        <div
          ref={skillsContainerRef}
          className="relative text-center py-6 sm:py-10"
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
                />
                {index < allSkills.length - 1 && (
                  <span className="font-mono text-[3vw] sm:text-[2vw] text-foreground/10 mx-[0.1em] select-none">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Terminal output */}
        <TerminalOutput
          skill={activeSkill}
          isActive={activeSkill !== null}
          onClose={() => setActiveSkill(null)}
        />

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
