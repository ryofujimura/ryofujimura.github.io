"use client"

import dynamic from "next/dynamic"
import { AsciiBackground } from "@/components/3d-print/ascii-background"
import { GridOverlay } from "@/components/3d-print/grid-overlay"
import { NavHeader } from "@/components/3d-print/nav-header"
import { HeroSection } from "@/components/3d-print/hero-section"
import { FeatureCards } from "@/components/3d-print/feature-cards"
import { SiteFooter } from "@/components/3d-print/site-footer"

const SceneViewer = dynamic(
  () => import("@/components/3d-print/scene-viewer").then((mod) => mod.SceneViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-square max-w-[520px] border border-border/20 flex items-center justify-center bg-background/50">
        <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/40 uppercase animate-pulse">
          loading.viewport
        </span>
      </div>
    ),
  }
)

export default function ThreeDPrintPage() {
  return (
    <>
      <AsciiBackground />
      <GridOverlay />

      <NavHeader />

      <main className="relative z-10">
        <section className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 px-6 sm:px-10 pt-24 pb-16">
          <HeroSection />
          <SceneViewer />
        </section>

        <section className="px-6 sm:px-10 max-w-7xl mx-auto pb-20">
          <FeatureCards />
        </section>

        <div className="border-t border-b border-border/15 py-4 overflow-hidden">
          <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-8 shrink-0">
                <TechSpec label="FORMAT" value=".STL / .OBJ / .STEP" />
                <TechSpec label="PRECISION" value="0.001mm" />
                <TechSpec label="TRIANGLES" value="124,847" />
                <TechSpec label="FILE SIZE" value="2.4MB" />
                <TechSpec label="MANIFOLD" value="WATERTIGHT" />
                <TechSpec label="SCALE" value="1:1" />
                <span className="font-mono text-[9px] text-muted-foreground/15">{"////"}</span>
              </div>
            ))}
          </div>
        </div>

        <SiteFooter />
      </main>
    </>
  )
}

function TechSpec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="font-mono text-[8px] tracking-[0.3em] text-muted-foreground/25 uppercase">
        {label}
      </span>
      <span className="font-mono text-[9px] tracking-[0.15em] text-muted-foreground/40 uppercase">
        {value}
      </span>
    </div>
  )
}
