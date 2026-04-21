import React from "react"
import type { Metadata, Viewport } from "next"
import { JetBrains_Mono, Space_Grotesk } from "next/font/google"
import "./3d-print.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-stl-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-stl-mono",
})

export const metadata: Metadata = {
  title: "STL Portfolio | 3D Model Showcase",
  description:
    "A brutalist, futuristic portfolio for showcasing STL 3D models with interactive viewer, AR preview, and slicing capabilities.",
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
}

export default function ThreeDPrintLandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`page-3d-print min-h-screen overflow-x-hidden antialiased ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      {children}
    </div>
  )
}
