"use client"

import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { Suspense, useLayoutEffect, useRef } from "react"
import * as THREE from "three"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"

const CAD_TO_THREE = [-Math.PI / 2, 0, 0] as const

/** Normalized mesh span — higher fills more of the hero headline frame */
const FIT_SIZE = 5.6

/** Same asset as ~/Downloads/a1mini.stl (served from public/) */
export const HERO_BACKDROP_STL_URL = "/3d-print/models/a1mini.stl"

function BackdropStl({ url }: { url: string }) {
  const geometry = useLoader(STLLoader, url)
  const meshRef = useRef<THREE.Mesh>(null)
  const spinRef = useRef<THREE.Group>(null)

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

  useFrame((_, delta) => {
    if (spinRef.current) spinRef.current.rotation.y += delta * 0.12
  })

  return (
    <group ref={spinRef} position={[-0.85, 0, 0]} rotation={CAD_TO_THREE}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#9a9a9a"
          metalness={0.45}
          roughness={0.42}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function BackdropScene({ url }: { url: string }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 6, 4]} intensity={0.9} />
      <directionalLight position={[-3, -2, -2]} intensity={0.35} />
      <BackdropStl url={url} />
    </>
  )
}

type HeroStlBackdropProps = {
  url?: string
  className?: string
}

export function HeroStlBackdrop({ url = HERO_BACKDROP_STL_URL, className }: HeroStlBackdropProps) {
  return (
    <div className={className} aria-hidden>
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [2.05, 1.45, 2.05], fov: 40, near: 0.01, far: 200 }}
          gl={{ antialias: true, alpha: true }}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            background: "transparent",
            pointerEvents: "none",
            touchAction: "none",
            userSelect: "none",
          }}
          dpr={[1, 1.75]}
        >
          <BackdropScene url={url} />
        </Canvas>
      </Suspense>
    </div>
  )
}
