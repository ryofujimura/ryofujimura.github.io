"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"

interface RevealTextProps {
  text: string
  className?: string
  delay?: number
  as?: "h1" | "h2" | "h3" | "p" | "span"
}

export function RevealText({
  text,
  className,
  delay = 0,
  as: Component = "span",
}: RevealTextProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>()
  const words = text.split(" ")

  return (
    <div ref={ref} className="overflow-hidden">
      <Component className={cn("inline-block", className)}>
        {words.map((word, index) => (
          <span key={index} className="inline-block overflow-hidden mr-[0.25em]">
            <span
              className="inline-block transition-transform duration-700 ease-out"
              style={{
                transform: isVisible ? "translateY(0)" : "translateY(100%)",
                transitionDelay: `${delay + index * 50}ms`,
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </Component>
    </div>
  )
}
