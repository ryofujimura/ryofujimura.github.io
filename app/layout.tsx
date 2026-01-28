import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { FirebaseAnalytics } from '@/components/firebase-analytics'
import './globals.css'

const _inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  title: 'Ryo Fujimura | Software Engineer & AI Researcher',
  description: 'Software engineer specializing in AI/ML, mobile development, and full-stack engineering. Published researcher with experience at Bose, Honda, and CSULB.',
  generator: 'v0.app',
  keywords: ['software engineer', 'AI researcher', 'machine learning', 'iOS developer', 'full-stack engineer'],
  authors: [{ name: 'Ryo Fujimura' }],
  openGraph: {
    title: 'Ryo Fujimura | Software Engineer & AI Researcher',
    description: 'Software engineer specializing in AI/ML, mobile development, and full-stack engineering.',
    type: 'website',
  },
  icons: {
    icon: '/images/rflogoblack.png',
    apple: '/images/rflogoblack.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#f8f9fa',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
        <FirebaseAnalytics />
      </body>
    </html>
  )
}
