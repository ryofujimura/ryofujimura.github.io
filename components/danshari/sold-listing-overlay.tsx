import { cn } from "@/lib/utils"

/** Visually dims listing thumbnails when an item is marked sold. */
export function soldListingImageToneClass(sold: boolean): string {
  return sold ? "grayscale brightness-[0.88] opacity-[0.72]" : ""
}

export function SoldListingOverlay({ sold }: { sold: boolean }) {
  if (!sold) return null
  return (
    <>
      <div
        className="absolute inset-0 z-[5] bg-background/35 pointer-events-none"
        aria-hidden
      />
      <div className="absolute inset-0 z-[6] flex items-center justify-center pointer-events-none p-2">
        <span
          className={cn(
            "rounded-md border border-border bg-card/95 px-2.5 py-1",
            "text-xs font-semibold uppercase tracking-wider text-foreground shadow-sm",
          )}
        >
          Sold
        </span>
      </div>
    </>
  )
}
