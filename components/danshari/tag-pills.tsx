"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

type Size = "sm" | "md"

export function DanshariTagPills({
  tags,
  className,
  size = "md",
  filterHref,
  activeTag,
}: {
  tags: string[]
  className?: string
  size?: Size
  /** When set, each pill links to the tag-filtered catalog (e.g. home with `?tag=`). */
  filterHref?: (tag: string) => string
  /** Highlights the pill equal to this tag (e.g. current `?tag=` on the home page). */
  activeTag?: string | null
}) {
  if (tags.length === 0) return null

  const pillClass = (t: string) =>
    cn(
      "inline-flex items-center rounded-full font-medium transition-colors",
      size === "sm"
        ? "px-2 py-0.5 text-[10px] uppercase tracking-wide"
        : "px-2 py-0.5 text-xs",
      filterHref
        ? "bg-secondary text-secondary-foreground hover:bg-primary/15 hover:text-foreground"
        : "bg-secondary text-secondary-foreground",
      activeTag === t &&
        "bg-primary/20 text-foreground ring-1 ring-primary/45",
    )

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((t, i) =>
        filterHref ? (
          <Link
            key={`${t}-${i}`}
            href={filterHref(t)}
            className={pillClass(t)}
            scroll
          >
            {t}
          </Link>
        ) : (
          <span key={`${t}-${i}`} className={pillClass(t)}>
            {t}
          </span>
        ),
      )}
    </div>
  )
}
