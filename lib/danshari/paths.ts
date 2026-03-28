/** Base path for the Danshari (Claim) mini-app on this site. */
export const DANSHARI_BASE = "/danshari" as const

/** Build an absolute path under `/danshari`. */
export function danshariHref(path = ""): string {
  if (!path || path === "/") return DANSHARI_BASE
  const p = path.startsWith("/") ? path : `/${path}`
  return `${DANSHARI_BASE}${p}`
}

/** Product detail URL (query-based so `output: "export"` works for any uid). */
export function danshariProductHref(uid: string): string {
  const q = new URLSearchParams({ uid })
  return `${DANSHARI_BASE}/product?${q.toString()}`
}

/** Home list filtered to products that include this tag (`?tag=`). */
export function danshariTagFilterHref(tag: string): string {
  const q = new URLSearchParams({ tag })
  return `${DANSHARI_BASE}?${q.toString()}`
}
