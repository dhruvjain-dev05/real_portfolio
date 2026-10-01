import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import { allProjects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[800px] flex-1 px-5 md:px-6">
        <Section index="01" kicker="Projects" title="Everything I've built.">
          <div className="project-grid grid auto-rows-fr gap-4 sm:grid-cols-2">
            {allProjects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
