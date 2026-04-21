"use client"

import { Canvas, useLoader } from "@react-three/fiber"
import { Environment, Float, OrbitControls } from "@react-three/drei"
import { Suspense, useLayoutEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"

/** Z-up CAD meshes → Y-up (Three.js) */
const CAD_TO_THREE = [-Math.PI / 2, 0, 0] as const

const FIT_SIZE = 2.2

const MODELS = [
  {
    label: "MX Master 3",
    url: "/custom/models/honda-nsx-02-body-3.stl",
    color: "#c8c8c8",
    metalness: 0.55,
    roughness: 0.35,
  },
  {
    label: "MX Anywhere 3S",
    url: "/custom/models/honda-nsx-02-body-2.stl",
    color: "#c8c8c8",
    metalness: 0.55,
    roughness: 0.35,
  },
  {
    label: "Bose Soundlink",
    url: "/custom/models/honda-nsx-02-body.stl",
    color: "#c8c8c8",
    metalness: 0.55,
    roughness: 0.35,
  },
] as const

function WireframeCube() {
  return (
    <mesh>
      <boxGeometry args={[2.8, 2.8, 2.8]} />
      <meshBasicMaterial color="#ffffff" wireframe opacity={0.06} transparent />
    </mesh>
  )
}

function StlMesh({
  geometry,
  color,
  metalness,
  roughness,
}: {
  geometry: THREE.BufferGeometry
  color: string
  metalness: number
  roughness: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    geometry.computeVertexNormals()

    const pos = geometry.attributes.position as THREE.BufferAttribute
    const box = new THREE.Box3().setFromBufferAttribute(pos)
    const center = new THREE.Vector3()
    const size = new THREE.Vector3()
    box.getCenter(center)
    box.getSize(size)
    const max = Math.max(size.x, size.y, size.z, 1e-6)
    const s = FIT_SIZE / max

    mesh.scale.setScalar(s)
    mesh.position.set(-center.x * s, -center.y * s, -center.z * s)
  }, [geometry])

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function ModelCarousel({ activeIndex }: { activeIndex: number }) {
  const urls = useMemo(() => MODELS.map((m) => m.url), [])
  const loaded = useLoader(STLLoader, [...urls])
  const geometries = (Array.isArray(loaded) ? loaded : [loaded]) as THREE.BufferGeometry[]
  const cfg = MODELS[activeIndex]

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.35}>
      <group rotation={CAD_TO_THREE}>
        <group>
          <WireframeCube />
          <StlMesh
            geometry={geometries[activeIndex]}
            color={cfg.color}
            metalness={cfg.metalness}
            roughness={cfg.roughness}
          />
        </group>
      </group>
    </Float>
  )
}

export function SceneViewer() {
  const [activeModel, setActiveModel] = useState(0)

  return (
    <div className="relative w-full aspect-square max-w-[520px]">
      <div className="absolute inset-0 border border-glass/[0.08] bg-glass/[0.02] backdrop-blur-sm" />

      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [2.8, 1.6, 2.8], fov: 42, near: 0.01, far: 500 }}
            gl={{ antialias: true, alpha: true, localClippingEnabled: false }}
            style={{ background: "transparent" }}
          >
            <ambientLight intensity={0.45} />
            <directionalLight position={[6, 8, 5]} intensity={1.1} castShadow={false} />
            <directionalLight position={[-4, -2, -3]} intensity={0.35} />
            <hemisphereLight args={["#e8e8e8", "#303030", 0.35]} />
            <ModelCarousel activeIndex={activeModel} />
            <OrbitControls
              enableZoom
              minDistance={0.35}
              maxDistance={14}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.6}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.05}
              enableDamping
              dampingFactor={0.08}
            />
            <Environment preset="studio" />
          </Canvas>
        </Suspense>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 border-t border-glass/[0.08] bg-glass/[0.03] backdrop-blur-md gap-2 overflow-x-auto">
        <div className="flex gap-2 shrink-0">
          {MODELS.map((m, i) => (
            <button
              key={m.url}
              type="button"
              onClick={() => setActiveModel(i)}
              className={`font-mono text-[9px] sm:text-[10px] tracking-[0.12em] uppercase px-2 sm:px-3 py-1.5 border transition-all duration-300 whitespace-nowrap ${
                activeModel === i
                  ? "border-foreground/40 text-foreground bg-foreground/5"
                  : "border-border/30 text-muted-foreground hover:border-foreground/20 hover:text-foreground/70"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50 hidden sm:block shrink-0">
          {"DRAG / SCROLL"}
        </span>
      </div>

      <span className="absolute top-3 left-4 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/40">
        {"VIEWPORT_01"}
      </span>
      <span className="absolute top-3 right-4 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/40">
        {"GL.RENDER"}
      </span>
    </div>
  )
}
