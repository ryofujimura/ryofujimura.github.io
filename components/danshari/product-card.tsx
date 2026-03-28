"use client"

import Link from "next/link"
import { danshariProductHref } from "@/lib/danshari/paths"
import type { Product } from "@/lib/danshari/types"
import { DanshariMedia } from "@/components/danshari/danshari-media"
import { Hand } from "lucide-react"

interface ProductCardProps {
  product: Product
}

/** Primary listing image: first photo field, or second if primary is empty. */
function firstListingImageUrl(product: Product): string {
  const a = product.image_url?.trim() ?? ""
  const b = product.image_url_secondary?.trim() ?? ""
  return a || b
}

export function DanshariProductCard({ product }: ProductCardProps) {
  const thumbSrc = firstListingImageUrl(product)
  const hasTwoPhotos =
    Boolean(product.image_url?.trim()) &&
    Boolean(product.image_url_secondary?.trim())

  return (
    <Link
      href={danshariProductHref(product.uid)}
      className="group block bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <DanshariMedia
          src={thumbSrc}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {hasTwoPhotos ? (
          <div className="absolute bottom-2 left-2 z-10 rounded-md bg-background/85 px-1.5 py-0.5 text-[10px] font-medium text-foreground backdrop-blur-sm border border-border/60">
            2 photos
          </div>
        ) : null}
        {product.claimants.length > 0 ? (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
            <Hand className="w-3 h-3 shrink-0" aria-hidden />
            {product.claimants.length}
          </div>
        ) : null}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-foreground line-clamp-1 text-sm sm:text-base">
          {product.title}
        </h3>
        <span className="inline-block mt-1 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
          {product.tag}
        </span>
      </div>
    </Link>
  )
}
