"use client"

import Link from "next/link"
import { memo } from "react"
import { danshariProductHref, danshariTagFilterHref } from "@/lib/danshari/paths"
import { firstListingImageUrl } from "@/lib/danshari/recommended"
import type { Product } from "@/lib/danshari/types"
import { DanshariMedia } from "@/components/danshari/danshari-media"
import { DanshariTagPills } from "@/components/danshari/tag-pills"
import { useInViewOnce } from "@/hooks/use-in-view-once"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { Hand } from "lucide-react"

type Variant = "sidebar" | "below"

function RecommendedCardInner({
  product,
  variant,
}: {
  product: Product
  variant: Variant
}) {
  // Wide prefetch so thumbnails load before slides scroll into view (px only for IO support).
  const { ref: inViewRef, visible } = useInViewOnce("400px")
  const thumb = firstListingImageUrl(product)
  const isSidebar = variant === "sidebar"

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden shadow-sm transition-colors hover:border-primary/35 hover:shadow-md",
      )}
    >
      <Link
        href={danshariProductHref(product.uid)}
        className={cn(
          "group flex",
          isSidebar ? "flex-row items-stretch gap-3 p-2" : "flex-col",
        )}
      >
        <div
          ref={inViewRef}
          className={cn(
            "relative shrink-0 overflow-hidden bg-muted",
            isSidebar ? "h-20 w-20 rounded-lg" : "aspect-square w-full rounded-t-xl",
          )}
        >
          {visible ? (
            <DanshariMedia
              src={thumb}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes={isSidebar ? "80px" : "(max-width: 640px) 85vw, 280px"}
            />
          ) : (
            <div
              className="absolute inset-0 bg-muted motion-safe:animate-pulse"
              aria-hidden
            />
          )}
          {product.claimants.length > 0 ? (
            <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-0.5 rounded-full bg-primary/90 px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
              <Hand className="size-2.5 shrink-0" aria-hidden />
              {product.claimants.length}
            </div>
          ) : null}
        </div>
        <div
          className={cn(
            "min-w-0 flex flex-col justify-center",
            isSidebar ? "py-0.5 pr-1" : "p-3 pb-2",
          )}
        >
          <p className="font-medium text-foreground line-clamp-2 text-sm leading-snug">
            {product.title}
          </p>
        </div>
      </Link>
      <div className={cn("px-3 pb-2", isSidebar && "pl-[calc(0.5rem+5rem)] pr-2 pt-0")}>
        <DanshariTagPills
          tags={product.tags}
          size="sm"
          filterHref={danshariTagFilterHref}
        />
      </div>
    </div>
  )
}

const RecommendedCard = memo(RecommendedCardInner)

export function DanshariRecommendedCarousel({
  products,
  variant,
}: {
  products: Product[]
  variant: Variant
}) {
  if (products.length === 0) return null

  const isSidebar = variant === "sidebar"
  const orientation = isSidebar ? "vertical" : "horizontal"

  return (
    <section aria-labelledby="danshari-recommended-heading" className="w-full">
      <h2
        id="danshari-recommended-heading"
        className="text-sm font-medium text-muted-foreground mb-3"
      >
        More items
      </h2>
      <Carousel
        orientation={orientation}
        opts={{ align: "start", loop: false }}
        className="w-full"
      >
        <div
          className={cn(
            "relative",
            isSidebar && "max-h-[min(72vh,560px)]",
          )}
        >
          <CarouselContent
            className={cn(
              isSidebar ? "max-h-[min(72vh,560px)] -mt-3" : "-ml-2",
            )}
          >
            {products.map((p) => (
              <CarouselItem
                key={p.uid}
                className={cn(
                  isSidebar
                    ? "pt-3 basis-auto min-h-0"
                    : "pl-2 basis-[88%] sm:basis-[52%] md:basis-[42%] lg:basis-[38%]",
                )}
              >
                <RecommendedCard product={p} variant={variant} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
        {products.length > 1 ? (
          <div className="mt-3 flex justify-end gap-2">
            <CarouselPrevious
              type="button"
              className={cn(
                "static translate-x-0 translate-y-0 top-auto left-auto",
                "size-9 rounded-full border-border shadow-sm",
                isSidebar && "rotate-90",
              )}
            />
            <CarouselNext
              type="button"
              className={cn(
                "static translate-x-0 translate-y-0 top-auto right-auto",
                "size-9 rounded-full border-border shadow-sm",
                isSidebar && "rotate-90",
              )}
            />
          </div>
        ) : null}
      </Carousel>
    </section>
  )
}
