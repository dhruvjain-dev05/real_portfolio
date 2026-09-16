// Pulls real contribution data from GitHub's own public (no-auth) profile
// endpoint — the same HTML fragment GitHub renders on a user's profile page.
// This replaces what used to be a seeded-random fake calendar: if this
// fetch or parse fails for any reason, callers get `null` and must show an
// honest "unavailable" state rather than falling back to invented numbers.

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionMonthLabel {
  label: string;
  weekIdx: number;
}

export interface ContributionData {
  weeks: ContributionDay[][];
  months: ContributionMonthLabel[];
  total: number;
}

function parseContributionsHtml(html: string): { total: number; days: ContributionDay[] } | null {
  const totalMatch = html.match(/(\d[\d,]*)\s*\n\s*contributions/);
  if (!totalMatch) return null;
  const total = Number(totalMatch[1].replace(/,/g, ""));

  const tooltipMap = new Map<string, string>();
  const tooltipRe = /<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g;
  let tm: RegExpExecArray | null;
  while ((tm = tooltipRe.exec(html))) {
    tooltipMap.set(tm[1], tm[2].trim());
  }

  const days: ContributionDay[] = [];
  const tdRe = /<td([^>]*)>/g;
  let m: RegExpExecArray | null;
  while ((m = tdRe.exec(html))) {
    const attrs = m[1];
    if (!/class="ContributionCalendar-day"/.test(attrs)) continue;
    const date = attrs.match(/data-date="([\d-]+)"/)?.[1];
    const level = attrs.match(/data-level="(\d)"/)?.[1];
    const id = attrs.match(/\bid="([^"]+)"/)?.[1];
    if (!date || level === undefined || !id) continue;

    const tooltip = tooltipMap.get(id) ?? "";
    const countMatch = tooltip.match(/^(\d[\d,]*)/);
    const count = countMatch ? Number(countMatch[1].replace(/,/g, "")) : 0;

    days.push({ date, level: Number(level) as ContributionDay["level"], count });
  }

  if (days.length === 0) return null;

  days.sort((a, b) => a.date.localeCompare(b.date));
  return { total, days };
}

function toWeeksAndMonths(days: ContributionDay[]) {
  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const months: ContributionMonthLabel[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const firstDay = new Date(`${week[0].date}T00:00:00Z`);
    const month = firstDay.getUTCMonth();
    if (month !== lastMonth) {
      months.push({
        label: firstDay.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
        weekIdx: wi,
      });
      lastMonth = month;
    }
  });

  return { weeks, months };
}

export async function getContributionData(username: string): Promise<ContributionData | null> {
  try {
    const res = await fetch(`https://github.com/users/${username}/contributions`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; personal-portfolio-build)" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const html = await res.text();
    const parsed = parseContributionsHtml(html);
    if (!parsed) return null;

    const { weeks, months } = toWeeksAndMonths(parsed.days);
    return { weeks, months, total: parsed.total };
  } catch {
    return null;
  }
}
