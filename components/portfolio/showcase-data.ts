export type ThemeTokens = {
  bg: string
  fg: string
  muted: string
  border: string
  cursorBg: string
  cursorFg: string
}

export type ShowcaseProject = {
  id: string
  title: string
  tag: string
  image: string
}

export type ShowcaseCategory = {
  id: string
  label: string
  theme: ThemeTokens
  projects: ShowcaseProject[]
}

export const SHOWCASE_CATEGORIES: ShowcaseCategory[] = [
  {
    id: "mobile",
    label: "Mobile",
    theme: {
      bg: "#0c0c0c",
      fg: "#f2f2f2",
      muted: "rgba(242,242,242,0.42)",
      border: "rgba(242,242,242,0.14)",
      cursorBg: "#f2f2f2",
      cursorFg: "#0c0c0c",
    },
    projects: [
      {
        id: "zero-inbox",
        title: "Zero Inbox",
        tag: "Swift / AI",
        image: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      },
      {
        id: "htic-shuttle",
        title: "HTIC Shuttle",
        tag: "Realtime",
        image: "linear-gradient(160deg, #0d1b2a 0%, #1b263b 45%, #415a77 100%)",
      },
      {
        id: "saboriendo",
        title: "Saboriendo",
        tag: "E-commerce",
        image: "linear-gradient(145deg, #2d1f0f 0%, #5c3d1e 50%, #8b5a2b 100%)",
      },
      {
        id: "cyberedu",
        title: "CyberEdu",
        tag: "Cross-platform",
        image: "linear-gradient(120deg, #0b1320 0%, #1c2541 60%, #3a506b 100%)",
      },
      {
        id: "with",
        title: "With",
        tag: "On-device LLM",
        image: "linear-gradient(155deg, #121212 0%, #2d2d2d 40%, #4a4a4a 100%)",
      },
    ],
  },
  {
    id: "ai",
    label: "AI / ML",
    theme: {
      bg: "#0f0e0a",
      fg: "#f5f0e6",
      muted: "rgba(245,240,230,0.45)",
      border: "rgba(245,240,230,0.16)",
      cursorBg: "#e8c547",
      cursorFg: "#0f0e0a",
    },
    projects: [
      {
        id: "research-pm",
        title: "Research Lab PM",
        tag: "Serverless AI",
        image: "linear-gradient(140deg, #1a1408 0%, #3d2e0a 50%, #6b4f12 100%)",
      },
      {
        id: "whiteboard-ai",
        title: "Whiteboard AI",
        tag: "Vision ML",
        image: "linear-gradient(130deg, #0f0a1a 0%, #2a1a3d 55%, #4a2d6b 100%)",
      },
      {
        id: "zero-inbox-ai",
        title: "Zero Inbox",
        tag: "Classification",
        image: "linear-gradient(125deg, #0a1628 0%, #1e3a5f 50%, #2d5a87 100%)",
      },
      {
        id: "with-llm",
        title: "With",
        tag: "GGUF / llama.cpp",
        image: "linear-gradient(150deg, #14100a 0%, #2a2218 50%, #443828 100%)",
      },
    ],
  },
  {
    id: "research",
    label: "Research",
    theme: {
      bg: "#080b10",
      fg: "#e8eef5",
      muted: "rgba(232,238,245,0.44)",
      border: "rgba(232,238,245,0.14)",
      cursorBg: "#6eb5ff",
      cursorFg: "#080b10",
    },
    projects: [
      {
        id: "3d-mouse",
        title: "3D-Printed Mouse",
        tag: "ACM ICCPS 2025",
        image: "linear-gradient(135deg, #0a1018 0%, #1a2a40 45%, #2d4a6e 100%)",
      },
      {
        id: "hci",
        title: "Personalized HCI",
        tag: "Ergonomics",
        image: "linear-gradient(145deg, #101820 0%, #243040 55%, #3d5068 100%)",
      },
      {
        id: "cpx",
        title: "CPX Lab",
        tag: "Publications",
        image: "linear-gradient(120deg, #0c1218 0%, #1e2d3d 50%, #34506a 100%)",
      },
    ],
  },
  {
    id: "web",
    label: "Web",
    theme: {
      bg: "#0a0f0a",
      fg: "#eef5ee",
      muted: "rgba(238,245,238,0.42)",
      border: "rgba(238,245,238,0.14)",
      cursorBg: "#5cdb7a",
      cursorFg: "#0a0f0a",
    },
    projects: [
      {
        id: "stl-portfolio",
        title: "STL Portfolio",
        tag: "Three.js",
        image: "linear-gradient(140deg, #0a120a 0%, #1a2e1a 50%, #2d4a2d 100%)",
      },
      {
        id: "danshari",
        title: "Danshari",
        tag: "Next.js",
        image: "linear-gradient(155deg, #0f140f 0%, #243024 55%, #3d503d 100%)",
      },
      {
        id: "tokai-shuttle",
        title: "Tokai Shuttle Web",
        tag: "Firebase",
        image: "linear-gradient(130deg, #081018 0%, #142030 50%, #284060 100%)",
      },
      {
        id: "saboriendo-web",
        title: "Saboriendo Web",
        tag: "React 19",
        image: "linear-gradient(145deg, #141008 0%, #302818 50%, #504030 100%)",
      },
    ],
  },
]
