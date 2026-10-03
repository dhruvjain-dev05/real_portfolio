"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import BackToTopKick from "@/components/football/BackToTopKick";
import FooterSignature from "@/components/FooterSignature";
import VisitorCounter from "@/components/VisitorCounter";
import { profile } from "@/data/profile";

const pages = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
];

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
        <FooterSignature />

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {pages.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="group -my-2.5 block py-2.5 font-mono text-[0.78rem] text-text-muted transition-colors hover:text-text-primary sm:my-0 sm:py-0"
                >
                  {/* taller tap area on phones (padding cancelled by margin), same look */}
                  <span className="relative">
                    {p.label}
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-text-primary transition-transform duration-300 group-hover:scale-x-100" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <BackToTopKick />

        {/* closing lines: copyright, then where / when */}
        <div className="mt-9 flex flex-col items-center gap-1.5 font-mono text-text-muted">
          <p className="text-[0.72rem]">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <span className="flex items-center gap-1.5 text-[0.68rem]">
            <span className="status-dot-glow live-pulse-dot h-1.5 w-1.5 rounded-full bg-status-active text-status-active" />
            {profile.location}
            <span className="text-text-ghost">·</span>
            <span className="tabular-nums">{time || " "}</span>
          </span>
        </div>

        {/* the very last line, centred on its own: one soft fade-up when it
            scrolls in, nothing else moving */}
        <motion.div
          className="mt-6 flex min-h-5 justify-center"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <VisitorCounter variant="sentence" className="text-[0.82rem] font-medium text-text-secondary" />
        </motion.div>
      </div>
    </footer>
  );
}
