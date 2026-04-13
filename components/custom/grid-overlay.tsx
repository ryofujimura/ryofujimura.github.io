"use client"

export function GridOverlay() {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none" aria-hidden="true">
      {/* Technical border frame */}
      <div className="absolute inset-4 border border-border/30" />
      <div className="absolute inset-8 border border-border/10" />

      {/* Corner markers */}
      <CornerMark position="top-left" />
      <CornerMark position="top-right" />
      <CornerMark position="bottom-left" />
      <CornerMark position="bottom-right" />

      {/* Coordinate labels */}
      <span className="absolute top-5 left-10 font-mono text-[9px] tracking-[0.3em] text-muted-foreground/30 uppercase">
        {"// sys.viewport.origin"}
      </span>
      <span className="absolute bottom-5 right-10 font-mono text-[9px] tracking-[0.3em] text-muted-foreground/30 uppercase">
        {"[x:1920 y:1080 z:0]"}
      </span>
      <span className="absolute top-5 right-10 font-mono text-[9px] tracking-[0.3em] text-muted-foreground/30 uppercase">
        {"mesh.count: 03"}
      </span>
      <span className="absolute bottom-5 left-10 font-mono text-[9px] tracking-[0.3em] text-muted-foreground/30 uppercase">
        {"render.fps: 60"}
      </span>

      {/* Vertical scan lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-border/5" />
      <div className="absolute top-0 left-3/4 w-px h-full bg-border/5" />

      {/* Horizontal scan lines */}
      <div className="absolute left-0 top-1/3 w-full h-px bg-border/5" />
      <div className="absolute left-0 top-2/3 w-full h-px bg-border/5" />
    </div>
  )
}

function CornerMark({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const size = 16

  const posClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  }

  const isTop = position.includes("top")
  const isLeft = position.includes("left")

  return (
    <svg
      className={`absolute ${posClasses[position]}`}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      stroke="hsl(0 0% 35%)"
      strokeWidth="0.5"
    >
      {isTop && isLeft && (
        <>
          <line x1="0" y1="0" x2={size} y2="0" />
          <line x1="0" y1="0" x2="0" y2={size} />
        </>
      )}
      {isTop && !isLeft && (
        <>
          <line x1="0" y1="0" x2={size} y2="0" />
          <line x1={size} y1="0" x2={size} y2={size} />
        </>
      )}
      {!isTop && isLeft && (
        <>
          <line x1="0" y1={size} x2={size} y2={size} />
          <line x1="0" y1="0" x2="0" y2={size} />
        </>
      )}
      {!isTop && !isLeft && (
        <>
          <line x1="0" y1={size} x2={size} y2={size} />
          <line x1={size} y1="0" x2={size} y2={size} />
        </>
      )}
    </svg>
  )
}
