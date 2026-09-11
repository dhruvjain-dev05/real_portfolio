"use client";

import { motion } from "framer-motion";

export default function Section({
  kicker,
  title,
  children,
}: {
  index?: string;
  kicker: string;
  title?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      className="border-t border-rule py-12 md:py-16"
      initial={{ y: 16 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <p className="mb-4 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-text-dim">
        <span className="corner-brackets">{kicker}</span>
      </p>

      {title && (
        <h2 className="mb-6 font-display text-[clamp(1.9rem,4.2vw,2.5rem)] text-text-display">
          {title}
        </h2>
      )}

      {children}
    </motion.section>
  );
}
