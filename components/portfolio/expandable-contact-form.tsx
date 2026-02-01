"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { gsap } from "gsap"
import { ArrowUpRight, X, Send } from "lucide-react"

// Cloud SVG pattern for brutalist aesthetic
function CloudPatternSVG({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const paths = svgRef.current.querySelectorAll("path, ellipse, line, circle")
    
    gsap.set(paths, { opacity: 0, scale: 0.8, transformOrigin: "center" })
    
    gsap.to(paths, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.05,
      ease: "power2.out",
      delay: 0.3,
    })
  }, [])

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 400 200"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Technical grid background */}
      <defs>
        <pattern id="techGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
        </pattern>
        <pattern id="dotGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1" fill="currentColor" opacity="0.2" />
        </pattern>
      </defs>
      
      <rect width="100%" height="100%" fill="url(#techGrid)" />
      <rect width="100%" height="100%" fill="url(#dotGrid)" />
      
      {/* Cloud shapes - brutalist angular interpretation */}
      <path
        d="M 50 120 Q 30 100 50 80 Q 70 60 100 70 Q 120 40 160 50 Q 200 30 230 60 Q 270 50 290 80 Q 330 70 350 100 Q 370 130 340 140 L 60 140 Q 30 140 50 120"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-accent"
        fill="none"
      />
      
      {/* Secondary cloud layer */}
      <path
        d="M 80 150 Q 60 130 90 110 Q 120 90 160 100 Q 190 80 220 95 Q 260 85 280 110 Q 310 100 320 130 L 90 150 Q 60 155 80 150"
        stroke="currentColor"
        strokeWidth="0.8"
        className="text-foreground/20"
        fill="none"
      />
      
      {/* Technical measurement lines */}
      <line x1="0" y1="100" x2="30" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-accent/50" />
      <line x1="370" y1="100" x2="400" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-accent/50" />
      <circle cx="35" cy="100" r="2" stroke="currentColor" strokeWidth="0.8" fill="none" className="text-accent" />
      <circle cx="365" cy="100" r="2" stroke="currentColor" strokeWidth="0.8" fill="none" className="text-accent" />
      
      {/* Corner brackets */}
      <path d="M 10 10 L 10 30 M 10 10 L 30 10" stroke="currentColor" strokeWidth="1" className="text-foreground/30" />
      <path d="M 390 10 L 390 30 M 390 10 L 370 10" stroke="currentColor" strokeWidth="1" className="text-foreground/30" />
      <path d="M 10 190 L 10 170 M 10 190 L 30 190" stroke="currentColor" strokeWidth="1" className="text-foreground/30" />
      <path d="M 390 190 L 390 170 M 390 190 L 370 190" stroke="currentColor" strokeWidth="1" className="text-foreground/30" />
      
      {/* Data points */}
      <circle cx="100" cy="70" r="3" fill="currentColor" className="text-accent" />
      <circle cx="160" cy="50" r="3" fill="currentColor" className="text-accent" />
      <circle cx="230" cy="60" r="3" fill="currentColor" className="text-accent" />
      <circle cx="290" cy="80" r="3" fill="currentColor" className="text-accent" />
      
      {/* Connection lines */}
      <line x1="100" y1="70" x2="160" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" className="text-accent/40" />
      <line x1="160" y1="50" x2="230" y2="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" className="text-accent/40" />
      <line x1="230" y1="60" x2="290" y2="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" className="text-accent/40" />
    </svg>
  )
}

// Animated technical border SVG
function TechnicalBorderSVG({ isExpanded }: { isExpanded: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const paths = svgRef.current.querySelectorAll("path, line, rect")
    
    if (isExpanded) {
      paths.forEach((el) => {
        const geom = el as SVGGeometryElement
        if (typeof geom.getTotalLength === "function") {
          try {
            const len = geom.getTotalLength()
            gsap.fromTo(geom, 
              { strokeDasharray: len, strokeDashoffset: len },
              { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }
            )
          } catch {
            gsap.to(geom, { opacity: 1, duration: 0.5 })
          }
        }
      })
    }
  }, [isExpanded])

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
    >
      {/* Corner accents */}
      <path
        d="M 0 20 L 0 0 L 20 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-accent"
      />
      <path
        d="M 100% 20 L 100% 0 L calc(100% - 20px) 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-accent"
        style={{ transform: "translateX(-20px)" }}
      />
    </svg>
  )
}

interface ExpandableContactFormProps {
  className?: string
}

export function ExpandableContactForm({ className = "" }: ExpandableContactFormProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const inputsRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const submitRef = useRef<HTMLButtonElement>(null)

  const handleExpand = useCallback(() => {
    if (!containerRef.current || !formRef.current || !buttonRef.current) return

    setIsExpanded(true)

    const tl = gsap.timeline()

    // Phase 1: Button transforms into container header
    tl.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.15,
      ease: "power2.in",
    })
    .to(buttonRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
    }, "-=0.1")

    // Phase 2: Container expands with cloud-like morphing
    .to(formRef.current, {
      height: "auto",
      duration: 0.6,
      ease: "power3.inOut",
    }, "-=0.1")
    .to(formRef.current, {
      opacity: 1,
      duration: 0.3,
    }, "-=0.5")

    // Phase 3: Content reveals
    .fromTo(contentRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      "-=0.3"
    )

    // Phase 4: Header text reveals letter by letter
    if (headerRef.current) {
      const chars = headerRef.current.querySelectorAll(".char")
      tl.fromTo(chars,
        { opacity: 0, y: 20, rotateX: -90 },
        { 
          opacity: 1, 
          y: 0, 
          rotateX: 0,
          duration: 0.5, 
          stagger: 0.03, 
          ease: "back.out(1.7)" 
        },
        "-=0.2"
      )
    }

    // Phase 5: Inputs slide in with stagger
    if (inputsRef.current) {
      const inputs = inputsRef.current.querySelectorAll(".form-input-group")
      tl.fromTo(inputs,
        { opacity: 0, x: -30, scale: 0.95 },
        { 
          opacity: 1, 
          x: 0, 
          scale: 1,
          duration: 0.4, 
          stagger: 0.1, 
          ease: "power2.out" 
        },
        "-=0.3"
      )
    }

    // Phase 6: Submit button appears
    if (submitRef.current) {
      tl.fromTo(submitRef.current,
        { opacity: 0, y: 20, scale: 0.8 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.4, 
          ease: "back.out(1.7)" 
        },
        "-=0.2"
      )
    }
  }, [])

  const handleCollapse = useCallback(() => {
    if (!containerRef.current || !formRef.current || !buttonRef.current) return

    const tl = gsap.timeline({
      onComplete: () => setIsExpanded(false)
    })

    // Reverse animation
    if (submitRef.current) {
      tl.to(submitRef.current, {
        opacity: 0,
        y: 10,
        scale: 0.9,
        duration: 0.2,
        ease: "power2.in",
      })
    }

    if (inputsRef.current) {
      const inputs = inputsRef.current.querySelectorAll(".form-input-group")
      tl.to(inputs, {
        opacity: 0,
        x: -20,
        duration: 0.2,
        stagger: 0.05,
        ease: "power2.in",
      }, "-=0.15")
    }

    if (headerRef.current) {
      const chars = headerRef.current.querySelectorAll(".char")
      tl.to(chars, {
        opacity: 0,
        y: -10,
        duration: 0.15,
        stagger: 0.01,
        ease: "power2.in",
      }, "-=0.2")
    }

    tl.to(contentRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.2,
    }, "-=0.1")

    tl.to(formRef.current, {
      height: 0,
      opacity: 0,
      duration: 0.4,
      ease: "power3.inOut",
    })

    tl.to(buttonRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: "back.out(1.7)",
    }, "-=0.2")
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    
    // Animate submit button
    if (submitRef.current) {
      gsap.to(submitRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      })
    }

    // Simulate sending (no backend yet)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSending(false)
    setSendSuccess(true)

    // Success animation
    if (submitRef.current) {
      gsap.to(submitRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "back.out(1.7)",
      })
    }

    // Reset after delay
    setTimeout(() => {
      setSendSuccess(false)
      setName("")
      setEmail("")
      setMessage("")
      handleCollapse()
    }, 2000)
  }, [handleCollapse])

  const headerText = "Send a Message"

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Main CTA Button */}
      <button
        ref={buttonRef}
        onClick={handleExpand}
        className={`
          group inline-flex items-center justify-center gap-2 sm:gap-3 
          min-h-[48px] px-6 sm:px-10 py-4 sm:py-5 
          text-base sm:text-lg font-medium font-mono 
          text-primary-foreground bg-primary 
          border-2 border-primary
          hover:shadow-2xl hover:shadow-primary/20 
          transition-all duration-500 
          w-full max-w-[320px] mx-auto sm:w-auto
          ${isExpanded ? "pointer-events-none" : ""}
        `}
        style={{ display: isExpanded ? "none" : "inline-flex" }}
      >
        Say Hello
        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform shrink-0" />
      </button>

      {/* Expandable Form Container */}
      <div
        ref={formRef}
        className={`
          relative overflow-hidden
          bg-card border-2 border-foreground
          ${isExpanded ? "block" : "hidden"}
        `}
        style={{ 
          height: isExpanded ? "auto" : 0,
          boxShadow: "8px 8px 0 0 var(--foreground)",
        }}
      >
        {/* Cloud Pattern Background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <CloudPatternSVG className="w-full h-full text-foreground" />
        </div>

        {/* Technical Border Animation */}
        <TechnicalBorderSVG isExpanded={isExpanded} />

        {/* Content */}
        <div ref={contentRef} className="relative z-10 p-6 sm:p-8">
          {/* Close Button */}
          <button
            onClick={handleCollapse}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header with character animation */}
          <div ref={headerRef} className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-[2px] bg-accent" />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                // new_message
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-mono text-foreground flex flex-wrap">
              {headerText.split("").map((char, i) => (
                <span
                  key={i}
                  className="char inline-block"
                  style={{ 
                    whiteSpace: char === " " ? "pre" : "normal",
                    transformStyle: "preserve-3d"
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h3>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div ref={inputsRef} className="space-y-5">
              {/* Name Input */}
              <div className="form-input-group">
                <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                  <span className="text-accent">&gt;</span> name.txt
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="
                      w-full px-4 py-3 
                      bg-background border-2 border-border
                      font-mono text-foreground
                      focus:border-accent focus:outline-none
                      transition-colors duration-300
                      placeholder:text-muted-foreground/50
                    "
                    placeholder="Enter your name..."
                  />
                  {/* Technical decoration */}
                  <div className="absolute -right-1 -top-1 w-3 h-3 border-t-2 border-r-2 border-accent" />
                  <div className="absolute -left-1 -bottom-1 w-3 h-3 border-b-2 border-l-2 border-accent" />
                </div>
              </div>

              {/* Email Input */}
              <div className="form-input-group">
                <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                  <span className="text-accent">&gt;</span> email.config
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="
                      w-full px-4 py-3 
                      bg-background border-2 border-border
                      font-mono text-foreground
                      focus:border-accent focus:outline-none
                      transition-colors duration-300
                      placeholder:text-muted-foreground/50
                    "
                    placeholder="your@email.com"
                  />
                  <div className="absolute -right-1 -top-1 w-3 h-3 border-t-2 border-r-2 border-accent" />
                  <div className="absolute -left-1 -bottom-1 w-3 h-3 border-b-2 border-l-2 border-accent" />
                </div>
              </div>

              {/* Message Textarea */}
              <div className="form-input-group">
                <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                  <span className="text-accent">&gt;</span> message.md
                </label>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    className="
                      w-full px-4 py-3 
                      bg-background border-2 border-border
                      font-mono text-foreground resize-none
                      focus:border-accent focus:outline-none
                      transition-colors duration-300
                      placeholder:text-muted-foreground/50
                    "
                    placeholder="Write your message here..."
                  />
                  <div className="absolute -right-1 -top-1 w-3 h-3 border-t-2 border-r-2 border-accent" />
                  <div className="absolute -left-1 -bottom-1 w-3 h-3 border-b-2 border-l-2 border-accent" />
                  
                  {/* Character count */}
                  <div className="absolute bottom-2 right-3 text-xs font-mono text-muted-foreground/50">
                    {message.length}/500
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                ref={submitRef}
                type="submit"
                disabled={isSending}
                className={`
                  group inline-flex items-center justify-center gap-2
                  px-6 py-3 
                  font-mono font-medium text-sm
                  border-2 
                  transition-all duration-300
                  ${sendSuccess 
                    ? "bg-accent text-accent-foreground border-accent" 
                    : "bg-primary text-primary-foreground border-primary hover:bg-transparent hover:text-primary"
                  }
                  ${isSending ? "opacity-70" : ""}
                `}
                style={{ boxShadow: "4px 4px 0 0 var(--foreground)" }}
              >
                {isSending ? (
                  <>
                    <span className="animate-pulse">Transmitting</span>
                    <span className="animate-spin">◐</span>
                  </>
                ) : sendSuccess ? (
                  <>
                    <span>Message Sent</span>
                    <span>✓</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Decorative footer line */}
          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground/50">
              <span>// response_time: ~24h</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom technical pattern */}
        <div className="h-2 bg-foreground/5 relative overflow-hidden">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 8px, var(--foreground) 8px, var(--foreground) 10px)",
              opacity: 0.1
            }}
          />
        </div>
      </div>
    </div>
  )
}
