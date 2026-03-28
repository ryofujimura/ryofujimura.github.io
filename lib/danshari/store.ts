"use client"

import type { Product, Comment, User } from "./types"
import { idbGetProductCatalog, idbSetProductCatalog } from "./products-idb"

/** Legacy key; catalog now lives in IndexedDB (larger quota for image data URLs). */
const LEGACY_PRODUCTS_KEY = "danshari_claim_products"
const COMMENTS_KEY = "danshari_claim_comments"
const USER_KEY = "danshari_claim_user"

function migrateClaimants(p: Record<string, unknown>): string[] {
  const withClaimants = p as { claimants?: unknown; claimant?: unknown }
  if (Array.isArray(withClaimants.claimants)) {
    return withClaimants.claimants.filter(
      (x): x is string => typeof x === "string" && x.length > 0
    )
  }
  const legacy = withClaimants.claimant
  if (typeof legacy === "string" && legacy.length > 0) return [legacy]
  return []
}

function migrateProduct(raw: unknown): Product {
  if (!raw || typeof raw !== "object") {
    return {
      uid: `prod-${Date.now()}`,
      title: "",
      description: "",
      tag: "General",
      image_url: "",
      image_url_secondary: null,
      related_item_uid: null,
      claimants: [],
      created_at: new Date().toISOString(),
    }
  }
  const p = raw as Partial<Product> & Record<string, unknown>
  return {
    uid: typeof p.uid === "string" ? p.uid : `prod-${Date.now()}`,
    title: typeof p.title === "string" ? p.title : "",
    description: typeof p.description === "string" ? p.description : "",
    tag: typeof p.tag === "string" ? p.tag : "General",
    image_url: typeof p.image_url === "string" ? p.image_url : "",
    image_url_secondary:
      typeof p.image_url_secondary === "string" && p.image_url_secondary.length > 0
        ? p.image_url_secondary
        : null,
    related_item_uid:
      p.related_item_uid === null || typeof p.related_item_uid === "string"
        ? p.related_item_uid ?? null
        : null,
    claimants: migrateClaimants(p),
    created_at:
      typeof p.created_at === "string" ? p.created_at : new Date().toISOString(),
  }
}

const sampleProducts: Product[] = [
  {
    uid: "prod-1",
    title: "Vintage Leather Armchair",
    description:
      "Beautiful mid-century leather armchair in excellent condition. Rich brown patina with solid wood frame.",
    tag: "Furniture",
    image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    image_url_secondary: null,
    related_item_uid: "prod-2",
    claimants: [],
    created_at: new Date().toISOString(),
  },
  {
    uid: "prod-2",
    title: "Matching Ottoman",
    description: "Matching leather ottoman for the vintage armchair. Same rich brown leather.",
    tag: "Furniture",
    image_url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
    image_url_secondary: null,
    related_item_uid: "prod-1",
    claimants: [],
    created_at: new Date().toISOString(),
  },
  {
    uid: "prod-3",
    title: "Ceramic Vase Set",
    description: "Handcrafted ceramic vases in soft earth tones. Set of three different sizes.",
    tag: "Decor",
    image_url: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&q=80",
    image_url_secondary: null,
    related_item_uid: null,
    claimants: [],
    created_at: new Date().toISOString(),
  },
  {
    uid: "prod-4",
    title: "Wooden Bookshelf",
    description: "Solid oak bookshelf with five shelves. Perfect for living room or office.",
    tag: "Furniture",
    image_url: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80",
    image_url_secondary: null,
    related_item_uid: null,
    claimants: [],
    created_at: new Date().toISOString(),
  },
  {
    uid: "prod-5",
    title: "Desk Lamp",
    description: "Modern brass desk lamp with adjustable arm. Warm LED lighting included.",
    tag: "Lighting",
    image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    image_url_secondary: null,
    related_item_uid: null,
    claimants: [],
    created_at: new Date().toISOString(),
  },
  {
    uid: "prod-6",
    title: "Woven Basket Collection",
    description: "Set of three handwoven storage baskets in natural fibers.",
    tag: "Storage",
    image_url: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80",
    image_url_secondary: null,
    related_item_uid: null,
    claimants: [],
    created_at: new Date().toISOString(),
  },
]

/** In-memory catalog after `ensureProductsLoaded()`; `null` until first load. */
let productCache: Product[] | null = null
let loadPromise: Promise<Product[]> | null = null

function ensureCommentsInitialized() {
  if (typeof window === "undefined") return
  if (!localStorage.getItem(COMMENTS_KEY)) {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify([]))
  }
}

/**
 * Load catalog from IndexedDB (or migrate from legacy localStorage, or seed samples).
 * Safe to call multiple times; subsequent calls return the same promise until resolved.
 */
export async function ensureProductsLoaded(): Promise<Product[]> {
  if (typeof window === "undefined") return []
  if (productCache !== null) return productCache

  loadPromise ??= (async () => {
    try {
      const fromIdb = await idbGetProductCatalog()
      if (fromIdb !== undefined) {
        productCache = fromIdb.map(migrateProduct)
        return productCache
      }
    } catch (e) {
      console.error("[danshari] IndexedDB read failed", e)
    }

    try {
      const legacy = localStorage.getItem(LEGACY_PRODUCTS_KEY)
      if (legacy) {
        const parsed = JSON.parse(legacy) as unknown[]
        productCache = Array.isArray(parsed) ? parsed.map(migrateProduct) : []
        localStorage.removeItem(LEGACY_PRODUCTS_KEY)
        await idbSetProductCatalog(productCache)
        return productCache
      }
    } catch (e) {
      console.error("[danshari] localStorage migrate failed", e)
    }

    productCache = sampleProducts.map((p) => ({ ...p }))
    try {
      await idbSetProductCatalog(productCache)
    } catch (e) {
      console.error("[danshari] IndexedDB seed failed", e)
    }
    return productCache
  })()

  try {
    return await loadPromise
  } finally {
    loadPromise = null
  }
}

async function persistProductCatalog(products: Product[]): Promise<void> {
  await idbSetProductCatalog(products)
}

/** Sync read; use after `ensureProductsLoaded()`. Before load, returns `[]`. */
export function getProducts(): Product[] {
  if (typeof window === "undefined") return []
  return productCache ?? []
}

export function getProduct(uid: string): Product | null {
  const products = getProducts()
  return products.find((p) => p.uid === uid) || null
}

export async function addProduct(
  product: Omit<Product, "uid" | "claimants" | "created_at">
): Promise<Product> {
  await ensureProductsLoaded()
  const list = productCache!
  const newProduct: Product = {
    ...product,
    image_url_secondary: product.image_url_secondary ?? null,
    claimants: [],
    uid: `prod-${Date.now()}`,
    created_at: new Date().toISOString(),
  }
  list.push(newProduct)
  await persistProductCatalog(list)
  return newProduct
}

/** Replace the full catalog (admin bulk edit). */
export async function setProducts(products: Product[]): Promise<void> {
  if (typeof window === "undefined") return
  ensureCommentsInitialized()
  const copy = products.map((p) => ({ ...p }))
  productCache = copy
  await persistProductCatalog(copy)
}

/** Add username to end of queue, or remove if already listed (preserves order for others). */
export async function toggleProductClaim(
  uid: string,
  username: string
): Promise<Product | null> {
  await ensureProductsLoaded()
  const products = productCache!
  const index = products.findIndex((p) => p.uid === uid)
  if (index === -1) return null

  const cur = [...products[index].claimants]
  const at = cur.indexOf(username)
  const next =
    at >= 0 ? cur.filter((_, i) => i !== at) : [...cur, username]

  products[index] = { ...products[index], claimants: next }
  await persistProductCatalog(products)
  return products[index]
}

export function getComments(productUid: string): Comment[] {
  if (typeof window === "undefined") return []
  ensureCommentsInitialized()
  const data = localStorage.getItem(COMMENTS_KEY)
  const comments: Comment[] = data ? JSON.parse(data) : []
  return comments.filter((c) => c.product_uid === productUid)
}

export function addComment(
  comment: Omit<Comment, "id" | "created_at">
): Comment {
  if (typeof window === "undefined") throw new Error("Cannot add comment on server")
  ensureCommentsInitialized()
  const data = localStorage.getItem(COMMENTS_KEY)
  const comments: Comment[] = data ? JSON.parse(data) : []

  const newComment: Comment = {
    ...comment,
    id: `comment-${Date.now()}`,
    created_at: new Date().toISOString(),
  }
  comments.push(newComment)
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments))
  return newComment
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(USER_KEY)
  return data ? JSON.parse(data) : null
}

export function setUser(user: User): void {
  if (typeof window === "undefined") return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(USER_KEY)
}
