"use client"

import { useState } from "react"
import { AnimatedSection } from "@/components/animated-section"
import { MagneticButton } from "@/components/magnetic-button"
import { FloatingElement } from "@/components/floating-element"
import { Shape3D } from "@/components/geometric-shapes"
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
    <section id="experience" className="relative py-32 md:py-40 px-6 bg-secondary/30 overflow-hidden">
      {/* Floating background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-20 opacity-10">
          <FloatingElement amplitude={15} frequency={5000}>
            <Shape3D variant="cube" size={100} />
          </FloatingElement>
        </div>
        <div className="absolute bottom-24 right-16 opacity-15">
          <FloatingElement amplitude={20} frequency={4500} delay={600}>
            <Shape3D variant="vitruvian" size={160} />
          </FloatingElement>
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-8">
          <FloatingElement amplitude={10} frequency={5500} delay={300}>
            <Shape3D variant="pyramid" size={60} />
          </FloatingElement>
        </div>
        <div className="absolute bottom-1/3 left-1/3 opacity-10">
          <FloatingElement amplitude={12} frequency={6000} delay={900}>
            <Shape3D variant="spiral" size={100} />
          </FloatingElement>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-8">
            <span className="text-accent font-mono text-sm">02.</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Experience</h2>
            <div className="flex-1 h-px bg-border ml-4" />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={50}>
          <p className="text-muted-foreground/70 italic mb-16 max-w-xl">
            {"\"I have been impressed with the urgency of doing. Knowing is not enough; we must apply.\""} 
            <span className="ml-2">- Leonardo da Vinci</span>
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Tab navigation */}
          <AnimatedSection delay={100}>
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 border-b lg:border-b-0 lg:border-r border-border">
              {experiences.map((exp, index) => (
                <FloatingElement key={exp.company} amplitude={2} frequency={4000 + index * 300} rotateX={0} rotateY={0}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "relative px-5 py-4 text-left text-sm font-medium whitespace-nowrap lg:whitespace-normal transition-all duration-300 rounded-lg lg:rounded-l-lg lg:rounded-r-none",
                      activeIndex === index
                        ? "text-accent bg-accent/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {activeIndex === index && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-accent rounded-full hidden lg:block" />
                    )}
                    <span className="block font-semibold">{exp.company}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">{exp.period}</span>
                  </button>
                </FloatingElement>
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
                        {exp.skills.map((skill, skillIndex) => (
                          <FloatingElement 
                            key={skill} 
                            amplitude={2} 
                            frequency={3500 + skillIndex * 200} 
                            rotateX={0} 
                            rotateY={0}
                          >
                            <span
                              className="px-3 py-1.5 text-sm font-medium text-accent bg-accent/10 rounded-full border border-accent/20 hover:bg-accent/20 transition-colors"
                            >
                              {skill}
                            </span>
                          </FloatingElement>
                        ))}
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
