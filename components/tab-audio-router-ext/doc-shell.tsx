import Link from "next/link"
import type { ReactNode } from "react"

export function TabAudioRouterDocShell({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Tab Audio Router
            </p>
            <h1 className="text-2xl font-semibold tracking-tight mt-1">{title}</h1>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
              Home
            </Link>
            <Link
              href="/tab-audio-router-ext/"
              className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
            >
              Extension
            </Link>
            <Link
              href="/tab-audio-router-ext/privacy-policy/"
              className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
            >
              Privacy
            </Link>
          </nav>
        </header>
        {children}
      </div>
    </main>
  )
}
