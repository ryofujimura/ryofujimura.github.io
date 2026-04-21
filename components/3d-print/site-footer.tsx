"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const ASCII_ART = `
  _____ _______ _     
 / ____|__   __| |    
| (___    | |  | |    
 \\___ \\   | |  | |    
 ____) |  | |  | |____
|_____/   |_|  |______|
`

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        ".footer-content",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      )
    },
    { scope: footerRef }
  )

  return (
    <footer
      ref={footerRef}
      className="relative w-full border-t border-border/20 mt-20"
    >
      <div className="footer-content max-w-7xl mx-auto px-6 sm:px-10 py-12 flex flex-col md:flex-row items-start justify-between gap-10">
        {/* ASCII art */}
        <pre className="font-mono text-[8px] leading-tight text-muted-foreground/20 select-none" aria-hidden="true">
          {ASCII_ART}
        </pre>

        {/* Info */}
        <div className="flex flex-col gap-4 items-start md:items-end">
          <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/40 uppercase">
            {"// 3d-print.sys"}
          </span>
          <div className="flex items-center gap-4">
            {["GitHub", "Twitter", "Docs"].map((link) => (
              <a
                key={link}
                href="#"
                className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground/40 uppercase hover:text-foreground/60 transition-colors duration-300"
              >
                {link}
              </a>
            ))}
          </div>
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/25 uppercase">
            {"all models stl-compatible / 2026"}
          </span>
        </div>
      </div>

      {/* Bottom technical bar */}
      <div className="border-t border-border/10 px-6 sm:px-10 py-3 flex items-center justify-between">
        <span className="font-mono text-[8px] tracking-[0.3em] text-muted-foreground/20 uppercase">
          {"[end.transmission]"}
        </span>
        <span className="font-mono text-[8px] tracking-[0.3em] text-muted-foreground/20 uppercase">
          {"v2.4.0"}
        </span>
      </div>
    </footer>
  )
}
