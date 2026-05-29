"use client"

import { Canvas, useLoader } from "@react-three/fiber"
import { Environment, Float, OrbitControls } from "@react-three/drei"
import { Suspense, useLayoutEffect, useRef } from "react"
import * as THREE from "three"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"

const CAD_TO_THREE = [-Math.PI / 2, 0, 0] as const
const FIT_SIZE = 2.35

function WireframeCube() {
  return (
    <mesh>
      <boxGeometry args={[2.6, 2.6, 2.6]} />
      <meshBasicMaterial color="#ffffff" wireframe opacity={0.08} transparent />
    </mesh>
  )
}

function StlMesh({ geometry }: { geometry: THREE.BufferGeometry }) {
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
        color="#b8b8b8"
        metalness={0.55}
        roughness={0.38}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function StlScene({ url }: { url: string }) {
  const geometry = useLoader(STLLoader, url)

  return (
    <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.3}>
      <group rotation={CAD_TO_THREE}>
        <WireframeCube />
        <StlMesh geometry={geometry} />
      </group>
    </Float>
  )
}

type ShowcaseStlViewerProps = {
  url: string
  label?: string
}

export function ShowcaseStlViewer({ url, label = "3D_PRINT" }: ShowcaseStlViewerProps) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 border border-foreground/10 bg-background/30" />

      <div className="absolute inset-0">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground/40 uppercase animate-pulse">
                loading.viewport
              </span>
            </div>
          }
        >
          <Canvas
            camera={{ position: [2.6, 1.5, 2.6], fov: 42, near: 0.01, far: 500 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
            dpr={[1, 1.25]}
          >
            <ambientLight intensity={0.45} />
            <directionalLight position={[6, 8, 5]} intensity={1.1} />
            <directionalLight position={[-4, -2, -3]} intensity={0.35} />
            <hemisphereLight args={["#e8e8e8", "#303030", 0.35]} />
            <StlScene url={url} />
            <OrbitControls
              enableZoom
              minDistance={0.35}
              maxDistance={12}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.55}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.05}
              enableDamping
              dampingFactor={0.08}
            />
            <Environment preset="studio" />
          </Canvas>
        </Suspense>
      </div>

      <span className="absolute top-2 left-3 font-mono text-[8px] tracking-[0.2em] text-muted-foreground/45 uppercase pointer-events-none">
        VIEWPORT
      </span>
      <span className="absolute top-2 right-3 font-mono text-[8px] tracking-[0.2em] text-muted-foreground/45 uppercase pointer-events-none">
        {label}
      </span>
      <span className="absolute bottom-2 right-3 font-mono text-[8px] tracking-[0.2em] text-muted-foreground/40 uppercase pointer-events-none hidden sm:block">
        DRAG / SCROLL
      </span>
    </div>
  )
}
