import React from "react"
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leonardo da Vinci | The Universal Genius",
  description:
    "Explore the extraordinary legacy of Leonardo da Vinci - painter, sculptor, architect, musician, mathematician, engineer, inventor, anatomist, geologist, botanist, and writer.",
  keywords: [
    "Leonardo da Vinci",
    "Renaissance",
    "Mona Lisa",
    "The Last Supper",
    "Vitruvian Man",
    "art",
    "portfolio",
  ],
  authors: [{ name: "Leonardo da Vinci Portfolio" }],
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f0e8" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1612" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
