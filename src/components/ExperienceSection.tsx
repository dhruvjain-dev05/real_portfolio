"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";
import type { IconType } from "react-icons";
import { FaAws } from "react-icons/fa6";
import { TbApi } from "react-icons/tb";
import {
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiJavascript,
  SiVite,
  SiVercel,
  SiGithubactions,
  SiPm2,
  SiGit,
  SiPython,
} from "react-icons/si";
import Section from "./Section";
import { experience } from "@/data/experience";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

// Real brand colours, except marks that are black/near-black in their
// official form (Express, Vercel) — those follow the theme's text colour so
// they stay visible in both modes.
const techMeta: Record<string, { icon?: IconType; color?: string; letter?: string }> = {
  "React.js": { icon: SiReact, color: "#61DAFB" },
  "Node.js": { icon: SiNodedotjs, color: "#5FA04E" },
  "Express.js": { icon: SiExpress },
  PostgreSQL: { icon: SiPostgresql, color: "#4169E1" },
  JavaScript: { icon: SiJavascript, color: "#F7DF1E" },
  Vite: { icon: SiVite, color: "#8B7CFF" },
  "REST APIs": { icon: TbApi, color: "#F97316" },
  "AWS EC2": { icon: FaAws, color: "#FF9900" },
  Vercel: { icon: SiVercel },
  "GitHub Actions": { icon: SiGithubactions, color: "#2088FF" },
  PM2: { icon: SiPm2, color: "#7C6BFF" },
  // Tally has no public brand mark in the icon set — a monogram tile instead
  "Tally Prime XML API": { letter: "T", color: "#D9412B" },
  Git: { icon: SiGit, color: "#F05032" },
  Python: { icon: SiPython, color: "#3776AB" },
};

const statusStyle = {
  present: "border-status-active/30 bg-status-active/10 text-text-primary",
  past: "border-rule bg-bg-surface text-text-muted",
  future: "border-status-future/30 bg-status-future/10 text-text-primary",
};
const statusDot = {
  present: "bg-status-active text-status-active status-dot-glow",
  past: "bg-status-past",
  future: "bg-status-future",
};

export default function ExperienceSection() {
  // which entries have their full list of work showing; the first point of
  // each is always visible, so nothing important depends on a click
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <Section id="experience" index="01" kicker="Experience" title="Where I've worked." compact className="!py-8 md:!py-10">
      <TooltipProvider delayDuration={150}>
        <div className="space-y-8">
          {experience.map((entry, i) => (
            <motion.article
              key={entry.company}
              initial={{ y: 14 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className={i > 0 ? "border-t border-dashed border-rule-strong pt-8" : ""}
            >
              <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-white p-1.5 ring-1 ring-rule">
                    {entry.logoUrl ? (
                      <Image
                        src={entry.logoUrl}
                        alt={`${entry.company} logo`}
                        width={96}
                        height={96}
                        unoptimized
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="font-display text-xl text-neutral-700">
                        {entry.company.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-display text-[1.45rem] leading-none text-text-display">
                        {entry.company}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[0.68rem] font-medium ${statusStyle[entry.status]}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusDot[entry.status]}`} />
                        {entry.statusLabel}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[0.85rem] text-text-muted">{entry.role}</p>
                  </div>
                </div>

                <div className="space-y-0.5 font-mono text-[0.7rem] text-text-dim sm:text-right">
                  <p>{entry.dates}</p>
                  <p>{entry.location}</p>
                </div>
              </header>

              <div className="mt-4 border-t border-dashed border-rule-strong pt-4">
                <h4 className="text-[0.85rem] font-semibold text-text-display">
                  Technologies &amp; Tools
                </h4>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {entry.tech.map((name) => {
                    const meta = techMeta[name];
                    if (!meta) return null;
                    const Icon = meta.icon;
                    return (
                      <li key={name}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              tabIndex={0}
                              aria-label={name}
                              className="grid h-9 w-9 cursor-default place-items-center rounded-lg border border-dashed border-rule-strong bg-bg-surface text-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-solid hover:border-text-ghost focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text-muted"
                              style={meta.color ? { color: meta.color } : undefined}
                            >
                              {Icon ? (
                                <Icon size={17} />
                              ) : (
                                <span className="font-mono text-[0.8rem] font-bold">{meta.letter}</span>
                              )}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>{name}</TooltipContent>
                        </Tooltip>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-4">
                <h4 className="text-[0.85rem] font-semibold text-text-display">What I&apos;ve done</h4>
                {(() => {
                  const isOpen = !!open[entry.company];
                  const [first, ...rest] = entry.description;
                  const point = (d: string, j: number) => (
                    <li key={j} className="flex gap-3 text-[0.88rem] leading-[1.65] text-text-secondary">
                      <span className="mt-[0.72em] h-[3px] w-[3px] shrink-0 rounded-full bg-text-ghost" />
                      {d}
                    </li>
                  );
                  return (
                    <>
                      <ul className="mt-2.5">{point(first, 0)}</ul>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <ul className="space-y-2 pt-2">{rest.map((d, j) => point(d, j + 1))}</ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {rest.length > 0 && (
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpen((o) => ({ ...o, [entry.company]: !isOpen }))}
                          className="group/more mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-rule-strong px-3 py-1 font-mono text-[0.68rem] text-text-muted transition-colors hover:border-solid hover:border-text-ghost hover:text-text-primary"
                        >
                          {isOpen ? "Show less" : `Show ${rest.length} more`}
                          <HiChevronDown
                            size={13}
                            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "group-hover/more:translate-y-0.5"}`}
                          />
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            </motion.article>
          ))}
        </div>
      </TooltipProvider>
    </Section>
  );
}
