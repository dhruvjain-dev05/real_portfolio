import Section from "./Section";
import { experience } from "@/data/experience";
import { HiOutlineExternalLink } from "react-icons/hi";

const statusColor = {
  present: "var(--status-active)",
  past: "var(--status-past)",
  future: "var(--status-future)",
};

export default function ExperienceSection() {
  return (
    <Section index="02" kicker="Experience" title="Where I've worked.">
      <div className="space-y-8">
        {experience.map((entry, i) => (
          <div
            key={entry.company}
            className={i > 0 ? "border-t border-rule pt-8" : undefined}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="flex items-center gap-2.5 font-display text-[1.35rem] text-text-display">
                <span
                  className="status-dot-glow h-[7px] w-[7px] shrink-0 rounded-full"
                  style={{ backgroundColor: statusColor[entry.status], color: statusColor[entry.status] }}
                />
                {entry.company}
                {entry.companyUrl && (
                  <a
                    href={entry.companyUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${entry.company} website`}
                    className="text-text-ghost transition-colors hover:text-text-primary"
                  >
                    <HiOutlineExternalLink size={14} />
                  </a>
                )}
              </h3>
              <span className="font-mono text-[0.7rem] text-text-dim">{entry.dates}</span>
            </div>

            <p className="mt-1 text-[0.85rem] text-text-muted">{entry.role}</p>

            <ul className="mt-3.5 space-y-2">
              {entry.description.map((d, j) => (
                <li key={j} className="flex gap-3 text-[0.9rem] leading-[1.7] text-text-secondary">
                  <span className="mt-[0.72em] h-[3px] w-[3px] shrink-0 rounded-full bg-text-ghost" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
