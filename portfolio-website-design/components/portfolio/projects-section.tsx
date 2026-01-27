"use client"

import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Github, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { AsciiObjSplitView } from "@/components/ascii-obj-split-view"

gsap.registerPlugin(ScrollTrigger)

const INITIAL_VISIBLE = 4

type Project = {
  id: string
  title: string
  subtitle: string
  year: string
  description: string
  stats: string[]
  skills: string[]
  links: Record<string, string>
  objViewer?: { urls: string[] }
}

const allProjects: Project[] = [
  {
    id: "01",
    title: "Saboriendo Bakery Platform",
    subtitle: "Website, iOS App",
    year: "2024",
    description:
      "Full-stack e-commerce using React 19, SwiftUI, Firebase. Real-time order processing, FCM/APNs push. Barcode verification (AVFoundation, JsBarcode CODE128), 11+ formats, 50%+ faster in-store lookup. Firestore collectionGroup analytics and payment dashboards. Dynamic menu, 30-min drop scheduling, bulk discounts, EN/JP/ES.",
    stats: ["50%+ lookup speedup", "11+ barcode formats", "3 languages"],
    skills: ["React 19", "SwiftUI", "Firebase", "Firestore", "AVFoundation"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", web: "https://ryofujimura.github.io" },
  },
  {
    id: "02",
    title: "Zero Inbox",
    subtitle: "AI-Driven Email Prioritization App",
    year: "2025",
    description:
      "Swift/SwiftUI email client with Google Mail API, Firebase, AI reasoning engine. 90–95% classification accuracy, 100–300ms end-to-end inference. Multi-stage decision system: top-3 actions from 20 contextual behaviors. 50–200 messages/min throughput, secure token handling, low-latency sync.",
    stats: ["95% accuracy", "200ms latency", "50–200/min"],
    skills: ["Swift", "SwiftUI", "Firebase", "AI/ML", "Google APIs"],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
  },
  {
    id: "03",
    title: "Project Management for Research Labs",
    subtitle: "GitHub, Website",
    year: "2025",
    description:
      "Serverless orchestration for dynamic AI routing across 30+ researchers and multi-lab workflows. Sub-200ms average Cloud Functions response under concurrent load. Metadata-aware prompting for task summaries, project updates, automated decision support.",
    stats: ["<200ms response", "30+ researchers", "multi-lab"],
    skills: ["Cloud Functions", "Firebase", "AI routing", "Node.js"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "04",
    title: "HTIC Shuttle",
    subtitle: "App Store, Play Store, GitHub, Website",
    year: "2025",
    description:
      "Live shuttle tracking for 25+ daily users on iOS, Android, web. 70%+ reduction in duplicate/conflicting pickups via event serialization and state validation. Real-time sync under 100ms Firebase RTDB latency.",
    stats: ["25+ users", "70%+ reduction", "<100ms sync"],
    skills: ["Swift", "Kotlin", "Firebase RTDB", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
  },
  {
    id: "05",
    title: "CyberEdu",
    subtitle: "App Store, Play Store, GitHub, Website",
    year: "2025",
    description:
      "Synchronized iOS+Android apps for live event updates (50+ users). 99%+ cross-device sync reliability across unstable networks.",
    stats: ["50+ users", "99%+ sync", "iOS + Android"],
    skills: ["Swift", "Kotlin", "Firebase", "Real-time"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#", playStore: "#" },
  },
  {
    id: "06",
    title: "Whiteboard AI",
    subtitle: "GitHub, Website",
    year: "2025",
    description:
      "Transformer-based vision inference at 150–200ms latency; real-time CRDT-like collaboration. 5+ concurrent users (scalable to 25). Multi-user async WebSocket pipeline with queueing and cross-tab sync.",
    stats: ["150–200ms", "5+ users", "CRDT-like"],
    skills: ["PyTorch", "Vision", "WebSocket", "React"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "07",
    title: "With",
    subtitle: "GitHub",
    year: "2024–2025",
    description:
      "Offline-capable LLM chat using GGUF + llama.cpp, <50ms/token local inference. 2GB+ memory savings via quantization and optimized caching/streaming. MVVM SwiftUI, advanced system prompt management.",
    stats: ["<50ms/token", "2GB+ saved", "offline"],
    skills: ["Swift", "llama.cpp", "GGUF", "SwiftUI"],
    links: { github: "https://github.com/ryofujimura" },
  },
  {
    id: "08",
    title: "Ryo Fujimura Website",
    subtitle: "GitHub, Website",
    year: "2024–2025",
    description:
      "Client-side performance tuning: 40–60% faster load. Modular components for rapid content iteration and clean deployment (Vercel/GitHub Pages).",
    stats: ["40–60% faster", "modular", "Vercel"],
    skills: ["React", "Next.js", "Tailwind", "Vercel"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "09",
    title: "Matcha Time",
    subtitle: "App Store, GitHub, Website",
    year: "2024",
    description:
      "Swift/SwiftUI time zone coordination tool; 50 users at launch. 4-week idea-to-launch: project planning and execution.",
    stats: ["50 users", "4-week launch", "SwiftUI"],
    skills: ["Swift", "SwiftUI", "App Store"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io", appStore: "#" },
  },
  {
    id: "10",
    title: "Schedule Mastermind",
    subtitle: "GitHub, Website",
    year: "2023–2024",
    description:
      "Python Flask scheduler for 500+ courses with real-time conflict detection. Improved planning for 100–300+ students, 70%+ fewer scheduling errors.",
    stats: ["500+ courses", "70%+ fewer errors", "Flask"],
    skills: ["Python", "Flask", "scheduling"],
    links: { github: "https://github.com/ryofujimura", demo: "https://ryofujimura.github.io" },
  },
  {
    id: "11",
    title: "Shohei Home Ground",
    subtitle: "Instagram, YouTube",
    year: "2023",
    description:
      "Automated daily Instagram posting (685 posts), 11K followers in 8 months. Python automation saved 2+ hours/day; consistent content and monetization.",
    stats: ["11K followers", "685 posts", "2+ hr/day saved"],
    skills: ["Python", "automation", "Instagram"],
    links: { instagram: "#", youtube: "#" },
  },
  {
    id: "12",
    title: "Poker Percentage",
    subtitle: "App Store, GitHub",
    year: "2022–2024",
    description:
      "WatchOS poker odds calculator, <10ms probability lookups via precomputed tables. Fast, reliable real-time equity insights.",
    stats: ["<10ms lookup", "WatchOS", "precomputed"],
    skills: ["Swift", "WatchOS", "probability"],
    links: { github: "https://github.com/ryofujimura", appStore: "#" },
  },
  {
    id: "13",
    title: "Custom 3D-Printed Mouse",
    subtitle: "ICCPS 2025",
    year: "2025",
    description:
      "Ergonomic 3D-printed mouse designs. OBJ models for mouse1 and mouse2 — interactive ASCII split view (original vs. character-based rendering) per Alex Harri’s shape-aware technique.",
    stats: ["OBJ viewer", "ASCII split view", "ICCPS 2025"],
    skills: ["Three.js", "OBJ", "ASCII rendering"],
    links: { github: "https://github.com/ryofujimura", demo: "#" },
    objViewer: { urls: ["/models/mouse1.obj", "/models/mouse2.obj"] },
  },
]

function projectLabelFromUrl(url: string): string {
  const name = url.split("/").pop()?.replace(/\.obj$/i, "") ?? "model"
  return name
}

function ProjectBlock({
  project,
  index,
  totalVisible,
}: {
  project: Project
  index: number
  totalVisible: number
}) {
  const blockRef = useRef<HTMLDivElement>(null)
  const urls = project.objViewer?.urls ?? []
  const [objIndex, setObjIndex] = useState(0)
  const selectedUrl = urls[objIndex] ?? urls[0]

  useEffect(() => {
    const el = blockRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            end: "top 55%",
            toggleActions: "play none none none",
          },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [totalVisible])

  const hasGithub = project.links.github
  const hasDemo = "demo" in project.links && (project.links as { demo?: string }).demo
  const hasAppStore = "appStore" in project.links && (project.links as { appStore?: string }).appStore
  const hasPlayStore = "playStore" in project.links && (project.links as { playStore?: string }).playStore

  return (
    <article
      ref={blockRef}
      className={cn(
        "border-t-2 border-foreground bg-background",
        "grid grid-cols-1 md:grid-cols-[auto_1fr] md:gap-0",
        "min-h-0"
      )}
    >
      {/* Editorial label — Motorist magazine style */}
      <div className="md:border-r-2 md:border-foreground md:min-w-[4.5rem] lg:min-w-[5.5rem] flex md:flex-col md:justify-start md:pt-6 md:pb-6 md:pl-4 md:pr-4 lg:pl-6 lg:pr-6 pt-4 pb-2 md:pt-6 md:pb-4">
        <span className="font-mono text-[10px] xs:text-xs sm:text-sm text-muted-foreground uppercase tracking-[0.2em] md:tracking-[0.25em]">
          Project
        </span>
        <span className="font-mono text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-foreground tabular-nums ml-2 md:ml-0 md:mt-1">
          {project.id}
        </span>
      </div>

      <div className="pb-6 sm:pb-8 md:pb-8 md:pl-6 lg:pl-8 md:pr-6 lg:pr-8 md:pt-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground leading-tight tracking-tight font-mono uppercase">
            {project.title}
          </h3>
          <span className="font-mono text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">
            {project.year}
          </span>
        </div>
        <p className="font-mono text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">
          {project.subtitle}
        </p>
        <p className="text-sm sm:text-base text-foreground/90 leading-relaxed mb-4 sm:mb-5 max-w-2xl">
          {project.description}
        </p>

        {/* Stats bar — brutalist */}
        {project.stats && project.stats.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-5">
            {project.stats.map((s) => (
              <span
                key={s}
                className="inline-block font-mono text-[10px] sm:text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 border-2 border-foreground text-foreground bg-background"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {project.skills.map((skill) => (
            <span
              key={skill}
              className="font-mono text-[9px] xs:text-[10px] sm:text-xs text-muted-foreground border border-foreground/30 px-2 py-0.5 sm:px-2.5 sm:py-1"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* OBJ + ASCII split view (Alex Harri–style) */}
        {urls.length > 0 && (
          <div className="mt-4 sm:mt-5">
            {urls.length > 1 && (
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                {urls.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setObjIndex(i)}
                    className={cn(
                      "touch-target min-h-[44px] font-mono text-[10px] sm:text-xs uppercase tracking-wider px-2.5 py-1.5 sm:px-3 sm:py-2 border-2 transition-colors",
                      i === objIndex
                        ? "border-foreground bg-foreground text-background"
                        : "border-foreground/50 text-foreground hover:border-foreground"
                    )}
                  >
                    {projectLabelFromUrl(url)}
                  </button>
                ))}
              </div>
            )}
            <AsciiObjSplitView
              objUrl={selectedUrl}
              className="rounded-none"
              asciiCols={72}
              asciiRows={36}
              sampleQuality={2}
              renderWidth={320}
              renderHeight={240}
            />
          </div>
        )}

        {/* Links — 44px touch targets */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-5">
          {hasGithub && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target inline-flex items-center justify-center gap-1.5 sm:gap-2 min-h-[44px] px-3 sm:px-4 py-2 sm:py-2.5 font-mono text-[10px] sm:text-xs uppercase tracking-wider border-2 border-foreground text-foreground bg-background hover:bg-foreground hover:text-background transition-colors"
            >
              <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              Source
            </a>
          )}
          {hasDemo && (
            <a
              href={(project.links as { demo?: string }).demo}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target inline-flex items-center justify-center gap-1.5 sm:gap-2 min-h-[44px] px-3 sm:px-4 py-2 sm:py-2.5 font-mono text-[10px] sm:text-xs uppercase tracking-wider border-2 border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              Demo
            </a>
          )}
          {hasAppStore && (
            <a
              href={(project.links as { appStore?: string }).appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target inline-flex items-center justify-center min-h-[44px] px-3 sm:px-4 py-2 sm:py-2.5 font-mono text-[10px] sm:text-xs uppercase tracking-wider border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              App Store
            </a>
          )}
          {hasPlayStore && (
            <a
              href={(project.links as { playStore?: string }).playStore}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target inline-flex items-center justify-center min-h-[44px] px-3 sm:px-4 py-2 sm:py-2.5 font-mono text-[10px] sm:text-xs uppercase tracking-wider border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              Play Store
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export function ProjectsSection() {
  const [showAll, setShowAll] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const displayed = showAll ? allProjects : allProjects.slice(0, INITIAL_VISIBLE)
  const remaining = allProjects.length - INITIAL_VISIBLE

  useEffect(() => {
    const section = sectionRef.current
    const el = headingRef.current
    if (!section || !el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 82%", toggleActions: "play none none none" },
        }
      )
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={cn(
        "relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6",
        "pb-[max(2rem,env(safe-area-inset-bottom))]",
        "bg-background"
      )}
    >
      <div className="max-w-4xl lg:max-w-5xl mx-auto">
        <div ref={headingRef} className="mb-10 sm:mb-14 md:mb-16">
          <p className="font-mono text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.25em] mb-2">
            — Work
          </p>
          <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[0.95] uppercase">
            Projects
          </h2>
          <div className="mt-4 sm:mt-6 h-1 w-16 sm:w-24 bg-foreground" />
        </div>

        <div className="border-t-2 border-foreground">
          {displayed.map((project, index) => (
            <ProjectBlock
              key={project.id}
              project={project}
              index={index}
              totalVisible={displayed.length}
            />
          ))}
        </div>

        {!showAll && remaining > 0 && (
          <div className="mt-8 sm:mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className={cn(
                "touch-target w-full sm:w-auto min-h-[48px] flex items-center justify-center gap-2 sm:gap-3",
                "px-5 sm:px-8 py-3.5 sm:py-4",
                "font-mono text-xs sm:text-sm uppercase tracking-[0.2em]",
                "border-2 border-foreground bg-foreground text-background",
                "hover:bg-background hover:text-foreground transition-colors"
              )}
            >
              Show all {allProjects.length} projects
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 rotate-[-90deg] sm:rotate-0" />
            </button>
          </div>
        )}

        {showAll && (
          <div className="mt-10 sm:mt-12 text-center">
            <a
              href="#contact"
              className="touch-target inline-flex items-center justify-center min-h-[44px] font-mono text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ↓ Contact
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
