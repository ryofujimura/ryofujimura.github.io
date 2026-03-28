"use client"

import { getBlob, ref } from "firebase/storage"
import { getFirebaseStorage } from "@/lib/firebase"
import type { Product } from "./types"
import { processBlobForUpload, processDataUrlForUpload } from "./image-process"
import {
  patchProductImageFields,
  uploadProcessedImageSlot,
} from "./firestore-catalog"

/** Tighter encode than default publish path — targets smaller Storage objects. */
const OPTIMIZE_OPTS = {
  fullMaxEdge: 1920,
  thumbMaxEdge: 480,
  quality: 0.58,
} as const

/** One product at a time avoids Storage client retry storms (storage/retry-limit-exceeded). */
const PRODUCT_CONCURRENCY = 1
/** Small gap between slot work so XHR + uploads do not burst. */
const SLOT_PACE_MS = 220

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

function shouldRetryDownloadError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e)
  return /retry-limit|storage\/|network|Failed to fetch|Load failed|timed out/i.test(
    msg,
  )
}

function isProcessableImageRef(url: string): boolean {
  const u = url.trim()
  if (!u) return false
  return u.startsWith("data:") || u.startsWith("http://") || u.startsWith("https://")
}

function isFirebaseOrGcsDownloadUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return (
      u.hostname === "firebasestorage.googleapis.com" ||
      u.hostname === "storage.googleapis.com"
    )
  } catch {
    return false
  }
}

/**
 * Single attempt: Firebase `getBlob` then `fetch`. CORS must be set on the bucket.
 */
async function fetchImageBlobOnce(url: string): Promise<Blob> {
  const storage = getFirebaseStorage()
  if (storage && isFirebaseOrGcsDownloadUrl(url)) {
    try {
      const storageRef = ref(storage, url)
      const blob = await getBlob(storageRef)
      if (blob.size > 0) return blob
    } catch (e) {
      console.warn("[danshari] getBlob failed, trying fetch()", e)
    }
  }

  const res = await fetch(url, { mode: "cors", credentials: "omit" })
  if (!res.ok) throw new Error(`Fetch failed (${res.status})`)
  const blob = await res.blob()
  if (!blob.size) throw new Error("Empty image response")
  return blob
}

/** Retries after retry-limit / transient network errors (bulk runs are heavy). */
async function fetchImageBlob(url: string): Promise<Blob> {
  let last: unknown
  const maxAttempts = 4
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0) {
      await sleep(900 * attempt)
    }
    try {
      return await fetchImageBlobOnce(url)
    } catch (e) {
      last = e
      if (attempt < maxAttempts - 1 && shouldRetryDownloadError(e)) continue
      break
    }
  }
  if (last instanceof Error) throw last
  throw new Error(String(last))
}

async function encodeSlotFromSource(url: string) {
  if (url.startsWith("data:")) {
    return processDataUrlForUpload(url, OPTIMIZE_OPTS)
  }
  const blob = await fetchImageBlob(url)
  return processBlobForUpload(blob, OPTIMIZE_OPTS)
}

async function optimizeOneSlot(
  uid: string,
  slot: "primary" | "secondary",
  sourceUrl: string,
): Promise<void> {
  const processed = await encodeSlotFromSource(sourceUrl)
  const { fullUrl, thumbUrl } = await uploadProcessedImageSlot(
    uid,
    slot,
    processed,
    "opt",
  )
  if (slot === "primary") {
    await patchProductImageFields(uid, {
      image_url: fullUrl,
      image_thumb_url: thumbUrl,
    })
  } else {
    await patchProductImageFields(uid, {
      image_url_secondary: fullUrl,
      image_thumb_secondary: thumbUrl,
    })
  }
}

function countJobs(products: Product[]): number {
  let n = 0
  for (const p of products) {
    if (isProcessableImageRef(p.image_url)) n++
    if (p.image_url_secondary && isProcessableImageRef(p.image_url_secondary)) n++
  }
  return n
}

async function runWithConcurrency<T>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<void>,
): Promise<void> {
  if (items.length === 0) return
  const c = Math.max(1, concurrency)
  let i = 0
  async function worker(): Promise<void> {
    while (true) {
      const j = i++
      if (j >= items.length) return
      await fn(items[j], j)
    }
  }
  await Promise.all(Array.from({ length: Math.min(c, items.length) }, () => worker()))
}

export type OptimizeCatalogProgress = {
  done: number
  total: number
  productUid: string
  label: string
}

export type OptimizeCatalogResult = {
  productsTouched: number
  slotsOptimized: number
  errors: { uid: string; message: string }[]
}

/**
 * Re-encode every processable image (HTTP(S) or data URL), upload new objects
 * to Storage, and patch Firestore so grids use thumbs and detail uses capped full size.
 */
export async function optimizeAllCatalogImages(
  products: Product[],
  onProgress?: (p: OptimizeCatalogProgress) => void,
): Promise<OptimizeCatalogResult> {
  const total = countJobs(products)
  const errors: { uid: string; message: string }[] = []
  let done = 0
  let slotsOptimized = 0
  let productsTouched = 0

  if (total === 0) {
    return { productsTouched: 0, slotsOptimized: 0, errors }
  }

  await runWithConcurrency(products, PRODUCT_CONCURRENCY, async (p) => {
    let anySuccess = false

    const runSlot = async (slot: "primary" | "secondary", url: string | null) => {
      if (!url || !isProcessableImageRef(url)) return
      try {
        await optimizeOneSlot(p.uid, slot, url)
        slotsOptimized++
        anySuccess = true
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        errors.push({ uid: p.uid, message: `${slot}: ${message}` })
      } finally {
        done++
        onProgress?.({
          done,
          total,
          productUid: p.uid,
          label: slot,
        })
        await sleep(SLOT_PACE_MS)
      }
    }

    await runSlot("primary", p.image_url)
    await runSlot("secondary", p.image_url_secondary ?? null)
    if (anySuccess) productsTouched++
  })

  return { productsTouched, slotsOptimized, errors }
}
