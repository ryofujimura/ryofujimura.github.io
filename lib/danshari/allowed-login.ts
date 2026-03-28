/** Lowercase names allowed to use the Danshari app. */
const ALLOWED = new Set(["taka", "sachiyo", "moyai", "tsumugi", "ryo"])

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
