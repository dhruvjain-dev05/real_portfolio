import Section from "./Section";
import { technologies, tools, type SkillItem } from "@/data/skills";

function MarqueeSet({ items, hidden }: { items: SkillItem[]; hidden?: boolean }) {
  return (
    <ul className="marquee-set" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item.name} className="shrink-0">
          <span className="group flex items-center gap-2 rounded-full border border-rule bg-bg-surface px-3.5 py-1.5 text-[0.82rem] text-text-secondary transition-colors hover:border-border-hover">
            <item.icon size={15} style={{ color: item.color }} className="shrink-0" />
            <span className="whitespace-nowrap transition-colors group-hover:text-text-primary">
              {item.name}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function MarqueeRow({
  label,
  items,
  direction,
  duration,
}: {
  label: string;
  items: SkillItem[];
  direction: "left" | "right";
  duration: number;
}) {
  return (
    <div>
      <p className="mb-4 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-text-ghost">
        {label}
      </p>

      <div className="marquee">
        <div
          className="marquee-track"
          style={{
            animation: `marquee-${direction} ${duration}s linear infinite`,
          }}
        >
          <MarqueeSet items={items} />
          <MarqueeSet items={items} hidden />
        </div>
      </div>
    </div>
  );
}

export default function SkillSection() {
  return (
    <Section index="01" kicker="Skills" title="Tools of the trade.">
      <div className="space-y-8">
        <MarqueeRow
          label="Languages & frameworks"
          items={technologies}
          direction="left"
          duration={16}
        />
        <MarqueeRow label="Tooling" items={tools} direction="right" duration={19} />
      </div>
    </Section>
  );
}
