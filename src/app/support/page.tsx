import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import { HiOutlineArrowRight } from "react-icons/hi";

export default function SupportPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[800px] flex-1 px-5 md:px-6">
        <Section index="01" kicker="Support" title="Back the work.">
          <p className="max-w-[52ch] text-[0.95rem] leading-[1.75] text-text-secondary">
            If something I&apos;ve built has saved you time, you can support the work — it goes
            straight back into building and maintaining more of it.
          </p>

          <a
            href="https://github.com/sponsors/yourusername"
            target="_blank"
            rel="noreferrer"
            className="group mt-6 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            <span className="border-b border-rule-strong pb-0.5 transition-colors group-hover:border-text-primary">
              Sponsor on GitHub
            </span>
            <HiOutlineArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </Section>
      </main>
      <Footer />
    </>
  );
}
