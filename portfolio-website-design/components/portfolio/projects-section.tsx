"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { GSAPText, GSAPSVG } from "@/components/gsap-text"
import { MagneticButton } from "@/components/magnetic-button"
import { ExternalLink, Github, ArrowRight, Eye, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

const allProjects = [
  {
    title: "ZERO INBOX",
    subtitle: "AI-Driven Email Prioritization",
    description:
      "Swift/SwiftUI email client with Google Mail API + Firebase + an AI reasoning engine. Features 90-95% classification accuracy, 100-300ms end-to-end inference latency.",
    stats: { accuracy: "95%", latency: "200ms", throughput: "50-200/min" },
    links: { github: "#", demo: "#" },
    skills: ["Swift", "SwiftUI", "Firebase", "AI/ML", "Google APIs"],
    number: "001",
    year: "2025",
  },
  {
    title: "SABORIENDO",
    subtitle: "Full-Stack E-commerce",
    description:
      "Comprehensive e-commerce platform using React 19, SwiftUI, and Firebase with real-time order processing and multi-language support (EN/JP/ES).",
    stats: { speedup: "50%", formats: "11+", languages: "3" },
    links: { github: "#", demo: "#" },
    skills: ["React 19", "SwiftUI", "Firebase", "Firestore"],
    number: "002",
    year: "2024",
  },
  {
    title: "HTIC SHUTTLE",
    subtitle: "Real-Time Tracking",
    description:
      "Cross-platform shuttle tracking used daily by 25+ consistent users. Reduced duplicate/conflicting pickup events by 70%+ through event serialization.",
    stats: { users: "25+", reduction: "70%", sync: "<100ms" },
    links: { github: "#", demo: "#" },
    skills: ["Swift", "Kotlin", "Firebase RTDB", "Real-time"],
    number: "003",
    year: "2024",
  },
  {
    title: "AUTONOMOUS SLAM",
    subtitle: "Research Publication",
    description:
      "ICCPS 2025 & ICRA 2026 published research on SLAM systems for indoor navigation with real-time localization.",
    stats: { papers: "2", conference: "ICRA", accuracy: "Sub-m" },
    links: { github: "#", paper: "#" },
    skills: ["Python", "ROS", "C++", "OpenCV"],
    number: "004",
    year: "2025",
  },
]

function ProjectCard({
  project,
  index,
  isVisible,
}: {
  project: (typeof allProjects)[0]
  index: number
  isVisible: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!cardRef.current || !isVisible) return

    gsap.fromTo(
      cardRef.current,
      { 
        y: 100, 
        opacity: 0,
        rotateX: 10,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: index * 0.2,
      }
    )
  }, [isVisible, index])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 30,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 30,
    })
  }

  return (
    <div
      ref={cardRef}
      className="opacity-0"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePos({ x: 0, y: 0 })
      }}
      style={{
        perspective: "1000px",
      }}
    >
      <div
        className="relative border-2 border-foreground bg-card overflow-hidden group"
        style={{
          transform: isHovered
            ? `rotateY(${mousePos.x * 0.1}deg) rotateX(${-mousePos.y * 0.1}deg) scale(1.01)`
            : "rotateY(0) rotateX(0) scale(1)",
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Technical corner marks */}
        <div className="absolute top-0 left-0 w-6 h-6 border-b-2 border-r-2 border-foreground/30" />
        <div className="absolute top-0 right-0 w-6 h-6 border-b-2 border-l-2 border-foreground/30" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-t-2 border-r-2 border-foreground/30" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-t-2 border-l-2 border-foreground/30" />

        <div className="grid lg:grid-cols-2">
          {/* Left - Technical visualization */}
          <div className="relative aspect-video lg:aspect-auto lg:h-[450px] bg-secondary/30 overflow-hidden border-r-2 border-foreground">
            {/* Grid pattern */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />

            {/* Animated technical SVG */}
            <GSAPSVG className="absolute inset-0 text-foreground/20" duration={2}>
              <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" stroke="currentColor">
                <circle cx="200" cy="200" r="120" strokeWidth="1" />
                <circle cx="200" cy="200" r="80" strokeWidth="0.5" />
                <circle cx="200" cy="200" r="40" strokeWidth="0.5" />
                <line x1="200" y1="0" x2="200" y2="400" strokeWidth="0.5" opacity="0.5" />
                <line x1="0" y1="200" x2="400" y2="200" strokeWidth="0.5" opacity="0.5" />
                <path d="M200 80 L200 320" strokeWidth="1" strokeDasharray="5,5" />
                <path d="M80 200 L320 200" strokeWidth="1" strokeDasharray="5,5" />
              </svg>
            </GSAPSVG>

            {/* Project number - large */}
            <div className="absolute bottom-6 left-6">
              <span className="text-[120px] font-black text-foreground/5 leading-none tracking-tighter">
                {project.number}
              </span>
            </div>

            {/* Year badge */}
            <div className="absolute top-6 right-6">
              <span className="text-xs font-mono px-3 py-1 border border-foreground/30 text-foreground/60">
                {project.year}
              </span>
            </div>

            {/* Placeholder icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-2 border-foreground/20 flex items-center justify-center">
                <span className="text-3xl font-mono text-foreground/30">{`<>`}</span>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="space-y-6">
              {/* Subtitle */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-accent" />
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-accent">
                  {project.subtitle}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-none">
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              {/* Stats - brutalist style */}
              <div className="grid grid-cols-3 gap-0 border-2 border-foreground">
                {Object.entries(project.stats).map(([key, value], i) => (
                  <div
                    key={key}
                    className={cn(
                      "p-4 text-center",
                      i < 2 && "border-r-2 border-foreground"
                    )}
                  >
                    <div className="text-2xl font-black text-foreground">{value}</div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-1">
                      {key}
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs font-mono text-foreground border border-foreground/30 hover:bg-foreground hover:text-background transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-4 pt-4">
                <MagneticButton
                  as="a"
                  href={project.links.github}
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs font-mono uppercase tracking-wider text-foreground border-2 border-foreground hover:bg-foreground hover:text-background transition-all"
                >
                  <Github className="w-4 h-4" />
                  Source
                </MagneticButton>
                {project.links.demo && (
                  <MagneticButton
                    as="a"
                    href={project.links.demo}
                    className="inline-flex items-center gap-2 px-6 py-3 text-xs font-mono uppercase tracking-wider text-background bg-foreground border-2 border-foreground hover:bg-transparent hover:text-foreground transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Demo
                  </MagneticButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProjectsSection() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [showAll, setShowAll] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const projectRefs = useRef<(HTMLDivElement | null)[]>([])
  const titleRef = useRef<HTMLDivElement>(null)

  const displayedProjects = showAll ? allProjects : allProjects.slice(0, 3)

  useEffect(() => {
    // Animate section title
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current.querySelectorAll(".animate-title"),
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
          },
        }
      )
    }

    // Observe each project for visibility
    const observers: IntersectionObserver[] = []

    displayedProjects.forEach((_, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleCount((prev) => Math.max(prev, index + 1))
            }
          })
        },
        { threshold: 0.2, rootMargin: "-50px" }
      )

      const ref = projectRefs.current[index]
      if (ref) {
        observer.observe(ref)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [displayedProjects.length])

  return (
    <section id="projects" ref={sectionRef} className="relative py-32 md:py-40 px-6 overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Side technical decoration */}
      <div className="absolute left-0 top-1/3 w-px h-64 bg-foreground/10" />
      <div className="absolute right-0 top-1/2 w-px h-48 bg-foreground/10" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div ref={titleRef} className="mb-20">
          <div className="flex items-center gap-6 mb-8">
            <span className="animate-title text-xs font-mono px-3 py-1 border border-foreground text-foreground">
              003
            </span>
            <div className="animate-title flex-1 h-px bg-foreground/20" />
          </div>

          <GSAPText
            variant="chars"
            className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tighter"
            stagger={0.02}
          >
            FEATURED WORK
          </GSAPText>

          <div className="mt-8 flex items-start gap-8">
            <div className="w-16 h-px bg-accent mt-3" />
            <GSAPText
              variant="words"
              className="text-lg text-muted-foreground max-w-xl"
              delay={0.5}
            >
              A selection of projects showcasing expertise in AI, mobile development, and full-stack engineering
            </GSAPText>
          </div>
        </div>

        {/* Projects list */}
        <div className="space-y-16">
          {displayedProjects.map((project, index) => (
            <div
              key={project.title}
              ref={(el) => {
                projectRefs.current[index] = el
              }}
            >
              <ProjectCard
                project={project}
                index={index}
                isVisible={visibleCount > index}
              />
            </div>
          ))}
        </div>

        {/* View more button */}
        {!showAll && allProjects.length > 3 && (
          <div className="flex justify-center mt-20">
            <MagneticButton
              onClick={() => setShowAll(true)}
              className="group relative inline-flex items-center gap-4 px-12 py-5 text-sm font-mono uppercase tracking-wider text-foreground border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
            >
              <Eye className="w-5 h-5" />
              View All Projects
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </MagneticButton>
          </div>
        )}

        {/* All projects link */}
        {showAll && (
          <div className="flex justify-center mt-20">
            <MagneticButton
              as="a"
              href="#contact"
              className="group inline-flex items-center gap-3 text-lg font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              {"Let's collaborate"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </MagneticButton>
          </div>
        )}
      </div>
    </section>
  )
}
