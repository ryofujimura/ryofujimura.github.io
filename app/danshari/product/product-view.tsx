"use client"

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
} from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  danshariHref,
  danshariProductHref,
  danshariTagFilterHref,
} from "@/lib/danshari/paths"
import { useDanshariUser } from "@/lib/danshari/user-context"
import {
  ensureProductsLoaded,
  getProduct,
  toggleProductClaim,
  addComment,
  subscribeProducts,
  subscribeProductComments,
} from "@/lib/danshari/store"
import type { Product, Comment } from "@/lib/danshari/types"
import { catalogListSignature } from "@/lib/danshari/catalog-signature"
import {
  getListingImagePresentation,
  getRecommendedProducts,
} from "@/lib/danshari/recommended"
import { useMediaQuery } from "@/hooks/use-media-query"
import { DanshariRecommendedCarousel } from "@/components/danshari/danshari-recommended-carousel"
import { DanshariDescriptionRich } from "@/components/danshari/description-rich"
import { DanshariHeader } from "@/components/danshari/header"
import { DanshariProductImage } from "@/components/danshari/danshari-product-image"
import { DanshariTagPills } from "@/components/danshari/tag-pills"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  ArrowLeft,
  Hand,
  MessageCircle,
  DollarSign,
  Send,
} from "lucide-react"

function RelatedThumbImage({ product }: { product: Product }) {
  const { src, srcSet, placeholderSrc } = getListingImagePresentation(product)
  return (
    <DanshariProductImage
      mode="thumb"
      src={src}
      srcSet={srcSet}
      placeholderSrc={placeholderSrc}
      alt={product.title}
      sizes="64px"
      viewportGate={false}
    />
  )
}

function ProductViewInner() {
  const searchParams = useSearchParams()
  const uid = searchParams.get("uid") ?? ""
  const router = useRouter()
  const { user, isLoading: userLoading } = useDanshariUser()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProduct, setRelatedProduct] = useState<Product | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [commentText, setCommentText] = useState("")
  const [commentPrice, setCommentPrice] = useState("")
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const lastCatalogSigRef = useRef<string | null>(null)
  /** Align with `2xl:` layout — sidebar only when there is room for vertical “More items”. */
  const isSidebarLayout = useMediaQuery("(min-width: 1536px)")

  const recommended = useMemo(
    () => (product ? getRecommendedProducts(product, allProducts) : []),
    [product, allProducts],
  )

  // Same pathname + different `uid` is still client navigation; Next may keep scroll.
  useLayoutEffect(() => {
    if (!uid) return
    window.scrollTo(0, 0)
  }, [uid])

  useEffect(() => {
    if (userLoading) return
    if (!user) {
      router.push(danshariHref())
      return
    }
    if (!uid) {
      setProduct(null)
      setRelatedProduct(null)
      setComments([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    let cancelled = false
    lastCatalogSigRef.current = null

    void ensureProductsLoaded()
      .then(() => {
        if (cancelled) return
        const p = getProduct(uid)
        setProduct(p ?? null)
        if (p?.related_item_uid) {
          setRelatedProduct(getProduct(p.related_item_uid) ?? null)
        } else {
          setRelatedProduct(null)
        }
        setIsLoading(false)
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false)
      })

    const unsubProducts = subscribeProducts((all) => {
      const sig = catalogListSignature(all)
      if (lastCatalogSigRef.current === sig) return
      lastCatalogSigRef.current = sig

      setAllProducts(all)
      const p = all.find((x) => x.uid === uid) ?? null
      setProduct(p)
      if (p?.related_item_uid) {
        setRelatedProduct(all.find((x) => x.uid === p.related_item_uid) ?? null)
      } else {
        setRelatedProduct(null)
      }
    })

    const unsubComments = subscribeProductComments(uid, setComments)

    return () => {
      cancelled = true
      unsubProducts()
      unsubComments()
    }
  }, [uid, user, userLoading, router])

  const handleClaim = async () => {
    if (!product || !user) return
    const updated = await toggleProductClaim(product.uid, user.username)
    if (updated) setProduct(updated)
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !user || !product) return

    const price = commentPrice ? parseFloat(commentPrice) : null
    try {
      await addComment({
        product_uid: product.uid,
        username: user.username,
        text: commentText.trim(),
        price: price && !isNaN(price) ? price : null,
      })
      setCommentText("")
      setCommentPrice("")
    } catch (err) {
      console.error(err)
    }
  }

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!uid || !product) {
    return (
      <div className="min-h-screen bg-background">
        <DanshariHeader />
        <main className="max-w-2xl mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Product not found.</p>
          <Button asChild variant="ghost" className="mt-4">
            <Link href={danshariHref()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to products
            </Link>
          </Button>
        </main>
      </div>
    )
  }

  const claimants = product.claimants
  const iAmInQueue =
    !!user && claimants.some((name) => name === user.username)

  return (
    <div className="min-h-screen bg-background">
      <DanshariHeader />
      <main className="max-w-7xl mx-auto px-4 py-4 pb-24">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 rounded-xl text-muted-foreground"
        >
          <Link href={danshariHref()}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
        </Button>

        <div className="flex flex-col 2xl:flex-row 2xl:items-start 2xl:gap-10">
          <div className="min-w-0 w-full max-w-2xl flex-1">
        <div
          className={
            product.image_url_secondary
              ? "grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4"
              : "mb-4"
          }
        >
          <div className="relative rounded-2xl overflow-hidden bg-muted">
            <DanshariProductImage
              mode="hero"
              src={product.image_url}
              alt={product.title}
              placeholderSrc={product.image_placeholder_data_url}
              sizes={
                product.image_url_secondary
                  ? "(max-width: 640px) 100vw, 336px"
                  : "(max-width: 672px) 100vw, 672px"
              }
            />
            {claimants.length > 0 ? (
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium px-2.5 py-1">
                <Hand className="w-3.5 h-3.5 shrink-0" aria-hidden />
                {claimants.length}
              </div>
            ) : null}
          </div>
          {product.image_url_secondary ? (
            <div className="relative rounded-2xl overflow-hidden bg-muted">
              <DanshariProductImage
                mode="contain"
                src={product.image_url_secondary}
                alt=""
                placeholderSrc={product.image_placeholder_secondary_data_url}
                sizes="(max-width: 640px) 100vw, 336px"
              />
            </div>
          ) : null}
        </div>

        <div className="mb-6">
          <DanshariTagPills
            tags={product.tags}
            className="mb-2"
            filterHref={danshariTagFilterHref}
          />
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            {product.title}
          </h1>
          <DanshariDescriptionRich
            text={product.description}
            className="text-muted-foreground"
          />
        </div>

        {claimants.length > 0 ? (
          <div className="rounded-2xl border border-border bg-card/60 p-4 mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-3">
              Interested{" "}
              <span className="text-foreground/70">(order: first → last)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {claimants.map((name, i) => {
                const isSelf = user?.username === name
                return (
                  <span
                    key={`${name}-${i}`}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm shadow-sm",
                      isSelf
                        ? "border-primary/40 bg-primary/10 text-foreground"
                        : "border-border bg-background text-foreground"
                    )}
                  >
                    <span className="tabular-nums text-[10px] font-semibold text-muted-foreground min-w-[1.1rem]">
                      {i + 1}
                    </span>
                    <span className="select-none" aria-hidden>
                      ✋
                    </span>
                    <span className={cn(isSelf && "font-semibold")}>
                      {isSelf ? "You" : name}
                    </span>
                  </span>
                )
              })}
            </div>
          </div>
        ) : null}

        <Button
          onClick={handleClaim}
          className="w-full h-16 rounded-xl mb-6 text-5xl leading-none p-0"
          variant={iAmInQueue ? "outline" : "default"}
          aria-label={iAmInQueue ? "Remove my hand" : "Raise hand to join"}
        >
          <span className="select-none" aria-hidden>
            {iAmInQueue ? "✋" : "🖐️"}
          </span>
        </Button>

        <div className="mb-6">
          <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
            <MessageCircle className="w-4 h-4" />
            Comments ({comments.length})
          </h2>

          <div className="space-y-3 mb-4">
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No comments yet. Be the first to comment.
              </p>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id} className="p-3 rounded-xl">
                  <div className="flex items-start gap-2">
                    <span
                      className="w-[10ch] shrink-0 truncate font-medium text-sm text-foreground"
                      title={comment.username}
                    >
                      {comment.username}
                    </span>
                    <div className="min-w-0 flex-1 flex items-start gap-2">
                      <p className="text-sm text-muted-foreground min-w-0 flex-1 [overflow-wrap:anywhere]">
                        {comment.text}
                      </p>
                      {comment.price !== null && (
                        <span className="flex shrink-0 items-center gap-0.5 text-xs font-semibold bg-[oklch(0.92_0.08_145)] text-[oklch(0.35_0.12_145)] px-2 py-0.5 rounded-full self-start">
                          <DollarSign className="w-3 h-3" />
                          {comment.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <form onSubmit={handleSubmitComment} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 h-11 rounded-xl text-sm"
              />
              <div className="relative w-24">
                <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Price"
                  value={commentPrice}
                  onChange={(e) => setCommentPrice(e.target.value)}
                  className="h-11 rounded-xl text-sm pl-8"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={!commentText.trim()}
              className="h-11 rounded-xl"
            >
              <Send className="w-4 h-4 mr-2" />
              Post comment
            </Button>
          </form>
        </div>

        {relatedProduct && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Related item
            </h2>
            <div className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-colors">
              <Link
                href={danshariProductHref(relatedProduct.uid)}
                className="flex items-center gap-3 p-3 pb-2"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <RelatedThumbImage product={relatedProduct} />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {relatedProduct.title}
                  </p>
                </div>
              </Link>
              <div className="px-3 pb-3 pl-[calc(0.75rem+4rem+0.75rem)]">
                <DanshariTagPills
                  tags={relatedProduct.tags}
                  size="sm"
                  filterHref={danshariTagFilterHref}
                />
              </div>
            </div>
          </div>
        )}
          </div>

          {recommended.length > 0 ? (
            <aside className="mt-10 w-full shrink-0 2xl:mt-0 2xl:w-72 2xl:sticky 2xl:top-6 2xl:self-start">
              <DanshariRecommendedCarousel
                key={isSidebarLayout ? "sidebar" : "strip"}
                products={recommended}
                variant={isSidebarLayout ? "sidebar" : "below"}
              />
            </aside>
          ) : null}
        </div>
      </main>
    </div>
  )
}

export function ProductView() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductViewInner />
    </Suspense>
  )
}
