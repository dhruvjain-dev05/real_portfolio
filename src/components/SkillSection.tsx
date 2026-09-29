"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import { skillGroups, type SkillItem } from "@/data/skills";
import { spotlightMove } from "@/lib/spotlight";

const ALL = "All";
const allItems = skillGroups.flatMap((g) => g.items);
const tabs = [{ label: ALL, items: allItems }, ...skillGroups];

// Tiles never mount/unmount or reflow — every skill stays in place and the
// selected category simply "lights up" while the rest recede. No layout
// shift, so the page can't jump under the cursor when switching tabs.
function SkillTile({
  item,
  lit,
  order,
}: {
  item: SkillItem;
  lit: boolean;
  order: number;
}) {
  return (
    <motion.li
      initial={false}
      animate={{
        opacity: lit ? 1 : 0.28,
        scale: lit ? 1 : 0.96,
        filter: lit ? "grayscale(0)" : "grayscale(1)",
      }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
        delay: lit ? order * 0.025 : 0,
      }}
      style={{ pointerEvents: lit ? "auto" : "none" }}
    >
      <motion.div
        onMouseMove={spotlightMove}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="spotlight relative flex items-center gap-2.5 rounded-xl border border-dashed border-rule-strong bg-bg-surface px-3.5 py-2.5 text-text-primary transition-colors hover:border-solid hover:border-text-ghost"
      >
        <span className="relative z-[2] grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-bg-primary ring-1 ring-rule">
          <item.icon size={15} style={{ color: item.color }} />
        </span>
        <span className="relative z-[2] whitespace-nowrap text-[0.83rem] text-text-secondary">
          {item.name}
        </span>
      </motion.div>
    </motion.li>
  );
}

export default function SkillSection() {
  const [active, setActive] = useState(ALL);

  return (
    <Section id="stack" index="01" kicker="Skills" title="Tools of the trade.">
      <div
        role="tablist"
        aria-label="Skill categories"
        className="no-scrollbar flex items-center gap-1 overflow-x-auto rounded-xl border border-dashed border-rule-strong p-1"
      >
        {tabs.map((tab) => {
          const selected = tab.label === active;
          return (
            <button
              key={tab.label}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(tab.label)}
              className={`relative shrink-0 rounded-lg px-3 py-1.5 text-[0.8rem] transition-colors ${
                selected ? "text-text-display" : "text-text-muted hover:text-text-primary"
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="skill-tab"
                  className="absolute inset-0 rounded-lg bg-bg-surface-elevated ring-1 ring-rule-strong"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative">{tab.label}</span>
              <span className="relative ml-1.5 font-mono text-[0.6rem] text-text-dim">
                {tab.items.length}
              </span>
            </button>
          );
        })}
      </div>

      <ul className="mt-4 flex flex-wrap content-start gap-2.5">
        {skillGroups.flatMap((g) =>
          g.items.map((item) => {
            const lit = active === ALL || active === g.label;
            const order = lit ? g.items.indexOf(item) : 0;
            return <SkillTile key={`${g.label}-${item.name}`} item={item} lit={lit} order={order} />;
          })
        )}
      </ul>
    </Section>
  );
}
