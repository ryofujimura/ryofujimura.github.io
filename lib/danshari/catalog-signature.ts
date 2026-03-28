import type { Product } from "./types"

/**
 * Detects real catalog changes so we can skip React updates when Firestore
 * re-emits an identical snapshot (metadata churn, reconnect, etc.).
 */
export function catalogListSignature(list: Product[]): string {
  if (list.length === 0) return ""
  const parts: string[] = []
  for (const p of list) {
    parts.push(
      p.uid,
      "\t",
      p.title,
      "\t",
      p.description,
      "\t",
      p.image_url,
      "\t",
      p.image_url_secondary ?? "",
      "\t",
      p.image_thumb_url ?? "",
      "\t",
      p.image_thumb_320_url ?? "",
      "\t",
      p.image_thumb_160_url ?? "",
      "\t",
      p.image_thumb_secondary ?? "",
      "\t",
      p.image_thumb_secondary_320_url ?? "",
      "\t",
      p.image_thumb_secondary_160_url ?? "",
      "\t",
      p.image_placeholder_data_url ?? "",
      "\t",
      p.image_placeholder_secondary_data_url ?? "",
      "\t",
      p.related_item_uid ?? "",
      "\t",
      p.claimants.join("\x1e"),
      "\t",
      p.tags.join("\x1e"),
      "\n",
    )
  }
  return parts.join("")
}
