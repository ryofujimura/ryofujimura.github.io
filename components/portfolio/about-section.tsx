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

  return (
    <section
      id="about"
      className="relative py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 overflow-hidden bg-background"
    >
      {/* Brutalist technical grid */}
      <div className="pointer-events-none absolute inset-0 bg-brutalist-grid opacity-[0.04]" aria-hidden />

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
                  <p className="font-mono text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-widest mt-1.5">
                  VR46
                  </p>
                </div>
                <div className="space-y-4 sm:space-y-6 min-w-0 flex-1">
                  <p className="font-mono text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.35em]">
                    ABOUT / SPECIMEN WISTERIA-05
                  </p>
                  <GSAPText
                    variant="chars"
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-black tracking-tight leading-[0.95] font-mono"
                    stagger={0.03}
                  >
                    RYO FUJIMURA
                  </GSAPText>
                  <GSAPText
                    variant="words"
                    className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl"
                    delay={0.4}
                  >
                    Software engineer + AI researcher building systems that move smoothly from lab prototype to
                    production reality.
                  </GSAPText>
                </div>
              </div>
              {/* Stats full width — clickable cards with brutalist hover and GSAP entrance */}
              <div className="w-full" ref={statsRef}>
                <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
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
                          "min-w-0 border bg-background px-3 py-3 sm:px-4 sm:py-4 grid grid-rows-[1fr_1fr] min-h-[5rem] sm:min-h-[5.5rem] relative overflow-hidden text-left gap-0",
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
                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                  Computer Science student specializing in mobile systems, on-device AI/ML, and full-stack engineering, with experience building production iOS/Android apps, optimized LLM inference, and real-time data pipelines across research and industry.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    LOOKING FOR
                  </p>
                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                  A team where I can learn from strong engineers while contributing careful, performance-driven work on applications, applied ML, or infrastructure that values correctness, efficiency, and real-world impact.
                  </p>
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
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <GSAPSVG className="w-full h-full" duration={1.8} delay={0.4}>
                    <svg ref={gridRef} viewBox="0 0 200 200" className="w-full h-full" stroke="currentColor">
                      {/* Concentric circles */}
                      <circle cx="100" cy="100" r="80" strokeWidth="0.6" />
                      <circle cx="100" cy="100" r="52" strokeWidth="0.5" />
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
