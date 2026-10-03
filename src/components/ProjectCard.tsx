"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { FaGithub } from "react-icons/fa6";
import { SiGooglegemini, SiRazorpay, SiScikitlearn, SiSocketdotio, SiSupabase } from "react-icons/si";
import { HiOutlineExternalLink } from "react-icons/hi";
import { skillGroups, technologies, tools } from "@/data/skills";
import type { ProjectData } from "@/data/projects";

// Card: preview on top, then name + status, a three-line description, the
// stack as overlapping icon circles (each opens to its name on hover) and
// 3D-surface Live / Source buttons. Hovering a card lifts it.

const ALIASES: Record<string, string> = {
  tailwind: "tailwind css",
  nextjs: "next.js",
  node: "node.js",
  "aws ec2": "aws",
  websockets: "socket.io",
};
const norm = (s: string) => ALIASES[s.toLowerCase()] ?? s.toLowerCase();
const ICONS = new Map<string, { icon: IconType; color: string }>([
  ...[...skillGroups.flatMap((g) => g.items), ...technologies, ...tools].map(
    (s) => [s.name.toLowerCase(), { icon: s.icon, color: s.color }] as const
  ),
  // stack names used by projects that the skills list doesn't carry
  ["scikit-learn", { icon: SiScikitlearn, color: "#F7931E" }],
  ["gemini api", { icon: SiGooglegemini, color: "#8E75B2" }],
  ["supabase", { icon: SiSupabase, color: "#3ECF8E" }],
  ["socket.io", { icon: SiSocketdotio, color: "currentColor" }],
  ["razorpay", { icon: SiRazorpay, color: "#0C2451" }],
]);

function TechCircle({ name }: { name: string }) {
  const hit = ICONS.get(norm(name));
  const Icon = hit?.icon;
  // fixed-size circle: hovering lifts it and shows the name in a tooltip
  // above, so nothing around it changes size (a widening pill used to re-wrap
  // the row, slide out from under the cursor and flicker)
  return (
    <span
      tabIndex={0}
      aria-label={name}
      className="group/tech relative -ml-2 inline-flex first:ml-0 hover:z-10 focus-visible:z-10 focus-visible:outline-none"
    >
      <span className="surface-3d grid size-7 place-items-center rounded-full border ring-2 ring-bg-primary transition-transform duration-200 ease-out group-hover/tech:-translate-y-0.5 group-focus-visible/tech:-translate-y-0.5 motion-reduce:transition-none">
        {Icon ? (
          <Icon size={14} className="text-text-primary" style={hit.color !== "currentColor" ? { color: hit.color } : undefined} />
        ) : (
          <span className="font-mono text-[0.55rem] font-semibold uppercase text-text-secondary">{name.slice(0, 2)}</span>
        )}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-text-display px-2 py-1 text-[0.66rem] font-medium leading-none text-bg-primary opacity-0 shadow-md transition-[opacity,transform] duration-150 group-hover/tech:translate-y-0 group-hover/tech:opacity-100 group-focus-visible/tech:translate-y-0 group-focus-visible/tech:opacity-100"
      >
        {name}
      </span>
    </span>
  );
}

const btn =
  "surface-3d btn-pop inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[0.72rem] font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-ghost focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary";

// `wide`: spans both grid columns (image left, text right) so a last, odd card
// fills its row instead of sitting alone beside an empty gap
export default function ProjectCard({ project, wide = false }: { project: ProjectData; wide?: boolean }) {
  const href = project.live ?? project.github;
  // in-progress / private are worth flagging; otherwise show what kind of
  // project it is (a "live" pill would only repeat the Live button)
  const status = project.isUnderDevelopment
    ? { label: "in progress", dot: "bg-status-future" }
    : project.isPrivate
      ? { label: "private", dot: "bg-text-dim" }
      : project.kind
        ? { label: project.kind, dot: "" }
        : null;

  return (
    <motion.article
      initial={{ y: 16 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="h-full"
    >
      <div
        className={`project-card group relative flex h-full flex-col overflow-hidden rounded-xl border border-rule-strong bg-bg-primary transition-[opacity,transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-border-hover hover:shadow-[0_16px_32px_-18px_rgb(0_0_0/0.45)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${wide ? "sm:flex-row" : ""}`}
      >
        {/* previews are exported at 1200×559 and always shown whole. In the wide
            card the preview floats, uncropped, in a padded panel beside the text */}
        <div
          className={`relative aspect-[1200/559] w-full shrink-0 overflow-hidden border-b border-rule-strong bg-bg-surface ${
            wide ? "sm:flex sm:aspect-auto sm:w-[56%] sm:items-center sm:border-b-0 sm:border-r sm:p-5" : ""
          }`}
        >
        <div
          className={`relative aspect-[1200/559] w-full overflow-hidden ${
            wide ? "sm:rounded-lg sm:border sm:border-rule-strong sm:shadow-[0_10px_28px_-14px_rgb(0_0_0/0.35)]" : ""
          }`}
        >
          {project.banner ? (
            <>
              <Image
                src={project.banner}
                alt={`${project.name} landing page`}
                fill
                unoptimized
                sizes="(min-width: 640px) 400px, 92vw"
                className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
                  project.bannerDark ? "dark:hidden" : ""
                }`}
              />
              {project.bannerDark && (
                <Image
                  src={project.bannerDark}
                  alt=""
                  aria-hidden
                  fill
                  unoptimized
                  sizes="(min-width: 640px) 400px, 92vw"
                  className="hidden object-cover transition-transform duration-500 group-hover:scale-[1.03] dark:block"
                />
              )}
            </>
          ) : (
            <div className="banner-placeholder grid h-full w-full place-items-center">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-text-ghost">preview</span>
            </div>
          )}

          {/* the whole preview is a link: live site, or the repo if there isn't one */}
          {href && (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={project.live ? `Visit ${project.name} live site` : `View ${project.name} source on GitHub`}
            className="group/visit absolute inset-0 z-10 flex items-end justify-end p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-text-ghost"
          >
            <span className="inline-flex translate-y-1 items-center gap-1.5 rounded-md bg-text-display px-2.5 py-1 text-[0.68rem] font-medium text-bg-primary opacity-0 shadow-lg transition-[opacity,transform] duration-200 group-hover/visit:translate-y-0 group-hover/visit:opacity-100 group-focus-visible/visit:translate-y-0 group-focus-visible/visit:opacity-100 motion-reduce:transition-none">
              {project.live ? "Visit site" : "View source"}
              <HiOutlineExternalLink size={12} />
            </span>
          </a>
          )}
        </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-[1.3rem] leading-tight text-text-display">{project.name}</h3>
              {project.stats && <p className="mt-0.5 font-mono text-[0.64rem] text-text-dim">{project.stats}</p>}
            </div>
            {status && (
              <span className="surface-3d inline-flex shrink-0 items-center gap-1.5 rounded-md border px-1.5 py-0.5 text-[0.62rem] font-medium text-text-secondary">
                {status.dot && <span aria-hidden className={`size-1.5 rounded-full ${status.dot}`} />}
                {status.label}
              </span>
            )}
          </div>

          <p className={`flex-1 text-[0.8rem] leading-[1.6] text-text-secondary ${wide ? "" : "line-clamp-3"}`}>{project.desc}</p>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-3 pt-1">
            <div className="flex items-center">
              {project.tech.map((t) => (
                <TechCircle key={t} name={t} />
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {project.live && (
                <a href={project.live} target="_blank" rel="noreferrer" className={btn}>
                  <HiOutlineExternalLink size={13} /> Live
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer" className={btn}>
                  <FaGithub size={13} /> Source
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
