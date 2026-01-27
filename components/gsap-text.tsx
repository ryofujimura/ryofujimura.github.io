"use client"

import React from "react"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface GSAPTextProps {
  children: string
  className?: string
  variant?: "chars" | "words" | "lines" | "scramble"
  delay?: number
  stagger?: number
  duration?: number
  scrub?: boolean
}

export function GSAPText({
  children,
  className = "",
  variant = "chars",
  delay = 0,
  stagger = 0.02,
  duration = 0.8,
  scrub = false,
}: GSAPTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!containerRef.current || hasAnimated.current) return

    const container = containerRef.current
    const text = children

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
        scrollTrigger: scrub
          ? {
              trigger: container,
              start: "top 85%",
              end: "top 30%",
              scrub: 1,
            }
          : {
              trigger: container,
              start: "top 85%",
              toggleActions: "play none none none",
            },
      })
    } else if (variant === "words") {
      container.innerHTML = text
        .split(" ")
        .map(
          (word) =>
            `<span class="inline-block overflow-hidden mr-[0.25em]"><span class="inline-block translate-y-full">${word}</span></span>`
        )
        .join("")

      const words = container.querySelectorAll("span > span")

      gsap.to(words, {
        y: 0,
        duration,
        stagger: stagger * 3,
        delay,
        ease: "power4.out",
        scrollTrigger: scrub
          ? {
              trigger: container,
              start: "top 85%",
              end: "top 30%",
              scrub: 1,
            }
          : {
              trigger: container,
              start: "top 85%",
              toggleActions: "play none none none",
            },
      })
    } else if (variant === "lines") {
      container.innerHTML = `<span class="block overflow-hidden"><span class="block translate-y-full">${text}</span></span>`

      const line = container.querySelector("span > span")

      gsap.to(line, {
        y: 0,
        duration,
        delay,
        ease: "power4.out",
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      })
    } else if (variant === "scramble") {
      const chars = "!<>-_\\/[]{}—=+*^?#_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      let iteration = 0
      const originalText = text

      container.textContent = originalText.split("").map(() => chars[Math.floor(Math.random() * chars.length)]).join("")

      ScrollTrigger.create({
        trigger: container,
        start: "top 85%",
        onEnter: () => {
          const interval = setInterval(() => {
            container.textContent = originalText
              .split("")
              .map((char, index) => {
                if (index < iteration) {
                  return char
                }
                return chars[Math.floor(Math.random() * chars.length)]
              })
              .join("")

            if (iteration >= originalText.length) {
              clearInterval(interval)
            }

            iteration += 1 / 2
          }, 30)
        },
      })
    }

    hasAnimated.current = true

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [children, variant, delay, stagger, duration, scrub])

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

    const paths = svgRef.current.querySelectorAll("path, line, circle, rect, polyline, polygon")

    paths.forEach((path) => {
      const element = path as SVGGeometryElement
      if (element.getTotalLength) {
        const length = element.getTotalLength()
        gsap.set(element, {
          strokeDasharray: length,
          strokeDashoffset: length,
        })
      }
    })

    gsap.to(paths, {
      strokeDashoffset: 0,
      duration,
      delay,
      stagger: 0.1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: svgRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [duration, delay])

  return (
    <div ref={svgRef} className={className}>
      {children}
    </div>
  )
}
