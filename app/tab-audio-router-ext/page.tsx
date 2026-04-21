import { readFile } from "node:fs/promises"
import path from "node:path"
import { TabAudioRouterDocShell } from "@/components/tab-audio-router-ext/doc-shell"
import { ReadmeMarkdown } from "@/components/tab-audio-router-ext/readme-markdown"

export default async function TabAudioRouterPage() {
  const filePath = path.join(process.cwd(), "content/tab-audio-router-ext/README.md")
  const source = await readFile(filePath, "utf8")

  return (
    <TabAudioRouterDocShell title="Overview">
      <article className="max-w-none">
        <ReadmeMarkdown source={source} />
      </article>
    </TabAudioRouterDocShell>
  )
}
