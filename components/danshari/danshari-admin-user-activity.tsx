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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
      className={compact ? "mb-0" : "mb-6 sm:mb-8"}
      aria-label="Guest activity"
    >
      <Card
        className={
          compact
            ? "rounded-xl border-border/80 shadow-sm overflow-hidden"
            : "rounded-2xl border-border/80 shadow-sm overflow-hidden"
        }
      >
        <CardHeader
          className={
            compact
              ? "border-b border-border/60 py-3 px-4 pb-3"
              : "border-b border-border/60 pb-4"
          }
        >
          <CardTitle
            className={compact ? "text-sm font-semibold" : "text-base sm:text-lg"}
          >
            Guest activity
          </CardTitle>
          <CardDescription className={compact ? "text-xs" : undefined}>
            Hands raised and comments per guest (admin view).
          </CardDescription>
        </CardHeader>
        <CardContent
          className={
            compact
              ? "pt-3 pb-3 px-4 space-y-4 max-h-[min(50vh,320px)] overflow-y-auto overscroll-contain"
              : "pt-5 space-y-6"
          }
        >
          {otherUsers.map((guestName) => {
            const rows = activityByUser[guestName] ?? []
            return (
              <div key={guestName} className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground capitalize tracking-tight">
                  {guestName}
                </h3>
                {rows.length === 0 ? (
                  <p className="text-sm text-muted-foreground pl-0 sm:pl-1">
                    No hands or comments on any item yet.
                  </p>
                ) : (
                <ul className="space-y-3 list-none m-0 p-0">
                  {rows.map((row) => (
                    <li
                      key={row.productUid}
                      className={
                        compact
                          ? "rounded-lg border border-border/70 bg-muted/30 p-2.5 sm:p-3 space-y-1.5"
                          : "rounded-xl border border-border/70 bg-muted/30 p-3 sm:p-4 space-y-2"
                      }
                    >
                      <Link
                        href={danshariProductHref(row.productUid)}
                        className="text-sm font-medium text-primary hover:underline underline-offset-4 [overflow-wrap:anywhere]"
                      >
                        {row.title}
                      </Link>
                      <div className="flex flex-col gap-2 text-sm">
                        {row.handRaised ? (
                          <div className="flex items-start gap-2 text-muted-foreground">
                            <Hand
                              className="w-4 h-4 shrink-0 mt-0.5 text-primary"
                              aria-hidden
                            />
                            <span>
                              <span className="font-medium text-foreground">
                                Hand
                              </span>
                              : raised
                            </span>
                          </div>
                        ) : null}
                        {row.userComments.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-start gap-2 text-muted-foreground"
                          >
                            <MessageCircle
                              className="w-4 h-4 shrink-0 mt-0.5 text-primary"
                              aria-hidden
                            />
                            <div className="min-w-0 flex-1 flex flex-wrap items-start gap-x-2 gap-y-1">
                              <span>
                                <span className="font-medium text-foreground">
                                  Comment
                                </span>
                                {c.text?.trim() ? (
                                  <span className="text-muted-foreground">
                                    : {c.text}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground/80 italic ml-1">
                                    : (empty)
                                  </span>
                                )}
                              </span>
                              {c.price !== null && (
                                <span
                                  className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold bg-[oklch(0.92_0.08_145)] text-[oklch(0.35_0.12_145)] px-2 py-0.5 rounded-full"
                                >
                                  <DollarSign className="w-3 h-3" />
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
        </CardContent>
      </Card>
    </section>
  )
}
