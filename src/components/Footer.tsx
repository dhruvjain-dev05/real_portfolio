"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import BackToTopKick from "@/components/football/BackToTopKick";
import Magnetic from "@/components/Magnetic";
import VisitorCounter from "@/components/VisitorCounter";
import { profile } from "@/data/profile";
import { socialLinks } from "@/data/socialLinks";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

const pages = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
  { href: "/analytics", label: "Analytics" },
  { href: "/support", label: "Support" },
  { href: "/uses", label: "Uses" },
];

const connect = socialLinks;

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
      <div className="flex flex-col items-center border-t border-dashed border-rule-strong px-5 pt-10 text-center md:px-6">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-text-dim">
          Connect
        </p>

        <TooltipProvider delayDuration={150}>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            {connect.map((l) => (
              <li key={l.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={l.url}
                      target={l.url.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      aria-label={l.name}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-dashed border-rule-strong bg-bg-surface text-text-muted transition-colors duration-200 hover:border-solid hover:border-text-ghost hover:text-text-primary"
                    >
                      <Magnetic strength={7} className="grid place-items-center">
                        <l.icon size={17} />
                      </Magnetic>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>{l.name}</TooltipContent>
                </Tooltip>
              </li>
            ))}
          </ul>
        </TooltipProvider>

        <nav aria-label="Footer" className="mt-8">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {pages.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="group relative font-mono text-[0.72rem] text-text-muted transition-colors hover:text-text-primary"
                >
                  {p.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-text-primary transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 flex flex-col items-center gap-1.5 font-mono text-[0.75rem] text-text-muted">
          <p className="flex items-center gap-2">
            <span className="status-dot-glow live-pulse-dot h-1.5 w-1.5 rounded-full bg-status-active text-status-active" />
            <span className="text-text-primary">{profile.location}</span>
            <span className="text-text-ghost">·</span>
            <span className="tabular-nums">{time || " "}</span>
          </p>
          <div className="text-text-muted">
            <VisitorCounter />
          </div>
        </div>

        <BackToTopKick />

        <p className="mt-8 font-mono text-[0.68rem] text-text-dim">
          Designed &amp; developed by{" "}
          <span className="text-text-primary">{profile.name}</span> · ©{" "}
          {new Date().getFullYear()}
        </p>
      </div>

      {/* oversized wordmark, fading into the page */}
      <MotionConfig reducedMotion="user">
        <motion.p
          aria-hidden
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none mt-6 select-none text-center font-display text-[clamp(5rem,26vw,11rem)] leading-[0.8] text-text-display"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.16), transparent 88%)",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.16), transparent 88%)",
          }}
        >
          {profile.brandName}
        </motion.p>
      </MotionConfig>
    </footer>
  );
}
