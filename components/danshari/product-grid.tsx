"use client"

import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { catalogListSignature } from "@/lib/danshari/catalog-signature"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import { ensureProductsLoaded, subscribeProducts } from "@/lib/danshari/store"
import type { Product } from "@/lib/danshari/types"
import { danshariHref, danshariTagFilterHref } from "@/lib/danshari/paths"
import { DanshariProductCard } from "./product-card"
import { cn } from "@/lib/utils"

const ROW_GAP_PX = 16
/** Approximate row height (square thumb + title + tags + gap); measureElement refines. */
const ESTIMATE_ROW_PX = 300 + ROW_GAP_PX

function useDanshariGridCols(): number {
  const [cols, setCols] = useState(2)
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w >= 1024) setCols(4)
      else if (w >= 640) setCols(3)
      else setCols(2)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return cols
}

function DanshariProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-2xl overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-muted" />
          <div className="p-3">
            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
            <div className="h-5 bg-muted rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

function VirtualizedProductRows({
  filtered,
  activeTag,
  cols,
}: {
  filtered: Product[]
  activeTag: string | null
  cols: number
}) {
  const scrollAnchorRef = useRef<HTMLDivElement>(null)
  const [scrollMargin, setScrollMargin] = useState(0)

  useLayoutEffect(() => {
    const el = scrollAnchorRef.current
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      setScrollMargin(r.top + window.scrollY)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener("resize", update)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [filtered.length, cols])

  const rowCount = Math.ceil(filtered.length / cols) || 0

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => ESTIMATE_ROW_PX,
    overscan: 2,
    scrollMargin,
  })

  return (
    <div ref={scrollAnchorRef} className="w-full">
      <div
        className="w-full relative"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((vRow) => {
          const start = vRow.index * cols
          const slice = filtered.slice(start, start + cols)
          return (
            <div
              key={vRow.key}
              data-index={vRow.index}
              ref={virtualizer.measureElement}
              className="absolute left-0 top-0 w-full pb-3 sm:pb-4"
              style={{ transform: `translateY(${vRow.start}px)` }}
            >
              <div
                className="grid gap-3 sm:gap-4 w-full [contain:layout]"
                style={{
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  contentVisibility: "auto",
                }}
              >
                {slice.map((product) => (
                  <DanshariProductCard
                    key={product.uid}
                    product={product}
                    activeTag={activeTag}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DanshariProductGridInner() {
  const searchParams = useSearchParams()
  const activeTag = searchParams.get("tag")?.trim() || null
  const cols = useDanshariGridCols()

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const lastSigRef = useRef<string | null>(null)

  useEffect(() => {
    const unsub = subscribeProducts((list) => {
      const sig = catalogListSignature(list)
      if (lastSigRef.current === sig) {
        setIsLoading(false)
        return
      }
      lastSigRef.current = sig
      setProducts(list)
      setIsLoading(false)
    })
    void ensureProductsLoaded().catch(() => {
      setProducts([])
      setIsLoading(false)
    })
    return unsub
  }, [])

  const allTags = useMemo(() => {
    const s = new Set<string>()
    for (const p of products) {
      for (const t of p.tags) {
        if (t.trim()) s.add(t)
      }
    }
    return [...s].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
  }, [products])

  const filtered = useMemo(() => {
    if (!activeTag) return products
    return products.filter((p) => p.tags.includes(activeTag))
  }, [products, activeTag])

  if (isLoading) {
    return <DanshariProductGridSkeleton />
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>No products yet.</p>
      </div>
    )
  }

  return (
    <>
      {allTags.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-medium text-muted-foreground mr-1">
            Filter by tag
          </span>
          <Link
            href={danshariHref()}
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              !activeTag
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-primary/15 hover:text-foreground",
            )}
            scroll={false}
          >
            All
          </Link>
          {allTags.map((t) => (
            <Link
              key={t}
              href={danshariTagFilterHref(t)}
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                activeTag === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/15 hover:text-foreground",
              )}
              scroll={false}
            >
              {t}
            </Link>
          ))}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground space-y-3">
          <p>No items with tag &quot;{activeTag}&quot;.</p>
          <Link
            href={danshariHref()}
            className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Show all items
          </Link>
        </div>
      ) : filtered.length >= 12 ? (
        <VirtualizedProductRows
          filtered={filtered}
          activeTag={activeTag}
          cols={cols}
        />
      ) : (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {filtered.map((product) => (
            <DanshariProductCard
              key={product.uid}
              product={product}
              activeTag={activeTag}
            />
          ))}
        </div>
      )}
    </>
  )
}

export function DanshariProductGrid() {
  return (
    <Suspense fallback={<DanshariProductGridSkeleton />}>
      <DanshariProductGridInner />
    </Suspense>
  )
}
