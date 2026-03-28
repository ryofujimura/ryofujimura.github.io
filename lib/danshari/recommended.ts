import type { Product } from "./types"
import { tagsOverlap } from "./tags"

function firstListingImageUrl(product: Product): string {
  const a = product.image_url?.trim() ?? ""
  const b = product.image_url_secondary?.trim() ?? ""
  return a || b
}

export { firstListingImageUrl }

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
