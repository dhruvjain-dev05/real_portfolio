"use client";

import { useEffect, useState } from "react";

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function dayOfYearLabel() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayIndex = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000) + 1;
  const totalDays = isLeapYear(now.getFullYear()) ? 366 : 365;
  return `Day ${dayIndex} of ${totalDays}`;
}

// A quiet second layer on the banner: hover (or tap) reveals today's real,
// ever-changing position in the year — nothing invented, just the same
// honest "live" instinct as the rest of this hero, hidden inside the one
// visual on the page that's already a metaphor for moving forward.
//
// Hover is plain CSS (group-hover), independent of any React state, so it
// can never race with the tap handler below it — a mixed hover+click
// state toggle here previously caused touch taps to open and immediately
// re-close within the same event (the synthetic mouseenter a tap fires
// flipped the state before the click handler's own toggle ran).
export default function BannerDayMarker() {
  const [label, setLabel] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const update = () => setLabel(dayOfYearLabel());
    update();
  }, []);

  if (!label) return null;

  return (
    <button
      type="button"
      onClick={() => setPinned((p) => !p)}
      aria-label="How far through the year it is, today"
      className="group absolute right-2.5 bottom-2.5 z-10 h-8 w-11 sm:right-3 sm:bottom-3"
    >
      <span
        className={`absolute right-0 bottom-0 block rounded-md bg-black/60 px-2.5 py-1 font-mono text-[0.68rem] whitespace-nowrap text-white/90 backdrop-blur-sm transition-opacity duration-200 ${
          pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
