"use client";

import { motion } from "framer-motion";

export default function Section({
  id,
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
  return (
    <motion.section
      id={id}
      className={`scroll-mt-24 -mx-5 border-t border-dashed border-rule-strong px-5 py-12 md:-mx-6 md:px-6 md:py-16 ${className}`}
      initial={{ y: 16 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-text-dim">
          <span className="corner-brackets">{kicker}</span>
        </p>
        {action}
      </div>

      {title && (
        <h2
          className={`font-display text-text-display ${
            compact ? "mb-4 text-[clamp(1.35rem,3vw,1.7rem)]" : "mb-6 text-[clamp(1.9rem,4.2vw,2.5rem)]"
          }`}
        >
          {title}
        </h2>
      )}

      {children}
    </motion.section>
  );
}
