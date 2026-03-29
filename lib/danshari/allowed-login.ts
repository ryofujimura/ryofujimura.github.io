/** Lowercase names allowed to use the Danshari app. */
const ALLOWED = new Set(["taka", "sachiyo", "moyai", "tsumugi", "ryo"])

/** Sorted list for admin UI (promotion targeting, etc.). */
export const DANSHARI_ALLOWED_USERNAMES: readonly string[] = [...ALLOWED].sort(
  (a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }),
)

/** Keep only allowed, deduped, sorted usernames (for publish / doc reads). */
export function normalizePromotionUsernames(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const x of value) {
    if (typeof x !== "string") continue
    const n = x.trim().toLowerCase()
    if (!n || !ALLOWED.has(n) || seen.has(n)) continue
    seen.add(n)
    out.push(n)
  }
  out.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
  return out
}

const ADMIN_NAME = "ryo"

export type AllowedLoginResult =
  | { ok: true; username: string; isAdmin: boolean }
  | { ok: false }

/** Normalize input and return login payload only if the name is allowed. */
export function parseAllowedLogin(raw: string): AllowedLoginResult {
  const key = raw.trim().toLowerCase()
  if (!key || !ALLOWED.has(key)) {
    return { ok: false }
  }
  return {
    ok: true,
    username: key,
    isAdmin: key === ADMIN_NAME,
  }
}
