import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi";
import Section from "./Section";

export default function UsesTeaser() {
  return (
    <Section index="05" kicker="Uses">
      <p className="max-w-[52ch] text-[0.95rem] leading-[1.75] text-text-secondary">
        Curious about my setup? The editor, terminal, gear and software I reach for every day.
      </p>

      <Link
        href="/uses"
        className="group mt-5 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-primary"
      >
        <span className="border-b border-rule-strong pb-0.5 transition-colors group-hover:border-text-primary">
          See my setup
        </span>
        <HiOutlineArrowRight className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </Section>
  );
}
