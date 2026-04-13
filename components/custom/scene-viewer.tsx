"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float } from "@react-three/drei"
import { Suspense, useState } from "react"
import * as THREE from "three"

// Procedural astronaut-like figure
function AstronautModel() {
  return (
    <group scale={0.6}>
      {/* Helmet */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.4} roughness={0.3} wireframe={false} />
      </mesh>
      {/* Visor */}
      <mesh position={[0, 1.1, 0.25]}>
        <sphereGeometry args={[0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.5]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Backpack */}
      <mesh position={[0, 0.3, -0.35]}>
        <boxGeometry args={[0.55, 0.7, 0.2]} />
        <meshStandardMaterial color="#b0b0b0" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.55, 0.3, 0]}>
        <capsuleGeometry args={[0.1, 0.6, 8, 8]} />
        <meshStandardMaterial color="#c8c8c8" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.55, 0.3, 0]}>
        <capsuleGeometry args={[0.1, 0.6, 8, 8]} />
        <meshStandardMaterial color="#c8c8c8" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Left leg */}
      <mesh position={[-0.2, -0.65, 0]}>
        <capsuleGeometry args={[0.12, 0.5, 8, 8]} />
        <meshStandardMaterial color="#c8c8c8" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.2, -0.65, 0]}>
        <capsuleGeometry args={[0.12, 0.5, 8, 8]} />
        <meshStandardMaterial color="#c8c8c8" metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  )
}

// Procedural gear
function GearModel() {
  const shape = new THREE.Shape()
  const teeth = 12
  const innerR = 0.35
  const outerR = 0.55
  const toothWidth = 0.12

  for (let i = 0; i < teeth; i++) {
    const angle = (i / teeth) * Math.PI * 2
    const nextAngle = ((i + 1) / teeth) * Math.PI * 2
    const midAngle = (angle + nextAngle) / 2

    const r1 = innerR
    const r2 = outerR

    shape.lineTo(Math.cos(angle) * r1, Math.sin(angle) * r1)
    shape.lineTo(Math.cos(angle + toothWidth) * r2, Math.sin(angle + toothWidth) * r2)
    shape.lineTo(Math.cos(midAngle) * r2, Math.sin(midAngle) * r2)
    shape.lineTo(Math.cos(midAngle + toothWidth * 0.5) * r1, Math.sin(midAngle + toothWidth * 0.5) * r1)
  }
  shape.closePath()

  // Center hole
  const hole = new THREE.Path()
  const holeSegments = 20
  for (let i = 0; i <= holeSegments; i++) {
    const a = (i / holeSegments) * Math.PI * 2
    if (i === 0) hole.moveTo(Math.cos(a) * 0.12, Math.sin(a) * 0.12)
    else hole.lineTo(Math.cos(a) * 0.12, Math.sin(a) * 0.12)
  }
  shape.holes.push(hole)

  return (
    <group scale={1.6}>
      <mesh>
        <extrudeGeometry args={[shape, { depth: 0.15, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 }]} />
        <meshStandardMaterial color="#d4d4d4" metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  )
}

// Procedural sci-fi turret
function TurretModel() {
  return (
    <group scale={0.55}>
      {/* Base */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.3, 8]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Turret body */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.5, 8]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Barrel housing */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.5]} />
        <meshStandardMaterial color="#b8b8b8" metalness={0.6} roughness={0.25} />
      </mesh>
      {/* Main barrel */}
      <mesh position={[0, 0.35, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.7, 8]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.8} roughness={0.15} />
      </mesh>
      {/* Secondary barrel */}
      <mesh position={[0.12, 0.35, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.04, 0.5, 8]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.8} roughness={0.15} />
      </mesh>
      {/* Sensor dome */}
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

function WireframeCube() {
  return (
    <mesh>
      <boxGeometry args={[2.8, 2.8, 2.8]} />
      <meshBasicMaterial color="#ffffff" wireframe opacity={0.06} transparent />
    </mesh>
  )
}

function ModelCarousel({ activeIndex }: { activeIndex: number }) {
  const models = [
    <AstronautModel key="astronaut" />,
    <GearModel key="gear" />,
    <TurretModel key="turret" />,
  ]

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        <WireframeCube />
        {models[activeIndex]}
      </group>
    </Float>
  )
}

const MODEL_LABELS = ["ASTRONAUT.stl", "GEAR.stl", "TURRET.stl"]

export function SceneViewer() {
  const [activeModel, setActiveModel] = useState(0)

  return (
    <div className="relative w-full aspect-square max-w-[520px]">
      {/* Glassmorphism container */}
      <div className="absolute inset-0 border border-glass/[0.08] bg-glass/[0.02] backdrop-blur-sm" />

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [3, 2, 3], fov: 40 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
          >
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <directionalLight position={[-3, -3, 2]} intensity={0.3} />
            <ModelCarousel activeIndex={activeModel} />
            <OrbitControls
              enableZoom={false}
              autoRotate
              autoRotateSpeed={1}
              enablePan={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
            />
            <Environment preset="studio" />
          </Canvas>
        </Suspense>
      </div>

      {/* Bottom HUD bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 border-t border-glass/[0.08] bg-glass/[0.03] backdrop-blur-md">
        <div className="flex gap-3">
          {MODEL_LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => setActiveModel(i)}
              className={`font-mono text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-all duration-300 ${
                activeModel === i
                  ? "border-foreground/40 text-foreground bg-foreground/5"
                  : "border-border/30 text-muted-foreground hover:border-foreground/20 hover:text-foreground/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50 hidden sm:block">
          {"DRAG TO ROTATE"}
        </span>
      </div>

      {/* Corner technical labels */}
      <span className="absolute top-3 left-4 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/40">
        {"VIEWPORT_01"}
      </span>
      <span className="absolute top-3 right-4 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/40">
        {"GL.RENDER"}
      </span>
    </div>
  )
}
