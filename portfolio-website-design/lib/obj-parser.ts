/**
 * OBJ parser for ASCII rendering — per Alex Harri / OBJ ASCII tutorial.
 * Loads Wavefront .OBJ: lines "v x y z [r g b]" and "f a[/vt/vn] b[/vt/vn] c[/vt/vn]".
 * Returns vertices (x,y,z) and faces (triples of 0-based vertex indices).
 */

export type Vec3 = [number, number, number]

export interface ParsedOBJ {
  vertices: Vec3[]
  faces: [number, number, number][]
}

/** Parse vertex line: "v x y z" or "v x y z r g b". */
function parseVertex(line: string): Vec3 | null {
  const parts = line.trim().split(/\s+/)
  if (parts.length < 4) return null
  const x = parseFloat(parts[1])
  const y = parseFloat(parts[2])
  const z = parseFloat(parts[3])
  if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) return null
  return [x, y, z]
}

/** Parse face line: "f a b c" or "f a/vt/vn b/vt/vn c/vt/vn". Indices are 1-based. */
function parseFace(line: string): [number, number, number] | null {
  const parts = line.trim().split(/\s+/).slice(1)
  if (parts.length < 3) return null
  const toIndex = (p: string) => {
    const n = parseInt(p.split("/")[0], 10)
    return Number.isNaN(n) ? -1 : n - 1
  }
  const a = toIndex(parts[0])
  const b = toIndex(parts[1])
  const c = toIndex(parts[2])
  if (a < 0 || b < 0 || c < 0) return null
  return [a, b, c]
}

/** Parse OBJ text; optionally cap vertices/faces for large files. */
export function parseOBJ(
  text: string,
  maxVertices = 50000,
  maxFaces = 50000
): ParsedOBJ {
  const vertices: Vec3[] = []
  const faces: [number, number, number][] = []
  const lines = text.split(/\r?\n/)

  for (const line of lines) {
    const t = line.trim()
    if (!t) continue
    if (t.startsWith("v ") && vertices.length < maxVertices) {
      const v = parseVertex(line)
      if (v) vertices.push(v)
    } else if (t.startsWith("f ") && faces.length < maxFaces) {
      const f = parseFace(line)
      if (f) faces.push(f)
    }
  }

  return { vertices, faces }
}
