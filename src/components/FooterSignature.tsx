"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { profile } from "@/data/profile";

// The footer's sign-off: the "Jyora" wordmark written out like a signature —
// it is revealed left to right with a pen-stroke flourish under it when the
// footer scrolls into view. (The nav's name popover calls the name "the closest
// thing I have to a signature", so this closes the loop.)
export default function FooterSignature() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const show = inView || !!reduce;

  return (
    <div ref={ref} aria-label={profile.brandName} className="mb-8 flex flex-col items-center">
      <motion.span
        aria-hidden
        className="font-display text-[3.4rem] italic leading-none text-text-display sm:text-[4.2rem]"
        initial={{ clipPath: "inset(-15% 115% -15% -15%)" }}
        animate={{ clipPath: show ? "inset(-15% -8% -15% -15%)" : "inset(-15% 115% -15% -15%)" }}
        transition={{ duration: reduce ? 0 : 1.6, ease: [0.45, 0, 0.25, 1] }}
      >
        {profile.brandName}
      </motion.span>
      <svg aria-hidden viewBox="0 0 200 12" className="-mt-1 h-3 w-40 text-text-muted" fill="none">
        <motion.path
          d="M2 8 C 40 2, 90 11, 130 5 S 185 4, 198 6"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: show ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 1.4, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}
