"use client"

import Link from "next/link"
import { memo, useCallback, useEffect, useState } from "react"
import { danshariProductHref, danshariTagFilterHref } from "@/lib/danshari/paths"
import {
  getListingImagePresentation,
} from "@/lib/danshari/recommended"
import type { Product } from "@/lib/danshari/types"
import { DanshariProductImage } from "@/components/danshari/danshari-product-image"
import {
  SoldListingOverlay,
  soldListingImageToneClass,
} from "@/components/danshari/sold-listing-overlay"
import { DanshariTagPills } from "@/components/danshari/tag-pills"
import {
  type CarouselApi,
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
  deferDecode,
}: {
  product: Product
  variant: Variant
  deferDecode: boolean
}) {
  const { src, srcSet, placeholderSrc } = getListingImagePresentation(product)
  const isSidebar = variant === "sidebar"
  const sold = Boolean(product.sold)

  const linkBody = (
    <>
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-muted",
          isSidebar ? "h-20 w-20 rounded-lg" : "aspect-square w-full rounded-t-xl",
        )}
      >
        <DanshariProductImage
          mode="thumb"
          src={src}
          srcSet={srcSet}
          placeholderSrc={placeholderSrc}
          alt={product.title}
          className={cn("object-cover", soldListingImageToneClass(sold))}
          sizes={isSidebar ? "80px" : "(max-width: 640px) 85vw, 280px"}
          viewportRootMargin="280px"
          deferDecode={deferDecode}
        />
        <SoldListingOverlay sold={sold} claimants={product.claimants} />
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
    </>
  )

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden shadow-sm",
        sold && "opacity-95",
      )}
    >
      {sold ? (
        <div
          className={cn(
            "flex cursor-default",
            isSidebar ? "flex-row items-stretch gap-3 p-2" : "flex-col",
          )}
          aria-label={`${product.title} — sold`}
        >
          {linkBody}
        </div>
      ) : (
        <Link
          href={danshariProductHref(product.uid)}
          className={cn(
            "flex",
            isSidebar ? "flex-row items-stretch gap-3 p-2" : "flex-col",
          )}
        >
          {linkBody}
        </Link>
      )}
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
  const [api, setApi] = useState<CarouselApi | undefined>()
  const [selected, setSelected] = useState(0)

  const onApi = useCallback((instance: CarouselApi) => {
    setApi(instance)
  }, [])

  useEffect(() => {
    if (!api) return
    const onSelect = () => setSelected(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

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
        setApi={onApi}
        orientation={orientation}
        opts={{ align: "start", loop: false, duration: 0 }}
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
            {products.map((p, i) => (
              <CarouselItem
                key={p.uid}
                className={cn(
                  isSidebar
                    ? "pt-3 basis-auto min-h-0"
                    : "pl-2 basis-[88%] sm:basis-[52%] md:basis-[42%] lg:basis-[38%]",
                )}
              >
                <RecommendedCard
                  product={p}
                  variant={variant}
                  deferDecode={Math.abs(i - selected) > 2}
                />
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
