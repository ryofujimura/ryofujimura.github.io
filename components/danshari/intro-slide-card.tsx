"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { DanshariAdminUserActivity } from "@/components/danshari/danshari-admin-user-activity"
import { Button } from "@/components/ui/button"
import { useDanshariUser } from "@/lib/danshari/user-context"
import { cn } from "@/lib/utils"

const INTRO_COPY =
  "このウェブは凌が2026年のうちに手放してもいいかもと思ってるものたち。中には高価なものもあるかも。欲しければ青いボタンで手🖐️をあげてね。質問があればコメントを書いてね。買いたければ値段も書いてね。あ、早いものあちではないです。あと確実に手放すわけでもないです。ご了承。"

export function DanshariIntroSlideCard() {
  const [open, setOpen] = useState(true)
  const { user } = useDanshariUser()

  return (
    <div className="border-b border-border bg-background/90">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 flex flex-col items-center pt-1 pb-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="danshari-intro-slide"
          aria-label={open ? "説明を閉じる" : "説明を表示"}
        >
          <ChevronDown
            className={cn(
              "h-5 w-5 transition-transform duration-300 ease-out",
              open && "rotate-180"
            )}
            aria-hidden
          />
        </Button>

        <div
          className={cn(
            "grid w-full transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div id="danshari-intro-slide" className="min-h-0 overflow-hidden">
            <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm px-4 py-3 mb-3 mt-1 text-sm leading-relaxed">
              {INTRO_COPY}
            </div>
            {user?.is_admin ? (
              <div className="w-full pb-3">
                <DanshariAdminUserActivity compact />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
