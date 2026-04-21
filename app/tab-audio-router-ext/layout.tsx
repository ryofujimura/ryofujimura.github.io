import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Tab Audio Router",
  description:
    "Browser extension to send each tab’s audio to a different output device on Mac. Documentation from the project README.",
}

export default function TabAudioRouterLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children
}
