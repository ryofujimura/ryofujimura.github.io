"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { AnimatedSection } from "@/components/animated-section"
import { MagneticButton } from "@/components/magnetic-button"
import { RevealText } from "@/components/reveal-text"
import { Mail, Github, Linkedin, MapPin, Send } from "lucide-react"
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

// Animated floating cloud SVG component
function FloatingCloud({ 
  className = "", 
  delay = 0,
  scale = 1,
}: { 
  className?: string
  delay?: number
  scale?: number
}) {
  const cloudRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!cloudRef.current) return

    const cloud = cloudRef.current

    // Initial floating animation
    gsap.fromTo(cloud, 
      { opacity: 0, y: 20, scale: 0.8 },
      { 
        opacity: 0.6, 
        y: 0, 
        scale: 1,
        duration: 1.2,
        delay: delay,
        ease: "power2.out"
      }
    )

    // Continuous gentle float
    gsap.to(cloud, {
      y: "random(-8, 8)",
      x: "random(-5, 5)",
      duration: "random(3, 5)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: delay + 1.2,
    })

    return () => {
      gsap.killTweensOf(cloud)
    }
  }, [delay])

  return (
    <svg
      ref={cloudRef}
      className={className}
      viewBox="0 0 100 60"
      fill="currentColor"
      style={{ transform: `scale(${scale})` }}
    >
      <path
        d="M85 35c0-8.284-6.716-15-15-15-.688 0-1.364.047-2.027.138C65.224 11.437 57.168 5 47.5 5c-11.322 0-20.5 9.178-20.5 20.5 0 .338.009.673.025 1.007C19.892 27.38 15 32.802 15 39.5 15 47.508 21.492 54 29.5 54h41c8.284 0 15-6.716 15-15 0-.338-.011-.673-.033-1.005A15.005 15.005 0 0085 35z"
        opacity="0.8"
      />
    </svg>
  )
}

// Expandable cloud message form
function CloudMessageForm({ isExpanded, onClose }: { isExpanded: boolean; onClose: () => void }) {
  const formRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!formRef.current || !contentRef.current) return

    const form = formRef.current
    const content = contentRef.current

    if (isExpanded) {
      // Expansion animation - cloud morphs into form
      const tl = gsap.timeline()
      
      tl.set(form, { display: "block" })
        .fromTo(form, 
          { 
            scale: 0.3,
            opacity: 0,
            borderRadius: "100px",
            width: "200px",
            height: "60px",
          },
          { 
            scale: 1,
            opacity: 1,
            borderRadius: "24px",
            width: "100%",
            height: "auto",
            duration: 0.6,
            ease: "power3.out",
          }
        )
        .fromTo(content,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          "-=0.2"
        )
        .add(() => {
          textareaRef.current?.focus()
        })

      // Animate decorative clouds
      const clouds = form.querySelectorAll(".cloud-decor")
      gsap.fromTo(clouds, 
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 0.15, 
          duration: 0.5, 
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 0.3
        }
      )
    } else {
      // Collapse animation
      const tl = gsap.timeline()
      
      tl.to(content, { opacity: 0, y: -20, duration: 0.2, ease: "power2.in" })
        .to(form, {
          scale: 0.3,
          opacity: 0,
          borderRadius: "100px",
          duration: 0.4,
          ease: "power3.in",
          onComplete: () => {
            gsap.set(form, { display: "none" })
          }
        }, "-=0.1")
    }
  }, [isExpanded])

  const handleSend = useCallback(async () => {
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

    // Simulate send (no backend for now)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    setIsSending(false)
    setShowSuccess(true)

    // Success animation
    const successEl = formRef.current?.querySelector(".success-message")
    if (successEl) {
      gsap.fromTo(successEl,
        { opacity: 0, scale: 0.8, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      )
    }

    // Reset and close after delay
    setTimeout(() => {
      setMessage("")
      setShowSuccess(false)
      onClose()
    }, 2000)
  }, [message, isSending, onClose])

  return (
    <div 
      ref={formRef}
      className="hidden absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-lg z-20 overflow-hidden"
      style={{ 
        background: "linear-gradient(135deg, rgba(var(--card-rgb, 255, 255, 255), 0.95), rgba(var(--card-rgb, 255, 255, 255), 0.85))",
        backdropFilter: "blur(20px)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(var(--border-rgb, 0, 0, 0), 0.1)",
      }}
    >
      {/* Decorative clouds */}
      <div className="cloud-decor absolute -top-4 -left-6 w-20 h-12 text-accent/30 pointer-events-none">
        <FloatingCloud scale={0.8} />
      </div>
      <div className="cloud-decor absolute -bottom-2 -right-4 w-16 h-10 text-accent/20 pointer-events-none">
        <FloatingCloud scale={0.6} delay={0.2} />
      </div>
      <div className="cloud-decor absolute top-1/2 -left-8 w-12 h-8 text-muted-foreground/10 pointer-events-none">
        <FloatingCloud scale={0.5} delay={0.4} />
      </div>

      <div ref={contentRef} className="p-6 sm:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted transition-colors group"
          aria-label="Close"
        >
          <svg 
            className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header with cloud animation */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
            </svg>
            <span className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
              Drop a message
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-mono text-foreground">
            What&apos;s on your mind?
          </h3>
        </div>

        {/* Message input */}
        {!showSuccess ? (
          <div className="space-y-4">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl font-mono text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
                style={{ caretColor: "var(--accent)" }}
              />
              {/* Character shimmer effect on focus */}
              <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 peer-focus:opacity-100 transition-opacity"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(var(--accent-rgb, 100, 180, 200), 0.05), transparent)",
                }}
              />
            </div>

            {/* Send button */}
            <div className="flex justify-end">
              <button
                onClick={handleSend}
                disabled={!message.trim() || isSending}
                className="send-btn group inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-mono text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                {isSending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Success state */
          <div className="success-message text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
              <svg className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-lg font-mono text-foreground font-medium">Message received!</p>
            <p className="text-sm text-muted-foreground mt-1">I&apos;ll get back to you soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}

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

// Cloud-themed contact button with expandable form
function CloudContactButton() {
  const [isExpanded, setIsExpanded] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const cloudsRef = useRef<HTMLDivElement>(null)

  // Initial animation for the button
  useEffect(() => {
    if (!buttonRef.current || !cloudsRef.current) return

    const button = buttonRef.current
    const clouds = cloudsRef.current.querySelectorAll(".btn-cloud")

    // Animate clouds around button
    clouds.forEach((cloud, i) => {
      gsap.to(cloud, {
        y: "random(-6, 6)",
        x: "random(-4, 4)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.3,
      })
    })

    // Subtle button pulse
    gsap.to(button, {
      boxShadow: "0 20px 40px -10px rgba(var(--accent-rgb, 100, 180, 200), 0.3)",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })

    return () => {
      gsap.killTweensOf(button)
      gsap.killTweensOf(clouds)
    }
  }, [])

  const handleClick = useCallback(() => {
    if (!buttonRef.current) return

    // Animate button before expanding
    const tl = gsap.timeline()
    
    tl.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.in",
    })
    .to(buttonRef.current, {
      scale: 1.05,
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        setIsExpanded(true)
      }
    })
  }, [])

  const handleClose = useCallback(() => {
    setIsExpanded(false)
    
    // Animate button back in
    if (buttonRef.current) {
      gsap.fromTo(buttonRef.current,
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)", delay: 0.3 }
      )
    }
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-[80px]">
      {/* Floating background clouds */}
      <div ref={cloudsRef} className="absolute inset-0 pointer-events-none">
        <div className="btn-cloud absolute -top-8 -left-12 w-24 h-14 text-accent/10">
          <FloatingCloud delay={0} />
        </div>
        <div className="btn-cloud absolute -top-4 -right-16 w-20 h-12 text-muted-foreground/10">
          <FloatingCloud delay={0.5} />
        </div>
        <div className="btn-cloud absolute -bottom-6 left-1/4 w-16 h-10 text-accent/5">
          <FloatingCloud delay={1} />
        </div>
      </div>

      {/* Main button */}
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={`touch-target group relative inline-flex items-center justify-center gap-2 sm:gap-3 min-h-[48px] px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg font-medium font-mono text-primary-foreground bg-primary rounded-full transition-all duration-300 w-full max-w-[320px] mx-auto sm:w-auto overflow-hidden ${isExpanded ? "pointer-events-none" : ""}`}
        style={{
          boxShadow: "0 10px 30px -5px rgba(var(--accent-rgb, 100, 180, 200), 0.2)",
        }}
      >
        {/* Cloud gradient overlay */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
          }}
        />
        
        {/* Animated cloud icon */}
        <svg 
          className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
        </svg>
        
        <span className="relative z-10">Say Hello</span>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </button>

      {/* Expandable message form */}
      <CloudMessageForm isExpanded={isExpanded} onClose={handleClose} />
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
          <CloudContactButton />
        </AnimatedSection>

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
