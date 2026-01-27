"use client"

import { MagneticButton } from "@/components/magnetic-button"
import { AsciiDivider } from "@/components/ascii-banner"
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-border bg-card/50 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="max-w-6xl mx-auto space-y-4">
        <AsciiDivider className="opacity-40" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="flex items-center gap-1 sm:gap-2">
            <MagneticButton
              as="a"
              href="https://github.com/ryofujimura"
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target min-h-[44px] min-w-[44px] flex items-center justify-center p-3 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all"
            >
              <Github className="w-5 h-5" />
              <span className="sr-only">GitHub</span>
            </MagneticButton>
            <MagneticButton
              as="a"
              href="https://linkedin.com/in/ryofujimura"
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target min-h-[44px] min-w-[44px] flex items-center justify-center p-3 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all"
            >
              <Linkedin className="w-5 h-5" />
              <span className="sr-only">LinkedIn</span>
            </MagneticButton>
            <MagneticButton
              as="a"
              href="mailto:ryo.fujimura1@gmail.com"
              className="touch-target min-h-[44px] min-w-[44px] flex items-center justify-center p-3 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all"
            >
              <Mail className="w-5 h-5" />
              <span className="sr-only">Email</span>
            </MagneticButton>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground text-center font-mono">
            &gt; Built by <span className="text-foreground font-medium">Ryo Fujimura</span>
            <span className="mx-1 sm:mx-2">·</span>
            <span>{new Date().getFullYear()}</span>
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
