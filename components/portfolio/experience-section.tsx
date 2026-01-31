"use client"

import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { GSAPText, GSAPSVG } from "@/components/gsap-text"
import { TechnicalGrid, TechnicalPattern } from "@/components/technical-grid"
import { SkillSurfaceGlobe } from "@/components/skill-surface-globe"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

const INITIAL_INDEX_VISIBLE = 3

// Helper to bold numbers in highlight text (includes adjacent letters and symbols)
function BoldNumbers({ text }: { text: string }) {
  // Match numbers with adjacent letters, symbols (~, #, ×, %, +, –, /)
  const parts = text.split(/([~#]?[A-Za-z]*\d+(?:[–-]\d+)?[A-Za-z]*[%×+]?|[~#]?\d+[A-Za-z]*[%×+]?|\d+\/\d+[A-Za-z]*)/g)
  return (
    <>
      {parts.map((part, i) =>
        /\d/.test(part) ? (
          <strong key={i} className="font-bold">{part}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

// Reusable index list row: optional ref + data attrs for GSAP "load more" animation
function IndexRowButton({
  exp,
  index,
  activeIndex,
  setActiveIndex,
  ref: rowRef,
  withDataAttrs = false,
  hideTopLine = false,
}: {
  exp: { company: string; title: string; shortTitle?: string; startDate: string; endDate: string; icon?: string }
  index: number
  activeIndex: number
  setActiveIndex: (i: number) => void
  ref?: React.Ref<HTMLButtonElement | null>
  withDataAttrs?: boolean
  hideTopLine?: boolean
}) {
  const dataAttrs = withDataAttrs
    ? {
        "data-index-icon": true,
        "data-index-company": true,
        "data-index-title": true,
        "data-index-period": true,
        "data-index-line": true,
      }
    : {}
  return (
    <button
      ref={rowRef}
      type="button"
      onClick={() => setActiveIndex(index)}
      className={cn(
        "group relative w-full text-left px-3 sm:px-4 py-3 sm:py-3.5 flex items-center justify-between gap-3 touch-target",
        "font-mono text-[11px] sm:text-xs uppercase tracking-[0.12em]",
        activeIndex === index
          ? "bg-accent text-accent-foreground"
          : "bg-secondary hover:bg-foreground hover:text-background"
      )}
    >
      {/* Horizontal line: GSAP scaleX reveal (one solid line) when withDataAttrs; skip on first expanded row */}
      {withDataAttrs && !hideTopLine && (
        <div
          data-index-line-wrap
          className="absolute left-0 right-0 top-0 h-px w-full origin-left pointer-events-none"
        >
          <svg
            className="h-full w-full text-foreground/60"
            viewBox="0 0 48 1"
            preserveAspectRatio="none"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M0 0.5h48" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      )}
      <div className="flex items-center gap-2 sm:gap-3">
        {"icon" in exp && exp.icon ? (
          <span
            {...(dataAttrs["data-index-icon"] ? { "data-index-icon": true } : {})}
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-current overflow-hidden bg-background/80"
          >
            <img src={exp.icon} alt="" className="h-5 w-5 object-contain" width={20} height={20} />
          </span>
        ) : (
          <span
            {...(dataAttrs["data-index-icon"] ? { "data-index-icon": true } : {})}
            className="inline-flex h-5 w-5 items-center justify-center border border-current"
          >
            {index.toString().padStart(2, "0")}
          </span>
        )}
        <div className="flex flex-col">
          <span
            {...(dataAttrs["data-index-company"] ? { "data-index-company": true } : {})}
            className="font-semibold leading-tight"
          >
            {exp.company}
          </span>
          <span
            {...(dataAttrs["data-index-title"] ? { "data-index-title": true } : {})}
            className="text-[10px] sm:text-[11px] opacity-70 leading-tight"
          >
            {exp.shortTitle ?? exp.title}
          </span>
        </div>
      </div>
      <div
        {...(dataAttrs["data-index-period"] ? { "data-index-period": true } : {})}
        className="hidden sm:flex flex-col items-end text-[10px] opacity-80 text-right shrink-0"
      >
        <span className="whitespace-nowrap">{exp.startDate}</span>
        <span className="whitespace-nowrap">{exp.endDate}</span>
      </div>
    </button>
  )
}

// icon = index list (left rail); panelImage = ENTRY header background (optional, falls back to icon)
const experiences = [
  {
    title: "Android / iOS Developer",
    shortTitle: "Internship",
    company: "Bose Corp.",
    companyFull: "Bose Corporation",
    icon: "/images/bose_logo.svg",
    panelImage: "/images/bose_1.svg",
    mediaImages: ["/images/bose_2.JPG", "/images/bose_3.JPG"],
    mediaLabels: ["Proof 1", "Proof 2"],
    startDate: "Jun 2025",
    endDate: "Aug 2025",
    description: "Engineered internal Bluetooth debugging tools adopted by 1,000+ engineers, to debug, improve, and reduce QA friction.",
    highlights: [
      "Cut QA detection time by 40–60%, faster cycles",
      "Reduced onboarding lookup time by ~70% via UI",
      "Saved 10+ hours/week via debugging automation",
    ],
    skills: [ "iOS (SwiftUI)", "Kotlin (Android)", "App Architecture", "BLE", "WebSocket", "APIs", "Debugging", "Environment Validation", "Configuration Management"] 
    },
  {
    title: "Software Engineer",
    shortTitle: "Internship",
    company: "Honda Motor",
    companyFull: "American Honda Motor Co., Inc.",
    icon: "/images/honda.svg",
    panelImage: "/images/hondalogo.svg",
    mediaImages: ["/images/honda_1.jpg", "/images/honda_3.jpg"],
    mediaLabels: ["Proof 1", "Proof 2"],
    startDate: "Jun 2024",
    endDate: "Aug 2024",
    description: "Prototyped open-source on-device AI using Jetson Orin Nano, evaluating automotive-grade compute constraints.",
    highlights: [
      "Cut Llama3 8B latency 20–40% with quantization",
      "Achieved over 3GB RAM savings for OEM deploy",
      "Delivered demos to 10+ cross-functional teams",
    ],
    skills: ["On-Device AI","NVIDIA Jetson","Embedded GPU","LLM Deployment","Optimization","Quantization","Latency","Memory Management","Benchmarking" ] 
  },
  {
    title: "Undergraduate Researcher",
    shortTitle: "Research",
    company: "CPX Lab",
    companyFull: "California State University, Long Beach",
    icon: "/images/CSU-Longbeach.svg",
    panelImage: "/images/lb.csulb.png",
    mediaImages: ["/images/ACMIEEEICCPS2025.pdf", "/images/IEEEICRA2026.pdf"],
    mediaLabels: ["Proof 1", "Proof 2"],
    startDate: "Aug 2024",
    endDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    description: "Contributing to a 30+ person robotics/AI research group, supporting two peer-reviewed publications (ICCPS 2025, ICRA 2026).",
    highlights: [
      "Improved task accuracy by 25% via classifier",
      "Built 10 iterations of 3D-printed prototypes",
      "Created reproducible ML pipelines for the lab",
    ],
    skills: [ "Human-Computer Interaction", "Human-Robot Interaction", "Robotic Actuation", "Safety-Critical Systems", "Embedded Systems", "3D Printing", "CAD Design", "Servo Motor", "Raspberry Pi", "Signal Temporal Logic", "Machine Learning Classification" ]
  },
  {
    "title": "Software Engineer",
    "shortTitle": "Freelance",
    "company": "HTIC",
    "companyFull": "Hawaii Tokai International College",
    "icon": "/images/HTIC-icon.svg",
    "panelImage": "/images/HTIC-logo.svg",
    "mediaImages": ["https://apps.apple.com/us/app/htic-shuttle/id6747784542", "https://tokaishuttle.web.app/app-release.apk", "https://tokaishuttle.web.app/"],
    "mediaLabels": ["iOS", "Android", "Website"],
    "startDate": "Mar 2025",
    "endDate": "Nov 2025",
    "description": "Built a real-time shuttle tracking and stop-request system with a web dashboard, driver iOS app, and student iOS/Android apps, powered by Firebase for live updates.",
    "highlights": [
      "Launched multi-platform shuttle MVP in 43 days",
      "Cut rider wait times by 30 min with tracking",
      "Achieved 80% adoption rate and 8/10 usability",
    ],
    
    "skills": [
      "SwiftUI",
      "Kotlin",
      "Firebase",
      "Firestore",
      "Real-time Data",
      "MVVM",
      "REST/API",
      "Leaflet",
      "Tailwind CSS",
      "GitHub Actions",
      "Location Services",
      "Authentication"
    ]
  },
  {
    title: "Data Engineer",
    shortTitle: "Freelance",
    company: "CUSCO USA",
    companyFull: "CUSCO USA Inc.",
    icon: "/images/cusco_c.svg",
    panelImage: "/images/cusco.svg",
    mediaImages: ["/images/cusco_1.jpg"],
    mediaLabels: ["Proof 1"],
    startDate: "Oct 2021",
    endDate: "May 2024",
    description: "Built Python-based extraction pipelines processing 11,500+ legacy files spanning PDFs, images, and mixed formats.",
    highlights: [
      "Delivered 5–10× faster processing, 1–3% error",
      "Built normalization layers exposing clean API",
      "Enabled 30% revenue increase via search index",
    ],
    skills: [ "Data Engineering", "Python", "Data Extraction", "Data Normalization", "API Development", "Automation", "Batch Processing", "Information Retrieval", "Workflow Optimization"]
  },
  {
    title: "Seasonal Specialist",
    shortTitle: "Part-Time",
    company: "Apple Inc.",
    companyFull: "Apple Inc.",
    icon: "/images/apple.svg",
    panelImage: "/images/apple.svg",
    mediaImages: ["/images/apple_1.jpeg"],
    mediaLabels: ["Proof 1"],
    startDate: "Sep 2025",
    endDate: "Jan 2026",
    description: "Drove top-tier Apple Retail performance by converting high-volume customer interactions into measurable sales, attach-rate, and CX outcomes.",
    highlights: [
      "Delivered 47% AppleCare and 54% accessory rate",
      "Exceeded store benchmarks on iPhone, iPad, Mac",
      "Maintained 100 TMS with a 41-promoter streak",
    ],
    skills: [
      "Customer Service",
      "Performance Metrics",
      "Revenue Attachment Strategy",
      "Cross-Product Solution Selling",
      "KPI-Driven Execution",
      "Customer Retention & Advocacy",
      "Operational Consistency",
    ]
  },
  {
    title: "Retail Sales Associate",
    shortTitle: "Part-Time",
    company: "Nespresso ",
    companyFull: "Nespresso",
    icon: "/images/nespresso-icon.svg",
    panelImage: "/images/nespresso-logo.svg",
    mediaImages: ["/images/nespresso_1.jpeg"],
    mediaLabels: ["Proof 1"],
    startDate: "Sep 2024",
    endDate: "May 2025",
    description: "Drove top-ranked sales in a premium retail setting by matching customer preferences with high-value coffee, equipment, and subscription solutions.",
    highlights: [
      "Ranked #1 Q4 2024 sales in the U.S. Southwest",
      "Led subscription enrollment over 30-week span",
      "Achieved highest average basket with pairing",
    ],
    skills: [
      "Consultative Sales",
      "Subscription Revenue Growth",
      "Customer Preference Analysis",
      "Average Order Value Optimization",
      "Customer Retention Strategy",
      "Premium Brand Representation",
      "Sustainability Advocacy",
      "In-Store Experience Leadership"
    ]
  },
]

export function ExperienceSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [listExpanded, setListExpanded] = useState(false)
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])
  const entryBgRef = useRef<HTMLDivElement | null>(null)
  const entryScanRef = useRef<HTMLDivElement | null>(null)
  const entrySvgRef = useRef<SVGSVGElement | null>(null)
  const entryLabelRef = useRef<HTMLDivElement | null>(null)
  const moreItemsContainerRef = useRef<HTMLDivElement | null>(null)
  const moreItemsRowRefs = useRef<(HTMLButtonElement | null)[]>([])
  const loadMoreButtonRef = useRef<HTMLButtonElement | null>(null)
  const loadMoreArrowRef = useRef<SVGSVGElement | null>(null)
  const [expandAnimationDone, setExpandAnimationDone] = useState(false)
  const detailPanelRef = useRef<HTMLDivElement | null>(null)
  const [detailPanelHeight, setDetailPanelHeight] = useState(0)
  const [isLg, setIsLg] = useState(false)
  const isMobile = useIsMobile()
  const indexListRef = useRef<HTMLDivElement | null>(null)
  const [hasIndexOverflow, setHasIndexOverflow] = useState(false)

  // GSAP: ENTRY bg + ASCII frame draw → content blocks stagger
  useEffect(() => {
    const content = contentRefs.current[activeIndex]
    const entryBg = entryBgRef.current
    const scan = entryScanRef.current
    const svg = entrySvgRef.current
    const label = entryLabelRef.current
    if (!content) return

    // Reset entry SVG geometry for draw-in
    if (svg) {
      const els = svg.querySelectorAll<SVGGeometryElement>("line, path")
      els.forEach((el) => {
        if (typeof el.getTotalLength === "function") {
          const len = el.getTotalLength()
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
        }
      })
    }
    if (label) gsap.set(label, { opacity: 0 })
    if (entryBg) gsap.set(entryBg, { opacity: 0, scale: 1.06, backgroundPosition: "120% 50%" })
    if (scan) gsap.set(scan, { opacity: 0, y: -6 })
    gsap.set(content, { opacity: 1, y: 0 })
    const blocks = content.querySelectorAll<HTMLElement>("[data-detail-block]")
    gsap.set(blocks, { opacity: 0, y: 10 })

    const tl = gsap.timeline({ overwrite: true })
    // ENTRY background image: position + opacity/scale + scanline sweep (loading feel)
    if (entryBg) {
      tl.to(entryBg, {
        opacity: 0.12,
        scale: 1,
        backgroundPosition: "100% 50%",
        duration: 0.55,
        ease: "power3.out",
      })
      if (scan) {
        tl.to(scan, { opacity: 0.18, y: 0, duration: 0.18, ease: "power2.out" }, 0.06)
        tl.to(scan, { opacity: 0, y: 8, duration: 0.22, ease: "power2.in" }, 0.22)
      }
    }
    // ASCII entry frame (lines + corners) draw in
    if (svg) {
      const els = svg.querySelectorAll<SVGGeometryElement>("line, path")
      tl.to(els, { strokeDashoffset: 0, duration: 0.4, stagger: 0.04, ease: "power2.inOut" }, entryBg ? "-=0.25" : undefined)
    }
    if (label) {
      tl.to(label, { opacity: 1, duration: 0.2 }, "-=0.2")
    }
    // Content blocks stagger
    tl.to(blocks, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power3.out" }, "-=0.2")
  }, [activeIndex])

  // GSAP: expand "more" index list — height reveal then stagger rows (text + SVG line-draw)
  useEffect(() => {
    if (!listExpanded || !moreItemsContainerRef.current) return
    const container = moreItemsContainerRef.current
    const rows = moreItemsRowRefs.current.filter(Boolean) as HTMLElement[]
    if (rows.length === 0) return

    // Start collapsed for animation
    gsap.set(container, { height: 0, overflow: "hidden" })
    rows.forEach((row) => {
      gsap.set(row, { opacity: 0, y: 12 })
      const icon = row.querySelector("[data-index-icon]")
      const textBlocks = row.querySelectorAll("[data-index-company], [data-index-title], [data-index-period]")
      const lineWrap = row.querySelector("[data-index-line-wrap]") as HTMLElement | null
      if (icon) gsap.set(icon, { scale: 0.6, opacity: 0 })
      textBlocks.forEach((el) => gsap.set(el, { opacity: 0, y: 6 }))
      if (lineWrap) gsap.set(lineWrap, { scaleX: 0, transformOrigin: "left center" })
    })

    const tl = gsap.timeline({ overwrite: true })
    // Expand container to auto height (keep overflow hidden to prevent scrollbar)
    tl.to(container, {
      height: "auto",
      duration: 0.5,
      ease: "power3.inOut",
    })
    // Stagger each row: row slide + opacity, then inner content (icon, text, line draw)
    rows.forEach((row, i) => {
      const start = 0.5 + i * 0.12
      tl.to(row, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, start)
      const icon = row.querySelector("[data-index-icon]")
      const textBlocks = row.querySelectorAll("[data-index-company], [data-index-title], [data-index-period]")
      const lineWrap = row.querySelector("[data-index-line-wrap]") as HTMLElement | null
      if (icon) tl.to(icon, { scale: 1, opacity: 1, duration: 0.28, ease: "back.out(1.4)" }, start + 0.05)
      tl.to(textBlocks, { opacity: 1, y: 0, duration: 0.22, stagger: 0.04, ease: "power2.out" }, start + 0.08)
      if (lineWrap) {
        tl.to(lineWrap, { scaleX: 1, duration: 0.35, ease: "power2.out" }, start + 0.1)
      }
    })

    // Button unmounts on expand; arrow draw could run on click before setState if desired
    tl.add(() => {
      setExpandAnimationDone(true)
      if (container.style) {
        container.style.height = ""
        container.style.overflow = ""
      }
    })
  }, [listExpanded])


  // Measure detail panel height for index rail max-height on lg (side-by-side); throttle to avoid layout thrash
  useEffect(() => {
    const el = detailPanelRef.current
    if (!el) return
    let rafId: number | null = null
    let lastH = 0
    const ro = new ResizeObserver((entries) => {
      const h = entries[0]?.contentRect.height ?? 0
      if (h === lastH) return
      lastH = h
      if (rafId != null) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        setDetailPanelHeight(lastH)
        rafId = null
      })
    })
    ro.observe(el)
    return () => {
      if (rafId != null) cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [])

  // lg breakpoint (1024px) for side-by-side layout
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)")
    const onChange = () => setIsLg(mql.matches)
    mql.addEventListener("change", onChange)
    setIsLg(mql.matches)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Detect overflow in index list to conditionally show border
  useEffect(() => {
    const el = indexListRef.current
    if (!el) return
    // Only check after expand animation is done
    if (listExpanded && !expandAnimationDone) {
      setHasIndexOverflow(false)
      return
    }
    const checkOverflow = () => {
      setHasIndexOverflow(el.scrollHeight > el.clientHeight)
    }
    checkOverflow()
    const ro = new ResizeObserver(checkOverflow)
    ro.observe(el)
    return () => ro.disconnect()
  }, [listExpanded, expandAnimationDone])

  const roleCount = experiences.length
  const chartLeft = 34
  const chartRight = 366
  const chartTop = 14
  const chartBottom = 66
  const chartWidth = chartRight - chartLeft
  const step = chartWidth / Math.max(1, roleCount - 1)

  const barLevels = experiences.map((_, i) => {
    const t = roleCount <= 1 ? 1 : i / (roleCount - 1)
    return Math.round(2 + t * 4) // 2..6 blocks (simple growth signal)
  })

  const xCenters = experiences.map((_, i) => chartLeft + i * step)
  const barTops = barLevels.map((lvl) => chartBottom - lvl * 6 + 2)
  const trendPoints = xCenters.map((x, i) => `${x},${barTops[i]}`).join(" ")

  return (
    <section
      id="experience"
      className="relative py-16 sm:py-24 md:py-32 lg:py-40 px-3 sm:px-6 bg-background overflow-hidden border-y border-foreground"
    >
      {/* Brutalist technical chrome */}
      <TechnicalPattern />
      <div className="pointer-events-none absolute inset-4 opacity-10 hidden sm:block">
        <TechnicalGrid className="w-full h-full text-foreground" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start mb-10 sm:mb-14 md:mb-16">
          <div className="space-y-3 sm:space-y-4">
            <GSAPText
              variant="lines"
              className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.4em] text-muted-foreground"
            >
              Experience // Operational Log
            </GSAPText>
            <GSAPText
              variant="words"
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[0.94]"
            >
              from Research to Production. systems built to Ship, not demo.
            </GSAPText>
            <GSAPText
              variant="scramble"
              className="font-mono text-[11px] sm:text-xs text-muted-foreground/70"
            >
              STATUS: SYSTEMS-LEVEL ENGINEER // AI RESEARCH // EDGE DEPLOYMENTS
            </GSAPText>
          </div>

          <div className="relative">
            <div className="absolute inset-0 border border-dashed border-foreground/30 pointer-events-none" />
            <div className="hidden md:block bg-secondary p-4 sm:p-5 md:p-6 border border-foreground shadow-[4px_4px_0_0_theme(colors.foreground)]">
              <p className="font-mono text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                Each row below is a{" "}
                <span className="text-foreground font-semibold">work-log entry</span> across internships,
                research, and freelance: different environments, same obsession with reliability,
                observability, and measurable impact.
              </p>
              <p className="hidden sm:block font-mono text-[11px] sm:text-xs text-muted-foreground mt-3">
                Hover or tap to lock a role. In the detail panel, the metrics call out{" "}
                <span className="text-accent font-semibold">throughput, savings, or deltas</span> – not vibes.
              </p>

              <GSAPSVG className="mt-4 w-full h-20 text-foreground/40">
                <svg viewBox="0 0 400 80" className="w-full h-full" fill="none" stroke="currentColor">
                  {/* ASCII-terminal frame */}
                  <rect x="10" y="10" width="380" height="60" strokeWidth="0.9" />
                  <rect x="16" y="16" width="368" height="48" strokeWidth="0.6" opacity="0.55" />

                  {/* Scanlines + tick marks */}
                  {Array.from({ length: 11 }).map((_, i) => {
                    const x = 20 + i * 34
                    return (
                      <line
                        key={`scan-${i}`}
                        x1={x}
                        y1={16}
                        x2={x}
                        y2={64}
                        strokeWidth="0.5"
                        opacity="0.25"
                      />
                    )
                  })}
                  {Array.from({ length: 6 }).map((_, i) => {
                    const y = 20 + i * 8
                    return (
                     <line
                        key={`row-${i}`}
                        x1={16}
                        y1={y}
                        x2={384}
                        y2={y}
                        strokeWidth="0.5"
                        opacity="0.15"
                      /> 
                    )
                  })}

                  {/* Axes */}
                  <line x1={chartLeft} y1={chartTop} x2={chartLeft} y2={chartBottom} strokeWidth="0.0" />
                  <line x1={chartLeft} y1={chartBottom} x2={chartRight} y2={chartBottom} strokeWidth="0.75" />

                  {/* Bars built from blocks (ASCII looks) */}
                  {barLevels.map((lvl, i) => {
                    const x = xCenters[i] - 10
                    return (
                      <g key={`bar-${i}`}>
                        <line
                          x1={xCenters[i]}
                          y1={chartBottom}
                          x2={xCenters[i]}
                          y2={chartBottom + 3}
                          strokeWidth="0.75"
                          opacity="0.8"
                        />
                        {Array.from({ length: lvl }).map((_, j) => {
                          const y = chartBottom - (j + 1) * 6
                          return (
                            <rect
                              key={`blk-${i}-${j}`}
                              x={x}
                              y={y}
                              width="20"
                              height="5"
                              strokeWidth="0.75"
                              fill="currentColor"
                              opacity={0.08 + j * 0.02}
                            />
                          )
                        })}
                        <circle cx={xCenters[i]} cy={barTops[i]} r="2.5" strokeWidth="0.9" opacity="0.7" />
                      </g>
                    )
                  })}

                  {/* Growth trend (simple, upward) */}
                  <polyline points={trendPoints} strokeWidth="1.1" opacity="0.6" />
                   </svg>
              </GSAPSVG>
            </div>
          </div>
        </header>

        {/* Matrix layout */}
        <div className="grid gap-6 lg:grid-cols-[minmax(220px,260px)_minmax(0,1fr)] lg:items-start">
          {/* Index rail: on lg, height matches detail panel and list scrolls */}
          <div
            className={cn(
              "flex flex-col",
              isLg && detailPanelHeight > 0 ? "scrollbar-hide lg:flex lg:flex-col" : "space-y-3"
            )}
            style={
              isLg && detailPanelHeight > 0
                ? { height: detailPanelHeight, maxHeight: detailPanelHeight }
                : undefined
            }
          >
            <div
              ref={indexListRef}
              className={cn(
                "flex flex-col min-h-0 space-y-3 scrollbar-hide",
                listExpanded && hasIndexOverflow && "border-t border-b",
                isLg && detailPanelHeight > 0 && "lg:flex-1 lg:min-h-0 lg:overflow-y-auto"
              )}
            >
              <div className={cn(
                "border divide-y divide-foreground bg-secondary scrollbar-hide",
              )}>
              {/* First N items always visible */}
              {experiences.slice(0, INITIAL_INDEX_VISIBLE).map((exp, index) => (
                <IndexRowButton
                  key={exp.company}
                  exp={exp}
                  index={index}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
              ))}
              {/* More items: collapsible, GSAP-animated on expand (start at 0 height to avoid flash) */}
              {experiences.length > INITIAL_INDEX_VISIBLE && (
                <div
                  ref={moreItemsContainerRef}
                  className="overflow-hidden scrollbar-hide"
                  style={
                    !listExpanded
                      ? { maxHeight: 0, overflow: "hidden", borderTopWidth: 0 }
                      : !expandAnimationDone
                        ? { height: 0, overflow: "hidden", borderTopWidth: 0 }
                        : undefined
                  }
                >
                  {experiences.slice(INITIAL_INDEX_VISIBLE).map((exp, sliceIndex) => {
                    const index = INITIAL_INDEX_VISIBLE + sliceIndex
                    return (
                      <IndexRowButton
                        key={exp.company}
                        exp={exp}
                        index={index}
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                        ref={(el) => {
                          moreItemsRowRefs.current[sliceIndex] = el
                        }}
                        withDataAttrs
                        hideTopLine={sliceIndex === 0}
                      />
                    )
                  })}
                </div>
              )}
            </div>
            {/* Show more: down arrow, brutalist + technical lines */}
            {experiences.length > INITIAL_INDEX_VISIBLE && !listExpanded && (
              <button
                ref={loadMoreButtonRef}
                type="button"
                onClick={() => {
                  // Animate arrow path draw then expand list
                  const arrow = loadMoreArrowRef.current
                  const path = arrow?.querySelector("[data-arrow-path]") as SVGPathElement | null
                  if (path && typeof path.getTotalLength === "function") {
                    const len = path.getTotalLength()
                    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
                    gsap.to(path, {
                      strokeDashoffset: 0,
                      duration: 0.4,
                      ease: "power2.inOut",
                      onComplete: () => setListExpanded(true),
                    })
                  } else {
                    setListExpanded(true)
                  }
                }}
                className={cn(
                  "mt-3 w-full relative border-2 border-foreground bg-secondary font-mono text-[11px] uppercase tracking-[0.2em]",
                  "flex items-center justify-center gap-2 py-3 px-4",
                  "hover:bg-foreground hover:text-background transition-colors",
                  "shadow-[3px_3px_0_0_theme(colors.foreground)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                )}
                aria-label="Show more experience entries"
              >
                {/* Brutalist corner brackets + diagonal lines */}
                <svg className="absolute left-2 top-2 w-4 h-4 text-foreground/40 pointer-events-none" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M0 6V0h6M0 10v6h6" />
                </svg>
                <svg className="absolute right-2 top-2 w-4 h-4 text-foreground/40 pointer-events-none" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M16 6V0h-6M16 10v6h-6" />
                </svg>
                <span className="text-muted-foreground">Load</span>
                <svg
                  ref={loadMoreArrowRef}
                  className="w-5 h-5 text-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                  aria-hidden
                >
                  <path
                    d="M12 5v14M6 11l6 6 6-6"
                    strokeDasharray="1 1"
                    data-arrow-path
                  />
                  <line x1="4" y1="12" x2="8" y2="12" strokeWidth="0.75" opacity="0.4" />
                  <line x1="16" y1="12" x2="20" y2="12" strokeWidth="0.75" opacity="0.4" />
                </svg>
                <span className="text-muted-foreground">more</span>
              </button>
            )}
            </div>
          </div>

          {/* Detail grid */}
          <div
            ref={detailPanelRef}
            className="relative border border-foreground bg-card shadow-none sm:shadow-[6px_6px_0_0_theme(colors.foreground)] flex flex-col"
          >
            {/* ASCII entry header: frame + line draw in with GSAP on index change */}
            <div className="relative min-h-[3rem] border-b border-foreground/20 bg-secondary/50 px-3 py-2 sm:px-4 sm:py-2.5">
              {/* ENTRY background image: starts at 0, GSAP fades in on load / index change */}
              <div
                ref={entryBgRef}
                className="pointer-events-none absolute inset-[3px] origin-center will-change-transform opacity-0"
                style={
                  (experiences[activeIndex]?.panelImage ?? experiences[activeIndex]?.icon)
                    ? {
                        backgroundImage: `url(${experiences[activeIndex]?.panelImage ?? experiences[activeIndex]?.icon})`,
                        backgroundSize: "contain",
                        backgroundPosition: "right center",
                        backgroundRepeat: "no-repeat",
                        filter: "contrast(1.05)",
                        maskImage: "linear-gradient(90deg, transparent 0%, black 35%, black 100%)",
                        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 35%, black 100%)",
                      }
                    : undefined
                }
                aria-hidden
              >
                {/* Scanline sweep (GSAP) */}
                <div
                  ref={entryScanRef}
                  className="absolute inset-0 opacity-0 bg-[repeating-linear-gradient(180deg,transparent,transparent_6px,theme(colors.foreground/12)_6px,theme(colors.foreground/12)_8px)]"
                  aria-hidden
                />
              </div>
              <svg
                ref={entrySvgRef}
                className="absolute left-0 right-0 top-0 h-full w-full min-h-[3rem]"
                viewBox="0 0 320 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
                aria-hidden
              >
                {/* <path d="M 0 48 L 0 0 L 320 0" className="text-foreground/50" />
                <path d="M 320 0 L 320 48 L 0 48" className="text-foreground/50" />
                <line x1="0" y1="24" x2="320" y2="24" className="text-foreground/40" /> */}
              </svg>
              <div
                ref={entryLabelRef}
                className="relative z-10 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-muted-foreground opacity-0"
                aria-hidden
              >
                &gt; ENTRY {(experiences.length - activeIndex).toString().padStart(2, "0")} // {experiences[activeIndex]?.companyFull ?? "—"}
              </div>
            </div>

            <div className="relative p-3 sm:p-4 md:p-5 ">
              {experiences.map((exp, index) => {
                const isActive = index === activeIndex
                return (
                  <article
                    key={exp.company}
                    className={cn(
                      "relative transition-[opacity,transform] duration-200 border border-dashed p-1 sm:p-1.5 md:p-2",
                      isActive
                        ? "opacity-100 translate-y-0 border-foreground mb-2 sm:mb-3 md:mb-4"
                        : "opacity-0 pointer-events-none absolute inset-2 sm:inset-3 md:inset-3.5 border-transparent"
                    )}
                    aria-hidden={!isActive}
                  >
                    <div
                      ref={(el) => {
                        contentRefs.current[index] = el
                      }}
                      className={cn(
                        "relative z-10 flex flex-col gap-3 sm:gap-4",
                        isActive && "opacity-0"
                      )}
                    >
                      <div data-detail-block className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight uppercase">
                          {exp.title}
                        </h3>
                        <div className="flex flex-col items-end font-mono text-[11px] sm:text-xs text-muted-foreground uppercase tracking-[0.18em]">
                          <span>{exp.startDate} - {exp.endDate}</span>
                        </div>
                      </div>

                      <div data-detail-block className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {Array.isArray((exp as any).mediaImages) && (exp as any).mediaImages.length > 0 ? (
                          <div className="inline-flex flex-wrap items-center gap-1.5">
                            {(exp as any).mediaImages.slice(0, 3).map((src: string, i: number) => {
                              const labels = (exp as any).mediaLabels as string[] | undefined
                              const label = labels?.[i] ?? `View ${i + 1}`
                              return (
                                <a
                                  key={`${exp.company}-media-${i}`}
                                  href={src}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center border border-foreground bg-background px-2.5 py-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.14em] hover:bg-foreground hover:text-background transition-colors"
                                >
                                  {label}
                                </a>
                              )
                            })}
                          </div>
                        ) : (
                          <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.16em]">
                            {exp.companyFull}
                          </span>
                        )}
                        <span className="h-px flex-1 bg-foreground/30" />
                        <span className="font-mono text-[11px] sm:text-xs text-muted-foreground">
                          Highlights: {exp.highlights.length.toString().padStart(2, "0")} // Skills:{" "}
                          {exp.skills.length.toString().padStart(2, "0")}
                        </span>
                      </div>

                      <p data-detail-block className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                        {exp.description}
                      </p>

                      <div data-detail-block className="grid gap-3 sm:gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start md:items-stretch">
                        <ul className="space-y-5 sm:space-y-6">
                          {exp.highlights.map((highlight, i) => (
                            <li
                              key={i}
                              className="flex gap-3 text-xs sm:text-sm text-foreground/90 py-2"
                            >
                              <span className="mt-1 h-3 w-3 shrink-0 border border-foreground bg-accent/20" />
                              <span className="leading-relaxed"><BoldNumbers text={highlight} /></span>
                            </li>
                          ))}
                        </ul>

                        <div className="space-y-3 sm:space-y-4 min-h-0 md:min-h-0 md:h-full">
                          {isActive ? (
                            <SkillSurfaceGlobe entryIndex={index} words={exp.skills} className="md:h-full" fillHeight={!isMobile} />
                          ) : null}

                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
