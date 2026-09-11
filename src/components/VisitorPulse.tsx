"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, ResponsiveContainer } from "recharts";
import { generateSeries, summarize, trendDelta, type AnalyticsSeriesPoint } from "@/data/analytics";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

// warm amber — matches the Java/AWS skill icons rather than a cool
// teal/dashboard blue, and stays legible on both the dark and light theme
const ACCENT = "#d97706";
const DOWN = "#e2725b";

// amber-tinted (not the neutral grey the GitHub calendar uses above it) so
// this reads as a different kind of tracking, not a duplicate of it
const DAY_LEVELS = [
  "rgba(217, 119, 6, 0.1)",
  "rgba(217, 119, 6, 0.25)",
  "rgba(217, 119, 6, 0.45)",
  "rgba(217, 119, 6, 0.68)",
  "rgba(217, 119, 6, 0.95)",
];

function levelFor(value: number, min: number, max: number) {
  if (max === min) return 2;
  const t = (value - min) / (max - min);
  return Math.min(4, Math.floor(t * 5));
}

function DayStrip({ series }: { series: AnalyticsSeriesPoint[] }) {
  const values = series.map((p) => p.visitors);
  const min = Math.min(...values);
  const max = Math.max(...values);

  return (
    <div>
      <p className="mb-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-text-ghost">
        This week, day by day
      </p>
      <TooltipProvider delayDuration={150}>
        <div className="flex gap-1.5">
          {series.map((point, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div className="flex-1">
                  <div
                    className="h-7 rounded-[3px] transition-transform hover:scale-y-110"
                    style={{ backgroundColor: DAY_LEVELS[levelFor(point.visitors, min, max)] }}
                  />
                  <p className="mt-1.5 text-center font-mono text-[0.6rem] text-text-ghost">
                    {point.weekday.charAt(0)}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {point.weekday}: {point.visitors} visitors
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}

export default function VisitorPulse() {
  // fixed to a week — no dashboard-style period selector here, this is a
  // small detail, not a control panel
  const series = useMemo(() => generateSeries("7d"), []);
  const { visitors } = useMemo(() => summarize(series), [series]);
  const delta = useMemo(() => trendDelta(series, "visitors"), [series]);
  const positive = delta >= 0;
  const color = positive ? ACCENT : DOWN;

  return (
    <div>
      <p className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-text-ghost">
        <span
          className="live-pulse-dot h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "var(--status-active)", color: "var(--status-active)" }}
        />
        People who&apos;ve stopped by
      </p>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <div className="flex items-baseline gap-2.5">
          <span className="font-display text-[3.2rem] leading-none text-text-display">
            {visitors.toLocaleString()}
          </span>
          <span className="text-[0.85rem] text-text-muted">visitors this week</span>
        </div>
        <p className="text-[0.8rem]" style={{ color }}>
          {positive ? "↑" : "↓"} {Math.abs(delta)}% {positive ? "more" : "fewer"} than last week
        </p>
      </div>

      <div className="mt-6 h-28 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="visitorFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT} stopOpacity={0.32} />
                <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval={0}
              dy={8}
              tick={{ fill: "#8a8a86", fontSize: 10 }}
            />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke={ACCENT}
              strokeWidth={2}
              fill="url(#visitorFade)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <DayStrip series={series} />
      </div>
    </div>
  );
}
