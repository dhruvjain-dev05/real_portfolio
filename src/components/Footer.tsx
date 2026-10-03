"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BackToTopKick from "@/components/football/BackToTopKick";
import SocialButton from "@/components/SocialButton";
import VisitorCounter from "@/components/VisitorCounter";
import { profile } from "@/data/profile";
import { socialLinks } from "@/data/socialLinks";

const pages = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
  { href: "/analytics", label: "Analytics" },
  { href: "/support", label: "Support" },
];

// the Contact section just above already carries the email, so it is left out here
const connect = socialLinks.filter((l) => l.name !== "Email");

export default function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        })
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="relative mx-auto w-full max-w-[800px] overflow-hidden">
      <div className="flex flex-col items-center border-t border-dashed border-rule-strong px-5 pt-9 pb-10 text-center md:px-6">
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.28em] text-text-muted">
          Connect
        </p>

        <ul className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {connect.map((l) => (
            <li key={l.name}>
              <SocialButton
                href={l.url}
                label={l.name}
                icon={l.icon}
                color={l.color}
                external={l.url.startsWith("http")}
              />
            </li>
          ))}
        </ul>

        <nav aria-label="Footer" className="mt-6">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {pages.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="group relative font-mono text-[0.78rem] text-text-muted transition-colors hover:text-text-primary"
                >
                  {p.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-text-primary transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <BackToTopKick />

        {/* closing lines: copyright, then where / when / which visitor */}
        <div className="mt-9 flex flex-col items-center gap-1.5 font-mono text-text-muted">
          <p className="text-[0.72rem]">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[0.68rem]">
            <span className="flex items-center gap-1.5">
              <span className="status-dot-glow live-pulse-dot h-1.5 w-1.5 rounded-full bg-status-active text-status-active" />
              {profile.location}
              <span className="text-text-ghost">·</span>
              <span className="tabular-nums">{time || " "}</span>
            </span>
            <span aria-hidden className="text-text-ghost">·</span>
            <VisitorCounter variant="sentence" />
          </div>
        </div>
      </div>
    </footer>
  );
}
