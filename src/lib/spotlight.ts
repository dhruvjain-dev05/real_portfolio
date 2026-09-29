import type { MouseEvent } from "react";

// Writes the pointer position into the card's --mx/--my custom properties;
// the .spotlight::before glow in globals.css reads them. Plain CSS vars
// instead of React state, so moving the mouse never re-renders anything.
export function spotlightMove(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
}
