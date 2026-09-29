import type { IconType } from "react-icons";
import { DiJava, DiAws } from "react-icons/di";
import { BsRobot } from "react-icons/bs";
import {
  SiGit,
  SiPython,
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiExpo,
  SiTailwindcss,
  SiFastapi,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiDocker,
  SiPostman,
} from "react-icons/si";
import { FaGithub, FaAws } from "react-icons/fa6";
import { HiOutlineDatabase } from "react-icons/hi";

export interface SkillItem {
  name: string;
  icon: IconType;
  color: string;
}

// Intentionally short — this reflects only what's confirmed from your
// LinkedIn "Top skills" (Java, AWS, AI/LLM). You said the full stack list
// is coming separately; add it to this array once you send it.
export const technologies: SkillItem[] = [
  { name: "Java", icon: DiJava, color: "#f89820" },
  { name: "AWS", icon: DiAws, color: "#FF9900" },
  { name: "AI / LLMs", icon: BsRobot, color: "#8b5cf6" },
];

export const tools: SkillItem[] = [
  { name: "Git", icon: SiGit, color: "#F05032" },
  { name: "GitHub", icon: FaGithub, color: "currentColor" },
];

// Grouped skills from the resume's "Technical Skills" block — drives the
// tabbed grid in SkillSection. Marks that are black in their official form
// use currentColor so they stay visible in both themes.
export interface SkillGroup {
  label: string;
  items: SkillItem[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "Java", icon: DiJava, color: "#f89820" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "SQL", icon: HiOutlineDatabase, color: "#0EA5E9" },
    ],
  },
  {
    label: "Frontend",
    items: [
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, color: "currentColor" },
      { name: "React Native", icon: SiReact, color: "#61DAFB" },
      { name: "Expo", icon: SiExpo, color: "currentColor" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
    ],
  },
  {
    label: "Backend & Data",
    items: [
      { name: "FastAPI", icon: SiFastapi, color: "#009688" },
      { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
      { name: "Express", icon: SiExpress, color: "currentColor" },
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "Redis", icon: SiRedis, color: "#DC382D" },
    ],
  },
  {
    label: "Cloud & Tools",
    items: [
      { name: "AWS", icon: FaAws, color: "#FF9900" },
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: FaGithub, color: "currentColor" },
      { name: "Postman", icon: SiPostman, color: "#FF6C37" },
    ],
  },
];
