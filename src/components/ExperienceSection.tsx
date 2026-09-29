"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Section from "./Section";
import { experience } from "@/data/experience";
import { HiOutlineExternalLink } from "react-icons/hi";

const statusColor = {
  present: "var(--status-active)",
  past: "var(--status-past)",
  future: "var(--status-future)",
};

export default function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 0 → 1 as the timeline moves from just entering view to just leaving —
  // this is a real reflection of scroll position, not a fixed-duration
  // animation, so it can't drift out of sync with what's on screen.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.3"],
  });
  const fillScale = useTransform(scrollYProgress, [0, 1], [0, 1], { clamp: true });
  const tipTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"], { clamp: true });

  return (
    <Section id="experience" index="02" kicker="Experience" title="Where I've worked.">
      <div ref={containerRef} className="relative pl-6">
        {/* static track */}
        <div className="absolute top-1.5 bottom-1.5 left-[3px] w-px bg-rule" aria-hidden />
        {/* fills downward with real scroll progress, not a timed animation */}
        <motion.div
          className="absolute top-1.5 left-[3px] w-px origin-top bg-status-active"
          style={{ bottom: "1.5px", scaleY: fillScale }}
          aria-hidden
        />
        {/* glowing tip marking exactly how far through the timeline you are */}
        <motion.div
          className="live-pulse-dot absolute left-[3px] h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-status-active"
          style={{ top: tipTop, color: "var(--status-active)" }}
          aria-hidden
        />

        <div className="space-y-8">
          {experience.map((entry, i) => (
            <div
              key={entry.company}
              className={`relative ${i > 0 ? "border-t border-rule pt-8" : ""}`}
            >
              {/* left-[-21px]: this dot sits inside an entry div that's already
                  shifted right by the container's own pl-6 (24px), so it needs
                  the inverse offset to land back on the rail at true x=3px —
                  using left-[3px] here (as if a direct child of the rail
                  container) put it 24px too far right, right on top of the
                  heading text instead of in the gutter beside it */}
              <span
                className="status-dot-glow absolute top-[0.6em] left-[-21px] h-[7px] w-[7px] -translate-x-1/2 rounded-full"
                style={{ backgroundColor: statusColor[entry.status], color: statusColor[entry.status] }}
                aria-hidden
              />

              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="flex items-center gap-2.5 font-display text-[1.35rem] text-text-display">
                  {entry.company}
                  {entry.companyUrl && (
                    <a
                      href={entry.companyUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${entry.company} website`}
                      className="text-text-ghost transition-colors hover:text-text-primary"
                    >
                      <HiOutlineExternalLink size={14} />
                    </a>
                  )}
                </h3>
                <span className="font-mono text-[0.7rem] text-text-dim">{entry.dates}</span>
              </div>

              <p className="mt-1 text-[0.85rem] text-text-muted">{entry.role}</p>

              <ul className="mt-3.5 space-y-2">
                {entry.description.map((d, j) => (
                  <li key={j} className="flex gap-3 text-[0.9rem] leading-[1.7] text-text-secondary">
                    <span className="mt-[0.72em] h-[3px] w-[3px] shrink-0 rounded-full bg-text-ghost" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
