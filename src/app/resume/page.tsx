import Navbar from "@/components/Navbar";
import BackLink from "@/components/BackLink";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import { profile } from "@/data/profile";
import { HiOutlineDocumentDownload, HiOutlineExternalLink } from "react-icons/hi";

const btn =
  "surface-3d btn-pop inline-flex items-center gap-2 rounded-md border px-3.5 py-1.5 text-[0.78rem] font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-ghost focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary";

export default function ResumePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[800px] flex-1 px-5 md:px-6">
        <BackLink />
        <Section index="01" kicker="Resume" title="The short version.">
          <div className="flex flex-wrap items-center gap-2">
            <a href={profile.resumeUrl} download="Dhruv-Jain-Resume.pdf" className={btn}>
              <HiOutlineDocumentDownload size={15} />
              Download resume
            </a>
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className={btn}>
              <HiOutlineExternalLink size={15} />
              Open in new tab
            </a>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-rule-strong bg-bg-surface">
            <object
              data={`${profile.resumeUrl}#toolbar=0&navpanes=0`}
              type="application/pdf"
              aria-label="Resume preview"
              className="block h-[70vh] min-h-[28rem] w-full"
            >
              <p className="p-6 text-[0.85rem] text-text-secondary">
                Your browser can&apos;t preview PDFs here —{" "}
                <a href={profile.resumeUrl} download="Dhruv-Jain-Resume.pdf" className="underline underline-offset-4">
                  download the resume
                </a>{" "}
                instead.
              </p>
            </object>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
