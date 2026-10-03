import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi";
import Section from "./Section";
import ProjectCard from "./ProjectCard";
import { featuredProjects } from "@/data/projects";

export default function ProjectsSection() {
  return (
    <Section id="projects" index="02" kicker="Projects" title="Things I've shipped." compact className="!py-8 md:!py-10">
      <div className="project-grid grid gap-x-4 gap-y-6 sm:grid-cols-2">
        {featuredProjects.map((project, i, list) => (
          <div key={project.name} className={list.length % 2 === 1 && i === list.length - 1 ? "sm:col-span-2" : ""}>
            <ProjectCard project={project} wide={list.length % 2 === 1 && i === list.length - 1} />
          </div>
        ))}
      </div>

      <Link
        href="/projects"
        className="group mt-7 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-primary"
      >
        <span className="border-b border-rule-strong pb-0.5 transition-colors group-hover:border-text-primary">
          All projects
        </span>
        <HiOutlineArrowRight className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </Section>
  );
}
