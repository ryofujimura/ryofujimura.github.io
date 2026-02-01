"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { AnimatedSection } from "@/components/animated-section"
import { MagneticButton } from "@/components/magnetic-button"
import { RevealText } from "@/components/reveal-text"
import { Github, Linkedin, Mail, MapPin, Send, X } from "lucide-react"
import { LocationHoverText } from "@/components/portfolio/location-hover-text"

gsap.registerPlugin(ScrollTrigger)

// Rotating words for the tagline
const ROTATING_WORDS = [
  "opportunities",
  "collaboration",
  "your project",
  "new ideas",
  "AI research",
]
const WORD_ROTATE_MS = 2800
const WORD_SLOT_CH = 14

// Vertical letter-by-letter word rotator
function VerticalWordRotator({
  words,
  slotWidthCh,
  className = "",
}: {
  words: string[]
  slotWidthCh: number
  className?: string
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLSpanElement>(null)
  const wordRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (words.length <= 1 || !wordRef.current) return

    const animateToNext = () => {
      const wordEl = wordRef.current
      if (!wordEl) return

      const chars = wordEl.querySelectorAll(".char")

      // Animate out current word
      gsap.to(chars, {
        y: -20,
        opacity: 0,
        duration: 0.25,
        stagger: 0.015,
        ease: "power2.in",
        onComplete: () => {
          // Update to next word
          setCurrentIndex((prev) => (prev + 1) % words.length)
        },
      })
    }

    const interval = setInterval(animateToNext, WORD_ROTATE_MS)
    return () => clearInterval(interval)
  }, [words.length])

  // Animate in when word changes
  useEffect(() => {
    if (!wordRef.current) return
    
    const chars = wordRef.current.querySelectorAll(".char")
    gsap.fromTo(
      chars,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.25,
        stagger: 0.015,
        ease: "power2.out",
      }
    )
  }, [currentIndex])

  const currentWord = words[currentIndex]

  return (
    <span
      ref={containerRef}
      className={`inline-flex overflow-hidden ${className}`}
      style={{ 
        minWidth: `${slotWidthCh}ch`,
      }}
    >
      <span ref={wordRef} className="inline-flex">
        {currentWord.split("").map((char, i) => (
          <span
            key={`${currentIndex}-${i}`}
            className="char inline-block"
            style={{ whiteSpace: char === " " ? "pre" : "normal" }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </span>
  )
}

// Animated SVG decoration for the header
function AnimatedHeaderSVG({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const paths = svgRef.current.querySelectorAll("path, line, circle")
    
    // Set initial state - hidden with stroke offset
    paths.forEach((el) => {
      const geom = el as SVGGeometryElement
      if (typeof geom.getTotalLength === "function") {
        try {
          const len = geom.getTotalLength()
          gsap.set(geom, { strokeDasharray: len, strokeDashoffset: len })
        } catch {
          // Skip unsupported elements
        }
      }
    })

    // Animate on scroll
    const ctx = gsap.context(() => {
      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      })
    }, svgRef)

    return () => ctx.revert()
  }, [])

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 600 60"
      fill="none"
      stroke="currentColor"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Left decorative bracket */}
      <path
        d="M 20 10 L 5 10 L 5 50 L 20 50"
        strokeWidth="1.5"
        className="text-accent"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left inner line */}
      <line
        x1="30"
        y1="30"
        x2="70"
        y2="30"
        strokeWidth="1"
        className="text-foreground/30"
        strokeLinecap="round"
      />
      {/* Left dot */}
      <circle
        cx="80"
        cy="30"
        r="3"
        strokeWidth="1.5"
        className="text-accent"
      />
      
      {/* Right decorative bracket */}
      <path
        d="M 580 10 L 595 10 L 595 50 L 580 50"
        strokeWidth="1.5"
        className="text-accent"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right inner line */}
      <line
        x1="570"
        y1="30"
        x2="530"
        y2="30"
        strokeWidth="1"
        className="text-foreground/30"
        strokeLinecap="round"
      />
      {/* Right dot */}
      <circle
        cx="520"
        cy="30"
        r="3"
        strokeWidth="1.5"
        className="text-accent"
      />
    </svg>
  )
}

// Floating cloud particles for atmospheric effect
function FloatingParticles({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!containerRef.current || !isActive) return

    const particles = particlesRef.current
    
    particles.forEach((particle, i) => {
      if (!particle) return
      
      // Random initial positions
      const startX = Math.random() * 100 - 50
      const startY = Math.random() * 100 + 50
      
      gsap.set(particle, {
        x: startX,
        y: startY,
        scale: 0,
        opacity: 0,
      })

      // Floating animation
      gsap.to(particle, {
        y: startY - 150 - Math.random() * 100,
        x: startX + (Math.random() - 0.5) * 80,
        scale: 0.5 + Math.random() * 0.5,
        opacity: 0.3 + Math.random() * 0.4,
        duration: 2 + Math.random() * 2,
        delay: i * 0.15,
        ease: "power1.out",
        onComplete: () => {
          gsap.to(particle, {
            y: "-=50",
            opacity: 0,
            duration: 1.5,
            ease: "power1.in",
          })
        },
      })
    })
  }, [isActive])

  if (!isActive) return null

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) particlesRef.current[i] = el
          }}
          className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full bg-accent/40 blur-sm"
          style={{
            width: 8 + Math.random() * 16,
            height: 8 + Math.random() * 16,
          }}
        />
      ))}
    </div>
  )
}

// Cloud-morphing expandable message form
function CloudMessageForm({ 
  isExpanded, 
  onToggle,
  onClose,
}: { 
  isExpanded: boolean
  onToggle: () => void
  onClose: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const blobsRef = useRef<SVGSVGElement>(null)
  const sendButtonRef = useRef<HTMLButtonElement>(null)
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  // Morph cloud shape paths
  const cloudPaths = {
    button: "M50,25 C50,11 61,0 75,0 L325,0 C339,0 350,11 350,25 L350,35 C350,49 339,60 325,60 L75,60 C61,60 50,49 50,35 Z",
    expanded: "M0,40 C0,18 18,0 40,0 L560,0 C582,0 600,18 600,40 L600,320 C600,342 582,360 560,360 L40,360 C18,360 0,342 0,320 Z",
  }

  // Initial blob animation on mount
  useEffect(() => {
    if (!blobsRef.current) return

    const blobs = blobsRef.current.querySelectorAll(".cloud-blob")
    
    blobs.forEach((blob, i) => {
      gsap.to(blob, {
        scale: 1 + Math.random() * 0.1,
        x: Math.sin(i) * 3,
        y: Math.cos(i) * 3,
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    })
  }, [])

  // Expand/collapse animation
  useEffect(() => {
    if (!containerRef.current || !formRef.current || !buttonRef.current) return

    const ctx = gsap.context(() => {
      if (tlRef.current) {
        tlRef.current.kill()
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
      })

      if (isExpanded) {
        // Expansion animation
        tl.to(buttonRef.current, {
          scale: 0.95,
          duration: 0.15,
        })
        .to(containerRef.current, {
          width: "100%",
          maxWidth: 600,
          height: 360,
          duration: 0.8,
          ease: "elastic.out(1, 0.75)",
        }, 0.1)
        .to(".cloud-main-path", {
          attr: { d: cloudPaths.expanded },
          duration: 0.8,
          ease: "elastic.out(1, 0.75)",
        }, 0.1)
        .to(".button-content", {
          opacity: 0,
          y: -20,
          duration: 0.2,
        }, 0)
        .fromTo(formRef.current, {
          opacity: 0,
          y: 30,
          scale: 0.9,
        }, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.5)",
        }, 0.4)
        .fromTo(".form-title-char", {
          opacity: 0,
          y: 20,
          rotateX: -90,
        }, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.03,
          duration: 0.4,
          ease: "back.out(2)",
        }, 0.5)
        .fromTo(".form-textarea", {
          opacity: 0,
          scale: 0.95,
          y: 10,
        }, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
        }, 0.7)
        .fromTo(sendButtonRef.current, {
          opacity: 0,
          scale: 0.8,
          y: 10,
        }, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.3,
        }, 0.85)
        .fromTo(".close-btn", {
          opacity: 0,
          scale: 0,
          rotate: -180,
        }, {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.4,
          ease: "back.out(2)",
        }, 0.6)

        // Focus textarea after animation
        setTimeout(() => textareaRef.current?.focus(), 800)
      } else {
        // Collapse animation
        tl.to(".close-btn", {
          opacity: 0,
          scale: 0,
          rotate: 180,
          duration: 0.2,
        })
        .to(formRef.current, {
          opacity: 0,
          y: 20,
          scale: 0.95,
          duration: 0.3,
        }, 0)
        .to(containerRef.current, {
          width: 200,
          height: 60,
          duration: 0.6,
          ease: "power3.inOut",
        }, 0.2)
        .to(".cloud-main-path", {
          attr: { d: cloudPaths.button },
          duration: 0.6,
          ease: "power3.inOut",
        }, 0.2)
        .to(".button-content", {
          opacity: 1,
          y: 0,
          duration: 0.3,
        }, 0.5)
        .to(buttonRef.current, {
          scale: 1,
          duration: 0.2,
        }, 0.6)
      }

      tlRef.current = tl
    }, containerRef)

    return () => ctx.revert()
  }, [isExpanded, cloudPaths.button, cloudPaths.expanded])

  // Send button hover animation
  const handleSendHover = useCallback((hovering: boolean) => {
    if (!sendButtonRef.current) return
    
    gsap.to(sendButtonRef.current, {
      scale: hovering ? 1.05 : 1,
      duration: 0.3,
      ease: "power2.out",
    })

    gsap.to(".send-icon", {
      x: hovering ? 3 : 0,
      y: hovering ? -3 : 0,
      duration: 0.3,
      ease: "power2.out",
    })
  }, [])

  // Mock send handler
  const handleSend = useCallback(() => {
    if (!message.trim() || isSending) return
    
    setIsSending(true)
    
    // Animate send button
    gsap.timeline()
      .to(sendButtonRef.current, {
        scale: 0.9,
        duration: 0.1,
      })
      .to(sendButtonRef.current, {
        scale: 1.1,
        duration: 0.2,
      })
      .to(".send-icon", {
        x: 100,
        y: -50,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      })
      .to(sendButtonRef.current, {
        scale: 1,
        duration: 0.2,
      })
      .call(() => {
        // Reset after mock send
        setTimeout(() => {
          setMessage("")
          setIsSending(false)
          gsap.set(".send-icon", { x: 0, y: 0, opacity: 1 })
        }, 500)
      })
  }, [message, isSending])

  const titleChars = "Drop a message".split("")

  return (
    <div className="relative inline-flex justify-center">
      <FloatingParticles isActive={isExpanded} />
      
      <div
        ref={containerRef}
        className="relative"
        style={{
          width: isExpanded ? "100%" : 200,
          maxWidth: isExpanded ? 600 : 200,
          height: isExpanded ? 360 : 60,
        }}
      >
        {/* Cloud SVG background */}
        <svg
          ref={blobsRef}
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 600 360"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="cloud-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            </filter>
            <linearGradient id="cloud-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          
          {/* Decorative background blobs */}
          <ellipse
            className="cloud-blob"
            cx="100"
            cy="50"
            rx="60"
            ry="40"
            fill="var(--primary)"
            opacity="0.15"
            filter="url(#cloud-blur)"
          />
          <ellipse
            className="cloud-blob"
            cx="500"
            cy="300"
            rx="70"
            ry="45"
            fill="var(--primary)"
            opacity="0.12"
            filter="url(#cloud-blur)"
          />
          <ellipse
            className="cloud-blob"
            cx="550"
            cy="80"
            rx="50"
            ry="35"
            fill="var(--accent)"
            opacity="0.1"
            filter="url(#cloud-blur)"
          />
          
          {/* Main cloud shape */}
          <path
            className="cloud-main-path"
            d={cloudPaths.button}
            fill="url(#cloud-gradient)"
            style={{
              filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.15))",
            }}
          />
        </svg>

        {/* Button state */}
        <button
          ref={buttonRef}
          onClick={onToggle}
          className="button-content absolute inset-0 flex items-center justify-center gap-2 text-primary-foreground font-mono font-medium z-10"
          style={{ opacity: isExpanded ? 0 : 1 }}
        >
          <span>Say Hello</span>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Expanded form state */}
        <div
          ref={formRef}
          className="absolute inset-0 p-6 sm:p-8 flex flex-col z-10"
          style={{ 
            opacity: 0,
            pointerEvents: isExpanded ? "auto" : "none",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="close-btn absolute top-4 right-4 w-8 h-8 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-primary-foreground" />
          </button>

          {/* Title with character animation */}
          <h3 className="text-xl sm:text-2xl font-mono font-bold text-primary-foreground mb-4 flex flex-wrap perspective-1000">
            {titleChars.map((char, i) => (
              <span
                key={i}
                className="form-title-char inline-block"
                style={{ 
                  whiteSpace: char === " " ? "pre" : "normal",
                  transformStyle: "preserve-3d",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h3>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's on your mind?"
            className="form-textarea flex-1 w-full bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground placeholder:text-primary-foreground/50 rounded-2xl p-4 resize-none font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-foreground/30 transition-all"
            style={{
              minHeight: 120,
            }}
          />

          {/* Send button */}
          <div className="flex justify-end mt-4">
            <button
              ref={sendButtonRef}
              onClick={handleSend}
              onMouseEnter={() => handleSendHover(true)}
              onMouseLeave={() => handleSendHover(false)}
              disabled={!message.trim() || isSending}
              className="flex items-center gap-2 px-6 py-3 bg-primary-foreground text-primary rounded-full font-mono font-medium text-sm disabled:opacity-50 disabled:pointer-events-none transition-colors hover:bg-primary-foreground/90"
            >
              <span>{isSending ? "Sending..." : "Send"}</span>
              <Send className="send-icon w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const socialLinks = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/ryofujimura",
    username: "@ryofujimura",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/ryofujimura",
    username: "/in/ryofujimura",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:ryo.fujimura1@gmail.com",
    username: "ryo.fujimura1@gmail.com",
  },
]

export function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isFormExpanded, setIsFormExpanded] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }

    const container = containerRef.current
    container?.addEventListener("mousemove", handleMouseMove)
    return () => container?.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleToggleForm = useCallback(() => {
    setIsFormExpanded((prev) => !prev)
  }, [])

  const handleCloseForm = useCallback(() => {
    setIsFormExpanded(false)
  }, [])

  return (
    <section 
      id="contact" 
      ref={containerRef}
      className="relative py-20 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6 overflow-hidden"
    >
      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(var(--accent-rgb, 100, 180, 200), 0.15) 0%, transparent 50%)`,
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <AnimatedSection>
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            {/* Animated SVG decoration */}
            <div className="relative w-full max-w-md">
              <AnimatedHeaderSVG className="w-full h-12 sm:h-16" />
              <h2 className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-mono">
                What's Next?
              </h2>
            </div>
          </div>
        </AnimatedSection>

        <div className="mb-6 sm:mb-8">
          <RevealText
            text="Let's Work Together"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-mono text-foreground"
            delay={100}
          />
        </div>

        <AnimatedSection delay={200}>
          <div className="flex justify-center mb-8 sm:mb-12 px-1">
            <div className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed font-mono inline-block">
              <p>
                Open to{" "}
                <VerticalWordRotator
                  words={ROTATING_WORDS}
                  slotWidthCh={WORD_SLOT_CH}
                  className="text-foreground font-medium"
                />
              </p>
              <p className="text-right mt-1">
                — let&apos;s connect.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Cloud-morphing message form */}
        <AnimatedSection delay={300}>
          <div className="flex justify-center mb-10 sm:mb-16">
            <CloudMessageForm 
              isExpanded={isFormExpanded}
              onToggle={handleToggleForm}
              onClose={handleCloseForm}
            />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            {socialLinks.map((link) => (
              <MagneticButton
                key={link.label}
                as="a"
                href={link.href}
                target={link.label !== "Email" ? "_blank" : undefined}
                rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
                className="touch-target group flex items-center justify-center gap-2 sm:gap-3 min-h-[48px] px-4 sm:px-6 py-3.5 sm:py-4 bg-card rounded-xl border border-border hover:border-accent/50 transition-all duration-300 w-full sm:w-auto font-mono text-sm"
              >
                <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {link.username}
                </span>
              </MagneticButton>
            ))}
          </div>
        </AnimatedSection>

        {/* Location */}
        <AnimatedSection delay={500}>
          <div className="flex items-center justify-center gap-2 mt-8 sm:mt-12 text-muted-foreground font-mono text-sm">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>
              &gt;{" "}
              <LocationHoverText
                defaultWords={["Irvine", ", ", "California"]}
                hoverWords={["Open", " to", " relocate"]}
              />
            </span>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
