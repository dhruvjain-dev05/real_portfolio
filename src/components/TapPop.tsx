"use client";

import { useEffect } from "react";

// Touch screens have no hover, so buttons never got their "pop" there. This
// plays it on a tap: the tapped .btn-pop gets data-pop for a moment (see
// globals.css), then eases back. Mouse users keep the real hover.
export default function TapPop() {
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      const el = (e.target as Element | null)?.closest?.(".btn-pop");
      if (!el) return;
      el.setAttribute("data-pop", "");
      window.setTimeout(() => el.removeAttribute("data-pop"), 450);
    };
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  return null;
}
