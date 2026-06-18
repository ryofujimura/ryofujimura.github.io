import type { Metadata } from "next"
import { TabAudioRouterDocShell } from "@/components/tab-audio-router-ext/doc-shell"

export const metadata: Metadata = {
  title: "Privacy Policy | Tab Audio Router",
  description: "Privacy policy for the Tab Audio Router browser extension and this documentation page.",
}

export default function TabAudioRouterPrivacyPage() {
  return (
    <TabAudioRouterDocShell title="Privacy policy">
      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <p className="text-sm text-foreground/80">Last updated: April 20, 2026</p>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Extension</h2>
          <p>
            Tab Audio Router is a Chromium extension that lets you choose an audio output for individual{" "}
            <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded-sm text-foreground">
              &lt;audio&gt;
            </code>{" "}
            /{" "}
            <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded-sm text-foreground">
              &lt;video&gt;
            </code>{" "}
            elements from the context menu. The published{" "}
            <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded-sm text-foreground">
              manifest.json
            </code>{" "}
            for the project declares permissions:{" "}
            <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded-sm text-foreground">
              activeTab
            </code>
            ,{" "}
            <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded-sm text-foreground">
              contextMenus
            </code>
            , and{" "}
            <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded-sm text-foreground">
              scripting
            </code>
            .
          </p>
          <p>
            The browser may prompt for microphone-related permission so Chromium can enumerate and label audio output
            devices; routing uses the Web Audio / media APIs available to the page, not a separate server operated by
            this project.
          </p>
          <p>
            The extension does not define remote endpoints in its manifest for this project’s copy of the code; audio
            routing happens locally in your browser. If you install the extension from source or a store listing, refer
            to that distribution for any additional disclosures the publisher adds there.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">This documentation page</h2>
          <p>
            This page is hosted on the same site as the rest of{" "}
            <span className="text-foreground">ryo.twelveforty.xyz</span>. The site root layout may load Firebase
            Analytics when enabled for the portfolio. See your browser’s controls and Firebase/Google documentation for
            how that product handles data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Contact</h2>
          <p>
            For questions about this policy or the extension, use the contact options listed on the main portfolio site.
          </p>
        </section>
      </div>
    </TabAudioRouterDocShell>
  )
}
