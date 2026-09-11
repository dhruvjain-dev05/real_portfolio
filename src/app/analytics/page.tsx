import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import VisitorPulse from "@/components/VisitorPulse";

export default function AnalyticsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[800px] flex-1 px-5 md:px-6">
        <Section index="01" kicker="Analytics" title="Who stops by.">
          <VisitorPulse />
        </Section>
      </main>
      <Footer />
    </>
  );
}
