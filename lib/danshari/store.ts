"use client"

import type { Product, Comment, User } from "./types"
import {
  ensureCatalogLoaded,
  getCachedProducts,
  subscribeCatalog,
  setProductsRemote,
  uploadDataUrlImagesForProducts,
  toggleProductClaimRemote,
  addCommentRemote,
  subscribeProductComments,
} from "./firestore-catalog"

const USER_KEY = "danshari_claim_user"

export async function ensureProductsLoaded(): Promise<Product[]> {
  try {
    return await ensureCatalogLoaded()
  } catch (e) {
    console.error("[danshari] catalog load failed", e)
    return []
  }
}

/** Live updates when any product changes (Firestore snapshot). */
export function subscribeProducts(cb: (products: Product[]) => void): () => void {
  return subscribeCatalog(cb)
}

export function getProducts(): Product[] {
  return getCachedProducts()
}

export function getProduct(uid: string): Product | null {
  return getProducts().find((p) => p.uid === uid) ?? null
}

/** Uploads any data-URL images to Storage, then replaces the full `danshari` catalog. */
export async function setProducts(products: Product[]): Promise<void> {
  const uploaded = await uploadDataUrlImagesForProducts(products)
  await setProductsRemote(uploaded)
}

export async function toggleProductClaim(
  uid: string,
  username: string
): Promise<Product | null> {
  try {
    return await toggleProductClaimRemote(uid, username)
  } catch (e) {
    console.error("[danshari] toggle claim", e)
    return null
  }
}

export async function addComment(
  comment: Omit<Comment, "id" | "created_at">
): Promise<void> {
  const { product_uid, username, text, price } = comment
  await addCommentRemote(product_uid, { username, text, price })
}

export { subscribeProductComments }

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
