"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useAnimationControls,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

export default function Section({
  id,
  index,
  kicker,
  title,
  action,
  className = "",
  compact,
  children,
}: {
  id?: string;
  index?: string;
  kicker: string;
  title?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  // smaller heading and tighter gaps, for sections that should stay short
  compact?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  // index counts up from 00 as the section arrives — driven by motion values,
  // so no re-renders. Server HTML shows the final number.
  const target = Number(index) || 0;
  const count = useMotionValue(target);
  const countText = useTransform(count, (v) => String(Math.round(v)).padStart(index?.length ?? 2, "0"));
  const countOpacity = useMotionValue(1);

  // title words start visible (server HTML / slow JS), get tucked below their
  // mask once hydrated, then slide up when the section is in view
  const words = useAnimationControls();

  useEffect(() => {
    if (reduce) return;
    if (!inView) {
      count.set(0);
      countOpacity.set(0);
      words.set({ y: "110%" });
      return;
    }
    animate(count, target, { duration: 0.9, ease: "easeOut" });
    animate(countOpacity, 1, { duration: 0.5 });
    words.start((i: number) => ({
      y: 0,
      transition: { duration: 0.6, delay: 0.08 + i * 0.06, ease: [0.22, 1, 0.36, 1] },
    }));
  }, [inView, reduce, target, count, countOpacity, words]);

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`relative scroll-mt-24 -mx-5 border-t border-dashed border-rule-strong px-5 py-12 md:-mx-6 md:px-6 md:py-16 ${className}`}
      initial={{ y: 16 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* "+" where this section's rule crosses the dashed rails */}
      <span aria-hidden className="crosshair left-0" />
      <span aria-hidden className="crosshair left-full" />

      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="flex items-center gap-2.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-text-dim">
          {index && (
            <motion.span aria-hidden className="tabular-nums text-text-ghost" style={{ opacity: countOpacity }}>
              {countText}
            </motion.span>
          )}
          <span className="corner-brackets">{kicker}</span>
        </p>
        {action}
      </div>

      {title && (
        <h2
          aria-label={typeof title === "string" ? title : undefined}
          className={`font-display text-text-display ${
            compact ? "mb-4 text-[clamp(1.35rem,3vw,1.7rem)]" : "mb-6 text-[clamp(1.9rem,4.2vw,2.5rem)]"
          }`}
        >
          {typeof title === "string"
            ? title.split(" ").map((word, i) => (
                <span key={i} aria-hidden>
                  {i > 0 && " "}
                  <span className="-mb-[0.15em] inline-block overflow-hidden pb-[0.15em] align-bottom">
                    <motion.span className="inline-block" custom={i} animate={words} initial={false}>
                      {word}
                    </motion.span>
                  </span>
                </span>
              ))
            : title}
        </h2>
      )}

      {children}
    </motion.section>
  );
}
