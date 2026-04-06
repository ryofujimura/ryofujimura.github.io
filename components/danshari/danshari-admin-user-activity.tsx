"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Hand, MessageCircle, DollarSign } from "lucide-react"
import { DANSHARI_ALLOWED_USERNAMES } from "@/lib/danshari/allowed-login"
import { danshariProductHref } from "@/lib/danshari/paths"
import {
  ensureProductsLoaded,
  subscribeProducts,
  subscribeProductComments,
} from "@/lib/danshari/store"
import { useDanshariUser } from "@/lib/danshari/user-context"
import type { Comment, Product } from "@/lib/danshari/types"
import { Card, CardContent } from "@/components/ui/card"

function userRaisedHand(product: Product, username: string): boolean {
  const key = username.toLowerCase()
  return product.claimants.some((c) => c.toLowerCase() === key)
}

function commentsByUserForProduct(
  comments: Comment[] | undefined,
  username: string,
): Comment[] {
  if (!comments?.length) return []
  const key = username.toLowerCase()
  return comments.filter((c) => c.username.toLowerCase() === key)
}

export function DanshariAdminUserActivity({
  compact = false,
}: {
  /** Tighter layout + scroll cap when embedded under the intro strip. */
  compact?: boolean
} = {}) {
  const { user } = useDanshariUser()
  const [products, setProducts] = useState<Product[]>([])
  const [commentsByProduct, setCommentsByProduct] = useState<
    Record<string, Comment[]>
  >({})

  const isAdmin = Boolean(user?.is_admin)
  const productKey = useMemo(
    () =>
      [...products]
        .map((p) => p.uid)
        .sort()
        .join("|"),
    [products],
  )

  useEffect(() => {
    void ensureProductsLoaded().catch(() => {})
  }, [])

  useEffect(() => {
    return subscribeProducts(setProducts)
  }, [])

  useEffect(() => {
    if (!isAdmin || products.length === 0) return
    const unsubs: (() => void)[] = []
    for (const p of products) {
      unsubs.push(
        subscribeProductComments(p.uid, (comments) => {
          setCommentsByProduct((prev) => ({
            ...prev,
            [p.uid]: comments,
          }))
        }),
      )
    }
    return () => {
      unsubs.forEach((u) => u())
    }
  }, [isAdmin, productKey])

  const otherUsers = useMemo(() => {
    if (!user?.username) return []
    const me = user.username.toLowerCase()
    return DANSHARI_ALLOWED_USERNAMES.filter((n) => n !== me)
  }, [user?.username])

  const activityByUser = useMemo(() => {
    type Row = {
      productUid: string
      title: string
      handRaised: boolean
      userComments: Comment[]
    }
    const out: Record<string, Row[]> = {}
    for (const name of otherUsers) {
      const rows: Row[] = []
      for (const p of products) {
        const handRaised = userRaisedHand(p, name)
        const userComments = commentsByUserForProduct(
          commentsByProduct[p.uid],
          name,
        )
        if (!handRaised && userComments.length === 0) continue
        rows.push({
          productUid: p.uid,
          title: p.title || "Untitled",
          handRaised,
          userComments,
        })
      }
      out[name] = rows
    }
    return out
  }, [otherUsers, products, commentsByProduct])

  if (!isAdmin || otherUsers.length === 0) return null

  return (
    <section
      className={compact ? "mb-0 w-full" : "mb-6 sm:mb-8 w-full"}
      aria-label="Guest activity"
    >
      <Card
        className={
          compact
            ? "w-full gap-0 rounded-xl border-border/80 py-0 shadow-sm overflow-hidden"
            : "w-full gap-0 rounded-2xl border-border/80 py-0 shadow-sm overflow-hidden"
        }
      >
        <CardContent
          className={
            compact
              ? "w-full max-w-none px-2 sm:px-4 pt-0 pb-3 max-h-[min(50vh,320px)] overflow-y-auto overscroll-contain"
              : "w-full max-w-none px-3 sm:px-5 pt-0 pb-5 max-h-[min(60vh,480px)] overflow-y-auto overscroll-contain"
          }
        >
          <div
            className={
              compact
                ? "grid w-full grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] gap-2 sm:gap-2.5 items-start"
                : "grid w-full grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-3 sm:gap-4 items-start"
            }
          >
            {otherUsers.map((guestName) => {
              const rows = activityByUser[guestName] ?? []
              return (
                <div
                  key={guestName}
                  className={
                    compact
                      ? "min-w-0 rounded-lg border border-border/70 bg-muted/25 p-2 flex flex-col gap-1.5"
                      : "min-w-0 rounded-xl border border-border/70 bg-muted/25 p-2.5 sm:p-3 flex flex-col gap-2"
                  }
                >
                  <h3
                    className={
                      compact
                        ? "text-[11px] font-semibold text-foreground capitalize tracking-tight truncate"
                        : "text-xs font-semibold text-foreground capitalize tracking-tight truncate"
                    }
                    title={guestName}
                  >
                    {guestName}
                  </h3>
                  {rows.length === 0 ? (
                    <p
                      className={
                        compact
                          ? "text-[11px] text-muted-foreground leading-snug"
                          : "text-xs text-muted-foreground leading-snug"
                      }
                    >
                      No activity yet.
                    </p>
                  ) : (
                    <ul
                      className={
                        compact
                          ? "grid grid-cols-1 gap-1.5 list-none m-0 p-0"
                          : "grid grid-cols-1 gap-2 list-none m-0 p-0"
                      }
                    >
                      {rows.map((row) => (
                        <li
                          key={row.productUid}
                          className={
                            compact
                              ? "rounded-md border border-border/60 bg-background/70 p-1.5 space-y-1 min-w-0"
                              : "rounded-lg border border-border/60 bg-background/70 p-2 space-y-1.5 min-w-0"
                          }
                        >
                          <Link
                            href={danshariProductHref(row.productUid)}
                            className={
                              compact
                                ? "block text-[11px] font-medium text-primary hover:underline underline-offset-2 [overflow-wrap:anywhere] leading-snug"
                                : "block text-xs font-medium text-primary hover:underline underline-offset-2 [overflow-wrap:anywhere] leading-snug"
                            }
                          >
                            {row.title}
                          </Link>
                          <div
                            className={
                              compact
                                ? "flex flex-col gap-1 text-[11px] text-muted-foreground"
                                : "flex flex-col gap-1.5 text-xs text-muted-foreground"
                            }
                          >
                            {row.handRaised ? (
                              <div className="flex items-start gap-1 min-w-0">
                                <Hand
                                  className={
                                    compact
                                      ? "w-3 h-3 shrink-0 mt-0.5 text-primary"
                                      : "w-3.5 h-3.5 shrink-0 mt-0.5 text-primary"
                                  }
                                  aria-hidden
                                />
                                <span className="min-w-0">
                                  <span className="font-medium text-foreground">
                                    Hand
                                  </span>{" "}
                                  raised
                                </span>
                              </div>
                            ) : null}
                            {row.userComments.map((c) => (
                              <div
                                key={c.id}
                                className="flex items-start gap-1 min-w-0"
                              >
                                <MessageCircle
                                  className={
                                    compact
                                      ? "w-3 h-3 shrink-0 mt-0.5 text-primary"
                                      : "w-3.5 h-3.5 shrink-0 mt-0.5 text-primary"
                                  }
                                  aria-hidden
                                />
                                <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                                  <span className="[overflow-wrap:anywhere]">
                                    <span className="font-medium text-foreground">
                                      Comment
                                    </span>
                                    {c.text?.trim() ? (
                                      <span>: {c.text}</span>
                                    ) : (
                                      <span className="text-muted-foreground/80 italic">
                                        {" "}
                                        (empty)
                                      </span>
                                    )}
                                  </span>
                                  {c.price !== null && (
                                    <span
                                      className={
                                        compact
                                          ? "inline-flex w-fit items-center gap-0.5 text-[10px] font-semibold bg-[oklch(0.92_0.08_145)] text-[oklch(0.35_0.12_145)] px-1.5 py-0.5 rounded-full"
                                          : "inline-flex w-fit items-center gap-0.5 text-[11px] font-semibold bg-[oklch(0.92_0.08_145)] text-[oklch(0.35_0.12_145)] px-1.5 py-0.5 rounded-full"
                                      }
                                    >
                                      <DollarSign className="w-2.5 h-2.5" />
                                      {Math.round(c.price)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
