"use client"

import React from "react"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

let refreshScheduled = false
function scheduleScrollTriggerRefresh() {
  if (typeof window === "undefined") return
  if (refreshScheduled) return
  refreshScheduled = true
  // Two RAFs helps after mobile address-bar/layout shifts.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      try {
        ScrollTrigger.refresh()
      } finally {
        refreshScheduled = false
      }
    })
  })
}

interface GSAPTextProps {
  children: string
  className?: string
  variant?: "chars" | "words" | "lines" | "scramble"
  delay?: number
  stagger?: number
  duration?: number
  scrub?: boolean
  /** Run on mount (no ScrollTrigger). Use for hero / above-fold content. */
  immediate?: boolean
}

export function GSAPText({
  children,
  className = "",
  variant = "chars",
  delay = 0,
  stagger = 0.02,
  duration = 0.8,
  scrub = false,
  immediate = false,
}: GSAPTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)
  const scrambleIntervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!containerRef.current || hasAnimated.current) return

    const container = containerRef.current
    const text = children

    const ctx = gsap.context(() => {
      if (variant === "chars") {
        container.innerHTML = text
          .split("")
          .map((char) =>
            char === " "
              ? '<span class="inline-block">&nbsp;</span>'
              : `<span class="inline-block opacity-0 translate-y-full">${char}</span>`
          )
          .join("")

        const chars = container.querySelectorAll("span")

        gsap.to(chars, {
          y: 0,
          opacity: 1,
          duration,
          stagger,
          delay,
          ease: "power4.out",
          ...(immediate
            ? {}
            : {
                scrollTrigger: scrub
                  ? {
                      trigger: container,
                      start: "top 85%",
                      end: "top 30%",
                      scrub: 1,
                      invalidateOnRefresh: true,
                    }
                  : {
                      trigger: container,
                      start: "top 85%",
                      toggleActions: "play none none none",
                      invalidateOnRefresh: true,
                    },
              }),
        })
      } else if (variant === "words") {
        container.innerHTML = text
          .split(" ")
          .map(
            (word) =>
              `<span class="inline-block overflow-hidden mr-[0.25em] pb-[0.12em] -mb-[0.12em]"><span class="inline-block translate-y-full">${word}</span></span>`
          )
          .join("")

        const words = container.querySelectorAll("span > span")

        gsap.to(words, {
          y: 0,
          duration,
          stagger: stagger * 3,
          delay,
          ease: "power4.out",
          ...(immediate
            ? {}
            : {
                scrollTrigger: scrub
                  ? {
                      trigger: container,
                      start: "top 85%",
                      end: "top 30%",
                      scrub: 1,
                      invalidateOnRefresh: true,
                    }
                  : {
                      trigger: container,
                      start: "top 85%",
                      toggleActions: "play none none none",
                      invalidateOnRefresh: true,
                    },
              }),
        })
      } else if (variant === "lines") {
        container.innerHTML = `<span class="block overflow-hidden"><span class="block translate-y-full">${text}</span></span>`

        const line = container.querySelector("span > span")

        gsap.to(line, {
          y: 0,
          duration,
          delay,
          ease: "power4.out",
          ...(immediate
            ? {}
            : {
                scrollTrigger: {
                  trigger: container,
                  start: "top 85%",
                  toggleActions: "play none none none",
                  invalidateOnRefresh: true,
                },
              }),
        })
      } else if (variant === "scramble") {
        const chars = "!<>-_\\/[]{}—=+*^?#_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let iteration = 0
        const originalText = text

        container.textContent = originalText
          .split("")
          .map(() => chars[Math.floor(Math.random() * chars.length)])
          .join("")

        const clearScrambleInterval = () => {
          if (scrambleIntervalRef.current == null) return
          window.clearInterval(scrambleIntervalRef.current)
          scrambleIntervalRef.current = null
        }

        if (immediate) {
          let it = 0
          scrambleIntervalRef.current = window.setInterval(() => {
            container.textContent = originalText
              .split("")
              .map((ch, i) => (i < it ? ch : chars[Math.floor(Math.random() * chars.length)]))
              .join("")
            if (it >= originalText.length) clearScrambleInterval()
            it += 1 / 2
          }, 30)
          return
        }

        ScrollTrigger.create({
          trigger: container,
          start: "top 85%",
          invalidateOnRefresh: true,
          onEnter: () => {
            if (scrambleIntervalRef.current != null) return
            scrambleIntervalRef.current = window.setInterval(() => {
              container.textContent = originalText
                .split("")
                .map((char, index) => {
                  if (index < iteration) return char
                  return chars[Math.floor(Math.random() * chars.length)]
                })
                .join("")

              if (iteration >= originalText.length) clearScrambleInterval()
              iteration += 1 / 2
            }, 30)
          },
        })
      }
    }, container)

    hasAnimated.current = true

    if (!immediate) {
      scheduleScrollTriggerRefresh()
    }

    return () => {
      if (scrambleIntervalRef.current != null) {
        window.clearInterval(scrambleIntervalRef.current)
        scrambleIntervalRef.current = null
      }
      ctx.revert()
    }
  }, [children, variant, delay, stagger, duration, scrub, immediate])

  return <div ref={containerRef} className={className} />
}

interface GSAPSVGProps {
  children: React.ReactNode
  className?: string
  duration?: number
  delay?: number
}

export function GSAPSVG({ children, className = "", duration = 2, delay = 0 }: GSAPSVGProps) {
  const svgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const root = svgRef.current
    const ctx = gsap.context(() => {
      const paths = root.querySelectorAll("path, line, circle, rect, polyline, polygon")

      paths.forEach((path) => {
        const element = path as SVGGeometryElement
        if (typeof element.getTotalLength === "function") {
          try {
            const length = element.getTotalLength()
            gsap.set(element, {
              strokeDasharray: length,
              strokeDashoffset: length,
            })
          } catch {
            // Skip non-rendered or unsupported SVG elements
          }
        }
      })

      gsap.to(paths, {
        strokeDashoffset: 0,
        duration,
        delay,
        stagger: 0.1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        },
      })
    }, root)

    scheduleScrollTriggerRefresh()

    return () => ctx.revert()
  }, [duration, delay])

  return (
    <div ref={svgRef} className={className}>
      {children}
    </div>
  )
}
