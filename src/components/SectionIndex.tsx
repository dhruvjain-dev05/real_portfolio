"use client";

import { useEffect, useState } from "react";

// A quiet index on the right edge of the page — the counterpart of the
// train's rail on the left. Numbers only; the active one lengthens its tick
// and the name of the section appears on hover. Wide screens only.
const SECTIONS = [
  { id: "now", n: "00", label: "Intro" },
  { id: "experience", n: "01", label: "Experience" },
  { id: "projects", n: "02", label: "Projects" },
  { id: "stack", n: "03", label: "Skills" },
  { id: "activity", n: "04", label: "Activity" },
  { id: "contact", n: "05", label: "Contact" },
];

export default function SectionIndex() {
  const [active, setActive] = useState("now");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    // a section is "current" while it crosses a band around the viewport's middle
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-42% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    // the last section can't always reach the middle band: pin it at the bottom
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) setActive("contact");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const go = (id: string) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Sections"
      className="fixed top-1/2 z-[61] hidden -translate-y-1/2 flex-col gap-3 min-[1100px]:flex"
      style={{ left: "calc(50% + 400px + 24px)" }}
    >
      {SECTIONS.map((s) => {
        const on = s.id === active;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => go(s.id)}
            aria-label={s.label}
            aria-current={on ? "true" : undefined}
            className="group flex items-center gap-2 text-left outline-none"
          >
            <span
              className={`h-px bg-current transition-all duration-300 ${
                on ? "w-5 text-text-primary" : "w-2.5 text-text-ghost group-hover:w-4 group-hover:text-text-muted"
              }`}
            />
            <span
              className={`font-mono text-[0.6rem] tabular-nums transition-colors duration-300 ${
                on ? "text-text-primary" : "text-text-ghost group-hover:text-text-muted"
              }`}
            >
              {s.n}
            </span>
            <span className="max-w-0 overflow-hidden whitespace-nowrap font-mono text-[0.6rem] text-text-dim opacity-0 transition-all duration-300 group-hover:max-w-24 group-hover:opacity-100 group-focus-visible:max-w-24 group-focus-visible:opacity-100">
              {s.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
