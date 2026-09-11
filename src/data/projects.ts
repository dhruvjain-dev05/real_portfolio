export interface ProjectData {
  banner: string;
  name: string;
  desc: string;
  tech: string[];
  github: string;
  live?: string;
  isUnderDevelopment?: boolean;
  isPrivate?: boolean;
  stats?: string;
}

export const featuredProjects: ProjectData[] = [
  {
    banner: "",
    name: "Project One",
    desc: "A short one to two sentence description of what this project does and why it matters.",
    tech: ["TypeScript", "Next.js", "PostgreSQL", "Tailwind"],
    github: "https://github.com/yourusername/project-one",
    live: "https://project-one.example.com",
    stats: "1200+ signups",
  },
  {
    banner: "",
    name: "Project Two",
    desc: "Open source library or tool with a focused, single-purpose description.",
    tech: ["JavaScript", "React", "Vite"],
    github: "https://github.com/yourusername/project-two",
    live: "https://project-two.example.com",
    stats: "4k+ downloads",
  },
  {
    banner: "",
    name: "Project Three",
    desc: "A side project still in progress, showing what's coming next.",
    tech: ["Node.js", "MongoDB", "Express"],
    github: "https://github.com/yourusername/project-three",
    isUnderDevelopment: true,
  },
];

export const additionalProjects: ProjectData[] = [
  {
    banner: "",
    name: "Project Four",
    desc: "Another shipped project worth showing on the full projects page.",
    tech: ["React", "Node.js"],
    github: "https://github.com/yourusername/project-four",
    live: "https://project-four.example.com",
  },
];

export const allProjects: ProjectData[] = [...featuredProjects, ...additionalProjects];
