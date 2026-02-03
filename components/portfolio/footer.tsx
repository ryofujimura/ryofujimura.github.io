"use client"

import { MagneticButton } from "@/components/magnetic-button"
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-border bg-card/50 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <p className="text-xs sm:text-sm text-muted-foreground text-center font-mono">
            &gt; Built by <span className="text-foreground font-medium">Ryo Fujimura </span>
            with Cursor
          </p>

          <MagneticButton
            onClick={scrollToTop}
            className="touch-target group flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>^ back to top</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform shrink-0" />
          </MagneticButton>
        </div>
      </div>
    </footer>
  )
}
