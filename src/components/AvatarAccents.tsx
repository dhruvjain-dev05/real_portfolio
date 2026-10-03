"use client";

import { useEffect, useRef, useState } from "react";
import { SHEET, size } from "@/components/football/sprite";

// Two quiet extras for the avatar frame (its parent must be `relative` and
// carry the `group/avatar` class):
//  · a sun / moon badge on the bottom-right corner — the current theme, and
//    a click switches it (through the same event the pull-cord listens to)
//  · a tiny pixel Messi who peeks over the top edge while the frame is hovered
const { w: PW, h: PH } = size(38);

export default function AvatarAccents() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [peek, setPeek] = useState(false);

  // touch screens can't hover: tapping the photo makes Messi pop up for a moment
  useEffect(() => {
    const frame = wrapRef.current?.closest<HTMLElement>(".avatar-frame");
    if (!frame) return;
    let timer: ReturnType<typeof setTimeout>;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      if ((e.target as Element | null)?.closest("button")) return; // the theme badge
      setPeek(true);
      frame.setAttribute("data-peek", "");
      clearTimeout(timer);
      timer = setTimeout(() => {
        setPeek(false);
        frame.removeAttribute("data-peek");
      }, 2600);
    };
    frame.addEventListener("pointerdown", onDown);
    return () => {
      clearTimeout(timer);
      frame.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <>
      <div ref={wrapRef} aria-hidden className="pointer-events-none absolute -top-[25px] left-4 overflow-hidden" style={{ width: PW, height: 26 }}>
        <div
          className={`avatar-peek transition-transform duration-[380ms] ease-[cubic-bezier(0.34,1.5,0.64,1)] group-hover/avatar:translate-y-0 ${
            peek ? "translate-y-0" : "translate-y-full"
          }`}
          style={
            {
              width: PW,
              height: PH,
              backgroundImage: `url(${SHEET})`,
              backgroundSize: `${PW * 13}px ${PH}px`,
              backgroundRepeat: "no-repeat",
              "--pw": `${PW}px`,
            } as React.CSSProperties
          }
        />
      </div>

      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event("jyora:toggle-theme"))}
        aria-label="Toggle light / dark theme"
        title="Toggle theme (T)"
        className="group/badge absolute -bottom-1.5 -right-1.5 grid h-[26px] w-[26px] place-items-center rounded-full bg-bg-primary text-text-secondary shadow-sm ring-1 ring-rule-strong transition-[transform,color] duration-200 hover:scale-105 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-faint"
      >
        {/* sun (light) */}
        <svg
          viewBox="0 0 16 16"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          className="absolute transition-all duration-500 ease-out group-hover/badge:rotate-45 dark:-rotate-90 dark:scale-0 dark:opacity-0"
          aria-hidden
        >
          <circle cx="8" cy="8" r="2.9" />
          <path d="M8 1.6v1.6M8 12.8v1.6M1.6 8h1.6M12.8 8h1.6M3.5 3.5l1.1 1.1M11.4 11.4l1.1 1.1M3.5 12.5l1.1-1.1M11.4 4.6l1.1-1.1" />
        </svg>
        {/* moon (dark) */}
        <svg
          viewBox="0 0 16 16"
          width="13"
          height="13"
          className="absolute -rotate-90 scale-0 opacity-0 transition-all duration-500 ease-out dark:rotate-0 dark:scale-100 dark:opacity-100"
          aria-hidden
        >
          <path d="M12.6 10.2A5.4 5.4 0 0 1 5.8 3.4a.4.4 0 0 0-.55-.45A6 6 0 1 0 13.05 10.75a.4.4 0 0 0-.45-.55z" fill="currentColor" />
          <circle cx="11.6" cy="3.6" r="0.9" fill="currentColor" className="animate-pulse" />
        </svg>
      </button>
    </>
  );
}
