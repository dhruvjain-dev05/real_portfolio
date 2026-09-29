"use client";

import { useEffect, useRef } from "react";

// A faint dot grid behind the content column that only shows near the
// cursor. The pointer position goes into CSS variables on the element, so
// moving the mouse never triggers a React render. While the cursor is idle
// or away, a slow CSS-only drifting patch of the grid takes over.
export default function DotSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const ambient = ambientRef.current;
    if (!el || !ambient) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let idle: ReturnType<typeof setTimeout> | undefined;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--gx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--gy", `${e.clientY - rect.top}px`);
      el.style.opacity = "1";
      ambient.style.opacity = "0";
      clearTimeout(idle);
      idle = setTimeout(() => (ambient.style.opacity = ""), 3000);
    };
    const onLeave = () => {
      el.style.opacity = "0";
      ambient.style.opacity = "";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      clearTimeout(idle);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={ambientRef} aria-hidden className="dot-ambient" />
      <div ref={ref} aria-hidden className="dot-spotlight" />
    </>
  );
}
