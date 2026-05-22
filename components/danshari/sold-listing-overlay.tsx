import { cn } from "@/lib/utils"

/** Visually dims listing thumbnails when an item is marked sold. */
export function soldListingImageToneClass(sold: boolean): string {
  return sold ? "grayscale brightness-[0.88] opacity-[0.72]" : ""
}

export function SoldListingOverlay({
  sold,
  claimants = [],
}: {
  sold: boolean
  /** Usernames who raised a hand; shown under “Sold” when present. */
  claimants?: string[]
}) {
  if (!sold) return null
  const raised = claimants.filter((n) => typeof n === "string" && n.trim().length > 0)
  return (
    <>
      <div
        className="absolute inset-0 z-[5] bg-background/35 pointer-events-none"
        aria-hidden
      />
      <div className="absolute inset-0 z-[6] flex items-center justify-center pointer-events-none p-2">
        <span
          className={cn(
            "flex max-w-full flex-col items-center gap-0.5 rounded-md border border-border bg-card/95 px-2.5 py-1 shadow-sm",
            "text-xs text-foreground",
          )}
        >
          <span className="font-semibold uppercase tracking-wider">Sold</span>
          {raised.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="max-w-full truncate font-medium text-muted-foreground grayscale"
            >
              <span aria-hidden>✋ </span>
              {name}
            </span>
          ))}
        </span>
      </div>
    </>
  )
}
