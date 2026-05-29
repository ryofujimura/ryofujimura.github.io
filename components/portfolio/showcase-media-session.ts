/** Only one showcase preview video may buffer/decode at a time (mobile-safe). */
let activeVideoKey: string | null = null

export function claimShowcaseVideo(key: string): boolean {
  if (activeVideoKey === null || activeVideoKey === key) {
    activeVideoKey = key
    return true
  }
  return false
}

export function releaseShowcaseVideo(key: string) {
  if (activeVideoKey === key) activeVideoKey = null
}
