"use client"

import { useCallback, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  SHOWCASE_CATEGORIES,
  type ShowcaseCategory,
} from "@/components/portfolio/showcase-data"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function ShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const categoryIndexRef = useRef(0)
  const isAnimatingRef = useRef(false)

  const [activeIndex, setActiveIndex] = useState(0)
  const [cursorLabel, setCursorLabel] = useState(SHOWCASE_CATEGORIES[0]?.label ?? "")
  const [cursorVisible, setCursorVisible] = useState(false)
  const isMobile = useIsMobile()

  const activeCategory = SHOWCASE_CATEGORIES[activeIndex] ?? SHOWCASE_CATEGORIES[0]

  const setSlideRef = useCallback((index: number, el: HTMLDivElement | null) => {
    slideRefs.current[index] = el
  }, [])

  const setRowRef = useCallback((index: number, el: HTMLDivElement | null) => {
    rowRefs.current[index] = el
  }, [])

  const animateToCategory = useCallback((nextIndex: number) => {
    const section = sectionRef.current
    const currentIndex = categoryIndexRef.current
    if (
      !section ||
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
    const nextTheme = SHOWCASE_CATEGORIES[nextIndex].theme

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

    tl.to(
      section,
      {
        backgroundColor: nextTheme.bg,
        color: nextTheme.fg,
      },
      0
    )

    if (currentSlide) {
      tl.to(
        currentSlide,
        { xPercent: direction * -100, autoAlpha: 0, duration: 0.55 },
        0
      )
    }

    if (nextSlide) {
      tl.to(
        nextSlide,
        { xPercent: 0, autoAlpha: 1, duration: 0.55 },
        0
      )
      tl.fromTo(
        nextSlide.querySelectorAll(".project-card"),
        { x: 48, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.07, duration: 0.5, ease: "power2.out" },
        0.12
      )
    }

  }, [])

  const selectCategory = useCallback(
    (index: number, label: string) => {
      setCursorLabel(label)
      if (index !== categoryIndexRef.current) {
        animateToCategory(index)
      }
    },
    [animateToCategory]
  )

  useGSAP(
    () => {
      const section = sectionRef.current
      const cursor = cursorRef.current
      if (!section || !cursor) return

      const quickX = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" })
      const quickY = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" })

      gsap.set(cursor, { x: 0, y: 0, scale: 0, autoAlpha: 0 })

      slideRefs.current.forEach((slide, i) => {
        if (!slide) return
        if (i === 0) {
          gsap.set(slide, { xPercent: 0, autoAlpha: 1, pointerEvents: "auto" })
        } else {
          gsap.set(slide, { xPercent: 100, autoAlpha: 0, pointerEvents: "none" })
        }
      })

      const onMove = (e: MouseEvent) => {
        const rect = section.getBoundingClientRect()
        quickX(e.clientX - rect.left)
        quickY(e.clientY - rect.top)
      }

      const onEnter = () => {
        if (window.matchMedia("(pointer: coarse)").matches) return
        setCursorVisible(true)
        gsap.to(cursor, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power2.out" })
      }

      const onLeave = () => {
        setCursorVisible(false)
        gsap.to(cursor, { autoAlpha: 0, scale: 0, duration: 0.2, ease: "power2.in" })
      }

      const coarsePointer = window.matchMedia("(pointer: coarse)").matches
      section.addEventListener("mousemove", onMove)
      if (!coarsePointer) {
        section.addEventListener("mouseenter", onEnter)
        section.addEventListener("mouseleave", onLeave)
      }

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

      return () => {
        section.removeEventListener("mousemove", onMove)
        if (!coarsePointer) {
          section.removeEventListener("mouseenter", onEnter)
          section.removeEventListener("mouseleave", onLeave)
        }
      }
    },
    { scope: sectionRef, dependencies: [] }
  )

  const theme = activeCategory.theme

  return (
    <section
      ref={sectionRef}
      id="showcase"
      aria-labelledby="showcase-title"
      className={cn(
        "relative py-20 sm:py-28 overflow-hidden",
        !isMobile && "cursor-none"
      )}
      style={{
        backgroundColor: theme.bg,
        color: theme.fg,
        borderColor: theme.border,
      }}
    >
      {/* Section-local cursor */}
      <div
        ref={cursorRef}
        className={cn(
          "pointer-events-none absolute top-0 left-0 z-50 -translate-x-1/2 -translate-y-1/2",
          !cursorVisible && "opacity-0"
        )}
        aria-hidden
      >
        <div
          className="flex items-center justify-center rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] whitespace-nowrap"
          style={{
            backgroundColor: theme.cursorBg,
            color: theme.cursorFg,
          }}
        >
          {cursorLabel}
        </div>
      </div>

      <div className="px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto">
        <header className="mb-10 sm:mb-14">
          <p
            className="showcase-intro font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.35em] mb-4"
            style={{ color: theme.muted }}
          >
            {"// SELECTED_WORK"}
          </p>
          <h2
            id="showcase-title"
            className="showcase-intro font-mono text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase"
          >
            Showcase
          </h2>
          <p
            className="showcase-intro mt-4 max-w-lg font-mono text-xs sm:text-sm leading-relaxed"
            style={{ color: theme.muted }}
          >
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
              category={cat}
              isActive={activeIndex === index}
              sectionTheme={theme}
              onSelect={() => selectCategory(index, cat.label)}
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
                    className="project-card group shrink-0 snap-start min-w-[min(85vw,420px)] sm:min-w-[min(42vw,480px)] border"
                    style={{ borderColor: cat.theme.border }}
                  >
                    <div
                      className="relative aspect-[4/3] overflow-hidden transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      style={{ background: project.image }}
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                        aria-hidden
                      />
                    </div>
                    <div className="px-4 py-4 sm:px-5 sm:py-5 border-t" style={{ borderColor: cat.theme.border }}>
                      <p
                        className="font-mono text-[9px] uppercase tracking-[0.25em] mb-2"
                        style={{ color: cat.theme.muted }}
                      >
                        {project.tag}
                      </p>
                      <h3 className="font-mono text-lg sm:text-xl font-bold tracking-tight uppercase">
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
  category,
  isActive,
  sectionTheme,
  onSelect,
  allowClick,
}: {
  category: ShowcaseCategory
  isActive: boolean
  sectionTheme: ShowcaseCategory["theme"]
  onSelect: () => void
  allowClick?: boolean
}) {
  return (
    <button
      type="button"
      className={cn(
        "font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] px-4 py-2.5 border transition-colors duration-300 touch-target",
        isActive ? "font-bold" : "hover:opacity-100 opacity-80"
      )}
      style={{
        color: isActive ? sectionTheme.fg : sectionTheme.muted,
        borderColor: sectionTheme.border,
        backgroundColor: isActive ? `${sectionTheme.fg}12` : "transparent",
      }}
      onMouseEnter={allowClick ? undefined : onSelect}
      onFocus={onSelect}
      onClick={allowClick ? onSelect : undefined}
    >
      {category.label}
    </button>
  )
}
