"use client"

/** Max longer edge for “full” image stored in Firestore / shown on product page. */
const DEFAULT_FULL_MAX = 1920
/** Max longer edge for primary grid thumbnail (srcset largest). */
const DEFAULT_THUMB_480 = 480
const DEFAULT_THUMB_320 = 320
const DEFAULT_THUMB_160 = 160
/** Tiny preview for LQIP (longer edge). */
const PLACEHOLDER_MAX = 28
const DEFAULT_QUALITY = 0.82
const PLACEHOLDER_JPEG_QUALITY = 0.42

async function blobFromDataUrl(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl)
  return res.blob()
}

function loadImageElement(blob: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(blob)
  const img = new Image()
  img.decoding = "async"
  return new Promise((resolve, reject) => {
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to decode image"))
    }
    img.src = url
  })
}

function drawScaledToCanvas(
  img: HTMLImageElement,
  maxEdge: number,
): HTMLCanvasElement {
  let w = img.naturalWidth
  let h = img.naturalHeight
  if (w <= 0 || h <= 0) throw new Error("Invalid image dimensions")
  const scale = Math.min(1, maxEdge / Math.max(w, h))
  w = Math.max(1, Math.round(w * scale))
  h = Math.max(1, Math.round(h * scale))
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas 2D unavailable")
  ctx.drawImage(img, 0, 0, w, h)
  return canvas
}

async function canvasToBlobPreferWebp(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<{ blob: Blob; ext: string }> {
  const webp = await new Promise<Blob | null>((res) => {
    canvas.toBlob((b) => res(b), "image/webp", quality)
  })
  if (webp && webp.size > 0) return { blob: webp, ext: "webp" }

  const jpeg = await new Promise<Blob | null>((res) => {
    canvas.toBlob((b) => res(b), "image/jpeg", quality)
  })
  if (!jpeg || jpeg.size === 0) throw new Error("Could not encode image")
  return { blob: jpeg, ext: "jpg" }
}

function placeholderDataUrlFromImage(img: HTMLImageElement): string {
  const canvas = drawScaledToCanvas(img, PLACEHOLDER_MAX)
  return canvas.toDataURL("image/jpeg", PLACEHOLDER_JPEG_QUALITY)
}

/** All blobs produced from one source image for Storage + Firestore. */
export type ProcessedImagePack = {
  full: Blob
  fullExt: string
  thumb480: Blob
  thumb480Ext: string
  thumb320: Blob
  thumb320Ext: string
  thumb160: Blob
  thumb160Ext: string
  /** Tiny JPEG data URL for instant blur placeholder in the client. */
  placeholderDataUrl: string
}

/**
 * Decode a data URL, resize full + responsive thumbs, encode WebP (JPEG fallback).
 * Browser-only (canvas).
 */
export async function processDataUrlForUpload(
  dataUrl: string,
  options?: {
    fullMaxEdge?: number
    thumb480MaxEdge?: number
    thumb320MaxEdge?: number
    thumb160MaxEdge?: number
    quality?: number
  },
): Promise<ProcessedImagePack> {
  const fullMax = options?.fullMaxEdge ?? DEFAULT_FULL_MAX
  const t480 = options?.thumb480MaxEdge ?? DEFAULT_THUMB_480
  const t320 = options?.thumb320MaxEdge ?? DEFAULT_THUMB_320
  const t160 = options?.thumb160MaxEdge ?? DEFAULT_THUMB_160
  const quality = options?.quality ?? DEFAULT_QUALITY

  const blob = await blobFromDataUrl(dataUrl)
  const img = await loadImageElement(blob)

  const placeholderDataUrl = placeholderDataUrlFromImage(img)

  const fullCanvas = drawScaledToCanvas(img, fullMax)
  const c480 = drawScaledToCanvas(img, t480)
  const c320 = drawScaledToCanvas(img, t320)
  const c160 = drawScaledToCanvas(img, t160)

  const fullEnc = await canvasToBlobPreferWebp(fullCanvas, quality)
  const e480 = await canvasToBlobPreferWebp(c480, quality)
  const e320 = await canvasToBlobPreferWebp(c320, quality)
  const e160 = await canvasToBlobPreferWebp(c160, quality)

  return {
    full: fullEnc.blob,
    fullExt: fullEnc.ext,
    thumb480: e480.blob,
    thumb480Ext: e480.ext,
    thumb320: e320.blob,
    thumb320Ext: e320.ext,
    thumb160: e160.blob,
    thumb160Ext: e160.ext,
    placeholderDataUrl,
  }
}
