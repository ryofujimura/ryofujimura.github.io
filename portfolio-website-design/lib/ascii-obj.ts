/**
 * OBJ → ASCII 3D renderer (concept from tutorial + Alex Harri’s shape/depth ideas).
 * Load OBJ → project 3D→2D → map depth/brightness to ASCII → draw to character buffer.
 * @see https://alexharri.com/blog/ascii-rendering
 */

export type Vec3 = [number, number, number]

export interface Mesh {
  vertices: Vec3[]
  faces: [number, number, number][] // triples of vertex indices
}

/** Parse Wavefront OBJ: lines `v x y z` and `f i j k` (or `f i/j/k`). */
export function parseObj(text: string): Mesh {
  const vertices: Vec3[] = []
  const faces: [number, number, number][] = []
  const lines = text.split(/\r?\n/)
  for (const line of lines) {
    const s = line.trim()
    if (s.startsWith("v ")) {
      const parts = s.slice(2).split(/\s+/).map(Number)
      if (parts.length >= 3) vertices.push([parts[0], parts[1], parts[2]])
    } else if (s.startsWith("f ")) {
      const parts = s.slice(2).split(/\s+/)
      if (parts.length >= 3) {
        const takeFirst = (p: string) => parseInt(p.split("/")[0], 10) - 1
        faces.push([takeFirst(parts[0]), takeFirst(parts[1]), takeFirst(parts[2])])
        if (parts.length >= 4) {
          faces.push([takeFirst(parts[0]), takeFirst(parts[2]), takeFirst(parts[3])])
        }
      }
    }
  }
  return { vertices, faces }
}

/** Built-in unit cube (centered at origin). */
export const CUBE_OBJ = `
v -0.5 -0.5  0.5
v  0.5 -0.5  0.5
v  0.5  0.5  0.5
v -0.5  0.5  0.5
v -0.5 -0.5 -0.5
v  0.5 -0.5 -0.5
v  0.5  0.5 -0.5
v -0.5  0.5 -0.5
f 1 2 3 4
f 5 6 7 8
f 2 6 7 3
f 5 1 4 8
f 4 3 7 8
f 5 6 2 1
`.trim()

/** Default ASCII ramp: darker = closer/denser. */
export const ASCII_RAMP = " .:-=+*#%@"

export interface RenderOpts {
  width: number
  height: number
  /** Rotation in radians around Y, then X. */
  rotationY: number
  rotationX: number
  /** Distance from camera (perspective). */
  distance?: number
  /** Scale in character units. */
  scale?: number
  /** Light direction (normalized). */
  light?: Vec3
  /** Character ramp string, low→high density. */
  ramp?: string
}

function rotateY([x, y, z]: Vec3, a: number): Vec3 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [x * c - z * s, y, x * s + z * c]
}

function rotateX([x, y, z]: Vec3, a: number): Vec3 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [x, y * c - z * s, y * s + z * c]
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ]
}

function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / len, v[1] / len, v[2] / len]
}

/** Point-in-triangle test (2D barycentric-ish). */
function pointInTri(px: number, py: number, ax: number, ay: number, bx: number, by: number, cx: number, cy: number): boolean {
  const abx = bx - ax
  const aby = by - ay
  const acx = cx - ax
  const acy = cy - ay
  const apx = px - ax
  const apy = py - ay
  const d = abx * acy - aby * acx
  if (Math.abs(d) < 1e-10) return false
  const t = (apx * acy - apy * acx) / d
  const u = (abx * apy - aby * apx) / d
  return t >= 0 && u >= 0 && t + u <= 1
}

/** Render mesh to a 2D grid of ASCII characters. */
export function renderMeshToAscii(mesh: Mesh, opts: RenderOpts): string[][] {
  const {
    width,
    height,
    rotationY,
    rotationX,
    distance = 3,
    scale = 12,
    light = normalize([0.5, 0.7, 0.5]),
    ramp = ASCII_RAMP,
  } = opts

  const cx = width / 2
  const cy = height / 2

  const verts = mesh.vertices.map((v) => {
    let [x, y, z] = rotateY(v, rotationY)
    ;[x, y, z] = rotateX([x, y, z], rotationX)
    return { x, y, z, orig: v }
  })

  const proj = verts.map(({ x, y, z }) => {
    const w = z + distance
    if (w <= 0.01) return { sx: 0, sy: 0, z, skip: true }
    const sx = (x / w) * scale + cx
    const sy = (y / w) * scale + cy
    return { sx, sy, z, skip: false }
  })

  const depth: number[][] = Array(height)
    .fill(0)
    .map(() => Array(width).fill(-Infinity))
  const bright: number[][] = Array(height)
    .fill(0)
    .map(() => Array(width).fill(0))

  for (const [i, j, k] of mesh.faces) {
    const pa = proj[i]
    const pb = proj[j]
    const pc = proj[k]
    if (pa.skip || pb.skip || pc.skip) continue

    const e1 = sub(verts[j].orig, verts[i].orig) as Vec3
    const e2 = sub(verts[k].orig, verts[i].orig) as Vec3
    const n = normalize(cross(e1, e2))
    const brightness = Math.max(0, dot(n, light))

    const minX = Math.max(0, Math.floor(Math.min(pa.sx, pb.sx, pc.sx)))
    const maxX = Math.min(width - 1, Math.ceil(Math.max(pa.sx, pb.sx, pc.sx)))
    const minY = Math.max(0, Math.floor(Math.min(pa.sy, pb.sy, pc.sy)))
    const maxY = Math.min(height - 1, Math.ceil(Math.max(pa.sy, pb.sy, pc.sy)))

    for (let py = minY; py <= maxY; py++) {
      for (let px = minX; px <= maxX; px++) {
        const sx = px + 0.5
        const sy = py + 0.5
        if (!pointInTri(sx, sy, pa.sx, pa.sy, pb.sx, pb.sy, pc.sx, pc.sy)) continue
        const z = (pa.z + pb.z + pc.z) / 3
        if (z > depth[py][px]) {
          depth[py][px] = z
          bright[py][px] = brightness
        }
      }
    }
  }

  const zMin = Math.min(...depth.flat().filter((z) => z > -Infinity), 0)
  const zMax = Math.max(...depth.flat(), 0)
  const zRange = Math.max(1e-6, zMax - zMin)

  const out: string[][] = Array(height)
    .fill(0)
    .map(() => Array(width).fill(" "))
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const z = depth[y][x]
      const b = bright[y][x]
      if (z === -Infinity) continue
      const depthNorm = (z - zMin) / zRange
      const combined = 0.4 * (1 - depthNorm) + 0.6 * b
      const idx = Math.min(ramp.length - 1, Math.floor(combined * ramp.length))
      out[y][x] = ramp[idx]
    }
  }
  return out
}

/** Convert buffer to single string (lines joined by \n). */
export function bufferToText(buffer: string[][]): string {
  return buffer.map((row) => row.join("")).join("\n")
}
