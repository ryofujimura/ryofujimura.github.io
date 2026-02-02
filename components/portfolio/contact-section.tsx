"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { AnimatedSection } from "@/components/animated-section"
import { MagneticButton } from "@/components/magnetic-button"
import { RevealText } from "@/components/reveal-text"
import { Mail, Github, Linkedin, ArrowUpRight, Send, Check, AlertCircle } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { submitContactForm, fetchRecentMessages, type FetchedMessage } from "@/lib/firebase"

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
  "favorite coffee?",
  "favorite language?",
  "dream project?",
  "go-to IDE?",
  "unpopular opinion?",
  "superpower?",
  "hidden talent?",
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
  const textareaContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const usernameRef = useRef<HTMLInputElement>(null)
  const actionRowRef = useRef<HTMLDivElement>(null)
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
        
        // Success animation - shrink message area to nothing
        const textareaContainer = textareaContainerRef.current
        const actionRow = actionRowRef.current
        
        if (textareaContainer) {
          const currentHeight = textareaContainer.offsetHeight
          
          // First, set explicit height so we can animate it
          gsap.set(textareaContainer, { height: currentHeight, overflow: 'hidden' })
          
          // Animate shrinking the message container
          gsap.to(textareaContainer, {
            height: 0,
            opacity: 0,
            duration: 0.4,
            ease: "power3.inOut",
            onComplete: () => {
              setMessage("")
            }
          })
        }
        
        // Animate reducing the action row's top margin
        if (actionRow) {
          gsap.to(actionRow, {
            marginTop: 0,
            duration: 0.4,
            ease: "power3.inOut",
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
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4">
      {/* Backdrop - start hidden to prevent flash */}
      <div 
        ref={backdropRef}
        className="absolute inset-0 bg-background/40"
        onClick={handleClose}
        style={{ opacity: 0 }}
      />

      {/* Main form container - Liquid Glass effect - start hidden to prevent flash */}
      <div 
        ref={formRef}
        className="relative w-full max-w-lg border border-white/15 dark:border-white/10 overflow-hidden"
        style={{ 
          background: "rgba(255, 255, 255, 0.05)",
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.08),
            0 0 0 1px rgba(255, 255, 255, 0.08) inset
          `,
          opacity: 0,
          transform: "scale(0)",
          borderRadius: "50%",
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
        {/* Content - responsive padding - start hidden */}
        <div ref={contentRef} className="relative z-10 p-5 sm:p-8" style={{ opacity: 0 }}>
          {/* Textarea with glass effect */}
          <div ref={textareaContainerRef} className="relative">
            {/* Animated placeholder overlay - hidden during send animation */}
            {!message && sendStatus !== "success" && (
              <div 
                className="absolute left-4 sm:left-5 top-3 sm:top-4 pointer-events-none font-mono text-xs sm:text-sm"
                style={{ zIndex: 1 }}
              >
                <AnimatedPlaceholder
                  prompts={PLACEHOLDER_PROMPTS}
                  slotWidthCh={isMobile ? 14 : PLACEHOLDER_SLOT_CH}
                  isVisible={!message}
                />
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={isMobile ? 3 : 4}
              className="relative w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-white/20 dark:border-white/10 resize-none font-mono text-sm sm:text-base text-foreground focus:outline-none focus:border-white/40 transition-all duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(4px)",
              }}
            />
          </div>
          
          {/* Error message only - success shown via green button */}
          {sendStatus === "error" && (
            <div className="mt-3 sm:mt-4 flex items-center gap-2 text-red-500 font-mono text-xs sm:text-sm">
              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Failed to send. Try again.</span>
            </div>
          )}

          {/* Username input and Send button - responsive layout */}
          <div ref={actionRowRef} className="mt-4 sm:mt-6 flex items-center justify-between gap-2 sm:gap-4">
            {/* Username input */}
            <input
              ref={usernameRef}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="flex-1 min-w-0 max-w-[140px] sm:max-w-[180px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border border-white/20 dark:border-white/10 font-mono text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-white/40 transition-all duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(4px)",
              }}
            />
            
            {/* Send button - touch-friendly sizing */}
            <button
              onClick={handleSend}
              disabled={!message.trim() || !username.trim() || isSending || sendStatus === "success"}
              className="send-btn group flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-mono text-xs sm:text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 border border-white/20 shrink-0 min-h-[40px] sm:min-h-[44px]"
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
              <span className="hidden sm:inline">
                {sendStatus === "sending" ? "Sending..." : 
                 sendStatus === "success" ? "Sent!" :
                 sendStatus === "error" ? "Try Again" :
                 "Send Message"}
              </span>
              <span className="sm:hidden">
                {sendStatus === "sending" ? "..." : 
                 sendStatus === "success" ? "Sent!" :
                 sendStatus === "error" ? "Retry" :
                 "Send"}
              </span>
              {sendStatus === "success" ? (
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : sendStatus === "error" ? (
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
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

// iOS 26 Liquid Glass Message Bubble - displays a single message
function LiquidGlassMessage({ 
  message, 
  index,
  position 
}: { 
  message: FetchedMessage
  index: number
  position: { x: number; y: number; rotation: number }
}) {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!bubbleRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      // Initial state - hidden and scaled down
      gsap.set(bubbleRef.current, { 
        opacity: 0, 
        scale: 0.3,
        y: 30,
      })
      
      // Animate SVG paths
      const paths = svgRef.current?.querySelectorAll("path, circle")
      if (paths) {
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
      }

      // Main timeline with staggered delay based on index
      const tl = gsap.timeline({
        delay: 0.2 + (index * 0.15),
        scrollTrigger: {
          trigger: bubbleRef.current,
          start: "top 95%",
          toggleActions: "play none none none",
        },
      })

      // Phase 1: Bubble appears with spring effect
      tl.to(bubbleRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      })

      // Phase 2: Animate SVG paths (message icon)
      if (paths) {
        tl.to(paths, {
          strokeDashoffset: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }, "-=0.4")
      }

      // Phase 3: Text chars animate in
      const chars = contentRef.current?.querySelectorAll(".message-char")
      if (chars && chars.length > 0) {
        tl.fromTo(chars, 
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.008,
            ease: "power2.out",
          }, 
          "-=0.3"
        )
      }

      // Subtle floating animation
      gsap.to(bubbleRef.current, {
        y: "+=8",
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1 + (index * 0.2),
      })

    }, bubbleRef)

    return () => ctx.revert()
  }, [index])

  // Truncate message if too long
  const truncatedMessage = message.message.length > 80 
    ? message.message.substring(0, 80) + "..." 
    : message.message

  return (
    <div
      ref={bubbleRef}
      className="absolute pointer-events-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `rotate(${position.rotation}deg)`,
        maxWidth: "280px",
        zIndex: 1,
      }}
    >
      {/* iOS 26 Liquid Glass Container */}
      <div 
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.08),
            0 0 0 1px rgba(255, 255, 255, 0.05) inset,
            0 1px 0 rgba(255, 255, 255, 0.1) inset
          `,
        }}
      >
        {/* Specular highlight gradient - iOS glass effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)",
            borderRadius: "inherit",
          }}
        />
        
        {/* Content */}
        <div ref={contentRef} className="relative z-10 p-4">
          {/* Header with icon and username */}
          <div className="flex items-center gap-2 mb-2">
            <svg
              ref={svgRef}
              className="w-4 h-4 text-accent/80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {/* Message bubble icon */}
              <path 
                d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Dots inside bubble */}
              <circle cx="12" cy="12" r="1" />
              <circle cx="8" cy="12" r="1" />
              <circle cx="16" cy="12" r="1" />
            </svg>
            <span className="text-xs font-mono text-foreground/70 font-medium">
              {message.username.split("").map((char, i) => (
                <span key={i} className="message-char inline-block">
                  {char}
                </span>
              ))}
            </span>
          </div>
          
          {/* Message content with character animation */}
          <p className="text-sm font-mono text-foreground/60 leading-relaxed">
            {truncatedMessage.split("").map((char, i) => (
              <span
                key={i}
                className="message-char inline-block"
                style={{ whiteSpace: char === " " ? "pre" : "normal" }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </p>
        </div>
        
        {/* Bottom edge highlight */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
          }}
        />
      </div>
    </div>
  )
}

// Floating messages background - shows recent messages from Firebase
function FloatingMessagesBackground() {
  const [messages, setMessages] = useState<FetchedMessage[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  // Pre-computed positions for messages to avoid overlapping
  const messagePositions = [
    { x: 5, y: 10, rotation: -2 },
    { x: 70, y: 5, rotation: 3 },
    { x: 2, y: 55, rotation: 1 },
    { x: 68, y: 60, rotation: -1 },
    { x: 8, y: 85, rotation: 2 },
    { x: 72, y: 82, rotation: -3 },
    // Additional positions for larger screens
    { x: -5, y: 35, rotation: 1.5 },
    { x: 78, y: 32, rotation: -2 },
  ]

  useEffect(() => {
    // Fetch messages from Firebase
    const loadMessages = async () => {
      const fetchedMessages = await fetchRecentMessages(isMobile ? 4 : 8)
      setMessages(fetchedMessages)
    }
    
    loadMessages()
  }, [isMobile])

  if (messages.length === 0) return null

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {messages.map((message, index) => (
        <LiquidGlassMessage
          key={message.id}
          message={message}
          index={index}
          position={messagePositions[index % messagePositions.length]}
        />
      ))}
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
    username: "/ryofujimura",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:ryo.fujimura1@gmail.com",
    username: "ryo.fujimura1@gmail.com",
  },
]

// Custom event names for controlling contact form from navigation
export const OPEN_CONTACT_FORM_EVENT = "openContactForm"
export const CLOSE_CONTACT_FORM_EVENT = "closeContactForm"

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

  // Listen for custom events to open/close form from navigation
  useEffect(() => {
    const handleOpenFromNav = () => {
      setIsFormOpen(true)
    }
    const handleCloseFromNav = () => {
      setIsFormOpen(false)
    }
    
    window.addEventListener(OPEN_CONTACT_FORM_EVENT, handleOpenFromNav)
    window.addEventListener(CLOSE_CONTACT_FORM_EVENT, handleCloseFromNav)
    return () => {
      window.removeEventListener(OPEN_CONTACT_FORM_EVENT, handleOpenFromNav)
      window.removeEventListener(CLOSE_CONTACT_FORM_EVENT, handleCloseFromNav)
    }
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
      {/* Floating messages from Firebase in background */}
      <FloatingMessagesBackground />
      
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

      </div>
    </section>
  )
}
