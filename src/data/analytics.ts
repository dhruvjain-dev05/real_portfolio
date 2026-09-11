export type AnalyticsPeriod = "24h" | "7d" | "30d";

export interface AnalyticsSeriesPoint {
  label: string;
  weekday: string;
  visitors: number;
  pageviews: number;
}

export const analyticsPeriods: { value: AnalyticsPeriod; label: string }[] = [
  { value: "24h", label: "24H" },
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateSeries(period: AnalyticsPeriod): AnalyticsSeriesPoint[] {
  const points = period === "24h" ? 12 : period === "7d" ? 7 : 30;
  const now = Date.now();
  const stepMs = period === "24h" ? 2 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

  return Array.from({ length: points }, (_, i) => {
    const t = new Date(now - (points - 1 - i) * stepMs);
    const seed = t.getDate() + t.getMonth() * 31 + i;
    const visitors = Math.round(20 + seededRandom(seed) * 30);
    const pageviews = Math.round(visitors * (1.8 + seededRandom(seed + 1) * 1.2));

    const label =
      period === "24h"
        ? t.toLocaleTimeString("en-US", { hour: "2-digit" })
        : t.toLocaleDateString("en-US", { day: "numeric", month: "short" });
    const weekday = t.toLocaleDateString("en-US", { weekday: "short" });

    return { label, weekday, visitors, pageviews };
  });
}

export function summarize(series: AnalyticsSeriesPoint[]) {
  const visitors = series.reduce((s, p) => s + p.visitors, 0);
  const pageviews = series.reduce((s, p) => s + p.pageviews, 0);
  return { visitors, pageviews };
}

export function trendDelta(series: AnalyticsSeriesPoint[], key: "visitors" | "pageviews") {
  if (series.length < 2) return 0;
  const mid = Math.floor(series.length / 2);
  const firstHalf = series.slice(0, mid).reduce((s, p) => s + p[key], 0) / mid;
  const secondHalf = series.slice(mid).reduce((s, p) => s + p[key], 0) / (series.length - mid);
  if (firstHalf === 0) return 0;
  return Math.round(((secondHalf - firstHalf) / firstHalf) * 100);
}
