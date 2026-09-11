export interface ExperienceEntry {
  company: string;
  companyUrl?: string;
  role: string;
  dates: string;
  status: "present" | "past" | "future";
  logoUrl?: string;
  description: string[];
}

export const experience: ExperienceEntry[] = [
  {
    company: "Wallnut Building Solutions",
    role: "Full Stack Engineer Intern",
    dates: "Jun 2026 - Present",
    status: "present",
    description: [
      "Turning real-world requirements into scalable, production-ready solutions.",
      "Working across full-stack development, web systems, backend engineering, AWS, and AI/LLM applications.",
    ],
  },
];
