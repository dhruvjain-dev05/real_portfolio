import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import VisitorPulse from "@/components/VisitorPulse";
import type { Metadata } from "next";

// placeholder until real analytics are wired up — keep it out of search results
export const metadata: Metadata = {
  robots: { index: false },
};

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
