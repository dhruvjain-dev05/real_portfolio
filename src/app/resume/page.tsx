import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import { profile } from "@/data/profile";
import { HiOutlineDocumentDownload } from "react-icons/hi";

export default function ResumePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[800px] flex-1 px-5 md:px-6">
        <Section index="01" kicker="Resume" title="The short version.">
          <p className="max-w-[52ch] text-[0.95rem] leading-[1.75] text-text-secondary">
            Drop your PDF at{" "}
            <code className="font-mono text-[0.85rem] text-text-primary">
              public{profile.resumeUrl}
            </code>{" "}
            and it will be served here.
          </p>

          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="group mt-6 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            <HiOutlineDocumentDownload />
            <span className="border-b border-rule-strong pb-0.5 transition-colors group-hover:border-text-primary">
              Download resume
            </span>
          </a>
        </Section>
      </main>
      <Footer />
    </>
  );
}
