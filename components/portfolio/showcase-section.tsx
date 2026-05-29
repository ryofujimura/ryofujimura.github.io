"use client"

import { useCallback, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { cn } from "@/lib/utils"
import { SHOWCASE_CATEGORIES } from "@/components/portfolio/showcase-data"
import { ShowcaseProjectMedia } from "@/components/portfolio/showcase-project-media"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const SLIDE_DURATION = 0.45

function offscreenX(index: number, pivot: number) {
  return index < pivot ? -100 : 100
}

export function ShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const displayedIndexRef = useRef(0)
  const animTargetRef = useRef<number | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  const [activeIndex, setActiveIndex] = useState(0)

  const setSlideRef = useCallback((index: number, el: HTMLDivElement | null) => {
    slideRefs.current[index] = el
  }, [])

  const setRowRef = useCallback((index: number, el: HTMLDivElement | null) => {
    rowRefs.current[index] = el
  }, [])

  const finalizeSlides = useCallback((active: number) => {
    slideRefs.current.forEach((slide, i) => {
      if (!slide) return
      if (i === active) {
        gsap.set(slide, { xPercent: 0, autoAlpha: 1, pointerEvents: "auto" })
      } else {
        gsap.set(slide, {
          xPercent: offscreenX(i, active),
          autoAlpha: 0,
          pointerEvents: "none",
        })
      }
    })
  }, [])

  const animateToCategory = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex >= SHOWCASE_CATEGORIES.length) return

      const isIdle =
        animTargetRef.current === null && nextIndex === displayedIndexRef.current
      if (isIdle) return

      timelineRef.current?.kill()
      timelineRef.current = null

      const fromIndex = animTargetRef.current ?? displayedIndexRef.current
      if (fromIndex === nextIndex) {
        animTargetRef.current = null
        finalizeSlides(nextIndex)
        return
      }

      animTargetRef.current = nextIndex
      const direction = nextIndex > fromIndex ? 1 : -1
      const fromSlide = slideRefs.current[fromIndex]
      const toSlide = slideRefs.current[nextIndex]

      slideRefs.current.forEach((slide, i) => {
        if (!slide || i === fromIndex || i === nextIndex) return
        gsap.set(slide, {
          xPercent: offscreenX(i, nextIndex),
          autoAlpha: 0,
          pointerEvents: "none",
        })
      })

      if (toSlide) {
        gsap.set(toSlide, {
          xPercent: direction * 100,
          autoAlpha: 0,
          pointerEvents: "none",
        })
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut", duration: SLIDE_DURATION },
        onComplete: () => {
          displayedIndexRef.current = nextIndex
          animTargetRef.current = null
          timelineRef.current = null
          finalizeSlides(nextIndex)
          const row = rowRefs.current[nextIndex]
          if (row) row.scrollLeft = 0
        },
        onInterrupt: () => {
          timelineRef.current = null
        },
      })
      timelineRef.current = tl

      if (fromSlide) {
        tl.to(
          fromSlide,
          { xPercent: direction * -100, autoAlpha: 0, duration: SLIDE_DURATION },
          0
        )
      }

      if (toSlide) {
        tl.to(
          toSlide,
          {
            xPercent: 0,
            autoAlpha: 1,
            pointerEvents: "auto",
            duration: SLIDE_DURATION,
          },
          0
        )
        tl.fromTo(
          toSlide.querySelectorAll(".project-card"),
          { x: 40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.06,
            duration: 0.4,
            ease: "power2.out",
          },
          0.1
        )
      }
    },
    [finalizeSlides]
  )

  const selectCategory = useCallback(
    (index: number) => {
      setActiveIndex(index)
      animateToCategory(index)
    },
    [animateToCategory]
  )

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      finalizeSlides(0)

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

      const firstCards = slideRefs.current[0]?.querySelectorAll(".project-card")
      if (firstCards?.length) {
        gsap.fromTo(
          firstCards,
          { x: 56, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
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
    { scope: sectionRef, dependencies: [finalizeSlides] }
  )

  return (
    <section
      ref={sectionRef}
      id="showcase"
      aria-labelledby="showcase-title"
      className="relative py-20 sm:py-28 overflow-hidden bg-background text-foreground border-t border-foreground/10"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="showcase-intro mb-10 sm:mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-4">
              {"// SELECTED_WORK"}
            </p>
            <h2
              id="showcase-title"
              className="font-mono text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase text-foreground"
            >
              Showcase
            </h2>
          </div>

          <nav
            className="flex flex-wrap gap-2 sm:gap-3 sm:justify-end"
            aria-label="Showcase categories"
          >
            {SHOWCASE_CATEGORIES.map((cat, index) => (
              <CategoryNavButton
                key={cat.id}
                label={cat.label}
                isActive={activeIndex === index}
                onSelect={() => selectCategory(index)}
              />
            ))}
          </nav>
        </header>

        <div ref={trackRef} className="relative min-h-[420px] sm:min-h-[480px]">
          {SHOWCASE_CATEGORIES.map((cat, slideIndex) => (
            <div
              key={cat.id}
              ref={(el) => setSlideRef(slideIndex, el)}
              className="absolute inset-0"
              aria-hidden={activeIndex !== slideIndex}
            >
              <div
                ref={(el) => setRowRef(slideIndex, el)}
                className={cn(
                  "flex flex-row gap-4 sm:gap-6 overflow-x-auto pb-4",
                  "snap-x snap-mandatory scroll-smooth",
                  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                )}
              >
                {cat.projects.map((project) => (
                  <article
                    key={project.id}
                    className="project-card group shrink-0 snap-start min-w-[min(85vw,420px)] sm:min-w-[min(42vw,480px)] border border-foreground/15 bg-background/80 backdrop-blur-sm"
                  >
                    <ShowcaseProjectMedia
                      project={project}
                      isActiveCategory={activeIndex === slideIndex}
                    />
                    <div className="px-4 py-4 sm:px-5 sm:py-5 border-t border-foreground/15">
                      <p className="font-mono text-[9px] uppercase tracking-[0.25em] mb-2 text-muted-foreground">
                        {project.tag}
                      </p>
                      <h3 className="font-mono text-lg sm:text-xl font-bold tracking-tight uppercase text-foreground">
                        {project.title}
                      </h3>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoryNavButton({
  label,
  isActive,
  onSelect,
}: {
  label: string
  isActive: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      className={cn(
        "font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] px-4 py-2.5 border touch-target",
        "transition-[color,background-color,border-color,box-shadow] duration-75 ease-out",
        isActive
          ? "font-bold border-foreground text-foreground bg-foreground/5 shadow-[3px_3px_0_0_var(--foreground)]"
          : "border-foreground/20 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
      )}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onSelect}
    >
      {label}
    </button>
  )
}
