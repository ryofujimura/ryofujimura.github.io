"use client"

import { cn } from "@/lib/utils"

type LocationHoverTextProps = {
  /** Default words shown (e.g. "Irvine", ", ", "CA") */
  defaultWords: string[]
  /** Hover words shown (e.g. "Open", " to ", "relocate") — "down to move anywhere" */
  hoverWords: string[]
  className?: string
}

/**
 * Renders location text with a per-word vertical flip on hover:
 * each word animates vertically to reveal an alternate phrase (e.g. "Open to relocate").
 */
export function LocationHoverText({
  defaultWords,
  hoverWords,
  className,
}: LocationHoverTextProps) {
  const pairs = defaultWords.map((d, i) => [d, hoverWords[i] ?? ""] as const)
  return (
    <span className={cn("group/loc inline-flex flex-wrap items-center", className)}>
      {pairs.map(([defaultWord, hoverWord], i) => (
        <span
          key={i}
          className="location-word inline-block overflow-hidden align-middle leading-none"
          style={{ height: "1.2em" }}
        >
          <span
            className="inline-block transition-transform duration-300 ease-out group-hover/loc:-translate-y-1/2"
            style={{ transform: "translateY(0)" }}
          >
            <span className="block leading-none" style={{ height: "1.2em" }}>
              {defaultWord}
            </span>
            <span className="block leading-none" style={{ height: "1.2em" }}>
              {hoverWord}
            </span>
          </span>
        </span>
      ))}
    </span>
  )
}
