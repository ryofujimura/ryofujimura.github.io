"use client"

import { useRef, useEffect } from "react"
import { AnimatedSection } from "@/components/animated-section"
import { GSAPText, GSAPSVG } from "@/components/gsap-text"
import { LeonardoNotebook, TechnicalDrawing } from "@/components/leonardo-notebook"
import { cn } from "@/lib/utils"

const skills = {
  Languages: ["Python", "Swift", "Kotlin", "Java", "C++", "TypeScript", "JavaScript"],
  "AI / ML": ["PyTorch", "Transformers", "On-device LLM", "Vision Models", "CoreML"],
  Mobile: ["iOS (SwiftUI)", "Android (Jetpack)", "WatchOS", "React Native"],
  "Backend & Cloud": ["Firebase", "Node.js", "Flask", "REST APIs", "WebSockets"],
  Tools: ["Git", "Docker", "Linux", "CUDA", "Vercel"],
}

type StatItem = { label: string; value: string; sectionId?: string }
const stats: StatItem[] = [
  { label: "Years Coding", value: "8+" },
  { label: "Internships", value: "2", sectionId: "experience" },
  { label: "Projects Shipped", value: "10+", sectionId: "projects" },
  { label: "Publications", value: "2", sectionId: "publications" },
]

/** MMM. YYYY for LeonardoNotebook dates */
const currentMonthYear =
  new Date().toLocaleString("en-US", { month: "short" }) + ". " + new Date().getFullYear()

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId)
  el?.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function AboutSection() {
  const gridRef = useRef<SVGSVGElement | null>(null)
  const statsRef = useRef<HTMLDivElement | null>(null)
  const bgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!gridRef.current) return
    const svg = gridRef.current
    const lines = svg.querySelectorAll("line, circle")
    if (!lines.length) return

    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)
        gsap.fromTo(
          lines,
          { opacity: 0, strokeDasharray: "0 300" },
          {
            opacity: 0.4,
            strokeDasharray: "300 0",
            stagger: 0.02,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: svg,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        )
      })
    })
  }, [])

  useEffect(() => {
    if (!statsRef.current) return
    const container = statsRef.current
    const cards = container.querySelectorAll("[data-stat-card]")
    const labels = container.querySelectorAll("[data-stat-label]")
    const values = container.querySelectorAll("[data-stat-value]")

    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)
        gsap.set(cards, { opacity: 0, y: 14 })
        gsap.set(labels, { opacity: 0, y: 6 })
        gsap.set(values, { opacity: 0, y: 8 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        })
        tl.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        })
        tl.to(
          labels,
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" },
          "-=0.35"
        )
        tl.to(
          values,
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" },
          "-=0.25"
        )
      })
    })
  }, [])

  // Background "collision" animation - AI, Mobile, Backend converging
  useEffect(() => {
    if (!bgRef.current) return
    const svg = bgRef.current

    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)

        // Animate node clusters
        const nodes = svg.querySelectorAll("[data-node]")
        const connections = svg.querySelectorAll("[data-connection]")
        const dataFlows = svg.querySelectorAll("[data-flow]")
        const techLabels = svg.querySelectorAll("[data-tech-label]")
        const gridLines = svg.querySelectorAll("[data-grid-line]")
        const circuitPaths = svg.querySelectorAll("[data-circuit]")

        // Initial states
        gsap.set(nodes, { scale: 0, transformOrigin: "center center" })
        gsap.set(connections, { strokeDasharray: "0 1000", opacity: 0 })
        gsap.set(dataFlows, { strokeDasharray: "4 4", strokeDashoffset: 100, opacity: 0 })
        gsap.set(techLabels, { opacity: 0, y: 10 })
        gsap.set(gridLines, { strokeDasharray: "0 500", opacity: 0 })
        gsap.set(circuitPaths, { strokeDasharray: "0 800", opacity: 0 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: svg,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        })

        // Reveal SVG container first
        tl.to(svg, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        })

        // Grid lines draw in first
        tl.to(gridLines, {
          strokeDasharray: "500 0",
          opacity: 0.075,
          duration: 1.2,
          stagger: 0.03,
          ease: "power2.inOut",
        })

        // Circuit paths trace
        tl.to(circuitPaths, {
          strokeDasharray: "800 0",
          opacity: 0.125,
          duration: 1.8,
          stagger: 0.08,
          ease: "power1.inOut",
        }, "-=0.8")

        // Nodes pop in with stagger
        tl.to(nodes, {
          scale: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "back.out(1.7)",
        }, "-=1.2")

        // Connections draw between nodes
        tl.to(connections, {
          strokeDasharray: "1000 0",
          opacity: 0.15,
          duration: 1.4,
          stagger: 0.06,
          ease: "power2.out",
        }, "-=0.4")

        // Data flow animation (continuous)
        tl.to(dataFlows, {
          opacity: 0.2,
          duration: 0.5,
          stagger: 0.1,
        }, "-=0.8")

        // Tech labels fade in
        tl.to(techLabels, {
          opacity: 0.3,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        }, "-=0.3")

        // Continuous data flow animation
        gsap.to(dataFlows, {
          strokeDashoffset: 0,
          duration: 3,
          repeat: -1,
          ease: "none",
        })

        // Subtle pulse on nodes
        gsap.to(nodes, {
          scale: 1.1,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: {
            each: 0.3,
            repeat: -1,
          },
        })
      })
    })
  }, [])

  return (
    <section
      id="about"
      className="relative py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 overflow-hidden bg-background"
    >
      {/* Brutalist technical grid */}
      <div className="pointer-events-none absolute inset-0 bg-brutalist-grid opacity-[0.04]" aria-hidden />

      {/* Collision Background - AI / Mobile / Backend systems converging */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50" aria-hidden>
        <svg
          ref={bgRef}
          viewBox="0 0 1200 800"
          className="absolute w-[140%] h-[140%] -left-[20%] -top-[20%] opacity-0"
          fill="none"
          stroke="currentColor"
        >
          {/* Base grid - architectural/technical drawing style */}
          {Array.from({ length: 25 }).map((_, i) => (
            <line
              key={`h-grid-${i}`}
              data-grid-line
              x1="0"
              y1={i * 35}
              x2="1200"
              y2={i * 35}
              strokeWidth="0.3"
              className="text-foreground"
            />
          ))}
          {Array.from({ length: 35 }).map((_, i) => (
            <line
              key={`v-grid-${i}`}
              data-grid-line
              x1={i * 35}
              y1="0"
              x2={i * 35}
              y2="800"
              strokeWidth="0.3"
              className="text-foreground"
            />
          ))}

          {/* Circuit board traces - connecting the three domains */}
          <path
            data-circuit
            d="M150 400 L300 400 L350 350 L500 350 L550 400 L600 400"
            strokeWidth="1.5"
            className="text-foreground"
          />
          <path
            data-circuit
            d="M600 400 L700 400 L750 300 L900 300 L950 350 L1050 350"
            strokeWidth="1.5"
            className="text-foreground"
          />
          <path
            data-circuit
            d="M600 400 L650 450 L750 450 L800 500 L900 500 L950 450 L1050 450"
            strokeWidth="1.5"
            className="text-foreground"
          />
          <path
            data-circuit
            d="M300 250 L300 350 L350 400 L350 500 L400 550"
            strokeWidth="1"
            className="text-foreground"
          />
          <path
            data-circuit
            d="M900 200 L900 280 L850 330 L850 400"
            strokeWidth="1"
            className="text-foreground"
          />
          <path
            data-circuit
            d="M200 550 L350 550 L400 500 L500 500 L550 550 L600 550"
            strokeWidth="0.8"
            className="text-foreground"
          />

          {/* AI Research Cluster - Left side (neural network pattern) */}
          <g className="text-foreground">
            {/* Neural network layers */}
            {[180, 240, 300].map((x, layerIdx) => (
              <g key={`ai-layer-${layerIdx}`}>
                {Array.from({ length: 4 - layerIdx }).map((_, nodeIdx) => {
                  const y = 280 + nodeIdx * 60 + layerIdx * 30
                  return (
                    <circle
                      key={`ai-node-${layerIdx}-${nodeIdx}`}
                      data-node
                      cx={x}
                      cy={y}
                      r={layerIdx === 1 ? 6 : 4}
                      strokeWidth="1.5"
                    />
                  )
                })}
              </g>
            ))}
            {/* Neural connections */}
            <line data-connection x1="180" y1="280" x2="240" y2="310" strokeWidth="0.5" />
            <line data-connection x1="180" y1="280" x2="240" y2="370" strokeWidth="0.5" />
            <line data-connection x1="180" y1="340" x2="240" y2="310" strokeWidth="0.5" />
            <line data-connection x1="180" y1="340" x2="240" y2="370" strokeWidth="0.5" />
            <line data-connection x1="180" y1="400" x2="240" y2="370" strokeWidth="0.5" />
            <line data-connection x1="180" y1="400" x2="240" y2="430" strokeWidth="0.5" />
            <line data-connection x1="240" y1="310" x2="300" y2="340" strokeWidth="0.5" />
            <line data-connection x1="240" y1="370" x2="300" y2="340" strokeWidth="0.5" />
            <line data-connection x1="240" y1="370" x2="300" y2="400" strokeWidth="0.5" />
            <line data-connection x1="240" y1="430" x2="300" y2="400" strokeWidth="0.5" />
            <text data-tech-label x="180" y="240" fontSize="10" className="font-mono fill-current" strokeWidth="0">AI</text>
            <text data-tech-label x="160" y="255" fontSize="7" className="font-mono fill-current opacity-50" strokeWidth="0">RESEARCH</text>
          </g>

          {/* Mobile Cluster - Top right (device + sensors pattern) */}
          <g className="text-foreground">
            {/* Device frame */}
            <rect data-node x="920" y="180" width="60" height="100" rx="8" strokeWidth="1.5" />
            <rect data-node x="930" y="195" width="40" height="60" strokeWidth="0.8" />
            <circle data-node cx="950" cy="268" r="4" strokeWidth="1" />
            {/* Sensor nodes around device */}
            <circle data-node cx="880" cy="200" r="3" strokeWidth="1" />
            <circle data-node cx="880" cy="260" r="3" strokeWidth="1" />
            <circle data-node cx="1000" cy="200" r="3" strokeWidth="1" />
            <circle data-node cx="1000" cy="260" r="3" strokeWidth="1" />
            <circle data-node cx="950" cy="140" r="3" strokeWidth="1" />
            {/* Sensor connections */}
            <line data-connection x1="880" y1="200" x2="920" y2="210" strokeWidth="0.5" />
            <line data-connection x1="880" y1="260" x2="920" y2="250" strokeWidth="0.5" />
            <line data-connection x1="1000" y1="200" x2="980" y2="210" strokeWidth="0.5" />
            <line data-connection x1="1000" y1="260" x2="980" y2="250" strokeWidth="0.5" />
            <line data-connection x1="950" y1="140" x2="950" y2="180" strokeWidth="0.5" />
            <text data-tech-label x="920" y="310" fontSize="10" className="font-mono fill-current" strokeWidth="0">MOBILE</text>
            <text data-tech-label x="920" y="325" fontSize="7" className="font-mono fill-current opacity-50" strokeWidth="0">SYSTEMS</text>
          </g>

          {/* Backend Cluster - Bottom right (server/database pattern) */}
          <g className="text-foreground">
            {/* Server rack representation */}
            <rect data-node x="920" y="480" width="80" height="20" strokeWidth="1" />
            <rect data-node x="920" y="505" width="80" height="20" strokeWidth="1" />
            <rect data-node x="920" y="530" width="80" height="20" strokeWidth="1" />
            {/* Database cylinder */}
            <ellipse data-node cx="860" cy="510" rx="25" ry="8" strokeWidth="1" />
            <line data-connection x1="835" y1="510" x2="835" y2="550" strokeWidth="1" />
            <line data-connection x1="885" y1="510" x2="885" y2="550" strokeWidth="1" />
            <ellipse data-node cx="860" cy="550" rx="25" ry="8" strokeWidth="1" />
            {/* API endpoints */}
            <circle data-node cx="1020" cy="490" r="4" strokeWidth="1" />
            <circle data-node cx="1020" cy="515" r="4" strokeWidth="1" />
            <circle data-node cx="1020" cy="540" r="4" strokeWidth="1" />
            <line data-connection x1="1000" y1="490" x2="1016" y2="490" strokeWidth="0.5" />
            <line data-connection x1="1000" y1="515" x2="1016" y2="515" strokeWidth="0.5" />
            <line data-connection x1="1000" y1="540" x2="1016" y2="540" strokeWidth="0.5" />
            <line data-connection x1="885" y1="530" x2="920" y2="515" strokeWidth="0.5" />
            <text data-tech-label x="920" y="575" fontSize="10" className="font-mono fill-current" strokeWidth="0">BACKEND</text>
            <text data-tech-label x="920" y="590" fontSize="7" className="font-mono fill-current opacity-50" strokeWidth="0">INFRASTRUCTURE</text>
          </g>

          {/* Central collision point - where all three meet */}
          <g className="text-foreground">
            <circle data-node cx="600" cy="400" r="12" strokeWidth="2" />
            <circle data-node cx="600" cy="400" r="20" strokeWidth="0.5" />
            <circle data-node cx="600" cy="400" r="30" strokeWidth="0.3" />
            {/* Collision sparks/rays */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180
              const x1 = 600 + Math.cos(angle) * 35
              const y1 = 400 + Math.sin(angle) * 35
              const x2 = 600 + Math.cos(angle) * 55
              const y2 = 400 + Math.sin(angle) * 55
              return (
                <line
                  key={`ray-${i}`}
                  data-connection
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  strokeWidth="1"
                />
              )
            })}
          </g>

          {/* Data flow paths - animated dashed lines showing data movement */}
          <path
            data-flow
            d="M300 370 C400 370 450 400 600 400"
            strokeWidth="1.5"
            className="text-foreground"
          />
          <path
            data-flow
            d="M920 230 C800 230 700 350 600 400"
            strokeWidth="1.5"
            className="text-foreground"
          />
          <path
            data-flow
            d="M920 515 C800 515 700 450 600 400"
            strokeWidth="1.5"
            className="text-foreground"
          />

          {/* Technical annotations - brutalist style */}
          <g className="text-foreground" strokeWidth="0">
            <text data-tech-label x="420" y="380" fontSize="6" className="font-mono fill-current opacity-40">INFERENCE</text>
            <text data-tech-label x="700" y="320" fontSize="6" className="font-mono fill-current opacity-40">ON-DEVICE</text>
            <text data-tech-label x="720" y="480" fontSize="6" className="font-mono fill-current opacity-40">REST API</text>
            <text data-tech-label x="550" y="440" fontSize="5" className="font-mono fill-current opacity-30">COLLISION POINT</text>
          </g>

          {/* Corner technical markers - blueprint style */}
          <g className="text-foreground">
            <line data-grid-line x1="50" y1="50" x2="100" y2="50" strokeWidth="0.5" />
            <line data-grid-line x1="50" y1="50" x2="50" y2="100" strokeWidth="0.5" />
            <line data-grid-line x1="1150" y1="50" x2="1100" y2="50" strokeWidth="0.5" />
            <line data-grid-line x1="1150" y1="50" x2="1150" y2="100" strokeWidth="0.5" />
            <line data-grid-line x1="50" y1="750" x2="100" y2="750" strokeWidth="0.5" />
            <line data-grid-line x1="50" y1="750" x2="50" y2="700" strokeWidth="0.5" />
            <line data-grid-line x1="1150" y1="750" x2="1100" y2="750" strokeWidth="0.5" />
            <line data-grid-line x1="1150" y1="750" x2="1150" y2="700" strokeWidth="0.5" />
          </g>

          {/* Measurement lines - technical drawing aesthetic */}
          <g className="text-foreground">
            <line data-grid-line x1="150" y1="650" x2="450" y2="650" strokeWidth="0.3" />
            <line data-grid-line x1="150" y1="645" x2="150" y2="655" strokeWidth="0.3" />
            <line data-grid-line x1="450" y1="645" x2="450" y2="655" strokeWidth="0.3" />
            <text data-tech-label x="280" y="665" fontSize="5" className="font-mono fill-current opacity-30" strokeWidth="0">300 UNITS</text>
          </g>
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl lg:max-w-6xl mx-auto">
        {/* Left / Right columns — within each: top then bottom */}
        <div className="grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8 lg:gap-10 items-start">
          {/* Left column: top = header+intro, bottom = narrative */}
          <div className="space-y-10 sm:space-y-12">
            {/* Top-left: profile + name + description (left/right), then stats full width */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col md:flex-row md:gap-6 lg:gap-8 md:items-start">
                <div className="shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 border-[3px] border-foreground bg-background shadow-[4px_4px_0_0_var(--foreground)] overflow-hidden">
                    <img
                      src="/images/profile.jpg"
                      alt="Ryo Fujimura"
                      className="w-full h-full object-cover object-top"
                      width={112}
                      height={112}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollToSection("hobbies")}
                    className="font-mono text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-widest mt-1.5 hover:text-foreground hover:underline transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                  >
                    VR46
                  </button>
                </div>
                <div className="space-y-4 sm:space-y-6 min-w-0 flex-1">
                  <p className="font-mono text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.35em]">
                    ABOUT / SPECIMEN WISTERIA-05
                  </p>
                  <GSAPText
                    variant="words"
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-black tracking-tight leading-[0.95] font-mono"
                    stagger={0.03}
                  >
                    RYO FUJIMURA
                  </GSAPText>
                  {/* <GSAPText
                    variant="words"
                    className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl"
                    delay={0.4}
                  >
                    Software engineer + AI researcher building systems that move smoothly from lab prototype to
                    production reality.
                  </GSAPText> */}
                </div>
              </div>
              {/* Stats full width — clickable cards with brutalist hover and GSAP entrance */}
              <div className="w-full" ref={statsRef}>
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {stats.map((s) => {
                    const isLink = !!s.sectionId
                    const Wrapper = isLink ? "button" : "div"
                    return (
                      <Wrapper
                        key={s.label}
                        type={isLink ? "button" : undefined}
                        onClick={
                          isLink && s.sectionId
                            ? () => scrollToSection(s.sectionId!)
                            : undefined
                        }
                        data-stat-card
                        className={cn(
                          "min-w-0 border bg-background px-3 py-3 sm:px-4 sm:py-4 flex flex-col justify-between min-h-[5rem] sm:min-h-[5.5rem] relative overflow-hidden text-left gap-1",
                          isLink
                            ? "border-foreground/25 cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 hover:border-foreground hover:shadow-[4px_4px_0_0_var(--foreground)] group"
                            : "border-foreground/25"
                        )}
                        aria-label={isLink && s.sectionId ? `Jump to ${s.label} section` : undefined}
                      >
                        {/* Technical pattern overlay on hover — diagonal/cross lines */}
                        {isLink && (
                          <svg
                            className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-foreground/10"
                            viewBox="0 0 48 48"
                            fill="none"
                            aria-hidden
                          >
                            <line x1="0" y1="0" x2="48" y2="48" stroke="currentColor" strokeWidth="0.5" />
                            <line x1="48" y1="0" x2="0" y2="48" stroke="currentColor" strokeWidth="0.5" />
                            {[12, 24, 36].map((n) => (
                              <line key={`h-${n}`} x1="0" y1={n} x2="48" y2={n} stroke="currentColor" strokeWidth="0.25" />
                            ))}
                            {[12, 24, 36].map((n) => (
                              <line key={`v-${n}`} x1={n} y1="0" x2={n} y2="48" stroke="currentColor" strokeWidth="0.25" />
                            ))}
                          </svg>
                        )}
                        <dt
                          data-stat-label
                          className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-muted-foreground break-words relative z-[1] flex items-start justify-start w-full"
                        >
                          {s.label}
                        </dt>
                        <dd className="relative z-[1] flex items-start justify-end w-full text-right">
                          <span
                            data-stat-value
                            className="font-mono text-xl sm:text-2xl md:text-3xl font-black leading-tight"
                          >
                            {s.value}
                          </span>
                        </dd>
                      </Wrapper>
                    )
                  })}
                </dl>
              </div>
            </div>

            {/* Divider — equal spacing above and below, black, medium thick */}
            <div className="py-8 sm:py-10 flex items-center" aria-hidden>
              <hr className="w-full border-0 h-[3px] bg-black rounded-none" />
            </div>

            {/* Bottom-left: narrative */}
            <div className="space-y-5 sm:space-y-6">
            <AnimatedSection>
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                I work where{" "}
                <span className="font-semibold">AI research, mobile, and backend systems</span> collide. In the CPX
                Lab at CSULB I contribute to robotics/AI projects that have shipped as{" "}
                <span className="font-semibold">peer-reviewed publications</span>, while internships at Bose and
                American Honda grounded me in large-scale, production constraints.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                The recurring pattern: take a fuzzy problem, prototype quickly, then harden the system until it can
                be{" "}
                <span className="font-semibold">trusted by real users</span>—whether that&apos;s a robotics team,
                internal QA engineers, or everyday commuters checking a shuttle app.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <p className="text-xs sm:text-sm text-muted-foreground/80 font-mono border-l-2 border-foreground/40 pl-3 sm:pl-4 italic">
                “The noblest pleasure is the joy of understanding.” — Leonardo da Vinci
              </p>
            </AnimatedSection>

            <AnimatedSection delay={250}>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 border-t border-foreground/30 pt-4 sm:pt-5">
                <div className="space-y-2">
                  <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    CURRENTLY
                  </p>
                  <ul className="text-sm sm:text-base text-foreground/90 leading-relaxed space-y-1 list-disc list-inside">
                    <li>Student: CSULB Computer Science</li>
                    <li>Focus: On-device AI/ML</li>
                    <li>Builds: Mobile Apps, Full-stack Webs</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    LOOKING FOR
                  </p>
                  <ul className="text-sm sm:text-base text-foreground/90 leading-relaxed space-y-1 list-disc list-inside">
                    <li>Strong engineers to learn from</li>
                    <li>Apps, ML, or infrastructure work</li>
                    <li>Real-world impact</li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>
            </div>
          </div>

          {/* Right column: top = technical SVG, bottom = notebooks */}
          <div className="space-y-10 sm:space-y-12">
            {/* Top-right: Technical SVG panel */}
            <div className="hidden sm:block">
              <div className="border-2 border-foreground bg-background p-3 sm:p-4 md:p-5 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-[0.25] overflow-hidden">
                  <GSAPSVG className="w-[150%] h-[150%] -translate-x-[16%] -translate-y-[16%]" duration={1.8} delay={0.4}>
                    <svg ref={gridRef} viewBox="0 0 200 200" className="w-full h-full" stroke="currentColor" fill="none">
                      {/* Concentric circles with pulse animation */}
                      <circle cx="100" cy="100" r="95" strokeWidth="0.3" className="animate-pulse" style={{ animationDuration: '4s' }} />
                      <circle cx="100" cy="100" r="80" strokeWidth="0.6" className="animate-pulse" style={{ animationDuration: '3s' }} />
                      <circle cx="100" cy="100" r="65" strokeWidth="0.4" className="animate-pulse" style={{ animationDuration: '3.5s' }} />
                      <circle cx="100" cy="100" r="52" strokeWidth="0.5" className="animate-pulse" style={{ animationDuration: '2.5s' }} />
                      <circle cx="100" cy="100" r="38" strokeWidth="0.4" className="animate-pulse" style={{ animationDuration: '3s' }} />
                      <circle cx="100" cy="100" r="24" strokeWidth="0.3" className="animate-pulse" style={{ animationDuration: '2s' }} />
                      <circle cx="100" cy="100" r="12" strokeWidth="0.5" className="animate-pulse" style={{ animationDuration: '2.5s' }} />
                      {/* Crosshair */}
                      <line x1="100" y1="10" x2="100" y2="190" strokeWidth="0.4" />
                      <line x1="10" y1="100" x2="190" y2="100" strokeWidth="0.4" />
                      {/* Radial lines */}
                      {Array.from({ length: 12 }).map((_, i) => {
                        const angle = (i * 30 * Math.PI) / 180
                        const x2 = Number((100 + Math.cos(angle) * 80).toFixed(2))
                        const y2 = Number((100 + Math.sin(angle) * 80).toFixed(2))
                        return <line key={i} x1="100" y1="100" x2={x2} y2={y2} strokeWidth="0.25" />
                      })}
                      {/* Offset hexagon */}
                      {[0, 60, 120].map((start, idx) => (
                        <polygon
                          key={idx}
                          points={Array.from({ length: 6 })
                            .map((_, j) => {
                              const angle = ((start + j * 60) * Math.PI) / 180
                              const r = 35 + idx * 6
                              const x = Number((100 + Math.cos(angle) * r).toFixed(2))
                              const y = Number((100 + Math.sin(angle) * r).toFixed(2))
                              return `${x},${y}`
                            })
                            .join(" ")}
                          fill="none"
                          strokeWidth={idx === 2 ? 0.8 : 0.4}
                        />
                      ))}
                    </svg>
                  </GSAPSVG>
                </div>

                <div className="relative space-y-2">
                  <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    SYSTEM PROFILE
                  </p>
                  <p className="font-mono text-xs sm:text-sm text-foreground">
                  Full-stack mobile & AI engineer focused on Local LLMs, real-time systems, and scalable pipelines

                  </p>
                </div>
              </div>
            </div>

            {/* Bottom-right: Leonardo notebooks + stack summary */}
            <div className="space-y-6 sm:space-y-7">
            <AnimatedSection>
              <LeonardoNotebook folioRef="RF.DV.ABOUT.001" date={currentMonthYear}>
                <TechnicalDrawing
                  title="PIPELINE: IDEA → PROTOTYPE → PRODUCTION"
                  asciiArt={[
                    "+-----------------+   +-----------------+",
                    "|      IDEA       |   | AI ENHANCEMENT  |",
                    "| (problem, goal) |-->| (spec, expand)  |",
                    "+--------+--------+   +-----------------+",
                    "         |                     |",
                    "         v                     v",
                    "+-----------------+   +-----------------+",
                    "|     CODING      |   |    PROTOTYPE    |",
                    "|   (implement)   |-->|   (MVP, demo)   |",
                    "+--------+--------+   +--------+--------+",
                    "         |                     |",
                    "         v                     v",
                    "+-----------------+   +-----------------+",
                    "|    ITERATE      |   |   PRODUCTION    |",
                    "| (feedback, fix) |-->| (deploy, scale) |",
                    "+--------+--------+   +--------+--------+",
                  ].join("\n")}
                  measurements={[
                    { label: "AI / ML", value: "2+ yrs.", unit: " PyTorch, Transformers, quantization" },
                    { label: "Mobile", value: "4+ yrs.", unit: " Swift, SwiftUI, Kotlin, CoreML" },
                    { label: "Backend", value: "3+ yrs.", unit: " REST APIs, Cloud Functions, Node.js" },
                  ]}
                  notes="Typical workflow from research model to deployment while preserving behavior."
                />
              </LeonardoNotebook>
            </AnimatedSection>
{/* 
            <AnimatedSection delay={120}>
              <LeonardoNotebook folioRef="RF.DV.SKILLS.002" date={currentMonthYear}>
                <div className="space-y-3 sm:space-y-4">
                  <p className="font-mono text-[10px] sm:text-xs text-foreground/90 font-semibold uppercase tracking-[0.18em]">
                    TOOLING DISTRIBUTION
                  </p>
                  <div className="bg-secondary/10 border border-foreground/20 p-3 sm:p-4">
                    <pre className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] text-foreground/80 whitespace-pre overflow-x-auto touch-manipulation">
{`  [ AI / ML ]      ████████ 35%
  [ MOBILE ]       ██████   30%
  [ BACKEND ]      █████    25%
  [ TOOLING ]      ██       10%`}
                    </pre>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <SpecAnnotation label="AI / ML" value="35%" notes="PyTorch, Transformers, CoreML, quantization" />
                    <SpecAnnotation label="Mobile" value="30%" notes="SwiftUI, Kotlin, on-device LLMs" />
                    <SpecAnnotation label="Backend" value="25%" notes="Firebase, Node.js, real-time APIs" />
                    <SpecAnnotation label="Tooling" value="10%" notes="Automation, data pipelines, infra glue" />
                  </div>
                </div>
              </LeonardoNotebook>
            </AnimatedSection>
 */}
            <AnimatedSection delay={180}>
              <div className="border border-foreground/40 px-3 py-3 sm:px-4 sm:py-4">
                <p className="font-mono text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.18em] mb-1">
                  STACK SUMMARY
                </p>
                <p className="font-mono text-[11px] sm:text-sm text-foreground leading-relaxed">
                Python / Swift / Kotlin / React / Firebase / PyTorch / CoreML / On-device LLMs / CUDA / Docker
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
