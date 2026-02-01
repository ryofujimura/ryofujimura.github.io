"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { AnimatedSection } from "@/components/animated-section"
import { MagneticButton } from "@/components/magnetic-button"
import { RevealText } from "@/components/reveal-text"
import { Mail, Github, Linkedin, MapPin, ArrowUpRight, Send, X } from "lucide-react"
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

// Cloud-themed expandable message form
function CloudMessageForm({ onClose }: { onClose: () => void }) {
  const formRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const labelCharsRef = useRef<HTMLSpanElement>(null)
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (!formRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(formRef.current, { 
        scale: 0, 
        opacity: 0,
        borderRadius: "50%",
      })
      gsap.set(contentRef.current, { opacity: 0 })

      // Main timeline
      const tl = gsap.timeline()

      // Phase 1: Main form expands
      tl.to(formRef.current, {
        scale: 1,
        opacity: 1,
        borderRadius: "2rem",
        duration: 0.6,
        ease: "power4.out",
      })

      // Phase 2: Content fades in
      .to(contentRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      }, "-=0.2")

      // Phase 3: Label text reveal character by character
      if (labelCharsRef.current) {
        const chars = labelCharsRef.current.querySelectorAll(".label-char")
        gsap.set(chars, { opacity: 0, y: 10 })
        tl.to(chars, {
          opacity: 1,
          y: 0,
          duration: 0.03,
          stagger: 0.03,
          ease: "power2.out",
        }, "-=0.3")
      }

      // Focus textarea after animation
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 800)

    }, formRef)

    return () => ctx.revert()
  }, [])

  const handleClose = useCallback(() => {
    if (!formRef.current || !contentRef.current) return

    const tl = gsap.timeline({
      onComplete: onClose,
    })

    // Reverse animation
    tl.to(contentRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
    })
    .to(formRef.current, {
      scale: 0,
      opacity: 0,
      borderRadius: "50%",
      duration: 0.4,
      ease: "power3.in",
    }, "-=0.1")
  }, [onClose])

  const handleSend = useCallback(() => {
    if (!message.trim() || isSending) return
    
    setIsSending(true)
    
    // Animate send button
    const sendBtn = formRef.current?.querySelector(".send-btn")
    if (sendBtn) {
      gsap.to(sendBtn, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      })
    }

    // Simulate sending (no backend for now)
    setTimeout(() => {
      // Success animation - message floats away
      const textarea = textareaRef.current
      if (textarea) {
        gsap.to(textarea, {
          y: -20,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            setMessage("")
            setIsSending(false)
            gsap.to(textarea, {
              y: 0,
              opacity: 1,
              duration: 0.3,
            })
          }
        })
      }
    }, 500)
  }, [message, isSending])

  const labelText = "What's on your mind?"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Main form container */}
      <div 
        ref={formRef}
        className="relative w-full max-w-lg bg-card border border-border/50 shadow-2xl"
        style={{ 
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 100px rgba(var(--accent-rgb, 100, 180, 200), 0.1)",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors group z-10"
        >
          <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>

        {/* Content */}
        <div ref={contentRef} className="p-8 pt-16">
          {/* Label with character animation */}
          <label className="block mb-4 font-mono text-sm text-muted-foreground">
            <span ref={labelCharsRef} className="inline-flex flex-wrap">
              {labelText.split("").map((char, i) => (
                <span
                  key={i}
                  className="label-char inline-block"
                  style={{ whiteSpace: char === " " ? "pre" : "normal" }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
          </label>

          {/* Textarea with vapor border effect */}
          <div className="relative">
            {/* Animated border glow */}
            <div 
              className="absolute -inset-[2px] rounded-2xl opacity-50 transition-opacity duration-500"
              style={{
                background: "linear-gradient(135deg, transparent, rgba(var(--accent-rgb, 100, 180, 200), 0.3), transparent)",
                filter: "blur(4px)",
              }}
            />
            
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              className="relative w-full px-5 py-4 bg-background/50 rounded-2xl border border-border/30 resize-none font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-colors"
              style={{
                backdropFilter: "blur(8px)",
              }}
            />
          </div>

          {/* Send button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSend}
              disabled={!message.trim() || isSending}
              className="send-btn group flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-mono text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300"
              style={{
                boxShadow: message.trim() ? "0 4px 20px rgba(var(--foreground-rgb, 0, 0, 0), 0.2)" : "none",
              }}
            >
              <span>{isSending ? "Sending..." : "Send Message"}</span>
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Decorative footer */}
          <div className="mt-8 pt-6 border-t border-border/20">
            <p className="text-xs text-muted-foreground/50 font-mono text-center">
              Messages drift through the ether
            </p>
          </div>
        </div>

        {/* Decorative corner accents */}
        <svg className="absolute top-3 left-3 w-4 h-4 text-accent/30" viewBox="0 0 16 16">
          <path d="M 0 8 L 0 0 L 8 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <svg className="absolute bottom-3 right-3 w-4 h-4 text-accent/30" viewBox="0 0 16 16">
          <path d="M 16 8 L 16 16 L 8 16" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
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
  const buttonWrapperRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isFormOpen, setIsFormOpen] = useState(false)

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

  const handleOpenForm = useCallback(() => {
    // Animate button wrapper before opening form
    if (buttonWrapperRef.current) {
      gsap.to(buttonWrapperRef.current, {
        scale: 1.08,
        duration: 0.15,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(buttonWrapperRef.current, {
            scale: 0,
            opacity: 0,
            duration: 0.35,
            ease: "power3.in",
            onComplete: () => {
              setIsFormOpen(true)
            }
          })
        }
      })
    } else {
      setIsFormOpen(true)
    }
  }, [])

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false)
    // Restore button with elastic bounce
    if (buttonWrapperRef.current) {
      gsap.fromTo(buttonWrapperRef.current, 
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.6, 
          ease: "elastic.out(1, 0.5)",
          delay: 0.15,
        }
      )
    }
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

        <AnimatedSection delay={300}>
          <div ref={buttonWrapperRef} className="inline-block">
            <MagneticButton
              as="button"
              onClick={handleOpenForm}
              cursorText="Open"
              strength={0.2}
              className="touch-target group inline-flex items-center justify-center gap-2 sm:gap-3 min-h-[48px] px-6 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-medium font-mono text-primary-foreground bg-primary rounded-full hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 w-full max-w-[320px] mx-auto sm:w-auto"
            >
              Say Hello
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform shrink-0" />
            </MagneticButton>
          </div>
        </AnimatedSection>

        {/* Cloud Message Form */}
        {isFormOpen && <CloudMessageForm onClose={handleCloseForm} />}

        <AnimatedSection delay={400}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mt-10 sm:mt-16 max-w-md sm:max-w-none mx-auto">
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
