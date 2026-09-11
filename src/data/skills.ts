import type { IconType } from "react-icons";
import { DiJava, DiAws } from "react-icons/di";
import { BsRobot } from "react-icons/bs";
import { SiGit } from "react-icons/si";
import { FaGithub } from "react-icons/fa6";

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
