import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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
}

export const viewport: Viewport = {
  themeColor: '#f8f9fa',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
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
      </body>
    </html>
  )
}
