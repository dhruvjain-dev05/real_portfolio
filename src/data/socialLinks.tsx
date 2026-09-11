import {
  FaXTwitter,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaMedium,
} from "react-icons/fa6";
import { HiOutlineDocumentDownload, HiOutlineMail } from "react-icons/hi";
import type { IconType } from "react-icons";

export interface SocialLink {
  name: string;
  url: string;
  icon: IconType;
  color: string;
}

export const socialLinks: SocialLink[] = [
  { name: "Twitter", url: "https://x.com/yourhandle", icon: FaXTwitter, color: "#1DA1F2" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/dhruv-jain05/", icon: FaLinkedin, color: "#0077B5" },
  { name: "GitHub", url: "https://github.com/Aotgoku", icon: FaGithub, color: "currentColor" },
  { name: "Instagram", url: "https://instagram.com/yourhandle", icon: FaInstagram, color: "#E4405F" },
  { name: "Medium", url: "https://medium.com/@yourhandle", icon: FaMedium, color: "currentColor" },
  { name: "Email", url: "mailto:you@example.com", icon: HiOutlineMail, color: "#f59e0b" },
  { name: "Resume", url: "/resume/resume.pdf", icon: HiOutlineDocumentDownload, color: "#22c55e" },
];

export const heroSocialLinks = socialLinks.filter((l) =>
  ["GitHub", "Resume", "Medium", "Instagram", "LinkedIn"].includes(l.name)
);
