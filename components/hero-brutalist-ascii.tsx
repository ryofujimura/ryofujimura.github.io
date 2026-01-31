"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"

// ASCII block data - technical/engineering aesthetic
const ASCII_BLOCKS = [
  {
    id: "matrix",
    content: `┌──────────────────────────┐
│ ▓▓░░▓▓░░▓▓░░▓▓░░▓▓░░▓▓ │
│ ░░▓▓░░▓▓░░▓▓░░▓▓░░▓▓░░ │
│ ▓▓░░▓▓░░▓▓░░▓▓░░▓▓░░▓▓ │
│ ░░▓▓░░▓▓░░▓▓░░▓▓░░▓▓░░ │
└──────────────────────────┘`,
  },
  {
    id: "circuit",
    content: `    ┌─────┬─────┐
    │     │     │
────┼──●──┼──●──┼────
    │     │     │
    └─────┴─────┘`,
  },
  {
    id: "data",
    content: `╔═══════════════════╗
║ 0x7F4A >> SYS.OK ║
║ 0xB3E1 >> MEM.64 ║
║ 0x9D2C >> CPU.OK ║
╚═══════════════════╝`,
  },
]

// Technical coordinates that animate
const COORD_LINES = [
  "X: 35.8742° N",
  "Y: 139.6503° E",
  "Z: ±0.0001",
  "δ: 0.00000",
]

// Glitch characters for scramble effect
const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#_░▒▓█▀▄"

// Random glitch character
function randomGlitch() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
}

// Generate random binary/hex line
function generateDataLine(length: number): string {
  const chars = "01"
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

// Technical line component with draw animation
function TechnicalLine({
  points,
  delay = 0,
  duration = 1.2,
  className = "",
}: {
  points: string
  delay?: number
  duration?: number
  className?: string
}) {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return

    const length = path.getTotalLength()
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
    gsap.to(path, {
      strokeDashoffset: 0,
      duration,
      delay,
      ease: "power2.inOut",
    })
  }, [delay, duration])

  return (
    <path
      ref={pathRef}
      d={points}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={className}
    />
  )
}

// Scramble text component
function ScrambleText({
  text,
  delay = 0,
  className = "",
}: {
  text: string
  delay?: number
  className?: string
}) {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      let iteration = 0
      const maxIterations = text.length * 3

      const interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, i) => {
              if (i < iteration / 3) return char
              return randomGlitch()
            })
            .join("")
        )

        iteration++
        if (iteration >= maxIterations) {
          clearInterval(interval)
          setDisplayText(text)
          setIsComplete(true)
        }
      }, 30)

      return () => clearInterval(interval)
    }, delay * 1000)

    return () => clearTimeout(timeout)
  }, [text, delay])

  return (
    <span className={`${className} ${isComplete ? "" : "opacity-90"}`}>
      {displayText || text.split("").map(() => randomGlitch()).join("")}
    </span>
  )
}

// Typing effect component
function TypeWriter({
  lines,
  delay = 0,
  className = "",
}: {
  lines: string[]
  delay?: number
  className?: string
}) {
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [displayLines, setDisplayLines] = useState<string[]>([])

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      if (currentLine >= lines.length) return

      const charTimeout = setTimeout(() => {
        if (currentChar < lines[currentLine].length) {
          setDisplayLines((prev) => {
            const newLines = [...prev]
            newLines[currentLine] = lines[currentLine].slice(0, currentChar + 1)
            return newLines
          })
          setCurrentChar((c) => c + 1)
        } else {
          setCurrentLine((l) => l + 1)
          setCurrentChar(0)
          setDisplayLines((prev) => [...prev, ""])
        }
      }, 25 + Math.random() * 40)

      return () => clearTimeout(charTimeout)
    }, delay * 1000)

    return () => clearTimeout(startTimeout)
  }, [currentLine, currentChar, lines, delay])

  return (
    <div className={className}>
      {displayLines.map((line, i) => (
        <div key={i} className="leading-tight">
          {line}
          {i === currentLine && currentChar < lines[currentLine]?.length && (
            <span className="animate-pulse">█</span>
          )}
        </div>
      ))}
    </div>
  )
}

// Data stream component - continuous scrolling binary
function DataStream({ className = "" }: { className?: string }) {
  const [lines, setLines] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize with some lines
    const initial = Array.from({ length: 12 }, () => generateDataLine(28))
    setLines(initial)

    // Add new lines periodically
    const interval = setInterval(() => {
      setLines((prev) => {
        const newLines = [...prev.slice(-11), generateDataLine(28)]
        return newLines
      })
    }, 400)

    return () => clearInterval(interval)
  }, [])

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      {lines.map((line, i) => (
        <div
          key={i}
          className="leading-none transition-opacity duration-300"
          style={{ opacity: 0.15 + (i / lines.length) * 0.6 }}
        >
          {line}
        </div>
      ))}
    </div>
  )
}

// Main brutalist ASCII component
export function HeroBrutalistAscii() {
  const containerRef = useRef<HTMLDivElement>(null)
  const asciiBlocksRef = useRef<(HTMLDivElement | null)[]>([])
  const svgRef = useRef<SVGSVGElement>(null)
  const coordsRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Main entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // GSAP animations
  useEffect(() => {
    if (!isVisible) return

    const ctx = gsap.context(() => {
      // Animate ASCII blocks with stagger
      asciiBlocksRef.current.forEach((block, i) => {
        if (!block) return
        gsap.fromTo(
          block,
          {
            opacity: 0,
            y: 30,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: 0.8 + i * 0.25,
            ease: "power3.out",
          }
        )
      })

      // Animate coordinates
      if (coordsRef.current) {
        const coordLines = coordsRef.current.querySelectorAll("[data-coord]")
        gsap.fromTo(
          coordLines,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            delay: 1.8,
            stagger: 0.1,
            ease: "power2.out",
          }
        )
      }

      // Animate frame
      if (frameRef.current) {
        gsap.fromTo(
          frameRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.2, delay: 0.5, ease: "power2.out" }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isVisible])

  const setBlockRef = useCallback((el: HTMLDivElement | null, index: number) => {
    asciiBlocksRef.current[index] = el
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Outer technical frame */}
      <div
        ref={frameRef}
        className="absolute inset-4 border border-foreground/10 opacity-0"
      >
        {/* Corner markers */}
        <div className="absolute -top-px -left-px w-4 h-4 border-l-2 border-t-2 border-foreground/30" />
        <div className="absolute -top-px -right-px w-4 h-4 border-r-2 border-t-2 border-foreground/30" />
        <div className="absolute -bottom-px -left-px w-4 h-4 border-l-2 border-b-2 border-foreground/30" />
        <div className="absolute -bottom-px -right-px w-4 h-4 border-r-2 border-b-2 border-foreground/30" />
      </div>

      {/* Technical SVG lines */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full text-foreground/20"
        viewBox="0 0 400 600"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Vertical measurement lines */}
        <TechnicalLine points="M 20 50 L 20 550" delay={0.6} duration={1.5} />
        <TechnicalLine points="M 15 50 L 25 50" delay={0.6} />
        <TechnicalLine points="M 15 550 L 25 550" delay={0.8} />
        
        {/* Horizontal guides */}
        <TechnicalLine points="M 40 100 L 380 100" delay={0.8} duration={1.2} />
        <TechnicalLine points="M 40 300 L 380 300" delay={1.0} duration={1.2} />
        <TechnicalLine points="M 40 500 L 380 500" delay={1.2} duration={1.2} />
        
        {/* Diagonal technical lines */}
        <TechnicalLine points="M 350 80 L 380 50" delay={1.0} />
        <TechnicalLine points="M 350 520 L 380 550" delay={1.2} />
        
        {/* Circuit-like paths */}
        <TechnicalLine
          points="M 60 150 L 60 200 L 120 200 L 120 250"
          delay={1.4}
          duration={0.8}
        />
        <TechnicalLine
          points="M 340 350 L 340 400 L 280 400 L 280 450"
          delay={1.6}
          duration={0.8}
        />
        
        {/* Grid dots */}
        {[150, 250, 350, 450].map((y, i) =>
          [100, 200, 300].map((x, j) => (
            <circle
              key={`dot-${i}-${j}`}
              cx={x}
              cy={y}
              r="2"
              fill="currentColor"
              opacity="0.3"
              style={{
                animation: `fadeInDot 0.3s ease-out ${1.5 + (i * 3 + j) * 0.05}s forwards`,
                opacity: 0,
              }}
            />
          ))
        )}
      </svg>

      {/* ASCII Matrix Block - Top Right */}
      <div
        ref={(el) => setBlockRef(el, 0)}
        className="absolute top-16 right-8 font-mono text-[8px] text-foreground/40 leading-none opacity-0 select-none"
      >
        <pre className="whitespace-pre">{ASCII_BLOCKS[0].content}</pre>
        <div className="mt-2 text-[7px] text-foreground/25 tracking-widest">
          <ScrambleText text="SYS.MATRIX.v2.1" delay={1.5} />
        </div>
      </div>

      {/* Circuit Block - Middle */}
      <div
        ref={(el) => setBlockRef(el, 1)}
        className="absolute top-1/3 right-16 font-mono text-[9px] text-foreground/35 leading-none opacity-0 select-none"
      >
        <pre className="whitespace-pre">{ASCII_BLOCKS[1].content}</pre>
      </div>

      {/* Data Block - Lower */}
      <div
        ref={(el) => setBlockRef(el, 2)}
        className="absolute bottom-1/4 right-12 font-mono text-[8px] text-foreground/30 leading-tight opacity-0 select-none"
      >
        <pre className="whitespace-pre">{ASCII_BLOCKS[2].content}</pre>
      </div>

      {/* Coordinates display */}
      <div
        ref={coordsRef}
        className="absolute bottom-20 left-8 font-mono text-[7px] text-foreground/25 space-y-1 select-none"
      >
        {COORD_LINES.map((line, i) => (
          <div key={i} data-coord className="tracking-wider">
            {line}
          </div>
        ))}
      </div>

      {/* Binary data stream */}
      <div className="absolute top-1/2 left-12 -translate-y-1/2 font-mono text-[6px] text-foreground/15 select-none">
        <DataStream />
      </div>

      {/* Status indicators */}
      <div className="absolute top-8 left-8 font-mono text-[6px] text-foreground/20 space-y-2 select-none">
        <TypeWriter
          lines={[
            ">>> INIT_SEQUENCE",
            ">>> LOAD_MODULES",
            ">>> RENDER_COMPLETE",
            ">>> STATUS: ACTIVE",
          ]}
          delay={2}
        />
      </div>

      {/* Large ASCII art element */}
      <div className="absolute bottom-8 right-8 font-mono text-[5px] text-foreground/10 leading-none select-none opacity-0 animate-[fadeIn_1s_ease-out_2.5s_forwards]">
        <pre className="whitespace-pre">{`
    ████████╗███████╗ ██████╗██╗  ██╗
    ╚══██╔══╝██╔════╝██╔════╝██║  ██║
       ██║   █████╗  ██║     ███████║
       ██║   ██╔══╝  ██║     ██╔══██║
       ██║   ███████╗╚██████╗██║  ██║
       ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝
`}</pre>
      </div>

      {/* Animated crosshair */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 opacity-0"
        style={{ animation: "fadeIn 0.5s ease-out 2s forwards" }}
      >
        <svg className="w-full h-full text-foreground/15" viewBox="0 0 64 64">
          <line x1="32" y1="0" x2="32" y2="24" stroke="currentColor" strokeWidth="0.5" />
          <line x1="32" y1="40" x2="32" y2="64" stroke="currentColor" strokeWidth="0.5" />
          <line x1="0" y1="32" x2="24" y2="32" stroke="currentColor" strokeWidth="0.5" />
          <line x1="40" y1="32" x2="64" y2="32" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="32" cy="32" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle
            cx="32"
            cy="32"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.3"
            strokeDasharray="4 4"
            className="animate-[spin_20s_linear_infinite]"
          />
        </svg>
      </div>

      {/* Glitch overlay effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          animation: "glitchFlicker 8s ease-in-out infinite 3s",
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(var(--foreground-rgb), 0.01) 2px, rgba(var(--foreground-rgb), 0.01) 4px)",
        }}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInDot {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 0.3;
            transform: scale(1);
          }
        }
        @keyframes glitchFlicker {
          0%, 90%, 100% {
            opacity: 0;
          }
          92%, 94%, 96% {
            opacity: 0.3;
          }
          93%, 95% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
