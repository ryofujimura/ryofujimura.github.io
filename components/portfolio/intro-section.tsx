"use client"

import { useRef } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

/**
 * IntroSection - Brutalist intro combining hero + about content
 * Uses CSS scroll-snap for paginated reveal on scroll
 */
export function IntroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  return (
    <section
      ref={containerRef}
      className="relative"
      aria-label="Introduction"
    >
      {/* Scroll Snap Container */}
      <div 
        className="snap-container"
        style={{
          scrollSnapType: "y mandatory",
          overflowY: "auto",
          height: "100dvh",
          // Fallback for browsers without dvh support
          minHeight: "100vh",
        }}
      >
        {/* Page 1: Identity */}
        <div 
          className="snap-page relative flex items-center justify-center px-4 sm:px-6"
          style={{
            scrollSnapAlign: "start",
            minHeight: "100dvh",
            // Fallback
            height: "100vh",
          }}
        >
          <div className="w-full max-w-5xl mx-auto">
            {/* Placeholder for identity content */}
            <div className="font-mono text-foreground/30 text-xs uppercase tracking-widest">
              [PAGE 1: IDENTITY]
            </div>
          </div>
        </div>

        {/* Page 2: Data + Action */}
        <div 
          className="snap-page relative flex items-center justify-center px-4 sm:px-6"
          style={{
            scrollSnapAlign: "start",
            minHeight: "100dvh",
            height: "100vh",
          }}
        >
          <div className="w-full max-w-5xl mx-auto">
            {/* Placeholder for data content */}
            <div className="font-mono text-foreground/30 text-xs uppercase tracking-widest">
              [PAGE 2: DATA + ACTION]
            </div>
          </div>
        </div>
      </div>

      {/* Debug: Mobile indicator (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-50 font-mono text-[10px] bg-background/80 border border-foreground/20 px-2 py-1">
          {isMobile ? "MOBILE" : "DESKTOP"}
        </div>
      )}
    </section>
  )
}
