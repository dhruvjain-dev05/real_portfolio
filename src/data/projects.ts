export interface ProjectData {
  banner: string;
  // short type label shown on the card, e.g. "AI · RAG platform"
  kind?: string;
  // optional dark-theme twin of `banner`: when set, `banner` is shown in light
  // mode and this one in dark mode
  bannerDark?: string;
  name: string;
  desc: string;
  tech: string[];
  github?: string; // omit when the repo is private / not public
  live?: string;
  isUnderDevelopment?: boolean;
  isPrivate?: boolean;
  stats?: string;
}

// banner: path to a landing-page screenshot in /public, e.g.
// "/images/projects/mealswitch.png" — empty shows the "preview" placeholder.
export const featuredProjects: ProjectData[] = [
  {
    banner: "/images/projects/knowrex-light.webp",
    bannerDark: "/images/projects/knowrex-dark.webp",
    name: "Knowrex",
    kind: "AI · RAG platform",
    desc: "Full-stack RAG support platform that streams source-cited answers, retrieves semantically with Pinecone, caches with Redis and hands low-confidence queries to human support.",
    tech: ["Next.js", "TypeScript", "Pinecone", "RAG", "Redis", "Supabase", "Docker"],
    github: "https://github.com/dhruvjain-dev05/Knowrex",
    live: "https://knowrex.vercel.app/",
    stats: "sub-2s responses",
  },
  {
    banner: "/images/projects/mealswitch.webp",
    name: "MealSwitch",
    kind: "AI · Recommendation engine",
    desc: "Recommendation engine for low-glycemic, macro-optimized food substitutions, using TF-IDF and cosine similarity with a guard-railed Gemini LLM and a FastAPI backend.",
    tech: ["FastAPI", "Python", "React", "Gemini API", "Scikit-learn", "PostgreSQL"],
    github: "https://github.com/dhruvjain-dev05/MealSwitch",
    live: "https://meal-switch.vercel.app/",
  },
  {
    banner: "/images/projects/salonwallah.webp",
    name: "SalonWallah",
    kind: "Mobile · Real-time queue",
    desc: "Real-time salon queue and booking system with separate client and stylist apps, commute-aware dispatching, live Socket.io syncing and Razorpay payments.",
    tech: ["React Native", "TypeScript", "Node.js", "MongoDB", "Redis", "WebSockets", "AWS EC2"],
    // repo is private / not public — add `github: "…"` once it is
    live: "https://www.salonwallah.in/",
    stats: "8 min wait times",
  },
];

export const additionalProjects: ProjectData[] = [];

export const allProjects: ProjectData[] = [...featuredProjects, ...additionalProjects];
