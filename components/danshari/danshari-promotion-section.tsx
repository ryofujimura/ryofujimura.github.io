"use client"

import Link from "next/link"
import { useMemo } from "react"
import { danshariProductHref } from "@/lib/danshari/paths"
import { getListingImagePresentation } from "@/lib/danshari/recommended"
import type { Product } from "@/lib/danshari/types"
import { useDanshariUser } from "@/lib/danshari/user-context"
import { DanshariProductImage } from "@/components/danshari/danshari-product-image"

function PromotionCard({ product }: { product: Product }) {
  const { src, srcSet, placeholderSrc } = getListingImagePresentation(product)
  const msg = product.promotion_message?.trim()

  return (
    <Link
      href={danshariProductHref(product.uid)}
      className="flex h-full min-h-0 gap-3 sm:gap-4 rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative w-[5.25rem] h-[5.25rem] sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-muted">
        <DanshariProductImage
          mode="thumb"
          src={src}
          srcSet={srcSet}
          placeholderSrc={placeholderSrc}
          alt=""
          className="object-cover size-full"
          sizes="(max-width: 640px) 84px, 112px"
        />
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <h3 className="font-medium text-foreground text-sm sm:text-base leading-snug line-clamp-2">
          {product.title}
        </h3>
        {msg ? (
          <p className="text-sm text-muted-foreground mt-1.5 line-clamp-4 whitespace-pre-wrap">
            {msg}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

export function DanshariPromotionSection({ products }: { products: Product[] }) {
  const { user } = useDanshariUser()
  const username = user?.username ?? ""

  const promoted = useMemo(() => {
    if (!username) return []
    return products.filter(
      (p) =>
        Array.isArray(p.promotion_usernames) &&
        p.promotion_usernames.includes(username),
    )
  }, [products, username])

  if (promoted.length === 0) return null

  return (
    <section
      aria-labelledby="danshari-promotion-heading"
      className="mb-4 sm:mb-5"
    >
      <h2
        id="danshari-promotion-heading"
        className="text-[11px] font-medium text-muted-foreground mb-2 sm:mb-3"
      >
        Promotion
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {promoted.map((product) => (
          <PromotionCard key={product.uid} product={product} />
        ))}
      </div>
    </section>
  )
}
