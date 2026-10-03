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

const MOBILE_WEEKS = 26;

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
  // starts the reveal ~300px before the calendar scrolls into view, so it is
  // already drawn (or nearly) by the time you get there
  const seen = useInView(gridRef, { once: true, margin: "0px 0px 300px 0px" });

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
  // Phones show the last MOBILE_WEEKS weeks up to today instead of the whole
  // year, so each square is big enough to read as a square (all 53 columns at
  // phone width shrink them to dots). From `sm` up, the full year as before.
  const today = new Date().toISOString().slice(0, 10);
  let current = 0;
  weeks.forEach((w, wi) => {
    if (w.some((d) => d && d.date <= today)) current = wi;
  });
  const start = Math.max(0, Math.min(current - MOBILE_WEEKS + 1, n - MOBILE_WEEKS));
  const onPhone = (wi: number) => wi >= start && wi < start + MOBILE_WEEKS;
  const columns = {
    "--n": n,
    "--m": Math.min(n, MOBILE_WEEKS),
  } as React.CSSProperties;
  const gridCols =
    "[grid-template-columns:repeat(var(--m),minmax(0,1fr))] sm:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]";

  return (
    <div>
      <div
        ref={gridRef}
        data-in={seen}
        className="cal-wave relative"
        onMouseLeave={() => setHovered(null)}
      >
        <div className={`mb-1.5 grid gap-[3px] font-mono text-[0.62rem] leading-none text-text-dim ${gridCols}`} style={columns}>
          {labels.map((m) => (
            <span
              key={m.weekIdx}
              className={`whitespace-nowrap [grid-column-start:var(--ms)] sm:[grid-column-start:var(--s)] ${
                onPhone(m.weekIdx) && m.weekIdx <= start + MOBILE_WEEKS - 3 ? "" : "max-sm:hidden"
              }`}
              style={{ "--s": m.weekIdx + 1, "--ms": m.weekIdx - start + 1 } as React.CSSProperties}
            >
              {m.label}
            </span>
          ))}
        </div>

        <div className={`grid gap-[3px] ${gridCols}`} style={columns}>
          {weeks.map((week, wi) => (
            <div key={wi} className={`grid content-start gap-[3px] ${onPhone(wi) ? "" : "max-sm:hidden"}`}>
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
