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
  // Sunday-first columns; the first/last week of the year are padded with
  // null so every row is the same weekday, exactly as on github.com
  weeks: (ContributionDay | null)[][];
  year: number;
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
  const weeks: (ContributionDay | null)[][] = [];
  let week: (ContributionDay | null)[] = [];
  const dow = (iso: string) => new Date(`${iso}T00:00:00Z`).getUTCDay();
  for (let i = 0; i < dow(days[0].date); i++) week.push(null);
  for (const d of days) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  // a month's label sits over the week that holds its 1st (and Jan/first week)
  const months: ContributionMonthLabel[] = [];
  weeks.forEach((w, wi) => {
    const first = w.find((d) => d && d.date.endsWith("-01")) ?? (wi === 0 ? w.find(Boolean) : null);
    if (!first) return;
    const label = new Date(`${first.date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
    if (months[months.length - 1]?.label !== label) months.push({ label, weekIdx: wi });
  });

  return { weeks, months };
}

// The calendar year (Jan–Dec), like the GitHub profile page: days that haven't
// happened yet come back as empty cells.
export async function getContributionData(username: string): Promise<ContributionData | null> {
  try {
    const year = new Date().getUTCFullYear();
    const res = await fetch(`https://github.com/users/${username}/contributions?from=${year}-01-01&to=${year}-12-31`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; personal-portfolio-build)" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const html = await res.text();
    const parsed = parseContributionsHtml(html);
    if (!parsed) return null;

    const { weeks, months } = toWeeksAndMonths(parsed.days);
    return { weeks, months, total: parsed.total, year };
  } catch {
    return null;
  }
}
