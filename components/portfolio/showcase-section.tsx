"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { useDeferredShowcaseMedia } from "@/hooks/use-deferred-showcase-media"
import { scheduleScrollTriggerRefresh } from "@/lib/gsap-scroll-trigger"
import { cn } from "@/lib/utils"
import { SHOWCASE_PROJECTS } from "@/components/portfolio/showcase-data"
import { ShowcaseProjectMedia } from "@/components/portfolio/showcase-project-media"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function ShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const mediaEnabled = useDeferredShowcaseMedia()

  useEffect(() => {
    if (mediaEnabled) scheduleScrollTriggerRefresh()
  }, [mediaEnabled])

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      gsap.fromTo(
        ".showcase-intro",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      )

      const cards = section.querySelectorAll(".project-card")
      if (cards.length) {
        gsap.fromTo(
          cards,
          { x: 56, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        )
      }
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      id="showcase"
      aria-labelledby="showcase-title"
      className="relative py-20 sm:py-28 overflow-hidden bg-background text-foreground border-t border-foreground/10"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="showcase-intro mb-10 sm:mb-14">
          <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-4">
            {"// SELECTED_WORK"}
          </p>
          <h2
            id="showcase-title"
            className="font-mono text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase text-foreground"
          >
            Showcase
          </h2>
        </header>

        <div
          ref={rowRef}
          className={cn(
            "showcase-intro flex flex-row items-start gap-4 sm:gap-6 overflow-x-auto pb-4",
            "snap-x snap-mandatory scroll-smooth",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          )}
        >
          {SHOWCASE_PROJECTS.map((project) => (
            <article
              key={`${project.categoryId}-${project.id}`}
              className="project-card shrink-0 snap-start min-w-[min(72vw,340px)] sm:min-w-[min(32vw,380px)] overflow-hidden border border-foreground/15 select-none"
              onContextMenu={(event) => event.preventDefault()}
            >
              <ShowcaseProjectMedia
                project={project}
                mediaKey={`${project.categoryId}-${project.id}`}
                mediaEnabled={mediaEnabled}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
