"use client";

import { useMemo, useState } from "react";

const LEVEL_COLORS = [
  "var(--cal-level-0)",
  "var(--cal-level-1)",
  "var(--cal-level-2)",
  "var(--cal-level-3)",
  "var(--cal-level-4)",
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function levelFor(count: number) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

export default function ContributionCalendar({ weeks = 52 }: { weeks?: number }) {
  const [hovered, setHovered] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  const { grid, total, months } = useMemo(() => {
    const today = new Date();
    const days: { date: Date; count: number }[] = [];
    const totalDays = weeks * 7;

    for (let i = totalDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const seed = date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();
      const r = seededRandom(seed);
      const count = r > 0.35 ? Math.floor(r * 12) : 0;
      days.push({ date, count });
    }

    const grid: { date: Date; count: number }[][] = [];
    for (let w = 0; w < weeks; w++) {
      grid.push(days.slice(w * 7, w * 7 + 7));
    }

    const monthLabels: { label: string; weekIdx: number }[] = [];
    let lastMonth = -1;
    grid.forEach((week, wi) => {
      const firstDay = week[0].date;
      if (firstDay.getMonth() !== lastMonth) {
        monthLabels.push({ label: firstDay.toLocaleDateString("en-US", { month: "short" }), weekIdx: wi });
        lastMonth = firstDay.getMonth();
      }
    });

    const total = days.reduce((sum, d) => sum + d.count, 0);

    return { grid, total, months: monthLabels };
  }, [weeks]);

  // one shared column grid (one column per week) drives both the month-label
  // row and the day cells below, so both always stay aligned and both
  // stretch fluidly to fill the full container width — no fixed pixel math.
  // 10px minimum keeps cells legible; below that the grid overflows into
  // the horizontal scroll container instead of shrinking further.
  const columnsStyle = { gridTemplateColumns: `repeat(${weeks}, minmax(10px, 1fr))` };

  return (
    <div>
      {/* labels and grid scroll together — required once the 10px-per-cell
          floor is hit on narrow screens (52 weeks won't fit otherwise) */}
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
          {grid.map((week, wi) => (
            <div key={wi} className="grid gap-[3px]" style={{ gridColumnStart: wi + 1 }}>
              {week.map((day, di) => (
                <div
                  key={di}
                  className="aspect-square w-full cursor-pointer rounded-[2px]"
                  style={{ backgroundColor: LEVEL_COLORS[levelFor(day.count)] }}
                  onMouseEnter={(e) => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                    setHovered({
                      date: day.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
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
