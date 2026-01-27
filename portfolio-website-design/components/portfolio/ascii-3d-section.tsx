"use client"

import { useRef, useEffect } from "react"
import { AsciiSectionHeader } from "@/components/ascii-banner"
import { AsciiObjRenderer } from "@/components/ascii-obj-renderer"
import { AnimatedSection } from "@/components/animated-section"

/** OBJ → ASCII 3D demo: load OBJ, project to 2D, map depth/brightness to ASCII. */
export function Ascii3DSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="ascii-3d"
      ref={containerRef}
      className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 overflow-hidden bg-secondary/20"
    >
      <div className="max-w-4xl mx-auto relative z-10">
        <AnimatedSection>
          <AsciiSectionHeader number="03b" title="ASCII 3D" />
        </AnimatedSection>
        <AnimatedSection delay={100}>
          <p className="text-sm sm:text-base text-muted-foreground font-mono mb-6 max-w-2xl">
            &gt; OBJ → 2D projection → depth/light → ASCII ramp{" "}
            <span className="text-foreground/60">( .:-=+*#%@ )</span>. Monospace = equal-width chars.{" "}
            <a
              href="https://alexharri.com/blog/ascii-rendering"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Shape-based rendering
            </a>{" "}
            uses character shape, not just brightness.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={200}>
          <div className="rounded border border-foreground/20 overflow-hidden bg-background/90 inline-block max-w-full">
            <AsciiObjRenderer
              width={56}
              height={28}
              objUrl={null}
              animate={true}
              speed={0.4}
              className="min-w-[240px] max-h-[180px]"
              aria-label="Live ASCII 3D cube"
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
