"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Renders `visible text<https://url>` or `visible text</path>` as hyperlinks.
 * Multiple links and plain text can be mixed; newlines are preserved.
 */
const LINK_RE = /([^<]+)<((?:https?:\/\/[^>]+)|(?:\/[^>]+))>/g

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://")
}

export function DanshariDescriptionRich({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  if (!text.includes("<")) {
    return (
      <p className={cn("whitespace-pre-wrap leading-relaxed", className)}>
        {text}
      </p>
    )
  }

  const nodes: ReactNode[] = []
  let last = 0
  const re = new RegExp(LINK_RE.source, "g")
  let match: RegExpExecArray | null
  let key = 0

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index))
    }
    const label = match[1].trim()
    const href = match[2].trim()
    const external = isExternalHref(href)
    nodes.push(
      <a
        key={`link-${key++}`}
        href={href}
        {...(external
          ? { target: "_blank" as const, rel: "noopener noreferrer" }
          : {})}
        className="text-primary font-medium underline underline-offset-2 hover:opacity-90"
      >
        {label}
      </a>
    )
    last = re.lastIndex
  }

  if (last < text.length) {
    nodes.push(text.slice(last))
  }

  return (
    <p className={cn("whitespace-pre-wrap leading-relaxed", className)}>{nodes}</p>
  )
}
