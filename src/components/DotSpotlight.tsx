"use client";

import { useEffect, useRef } from "react";

// A faint dot grid behind the content column that only shows near the
// cursor. The pointer position goes into CSS variables on the element, so
// moving the mouse never triggers a React render.
export default function DotSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--gx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--gy", `${e.clientY - rect.top}px`);
      el.style.opacity = "1";
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} aria-hidden className="dot-spotlight" />;
}
