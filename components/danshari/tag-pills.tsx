"use client"

import { cn } from "@/lib/utils"

type Size = "sm" | "md"

export function DanshariTagPills({
  tags,
  className,
  size = "md",
}: {
  tags: string[]
  className?: string
  size?: Size
}) {
  if (tags.length === 0) return null

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((t, i) => (
        <span
          key={`${t}-${i}`}
          className={cn(
            "inline-flex items-center rounded-full bg-secondary text-secondary-foreground font-medium",
            size === "sm"
              ? "px-2 py-0.5 text-[10px] uppercase tracking-wide"
              : "px-2 py-0.5 text-xs",
          )}
        >
          {t}
        </span>
      ))}
    </div>
  )
}
