"use client"

import { useState } from "react"
import { AnimatedSection } from "@/components/animated-section"
import { MagneticButton } from "@/components/magnetic-button"
import { Shape3D } from "@/components/geometric-shapes"
import { AsciiSectionHeader } from "@/components/ascii-banner"
import { LeonardoNotebook, TechnicalDrawing } from "@/components/leonardo-notebook"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

const experiences = [
  {
    title: "Undergraduate Researcher",
    company: "CPX Lab, CSULB",
    companyFull: "California State University, Long Beach",
    companyUrl: "https://csulb.edu",
    period: "Aug 2024 – Present",
    description: "Contributing to a 30+ person robotics/AI research group, supporting two peer-reviewed publications (ICCPS 2025, ICRA 2026).",
    highlights: [
      "Developed transformer-based classifiers improving task accuracy by 25% and supporting real-time robotic actuation",
      "Built 3D-printed prototypes (10 iterations) and sensor-integrated hardware systems",
      "Led data collection/annotation pipelines generating 1,000+ labeled samples",
      "Created reproducible ML pipelines adopted by multiple lab members",
    ],
    skills: ["PyTorch", "Transformers", "Python", "3D Printing", "Data Pipelines"],
  },
  {
    title: "Android / iOS Development Intern",
    company: "Bose Corporation",
    companyFull: "Bose Corporation",
    companyUrl: "https://bose.com",
    period: "Jun 2025 – Aug 2025",
    description: "Engineered internal Bluetooth debugging tools adopted by 1,000+ engineers, accelerating cross-platform testing.",
    highlights: [
      "Reduced QA mismatch-version detection time by 40–60%, shortening release cycles",
      "Eliminated 10+ hours/week of debugging overhead through automation",
      "Built production-grade features using Swift Concurrency, Kotlin Coroutines, Rx",
      "Collaborated with firmware, cloud, and mobile groups resolving cross-team issues",
    ],
    skills: ["Swift", "Kotlin", "SwiftUI", "Jetpack Compose", "Bluetooth"],
  },
  {
    title: "Software Engineer Intern",
    company: "American Honda",
    companyFull: "American Honda Motor Co., Inc.",
    companyUrl: "https://honda.com",
    period: "Jun 2024 – Aug 2024",
    description: "Prototyped next-generation on-device AI using Jetson Orin Nano, evaluating automotive-grade compute constraints.",
    highlights: [
      "Reduced Llama3 8B inference latency by 20–40% via mixed-precision quantization",
      "Achieved over 3GB RAM savings enabling deployment under OEM safety requirements",
      "Delivered demos to 10+ cross-functional teams including executive leadership",
      "Profiled thermal, latency, and bandwidth tradeoffs for hybrid inference",
    ],
    skills: ["CUDA", "PyTorch", "Llama.cpp", "Jetson", "Edge AI"],
  },
  {
    title: "Data Engineer (Freelance)",
    company: "CUSCO USA",
    companyFull: "CUSCO USA Inc.",
    companyUrl: "#",
    period: "Oct 2021 – May 2024",
    description: "Built Python-based extraction pipelines processing 11,500+ legacy files spanning PDFs, images, and mixed formats.",
    highlights: [
      "Delivered 5–10× faster processing vs. manual workflows with 1–3% error rate",
      "Designed normalization/indexing layers exposing cleaned data through internal API",
      "Enabled 30% revenue increase by converting archival content into searchable intelligence",
    ],
    skills: ["Python", "Data Pipelines", "OCR", "API Design", "ETL"],
  },
]

export function ExperienceSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section id="experience" className="relative py-20 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6 bg-secondary/30 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        <div className="absolute top-16 left-20 opacity-10">
          <Shape3D variant="cube" size={100} />
        </div>
        <div className="absolute bottom-24 right-16 opacity-15">
          <Shape3D variant="vitruvian" size={160} />
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-8 hidden md:block">
          <Shape3D variant="pyramid" size={60} />
        </div>
        <div className="absolute bottom-1/3 left-1/3 opacity-10 hidden md:block">
          <Shape3D variant="spiral" size={100} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatedSection>
          <AsciiSectionHeader number="02" title="Experience" />
        </AnimatedSection>

        <AnimatedSection delay={50}>
          <p className="text-muted-foreground/70 italic mb-16 max-w-xl">
            {"\"I have been impressed with the urgency of doing. Knowing is not enough; we must apply.\""} 
            <span className="ml-2">- Leonardo da Vinci</span>
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6 sm:gap-8">
          {/* Tabs — horizontal scroll on mobile, 44px tap targets */}
          <AnimatedSection delay={100}>
            <div className="flex lg:flex-col gap-2 overflow-x-auto overflow-y-hidden lg:overflow-visible pb-4 lg:pb-0 border-b lg:border-b-0 lg:border-r border-border scrollbar-hide -mx-1 px-1 lg:mx-0 lg:px-0">
              {experiences.map((exp, index) => (
                <button
                  key={exp.company}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "touch-target min-h-[48px] relative px-4 sm:px-5 py-3.5 sm:py-4 text-left text-sm font-medium font-mono whitespace-nowrap lg:whitespace-normal transition-all duration-300 rounded-lg lg:rounded-l-lg lg:rounded-r-none flex flex-col justify-center",
                    activeIndex === index
                      ? "text-accent bg-accent/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary active:bg-secondary"
                  )}
                >
                  {activeIndex === index && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-accent rounded-full hidden lg:block" />
                  )}
                  <span className="block font-semibold">{exp.company}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5">{exp.period}</span>
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Content panel */}
          <AnimatedSection delay={200}>
            <div className="min-h-[400px] relative">
              {experiences.map((exp, index) => (
                <div
                  key={exp.company}
                  className={cn(
                    "transition-all duration-500",
                    activeIndex === index
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4 absolute pointer-events-none"
                  )}
                >
                  {activeIndex === index && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                          {exp.title}
                        </h3>
                        <MagneticButton
                          as="a"
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-accent hover:underline"
                        >
                          {exp.companyFull}
                          <ExternalLink className="w-4 h-4" />
                        </MagneticButton>
                        <p className="text-sm text-muted-foreground mt-2 font-mono">{exp.period}</p>
                      </div>

                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {exp.description}
                      </p>

                      <ul className="space-y-3">
                        {exp.highlights.map((highlight, i) => (
                          <li 
                            key={i} 
                            className="flex gap-4 text-muted-foreground"
                            style={{ 
                              animation: "fadeInUp 0.5s ease-out forwards",
                              animationDelay: `${i * 100}ms`,
                              opacity: 0,
                            }}
                          >
                            <span className="text-accent mt-1 shrink-0">&#9656;</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-2 pt-4">
                        {exp.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-sm font-medium text-accent bg-accent/10 rounded-full border border-accent/20 hover:bg-accent/20 transition-colors touch-manipulation"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 sm:mt-8">
                        <LeonardoNotebook folioRef={`RF.DV.EXP.${exp.company.slice(0, 6).toUpperCase()}`} date={exp.period.slice(-4)} className="p-3 sm:p-4">
                          <TechnicalDrawing
                            title={`ROLE: ${exp.title.toUpperCase()}`}
                            asciiArt={`  ╭─────────────╮\n ╱  ${exp.company.slice(0, 12).padEnd(12)} ╲\n│   ROLE        │\n│   ${exp.title.slice(0, 14).padEnd(14)} │\n│               │\n│   SKILLS:     │\n│   ${exp.skills.slice(0, 3).join(", ").slice(0, 20).padEnd(20)} │\n ╲               ╱\n  ╰─────────────╯`}
                            measurements={[
                              { label: "Period", value: exp.period, unit: "" },
                              { label: "Highlights", value: String(exp.highlights.length), unit: " items" },
                              { label: "Skills", value: String(exp.skills.length), unit: "" },
                            ]}
                            notes={exp.description.slice(0, 80) + (exp.description.length > 80 ? "…" : "")}
                          />
                        </LeonardoNotebook>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
