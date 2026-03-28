import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { DanshariProviders } from "@/components/danshari/danshari-providers"
import "./danshari-theme.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Claim | Danshari",
  description: "Browse and claim products",
  icons: {
    icon: [{ url: "/danshari/icon.svg", type: "image/svg+xml" }],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f5f5f7",
}

export default function DanshariLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <DanshariProviders>
      <div className={`danshari-app min-h-screen ${inter.variable} font-sans`}>
        {children}
      </div>
    </DanshariProviders>
  )
}
