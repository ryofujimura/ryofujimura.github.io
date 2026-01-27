"use client"

import { MagneticButton } from "@/components/magnetic-button"
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="py-12 px-6 border-t border-border bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Social links */}
          <div className="flex items-center gap-2">
            <MagneticButton
              as="a"
              href="https://github.com/ryofujimura"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all"
            >
              <Github className="w-5 h-5" />
              <span className="sr-only">GitHub</span>
            </MagneticButton>
            <MagneticButton
              as="a"
              href="https://linkedin.com/in/ryofujimura"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all"
            >
              <Linkedin className="w-5 h-5" />
              <span className="sr-only">LinkedIn</span>
            </MagneticButton>
            <MagneticButton
              as="a"
              href="mailto:ryo.fujimura1@gmail.com"
              className="p-3 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all"
            >
              <Mail className="w-5 h-5" />
              <span className="sr-only">Email</span>
            </MagneticButton>
          </div>

          {/* Credit */}
          <p className="text-sm text-muted-foreground text-center">
            Designed & Built by{" "}
            <span className="text-foreground font-medium">Ryo Fujimura</span>
            <span className="mx-2">·</span>
            <span className="font-mono">{new Date().getFullYear()}</span>
          </p>

          {/* Back to top */}
          <MagneticButton
            onClick={scrollToTop}
            className="group flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </MagneticButton>
        </div>
      </div>
    </footer>
  )
}
