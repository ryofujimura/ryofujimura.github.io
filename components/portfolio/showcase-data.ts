/**
 * Showcase thumbnails live in `public/images/showcase/`.
 * Served at `/images/showcase/<filename>` (e.g. zero-inbox.jpg).
 *
 * Set `image` to a path (`/images/showcase/zero-inbox.jpg`) or a CSS gradient fallback.
 */
export const SHOWCASE_IMAGE_DIR = "/images/showcase"

export type ShowcaseProject = {
  id: string
  title: string
  tag: string
  /** Public URL path or CSS gradient */
  image: string
}

export function showcaseImage(filename: string) {
  return `${SHOWCASE_IMAGE_DIR}/${filename}`
}

export type ShowcaseCategory = {
  id: string
  label: string
  projects: ShowcaseProject[]
}

export const SHOWCASE_CATEGORIES: ShowcaseCategory[] = [
  {
    id: "mobile",
    label: "Mobile",
    projects: [
      {
        id: "zero-inbox",
        title: "Zero Inbox",
        tag: "Swift / AI",
        image: "linear-gradient(135deg, oklch(0.88 0.04 250) 0%, oklch(0.78 0.08 260) 50%, oklch(0.65 0.12 270) 100%)",
      },
      {
        id: "htic-shuttle",
        title: "HTIC Shuttle",
        tag: "Realtime",
        image: "linear-gradient(160deg, oklch(0.9 0.03 240) 0%, oklch(0.8 0.06 250) 45%, oklch(0.7 0.1 260) 100%)",
      },
      {
        id: "saboriendo",
        title: "Saboriendo",
        tag: "E-commerce",
        image: "linear-gradient(145deg, oklch(0.92 0.04 75) 0%, oklch(0.82 0.08 65) 50%, oklch(0.72 0.12 55) 100%)",
      },
      {
        id: "cyberedu",
        title: "CyberEdu",
        tag: "Cross-platform",
        image: "linear-gradient(120deg, oklch(0.9 0.03 230) 0%, oklch(0.8 0.06 250) 60%, oklch(0.68 0.1 270) 100%)",
      },
      {
        id: "with",
        title: "With",
        tag: "On-device LLM",
        image: "linear-gradient(155deg, oklch(0.92 0 0) 0%, oklch(0.82 0.01 250) 40%, oklch(0.72 0.03 260) 100%)",
      },
    ],
  },
  {
    id: "ai",
    label: "AI / ML",
    projects: [
      {
        id: "research-pm",
        title: "Research Lab PM",
        tag: "Serverless AI",
        image: "linear-gradient(140deg, oklch(0.93 0.05 85) 0%, oklch(0.83 0.1 75) 50%, oklch(0.73 0.14 65) 100%)",
      },
      {
        id: "whiteboard-ai",
        title: "Whiteboard AI",
        tag: "Vision ML",
        image: "linear-gradient(130deg, oklch(0.9 0.04 300) 0%, oklch(0.8 0.08 290) 55%, oklch(0.68 0.12 280) 100%)",
      },
      {
        id: "zero-inbox-ai",
        title: "Zero Inbox",
        tag: "Classification",
        image: "linear-gradient(125deg, oklch(0.9 0.03 250) 0%, oklch(0.78 0.08 260) 50%, oklch(0.66 0.12 270) 100%)",
      },
      {
        id: "with-llm",
        title: "With",
        tag: "GGUF / llama.cpp",
        image: "linear-gradient(150deg, oklch(0.92 0.03 70) 0%, oklch(0.82 0.06 60) 50%, oklch(0.72 0.09 50) 100%)",
      },
    ],
  },
  {
    id: "research",
    label: "Research",
    projects: [
      {
        id: "3d-mouse",
        title: "3D-Printed Mouse",
        tag: "ACM ICCPS 2025",
        image: "linear-gradient(135deg, oklch(0.9 0.03 250) 0%, oklch(0.78 0.07 260) 45%, oklch(0.66 0.11 270) 100%)",
      },
      {
        id: "hci",
        title: "Personalized HCI",
        tag: "Ergonomics",
        image: "linear-gradient(145deg, oklch(0.91 0.02 240) 0%, oklch(0.8 0.05 250) 55%, oklch(0.68 0.09 260) 100%)",
      },
      {
        id: "cpx",
        title: "CPX Lab",
        tag: "Publications",
        image: "linear-gradient(120deg, oklch(0.9 0.03 255) 0%, oklch(0.78 0.06 265) 50%, oklch(0.66 0.1 275) 100%)",
      },
    ],
  },
  {
    id: "web",
    label: "Web",
    projects: [
      {
        id: "stl-portfolio",
        title: "STL Portfolio",
        tag: "Three.js",
        image: "linear-gradient(140deg, oklch(0.91 0.04 145) 0%, oklch(0.8 0.08 150) 50%, oklch(0.68 0.12 155) 100%)",
      },
      {
        id: "danshari",
        title: "Danshari",
        tag: "Next.js",
        image: "linear-gradient(155deg, oklch(0.92 0.03 160) 0%, oklch(0.8 0.07 165) 55%, oklch(0.68 0.1 170) 100%)",
      },
      {
        id: "tokai-shuttle",
        title: "Tokai Shuttle Web",
        tag: "Firebase",
        image: "linear-gradient(130deg, oklch(0.9 0.03 245) 0%, oklch(0.78 0.07 255) 50%, oklch(0.66 0.11 265) 100%)",
      },
      {
        id: "saboriendo-web",
        title: "Saboriendo Web",
        tag: "React 19",
        image: "linear-gradient(145deg, oklch(0.92 0.04 80) 0%, oklch(0.8 0.08 70) 50%, oklch(0.68 0.11 60) 100%)",
      },
    ],
  },
]
