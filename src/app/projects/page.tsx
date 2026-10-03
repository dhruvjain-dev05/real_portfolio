import Navbar from "@/components/Navbar";
import BackLink from "@/components/BackLink";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import { allProjects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[800px] flex-1 px-5 md:px-6">
        <BackLink />
        <Section index="01" kicker="Projects" title="Everything I've built.">
          <div className="project-grid grid gap-x-4 gap-y-6 sm:grid-cols-2">
            {allProjects.map((project, i, list) => (
              <div key={project.name} className={list.length % 2 === 1 && i === list.length - 1 ? "sm:col-span-2" : ""}>
                <ProjectCard project={project} wide={list.length % 2 === 1 && i === list.length - 1} />
              </div>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
