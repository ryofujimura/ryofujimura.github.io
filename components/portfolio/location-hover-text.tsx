"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"

type LocationHoverTextProps = {
  /** Default words shown (e.g. "Irvine", ", ", "CA") */
  defaultWords: string[]
  /** Hover words shown (e.g. "Open", " to ", "relocate") */
  hoverWords: string[]
  className?: string
  /** On touch devices, tap toggles to "Open to relocate" and back. */
  toggleOnTap?: boolean
}

/**
 * Renders location text: hover flips to alternate phrase (e.g. "Open to relocate").
 * With toggleOnTap, tap on touch devices toggles between default and hover text.
 */
export function LocationHoverText({
  defaultWords,
  hoverWords,
  className,
  toggleOnTap = false,
}: LocationHoverTextProps) {
  const [tapped, setTapped] = useState(false)
  const toggle = useCallback(() => setTapped((t) => !t), [])
  const pairs = defaultWords.map((d, i) => [d, hoverWords[i] ?? ""] as const)
  const showHover = tapped

  return (
    <span
      role={toggleOnTap ? "button" : undefined}
      tabIndex={toggleOnTap ? 0 : undefined}
      onKeyDown={toggleOnTap ? (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), toggle()) : undefined}
      onClick={toggleOnTap ? toggle : undefined}
      className={cn(
        "inline-flex flex-wrap items-center",
        toggleOnTap && "cursor-pointer touch-manipulation min-h-[44px] py-2 px-3 -mx-1 rounded hover:bg-foreground/5 active:bg-foreground/10",
        !toggleOnTap && "group/loc",
        className
      )}
      aria-label={toggleOnTap ? (showHover ? "Open to relocate" : "Irvine, CA – tap for details") : undefined}
    >
      {pairs.map(([defaultWord, hoverWord], i) => (
        <span
          key={i}
          className="location-word inline-block overflow-hidden align-middle leading-none"
          style={{ height: "1.2em" }}
        >
          <span
            className={cn(
              "inline-block transition-transform duration-300 ease-out",
              toggleOnTap && showHover && "-translate-y-1/2",
              !toggleOnTap && "group-hover/loc:-translate-y-1/2"
            )}
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
