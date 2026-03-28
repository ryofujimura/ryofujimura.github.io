"use client"

import type { Product, Comment, User } from "./types"

const PRODUCTS_KEY = "danshari_claim_products"
const COMMENTS_KEY = "danshari_claim_comments"
const USER_KEY = "danshari_claim_user"

const sampleProducts: Product[] = [
  {
    uid: "prod-1",
    title: "Vintage Leather Armchair",
    description:
      "Beautiful mid-century leather armchair in excellent condition. Rich brown patina with solid wood frame.",
    tag: "Furniture",
    image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    related_item_uid: "prod-2",
    claimant: null,
    created_at: new Date().toISOString(),
  },
  {
    uid: "prod-2",
    title: "Matching Ottoman",
    description: "Matching leather ottoman for the vintage armchair. Same rich brown leather.",
    tag: "Furniture",
    image_url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
    related_item_uid: "prod-1",
    claimant: null,
    created_at: new Date().toISOString(),
  },
  {
    uid: "prod-3",
    title: "Ceramic Vase Set",
    description: "Handcrafted ceramic vases in soft earth tones. Set of three different sizes.",
    tag: "Decor",
    image_url: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&q=80",
    related_item_uid: null,
    claimant: null,
    created_at: new Date().toISOString(),
  },
  {
    uid: "prod-4",
    title: "Wooden Bookshelf",
    description: "Solid oak bookshelf with five shelves. Perfect for living room or office.",
    tag: "Furniture",
    image_url: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80",
    related_item_uid: null,
    claimant: null,
    created_at: new Date().toISOString(),
  },
  {
    uid: "prod-5",
    title: "Desk Lamp",
    description: "Modern brass desk lamp with adjustable arm. Warm LED lighting included.",
    tag: "Lighting",
    image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    related_item_uid: null,
    claimant: null,
    created_at: new Date().toISOString(),
  },
  {
    uid: "prod-6",
    title: "Woven Basket Collection",
    description: "Set of three handwoven storage baskets in natural fibers.",
    tag: "Storage",
    image_url: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80",
    related_item_uid: null,
    claimant: null,
    created_at: new Date().toISOString(),
  },
]

function initializeStore() {
  if (typeof window === "undefined") return

  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(sampleProducts))
  }
  if (!localStorage.getItem(COMMENTS_KEY)) {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify([]))
  }
}

export function getProducts(): Product[] {
  if (typeof window === "undefined") return []
  initializeStore()
  const data = localStorage.getItem(PRODUCTS_KEY)
  return data ? JSON.parse(data) : []
}

export function getProduct(uid: string): Product | null {
  const products = getProducts()
  return products.find((p) => p.uid === uid) || null
}

export function addProduct(
  product: Omit<Product, "uid" | "claimant" | "created_at">
): Product {
  const products = getProducts()
  const newProduct: Product = {
    ...product,
    uid: `prod-${Date.now()}`,
    claimant: null,
    created_at: new Date().toISOString(),
  }
  products.push(newProduct)
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  return newProduct
}

export function updateProductClaimant(
  uid: string,
  claimant: string | null
): Product | null {
  const products = getProducts()
  const index = products.findIndex((p) => p.uid === uid)
  if (index === -1) return null

  products[index].claimant = claimant
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  return products[index]
}

export function getComments(productUid: string): Comment[] {
  if (typeof window === "undefined") return []
  initializeStore()
  const data = localStorage.getItem(COMMENTS_KEY)
  const comments: Comment[] = data ? JSON.parse(data) : []
  return comments.filter((c) => c.product_uid === productUid)
}

export function addComment(
  comment: Omit<Comment, "id" | "created_at">
): Comment {
  if (typeof window === "undefined") throw new Error("Cannot add comment on server")
  initializeStore()
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
