import { FaXTwitter, FaLinkedin, FaGithub } from "react-icons/fa6";
import { HiOutlineDocumentDownload, HiOutlineMail } from "react-icons/hi";
import type { IconType } from "react-icons";
import { profile } from "./profile";

export interface SocialLink {
  name: string;
  url: string;
  icon: IconType;
  color: string;
}

export const socialLinks: SocialLink[] = [
  { name: "LinkedIn", url: "https://www.linkedin.com/in/dhruv-jain05", icon: FaLinkedin, color: "#0077B5" },
  { name: "GitHub", url: "https://github.com/dhruvjain-dev05", icon: FaGithub, color: "currentColor" },
  { name: "X", url: "https://x.com/DhruvJa44947128", icon: FaXTwitter, color: "currentColor" },
  { name: "Email", url: "mailto:dhruvrakeshjain@gmail.com", icon: HiOutlineMail, color: "#f59e0b" },
  { name: "Resume", url: profile.resumeUrl, icon: HiOutlineDocumentDownload, color: "#22c55e" },
];

export const heroSocialLinks = socialLinks.filter((l) => ["GitHub", "LinkedIn", "X", "Resume"].includes(l.name));
