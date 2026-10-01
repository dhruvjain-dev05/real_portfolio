import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SkillSection from "@/components/SkillSection";
import ExperienceSection from "@/components/ExperienceSection";
import ActivitySection from "@/components/ActivitySection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SectionIndex from "@/components/SectionIndex";
import KickoffIntro from "@/components/football/KickoffIntro";

export default function Home() {
  return (
    <>
      <KickoffIntro />
      <SectionIndex />
      <Navbar />
      <main className="mx-auto w-full max-w-[800px] flex-1 px-5 md:px-6">
        <HeroSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillSection />
        <ActivitySection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
