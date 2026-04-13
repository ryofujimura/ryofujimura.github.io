"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

export function NavHeader() {
  const headerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.1 }
      )
    },
    { scope: headerRef }
  )

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-4 border-b border-border/15 bg-background/60 backdrop-blur-md"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border border-foreground/40 flex items-center justify-center">
          <div className="w-2 h-2 bg-foreground/60" />
        </div>
        <span className="font-sans text-sm font-semibold tracking-tight text-foreground">
          STL_
        </span>
      </div>

      {/* Nav links */}
      <nav className="hidden sm:flex items-center gap-8" aria-label="Main navigation">
        {["Models", "Viewer", "Export"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase hover:text-foreground transition-colors duration-300"
          >
            {item}
          </a>
        ))}
      </nav>

      {/* Status */}
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-foreground/40 animate-pulse" />
        <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
          online
        </span>
      </div>
    </header>
  )
}
