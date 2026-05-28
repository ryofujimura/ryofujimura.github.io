"use client"

import { useCallback, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { SHOWCASE_CATEGORIES } from "@/components/portfolio/showcase-data"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function ShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const categoryIndexRef = useRef(0)
  const isAnimatingRef = useRef(false)

  const [activeIndex, setActiveIndex] = useState(0)
  const isMobile = useIsMobile()

  const setSlideRef = useCallback((index: number, el: HTMLDivElement | null) => {
    slideRefs.current[index] = el
  }, [])

  const setRowRef = useCallback((index: number, el: HTMLDivElement | null) => {
    rowRefs.current[index] = el
  }, [])

  const animateToCategory = useCallback((nextIndex: number) => {
    const currentIndex = categoryIndexRef.current
    if (
      nextIndex === currentIndex ||
      isAnimatingRef.current ||
      nextIndex < 0 ||
      nextIndex >= SHOWCASE_CATEGORIES.length
    ) {
      return
    }

    isAnimatingRef.current = true
    const direction = nextIndex > currentIndex ? 1 : -1
    const currentSlide = slideRefs.current[currentIndex]
    const nextSlide = slideRefs.current[nextIndex]

    if (nextSlide) {
      gsap.set(nextSlide, {
        xPercent: direction * 100,
        autoAlpha: 0,
        pointerEvents: "none",
      })
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut", duration: 0.65 },
      onComplete: () => {
        if (currentSlide) {
          gsap.set(currentSlide, { pointerEvents: "none" })
        }
        if (nextSlide) {
          gsap.set(nextSlide, { pointerEvents: "auto" })
        }
        const row = rowRefs.current[nextIndex]
        if (row) row.scrollLeft = 0
        categoryIndexRef.current = nextIndex
        setActiveIndex(nextIndex)
        isAnimatingRef.current = false
      },
    })

    if (currentSlide) {
      tl.to(
        currentSlide,
        { xPercent: direction * -100, autoAlpha: 0, duration: 0.55 },
        0
      )
    }

    if (nextSlide) {
      tl.to(nextSlide, { xPercent: 0, autoAlpha: 1, duration: 0.55 }, 0)
      tl.fromTo(
        nextSlide.querySelectorAll(".project-card"),
        { x: 48, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.07, duration: 0.5, ease: "power2.out" },
        0.12
      )
    }
  }, [])

  const selectCategory = useCallback(
    (index: number) => {
      if (index !== categoryIndexRef.current) {
        setActiveIndex(index)
        animateToCategory(index)
      }
    },
    [animateToCategory]
  )

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      slideRefs.current.forEach((slide, i) => {
        if (!slide) return
        if (i === 0) {
          gsap.set(slide, { xPercent: 0, autoAlpha: 1, pointerEvents: "auto" })
        } else {
          gsap.set(slide, { xPercent: 100, autoAlpha: 0, pointerEvents: "none" })
        }
      })

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
    { scope: sectionRef, dependencies: [] }
  )

  return (
    <section
      ref={sectionRef}
      id="showcase"
      aria-labelledby="showcase-title"
      className="relative py-20 sm:py-28 overflow-hidden bg-background text-foreground border-t border-foreground/10"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 sm:mb-14">
          <p className="showcase-intro font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-4">
            {"// SELECTED_WORK"}
          </p>
          <h2
            id="showcase-title"
            className="showcase-intro font-mono text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase text-foreground"
          >
            Showcase
          </h2>
          <p className="showcase-intro mt-4 max-w-lg font-mono text-xs sm:text-sm leading-relaxed text-muted-foreground">
            Hover a category to switch tracks. Scroll horizontally within each row to browse projects.
          </p>
        </header>

        <nav
          className="showcase-intro flex flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-12"
          aria-label="Showcase categories"
        >
          {SHOWCASE_CATEGORIES.map((cat, index) => (
            <CategoryNavButton
              key={cat.id}
              label={cat.label}
              isActive={activeIndex === index}
              onSelect={() => selectCategory(index)}
              allowClick={isMobile}
            />
          ))}
        </nav>

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
                    <div
                      className="relative aspect-[4/3] overflow-hidden transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      style={{ background: project.image }}
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent"
                        aria-hidden
                      />
                    </div>
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
  allowClick,
}: {
  label: string
  isActive: boolean
  onSelect: () => void
  allowClick?: boolean
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
      onMouseEnter={allowClick ? undefined : onSelect}
      onFocus={onSelect}
      onClick={allowClick ? onSelect : undefined}
    >
      {label}
    </button>
  )
}
