import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hobbies',
  description: 'A simple hobbies page',
}

export default function HobbiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
