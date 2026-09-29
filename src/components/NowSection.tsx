import Section from "./Section";
import { now } from "@/data/now";

export default function NowSection() {
  return (
    <Section
      id="now"
      index="01"
      kicker="Now"
      title="Currently."
      action={
        <span className="font-mono text-[0.65rem] text-text-dim">updated {now.updated}</span>
      }
    >
      <ul className="grid overflow-hidden rounded-xl ring-1 ring-rule sm:grid-cols-3">
        {now.items.map((item, i) => (
          <li
            key={item.label}
            className={`bg-bg-surface-subtle p-5 ${
              i > 0 ? "border-t border-rule sm:border-t-0 sm:border-l" : ""
            }`}
          >
            <p className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-text-dim">
              {item.live && (
                <span
                  className="live-pulse-dot h-1.5 w-1.5 rounded-full bg-status-active"
                  style={{ color: "var(--status-active)" }}
                  aria-hidden
                />
              )}
              {item.label}
            </p>
            <p className="mt-3 text-[0.88rem] leading-[1.65] text-text-secondary">{item.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
