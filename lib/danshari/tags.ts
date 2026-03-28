/** Parse Firestore doc: prefer `tags` array, fall back to legacy `tag` string. */
export function parseTagsFromDoc(data: Record<string, unknown> | undefined): string[] {
  if (!data) return ["General"]
  const raw = data.tags
  if (Array.isArray(raw)) {
    const out = [
      ...new Set(
        raw
          .filter((n): n is string => typeof n === "string")
          .map((s) => s.trim())
          .filter(Boolean),
      ),
    ]
    if (out.length > 0) return out
  }
  const legacy = data.tag
  if (typeof legacy === "string" && legacy.trim()) return [legacy.trim()]
  return ["General"]
}

/** Trim, dedupe, default for publish. */
export function normalizeTagsForPublish(tags: string[]): string[] {
  const out = [
    ...new Set(tags.map((t) => t.trim()).filter(Boolean)),
  ]
  return out.length > 0 ? out : ["General"]
}

export function tagsOverlap(a: string[], b: string[]): boolean {
  if (a.length === 0 || b.length === 0) return false
  const setA = new Set(a)
  return b.some((t) => setA.has(t))
}
