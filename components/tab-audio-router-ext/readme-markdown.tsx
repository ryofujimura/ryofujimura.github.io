"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

/** Resolves relative README image paths to the GitHub raw tree. */
const REPO_RAW_BASE =
  "https://raw.githubusercontent.com/ryofujimura/tab-audio-router-ext/main"

function resolveImageSrc(src: string | undefined): string {
  if (!src) return ""
  if (src.startsWith("http://") || src.startsWith("https://")) return src
  const path = src.replace(/^\.\//, "")
  return `${REPO_RAW_BASE}/${path}`
}

export function ReadmeMarkdown({ source }: { source: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold tracking-tight mt-10 mb-4 first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold tracking-tight mt-10 mb-3 border-b border-border pb-2">
            {children}
          </h2>
        ),
        p: ({ children }) => <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-border pl-4 my-4 italic text-foreground/90">
            {children}
          </blockquote>
        ),
        ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-muted-foreground">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        hr: () => <hr className="my-10 border-border" />,
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded-sm text-foreground">{children}</code>
        ),
        img: ({ src, alt }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolveImageSrc(src)}
            alt={alt ?? ""}
            className="rounded-lg border border-border max-w-full h-auto my-6"
          />
        ),
        strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
      }}
    >
      {source}
    </ReactMarkdown>
  )
}
