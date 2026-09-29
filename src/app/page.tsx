import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SkillSection from "@/components/SkillSection";
import ExperienceSection from "@/components/ExperienceSection";
import ActivitySection from "@/components/ActivitySection";
import ProjectsSection from "@/components/ProjectsSection";
import VelocityMarquee from "@/components/VelocityMarquee";
import DotField from "@/components/DotField";
import UsesTeaser from "@/components/UsesTeaser";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import KickoffIntro from "@/components/football/KickoffIntro";

export default function Home() {
  return (
    <>
      <KickoffIntro />
      <Navbar />
      <main className="mx-auto w-full max-w-[800px] flex-1 px-5 md:px-6">
        <HeroSection />
        <SkillSection />
        <ExperienceSection />
        <ActivitySection />
        <ProjectsSection />
        <VelocityMarquee />
        <div className="pb-10 md:pb-12">
          <DotField />
        </div>
        <UsesTeaser />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
