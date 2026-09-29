"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="mx-auto w-full max-w-[800px] pb-14">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-dashed border-rule-strong px-5 pt-8 md:px-6">
        <p className="font-display text-[0.95rem] italic text-text-muted">
          Nothing is perfect — but you can make it better.
        </p>
        <p className="font-mono text-[0.65rem] text-text-ghost">
          {new Date().getFullYear()} — {time}
        </p>
      </div>
    </footer>
  );
}
