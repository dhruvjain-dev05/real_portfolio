"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaGithub } from "react-icons/fa6";
import { HiOutlineExternalLink } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import type { ProjectData } from "@/data/projects";

export default function ProjectCard({ project }: { project: ProjectData }) {
  return (
    <motion.article
      initial={{ y: 16 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="group"
    >
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-bg-surface ring-1 ring-rule"
      >
        {project.banner ? (
          <Image
            src={project.banner}
            alt={project.name}
            fill
            unoptimized
            sizes="700px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="banner-placeholder grid h-full w-full place-items-center">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-text-ghost">
              preview
            </span>
          </div>
        )}
      </motion.div>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h3 className="flex items-center gap-2.5 font-display text-[1.4rem] text-text-display">
          {project.name}
          {project.stats && (
            <span className="font-mono text-[0.65rem] font-normal text-text-dim">
              {project.stats}
            </span>
          )}
          {project.isUnderDevelopment && (
            <span className="font-mono text-[0.65rem] font-normal text-status-future">
              in progress
            </span>
          )}
        </h3>

        <div className="flex items-center gap-4 text-[0.8rem]">
          {project.live && (
            <Button asChild variant="link" size="sm">
              <a href={project.live} target="_blank" rel="noreferrer">
                <HiOutlineExternalLink size={13} /> Live
              </a>
            </Button>
          )}
          <Button asChild variant="link" size="sm">
            <a href={project.github} target="_blank" rel="noreferrer">
              <FaGithub size={13} /> Source
            </a>
          </Button>
        </div>
      </div>

      <p className="mt-2 max-w-[54ch] text-[0.9rem] leading-[1.7] text-text-secondary">
        {project.desc}
      </p>

      <p className="mt-3 font-mono text-[0.68rem] text-text-dim">
        {project.tech.join("  ·  ")}
      </p>
    </motion.article>
  );
}
