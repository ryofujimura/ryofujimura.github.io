"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { runOptimizeAllCatalogImages } from "@/lib/danshari/store"

export function DanshariOptimizeImagesButton() {
  const [busy, setBusy] = useState(false)

  const handleClick = async () => {
    if (
      !window.confirm(
        "Re-optimize every product image? New WebP/JPEG files will be uploaded to Storage and Firestore URLs will be updated. Large catalogs can take several minutes.",
      )
    ) {
      return
    }
    setBusy(true)
    const toastId = toast.loading("Starting catalog image optimization…")
    try {
      const res = await runOptimizeAllCatalogImages((p) => {
        toast.loading(
          `Optimizing ${p.done}/${p.total} · ${p.label}`,
          { id: toastId },
        )
      })
      toast.dismiss(toastId)
      if (res.slotsOptimized === 0 && res.errors.length === 0) {
        toast.message("No remote or data-URL images to optimize.")
        return
      }
      if (res.errors.length > 0) {
        toast.warning(
          `Finished with ${res.errors.length} error(s). ${res.slotsOptimized} slot(s) optimized, ${res.productsTouched} product(s) updated.`,
        )
      } else {
        toast.success(
          `Optimized ${res.slotsOptimized} image slot(s) across ${res.productsTouched} product(s).`,
        )
      }
    } catch (e) {
      toast.dismiss(toastId)
      toast.error(e instanceof Error ? e.message : "Optimization failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="rounded-xl shrink-0"
      onClick={handleClick}
      disabled={busy}
      title="Re-encode all product images and upload optimized versions"
    >
      {busy ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <Sparkles className="size-4 sm:mr-1" aria-hidden />
      )}
      <span className="hidden sm:inline">Optimize images</span>
    </Button>
  )
}
