/**
 * Showcase media in `public/images/showcase/`.
 * Paths are served at `/images/showcase/<filename>`.
 */
export const SHOWCASE_IMAGE_DIR = "/images/showcase"

export type ShowcaseProject = {
  id: string
  title: string
  tag: string
  /** Public URL path or CSS gradient fallback; also used as video poster when `video` is set */
  image: string
  /** Optional preview video (plays when card scrolls into view) */
  video?: string
  /** Optional poster override (defaults to `image` when it is a URL) */
  poster?: string
  /** Rotating stills with opacity crossfade (e.g. Saboriendo1 / Saboriendo2) */
  gallery?: string[]
  /** Interactive STL viewport (same pattern as /3d-print SceneViewer) */
  stl?: string
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
        image: showcaseImage("ZeroInbox-developer.jpg"),
        video: showcaseImage("ZeroInbox.mov"),
      },
      {
        id: "htic-shuttle",
        title: "HTIC Shuttle",
        tag: "Realtime",
        image: showcaseImage("HTIC-appstore.jpg"),
        video: showcaseImage("HTIC-appstore.mov"),
      },
      {
        id: "saboriendo",
        title: "Saboriendo",
        tag: "E-commerce",
        image: showcaseImage("Saboriendo1.jpg"),
        gallery: [showcaseImage("Saboriendo1.jpg"), showcaseImage("Saboriendo2.jpg")],
      },
      {
        id: "cyberedu",
        title: "CyberEdu",
        tag: "Cross-platform",
        image: showcaseImage("cyberedu-appstore.jpg"),
        video: showcaseImage("cyberedu.mov"),
      },
      {
        id: "matcha-time",
        title: "Matcha Time",
        tag: "macOS",
        image: showcaseImage("MatchaTime-appstore.jpg"),
        video: showcaseImage("Matchatime.mov"),
      },
      {
        id: "poker-percentage",
        title: "Poker Percentage",
        tag: "watchOS",
        image: showcaseImage("PokerPercentage-appstore.jpg"),
      },
      {
        id: "with",
        title: "With",
        tag: "On-device LLM",
        image:
          "linear-gradient(155deg, oklch(0.92 0 0) 0%, oklch(0.82 0.01 250) 40%, oklch(0.72 0.03 260) 100%)",
        video: showcaseImage("with.mov"),
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
        image:
          "linear-gradient(140deg, oklch(0.93 0.05 85) 0%, oklch(0.83 0.1 75) 50%, oklch(0.73 0.14 65) 100%)",
        video: showcaseImage("projectmanagement.mov"),
      },
      {
        id: "whiteboard-ai",
        title: "Whiteboard AI",
        tag: "Vision ML",
        image:
          "linear-gradient(130deg, oklch(0.9 0.04 300) 0%, oklch(0.8 0.08 290) 55%, oklch(0.68 0.12 280) 100%)",
        video: showcaseImage("whiteboardai.mov"),
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
        image:
          "linear-gradient(135deg, oklch(0.9 0.03 250) 0%, oklch(0.78 0.07 260) 45%, oklch(0.66 0.11 270) 100%)",
        stl: showcaseImage("3dprintmouse.stl"),
      },
      {
        id: "cpx",
        title: "CPX Lab",
        tag: "Publications",
        image:
          "linear-gradient(120deg, oklch(0.9 0.03 255) 0%, oklch(0.78 0.06 265) 50%, oklch(0.66 0.1 275) 100%)",
      },
    ],
  },
  {
    id: "web",
    label: "Web",
    projects: [
      {
        id: "saboriendo-web",
        title: "Saboriendo Web",
        tag: "React 19",
        image: showcaseImage("Saboriendo1.jpg"),
        gallery: [showcaseImage("Saboriendo1.jpg"), showcaseImage("Saboriendo2.jpg")],
      },
    ],
  },
]

export type ShowcaseProjectWithCategory = ShowcaseProject & {
  categoryId: string
  categoryLabel: string
}

function showcaseProjectKey(categoryId: string, projectId: string) {
  return `${categoryId}:${projectId}`
}

/** Featured first, then remaining projects in category order */
const SHOWCASE_PROJECT_ORDER: Array<[categoryId: string, projectId: string]> = [
  ["research", "3d-mouse"],
  ["ai", "whiteboard-ai"],
  ["mobile", "htic-shuttle"],
  ["mobile", "zero-inbox"],
]

function buildShowcaseProjects(): ShowcaseProjectWithCategory[] {
  const all = SHOWCASE_CATEGORIES.flatMap((category) =>
    category.projects.map((project) => ({
      ...project,
      categoryId: category.id,
      categoryLabel: category.label,
    }))
  )

  const byKey = new Map(
    all.map((project) => [showcaseProjectKey(project.categoryId, project.id), project])
  )

  const ordered: ShowcaseProjectWithCategory[] = []

  for (const [categoryId, projectId] of SHOWCASE_PROJECT_ORDER) {
    const key = showcaseProjectKey(categoryId, projectId)
    const project = byKey.get(key)
    if (project) {
      ordered.push(project)
      byKey.delete(key)
    }
  }

  for (const project of all) {
    const key = showcaseProjectKey(project.categoryId, project.id)
    if (byKey.has(key)) {
      ordered.push(project)
      byKey.delete(key)
    }
  }

  return ordered
}

export const SHOWCASE_PROJECTS = buildShowcaseProjects()
