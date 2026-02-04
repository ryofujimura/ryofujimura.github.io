"use client"

import {
  LeonardoNotebook,
  AsciiDiagram,
  MirrorText,
  SpecAnnotation,
  TechnicalDrawing,
  AsciiShapes,
} from "@/components/leonardo-notebook"

export default function LeonardoPage() {
  return (
    <main className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <LeonardoNotebook folioRef="RF-001" date="2025">
          <h1 className="font-mono text-sm sm:text-base font-semibold text-foreground/90 mb-4 border-b border-foreground/20 pb-2">
            Leonardo-style notebook
          </h1>
          <p className="font-mono text-[9px] xs:text-[10px] sm:text-xs text-foreground/70 mb-6 leading-relaxed">
            A page in the spirit of da Vinci — aged paper, diagrams, and annotations.
          </p>

          <AsciiDiagram title="Geometric study" spec="circle r=5">
            {AsciiShapes.circle(5)}
          </AsciiDiagram>

          <div className="mt-6 space-y-2">
            <SpecAnnotation label="Scale" value="1:1" unit="—" notes="reference" />
            <SpecAnnotation label="Radius" value={5} unit="units" />
          </div>

          <div className="mt-6">
            <MirrorText>
              Notes and sketches — as if written in mirror hand.
            </MirrorText>
          </div>

          <div className="mt-6">
            <TechnicalDrawing
              title="Vitruvian study"
              asciiArt={AsciiShapes.vitruvian()}
              measurements={[
                { label: "Span", value: "1", unit: "arm" },
                { label: "Height", value: "1", unit: "height" },
              ]}
              notes="Proportions after Vitruvius."
            />
          </div>
        </LeonardoNotebook>
      </div>
    </main>
  )
}
