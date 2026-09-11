import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi";
import Section from "./Section";
import ProjectCard from "./ProjectCard";
import { featuredProjects } from "@/data/projects";

export default function ProjectsSection() {
  return (
    <Section index="04" kicker="Projects" title="Things I've shipped.">
      <div className="space-y-12">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>

      <Link
        href="/projects"
        className="group mt-10 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-primary"
      >
        <span className="border-b border-rule-strong pb-0.5 transition-colors group-hover:border-text-primary">
          All projects
        </span>
        <HiOutlineArrowRight className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </Section>
  );
}
