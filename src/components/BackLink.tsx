import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";

// "← Back" at the top-left of the standalone pages (Projects, Resume) — always
// to the home page, so it works even when someone lands here from a shared link.
export default function BackLink() {
  return (
    <Link
      href="/"
      className="group my-3 inline-flex items-center gap-1.5 py-2 font-mono text-[0.74rem] text-text-muted transition-colors hover:text-text-primary"
    >
      <HiArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
      Back
    </Link>
  );
}
