"use client"

import { cn } from "@/lib/utils"

/** ASCII-style section headers and decorative blocks — current trend, mobile-friendly */
export function AsciiSectionHeader({
  number,
  title,
  className,
}: {
  number: string
  title: string
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 sm:gap-4 mb-8 sm:mb-12 md:mb-16", className)}>
      <span className="font-mono text-xs sm:text-sm text-accent tabular-nums">
        {number}.
      </span>
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-mono">
        {title}
      </h2>
      <div className="flex-1 min-w-[60px] h-px bg-border ml-0 sm:ml-4" />
      <span className="font-mono text-[10px] sm:text-xs text-muted-foreground/70 hidden sm:inline">
        // {number} —
      </span>
    </div>
  )
}

/** Block-style ASCII border for emphasis — scales on mobile */
export function AsciiBlock({
  children,
  label,
  className,
}: {
  children: React.ReactNode
  label?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "font-mono text-[10px] sm:text-xs border border-foreground/20 p-3 sm:p-4 bg-secondary/30",
        "touch-manipulation min-h-[44px] flex items-center justify-center text-center",
        className
      )}
      role="presentation"
    >
      <span className="text-muted-foreground">
        {label ? `[ ${label} ] ` : ""}
        {children}
      </span>
    </div>
  )
}

/** Hero ASCII welcome line */
export function AsciiHeroLine({ children }: { children: React.ReactNode }) {
  return (
    <pre
      className="font-mono text-[10px] xs:text-xs sm:text-sm text-foreground/60 overflow-x-auto py-1"
      aria-hidden
    >
      <code>&gt; {children}</code>
    </pre>
  )
}

/** Divider line in ASCII style */
export function AsciiDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "font-mono text-[10px] text-muted-foreground/50 overflow-x-hidden",
        className
      )}
      aria-hidden
    >
      — — — — — — — — — — — — — — — — — — — —
    </div>
  )
}
