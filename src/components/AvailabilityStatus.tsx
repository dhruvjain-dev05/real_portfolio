"use client";

import { useEffect, useState } from "react";

// Working window in IST (Asia/Kolkata, fixed UTC+5:30).
const START_HOUR = 10;
const END_HOUR = 19;

function istHour(date: Date) {
  const h = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    hour12: false,
    timeZone: "Asia/Kolkata",
  }).format(date);
  return Number(h) % 24;
}

export default function AvailabilityStatus() {
  // empty until mount so server HTML never embeds a time-dependent value
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => {
      const h = istHour(new Date());
      setOnline(h >= START_HOUR && h < END_HOUR);
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  if (online === null) return <div className="h-7" aria-hidden />;

  return (
    <p className="inline-flex items-center gap-2 rounded-full bg-bg-surface-subtle px-3 py-1.5 font-mono text-[0.68rem] text-text-muted ring-1 ring-rule">
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${
          online ? "live-pulse-dot bg-status-active" : "bg-text-ghost"
        }`}
      />
      {online
        ? "Online now — usually replies within a few hours"
        : `Away — back around ${START_HOUR}:00 IST`}
    </p>
  );
}
