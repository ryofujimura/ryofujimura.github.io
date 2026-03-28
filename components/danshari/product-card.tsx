"use client"

import Link from "next/link"
import { danshariProductHref } from "@/lib/danshari/paths"
import { firstListingImageUrl } from "@/lib/danshari/recommended"
import type { Product } from "@/lib/danshari/types"
import { DanshariMedia } from "@/components/danshari/danshari-media"
import { DanshariTagPills } from "@/components/danshari/tag-pills"
import { Hand } from "lucide-react"

interface ProductCardProps {
  product: Product
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
        <DanshariTagPills tags={product.tags} className="mt-1" />
      </div>
    </Link>
  )
}
