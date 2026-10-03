"use client";

import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import type { ContributionData } from "@/lib/githubContributions";

// Contribution calendar: flush with the section's edges — the first week's
// column starts at the left border, the last week's ends at the right one, and
// the month labels sit on the same grid. Grey dots (white in dark mode).

const LEVEL_COLORS = [
  "var(--cal-level-0)",
  "var(--cal-level-1)",
  "var(--cal-level-2)",
  "var(--cal-level-3)",
  "var(--cal-level-4)",
];

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export default function ContributionCalendar({
  data,
  username,
}: {
  data: ContributionData | null;
  username: string;
}) {
  const [hovered, setHovered] = useState<{ date: string; count: number; x: number; y: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const seen = useInView(gridRef, { once: true, margin: "-60px" });

  // real GitHub data failed to load — an honest gap beats a fake graph
  if (!data) {
    return (
      <p className="font-mono text-[0.75rem] text-text-dim">
        Couldn&apos;t load live activity from GitHub right now —{" "}
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-text-ghost underline-offset-2 transition-colors hover:text-text-primary"
        >
          see it directly on GitHub
        </a>
        .
      </p>
    );
  }

  const { weeks, months, total, year } = data;
  const n = weeks.length;
  // drop month labels that would collide with the next one or run past the
  // right edge (a partial month at either end of the year)
  const labels = months.filter((m, i) => {
    const next = months[i + 1];
    return m.weekIdx <= n - 3 && (!next || next.weekIdx - m.weekIdx >= 3);
  });
  const columns = { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` };

  return (
    <div>
      <div
        ref={gridRef}
        data-in={seen}
        className="cal-wave relative"
        onMouseLeave={() => setHovered(null)}
      >
        <div className="mb-1.5 grid gap-[3px] font-mono text-[0.62rem] leading-none text-text-dim" style={columns}>
          {labels.map((m) => (
            <span key={m.weekIdx} className="whitespace-nowrap" style={{ gridColumnStart: m.weekIdx + 1 }}>
              {m.label}
            </span>
          ))}
        </div>

        <div className="grid gap-[3px]" style={columns}>
          {weeks.map((week, wi) => (
            <div key={wi} className="grid content-start gap-[3px]">
              {week.map((day, di) =>
                !day ? (
                  <div key={di} className="aspect-square w-full" />
                ) : (
                <div
                  key={di}
                  className="cal-cell aspect-square w-full cursor-pointer rounded-[2px] transition-transform duration-150 ease-out hover:z-10 hover:scale-[1.5] hover:ring-1 hover:ring-text-primary/60"
                  style={{ backgroundColor: LEVEL_COLORS[day.level], ["--w" as string]: wi, ["--d" as string]: di }}
                  onMouseEnter={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    const half = 110;
                    setHovered({
                      date: fmt(day.date),
                      count: day.count,
                      x: Math.min(Math.max(r.left + r.width / 2, half), window.innerWidth - half),
                      y: r.top,
                    });
                  }}
                />
                )
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[0.68rem] text-text-dim">
        <p>
          <span className="text-text-primary">{total}</span> contributions in {year}
        </p>
        <div className="flex items-center gap-1">
          <span>Less</span>
          {LEVEL_COLORS.map((c, i) => (
            <span key={i} className="size-[10px] rounded-[2px]" style={{ backgroundColor: c }} />
          ))}
          <span>More</span>
        </div>
      </div>

      {hovered && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 whitespace-nowrap rounded-md border border-border-default bg-bg-surface-elevated px-2.5 py-1.5 text-[0.7rem] text-text-secondary shadow-lg"
          style={{ left: hovered.x, top: hovered.y - 40 }}
        >
          <span className="font-semibold text-text-primary">{hovered.count === 0 ? "No" : hovered.count}</span>{" "}
          contribution{hovered.count === 1 ? "" : "s"} · {hovered.date}
        </div>
      )}
    </div>
  );
}
