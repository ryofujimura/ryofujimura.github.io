"use client"

import Link from "next/link"
import { memo } from "react"
import { danshariProductHref, danshariTagFilterHref } from "@/lib/danshari/paths"
import { getListingImagePresentation } from "@/lib/danshari/recommended"
import type { Product } from "@/lib/danshari/types"
import { DanshariProductImage } from "@/components/danshari/danshari-product-image"
import { DanshariTagPills } from "@/components/danshari/tag-pills"
import {
  SoldListingOverlay,
  soldListingImageToneClass,
} from "@/components/danshari/sold-listing-overlay"
import { cn } from "@/lib/utils"
import { Hand } from "lucide-react"

interface ProductCardProps {
  product: Product
  /** Highlights this tag on pills when the home list is filtered to it. */
  activeTag?: string | null
}

function DanshariProductCardInner({ product, activeTag }: ProductCardProps) {
  const { src, srcSet, placeholderSrc } = getListingImagePresentation(product)
  const hasTwoPhotos =
    Boolean(product.image_url?.trim()) &&
    Boolean(product.image_url_secondary?.trim())
  const sold = Boolean(product.sold)

  const cardTop = (
    <>
      <div className="relative aspect-square overflow-hidden bg-muted">
        <DanshariProductImage
          mode="thumb"
          src={src}
          srcSet={srcSet}
          placeholderSrc={placeholderSrc}
          alt={product.title}
          className={cn(
            "object-cover transition-transform duration-300",
            sold
              ? soldListingImageToneClass(true)
              : "group-hover:scale-105",
          )}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <SoldListingOverlay sold={sold} claimants={product.claimants} />
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
      <div className="p-3 pb-2">
        <h3 className="font-medium text-foreground line-clamp-1 text-sm sm:text-base">
          {product.title}
        </h3>
      </div>
    </>
  )

  return (
    <div
      className={cn(
        "bg-card rounded-2xl overflow-hidden shadow-sm transition-shadow",
        sold ? "opacity-95" : "hover:shadow-md",
      )}
    >
      {sold ? (
        <div
          className="block cursor-default"
          aria-label={`${product.title} — sold`}
        >
          {cardTop}
        </div>
      ) : (
        <Link
          href={danshariProductHref(product.uid)}
          className="group block"
        >
          {cardTop}
        </Link>
      )}
      <div className="px-3 pb-3">
        <DanshariTagPills
          tags={product.tags}
          filterHref={danshariTagFilterHref}
          activeTag={activeTag}
        />
      </div>
    </div>
  )
}

export const DanshariProductCard = memo(DanshariProductCardInner)
