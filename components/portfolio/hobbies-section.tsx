"use client"

import { AnimatedSection } from "@/components/animated-section"
import { GSAPText, GSAPSVG } from "@/components/gsap-text"

const hobbies = [
  { id: "HB-01", label: "3D PRINTING", tag: "ADDITIVE", ascii: "  ╭───╮\n  │▣▣▣│\n  │▣ ▣│\n  ╰───╯" },
  { id: "HB-02", label: "PHOTOGRAPHY", tag: "CAPTURE", ascii: "  ◉───◉\n   \\ │ /\n    \\│/\n     ▾" },
  { id: "HB-03", label: "CAR", tag: "MECHANICAL", ascii: "  ┌─○─○─┐\n  │     │\n  └──▬──┘" },
  { id: "HB-04", label: "MOTORCYCLE", tag: "MECHANICAL", ascii: "   ○  ○\n    \\/\n   ─▬─" },
  { id: "HB-05", label: "TENNIS", tag: "RACQUET", ascii: "   ╲│╱\n    ●\n   ╱│╲" },
  { id: "HB-06", label: "GOLF", tag: "PRECISION", ascii: "    │\n    ●\n   ╱ ╲" },
  { id: "HB-07", label: "PICKLEBALL", tag: "COURT", ascii: "  ┌─┬─┐\n  ├─┼─┤\n  └─┴─┘" },
  { id: "HB-08", label: "ARCHITECTURE", tag: "BRUTALIST", ascii: "  ┏━┓ ┏━┓\n  ┃ ┃ ┃ ┃\n  ┗━┛ ┗━┛" },
]

/** Technical grid SVG — blueprint / brutalist line field */
function TechnicalGridSVG() {
  return (
    <svg viewBox="0 0 320 400" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="0.4">
      {/* Horizontal construction lines */}
      {Array.from({ length: 24 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={16 + i * 16} x2={320} y2={16 + i * 16} strokeDasharray="3 4" />
      ))}
      {/* Vertical construction lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <line key={`v${i}`} x1={16 + i * 16} y1={0} x2={16 + i * 16} y2={400} strokeDasharray="3 4" />
      ))}
      {/* Diagonal cross-hatch */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`d1${i}`} x1={i * 40} y1={0} x2={i * 40 + 160} y2={400} strokeDasharray="2 6" />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`d2${i}`} x1={320 - i * 40} y1={0} x2={160 - i * 40} y2={400} strokeDasharray="2 6" />
      ))}
      {/* Solid brutalist frames */}
      <rect x={24} y={32} width={120} height={80} />
      <rect x={176} y={32} width={120} height={80} />
      <rect x={24} y={136} width={120} height={80} />
      <rect x={176} y={136} width={120} height={80} />
      <polygon points="160,240 240,320 80,320" />
      <circle cx={160} cy={360} r={24} />
      <circle cx={160} cy={360} r={8} />
    </svg>
  )
}

/** Per-hobby micro SVG — technical icon */
function HobbyIconSVG({ variant }: { variant: number }) {
  const paths: Record<number, React.ReactNode> = {
    0: (
      <>
        <rect x={8} y={8} width={24} height={24} strokeDasharray="2 2" />
        <path d="M12 20 L20 12 L28 20 L20 28 Z" />
        <line x1={20} y1={12} x2={20} y2={28} />
        <line x1={12} y1={20} x2={28} y2={20} />
      </>
    ),
    1: (
      <>
        <circle cx={22} cy={18} r={10} />
        <path d="M8 32 L16 24 L28 24 L36 32" />
        <line x1={22} y1={8} x2={22} y2={12} strokeDasharray="1 1" />
        <line x1={12} y1={18} x2={16} y2={18} strokeDasharray="1 1" />
      </>
    ),
    2: (
      <>
        <rect x={6} y={14} width={32} height={16} rx={2} />
        <circle cx={12} cy={28} r={4} />
        <circle cx={32} cy={28} r={4} />
        <line x1={14} y1={24} x2={30} y2={24} />
      </>
    ),
    3: (
      <>
        <circle cx={12} cy={12} r={5} />
        <circle cx={32} cy={12} r={5} />
        <path d="M17 12 L23 12 L23 28 L17 28" />
        <line x1={20} y1={12} x2={20} y2={28} strokeDasharray="1 2" />
      </>
    ),
    4: (
      <>
        <line x1={22} y1={8} x2={22} y2={32} />
        <ellipse cx={22} cy={12} rx={10} ry={4} />
        <circle cx={22} cy={24} r={3} />
      </>
    ),
    5: (
      <>
        <line x1={22} y1={32} x2={22} y2={10} />
        <path d="M22 10 L28 18 L22 20 L16 18 Z" />
        <circle cx={22} cy={26} r={2} />
      </>
    ),
    6: (
      <>
        <rect x={10} y={10} width={24} height={24} />
        <line x1={22} y1={10} x2={22} y2={34} />
        <line x1={10} y1={22} x2={34} y2={22} />
      </>
    ),
    7: (
      <>
        <rect x={8} y={16} width={12} height={20} />
        <rect x={24} y={16} width={12} height={20} />
        <line x1={8} y1={16} x2={36} y2={16} />
        <line x1={8} y1={36} x2={36} y2={36} />
      </>
    ),
  }
  return (
    <svg viewBox="0 0 44 44" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="0.8">
      {paths[variant % 8] ?? paths[0]}
    </svg>
  )
}

export function HobbiesSection() {
  return (
    <section
      id="hobbies"
      className="relative py-16 sm:py-20 md:py-28 lg:py-36 px-4 sm:px-5 overflow-hidden bg-background border-t border-b border-foreground/10"
    >
      {/* Brutalist grid + registration marks */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, currentColor, currentColor 1px, transparent 1px, transparent 20px)," +
            "repeating-linear-gradient(90deg, currentColor, currentColor 1px, transparent 1px, transparent 20px)",
        }}
      />
      <div className="pointer-events-none absolute top-6 left-4 sm:left-6 w-14 h-14 sm:w-16 sm:h-16 border-2 border-foreground/50" aria-hidden />
      <div className="pointer-events-none absolute top-6 right-4 sm:right-6 w-10 h-10 border border-dashed border-foreground/40" aria-hidden />
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-1 bg-foreground/20" aria-hidden />

      {/* Background technical SVG — draws in on scroll */}
      <GSAPSVG
        className="pointer-events-none absolute inset-0 left-[55%] top-0 w-[45%] max-w-[520px] text-foreground/[0.055] hidden lg:block"
        duration={2.2}
        delay={0.2}
      >
        <TechnicalGridSVG />
      </GSAPSVG>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header — ASCII section label + GSAP title */}
        <div className="mb-12 sm:mb-16 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <pre
              className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.28em] text-muted-foreground whitespace-pre"
              aria-hidden
            >
              {`┌─────────────────────────────────────┐\n│ PERSONAL INDEX · SERIES 05        │\n│ DOMAIN: LEISURE / CRAFT / SPORT   │\n└─────────────────────────────────────┘`}
            </pre>
            <GSAPText
              variant="chars"
              stagger={0.02}
              className="text-[1.85rem] sm:text-4xl md:text-5xl lg:text-[3rem] font-black leading-[0.92] tracking-tighter font-mono"
            >
              HOBBIES &amp; INTERESTS
            </GSAPText>
            <GSAPText
              variant="words"
              delay={0.35}
              className="text-sm sm:text-base text-muted-foreground max-w-lg"
            >
              Off-screen: making, capture, motion, and built form — from additive fabrication to brutalist aesthetics.
            </GSAPText>
          </div>
          {/* ASCII index table */}
          <div className="md:w-[280px] lg:w-[320px] shrink-0">
            <AnimatedSection delay={80}>
              <pre
                className="font-mono text-[9px] xs:text-[10px] sm:text-[11px] text-foreground/80 bg-secondary/40 border border-foreground/20 p-3 sm:p-4 overflow-x-auto whitespace-pre"
                aria-hidden
              >
                {`+------+----------------+----------+
| ID   | HOBBY          | TYPE     |
+------+----------------+----------+
| HB01 | 3D_PRINTING    | ADDITIVE |
| HB02 | PHOTOGRAPHY    | CAPTURE  |
| HB03 | CAR            | MECH     |
| HB04 | MOTORCYCLE     | MECH     |
| HB05 | TENNIS         | RACQUET  |
| HB06 | GOLF           | PRECISION|
| HB07 | PICKLEBALL     | COURT    |
| HB08 | ARCHITECTURE   | BRUTALIST|
+------+----------------+----------+`}
              </pre>
            </AnimatedSection>
          </div>
        </div>

        {/* Hobby grid — 4×2 on large, 2×4 on mid, 1 col on small */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {hobbies.map((hobby, index) => (
            <AnimatedSection key={hobby.id} delay={80 + index * 60}>
              <article className="group relative border-2 border-foreground/20 bg-background hover:border-foreground/40 hover:bg-secondary/30 transition-all duration-300 p-4 sm:p-5">
                <div className="absolute -top-[1px] -left-[1px] w-6 h-6 border-t-2 border-l-2 border-foreground/50" aria-hidden />
                <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 text-foreground/60 group-hover:text-accent transition-colors">
                    <GSAPSVG duration={1.2} delay={0.15 + index * 0.05}>
                      <HobbyIconSVG variant={index} />
                    </GSAPSVG>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[10px] xs:text-xs text-muted-foreground/90 mb-1">
                      {hobby.id} · {hobby.tag}
                    </p>
                    <GSAPText
                      variant="lines"
                      delay={0.2 + index * 0.03}
                      className="text-sm sm:text-base font-bold font-mono text-foreground tracking-tight"
                    >
                      {hobby.label}
                    </GSAPText>
                    <pre
                      className="mt-2 font-mono text-[8px] xs:text-[9px] text-foreground/50 whitespace-pre overflow-hidden"
                      aria-hidden
                    >
                      {hobby.ascii}
                    </pre>
                  </div>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>

        {/* Footer line — ASCII note */}
        <AnimatedSection delay={560} className="mt-10 sm:mt-12">
          <pre
            className="font-mono text-[9px] xs:text-[10px] text-muted-foreground/70 border-t border-foreground/10 pt-4 whitespace-pre"
            aria-hidden
          >
            {`// beyond code: fabrication · light · mechanics · form`}
          </pre>
        </AnimatedSection>
      </div>
    </section>
  )
}
