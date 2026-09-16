"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const HOLD_MS = 2200;

// First paint always shows the full first phrase, already in place — same
// SSR-safety rule as the rest of this hero: nothing critical starts blank
// or mid-animation for slow JS, crawlers, or no-JS at all. AnimatePresence's
// `initial={false}` skips the enter transition for whatever's mounted on
// first render, so that first phrase never starts at opacity 0.
export default function RotatingRole({ roles, className }: { roles: string[]; className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (roles.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % roles.length);
    }, HOLD_MS);
    return () => clearInterval(id);
  }, [roles]);

  const currentRole = roles[index] ?? "";

  return (
    <p className={className}>
      <span className="sr-only">{roles.join(" — ")}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          aria-hidden="true"
          className="inline-block whitespace-nowrap"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.03,
              },
            },
            exit: {
              transition: {
                staggerChildren: 0.02,
                staggerDirection: -1,
              },
            },
          }}
        >
          {currentRole.split("").map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: 6 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.2, ease: "easeInOut" },
                },
                exit: {
                  opacity: 0,
                  y: -4,
                  transition: { duration: 0.15, ease: "easeInOut" },
                },
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </p>
  );
}
