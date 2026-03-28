"use client"

import Link from "next/link"
import { danshariHref } from "@/lib/danshari/paths"
import { useDanshariUser } from "@/lib/danshari/user-context"
import { Button } from "@/components/ui/button"
import { LogOut, Plus, Package } from "lucide-react"

export function DanshariHeader() {
  const { user, logout } = useDanshariUser()

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href={danshariHref()}
          className="flex items-center gap-2 font-semibold text-lg text-foreground"
        >
          <Package className="w-5 h-5 text-primary" />
          <span>Claim</span>
        </Link>

        <div className="flex items-center gap-2">
          {user?.is_admin && (
            <Button asChild variant="ghost" size="sm" className="rounded-xl">
              <Link href={danshariHref("/admin")}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Link>
            </Button>
          )}
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {user?.username}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="rounded-xl text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
