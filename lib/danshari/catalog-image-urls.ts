import type { Product } from "./types"
import { firstListingImageUrl } from "./recommended"

/** Remote image URLs used across grid, detail, and carousels (deduped). Skips data URLs. */
export function collectCatalogImageUrls(products: Product[]): string[] {
  const set = new Set<string>()
  const add = (u: string | null | undefined) => {
    const s = u?.trim()
    if (s && !s.startsWith("data:")) set.add(s)
  }
  for (const p of products) {
    add(p.image_url)
    add(p.image_url_secondary)
    add(p.image_thumb_url)
    add(p.image_thumb_secondary)
    const listing = firstListingImageUrl(p)
    if (listing && !listing.startsWith("data:")) set.add(listing)
  }
  return [...set]
}
