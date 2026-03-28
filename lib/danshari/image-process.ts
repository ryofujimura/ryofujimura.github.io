"use client"

/** Max longer edge for “full” image stored in Firestore / shown on product page. */
const DEFAULT_FULL_MAX = 1920
/** Max longer edge for grid / carousel / admin thumbnails. */
const DEFAULT_THUMB_MAX = 480
const DEFAULT_QUALITY = 0.82

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

export type ProcessedImagePair = {
  full: Blob
  thumb: Blob
  fullExt: string
  thumbExt: string
}

/**
 * Decode a data URL, resize full + thumb, encode WebP (JPEG fallback).
 * Browser-only (canvas).
 */
export async function processDataUrlForUpload(
  dataUrl: string,
  options?: {
    fullMaxEdge?: number
    thumbMaxEdge?: number
    quality?: number
  },
): Promise<ProcessedImagePair> {
  const fullMax = options?.fullMaxEdge ?? DEFAULT_FULL_MAX
  const thumbMax = options?.thumbMaxEdge ?? DEFAULT_THUMB_MAX
  const quality = options?.quality ?? DEFAULT_QUALITY

  const blob = await blobFromDataUrl(dataUrl)
  const img = await loadImageElement(blob)

  const fullCanvas = drawScaledToCanvas(img, fullMax)
  const thumbCanvas = drawScaledToCanvas(img, thumbMax)

  const fullEnc = await canvasToBlobPreferWebp(fullCanvas, quality)
  const thumbEnc = await canvasToBlobPreferWebp(thumbCanvas, quality)

  return {
    full: fullEnc.blob,
    thumb: thumbEnc.blob,
    fullExt: fullEnc.ext,
    thumbExt: thumbEnc.ext,
  }
}
