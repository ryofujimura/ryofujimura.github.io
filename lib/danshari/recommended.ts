import type { Product } from "./types"
import { tagsOverlap } from "./tags"

/** Prefer stored thumbnails for grids; fall back to full URLs (legacy / no thumb yet). */
function firstListingImageUrl(product: Product): string {
  const pick = (full: string, thumb: string | null) => {
    const t = thumb?.trim() ?? ""
    const f = full?.trim() ?? ""
    return t || f
  }
  const primary = pick(product.image_url, product.image_thumb_url)
  const secondary = pick(
    product.image_url_secondary ?? "",
    product.image_thumb_secondary,
  )
  return primary || secondary
}

export { firstListingImageUrl }

/** Admin 120px previews: use remote thumb when present; data URLs stay local full blob. */
export function adminPrimaryPreviewSrc(p: Product): string {
  const u = p.image_url?.trim() ?? ""
  if (!u) return ""
  if (u.startsWith("data:")) return u
  return (p.image_thumb_url?.trim() || u).trim()
}

export function adminSecondaryPreviewSrc(p: Product): string {
  const u = p.image_url_secondary?.trim() ?? ""
  if (!u) return ""
  if (u.startsWith("data:")) return u
  return (p.image_thumb_secondary?.trim() || u).trim()
}

/** Other products; any shared tag first, then by created_at desc. */
export function getRecommendedProducts(
  current: Product,
  all: Product[],
  limit = 24,
): Product[] {
  const others = all.filter((p) => p.uid !== current.uid)
  const sameTag = others.filter((p) => tagsOverlap(p.tags, current.tags))
  const otherTag = others.filter((p) => !tagsOverlap(p.tags, current.tags))
  const byCreated = (a: Product, b: Product) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  sameTag.sort(byCreated)
  otherTag.sort(byCreated)
  return [...sameTag, ...otherTag].slice(0, limit)
}
