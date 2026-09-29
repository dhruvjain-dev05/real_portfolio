"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// Page scroll progress. From sm up it fills the left dashed rail of the 800px
// column top-to-bottom; below sm (no rails) it falls back to a top hairline.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 left-[max(0px,calc(50%-400px))] z-[61] hidden w-px origin-top bg-text-primary/60 sm:block"
        style={{ scaleY: progress }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[61] h-[2px] origin-left bg-text-primary/70 sm:hidden"
        style={{ scaleX: progress }}
      />
    </>
  );
}
