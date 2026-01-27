"use client"

import { AnimatedSection } from "@/components/animated-section"
import { MouseFollowerCard } from "@/components/mouse-follower-card"
import { ParallaxText } from "@/components/parallax-text"
import { Shape3D } from "@/components/geometric-shapes"
import { AsciiSectionHeader } from "@/components/ascii-banner"
import { LeonardoNotebook, TechnicalDrawing, SpecAnnotation } from "@/components/leonardo-notebook"

const skills = {
  "Languages": ["Python", "Swift", "Kotlin", "Java", "C++", "TypeScript", "JavaScript"],
  "AI/ML": ["PyTorch", "Transformers", "On-device LLM", "Vision Models", "CoreML"],
  "Mobile": ["iOS (SwiftUI)", "Android (Jetpack)", "WatchOS", "React Native"],
  "Backend & Cloud": ["Firebase", "Node.js", "Flask", "REST APIs", "WebSockets"],
  "Tools": ["Git", "Docker", "Linux", "CUDA", "Vercel"],
}

const stats = [
  { value: "2", label: "Publications" },
  { value: "4+", label: "Years Coding" },
  { value: "10+", label: "Projects Shipped" },
  { value: "3", label: "Internships" },
]

export function AboutSection() {
  return (
    <section id="about" className="relative py-20 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6 overflow-hidden">
      {/* Background shapes — hide on small screens */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        <div className="absolute top-20 right-20 opacity-15">
          <Shape3D variant="vitruvian" size={180} />
        </div>
        <div className="absolute bottom-32 left-16 opacity-10">
          <Shape3D variant="spiral" size={140} />
        </div>
        <div className="absolute top-1/2 right-1/4 opacity-8 hidden md:block">
          <Shape3D variant="cube" size={50} />
        </div>
      </div>

      {/* Marquee — lighter on mobile */}
      <ParallaxText className="mb-12 sm:mb-20 -mx-4 sm:-mx-6" speed={0.3} direction="left">
        <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-foreground/[0.03] whitespace-nowrap uppercase tracking-tight font-mono">
          &gt;&gt; Engineer — Researcher — &gt;&gt; Engineer — Researcher —
        </span>
      </ParallaxText>

      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatedSection>
          <AsciiSectionHeader number="01" title="About Me" />
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Left column - Bio */}
          <div className="space-y-6 sm:space-y-8">
            <AnimatedSection delay={100}>
              <p className="text-xl md:text-2xl text-foreground leading-relaxed font-light">
                I build intelligent systems that bridge{" "}
                <span className="font-medium">cutting-edge AI research</span> with{" "}
                <span className="font-medium">real-world applications</span>.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <p className="text-muted-foreground leading-relaxed">
                Currently contributing to robotics/AI research at{" "}
                <span className="text-foreground font-medium">CPX Lab at CSULB</span>, where I&apos;ve supported 
                two peer-reviewed publications. I&apos;ve also had the opportunity to intern at{" "}
                <span className="text-foreground font-medium">Bose Corporation</span> and{" "}
                <span className="text-foreground font-medium">American Honda</span>, working on everything 
                from Bluetooth debugging tools to automotive AI systems.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <p className="text-muted-foreground leading-relaxed">
                I believe in building technology that&apos;s both innovative and accessible. Whether it&apos;s 
                reducing LLM inference latency by 40% or creating apps used by hundreds of daily users, 
                I focus on delivering measurable impact.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={350}>
              <p className="text-sm text-muted-foreground/70 italic border-l-2 border-accent/30 pl-4">
                {"\"The noblest pleasure is the joy of understanding.\""} 
                <span className="ml-2">- Leonardo da Vinci</span>
              </p>
            </AnimatedSection>

            {/* Stats — 2x2 on mobile, 4 col on desktop */}
            <AnimatedSection delay={400}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-border">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center group cursor-default touch-manipulation min-h-[52px] flex flex-col justify-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono text-foreground group-hover:text-accent transition-colors duration-300">
                      {stat.value}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mt-1 font-mono">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Leonardo notebook: Technical spec sheet */}
            <AnimatedSection delay={500}>
              <LeonardoNotebook folioRef="RF.DV.ABOUT.001" date="2025">
                <TechnicalDrawing
                  title="SYSTEM ARCHITECTURE: AI RESEARCH → PRODUCTION"
                  asciiArt={`    ╭─────────────╮
   ╱               ╲
  │   RESEARCH      │
  │   (PyTorch)     │
  │                 │
  │      │          │
  │      ▼          │
  │   OPTIMIZE      │
  │   (Quantize)    │
  │      │          │
  │      ▼          │
  │   DEPLOY        │
  │   (CoreML)      │
   ╲               ╱
    ╰─────────────╯
         │
         ▼
    ┌─────────┐
    │  USERS  │
    └─────────┘`}
                  measurements={[
                    { label: "Latency Reduction", value: "40%", unit: "" },
                    { label: "Model Size", value: "3GB", unit: "saved" },
                    { label: "Accuracy", value: "95%", unit: "" },
                  ]}
                  notes="Hybrid inference pipeline: research models optimized for edge deployment"
                />
              </LeonardoNotebook>
            </AnimatedSection>
          </div>

          {/* Right column - Skills + Leonardo notebook */}
          <div className="space-y-6 sm:space-y-8">
            <AnimatedSection delay={400}>
              <MouseFollowerCard glareEffect={true}>
                <div className="relative p-5 sm:p-6 md:p-8 bg-card rounded-xl sm:rounded-2xl border border-border overflow-hidden">
                  <div className="absolute top-4 right-4 opacity-20 hidden sm:block">
                    <Shape3D variant="vitruvian" size={60} />
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold font-mono text-foreground mb-6 sm:mb-8">
                    // Technical Expertise
                  </h3>
                  <div className="space-y-6">
                    {Object.entries(skills).map(([category, items], categoryIndex) => (
                      <AnimatedSection key={category} delay={500 + categoryIndex * 100}>
                        <div>
                          <p className="text-sm font-medium text-accent mb-3 uppercase tracking-wide">
                            {category}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {items.map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1.5 text-sm text-muted-foreground bg-secondary rounded-lg border border-border hover:border-accent/50 hover:text-foreground hover:shadow-md transition-all cursor-default"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </AnimatedSection>
                    ))}
                  </div>
                </div>
              </MouseFollowerCard>
            </AnimatedSection>

            {/* Leonardo notebook: Geometric study */}
            <AnimatedSection delay={600}>
              <LeonardoNotebook folioRef="RF.DV.SKILLS.002" date="2025">
                <div className="space-y-4">
                  <div className="font-mono text-[10px] xs:text-xs sm:text-sm text-foreground/90 font-semibold border-b border-foreground/20 pb-1">
                    GEOMETRIC STUDY: TECH STACK PROPORTIONS
                  </div>
                  <div className="bg-secondary/20 p-3 sm:p-4 border border-foreground/10">
                    <pre className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] text-foreground/80 whitespace-pre overflow-x-auto touch-manipulation">
{`     ╭─────╮
    ╱   AI   ╲
   │   /ML   │
   │  ╱  ╲   │
   │ ╱    ╲  │
   ││ MOBILE ││
   │ ╲    ╱  │
   │  ╲  ╱   │
   │   BACKEND│
    ╲       ╱
     ╰─────╯`}
                    </pre>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <SpecAnnotation label="AI/ML Ratio" value="35%" notes="PyTorch, Transformers, CoreML" />
                    <SpecAnnotation label="Mobile Ratio" value="30%" notes="iOS, Android, SwiftUI" />
                    <SpecAnnotation label="Backend Ratio" value="25%" notes="Firebase, Node.js, APIs" />
                    <SpecAnnotation label="Tools Ratio" value="10%" notes="Git, Docker, CUDA" />
                  </div>
                </div>
              </LeonardoNotebook>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}
