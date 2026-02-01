"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { AnimatedSection } from "@/components/animated-section"
import { MagneticButton } from "@/components/magnetic-button"
import { RevealText } from "@/components/reveal-text"
import { Mail, Github, Linkedin, MapPin, ArrowUpRight, Send, Check, AlertCircle, User } from "lucide-react"
import { LocationHoverText } from "@/components/portfolio/location-hover-text"
import { useIsMobile } from "@/hooks/use-mobile"
import { submitContactForm } from "@/lib/firebase"

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

// Animated placeholder prompts
const PLACEHOLDER_PROMPTS = [
  "favorite coffee",
  "favorite language",
  "dream project",
  "go-to IDE",
  "unpopular opinion",
  "superpower",
  "hidden talent",
]
const PLACEHOLDER_ROTATE_MS = 2200
const PLACEHOLDER_SLOT_CH = 18

// Animated placeholder component for textarea
function AnimatedPlaceholder({
  prompts,
  slotWidthCh,
  isVisible,
  className = "",
}: {
  prompts: string[]
  slotWidthCh: number
  isVisible: boolean
  className?: string
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const wordRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (prompts.length <= 1 || !wordRef.current || !isVisible) return

    const animateToNext = () => {
      const wordEl = wordRef.current
      if (!wordEl) return

      const chars = wordEl.querySelectorAll(".placeholder-char")

      // Animate out current word
      gsap.to(chars, {
        y: -16,
        opacity: 0,
        duration: 0.2,
        stagger: 0.012,
        ease: "power2.in",
        onComplete: () => {
          setCurrentIndex((prev) => (prev + 1) % prompts.length)
        },
      })
    }

    const interval = setInterval(animateToNext, PLACEHOLDER_ROTATE_MS)
    return () => clearInterval(interval)
  }, [prompts.length, isVisible])

  // Animate in when word changes
  useEffect(() => {
    if (!wordRef.current || !isVisible) return
    
    const chars = wordRef.current.querySelectorAll(".placeholder-char")
    gsap.fromTo(
      chars,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.2,
        stagger: 0.012,
        ease: "power2.out",
      }
    )
  }, [currentIndex, isVisible])

  if (!isVisible) return null

  const currentPrompt = prompts[currentIndex]

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      <span className="text-muted-foreground/60">What is your&nbsp;</span>
      <span
        className="inline-flex overflow-hidden"
        style={{ minWidth: `${slotWidthCh}ch` }}
      >
        <span ref={wordRef} className="inline-flex">
          {currentPrompt.split("").map((char, i) => (
            <span
              key={`${currentIndex}-${i}`}
              className="placeholder-char inline-block text-muted-foreground/60"
              style={{ whiteSpace: char === " " ? "pre" : "normal" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </span>
      <span className="text-muted-foreground/60">?</span>
    </span>
  )
}

// Send status types
type SendStatus = "idle" | "sending" | "success" | "error"

// Cloud-themed expandable message form
function CloudMessageForm({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const usernameRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState("")
  const [username, setUsername] = useState("")
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle")
  const isMobile = useIsMobile()
  
  const isSending = sendStatus === "sending"

  // Hide custom cursor on mobile when form is open
  useEffect(() => {
    if (!isMobile) return
    
    // Add class to hide cursor on mobile
    document.body.classList.add("hide-cursor-mobile")
    
    return () => {
      document.body.classList.remove("hide-cursor-mobile")
    }
  }, [isMobile])

  useEffect(() => {
    if (!formRef.current || !contentRef.current || !backdropRef.current) return

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(backdropRef.current, { 
        opacity: 0,
        backdropFilter: "blur(0px)",
      })
      gsap.set(formRef.current, { 
        scale: 0, 
        opacity: 0,
        borderRadius: "50%",
        backdropFilter: "blur(0px)",
      })
      gsap.set(contentRef.current, { opacity: 0 })

      // Main timeline
      const tl = gsap.timeline()

      // Phase 1: Backdrop fades in with subtle blur
      tl.to(backdropRef.current, {
        opacity: 1,
        backdropFilter: "blur(3px)",
        duration: 0.5,
        ease: "power2.out",
      })

      // Phase 2: Main form expands with glass effect
      .to(formRef.current, {
        scale: 1,
        opacity: 1,
        borderRadius: "2rem",
        backdropFilter: "blur(24px)",
        duration: 0.6,
        ease: "power4.out",
      }, "-=0.3")

      // Phase 3: Content fades in
      .to(contentRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      }, "-=0.2")

      // Focus textarea after animation
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 600)

    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleClose = useCallback(() => {
    if (!formRef.current || !contentRef.current || !backdropRef.current) return

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
      backdropFilter: "blur(0px)",
      duration: 0.4,
      ease: "power3.in",
    }, "-=0.1")
    .to(backdropRef.current, {
      opacity: 0,
      backdropFilter: "blur(0px)",
      duration: 0.3,
      ease: "power2.in",
    }, "-=0.2")
  }, [onClose])

  const handleSend = useCallback(async () => {
    if (!message.trim() || !username.trim() || isSending) return
    
    setSendStatus("sending")
    
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

    try {
      // Submit to Firebase Firestore with username and message
      const result = await submitContactForm(username.trim(), message.trim())
      
      if (result.success) {
        setSendStatus("success")
        
        // Success animation - shrink textarea height
        const textarea = textareaRef.current
        if (textarea) {
          const currentHeight = textarea.offsetHeight
          
          // First, set explicit height so we can animate it
          gsap.set(textarea, { height: currentHeight })
          
          // Animate shrinking
          gsap.to(textarea, {
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            opacity: 0,
            duration: 0.5,
            ease: "power3.inOut",
            onComplete: () => {
              setMessage("")
            }
          })
        }
        
        // Auto close after success
        setTimeout(() => {
          handleClose()
        }, 1500)
      } else {
        setSendStatus("error")
        // Reset error state after 3 seconds
        setTimeout(() => setSendStatus("idle"), 3000)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setSendStatus("error")
      // Reset error state after 3 seconds
      setTimeout(() => setSendStatus("idle"), 3000)
    }
  }, [message, username, isSending, handleClose])

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        ref={backdropRef}
        className="absolute inset-0 bg-background/40"
        onClick={handleClose}
      />

      {/* Main form container - Liquid Glass effect */}
      <div 
        ref={formRef}
        className="relative w-full max-w-lg border border-white/15 dark:border-white/10 overflow-hidden"
        style={{ 
          background: "rgba(255, 255, 255, 0.05)",
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.08),
            0 0 0 1px rgba(255, 255, 255, 0.08) inset
          `,
        }}
      >
        {/* Subtle inner highlight for depth */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%)",
            borderRadius: "inherit",
          }}
        />
        {/* Content */}
        <div ref={contentRef} className="relative z-10 p-8">
          {/* Textarea with glass effect */}
          <div className="relative">
            {/* Animated placeholder overlay */}
            {!message && (
              <div 
                className="absolute left-5 top-4 pointer-events-none font-mono text-sm sm:text-base"
                style={{ zIndex: 1 }}
              >
                <AnimatedPlaceholder
                  prompts={PLACEHOLDER_PROMPTS}
                  slotWidthCh={PLACEHOLDER_SLOT_CH}
                  isVisible={!message}
                />
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="relative w-full px-5 py-4 rounded-2xl border border-white/20 dark:border-white/10 resize-none font-mono text-foreground focus:outline-none focus:border-white/40 transition-all duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(4px)",
              }}
            />
          </div>
          
          {/* Status message */}
          {sendStatus === "success" && (
            <div className="mt-4 flex items-center gap-2 text-green-500 font-mono text-sm">
              <Check className="w-4 h-4" />
              <span>Message sent successfully!</span>
            </div>
          )}
          {sendStatus === "error" && (
            <div className="mt-4 flex items-center gap-2 text-red-500 font-mono text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Failed to send. Please try again.</span>
            </div>
          )}

          {/* Username input and Send button - same row */}
          <div className="mt-6 flex items-center justify-between gap-4">
            {/* Username input */}
            <div className="flex items-center gap-2 flex-1">
              <User className="w-4 h-4 text-muted-foreground/60 shrink-0" />
              <input
                ref={usernameRef}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="flex-1 max-w-[180px] px-3 py-2 rounded-xl border border-white/20 dark:border-white/10 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-white/40 transition-all duration-300"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(4px)",
                }}
              />
            </div>
            
            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!message.trim() || !username.trim() || isSending || sendStatus === "success"}
              className="send-btn group flex items-center gap-2 px-6 py-2.5 rounded-full font-mono text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 border border-white/20 shrink-0"
              style={{
                background: sendStatus === "success"
                  ? "rgba(34, 197, 94, 0.9)"
                  : sendStatus === "error"
                  ? "rgba(239, 68, 68, 0.9)"
                  : (message.trim() && username.trim())
                  ? "rgba(var(--foreground-rgb, 0, 0, 0), 0.9)" 
                  : "rgba(255, 255, 255, 0.1)",
                color: (sendStatus === "success" || sendStatus === "error" || (message.trim() && username.trim())) 
                  ? "var(--background)" 
                  : "var(--foreground)",
                boxShadow: (message.trim() && username.trim()) ? "0 4px 20px rgba(0, 0, 0, 0.15)" : "none",
              }}
            >
              <span>
                {sendStatus === "sending" ? "Sending..." : 
                 sendStatus === "success" ? "Sent!" :
                 sendStatus === "error" ? "Try Again" :
                 "Send Message"}
              </span>
              {sendStatus === "success" ? (
                <Check className="w-4 h-4" />
              ) : sendStatus === "error" ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
              )}
            </button>
          </div>
        </div>
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
    // Open form immediately without button animation flicker
    setIsFormOpen(true)
  }, [])

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false)
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
