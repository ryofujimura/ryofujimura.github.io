"use client"

import { useDanshariImagePreload } from "@/lib/danshari/image-preload-context"
import { cn } from "@/lib/utils"

function TidyBoxes({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-end justify-center gap-3", className)}
      aria-hidden
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "danshari-preload-box rounded-xl shadow-sm border border-primary/20",
            i === 0 && "h-9 w-9 bg-primary/20",
            i === 1 && "h-11 w-11 bg-accent/35 -mb-1",
            i === 2 && "h-9 w-9 bg-primary/25",
          )}
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </div>
  )
}

function OrbitRing({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "danshari-preload-orbit rounded-full border-2 border-dashed border-primary/25 w-28 h-28 sm:w-32 sm:h-32",
        className,
      )}
      aria-hidden
    />
  )
}

export function DanshariGalleryPreloadFullscreen({
  className,
}: {
  className?: string
}) {
  const { catalogReady, phase, loaded, total } = useDanshariImagePreload()

  const pct =
    total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : null
  const title = !catalogReady
    ? "Gathering the catalog…"
    : phase === "preloading"
      ? total > 0
        ? "Warming up the gallery…"
        : "Preparing…"
      : "Opening the shelf…"

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center bg-background px-6",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy={!catalogReady || phase === "preloading"}
    >
      <div className="relative flex items-center justify-center mb-10">
        <OrbitRing className="absolute opacity-80" />
        <div className="relative z-[1] flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32">
          <TidyBoxes />
        </div>
      </div>
      <p className="text-lg font-medium text-foreground text-center max-w-sm">
        {title}
      </p>
      {catalogReady && phase === "preloading" && total > 0 ? (
        <div className="mt-8 w-full max-w-[220px] space-y-2">
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary/80 transition-[width] duration-300 ease-out"
              style={{ width: `${pct ?? 0}%` }}
            />
          </div>
          <div className="danshari-preload-shimmer h-0.5 rounded-full bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto w-3/4" />
        </div>
      ) : null}
    </div>
  )
}

/** Shown under the login form while the catalog and image cache warm up. */
export function DanshariGalleryPreloadLoginHint() {
  const { catalogReady, phase, loaded, total } = useDanshariImagePreload()

  if (!catalogReady) {
    return (
      <div
        className="mt-4 pt-4 border-t border-border flex flex-col items-center gap-2"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className="inline-block size-2 rounded-full bg-primary/60 motion-safe:animate-pulse"
            aria-hidden
          />
          Connecting to the shelf…
        </div>
      </div>
    )
  }

  if (phase === "preloading" && total > 0) {
    return (
      <div
        className="mt-4 pt-4 border-t border-border flex flex-col items-center gap-3"
        role="status"
        aria-live="polite"
      >
        <div className="relative w-16 h-16 flex items-center justify-center">
          <OrbitRing className="absolute w-14 h-14 opacity-70" />
          <TidyBoxes className="scale-[0.45] gap-1.5" />
        </div>
        <div className="w-full max-w-[200px] h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary/70 transition-[width] duration-300 ease-out"
            style={{
              width: `${Math.min(100, Math.round((loaded / total) * 100))}%`,
            }}
          />
        </div>
      </div>
    )
  }

  if (phase === "ready" && total > 0) {
    return (
      <p className="mt-4 pt-4 border-t border-border text-center text-xs text-muted-foreground">
        Gallery cache is warm — you&apos;re all set after you continue.
      </p>
    )
  }

  return null
}
