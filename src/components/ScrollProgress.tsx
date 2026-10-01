"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

// Page scroll progress. From sm up it rides the left dashed rail of the 800px
// column: the rail fills in solid as you scroll, a small dot marks where you
// are, and (on wide screens) a tiny percentage sits beside it. Below sm (no
// rails) it falls back to a hairline across the top.

const EDGE = 10; // px kept clear above/below the dot's travel

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });
  const top = useTransform(progress, (v) => `calc(${EDGE}px + (100% - ${EDGE * 2}px) * ${v})`);
  const pct = useTransform(progress, (v) => `${Math.round(v * 100)}%`);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 z-[61] hidden w-0 sm:block"
        style={{ left: "max(0px, calc(50% - 400px))" }}
      >
        <motion.span
          className="absolute -left-px top-0 h-full w-px origin-top bg-text-secondary/70"
          style={{ scaleY: progress }}
        />
        <motion.span
          className="absolute left-0 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-text-display ring-4 ring-bg-primary"
          style={{ top }}
        />
        <motion.span
          className="absolute right-3 hidden -translate-y-1/2 font-mono text-[0.58rem] tabular-nums text-text-dim min-[1000px]:block"
          style={{ top }}
        >
          {pct}
        </motion.span>
      </div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[61] h-[2px] origin-left bg-text-primary/70 sm:hidden"
        style={{ scaleX: progress }}
      />
    </>
  );
}
