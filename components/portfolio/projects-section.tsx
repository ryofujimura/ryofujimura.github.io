"use client"

import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// SKILL & PROJECT DATA
// ─────────────────────────────────────────────────────────────

type LinkType = "appstore" | "playstore" | "website" | "github" | "instagram" | "youtube" | "paper"

interface ProjectLink {
  type: LinkType
  url: string
}

const projects = [
  {
    id: "01",
    title: "Zero Inbox",
    subtitle: "AI-Driven Email Prioritization",
    year: "2025",
    description: "Swift/SwiftUI email client with Google Mail API + Firebase + AI reasoning engine. 90-95% classification accuracy, 100-300ms inference latency. Multi-stage decision system with 20 contextual behaviors, 50-200 messages/min throughput.",
    skills: ["Swift", "SwiftUI", "Firebase", "Core ML", "AI"],
    links: [
      { type: "appstore" as LinkType, url: "https://apps.apple.com/us/app/inb0x/id6758564223" },
      { type: "github" as LinkType, url: "https://github.com/ryofujimura/Zero-Inbox-Life" }
    ]
  },
  {
    id: "02",
    title: "Research Lab PM",
    subtitle: "AI-Powered Project Management",
    year: "2025",
    description: "Serverless orchestration layer enabling dynamic AI routing across 30+ researchers. Sub-200ms Cloud Functions response time. Metadata-aware prompting for task summaries and automated decision support.",
    skills: ["React", "Firebase", "Cloud Functions", "AI", "Serverless"],
    links: [
      { type: "website" as LinkType, url: "https://csulbcpx.web.app/" },
      { type: "github" as LinkType, url: "https://github.com/ryofujimura/projectmanagementweb" }
    ]
  },
  {
    id: "03",
    title: "HTIC Shuttle",
    subtitle: "Live Shuttle Tracking System",
    year: "2025",
    description: "Real-time shuttle tracking used daily by 25+ users across iOS, Android, and web. <100ms Firebase RTDB update latency. Reduced duplicate/conflicting pickup events by 70%+ through event serialization.",
    skills: ["Swift", "Kotlin", "Firebase", "Realtime", "Google API"],
    links: [
      { type: "appstore" as LinkType, url: "https://apps.apple.com/us/app/htic-shuttle/id6747784542" },
      { type: "playstore" as LinkType, url: "https://tokaishuttle.web.app/app-release.apk" },
      { type: "website" as LinkType, url: "https://tokaishuttle.web.app/" }
    ]
  },
  {
    id: "04",
    title: "Saboriendo",
    subtitle: "E-commerce Bakery Platform",
    year: "2024",
    description: "Full-stack e-commerce using React 19, SwiftUI, Firebase. Barcode-based order verification (CODE128, 11+ formats) reducing lookup time 50%+. 30-minute time-slot booking system with multi-language support (EN/JP/ES).",
    skills: ["React", "SwiftUI", "Firebase", "AVFoundation", "FCM"],
    links: [
      { type: "appstore" as LinkType, url: "https://apps.apple.com/us/app/saboriendo/id6757139459" },
      { type: "website" as LinkType, url: "https://saboriendo.web.app/" }
    ]
  },
  {
    id: "05",
    title: "CyberEdu",
    subtitle: "Cross-Platform Education App",
    year: "2025",
    description: "Synchronized iOS+Android apps supporting live event updates for 50+ users. 99%+ cross-device sync reliability across unstable networks.",
    skills: ["Swift", "Kotlin", "Firebase"],
    links: [
      { type: "appstore" as LinkType, url: "https://apps.apple.com/us/app/cyberedu/id6745105687" },
      { type: "playstore" as LinkType, url: "https://cyberedu-rf.vercel.app/SDK/CyberEdu101.apk" },
      { type: "website" as LinkType, url: "https://cyberedu-rf.vercel.app/" }
    ]
  },
  {
    id: "06",
    title: "Whiteboard AI",
    subtitle: "Collaborative Vision ML Canvas",
    year: "2025",
    description: "Transformer-based vision inference at 150-200ms latency with CRDT-like real-time collaboration. Multi-user async WebSocket pipeline supporting 5+ concurrent users (scalable to 25).",
    skills: ["PyTorch", "WebSocket", "React", "Transformers"],
    links: [
      { type: "website" as LinkType, url: "https://whiteboard-4dl2wytqj-ryofujimuras-projects.vercel.app" },
      { type: "github" as LinkType, url: "https://github.com/ryofujimura/whiteboard-ai" }
    ]
  },
  {
    id: "07",
    title: "With",
    subtitle: "Offline LLM Chat App",
    year: "2024",
    description: "Offline-capable LLM chat using GGUF + llama.cpp with <50ms/token local inference. 2GB+ memory reduction via quantization. MVVM SwiftUI architecture with advanced system prompt management.",
    skills: ["Swift", "SwiftUI", "llama.cpp", "GGUF", "Privacy"],
    links: [
      { type: "appstore" as LinkType, url: "https://apps.apple.com/us/app/with-cheer-assistance/id6738982526" }
    ]
  },
  {
    id: "08",
    title: "Custom 3D-Printed Mouse",
    subtitle: "Personalized Input Device Research",
    year: "2024",
    description: "Designed personalized 3D-printed mouse reducing total weight by 45%, with 15.1g custom shell and stress-tested 15% infill. Published at ACM/IEEE ICCPS 2025.",
    skills: ["3D Printing", "CAD", "Research", "HCI"],
    links: [
      { type: "website" as LinkType, url: "/#experience-cpx-lab" },
      { type: "paper" as LinkType, url: "/documents/ACMIEEEICCPS2025.pdf" }
    ]
  },
  {
    id: "09",
    title: "Robotic Keyboard Actuation",
    subtitle: "Human vs. Robot Classification",
    year: "2024",
    description: "Robotic keyboard system achieving 102 keystrokes/30s (100% success), 21.7ms latency, 95% classification accuracy using 33 temporal features over 40 trajectories. Published at IEEE ICRA 2026.",
    skills: ["Robotics", "ML", "Signal Processing", "Research"],
    links: [
      { type: "website" as LinkType, url: "/#experience-cpx-lab" },
      { type: "paper" as LinkType, url: "/documents/IEEEICRA2026.pdf" }
    ]
  },
  {
    id: "10",
    title: "Portfolio Website",
    subtitle: "Brutalist Design System",
    year: "2024",
    description: "Next.js 16 + React 19 portfolio with GSAP animations. 40-60% faster page loads via client-side optimization. Modular components with clean deployment pipelines.",
    skills: ["React", "Next.js", "GSAP", "Tailwind", "Firebase"],
    links: [
      { type: "website" as LinkType, url: "https://ryofujimura.github.io" },
      { type: "github" as LinkType, url: "https://github.com/ryofujimura/ryofujimura.github.io" }
    ]
  },
  {
    id: "11",
    title: "Matcha Time",
    subtitle: "Time Zone Coordination Tool",
    year: "2024",
    description: "macOS menu bar app for time zone management. Used by 50 users at launch. 4-week idea-to-launch timeline.",
    skills: ["Swift", "SwiftUI", "macOS"],
    links: [
      { type: "appstore" as LinkType, url: "https://apps.apple.com/us/app/matcha-time/id6497067918?mt=12" },
      { type: "github" as LinkType, url: "https://github.com/ryofujimura/timeZoneFinder/" }
    ]
  },
  {
    id: "12",
    title: "Schedule Mastermind",
    subtitle: "Course Scheduling Engine",
    year: "2023",
    description: "Python Flask scheduler organizing 500+ courses with real-time conflict detection. Improved planning for 100-300+ students, reduced scheduling errors by 70%+.",
    skills: ["Python", "Flask", "Algorithms"],
    links: [
      { type: "github" as LinkType, url: "https://github.com/ryofujimura/ClassScheduler" }
    ]
  },
  {
    id: "13",
    title: "Shohei Home Ground",
    subtitle: "Automated Content Pipeline",
    year: "2023",
    description: "Automated daily Instagram posting for 685 posts, growing to 11,000 followers in 8 months. Saved 2+ hours/day via Python automation enabling consistent monetization.",
    skills: ["Python", "API", "Automation"],
    links: [
      { type: "instagram" as LinkType, url: "https://www.instagram.com/shoheihomeground/" },
      { type: "youtube" as LinkType, url: "https://www.youtube.com/c/ShoheiHomeGround" }
    ]
  },
  {
    id: "14",
    title: "Poker Percentage",
    subtitle: "WatchOS Odds Calculator",
    year: "2022",
    description: "WatchOS poker odds calculator with <10ms probability lookups using precomputed tables. Real-time equity insights for improved decision accuracy.",
    skills: ["Swift", "SwiftUI", "WatchOS", "Algorithms"],
    links: [
      { type: "appstore" as LinkType, url: "https://apps.apple.com/us/app/poker-pocket-odds/id6499280318" },
      { type: "github" as LinkType, url: "https://github.com/ryofujimura/WatchApp-PokerPercentage" }
    ]
  },
]

// Link display config
const linkConfig: Record<LinkType, { label: string; icon: string }> = {
  appstore: { label: "App Store", icon: "" },
  playstore: { label: "Play Store", icon: "å" },
  github: { label: "GitHub", icon: "©" },
  website: { label: "Website", icon: "∑" },
  instagram: { label: "Instagram", icon: "" },
  youtube: { label: "YouTube", icon: "¥" },
  paper: { label: "Paper", icon: "📄" },
}

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
  framework: { skills: ["SwiftUI", "React", "Next.js", "Flask", "PyTorch", "AVFoundation"], color: "text-cyan-400" },
  platform: { skills: ["WatchOS", "macOS", "Firebase", "Cloud Functions", "Serverless", "Google API", "FCM"], color: "text-green-400" },
  concept: { skills: ["GSAP", "Tailwind", "WebSocket", "API", "llama.cpp", "GGUF", "CAD", "3D Printing"], color: "text-yellow-400" },
  paradigm: { skills: ["Realtime", "ML", "Core ML", "AI", "Automation", "Algorithms", "Privacy", "Transformers", "Research", "HCI", "Robotics", "Signal Processing"], color: "text-purple-400" },
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
  onToggle,
  onSkillClick
}: { 
  project: typeof projects[0]
  index: number
  isExpanded: boolean
  onToggle: () => void
  onSkillClick?: (skill: string) => void
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
        className="w-full text-left group flex items-center gap-2 hover:bg-white/5 -mx-2 px-2 py-0.5 transition-colors"
      >
        <span className="text-white/50">{String(index + 1).padStart(2, "0")}.</span>
        <span className={cn(
          "font-medium transition-colors",
          isExpanded ? "text-sky-300" : "text-sky-300/80 group-hover:text-sky-300"
        )}>
          {project.title}
        </span>
        <span className={cn(
          "text-[0.8em] transition-transform duration-200",
          isExpanded ? "text-emerald-300 rotate-90" : "text-white/30"
        )}>
          ▶
        </span>
        {!isExpanded && (
          <span className="text-white/30 text-[0.85em]">
            // {project.year}
          </span>
        )}
      </button>

      {/* Tech stack - clickable skills */}
      <div className="text-white/50 ml-6">
        {"["}
        {project.skills.map((tech, i) => (
          <span key={tech}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSkillClick?.(tech)
              }}
              className="text-amber-200/80 hover:text-amber-200 hover:underline transition-colors"
            >
              {tech}
            </button>
            {i < project.skills.length - 1 && <span className="text-white/30">, </span>}
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
        <div className="ml-6 mt-2 mb-3 pl-3 border-l border-white/10">
          {/* Subtitle */}
          <div className="mb-2">
            <span className="text-white/50">type: </span>
            <span className="text-cyan-300">{project.subtitle}</span>
          </div>
          {/* Description */}
          <div className="mb-2">
            <span className="text-white/50">desc: </span>
            <span className="text-white/70">{project.description}</span>
          </div>
          {/* Year */}
          <div className="mb-2">
            <span className="text-white/50">year: </span>
            <span className="text-lime-300">{project.year}</span>
          </div>
          {/* Links */}
          {project.links.length > 0 && (
            <div className="mb-2">
              <span className="text-white/50">links: </span>
              <span className="text-white/30">[</span>
              {project.links.map((link, i) => (
                <span key={link.type}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-rose-300 hover:text-rose-200 hover:underline transition-colors"
                  >
                    {linkConfig[link.type].icon && (
                      <span className="mr-0.5">{linkConfig[link.type].icon}</span>
                    )}
                    {linkConfig[link.type].label}
                  </a>
                  {i < project.links.length - 1 && <span className="text-white/30">, </span>}
                </span>
              ))}
              <span className="text-white/30">]</span>
            </div>
          )}
          {/* ID */}
          <div>
            <span className="text-white/50">id: </span>
            <span className="text-violet-300">PRJ-{project.id}</span>
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
  onClose,
  onSkillClick
}: { 
  skill: string | null
  isActive: boolean
  onClose: () => void
  onSkillClick?: (skill: string) => void
}) {
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingFrame, setLoadingFrame] = useState(0)
  const [headerLines, setHeaderLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [isHeaderComplete, setIsHeaderComplete] = useState(false)
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [allExpanded, setAllExpanded] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Reset expand state when skill changes
  useEffect(() => {
    setAllExpanded(false)
    setExpandedProject(null)
    setInputValue("")
    setHistoryIndex(-1)
  }, [skill])

  // Focus input when header animation completes
  useEffect(() => {
    if (isHeaderComplete && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isHeaderComplete])

  // Handle command input
  const handleCommand = useCallback((command: string) => {
    const trimmedCommand = command.trim().toLowerCase()
    if (!trimmedCommand) return

    // Add to history
    setCommandHistory(prev => [...prev, command])
    setHistoryIndex(-1)
    setInputValue("")

    // Check for help command
    if (trimmedCommand === "help" || trimmedCommand === "--help" || trimmedCommand === "-h") {
      return // Could show help in future
    }

    // Check for clear/exit commands
    if (trimmedCommand === "clear" || trimmedCommand === "exit" || trimmedCommand === "q") {
      onClose()
      return
    }

    // Find matching skill (case-insensitive)
    const matchedSkill = allSkills.find(s => 
      s.toLowerCase() === trimmedCommand || 
      s.toLowerCase().includes(trimmedCommand)
    )

    if (matchedSkill) {
      onSkillClick?.(matchedSkill)
    }
  }, [onClose, onSkillClick])

  // Handle key events for history navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputValue)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex] || "")
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex] || "")
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInputValue("")
      }
    } else if (e.key === "Escape") {
      onClose()
    } else if (e.key === "Tab") {
      e.preventDefault()
      // Tab completion - find skills that start with current input
      if (inputValue.trim()) {
        const matches = allSkills.filter(s => 
          s.toLowerCase().startsWith(inputValue.trim().toLowerCase())
        )
        if (matches.length === 1) {
          setInputValue(matches[0])
        }
      }
    }
  }, [inputValue, commandHistory, historyIndex, handleCommand, onClose])

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

  // Light pastel syntax highlighting for header lines
  const highlightLine = (line: string) => {
    if (line.startsWith("$")) {
      const parts = line.split(" ")
      return (
        <>
          <span className="text-emerald-300">$</span>
          <span className="text-sky-300"> {parts[1]}</span>
          <span className="text-amber-200"> {parts.slice(2).join(" ")}</span>
        </>
      )
    }
    if (line.includes("████")) {
      return <span className="text-emerald-300/80">{line}</span>
    }
    if (line.startsWith("[EXEC]") || line.startsWith("[OK]")) {
      const bracket = line.match(/^\[([^\]]+)\]/)
      const rest = line.replace(/^\[[^\]]+\]\s*/, "")
      return (
        <>
          <span className="text-violet-300">[{bracket?.[1]}]</span>
          <span className="text-white/70"> {rest}</span>
        </>
      )
    }
    if (line.startsWith("SKILL:")) {
      return (
        <>
          <span className="text-white/60">SKILL: </span>
          <span className="text-rose-300 font-medium">{skill}</span>
        </>
      )
    }
    if (line.startsWith("PROJECTS:")) {
      return (
        <>
          <span className="text-white/60">PROJECTS: </span>
          <span className="text-amber-200 font-medium">{relatedProjects.length}</span>
        </>
      )
    }
    if (line.startsWith("YEARS:")) {
      const years = [...new Set(relatedProjects.map(p => p.year))].sort()
      return (
        <>
          <span className="text-white/60">YEARS: </span>
          <span className="text-lime-300">{years.join(", ")}</span>
        </>
      )
    }
    if (line.startsWith("//")) {
      return <span className="text-white/40 italic">{line}</span>
    }
    return <span className="text-white/50">{line}</span>
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
              onClick={onClose}
              className="w-2.5 h-2.5 rounded-full bg-yellow-500/60 hover:bg-yellow-500 transition-colors relative"
              title="Close"
            >
              <span className="absolute inset-0 flex items-center justify-center text-[6px] text-yellow-900 opacity-0 group-hover/buttons:opacity-100 transition-opacity">−</span>
            </button>
            <button 
              onClick={() => setAllExpanded(prev => !prev)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-colors relative",
                allExpanded ? "bg-green-500" : "bg-green-500/60 hover:bg-green-500"
              )}
              title={allExpanded ? "Collapse all" : "Expand all"}
            >
              <span className="absolute inset-0 flex items-center justify-center text-[6px] text-green-900 opacity-0 group-hover/buttons:opacity-100 transition-opacity">
                {allExpanded ? "−" : "+"}
              </span>
            </button>
            <span className="hidden md:inline font-mono text-[9px] text-white/60 ml-2">
              ryofujimura@MacBookPro
            </span>
          </div>
          <div className="font-mono text-[9px] text-white/50">
            <span className="hidden sm:inline">skill_query.sh — </span>{skill}
          </div>
        </div>

        {/* Terminal body - click to focus input */}
        <div 
          className="p-4 sm:p-6 font-mono text-[10px] sm:text-xs leading-relaxed min-h-[120px] relative text-left cursor-text"
          onClick={() => isHeaderComplete && inputRef.current?.focus()}
        >
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
              <div className="flex items-center gap-2 text-white/60">
                <span className="text-emerald-300">{loadingFrames[loadingFrame]}</span>
                <span><span className="text-emerald-300">$</span> Initializing query...</span>
              </div>
              <div className="mt-2 flex gap-0.5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-1 h-1 transition-all duration-100",
                      i <= loadingFrame ? "bg-emerald-300" : "bg-white/10"
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
                        <span className="inline-block w-2 h-4 bg-emerald-300 ml-0.5 animate-pulse" />
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
                      isExpanded={allExpanded || expandedProject === project.id}
                      onToggle={() => {
                        if (allExpanded) {
                          // When all expanded, clicking collapses just that one
                          setAllExpanded(false)
                          setExpandedProject(null)
                        } else {
                          setExpandedProject(
                            expandedProject === project.id ? null : project.id
                          )
                        }
                      }}
                      onSkillClick={onSkillClick}
                    />
                  ))}
                  
                  {/* Footer line */}
                                  <div className="mt-3 min-h-[1.4em]">
                                    <span className="text-violet-300">[OK]</span>
                                    <span className="text-white/70"> Query complete. {relatedProjects.length} result(s) found.</span>
                                  </div>
                                  {/* Interactive command input */}
                                  <div className="min-h-[1.4em] flex items-center">
                                    <span className="text-emerald-300">$</span>
                                    <span className="text-sky-300 ml-1">skill</span>
                                    <span className="text-amber-200 ml-1">--query</span>
                                    <span className="text-white ml-1">&quot;</span>
                                    <input
                                      ref={inputRef}
                                      type="text"
                                      name="skill-query"
                                      value={inputValue}
                                      onChange={(e) => setInputValue(e.target.value)}
                                      onKeyDown={handleKeyDown}
                                      className="bg-transparent border-none outline-none text-white font-mono text-inherit w-24 sm:w-32 caret-emerald-300"
                                      placeholder=""
                                      autoComplete="off"
                                      autoCorrect="off"
                                      autoCapitalize="off"
                                      spellCheck={false}
                                      data-form-type="other"
                                      data-1p-ignore="true"
                                      data-lpignore="true"
                                    />
                                    <span className="text-white">&quot;</span>
                                  </div>
                                  <div className="mt-1 text-[8px] text-white/30">
                                    type skill name + enter · tab to autocomplete · esc/q to close
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
  sizeMultiplier = 1,
}: {
  skill: string
  projectCount: number
  isActive: boolean
  isAnyActive: boolean
  onClick: () => void
  onRefChange?: (el: HTMLButtonElement | null) => void
  sizeMultiplier?: number
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  // Report ref to parent (only once on mount)
  useLayoutEffect(() => {
    onRefChange?.(buttonRef.current)
    return () => onRefChange?.(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
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

  // Calculate font size based on viewport and multiplier
  // Base: 8vw on mobile, 6vw on md, 5vw on lg
  const baseSizeVw = typeof window !== 'undefined' 
    ? (window.innerWidth >= 1024 ? 5 : window.innerWidth >= 768 ? 6 : 8)
    : 5
  const fontSize = `${baseSizeVw * sizeMultiplier}vw`

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={cn(
        "skill-btn group relative inline-flex items-baseline gap-1",
        "font-mono font-bold tracking-tight cursor-pointer touch-manipulation",
        "leading-[0.9]",
        isActive
          ? colorClass
          : isAnyActive
            ? "text-foreground/10 hover:text-foreground/20"
            : cn("text-foreground/20 hover:text-foreground/40", `hover:${colorClass}`)
      )}
      style={{ fontSize }}
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
  const [skillRowMap, setSkillRowMap] = useState<Map<string, number>>(new Map())
  const hasCalculatedRows = useRef(false)
  const isMobile = useIsMobile()

  // Track skill button ref
  const setSkillRef = useCallback((skill: string, el: HTMLButtonElement | null) => {
    if (el) {
      skillRefsMap.current.set(skill, el)
    } else {
      skillRefsMap.current.delete(skill)
    }
  }, [])

  // Pre-calculate row assignments based on pyramid structure
  // More skills fit in lower rows since they're smaller
  useEffect(() => {
    // Create row map: skills are assigned to rows in a pyramid pattern
    // Row 0: first ~3-4 skills (largest)
    // Row 1: next ~4-5 skills
    // Row 2: next ~5-6 skills, etc.
    const newRowMap = new Map<string, number>()
    let currentRow = 0
    let skillsInRow = 0
    // Skills per row increases as we go down (since font is smaller)
    const getSkillsForRow = (row: number) => Math.floor(3 + row * 1.5)
    
    allSkills.forEach((skill, index) => {
      const maxForThisRow = getSkillsForRow(currentRow)
      if (skillsInRow >= maxForThisRow) {
        currentRow++
        skillsInRow = 0
      }
      newRowMap.set(skill, currentRow)
      skillsInRow++
    })
    
    setSkillRowMap(newRowMap)
    hasCalculatedRows.current = true
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

  // Scroll terminal into view on mobile
  useEffect(() => {
    if (!activeSkill || !terminalRef.current || !isMobile) return

    // Wait for terminal to render and position
    const timeout = setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center"
        })
      }
    }, 100)

    return () => clearTimeout(timeout)
  }, [activeSkill, isMobile])

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
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="ascii-decoration font-mono text-[9px] sm:text-[11px] text-foreground/40 tracking-[0.2em] mb-2">
                Projects
              </div>
              <h2 className="ascii-decoration font-mono text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tighter">
                to Imagine the Unimaginable
              </h2>
            </div>
            <div className="ascii-decoration font-mono text-[10px] text-foreground/30 text-right">
              <div><span className="text-purple-400">const</span> skills = <span className="text-orange-400">{allSkills.length}</span>;</div>
              <div><span className="text-purple-400">const</span> projects = <span className="text-orange-400">{projects.length}</span>;</div>
            </div>
          </div>

          {/* Light divider */}
          <div className="mt-6 h-px bg-foreground/10" />
        </div>

        {/* Skills display with inline terminal */}
        <div
          ref={skillsContainerRef}
          className="relative text-center py-6 sm:py-10 max-w-6xl mx-auto"
          style={{ paddingBottom: activeSkill ? `${terminalHeight + 40}px` : undefined }}
        >
          {/* Skills flow - wrapped on all screen sizes */}
          <div className="flex flex-row flex-wrap justify-center items-end gap-x-[0.2em] gap-y-[0.1em]">
            {allSkills.map((skill, index) => {
              const rowIdx = skillRowMap.get(skill) || 0
              // Size multiplier decreases with each row (more items fit)
              // Custom size progression per row
              const sizeByRow = [1.0, 0.9, 0.8, 0.72, 0.6, 0.5, 0.45]
              const sizeMultiplier = sizeByRow[Math.min(rowIdx, sizeByRow.length - 1)]
              // Line height follows similar progression
              const lineHeightByRow = [1.2, 1.1, 1.0, 0.95, 0.85, 0.8, 0.75]
              const lineHeight = lineHeightByRow[Math.min(rowIdx, lineHeightByRow.length - 1)]
              return (
                <span 
                  key={skill} 
                  className="inline-flex items-end"
                  style={{ lineHeight: `${lineHeight}em` }}
                >
                  <SkillButton
                    skill={skill}
                    projectCount={skillsMap.get(skill)?.length || 0}
                    isActive={activeSkill === skill}
                    isAnyActive={activeSkill !== null}
                    onClick={() => handleSkillClick(skill)}
                    onRefChange={(el) => setSkillRef(skill, el)}
                    sizeMultiplier={sizeMultiplier}
                  />
                  {index < allSkills.length - 1 && (
                    <span 
                      className="font-mono text-foreground/10 mx-[0.1em] select-none"
                      style={{ fontSize: `${2.5 * sizeMultiplier}vw` }}
                    >
                      ·
                    </span>
                  )}
                </span>
              )
            })}
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
                onSkillClick={(newSkill) => setActiveSkill(newSkill)}
              />
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="max-w-6xl mx-auto mt-10 sm:mt-14 mb-16 sm:mb-0">
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
