"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export function DanshariTagEditor({
  tags,
  onChange,
  className,
}: {
  tags: string[]
  onChange: (next: string[]) => void
  className?: string
}) {
  const [draft, setDraft] = useState("")

  const addFromDraft = () => {
    const v = draft.trim()
    if (!v) return
    if (tags.includes(v)) {
      setDraft("")
      return
    }
    onChange([...tags, v])
    setDraft("")
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-xs font-medium text-muted-foreground">Tags</label>
      <div className="rounded-xl border border-input bg-background px-2 py-2 min-h-[2.5rem] focus-within:ring-2 focus-within:ring-ring">
        <div className="flex flex-wrap gap-1.5 mb-2 empty:mb-0">
          {tags.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="inline-flex items-center gap-0.5 pl-2.5 pr-1 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
            >
              <span className="max-w-[12rem] truncate">{t}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-6 shrink-0 rounded-full hover:bg-background/80"
                onClick={() => onChange(tags.filter((_, j) => j !== i))}
                aria-label={`Remove tag ${t}`}
              >
                <X className="size-3.5" />
              </Button>
            </span>
          ))}
        </div>
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addFromDraft()
            } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
              onChange(tags.slice(0, -1))
            }
          }}
          className="h-9 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
          placeholder="Type a tag, press Enter"
        />
      </div>
      <p className="text-[10px] text-muted-foreground">
        Press <kbd className="rounded bg-muted px-1 py-px font-mono">Enter</kbd> to add each tag.
      </p>
    </div>
  )
}
