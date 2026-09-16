"use client";

import { useState } from "react";
import type { ContributionData } from "@/lib/githubContributions";

const LEVEL_COLORS = [
  "var(--cal-level-0)",
  "var(--cal-level-1)",
  "var(--cal-level-2)",
  "var(--cal-level-3)",
  "var(--cal-level-4)",
];

function formatDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function ContributionCalendar({
  data,
  username,
}: {
  data: ContributionData | null;
  username: string;
}) {
  const [hovered, setHovered] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

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

  const { weeks, months, total } = data;
  const weekCount = weeks.length;

  // one shared column grid (one column per week) drives both the month-label
  // row and the day cells below, so both always stay aligned and both
  // stretch fluidly to fill the full container width — no fixed pixel math.
  // 10px minimum keeps cells legible; below that the grid overflows into
  // the horizontal scroll container instead of shrinking further.
  const columnsStyle = { gridTemplateColumns: `repeat(${weekCount}, minmax(10px, 1fr))` };

  return (
    <div>
      {/* labels and grid scroll together — required once the 10px-per-cell
          floor is hit on narrow screens */}
      <div className="overflow-x-auto">
        <div
          className="mb-1.5 grid font-mono text-[0.62rem] text-text-dim"
          style={columnsStyle}
        >
          {months.map((m, i) => (
            <span
              key={i}
              className="whitespace-nowrap"
              style={{ gridColumnStart: m.weekIdx + 1 }}
            >
              {m.label}
            </span>
          ))}
        </div>

        <div className="relative grid gap-[3px]" style={columnsStyle}>
          {weeks.map((week, wi) => (
            <div key={wi} className="grid gap-[3px]" style={{ gridColumnStart: wi + 1 }}>
              {week.map((day, di) => (
                <div
                  key={di}
                  className="aspect-square w-full cursor-pointer rounded-[2px]"
                  style={{ backgroundColor: LEVEL_COLORS[day.level] }}
                  onMouseEnter={(e) => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                    setHovered({
                      date: formatDate(day.date),
                      count: day.count,
                      x: rect.left,
                      y: rect.top,
                    });
                  }}
                  onMouseLeave={() => setHovered(null)}
                />
              ))}
            </div>
          ))}

          {hovered && (
            <div
              className="pointer-events-none fixed z-50 rounded-md border border-border-default bg-bg-surface-elevated px-2 py-1 text-[0.7rem] whitespace-nowrap text-text-secondary shadow-lg"
              style={{ left: hovered.x, top: hovered.y - 36 }}
            >
              <span className="font-semibold text-text-primary">{hovered.count}</span>{" "}
              contributions on {hovered.date}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[0.68rem] text-text-dim">
        <p>
          <span className="text-text-primary">{total}</span> contributions this year
        </p>
        <div className="flex items-center gap-1">
          <span>Less</span>
          {LEVEL_COLORS.map((c, i) => (
            <span key={i} className="h-[10px] w-[10px] rounded-[2px]" style={{ backgroundColor: c }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
